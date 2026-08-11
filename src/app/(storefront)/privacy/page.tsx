import type { Metadata } from "next";

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

const contents = [
  { href: "#privacy-collect-heading", label: "What we collect" },
  { href: "#privacy-use-heading", label: "How we use it" },
  { href: "#privacy-storage-heading", label: "How it\u2019s stored" },
  { href: "#privacy-contact-heading", label: "Questions" },
];

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-page__intro">
        <p className="privacy-page__eyebrow">Privacy</p>
        <h1 className="privacy-page__title">
          Your privacy,
          <br />
          clearly explained.
        </h1>
        <p className="privacy-page__lead">
          How Shazia Khushk handles information used to process and support your order.
        </p>
      </header>

      <div className="privacy-page__layout">
        <nav aria-labelledby="privacy-index-heading" className="privacy-page__index">
          <h2 className="privacy-page__index-title" id="privacy-index-heading">
            On this page
          </h2>
          <ul className="privacy-page__index-list">
            {contents.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="privacy-page__content">
          <section aria-labelledby="privacy-collect-heading" className="privacy-page__section">
            <h2 className="privacy-page__section-title" id="privacy-collect-heading">
              What we collect
            </h2>
            <p>When you place an order, we collect the information needed to fulfil it:</p>
            <ul className="privacy-page__list">
              <li>Your name, mobile number and email address (if you provide one)</li>
              <li>Your delivery address, including city and province</li>
              <li>Details of the products and variants you order</li>
            </ul>
            <p>We do not require you to create an account to shop with us.</p>
          </section>

          <section aria-labelledby="privacy-use-heading" className="privacy-page__section">
            <h2 className="privacy-page__section-title" id="privacy-use-heading">
              How we use it
            </h2>
            <p>Your information is used only to:</p>
            <ul className="privacy-page__list">
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

          <section aria-labelledby="privacy-storage-heading" className="privacy-page__section">
            <h2 className="privacy-page__section-title" id="privacy-storage-heading">
              How it&rsquo;s stored
            </h2>
            <p>
              Order and customer information is stored securely using our store&rsquo;s backend
              infrastructure and is accessible only to authorised store staff.
            </p>
          </section>

          <section aria-labelledby="privacy-contact-heading" className="privacy-page__section">
            <h2 className="privacy-page__section-title" id="privacy-contact-heading">
              Questions
            </h2>
            <p>
              If you have any questions about how your information is handled, contact us at{" "}
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
