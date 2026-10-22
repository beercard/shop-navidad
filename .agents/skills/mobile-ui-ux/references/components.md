# Component and overlay selection for mobile

Read this when: choosing which component to use (button, tab, segmented control, chip, card, list row, sheet, dialog, menu, snackbar, banner, picker, switch, carousel, pagination, chart…), laying out a screen from parts, or reviewing "is this the right container?". Start with section 1 (decision rules), then jump to the component you need.

Tags: `[S]` standard · `[P-iOS]` `[P-AND]` platform · `[R]` research · `[C]` consensus · `[H]` heuristic · `[T]` trend. Research date 2026-10-06. Material numbers come from androidx Compose token source and Material Components docs (m3.material.io was unreachable); "M1" = deprecated Material 1, used for pattern logic only. Thresholds that no study supports are marked `[H]`.

Contents: 1 Decision rules (D1-D10) · 2 Buttons · 3 Navigation components · 4 Containers: cards, lists, menus · 5 Overlays: dialogs, sheets · 6 Feedback surfaces · 7 Inputs and selection · 8 Content patterns · 9 Onboarding, search, filters · 10 Data visualization · 11 Visual noise evidence · 12 Comparison tables · 13 Anti-patterns · 14 Numbers · 15 Evidence limits

---

## 1. Decision rules (the agent's component-selection ruleset)

**D1 Containers**
- Serious/irreversible decision that must be acknowledged before continuing → alert/dialog (≤ 3 buttons, verb labels, Cancel). Reversible → act + snackbar with Undo (no dialog).
- Choose 1 of 2-6 actions after an intentional tap → iOS action sheet / Android bottom-sheet list or menu.
- Quick, contextual task with ≤ ~3 inputs, or a pick list ≤ ~7 rows → bottom sheet (visible close; Back dismisses) `[H thresholds]`.
- Multi-step, > ~5 inputs, needs its own URL/Back stack, or long reading → full-screen modal (create/edit; Cancel/Save) or pushed page (navigation) `[H thresholds]`.
- Optional detail of the same item → inline expansion; if everyone needs it, show it. Anchored small choices on tablet/web → popover; on phone width convert to a sheet.

**D2 Navigation**
- 3-5 top-level destinations → bottom nav/tab bar (icon + label). 2 → segmented/top tabs. > 5 → 4 + labeled hub or restructure.
- Switching the view of the same data, 2-5 options → segmented; peer content sections → tabs; > 5 options or multi-select → chips. > 2-3 toolbar actions → overflow; the primary action is never hidden. Hidden nav (drawer) only paired with visible entries and a "Menu" label.

**D3 Choose one of N** (sources conflict on thresholds; defaults chosen)
- Binary state with immediate effect → switch; labeled alternatives → radio pair or segmented. 2-4 options → radio list (visible); may be segmented if it switches a view with short labels. 5-10 → native picker/menu/dropdown; 11-15 → picker with sections or searchable sheet `[H]`; > 15 or dynamic → combobox with search. Known value (age, year, quantity) → text input with the right keyboard, not a picker. Multi-select ≤ ~7 → checkbox list; more → searchable multi-select sheet/chips `[H]`. Imprecise numeric range → slider + value; precise/wide → numeric field (+ stepper for small range).

**D4 Date/time**: known memorable date → three fields; far past/future → typing; near-term/availability/range → calendar (modal on phone) with typing fallback; time → wheel/clock + typing; relative shortcuts → chips.

**D5 Feedback**: field problem → inline error + summary; persistent system condition → banner; transient own-action result → snackbar 4-6 s without an action `[H]`; with an action ≥ 10 s or persist until acted (states-feedback.md §14). Never toast alone for critical content; add a status role.

**D6 Lists/content**: homogeneous scan/compare → list rows; heterogeneous/media browse → cards; image-first → grid; data-dense → condensed rows (not a table). Feed → infinite scroll with Back restore; catalogue/search → load-more; finite records/keyboard-heavy → pagination. > 5 horizontally browsable peers → scroller with peek; promos → static or manual ≤ 5, no mobile autoplay. Long reference content → accordion; linear process → stepper/progress, not tabs.

**D7 Buttons**: one primary per view; style hierarchy; destructive red but never default; icon-only only for standard icons + accessible name; Android create action on a list → extended FAB, iOS → trailing toolbar, flow completion → bottom full-width button.

