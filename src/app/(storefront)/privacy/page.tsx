import type { Metadata } from "next";

import { PageIntro } from "@/components/layout/page-intro";
import { support } from "@/lib/commerce/business-config";
import { absoluteUrl } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Shazia Khushk uses the information collected when you place an order.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    title: "Privacy Policy — Shazia Khushk",
    description: "How Shazia Khushk uses the information collected when you place an order.",
    url: absoluteUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <div className="policy-page">
      <PageIntro eyebrow="Legal" title="Privacy Policy">
        <p>How we handle the information you share with us when you place an order.</p>
      </PageIntro>

      <section aria-labelledby="privacy-collect-heading" className="policy-section">
        <h2 id="privacy-collect-heading">What we collect</h2>
        <p>When you place an order, we collect the information needed to fulfil it:</p>
        <ul>
          <li>Your name, mobile number and email address (if you provide one)</li>
          <li>Your delivery address, including city and province</li>
          <li>Details of the products and variants you order</li>
        </ul>
        <p>We do not require you to create an account to shop with us.</p>
      </section>

      <section aria-labelledby="privacy-use-heading" className="policy-section">
        <h2 id="privacy-use-heading">How we use it</h2>
        <p>Your information is used only to:</p>
        <ul>
          <li>Process and fulfil your order</li>
          <li>Arrange delivery through our courier partners</li>
          <li>Contact you about your order or support request</li>
          <li>Manage returns and exchanges</li>
        </ul>
        <p>
          We do not sell your information, and we do not currently use analytics or marketing
          tracking on this site.
        </p>
      </section>

      <section aria-labelledby="privacy-storage-heading" className="policy-section">
        <h2 id="privacy-storage-heading">How it&rsquo;s stored</h2>
        <p>
          Order and customer information is stored securely using our store&rsquo;s backend
          infrastructure and is accessible only to authorised store staff.
        </p>
      </section>

      <section aria-labelledby="privacy-contact-heading" className="policy-section">
        <h2 id="privacy-contact-heading">Questions</h2>
        <p>
          If you have any questions about how your information is handled, contact us at{" "}
          <a className="policy-link" href={`mailto:${support.email}`}>
            {support.email}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
