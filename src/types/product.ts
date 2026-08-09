export type EntityId = string;
export type ISODateString = string;
export type Currency = "PKR";
export type ProductType = "clothing" | "perfume" | "skincare" | "shampoo" | "oil";
export type ProductStatus = "draft" | "active" | "inactive" | "archived";
export type VariantStatus = "active" | "inactive";

export interface RichTextSpan {
  text: string;
  marks?: readonly ("bold" | "italic")[];
}

export interface RichTextBlock {
  type: "paragraph";
  children: readonly RichTextSpan[];
}

export interface SeoMetadata {
  title: string | null;
  description: string | null;
  canonicalPath: string;
  indexing: "index_follow" | "noindex_follow" | "noindex_nofollow";
  openGraphMediaId: EntityId | null;
}

export interface SourceMetadata {
  system: string;
  externalId: string | null;
  revision: string;
  importedAt: ISODateString | null;
  note?: string;
}

export interface Badge {
  type: "new" | "featured" | "limited" | "promotion";
  label: string;
  startsAt: ISODateString | null;
  endsAt: ISODateString | null;
  priority: number;
  approvalSource: string | null;
}

export interface FocalPoint {
  x: number;
  y: number;
}

export interface ProductMedia {
  id: EntityId;
  kind: "image" | "video";
  role: "primary" | "gallery" | "hover" | "detail" | "lifestyle" | "size_guide";
  assetKey: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  mimeType: string;
  position: number;
  focalPoint: FocalPoint | null;
  posterAssetKey: string | null;
  durationSeconds: number | null;
  variantIds: readonly EntityId[];
  rightsSource: string | null;
}

export interface SizeOptionMetadata {
  type: "size";
  system: "alpha" | "numeric" | "client_defined";
  code: string;
  sizeGuideRowId: EntityId | null;
}

export interface ColorOptionMetadata {
  type: "color";
  colorName: string;
  swatch: string | null;
  textureAssetKey: string | null;
}

export interface VolumeOptionMetadata {
  type: "volume";
  value: number;
  unit: "ml";
}

export type OptionMetadata =
  | SizeOptionMetadata
  | ColorOptionMetadata
  | VolumeOptionMetadata;

export interface OptionValue {
  id: EntityId;
  label: string;
  position: number;
  metadata: OptionMetadata | null;
}

export interface OptionDefinition {
  id: EntityId;
  label: string;
  position: number;
  values: readonly OptionValue[];
}

export interface OptionValueReference {
  optionId: EntityId;
  valueId: EntityId;
}

export interface Inventory {
  trackInventory: boolean;
  onHand: number | null;
  reserved: number | null;
  available: number | null;
  allowBackorder: boolean;
  lowStockThreshold: number | null;
  source: string;
  syncedAt: ISODateString | null;
}

export interface ProductVariant {
  id: EntityId;
  productId: EntityId;
  sku: string;
  title: string;
  optionValues: readonly OptionValueReference[];
  priceMinor: number;
  compareAtPriceMinor: number | null;
  currency: Currency;
  status: VariantStatus;
  isDefault: boolean;
  inventory: Inventory;
  purchaseLimit: number | null;
  weightGrams: number | null;
  barcode: string | null;
  mediaIds: readonly EntityId[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Ingredient {
  id: EntityId;
  name: string;
  inciName: string | null;
  description: string | null;
  highlighted: boolean;
  approvalSource: string | null;
}

export interface ClothingAttributes {
  type: "clothing";
  fabricComposition: readonly { material: string; percentage: number | null }[];
  materialDescription: string | null;
  fit: { label: string; notes: string | null } | null;
  careInstructions: readonly string[];
  sizeGuideId: EntityId | null;
  modelInformation: string | null;
  countryOfOrigin: string | null;
  lining: string | null;
  season: string | null;
  occasion: string | null;
}

export interface PerfumeAttributes {
  type: "perfume";
  concentration: string | null;
  scentFamily: readonly string[];
  notes: {
    top: readonly string[];
    heart: readonly string[];
    base: readonly string[];
  };
  ingredients: readonly Ingredient[];
  usageInstructions: readonly string[];
  warnings: readonly string[];
  storageInstructions: readonly string[];
}

export interface SkincareAttributes {
  type: "skincare";
  form: string | null;
  ingredients: readonly Ingredient[];
  skinTypes: readonly string[];
  concerns: readonly string[];
  benefits: readonly string[];
  usageInstructions: readonly string[];
  warnings: readonly string[];
  patchTestGuidance: string | null;
  storageInstructions: readonly string[];
}

export interface ShampooAttributes {
  type: "shampoo";
  ingredients: readonly Ingredient[];
  hairTypes: readonly string[];
  hairConcerns: readonly string[];
  benefits: readonly string[];
  usageInstructions: readonly string[];
  warnings: readonly string[];
  storageInstructions: readonly string[];
  formulationFacts: readonly string[];
}

export interface OilAttributes {
  type: "oil";
  applicationArea: "hair" | "skin" | "fragrance" | "other" | null;
  oilType: string | null;
  ingredients: readonly Ingredient[];
  suitability: readonly string[];
  concerns: readonly string[];
  benefits: readonly string[];
  usageInstructions: readonly string[];
  warnings: readonly string[];
  storageInstructions: readonly string[];
}

export type ProductAttributes =
  | ClothingAttributes
  | PerfumeAttributes
  | SkincareAttributes
  | ShampooAttributes
  | OilAttributes;

interface ProductBase {
  id: EntityId;
  slug: string;
  title: string;
  shortDescription: string;
  description: readonly RichTextBlock[];
  categoryId: EntityId;
  subcategoryId: EntityId | null;
  collectionIds: readonly EntityId[];
  tags: readonly EntityId[];
  status: ProductStatus;
  featured: boolean;
  featuredRank: number | null;
  badges: readonly Badge[];
  media: readonly ProductMedia[];
  optionDefinitions: readonly OptionDefinition[];
  variants: readonly ProductVariant[];
  sizeGuideId: EntityId | null;
  relatedProductIds: readonly EntityId[];
  seo: SeoMetadata;
  source: SourceMetadata | null;
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

type ProductOf<TType extends ProductType, TAttributes extends ProductAttributes> =
  ProductBase & {
    productType: TType;
    attributes: TAttributes;
  };

export type ClothingProduct = ProductOf<"clothing", ClothingAttributes>;
export type PerfumeProduct = ProductOf<"perfume", PerfumeAttributes>;
export type SkincareProduct = ProductOf<"skincare", SkincareAttributes>;
export type ShampooProduct = ProductOf<"shampoo", ShampooAttributes>;
export type OilProduct = ProductOf<"oil", OilAttributes>;

export type Product =
  | ClothingProduct
  | PerfumeProduct
  | SkincareProduct
  | ShampooProduct
  | OilProduct;

export interface ProductCategory {
  id: EntityId;
  slug: string;
  title: string;
  description: readonly RichTextBlock[] | null;
  parentId: EntityId | null;
  productTypeScope: readonly ProductType[];
  status: "active" | "inactive";
  sortOrder: number;
  seo: SeoMetadata;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ProductCollection {
  id: EntityId;
  slug: string;
  title: string;
  description: string;
  productIds: readonly EntityId[];
  temporary: boolean;
}
