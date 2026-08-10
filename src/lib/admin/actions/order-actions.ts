"use server";

import { revalidatePath } from "next/cache";

import { getAuthorizedAdmin } from "@/lib/admin/require-admin";
import { FULFILLMENT_STATUSES, updateOrderFulfillmentStatus, type FulfillmentStatus } from "@/lib/admin/orders/order-repository";

export type OrderActionResult = { status: "success" } | { status: "error"; message: string };

export async function updateFulfillmentStatus(id: string, status: FulfillmentStatus): Promise<OrderActionResult> {
  const admin = await getAuthorizedAdmin();
  if (!admin) return { status: "error", message: "Not authorized." };

  if (!FULFILLMENT_STATUSES.includes(status)) {
    return { status: "error", message: "Invalid fulfillment status." };
  }

  try {
    await updateOrderFulfillmentStatus(id, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { status: "success" };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to update order." };
  }
}
