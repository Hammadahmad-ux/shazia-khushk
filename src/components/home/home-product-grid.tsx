import { ProductCard } from "@/components/product/product-card";
import type { ShopProduct } from "@/data/shop-catalog";

export function HomeProductGrid({ products }: { products: readonly ShopProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="home-section home-product-edit" aria-labelledby="featured-products-title">
      <header className="home-product-edit__header">
        <h2 id="featured-products-title">The Edit</h2>
      </header>

      <div className="home-product-edit__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 48vw" />
        ))}
      </div>
    </section>
  );
}
