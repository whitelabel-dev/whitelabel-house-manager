# whitelabel-house-manager

> Centralized home management — one dashboard for every system in the house + every person who maintains it. Monitor it, control it, and when something breaks, dispatch the right vendor without thinking about it.

## status

**Claimed 2026-06-26.** Scope captured here; implementation pending.

## what it manages

Two distinct planes that share one dashboard:

### Plane A — Systems (what)

The physical things in the house — monitor + control + alert.

| System | What it does | Integrations (planned) |
|---|---|---|
| **HVAC / AC** | Set schedules; alert if running 24/7 or never cycling | Ecobee, Nest, Honeywell, generic Matter thermostats |
| **Sprinklers / irrigation** | Schedules + flow-rate anomaly detection (leak alert) | Rachio, Rainbird, Hunter Hydrawise |
| **Lights** | Scenes, schedules, away-mode automation | Hue, LIFX, Lutron Caséta, Matter |
| **Security** | Cameras, doors, alarm system, motion | Ring, Arlo, generic ONVIF, Reolink |
| **Appliances** | Smart-monitor washer/dryer/dishwasher/fridge for failure-prediction signals | LG ThinQ, Samsung SmartThings, Bosch Home Connect |
| **Pool / spa** | Pump, temp, chemistry | Pentair, Hayward |
| **Garage / locks** | Status, remote control, access codes for vendors | MyQ, August, Schlage |
| **Energy** | Usage breakdown by circuit | Sense, Emporia |
| **Water** | Flow + leak detection | Phyn, Flo by Moen |

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

## the dispatch loop (the magic)

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
