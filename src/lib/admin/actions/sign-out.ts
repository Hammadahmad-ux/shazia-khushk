"use server";

import { redirect } from "next/navigation";

import { getServerAuthClient } from "@/lib/supabase/server-auth-client";

export async function signOutAdmin() {
  const client = await getServerAuthClient();
  await client.auth.signOut();
  redirect("/admin/login");
}
