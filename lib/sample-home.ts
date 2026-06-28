// Sample home data for the v0.3 demo. Read by the dashboard until the
// real schema-backed database is wired in.
//
// This is structured to match the future Postgres schema 1:1 — when
// connectors come online, this file is replaced by Supabase queries.

export type System = {
  id: string;
  kind: string;
  name: string;
  manufacturer: string;
  room: string;
  status: "ok" | "warn" | "alert" | "offline";
  lastReading?: string;
};

export type Vendor = {
  id: string;
  role: string;
  business: string;
  contact: string;
  rate: string;
  preferred?: boolean;
  rating?: number;
  lastService?: string;
};

export type Item = {
  id: string;
  category: "consumable" | "durable" | "valuable";
  name: string;
  room: string;
  level?: number; // 0-1
  status?: string;
};

export type Subscription = {
  id: string;
  provider: string;
  category: string;
  monthly: number;
  nextCharge: string;
  utilityScore?: "essential" | "loved" | "stale";
};

export type Document = {
  id: string;
  type: string;
  name: string;
  expiresOn?: string;
  filed: string;
};

export type CalendarItem = {
  id: string;
  title: string;
  cadence: string;
  next: string;
  category: string;
};

export type Member = {
  id: string;
  type: "family" | "pet" | "emergency" | "service";
  name: string;
  detail: string;
};

export const HOME = {
  name: "Example Home",
  address: "Austin, TX",
  rooms: 11,
};

export const SYSTEMS: System[] = [
  { id: "hvac-main", kind: "hvac", name: "Main Floor HVAC", manufacturer: "Carrier Infinity 24-A", room: "utility closet", status: "ok", lastReading: "72°F · 38% RH" },
  { id: "hvac-upstairs", kind: "hvac", name: "Upstairs HVAC", manufacturer: "Carrier Infinity 24-A", room: "attic", status: "warn", lastReading: "Filter due in 6 days" },
  { id: "sprinkler", kind: "sprinkler", name: "Front Yard (8-zone)", manufacturer: "Rachio 3", room: "garage", status: "ok", lastReading: "Last ran: 6:00 AM Tue" },
  { id: "lights-lr", kind: "lights", name: "Living Room Hue (6 bulbs)", manufacturer: "Philips Hue Hub v2", room: "living room", status: "ok", lastReading: "Evening scene active" },
  { id: "ring", kind: "security", name: "Front Door Camera", manufacturer: "Ring Pro 2", room: "front porch", status: "ok", lastReading: "12 events today" },
  { id: "august", kind: "lock", name: "Front Door Lock", manufacturer: "August Wi-Fi", room: "front door", status: "ok", lastReading: "Locked · last opened 8:14 PM" },
  { id: "myq", kind: "garage", name: "Garage Door", manufacturer: "MyQ Smart", room: "garage", status: "ok", lastReading: "Closed since 6:42 PM" },
  { id: "fridge", kind: "appliance", name: "Kitchen Refrigerator", manufacturer: "LG LRFXS2503S", room: "kitchen", status: "ok", lastReading: "37°F · ice maker on" },
  { id: "washer", kind: "appliance", name: "Washer", manufacturer: "LG WM4000HWA", room: "laundry room", status: "ok", lastReading: "Idle" },
  { id: "pool", kind: "pool", name: "Backyard Pool", manufacturer: "Pentair IntelliFlo VSF", room: "backyard", status: "ok", lastReading: "Pump on · 82°F" },
  { id: "phyn", kind: "water", name: "Whole-Home Leak Detector", manufacturer: "Phyn Plus", room: "utility closet", status: "ok", lastReading: "No anomaly" },
  { id: "sense", kind: "energy", name: "Energy Monitor", manufacturer: "Sense", room: "electrical panel", status: "ok", lastReading: "2.4 kW current draw" },
];

