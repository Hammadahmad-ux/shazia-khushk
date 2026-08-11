import type { Metadata } from "next";

import { getWhatsAppUrl, returns, shipping, support } from "@/lib/commerce/business-config";
import { absoluteUrl } from "@/lib/seo/site-config";
import { formatMoney } from "@/utils/format-money";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about payment, shipping, returns and contacting Shazia Khushk.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    title: "FAQ — Shazia Khushk",
    description: "Answers to common questions about payment, shipping, returns and contacting Shazia Khushk.",
    url: absoluteUrl("/faq"),
  },
};

const faqs: readonly { question: string; answer: string }[] = [
  {
    question: "What payment methods do you accept?",
    answer: "Cash on Delivery. Pay in cash when your order arrives.",
  },
  {
    question: "What is the shipping charge?",
    answer: `A flat ${formatMoney(shipping.flatRateMinor)} per order.`,
  },
  {
    question: "Which courier services do you use?",
    answer: `Orders are fulfilled through ${shipping.couriers.join(" and ")}.`,
  },
  {
    question: "Can I return or exchange my order?",
    answer: `Return and exchange requests are accepted within ${returns.windowDays} days of delivery, subject to contacting support for the applicable process.`,
  },
  {
    question: "How can I contact Shazia Khushk?",
    answer: `Reach our support team on WhatsApp or by email at ${support.email}.`,
  },
  {
    question: "How do I know whether a product is available?",
    answer: "Availability and selectable variants shown on each product page reflect current store inventory.",
  },
];

export default function FaqPage() {
  return (
    <div className="faq-page">
      <div className="faq-page__layout">
        <header className="faq-page__intro">
          <p className="faq-page__eyebrow">Customer care</p>
          <h1 className="faq-page__title">
            Questions,
            <br />
            answered.
          </h1>
          <p className="faq-page__lead">
            Find answers about payment, shipping, returns, product availability and getting in
            touch with the Shazia Khushk team.
          </p>
        </header>

        <section className="faq-page__list" aria-labelledby="faq-heading">
          <h2 className="sr-only" id="faq-heading">
            Frequently asked questions
          </h2>
          <div className="faq-page__accordion">
            {faqs.map((faq) => (
              <details className="faq-page__item" key={faq.question}>
                <summary>
                  <span className="faq-page__question">{faq.question}</span>
                  <span className="faq-page__indicator" aria-hidden="true">
                    <span className="faq-page__indicator-bar" />
                    <span className="faq-page__indicator-bar faq-page__indicator-bar--vertical" />
                  </span>
                </summary>
                <p className="faq-page__answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <section className="faq-page__support" aria-labelledby="still-need-help-heading">
        <h2 id="still-need-help-heading" className="faq-page__support-title">
          Still need help?
        </h2>
        <div className="faq-page__support-links">
          <a
            className="faq-page__support-link"
            href={getWhatsAppUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            Chat with us on WhatsApp{" "}
            <span className="faq-page__support-link-arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
          <a className="faq-page__support-link" href={`mailto:${support.email}`}>
            Email us{" "}
            <span className="faq-page__support-link-arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
