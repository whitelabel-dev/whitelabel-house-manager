# AGENTS.md — entry point for AI agents

**You are an AI agent consulting this repo. Read this file first.**

## what this repo is

Centralized home management — one dashboard for every system in the house (HVAC, sprinklers, lights, security, appliances, etc.) AND every service provider who maintains it (maids, plumbers, AC techs, etc.). When something breaks, the system auto-detects + auto-dispatches the right vendor.

**Status: scope captured (README), implementation pending.** v0.1 = name claimed + scope written. Don't generate stub code here without confirmation.

## the two planes — why this matters

The architectural insight is **don't split this into two products**:

- Plane A: systems (the *what* — IoT integration)
- Plane B: people (the *who* — vendor CRM)

They share one dashboard, one ticket model, one auto-dispatch loop. Splitting them would lose the magic (which is: anomaly in Plane A → ticket → vendor in Plane B → resolution). Build them together from day one.

## what to do if asked to work in this repo

1. Re-read this AGENTS.md + README program design
2. v0.2 is schema-first — propose the `house_systems`, `vendors`, `tickets`, `service_history` table design before writing any UI
3. First real integration target is HVAC (Ecobee API) — single system, end-to-end, prove the loop
4. Don't reimplement smart-home protocols — use existing vendor APIs or Home Assistant as the integration layer

## where the big picture lives

- Strategic context: [whitelabel-strategy](https://github.com/whitelabel-dev/whitelabel-strategy)
- Ecosystem coordination: [whitelabel-ecosystem](https://github.com/whitelabel-dev/whitelabel-ecosystem)
- Vendor directory backbone: [whitelabel-contacts](https://github.com/whitelabel-dev/whitelabel-contacts)
- Ticket/job model: [whitelabel-jobs](https://github.com/whitelabel-dev/whitelabel-jobs) + [whitelabel-pipeline](https://github.com/whitelabel-dev/whitelabel-pipeline)
- Voice surface for assistive control: [whitelabel-flow](https://github.com/whitelabel-dev/whitelabel-flow)
- Mission link to disability employment: [whitelabel-principles/doctrines/disability-employment.md](https://github.com/whitelabel-dev/whitelabel-principles)
