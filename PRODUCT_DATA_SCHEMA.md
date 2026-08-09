# Product Data Schema

## Modeling Approach

Use a provider-neutral catalog model with three layers:

1. **Universal product fields** describe identity, merchandising, content, SEO, and relationships.
2. **Variants** own purchasable facts: SKU, option combination, price, active state, and inventory.
3. **A discriminated category-attributes object** stores only fields relevant to Clothing, Perfume, Skincare, Shampoo, or Oil.

Do not create one sparse record containing every possible fabric, scent, skin, hair, and volume field. Do not create separate full product models that duplicate universal commerce fields. Every product—including one with no visible options—has at least one default variant.

## Conventions

- IDs are immutable opaque identifiers, preferably UUIDs/ULIDs or provider IDs mapped behind an adapter.
- Slugs are unique, lowercase, stable, human-readable strings. Slug changes require redirect history.
- Money uses integer minor units and ISO currency `PKR`; `priceMinor: 250000` represents PKR 2,500.00.
- Timestamps are ISO 8601 UTC instants.
- Customer-facing rich text is stored in one defined portable/structured format and sanitized before rendering.
- Empty optional data is omitted or `null` consistently; do not use empty strings as missing values.
- Status, type, badge, and option values use controlled identifiers plus editable display labels.

## Universal Product

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Immutable primary identifier |
| `slug` | string | Yes | Unique; stable URL segment |
| `title` | string | Yes | Customer-facing product name |
| `shortDescription` | plain text | Yes | Concise collection/PDP summary; no unsupported claim |
| `description` | structured rich text | Yes | Full sanitized product content |
| `productType` | enum | Yes | `clothing`, `perfume`, `skincare`, `shampoo`, or `oil` |
| `categoryId` | ID | Yes | Primary navigational category |
| `subcategoryId` | ID/null | No | Must belong beneath the primary category if present |
| `collectionIds` | ID array | No | Editorial/campaign groupings; independent of taxonomy |
| `tags` | controlled ID array | No | Internal discovery/merchandising; not ungoverned claims |
| `status` | enum | Yes | `draft`, `active`, `inactive`, `archived`; only active is purchasable/discoverable by default |
| `featured` | boolean | Yes | Merchandising flag; default false |
| `featuredRank` | integer/null | No | Deterministic ordering among featured products |
| `badges` | Badge array | No | Approved editorial/promotional badges only; availability badges are derived |
| `media` | Media array | Yes | At least one approved primary image before publication |
| `optionDefinitions` | OptionDefinition array | Yes | Empty for customer-facing options when using a default variant |
| `variants` | Variant array | Yes | At least one; one and only one may be default |
| `attributes` | category union | Yes | Type must match `productType` |
| `sizeGuideId` | ID/null | No | Normally clothing only; may reference a shared guide |
| `relatedProductIds` | ordered ID array | No | No self-reference or duplicates |
| `seo` | SEO object | Yes | May fall back to approved product copy until edited |
| `source` | SourceMetadata | No | Import/source ID and revision without leaking credentials |
| `publishedAt` | timestamp/null | No | Publication lifecycle |
| `createdAt` | timestamp | Yes | Set once |
| `updatedAt` | timestamp | Yes | Updated on material change |

### Derived product values

The storefront may expose these read-model fields, but they are calculated from active variants and are not separately editable:

- `priceRange`: lowest/highest current variant price and currency.
- `compareAtRange`: valid reference-price range.
- `availableForSale`: at least one active variant is purchasable.
- `totalAvailableStock`: aggregate only for operations; do not necessarily expose it publicly.
- `optionAvailability`: valid option combinations based on active variants.
- `primaryMedia`: first approved product-level media item or selected-variant override.
- `stockLabel`: `in_stock`, `low_stock`, or `sold_out` from inventory rules.

## Category and Subcategory

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Stable identity |
| `slug` | string | Yes | Unique at the chosen URL scope |
| `title` | string | Yes | Client-approved label |
| `description` | structured text/null | No | Collection/category introduction |
| `parentId` | ID/null | No | `null` for top-level category |
| `productTypeScope` | enum array | Yes | Prevents incompatible product assignment |
| `status` | enum | Yes | `active` or `inactive` |
| `sortOrder` | integer | Yes | Navigation order |
| `seo` | SEO object | Yes | Unique metadata/canonical settings |
| `createdAt`, `updatedAt` | timestamps | Yes | Audit fields |

Categories express taxonomy; collections express curated merchandising. “Featured,” “New arrivals,” or a seasonal story should be a collection, not a product subcategory.

