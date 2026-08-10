export type ProductCategory = "clothing" | "fragrance" | "beauty-hair-care";

export interface ProductAttributesInput {
  shortDescription?: string;
  fabric?: string;
  careInstructions?: string[];
  sizeGuide?: string;
  scentDescription?: string;
  ingredients?: string[];
  usageInstructions?: string[];
  warnings?: string[];
}

export interface ProductVariantInput {
  id?: string;
  sku: string;
  variantLabel: string | null;
  size: string | null;
  color: string | null;
  volume: string | null;
  priceMinor: number | null;
  compareAtPriceMinor: number | null;
  active: boolean;
  quantityAvailable: number;
  lowStockThreshold: number | null;
}

export interface ProductMediaInput {
  id?: string;
  url: string;
  alt: string;
  role: "primary" | "gallery";
  position: number;
}

export interface ProductFormPayload {
  slug: string;
  title: string;
  category: ProductCategory;
  subcategory: string | null;
  description: string | null;
  active: boolean;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  attributes: ProductAttributesInput;
  variants: readonly ProductVariantInput[];
  media: readonly ProductMediaInput[];
}

export interface ProductListRow {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  active: boolean;
  featured: boolean;
  variantCount: number;
  minPriceMinor: number | null;
  totalStock: number;
}

export interface ProductDetail extends Omit<ProductFormPayload, "variants" | "media"> {
  id: string;
  variants: readonly (ProductVariantInput & { id: string })[];
  media: readonly (ProductMediaInput & { id: string })[];
}
