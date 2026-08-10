import Link from "next/link";

import { Container } from "@/components/layout/container";
import { footerNavigation } from "@/data/navigation";

interface FooterGroupProps {
  heading: string;
  items: readonly { label: string; href?: string }[];
}

function FooterGroup({ heading, items }: FooterGroupProps) {
  return (
    <section aria-labelledby={`footer-${heading.toLowerCase().replaceAll(" ", "-")}`}>
      <h2
        id={`footer-${heading.toLowerCase().replaceAll(" ", "-")}`}
        className="mb-5 text-[0.6875rem] font-semibold tracking-[0.14em] text-foreground uppercase"
      >
        {heading}
      </h2>
      <ul className="grid gap-3 text-sm text-muted">
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link
                className="inline-flex min-h-8 items-center no-underline transition-colors duration-[var(--transition-fast)] hover:text-accent"
                href={item.href}
              >
                {item.label}
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
    <footer className="border-t border-border bg-surface">
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-16">
          <section aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="font-display text-xl tracking-[0.12em] uppercase">
              Shazia Khushk
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted">
              A curated store for clothing, fragrance and everyday care.
            </p>
            <div aria-hidden="true" className="mt-6 h-px w-10 bg-accent" />
          </section>
          <FooterGroup heading="Shop" items={footerNavigation.shop} />
          <FooterGroup heading="Customer Care" items={footerNavigation.care} />
          <FooterGroup heading="Legal" items={footerNavigation.legal} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shazia Khushk</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="no-underline transition-colors duration-[var(--transition-fast)] hover:text-accent" href="/privacy">
              Privacy
            </Link>
            <Link className="no-underline transition-colors duration-[var(--transition-fast)] hover:text-accent" href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
