import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    label: "Clothing",
    cta: "Explore collection",
    href: "/collections/clothing",
    image: "/images/home/category-clothing-editorial.png",
    position: "object-center",
  },
  {
    label: "Fragrance",
    cta: "Discover scents",
    href: "/collections/fragrance",
    image: "/images/home/category-fragrance-editorial.png",
    position: "object-center",
  },
  {
    label: "Beauty & Hair Care",
    cta: "Shop essentials",
    href: "/collections/beauty-hair-care",
    image: "/images/home/category-beauty-editorial.png",
    position: "object-center",
  },
] as const;

export function HomeCategoryGrid() {
  return (
    <section className="home-section home-section-compact home-collection-panels" aria-labelledby="category-title">
      <h2 id="category-title" className="sr-only">
        Shop by category
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            className="group relative min-h-[17rem] overflow-hidden bg-[#d8d4ce] text-white no-underline md:min-h-[15rem] lg:min-h-[18rem]"
            href={category.href}
            key={category.href}
          >
            <Image
              alt=""
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.02] ${category.position}`}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              src={category.image}
            />
            <div className="absolute inset-0 bg-black/28 transition-colors duration-[var(--transition-base)] group-hover:bg-black/36" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
              <h3 className="max-w-[14rem] text-sm font-semibold tracking-[0.13em] uppercase">
                {category.label}
              </h3>
              <p className="mt-3 inline-flex min-h-11 items-center gap-3 text-xs font-medium">
                {category.cta}
                <span aria-hidden="true" className="transition-transform duration-[var(--transition-base)] group-hover:translate-x-1">
                  →
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
