import assert from "node:assert/strict";
import { test } from "node:test";

import { validateProductPayload } from "../../src/lib/admin/products/validate-product";
import type { ProductFormPayload, ProductVariantInput } from "../../src/lib/admin/products/types";

function baseVariant(overrides: Partial<ProductVariantInput> = {}): ProductVariantInput {
  return {
    sku: "SK-TEST-001",
    variantLabel: null,
    size: null,
    color: null,
    volume: null,
    priceMinor: 1000000,
    compareAtPriceMinor: null,
    active: true,
    quantityAvailable: 5,
    lowStockThreshold: null,
    ...overrides,
  };
}

function basePayload(overrides: Partial<ProductFormPayload> = {}): ProductFormPayload {
  return {
    slug: "heritage-suit",
    title: "Heritage Suit",
    category: "clothing",
    subcategory: null,
    description: null,
    active: false,
    featured: false,
    seoTitle: null,
    seoDescription: null,
    attributes: {},
    variants: [baseVariant()],
    media: [],
    ...overrides,
  };
}

test("a well-formed payload has no validation errors", () => {
  assert.deepEqual(validateProductPayload(basePayload()), []);
});

test("missing product name is rejected", () => {
  const errors = validateProductPayload(basePayload({ title: "  " }));
  assert.ok(errors.some((error) => error.field === "title"));
});

test("slug must be lowercase-and-hyphens only", () => {
  for (const slug of ["Heritage Suit", "heritage_suit", "Heritage-Suit!", ""]) {
    const errors = validateProductPayload(basePayload({ slug }));
    assert.ok(errors.some((error) => error.field === "slug"), `"${slug}" should be rejected`);
  }
  assert.deepEqual(validateProductPayload(basePayload({ slug: "heritage-suit-2" })), []);
});

test("an unknown category is rejected", () => {
  const errors = validateProductPayload(basePayload({ category: "shoes" as ProductFormPayload["category"] }));
  assert.ok(errors.some((error) => error.field === "category"));
});

test("a product needs at least one variant", () => {
  const errors = validateProductPayload(basePayload({ variants: [] }));
  assert.ok(errors.some((error) => error.field === "variants"));
});

test("duplicate SKUs within the same product are rejected", () => {
  const errors = validateProductPayload(
    basePayload({
      variants: [baseVariant({ sku: "SK-1", variantLabel: "Ivory / S" }), baseVariant({ sku: "SK-1", variantLabel: "Ivory / M" })],
    }),
  );
  assert.ok(errors.some((error) => error.field === "variants.1.sku"));
});

test("duplicate variant option combinations are rejected", () => {
  const errors = validateProductPayload(
    basePayload({
      variants: [baseVariant({ sku: "SK-1", variantLabel: "Ivory / S" }), baseVariant({ sku: "SK-2", variantLabel: "Ivory / S" })],
    }),
  );
  assert.ok(errors.some((error) => error.field === "variants.1.variantLabel"));
});

test("negative prices are rejected", () => {
  const errors = validateProductPayload(basePayload({ variants: [baseVariant({ priceMinor: -100 })] }));
  assert.ok(errors.some((error) => error.field === "variants.0.priceMinor"));
});

test("stock must be a non-negative whole number", () => {
  for (const quantityAvailable of [-1, 1.5]) {
    const errors = validateProductPayload(basePayload({ variants: [baseVariant({ quantityAvailable })] }));
    assert.ok(errors.some((error) => error.field === "variants.0.quantityAvailable"), `${quantityAvailable} should be rejected`);
  }
});

test("a variant with no confirmed price still passes form validation (price is optional at save time; checkout-service is what blocks purchase)", () => {
  const errors = validateProductPayload(basePayload({ variants: [baseVariant({ priceMinor: null })] }));
  assert.deepEqual(errors, []);
});
