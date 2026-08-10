import "server-only";

import { getServerSupabaseClient } from "@/lib/supabase/server-client";

import type { ProductAttributesInput, ProductCategory, ProductDetail, ProductFormPayload, ProductListRow } from "./types";

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  subcategory: string | null;
  description: string | null;
  active: boolean;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  attributes: ProductAttributesInput | null;
}

interface VariantInventoryRow {
  quantity_available: number;
  low_stock_threshold: number | null;
}

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
  // PostgREST returns a single object here, not an array: inventory.variant_id
  // is both the primary key and the foreign key, a verified one-to-one relation.
  inventory: VariantInventoryRow | null;
}

interface MediaRow {
  id: string;
  url: string;
  alt: string;
  role: string;
  position: number;
}

interface ProductListQueryRow extends Pick<ProductRow, "id" | "slug" | "title" | "category" | "active" | "featured"> {
  product_variants: Pick<VariantRow, "price_minor" | "inventory">[];
}

interface ProductDetailQueryRow extends ProductRow {
  product_variants: VariantRow[];
  product_media: MediaRow[];
}

export async function listProducts(): Promise<readonly ProductListRow[]> {
  const client = getServerSupabaseClient();
  const { data, error } = await client
    .from("products")
    .select(`id, slug, title, category, active, featured, product_variants ( price_minor, inventory ( quantity_available ) )`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to list products: ${error.message}`);

  return ((data as unknown as ProductListQueryRow[] | null) ?? []).map((row) => {
    const prices = row.product_variants.map((variant) => variant.price_minor).filter((price): price is number => price !== null);
    const totalStock = row.product_variants.reduce((sum, variant) => sum + (variant.inventory?.quantity_available ?? 0), 0);

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      active: row.active,
      featured: row.featured,
      variantCount: row.product_variants.length,
      minPriceMinor: prices.length > 0 ? Math.min(...prices) : null,
      totalStock,
    };
  });
}

const VARIANT_AND_MEDIA_SELECT = `
  product_variants ( id, sku, variant_label, size, color, volume, price_minor, compare_at_price_minor, active, inventory ( quantity_available, low_stock_threshold ) ),
  product_media ( id, url, alt, role, position )`;

export async function getProductById(id: string): Promise<ProductDetail | null> {
  const client = getServerSupabaseClient();
  let { data, error } = await client
    .from("products")
    .select(`id, slug, title, category, subcategory, description, active, featured, seo_title, seo_description, attributes, ${VARIANT_AND_MEDIA_SELECT}`)
    .eq("id", id)
    .maybeSingle();

  if (error && isMissingAttributesColumnError(error.message)) {
    // See insertProductRow's comment: fall back to the pre-migration
    // column set so editing an already-created product still works.
    ({ data, error } = await client
      .from("products")
      .select(`id, slug, title, category, subcategory, description, active, featured, seo_title, seo_description, ${VARIANT_AND_MEDIA_SELECT}`)
      .eq("id", id)
      .maybeSingle());
  }

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  if (!data) return null;

  const row = data as unknown as ProductDetailQueryRow;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    subcategory: row.subcategory,
    description: row.description,
    active: row.active,
    featured: row.featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    attributes: row.attributes ?? {},
    variants: row.product_variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      variantLabel: variant.variant_label,
      size: variant.size,
      color: variant.color,
      volume: variant.volume,
      priceMinor: variant.price_minor,
      compareAtPriceMinor: variant.compare_at_price_minor,
      active: variant.active,
      quantityAvailable: variant.inventory?.quantity_available ?? 0,
      lowStockThreshold: variant.inventory?.low_stock_threshold ?? null,
    })),
    media: row.product_media
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((media) => ({
        id: media.id,
        url: media.url,
        alt: media.alt,
        role: media.role as "primary" | "gallery",
        position: media.position,
      })),
  };
}

async function upsertVariantsAndInventory(productId: string, payload: ProductFormPayload): Promise<void> {
  const client = getServerSupabaseClient();

  const { data: existingVariants, error: existingError } = await client.from("product_variants").select("id").eq("product_id", productId);
  if (existingError) throw new Error(`Failed to read existing variants: ${existingError.message}`);

  const submittedIds = new Set(payload.variants.map((variant) => variant.id).filter((id): id is string => Boolean(id)));
  const toRemove = (existingVariants ?? []).map((row) => row.id as string).filter((id) => !submittedIds.has(id));

  if (toRemove.length > 0) {
    const { error: deleteError } = await client.from("product_variants").delete().in("id", toRemove);
    if (deleteError) throw new Error(`Failed to remove variants: ${deleteError.message}`);
  }

  for (const variant of payload.variants) {
    const { data: variantRow, error: variantError } = await client
      .from("product_variants")
      .upsert(
        {
          ...(variant.id ? { id: variant.id } : {}),
          product_id: productId,
          sku: variant.sku,
          variant_label: variant.variantLabel,
          size: variant.size,
          color: variant.color,
          volume: variant.volume,
          price_minor: variant.priceMinor,
          compare_at_price_minor: variant.compareAtPriceMinor,
          active: variant.active,
        },
        { onConflict: "id" },
      )
      .select("id")
      .single();

    if (variantError) throw new Error(`Failed to save variant ${variant.sku}: ${variantError.message}`);

    const { error: inventoryError } = await client.from("inventory").upsert(
      {
        variant_id: variantRow.id,
        quantity_available: variant.quantityAvailable,
        low_stock_threshold: variant.lowStockThreshold,
      },
      { onConflict: "variant_id" },
    );

    if (inventoryError) throw new Error(`Failed to save stock for ${variant.sku}: ${inventoryError.message}`);
  }
}

async function replaceMedia(productId: string, payload: ProductFormPayload): Promise<void> {
  const client = getServerSupabaseClient();

  const { error: deleteError } = await client.from("product_media").delete().eq("product_id", productId);
  if (deleteError) throw new Error(`Failed to update media: ${deleteError.message}`);

  if (payload.media.length === 0) return;

  const { error: insertError } = await client.from("product_media").insert(
    payload.media.map((media, index) => ({
      product_id: productId,
      url: media.url,
      alt: media.alt,
      role: media.role,
      position: index,
    })),
  );

  if (insertError) throw new Error(`Failed to update media: ${insertError.message}`);
}

function toProductRowInput(payload: ProductFormPayload): Record<string, unknown> {
  return {
    slug: payload.slug,
    title: payload.title,
    category: payload.category,
    subcategory: payload.subcategory,
    description: payload.description,
    active: payload.active,
    featured: payload.featured,
    seo_title: payload.seoTitle,
    seo_description: payload.seoDescription,
    attributes: payload.attributes,
  };
}

function isMissingAttributesColumnError(message: string): boolean {
  return message.toLowerCase().includes("attributes") && message.toLowerCase().includes("column");
}

function withoutAttributes(row: Record<string, unknown>): Record<string, unknown> {
  const clone = { ...row };
  delete clone.attributes;
  return clone;
}

/**
 * The `attributes` jsonb column (supabase/migrations/20260810180000_product_attributes.sql)
 * may not be applied on every environment yet. Rather than block all
 * product creation/editing on that one pending migration, retry once
 * without `attributes` so the rest of the product still saves -- and
 * warn loudly server-side that category-specific fields were dropped.
 */
async function insertProductRow(payload: ProductFormPayload): Promise<{ id: string }> {
  const client = getServerSupabaseClient();
  const { data, error } = await client.from("products").insert(toProductRowInput(payload)).select("id").single();

  if (!error) return data as { id: string };
  if (!isMissingAttributesColumnError(error.message)) throw new Error(`Failed to create product: ${error.message}`);

  console.warn("[admin] products.attributes column is missing -- run the pending migration. Saving product without category-specific attributes.");
  const rowWithoutAttributes = withoutAttributes(toProductRowInput(payload));
  const { data: retryData, error: retryError } = await client.from("products").insert(rowWithoutAttributes).select("id").single();
  if (retryError) throw new Error(`Failed to create product: ${retryError.message}`);

  return retryData as { id: string };
}

async function updateProductRow(id: string, payload: ProductFormPayload): Promise<void> {
  const client = getServerSupabaseClient();
  const { error } = await client.from("products").update(toProductRowInput(payload)).eq("id", id);

  if (!error) return;
  if (!isMissingAttributesColumnError(error.message)) throw new Error(`Failed to update product: ${error.message}`);

  console.warn("[admin] products.attributes column is missing -- run the pending migration. Saving product without category-specific attributes.");
  const rowWithoutAttributes = withoutAttributes(toProductRowInput(payload));
  const { error: retryError } = await client.from("products").update(rowWithoutAttributes).eq("id", id);
  if (retryError) throw new Error(`Failed to update product: ${retryError.message}`);
}

export async function createProductRecord(payload: ProductFormPayload): Promise<string> {
  const { id } = await insertProductRow(payload);

  await upsertVariantsAndInventory(id, payload);
  await replaceMedia(id, payload);

  return id;
}

export async function updateProductRecord(id: string, payload: ProductFormPayload): Promise<void> {
  await updateProductRow(id, payload);

  await upsertVariantsAndInventory(id, payload);
  await replaceMedia(id, payload);
}

export async function setProductActive(id: string, active: boolean): Promise<void> {
  const client = getServerSupabaseClient();
  const { error } = await client.from("products").update({ active }).eq("id", id);
  if (error) throw new Error(`Failed to update product status: ${error.message}`);
}

export async function deleteProductRecord(id: string): Promise<void> {
  const client = getServerSupabaseClient();
  const { error } = await client.from("products").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete product: ${error.message}`);
}
