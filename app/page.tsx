import {
  HOME, SYSTEMS, VENDORS, ITEMS, SUBSCRIPTIONS,
  DOCUMENTS, CALENDAR, PEOPLE, ACTIVITY,
} from "@/lib/sample-home";
import { INTEGRATIONS, CATEGORY_LABELS } from "@/lib/integrations";

export default function Dashboard() {
  const consumables = ITEMS.filter((i) => i.category === "consumable");
  const durables = ITEMS.filter((i) => i.category === "durable");
  const valuables = ITEMS.filter((i) => i.category === "valuable");
  const monthlyBurn = SUBSCRIPTIONS.reduce((a, s) => a + s.monthly, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* ───────── Header ───────── */}
      <header className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Mark />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">House Manager</h1>
            <p className="text-xs text-muted">{HOME.name} · {HOME.address} · {HOME.rooms} rooms</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">All systems normal</span>
          <a href="https://3d.whitelabel.dev" className="underline" target="_blank">Open 3D viewer →</a>
        </div>
      </header>

      {/* ───────── Status row ───────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Smart devices" value={`${SYSTEMS.length}`} note="online + monitored" />
        <Stat label="Service vendors" value={`${VENDORS.length}`} note="in the directory" />
        <Stat label="Monthly burn" value={`$${monthlyBurn.toLocaleString()}`} note={`${SUBSCRIPTIONS.length} subscriptions`} />
        <Stat label="Items tracked" value={`${ITEMS.length}`} note={`${consumables.length} consumables`} />
      </section>

      {/* ───────── Recent activity ───────── */}
      <Section title="Recent activity" hint="Proactive — the AI surfaces things without being asked.">
        <ul className="divide-y divide-border bg-panel border border-border rounded-xl">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="px-5 py-3 flex items-start gap-4 text-sm">
              <span className="text-xs text-muted shrink-0 w-20">{a.ts}</span>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ───────── Plane A — Systems ───────── */}
      <Section
        title="Plane A · Smart systems"
        hint={`${SYSTEMS.length} devices · auto-dispatches a vendor if anything goes wrong`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SYSTEMS.map((s) => (
            <div key={s.id} className="bg-panel border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  <p className="text-xs text-muted">{s.manufacturer} · {s.room}</p>
                </div>
                <StatusDot status={s.status} />
              </div>
              {s.lastReading && <p className="text-xs text-text/80 mt-2">{s.lastReading}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── Plane B — Vendors ───────── */}
      <Section
        title="Plane B · Service vendors"
        hint="Auto-dispatch when anomalies are detected — or schedule recurring service"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {VENDORS.map((v) => (
            <div key={v.id} className="bg-panel border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {v.business}
                    {v.preferred && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">PREFERRED</span>}
                  </h3>
                  <p className="text-xs text-muted">{v.role} · {v.rate}</p>
                </div>
                {v.rating && <span className="text-xs text-amber-600">★ {v.rating}</span>}
              </div>
              <p className="text-xs text-text/70 mt-1">{v.contact}</p>
              {v.lastService && <p className="text-xs text-muted mt-2">Last: {v.lastService}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── Plane D — Belongings ───────── */}
      <Section
        title="Plane D · Belongings (3D inventory)"
        hint="Every consumable, durable, valuable — placed in 3D space via whitelabel-3d"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <BelongingsCard title="Consumables" subtitle="Auto-reorder when low" items={consumables} />
          <BelongingsCard title="Durables" subtitle="Warranty + service history" items={durables} />
          <BelongingsCard title="Valuables" subtitle="Insurance documentation" items={valuables} />
        </div>
      </Section>

      {/* ───────── Plane E — Subscriptions ───────── */}
      <Section
        title="Plane E · Subscriptions & recurring"
        hint={`$${monthlyBurn.toLocaleString()}/mo total — same anti-bloat lens we used for the SaaS cancellation cascade`}
      >
        <div className="bg-panel border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted bg-bg">
              <tr><th className="text-left px-4 py-2">Provider</th><th className="text-left px-4 py-2">Category</th><th className="text-right px-4 py-2">Monthly</th><th className="text-left px-4 py-2">Next</th><th className="text-left px-4 py-2">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SUBSCRIPTIONS.map((s) => (
                <tr key={s.id} className="hover:bg-bg/50">
                  <td className="px-4 py-2.5 font-medium">{s.provider}</td>
                  <td className="px-4 py-2.5 text-muted">{s.category}</td>
                  <td className="px-4 py-2.5 text-right font-mono">${s.monthly.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-muted">{s.nextCharge}</td>
                  <td className="px-4 py-2.5">{s.utilityScore && <UtilityBadge score={s.utilityScore} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ───────── Plane F — Documents ───────── */}
      <Section
        title="Plane F · Documents & records"
        hint="Deeds, insurance, warranties, permits, tax — every searchable document"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DOCUMENTS.map((d) => (
            <div key={d.id} className="bg-panel border border-border rounded-xl p-4">
              <p className="text-xs text-muted uppercase tracking-wide">{d.type}</p>
              <h3 className="font-semibold text-sm mt-1">{d.name}</h3>
              <p className="text-xs text-muted mt-1">Filed: {d.filed}</p>
              {d.expiresOn && <p className="text-xs text-amber-700 mt-0.5">Expires: {d.expiresOn}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── Plane G — Calendar ───────── */}
      <Section
        title="Plane G · Calendar & cadence"
        hint="The recurring stuff that quietly piles up — pickup days, filter swaps, renewals"
      >
        <ul className="bg-panel border border-border rounded-xl divide-y divide-border">
          {CALENDAR.map((c) => (
            <li key={c.id} className="px-4 py-3 flex items-center gap-4 text-sm">
              <span className="text-xs text-muted bg-bg px-2 py-0.5 rounded shrink-0 w-24 text-center">{c.category}</span>
              <span className="flex-1 font-medium">{c.title}</span>
              <span className="text-xs text-muted shrink-0">{c.cadence}</span>
              <span className="text-xs text-text/80 shrink-0 w-32 text-right">{c.next}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ───────── Plane H — People + Pets ───────── */}
      <Section
        title="Plane H · Household, pets, emergency"
        hint="People + pets + emergency reach — synced into every workflow that touches the house"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PEOPLE.map((p) => (
            <div key={p.id} className="bg-panel border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <span className="text-[10px] uppercase tracking-wide text-muted">{p.type}</span>
              </div>
              <p className="text-xs text-text/70">{p.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── Integrations ───────── */}
      <Section
        title={`Integrations · ${INTEGRATIONS.length} catalogued`}
        hint="Connect once · everything syncs into the dashboard + auto-dispatch loop"
      >
        <IntegrationGrid />
      </Section>

      <footer className="border-t border-border pt-6 text-xs text-muted flex items-center justify-between">
        <span>whitelabel-house-manager · v0.3 dashboard shell · <a href="https://github.com/whitelabel-dev/whitelabel-house-manager" className="underline">source</a></span>
        <span>part of the <a href="https://whitelabel.dev" className="underline">whitelabel.dev</a> ecosystem</span>
      </footer>
    </div>
  );
}

// ─────────────────────── components ───────────────────────

function Mark() {
  return (
    <div className="w-7 h-7 rounded-full border-[3px] border-text relative">
      <div className="absolute inset-[3px] rounded-full bg-text" />
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {hint && <p className="text-xs text-muted mt-0.5">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
      {note && <p className="text-xs text-muted mt-0.5">{note}</p>}
    </div>
  );
}

function StatusDot({ status }: { status: "ok" | "warn" | "alert" | "offline" }) {
  const color = { ok: "bg-green-500", warn: "bg-amber-500", alert: "bg-red-500", offline: "bg-gray-400" }[status];
  return <span className={`w-2.5 h-2.5 rounded-full ${color} shrink-0 mt-1.5`} />;
}

function BelongingsCard({ title, subtitle, items }: { title: string; subtitle: string; items: typeof ITEMS }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-4">
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted mb-3">{subtitle}</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2">
            {typeof i.level === "number" && (
              <div className="w-12 shrink-0 h-1.5 bg-bg rounded overflow-hidden">
                <div className="h-full bg-text" style={{ width: `${i.level * 100}%` }} />
              </div>
            )}
            <span className="flex-1 truncate">{i.name}</span>
            {i.status && <span className="text-xs text-amber-700 shrink-0">{i.status}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function UtilityBadge({ score }: { score: "essential" | "loved" | "stale" }) {
  const styles = {
    essential: "bg-green-50 text-green-700",
    loved: "bg-blue-50 text-blue-700",
    stale: "bg-amber-50 text-amber-700",
  }[score];
  const label = { essential: "Essential", loved: "Loved", stale: "Stale — review" }[score];
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${styles}`}>{label}</span>;
}

function IntegrationGrid() {
  const grouped = INTEGRATIONS.reduce<Record<string, typeof INTEGRATIONS>>((acc, it) => {
    (acc[it.category] = acc[it.category] || []).push(it);
    return acc;
  }, {});
  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat}>
          <h3 className="text-xs uppercase tracking-wider text-muted mb-2">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {list.map((it) => (
              <div key={it.id} className="bg-panel border border-border rounded-lg p-3 flex items-start gap-3">
                <span className="text-xl">{it.logoEmoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{it.name}</p>
                  <p className="text-xs text-muted leading-snug">{it.description}</p>
                </div>
                <StatusBadge status={it.status} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: "live" | "stub" | "planned" }) {
  const styles = {
    live: "bg-green-50 text-green-700 border-green-200",
    stub: "bg-blue-50 text-blue-700 border-blue-200",
    planned: "bg-gray-50 text-gray-600 border-gray-200",
  }[status];
  const label = { live: "LIVE", stub: "Connect", planned: "Soon" }[status];
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${styles} shrink-0 self-start`}>{label}</span>;
}
