import type { Metadata } from "next";
import Image from "next/image";

import { ShopCollectionExperience } from "@/components/shop/shop-collection-experience";
import { shopProducts } from "@/data/shop-catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Development catalog architecture for the Shazia Khushk storefront.",
  robots: { index: false, follow: false },
};

export default function ShopPage() {
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
      <ShopCollectionExperience products={shopProducts} />
    </div>
  );
}
