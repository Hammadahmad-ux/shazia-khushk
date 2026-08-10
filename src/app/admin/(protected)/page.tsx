import type { Metadata } from "next";

import { getDashboardStats } from "@/lib/admin/dashboard-stats";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-page">
        <h1>Dashboard</h1>
        <p className="admin-notice">Supabase is not configured, so live catalog/order data cannot be loaded.</p>
      </div>
    );
  }

  const stats = await getDashboardStats();

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Total Products</p>
          <p className="admin-stat-card__value">{stats.totalProducts}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Active Products</p>
          <p className="admin-stat-card__value">{stats.activeProducts}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Low Stock</p>
          <p className="admin-stat-card__value">{stats.lowStockVariants}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">New / Pending Orders</p>
          <p className="admin-stat-card__value">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
}
