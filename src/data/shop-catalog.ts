export type ShopCategory = "clothing" | "fragrance" | "beauty-hair-care";

export interface ShopProduct {
  id: string;
  title: string;
  category: ShopCategory;
  descriptor: string;
  href: string;
  image: string;
  hoverImage?: string;
  alt: string;
  featuredRank: number;
  newestRank: number;
  /** Lowest active, purchasable (priced + in stock) variant price. Null when no such variant exists -- never fabricated. */
  priceMinor: number | null;
  /** Only set when it genuinely exceeds priceMinor for that same variant -- never invented. */
  compareAtPriceMinor: number | null;
  /** True when purchasable variants have different prices, so cards should read "From <price>". */
  priceVaries: boolean;
  /** True when at least one variant is active, priced and in stock. */
  purchasable: boolean;
}

export const shopCategories: readonly {
  slug: ShopCategory;
  label: string;
  href: string;
  description: string;
  image: string;
}[] = [
  {
    slug: "clothing",
    label: "Clothing",
    href: "/collections/clothing",
    description: "Traditional silhouettes and considered details.",
    image: "/images/home/category-clothing-editorial.png",
  },
  {
    slug: "fragrance",
    label: "Fragrance",
    href: "/collections/fragrance",
    description: "A small, expressive fragrance edit.",
    image: "/images/home/category-fragrance-editorial.png",
  },
  {
    slug: "beauty-hair-care",
    label: "Beauty & Hair Care",
    href: "/collections/beauty-hair-care",
    description: "Everyday care, chosen with intention.",
    image: "/images/home/category-beauty-editorial.png",
  },
];

// Static fallback fixture -- no real pricing exists for it, so every
// entry gets explicit nulls rather than a fabricated price (this array
// is currently unused by any live page; see src/data/pdp-catalog.ts).
const staticShopProducts: readonly Omit<ShopProduct, "priceMinor" | "compareAtPriceMinor" | "priceVaries" | "purchasable">[] = [
  {
    id: "clothing-edit",
    title: "Clothing Edit",
    category: "clothing",
    descriptor: "Traditional wear",
    href: "/products/clothing-edit",
    image: "/images/home/clothing-edit.jpeg",
    hoverImage: "/images/home/story-clothing-editorial.png",
    alt: "Traditional clothing editorial image",
    featuredRank: 1,
    newestRank: 6,
  },
  {
    id: "zorvan",
    title: "Zorvan",
    category: "fragrance",
    descriptor: "Eau de Parfum",
    href: "/products/zorvan",
    image: "/images/home/zorvan.png",
    hoverImage: "/images/home/zorvan-editorial.png",
    alt: "Zorvan fragrance bottle",
    featuredRank: 2,
    newestRank: 5,
  },
  {
    id: "delina",
    title: "Delina",
    category: "fragrance",
    descriptor: "Eau de Parfum",
    href: "/products/delina",
    image: "/images/home/delina.png",
    hoverImage: "/images/home/delina-editorial.png",
    alt: "Delina fragrance bottle",
    featuredRank: 3,
    newestRank: 4,
  },
  {
    id: "hair-growth-serum",
    title: "Hair Growth Serum",
    category: "beauty-hair-care",
    descriptor: "Hair care",
    href: "/products/hair-growth-serum",
    image: "/images/home/hair-growth-serum.png",
    hoverImage: "/images/home/hair-growth-serum-editorial.png",
    alt: "Hair growth serum bottle",
    featuredRank: 4,
    newestRank: 3,
  },
  {
    id: "herbal-protein-shampoo",
    title: "Herbal Protein Shampoo",
    category: "beauty-hair-care",
    descriptor: "Hair care",
    href: "/products/herbal-protein-shampoo",
    image: "/images/home/herbal-protein-shampoo.jpeg",
    hoverImage: "/images/home/herbal-protein-shampoo-editorial.png",
    alt: "Herbal protein shampoo bottle",
    featuredRank: 5,
    newestRank: 2,
  },
  {
    id: "hair-oil",
    title: "Hair Oil",
    category: "beauty-hair-care",
    descriptor: "Hair care",
    href: "/products/hair-oil",
    image: "/images/home/hair-oil.jpeg",
    hoverImage: "/images/home/hair-oil-editorial.png",
    alt: "Hair oil bottle",
    featuredRank: 6,
    newestRank: 1,
  },
];

export const shopProducts: readonly ShopProduct[] = staticShopProducts.map((product) => ({
  ...product,
  priceMinor: null,
  compareAtPriceMinor: null,
  priceVaries: false,
  purchasable: false,
}));

export function getShopCategory(slug: string) {
  return shopCategories.find((category) => category.slug === slug) ?? null;
}

export function categoryLabel(category: ShopCategory): string {
  return getShopCategory(category)?.label ?? category;
}
