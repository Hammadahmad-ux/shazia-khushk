import assert from "node:assert/strict";
import { test } from "node:test";

import { shipping } from "../../src/lib/commerce/business-config";
import { createCheckoutOrder } from "../../src/lib/commerce/checkout-service";
import type { CreateCheckoutOrderInput } from "../../src/lib/commerce/types";
import { InMemoryCommerceRepository, type SeedVariant } from "./fixtures/in-memory-commerce-repository";

const VALID_MOBILE = "+923001234567";

function baseInput(overrides: Partial<CreateCheckoutOrderInput> = {}): CreateCheckoutOrderInput {
  return {
    idempotencyKey: null,
    contact: { fullName: "Ayesha Khan", mobile: VALID_MOBILE, email: null },
    address: { addressLine: "House 12, Street 4, DHA Phase 6", apartment: null, city: "Karachi", province: "Sindh", postalCode: null },
    paymentMethod: "cash_on_delivery",
    currency: "PKR",
    items: [{ key: { productSlug: "zorvan", variantLabel: null }, quantity: 1 }],
    ...overrides,
  };
}

function seededVariant(overrides: Partial<SeedVariant> = {}): SeedVariant {
  return {
    productId: "product-zorvan",
    productSlug: "zorvan",
    productTitle: "Zorvan Eau de Parfum",
    variantId: "variant-zorvan-default",
    sku: "SKZI-ZORVAN-50ML",
    variantLabel: null,
    priceMinor: 850000,
    productActive: true,
    variantActive: true,
    quantityAvailable: 5,
    ...overrides,
  };
}

test("empty cart is rejected before touching the repository", async () => {
  const repository = new InMemoryCommerceRepository();
  const result = await createCheckoutOrder(repository, baseInput({ items: [] }));

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "empty_cart");
  assert.equal(repository.getCreatedOrders().length, 0);
});

test("unknown product/variant is rejected", async () => {
  const repository = new InMemoryCommerceRepository();
  // Nothing seeded, so the requested slug resolves to nothing.
  const result = await createCheckoutOrder(repository, baseInput());

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "unknown_product");
  assert.equal(repository.getCreatedOrders().length, 0);
});

test("inactive product is rejected even if the variant itself is active", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant({ productActive: false }));

  const result = await createCheckoutOrder(repository, baseInput());

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "inactive_product");
});

test("inactive variant is rejected even if the product itself is active", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant({ variantActive: false }));

  const result = await createCheckoutOrder(repository, baseInput());

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "inactive_product");
});

test("missing (unconfirmed) price is rejected -- catalog entries without a price stay unpurchasable", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant({ priceMinor: null }));

  const result = await createCheckoutOrder(repository, baseInput());

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "missing_price");
});

test("insufficient stock is rejected and does not create an order", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant({ quantityAvailable: 1 }));

  const result = await createCheckoutOrder(
    repository,
    baseInput({ items: [{ key: { productSlug: "zorvan", variantLabel: null }, quantity: 2 }] }),
  );

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "insufficient_stock");
  assert.equal(repository.getCreatedOrders().length, 0);
});

test("invalid quantity (zero, negative, non-integer, unreasonably large) is rejected", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());

  for (const quantity of [0, -1, 1.5, 999]) {
    const result = await createCheckoutOrder(
      repository,
      baseInput({ items: [{ key: { productSlug: "zorvan", variantLabel: null }, quantity }] }),
    );
    assert.equal(result.status, "error", `quantity ${quantity} should be rejected`);
    assert.equal(result.status === "error" && result.code, "invalid_quantity");
  }
});

test("invalid contact / address are rejected before hitting the repository", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());

  const badName = await createCheckoutOrder(repository, baseInput({ contact: { fullName: "A", mobile: VALID_MOBILE, email: null } }));
  assert.equal(badName.status === "error" && badName.code, "invalid_contact");

  const badMobile = await createCheckoutOrder(repository, baseInput({ contact: { fullName: "Ayesha Khan", mobile: "03001234567", email: null } }));
  assert.equal(badMobile.status === "error" && badMobile.code, "invalid_contact", "mobile must already be normalized to +92 by the caller");

  const badAddress = await createCheckoutOrder(
    repository,
    baseInput({ address: { addressLine: "Ho", apartment: null, city: "Karachi", province: null, postalCode: null } }),
  );
  assert.equal(badAddress.status === "error" && badAddress.code, "invalid_address");
});

test("online payment is not available yet", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());

  const result = await createCheckoutOrder(repository, baseInput({ paymentMethod: "online" }));

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "payment_method_unavailable");
});

