// Single source of truth for confirmed client business settings. No
// secrets live here, so it is safe to import from both server and
// client code (the WhatsApp button, the shipping/returns page, and
// shipping-config.ts all read from this one file instead of repeating
// these values).

export const brand = {
  name: "Shazia Khushk",
} as const;

export const support = {
  email: "teamshaziakhushk@gmail.com",
} as const;

export const whatsapp = {
  number: "+923323637086",
  defaultMessage: "Hi Shazia Khushk, I need help with my order.",
} as const;

export function getWhatsAppUrl(message: string = whatsapp.defaultMessage): string {
  const digits = whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const currency = "PKR" as const;

export const shipping = {
  /** PKR 199 flat rate, in minor units (100 minor units = PKR 1). Same rate for every city; no free-shipping threshold. */
  flatRateMinor: 19900,
  couriers: ["TCS", "Leopards"] as const,
} as const;

export const payments = {
  codEnabled: true,
  onlineEnabled: false,
} as const;

export const returns = {
  windowDays: 7,
} as const;
