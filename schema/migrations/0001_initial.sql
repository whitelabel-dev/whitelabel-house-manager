-- whitelabel-house-manager — migration 0001 (initial)
-- Schema is shared with whitelabel-office-manager. Residential vs commercial
-- differences live in the system_type enum + items.category.
--
-- Run order:
--   psql $DATABASE_URL -f migrations/0001_initial.sql

create schema if not exists house;
set search_path = house, public;

-- ── enums ──────────────────────────────────────────────────────────────────

create type place_kind as enum ('home', 'office', 'rental', 'site');

create type system_kind as enum (
  'hvac', 'sprinkler', 'lights', 'security', 'appliance',
  'pool', 'garage', 'energy', 'water',
  -- office-only:
  'internet', 'printer', 'conference_room', 'kitchen'
);

create type vendor_role as enum (
  'plumber', 'hvac', 'electrician', 'appliance_repair',
  'cleaning', 'pool_service', 'lawn', 'pest',
  'handyman', 'av', 'it_support', 'mail', 'snack_delivery',
  'other'
);

create type ticket_origin as enum (
  'anomaly',      -- Plane A → Plane B (e.g., AC failing)
  'schedule',     -- Recurring service (e.g., weekly maid)
  'consumption',  -- Plane D → reorder (e.g., shampoo low)
  'compliance',   -- Office Plane C (e.g., insurance renewal)
  'manual'        -- Human-created
);

create type ticket_status as enum (
  'open', 'assigned', 'scheduled', 'on_site',
  'completed', 'paid', 'cancelled'
);

create type item_category as enum (
  'consumable',   -- shampoo, dog food, paper towels — has level/quantity
  'durable',      -- furniture, appliance, electronics — has warranty/service
  'valuable'      -- jewelry, art, documents — insurance docs
);

-- ── core tables ────────────────────────────────────────────────────────────

