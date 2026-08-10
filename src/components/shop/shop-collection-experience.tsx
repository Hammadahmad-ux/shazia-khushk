"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product/product-card";
import { categoryLabel, shopCategories, type ShopCategory, type ShopProduct } from "@/data/shop-catalog";

type SortOption = "featured" | "newest";

interface ShopCollectionExperienceProps {
  collection?: ShopCategory;
  products: readonly ShopProduct[];
}

export function ShopCollectionExperience({ collection, products }: ShopCollectionExperienceProps) {
  const [sort, setSort] = useState<SortOption>("featured");
  const orderedProducts = useMemo(
    () => [...products].sort((a, b) => a[sort === "featured" ? "featuredRank" : "newestRank"] - b[sort === "featured" ? "featuredRank" : "newestRank"]),
    [products, sort],
  );

  return (
    <section className="shop-experience" aria-labelledby="shop-grid-title">
      <div className="shop-experience__controls">
        <nav aria-label="Shop categories" className="shop-experience__categories">
          <Link aria-current={collection === undefined ? "page" : undefined} href="/shop">
            All
          </Link>
          {shopCategories.map((category) => (
            <Link aria-current={collection === category.slug ? "page" : undefined} href={category.href} key={category.slug}>
              {category.label}
            </Link>
          ))}
        </nav>
        <label className="shop-experience__sort">
          <span>Sort by</span>
          <select aria-label="Sort products" onChange={(event) => setSort(event.target.value as SortOption)} value={sort}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>

      <h2 id="shop-grid-title" className="sr-only">
        {collection ? `${categoryLabel(collection)} products` : "All products"}
      </h2>
      {orderedProducts.length === 0 ? (
        <p className="shop-empty">
          {collection ? "No products are available in this collection yet." : "No products are available right now."}
        </p>
      ) : (
        <div className="shop-product-grid">
          {orderedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
