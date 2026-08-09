# Design Direction

## Creative Direction: Quiet Editorial Commerce

The storefront should feel like a modern Pakistani DTC brand with an editorial point of view: assured, tactile, product-led, and calm. Premium quality should come from composition, typography, art direction, and precise interaction—not ornamental “luxury” effects. The small catalog is an advantage: give products room, tell category stories, and make every recommendation feel selected.

UI UX Pro Max research surfaced Editorial Grid, Swiss Modernism, Exaggerated Minimalism, and a serif/sans editorial pairing as the strongest relevant patterns. Its generic luxury result—Liquid Glass with black and gold—is deliberately rejected because it would impose an unverified palette, weaken contrast, increase rendering cost, and resemble the generic aesthetic in the brief.

## Visual Personality

- Restrained, warm, confident, and contemporary.
- Editorial rather than catalog-dense; asymmetric moments anchored by a disciplined grid.
- Tactile through real fabric, bottle, skin, and ingredient imagery—not simulated glass, chrome, or 3D decoration.
- Pakistani through the actual brand voice, people, product context, and photography. Do not add stereotyped motifs, calligraphy, or “heritage” decoration without evidence from the brand.
- Conversion-focused but never urgent by default. Trust comes from clear policies, accurate availability, real proof, and calm purchase controls.

## Color Strategy: Deferred Until Asset Review

No final brand colors or hexadecimal palette should be selected yet. First:

1. Inspect every supplied logo variant in light/dark and vector/raster formats.
2. Sample the logo and dominant product-photography tones; assess consistency by category.
3. Test candidate surfaces and accents against real hero, card, PDP, error, success, focus, and disabled states.
4. Define semantic tokens (`background`, `surface`, `text`, `muted`, `border`, `brand`, `accent`, `focus`, `success`, `warning`, `error`) rather than page-specific colors.
5. Verify WCAG contrast and print-like tonal hierarchy before approval.

The working direction is light-led and neutral enough to support varied photography, but “neutral” does not mean a final white/black/gold scheme. Dark mode is not a launch requirement unless the brand and content justify it.

## Typography Strategy

Use a two-family system: an expressive editorial face for display moments and a highly legible sans serif for navigation, UI, prices, forms, and body copy. The contrast should be visible but not theatrical.

- Display: moderate-to-high contrast serif, used for hero statements, collection titles, and selected editorial pull lines.
- UI/body: neutral humanist or grotesk sans with clear numerals and strong small-size rendering.
- Provisional research candidates include Newsreader, Libre Bodoni, or Playfair Display paired with Public Sans or Inter. These are shortlists, not final selections.
- Avoid ultra-thin weights, long all-caps copy, overly tight tracking, and more than four active weights.
- Use a fluid type scale with restrained display size: dramatic enough for hierarchy, never so large that mobile users cannot see product context and a next action.
- Confirm licensing, performance, logo compatibility, PKR numeral rendering, and Urdu/Arabic shaping requirements before selection. If Urdu is in scope, validate a purpose-built Urdu type family with real bilingual layouts rather than treating it as a fallback.

## Spacing Philosophy

Whitespace is a merchandising tool. Use it to isolate a product story and establish rhythm, not to force every section below the fold.

- Base spacing rhythm: 4 px with primary steps at 8, 12, 16, 24, 32, 48, 64, 96, and 128.
- Page gutters: approximately 20 px mobile, 32 px tablet, and 48–64 px desktop; tune after real assets are placed.
- Section spacing: 48–72 px mobile and 80–128 px desktop, reduced for related commerce sequences.
- Keep card internals compact and page-level composition generous.
- Use borders and spacing before shadows. Radius, if used, should be modest and consistent rather than applied to every container.

## Grid and Layout System

- Use a fluid 4-column mobile, 8-column tablet, and 12-column desktop grid with a consistent maximum content width around 1280–1360 px.
- Most commercial content aligns to the grid; editorial sections may span or offset columns intentionally.
- Product collections use two columns at standard mobile widths and three on desktop, favoring image scale over inventory density. Switch to one column on unusually narrow screens if metadata becomes cramped.
- Homepage category stories can use 5/7 or 7/5 image/text splits, alternating carefully rather than mechanically.
- PDP desktop layout uses an image-led 7/5 or 8/4 split with a sticky purchase column only while its content fits comfortably. Mobile becomes a single natural document flow.
- Avoid arbitrary masonry for core product comparison, mixed container widths, deeply nested cards, and wall-to-wall full-bleed sections without rhythm.

