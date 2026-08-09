import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-context";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const bodyFont = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shazia Khushk",
    template: "%s | Shazia Khushk",
  },
  description: "Shazia Khushk online store.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-PK" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
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
        </CartProvider>
      </body>
    </html>
  );
}
