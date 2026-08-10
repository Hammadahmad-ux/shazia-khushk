// Server-side commerce domain types. Deliberately import-free of the
// project's "@/..." path alias so this module (and everything else in
// src/lib/commerce/) can be unit-tested with plain `node --test`
// without a bundler or path-alias loader. The Next.js-integrated
// boundary (src/lib/checkout/submit-checkout.ts) maps between the
// browser-facing CheckoutPayload type and CreateCheckoutOrderInput here.

export type Currency = "PKR";

export type PaymentMethod = "cash_on_delivery" | "online";

export interface VariantLookupKey {
  productSlug: string;
  variantLabel: string | null;
}

export interface VariantSnapshot {
  productId: string;
  productSlug: string;
  productTitle: string;
  variantId: string;
  sku: string;
  variantLabel: string | null;
  priceMinor: number | null;
  productActive: boolean;
  variantActive: boolean;
  quantityAvailable: number;
}

export type VariantResolution =
  | { found: true; key: VariantLookupKey; snapshot: VariantSnapshot }
  | { found: false; key: VariantLookupKey };

export interface RequestedLineItem {
  key: VariantLookupKey;
  quantity: number;
}

export interface CheckoutContactInput {
  fullName: string;
  mobile: string;
  email: string | null;
}

export interface CheckoutAddressInput {
  addressLine: string;
  apartment: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
}

export interface CreateCheckoutOrderInput {
  idempotencyKey: string | null;
  contact: CheckoutContactInput;
  address: CheckoutAddressInput;
  paymentMethod: PaymentMethod;
  currency: Currency;
  items: readonly RequestedLineItem[];
}

export type CheckoutOrderErrorCode =
  | "empty_cart"
  | "unknown_product"
  | "inactive_product"
  | "missing_price"
  | "insufficient_stock"
  | "invalid_quantity"
  | "invalid_contact"
  | "invalid_address"
  | "payment_method_unavailable"
  | "backend_not_configured"
  | "unexpected_error";

export interface CheckoutLineItemIssue {
  productSlug: string;
  variantLabel: string | null;
  code: CheckoutOrderErrorCode;
  message: string;
}

export type CreateCheckoutOrderResult =
  | { status: "success"; orderNumber: string; confirmationToken: string }
  | {
      status: "error";
      code: CheckoutOrderErrorCode;
      message: string;
      itemIssues?: readonly CheckoutLineItemIssue[];
    };

export interface OrderConfirmationLineItem {
  productTitle: string;
  variantLabel: string | null;
  quantity: number;
  unitPriceMinor: number;
  lineTotalMinor: number;
}

export interface OrderConfirmationShippingAddress {
  addressLine: string;
  apartment: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
}

export interface OrderConfirmationView {
  orderNumber: string;
  createdAt: string;
  items: readonly OrderConfirmationLineItem[];
  subtotalMinor: number;
  shippingMinor: number;
  shippingStatus: "unresolved" | "flat_rate";
  totalMinor: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  contactFullName: string;
  contactMobile: string;
  shippingAddress: OrderConfirmationShippingAddress;
}
