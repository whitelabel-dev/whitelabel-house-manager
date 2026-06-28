# Dispatch Loop — Algorithm Spec

The three loops described in [README.md](../README.md), as runnable pseudocode. Future implementation (whether a Node service, a Python worker, or a Supabase Edge Function) targets this spec.

Lives on the agent fleet ([[project-agent-fleet]]) — these run continuously, not on user request. This is the [proactive-AI doctrine](https://github.com/whitelabel-dev/whitelabel-principles) in code.

## Loop 1 — Anomaly-driven (system → ticket → vendor)

**Runs:** every 60 seconds per place. Watches `system_telemetry` for new rows since last tick.

```python
def anomaly_loop(place_id):
    new_readings = db.select(
        "system_telemetry",
        where={"recorded_at": after(last_tick(place_id))}
    )
    for reading in new_readings:
        if detect_anomaly(reading):
            db.update(reading, is_anomaly=True)

            # Don't fire duplicate ticket for the same system already in flight
            if has_open_ticket_for_system(reading.system_id):
                continue

            ticket = db.insert("tickets", {
                "account_id": reading.account_id,
                "place_id": place_id,
                "origin": "anomaly",
                "system_id": reading.system_id,
                "title": describe_anomaly(reading),
                "description": claude_explain(reading),  # LLM-narrated explanation
                "priority": severity(reading),
                "status": "open",
            })

            vendor = match_vendor(
                place_id=place_id,
                role=role_for_system(reading.system),
                preferred=True,
                available_within_hours=severity(reading) * 24,
            )

            if vendor:
                db.update(ticket, vendor_id=vendor.id, status="assigned")
                emit_event(ticket, "matched", actor="agent")
                channels.notify(vendor, ticket)   # SMS + email via whitelabel-channels
                channels.notify(owner, ticket)    # "AC issue detected, dispatching X to fix"
            else:
                # No vendor available — escalate to human
                channels.notify(owner, ticket, message="No vendor available — please review")
```

**Anomaly detection** is per-system_kind:

| System | Anomaly signal |
|---|---|
| HVAC | Running > 90% duty cycle AND setpoint never reached for >2h |
| Sprinkler | Flow rate >1.5x baseline (leak) OR <0.5x baseline (clog) |
| Lights | Group offline >10min when expected on |
| Security | Door open >30min outside scheduled access |
| Appliance | Manufacturer fault code OR runtime far outside cycle norm |
| Pool | Temp drift >3°C from setpoint OR pump runtime anomaly |
| Water | Continuous flow >15min when nobody home (leak detector) |

LLM-narrated explanations make the ticket human-readable: *"Your downstairs HVAC has been running continuously since 2:14 PM but hasn't reached the 72°F setpoint. Most common cause is a frozen evaporator coil or refrigerant issue."*

## Loop 2 — Schedule-driven (recurring service)

**Runs:** every 5 minutes globally. Reads `vendor_contracts` for upcoming services.

```python
def schedule_loop():
    upcoming = db.select(
        "vendor_contracts",
        where={
            "active": True,
            "next_service": between(now(), now() + 24h),
        }
    )
    for contract in upcoming:
        ensure_ticket_exists(contract)

    # T-24h reminder
    for contract in upcoming_in_window(20h, 28h):
        if not reminded_24h(contract):
            channels.notify(contract.vendor, "Reminder: service at {place} tomorrow")
            mark_reminded(contract, "24h")

    # T-1h arrival reminder
    for contract in upcoming_in_window(45min, 75min):
        if not reminded_1h(contract):
            channels.notify(contract.vendor, "Arriving soon. Access code: {code}")
            mark_reminded(contract, "1h")

    # After service, advance to next
    for contract in completed_today():
        contract.next_service = compute_next(contract.cadence, now())
        db.update(contract)
```

## Loop 3 — Consumption-driven (Plane D → reorder)

**Runs:** hourly. Watches consumable items + their `item_consumption` trajectory.

```python
def consumption_loop():
    consumables = db.select(
        "items",
        where={"category": "consumable", "deleted_at": None}
    )
    for item in consumables:
        # Update level from latest signal
        latest = db.select_one("item_consumption", where={"item_id": item.id}, order_by="recorded_at desc")
        if latest:
            item.current_level = latest.level

        # Predict run-out from trend
        runout_days = predict_runout(item.id)

        # Reorder if at or below threshold OR runout within 5 days
        if item.current_level <= item.reorder_threshold or runout_days < 5:
            if has_open_reorder_ticket(item.id):
                continue

            ticket = db.insert("tickets", {
                "account_id": item.account_id,
                "place_id": item.place_id,
                "origin": "consumption",
                "item_id": item.id,
                "title": f"Restock {item.name}",
                "priority": 3 if runout_days > 2 else 2,
                "status": "open",
            })

            order_result = place_order(
                item=item,
                source=item.reorder_source,    # 'amazon_subscribe' | 'partner_api' | 'manual'
                quantity=item.reorder_quantity or 1,
            )

            if order_result.success:
                db.update(ticket, status="scheduled", actual_cost=order_result.cost)
                emit_event(ticket, "ordered", actor="agent", payload=order_result)
                channels.notify(owner, f"Ordered {item.name}, arriving {order_result.eta}")
            else:
                # Couldn't auto-order — escalate
                channels.notify(owner, ticket, message="Please reorder manually")


def predict_runout(item_id):
    """Linear regression over last 30 days of item_consumption."""
    history = db.select("item_consumption", item_id=item_id, last_days=30)
    if len(history) < 3:
        return None  # Not enough data
    slope = linear_slope(history, x="recorded_at", y="level")
    if slope >= 0:
        return None  # Not depleting
    days_to_zero = -current_level / slope
    return days_to_zero
```

## Cross-loop invariants

These hold across all three loops, enforced by the agent runtime:

1. **No duplicate tickets** for the same trigger. Each loop checks `has_open_ticket_for_*` before creating.
2. **Every state change emits a `ticket_event`.** Full audit history; nothing happens off-the-record.
3. **`service_history` is derived, not authored.** A trigger on ticket completion writes the denormalized row.
4. **Owner always notified.** Even auto-handled actions emit a "this happened because X" message via [whitelabel-channels](https://github.com/whitelabel-dev/whitelabel-channels). The [proactive-AI doctrine](https://github.com/whitelabel-dev/whitelabel-principles) non-negotiable #2 — "always-on means always-explained."
5. **Escalation, not autonomy.** Auto-actions are confined to low-risk operations (notify, propose, schedule, order from approved source). Anything irreversible or > a set spend threshold is *proposed* to the human, not executed.

## What lives WHERE in the stack

| Concern | Runs in |
|---|---|
| The three loops above | Mac mini fleet ([[project-agent-fleet]]) — agent runtime, one container per place |
| Anomaly detection ML | Cloud (Anthropic Claude API) — narration + classification |
| Schema + state | Supabase (the `house` schema from migration 0001) |
| Channels (SMS/email/push) | [whitelabel-channels](https://github.com/whitelabel-dev/whitelabel-channels) |
| Vendor matching | Local rules engine + LLM tiebreaker |
| Order placement | Per-source: Amazon API, partner integrations, manual fallback |
| World model (3D) | [whitelabel-3d](https://github.com/whitelabel-dev/whitelabel-3d) |
| User UI | Next.js at `house.whitelabel.dev` |
| Owner notifications | [whitelabel-flow](https://github.com/whitelabel-dev/whitelabel-flow) for voice, [whitelabel-channels](https://github.com/whitelabel-dev/whitelabel-channels) for SMS/email/push |
