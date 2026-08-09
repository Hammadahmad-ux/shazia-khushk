import Link from "next/link";

import { PageIntro } from "@/components/layout/page-intro";

export default function NotFoundPage() {
  return (
    <div className="grid gap-10">
      <PageIntro eyebrow="404" title="Page not found">
        <p>The page you requested is not available.</p>
      </PageIntro>
      <div>
        <Link
          className="inline-flex min-h-11 items-center border-b border-foreground text-sm font-semibold no-underline hover:text-accent"
          href="/"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
