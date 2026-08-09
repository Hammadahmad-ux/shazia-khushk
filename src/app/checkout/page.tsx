import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="grid gap-10">
      <PageIntro eyebrow="Checkout foundation" title="Checkout">
        <p>No checkout session is active. Payment, shipping and order creation are not connected.</p>
      </PageIntro>
      <div>
        <Link
          className="inline-flex min-h-11 items-center border-b border-foreground text-sm font-semibold no-underline hover:text-accent"
          href="/cart"
        >
          Return to cart
        </Link>
      </div>
    </div>
  );
}
