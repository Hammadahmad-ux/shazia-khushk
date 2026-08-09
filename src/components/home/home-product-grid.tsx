import Image from "next/image";
import Link from "next/link";

const featuredProducts = [
  {
    title: "Zorvan",
    type: "Eau de Parfum",
    image: "/images/home/zorvan-editorial.png",
    href: "/collections/fragrance",
  },
  {
    title: "Delina",
    type: "Eau de Parfum",
    image: "/images/home/delina-editorial.png",
    href: "/collections/fragrance",
  },
  {
    title: "Hair Growth Serum",
    type: "Hair Care",
    image: "/images/home/hair-growth-serum-editorial.png",
    href: "/collections/beauty-hair-care",
  },
  {
    title: "Herbal Protein Shampoo",
    type: "Hair Care",
    image: "/images/home/herbal-protein-shampoo-editorial.png",
    href: "/collections/beauty-hair-care",
  },
  {
    title: "Hair Oil",
    type: "Hair Care",
    image: "/images/home/hair-oil-editorial.png",
    href: "/collections/beauty-hair-care",
  },
] as const;

export function HomeProductGrid() {
  return (
    <section className="home-section home-product-edit" aria-labelledby="featured-products-title">
      <header className="home-product-edit__header">
        <h2 id="featured-products-title">The Edit</h2>
      </header>

      <div className="home-product-edit__grid">
        {featuredProducts.map((product) => (
          <article key={product.title}>
            <Link className="home-product-edit__card group block no-underline" href={product.href}>
              <div className="home-product-edit__media">
                <Image
                  alt={product.title}
                  className="home-product-edit__image"
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 48vw"
                  src={product.image}
                />
              </div>
              <div className="home-product-edit__details">
                <h3 className="home-product-edit__title">
                  {product.title}
                  <span className="home-product-edit__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </h3>
                <p className="home-product-edit__type">{product.type}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
