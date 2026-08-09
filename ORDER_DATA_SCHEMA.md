# Order Data Schema

## Purpose and Invariants

The order model is a provider-neutral, immutable commercial record. It must survive later product edits, payment-provider changes, and courier changes without losing what the customer agreed to buy.

- Store money as integer minor units with currency `PKR`.
- Recalculate and validate all amounts on the server before order creation.
- Snapshot customer-visible item, variant, address, discount, shipping, and price data.
- Separate order, payment, and fulfillment status; none can safely stand in for another.
- Make creation and external status updates idempotent.
- Never store raw card/wallet credentials, payment secrets, webhook secrets, or full provider payloads.
- The public order reference is not authorization to view an order.

## Order

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Internal immutable identifier |
| `orderReference` | string | Yes | Unique customer-facing reference; not a security token |
| `cartId` | ID/null | No | Source cart for traceability |
| `idempotencyKeyHash` | string | Yes | Prevents duplicate submission without retaining a reusable raw secret |
| `orderStatus` | enum | Yes | Separate operational order lifecycle |
| `currency` | literal `PKR` | Yes | Single-currency launch |
| `customer` | CustomerSnapshot | Yes | Guest customer details at purchase |
| `shippingAddress` | AddressSnapshot | Yes | Validated delivery snapshot |
| `items` | OrderItem array | Yes | At least one valid line |
| `discounts` | DiscountApplication array | Yes | Empty array when none |
| `amounts` | OrderAmounts | Yes | Server-calculated breakdown |
| `paymentMethod` | PaymentMethodSnapshot | Yes | COD or abstract online method |
| `paymentStatus` | enum | Yes | Aggregate state derived from payment records |
| `paymentAttempts` | PaymentAttempt array/reference | Yes | At least one logical COD/online record |
| `fulfillmentStatus` | enum | Yes | Aggregate delivery state |
| `fulfillments` | Fulfillment array/reference | Yes | Empty until operationally created |
| `customerNotes` | string/null | No | Sanitized plain text with length limit |
| `internalNotes` | restricted audit records | No | Staff-only; never returned to customers by default |
| `channel` | enum | Yes | For launch, `web`; leaves room for approved assisted orders |
| `locale` | string | Yes | Confirmed checkout locale, e.g. `en-PK` only after launch decision |
| `consents` | ConsentSnapshot array | Yes | Transactional/marketing/WhatsApp choices as applicable |
| `confirmationAccess` | secure token metadata | Yes | Store token hash, expiry, and revocation—not plaintext token |
| `version` | integer | Yes | Optimistic concurrency/audit support |
| `createdAt` | timestamp | Yes | Durable order creation time |
| `confirmedAt` | timestamp/null | No | Business/order confirmation time |
| `cancelledAt` | timestamp/null | No | With actor and reason in status history |
| `completedAt` | timestamp/null | No | Terminal completion time |
| `updatedAt` | timestamp | Yes | Last material update |

### Order status

Recommended provider-neutral values:

- `pending`: created but awaiting a required confirmation or payment outcome.
- `confirmed`: accepted for processing.
- `cancelled`: cancelled with a reason and actor.
- `completed`: fulfilled and financially resolved under business rules.

Do not infer `confirmed` solely from a browser redirect. Define allowed transitions, actor, reason, and timestamp in status history. More detailed workflows belong in payment and fulfillment states rather than an oversized order-status enum.

## Customer Snapshot

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `customerId` | ID/null | No | Null for a guest without a customer record |
| `fullName` | string | Yes | Trimmed, length-limited |
| `phoneE164` | string | Yes | Normalized Pakistani delivery contact |
| `phoneDisplay` | string/null | No | Safe original/display form if operationally useful |
| `email` | string/null | Client decision | Normalized; required only if approved workflow needs it |
| `preferredContact` | enum/null | No | Must not imply marketing consent |

Customer matching must not rely on phone/email alone for authorization. If accounts are added later, guest-order claiming requires a verified secure flow.

