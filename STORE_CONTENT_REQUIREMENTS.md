# Store Content Requirements

## Content Standard

Every published statement must be accurate, current, attributable, and understandable on mobile. Product, health/beauty, delivery, pricing, stock, review, certification, and policy claims require a client-approved source. UI copy may be drafted internally, but brand/editorial and legal content must pass client review before publication.

Maintain a content inventory with owner, source, approval status, locale, last-updated date, and affected route. Use `Draft → Client review → Approved → Published → Superseded` as the workflow. “Approved” should identify a person and date, not merely a file location.

## A. Content We Can Safely Write Ourselves

These items are functional language or factual structure that does not invent business promises. Tone can be refined after the brand voice is approved.

### Navigation and common interface

- Labels such as “Shop,” “Collections,” “Search,” “Cart,” “Contact,” “FAQ,” and “View product.”
- Direct actions such as “Add to cart,” “Choose options,” “Update quantity,” “Remove,” “Continue shopping,” and “Proceed to checkout.”
- Structural headings such as “Order summary,” “Shipping address,” “Delivery method,” and “Payment method.”
- Accessibility labels, skip-link text, pagination text, form hints, required/optional indicators, and media-control labels.

### Product and availability interface

- Neutral field labels: price, size, color, volume, quantity, ingredients, fabric/material, care, how to use, and size guide.
- System-derived states: “Sold out,” “Unavailable,” or “Only a few left” only when backed by configured live inventory.
- Selection guidance such as “Choose a size” or “Select a volume.”
- Error/recovery copy for invalid variants, quantity limits, stock changes, price changes, and unavailable products.
- Neutral empty states such as “No products match these filters” with clear reset/navigation actions.

### Cart and checkout interface

- Cart-empty, update-pending, update-success, update-failed, expired-cart, and reconciliation messages.
- Field labels and neutral validation guidance for name, phone, address, area, city, province/region, postal code, and optional notes.
- Honest conditional copy such as “Shipping is calculated after you select your city,” if that matches the implemented rate behavior.
- Loading, duplicate-submission prevention, payment pending/failed, retry, and return-to-cart messages.
- Order-confirmation structure: order reference label, summary headings, and support link labels. Delivery/payment wording remains data-driven.

### Policy and help structure

- Page outlines, tables of contents, definition labels, contact placeholders, and question wording.
- Plain-language drafts after the client supplies the actual rules; drafts remain visibly unapproved until client/legal review.
- Generic FAQ questions that request real answers, such as “Which cities do you deliver to?” or “How do I request an exchange?”

### SEO and metadata scaffolding

- Metadata templates, character guidance, canonical rules, structured-data field mapping, and internal-link labels.
- Deterministic safe fallbacks based only on approved product/category names and descriptions.
- Image alt-text workflow and factual descriptions once media is available. Alt text must not add benefits, ingredients, colors, or context absent from the asset/source.

## B. Content That Must Come From or Be Confirmed by the Client

### Brand and business facts

- Final brand name/styling, logo usage, origin story, mission, values, founder information, tone of voice, and approved taglines.
- Legal business name, business/return address, official email, phone, WhatsApp number, business hours, and escalation owner.
- Service areas, customer-support response expectations, social profiles, and authorized marketing channels.
- Any claim such as local, imported, original, natural, organic, cruelty-free, halal, sustainable, dermatologically tested, premium, guaranteed, or certified—plus evidence and permitted wording.

### Product facts and merchandising

- Product and variant names, category/subcategory, short/full descriptions, prices, genuine compare-at prices, currency display preference, SKUs, active/featured state, and badge eligibility.
- Complete size/color/volume matrix, inventory source, stock thresholds, purchase limits, backorder rules, and sold-out merchandising preference.
- Clothing fabric/material percentages, construction, fit, measurements, model details, care instructions, country of origin, and approved size guide.
- Perfume concentration, volume, scent family/notes, ingredients, instructions, warnings, storage, longevity/projection claims, and audience wording.
- Skincare, shampoo, and oil ingredient lists, INCI data where applicable, suitability, usage sequence/frequency, cautions, patch-test/storage guidance, and every benefit or result claim.
- Related products, routines, bundles, collection stories, launch/seasonal campaign content, and reasons for recommendations.
- Product reviews, reviewer permission, verified-purchase status, ratings source, moderation policy, and any customer media rights.

