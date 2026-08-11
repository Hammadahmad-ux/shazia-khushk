import type { Metadata } from "next";

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

const contents = [
  { href: "#terms-orders-heading", label: "Products, pricing & availability" },
  { href: "#terms-payment-heading", label: "Payment & shipping" },
  { href: "#terms-returns-heading", label: "Returns & exchanges" },
  { href: "#terms-checkout-heading", label: "Your responsibility at checkout" },
  { href: "#terms-contact-heading", label: "Contact" },
];

export default function TermsPage() {
  return (
    <div className="terms-page">
      <header className="terms-page__intro">
        <p className="terms-page__eyebrow">Terms</p>
        <h1 className="terms-page__title">
          Terms,
          <br />
          made clear.
        </h1>
        <p className="terms-page__lead">Important information about shopping with Shazia Khushk.</p>
      </header>

      <div className="terms-page__layout">
        <nav aria-labelledby="terms-index-heading" className="terms-page__index">
          <h2 className="terms-page__index-title" id="terms-index-heading">
            On this page
          </h2>
          <ul className="terms-page__index-list">
            {contents.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="terms-page__content">
          <section aria-labelledby="terms-orders-heading" className="terms-page__section">
            <h2 className="terms-page__section-title" id="terms-orders-heading">
              Products, pricing &amp; availability
            </h2>
            <ul className="terms-page__list">
              <li>All prices displayed on this site are in {currency}.</li>
              <li>Products are subject to availability; selectable variants reflect current stock.</li>
              <li>An order is accepted once it is confirmed and processed by our team.</li>
            </ul>
          </section>

          <section aria-labelledby="terms-payment-heading" className="terms-page__section">
            <h2 className="terms-page__section-title" id="terms-payment-heading">
              Payment &amp; shipping
            </h2>
            <ul className="terms-page__list">
              <li>Cash on Delivery is our current payment method.</li>
              <li>A flat shipping fee of {formatMoney(shipping.flatRateMinor)} applies to every order.</li>
            </ul>
          </section>

          <section aria-labelledby="terms-returns-heading" className="terms-page__section">
            <h2 className="terms-page__section-title" id="terms-returns-heading">
              Returns &amp; exchanges
            </h2>
            <p>
              Returns and exchanges are accepted within {returns.windowDays} days of delivery.
              Contact support to start a request.
            </p>
          </section>

          <section aria-labelledby="terms-checkout-heading" className="terms-page__section">
            <h2 className="terms-page__section-title" id="terms-checkout-heading">
              Your responsibility at checkout
            </h2>
            <p>
              You are responsible for providing accurate contact and delivery information at
              checkout. We are not able to guarantee delivery if the information provided is
              incomplete or incorrect.
            </p>
          </section>

          <section aria-labelledby="terms-contact-heading" className="terms-page__section">
            <h2 className="terms-page__section-title" id="terms-contact-heading">
              Contact
            </h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a className="policy-link" href={`mailto:${support.email}`}>
                {support.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
