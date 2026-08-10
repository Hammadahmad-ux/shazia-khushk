import { HomeBrandStatement } from "@/components/home/home-brand-statement";
import { HomeCategoryGrid } from "@/components/home/home-category-grid";
import { HomeEditorialSections } from "@/components/home/home-editorial-sections";
import { HomeHero } from "@/components/home/home-hero";
import { HomeStories } from "@/components/home/home-stories";
import { HomeProductGrid } from "@/components/home/home-product-grid";
import { listLiveShopProducts } from "@/lib/catalog/supabase-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ShopProduct } from "@/data/shop-catalog";

const FEATURED_COUNT = 4;

// Admin-toggled "featured" products must appear here without a rebuild.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProducts: readonly ShopProduct[] = [];

  if (isSupabaseConfigured()) {
    try {
      const products = await listLiveShopProducts();
      featuredProducts = [...products].sort((a, b) => a.featuredRank - b.featuredRank).slice(0, FEATURED_COUNT);
    } catch {
      // A temporary catalog outage must not take down the homepage --
      // the section simply doesn't render (see HomeProductGrid).
      featuredProducts = [];
    }
  }

  return (
    <div className="home-page">
      <HomeHero />
      <HomeProductGrid products={featuredProducts} />
      <HomeCategoryGrid />
      <HomeStories />
      <HomeEditorialSections />
      <HomeBrandStatement />
    </div>
  );
}