### Commerce and policy facts

- Delivery cities/regions, exclusions, courier, service levels, dispatch and delivery estimates, charges, free-shipping rules, delays, failed-delivery handling, and tracking process.
- COD availability, limits, fees, verification process, refused-delivery policy, and supported locations.
- Online payment methods once selected, payment timing, failed/pending payment handling, refunds, and fee treatment.
- Discount terms, validity, eligibility, usage/stacking limits, cancellation effects, and promotional disclaimers.
- Return/exchange windows, eligibility, condition requirements, exclusions by category, hygiene/seal rules, defective/wrong-item process, evidence requirements, return shipping responsibility, refund method/timing, and contact route.
- Cancellation window/process, order-edit rules, tax/invoice treatment, warranty/guarantee terms, and order-note limitations.
- Privacy practices, cookies/analytics, processors, marketing/WhatsApp consent, data retention, customer rights/contact, cross-border processing, and final legal approval.
- Terms covering eligibility, pricing errors, availability, order acceptance, payment, fulfillment, prohibited use, IP, liability, disputes/governing terms, and change notices—with legal review.

## Page-by-Page Content Inventory

### Homepage

**Required:** announcement text if used; hero headline, supporting line, CTA labels/targets; curated collection titles/intros; featured-product rationale/order; one or more category/brand story modules; verified proof/reviews if available; support/newsletter prompt; SEO title/description and social-sharing copy.

**We can draft:** section headings, CTA microcopy, content hierarchy, and variants based on approved facts.

**Client must confirm:** hero/brand claims, campaign dates, product selection, category story facts, proof points, reviews, delivery messaging, newsletter proposition, and final SEO claims.

### Collections

**Required per collection:** title, slug, short introduction, optional longer story, product membership/order, hero/editorial content later, applicable filters, SEO title/description, canonical/indexing decision, and any campaign validity.

**We can draft:** navigation labels, filter/sort labels, result counts, empty/filter-reset copy, and safe metadata structure.

**Client must confirm:** taxonomy, collection narrative, product membership/order, promotional text, category claims, and campaign dates.

### Product Detail Page

**Required per product:** approved title; short/full descriptions; price/compare-at; option names/values; availability behavior; media mapping/alt facts later; category-specific facts; instructions/care; size guide; warnings; delivery/return summary; related products; SEO; structured-data facts.

**We can draft:** labels, selection guidance, quantity/stock error copy, accordion headings, purchase-action copy, and fact-based editing once source data exists.

**Client must confirm:** every product fact, claim, ingredient/material, size/volume, instruction, warning, price, SKU, stock rule, compare-at history, recommendation, review, and policy summary.

### Cart Drawer and Cart Page

**Required:** titles/actions, quantity/remove behavior, discount entry/help if enabled, shipping calculation wording, order-note label/limitation, unavailable-item recovery, subtotal/total labels, support route, and policy links.

**We can draft:** functional copy and error states.

**Client must confirm:** discount availability, shipping/free-shipping wording, order-note purpose, support channel, cross-sell rules, COD teaser, and policy summaries.

### Checkout

**Required:** contact/address/delivery/payment/review field labels; why phone/email is collected; required/optional markers; city/serviceability guidance; delivery method names, charges, estimates; COD/online explanations; consent wording; error/recovery states; final submission and pending-payment text.

**We can draft:** neutral form labels, validation and status copy, step headings, and accessible errors.

**Client must confirm:** required fields, supported cities, rate/estimate text, COD terms, future payment content, cancellation/order-acceptance point, marketing/WhatsApp consent, privacy notice, and support escalation.

### Order Confirmation and Tracking

**Required:** success/pending/failure headings; order reference; summary labels; payment state; confirmed next steps; delivery/tracking explanation; receipt/invoice availability; cancellation/edit guidance; support contact; notification text.

**We can draft:** state-specific structure and neutral system messages.

**Client must confirm:** when an order is “confirmed,” COD verification, receipt/invoice process, delivery expectations, cancellation window, tracking process, and communication channels.

