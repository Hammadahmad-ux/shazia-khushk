// Pure constants only (no server-only imports), so the client-side
// order status form can import them without pulling the Supabase
// server client into the browser bundle.

export type FulfillmentStatus = "unfulfilled" | "processing" | "shipped" | "delivered" | "cancelled";

export const FULFILLMENT_STATUS_LABEL: Record<FulfillmentStatus, string> = {
  unfulfilled: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const FULFILLMENT_STATUSES: readonly FulfillmentStatus[] = ["unfulfilled", "processing", "shipped", "delivered", "cancelled"];
