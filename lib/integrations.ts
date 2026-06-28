// Catalog of every supported (or planned) integration. The dashboard reads
// this to render connector cards. Each integration has a status flag —
// `live`, `stub`, or `planned` — so the UI can show "Connect" vs "Coming soon".

export type IntegrationStatus = "live" | "stub" | "planned";
export type IntegrationCategory =
  | "hvac" | "lights" | "plugs" | "sprinkler" | "security"
  | "lock" | "doorbell" | "garage" | "appliance" | "pool"
  | "water" | "energy" | "solar" | "smoke" | "blinds"
  | "voice" | "ev" | "amazon" | "vendor" | "calendar";

export type Integration = {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  description: string;
  logoEmoji: string;
};

export const INTEGRATIONS: Integration[] = [
  // HVAC
  { id: "ecobee", name: "Ecobee", category: "hvac", status: "stub", description: "Thermostat schedules + runtime + alerts", logoEmoji: "🌡️" },
  { id: "nest-thermostat", name: "Nest Thermostat", category: "hvac", status: "stub", description: "Google Nest HVAC control", logoEmoji: "🌡️" },
  { id: "honeywell", name: "Honeywell Home", category: "hvac", status: "planned", description: "T-series thermostats", logoEmoji: "🌡️" },

  // Lights
  { id: "hue", name: "Philips Hue", category: "lights", status: "stub", description: "Smart bulbs + scenes", logoEmoji: "💡" },
  { id: "lifx", name: "LIFX", category: "lights", status: "planned", description: "Color bulbs, no hub needed", logoEmoji: "💡" },
  { id: "lutron", name: "Lutron Caséta", category: "lights", status: "planned", description: "In-wall dimmers + Pico remotes", logoEmoji: "💡" },

  // Smart plugs
  { id: "kasa", name: "TP-Link Kasa", category: "plugs", status: "stub", description: "Smart plugs + switches + power monitoring", logoEmoji: "🔌" },
  { id: "wemo", name: "Wemo", category: "plugs", status: "planned", description: "Belkin smart plugs", logoEmoji: "🔌" },
  { id: "wyze", name: "Wyze", category: "plugs", status: "planned", description: "Budget smart plugs + cameras", logoEmoji: "🔌" },

  // Sprinklers
  { id: "rachio", name: "Rachio", category: "sprinkler", status: "stub", description: "Smart irrigation + weather skip", logoEmoji: "💧" },
  { id: "rainbird", name: "Rain Bird", category: "sprinkler", status: "planned", description: "Pro irrigation controllers", logoEmoji: "💧" },

  // Security
  { id: "ring", name: "Ring", category: "security", status: "stub", description: "Cameras + doorbells + alarm", logoEmoji: "🔔" },
  { id: "arlo", name: "Arlo", category: "security", status: "planned", description: "Wireless cameras", logoEmoji: "📹" },
  { id: "adt", name: "ADT", category: "security", status: "planned", description: "Professional monitoring", logoEmoji: "🛡️" },

  // Locks
  { id: "august", name: "August", category: "lock", status: "stub", description: "Smart lock + access codes for vendors", logoEmoji: "🔐" },
  { id: "schlage", name: "Schlage Encode", category: "lock", status: "planned", description: "WiFi smart lock", logoEmoji: "🔐" },

  // Garage
  { id: "myq", name: "MyQ", category: "garage", status: "stub", description: "Garage door open/close + history", logoEmoji: "🚗" },

  // Appliances
  { id: "lg-thinq", name: "LG ThinQ", category: "appliance", status: "stub", description: "Washer/dryer/fridge runtime + faults", logoEmoji: "🧺" },
  { id: "samsung", name: "Samsung SmartThings", category: "appliance", status: "planned", description: "Connected appliances + hub", logoEmoji: "🧺" },
  { id: "bosch", name: "Bosch Home Connect", category: "appliance", status: "planned", description: "Dishwasher/oven/washer", logoEmoji: "🧺" },

  // Pool
  { id: "pentair", name: "Pentair", category: "pool", status: "planned", description: "Pump + heater + lighting", logoEmoji: "🏊" },
  { id: "hayward", name: "Hayward Omnilogic", category: "pool", status: "planned", description: "Pool automation", logoEmoji: "🏊" },

  // Water leak
  { id: "phyn", name: "Phyn", category: "water", status: "stub", description: "Whole-home water leak detection", logoEmoji: "🚰" },
  { id: "flo", name: "Flo by Moen", category: "water", status: "planned", description: "Smart shutoff valve", logoEmoji: "🚰" },

  // Energy
  { id: "sense", name: "Sense Energy", category: "energy", status: "stub", description: "Per-device energy disaggregation", logoEmoji: "⚡" },
  { id: "emporia", name: "Emporia Vue", category: "energy", status: "planned", description: "Per-circuit monitoring", logoEmoji: "⚡" },

  // Solar
  { id: "enphase", name: "Enphase", category: "solar", status: "planned", description: "Microinverter production + IQ Battery", logoEmoji: "☀️" },
  { id: "tesla-powerwall", name: "Tesla Powerwall", category: "solar", status: "planned", description: "Home battery + solar", logoEmoji: "🔋" },

  // Smoke / CO
  { id: "nest-protect", name: "Nest Protect", category: "smoke", status: "planned", description: "Smoke + CO + battery monitoring", logoEmoji: "🚨" },

  // Blinds
  { id: "lutron-serena", name: "Lutron Serena", category: "blinds", status: "planned", description: "Motorized shades + auto schedule", logoEmoji: "🪟" },

  // Voice / hubs
  { id: "alexa", name: "Amazon Alexa", category: "voice", status: "stub", description: "Voice control + Alexa routines", logoEmoji: "🎤" },
  { id: "google-home", name: "Google Home", category: "voice", status: "planned", description: "Voice + Google routines", logoEmoji: "🎤" },
  { id: "homekit", name: "Apple HomeKit", category: "voice", status: "planned", description: "HomeKit + Matter routing", logoEmoji: "🏠" },
  { id: "home-assistant", name: "Home Assistant", category: "voice", status: "planned", description: "Open-source hub bridging everything", logoEmoji: "🧠" },

  // EV
  { id: "tesla-wall", name: "Tesla Wall Connector", category: "ev", status: "planned", description: "EV charging + scheduling", logoEmoji: "⚡" },

  // Reorder / commerce
  { id: "amazon", name: "Amazon", category: "amazon", status: "stub", description: "Subscribe & Save + auto-reorder consumables", logoEmoji: "📦" },
  { id: "chewy", name: "Chewy Autoship", category: "amazon", status: "planned", description: "Pet food + supplies recurring", logoEmoji: "🐕" },
  { id: "instacart", name: "Instacart", category: "amazon", status: "planned", description: "Grocery delivery scheduling", logoEmoji: "🛒" },

  // Vendor coordination
  { id: "calendar-sync", name: "Google Calendar", category: "calendar", status: "stub", description: "Two-way sync of service appointments", logoEmoji: "📅" },
  { id: "twilio", name: "Twilio SMS", category: "vendor", status: "stub", description: "Auto-text vendors when ticket opens", logoEmoji: "💬" },
];

export const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  hvac: "Climate", lights: "Lighting", plugs: "Plugs & Switches",
  sprinkler: "Irrigation", security: "Security & Cameras", lock: "Locks",
  doorbell: "Doorbells", garage: "Garage", appliance: "Appliances",
  pool: "Pool & Spa", water: "Water Leak", energy: "Energy",
  solar: "Solar & Battery", smoke: "Smoke / CO", blinds: "Window Coverings",
  voice: "Voice & Hubs", ev: "EV Charging", amazon: "Reorder / Commerce",
  vendor: "Vendor Tools", calendar: "Calendar",
};
