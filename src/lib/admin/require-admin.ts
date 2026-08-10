import "server-only";

import { redirect } from "next/navigation";

import { ADMIN_ALLOWED_EMAIL } from "@/lib/admin/config";
import { isAllowedAdminEmail } from "@/lib/admin/is-allowed-admin-email";
import { getServerAuthClient } from "@/lib/supabase/server-auth-client";

export interface AdminUser {
  id: string;
  email: string;
}

async function readAuthorizedAdmin(): Promise<AdminUser | null> {
  const client = await getServerAuthClient();
  const { data, error } = await client.auth.getUser();
  const email = data.user?.email;

  if (error || !data.user || !isAllowedAdminEmail(email, ADMIN_ALLOWED_EMAIL)) {
    return null;
  }

  return { id: data.user.id, email: email! };
}

/**
 * For the admin route-group layout: renders nothing and redirects to
 * /admin/login if there is no session or the session's email is not
 * the allowed admin email. This is what actually protects every nested
 * admin page server-side -- it does not depend on any client-side
 * hiding of navigation links.
 */
export async function requireAdminOrRedirect(): Promise<AdminUser> {
  const admin = await readAuthorizedAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/**
 * For admin Server Actions (product/order mutations). Actions are
 * separate RPC endpoints, not protected by the layout's render-time
 * check, so every admin-mutating action must call this itself and
 * refuse to proceed if it returns null.
 */
export async function getAuthorizedAdmin(): Promise<AdminUser | null> {
  return readAuthorizedAdmin();
}
