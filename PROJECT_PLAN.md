# Project Plan

## Product Outcome and Constraints

Build a fast, trustworthy Pakistani DTC storefront for a small curated catalog. The experience should make discovery and product understanding feel premium while keeping purchase paths obvious. The first release should favor a maintainable modular storefront over marketplace features, complex personalization, or premature account functionality.

No application stack, commerce backend, CMS, payment provider, courier integration, analytics platform, or final language strategy has been selected yet. These are discovery decisions, not assumptions. Final visual tokens also depend on reviewing the supplied logo, photography, videos, and product data.

## Architecture Principles

- Use the Next.js App Router, React, TypeScript, and Tailwind after the planning phase is approved.
- Default to React Server Components; isolate cart controls, galleries, filters, and drawers into small client boundaries.
- Use a modular monolith with feature folders and typed domain models. Keep commerce/CMS integrations behind narrow adapters so the storefront is not coupled to a vendor response shape.
- Treat URLs and server data as state where possible. Add client state only for immediate interaction.
- Use shadcn/ui selectively for accessible behavior-heavy primitives such as Sheet, Dialog, and form controls—not as the visual identity.
- Make price, stock, promotions, shipping eligibility, and order totals server-authoritative.

## Information Architecture and Routes

| Route | Purpose |
| --- | --- |
| `/` | Editorial homepage and primary discovery entry |
| `/shop` | Curated shop-all view; no inventory-dense marketplace layout |
| `/collections/[slug]` | Category or campaign collection, including Clothes, Perfumes, Serum/Skincare, Shampoo, and Oil |
| `/products/[slug]` | Product detail and purchase decision page |
| `/search` | Search with query in the URL and useful zero-result recovery |
| `/cart` | Accessible full-page cart fallback; cart drawer remains the fast path |
| `/checkout/contact` | Guest contact and delivery details |
| `/checkout/delivery` | Shipping method and delivery expectations |
| `/checkout/payment` | COD and any confirmed online payment options |
| `/checkout/review` | Final verified totals and order submission |
| `/order/[reference]/confirmation` | Private confirmation accessed with a non-guessable token/session |
| `/track-order` | Order lookup once the fulfillment source supports it |
| `/about`, `/contact` | Brand story and support |
| `/policies/[slug]` | Shipping, returns, privacy, and terms |

Category taxonomy and editorial collections must be separate. A product can belong to one primary category and multiple curated collections without duplicating its URL. Account, wishlist, journal, and Urdu routes should be deferred until the business case and content are confirmed.

## Homepage Structure

1. Optional single-line announcement for a real, current promise only.
2. Brand header with direct category access, search, and cart.
3. Editorial hero using approved photography or video, one primary CTA, and one optional secondary link.
4. Curated collection statement: a small set of visually distinct category entrances.
5. Featured products: four to six intentional picks, not an endless carousel.
6. Category story module combining large media, concise copy, and a shop link.
7. Product or routine story using supplied video when it adds understanding.
8. Brand proof: sourcing, formulation, materials, delivery, or service claims only when verified.
9. Verified reviews or customer content when real data is available.
10. Quiet newsletter or support CTA and a policy-rich footer.

The homepage should be merchandisable from structured content so section order, featured products, and campaigns can change without rebuilding components.

## Collection and Category Pages

- Lead with a short editorial introduction and optional campaign image; keep products visible without excessive scrolling.
- Use two columns on standard mobile widths and three on desktop to preserve image scale. Allow one-column treatment only for narrow devices or story-led modules.
- Provide only useful controls: sort plus category-specific filters such as size, volume, product type, availability, or price. Persist these in search parameters and make results shareable.
- For a small catalog, show the complete result set or use explicit pagination. Do not use infinite scroll.
- Interleave at most one purposeful editorial module where it does not disrupt comparison.
- Include clear empty, loading, error, and no-filter-result recovery states.

## Product Detail Page

- Breadcrumbs and concise product context.
- Media gallery with consistent image ratios, zoom, accessible video controls, poster images, and thumbnails where useful.
- Product name, short descriptor, price in PKR, legitimate compare-at pricing, stock status, and reviews if verified.
- Explicit variant selection with unavailable combinations disabled; never guess a required size, color, or volume.
- Quantity, primary add-to-cart action, and a secondary fast-buy path only after checkout behavior is proven.
- Delivery estimate, shipping threshold, returns summary, and payment availability based on actual rules.
- Scannable product story, specifications, care/how-to-use, materials or ingredients, safety information, and size guide as applicable.
- Curated complementary products or “complete the routine” items, limited to relevant choices.
- Mobile sticky purchase bar only after the main purchase controls leave the viewport; it must reflect selected variant, price, stock, and safe-area insets.

## Cart Journey

