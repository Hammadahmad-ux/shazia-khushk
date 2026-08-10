import type { Metadata } from "next";

import { PageIntro } from "@/components/layout/page-intro";
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
    <div className="policy-page">
      <PageIntro eyebrow="Customer care" title="Frequently Asked Questions">
        <p>Answers to the questions we hear most from customers.</p>
      </PageIntro>

      <section aria-labelledby="faq-heading" className="policy-section">
        <h2 className="sr-only" id="faq-heading">
          Questions
        </h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p className="faq-item__answer">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="policy-section__note">
          Still have a question? Reach us on{" "}
          <a className="policy-link" href={getWhatsAppUrl()} rel="noopener noreferrer" target="_blank">
            WhatsApp
          </a>{" "}
          or by{" "}
          <a className="policy-link" href={`mailto:${support.email}`}>
            email
          </a>
          .
        </p>
      </section>
    </div>
  );
}
