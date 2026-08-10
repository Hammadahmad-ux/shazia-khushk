import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { absoluteUrl, siteName, siteUrl } from "@/lib/seo/site-config";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shazia Khushk — Clothing, Fragrance & Everyday Care",
    template: "%s | Shazia Khushk",
  },
  description:
    "Shop the Shazia Khushk edit — traditional clothing, expressive fragrance and everyday hair care. Nationwide flat-rate delivery in Pakistan with Cash on Delivery.",
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName,
    title: "Shazia Khushk — Clothing, Fragrance & Everyday Care",
    description:
      "Shop the Shazia Khushk edit — traditional clothing, expressive fragrance and everyday hair care. Cash on Delivery, nationwide.",
    images: [
      {
        url: absoluteUrl("/brand/shazia-khushk-mark.png"),
        width: 700,
        height: 145,
        alt: "Shazia Khushk",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Shazia Khushk — Clothing, Fragrance & Everyday Care",
    description:
      "Shop the Shazia Khushk edit — traditional clothing, expressive fragrance and everyday hair care.",
    images: [absoluteUrl("/brand/shazia-khushk-mark.png")],
  },
  icons: {
    icon: [{ url: "/brand/shazia-khushk-mark.png", type: "image/png" }],
    apple: [{ url: "/brand/shazia-khushk-mark.png" }],
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-PK" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