1. Add-to-cart validates variant, quantity, price, and availability.
2. Announce success accessibly and open a right-side drawer on desktop; use a near-full-screen sheet on mobile.
3. Show image, selected variant, quantity controls, unit price, subtotal, fulfillment notes, and remove action.
4. Recalculate totals after every mutation and explain shipping/tax estimates without false certainty.
5. Keep one dominant checkout CTA and a clear continue-shopping action. Limit cross-sells to one or two genuinely related items.
6. Persist the cart across navigation and refresh; reconcile it with server inventory and pricing before checkout.
7. Preserve `/cart` as a resilient alternative when a drawer is unsuitable or JavaScript fails.

## Checkout Journey

Use guest checkout by default. Keep steps short, preserve progress, support browser back behavior, and show an order summary throughout.

- **Contact:** name, phone, email when required, and communication preference. Normalize Pakistani phone numbers without rejecting valid formats prematurely.
- **Address:** recipient, address lines, area/landmark where supported, city, province/region, and postal code according to courier requirements. Use appropriate autocomplete and mobile keyboards.
- **Delivery:** show named methods, cost, realistic estimate, and service limitations.
- **Payment:** support COD if the client confirms it; add only vetted online providers. Explain fees or verification requirements before submission.
- **Review:** verify cart, stock, discounts, shipping, and total on the server. Make order creation idempotent and prevent duplicate submission.
- **Confirmation:** provide order reference, summary, delivery expectation, support route, and tracking instructions without exposing order data through a guessable URL.

Payment webhooks must be signature-verified and retry-safe. Checkout ownership, COD verification, failed-payment recovery, cancellation, returns, and refund operations require explicit backend/provider decisions before implementation.

## Mobile Commerce Journey

- Design from 375 px upward and verify narrower devices separately; use 44 x 44 px minimum targets and at least 8 px between adjacent controls.
- Keep search, cart, and menu reachable in a compact sticky header without obscuring content.
- Use tap—not hover—for essential actions. Variant quick-add opens a labeled bottom sheet.
- Preserve native vertical scrolling and browser back behavior; avoid gesture-only navigation.
- Use sticky purchase and checkout actions sparingly, account for device safe areas, and never cover validation messages or the on-screen keyboard.
- Apply correct `inputmode`, autocomplete, persistent labels, inline errors, and a visible step indicator during checkout.

## Reusable Component Architecture

Recommended boundaries after initialization:

- `app/`: routes, layouts, metadata, loading/error/not-found boundaries.
- `features/catalog/`: collections, filtering, product cards, merchandising modules.
- `features/product/`: gallery, variant selection, product information, purchase controls.
- `features/cart/`: cart domain adapter, drawer, line items, totals, persistence.
- `features/checkout/`: step schemas, forms, delivery/payment adapters, order submission.
- `components/commerce/`: reusable composed storefront patterns.
- `components/ui/`: small branded primitives and selectively adopted shadcn behavior.
- `lib/commerce/`, `lib/cms/`, `lib/analytics/`: typed integration interfaces and server-only adapters.

Core reusable units include `SiteHeader`, `MobileMenu`, `SearchOverlay`, `EditorialHero`, `CollectionFeature`, `ProductCard`, `ProductGrid`, `ProductGallery`, `VariantSelector`, `Price`, `StockStatus`, `PurchasePanel`, `StickyPurchaseBar`, `CartDrawer`, `CartLine`, `OrderSummary`, `TrustBlock`, and `SiteFooter`. Composition belongs at the page/feature level; domain rules must not live inside presentational components.

## Product Data Model

Use a normalized, provider-neutral model:

- **Product:** `id`, `slug`, `title`, optional subtitle, short/long descriptions, status, primary category, collection IDs, tags, product type, vendor/brand, SEO, media, variant IDs, structured attributes, related-product IDs, timestamps.
- **Variant:** `id`, `sku`, option values (size/color/volume/etc.), integer price in minor units, optional compare-at price, `PKR` currency, inventory policy/quantity, availability, weight/dimensions, barcode, media references.
- **Media:** stable ID, image/video type, source/CDN key, width, height, aspect ratio, alt text, caption, focal point, poster, ordering, rights/source metadata.
- **Category/Collection:** ID, slug, title, description, hero media, SEO, merchandising order, optional parent category.
- **Attributes:** typed category-specific groups for clothing materials/care/size guide; perfume concentration, volume, and scent notes; skincare ingredients, skin type, concerns, and use; hair products ingredients, hair type, concerns, and use.
- **Commerce:** Cart, CartLine, Address, DeliveryMethod, Discount, Order, OrderLine, PaymentAttempt, and Fulfillment with immutable price snapshots where required.

Validate models at ingestion and server mutation boundaries. Do not render directly from Google Drive filenames or raw provider responses.

## State Management

- Server Components/server fetches: catalog, product, price, inventory, policies, and SEO content.
- URL search parameters: search query, filters, sort, and pagination.
- Local component state: gallery position, disclosure state, temporary variant UI, and drawer visibility.
- Shared client state: cart only. Begin with a small provider/reducer or commerce SDK mechanism; introduce Zustand only if cross-tree optimistic updates become difficult. Redux is not justified initially.
- Server/session state: checkout progress, order creation, stock reservation, payment status, and final totals.

