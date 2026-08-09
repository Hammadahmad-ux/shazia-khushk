# UI Anti-Patterns

## Purpose

Use this as a design, content, and implementation rejection checklist. The store should feel like a focused Pakistani DTC brand with a curated catalog—not a theme demo, marketplace, dashboard, or imitation of a benchmark brand. An exception requires a real customer or merchandising need, evidence that it helps, and accessibility/performance review.

## Generic Template Signals

Avoid:

- a promo bar, oversized hero, icon benefits row, “best sellers,” testimonials, newsletter, and Instagram grid in the same predictable template order;
- repeated card grids separated by arbitrary colored bands;
- identical rounded white cards for categories, products, benefits, FAQs, and policies;
- decorative gradient blobs, glass panels, neon glows, stock illustrations, or generated lifestyle imagery;
- generic luxury cues such as black-and-gold styling, excessive letter spacing, scripted headings, or serif type chosen before brand review;
- copying COS, Zara, Aesop, Glossier, Rare Beauty, Le Labo, Byredo, or ARKET visual identity rather than adapting useful interaction principles.

Prefer a small number of authored editorial moments, disciplined alignment, real product storytelling, and category-specific information.

## Catalog and Merchandising Density

Avoid:

- mega menus, brand indexes, faceted sidebars, grid-density controls, infinite scroll, and pagination for a catalog that does not need them;
- a homepage that behaves like a complete product listing;
- four- or five-column desktop grids that make imagery secondary;
- filters that produce no meaningful reduction, especially price sliders across a narrow price range;
- fake “trending,” “most loved,” “customers also bought,” or recently viewed sections without evidence;
- repeating the same product across multiple homepage rails to simulate breadth;
- horizontal carousels when the full set fits in a clear grid;
- out-of-stock products dominating collection results.

Every grid or collection must have a merchandising reason and a truthful source of ordering.

## Product Cards

Avoid:

- heavy shadows, floating panels, thick radii, gradient borders, tilted media, or multiple nested surfaces;
- more than one badge competing above the product name;
- ratings, wishlist, color count, stock number, delivery claim, and promotion appearing on every card;
- illegible swatches without text names or selections based on color alone;
- image zoom that crops merchandise, moves the card, or causes neighboring content to shift;
- autoplay video or motion on every card;
- hiding title, price, or availability until hover;
- making a whole card one link while nesting quick-add controls inside it;
- adding a default clothing size or fragrance volume without explicit customer selection;
- disabled actions with no textual reason.

Cards remain quiet: image, name, useful descriptor, price, factual state, and one appropriate action.

## Homepage and Editorial Content

Avoid:

- a hero so tall that phone customers cannot see what the store sells or how to continue;
- text placed over a busy image without a deliberately approved crop and contrast treatment;
- auto-rotating hero carousels, multiple competing primary calls to action, or scroll-jacking stories;
- long brand manifestos before category/product discovery;
- asymmetry that breaks alignment or creates arbitrary empty space;
- every section being full bleed, every image being the same size, or every section using a different visual system;
- product claims, customer counts, review scores, press logos, certifications, or urgency messages without evidence;
- category photography used as decoration without a clear link or label.

The first two meaningful phone scrolls should establish the offer and expose category or product discovery.

## Product Detail Pages

Avoid:

- burying price, availability, required choices, or Add to cart below editorial copy;
- preselecting a high-priced volume or an arbitrary clothing size to accelerate an add;
- disabling sold-out options without naming their state;
- showing variant choices as unlabelled swatches or ambiguous thumbnails;
- placing every detail inside closed accordions, including the primary description;
- sticky purchase columns taller than the viewport;
- a mobile purchase bar that appears before the main action, duplicates nearby controls, or covers errors/content;
- forced image zoom, scroll hijacking, pinch conflicts, or gallery navigation available only by swipe;
- autoplaying sound, uncaptioned informative video, or video that blocks the gallery;
- universal PDP content that displays empty Ingredients, Fabric, Notes, or Care sections for irrelevant categories;
- fake scarcity, countdown timers, visitor counters, aggressive “X people are viewing,” or unsupported low-stock claims;
- subscriptions, engraving, refill programs, virtual consultation, or try-before-you-buy without operational support.

The PDP must adapt its evidence and instructions to clothing, fragrance, or care products while keeping one consistent purchase structure.

## Cart and Checkout

Avoid:

- navigating directly away from the PDP after every add when a confirmed cart drawer can preserve context;
- opening the drawer before the server confirms a valid cart mutation;
- stacking cart, variant, coupon, and shipping drawers;
- hiding line-item variant labels or showing only a generic product title;
- silent quantity failures, automatic substitution, or removal with no recovery;
- a checkout button obscuring the last item, note field, error, or on-screen keyboard;
- requiring account creation, email when it is not operationally necessary, or newsletter consent to order;
- collecting unnecessary identity data;
- treating COD as a visual afterthought or selecting an unapproved payment gateway in the UI architecture;
- charging shipping or applying a discount only at the final click without clear recalculation;
- using a fake coupon box when discount codes are not supported;
- erasing entered address data after validation, payment-method changes, or network errors;
- marking an order confirmed before durable server-side creation.

