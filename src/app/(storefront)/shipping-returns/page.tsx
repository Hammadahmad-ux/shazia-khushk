import type { Metadata } from "next";

import { PageIntro } from "@/components/layout/page-intro";
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
    <div className="policy-page">
      <PageIntro eyebrow="Customer care" title="Shipping &amp; Returns">
        <p>Factual, current policy for orders placed on this site.</p>
      </PageIntro>

      <section aria-labelledby="shipping-heading" className="policy-section" id="shipping">
        <h2 id="shipping-heading">Shipping</h2>
        <ul>
          <li>{formatMoney(shipping.flatRateMinor)} flat shipping fee on every order.</li>
          <li>Orders are fulfilled through {shipping.couriers.join(" or ")}.</li>
          <li>Cash on Delivery is available on every order.</li>
        </ul>
        <p className="policy-section__note">
          Delivery timing may vary depending on the destination and courier service.
        </p>
      </section>

      <section aria-labelledby="returns-heading" className="policy-section" id="returns">
        <h2 id="returns-heading">Returns &amp; Exchanges</h2>
        <ul>
          <li>Returns and exchanges are accepted within {returns.windowDays} days of delivery.</li>
        </ul>
        <p>
          To start a return or exchange, contact our support team and we&rsquo;ll guide you through
          the process for your order.
        </p>
        <div className="contact-methods">
          <a className="contact-method" href={getWhatsAppUrl()} rel="noopener noreferrer" target="_blank">
            <span className="contact-method__label">WhatsApp</span>
            <span className="contact-method__value">+923323637086</span>
          </a>
          <a className="contact-method" href={`mailto:${support.email}`}>
            <span className="contact-method__label">Email</span>
            <span className="contact-method__value">{support.email}</span>
          </a>
        </div>
        <p className="policy-section__note">
          For anything not covered here, contact support for case-specific assistance.
        </p>
      </section>
    </div>
  );
}
