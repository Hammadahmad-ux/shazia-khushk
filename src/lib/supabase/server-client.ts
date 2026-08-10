import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerEnv } from "@/lib/supabase/env";

let cachedClient: SupabaseClient | null = null;

/**
 * Server-only Supabase client authenticated with the service role key.
 * This bypasses Row Level Security, so it must never be imported from a
 * "use client" component -- only from Server Actions and Server
 * Components. Throws if SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not
 * configured; callers should check `isSupabaseConfigured()` first.
 */
export function getServerSupabaseClient(): SupabaseClient {
  const env = getSupabaseServerEnv();
  if (!env) {
    throw new Error("Supabase server environment variables are not configured.");
  }

  if (!cachedClient) {
    cachedClient = createClient(env.url, env.secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return cachedClient;
}
