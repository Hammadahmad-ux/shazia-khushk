import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { brand } from "@/lib/commerce/business-config";
import { requireAdminOrRedirect } from "@/lib/admin/require-admin";

// Every admin page depends on the visitor's session cookie (checked via
// requireAdminOrRedirect -> getServerAuthClient), which has no
// meaningful value at build time -- this must never be statically
// prerendered. Without this, Next attempts to prerender /admin at
// build time; getServerAuthClient() throws before it ever reaches its
// cookies() call (the API that would normally auto-opt the route into
// dynamic rendering), which crashed the entire production build.
export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: Readonly<{ children: ReactNode }>) {
  const admin = await requireAdminOrRedirect();

  return (
    <div className="admin-shell">
      <aside className="admin-shell__nav">
        <p className="admin-shell__brand">{brand.name} Admin</p>
        <nav aria-label="Admin">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <a href="/" rel="noopener noreferrer" target="_blank">
            View Store
          </a>
        </nav>
        <div className="admin-shell__account">
          <p className="admin-shell__email">{admin.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="admin-shell__content">{children}</main>
    </div>
  );
}
