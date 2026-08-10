import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/layout/page-intro";
import { SupabaseCommerceRepository } from "@/lib/commerce/supabase-commerce-repository";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getServerSupabaseClient } from "@/lib/supabase/server-client";
import { formatMoney } from "@/utils/format-money";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cash_on_delivery: "Cash on Delivery",
  online: "Online Payment",
};

interface OrderConfirmationPageProps {
  searchParams: Promise<{ order?: string; token?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const { order: orderNumber, token } = await searchParams;

  // No order reference in the URL: this is the safe default state for
  // this route, not an error -- it must never expose customer or order
  // data just because someone lands here directly.
  if (!orderNumber || !token) {
    return (
      <div className="grid gap-10">
        <PageIntro eyebrow="Order route foundation" title="Order confirmation">
          <p>No order has been submitted. This route does not expose customer or order data.</p>
        </PageIntro>
        <div>
          <Link
            className="inline-flex min-h-11 items-center border-b border-foreground text-sm font-semibold no-underline hover:text-accent"
            href="/shop"
          >
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  // An order + token were supplied but the backend isn't connected in
  // this deployment, or the pair doesn't match a real order. Either way
  // this must not reveal whether an order number exists -- a plain 404
  // is intentionally the same response for both cases, which is also
  // what stops someone from fabricating a confirmation by guessing or
  // incrementing the (sequential, human-readable) order number: the
  // high-entropy token has to match too.
  if (!isSupabaseConfigured()) {
    notFound();
  }

  const repository = new SupabaseCommerceRepository(getServerSupabaseClient());
  const order = await repository.getOrderConfirmation(orderNumber, token);

  if (!order) {
    notFound();
  }

  return (
    <section className="checkout-page">
      <header className="checkout-page__header">
        <p className="checkout-page__eyebrow">Order received</p>
        <h1>Thank you.</h1>
        <p className="order-confirmation__reference">
          Order <strong>{order.orderNumber}</strong> has been received.
        </p>
      </header>

      <div className="order-confirmation__layout">
        <section aria-labelledby="order-confirmation-items-heading" className="checkout-summary">
          <h2 id="order-confirmation-items-heading">Order Summary</h2>
          <div className="checkout-summary__items">
            {order.items.map((item, index) => (
              <div className="order-confirmation-item" key={`${item.productTitle}-${item.variantLabel ?? "default"}-${index}`}>
                <div>
                  <p className="order-confirmation-item__title">{item.productTitle}</p>
                  {item.variantLabel && <p className="order-confirmation-item__variant">{item.variantLabel}</p>}
                  <p className="order-confirmation-item__qty">Qty {item.quantity}</p>
                </div>
                <strong>{formatMoney(item.lineTotalMinor, order.currency)}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-summary__row">
            <span>Subtotal</span>
            <strong>{formatMoney(order.subtotalMinor, order.currency)}</strong>
          </div>
          <div className="checkout-summary__row">
            <span>Shipping</span>
            <span>{order.shippingStatus === "unresolved" ? "To be confirmed" : formatMoney(order.shippingMinor, order.currency)}</span>
          </div>
          <div className="checkout-summary__row checkout-summary__total">
            <span>Total</span>
            <strong>{formatMoney(order.totalMinor, order.currency)}</strong>
          </div>
        </section>

        <section aria-labelledby="order-confirmation-details-heading" className="order-confirmation-details">
          <h2 id="order-confirmation-details-heading">Delivery &amp; Payment</h2>
          <dl>
            <div>
              <dt>Delivery address</dt>
              <dd>
                {order.contactFullName}
                <br />
                {order.shippingAddress.addressLine}
                {order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ""}
                <br />
                {order.shippingAddress.city}
                {order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ""}
                {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ""}
                <br />
                {order.contactMobile}
              </dd>
            </div>
            <div>
              <dt>Payment method</dt>
              <dd>
                {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
                {order.paymentMethod === "cash_on_delivery" && " — pay when your order arrives"}
              </dd>
            </div>
          </dl>
          <p className="order-confirmation__next-step">
            Our team will contact you at {order.contactMobile} to confirm delivery details.
          </p>
          <Link className="checkout-page__continue" href="/shop">
            Continue shopping
          </Link>
        </section>
      </div>
    </section>
  );
}