## Pakistani Shipping Address Snapshot

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `recipientName` | string | Yes | May differ from customer name |
| `phoneE164` | string | Yes | Required delivery contact |
| `addressLine1` | string | Yes | House/building/street detail |
| `addressLine2` | string/null | No | Additional structured line |
| `areaOrLocality` | string | Yes | Neighborhood/area as required operationally |
| `landmark` | string/null | No | Optional delivery aid, not a substitute for address |
| `cityId` | stable ID | Yes | Selected from current serviceability dataset |
| `cityName` | string | Yes | Snapshot of customer-visible name |
| `districtId` | ID/null | Conditional | Include when courier/rate source requires it |
| `districtName` | string/null | Conditional | Snapshot paired with district ID |
| `provinceCode` | controlled code | Yes | Internal stable code |
| `provinceName` | string | Yes | Customer-visible snapshot |
| `postalCode` | string/null | Conditional | Requirement determined by region/courier; preserve leading zeros |
| `countryCode` | literal `PK` | Yes | Pakistan-only launch |
| `deliveryInstructions` | string/null | No | Sanitized, length-limited operational note |
| `validatedAt` | timestamp | Yes | Last serviceability validation |
| `validationSource` | string | Yes | Rate table/courier adapter revision identifier |

The order retains both stable location IDs and display snapshots. A later rename or serviceability change must not rewrite historical addresses.

## Order Item and Variant Snapshot

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Stable order-line identity |
| `productId` | ID | Yes | Catalog reference for operations/analytics |
| `productSlug` | string | Yes | Snapshot for customer-facing link/history |
| `productTitle` | string | Yes | Purchase-time snapshot |
| `productType` | enum | Yes | Purchase-time category behavior |
| `variantId` | ID | Yes | Concrete purchased variant |
| `variantTitle` | string | Yes | Readable option summary |
| `sku` | string | Yes | Purchase-time SKU snapshot |
| `options` | OptionSnapshot array | Yes | Size, color, volume, etc. as ID/label pairs |
| `imageAssetKey` | string/null | No | Approved purchase-time display reference |
| `quantity` | integer | Yes | Positive and within validated limits |
| `unitPriceMinor` | integer | Yes | Selling price before line discount |
| `compareAtPriceMinor` | integer/null | No | Historical/display reference only |
| `discountTotalMinor` | integer | Yes | Non-negative line allocation |
| `lineSubtotalMinor` | integer | Yes | `unitPriceMinor × quantity` before discounts |
| `lineTotalMinor` | integer | Yes | Subtotal minus allocated discounts plus line-level charges if ever supported |
| `weightGrams` | integer/null | No | Snapshot for fulfillment/rate audit |
| `fulfillmentStatus` | enum | Yes | Useful if split/partial fulfillment is added |

An `OptionSnapshot` contains option ID/label and value ID/label, plus typed metadata such as volume value/unit when needed. Never reconstruct historical variant text from the current product record.

## Order Amounts

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `itemsSubtotalMinor` | integer | Yes | Sum of line subtotals before order discounts |
| `lineDiscountTotalMinor` | integer | Yes | Sum of item-level allocations |
| `orderDiscountTotalMinor` | integer | Yes | Order-wide discount |
| `discountTotalMinor` | integer | Yes | Sum of all discount effects |
| `shippingCostMinor` | integer | Yes | Selected method snapshot; may be zero |
| `taxTotalMinor` | integer | Yes | Zero until valid tax rules apply; retained for future/legal compatibility |
| `roundingAdjustmentMinor` | integer | Yes | Normally zero; explicit if provider/accounting requires adjustment |
| `totalMinor` | integer | Yes | Final payable amount; non-negative |
| `paidMinor` | integer | Yes | Derived from successful payments/refunds |
| `refundedMinor` | integer | Yes | Derived from refund records |
| `balanceDueMinor` | integer | Yes | Derived, important for COD/partial refund states |

All values use the order currency. Persist calculation version/ruleset metadata so later logic changes do not make old totals inexplicable.