## Image and Video Treatment

Real product media is the primary visual language. Do not mask weak inputs with gradients or effects; identify reshoot or retouch needs during the asset audit.

- Standardize primary product-card imagery around a 4:5 portrait ratio. Preserve category-specific exceptions only when intentional.
- Use full-bleed editorial images selectively, with art-directed mobile crops and stored focal points.
- Keep product color, texture, and packaging accurate. Apply one approved color-grade recipe per shoot/category; avoid filters that distort merchandise.
- Use clean backgrounds for comparison and contextual/lifestyle frames for storytelling. PDP galleries should show scale, detail, packaging, and use where available.
- Never place important copy over busy imagery without a tested overlay/scrim and sufficient contrast; prefer adjacent text when possible.
- Product video should have a still poster, explicit controls, captions/transcript when informative, and no autoplay with sound. Motion previews must not consume data unexpectedly.

## Product Card Behavior

Cards should be image-led and visually quiet, with product hierarchy rather than decorative containers.

- Content order: media, optional factual badge, product name, concise variant/category descriptor, price, and compare-at price only when legitimate.
- Keep badges scarce: “New,” “Low stock,” or “Sold out” only from real data. Never stack promotional pills.
- Desktop hover may crossfade to a second approved image and reveal quick-add within reserved space. Use opacity/transform so the card never jumps.
- Quick-add adds immediately only for products with one purchasable variant. If a choice is required, open an accessible selector sheet; never choose a size or volume silently.
- Mobile cannot depend on hover. Show an explicit compact add/select action or let the card lead cleanly to the PDP based on product complexity.
- The product link and quick-add control must remain separate semantic targets with visible hover, focus, active, loading, success, disabled, and sold-out states.
- Avoid floating white boxes, heavy shadows, gradient borders, tilted cards, or video-on-hover across an entire grid.

## Product Detail Experience

The PDP should answer “Is this right for me, what exactly will I receive, and can I trust delivery?” before adding decorative story sections.

- Keep identity, price, variants, availability, and purchase action visible early.
- Use a large gallery with thumbnails or a clear position indicator. Support keyboard navigation, zoom without trapping users, and accessible video.
- Make selection errors immediate and specific. Unavailable combinations remain visible but disabled so users understand the range.
- Put the shortest useful delivery and returns reassurance near the CTA; link to full policies instead of using vague icon badges.
- Follow purchase controls with category-specific information: size/material/care for clothing; concentration/volume/notes for perfume; ingredients/skin or hair suitability/use/safety for care products.
- Use accordions for secondary detail on mobile, not to hide every piece of essential information.
- A sticky mobile purchase bar appears only after the main controls scroll away and updates with the chosen variant. Do not show it over the keyboard, cart sheet, or validation error.
- Recommendations should be hand-curated and limited. Prefer “pairs with” or “complete the routine” logic over generic “you may also like.”

## Header, Navigation, and Search

- Desktop: slim optional announcement, restrained header, prominent logo, direct shop/category navigation, and clearly labeled search/cart actions.
- Mobile: compact logo row with 44 px targets and a left or right navigation sheet containing large category links, shop-all, service links, and policies.
- A transparent hero header is allowed only when every frame/crop maintains contrast; otherwise use a stable surface. On scroll, transition to a compact solid header without layout shift.
- Keep the header sticky only when it improves re-entry to navigation; compensate its height so it never covers anchored content.
- Search opens quickly, autofocuses responsibly, supports recent/helpful suggestions only if real, and returns users to a shareable results URL. Provide spelling/zero-result recovery without marketplace-style complexity.
- Do not use a mega-menu for the current catalog. Avoid tiny icon-only interactions unless their accessible names and meaning are unmistakable.

## Cart Drawer

Use an accessible Sheet pattern: right-side drawer on desktop and near-full-screen sheet on mobile. It must trap focus, close with Escape, restore focus to the trigger, and prevent background interaction.

