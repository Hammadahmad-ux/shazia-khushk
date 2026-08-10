import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderStatusForm } from "@/components/admin/order-status-form";
import { getOrderById } from "@/lib/admin/orders/order-repository";
import { shipping } from "@/lib/commerce/business-config";
import { formatMoney } from "@/utils/format-money";

export const metadata: Metadata = {
  title: "Order Detail",
  robots: { index: false, follow: false },
};

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Order {order.orderNumber}</h1>
      </div>

      <div className="order-confirmation__layout">
        <section className="admin-form-section">
          <h2>Items</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={`${item.sku}-${index}`}>
                    <td>
                      {item.productTitle}
                      {item.variantLabel && <div className="admin-field__hint">{item.variantLabel}</div>}
                    </td>
                    <td>{item.sku}</td>
                    <td>{item.quantity}</td>
                    <td>{formatMoney(item.unitPriceMinor, order.currency)}</td>
                    <td>{formatMoney(item.lineTotalMinor, order.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="checkout-summary__row">
            <span>Subtotal</span>
            <strong>{formatMoney(order.subtotalMinor, order.currency)}</strong>
          </div>
          <div className="checkout-summary__row">
            <span>Shipping</span>
            <strong>{formatMoney(order.shippingMinor, order.currency)}</strong>
          </div>
          <div className="checkout-summary__row checkout-summary__total">
            <span>Total</span>
            <strong>{formatMoney(order.totalMinor, order.currency)}</strong>
          </div>
        </section>

        <div className="admin-form admin-form--full">
          <section className="admin-form-section">
            <h2>Customer</h2>
            <p>{order.contactFullName}</p>
            <p>{order.contactMobile}</p>
            {order.contactEmail && <p>{order.contactEmail}</p>}
          </section>

          <section className="admin-form-section">
            <h2>Shipping Address</h2>
            <p>
              {order.shippingAddress.addressLine}
              {order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ""}
              <br />
              {order.shippingAddress.city}
              {order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ""}
              {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ""}
            </p>
            <p className="admin-field__hint">Fulfilled via {shipping.couriers.join(" or ")} (courier not yet assigned per order).</p>
          </section>

          <section className="admin-form-section">
            <h2>Payment</h2>
            <p>{order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : order.paymentMethod}</p>
            <span className={order.paymentStatus === "paid" ? "admin-badge admin-badge--active" : "admin-badge admin-badge--muted"}>
              {order.paymentStatus}
            </span>
          </section>

          <section className="admin-form-section">
            <h2>Fulfillment</h2>
            <OrderStatusForm initialStatus={order.fulfillmentStatus} orderId={order.id} />
          </section>

          {order.customerNotes && (
            <section className="admin-form-section">
              <h2>Customer Notes</h2>
              <p>{order.customerNotes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