## Variant

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Immutable and unique |
| `productId` | product ID | Yes | Parent reference |
| `sku` | string | Yes | Globally unique, normalized, never reused for a different item |
| `title` | string | Yes | Derived/readable option summary, e.g. client-approved size + color |
| `optionValues` | OptionValueRef array | Yes | Exactly one value for each product option definition |
| `priceMinor` | integer | Yes | Non-negative; authoritative selling price |
| `compareAtPriceMinor` | integer/null | No | Must be greater than `priceMinor` and represent an approved genuine reference price |
| `currency` | literal `PKR` | Yes | Single-currency launch |
| `status` | enum | Yes | `active` or `inactive` |
| `isDefault` | boolean | Yes | Exactly one default per product |
| `inventory` | Inventory object | Yes | Per-variant authority |
| `purchaseLimit` | integer/null | No | Positive maximum per order when configured |
| `weightGrams` | integer/null | No | Non-negative; needed if shipping rules use weight |
| `barcode` | string/null | No | Preserve leading zeros |
| `mediaIds` | ordered ID array | No | Variant-specific images/video; references product media |
| `createdAt`, `updatedAt` | timestamps | Yes | Audit fields |

SKU, price, and inventory belong to the variant. A simple one-size product receives one default variant, preventing separate “simple product” logic throughout cart and order flows.

## Options, Sizes, Colors, and Volume

### OptionDefinition

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | stable key | Yes | Examples: `size`, `color`, `volume`; controlled per catalog |
| `label` | string | Yes | Customer-facing, localizable |
| `position` | integer | Yes | Display/selection order |
| `values` | OptionValue array | Yes | Unique IDs within definition |

### OptionValue

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | stable key | Yes | Variant matching uses this value, not label |
| `label` | string | Yes | Examples only after client approval: `Medium`, `Black`, `50 ml` |
| `position` | integer | Yes | Controlled display order |
| `metadata` | typed object/null | No | Size-system key, color swatch/media, or numeric volume |

Specialized metadata shapes:

- **Size:** `system` (`alpha`, `numeric`, or client-defined), `code`, and optional `sizeGuideRowId`.
- **Color:** approved color name, optional swatch value, optional texture/image asset; a swatch assists selection but never replaces the written name.
- **Volume:** positive decimal value plus controlled unit, normally `ml` only when confirmed. Store numeric data separately from the label for sorting/comparison.

## Inventory

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `trackInventory` | boolean | Yes | If false, low-stock/exact availability claims are suppressed |
| `onHand` | integer/null | Conditional | Non-negative physical count when locally managed |
| `reserved` | integer/null | Conditional | Non-negative temporary/committed reservations |
| `available` | integer/null | Conditional | Derived as provider policy dictates; never client-supplied |
| `allowBackorder` | boolean | Yes | Default false; client approval required to enable |
| `lowStockThreshold` | integer/null | No | Per-variant override; otherwise store setting |
| `source` | enum/string | Yes | Local DB or external inventory adapter identifier |
| `syncedAt` | timestamp/null | No | Needed for external source freshness/operations |

Inventory updates must be atomic at order creation/reservation. A version number or provider revision should support conflict detection. Product files may describe inventory during planning, but a static file is not safe as launch-time transactional inventory.

## Media

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Stable reference |
| `kind` | enum | Yes | `image` or `video` |
| `role` | enum | Yes | `primary`, `gallery`, `hover`, `detail`, `lifestyle`, or `size_guide` |
| `assetKey` | string | Yes | CDN/storage key or approved local path; not a temporary Drive URL |
| `alt` | string | Conditional | Meaningful for informative images; empty only when truly decorative |
| `caption` | string/null | No | Product-safe supporting context |
| `width`, `height` | positive integers | Yes | Reserve layout space |
| `mimeType` | string | Yes | Allowlisted production format |
| `position` | integer | Yes | Stable gallery order |
| `focalPoint` | normalized coordinates/null | No | Art-directed crops |
| `posterAssetKey` | string/null | Video | Required before publishing a video |
| `durationSeconds` | number/null | Video | Non-negative |
| `variantIds` | ID array | No | Variants this media depicts |
| `rights/source` | metadata/null | No | Ownership/approval tracking |

Media schema is defined now, but actual image/video records must wait for the client asset audit.

## Badges

Badges are controlled merchandising data:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `type` | controlled enum | Yes | Examples: `new`, `featured`, `limited`, `promotion`; final set requires approval |
| `label` | string | Yes | Client-approved customer text |
| `startsAt`, `endsAt` | timestamp/null | No | Optional active window |
| `priority` | integer | Yes | Enforce one or a small maximum visible set |
| `source/approval` | string/null | No | Evidence/owner for claims |

`sold_out` and `low_stock` are derived availability states, not manual badges. “Bestseller,” “organic,” “dermatologist tested,” or similar claims require evidence and must not be inferred.

## Category-Specific Attributes

`attributes` is a discriminated union whose `type` equals `productType`. Shared product fields never repeat inside it.

### ClothingAttributes

- `type: clothing`
- `fabricComposition`: approved material entries with optional percentages.
- `materialDescription`: optional client-authored explanation.
- `fit`: controlled/client-approved fit label and notes.
- `careInstructions`: ordered plain-text steps or approved symbols.
- `sizeGuideId`: shared or product-specific guide reference.
- `modelInformation`: optional measurements/size worn, only from the shoot/client.
- `countryOfOrigin`, `lining`, `season`, or `occasion`: optional only when useful and confirmed.

