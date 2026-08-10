import "server-only";

export interface SupabaseServerEnv {
  url: string;
  secretKey: string;
}

export function getSupabaseServerEnv(): SupabaseServerEnv | null {
  const url = process.env.SUPABASE_URL;
  // SUPABASE_SECRET_KEY is the current Supabase naming (dashboard
  // "Secret keys" section); SUPABASE_SERVICE_ROLE_KEY is accepted too
  // for compatibility with projects still using the legacy name. Both
  // are full-privilege, server-only, and bypass Row Level Security.
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) return null;

  return { url, secretKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseServerEnv() !== null;
}
