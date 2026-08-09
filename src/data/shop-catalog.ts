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

export const shopProducts: readonly ShopProduct[] = [
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

export function getShopCategory(slug: string) {
  return shopCategories.find((category) => category.slug === slug) ?? null;
}
