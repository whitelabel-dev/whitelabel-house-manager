# whitelabel-house-manager

> Centralized home management — one dashboard for every system in the house + every person who maintains it. Monitor it, control it, and when something breaks, dispatch the right vendor without thinking about it.

## status

**Claimed 2026-06-26.** Scope captured here; implementation pending.

## what it manages

**Full home operating system** — one dashboard for *everything that touches your home*. Eight planes share one timeline + one notification surface + one auto-dispatch engine:

### Plane A — Systems (what)

The physical things in the house — monitor + control + alert.

| System | What it does | Integrations (planned) |
|---|---|---|
| **HVAC / AC** | Schedules, runtime, failure alerts | Ecobee, Nest, Honeywell, Matter |
| **Sprinklers / irrigation** | Schedules + leak detection (flow anomaly) | Rachio, Rainbird, Hunter Hydrawise |
| **Lights** | Scenes, schedules, away-mode automation | Philips Hue, LIFX, Lutron Caséta, Matter |
| **Smart plugs / outlets** | Schedule + remote control of any device | TP-Link **Kasa**, Wemo, Wyze, Tapo |
| **Security & cameras** | Doors, alarm, motion, recording | Ring, Arlo, ADT, Eufy, generic ONVIF |
| **Smart locks** | Remote unlock, scheduled codes for vendors | August, Schlage, Yale, Level |
| **Doorbells** | Live + clips | Ring, Nest Hello, Eufy |
| **Garage doors** | Open/close, history, alerts when left open | MyQ, Tailwind, Chamberlain |
| **Appliances** | Failure prediction via runtime signals | LG ThinQ, Samsung SmartThings, Bosch Home Connect, Miele |
| **Pool / spa** | Pump runtime, temp, chemistry | Pentair, Hayward, Jandy iAqualink |
| **Water leak detection** | Flow + leak alerts (catches before flood) | Phyn, Flo by Moen, Moen Smart Water |
| **Energy monitoring** | Per-circuit usage + anomaly | Sense, Emporia, Span panel |
| **Solar / battery** | Production, storage state, grid sell | Enphase, Tesla Powerwall, SolarEdge |
| **Smoke + CO detectors** | Battery + test cadence + alarms | Nest Protect, First Alert, Kidde Smart |
| **Window coverings** | Auto schedule + scene integration | Lutron Serena, Hunter Douglas PowerView, IKEA FYRTUR |
| **Voice / hubs** | Routing + voice control | Alexa, Google Home, Apple HomeKit, Home Assistant, SmartThings hub |
| **EV chargers** | Charging schedule, energy reporting | Tesla Wall Connector, ChargePoint, Wallbox |

### Plane B — Service providers (who)

The humans who maintain the house — directory + dispatch + tracking.

| Role | When called | Tracked here |
|---|---|---|
| **Maids / housekeeping** | Recurring schedule | Recurring jobs, supplies inventory, satisfaction notes |
| **Plumbers** | Water leak, drain issue, hot water out | Vendor card with prior jobs, rates, response time |
| **AC / HVAC techs** | Temp anomaly, service-due reminder, repair | Service history, filter-replacement cadence, warranty status |
| **Electricians** | Power issues, install requests | Same |
| **Appliance repair** | Specific appliance fault (manufacturer or local) | Manufacturer warranty + extended-warranty tracking |
| **Pool service** | Recurring | Recurring jobs |
| **Lawn / landscaping** | Recurring | Recurring jobs |
| **Pest control** | Recurring + as-needed | Same |
| **Handyman / general** | Catch-all | Same |

Each vendor has a card with: contact info, hourly rate, response-time average, prior jobs, photos of past work, payment history.

### Plane D — Belongings (3D inventory)

