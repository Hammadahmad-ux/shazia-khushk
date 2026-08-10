import { shipping } from "./business-config";

// Confirmed shipping rule: flat PKR 199 nationwide, no city pricing, no
// free-shipping threshold, no courier-specific rate, no invented ETA.
// Keeping this as its own function (rather than inlining the constant
// into checkout-service.ts) is what lets city/courier-specific pricing
// replace it later without changing that call site.

export interface ShippingInput {
  city: string;
  subtotalMinor: number;
}

export interface ShippingResolution {
  status: "flat_rate";
  amountMinor: number;
}

export function resolveShipping(input: ShippingInput): ShippingResolution {
  void input;
  return { status: "flat_rate", amountMinor: shipping.flatRateMinor };
}
