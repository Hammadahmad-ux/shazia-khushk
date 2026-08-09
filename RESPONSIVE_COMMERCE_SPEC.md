# Responsive Commerce Specification

## Purpose

This specification defines behavior, not final styling. Use one semantic component tree with mobile-first CSS; do not create separate desktop and mobile storefronts. Breakpoints respond to content pressure rather than device names, and must be retested after the real logo, copy, product names, variants, imagery, and Urdu requirements are known.

## Validation Viewports

Design from the smallest supported width upward and verify at representative widths rather than only framework defaults.

| Range | Primary behavior |
| --- | --- |
| 320–374px | Narrow-phone stress case; one-column product grid is allowed when two columns make labels or controls unusable |
| 375–767px | Standard phone; two-column collection grid, single-flow PDP, sheets for short tasks |
| 768–1023px | Tablet/small landscape; 8-column grid, expanded spacing, layout changes only when content fits |
| 1024–1439px | Desktop; 12-column grid, persistent navigation, split PDP and cart drawer |
| 1440px+ | Wide desktop; cap content around 1280–1360px and add margins rather than stretching text or products |

Also test 200% browser zoom, landscape phones, short laptop heights, touch-enabled laptops, and a viewport with an on-screen keyboard. A CSS breakpoint may be tuned during implementation if content fails before or after these reference values.

## Shared Layout System

- Use 4 columns on phones, 8 on tablets, and 12 on desktop.
- Begin with page gutters near 20px phone, 32px tablet, and 48–64px desktop; confirm against actual media.
- Keep reading lines approximately 45–75 characters. Do not let wide screens stretch descriptions edge to edge.
- Use fluid spacing between breakpoints. Typical section separation is 48–72px on phones and 80–128px on desktop, tightened for consecutive purchase steps.
- Preserve media aspect ratios and dimensions before assets load to prevent layout shift.
- Full-bleed sections may extend beyond the content container, but their text and controls remain grid-aligned.

## Header and Navigation

### Phones

- Use one compact row: menu, centered or optically balanced logo, search, and cart count.
- If the real logo cannot remain legible at the available width, use an approved compact logo mark; never compress or crop it.
- The menu and search open near-full-screen sheets using `100dvh`, safe-area padding, focus containment, and internal scrolling.
- Keep category navigation one level deep. Avoid horizontal category rails as the only discovery path.
- Reserve the header height whether solid or transparent so the page never jumps.

### Tablet and Desktop

- Promote top categories to visible navigation only when labels fit without crowding the logo or utilities.
- Use a single shallow dropdown when grouping is needed; no multi-column mega menu for the small catalog.
- Keep search and cart visible. Do not introduce account or wishlist controls unless those features are approved.
- At narrow desktop widths, collapse navigation before reducing touch targets or truncating category labels.

## Homepage

- On phones, show the hero message, primary action, and a credible next-content cue without requiring an excessive first scroll. Products or categories should appear within the first two meaningful scrolls at 375px.
- Use art-directed mobile media rather than shrinking a wide desktop composition. Text must not cover important product details.
- Category discovery uses two columns on standard phones and may become one column at narrow widths. It must not be a swipe-only carousel.
- Curated products use two columns at 375px and above, one column when metadata or quick-add cannot fit, and three columns on desktop.
- Editorial modules stack in a deliberate reading order on phones; CSS reordering must not create a mismatch with keyboard or screen-reader order.
- Hero video is conditional on an approved mobile crop, poster, captions where needed, reduced-motion behavior, and performance budget.

## Collection Pages

### Grid

- Default to two product columns on standard phones and three on desktop. Do not add a four- or five-column density merely because space exists.
- At 320–359px, switch to one column if two columns cannot retain readable title, descriptor, price, and a 44px action.
- Product image ratio and information order remain consistent within a collection. Editorial insertions span the full phone grid and intentional desktop columns.
- Do not use masonry for product comparison.

### Sort and Filters

- On phones, combine sort and conditional filters in one clear toolbar. Sheets show a heading, result count, reset, apply, close, and current selections.
- Do not make a toolbar sticky if it competes with the header or purchase controls; static is the default for a small result set.
- On desktop, useful controls may appear inline or in a restrained side panel. Avoid a permanent sidebar when only one or two filters exist.
- Persist sort/filter state in the URL and restore page/scroll context when returning from a PDP.
- Omit filters entirely when they do not meaningfully reduce the collection, typically below about 12 products.

## Product Detail Page

### Phones

Use one natural document flow:

1. Breadcrumb or compact back context.
2. Product title, category descriptor, price, and factual status.
3. Swipeable gallery with counter and non-touch controls.
4. Short value/description statement.
5. Required options and size guide where relevant.
6. Quantity where needed, add action, and concise delivery/payment facts.
7. Category-specific detail, support, related products, and footer.

