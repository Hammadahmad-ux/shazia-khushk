import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getProductById } from "@/lib/admin/products/product-repository";

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Edit Product</h1>
      </div>
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
