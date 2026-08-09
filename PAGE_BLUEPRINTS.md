# Page Blueprints

## Blueprint Principles

- Design for a small, curated catalog: one strong choice is better than five repetitive rails.
- Product discovery precedes brand exposition; commerce remains reachable during editorial storytelling.
- Every section needs a distinct job, a content owner, and a removal condition.
- Actual copy, imagery, product order, claims, colors, and fonts remain unassigned until client assets/content are approved.

## A. Homepage

### Recommended sequence

| # | Section | Purpose and content hierarchy | Desktop structure | Mobile structure | Primary interaction | Exist? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Announcement bar | One current operational or campaign message, then optional detail link | Single 32–40px row above header | One line; no auto-rotating slider; dismiss only if dismissal persists | Open relevant policy/collection | Conditional: only with approved factual message |
| 2 | Site header | Logo, Shop, direct category entry, search, cart; support links live in menu/footer | One restrained row; shallow dropdown only if needed | Logo plus menu, search, cart; 44px targets | Navigate/search/open cart | Required |
| 3 | Editorial hero | Approved media first; headline, one supporting line, one primary category/collection CTA, optional secondary text link | 60–80vh maximum; copy adjacent to media or on a tested quiet area | 60–70dvh maximum; art-directed crop; CTA visible without scrolling past a full screen | Enter the lead collection/story | Required when suitable hero asset exists; otherwise use a split editorial intro |
| 4 | Category discovery | “Shop by category” followed by the five approved top-level areas; visual priority reflects merchandising, not equal cards | Asymmetric editorial grid: one lead category plus four smaller entrances | Two-column list/grid with readable labels; no horizontal-only rail | Open category | Required |
| 5 | Lead product/collection story | One selected product or compact collection: story line, key approved fact, media, price/action link | 7/5 media-copy split; alternate alignment only when meaningful | Media, title/fact, then CTA in natural flow | Open PDP/collection | Required; content rotates through merchandising data |
| 6 | Curated product edit | Three to six products with one shared reason for selection; this is the only conventional homepage product grid | Three columns; no carousel when all products fit | Two columns; one column below ~360px if metadata crowds | Open PDP; quick-add only for simple variants | Required if at least three approved products |
| 7 | Beauty/fragrance story | Explain a routine, scent family, formulation category, or way to choose using verified facts | Large media plus concise text; optional 2-product pairing | Stacked media/story; no scroll effects; related products as text links or two cards | Explore the story/category | Conditional: requires coherent approved content and suitable media |
| 8 | Clothing story | Show fit, fabric, styling, or a curated look without becoming a lookbook maze | Editorial image pair or 5/7 split; one category CTA | One strong image then concise copy; size-guide link only if relevant | Shop clothing/featured piece | Conditional: requires approved garment media/details |
| 9 | Brand/value proposition | State two or three evidence-backed reasons the brand/store deserves trust | Short editorial statement with 2–3 proof lines; no icon-card trio | One statement followed by stacked proof lines | Learn about brand/policy if needed | Conditional until facts are approved |
| 10 | Commerce trust strip | Delivery coverage, COD/payment, returns, and support—only confirmed facts | Four text links separated by rules; no decorative badges | Two-column or stacked links with 44px targets | Open policy/contact | Required once policy facts exist; otherwise omit |
| 11 | Social proof | Verified review excerpt, customer media, or press proof with source/permission | One featured quote/media plus link; not a carousel by default | One item; link to more if a real destination exists | Read verified proof | Conditional; absent at launch if data/rights are missing |
| 12 | Newsletter/support | One-field email signup or a quiet support prompt; never both competing | Narrow centered form or split footer prelude | Full-width field/button; explicit consent/support expectation | Subscribe/contact | Conditional on real platform, proposition, and consent copy |
| 13 | Footer | Shop links, help, policies, contact, social, legal identity, currency/locale | 3–4 semantic groups, then legal row | Accordion groups only if link count requires; core contact/policies visible | Navigate to service/legal content | Required |

