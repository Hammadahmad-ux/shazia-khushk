import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { CommerceRepository, CreateOrderRecord, CreatedOrderReference } from "./commerce-repository";
import type { OrderConfirmationView, VariantLookupKey, VariantResolution } from "./types";

interface ProductVariantRow {
  id: string;
  sku: string;
  variant_label: string | null;
  price_minor: number | null;
  active: boolean;
  // PostgREST returns this as a single object (not an array), because
  // inventory.variant_id is both the primary key and the foreign key,
  // so it correctly infers a one-to-one relation. Verified against the
  // live project -- do not "fix" this back to an array type.
  inventory: { quantity_available: number } | null;
}

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  product_variants: ProductVariantRow[];
}

interface OrderItemRow {
  product_title: string;
  variant_label: string | null;
  quantity: number;
  unit_price_minor: number;
  line_total_minor: number;
}

interface OrderConfirmationRow {
  order_number: string;
  created_at: string;
  subtotal_minor: number;
  shipping_minor: number;
  shipping_status: "unresolved" | "flat_rate";
  total_minor: number;
  currency: "PKR";
  payment_method: "cash_on_delivery" | "online";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  contact_full_name: string;
  contact_mobile: string;
  shipping_address: {
    address_line: string;
    apartment: string | null;
    city: string;
    province: string | null;
    postal_code: string | null;
  };
  order_items: OrderItemRow[];
}

/**
 * Production repository backed by Supabase/Postgres. Requires a live
 * project (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) and is therefore
 * not covered by the unit tests in tests/commerce/ -- those exercise
 * checkout-service.ts against an in-memory fake of CommerceRepository
 * instead. This file's SQL/RPC shape matches
 * supabase/migrations/*.sql exactly.
 */
export class SupabaseCommerceRepository implements CommerceRepository {
  constructor(private readonly client: SupabaseClient) {}

  async resolveVariants(keys: readonly VariantLookupKey[]): Promise<readonly VariantResolution[]> {
    if (keys.length === 0) return [];

    const slugs = Array.from(new Set(keys.map((key) => key.productSlug)));

    const { data, error } = await this.client
      .from("products")
      .select(
        `id, slug, title, active,
         product_variants ( id, sku, variant_label, price_minor, active, inventory ( quantity_available ) )`,
      )
      .in("slug", slugs);

    if (error) throw new Error(`Failed to resolve product variants: ${error.message}`);

    const productsBySlug = new Map((data as unknown as ProductRow[] | null ?? []).map((product) => [product.slug, product]));

    return keys.map((key) => {
      const product = productsBySlug.get(key.productSlug);
      const variant = product?.product_variants.find((candidate) => (candidate.variant_label ?? null) === key.variantLabel);

      if (!product || !variant) {
        return { found: false, key };
      }

      return {
        found: true,
        key,
        snapshot: {
          productId: product.id,
          productSlug: product.slug,
          productTitle: product.title,
          variantId: variant.id,
          sku: variant.sku,
          variantLabel: variant.variant_label ?? null,
          priceMinor: variant.price_minor,
          productActive: product.active,
          variantActive: variant.active,
          quantityAvailable: variant.inventory?.quantity_available ?? 0,
        },
      };
    });
  }

  async findOrderByIdempotencyKey(key: string): Promise<CreatedOrderReference | null> {
    const { data, error } = await this.client
      .from("orders")
      .select("order_number, confirmation_token")
      .eq("idempotency_key", key)
      .maybeSingle();

    if (error) throw new Error(`Failed to check idempotency key: ${error.message}`);
    if (!data) return null;

    return { orderNumber: data.order_number as string, confirmationToken: data.confirmation_token as string };
  }

  async createOrder(record: CreateOrderRecord): Promise<CreatedOrderReference> {
    const { data, error } = await this.client.rpc("create_order", {
      payload: {
        idempotency_key: record.idempotencyKey,
        contact: {
          full_name: record.contact.fullName,
          mobile: record.contact.mobile,
          email: record.contact.email,
        },
        address: {
          address_line: record.address.addressLine,
          apartment: record.address.apartment,
          city: record.address.city,
          province: record.address.province,
          postal_code: record.address.postalCode,
        },
        payment_method: record.paymentMethod,
        currency: record.currency,
        subtotal_minor: record.subtotalMinor,
        shipping_minor: record.shippingMinor,
        shipping_status: record.shippingStatus,
        total_minor: record.totalMinor,
        items: record.items.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId,
          product_title: item.productTitle,
          sku: item.sku,
          variant_label: item.variantLabel,
          unit_price_minor: item.unitPriceMinor,
          quantity: item.quantity,
          line_total_minor: item.lineTotalMinor,
        })),
      },
    });

    if (error) throw new Error(`Failed to create order: ${error.message}`);

    const result = data as { order_number: string; confirmation_token: string };
    return { orderNumber: result.order_number, confirmationToken: result.confirmation_token };
  }

  async getOrderConfirmation(orderNumber: string, token: string): Promise<OrderConfirmationView | null> {
    const { data, error } = await this.client
      .from("orders")
      .select(
        `order_number, created_at, subtotal_minor, shipping_minor, shipping_status, total_minor, currency,
         payment_method, payment_status, contact_full_name, contact_mobile, shipping_address,
         order_items ( product_title, variant_label, quantity, unit_price_minor, line_total_minor )`,
      )
      .eq("order_number", orderNumber)
      .eq("confirmation_token", token)
      .maybeSingle();

    if (error) throw new Error(`Failed to load order confirmation: ${error.message}`);
    if (!data) return null;

    const order = data as unknown as OrderConfirmationRow;

    return {
      orderNumber: order.order_number,
      createdAt: order.created_at,
      items: order.order_items.map((item) => ({
        productTitle: item.product_title,
        variantLabel: item.variant_label,
        quantity: item.quantity,
        unitPriceMinor: item.unit_price_minor,
        lineTotalMinor: item.line_total_minor,
      })),
      subtotalMinor: order.subtotal_minor,
      shippingMinor: order.shipping_minor,
      shippingStatus: order.shipping_status,
      totalMinor: order.total_minor,
      currency: order.currency,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      contactFullName: order.contact_full_name,
      contactMobile: order.contact_mobile,
      shippingAddress: {
        addressLine: order.shipping_address.address_line,
        apartment: order.shipping_address.apartment,
        city: order.shipping_address.city,
        province: order.shipping_address.province,
        postalCode: order.shipping_address.postal_code,
      },
    };
  }
}
