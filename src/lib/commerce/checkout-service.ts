import type { CommerceRepository } from "./commerce-repository";
import { resolveShipping } from "./shipping-config";
import type {
  CheckoutLineItemIssue,
  CheckoutOrderErrorCode,
  CreateCheckoutOrderInput,
  CreateCheckoutOrderResult,
} from "./types";

const MAX_QUANTITY_PER_LINE = 20;
const MIN_FULL_NAME_LENGTH = 2;
const MIN_ADDRESS_LENGTH = 5;
const MIN_CITY_LENGTH = 2;
const PK_MOBILE_PATTERN = /^\+923\d{9}$/;
const AVAILABLE_PAYMENT_METHODS: readonly CreateCheckoutOrderInput["paymentMethod"][] = ["cash_on_delivery"];

function lineIssue(
  productSlug: string,
  variantLabel: string | null,
  code: CheckoutOrderErrorCode,
  message: string,
): CheckoutLineItemIssue {
  return { productSlug, variantLabel, code, message };
}

function resolutionKey(productSlug: string, variantLabel: string | null): string {
  return `${productSlug}::${variantLabel ?? ""}`;
}

/**
 * Server-side order creation. Never trusts client-supplied prices,
 * subtotal, or item identity beyond product slug + variant label +
 * quantity: everything else is reloaded from the repository (backed by
 * Supabase in production, an in-memory fake in tests) and recalculated
 * here.
 */
export async function createCheckoutOrder(
  repository: CommerceRepository,
  input: CreateCheckoutOrderInput,
): Promise<CreateCheckoutOrderResult> {
  if (input.idempotencyKey) {
    const existing = await repository.findOrderByIdempotencyKey(input.idempotencyKey);
    if (existing) {
      return { status: "success", orderNumber: existing.orderNumber, confirmationToken: existing.confirmationToken };
    }
  }

  if (input.items.length === 0) {
    return { status: "error", code: "empty_cart", message: "Your cart is empty." };
  }

  if (input.contact.fullName.trim().length < MIN_FULL_NAME_LENGTH) {
    return { status: "error", code: "invalid_contact", message: "Enter a valid full name." };
  }

  if (!PK_MOBILE_PATTERN.test(input.contact.mobile)) {
    return { status: "error", code: "invalid_contact", message: "Enter a valid Pakistani mobile number." };
  }

  if (input.address.addressLine.trim().length < MIN_ADDRESS_LENGTH || input.address.city.trim().length < MIN_CITY_LENGTH) {
    return { status: "error", code: "invalid_address", message: "Enter a valid delivery address." };
  }

  if (!AVAILABLE_PAYMENT_METHODS.includes(input.paymentMethod)) {
    return {
      status: "error",
      code: "payment_method_unavailable",
      message: "The selected payment method is not available yet.",
    };
  }

  for (const line of input.items) {
    if (!Number.isInteger(line.quantity) || line.quantity <= 0 || line.quantity > MAX_QUANTITY_PER_LINE) {
      return {
        status: "error",
        code: "invalid_quantity",
        message: "One of the items in your cart has an invalid quantity.",
        itemIssues: [lineIssue(line.key.productSlug, line.key.variantLabel, "invalid_quantity", "Invalid quantity.")],
      };
    }
  }

  const resolutions = await repository.resolveVariants(input.items.map((line) => line.key));
  const byKey = new Map(resolutions.map((resolution) => [resolutionKey(resolution.key.productSlug, resolution.key.variantLabel), resolution]));

  const issues: CheckoutLineItemIssue[] = [];
  const resolvedLines: {
    productId: string;
    variantId: string;
    productTitle: string;
    sku: string;
    variantLabel: string | null;
    unitPriceMinor: number;
    quantity: number;
    lineTotalMinor: number;
  }[] = [];

  for (const line of input.items) {
    const resolution = byKey.get(resolutionKey(line.key.productSlug, line.key.variantLabel));

    if (!resolution || !resolution.found) {
      issues.push(lineIssue(line.key.productSlug, line.key.variantLabel, "unknown_product", "This item is no longer available."));
      continue;
    }

    const { snapshot } = resolution;

    if (!snapshot.productActive || !snapshot.variantActive) {
      issues.push(
        lineIssue(line.key.productSlug, line.key.variantLabel, "inactive_product", "This item is not currently available for purchase."),
      );
      continue;
    }

    if (snapshot.priceMinor === null) {
      issues.push(lineIssue(line.key.productSlug, line.key.variantLabel, "missing_price", "This item does not have a confirmed price yet."));
      continue;
    }

    if (snapshot.quantityAvailable < line.quantity) {
      issues.push(
        lineIssue(
          line.key.productSlug,
          line.key.variantLabel,
          "insufficient_stock",
          snapshot.quantityAvailable > 0 ? `Only ${snapshot.quantityAvailable} left in stock.` : "This item is out of stock.",
        ),
      );
      continue;
    }

    resolvedLines.push({
      productId: snapshot.productId,
      variantId: snapshot.variantId,
      productTitle: snapshot.productTitle,
      sku: snapshot.sku,
      variantLabel: snapshot.variantLabel,
      unitPriceMinor: snapshot.priceMinor,
      quantity: line.quantity,
      lineTotalMinor: snapshot.priceMinor * line.quantity,
    });
  }

  if (issues.length > 0) {
    return {
      status: "error",
      code: issues[0].code,
      message: "Some items in your cart could not be ordered.",
      itemIssues: issues,
    };
  }

  const subtotalMinor = resolvedLines.reduce((total, line) => total + line.lineTotalMinor, 0);
  const shipping = resolveShipping({ city: input.address.city, subtotalMinor });
  const totalMinor = subtotalMinor + shipping.amountMinor;

  try {
    const created = await repository.createOrder({
      idempotencyKey: input.idempotencyKey,
      contact: input.contact,
      address: input.address,
      paymentMethod: input.paymentMethod,
      currency: input.currency,
      subtotalMinor,
      shippingMinor: shipping.amountMinor,
      shippingStatus: shipping.status,
      totalMinor,
      items: resolvedLines,
    });

    return { status: "success", orderNumber: created.orderNumber, confirmationToken: created.confirmationToken };
  } catch (error) {
    if (error instanceof Error && error.message.includes("insufficient_stock")) {
      return {
        status: "error",
        code: "insufficient_stock",
        message: "One of the items in your cart just sold out. Please review your cart and try again.",
      };
    }

    return { status: "error", code: "unexpected_error", message: "We couldn't place your order. Please try again." };
  }
}