test("valid COD order is created with a server-calculated total, decrements stock, and ignores any client-sent price", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant({ quantityAvailable: 5, priceMinor: 850000 }));

  const result = await createCheckoutOrder(
    repository,
    baseInput({ items: [{ key: { productSlug: "zorvan", variantLabel: null }, quantity: 2 }] }),
  );

  assert.equal(result.status, "success");
  assert.match(result.status === "success" ? result.orderNumber : "", /^SK-\d{6}$/);

  const [created] = repository.getCreatedOrders();
  assert.equal(created.subtotalMinor, 850000 * 2, "subtotal must be recalculated from the authoritative price, not trusted from the client");
  assert.equal(created.shippingMinor, shipping.flatRateMinor, "shipping must be the confirmed flat PKR 199 rate");
  assert.equal(created.shippingStatus, "flat_rate");
  assert.equal(created.totalMinor, 850000 * 2 + shipping.flatRateMinor, "total must be subtotal + flat shipping");
  assert.equal(created.paymentMethod, "cash_on_delivery");
  assert.equal(repository.getRemainingStock("zorvan", null), 3);
});

test("shipping is a flat PKR 199 regardless of city or subtotal, and the client cannot influence it", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());

  const karachi = await createCheckoutOrder(repository, baseInput({ address: { addressLine: "House 1", apartment: null, city: "Karachi", province: "Sindh", postalCode: null } }));
  const gilgit = await createCheckoutOrder(repository, baseInput({ address: { addressLine: "House 2", apartment: null, city: "Gilgit", province: null, postalCode: null } }));

  assert.equal(karachi.status, "success");
  assert.equal(gilgit.status, "success");

  const [first, second] = repository.getCreatedOrders();
  assert.equal(first.shippingMinor, 19900);
  assert.equal(second.shippingMinor, 19900);
  assert.equal(first.shippingMinor, second.shippingMinor, "shipping must not vary by city");
});

test("multi-line order sums server-side prices per line, not a client-sent subtotal", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());
  repository.seedVariant(
    seededVariant({
      productId: "product-delina",
      productSlug: "delina",
      productTitle: "Delina Eau de Parfum",
      variantId: "variant-delina-default",
      sku: "SKZI-DELINA-50ML",
      priceMinor: 900000,
      quantityAvailable: 3,
    }),
  );

  const result = await createCheckoutOrder(
    repository,
    baseInput({
      items: [
        { key: { productSlug: "zorvan", variantLabel: null }, quantity: 2 },
        { key: { productSlug: "delina", variantLabel: null }, quantity: 1 },
      ],
    }),
  );

  assert.equal(result.status, "success");
  const [created] = repository.getCreatedOrders();
  assert.equal(created.subtotalMinor, 850000 * 2 + 900000 * 1);
});

test("resolves a specific variant by product slug + variant label, matching the storefront's option label format", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(
    seededVariant({
      productSlug: "clothing-edit",
      variantId: "variant-clothing-edit-ivory-m",
      sku: "SK-CLOTHING-IVORY-M",
      variantLabel: "Ivory / M",
      priceMinor: 1249000,
      quantityAvailable: 4,
    }),
  );

  const result = await createCheckoutOrder(
    repository,
    baseInput({ items: [{ key: { productSlug: "clothing-edit", variantLabel: "Ivory / M" }, quantity: 1 }] }),
  );

  assert.equal(result.status, "success");

  const wrongLabel = await createCheckoutOrder(
    repository,
    baseInput({ items: [{ key: { productSlug: "clothing-edit", variantLabel: "Navy / L" }, quantity: 1 }] }),
  );
  assert.equal(wrongLabel.status === "error" && wrongLabel.code, "unknown_product");
});

test("a repeated submission with the same idempotency key returns the original order instead of creating a duplicate", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());

  const input = baseInput({ idempotencyKey: "client-generated-uuid-1" });

  const first = await createCheckoutOrder(repository, input);
  const second = await createCheckoutOrder(repository, input);

  assert.equal(first.status, "success");
  assert.equal(second.status, "success");
  assert.deepEqual(first, second);
  assert.equal(repository.getCreatedOrders().length, 1, "only one order row should have been created");
});

test("a stock race at commit time (caught by the DB, not the pre-check) surfaces as insufficient_stock, not a generic failure", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());
  repository.failNextCreateOrder(new Error("insufficient_stock: SKZI-ZORVAN-50ML"));

  const result = await createCheckoutOrder(repository, baseInput());

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "insufficient_stock");
});

test("an unexpected repository failure is surfaced as a safe generic error, not a raw database error", async () => {
  const repository = new InMemoryCommerceRepository();
  repository.seedVariant(seededVariant());
  repository.failNextCreateOrder(new Error("connection terminated unexpectedly"));

  const result = await createCheckoutOrder(repository, baseInput());

  assert.equal(result.status, "error");
  assert.equal(result.status === "error" && result.code, "unexpected_error");
  assert.doesNotMatch(result.status === "error" ? result.message : "", /connection terminated/);
});
