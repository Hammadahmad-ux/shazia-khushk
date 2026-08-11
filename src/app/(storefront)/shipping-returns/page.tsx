import type { Metadata } from "next";

import { getWhatsAppUrl, returns, shipping, support } from "@/lib/commerce/business-config";
import { absoluteUrl } from "@/lib/seo/site-config";
import { formatMoney } from "@/utils/format-money";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Shipping fee, courier partners, Cash on Delivery, and the 7-day return/exchange window for Shazia Khushk orders.",
  alternates: { canonical: "/shipping-returns" },
  openGraph: {
    type: "website",
    title: "Shipping & Returns — Shazia Khushk",
    description: "Shipping fee, courier partners, Cash on Delivery, and the 7-day return/exchange window for Shazia Khushk orders.",
    url: absoluteUrl("/shipping-returns"),
  },
};

export default function ShippingReturnsPage() {
  return (
    <div className="shipping-returns-page">
      <header className="shipping-returns-page__intro">
        <p className="shipping-returns-page__eyebrow">Order &amp; delivery</p>
        <h1 className="shipping-returns-page__title">
          Shipping,
          <br />
          made simple.
        </h1>
        <p className="shipping-returns-page__lead">Clear information about delivery, payment and returns.</p>
      </header>

      <div className="shipping-returns-page__layout">
        <aside className="shipping-returns-page__glance" aria-labelledby="at-a-glance-heading">
          <h2 id="at-a-glance-heading" className="shipping-returns-page__glance-title">
            At a glance
          </h2>
          <dl className="shipping-returns-page__glance-list">
            <div className="shipping-returns-page__glance-item">
              <dt className="shipping-returns-page__glance-term">Shipping</dt>
              <dd className="shipping-returns-page__glance-value">
                <span className="shipping-returns-page__glance-desc">Flat nationwide rate</span>
                <strong>{formatMoney(shipping.flatRateMinor)}</strong>
              </dd>
            </div>
            <div className="shipping-returns-page__glance-item">
              <dt className="shipping-returns-page__glance-term">Payment</dt>
              <dd className="shipping-returns-page__glance-value">Cash on Delivery</dd>
            </div>
            <div className="shipping-returns-page__glance-item">
              <dt className="shipping-returns-page__glance-term">Couriers</dt>
              <dd className="shipping-returns-page__glance-value">{shipping.couriers.join(" / ")}</dd>
            </div>
            <div className="shipping-returns-page__glance-item">
              <dt className="shipping-returns-page__glance-term">Returns &amp; exchanges</dt>
              <dd className="shipping-returns-page__glance-value">
                Within <strong>{returns.windowDays} days</strong>
              </dd>
            </div>
          </dl>
        </aside>

        <div className="shipping-returns-page__sections">
          <section aria-labelledby="shipping-heading" className="shipping-returns-page__section" id="shipping">
            <h2 className="shipping-returns-page__section-title" id="shipping-heading">
              <span aria-hidden="true" className="shipping-returns-page__section-number">
                01
              </span>
              Shipping
            </h2>
            <ul className="shipping-returns-page__list">
              <li>
                <strong>{formatMoney(shipping.flatRateMinor)}</strong> flat shipping fee on every order.
              </li>
              <li>Orders are fulfilled through {shipping.couriers.join(" or ")}.</li>
            </ul>
            <p className="shipping-returns-page__note">
              Delivery timing may vary depending on the destination and courier service.
            </p>
          </section>

          <section aria-labelledby="payment-heading" className="shipping-returns-page__section" id="payment">
            <h2 className="shipping-returns-page__section-title" id="payment-heading">
              <span aria-hidden="true" className="shipping-returns-page__section-number">
                02
              </span>
              Payment
            </h2>
            <p className="shipping-returns-page__body">
              Cash on Delivery is available on every order. Pay in cash when your order arrives.
            </p>
          </section>

          <section aria-labelledby="returns-heading" className="shipping-returns-page__section" id="returns">
            <h2 className="shipping-returns-page__section-title" id="returns-heading">
              <span aria-hidden="true" className="shipping-returns-page__section-number">
                03
              </span>
              Returns &amp; exchanges
            </h2>
            <ul className="shipping-returns-page__list">
              <li>
                Returns and exchanges are accepted within <strong>{returns.windowDays} days</strong>{" "}
                of delivery.
              </li>
            </ul>
            <p className="shipping-returns-page__body">
              To start a return or exchange, contact our support team and we&rsquo;ll guide you
              through the process for your order.
            </p>
          </section>
        </div>
      </div>

      <section aria-labelledby="support-heading" className="shipping-returns-page__support" id="support">
        <h2 className="shipping-returns-page__support-title" id="support-heading">
          Need help with an order?
        </h2>
        <div className="shipping-returns-page__support-links">
          <a
            className="shipping-returns-page__support-link"
            href={getWhatsAppUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            Chat with us on WhatsApp{" "}
            <span aria-hidden="true" className="shipping-returns-page__support-link-arrow">
              &rarr;
            </span>
          </a>
          <a className="shipping-returns-page__support-link" href={`mailto:${support.email}`}>
            Email us{" "}
            <span aria-hidden="true" className="shipping-returns-page__support-link-arrow">
              &rarr;
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
