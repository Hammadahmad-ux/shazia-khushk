"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { shopCategories, type ShopCategory, type ShopProduct } from "@/data/shop-catalog";

type SortOption = "featured" | "newest";

interface ShopCollectionExperienceProps {
  collection?: ShopCategory;
  products: readonly ShopProduct[];
}

function categoryLabel(category: ShopCategory) {
  return shopCategories.find((item) => item.slug === category)?.label ?? category;
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
      <div className="shop-product-grid">
        {orderedProducts.map((product) => (
          <Link className="shop-product-card group" href={product.href} key={product.id}>
            <div className="shop-product-card__media">
              <Image alt={product.alt} className="shop-product-card__image" fill sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw" src={product.image} />
              {product.hoverImage && (
                <Image alt="" aria-hidden="true" className="shop-product-card__image shop-product-card__image--hover" fill sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw" src={product.hoverImage} />
              )}
            </div>
            <div className="shop-product-card__details">
              <p className="shop-product-card__category">{categoryLabel(product.category)}</p>
              <h3>{product.title}</h3>
              <p className="shop-product-card__descriptor">{product.descriptor}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
