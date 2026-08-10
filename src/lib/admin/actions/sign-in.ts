"use server";

import { redirect } from "next/navigation";

import { ADMIN_ALLOWED_EMAIL } from "@/lib/admin/config";
import { isAllowedAdminEmail } from "@/lib/admin/is-allowed-admin-email";
import { getServerAuthClient } from "@/lib/supabase/server-auth-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface SignInState {
  error: string | null;
}

export async function signInAdmin(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  if (!isSupabaseConfigured()) {
    return { error: "Admin sign-in is not connected yet. Supabase environment variables are not configured." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const client = await getServerAuthClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  if (!isAllowedAdminEmail(data.user.email, ADMIN_ALLOWED_EMAIL)) {
    await client.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  redirect("/admin");
}
