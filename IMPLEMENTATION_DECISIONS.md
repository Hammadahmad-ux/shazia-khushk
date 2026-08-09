# Implementation Decisions

## Context

The store has a small curated catalog, a guest-first purchase journey, and a planned Next.js/React/TypeScript/Tailwind frontend. The application has not been initialized, so version-specific APIs and dependencies must be confirmed later. These decisions deliberately minimize moving parts while preserving safe paths to a database, payment provider, courier, and CMS/commerce system.

## Decision Summary

| Area | Initial decision | Revisit when |
| --- | --- | --- |
| Application shape | One Next.js modular monolith | Independent services have proven operational needs |
| Rendering | Server Components by default; small client islands | Real interaction profiling identifies a different boundary |
| Catalog during preparation | Versioned, runtime-validated data files behind an adapter | Client needs non-developer editing or live operational updates |
| Transactional launch data | Managed database or commerce backend for carts, inventory, and orders | Required before accepting real orders, not optional “scale work” |
| Client state | Local state plus one small cart provider/reducer | Cart interactions become complex enough to justify Zustand |
| Cart persistence | Server cart keyed by opaque secure cookie | Customer accounts and cart merging become requirements |
| Checkout | Guest, server-managed, step-based, idempotent | A selected hosted checkout imposes a different flow |
| Integrations | Narrow catalog, payment, shipping, and notification adapters | A second real use case proves a shared abstraction needs expansion |
| API style | Direct server service calls internally; narrow HTTP endpoints at boundaries | External clients genuinely require a public API |
| Validation | Runtime schemas at every boundary, shared where practical | Selected stack/provider supplies stronger compatible contracts |

## 1. Server Components vs Client Components

### Decision

Use React Server Components for route shells, catalog/collection/PDP reads, content, pricing/availability reads, policy content, SEO metadata, and order-confirmation reads. Add Client Components only at the smallest interactive boundary.

Likely client islands:

- header menu, search overlay, and accessible drawers;
- product gallery controls;
- variant and quantity selection;
- quick-add and sticky purchase controls;
- cart provider, cart drawer, line mutations, and optimistic feedback;
- collection filter controls while the URL remains authoritative;
- checkout form steps and provider handoff controls.

### Why

This reduces shipped JavaScript, keeps secrets and provider clients on the server, and supports search indexing and slow mobile networks. A client-rendered storefront or a top-level `use client` boundary would add cost without helping the small catalog.

### Guardrails

- Pass serializable, minimal read models into client islands—not raw provider records.
- Do not duplicate full page trees for mobile and desktop; use semantic markup plus responsive CSS.
- Confirm the installed Next.js/React version before selecting caching, Server Action, or form APIs.
- Make cache/revalidation explicit for catalog content; never cache a customer cart, checkout, or order response as shared public data.

## 2. Cart State

### Decision

Use one lightweight cart context/provider with a reducer or equivalent small store. Its responsibilities are limited to the current cart read model, drawer visibility, pending mutation state, and optimistic updates. Do not introduce Redux. Do not introduce Zustand initially unless actual cross-tree update complexity makes the reducer difficult to maintain.

The domain `CartService` remains server-side and authoritative. Cart UI sends intent—variant ID and quantity—and replaces/reconciles its state from the server response.

### Required behavior

- Version each cart response to detect stale concurrent mutations.
- Optimistically update only reversible actions; roll back and announce failures.
- Deduplicate simultaneous submissions and disable the relevant control while pending.
- Keep drawer state local; do not persist whether it was open.
- URL state remains the source for search, sort, filters, and pagination; it does not belong in the cart store.

## 3. Persistence

### Decision

Persist the canonical anonymous cart server-side. Store only a random opaque cart/session identifier in a `Secure`, `HttpOnly`, `SameSite=Lax` (or stricter where compatible) cookie. Define expiry and retention with the privacy policy.

Local storage may hold a non-sensitive UI fallback or recovery hint only if later testing proves value. It must never be authoritative for price, stock, discount, shipping, payment, or order status.

### Security and reliability

- Rotate/replace invalid or expired cart IDs rather than exposing lookup detail.
- Protect cookie-authenticated mutations against CSRF according to the final Next.js pattern and deployment.
- Reconcile price, product/variant status, stock, discount, and shipping at checkout entry and final submission.
- Clear or archive the cart only after durable order creation; payment failure should leave a recoverable state.
- If accounts are added, design explicit anonymous-to-account merge rules then—not now.

## 4. Product Storage Initially

### Decision

During catalog preparation, store products in version-controlled data files organized by stable product identity and validate them at load/build time against the schema in `PRODUCT_DATA_SCHEMA.md`. Markdown may hold approved long-form copy only if it maps cleanly into the same domain model. Access all catalog data through a `CatalogRepository`; pages must not import arbitrary raw files directly.

This approach is appropriate because the catalog is small, product assets/data are still being prepared, and no content-editing workflow has been approved. It provides reviewable changes, deterministic builds, and no premature CMS.

