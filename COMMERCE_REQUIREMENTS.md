# Commerce Requirements

## Scope and Commerce Invariants

This document defines the launch journey for a small Pakistani DTC catalog spanning Clothes, Perfumes, Serum/Skincare, Shampoo, and Oil. It does not select a payment gateway, courier, database, return policy, delivery promise, or product claim.

The following rules apply to every purchase path:

- The server is authoritative for product status, variant validity, available stock, price, discount eligibility, shipping eligibility/cost, payment state, and order total.
- All money is stored as integer minor units with currency `PKR`; never use floating-point arithmetic.
- A purchasable product always resolves to one concrete variant, including a single hidden/default variant for products with no customer-facing options.
- Cart and order lines reference IDs but also retain display snapshots so later catalog edits do not rewrite order history.
- Guest checkout is the default. An account must not be required to buy.
- No urgency, stock warning, compare-at price, review, delivery claim, or trust statement may appear without real supporting data.

## End-to-End Customer Journey

### 1. Homepage

The customer can understand the brand, enter a current category or curated collection, discover a small set of featured products, and access search/cart without interruption. Featured status and merchandising order come from catalog data. Promotional messaging, delivery statements, reviews, and product benefits appear only after client confirmation.

**Exit paths:** collection, PDP, search, cart, policy, or contact/support.

### 2. Collection

The collection page shows active products only, while retaining sold-out products when useful for discovery. Customers can sort and use only filters meaningful to the collection: size/color for clothing; volume or product type for fragrance/beauty; price and availability where useful. Filter/sort state is reflected in the URL. With a small catalog, show all results or explicit pagination rather than infinite scroll.

Each product entry communicates title, current price, legitimate compare-at price, available option summary, and derived stock state. Quick-add is allowed only for a single available variant; otherwise it opens variant selection or sends the customer to the PDP.

### 3. Product Detail Page

The PDP presents product identity, descriptions, media references, PKR price, variants, availability, quantity, category-specific information, delivery/returns summaries, and related products. The customer must explicitly choose every required option. Unavailable combinations remain understandable but cannot be purchased.

The add action is enabled only when:

- the product and selected variant are active;
- all required options resolve to exactly one variant;
- requested quantity is within the configured per-order limit and current availability;
- a valid current price exists.

### 4. Add to Cart

The add request sends only product/variant identity and requested quantity. The server reloads the authoritative variant, validates it, and returns the updated cart and any recoverable error. It must not trust a client-supplied price, badge, stock value, discount, or total.

On success, announce the result accessibly and open or update the cart drawer. Repeated clicks are disabled while a request is pending. Duplicate adds for the same variant should normally increase its existing line quantity rather than create duplicate lines.

### 5. Cart Drawer

The drawer is the fast review path. It shows line image reference, product name, selected options, quantity controls, unit/line price, availability issue, subtotal, shipping disclaimer, checkout action, and continue-shopping action. It supports removal and quantity changes without a page reload.

Desktop uses a side drawer; mobile uses a near-full-screen sheet. Focus is trapped while open, Escape closes it, focus returns to the trigger, and background content is not interactive. Cart changes are announced through a polite live region.

### 6. Cart Page

`/cart` is the complete, resilient cart experience and must work independently of the drawer. It provides the same authoritative mutations plus more room for order notes, discount entry when enabled, policy links, delivery estimate messaging, and recovery from unavailable or changed items.

Before checkout, the server performs a full reconciliation. Changed prices, invalid discounts, insufficient stock, inactive products, or unavailable delivery must be shown clearly and require acknowledgement or correction.

### 7. Checkout

Checkout is guest-first and step-based:

1. **Contact:** customer name, required phone number, and email if the client makes it required or optional.
2. **Shipping address:** structured Pakistani address and serviceable city selection.
3. **Delivery:** eligible method, charge, and confirmed wording for the estimate.
4. **Payment:** COD and/or a provider-neutral online option based on business configuration.
5. **Review:** immutable summary of items, discounts, shipping, total, address, and method before submission.

Progress should survive refresh and normal back/forward navigation for a limited, disclosed retention period. Every step is validated on the server. The final submission uses an idempotency key so retries cannot create duplicate orders.

For COD, durable order creation completes with payment status `pending`; it must never be marked paid at checkout. For online payment, the flow may create a pending order/payment attempt and redirect or hand off to the future provider. Success must be verified server-side or by a verified webhook; a browser return URL alone is not proof of payment.

### 8. Order Confirmation

Show confirmation only after the order has been durably recorded. Display a human-readable order reference, customer-safe summary, payment state, confirmed delivery wording, next steps, and approved support channels. Access to customer/order details requires a non-guessable confirmation token or server session; the public order reference alone is insufficient.

