import "server-only";

import type { PdpDetailSection, PdpOptionGroup, PdpProduct, PdpVariant } from "@/data/pdp-catalog";
import type { ShopCategory, ShopProduct } from "@/data/shop-catalog";
import { getServerSupabaseClient } from "@/lib/supabase/server-client";

// Adapts live, active Supabase products into the exact ShopProduct /
// PdpProduct shapes src/data/shop-catalog.ts and src/data/pdp-catalog.ts
// already export, so it can become a drop-in replacement for those
// static fixtures once real product data exists. Inactive products
// never appear here; a variant without a confirmed price is excluded
// from purchasable option combinations (never becomes purchasable).

interface VariantRow {
  id: string;
  sku: string;
  variant_label: string | null;
  size: string | null;
  color: string | null;
  volume: string | null;
  price_minor: number | null;
  compare_at_price_minor: number | null;
  active: boolean;
  // PostgREST returns this as a single object (verified against the
  // live project), not an array -- inventory.variant_id is both the
  // primary key and the foreign key, a one-to-one relation.
  inventory: { quantity_available: number } | null;
}

interface MediaRow {
  url: string;
  alt: string;
  role: string;
  position: number;
  media_type: string;
}

interface ProductAttributesRow {
  shortDescription?: string;
  fabric?: string;
  careInstructions?: string[];
  sizeGuide?: string;
  scentDescription?: string;
  ingredients?: string[];
  usageInstructions?: string[];
  warnings?: string[];
}

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  category: ShopCategory;
  description: string | null;
  featured: boolean;
  created_at: string;
  attributes: ProductAttributesRow | null;
  product_variants: VariantRow[];
  product_media: MediaRow[];
}

const SELECT = `id, slug, title, category, description, featured, created_at, attributes,
  product_variants ( id, sku, variant_label, size, color, volume, price_minor, compare_at_price_minor, active, inventory ( quantity_available ) ),
  product_media ( url, alt, role, position, media_type )`;