### Homepage constraints

- Do not place more than one conventional product grid on the homepage.
- Beauty/fragrance and clothing stories should feel compositionally distinct but share the same grid/tokens.
- Rotate or remove a story module when its category lacks appropriate facts/media; do not fill the gap with placeholders.
- Hero video is allowed only with an approved poster, mobile crop, muted autoplay policy, controls, and performance budget. A strong still image is the default.
- Social proof does not exist until verified content and usage rights exist.
- The homepage should expose products/categories within the first two meaningful scrolls on a 375px viewport.

## B. Collection / Shop Page

### Page hierarchy

1. Breadcrumb when nested.
2. Collection title, concise approved introduction, and optional editorial media.
3. Plain-text subcategory/category navigation when useful.
4. Result count plus sort and conditional filter control.
5. Product grid with at most one purposeful editorial insertion.
6. Optional short collection note/policy link after products.

### Density

- Desktop: three products per row. Four is allowed only if card text and images remain comfortably legible after real assets are tested.
- Tablet: two or three based on actual card minimum width; prefer two for clothing/editorial imagery.
- Mobile: two from standard 375px widths; one below the point where title, price, and action no longer fit without truncation.
- Use consistent 4:5 primary media. Do not mix masonry into comparison rows.
- Show the full catalog when practical. Introduce explicit pagination only when a collection exceeds the agreed performance/content threshold; never infinite scroll.

### Category navigation

- `/shop` begins with Shop All plus direct categories: Clothing, Perfume/Fragrance, Skincare/Serum, Shampoo/Haircare, and Oil/Care after taxonomy approval.
- Keep labels in one horizontal row only when they fit; otherwise wrap or use a compact category selector. Do not force a swipe-only rail.
- Selected category is represented by page context/URL, not color alone.

### Sorting

Default to curated/featured order. Offer only meaningful options: newest, price low-to-high, price high-to-low. Add “best selling” only when reliable order data and an agreed time window exist.

### Filtering decision

Traditional filters are not a launch requirement. Use this threshold:

- **No filters:** fewer than roughly 12 products or no filter materially narrows results.
- **One or two inline filters:** clothing size/color or beauty/fragrance volume when the current collection contains meaningful variation.
- **Filter sheet:** only when three or more useful facets exist. Desktop may use the same sheet/popover; a permanent sidebar is unnecessary.

Filters live in URL search parameters, show an active count, allow individual/clear-all removal, and preserve browser back behavior. Sold-out-only filtering is optional; price filtering is unnecessary when the price range is narrow.

### Product grid behavior

- Product card shows media, product name, one short category descriptor/selected option summary, price, and one factual state.
- Quick-add is immediate only for one active variant. Required size/color/volume opens a small selector sheet or the PDP.
- Sold-out cards remain visible when useful but sort behind available items unless merchandising says otherwise.
- One editorial module may span two columns after a complete product row; it must not split two comparable products or repeat the collection intro.

### Mobile behavior

- Title and first product appear early; optional editorial media must not consume a full screen before products.
- Filter/sort share one sticky-or-static toolbar; avoid two floating buttons over the grid.
- Opening filters creates a labeled sheet with result count, reset, and apply actions. Applying updates the URL and returns focus to the trigger/results heading.
- Preserve scroll position when closing quick-add/filter sheets and when using browser back from a PDP.

## C. Product Detail Page

### Universal information hierarchy

1. Breadcrumb/back-to-collection context.
2. Media gallery.
3. Product type/short descriptor, product title, PKR price, legitimate compare-at price, and verified rating anchor if available.
4. Variant selectors in decision order.
5. Size guide or choosing help adjacent to the relevant selector.
6. Derived stock/availability message.
7. Primary add-to-cart action.
8. Concise delivery, COD/payment, and returns summary with links to full policies.
9. Short product story/description.
10. Category-specific details and safety/care disclosures.
11. Curated related products or routine pairing.