**D8 Gestures**: every swipe/drag/pinch needs a tap alternative; swipe actions ≤ 2 and mirrored in a menu; long-press never the sole path.

**D9 Onboarding/permissions**: prefer no onboarding; 0-3 skippable screens; permission in context with a brief rationale.

**D10 Data**: 1 number → KPI; trend → line; category → bar; avoid pie/donut for quick reference; label directly; text summary + data table.

## 2. Buttons

- **One primary per view/area, differentiate by style not size.** M3 emphasis order: filled > tonal > elevated > outlined > text (text suits dialogs/cards; elevated only when separation from a busy background is needed). HIG: prominent for the most likely action, 1-2 per view; never give the primary role to a destructive action. Carbon: 5 variants (primary/secondary/tertiary/ghost/danger), one primary per page; Fluent: equal-importance actions all neutral. Rule: exactly 1 filled (the task-completing action); 1-2 secondary as tonal/outlined; the rest text/ghost; two truly equal actions get the same style. `[P-iOS][P-AND][C]`
- **Size/target**: ≥ 44pt (iOS) / 48dp (Android) hit area even if the visual is smaller. M3 Expressive button heights XS 32 / S 40 / M 56 / L 96 / XL 136 dp (padding S 16, M 24; icon-label gap 8; icon 20/24; Expressive-only trend). GOV.UK button is width 100% on mobile and auto from tablet up. Rule: if the primary action closes a form, sheet or checkout step on a compact screen → full-width (or width-filling pair) button ≥ 48dp tall pinned at the end of content or in a sticky footer. Inline buttons: auto width but ≥ 44/48 target. Stack secondary beneath, not beside, when labels > ~12 characters `[H]`.
- **Destructive**: red style but not default; confirm only uncommon irreversible actions; undo beats confirmation; "Are you sure? Yes/No" is wrong (see ux-writing.md). Dialog: title names the object ("Delete 3 photos?"), "Delete" (destructive) + "Cancel", initial focus on Cancel (APG: focus the least destructive action). Danger buttons cannot be icon-only (Carbon).
- **Disabled vs enabled**: HIG entering-data gates Next until required data exists; GOV.UK/Atlassian say avoid disabled buttons in forms (disabled hides why). Default: keep submit enabled, validate on submit/blur, focus the first error. Exception: a wizard "Next" may be disabled only with an adjacent visible hint of what's missing. On submit: swap to a progressive verb + inline spinner (HIG: "Checkout" → "Checking out…"), block repeat taps (not the whole screen), restore on error. `[C]`
- **Icon-only**: only home/print/magnifier are broadly understood (NN/g; >5 s to pick an icon means it's unclear). Allowed icon-only: search, share, close, back, add, settings, home, delete, edit, more + an accessible name + 44/48 target. Otherwise a visible label (tab bars, extended FAB, primary toolbar actions). Tooltips are not a touch solution. Don't mix text and symbol buttons in one toolbar group (HIG). `[R]`
- **FAB**: single most common positive creation action (convention, no controlled study). M3: FAB 56dp, medium 80 (most recommended), large 96; small 40 deprecated in Expressive; FAB menu 2-6 actions replaces speed dial; 16dp margin; shifts up when a snackbar shows; hides under bottom sheets. Android list/feed with one create action → extended FAB (label + icon), collapses on scroll, bottom padding so it never covers the last row. iOS → trailing toolbar prominent button. Forms/checkout → bottom full-width button (not FAB). 2+ equal create actions → FAB menu / "+" pull-down (max 6). Don't combine a FAB with a sticky bottom CTA. `[P-AND][H]`
- Top bar actions: Back/Close leading + title + ≤ 2 icon actions + optional overflow; modals: Cancel/Close leading, Done/Save trailing; never put the primary action in overflow. Small top app bar 64dp (flexible tokens) vs ~56dp classic (pick by M3 version).

## 3. Navigation components

- **Bottom bar/tab bar**: 3-5 destinations, icon + always-visible label, active = filled icon + label color + indicator (not color alone), badges only for actionable unread/critical, never hide or disable tabs. 2 top-level views → segmented/tabs; > 5 → 4 + "More" screen or restructure (do not shrink targets). Nav bar container 64dp (tall 80), indicator 56×32dp; Material M1: avoid < 3 or > 6, unsuitable for single-task/settings screens. NN/g's liquid-glass critique: cramped bar, shifting controls hurt predictability. Details in navigation.md.
- **Tabs vs segmented control vs chips**: Segmented = 2-5 closely related views/options of one object (iPhone ≤ 5; 5-7 on wide; equal widths; all text or all images; not top-level sections). Tabs = peer content sections with distinct content (1-2 word labels, no all-caps, strong active state, no stacked tab rows, never disabled; not for filtering identical content, sequential processes, or side-by-side comparison; Material: 48dp text / 72dp icon+text heights, 2dp indicator). Chips = filters/> 5 options/multi-select. Choosing a different top-level area is a bottom bar, not segmented. `[P-iOS][P-AND][R]`
- **Drawers/hamburger**: NN/g study (see navigation.md). Standard (permanent) drawers do not suit phones; modal drawer max 280dp wide, 16dp radius, scrim tap + Back + Esc dismiss, 48dp items; ≤ 5 destinations → bottom bar instead. If a hamburger is used label it "Menu" (NN/g: label beats icon alone). Fluent: warn if inputs would be lost on close.

## 4. Containers: cards, lists, menus

- **Cards vs lists vs plain sections**: cards fit heterogeneous browse content (feeds, dashboard modules, recommendations); homogeneous scannable items (contacts, orders, settings, transactions) are list rows; if you only need grouping use a section header + whitespace, no container. NN/g: don't replace lists to "modernize". Card rules: one primary tap (the whole card), ≤ 2 secondary actions as real buttons ≥ 44/48dp with their own focus, the rest in overflow, never nested cards, no nested links (Inclusive Components: link on the heading with a stretched `::after`, raise secondary controls above the overlay). Elevated 1dp / filled-outlined 0dp in M3; checkable via long-press; draggable cards need an accessibility delegate. `[R][C]`
- **Lists**: row = [leading icon/avatar/thumb] [headline + ≤ 2 supporting lines] [one trailing element: chevron | value | switch | checkbox | overflow]. Max 1 trailing control; whole row is one target; > 3 lines → use a card. M3: one/two/three-line rows 56/72/88dp; leading icon 24, avatar 40, image 56×56; padding 16, gap 12 (M1: 48/72/88, dense 40/60/76). Group with section headers (iOS grouped); dividers only for three-line rows or when spacing doesn't separate. HIG: succinct text, middle-ellipsis truncation, chevron = drill in, info button = reveal info (never navigation), persistent highlight in navigation lists vs checkmark in option lists, avoid an alphabetic index beside trailing controls. Truncate with ellipsis but give the full text in detail (never truncate price/status/time).
- **Swipe, reorder, selection**: every swipe action also in overflow/long-press/detail; ≤ 2 actions per side, destructive on the trailing edge with undo (not confirm); reorder = drag handle + "Move up/down" (WCAG 2.5.7); selection = long-press or a visible "Select" → checkboxes + count in the top bar + bulk-action bar; Back/X exits. (More in navigation.md and data-dense.md.)
- **Menus**: overflow/context/pull-down. HIG: ~5-6 items before splitting; submenu one level ≤ 5 items; ellipsis if more input follows; icons all-or-none per group; context menus hidden by default so mirror every item in visible UI, ≤ ~3 groups, destructive last in red, hide unavailable items; pull-down needs ≥ 3 items. > 6 commands → split by group or use a sheet. Long-press menus are accelerators only.
- **Chips**: assist / filter / input / suggestion; 32dp visual with a 48dp touch target, 8dp gap, single scrolling line (first chip partly cut to signal scroll), ≤ ~6 quick filters + a trailing "Filters" chip opening the full sheet; selected chips use checkmark + fill (not color alone). Baymard: applied filters as removable pills (66% of mobile sites don't), horizontal toolbars workable only for ~6-8 filter types.
- **Avatars**: circle = person, square = entity; list 40dp, compact 24-32, profile header 64-96; fallback 1-2 initials on a deterministic tonal color with ≥ 4.5:1 text; image alt = name (empty if the name is adjacent); hide decorative avatars from AT. (Size scale beyond list/search is memory.)
- **Badges**: dot = "something new" (6dp), number (16dp) = quantity; show only when > 0; cap at "99+" `[H convention]` (Material custom logic caps 999+); add accessible text ("3 unread"); never color alone; HIG: badges only for critical/unread (tab bars).
- **Tooltips on touch don't exist**: essential info must be visible; use a label, helper text or a tap-triggered popup tip/toggletip ("?"/"i" button opening a focusable, dismissible small popover/sheet). Long-press tooltips are an extra only.

## 5. Overlays

- **Dialogs/alerts**: only for critical info, a required decision, or an irreversible action; never at launch; never for info-only or common undoable actions; ≤ 3 buttons (HIG/Fluent/Spectrum/Carbon; M1 says ≤ 2); verb labels ("Delete", not "OK"); Cancel always available with destructive; title = question or statement of consequence, body only if it adds information; never open a dialog from a dialog; Android text buttons trailing; iOS system alert (preferred button trailing/top, Cancel leading/bottom). Button order: iOS and Android agree for horizontal rows (dismissive leading, affirmative trailing); the "reversed on Android" folk claim is unsupported (Windows is the outlier, memory). Full-screen dialogs for multi-field tasks (Material). Carbon modal types: passive, transactional, danger, acknowledgment, progress; Atlassian: not for complex interactions/large tables/long scroll, close button required, no nested modals, initial focus on close. Polaris: an inline warning beats an "Are you sure" dialog. `[P-iOS][P-AND][R]`
- **Action sheets (iOS)**: 2+ related choices after an intentional action; short title; Cancel at bottom if data could be lost; destructive at top; avoid scrolling; use instead of an alert for multiple choices. Android equivalent: modal bottom-sheet list or a dialog with ≤ 3 options. A pull-down destructive item confirms via an action sheet.
- **Bottom sheets**: for brief, contextual, partly-referencing tasks. Always: visible close/Done button, Back/Esc dismisses (modal sheets support predictive back), drag handle only as an accessory (≥ 48dp hit area, accessible resize actions: tap cycles states, double-tap hides under TalkBack), scrim tap closes a modal sheet only if no unsaved input (else confirm), one sheet at a time, content scrolls inside the sheet (scroll-to-expand at the edge; `overscroll-behavior: contain` on web), bottom padding = safe area + keyboard; when an input inside the sheet opens the keyboard expand to the full detent (our heuristic; no authoritative source). Use for: quick pick (≤ ~7 rows), share/actions, filters preview with result count, compact detail preview, non-modal map/music panels. Don't use for: multi-step flows, long forms (> ~3 fields), primary navigation, content users must read at length, anything needing deep link/back stack. NN/g: grab handles are overlooked and swipe is ambiguous with system gestures; swipe-down is a barrier for motor-impaired users. Baymard: 37% of overlays ignore Back. Material: standard (non-hideable by default) vs modal (scrim, hideable); max 640dp; 1dp elevation; handle 32×4 visual with 48 hit area (snippet). HIG: medium + large detents, grabber on resizable sheets, confirm if unsaved, Cancel leading / Done trailing / Back for steps; UIKit `largestUndimmedDetentIdentifier` gives a non-modal sheet. Spectrum: popovers become modals/trays on mobile. On large screens use dialogs/menus/side sheets instead. `[P-iOS][P-AND][R]`
- **Modal vs sheet vs full-screen vs pushed page vs inline** (decision D1): modal only with a clear benefit; HIG: avoid app-within-app hierarchies; dismiss one modal before presenting another; compact iPhone uses a sheet, not a popover; Carbon/Atlassian/MDC multi-step → full page/full-screen dialog; Baymard: perceived-new-state UI must map to Back.
- **Snackbar vs toast vs banner vs dialog vs inline**: see states-feedback.md section 14.

## 6. Feedback surfaces (summary)

Ladder, least to most interruptive (same order as states-feedback.md §12/§14): inline (persistent, near cause) → banner (persistent page-level) → snackbar/toast (transient, non-critical, one action, never the only record) → dialog (blocking). Snackbar numbers: M3 Compose 48dp (68dp two-line); Carbon toast ~5 s, Fluent ~7 s, Spectrum min 5 s (actionable never auto-dismisses; timer pauses on interaction), Fluent ≤ 1 CTA with link text ≤ 36 chars, ≤ 4 stacked. M1: snackbar ≤ 1 text action, never "Dismiss/Cancel", ≥ 2 actions → dialog. GOV.UK notification banner: people often miss banners; not for validation errors; place before h1.

## 7. Inputs and selection

- Text input: see forms.md. Select vs radio vs segmented vs combobox vs picker: D3. NN/g dropdown-list: dropdown sweet spot ~5-10; < 5 use radios; ~15+ combobox; USWDS radios < 7; Carbon < 3; M3 threshold ~6; mobile dropdown issues: accidental dismissal while scrolling, fat-finger, hidden defaults. GOV.UK select: last resort; radios: no preselect, inline only for binary. NN/g: preselect most cases; GOV.UK/Carbon: don't. Context: preselect only for safe defaults that apply immediately (settings); leave blank for questions/consents. HIG pickers: medium-long predictable lists; short → pull-down; very large → list with index; minute steps that divide 60.
- **Switch vs checkbox**: switch = immediate effect, no Save, label constant and names the feature; iOS switch only inside list rows. Checkbox = deferred submit, multi-select, consent, bulk select; never pre-checked. M3 switch track 52×32dp, handle 24/16/28, state layer 40; checkbox 18dp box. Carbon: toggles not for confirmation-needed actions or > 2 options; Atlassian: explain disabled toggles. A network failure on a switch → revert + error.
- **Sliders/steppers**: sliders are imprecise: pair with a value display and text input (Baymard: needs a text-field fallback, non-linear scale for skewed data, live results 250-500 ms); WCAG 2.5.7: tap alternative; 48dp thumb. Steppers for small increments with the value visible (HIG).
- **Dates**: see forms.md and D4.

## 8. Content patterns

- **Pagination vs infinite scroll vs load more**: Baymard mobile: load 15-30 items initially + "Load more" (all at once rather than lazy-loading on mobile); desktop reference 50-150, search results 25-75; > 90% of Load-more sites break Back position; 13% of sites reset the list on Back (use `history.pushState`). NN/g: infinite scroll suits goal-less browsing (social/news), hurts refinding, Back position, footers, performance, SEO, keyboard/AT. Smashing/Baymard: pagination → least browsing; infinite → 100+ items but shallow; Load more balances. GOV.UK pagination: search results/performance; not linear flows; mobile shows current + neighbours + first/last; page number in title. Rules: feed → infinite + restorable scroll + footer access via tab/menu; catalogue/search → Load more + preserved state; finite admin tables → pagination; always URL/state per batch.
- **Carousels**: NN/g: animated carousel content looked at ~27% of the time; ≤ 5 frames; controls inside, large; no auto-forward on mobile (3 words/s if auto-forwarded). Baymard: first slide matters most (Runyon 2013, not Baymard, one university site: 84% of feature clicks on slide 1, ~1% engaged); duplicate content elsewhere; 30% of mobile sites auto-rotate; 53% of apps use horizontal scroll areas so tall they hijack vertical scroll. Browse of many peer items → horizontal scroller with the next item peeking (~10-20% visible), no dots needed; hero promos → static or ≤ 3-5 manual slides with dots + prev/next buttons, no autoplay on mobile; > 10 pages → grid; fixed height ≤ ~40% viewport `[H]`; slide text as real text. HIG page controls ≤ ~10 dots. M3 carousel strategies: multi-browse, uncontained, hero, full-screen.
- **Accordions/progressive disclosure**: useful on mobile for long reference content (FAQs, specs, settings groups, filters); ≤ 2 disclosure levels; header = full-width tap target ≥ 44/48 with chevron and visible label; allow multiple open; first closed unless a single section; sticky header when content is long; Back = collapse (NN/g: expanded section scrolled to top feels like a new page); never hide what everyone needs (GOV.UK); never hide validation errors in collapsed sections (auto-expand).
- **Steppers/progress trackers**: only for linear multi-step tasks; label steps; allow Back; save progress. ≤ 3 steps → "Step 2 of 3" text + thin bar; 4-7 → labeled stepper (vertical on phone); conditional/unknown length → progress bar without numbers; one question per screen when high-stakes (GOV.UK).
- **Image galleries**: tap → full-screen viewer with visible close (X), pinch + double-tap zoom (+/- alternative), swipe between images, counter "3/12" (not dots when > 10), Back closes, preserve list position. Baymard: 80% of apps lack pinch-to-zoom.
- **Pull-to-refresh**: supplement to auto-sync; avoid in drawers/maps; show last-updated; add Refresh in overflow/toolbar for accessibility; web PWAs with custom PTR set `overscroll-behavior-y: contain`.

## 9. Onboarding, search, filters

- **Onboarding/permissions**: NN/g (70 users, 4 iOS apps): task success 91% (saw tutorial) vs 94% (skipped), perceived difficulty 4.92 vs 5.49 (7-pt), time 93.5 s vs 85.2 s: no benefit. Deck-of-cards tutorials discouraged. 0-3 optional value screens (each skippable, progress dots, "Skip" top-trailing) only if needed for personalization/setup; else land in the product with defaults + contextual coach marks (dismissible, once, near the target, re-findable in Help). HIG: don't re-show skipped tutorials; permissions during onboarding only if needed to function; no licensing screens; launch screen mirrors the first screen. Permission flow in forms.md/states-feedback.md.
- **Search**: visible field when search is a primary task (marketplace, library); icon opening a full-screen search view when secondary. Empty focus: recents (clearable) + popular; 4-8 suggestions on mobile (desktop ≤ 10), highlight the predicted remainder, show scope; keep the query on the results page (33% of mobile sites don't); show an explicit submit (90% of apps lack one, 27% of mobile sites); misspelling tolerance (28% skip it); category-scoped suggestions (72% of mobile sites lack them). Material search bar 56dp expands to a full-screen search view with history/suggestions/results. Results show count, filters and no-result recovery. `[R: Baymard, e-commerce]`
- **Filters/sort**: Filter button with active-count badge → full-height sheet with "Show N results" primary + "Clear all"; applied filters as removable chips above the list; sort = single-select sheet/menu with the current value shown; push history state per applied filter so Back steps through (27% of sites don't). Baymard essentials for e-commerce: 5 filters (price/rating/color/size/brand), 4 sorts (price/rating/best-selling/newest), OR logic within one filter type. Label "Filter"/"Refine", not a cryptic icon (NN/g). Full enterprise filter patterns: data-dense.md.

## 10. Data visualization basics

Chart only when comparison/trend/outlier insight is needed; otherwise show the number. Prefer position/length encodings (bar, line); label directly; essential values must not depend on touch/hover; provide text summary + data table. HIG charts: bars compare categories (zero baseline), lines show change over time, points show outliers/relations; titles/subtitles summarize the message; accessibility labels + audio graphs; don't require interaction to reveal critical data; enlarge hit targets, allow scrubbing; not color-only (add shape/pattern); maximize plot width on compact screens, short axis labels. NN/g dashboards: length and 2-D position decode best; skip pie/donut/treemap for quick reference; no 3D; color is reinforcement (~8% of men are color-blind). Carbon: direct labels over legends; data-table alternative; slices < 1° are unreachable; 14-color categorical sequence; no mobile-specific rules in its pages. WCAG 1.4.11: chart lines/segments need 3:1 against adjacent colors. W3C complex images: short alt + long description/data table. Heuristics `[H]` (no authoritative mobile thresholds): 1 number → KPI tile (+ delta + sparkline); trend → line (≤ 4 series) or bars for discrete periods (≤ ~12 on a 360dp-wide screen, else scroll or aggregate); category comparison → horizontal bar sorted; part-to-whole → stacked bar or ≤ 4-slice donut with direct labels; tap = tooltip pinned above the finger (not hover) with a large scrub target and values also in a list below; legend only if > 1 series, direct-label the last point; expose summary text ("Steps rose 12% this week") and a "View data" table. Chartability (50 heuristics) is a good audit list.

## 11. Evidence on visual noise: rounded cards, shadows, gradients, glass

Evidence supports **clear signifiers and low clutter**, not any specific radius/shadow/gradient rule. "Too many rounded cards/shadows/gradients" is mostly opinion. Measurable harms: weak signifiers (NN/g flat-UI study, 71 participants: +22% time, +25% fixations; flat works with low density, predictable layouts, high-contrast spaced targets); illegible text over images (Baymard: 21% of apps); translucency/glass legibility (NN/g critique of iOS 26 is expert review; HIG says Liquid Glass belongs to the control layer, clear variant needs ~35% dimming over bright media); irrelevant information competing with relevant (Nielsen #8); aesthetic-usability effect masks problems (observe behavior). Rules: one container level max (no card-in-card); ≤ 2 elevation levels per screen; no text directly on photos/gradients without a scrim or a 4.5:1 check at the worst pixel; borders or fill (not shadow only) for tappable surfaces if the layout is flat; spacing + dividers for homogeneous items; one radius token per component class; never "bigger radius = friendlier". Google's M3 Expressive research (46 studies, 18,000+ participants, "up to 4×" faster spotting; 87% preference among 18-24) is a vendor claim: scope = trend. `[R][T]`

## 12. Comparison tables

Overlay/container

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Modal dialog/alert | Forces decision; focus trap | Interrupts; overuse trains click-through | Irreversible/critical confirm, required info | Info-only, routine undoable actions, multi-step, long forms |
| Modal bottom sheet | Thumb reach, keeps context, quick pick | Hidden dismissal; drag-only fails a11y; stacks badly | Short pick lists, share/actions, filters, compact detail | Page flows, long content, primary nav, > ~3 inputs |
| Non-modal/standard sheet (detents) | Reference background stays usable | Gesture conflicts with scroll | Maps, media players, secondary panels | Content that must be read in full; small screens with keyboard |
| Full-screen modal | Focus for multi-step tasks; own Cancel/Save | "App within an app" if nested | Create/edit, media viewer, composition | Simple choices; drill-down (use push) |
| Pushed page | Back stack, deep links, shareable state | Heavier transition | Hierarchical detail, anything with identity/URL | Quick yes/no, transient pick |
| Inline expansion | Keeps context, no overlay | Hides content; disorients if scrolled | Secondary/optional detail, FAQs | Content everyone needs |
| Popover/menu | Light, anchored | Not at phone width (use a sheet); accidental dismiss | Command lists (≤ 6), anchored info on tablet | Warnings/critical info, long forms |

Feedback

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Snackbar/toast | Non-blocking, Undo | Auto-dismiss may be missed (WCAG 2.2.1); one at a time | Own-action result; Undo/Retry | Only copy of important info; > 1 action; errors needing a fix |
| Banner | Persistent, prominent | Pushes content; often missed; fatigue | System-wide persistent condition | Transient confirmations; validation errors |
| Dialog | Guarantees attention | Blocks | Irreversible decision | Non-actionable updates |
| Inline message | Adjacent to cause, persistent, accessible | Takes layout space | Field/section errors, form status | Cross-page events |

Tabs, segmented, chips, bottom nav

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Bottom nav/tab bar | Always visible, thumb reach | 3-5 only; keeps space | App-level destinations | > 5 destinations, single-task screens, in-page filtering |
| Top tabs | Peer sections, swipeable | Hidden tabs when scrolled; confusion with nav | 2-5 sibling views | Sequential steps, comparison, filtering the same list |
| Segmented control | Compact, obvious selection | ≤ 5; short labels | Switch view/mode of the same data | Top-level navigation, long labels |
| Chips | Many options, multi-select, scrollable | 32dp visuals; low discoverability | Filters, input entities, suggestions | Primary navigation; 2-3 exclusive modes |

Cards, list rows, table rows

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Card | Heterogeneous content, media, grouped actions | Space-hungry, hard to compare | Feeds, dashboards, recommendations | Homogeneous scan/compare; card-in-card |
| List row | Fast scan, dense, consistent positions | Less media emphasis | Settings, messages, orders, contacts | Rich media browsing |
| Grid tile | Image-first | Text-poor | Photos, products | Text-heavy items |
| Table row | Multi-attribute comparison, sorting | Poor at 360dp | Data-dense admin (tablet/desktop) | Phones unless condensed to 2-3 fields |

FAB vs bottom primary button vs top-bar action vs sticky CTA

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| FAB/extended FAB | High salience, thumb reach, Android convention | Covers content; no iOS convention; no study | Create on list/feed (Android) | Forms/checkout; multiple equal actions; with a sticky CTA |
| Bottom full-width button | Completes flow; big target | Takes vertical space; conflicts with keyboard | Form/checkout/sheet confirmation | Browse screens |
| Top-bar action | iOS standard (prominent Done) | Reach | Done/Save in modals; 1-2 actions | Frequent one-handed primary action |
| Sticky CTA bar | Always reachable on long pages | Obscures content; competes with bottom nav | Product page "Add to cart", long forms | Short screens; stacked with bottom nav without care |

Pagination vs infinite scroll vs load more

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Pagination | Landmarks, footer reachable, SEO, easy refinding | Slow; users browse less | Search results, finite records, keyboard/AT-heavy | Casual mobile browsing |
| Infinite scroll | Frictionless | Footer unreachable, lost Back position, shallow browsing | Social/news/video feeds | Finding/comparing items, search |
| Load more | User control; footer reachable | Extra tap | Catalogues, search, mobile lists (15-30/batch) | Endless feeds where a tap kills flow |

Select-like controls and date inputs: see section 1 (D3, D4) and forms.md.

## 13. Anti-patterns (problem → better)

Bottom sheet for a multi-step flow, long form or page navigation → full-screen modal or pushed page. Sheet closable only by drag/swipe → visible X/Done + Back. Stacked/nested sheets and dialogs → one overlay at a time. "Are you sure? Yes/No" on every delete → undo snackbar; specific destructive dialog only for irreversible. Alert with "OK" as the only meaningful action; alert at launch → inline message; verb buttons. Auto-dismissing toast as the only error notice → inline error/persistent banner + status role. Toasts with 2+ actions or "Dismiss" → dialog for 2+ actions. Disabled primary button with no explanation → enabled + specific validation. Tab bar > 5 items/More overflow/hidden tabs → 4 + More screen, restructure. Icon-only nav → icon + label. Hover tooltips as the only explanation → helper text/tap popover. Cards everywhere/card-in-card → lists, section headers, spacing. Whole-card link containing buttons → link on the heading + raised controls. Swipe-only actions → mirror in menu/detail. Auto-rotating mobile carousels → static or manual. Infinite scroll for search/catalog → Load more + `pushState`. Losing scroll/filters on Back → history entry per state. Long dropdown for few options; select for 2 options → radios/segmented. Slider alone for precise values → add field/stepper. Date picker only (no typing) for DOB → three numeric fields. Tutorial deck of 5 swipe screens; permissions at launch → contextual hints; just-in-time permission. Pre-permission screen with Cancel or a mimicked alert → one neutral "Continue". Text over images/glass without a scrim → scrim + contrast check; glass only on the control layer. Pie/donut with many slices; color-only encodings → sorted bar; direct labels; patterns. Charts needing hover/tap to see key numbers → show values by default. FAB with a sticky bottom CTA or FAB on forms → single primary-action pattern.

## 14. Numbers

44×44pt iOS hit region · 48dp Android target (chip 32dp visual) · WCAG 24 CSS px AA / 44 AAA · 44 px GOV.UK radio/checkbox target · M3 Expressive buttons 32/40/56/96/136dp · FAB 56 (medium 80, large 96, mini 40 legacy), 16dp margin, FAB menu 2-6 · nav bar 64dp (tall 80), indicator 56×32, 3-5 destinations · iOS tab bar ≤ 5, avoid More, single-word labels · segmented ≤ 5 (iPhone), 2-5 (M3) · tabs 48/72dp, indicator 2dp · top app bar small 64dp (flexible) / ~56dp (classic) · bottom app bar 80dp, ≤ 4 actions · search bar 56dp · list rows 56/72/88dp, avatar 40, icon 24, image 56, padding 16, gap 12 · toolbar ≤ 3 groups, 1 prominent action · menu ~5-6 items, submenu 1 level ≤ 5, pull-down ≥ 3, context ~3 groups · alerts ≤ 3 buttons · bottom sheet max 640dp, handle ≥ 48dp target, 1dp elevation · nav drawer max 280dp, radius 16dp · snackbar 48dp / 68dp two-line · toast: Carbon ~5 s, Fluent 7 s, Spectrum min 5 s · chip 32dp tall/48 target/8 gap · switch track 52×32, handle 24/16/28 · checkbox 18dp box, state layer 40 · badge dot 6dp, count 16dp · dropdown sweet spot 5-10 (< 5 radios, 15+ combobox) · page-control dots ≤ ~10 · carousel ≤ 5 frames, no mobile auto-forward · mobile list batch 15-30 + Load more · autocomplete 4-8 mobile suggestions · slider live update 250-500 ms · hidden vs combo (visible links + menu) nav use on mobile 57% vs 86% · tutorial vs skip n=70 · flat UI +22% time. iOS control sizes (nav bar 44pt, tab bar 49pt, switch 51×31pt) are memory and Liquid Glass may change them.

## 15. Evidence limits

m3.material.io guideline pages unreachable (list dividers, FAB menu, bottom-sheet handle size are snippets); Spectrum, Lightning, Fluent mobile and most Polaris pages not obtained; HIG navigation-bars, badging and refresh-control pages 404; no authoritative source for bottom-sheet + keyboard interplay, sticky CTA vs FAB evidence, selection mode on iOS, voice search, avatar initials rules, mobile chart label/series counts or the "99+" badge convention; Baymard data is e-commerce-specific; no controlled evidence exists for FAB, rounded corners, shadows or gradients; option-count thresholds are a synthesis.
