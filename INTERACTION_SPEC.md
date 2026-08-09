# Interaction Specification

## Global Interaction Rules

- Use semantic links for navigation and buttons for actions. Every interaction works with keyboard, touch, screen reader, and 200% zoom.
- Minimum touch target is 44 × 44px with at least 8px between adjacent controls.
- Hover may enhance but never reveal the only label, price, variant, or purchase path.
- Preserve URL/back behavior for navigation, search, sorting, filters, and gallery deep links if introduced.
- Reserve layout space for media, status, and validation; interaction must not shift surrounding content.
- Loading, success, error, disabled, empty, sold-out, and reduced-motion states are first-class requirements.

## Header

### Transparent vs solid

- Default state is solid. Transparent is allowed only over an approved hero whose every desktop/mobile crop passes contrast checks.
- Transparent state uses a logo/icon treatment approved for the actual background. Do not add text shadow as a general contrast fix.
- At the hero boundary—or after a small scroll threshold—the header becomes solid. Header height must remain constant so content does not jump.
- Routes without an edge-to-edge hero always start solid.

### Scroll behavior

- Header remains sticky when it materially shortens access to search/cart; its space is reserved in layout.
- Do not hide it on slight downward scroll. If hide/reveal is later tested, require a deliberate scroll distance and reveal immediately on upward intent/focus.
- No parallax, blur-heavy backdrop, shrinking logo animation, or scroll progress decoration.
- Keyboard focus inside the header forces it visible.

### Desktop navigation

- Logo links home; Shop and direct approved categories are visible.
- One shallow dropdown may group categories plus Shop All. It opens on click and optionally on pointer hover after a short intent delay; it never requires precision movement through multiple flyouts.
- Escape closes and returns focus to its trigger. Outside click closes. Focus cannot move into hidden content.
- Account/wishlist are absent at launch unless requirements change.

### Mobile menu

- Menu button opens a near-full-height sheet with logo/context, close, Shop All, top-level categories, then service/policy links.
- One level may expand inline; deeper nested accordions are prohibited for the current catalog.
- Body becomes inert, focus is trapped, Escape closes, and focus restores to Menu.
- Use `dvh`, safe-area padding, and internal scrolling. Do not trap the customer at the bottom of a long menu.

### Search

- Search control opens a focused overlay/sheet with visible label, clear action, close action, and recent/popular suggestions only when real.
- Results update after a short typing pause or on submit; do not fire a request per keystroke without control.
- Show products with compact image, title, category descriptor, and PKR price; show up to a useful small preview and link to full results.
- Escape closes, clear empties the query, Enter opens/submits, and the final query appears in the `/search` URL.
- Zero results offer corrected query/category links; never display a blank panel.

### Cart indicator

- Use a labeled cart control with numeric count. Announce count changes politely; cap visible text at `99+` if ever necessary.
- Count reflects reconciled line quantity according to the chosen business convention and stays stable during failed optimistic updates.
- Activating opens the drawer; it does not navigate away unless JavaScript is unavailable, when `/cart` remains the fallback.

## Product Cards

### Media

- Primary ratio is 4:5 with reserved dimensions. `object-fit` and focal-point rules wait for actual assets.
- Desktop hover/focus-within may crossfade to one approved secondary image in 200–260ms. No zoom/scale that crops details or shifts layout.
- Touch displays the primary image; essential second-view content belongs on the PDP, not behind a gesture.
- Video does not autoplay in collection grids. An approved short preview can be considered only after asset/performance review.

### Information hierarchy

1. Optional single factual state (`New`, verified promotion, `Sold out`).
2. Product name.
3. One category-relevant descriptor or selected option summary.
4. Current PKR price and genuine compare-at price.
5. One action: Add, Choose options, or Sold out.

Do not place ratings, wishlist, color count, stock number, delivery claim, and multiple badges on every card.

### Hover and focus

- Interactive media/card link receives visible cursor and a subtle image/text/border change; card footprint never changes.
- Keyboard focus mirrors meaningful hover information and remains visible against every image/surface.
- Avoid making the entire card one interactive element when it also contains quick-add; keep product link and action as separate semantic targets.

### Quick add

- One active/default variant: show Add on desktop hover/focus and as an explicit mobile action if card density permits.
- Required choices: action says Choose options and opens a small sheet or the PDP. It never adds a preselected size/color/volume silently.
- The quick-add area is reserved so revealing it does not push product metadata.
- Pending action locks only that card, retains label context, and prevents duplicate submission.

### Favorites

Do not include favorites at launch. A favorite icon creates account/persistence/empty-state/privacy expectations and visual noise. Reconsider only after repeated customer demand and an approved anonymous/account persistence model.

### Sold out and sale

- Sold out: preserve image/text, show a clear text state, disable add, and keep PDP navigation when the product remains published. Never lower opacity so far that content fails contrast.
- Partially sold out: card remains available; unavailable choices appear only when selecting options.
- Sale: show current price followed by accessible previous price and one restrained factual label. Do not use flashing color, countdown, percentage badge, or compare-at data without approval.

## PDP Gallery

### Desktop

- With 4+ coherent images, use a two-column editorial grid; with fewer images or mixed video, use one primary stage plus thumbnails.
- Selecting a thumbnail updates the stage without moving the purchase panel. Current selection is conveyed beyond color.
- Click/tap opens a full-screen viewer only when the source resolution supports useful detail.
- Viewer provides close, previous, next, counter, keyboard arrows/Escape, focus trap, and focus restoration.

