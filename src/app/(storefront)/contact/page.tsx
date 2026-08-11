import type { Metadata } from "next";

import { getWhatsAppUrl, returns, shipping, support } from "@/lib/commerce/business-config";
import { absoluteUrl } from "@/lib/seo/site-config";
import { formatMoney } from "@/utils/format-money";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shazia Khushk customer support by WhatsApp or email.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact — Shazia Khushk",
    description: "Get in touch with Shazia Khushk customer support by WhatsApp or email.",
    url: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <div className="contact-care">
      <div className="contact-care__layout">
        <header className="contact-care__intro">
          <div className="contact-care__accent" aria-hidden="true" />
          <p className="contact-care__eyebrow">Customer care</p>
          <h1 className="contact-care__title">Need a hand?</h1>
          <p className="contact-care__lead">
            Questions about a product, delivery or an existing order? Reach out to the Shazia
            Khushk team and we&rsquo;ll help with what you need.
          </p>
        </header>

        <section className="contact-care__methods" aria-label="Contact methods">
          <a
            className="contact-care__method"
            href={getWhatsAppUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            <h2 className="contact-care__method-label">WhatsApp</h2>
            <span className="contact-care__method-value">+92 332 3637086</span>
            <span className="contact-care__method-cta">
              Chat with us{" "}
              <span className="contact-care__method-cta-arrow" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </a>

          <a className="contact-care__method" href={`mailto:${support.email}`}>
            <h2 className="contact-care__method-label">Email</h2>
            <span className="contact-care__method-value">{support.email}</span>
            <span className="contact-care__method-cta">
              Send email{" "}
              <span className="contact-care__method-cta-arrow" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </a>
        </section>
      </div>

      <section className="contact-care__support" aria-labelledby="delivery-info-heading">
        <h2 id="delivery-info-heading" className="contact-care__support-title">
          Order &amp; delivery information
        </h2>
        <ul className="contact-care__support-list">
          <li>Cash on Delivery</li>
          <li>Flat shipping &mdash; {formatMoney(shipping.flatRateMinor)}</li>
          <li>{shipping.couriers.join(" / ")}</li>
          <li>{returns.windowDays}-day return / exchange window</li>
        </ul>
      </section>
    </div>
  );
}
