import { shopProducts, type ShopProduct } from "@/data/shop-catalog";

export type PdpMedia = { src: string; alt: string };
export type PdpOptionGroup = { name: string; values: readonly string[] };
export type PdpDetailSection = { title: string; content: string };

export type PdpProduct = ShopProduct & {
  slug: string;
  gallery: readonly PdpMedia[];
  options: readonly PdpOptionGroup[];
  details: readonly PdpDetailSection[];
  priceMinor: number | null;
  purchasable: boolean;
};

const galleryByProductId: Record<string, readonly PdpMedia[]> = {
  "clothing-edit": [
    { src: "/images/home/clothing-edit.jpeg", alt: "Traditional clothing editorial image" },
    { src: "/images/home/story-clothing-editorial.png", alt: "Traditional clothing editorial detail" },
    { src: "/images/home/category-clothing-editorial.png", alt: "Traditional clothing collection image" },
  ],
  zorvan: [
    { src: "/images/home/zorvan.png", alt: "Zorvan fragrance bottle" },
    { src: "/images/home/zorvan-editorial.png", alt: "Zorvan fragrance editorial image" },
  ],
  delina: [
    { src: "/images/home/delina.png", alt: "Delina fragrance bottle" },
    { src: "/images/home/delina-editorial.png", alt: "Delina fragrance editorial image" },
  ],
  "hair-growth-serum": [
    { src: "/images/home/hair-growth-serum.png", alt: "Hair growth serum bottle" },
    { src: "/images/home/hair-growth-serum-editorial.png", alt: "Hair growth serum editorial image" },
  ],
  "herbal-protein-shampoo": [
    { src: "/images/home/herbal-protein-shampoo.jpeg", alt: "Herbal protein shampoo bottle" },
    { src: "/images/home/herbal-protein-shampoo-editorial.png", alt: "Herbal protein shampoo editorial image" },
  ],
  "hair-oil": [
    { src: "/images/home/hair-oil.jpeg", alt: "Hair oil bottle" },
    { src: "/images/home/hair-oil-editorial.png", alt: "Hair oil editorial image" },
  ],
};

const detailsByProductId: Record<string, readonly PdpDetailSection[]> = {
  "clothing-edit": [{ title: "Description", content: "Traditional wear." }],
  zorvan: [{ title: "Description", content: "Eau de Parfum." }],
  delina: [{ title: "Description", content: "Eau de Parfum." }],
  "hair-growth-serum": [{ title: "Description", content: "Hair care." }],
  "herbal-protein-shampoo": [{ title: "Description", content: "Hair care." }],
  "hair-oil": [{ title: "Description", content: "Hair care." }],
};

export const pdpProducts: readonly PdpProduct[] = shopProducts.map((product) => ({
  ...product,
  slug: product.href.split("/").at(-1) ?? product.id,
  gallery: galleryByProductId[product.id] ?? [{ src: product.image, alt: product.alt }],
  options: [],
  priceMinor: null,
  details: detailsByProductId[product.id] ?? [],
  purchasable: false,
}));

export function getPdpProduct(slug: string) {
  return pdpProducts.find((product) => product.slug === slug) ?? null;
}

export function getRelatedPdpProducts(product: PdpProduct) {
  const sameCategory = pdpProducts.filter((item) => item.category === product.category && item.id !== product.id);
  const fallback = pdpProducts.filter((item) => item.id !== product.id && !sameCategory.includes(item));
  return [...sameCategory, ...fallback].slice(0, 4);
}