Quantity defaults to one and is normally edited in the cart. Show a PDP quantity control only if multi-unit purchase is a real frequent need; do not add it by habit.

### Category adaptation

#### Clothing

- If color changes media, select/display color before size; otherwise size may come first based on testing.
- Color uses named swatches or labeled buttons; never a color circle without text.
- Size uses large text buttons, preserves unavailable sizes as disabled, and places “Size guide” plus fit note alongside the heading.
- Below purchase: description, fit, fabric/material, care, approved measurements/size guide, delivery/returns.

#### Perfume / fragrance

- Variant is volume, displayed as explicit labeled choices with price changes immediately reflected.
- The initial story includes fragrance form/concentration only when confirmed and a concise scent orientation.
- Below purchase: full story, top/heart/base notes when supplied, ingredients, use/storage/warnings, and tightly related formats/products.

#### Skincare, shampoo, oil, and care

- Variant is volume/pack size where applicable; price and stock update with selection.
- The initial descriptor may state product form/purpose only from approved facts.
- Below purchase: approved suitability/concerns, ingredients, how/when to use, warnings/patch test/storage, and routine position. “Oil” content waits for application-area confirmation.

### Desktop PDP

- Use a 7/5 or 8/4 split: gallery on the left, purchase panel on the right.
- Purchase panel may be sticky within its section only when its full content fits the viewport; otherwise it scrolls normally.
- Gallery can be a two-column editorial grid for 4+ strong images or a primary image with thumbnails for fewer/mixed media. Do not invent a dense gallery before asset audit.
- Keep title through trust summary within the initial viewport at common laptop height where possible.
- Product story begins below the purchase decision, not between variant selection and add-to-cart.

### Mobile PDP

- Order: compact header, breadcrumb/back link, swipe gallery with counter, title/descriptor/price, variants, choosing help, stock, add-to-cart, trust links, story/details, related products.
- Gallery uses one image per viewport width, native horizontal swipe, visible counter, and an explicit tap-to-zoom action. Provide previous/next controls for non-touch/assistive use.
- Use a sticky purchase bar after the main add-to-cart button leaves the viewport. It contains current price plus action; it must respect safe-area insets.
- If a required option is missing, sticky label becomes “Choose size,” “Choose color,” or “Choose volume”; tapping returns/focuses the selector rather than adding.
- Hide the sticky bar when the cart/filter/size-guide sheet or on-screen keyboard is open, when an inline validation error needs attention, and near the footer if it obscures content.

### Accordions

Use accordions for secondary, category-specific detail on mobile: product details, ingredients/materials, how to use/care, delivery/returns. Keep the first essential description visible. Desktop may show short sections expanded or use the same disclosure model. Each trigger states its section, exposes expanded state, and remains keyboard operable.

### Related products

Show two to four hand-curated items. Use reasons such as “Pairs with,” “Complete the routine,” or “Same scent family” only when backed by product data. Do not display a generic recommendation wall.

## D. Cart Drawer

### Opening behavior

- Open automatically only after a successful add-to-cart or when the cart control is activated.
- Do not open on failed/invalid add. Focus the relevant variant/error instead.
- Desktop: right-side drawer around 400–460px wide. Mobile: near-full-screen sheet using `dvh` and safe-area padding.
- Background becomes inert; scrolling stays inside the drawer; focus moves to the drawer heading/close control and restores to the trigger on close.

### Hierarchy

1. “Your cart” heading, item count, labeled close button.
2. Optional small success message for the just-added item.
3. Scrollable line items.
4. Reconciliation/availability message if needed.
5. Subtotal and honest shipping/discount qualification.
6. Dominant checkout CTA.
7. Continue-shopping text action and optional full-cart link.

### Line item

- Thumbnail, product name, selected size/color/volume, unit/line price.
- Quantity decrement/value/increment with 44px mobile targets; pending state disables only that line.
- “Remove” is a text button; removal offers a short undo when feasible.
- Show changed-price, low-stock, sold-out, or quantity-limit messages inline with a direct fix.

