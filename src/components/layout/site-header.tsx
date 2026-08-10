import Link from "next/link";

import { CartTrigger } from "@/components/layout/cart-trigger";
import { Container } from "@/components/layout/container";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

interface SiteHeaderProps {
  cartItemCount?: number;
  variant?: "solid" | "transparent";
}

export function SiteHeader({
  cartItemCount,
  variant = "solid",
}: SiteHeaderProps) {
  return (
    <header
      data-variant={variant}
      className="sticky top-0 z-40 border-b border-border bg-surface text-foreground transition-colors duration-[var(--transition-base)] data-[variant=transparent]:border-transparent data-[variant=transparent]:bg-transparent"
    >
      <Container className="grid min-h-[var(--header-height)] grid-cols-[1fr_auto_1fr] items-center gap-2 xl:grid-cols-[auto_1fr] xl:gap-12">
        <div className="justify-self-start xl:hidden">
          <MobileNavigation />
        </div>

        <Link
          className="relative inline-flex min-h-11 items-center justify-self-center font-display text-[clamp(0.9375rem,1.5vw,1.2rem)] leading-none tracking-[0.13em] whitespace-nowrap uppercase no-underline after:absolute after:right-0 after:bottom-1 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-[var(--transition-base)] hover:after:scale-x-100 focus-visible:after:scale-x-100 xl:justify-self-start"
          href="/"
        >
          Shazia Khushk
        </Link>

        <div className="flex items-center justify-self-end xl:gap-8" aria-label="Header utilities">
          <div className="hidden xl:block">
            <DesktopNavigation />
          </div>
          <div className="xl:hidden">
            <CartTrigger compact itemCount={cartItemCount} />
          </div>
          <div className="hidden xl:block">
            <CartTrigger itemCount={cartItemCount} />
          </div>
        </div>
      </Container>
    </header>
  );
}
