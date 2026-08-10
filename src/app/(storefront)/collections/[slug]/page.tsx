import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Image from "next/image";

import { ShopCollectionExperience } from "@/components/shop/shop-collection-experience";
import { getShopCategory, type ShopProduct } from "@/data/shop-catalog";
import { listLiveShopProducts } from "@/lib/catalog/supabase-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { absoluteUrl } from "@/lib/seo/site-config";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

// Admin-created/edited products must appear here without a rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getShopCategory(slug);

  if (!collection) {
    return { title: "Collection not found" };
  }

  return {
    title: collection.label,
    description: collection.description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      type: "website",
      title: `${collection.label} — Shazia Khushk`,
      description: collection.description,
      url: absoluteUrl(`/collections/${slug}`),
      images: [{ url: absoluteUrl(collection.image), alt: collection.label }],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getShopCategory(slug);

  if (!collection) {
    notFound();
  }

  let products: readonly ShopProduct[] = [];
  let loadError = false;

  if (isSupabaseConfigured()) {
    try {
      products = (await listLiveShopProducts()).filter((product) => product.category === collection.slug);
    } catch {
      // A temporary catalog outage must show a clear, safe message --
      // never a raw database error.
      loadError = true;
    }
  }

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
      {loadError ? (
        <p className="shop-notice" role="status">
          We couldn&rsquo;t load the catalog right now. Please try again in a moment.
        </p>
      ) : (
        <ShopCollectionExperience collection={collection.slug} products={products} />
      )}
    </div>
  );
}