## Discount Application

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Order-local/application identity |
| `discountId` | ID/null | No | Campaign reference if available |
| `code` | string/null | No | Normalized purchase-time code; null for automatic discounts |
| `label` | string | Yes | Customer-visible approved snapshot |
| `type` | enum | Yes | `fixed`, `percentage`, `free_shipping`, or future controlled type |
| `scope` | enum | Yes | Line(s), order, or shipping |
| `valueSnapshot` | structured value | Yes | Rule used at purchase time |
| `amountMinor` | integer | Yes | Actual applied value, non-negative |
| `allocations` | line/allocation array | Yes | Explains distribution across items/shipping |
| `source` | enum/string | Yes | Code, automatic campaign, or approved operator source |

Do not store only a final discount total; retain enough information to audit why it applied.

## Shipping Method Snapshot

Store on the order or fulfillment:

- internal method/rate ID;
- provider-neutral service code;
- displayed label;
- shipping zone/city IDs;
- charge in minor units;
- displayed delivery estimate text and optional machine-readable range if confirmed;
- source/rate-table revision and calculated timestamp;
- COD eligibility and item restrictions that affected selection.

This is a purchase-time snapshot, not a live promise after the order is placed. Later status/ETA updates belong to fulfillment events.

## Payment Method and Attempts

### PaymentMethodSnapshot

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `type` | enum | Yes | `cod` or `online` |
| `label` | string | Yes | Customer-visible approved label |
| `providerKey` | string/null | Conditional | Adapter identifier for online payment; no final provider chosen |
| `methodDetail` | safe metadata/null | No | Non-sensitive wallet/rail label if provider returns it |

### PaymentAttempt

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Internal attempt identity |
| `orderId` | ID | Yes | Parent order |
| `idempotencyKeyHash` | string | Yes | Attempt-level replay protection |
| `type` | enum | Yes | `cod` or `online` |
| `providerKey` | string/null | Conditional | Future adapter name |
| `providerReference` | string/null | No | Opaque external reference |
| `amountMinor` | integer | Yes | Exact attempted amount |
| `currency` | literal `PKR` | Yes | Must match order |
| `status` | enum | Yes | Attempt lifecycle |
| `failureCode` | safe controlled code/null | No | No raw provider error or secret |
| `failureMessage` | safe internal text/null | No | Redacted; customer text mapped separately |
| `returnVerifiedAt` | timestamp/null | No | Server verification of browser return if used |
| `createdAt`, `updatedAt` | timestamps | Yes | Audit fields |
| `authorizedAt`, `paidAt`, `failedAt`, `cancelledAt` | timestamp/null | No | State-specific times |

Recommended payment statuses:

- `pending`: COD awaiting collection or online attempt unresolved.
- `authorized`: funds authorized but not captured, if provider supports it.
- `paid`: full payable amount confirmed.
- `failed`: attempt failed; another attempt may be allowed.
- `cancelled`: attempt/order payment cancelled.
- `partially_refunded`: confirmed refunds below paid amount.
- `refunded`: confirmed refunds equal paid amount.

For multiple attempts, order-level `paymentStatus` is derived from successful amounts and terminal states, not simply copied from the latest callback. Store verified webhook event IDs/hashes separately to reject duplicates and handle out-of-order events.

## Fulfillment and Courier Tracking

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | opaque ID | Yes | Supports future split shipments |
| `orderId` | ID | Yes | Parent order |
| `lineItems` | line ID/quantity array | Yes | Exact quantities in this fulfillment |
| `status` | enum | Yes | Fulfillment lifecycle |
| `courierKey` | string/null | No | Internal adapter identifier; provider-neutral |
| `courierName` | string/null | No | Display snapshot |
| `serviceCode`, `serviceLabel` | string/null | No | Courier method snapshot |
| `trackingNumber` | string/null | No | Treat as sensitive order metadata |
| `trackingUrl` | URL/null | No | Allowlisted/generated by adapter, not arbitrary customer input |
| `providerReference` | string/null | No | Opaque booking/shipment ID |
| `labelReference` | string/null | No | Storage reference, not unrestricted public URL |
| `estimatedDeliveryStart`, `estimatedDeliveryEnd` | timestamp/date/null | No | Only if supported and appropriately qualified |
| `packedAt`, `handedToCourierAt`, `shippedAt`, `deliveredAt` | timestamp/null | No | Operational events |
| `failedAt`, `returnedAt`, `cancelledAt` | timestamp/null | No | Include reason/actor in history |
| `createdAt`, `updatedAt` | timestamps | Yes | Audit fields |

