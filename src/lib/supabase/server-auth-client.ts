import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseServerEnv } from "@/lib/supabase/env";

/**
 * Cookie-bound Supabase client for admin auth (sign in/out, session
 * reads). Distinct from getServerSupabaseClient() in server-client.ts,
 * which is a stateless client for commerce data with no session
 * concept. Must only be called from Server Actions / Server Components,
 * never from client code.
 */
export async function getServerAuthClient() {
  const env = getSupabaseServerEnv();
  if (!env) {
    throw new Error("Supabase server environment variables are not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.secretKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render (not a Server Action
          // or Route Handler): cookies are read-only there. Session
          // refresh will retry on the next action/middleware pass.
        }
      },
    },
  });
}
