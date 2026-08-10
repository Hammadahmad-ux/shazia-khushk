import type { Metadata } from "next";

import { PageIntro } from "@/components/layout/page-intro";
import { getWhatsAppUrl, support } from "@/lib/commerce/business-config";
import { absoluteUrl } from "@/lib/seo/site-config";

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
    <div className="policy-page">
      <PageIntro eyebrow="Customer support" title="Contact">
        <p>
          Need help with a product or an existing order? Our support team is available through
          WhatsApp or email.
        </p>
      </PageIntro>

      <section aria-labelledby="contact-heading" className="policy-section">
        <h2 id="contact-heading">Get in touch</h2>
        <div className="contact-methods">
          <a className="contact-method" href={getWhatsAppUrl()} rel="noopener noreferrer" target="_blank">
            <span className="contact-method__label">WhatsApp</span>
            <span className="contact-method__value">+92 332 3637086</span>
          </a>
          <a className="contact-method" href={`mailto:${support.email}`}>
            <span className="contact-method__label">Email</span>
            <span className="contact-method__value">{support.email}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
