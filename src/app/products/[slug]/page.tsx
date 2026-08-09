import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product/product-detail";
import { RelatedProducts } from "@/components/product/related-products";
import { getPdpProduct, getRelatedPdpProducts, pdpProducts } from "@/data/pdp-catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return pdpProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getPdpProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.descriptor,
    robots: { index: false, follow: false },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getPdpProduct(slug);
  if (!product) notFound();

  return <div className="pdp-page"><ProductDetail product={product} /><RelatedProducts products={getRelatedPdpProducts(product)} /></div>;
}
