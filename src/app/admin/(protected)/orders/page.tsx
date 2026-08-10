import type { Metadata } from "next";
import Link from "next/link";

import { FULFILLMENT_STATUS_LABEL, listOrders } from "@/lib/admin/orders/order-repository";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatMoney } from "@/utils/format-money";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-page">
        <h1>Orders</h1>
        <p className="admin-notice">Supabase is not configured, so orders cannot be loaded.</p>
      </div>
    );
  }

  const orders = await listOrders();

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Orders</h1>
      </div>

      {orders.length === 0 ? (
        <p className="admin-empty">No orders yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                  </td>
                  <td>{order.contactFullName}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>{formatMoney(order.totalMinor)}</td>
                  <td>
                    <span className={order.paymentStatus === "paid" ? "admin-badge admin-badge--active" : "admin-badge admin-badge--muted"}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className="admin-badge">{FULFILLMENT_STATUS_LABEL[order.fulfillmentStatus]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