Recommended fulfillment statuses:

`unfulfilled`, `processing`, `packed`, `shipped`, `delivered`, `delivery_failed`, `return_in_progress`, `returned`, `cancelled`.

The aggregate order fulfillment status is derived from all fulfillment records/line quantities and may include `partially_fulfilled` if split fulfillment becomes real.

## Notes, Consent, and Notifications

- `customerNotes` are customer-visible plain text requests, sanitized and length-limited. They are not contractual guarantees.
- `internalNotes` require staff authorization, author/time audit, and PII discipline.
- Each `ConsentSnapshot` records purpose, channel, granted/declined value, exact policy/template version, time, and source. Transactional contact and marketing consent are distinct.
- Notification records should store channel, template/version, recipient in protected form, provider reference, status, timestamps, and safe failure code. Notification failure does not alter order success.

## Status History and Audit

Material state changes append an immutable event containing:

- event ID and order ID;
- entity (`order`, `payment`, `fulfillment`, `refund`, or `notification`);
- previous/new status;
- actor type and safe actor ID (`system`, `customer`, `staff`, `provider`);
- reason code and redacted note;
- source event/idempotency identifier;
- timestamp and correlation ID.

Do not rely solely on mutable `updatedAt` values to reconstruct financial or fulfillment history.

## Security, Privacy, and Retention

- Restrict order reads/mutations server-side; confirmation token/session is required for guests, with separate staff authorization for operations.
- Hash high-entropy access and idempotency tokens at rest where the raw value is not needed.
- Encrypt/protect customer and address PII according to the chosen platform; redact it from logs, analytics, error traces, and webhook diagnostics.
- Apply CSRF protection where cookie-authenticated mutations are used, rate-limit checkout/order lookup, and use allowlisted origins.
- Verify payment/courier webhook signatures and replay identifiers before applying data.
- Define retention, export, correction, deletion/anonymization, backup, and staff-access policy with the client/legal owner before launch.
- Avoid storing unnecessary provider payloads. If required for dispute/debugging, redact and retain them for a documented limited period.

## Integrity and Transition Rules

- At least one item is required; quantities and all money values are integers within safe bounds.
- Item subtotals, discount allocations, shipping, tax, total, paid, refund, and balance fields must reconcile exactly.
- Order currency, line currency, payment currency, and refund currency must match.
- SKU/product/variant snapshots are immutable after confirmation; corrections require explicit order adjustment/cancellation workflow.
- `paid` requires verified payment evidence; COD remains pending until collection/reconciliation.
- `delivered` requires a fulfillment event, not a customer-page action.
- Cancellation and refund are distinct: cancelling fulfillment does not automatically prove money was refunded.
- Webhook and checkout retries with the same idempotency/event key must have one observable effect.
- Tracking and confirmation URLs must not expose order data through sequential IDs.

## Client/Provider Decisions Required

- Human-readable order-reference format and operations workflow.
- COD confirmation, collection, reconciliation, cancellation, failed-delivery, and return-to-origin rules.
- Online payment provider, authorized/captured behavior, refunds, fees, and reconciliation owner.
- Courier/rate source, service codes, label booking, tracking updates, split shipment support, and retention of labels.
- Required email/alternate phone/address fields, supported regions, notification channels, templates, and WhatsApp consent.
- Tax/invoice fields and calculations, discount allocation requirements, cancellation/refund policy, data retention, and authorized staff roles.
