import type { NextConfig } from "next";

// Derived from the same env var the server already uses for Supabase,
// rather than hardcoding this project's ref -- next/image refuses to
// optimize a remote image unless its host is explicitly allow-listed.
const supabaseHostname = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : undefined;

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