export const VENDORS: Vendor[] = [
  { id: "marisol", role: "Cleaning", business: "Marisol's House Cleaning", contact: "(512) 555-0101", rate: "$35/hr", preferred: true, rating: 4.9, lastService: "Tue, 4 days ago" },
  { id: "austin-ac", role: "HVAC", business: "Austin AC & Heat", contact: "(512) 555-0202", rate: "$150 service call", preferred: true, rating: 4.7, lastService: "Spring tune-up · 6 weeks ago" },
  { id: "stat-plumbing", role: "Plumbing", business: "Stat Plumbing", contact: "(512) 555-0303", rate: "$200 service call", preferred: true, rating: 4.8, lastService: "Disposal repair · 3 months ago" },
  { id: "bright-sparks", role: "Electrical", business: "Bright Sparks Electric", contact: "(512) 555-0404", rate: "$95/hr", rating: 4.6 },
  { id: "green-yards", role: "Lawn", business: "Green Yards Inc", contact: "(512) 555-0505", rate: "$65/visit", preferred: true, rating: 4.8, lastService: "Tomorrow, 9 AM" },
  { id: "crystal-pools", role: "Pool", business: "Crystal Pools", contact: "(512) 555-0606", rate: "$110/visit", preferred: true, rating: 4.9, lastService: "Yesterday" },
  { id: "lone-star", role: "Pest", business: "Lone Star Pest", contact: "(512) 555-0707", rate: "$85/quarter", rating: 4.5, lastService: "8 weeks ago · next due in 4" },
  { id: "around-house", role: "Handyman", business: "Around-the-House", contact: "(512) 555-0808", rate: "$75/hr", rating: 4.7 },
];

export const ITEMS: Item[] = [
  { id: "aesop-hand", category: "consumable", name: "Aesop Resurrection Hand Wash", room: "Master bath", level: 0.6 },
  { id: "davines-shampoo", category: "consumable", name: "Davines Volu Shampoo", room: "Master bath shower", level: 0.3, status: "Reorder soon" },
  { id: "gillette", category: "consumable", name: "Gillette ProGlide Blades (8-pk)", room: "Master bath cabinet", level: 0.62 },
  { id: "bounty", category: "consumable", name: "Costco Bounty Paper Towels", room: "Kitchen pantry", level: 0.75 },
  { id: "cascade", category: "consumable", name: "Cascade Dishwasher Pods", room: "Kitchen under-sink", level: 0.45 },
  { id: "tide", category: "consumable", name: "Tide HE Liquid Detergent", room: "Laundry room", level: 0.55 },
  { id: "hill-science", category: "consumable", name: "Hill's Science Diet (30 lb)", room: "Laundry room bin", level: 0.6 },
  { id: "vitamix", category: "durable", name: "Vitamix A3500", room: "Kitchen counter", status: "Warranty: 2033" },
  { id: "dewalt", category: "durable", name: "DeWalt 20V Drill Set", room: "Garage bench", status: "Warranty: 2025" },
  { id: "apple-watch", category: "valuable", name: "Apple Watch Ultra 2", room: "Master bedroom", status: "Insured · $799" },
  { id: "passport-g", category: "valuable", name: "Passport (Garrett)", room: "Office filing cabinet", status: "Expires 2032" },
];

export const SUBSCRIPTIONS: Subscription[] = [
  { id: "mortgage", provider: "Chase", category: "Mortgage", monthly: 3240, nextCharge: "Aug 1", utilityScore: "essential" },
  { id: "electric", provider: "TXU Energy", category: "Utility · Electric", monthly: 215, nextCharge: "Aug 4", utilityScore: "essential" },
  { id: "water", provider: "City of Austin Utilities", category: "Utility · Water", monthly: 88, nextCharge: "Aug 15", utilityScore: "essential" },
  { id: "internet", provider: "Spectrum 1 Gig", category: "Utility · Internet", monthly: 80, nextCharge: "Aug 12", utilityScore: "essential" },
  { id: "homeowner", provider: "State Farm", category: "Insurance · Home", monthly: 165, nextCharge: "Sep 1 (annual)", utilityScore: "essential" },
  { id: "auto-insur", provider: "Geico", category: "Insurance · Auto", monthly: 120, nextCharge: "Aug 22", utilityScore: "essential" },
  { id: "amazon-prime", provider: "Amazon Prime", category: "Membership", monthly: 14.99, nextCharge: "Sep 3", utilityScore: "loved" },
  { id: "costco", provider: "Costco Executive", category: "Membership", monthly: 11, nextCharge: "Apr (annual)", utilityScore: "loved" },
  { id: "netflix", provider: "Netflix Premium", category: "Streaming", monthly: 22.99, nextCharge: "Aug 8", utilityScore: "loved" },
  { id: "spotify", provider: "Spotify Family", category: "Streaming", monthly: 16.99, nextCharge: "Aug 11", utilityScore: "loved" },
  { id: "peacock", provider: "Peacock Premium", category: "Streaming", monthly: 11.99, nextCharge: "Aug 19", utilityScore: "stale" },
  { id: "wine-club", provider: "Naked Wines", category: "Subscription", monthly: 40, nextCharge: "Aug 17", utilityScore: "loved" },
];

