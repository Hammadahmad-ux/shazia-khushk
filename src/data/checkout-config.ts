import type { PaymentMethodId } from "@/types/checkout";

export interface PaymentMethodConfig {
  id: PaymentMethodId;
  label: string;
  description: string;
  enabled: boolean;
}

// Online payment is intentionally omitted from this customer-facing
// list (Cash on Delivery is the only confirmed live method). The
// backend stays provider-neutral -- PaymentMethodId still has an
// "online" member -- so adding it back here is the only step needed
// once a provider is selected.
export const paymentMethods: readonly PaymentMethodConfig[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives.",
    enabled: true,
  },
];

export const pakistaniProvinces: readonly string[] = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory",
];