- The gallery uses one item per track and native horizontal scroll snapping. Do not hijack vertical scrolling.
- Use a sticky purchase bar only after the main action leaves view. It shows price and one action, respects safe areas, and never covers validation or keyboard content.
- When a required option is missing, the sticky action says what must be chosen and returns focus to that selector.
- Hide the sticky bar while any menu, cart, filter, size-guide, or zoom sheet is open; while the keyboard is open; and when it obstructs the footer.
- Secondary detail may use accessible accordions. Title, price, key description, selected variant, stock state, and add action remain visible.

### Tablet and Desktop

- Move to a 7/5 or 8/4 media-to-purchase split only when both columns have sufficient width.
- The purchase panel may be sticky only if the entire actionable panel fits within the visible height. Short laptops use normal page flow.
- Use an editorial media grid for at least four coherent assets; otherwise use a primary stage with thumbnails.
- Avoid excessive blank space above the product title or a purchase panel vertically detached from the lead image.

## Product Cards and Quick Add

- Essential card information is always visible at every width; hover only enhances media or reveals an already discoverable action.
- Touch devices receive explicit Add or Choose options controls only when the grid can support them without crowding.
- Required size, color, or volume selection opens a focused bottom sheet on phones. Never silently add an arbitrary default variant.
- A quick-add sheet uses no more than the necessary option groups, stock state, price, and action. Complex choices route to the PDP.
- Keep card control targets at least 44px even if this requires a one-column narrow-phone layout.

## Cart Drawer and Cart Page

### Phones

- The cart opens as a near-full-screen sheet, not a narrow desktop drawer. Use a fixed header, scrollable line-item region, and bottom summary/action area.
- Account for safe-area insets and the browser/on-screen keyboard. The checkout action cannot cover the final line, error, or note field.
- Quantity controls and Remove are explicit 44px targets. A pending update disables only its affected line.
- If order notes are edited, bring the field above the keyboard and temporarily release sticky positioning where needed.

### Desktop

- Use a right-side drawer approximately 400–460px wide with line items scrolling independently of the summary.
- `/cart` remains a complete fallback and supports a two-column layout with lines left and a summary right.
- At intermediate widths, prefer the mobile sheet pattern over compressing a desktop drawer below usable line-item width.

## Checkout

- Checkout is a full page at every width; do not place the entire flow in a drawer or modal.
- Present three visible stages: contact/address, delivery/payment, and review/place order. Preserve completed data when moving between stages.
- Phones use one column and one primary action per region. Desktop may place a sticky order summary beside the form only when it fits the viewport and does not conceal validation.
- Use `type="tel"`/telephone keyboard behavior for Pakistani mobile and optional postal code fields, while server validation accepts common spacing and country-code forms before normalization.
- City selection must support keyboard search and a manual/fallback path if the courier city list is incomplete. Province follows validated city data where possible.
- Address lines and landmark/area fields remain wide enough for real Pakistani addresses. Do not split them into cramped half-width fields on phones.
- COD and future online payment options use a provider-neutral method selector. Changing method must not erase address or contact data.
- The Place order action remains visible in the normal flow and may become sticky only if it does not cover field errors, policy consent, or the keyboard.
- On errors, focus the summary or first invalid field and keep entered values. Never send the customer back to the start unnecessarily.

## Media and Network Adaptation

- Supply responsive image widths and modern formats while retaining an original-quality source outside the delivery path.
- Prioritize only the likely LCP image. Lazy-load below-fold media and later gallery items; do not lazy-load visible product-card media indiscriminately.
- Serve separate approved crops where composition requires it. A CSS crop cannot rescue a subject placed outside the mobile frame.
- Video begins paused, uses a poster, never autoplays with sound, and does not block purchase content. Honor data-saving and reduced-motion preferences where detectable.
- On slow or failed requests, retain dimensions and provide retry/alternate content without replacing product information with skeletons indefinitely.

## Accessibility and Internationalization Stress Tests

- Support 200% text zoom without clipped navigation, overlapping sticky controls, or horizontal page scrolling.
- Test long product names, four-digit and higher PKR prices, compare-at prices, long city names, and translated/expanded labels.
- Do not encode meaning through desktop placement, hover, color, or imagery alone.
- Maintain logical DOM order across responsive changes. Visible focus must not sit underneath sticky regions.
- If Urdu is approved later, audit RTL layout, mixed Urdu/English product names, numeral presentation, input direction, and font coverage before claiming support.

## Responsive Acceptance Checklist

- No essential action depends on hover, swipe, or a specific viewport orientation.
- Header, cart, and purchase bars never stack into an unusable viewport.
- Product imagery remains prominent without hiding names, prices, options, or actions.
- Browser Back restores collection state and returns customers near their previous product.
- Drawers and sheets fit short viewports, scroll internally, and restore focus on close.
- Checkout remains usable with the keyboard open and after validation errors.
- Layout shift is avoided during font, image, price, stock, and async state changes.
- The experience remains complete with reduced motion and resilient on constrained Pakistani mobile networks.