export const DOCUMENTS: Document[] = [
  { id: "deed", type: "Deed", name: "Property Deed", filed: "2023-01-15" },
  { id: "home-policy", type: "Insurance", name: "State Farm Homeowner's Binder", filed: "2024-09-01", expiresOn: "2025-09-01" },
  { id: "auto-cards", type: "Insurance", name: "Geico Auto ID Cards", filed: "2024-08-22" },
  { id: "hvac-warranty", type: "Warranty", name: "Carrier HVAC (10yr parts)", filed: "2023-05-12", expiresOn: "2033-05-12" },
  { id: "roof-warranty", type: "Warranty", name: "GAF Timberline Roof", filed: "2022-06-01", expiresOn: "2052-06-01" },
  { id: "alarm-permit", type: "Permit", name: "Alarm Permit (City of Austin)", filed: "2024-01-10", expiresOn: "2026-01-10" },
  { id: "property-tax", type: "Tax", name: "2024 Property Tax Receipt", filed: "2024-12-30" },
];

export const CALENDAR: CalendarItem[] = [
  { id: "trash", title: "Trash pickup", cadence: "Weekly", next: "Tomorrow 7 AM", category: "Routine" },
  { id: "recycle", title: "Recycling pickup", cadence: "Biweekly", next: "In 6 days", category: "Routine" },
  { id: "hvac-filter", title: "HVAC filter swap (upstairs)", cadence: "Every 3 mo", next: "In 6 days", category: "Maintenance" },
  { id: "smoke-test", title: "Smoke detector test", cadence: "Monthly", next: "In 12 days", category: "Safety" },
  { id: "hvac-tune", title: "Annual HVAC tune-up", cadence: "Yearly", next: "In 2 months", category: "Maintenance" },
  { id: "gutter", title: "Gutter clean", cadence: "Yearly", next: "In 4 months", category: "Maintenance" },
  { id: "pest", title: "Pest control quarterly", cadence: "Every 3 mo", next: "In 4 weeks", category: "Service" },
  { id: "auto-reg", title: "Auto registration renewal", cadence: "Yearly", next: "In 5 months", category: "DMV" },
  { id: "prop-tax", title: "Property tax due", cadence: "Yearly", next: "In 5 months", category: "Tax" },
];

export const PEOPLE: Member[] = [
  { id: "garrett", type: "family", name: "Garrett", detail: "Primary · DOB 1990 · Type 1 diabetes (Dexcom + Omnipod)" },
  { id: "alyssa", type: "family", name: "Alyssa", detail: "Partner · DOB 1992" },
  { id: "dog-1", type: "pet", name: "Stella", detail: "Lab mix · age 4 · Hill's Science 30lb monthly · vet Aug 15" },
  { id: "neighbor", type: "emergency", name: "Neighbor (Pat)", detail: "Has spare key · (512) 555-0100" },
  { id: "primary-doc", type: "emergency", name: "Dr. Stephanie Lee, MD", detail: "Primary care · (512) 555-0009" },
  { id: "endocrinologist", type: "emergency", name: "Dr. Reyes (Endo)", detail: "Diabetes specialist · (512) 555-0010" },
  { id: "petsitter", type: "emergency", name: "Megan (pet sitter)", detail: "Vetted · $40/day · last booked 2 weeks ago" },
];

export const ACTIVITY = [
  { ts: "Just now", text: "🟢 Phyn detected no anomaly · weekly water-usage report ready" },
  { ts: "2h ago", text: "🟠 Upstairs HVAC filter due in 6 days · auto-ordered MERV-13 from Amazon" },
  { ts: "5h ago", text: "✅ Green Yards completed lawn service · invoiced $65" },
  { ts: "Yesterday", text: "📦 Davines shampoo delivered · inventory level updated to 100%" },
  { ts: "Yesterday", text: "⚠️ Peacock subscription unused for 47 days · review suggested" },
  { ts: "2 days ago", text: "🔧 Stat Plumbing scheduled for Aug 3 (faucet repair, kitchen)" },
  { ts: "3 days ago", text: "🌡️ HVAC tune-up reminder sent to Austin AC (annual due Sep 14)" },
];