async function fetchActiveProducts(): Promise<ProductRow[]> {
  const client = getServerSupabaseClient();
  const { data, error } = await client.from("products").select(SELECT).eq("active", true).order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load storefront catalog: ${error.message}`);
  return (data as unknown as ProductRow[] | null) ?? [];
}

function sortedMedia(row: ProductRow): MediaRow[] {
  return row.product_media.slice().sort((a, b) => a.position - b.position);
}

// Product cards, cart lines, and hover-swap thumbnails all render this
// through next/image, which can't display a video -- so the "primary"
// and "hover" picks must skip video rows even if one was reordered to
// the front in the admin gallery.
function firstImage(media: readonly MediaRow[]): MediaRow | undefined {
  return media.find((item) => item.media_type !== "video");
}

// A variant only counts as purchasable if it is active, has a
// confirmed price, and has stock -- matching the exact rules
// checkout-service.ts enforces server-side at order time.
function isPurchasableVariant(variant: VariantRow): boolean {
  return variant.active && variant.price_minor !== null && (variant.inventory?.quantity_available ?? 0) > 0;
}

interface PriceSummary {
  priceMinor: number | null;
  compareAtPriceMinor: number | null;
  priceVaries: boolean;
  purchasable: boolean;
}

/** Centralized so every surface (shop cards, related products, PDP) agrees on "the price" for a product: the lowest active/priced/in-stock variant. */
function summarizePrice(variants: readonly VariantRow[]): PriceSummary {
  const purchasable = variants.filter(isPurchasableVariant);
  if (purchasable.length === 0) {
    return { priceMinor: null, compareAtPriceMinor: null, priceVaries: false, purchasable: false };
  }

  const cheapest = purchasable.reduce((min, variant) => ((variant.price_minor ?? Infinity) < (min.price_minor ?? Infinity) ? variant : min));
  const distinctPrices = new Set(purchasable.map((variant) => variant.price_minor));
  const compareAtPriceMinor =
    cheapest.compare_at_price_minor !== null && cheapest.price_minor !== null && cheapest.compare_at_price_minor > cheapest.price_minor
      ? cheapest.compare_at_price_minor
      : null;

  return {
    priceMinor: cheapest.price_minor,
    compareAtPriceMinor,
    priceVaries: distinctPrices.size > 1,
    purchasable: true,
  };
}

function toShopProduct(row: ProductRow, featuredRank: number, newestRank: number): ShopProduct {
  const media = sortedMedia(row);
  const primary = firstImage(media);
  const hover = media.find((item) => item !== primary && item.media_type !== "video");
  const price = summarizePrice(row.product_variants);

  return {
    id: row.slug,
    title: row.title,
    category: row.category,
    descriptor: row.attributes?.shortDescription ?? "",
    href: `/products/${row.slug}`,
    image: primary?.url ?? "",
    hoverImage: hover?.url,
    alt: primary?.alt ?? row.title,
    featuredRank,
    newestRank,
    ...price,
  };
}

export async function listLiveShopProducts(): Promise<readonly ShopProduct[]> {
  const rows = await fetchActiveProducts();
  const featuredOnly = rows.filter((row) => row.featured);

  return rows.map((row) => {
    const featuredRank = featuredOnly.findIndex((featured) => featured.id === row.id);
    const newestRank = rows.findIndex((candidate) => candidate.id === row.id);
    return toShopProduct(row, featuredRank === -1 ? rows.length : featuredRank, newestRank);
  });
}

/** Same-category products first, then fills up to 4 with anything else -- mirrors src/data/pdp-catalog.ts's getRelatedPdpProducts. */
export function pickRelatedLiveProducts(all: readonly ShopProduct[], current: { id: string; category: ShopCategory }): readonly ShopProduct[] {
  const sameCategory = all.filter((item) => item.category === current.category && item.id !== current.id);
  const fallback = all.filter((item) => item.id !== current.id && !sameCategory.includes(item));
  return [...sameCategory, ...fallback].slice(0, 4);
}

const OPTION_DIMENSIONS: readonly ["Color" | "Size" | "Volume", (variant: VariantRow) => string | null][] = [
  ["Color", (variant) => variant.color],
  ["Size", (variant) => variant.size],
  ["Volume", (variant) => variant.volume],
];

function toOptionGroups(variants: readonly VariantRow[]): PdpOptionGroup[] {
  const groups: PdpOptionGroup[] = [];

  for (const [name, pick] of OPTION_DIMENSIONS) {
    const values = Array.from(new Set(variants.map(pick).filter((value): value is string => Boolean(value))));
    if (values.length > 0) groups.push({ name, values });
  }

  return groups;
}

function toPdpVariants(variants: readonly VariantRow[]): PdpVariant[] {
  return variants.map((variant) => {
    const options: Partial<Record<string, string>> = {};
    for (const [name, pick] of OPTION_DIMENSIONS) {
      const value = pick(variant);
      if (value) options[name] = value;
    }

    return {
      id: variant.id,
      variantLabel: variant.variant_label,
      options,
      priceMinor: variant.price_minor,
      compareAtPriceMinor:
        variant.compare_at_price_minor !== null && variant.price_minor !== null && variant.compare_at_price_minor > variant.price_minor
          ? variant.compare_at_price_minor
          : null,
      active: variant.active,
      quantityAvailable: variant.inventory?.quantity_available ?? 0,
    };
  });
}

// Category-specific facts come from the admin-authored products.attributes
// JSON (see supabase/migrations/20260810180000_product_attributes.sql) --
// nothing here is ever invented, and a section is only included when the
// admin actually filled it in.
function buildDetailSections(row: ProductRow): PdpDetailSection[] {
  const attributes = row.attributes ?? {};
  const sections: PdpDetailSection[] = [];

  if (row.description) sections.push({ title: "Description", content: row.description });

  if (row.category === "clothing") {
    const fabricAndCare = [attributes.fabric, ...(attributes.careInstructions ?? [])].filter(
      (value): value is string => Boolean(value && value.trim().length > 0),
    );
    if (fabricAndCare.length > 0) sections.push({ title: "Fabric & Care", content: fabricAndCare });
    if (attributes.sizeGuide) sections.push({ title: "Size & Fit", content: attributes.sizeGuide });
  }

  if (row.category === "fragrance" && attributes.scentDescription) {
    sections.push({ title: "Fragrance Details", content: attributes.scentDescription });
  }

  if (row.category === "beauty-hair-care") {
    if ((attributes.usageInstructions ?? []).length > 0) sections.push({ title: "How to Use", content: attributes.usageInstructions ?? [] });
    if ((attributes.ingredients ?? []).length > 0) sections.push({ title: "Ingredients", content: attributes.ingredients ?? [] });
  }

  if ((attributes.warnings ?? []).length > 0) sections.push({ title: "Warnings", content: attributes.warnings ?? [] });

  return sections;
}

export async function getLivePdpProductBySlug(slug: string): Promise<PdpProduct | null> {
  const client = getServerSupabaseClient();
  const { data, error } = await client.from("products").select(SELECT).eq("slug", slug).eq("active", true).maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  if (!data) return null;

  const row = data as unknown as ProductRow;
  const media = sortedMedia(row);
  const primary = firstImage(media);
  const hover = media.find((item) => item !== primary && item.media_type !== "video");
  const price = summarizePrice(row.product_variants);

  return {
    id: row.slug,
    title: row.title,
    category: row.category,
    descriptor: row.attributes?.shortDescription ?? "",
    href: `/products/${row.slug}`,
    image: primary?.url ?? "",
    hoverImage: hover?.url,
    alt: primary?.alt ?? row.title,
    featuredRank: row.featured ? 0 : Number.MAX_SAFE_INTEGER,
    newestRank: 0,
    slug: row.slug,
    gallery: media.map((item) => ({ src: item.url, alt: item.alt, mediaType: item.media_type === "video" ? "video" : "image" })),
    options: toOptionGroups(row.product_variants),
    variants: toPdpVariants(row.product_variants),
    details: buildDetailSections(row),
    ...price,
  };
}