Cart totals must remain transparent: subtotal, discount, shipping status/cost, and total in PKR, with authoritative revalidation before order placement.

## Navigation, Search, and Overlays

Avoid:

- multi-level flyout navigation, hover-only menus, tiny close buttons, or unlabeled icons;
- a permanently transparent header over unverified imagery;
- hiding the header after minor scrolling or using animated shrink effects that move content;
- search overlays with no label, clear, close, zero-result recovery, or full-results route;
- disabling browser Back through state-only navigation;
- multiple simultaneous overlays, focus escaping behind a sheet, or body content remaining interactive;
- full-screen overlays for simple confirmations;
- floating chat/WhatsApp controls covering cart, checkout, or sticky purchase actions.

WhatsApp support should appear only after the client confirms the managed number, operating expectations, consent wording, and escalation path.

## Motion and Feedback

Avoid:

- animating every section into view, perpetual ambient motion, cursor followers, parallax, or route-transition theatre;
- spring/bounce motion for purchase actions;
- transitions longer than 350ms for routine interactions;
- scale effects that blur text, crop product details, or change layout;
- skeleton screens that pulse indefinitely or conceal usable server-rendered content;
- success communicated only by color, icon, animation, or toast;
- errors shown only at the top or after input has been erased;
- ignoring `prefers-reduced-motion`.

Feedback is immediate, local to the action, announced when necessary, and retains customer data on failure.

## Mobile Anti-Patterns

Avoid:

- shrinking the desktop layout until it technically fits;
- two-column grids below the width at which product metadata and 44px controls remain readable;
- swipe-only discovery, hover-only quick-add, and controls located behind gestures;
- multiple sticky layers competing with browser chrome and safe areas;
- fixed elements sized with legacy viewport height that break when browser bars or keyboards appear;
- half-width address inputs, tiny quantity controls, or horizontally scrolling checkout forms;
- rendering a separate mobile application with divergent content or business logic;
- hiding policy, delivery, ingredient, material, or care content merely to shorten the page.

Use one ordered document, mobile-first CSS, `dvh`, safe-area insets, and full-page checkout.

## Accessibility Anti-Patterns

Reject any design that uses:

- low-contrast “luxury” gray, ultra-light type, tiny uppercase copy, or text baked into imagery;
- color alone for stock, discount, selected variant, required field, or error state;
- focus outlines removed or hidden under sticky UI;
- clickable `div` elements, ambiguous link text, or icon-only actions without accessible names;
- controls smaller than 44 × 44px on touch layouts;
- visual reordering that differs from DOM/focus order;
- placeholder text as the only form label;
- modal, drawer, zoom, or menu behavior without focus trap, Escape close, and focus restoration;
- content clipped at 200% zoom;
- motion or media without pause/control alternatives.

Accessibility is part of the acceptance criteria, not a later visual cleanup.

## Performance and Asset Anti-Patterns

Avoid:

- committing unoptimized client originals directly to the storefront delivery path;
- loading desktop crops on phones, every gallery image eagerly, or video in collection grids;
- large client-side libraries for a gallery, drawer, animation, or state pattern available in the platform/framework;
- making the whole storefront a Client Component;
- layout shift from unsized images, late badge insertion, font swaps, or variable price height;
- using image optimization to invent a crop without checking the product focal point;
- third-party review, chat, tracking, or personalization scripts before need, consent, and performance review;
- masking slow interactions with excessive animation.

The real asset audit must determine crops, aspect ratios, focal points, poster frames, compression, and video eligibility.

## Content and Trust Anti-Patterns

Never invent or imply:

- ingredients, concentrations, fragrance notes, dermatological results, safety claims, fabric composition, origin, or authenticity;
- delivery time, free-shipping threshold, courier coverage, COD availability, or same-day dispatch;
- low-stock status, units sold, reviews, testimonials, press mentions, or social follower counts;
- discount validity, compare-at prices, savings, bundles, gifts, or limited editions;
- return/exchange eligibility, hygiene exclusions, refund timing, warranties, or cancellation rights;
- certifications, cruelty-free status, sustainability claims, or medical suitability;
- WhatsApp availability or response time.

Use neutral scaffolding language only in internal planning. Customer-facing facts must come from structured product data or client-approved policy content.

## Brand-Asset Decision Gate

Do not finalize the following until representative assets from every category and the actual logo have been reviewed:

- brand palette and contrast pairs;
- font family, weights, licenses, and Urdu support;
- header logo variant and minimum size;
- image ratios, mobile/desktop crops, focal points, color grading, and background treatment;
- icon stroke language, border radius, elevation, and divider tokens;
- hero composition, text placement, and whether transparent navigation is viable;
- media gallery template and eligibility of video;
- category emphasis and the final homepage editorial sequence.

If an asset cannot support the planned crop or hierarchy, change the layout rather than degrading, stretching, recoloring, or replacing the product image.

## Review Gate

Before approving a screen, ask:

1. Does every visible module have a customer or merchandising purpose?
2. Is every product, policy, pricing, stock, and trust statement sourced?
3. Can the complete action be performed by keyboard and touch, with reduced motion?
4. Does the same flow survive narrow width, text zoom, slow media, and an open keyboard?
5. Does the design elevate real merchandise without borrowing another brand’s identity?

Any “no” blocks visual approval.
