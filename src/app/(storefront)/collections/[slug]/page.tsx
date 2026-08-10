import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { EditorialIntro } from "@/components/shop/editorial-intro";
import { ShopCollectionExperience } from "@/components/shop/shop-collection-experience";
import { getShopCategory, type ShopCategory, type ShopProduct } from "@/data/shop-catalog";
import { listLiveShopProducts } from "@/lib/catalog/supabase-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { absoluteUrl } from "@/lib/seo/site-config";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

interface CollectionIntro {
  title: ReactNode;
  description: string;
  /** CSS object-position so each collection's hero crop favours its focal subject. */
  objectPosition?: string;
}

const collectionIntros: Record<ShopCategory, CollectionIntro> = {
  clothing: {
    title: (
      <>
        Traditional silhouettes,
        <br />
        edited for today.
      </>
    ),
    description: "A refined selection of occasion and everyday pieces from the Shazia Khushk edit.",
    objectPosition: "center 45%",
  },
  fragrance: {
    title: (
      <>
        Scents for every
        <br />
        expression.
      </>
    ),
    description: "Explore the fragrance edit through a considered selection of signature bottles.",
    objectPosition: "center 55%",
  },
  "beauty-hair-care": {
    title: (
      <>
        Everyday care,
        <br />
        thoughtfully presented.
      </>
    ),
    description: "A focused edit of beauty and hair-care essentials for everyday routines.",
  },
};

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
    description: collectionIntros[collection.slug].description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      type: "website",
      title: `${collection.label} — Shazia Khushk`,
      description: collectionIntros[collection.slug].description,
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

  const intro = collectionIntros[collection.slug];

  return (
    <div className="shop-page">
      <EditorialIntro
        alt={collection.label}
        description={intro.description}
        eyebrow={collection.label}
        image={collection.image}
        objectPosition={intro.objectPosition}
        priority
        title={intro.title}
      />
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
