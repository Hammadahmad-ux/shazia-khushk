import { ProductCard } from "@/components/product/product-card";
import type { ShopProduct } from "@/data/shop-catalog";

export function RelatedProducts({ products }: { products: readonly ShopProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-products-title" className="pdp-related">
      <h2 id="related-products-title">You may also like</h2>
      <div className="pdp-related__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} sizes="(min-width: 1024px) 23vw, 52vw" />
        ))}
      </div>
    </section>
  );
}
