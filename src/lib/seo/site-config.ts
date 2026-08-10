// Public, non-secret site identity used by server-side SEO metadata
// (canonical URLs, Open Graph, robots.txt, sitemap.xml). SITE_URL is a
// public value -- never place secrets here -- and defaults to the
// production domain so canonicals/sitemap stay correct even before the
// environment variable is set on a host.

export const siteName = "Shazia Khushk";

const DEFAULT_SITE_URL = "https://shazia-khushk.vercel.app";

// An env var that's unset, empty, whitespace-only, or missing its
// protocol must never crash the build -- this module is imported by
// the root layout (metadataBase) and used on every page, so an invalid
// value here would fail the entire site rather than just SEO metadata.
function resolveSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    return new URL(raw).toString().replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteUrl = resolveSiteUrl();

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
