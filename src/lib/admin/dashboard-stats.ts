import "server-only";

import { getServerSupabaseClient } from "@/lib/supabase/server-client";

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockVariants: number;
  pendingOrders: number;
}

interface InventoryRow {
  quantity_available: number;
  low_stock_threshold: number | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const client = getServerSupabaseClient();

  const [totalProducts, activeProducts, inventoryRows, pendingOrders] = await Promise.all([
    client.from("products").select("id", { count: "exact", head: true }),
    client.from("products").select("id", { count: "exact", head: true }).eq("active", true),
    client.from("inventory").select("quantity_available, low_stock_threshold"),
    client.from("orders").select("id", { count: "exact", head: true }).eq("fulfillment_status", "unfulfilled"),
  ]);

  const lowStockVariants = ((inventoryRows.data as InventoryRow[] | null) ?? []).filter(
    (row) => row.low_stock_threshold !== null && row.quantity_available <= row.low_stock_threshold,
  ).length;

  return {
    totalProducts: totalProducts.count ?? 0,
    activeProducts: activeProducts.count ?? 0,
    lowStockVariants,
    pendingOrders: pendingOrders.count ?? 0,
  };
}
