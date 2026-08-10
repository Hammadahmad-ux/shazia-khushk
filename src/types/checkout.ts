import type { CheckoutLineItemIssue, CheckoutOrderErrorCode } from "@/lib/commerce/types";
import type { Currency } from "@/types/product";

export type PaymentMethodId = "cod" | "online";

export interface CheckoutContact {
  fullName: string;
  mobile: string;
  email: string | null;
}

export interface CheckoutAddress {
  addressLine: string;
  apartment: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
}

export interface CheckoutLineItemPayload {
  id: string;
  productId: string;
  productSlug: string;
  title: string;
  variantLabel: string | null;
  quantity: number;
  unitPriceMinor: number;
  currency: Currency;
}

export interface CheckoutPayload {
  /** Client-generated once per checkout attempt so a retried/duplicated submission cannot create two orders. */
  idempotencyKey: string;
  contact: CheckoutContact;
  address: CheckoutAddress;
  paymentMethod: PaymentMethodId;
  items: readonly CheckoutLineItemPayload[];
  /**
   * Optimistic display total only. The server reloads authoritative
   * product/variant prices and recalculates everything -- this value
   * (and every item's unitPriceMinor) is never trusted for pricing.
   */
  subtotalMinor: number;
  currency: Currency;
  submittedAt: string;
}

export type CheckoutSubmissionResult =
  | { status: "success"; orderNumber: string; confirmationToken: string }
  | {
      status: "error";
      code: CheckoutOrderErrorCode;
      message: string;
      itemIssues?: readonly CheckoutLineItemIssue[];
    };