Send email, SMS, or WhatsApp confirmation only for channels the client has configured and the customer has consented to where required. Failed notifications must not roll back a successfully created order.

## Guest Checkout

- Do not require password creation, login, or account recovery.
- Associate checkout with an opaque cart/session ID, not email or phone alone.
- Offer account creation only after purchase if it becomes a real requirement; never block confirmation behind it.
- Protect confirmation, tracking, and order-management data against reference-number enumeration.
- Define guest-data retention and deletion with the final privacy policy and operating system.

## Cart Quantity and Persistence

### Quantity updates

- Minimum quantity is one; removal is a separate, reversible action or occurs when zero is explicitly confirmed.
- Maximum is the lowest of available stock, variant purchase limit, product purchase limit, and any operational/COD limit.
- Each mutation returns a fresh cart version and totals. Reject or reconcile stale concurrent updates rather than silently overwriting them.
- Pending controls are disabled, failures preserve the last valid quantity, and the UI explains how to recover.

### Persistence

- Prefer a server-side anonymous cart keyed by a random opaque ID in a `Secure`, `HttpOnly`, `SameSite` cookie.
- Client memory may provide optimistic UI, but local storage must not be the authority for price, inventory, discounts, checkout, or orders.
- Cart lifetime is configurable and must align with privacy/retention decisions. On expiry, start a new cart and explain any lost items gracefully.
- Reconcile on session start, cart open, checkout entry, and before order creation.
- Define merge behavior only if customer accounts are added later.

## Availability Rules

### Sold out

- Derive sold-out state from all active variants being unavailable; do not maintain it as an unrelated manual badge.
- Keep the product discoverable when merchandising/SEO value exists, but disable add-to-cart and exclude it from availability-only filters.
- At variant level, disable the unavailable combination while keeping the option visible.
- Back-in-stock signup is out of scope until a notification provider, consent text, and retention policy are approved.

### Low stock

- Use a configurable threshold per variant or a store default; never expose exact quantity unless the client explicitly wants it.
- Show low-stock messaging only from current inventory and suppress it when inventory is not reliably tracked.
- Revalidate at add-to-cart and checkout. A low-stock label does not reserve stock.

### Stock reservation

Adding to cart does not reserve inventory by default. If online payment requires a temporary reservation, its duration, expiry, release behavior, and payment-failure handling must be designed with the selected backend/provider.

## Product Variants and Options

- Every option value has a stable ID and customer label; variant identity never depends on display text alone.
- A variant contains the SKU, price, compare-at price, inventory, active state, and relevant media association.
- Required choices cannot be preselected when doing so could cause an accidental purchase. A single valid option may be selected automatically if clearly shown.
- Changing options recomputes the matching variant, price, stock, SKU, media, and purchase state.
- Option combinations not represented by an active variant are invalid, not merely out of stock.

### Clothing

- Support one or more size systems through controlled values such as client-approved `XS`–`XL`, numeric sizes, or measurements; do not assume a final range.
- Support named colors with optional client-supplied swatch values and color-specific media.
- Size and color normally combine at variant level, with inventory per combination.
- Show an approved size guide, fit notes, fabric/material, and care instructions; never infer them.

### Perfume and beauty/personal care

- Use volume as a variant option with numeric value plus unit, normally `ml` only after source data confirms it.
- Allow pack size, concentration, or other options only when the catalog actually uses them.
- Different volumes may have different SKUs, prices, media, and inventory.
- Ingredients, scent notes, suitability, benefits, usage, and warnings are client/source-controlled claims.

## Discounts

- Support code-based and automatic discounts behind one server-side discount service; enabling either is a business decision.
- A discount records type, value, scope, validity window, usage constraints, minimums, and stacking policy.
- Revalidate on every relevant cart change and immediately before order creation.
- Persist applied-discount snapshots on the order. Never accept a client-calculated discount or allow the total below zero.
- Expired, inapplicable, or exhausted codes return a stable user-safe reason without exposing internal campaign data.
- Compare-at pricing is presentation data, not a checkout discount. It must reflect a genuine approved reference price greater than the selling price.

## Shipping Charges and Serviceability

- Derive eligible delivery methods and charges from structured destination data, cart contents, and future courier/rate configuration.
- Cart may show a qualified estimate or “calculated at checkout”; it must not promise an unconfirmed fee or timeline.
- Checkout must confirm city/serviceability before presenting a method. Recalculate after address, item, quantity, or method changes.
- Support flat rates, city/zone rates, free-shipping thresholds, item restrictions, and provider-calculated rates through a single shipping abstraction; configure only what the client approves.
- Snapshot the selected method, label, charge, and displayed estimate on the order.
- If no method is available, preserve the cart and offer approved contact/WhatsApp support rather than accepting an undeliverable order.