### Mobile

- Use one image per viewport-width track with native horizontal swipe and scroll snap. Vertical page scrolling must remain natural.
- Show `current / total` and a visible next cue. Provide controls for non-touch users; do not rely only on swipe.
- Opening zoom is an explicit tap/button. In zoom view support pinch and double-tap only when they do not conflict with close/navigation.
- Restore the same slide and page scroll after closing.

### Video

- Video occupies a normal gallery item with poster, play label, controls, captions/transcript when informative, and duration where useful.
- Default paused; never autoplay with sound. Pause when the item leaves view or viewer closes.
- Loading failure retains the poster and a useful fallback; video never blocks image browsing or purchase.

## Variant Selection

- Render each option group as a labeled fieldset/list with current selection announced.
- Text buttons suit size/volume; named swatches suit color only when text remains available.
- Selecting one option recalculates valid combinations, price, media, SKU, stock, and CTA state without page reload.
- Invalid combinations are absent or clearly unavailable; known sold-out combinations remain visible and disabled.
- Changing an earlier option must not leave an impossible later selection. Clear it with an explanation or choose automatically only when exactly one valid value remains and the change is announced.
- Size guide opens a dialog/sheet beside the size label, not a new mystery tab. It preserves selected variant and restores focus.

## Add to Cart

| State | Behavior |
| --- | --- |
| Ready | Shows direct action and current price context where appropriate |
| Missing required option | Button says `Choose size/color/volume`; activation focuses/scrolls to the missing group and shows inline guidance |
| Loading | Disable repeated action; retain button width; use progress text/spinner after ~300ms; announce status |
| Success | Replace with brief `Added` feedback, update count, announce item/variant/quantity, then open cart drawer |
| Sold out/unavailable | Disabled with explicit text and option-level explanation; no fake waitlist |
| Stock/price changed | Keep customer on PDP, show specific inline change, update authoritative values, require deliberate retry |
| Network/server error | Preserve selection, restore enabled action, show safe retry plus approved support path if persistent |

Opening the drawer follows confirmed server success, not optimistic intent. Adding the same variant normally increments its line and the drawer highlights that line briefly without continuous motion.

## Cart Drawer Interactions

- Enter from the right on desktop and as a near-full-screen sheet on mobile in 240–320ms. Reduced motion uses instant/opacity-only appearance.
- Quantity decrement/increment is immediate visually when reversible, then reconciled. On failure restore the prior value and place error at that line.
- Remove requires a deliberate text action; provide a short undo when feasible instead of a confirmation dialog.
- Checkout button remains at the drawer bottom while lines scroll, but must not cover the last line or on-screen keyboard.
- Continue shopping closes and restores the originating context. The close icon has an accessible name and 44px target.
- Drawer never stacks another drawer. Size/variant correction uses an inline expansion or replaces drawer content with a clear back action.

## Accordions and Disclosures

- Use only for secondary information, not title, price, selected variant, stock, primary description, or add action.
- Entire labeled header is clickable; icon rotates or changes without being the only state cue.
- Duration 180–240ms, animating opacity/transform or a carefully measured disclosure—not long elastic height motion.
- Trigger exposes expanded state, controls its panel, remains in tab order, and preserves logical document order.
- On desktop, short essential sections may be expanded by default; behavior should remain consistent across PDP categories.

## Button and Form Feedback

- Pressed response begins within ~100ms through color/contrast or slight translation; never layout-affecting scale.
- Disabled controls retain readable contrast and explain the cause nearby.
- Async submissions disable duplicate action, retain entered data, and expose loading then success/error status.
- Checkout validates on blur and submit; do not show errors before the customer has interacted unless submission requires it.
- Errors use text plus visual treatment, associate to fields, appear in a summary, and focus the first invalid field.
- Success messages describe the completed action; do not rely on a check icon alone.

## Motion Timing and Easing

| Interaction | Target duration | Rule |
| --- | --- | --- |
| Hover/focus color or underline | 150–200ms | Ease-out; no delay for keyboard focus |
| Button press/release | 100–160ms | Immediate feedback; no bounce |
| Product image crossfade | 200–260ms | Opacity only; reserved frame |
| Menu/cart/filter sheet | 240–320ms | Transform + opacity; ease-out in, ease-in out |
| Dialog/zoom viewer | 180–260ms | Fade + small transform; focus moves after visible |
| Accordion | 180–240ms | No spring/overshoot |
| Success highlight | 600–900ms maximum | One-time, subtle, never required to understand result |

No routine interaction should exceed 350ms. Avoid linear easing, continuous decorative motion, scroll hijacking, cursor followers, parallax, autoplaying carousels, and route-transition theatrics. Under `prefers-reduced-motion`, remove transforms and nonessential smooth scrolling while preserving immediate state feedback.

## Interaction QA Checklist

- All actions have default, hover where applicable, focus-visible, active, disabled, loading, success, and error behavior.
- Focus order matches visual order; drawers/dialogs trap and restore focus; no hidden control is tabbable.
- Browser Back closes/reverses URL-addressable overlays or navigation states predictably.
- Product/card layout does not move when media, quick-add, errors, or prices load/change.
- Touch behavior works without hover and does not conflict with browser/system gestures.
- Cart/PDP mutations announce results and prevent duplicate actions.
- Motion remains comprehensible when disabled.
