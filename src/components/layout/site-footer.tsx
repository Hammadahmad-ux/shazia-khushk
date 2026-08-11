import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { footerNavigation } from "@/data/navigation";

interface FooterGroupProps {
  heading: string;
  items: readonly { label: string; href?: string }[];
}

function FooterGroup({ heading, items }: FooterGroupProps) {
  const headingId = `footer-${heading.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <section aria-labelledby={headingId}>
      <h2 className="site-footer__group-heading" id={headingId}>
        {heading}
      </h2>
      <ul className="site-footer__group-list">
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link className="site-footer__link" href={item.href}>
                <span>{item.label}</span>
              </Link>
            ) : (
              <span aria-disabled="true">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Image
              alt="Shazia Khushk"
              className="site-footer__logo"
              height={79}
              src="/brand/shazia-khushk-lockup.png"
              width={300}
            />
            <p className="site-footer__brand-copy">
              A curated store for clothing, fragrance and everyday care.
            </p>
            <Link className="site-footer__cta" href="/shop">
              Explore the edit
              <span aria-hidden="true" className="site-footer__cta-arrow">
                &rarr;
              </span>
            </Link>
          </div>

          <nav aria-label="Footer" className="site-footer__nav">
            <FooterGroup heading="Shop" items={footerNavigation.shop} />
            <FooterGroup heading="Customer Care" items={footerNavigation.care} />
            <FooterGroup heading="Legal" items={footerNavigation.legal} />
          </nav>
        </div>
      </Container>

      <div className="site-footer__bottom">
        <Container>
          <div className="site-footer__bottom-inner sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Shazia Khushk</p>
            <div className="site-footer__legal-links">
              <Link className="site-footer__link" href="/privacy">
                <span>Privacy</span>
              </Link>
              <Link className="site-footer__link" href="/terms">
                <span>Terms</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
