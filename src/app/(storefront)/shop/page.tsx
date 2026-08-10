import type { Metadata } from "next";

import { ShopCollectionExperience } from "@/components/shop/shop-collection-experience";
import { ShopHero } from "@/components/shop/shop-hero";
import { listLiveShopProducts } from "@/lib/catalog/supabase-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { absoluteUrl } from "@/lib/seo/site-config";
import type { ShopProduct } from "@/data/shop-catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore the Shazia Khushk edit of clothing, fragrance and beauty & hair care, with nationwide Cash on Delivery.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    title: "Shop — Shazia Khushk",
    description: "Explore the Shazia Khushk edit of clothing, fragrance and beauty & hair care.",
    url: absoluteUrl("/shop"),
    images: [{ url: absoluteUrl("/images/home/hero-editorial.png"), alt: "Shazia Khushk shop" }],
  },
};

// Admin-created/edited products must appear here without a rebuild.
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: readonly ShopProduct[] = [];
  let loadError = false;

  if (isSupabaseConfigured()) {
    try {
      products = await listLiveShopProducts();
    } catch {
      // A temporary catalog outage must show a clear, safe message --
      // never a raw database error.
      loadError = true;
    }
  }

  return (
    <div className="shop-page">
      <ShopHero />
      {loadError ? (
        <p className="shop-notice" role="status">
          We couldn&rsquo;t load the catalog right now. Please try again in a moment.
        </p>
      ) : (
        <ShopCollectionExperience products={products} />
      )}
    </div>
  );
}