### Limit

Static files are not a safe authority for live inventory, carts, or orders. A production store that accepts orders needs an atomic writable system before launch, even if product descriptions remain file-backed.

## 5. Database or Commerce Backend Later

### Decision

Before transactional launch, select either:

1. a managed commerce backend that owns product variants, inventory, carts, orders, and possibly checkout; or
2. a managed relational database, likely PostgreSQL-class, with application-owned catalog/inventory/order logic.

Do not choose between them until the client confirms who maintains inventory/orders, COD operations, payment/courier needs, admin expectations, budget, and deployment ownership.

### Migration boundary

Keep these provider-neutral interfaces narrow:

- `CatalogRepository`: product/category/collection reads and catalog ingestion.
- `InventoryService`: availability checks and atomic reserve/decrement/release behavior.
- `CartRepository`/`CartService`: anonymous cart lifecycle and totals.
- `OrderRepository`/`CheckoutService`: validated order creation and status transitions.
- `PaymentProvider`: attempt creation, return verification, webhook mapping, refunds if required.
- `ShippingProvider`: city/serviceability, rates, booking, and tracking mapping.
- `NotificationProvider`: transactional email/SMS/WhatsApp after approval.

Do not create a generic plugin framework. Each interface should expose only behaviors used by the launch flow.

### Migration checks

Preserve IDs, slugs, SKUs, option combinations, price units, timestamps, and redirect history. Validate counts and uniqueness, compare variant prices/inventory, run read-only dual comparison, switch via configuration, and retain rollback to the previous catalog read path until accepted. Orders require a separate carefully planned migration and should not be rewritten casually.

## 6. Checkout Architecture

### Decision

Use a server-managed guest checkout linked to the canonical cart. Model contact, address, delivery, payment, and review as explicit steps with a resumable checkout session. The client shows progress, but the server owns step validity and final totals.

### Flow

1. Start/reload checkout from the reconciled cart.
2. Validate and persist contact/address in the checkout session.
3. Resolve serviceable shipping methods and select one.
4. Resolve configured COD/online payment methods and select one.
5. Reconcile everything and present a review snapshot.
6. Submit once with an idempotency key inside a transaction/atomic provider operation.
7. For COD, create the durable order with pending payment and the correct operational status.
8. For online payment, create a payment attempt for the exact order amount, then verify the result server-side/webhook before marking paid.
9. Show a protected confirmation route; notification failures are retried independently.

### Failure behavior

- Stock/price/discount/shipping changes return the customer to a recoverable review state.
- A timeout after submit is resolved by looking up the idempotency key, not by blindly resubmitting.
- Payment abandonment retains a retryable pending/failed attempt and recoverable order/cart according to provider behavior.
- Duplicate and out-of-order webhooks have one idempotent effect.

## 7. API and Trust Boundaries

### Decision

Do not build a broad REST or GraphQL API for an internal storefront. Server Components call domain services directly. Use the narrowest framework transport for mutations after the exact Next.js version is known:

- same-origin cart and checkout mutations may use Server Actions when their security/caching behavior is confirmed;
- Route Handlers are appropriate for payment/courier webhooks, provider return/callback endpoints, health checks, and any explicitly external integration;
- browser-facing JSON endpoints exist only where an interaction cannot use the chosen action/form mechanism.

Transport handlers only parse, authenticate/session-bind, authorize, validate, call domain logic, and map a stable response. Business rules stay in services.

### Conceptual operations

- catalog: list collection, get product, search;
- cart: get/create cart, add/update/remove line, apply/remove discount, set note;
- checkout: create/read session, update contact/address, list/select delivery/payment, review, submit;
- payment: create attempt, verify return, receive webhook;
- order: protected confirmation read and later tracking lookup;
- shipping: internal serviceability/rate lookup and provider webhook if supported.

### Boundary controls

- Validate all URL, form, cookie, webhook, provider, and imported catalog data.
- Authorize every cart/checkout/order object by session or staff role; possession of an ID/reference is insufficient.
- Rate-limit checkout, discount, payment, order lookup, and messaging endpoints.
- Restrict CORS to intended origins; use CSRF protection for cookie-authenticated writes.
- Verify webhook signatures, timestamp/replay windows, and unique provider event IDs before applying changes.
- Keep private keys and privileged database/provider clients server-only and out of logs/client bundles.

## 8. Validation

### Decision

Define runtime schemas for Product, Variant, Cart mutation, Pakistani Address, Checkout Step, Order, Payment Event, and Shipping Event. TypeScript interfaces alone are insufficient because runtime inputs are untrusted.

Select a schema library only when the project is initialized and installed dependencies are known; Zod is a reasonable candidate, not a pre-approved dependency. Prefer one contract that can produce server validation and client-friendly field errors without importing server-only logic into the browser.

### Layers

