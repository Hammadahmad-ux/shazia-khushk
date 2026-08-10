import type {
  Currency,
  OrderConfirmationView,
  PaymentMethod,
  VariantLookupKey,
  VariantResolution,
} from "./types";

export interface CreateOrderLineRecord {
  productId: string;
  variantId: string;
  productTitle: string;
  sku: string;
  variantLabel: string | null;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
}

export interface CreateOrderRecord {
  idempotencyKey: string | null;
  contact: {
    fullName: string;
    mobile: string;
    email: string | null;
  };
  address: {
    addressLine: string;
    apartment: string | null;
    city: string;
    province: string | null;
    postalCode: string | null;
  };
  paymentMethod: PaymentMethod;
  currency: Currency;
  subtotalMinor: number;
  shippingMinor: number;
  shippingStatus: "unresolved" | "flat_rate";
  totalMinor: number;
  items: readonly CreateOrderLineRecord[];
}

export interface CreatedOrderReference {
  orderNumber: string;
  confirmationToken: string;
}

/**
 * Boundary between the checkout service (business rules, fully unit
 * tested against an in-memory fake) and the real Supabase-backed
 * implementation (src/lib/commerce/supabase-commerce-repository.ts,
 * which needs a live database and is not unit tested here).
 */
export interface CommerceRepository {
  resolveVariants(keys: readonly VariantLookupKey[]): Promise<readonly VariantResolution[]>;
  findOrderByIdempotencyKey(key: string): Promise<CreatedOrderReference | null>;
  createOrder(record: CreateOrderRecord): Promise<CreatedOrderReference>;
  getOrderConfirmation(orderNumber: string, token: string): Promise<OrderConfirmationView | null>;
}