Every physical thing you own, placed in its actual location in the [whitelabel-3d](https://github.com/whitelabel-dev/whitelabel-3d) world model of the house. Not a spreadsheet of items — a *3D walkthrough* where the shampoo is in the shower, the razor blades are in the medicine cabinet, the dog food is in the laundry room, the holiday lights are in the garage on the third shelf.

Three sub-categories:

| Type | Examples | Tracked dimension |
|---|---|---|
| **Consumables** | Shampoo, dog food, paper towels, toothpaste, batteries, light bulbs, filters | Quantity / level over time → auto-restock when low |
| **Durables** | Furniture, appliances, electronics, tools, kitchen equipment | Warranty + service history (cross-links to Plane B vendors) |
| **Valuables** | Jewelry, art, documents, collectibles, electronics | Insurance documentation + theft/disaster claims |

**Why 3D, not a list:**

| Capability | Flat list | 3D world-model inventory |
|---|---|---|
| "Where did I put my passport?" | hope you tagged it | spatial query against the model |
| "What's running low?" | manual tally | each item has a level meter; AI watches |
| "Pack the kitchen to move" | sort spreadsheet by room | walk the 3D room visually |
| "Restock the bathroom" | mental gymnastics | AI dispatches the order via Plane B |
| Voice ask: "we have toilet paper?" | open spreadsheet → search | voice → spatial answer |
| Vision-impaired user: "where's my medication?" | impossible | voice → "kitchen counter, top shelf, third bottle from the left" |
| Insurance claim after disaster | hope you have photos | export the model as proof of every item + value |

The last row is mission-relevant — assistive surface for cognitive- + vision-impaired homeowners per [`whitelabel-principles/doctrines/disability-employment.md`](https://github.com/whitelabel-dev/whitelabel-principles).

**Capture flow:**
1. iPhone LiDAR scan of each room → glTF space model in [whitelabel-3d](https://github.com/whitelabel-dev/whitelabel-3d)
2. Walk the rooms with the phone, "scan" items via camera + barcode + voice tag
3. AI assists categorization (vision model identifies "this is a Costco bulk paper towels pack")
4. Consumption tracking via passive signal (smart-shelf sensors, manual updates, purchase history)
5. Reorder loop fires when level crosses threshold

### Plane E — Subscriptions & Recurring

The bills + memberships + auto-pay graph. *Surface what you're paying for, what's about to renew, what nobody's used in 60 days.* Same anti-bloat pattern that killed $225/mo in SaaS — applied to your household.

| Category | Examples |
|---|---|
| **Mortgage / lease** | Monthly payment, escrow, next due |
| **Utilities** | Electric (TXU/Reliant), water (city), gas (Atmos), internet (Spectrum/Fiber), trash |
| **Streaming** | Netflix, Disney+, Spotify, Apple TV+, Max, Prime, Peacock |
| **Memberships** | Costco, Amazon Prime, Sam's, AAA, Equinox |
| **Insurance** | Homeowner's, auto, umbrella, life, dental, vision, pet |
| **HOA / dues** | Monthly, special assessments |
| **Subscriptions** | Wine club, Chewy autoship, BarkBox, meal kit |

Each row links to: provider, amount, cadence, next charge date, last value-check ("Nobody watched Peacock in 47 days — keep?").

### Plane F — Documents & Records

Everything you'd panic-search for after a flood / fire / sale.

| Doc class | What's in it |
|---|---|
| **Deeds / titles** | Property deed, vehicle titles, boat title |
| **Insurance policies** | Homeowner's binder, auto cards, umbrella, life |
| **Warranties** | Appliance, HVAC, roof, solar, electronics |
| **Permits & inspections** | Building permits, septic, alarm, pool, HOA approvals |
| **Tax records** | Property tax, home improvement receipts (basis), 1098s |
| **Manuals** | Every appliance + system PDF, searchable |
| **Receipts** | High-value purchases for insurance proof + warranty |

### Plane G — Calendar & Cadence

The non-negotiable recurring stuff that quietly piles up if you don't track it.

- Trash + recycling pickup days
- HVAC filter swap (every 3 mo)
- Smoke detector battery (every 12 mo) + CO detector check
- Water filter cartridges
- Annual HVAC tune-up
- Annual chimney sweep
- Annual gutter clean
- Smoke detector test
- Roof inspection (every 3 yr)
- Pool/spa filter rotation
- Pest control quarterly
- HOA meetings
- Property tax due dates
- Insurance renewal dates
- DMV registration renewals

### Plane H — Household members, pets, contacts

The people + animals in the house + the emergency-reach graph.

| Type | What |
|---|---|
| **Family** | Names, birthdates, allergies, medications, school/work contacts |
| **Pets** | Vet, meds, food brand + amount, vaccinations, license # |
| **Emergency** | Neighbors with key, primary doctor, pet sitter, ICE contacts |
| **Service-only** | Cleaning + lawn + handyman crew (cross-links to Plane B) |
| **Babysitters / petsitters** | Vetted list with rates + last-used date |

## the dispatch loops

This is the [proactive-AI doctrine](https://github.com/whitelabel-dev/whitelabel-principles) made concrete. Three loops fire from three different triggers:

### Loop 1 — Anomaly-driven (Plane A → Plane B)

When System A detects a problem → automatically open a ticket → match to the right Vendor B → notify both parties → track to resolution.

```
[AC running 24/7, never reaching setpoint]
    ↓
[ticket opened: "HVAC underperforming since 2:14 PM"]
    ↓
[match: HVAC tech from vendor card, top of priority list, available]
    ↓
[notify vendor via SMS/email/whitelabel-channels]
    ↓
[vendor confirms → schedule appears on whitelabel-calendar]
    ↓
[vendor arrives → photo + invoice via mobile portal]
    ↓
[ticket closes → cost logged → next preventive check scheduled]
```

### Loop 2 — Schedule-driven (recurring service)

Calendar-based, fires on cadence regardless of sensors.

```
[recurring: maid cleaning every Tue 10am]
    ↓
[T-24h: confirm vendor still available]
    ↓
[T-1h: send arrival reminder + access code to vendor]
    ↓
[T+0: vendor checks in (geofence or manual)]
    ↓
[T+done: vendor checks out, photo log of work]
    ↓
[invoice processed → cost logged → next occurrence scheduled]
```

### Loop 3 — Consumption-driven (Plane D → reorder)

The inventory loop. AI watches consumable levels, dispatches restock before run-out.

```
[shampoo bottle in master bath: level 18%, trending toward 0 in ~6 days]
    ↓
[reorder threshold = 20% → triggered]
    ↓
[check household preference: brand/size/source → Amazon Subscribe & Save / preferred vendor]
    ↓
[place order via affiliate or partner API]
    ↓
[notify homeowner: "ordered shampoo, arriving Thursday"]
    ↓
[on arrival, update inventory level to full + log cost]
```

## why this is whitelabel-shaped

- **Resellable to agencies** — every reseller agency in the whitelabel.dev channel could offer "branded home concierge" to their high-net-worth or property-manager clients. Each white-labeled instance has the agency's brand.
- **Connects to disability employment** — voice-controlled house management via [whitelabel-flow](https://github.com/whitelabel-dev/whitelabel-flow) is a real assistive surface. "The AC stopped working" spoken → ticket opens → tech dispatched, no fine-motor or visual interaction required. Mission-relevant ([[whitelabel-principles/doctrines/disability-employment.md]]).
- **Connects to vacation-rental + property-management** — same product, different segment (short-term rental owners, property managers).
- **Owns a real category** — the category exists (Home Assistant for control, ServiceTitan for vendors) but no single product unifies both planes for the consumer/HNW homeowner side. White-label-resellable version of this is novel.

## related repos

| Repo | How it connects |
|---|---|
| [whitelabel-channels](https://github.com/whitelabel-dev/whitelabel-channels) | Notifications when things break or service is needed |
| [whitelabel-calendar](https://github.com/whitelabel-dev/whitelabel-calendar) | Vendor visits + recurring service schedules |
| [whitelabel-contacts](https://github.com/whitelabel-dev/whitelabel-contacts) | Vendor directory (people CRM layer) |
| [whitelabel-jobs](https://github.com/whitelabel-dev/whitelabel-jobs) | Service tickets = jobs in the system |
| [whitelabel-orchestrator](https://github.com/whitelabel-dev/whitelabel-orchestrator) | AI agents handle the auto-dispatch loop |
| [whitelabel-flow](https://github.com/whitelabel-dev/whitelabel-flow) | Voice control — "the AC just died" → ticket |
| [whitelabel-pipeline](https://github.com/whitelabel-dev/whitelabel-pipeline) | Service workflow tracking (ticket → scheduled → done → paid) |
| [whitelabel-accessibility](https://github.com/whitelabel-dev/whitelabel-accessibility) | Assistive surface — voice + adaptive UI for PWD homeowners |
| [whitelabel-database](https://github.com/whitelabel-dev/whitelabel-database) | Where vendor records + service history live |
| [whitelabel-charity](https://github.com/whitelabel-dev/whitelabel-charity) | Could fund PWD-friendly home-modifications via service providers |

## roadmap

| Version | Adds | Status |
|---|---|---|
| **v0.1** | Repo claim + scope captured (this doc) | ✓ shipped 2026-06-26 |
| v0.2 | Schema design — `house_systems`, `vendors`, `tickets`, `service_history` tables in whitelabel-database. Vendor directory UI. | next |
| v0.3 | Single system integration (HVAC via Ecobee API) → live status on dashboard | |
| v0.4 | Anomaly detection (Claude API analyzes telemetry → fires tickets) | |
| v0.5 | Auto-dispatch loop wired end-to-end (anomaly → ticket → vendor SMS → confirmation) | |
| v0.6 | Mobile-friendly view (the "AC died while I'm in Cabo" use case) | |
| v0.7 | Full system coverage — sprinklers, lights, pool, security, appliances | |
| v1.0 | White-label reseller mode — agencies can brand + resell to property managers / HNW clients | |

## scope explicitly NOT in this repo

- The smart-home protocols (Matter, Zigbee, Z-Wave) — we use existing vendor APIs / Home Assistant / Matter bridges, not reimplement
- Hardware sales — we integrate with existing IoT hardware, we don't sell hubs/sensors
- General property management (rent collection, tenant onboarding) — that's a different scope

## the strategic frame

Most homeowners + property managers cobble together: smart-thermostat app + sprinkler app + camera app + a text-thread of vendor numbers + a calendar reminder + their memory. **`whitelabel-house-manager` collapses that into one dashboard.** Add the auto-dispatch loop on top and it stops being "I have to remember to call the AC guy" and starts being "I got a text saying the AC tech is on his way."

Resellable, accessible by design, and the kind of thing that's worth real money to the right segment.
