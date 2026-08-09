import type {
  Product,
  ProductCollection,
  ProductVariant,
} from "@/types/product";

export const DEVELOPMENT_DATA_NOTICE =
  "Temporary development data. These records are not client products and are not for sale.";

const timestamp = "2026-08-10T00:00:00.000Z";

function createDevelopmentVariant(productId: string, suffix: string): ProductVariant {
  return {
    id: `${productId}-variant`,
    productId,
    sku: `DEV-NOT-FOR-SALE-${suffix}`,
    title: "Development default",
    optionValues: [],
    priceMinor: 0,
    compareAtPriceMinor: null,
    currency: "PKR",
    status: "inactive",
    isDefault: true,
    inventory: {
      trackInventory: false,
      onHand: null,
      reserved: null,
      available: null,
      allowBackorder: false,
      lowStockThreshold: null,
      source: "development-fixture",
      syncedAt: null,
    },
    purchaseLimit: null,
    weightGrams: null,
    barcode: null,
    mediaIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

const commonFields = {
  description: [
    {
      type: "paragraph" as const,
      children: [{ text: DEVELOPMENT_DATA_NOTICE }],
    },
  ],
  subcategoryId: null,
  collectionIds: [],
  tags: ["development-only"],
  status: "draft" as const,
  featured: false,
  featuredRank: null,
  badges: [],
  media: [],
  optionDefinitions: [],
  sizeGuideId: null,
  relatedProductIds: [],
  source: {
    system: "local-development-fixture",
    externalId: null,
    revision: "temporary-v1",
    importedAt: null,
    note: DEVELOPMENT_DATA_NOTICE,
  },
  publishedAt: null,
  createdAt: timestamp,
  updatedAt: timestamp,
};

export const developmentProducts = [
  {
    ...commonFields,
    id: "dev-product-clothing",
    slug: "development-garment",
    title: "Development Garment Record",
    shortDescription: DEVELOPMENT_DATA_NOTICE,
    productType: "clothing",
    categoryId: "clothing",
    variants: [createDevelopmentVariant("dev-product-clothing", "CLOTHING")],
    attributes: {
      type: "clothing",
      fabricComposition: [],
      materialDescription: null,
      fit: null,
      careInstructions: [],
      sizeGuideId: null,
      modelInformation: null,
      countryOfOrigin: null,
      lining: null,
      season: null,
      occasion: null,
    },
    seo: {
      title: null,
      description: null,
      canonicalPath: "/products/development-garment",
      indexing: "noindex_nofollow",
      openGraphMediaId: null,
    },
  },
  {
    ...commonFields,
    id: "dev-product-fragrance",
    slug: "development-fragrance",
    title: "Development Fragrance Record",
    shortDescription: DEVELOPMENT_DATA_NOTICE,
    productType: "perfume",
    categoryId: "fragrance",
    variants: [createDevelopmentVariant("dev-product-fragrance", "FRAGRANCE")],
    attributes: {
      type: "perfume",
      concentration: null,
      scentFamily: [],
      notes: { top: [], heart: [], base: [] },
      ingredients: [],
      usageInstructions: [],
      warnings: [],
      storageInstructions: [],
    },
    seo: {
      title: null,
      description: null,
      canonicalPath: "/products/development-fragrance",
      indexing: "noindex_nofollow",
      openGraphMediaId: null,
    },
  },
  {
    ...commonFields,
    id: "dev-product-care",
    slug: "development-care-item",
    title: "Development Care Record",
    shortDescription: DEVELOPMENT_DATA_NOTICE,
    productType: "skincare",
    categoryId: "beauty-hair-care",
    variants: [createDevelopmentVariant("dev-product-care", "CARE")],
    attributes: {
      type: "skincare",
      form: null,
      ingredients: [],
      skinTypes: [],
      concerns: [],
      benefits: [],
      usageInstructions: [],
      warnings: [],
      patchTestGuidance: null,
      storageInstructions: [],
    },
    seo: {
      title: null,
      description: null,
      canonicalPath: "/products/development-care-item",
      indexing: "noindex_nofollow",
      openGraphMediaId: null,
    },
  },
] satisfies readonly Product[];

export const developmentCollections = [
  {
    id: "collection-clothing",
    slug: "clothing",
    title: "Clothing",
    description: DEVELOPMENT_DATA_NOTICE,
    productIds: ["dev-product-clothing"],
    temporary: true,
  },
  {
    id: "collection-fragrance",
    slug: "fragrance",
    title: "Fragrance",
    description: DEVELOPMENT_DATA_NOTICE,
    productIds: ["dev-product-fragrance"],
    temporary: true,
  },
  {
    id: "collection-beauty-hair-care",
    slug: "beauty-hair-care",
    title: "Beauty & Hair Care",
    description: DEVELOPMENT_DATA_NOTICE,
    productIds: ["dev-product-care"],
    temporary: true,
  },
] satisfies readonly ProductCollection[];
