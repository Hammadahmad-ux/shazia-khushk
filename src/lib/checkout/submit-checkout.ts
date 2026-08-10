"use server";

import { createCheckoutOrder } from "@/lib/commerce/checkout-service";
import { SupabaseCommerceRepository } from "@/lib/commerce/supabase-commerce-repository";
import type { PaymentMethod } from "@/lib/commerce/types";
import { getServerSupabaseClient } from "@/lib/supabase/server-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { CheckoutPayload, CheckoutSubmissionResult, PaymentMethodId } from "@/types/checkout";
import { normalizePakistaniMobile } from "@/utils/checkout-validation";

const PAYMENT_METHOD_MAP: Record<PaymentMethodId, PaymentMethod> = {
  cod: "cash_on_delivery",
  online: "online",
};

/**
 * Server Action: the checkout UI's only integration point with order
 * creation. Re-validates and recalculates everything server-side via
 * createCheckoutOrder() -- see src/lib/commerce/checkout-service.ts for
 * the actual business rules and tests/commerce/ for their coverage.
 * Never trusts payload.subtotalMinor or any item's unitPriceMinor.
 */
export async function submitCheckout(payload: CheckoutPayload): Promise<CheckoutSubmissionResult> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[checkout] Supabase is not configured; payload received but not persisted.", payload);
    }

    return {
      status: "error",
      code: "backend_not_configured",
      message:
        "Order processing is not connected yet for this deployment. Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are not configured.",
    };
  }

  const normalizedMobile = normalizePakistaniMobile(payload.contact.mobile) ?? payload.contact.mobile;
  const repository = new SupabaseCommerceRepository(getServerSupabaseClient());

  return createCheckoutOrder(repository, {
    idempotencyKey: payload.idempotencyKey,
    contact: {
      fullName: payload.contact.fullName,
      mobile: normalizedMobile,
      email: payload.contact.email,
    },
    address: payload.address,
    paymentMethod: PAYMENT_METHOD_MAP[payload.paymentMethod],
    currency: payload.currency,
    items: payload.items.map((item) => ({
      key: { productSlug: item.productSlug, variantLabel: item.variantLabel },
      quantity: item.quantity,
    })),
  });
}
