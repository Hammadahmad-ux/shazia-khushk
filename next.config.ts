import type { NextConfig } from "next";

// Derived from the same env var the server already uses for Supabase,
// rather than hardcoding this project's ref -- next/image refuses to
// optimize a remote image unless its host is explicitly allow-listed.
// A malformed value must not crash the whole build (this file is
// evaluated up front, before any request-time error handling exists),
// so an invalid URL just falls back to no allow-listed host instead of
// throwing during `next build`.
function supabaseHostnameFromEnv(): string | undefined {
  if (!process.env.SUPABASE_URL) return undefined;
  try {
    return new URL(process.env.SUPABASE_URL).hostname;
  } catch {
    return undefined;
  }
}

const supabaseHostname = supabaseHostnameFromEnv();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Product image uploads (src/lib/admin/actions/upload-product-image.ts)
      // accept files up to 5MB; Next's default Server Action body limit is
      // 1MB, which was silently rejecting real photos before this raised it.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: supabaseHostname
      ? [{ protocol: "https", hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
