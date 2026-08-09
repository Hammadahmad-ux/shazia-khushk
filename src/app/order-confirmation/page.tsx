import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <div className="grid gap-10">
      <PageIntro eyebrow="Order route foundation" title="Order confirmation">
        <p>No order has been submitted. This route does not expose customer or order data.</p>
      </PageIntro>
      <div>
        <Link
          className="inline-flex min-h-11 items-center border-b border-foreground text-sm font-semibold no-underline hover:text-accent"
          href="/shop"
        >
          Return to shop
        </Link>
      </div>
    </div>
  );
}