Customer-selectable size and color remain variant options, not duplicated here.

### PerfumeAttributes

- `type: perfume`
- `concentration`: controlled value such as EDP/EDT only when confirmed.
- `scentFamily`: approved controlled values.
- `notes`: optional `top`, `heart`, and `base` arrays from supplied product facts.
- `ingredients`: approved display/INCI text when required.
- `usageInstructions`, `warnings`, `storageInstructions`: client/manufacturer supplied.
- `longevity`, `projection`, audience, or benefit claims: optional verified content, never inferred.

Volume remains a variant option when it changes SKU, price, or inventory.

### SkincareAttributes

- `type: skincare`
- `form`: e.g. serum only when confirmed.
- `ingredients`: ordered Ingredient entries, optionally separating full INCI list from highlighted ingredients.
- `skinTypes`, `concerns`, `benefits`: controlled approved terms.
- `usageInstructions`: amount, sequence, frequency, and application guidance from the client/manufacturer.
- `warnings`, `patchTestGuidance`, `storageInstructions`: source-controlled safety content.
- `volume` is a variant option if multiple sizes exist; otherwise it may still be represented on the default variant option metadata for consistent display.

### ShampooAttributes

- `type: shampoo`
- `ingredients`: approved full/highlighted lists.
- `hairTypes`, `hairConcerns`, `benefits`: controlled approved terms.
- `usageInstructions`, `warnings`, `storageInstructions`: source-controlled content.
- `formulationFacts`: optional verified fields only; avoid free-form marketing booleans.
- Volume/pack size belongs to variants.

### OilAttributes

- `type: oil`
- `applicationArea`: controlled value such as hair, skin, fragrance, or another client-confirmed purpose; do not assume “Oil” means hair oil.
- `oilType/form`: client-approved classification.
- `ingredients`: approved full/highlighted lists.
- `suitability`, `concerns`, `benefits`: controlled verified terms.
- `usageInstructions`, `warnings`, `storageInstructions`: source-controlled content.
- Volume/pack size belongs to variants.

## Supporting Structures

### Ingredient

- stable ID when shared across products;
- client-facing name;
- optional INCI name;
- optional description and highlight flag;
- source/approval metadata.

Ingredient order must preserve the supplied label. Do not claim concentration or effect unless explicitly provided and approved.

### SizeGuide

- `id`, title, unit (`cm` or `in`), measurement instructions;
- dynamic ordered columns and rows to support different garments;
- optional illustration media ID and fit disclaimer;
- created/updated timestamps and approval source.

Avoid hardcoding bust/waist/length fields into Product because garment types may require different measurements.

### SEO

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `title` | string/null | No | Approved override; otherwise deterministic product fallback |
| `description` | string/null | No | Accurate summary without unverified claims |
| `canonicalPath` | string | Yes | Store-relative canonical URL |
| `indexing` | enum | Yes | Normally `index_follow` for active products, otherwise deliberate |
| `openGraphMediaId` | ID/null | No | Approved share media only |

### SourceMetadata

Store external source ID, source system name, import revision/hash, last imported time, and optional operator note. Never store Drive access tokens, API secrets, or raw provider credentials.

## Integrity Rules

- Product slug, variant SKU, category slug, and relevant external IDs are unique.
- Product type and category scope agree; category-specific attribute type matches product type.
- Active products have approved descriptions, SEO fallback, at least one publishable image, and at least one active variant.
- Every variant supplies exactly one value for every defined option; combinations are unique within the product.
- Variant media IDs belong to the same product; related products exist, are unique, and exclude self.
- Prices are non-negative; compare-at price is either null or greater than current price; currency is always PKR at launch.
- Inventory values are non-negative and availability is computed atomically.
- Inactive/archived products and inactive variants cannot be added to a new cart.
- Created timestamps never change; updated timestamps advance on material edits.

## Initial Storage and Migration

During content preparation, the catalog can live in version-controlled, schema-validated data files behind a `CatalogRepository` interface. This is suitable for drafting descriptions, taxonomy, options, and SEO with a small catalog. It is not an acceptable launch authority for live inventory or order writes.

Before transactional launch, choose either a managed commerce platform or database-backed catalog/inventory implementation. Preserve the domain schema and map provider fields through an adapter. Migration must retain stable internal IDs/slugs/SKUs, validate every record, compare product/variant counts and price totals, and support rollback to the previous read source until acceptance checks pass.

## Client Data Required

- Final category/subcategory names and classification of each Oil product.
- Product names, descriptions, SKUs, prices, genuine compare-at prices, active/featured status, and related-product decisions.
- Complete variant matrix, size/color/volume labels, inventory counts/source, thresholds, purchase limits, and backorder policy.
- Ingredients, instructions, materials, care, size guides, benefits, warnings, scent notes, and all evidence-backed claims.
- Approved media mapping, alt-text facts, ownership/rights, and video/poster relationships after assets are ready.
- SEO approvals, badge rules, launch dates, and the operator responsible for ongoing catalog updates.
