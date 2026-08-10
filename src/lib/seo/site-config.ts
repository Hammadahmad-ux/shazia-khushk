// Public, non-secret site identity used by server-side SEO metadata
// (canonical URLs, Open Graph, robots.txt, sitemap.xml). SITE_URL is a
// public value -- never place secrets here -- and defaults to the
// production domain so canonicals/sitemap stay correct even before the
// environment variable is set on a host.

export const siteName = "Shazia Khushk";

const DEFAULT_SITE_URL = "https://shazia-khushk.vercel.app";

export const siteUrl = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
