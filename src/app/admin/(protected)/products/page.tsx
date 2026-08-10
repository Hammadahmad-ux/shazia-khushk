import type { Metadata } from "next";
import Link from "next/link";

import { toggleProductActiveForm } from "@/lib/admin/actions/product-actions";
import { listProducts } from "@/lib/admin/products/product-repository";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatMoney } from "@/utils/format-money";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

const CATEGORY_LABEL: Record<string, string> = {
  clothing: "Clothing",
  fragrance: "Fragrance",
  "beauty-hair-care": "Beauty & Hair Care",
};

export default async function AdminProductsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-page">
        <h1>Products</h1>
        <p className="admin-notice">Supabase is not configured, so products cannot be loaded.</p>
      </div>
    );
  }

  const products = await listProducts();

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Products</h1>
        <Link className="admin-button admin-button--primary" href="/admin/products/new">
          New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="admin-empty">No products yet. Create the first one.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Variants</th>
                <th>From</th>
                <th>Stock</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link href={`/admin/products/${product.id}/edit`}>{product.title}</Link>
                    {product.featured && <span className="admin-badge admin-badge--muted">Featured</span>}
                  </td>
                  <td>{CATEGORY_LABEL[product.category] ?? product.category}</td>
                  <td>{product.variantCount}</td>
                  <td>{product.minPriceMinor !== null ? formatMoney(product.minPriceMinor) : "—"}</td>
                  <td>{product.totalStock}</td>
                  <td>
                    <span className={product.active ? "admin-badge admin-badge--active" : "admin-badge admin-badge--muted"}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <form action={toggleProductActiveForm.bind(null, product.id, !product.active)}>
                      <button className="admin-button" type="submit">
                        {product.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
