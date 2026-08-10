import type { Metadata } from "next";

import { PageIntro } from "@/components/layout/page-intro";
import { currency, returns, shipping, support } from "@/lib/commerce/business-config";
import { absoluteUrl } from "@/lib/seo/site-config";
import { formatMoney } from "@/utils/format-money";

// Practical, store-behavior-only draft. Final legal wording (jurisdiction,
// liability, warranties, etc.) should be reviewed by the business before
// public launch -- nothing here should be treated as legal advice.
export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you place an order with Shazia Khushk.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    title: "Terms & Conditions — Shazia Khushk",
    description: "The terms that apply when you place an order with Shazia Khushk.",
    url: absoluteUrl("/terms"),
  },
};

export default function TermsPage() {
  return (
    <div className="policy-page">
      <PageIntro eyebrow="Legal" title="Terms &amp; Conditions">
        <p>The terms that apply when you shop with Shazia Khushk.</p>
      </PageIntro>

      <section aria-labelledby="terms-orders-heading" className="policy-section">
        <h2 id="terms-orders-heading">Products, pricing &amp; availability</h2>
        <ul>
          <li>All prices displayed on this site are in {currency}.</li>
          <li>Products are subject to availability; selectable variants reflect current stock.</li>
          <li>An order is accepted once it is confirmed and processed by our team.</li>
        </ul>
      </section>

      <section aria-labelledby="terms-payment-heading" className="policy-section">
        <h2 id="terms-payment-heading">Payment &amp; shipping</h2>
        <ul>
          <li>Cash on Delivery is our current payment method.</li>
          <li>A flat shipping fee of {formatMoney(shipping.flatRateMinor)} applies to every order.</li>
        </ul>
      </section>

      <section aria-labelledby="terms-returns-heading" className="policy-section">
        <h2 id="terms-returns-heading">Returns &amp; exchanges</h2>
        <p>Returns and exchanges are accepted within {returns.windowDays} days of delivery. Contact support to start a request.</p>
      </section>

      <section aria-labelledby="terms-checkout-heading" className="policy-section">
        <h2 id="terms-checkout-heading">Your responsibility at checkout</h2>
        <p>
          You are responsible for providing accurate contact and delivery information at checkout.
          We are not able to guarantee delivery if the information provided is incomplete or
          incorrect.
        </p>
      </section>

      <section aria-labelledby="terms-contact-heading" className="policy-section">
        <h2 id="terms-contact-heading">Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a className="policy-link" href={`mailto:${support.email}`}>
            {support.email}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
