import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product/product-detail";
import { RelatedProducts } from "@/components/product/related-products";
import { getLivePdpProductBySlug, listLiveShopProducts, pickRelatedLiveProducts } from "@/lib/catalog/supabase-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { absoluteUrl } from "@/lib/seo/site-config";
import type { PdpProduct } from "@/data/pdp-catalog";
import type { ShopProduct } from "@/data/shop-catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Products are created/activated live from the admin panel, so their
// slugs cannot be known at build time -- this route is fully dynamic
// (no generateStaticParams / dynamicParams=false, unlike collections,
// whose 3 category slugs are genuinely fixed).

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  if (!isSupabaseConfigured()) return { title: "Product not found" };

  const { slug } = await params;
  let product: PdpProduct | null = null;
  try {
    product = await getLivePdpProductBySlug(slug);
  } catch {
    // A catalog outage must not fail the whole request; fall back to a
    // safe title rather than leaking a database error.
    return { title: "Product unavailable" };
  }
  if (!product) return { title: "Product not found" };

  // Sensible fallback when optional SEO fields are missing -- never a
  // fabricated claim about the product itself.
  const description = product.descriptor.trim() || `Shop ${product.title} at Shazia Khushk.`;
  const ogImage = product.gallery.find((media) => media.src)?.src;

  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      type: "website",
      title: `${product.title} — Shazia Khushk`,
      description,
      url: absoluteUrl(`/products/${slug}`),
      images: ogImage ? [{ url: ogImage, alt: product.alt }] : [{ url: absoluteUrl("/brand/shazia-khushk-mark.png"), alt: "Shazia Khushk" }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  if (!isSupabaseConfigured()) notFound();

  const { slug } = await params;

  let product: PdpProduct | null = null;
  let loadError = false;
  try {
    product = await getLivePdpProductBySlug(slug);
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="grid gap-10">
        <div>
          <p className="shop-notice" role="status">
            We couldn&rsquo;t load this product right now. Please try again in a moment.
          </p>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  let related: readonly ShopProduct[] = [];
  try {
    const allProducts = await listLiveShopProducts();
    related = pickRelatedLiveProducts(allProducts, product);
  } catch {
    related = [];
  }

  return (
    <div className="pdp-page">
      <ProductDetail product={product} />
      <RelatedProducts products={related} />
    </div>
  );
}
