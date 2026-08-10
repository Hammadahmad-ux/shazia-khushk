import type { Metadata } from "next";
import Image from "next/image";

import { ShopCollectionExperience } from "@/components/shop/shop-collection-experience";
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
      <header className="shop-page__intro">
        <div className="shop-page__intro-copy">
          <p>Curated selection</p>
          <h1>Shop</h1>
          <p className="shop-page__description">Explore our curated edit of clothing, fragrance and everyday care.</p>
        </div>
        <div className="shop-page__intro-image">
          <Image
            alt="Shazia Khushk clothing editorial"
            className="object-cover object-[68%_center]"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            src="/images/home/hero-editorial.png"
          />
        </div>
      </header>
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
