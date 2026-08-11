import type { ProductFormPayload } from "./types";

export interface ProductValidationError {
  field: string;
  message: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CATEGORIES = new Set(["clothing", "fragrance", "beauty-hair-care"]);

export function validateProductPayload(payload: ProductFormPayload): ProductValidationError[] {
  const errors: ProductValidationError[] = [];

  if (!payload.title.trim()) errors.push({ field: "title", message: "Product name is required." });
  if (!SLUG_PATTERN.test(payload.slug)) errors.push({ field: "slug", message: "Slug must be lowercase letters, numbers, and hyphens only." });
  if (!CATEGORIES.has(payload.category)) errors.push({ field: "category", message: "Select a category." });
  if (payload.variants.length === 0) errors.push({ field: "variants", message: "Add at least one variant." });

  if (payload.media[0]?.mediaType === "video") {
    errors.push({ field: "media", message: "The first media item must be a photo -- product cards and cart thumbnails can't use a video." });
  }

  const skus = new Set<string>();
  const labels = new Set<string>();

  payload.variants.forEach((variant, index) => {
    if (!variant.sku.trim()) errors.push({ field: `variants.${index}.sku`, message: "SKU is required." });

    if (skus.has(variant.sku)) errors.push({ field: `variants.${index}.sku`, message: "SKU must be unique within this product." });
    skus.add(variant.sku);

    const labelKey = variant.variantLabel ?? "";
    if (labels.has(labelKey)) errors.push({ field: `variants.${index}.variantLabel`, message: "This option combination is already used by another variant." });
    labels.add(labelKey);

    if (variant.priceMinor !== null && variant.priceMinor < 0) errors.push({ field: `variants.${index}.priceMinor`, message: "Price cannot be negative." });
    if (variant.compareAtPriceMinor !== null && variant.compareAtPriceMinor < 0) {
      errors.push({ field: `variants.${index}.compareAtPriceMinor`, message: "Compare-at price cannot be negative." });
    }
    if (!Number.isInteger(variant.quantityAvailable) || variant.quantityAvailable < 0) {
      errors.push({ field: `variants.${index}.quantityAvailable`, message: "Stock must be a non-negative whole number." });
    }
  });

  return errors;
}
