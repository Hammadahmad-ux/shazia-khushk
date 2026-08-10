import type { Metadata } from "next";

import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "New Product",
  robots: { index: false, follow: false },
};

export default function AdminNewProductPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>New Product</h1>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