Optimistic cart UI must roll back cleanly. Never trust local storage for authoritative prices, stock, discounts, or completed orders.

## Asset Organization and Intake

- Audit Drive assets before design: ownership, resolution, orientation, product mapping, variant mapping, missing shots, video duration, and naming.
- Preserve untouched originals outside the public delivery tree. Create an asset manifest linking each product/variant to approved media and alt-text requirements.
- After initialization, organize local deliverables under `public/brand/`, `public/editorial/`, and `public/products/[slug]/`, or upload production media to the selected image CDN.
- Use lowercase kebab-case filenames with purpose and sequence, such as `rose-serum-front-01.jpg`; never serve temporary Drive-share URLs.
- Define consistent crops and focal points while retaining originals. Generate responsive AVIF/WebP derivatives and optimized video/poster formats.
- Use the logo in its supplied vector or highest-quality source; do not redraw, recolor, or distort it before approval.

## SEO Requirements

- Use semantic headings, crawlable product/category copy, stable descriptive slugs, canonical URLs, sitemap, robots rules, and intentional redirects.
- Generate unique titles, descriptions, Open Graph/Twitter media, and canonical metadata per indexable page.
- Add valid `Organization`, `WebSite`, `BreadcrumbList`, `Product`, and `Offer` structured data where the underlying facts exist. Include PKR price, availability, and verified aggregate ratings only.
- Keep filter/sort combinations out of the index unless a curated landing page is intentionally created.
- Use `en-PK` initially only if confirmed; add `ur-PK` and `hreflang` only with complete, human-reviewed localized content.
- Include policy, contact, delivery, returns, and product-information pages that strengthen trust and search usefulness.

## Performance Requirements

- Target Core Web Vitals at the 75th percentile: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1.
- Optimize the above-fold hero deliberately; reserve media dimensions and lazy-load below-fold assets.
- Use `next/image` and `next/font` after initialization, with correct responsive `sizes`, local/subset fonts, and layout-compatible fallbacks.
- Serve video with poster images, `preload="none"` or metadata as appropriate, user controls, and no autoplay with sound.
- Minimize client JavaScript, third-party tags, animation libraries, and variant payloads. Fetch independent data concurrently and define cache/revalidation per source.
- Establish page-weight and client-JS budgets during implementation, then test production builds on throttled mobile hardware/network profiles.

## Accessibility Requirements

Target WCAG 2.2 AA. Use semantic landmarks and controls, a skip link, logical headings, keyboard-complete navigation, visible `:focus-visible` treatment, and predictable focus restoration. Maintain contrast of at least 4.5:1 for standard text and 3:1 for large text/UI boundaries. Provide meaningful alt text, captions/transcripts for informative video, persistent form labels, inline and summarized errors, and `aria-live` announcements for cart/checkout changes. Sheets and dialogs must trap focus appropriately, close with Escape, and restore focus. Respect zoom, text reflow, reduced motion, and color-independent state communication.

## Development Phases

1. **Discovery and content audit:** analyze logo/assets, catalog completeness, variants, policies, payments, courier rules, language, analytics, and source-of-truth systems.
2. **Design foundation:** approve creative direction, content hierarchy, tokens, type licenses/support, wireframes, and representative mobile/desktop prototypes.
3. **Technical foundation:** initialize Next.js only after approval; set quality tooling, environment contracts, domain types, adapters, metadata, and CI.
4. **Browse experience:** implement shell, homepage, shop, collections, search, and real-data content states.
5. **Product and cart:** implement PDP variants/media, cart persistence/reconciliation, drawer, and full cart.
6. **Checkout and integrations:** add address/delivery/payment flows, idempotent order creation, webhooks, confirmation, analytics, and operational handoff.
7. **Content and optimization:** migrate final assets/copy, structured data, redirects, responsive images, caching, and performance budgets.
8. **Release gate:** cross-browser/device QA, accessibility audit, production-build tests, payment/COD and fulfillment smoke tests, security/privacy review, monitoring, rollback, and client acceptance.

Each phase should end with documented acceptance criteria and a reversible review point. Do not call the architecture production-ready until backend ownership, security boundaries, failure recovery, monitoring, and rollback are confirmed.

## Decisions Required Before Implementation

- Approved brand asset set, creative references, and image usage rights.
- Commerce/catalog source of truth and who manages products, inventory, pricing, and orders.
- Checkout ownership, COD policy, online payment provider, courier/rate source, tax/invoice requirements, and returns process.
- Launch language(s), delivery regions, support channels, review source, analytics/consent platform, hosting, and operational alerting.
- Whether accounts, wishlists, discount codes, bundles, subscriptions, or WhatsApp support are launch requirements.
