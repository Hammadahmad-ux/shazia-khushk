import { ProductCard } from "@/components/product/product-card";
import type { ShopProduct } from "@/data/shop-catalog";

export function RelatedProducts({ products }: { products: readonly ShopProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-products-title" className="pdp-related">
      <div className="pdp-related__intro">
        <p className="pdp-related__eyebrow">Discover more</p>
        <h2 id="related-products-title">You may also like</h2>
        <p className="pdp-related__description">A considered selection from the Shazia Khushk edit.</p>
      </div>
      <div className="pdp-related__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} sizes="(min-width: 1024px) 23vw, 50vw" />
        ))}
      </div>
    </section>
  );
}