## Payment Requirements

### Cash on Delivery

- COD is supported as a configurable payment method, not assumed enabled for every city, order value, or product.
- A COD order is not marked paid at checkout. Payment status changes only through the operational fulfillment/reconciliation process.
- COD eligibility may depend on delivery zone, cart value, customer/order risk, or courier rules once confirmed.
- Any verification by call, OTP, SMS, or WhatsApp must be explicitly approved, rate-limited, auditable, and reflected in customer messaging.

### Online payment abstraction

Do not choose a gateway yet. The future adapter must support:

- creating a payment attempt for an exact server-calculated amount and currency;
- redirect/hosted checkout or tokenized client handoff without exposing secret credentials;
- verifying browser returns independently of client claims;
- signature and replay verification for webhooks;
- idempotent status updates, duplicate/out-of-order events, timeouts, and retries;
- full/partial refund references if required later;
- provider references stored as opaque identifiers, never raw card or wallet credentials.

Payment failure or abandonment must leave a recoverable cart/order state and must not create duplicate orders on retry.

## Customer, Phone, and Pakistani Address

### Customer and phone

- Full customer/recipient name is required; split first/last name only if a provider requires it.
- A reachable phone number is required for delivery. Accept common local input such as `03XXXXXXXXX` and international `+923XXXXXXXXX`, normalize server-side to E.164 (`+92…`), and store a safe display form separately if needed.
- Reject impossible length/prefix values but avoid a brittle carrier-prefix list. OTP verification is not assumed.
- Email requirement, alternate phone, marketing consent, and preferred contact channel require client confirmation.
- A phone number is not automatically a WhatsApp opt-in.

### Address structure

Capture and snapshot:

- recipient name and required phone;
- address line 1 and optional line 2;
- area/locality and optional nearby landmark where operationally useful;
- city ID plus displayed city name from the active serviceability list;
- district when the courier/rate source requires it;
- province/region code and display name;
- postal code according to courier/region requirements rather than a universal assumption;
- country code fixed to `PK` for the Pakistan-only launch;
- optional delivery instructions, stored separately from the address itself.

City selection must come from a maintained shipping-zone/courier dataset, support search, and retain a stable internal ID. Do not rely on unrestricted free text for rate calculation. The confirmed launch regions—including Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital Territory, and any service in Gilgit-Baltistan or Azad Jammu and Kashmir—must come from the client/courier configuration.

## Validation and Failure Recovery

- Validate on the client for prompt guidance and again at every server boundary for authority.
- Use one shared field contract where practical, but never rely on TypeScript types as runtime validation.
- Trim and normalize strings; enforce safe length limits; sanitize rich text; encode output by context.
- Associate inline errors with fields, show an error summary at checkout, and focus the first invalid field.
- Return stable error codes for invalid variant, insufficient stock, price changed, invalid discount, unserviceable address, payment pending/failed, expired cart, and duplicate submission.
- Rate-limit discount attempts, order lookup, COD verification, checkout submission, and payment endpoints.
- Never expose stack traces, provider payloads, secrets, or another customer’s order data.

## Order Notes

Order notes are optional plain text with a configurable maximum length. State that they are requests, not guaranteed fulfillment instructions. Strip control characters, store the original safe text, and do not accept payment credentials or other sensitive data. Gift messages or delivery instructions should become separate fields only if operations confirm those workflows.

## WhatsApp and Contact Support

- Show WhatsApp only after the client confirms the official number, business hours, ownership, response expectation, and approved prefilled text.
- Use it as recovery/support at useful points: contact page, unserviceable checkout, payment uncertainty, and post-order help. It should not obscure purchase controls.
- Do not expose cart/customer details in a URL. Keep prefilled messages minimal, such as an order reference supplied by the customer.
- Transactional or marketing messages require separate templates, provider setup, consent rules, opt-out handling, and delivery logging.
- Always provide a non-WhatsApp contact alternative approved by the client.

## Client Decisions Required

- Exact category/subcategory taxonomy and which “Oil” products/application areas are in scope.
- Launch products, variants, SKU rules, stock ownership, low-stock thresholds, purchase limits, and whether overselling/backorders are ever allowed.
- Discount types, stacking, free-shipping rules, COD eligibility/verification, delivery regions, charges, estimates, courier source, and failed-delivery process.
- Whether email is required, which notifications are sent, and approved WhatsApp/phone/email support details.
- Payment methods, later gateway selection, refund/cancellation workflow, tax/invoice requirements, and reconciliation owner.
- Shipping, return/exchange, privacy, terms, data-retention, and order-note policies.
