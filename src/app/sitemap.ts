import type { MetadataRoute } from "next";

import { shopCategories } from "@/data/shop-catalog";
import { listLiveShopProducts } from "@/lib/catalog/supabase-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { siteUrl } from "@/lib/seo/site-config";

// Product slugs come from the live catalog, so the sitemap must be
// generated on demand rather than at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/shipping-returns`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = shopCategories.map((category) => ({
    url: `${siteUrl}${category.href}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  if (isSupabaseConfigured()) {
    try {
      productRoutes = (await listLiveShopProducts()).map((product) => ({
        url: `${siteUrl}${product.href}`,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    } catch {
      // A temporary catalog outage must not take down the sitemap.
      productRoutes = [];
    }
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