### Shipping Page

**Required:** coverage, exclusions, processing/dispatch timing, delivery estimates, rates/free-shipping threshold, courier/tracking, address changes, delays, failed attempts, refused COD, damaged/lost shipment process, and contact path.

All operational facts require client/courier confirmation. We can edit the approved facts into plain language but cannot choose them.

### Returns and Exchanges

**Required:** window, eligible condition, excluded products/categories, size exchanges, hygiene/seal rules, wrong/damaged item path, request steps, evidence, approval, shipping responsibility, refund method/timing, sale-item rules, and contact information.

All policy terms require client confirmation and legal/business approval. Do not copy another store’s policy.

### Privacy Policy

**Required:** controller/business identity; collected data; purposes/legal basis as applicable; cookies/analytics; payment/courier/hosting/communications processors; sharing; retention; security summary; rights/request route; marketing and WhatsApp use; children/minimum age decision; cross-border processing; updates and contact.

Client/legal confirmation is mandatory after the actual vendors and data flows are known. A generated template is not launch-ready legal advice.

### Terms and Conditions

**Required:** business identity; site use; customer eligibility; account/guest rules; product information; pricing errors; stock; promotions; order offer/acceptance; payment; COD; delivery; cancellation; returns; IP; prohibited activity; liability/disclaimers; disputes/governing terms; updates; contact.

Client/legal confirmation is mandatory. Technical behavior—especially when an order becomes accepted—must match the wording.

### Contact Page

**Required:** official channels, WhatsApp availability, business hours, expected response wording, postal/return address distinction, social accounts, contact-form fields/purpose, privacy notice, and urgent order-help instructions.

We can write labels and safe form feedback. The client must supply and verify all contact facts, routing, staffing, and response commitments.

### FAQ

Candidate topics: ordering, variants/sizing, authenticity/source, product use, stock, discounts, COD, online payment, cities, shipping, tracking, address changes, cancellations, returns/exchanges, damaged/wrong items, refunds, privacy, and contact.

We can structure and edit questions. Every answer containing a product, policy, payment, or operational fact requires client approval.

### Footer

**Required:** shop/category links, customer-care links, policy links, contact/support, social links, optional newsletter text/consent, legal business/copyright text, payment/courier marks only when accurate, locale/currency display, and accessibility route if provided.

We can organize labels and navigation. Client confirmation is required for legal identity, channels, social URLs, newsletter proposition, trademarks/logos, payment/courier claims, and copyright owner.

### Trust Messaging

Potential trust themes include accurate product information, verified stock, transparent pricing, supported payment methods, delivery coverage, returns, customer support, authenticity, ingredients/materials, and secure technical handling.

We can place verified trust facts near the relevant decision and write concise wording. The client must provide evidence and approve each factual promise. “Secure checkout” may be used only after HTTPS, payment handling, secrets, and checkout controls are actually validated. Never manufacture urgency, guarantees, certifications, ratings, “free delivery,” or “easy returns.”

## Content Inputs and Approval Checklist

- Master catalog sheet with one row per product/variant and a stable source owner.
- Category-specific fact sheets and approved legal/safety copy.
- Shipping, COD, payment, discount, cancellation, return/exchange, and support operating procedures.
- Legal business/privacy inputs and vendor list after architecture selection.
- Approved reviews, claims evidence, badges, social links, and contact details.
- Launch language decision; professionally reviewed Urdu content if offered.
- Named approvers for product facts, operations/policies, legal/privacy, and brand voice.
- Versioned sign-off before content is migrated into production.

## Content That Must Remain Absent Until Confirmed

- Ingredient, benefit, efficacy, suitability, safety, scent, fabric, origin, sustainability, certification, or authenticity claims.
- Delivery dates, dispatch times, serviceable cities, shipping fees, free-shipping thresholds, COD availability, or payment logos.
- Return/exchange windows, “easy returns,” warranties, guarantees, refund timing, or cancellation promises.
- Review counts, star ratings, bestseller/low-stock/limited labels, strike-through pricing, or promotional deadlines.
- Official WhatsApp/contact details, operating hours, and response-time promises.
