# Product data import

This folder intentionally ships with **no product rows**. Every current
catalog record (`src/data/development-catalog.ts`,
`src/data/shop-catalog.ts`) is placeholder/development data with no
confirmed price, SKU, or stock -- per `CLIENT_MISSING_INFO.md` those
facts are still launch blockers. Seeding fake "sale-ready" products
would make checkout appear to work while silently lying about price and
availability, so `products.example.json` below is a **shape reference
only**, not data to run.

## Import format

Once the client confirms real product data, insert rows in this order
so foreign keys resolve: `products` -> `product_variants` ->
`inventory` -> `product_media`.

A product only becomes purchasable once:

- `products.active = true`
- its variant has `product_variants.active = true`
- its variant has a non-null `product_variants.price_minor`
- its variant has a matching `inventory` row with
  `quantity_available > 0`

Leave any of those unset and `checkout-service.ts` will reject the
line item with a specific, typed error (`inactive_product`,
`missing_price`, `insufficient_stock`) instead of allowing the order
through -- see `src/lib/commerce/checkout-service.ts` and its tests in
`tests/commerce/checkout-service.test.ts`.

`product_variants.variant_label` must match exactly what the storefront
UI generates from selected options (see
`Object.values(selectedOptions).join(" / ")` in
`src/components/product/product-detail.tsx`), for example `"Ivory / M"`,
or be `NULL` for a product with only one purchasable variant. This is
how the server resolves a cart line (product slug + label) back to an
authoritative variant without trusting a client-supplied id.

## Example shape (not real data -- do not insert as-is)

See `products.example.json` in this folder. Prices are shown as
`null` deliberately: a confirmed PKR price from the client must replace
every `null` before a row is flipped to `active = true`.
