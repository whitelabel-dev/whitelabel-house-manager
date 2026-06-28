# Schema

Postgres / Supabase tables for whitelabel-house-manager.

**Shared with [whitelabel-office-manager](https://github.com/whitelabel-dev/whitelabel-office-manager)** — same dispatch engine, same vendor model, same ticket model. The only divergence is in the *system* domain (residential vs commercial systems differ) and Plane C (business-ops glue, office-only).

## How to run

```sh
# Against a local Supabase project
psql $DATABASE_URL -f migrations/0001_initial.sql

# Or via Supabase Management API
curl -X POST \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$(cat migrations/0001_initial.sql | jq -Rsa .)\"}" \
  https://api.supabase.com/v1/projects/$PROJECT_REF/database/query
```

## Schema files

- [`migrations/0001_initial.sql`](migrations/0001_initial.sql) — places, systems, vendors, tickets, service_history, items
- More migrations added per-version as the schema evolves

## Entity-relationship summary

```
places (homes / offices / sites)
  │
  ├── systems   (HVAC, sprinklers, lights, security, appliances, pool, etc.)
  │     │
  │     └── system_telemetry  (sensor readings, anomaly detection input)
  │
  ├── items     (Plane D — belongings, consumables, durables, valuables)
  │     │
  │     └── item_consumption  (level history → restock triggers)
  │
  ├── tickets   (work orders — anomaly-, schedule-, or consumption-driven)
  │     │
  │     └── ticket_events  (open, assigned, scheduled, on-site, completed, paid)
  │
  └── vendors   (service providers — plumbers, AC techs, maids, etc.)
        │
        ├── vendor_tickets   (vendor's job history at this place)
        └── vendor_contracts (recurring service agreements)

service_history (denormalized timeline per place — every event ever)
```

## Design choices worth knowing

- **`places` is the root.** A single account can manage multiple places (your home + your beach house + your office). Every other table FKs to `places.id`.
- **Multi-tenancy via `account_id` on every table.** Row-level security policies live in `policies/` (TBD).
- **`tickets` are polymorphic by origin.** `origin = 'anomaly' | 'schedule' | 'consumption' | 'manual'`. Different fields are populated per origin but the table is unified.
- **Spatial coords are stored** as `(x, y, z, room)` plus a free-form pointer into the [whitelabel-3d](https://github.com/whitelabel-dev/whitelabel-3d) world model. Lets us upgrade rendering later without schema change.
- **Soft deletes only.** Every table has `deleted_at TIMESTAMPTZ` — never lose history. Service history is gold.
