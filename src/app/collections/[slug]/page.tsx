import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Image from "next/image";

import { ShopCollectionExperience } from "@/components/shop/shop-collection-experience";
import { getShopCategory, shopProducts } from "@/data/shop-catalog";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ["clothing", "fragrance", "beauty-hair-care"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getShopCategory(slug);

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.label,
    description: collection.description,
    robots: { index: false, follow: false },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getShopCategory(slug);

  if (!collection) {
    notFound();
  }

  const products = shopProducts.filter((product) => product.category === collection.slug);

  return (
    <div className="shop-page">
      <header className="collection-page__hero">
        <div className="collection-page__hero-copy">
          <p>Curated selection</p>
          <h1>{collection.label}</h1>
          <p className="shop-page__description">{collection.description}</p>
        </div>
        <div className="collection-page__hero-image">
          <Image alt="" className="object-cover" fill priority sizes="(min-width: 1024px) 48vw, 100vw" src={collection.image} />
        </div>
      </header>
      <ShopCollectionExperience collection={collection.slug} products={products} />
    </div>
  );
}