### Continue shopping

Close the drawer and restore focus/scroll to the originating card or PDP action. Do not navigate customers to the homepage automatically.

### Empty state

Use one sentence, a Shop All action, and up to two direct category links. Do not place a product carousel in an empty drawer.

### Accessibility

Use dialog/sheet semantics with an accessible name, focus trap, Escape close, labeled icon buttons, logical tab order, and polite live announcements for add/remove/quantity/subtotal changes. Motion-reduced users receive an instant or opacity-only transition.

## E. Cart Page

### Why it remains required

- It is a stable URL for refresh, back/forward navigation, checkout return, and customer support guidance.
- It provides a resilient path when JavaScript, a drawer, or a device viewport fails.
- It gives adequate room for several items, order notes, discount entry if enabled, policy links, and reconciliation errors.
- It supports accessible review without trapping the user in an overlay.

### Hierarchy

1. Page title and item count.
2. Reconciliation alert when catalog/price/stock changed.
3. Cart line list with complete variant details and edits.
4. Optional discount form and optional order note—only if approved.
5. Delivery/payment/returns links.
6. Order summary: subtotal, discount, shipping qualification, total status.
7. Primary checkout CTA and continue-shopping link.

Desktop uses a two-column layout with lines left and a sticky summary right. Mobile stacks lines then summary; keep a sticky checkout action only when it does not duplicate a visible CTA or cover errors. All mutations share behavior/status with the drawer.

## F. Checkout

### Recommended guest sequence

Use three visible stages while retaining separable route/state boundaries:

1. **Contact & address**
2. **Delivery & payment**
3. **Review & place order**

If the selected provider requires a separate payment handoff, it follows order review without changing the customer’s understanding of progress.

### Stage 1: Contact & Pakistani address

- Full name and required mobile number first; accept common Pakistani formats and normalize server-side.
- Email is optional or required only after client confirmation; explain why it is requested.
- Address line 1, optional line 2, area/locality, optional landmark, searchable serviceable city, province/region (derived where possible), conditional postal code, and optional delivery instructions.
- Country is fixed to Pakistan and not presented as a distracting selector.
- City uses a maintained serviceability list, not unrestricted free text for rate calculation.
- Use persistent labels, autofill, correct input modes, inline errors, error summary, and focus the first invalid field.

### Stage 2: Delivery & payment

- Show only methods eligible for the selected city/cart, with approved label, cost, and qualified estimate.
- Recalculate visibly after address or item changes.
- Present COD as a payment option only where configured; do not mark it paid and do not preselect it when multiple methods exist.
- Present future online payment as a provider-neutral method. Exact provider UI/handoff waits for selection.
- Place concise policy/support links beside the choice; do not use a wall of trust badges.

### Stage 3: Review & place order

- Show editable summaries for contact/address, delivery, payment, items, discounts, shipping, and final PKR total.
- Reconcile price, stock, discounts, and delivery before enabling final submission.
- Final button names the action: “Place COD order” or provider-appropriate payment action once confirmed.
- Disable during submission, display progress, and use an idempotency key. On timeout, recover the existing result instead of creating another order.

### Order summary

- Desktop: persistent right column with items, variants, quantities, subtotal, discount, shipping, and total.
- Mobile: collapsed summary at the top with item count and total always visible; expand without losing form progress. Repeat the final total before submission.

### Confirmation

After durable order creation, show order reference, safe summary, payment state, approved delivery wording, support route, and next step. Protect the page with a non-guessable token/session. Notification failures do not turn a valid order into an error page.

### Checkout exclusions

No forced account, newsletter preselection, hidden fees, address autocomplete dependency, unverified delivery promise, default payment method, fake security badge, optional survey, cross-sell rail, or popup. WhatsApp appears only as an approved recovery path and never replaces the checkout.
