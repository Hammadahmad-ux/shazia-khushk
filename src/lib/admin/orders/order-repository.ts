import "server-only";

import { getServerSupabaseClient } from "@/lib/supabase/server-client";
import type { Currency } from "@/types/product";
import type { FulfillmentStatus } from "./fulfillment-status";

export type { FulfillmentStatus } from "./fulfillment-status";
export { FULFILLMENT_STATUSES, FULFILLMENT_STATUS_LABEL } from "./fulfillment-status";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderListRow {
  id: string;
  orderNumber: string;
  contactFullName: string;
  createdAt: string;
  totalMinor: number;
  currency: Currency;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
}

export interface OrderDetailItem {
  productTitle: string;
  sku: string;
  variantLabel: string | null;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  createdAt: string;
  contactFullName: string;
  contactMobile: string;
  contactEmail: string | null;
  shippingAddress: {
    addressLine: string;
    apartment: string | null;
    city: string;
    province: string | null;
    postalCode: string | null;
  };
  subtotalMinor: number;
  shippingMinor: number;
  totalMinor: number;
  currency: Currency;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customerNotes: string | null;
  items: readonly OrderDetailItem[];
}

interface OrderListQueryRow {
  id: string;
  order_number: string;
  contact_full_name: string;
  created_at: string;
  total_minor: number;
  currency: Currency;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
}

interface OrderDetailQueryRow extends OrderListQueryRow {
  contact_mobile: string;
  contact_email: string | null;
  shipping_address: { address_line: string; apartment: string | null; city: string; province: string | null; postal_code: string | null };
  subtotal_minor: number;
  shipping_minor: number;
  payment_method: string;
  customer_notes: string | null;
  order_items: { product_title: string; sku: string; variant_label: string | null; unit_price_minor: number; quantity: number; line_total_minor: number }[];
}

export async function listOrders(): Promise<readonly OrderListRow[]> {
  const client = getServerSupabaseClient();
  const { data, error } = await client
    .from("orders")
    .select("id, order_number, contact_full_name, created_at, total_minor, currency, payment_status, fulfillment_status")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to list orders: ${error.message}`);

  return ((data as OrderListQueryRow[] | null) ?? []).map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    contactFullName: row.contact_full_name,
    createdAt: row.created_at,
    totalMinor: row.total_minor,
    currency: row.currency,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
  }));
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const client = getServerSupabaseClient();
  const { data, error } = await client
    .from("orders")
    .select(
      `id, order_number, created_at, contact_full_name, contact_mobile, contact_email, shipping_address,
       subtotal_minor, shipping_minor, total_minor, currency, payment_method, payment_status, fulfillment_status, customer_notes,
       order_items ( product_title, sku, variant_label, unit_price_minor, quantity, line_total_minor )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load order: ${error.message}`);
  if (!data) return null;

  const row = data as unknown as OrderDetailQueryRow;

  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    contactFullName: row.contact_full_name,
    contactMobile: row.contact_mobile,
    contactEmail: row.contact_email,
    shippingAddress: {
      addressLine: row.shipping_address.address_line,
      apartment: row.shipping_address.apartment,
      city: row.shipping_address.city,
      province: row.shipping_address.province,
      postalCode: row.shipping_address.postal_code,
    },
    subtotalMinor: row.subtotal_minor,
    shippingMinor: row.shipping_minor,
    totalMinor: row.total_minor,
    currency: row.currency,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    customerNotes: row.customer_notes,
    items: row.order_items.map((item) => ({
      productTitle: item.product_title,
      sku: item.sku,
      variantLabel: item.variant_label,
      unitPriceMinor: item.unit_price_minor,
      quantity: item.quantity,
      lineTotalMinor: item.line_total_minor,
    })),
  };
}

export async function updateOrderFulfillmentStatus(id: string, status: FulfillmentStatus): Promise<void> {
  const client = getServerSupabaseClient();
  // Only fulfillment_status is writable here -- monetary fields
  // (subtotal/shipping/total) and payment_status are never touched by
  // this path, matching "the browser must never control totals."
  const { error } = await client.from("orders").update({ fulfillment_status: status }).eq("id", id);
  if (error) throw new Error(`Failed to update fulfillment status: ${error.message}`);
}