- **Catalog ingestion:** shape, type/category discriminator, unique slug/SKU, options/variant matrix, money, inventory, relationships, and publication completeness.
- **Client form:** prompt feedback and accessible field associations; never authoritative.
- **Server boundary:** normalize, length-limit, and reject invalid intent.
- **Domain:** enforce stock, price, discount, shipping, state-transition, and idempotency invariants.
- **Database/provider:** constraints/transactions for uniqueness, non-negative values, and concurrency where supported.

Use stable error codes with safe localized messages. Preserve field paths for checkout errors and avoid returning stack traces or raw provider errors.

## 9. Image and Video Handling

### Decision

Do not inspect or bind implementation to product images yet. Use media metadata/asset keys in the product schema so content work can proceed independently.

After assets are approved:

- ingest originals into the selected asset pipeline/CDN or controlled local public assets; never serve Google Drive share URLs;
- retain width, height, aspect ratio, focal point, alt text, variant mapping, rights, and ordering;
- use Next.js image optimization after initialization, with approved remote-host allowlists and exact responsive `sizes`;
- reserve media dimensions, prioritize only the actual above-fold candidate, and lazy-load below-fold media;
- generate modern image derivatives while preserving accurate product color/detail;
- transcode video to web-suitable formats, provide poster/captions where needed, avoid autoplay with sound, and avoid eager-loading product-grid video.

Do not add an image transformation dependency until the hosting/CDN path is selected.

## 10. Responsive Architecture

### Decision

Use one semantic component tree with mobile-first CSS and content-driven breakpoints. Follow the grid and behavior in `DESIGN_DIRECTION.md`; do not maintain separate mobile/desktop applications.

- Design and validate the complete purchase journey at 375 px and narrower edge cases, then 768, 1024, and 1440 px.
- Use CSS Grid/Flexbox and fluid sizing; avoid JavaScript viewport branching for ordinary layout.
- Move complex short choices into accessible mobile sheets, while checkout remains full-page.
- Keep touch targets at least 44 × 44 px, support safe areas and on-screen keyboards, and ensure sticky elements never hide errors/actions.
- Do not hide essential content on mobile or make hover the only path to quick-add/details.

## 11. Error Handling and Observability

### Decision

Adopt a small domain-error vocabulary mapped to customer-safe messages and correct HTTP/action outcomes. Expected errors are recoverable states; unexpected errors are logged with correlation IDs and shown through route-level error boundaries.

Required error families:

- validation and invalid option/quantity;
- cart expired or version conflict;
- inactive/sold-out/insufficient-stock item;
- changed price or invalid discount;
- unserviceable address or unavailable shipping method;
- payment pending, declined/failed, cancelled, timed out, or verification delayed;
- duplicate/idempotent submission;
- provider unavailable or webhook rejected;
- protected order not found/unauthorized without revealing which condition occurred.

### Handling rules

- Preserve the last valid user input and show a specific next action.
- Disable duplicate submissions while pending, but support safe retry through idempotency.
- Log correlation ID, safe entity IDs, error code, provider key, and timing—not PII, addresses, notes, tokens, secrets, or raw payment payloads.
- Monitor checkout/order creation, payment transitions, webhook failures/retries, inventory conflicts, courier booking/tracking failures, and notification delivery.
- Define alerts, runbooks, replay/reconciliation tools, retention, backups, and rollback before launch.

## 12. Testing and Release Implications

When implementation begins, require unit tests for money/totals, option matching, discounts, stock rules, Pakistani phone normalization, address validation, and status transitions. Add integration tests for cart reconciliation, idempotent order creation, COD, online payment callbacks/webhooks, shipping rates, and notification failure. End-to-end tests should cover the complete guest path plus sold-out, price-change, payment-failure, duplicate-submit, and unserviceable-city recovery.

Production readiness also requires accessibility checks, production-build performance, webhook signature/replay tests, authorization tests for cross-order access, secret scanning, backup/restore evidence, and an operational smoke test with the chosen providers. None of these checks can run until an application/infrastructure exists.

## Explicit Non-Decisions

- No final payment gateway, courier, database, commerce platform, CMS, hosting provider, analytics platform, or messaging provider.
- No final Next.js/React versions, state library, runtime-schema library, image CDN, or cache policy.
- No customer accounts, wishlist, subscriptions, marketplace features, GraphQL, microservices, message bus, or generic integration framework.
- No final colors, fonts, media crops, or UI implementation.

## Questions That Can Change Implementation

- Who updates catalog, prices, inventory, and orders, and do they need an admin interface at launch?
- Must the first live release track finite stock atomically, and can any product be backordered?
- Which cities/regions, courier/rate source, COD rules, payment methods, and notification channels are required?
- Is online payment part of launch or a later phase, and who owns reconciliation/refunds?
- Are tax invoices, discount codes, bundles, split shipments, partial refunds, or order edits launch requirements?
- Is email required, is Urdu in scope, and what are the privacy/data-retention/marketing consent rules?
- Where will the storefront deploy, and who owns monitoring, incident response, backups, and operational support?