create table places (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null,
  kind          place_kind not null,
  name          text not null,
  address       text,
  world_model_id uuid,  -- pointer into whitelabel-3d models
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index on places (account_id);

-- ── Plane A: systems ──────────────────────────────────────────────────────

create table systems (
  id            uuid primary key default gen_random_uuid(),
  place_id      uuid not null references places(id),
  kind          system_kind not null,
  name          text not null,        -- "Living-room HVAC", "Front sprinkler zone"
  manufacturer  text,
  model_number  text,
  install_date  date,
  warranty_until date,
  -- Spatial coordinates in the place's 3D world model
  room          text,
  x_m           numeric,
  y_m           numeric,
  z_m           numeric,
  metadata      jsonb not null default '{}',  -- per-system: API id, sensor ids, etc.
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index on systems (place_id);
create index on systems (kind);

create table system_telemetry (
  id            bigserial primary key,
  system_id     uuid not null references systems(id),
  recorded_at   timestamptz not null default now(),
  metric        text not null,        -- "setpoint_c", "actual_c", "runtime_min", "flow_lpm"
  value_num     numeric,
  value_text    text,
  is_anomaly    boolean not null default false
);

create index on system_telemetry (system_id, recorded_at desc);
create index on system_telemetry (is_anomaly) where is_anomaly = true;

-- ── Plane B: vendors ──────────────────────────────────────────────────────

create table vendors (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null,
  role          vendor_role not null,
  business_name text not null,
  contact_name  text,
  phone         text,
  email         text,
  website       text,
  hourly_rate   numeric(10, 2),
  flat_rate     numeric(10, 2),
  preferred     boolean not null default false,
  -- Aggregates updated by trigger from vendor_tickets:
  jobs_count    int not null default 0,
  response_avg_min int,
  rating        numeric(2, 1),  -- 0.0–5.0
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index on vendors (account_id, role);
create index on vendors (preferred) where preferred = true;

-- Recurring service contracts (e.g., weekly maid, monthly pool, quarterly pest)
create table vendor_contracts (
  id            uuid primary key default gen_random_uuid(),
  vendor_id     uuid not null references vendors(id),
  place_id      uuid not null references places(id),
  cadence       text not null,  -- 'weekly', 'biweekly', 'monthly', 'quarterly', 'annual'
  scope         text not null,  -- "Full house cleaning, 4hrs", "Pool chemistry + skim"
  rate          numeric(10, 2),
  active        boolean not null default true,
  next_service  timestamptz,
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index on vendor_contracts (place_id, active);
create index on vendor_contracts (next_service) where active = true;

-- ── tickets — the dispatch loop core ──────────────────────────────────────

create table tickets (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null,
  place_id      uuid not null references places(id),
  origin        ticket_origin not null,
  status        ticket_status not null default 'open',
  -- What triggered this ticket:
  system_id     uuid references systems(id),            -- if origin='anomaly'
  contract_id   uuid references vendor_contracts(id),   -- if origin='schedule'
  item_id       uuid references items(id) deferrable initially deferred,  -- if origin='consumption'
  -- Who's on it:
  vendor_id     uuid references vendors(id),
  -- Human-readable:
  title         text not null,
  description   text,
  priority      int not null default 3,  -- 1 (urgent) – 5 (whenever)
  -- Money:
  estimated_cost numeric(10, 2),
  actual_cost   numeric(10, 2),
  -- Time:
  opened_at     timestamptz not null default now(),
  scheduled_at  timestamptz,
  resolved_at   timestamptz,
  -- Free-form:
  metadata      jsonb not null default '{}',
  deleted_at    timestamptz
);

create index on tickets (place_id, status);
create index on tickets (vendor_id) where vendor_id is not null;
create index on tickets (status) where status in ('open', 'assigned', 'scheduled');
create index on tickets (origin);

-- Every state change is an event row — full audit history
create table ticket_events (
  id            bigserial primary key,
  ticket_id     uuid not null references tickets(id),
  event_type    text not null,        -- 'opened', 'matched', 'assigned', 'scheduled', 'on_site', 'completed', 'invoiced', 'paid'
  actor         text,                 -- 'system', 'agent', 'human:garrett', 'vendor:smith-plumbing'
  payload       jsonb not null default '{}',
  occurred_at   timestamptz not null default now()
);

create index on ticket_events (ticket_id, occurred_at);

-- ── Plane D: items (belongings) ───────────────────────────────────────────

create table items (
  id            uuid primary key default gen_random_uuid(),
  place_id      uuid not null references places(id),
  category      item_category not null,
  name          text not null,        -- "Aesop Resurrection hand wash"
  brand         text,
  upc           text,                 -- barcode for re-scan ID
  -- Spatial location in the 3D world model:
  room          text not null,        -- "master_bathroom"
  shelf         text,                 -- "shower / left shelf"
  x_m           numeric,
  y_m           numeric,
  z_m           numeric,
  -- For consumables:
  current_level numeric,              -- 0.0–1.0 fraction full, OR integer count
  level_unit    text,                 -- 'fraction', 'count', 'oz', 'kg', 'sheets'
  reorder_threshold numeric,          -- when to fire restock ticket
  reorder_source text,                -- 'amazon_subscribe', 'partner_api', 'manual'
  reorder_quantity int,
  -- For durables:
  purchase_date date,
  purchase_price numeric(10, 2),
  warranty_until date,
  -- For valuables:
  insurance_value numeric(12, 2),
  photo_url     text,
  -- Metadata:
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index on items (place_id, category);
create index on items (room);
create index on items (current_level, reorder_threshold)
  where category = 'consumable' and deleted_at is null;

-- Consumption history → predicts run-out + triggers reorder
create table item_consumption (
  id            bigserial primary key,
  item_id       uuid not null references items(id),
  recorded_at   timestamptz not null default now(),
  level         numeric not null,
  source        text not null  -- 'manual', 'smart_shelf', 'purchase_inference', 'photo_vision'
);

create index on item_consumption (item_id, recorded_at desc);

-- ── service_history — denormalized timeline of every event at a place ─────

create table service_history (
  id            bigserial primary key,
  place_id      uuid not null references places(id),
  occurred_at   timestamptz not null default now(),
  category      text not null,  -- 'system_service', 'vendor_visit', 'item_purchase', 'item_restock', 'anomaly_resolved'
  summary       text not null,
  ticket_id     uuid references tickets(id),
  vendor_id     uuid references vendors(id),
  system_id     uuid references systems(id),
  item_id       uuid references items(id),
  cost          numeric(10, 2),
  metadata      jsonb not null default '{}'
);

create index on service_history (place_id, occurred_at desc);
create index on service_history (category);

-- ── row-level security stubs ──────────────────────────────────────────────
-- (Real policies in policies/, this file just enables RLS so no
-- accidentally-public data leaks if someone forgets to add them.)

alter table places            enable row level security;
alter table systems           enable row level security;
alter table system_telemetry  enable row level security;
alter table vendors           enable row level security;
alter table vendor_contracts  enable row level security;
alter table tickets           enable row level security;
alter table ticket_events     enable row level security;
alter table items             enable row level security;
alter table item_consumption  enable row level security;
alter table service_history   enable row level security;

comment on schema house is 'whitelabel-house-manager + whitelabel-office-manager shared schema. RLS enabled on every table; policies in policies/.';