- Header: “Your cart,” item count, and labeled close button.
- Body: generous product thumbnail, name, selected options, price, quantity controls, remove action, stock or delivery issue, and inline mutation feedback.
- Footer: subtotal, honest shipping/tax note, one dominant checkout CTA, and a lower-emphasis continue-shopping action.
- Announce additions and total changes with a polite live region. Disable mutations while pending and provide recovery on failure.
- Do not use a fake countdown, auto-added warranty, preselected donation, hidden fee, or an upsell wall. One or two relevant suggestions may appear after cart essentials.

## Mobile Behavior

- Design the purchase path mobile-first, then enhance at 768, 1024, and 1440 px. Validate at 375 px and narrower rather than merely shrinking desktop layouts.
- Maintain 44 x 44 px touch targets with at least 8 px separation; respect safe-area insets and text zoom.
- Keep one primary action per viewport region. Sticky controls must not compete with chat widgets, cookie notices, or browser chrome.
- Use bottom sheets for short variant/filter decisions and full pages for checkout, policy reading, or complex product detail.
- Preserve browser back behavior, vertical scrolling, visible form labels, autofill, paste, correct keyboards, and focus on the first invalid field.
- Avoid swipe-only carousels, horizontal product rails as the only discovery route, and hover-dependent information.

## Animation and Micro-Interactions

Motion should clarify state, spatial origin, and causality. It is seasoning, not the concept.

- Controls and hover/focus transitions: roughly 150–220 ms.
- Drawers, menus, and media transitions: roughly 220–350 ms with ease-out entering and ease-in exiting.
- Limit each viewport to one or two noticeable motions. Prefer opacity and transform; do not animate layout dimensions or trigger content jumps.
- Appropriate moments include image crossfade, cart item confirmation, filter-result transition, accordion disclosure, and a restrained hero reveal.
- Avoid continuous animation, bouncing icons, cursor followers, scroll hijacking, exaggerated parallax, page-flip effects, and gratuitous route transitions.
- Under `prefers-reduced-motion`, remove nonessential movement and use instant or opacity-only state changes. Essential feedback must remain understandable without motion.

## Trust and Conversion Tone

- Use exact delivery areas/timelines, return terms, stock messages, payment methods, contact details, and verified reviews.
- Show trust nearest the decision it supports: delivery near add-to-cart, payment reassurance near checkout, ingredients/materials near evaluation.
- Use scarcity only when inventory data proves it. Never manufacture urgency, strike-through pricing, testimonial counts, guarantees, or certification badges.
- Keep CTA copy direct: “Add to cart,” “Choose size,” “Proceed to checkout.” Avoid aggressive popups and repeated full-width calls to action.

## Visual Anti-Patterns to Avoid

- Generic Shopify structure, marketplace density, dashboard panels, or a tutorial-style four-card grid.
- Unverified black-and-gold “luxury,” random gradients, aurora effects, glassmorphism, glow, chrome, or blurred translucent panels.
- Excessive rounded cards, pill-shaped labels, drop shadows, borders around every section, or icons inside decorative circles.
- Mixed illustration styles, emoji icons, stock lifestyle imagery, AI-generated product scenes, or unapproved cultural motifs.
- Oversized type that hides the product and next action; all-caps paragraphs; low-contrast thin text.
- Auto-rotating hero carousels, crowded promotional bars, persistent coupon popups, fake activity notifications, or urgency timers.
- Inconsistent image ratios, distorted logos, aggressive cropping, media without reserved dimensions, or text baked into images.
- Hover-only actions, invisible focus states, color-only status, tiny touch targets, inaccessible custom controls, or drawers without focus management.
- Animating everything, long transitions, parallax on mobile, or motion that ignores user preferences.

## Approval Gate Before High-Fidelity Design

Review the actual logo, catalog spreadsheet/data, representative media from every category, mobile video crops, and client references. Then approve: brand palette, type pairing, image crop system, icon language, radii/border/elevation tokens, homepage content order, PDP category templates, and mobile checkout wireflow. Until this gate passes, all style choices above are strategic direction rather than final visual identity.
