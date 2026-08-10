import type { ReactNode } from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-context";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppSupportButton } from "@/components/support/whatsapp-support-button";

export default function StorefrontLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <CartProvider>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <AnnouncementBar message="Shazia Khushk · Pakistan" />
      <SiteHeader />
      <main id="main-content" className="site-main">
        <Container>{children}</Container>
      </main>
      <SiteFooter />
      <CartDrawer />
      <WhatsAppSupportButton />
    </CartProvider>
  );
}
