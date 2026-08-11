import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

/**
 * Publishable-key client for the browser. Only used to PUT a file
 * directly to Supabase Storage via a signed upload URL the server
 * already authorized (see create-video-upload-url.ts) -- large video
 * files never pass through a Vercel serverless function, whose request
 * body limit is far smaller than a typical product video.
 */
export function getBrowserSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase browser environment variables are not configured.");
  }

  if (!cachedClient) {
    cachedClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }

  return cachedClient;
}
