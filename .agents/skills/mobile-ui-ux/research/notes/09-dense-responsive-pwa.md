# Slice 09 — Data-dense/enterprise mobile UI, responsive/adaptive, PWA, foldables/tablets, desktop→mobile conversion

Research date: 2026-10-06. Researcher notes for synthesis author. Tags: VERIFIED (page fetched, text states it) / SNIPPET (search excerpt only) / MEMORY (training knowledge, not re-verified). Tiers T1 official, T2 research orgs, T3 mature-product/eng blogs, T4 community.
Session caveat: the shared WebSearch budget (200) ran out mid-session, so school/CRM/finance domain research relied on direct fetches only (see Gaps). SAP Fiori and Salesforce Lightning doc sites returned 403/empty shells to WebFetch; their claims are SNIPPET.

## Sources consulted (URL | tier | verified?)

| URL | Tier | Status |
|---|---|---|
| https://www.nngroup.com/articles/mobile-tables/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/data-tables/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/complex-application-design/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/progressive-disclosure/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/mobile-first-not-mobile-only/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/mobile-ux/ | T2 | VERIFIED (numbers dated) |
| https://www.nngroup.com/articles/tooltip-guidelines/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/wizards/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/mobile-faceted-search/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/infinite-scrolling-tips/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/dashboards-preattentive/ | T2 | VERIFIED |
| https://www.nngroup.com/videos/bulk-actions-design-guidelines/ | T2 | VERIFIED (summary page only) |
| https://baymard.com/blog/how-to-design-applied-filters | T2 | VERIFIED |
| https://baymard.com/blog/ecommerce-filter-ui | T2 | VERIFIED |
| https://baymard.com/blog/number-of-items-loaded-by-default | T2 | VERIFIED |
| https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/ | T3 (cites Baymard, 2016) | VERIFIED (dated) |
| https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html | T2 (practitioner) | VERIFIED |
| https://adrianroselli.com/2018/02/tables-css-display-properties-and-aria.html | T2 | VERIFIED (has 2020/2023 updates) |
| https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part1/ | T3 | VERIFIED |
| https://www.smashingmagazine.com/2019/01/table-design-patterns-web/ | T3 | VERIFIED |
| https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables/ | T3 | VERIFIED |
| https://www.pencilandpaper.io/articles/ux-pattern-analysis-mobile-filters | T3 | VERIFIED |
| https://smart-interface-design-patterns.com/articles/filtering-ux/ | T3 | VERIFIED |
| https://carbondesignsystem.com/components/data-table/usage/ | T1 (DS) | VERIFIED |
| https://carbondesignsystem.com/patterns/filtering/ | T1 (DS) | VERIFIED |
| https://carbondesignsystem.com/patterns/status-indicator-pattern/ | T1 (DS) | VERIFIED |
| https://carbondesignsystem.com/data-visualization/dashboards/ | T1 (DS) | VERIFIED (no mobile guidance in page) |
| https://carbondesignsystem.com/data-visualization/chart-anatomy/ | T1 (DS) | VERIFIED |
| https://carbondesignsystem.com/elements/2x-grid/overview/ | T1 (DS) | VERIFIED |
| https://shopify.dev/docs/api/app-home/patterns/compositions/index-table | T1 (DS) | VERIFIED (Polaris site now redirects here) |
| https://atlassian.design/components/dynamic-table/usage | T1 (DS) | VERIFIED |
| https://atlassian.design/components/lozenge/usage | T1 (DS) | VERIFIED |
| https://design.gitlab.com/components/table | T1 (DS) | VERIFIED |
| https://primer.style/product/components/data-table/ | T1 (DS) | VERIFIED |
| https://designsystem.digital.gov/components/table/ (USWDS) | T1 (DS) | VERIFIED |
| https://raw.githubusercontent.com/material-components/material-components-web/master/packages/mdc-data-table/README.md | T1 (legacy M2) | VERIFIED |
| https://raw.githubusercontent.com/material-components/material-components-web/master/packages/mdc-layout-grid/README.md | T1 (legacy M2) | VERIFIED |
| https://design-system.service.gov.uk/patterns/question-pages/ ; /patterns/complete-multiple-tasks/ | T1 (gov DS) | VERIFIED |
| https://fluent2.microsoft.design/layout | T1 (DS) | VERIFIED |
| https://learn.microsoft.com/en-us/windows/apps/design/layout/screen-sizes-and-breakpoints-for-responsive-design ; .../responsive-design | T1 | VERIFIED |
| https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/create-responsive-layout | T1 | VERIFIED |
| SAP Fiori pop-in / FCL / OVP pages (sap.com/design-system/fiori-design-web/...) | T1 | SNIPPET only (403 to fetch) |
| Lightning Design System data table + lightning-datatable (salesforce docs) | T1 | SNIPPET only (shell/403) |
| m3.material.io (data tables, window size classes, spacing) | T1 | UNFETCHABLE (404/empty shell) |
| https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/layouts/adaptive/support-different-display-sizes | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts ; /list-detail | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/layouts/adaptive/foldables/make-your-app-fold-aware ; /learn-about-foldables | T1 | VERIFIED |
| https://developer.android.com/docs/quality-guidelines/large-screen-app-quality | T1 | VERIFIED |
| https://developer.android.com/about/versions/16/behavior-changes-16 | T1 | VERIFIED |
| https://developer.android.com/develop/ui/views/layout/support-multi-window-mode | T1 | VERIFIED |
| https://developer.android.com/design/ui/mobile/guides/layout-and-content/{layout-basics,adapt-layout,grids-and-units,common-layouts} | T1 | VERIFIED |
| https://developer.android.com/codelabs/adaptive-material-guidance | T1 | VERIFIED |
| https://developer.android.com/develop/ui/views/components/menus (contextual action mode) | T1 | VERIFIED |
| https://developer.android.com/develop/ui/views/layout/webapps/webview ; Chrome TWA overview | T1 | VERIFIED (TWA page looks stale) |
| Apple HIG JSON: layout, multitasking, windows, designing-for-ipados, split-views, sidebars, tab-bars, sheets, modality, toolbars, menus, context-menus, drag-and-drop, lists-and-tables, searching, segmented-controls, charts, charting-data, typography, accessibility | T1 | VERIFIED (developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json) |
| https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ | T1 | VERIFIED |
| https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ (7-day cap) | T1 | VERIFIED (2020 text) |
| https://webkit.org/blog/16535/meet-declarative-web-push/ | T1 | VERIFIED |
| https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ | T1 | VERIFIED |
| https://webkit.org/blog/7929/designing-websites-for-iphone-x/ | T1 | VERIFIED |
| https://mjtsai.com/blog/2025/10/03/web-apps-in-ios-26/ | T4 | VERIFIED (commentary) |
| https://developer.apple.com/forums/thread/800798 (iOS 26 fixed content) | T4 | VERIFIED (single report, no Apple reply) |
| https://developer.apple.com/library/archive/.../ConfiguringWebApplications.html | T1 (archived) | VERIFIED |
| https://web.dev/articles/install-criteria ; /promote-install ; /customize-install ; /add-manifest ; /maskable-icon ; /pwa-checklist ; /offline-cookbook ; /service-worker-lifecycle ; /responsive-web-design-basics ; /blog/viewport-units ; /content-visibility ; /virtualize-long-lists-react-window | T1 | VERIFIED |
| https://developer.chrome.com/docs/workbox/handling-service-worker-updates ; /managing-fallback-responses | T1 | VERIFIED |
| https://developer.chrome.com/blog/viewport-segments-api-shipped ; /blog/viewport-resize-behavior | T1 | VERIFIED |
| MDN: env(), viewport meta, display-mode, manifest + share_target + orientation, Making PWAs installable, any-pointer, container queries, clamp, overscroll-behavior, touch-action, theme-color, Web Share, Badging, Background Sync, capture, font-variant-numeric, Intl.NumberFormat, device-posture, user-select, -webkit-tap-highlight-color, Visual Viewport | T1 | VERIFIED |
| W3C WCAG 2.2 Understanding: 1.4.1, 1.4.4, 1.4.8, 1.4.10, 1.4.13, 1.3.4, 2.5.1, 2.5.7, 2.5.8; WAI complex-images tutorial | T1 | VERIFIED |
| https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials ; developer.chrome.com/docs/lighthouse/seo/font-size | T1 | VERIFIED |
| https://blog.master.dev/the-pitfalls-of-in-app-browsers/ | T3 | VERIFIED |
| https://design.google/library/offline-design | T1 | VERIFIED |
| https://blog.logrocket.com/container-queries-2026/ | T4 | VERIFIED |
| Search-result-only: Instagram localStorage wipe (dev.to), Google disallowed_useragent/"wv" (Auth0 blog), EU PWA episode (several), Capacitor edge-to-edge (Ionic forum), Baymard/NN/g aggregator summaries, container-query Baseline dates (web.dev/baseline) | T3/T4 | SNIPPET |

---

## Findings

### PART A — Data-dense / enterprise mobile patterns

### F1 Decide simplify vs reflow by task analysis, then pick the table transform from the data's job
- Claim: There is no single "responsive table". Pick by what mobile users do with the data: compare across rows/columns (keep tabular, scroll), read one record at a time (stack/cards), scan one key field then drill in (key columns + expand/pop-in), or only look things up (filter/search + detail). NN/g's own list is smaller than the folk list: sticky header row, sticky left column, user filtering of rows/columns, accordion grouping, scroll cues.
- Evidence: NN/g Mobile Tables — T2 — VERIFIED — recommends sticky headers, frozen left column, in-view/pre-view filtering, accordion grouping; cells must be legible without zoom (~2 columns for complex entries; numeric tables can be narrower); use arrows/cut-off elements (not dots) to signal horizontal overflow; avoid forcing landscape unless the gain is substantial.
- Evidence: GitLab Pajamas Table — T1 — VERIFIED — two options: keep tabular + horizontal scroll when row comparison matters, or stack each row into key/value groups below a breakpoint; stacking is driven by container queries (nearest ancestor, not window); sort icons hidden when stacked.
- Evidence: USWDS Table — T1 — VERIFIED — three stacked variants via `data-label`; scrollable container needs tabindex=0; tables not for non-tabular data.
- Evidence: SAP Fiori responsive table — T1 — SNIPPET — on phones keep only 1-2 columns in the row; other columns move to a "pop-in" area under the row as label/value pairs (`minScreenWidth`, `demandPopin`); Salesforce LDS (SNIPPET): data tables not optimized for mobile, use stacked cards/lists; `lightning-datatable` reportedly unsupported on mobile.
- Corroboration / conflict: search-snippet summary (T4, SNIPPET) says card transform "falls apart past a few dozen records" — plausible but unsourced. Roselli/Smashing prefer scroll-container for complex tables because it keeps semantics (F2). NN/g mobile-ux: content that fits one desktop screen can need ~5 phone screens — so cut, don't just stack.
- Scope: universal (Web emphasis on semantics).
- Context (when it flips): comparing many numeric columns (finance, grades) -> scroll with sticky identifier column; records read individually (directory, tickets, invoices) -> card/stack; wide master tables used by managers on tablets -> keep table at medium+ width.
- Agent rule: IF a screen has a table THEN (1) list the mobile tasks (look-up, approve, compare, edit); (2) if look-up/approve -> render as card/list row with 1 title + 1 status + 1-2 key values and tap-through detail; (3) if compare -> horizontal scroll with sticky first column + sticky header + visible overflow cue; (4) if >~6 columns of secondary data -> pop-in/expand row or column chooser; (5) never shrink to fit 8-10 columns.
- Stack notes: CSS container queries on the table wrapper (Pajamas model); Flutter `DataTable` in `SingleChildScrollView` x2 + `Table` pinned column via `TableView`/`two_dimensional_scrollables`; Compose `LazyColumn` of cards + `LazyRow` for scroll mode (MEMORY).

### F2 Preserve table semantics when reflowing — scroll container is the safest default
- Claim: Applying `display:block/flex/grid` to table elements historically stripped table roles for screen readers. Chromium fixed this (Chrome 80, Feb 2020 for flex/grid/inline-block; fully by Oct 2023), Firefox fixed block (Jan 2019; remaining gap `display: contents`), Safari fixed only in Safari 17 (Oct 2023). ARIA table roles can restore semantics but become fragile when headers/cells are hidden or discarded; ARIA has no equivalent of the HTML `headers` attribute.
- Evidence: Roselli 2018 (with updates) — T2 — VERIFIED; Roselli 2020 — T2 — VERIFIED — recommends wrapper `role="region"` + `aria-labelledby` + `tabindex="0"` + `overflow:auto` around a native `<table>`, with a visible focus ring (>=3:1 contrast); Smashing 2022 — T3 — VERIFIED — same ranking: scroll container with sticky headers is best for complex tables; avoid pure block stacking without ARIA role restoration (uses `role="group"` on the wrapper; Roselli uses `region` — either is acceptable, name it).
- Evidence: WCAG 1.4.10 Reflow — T1 — VERIFIED — data tables are an excepted content type (2-D scroll allowed in their own container), but table headings, search, pagination and toolbars next to the table are NOT excepted and must reflow.
- Corroboration / conflict: USWDS and Pajamas ship stacked tables anyway using `data-label`/key-value groups; they accept the semantic trade-off for simple tables. Consensus: stack only simple tables (<= ~5 cols, one header row); anything with spans/multi-level headers -> scroll.
- Scope: Web (native apps get semantics from list/grid components).
- Agent rule: IF reflowing a real `<table>` with CSS display overrides THEN re-apply `role=table/row/columnheader/cell` explicitly and test with VoiceOver on Safari; OR render a separate card list (`<ul>`) for mobile and keep the table for >= medium width (do not render both visibly; hide the unused one with `display:none`, which removes it from the a11y tree). Wrap scrollable tables in a labelled, focusable region; keep toolbars/pagination outside the scroll area.

### F3 Horizontal scroll needs a sticky identifier column, sticky header and a visible overflow cue
- Claim: Scroll mode works only if the row identity stays visible and users can tell more columns exist.
- Evidence: NN/g Mobile Tables — T2 — VERIFIED (sticky left column; arrows or cut-off content signal overflow; sticky header prevents losing context). NN/g Data Tables — T2 — VERIFIED — freeze header rows and header columns if the table exceeds the screen; first column should be a human-readable name, not an ID. P&P — T3 — VERIFIED — freeze leftmost (optionally rightmost) columns; allow reorder/hide/resize; persist preferences.
- Scope: universal. Context: a partially visible next column (clipped by ~20-30% of its width) is the cheapest affordance; add edge fade/shadow as reinforcement (SNIPPET T4 only for the shadow detail).
- Agent rule: IF a table scrolls horizontally THEN freeze column 1 (record name) and header row, ensure the 2nd column is clipped at the right edge at load, and add a "Columns" chooser if >8 columns.

### F4 Cards: label/value pairs, numerics right-aligned within the value cell
- Claim: In a card/stack row, the *label* carries what the column header did; values stay scannable if numeric values are right-aligned and use tabular figures. Desktop rules (right-align numerics, header alignment matches column, left-align text) are consensus.
- Evidence: P&P enterprise tables — T3 — VERIFIED (right-align numbers; qualitative numbers such as phone/zip/dates may stay left; headers match alignment; monospace/tabular figures prevent "$1,111.11 looks smaller than $999.99"); Primer — T1 — VERIFIED (right-align reserved for numerics); MDN `font-variant-numeric: tabular-nums` — T1 — VERIFIED (Baseline widely available since Jan 2020); SAP pop-in — SNIPPET (label above or beside value, configurable).
- Agent rule: IF showing money/quantities in lists THEN `font-variant-numeric: tabular-nums` (or platform tabular-digit variant), right-align amounts in a fixed trailing column, keep currency symbol/code consistent, and keep the label visible (not icon-only).

### F5 Density and target size: comfortable on touch, compact only with a fine pointer
- Claim: Dense row heights from desktop systems (24/32/40px) are below touch minimums; offer density as a user/device-aware setting, default comfortable on coarse pointers.
- Evidence: Carbon — T1 — VERIFIED — row sizes xs 24, sm 32, md 40 (default), lg 48, xl 64 px; header row must match row size. P&P — T3 — VERIFIED — condensed 40 / regular 48 / relaxed 56 px. Primer — T1 — VERIFIED — condensed/normal/spacious. Pajamas — T1 — VERIFIED — basic/striped/condensed (condensed halves cell padding; meant for text-only logs). Apple HIG Accessibility — T1 — VERIFIED — iOS/iPadOS control 44x44pt default, 28x28pt minimum; ~12pt padding around bezeled controls, ~24pt around bezel-less; text 17pt default, 11pt min (typography page says min 11pt; accessibility page says 11-12). WCAG 2.5.8 — T1 — VERIFIED — 24x24 CSS px minimum with spacing exception. Fluent 2 — T1 — VERIFIED — touch targets 44x44 iOS/Web, 48x48 Android. Lighthouse — T1 — VERIFIED — text < 12px counts as illegible; fails if >= 40% of text is below 12px.
- Corroboration / conflict: numbers differ by system (24px WCAG floor; 44pt Apple; 48dp Android/Material). Apply: WCAG 24 = legal floor on web; 44-48 = design target on touch.
- Scope: universal.
- Agent rule: IF `(pointer: coarse)` or native mobile THEN row min-height >= 44pt/48dp and checkbox/control hit area >= 44x44 (visual glyph may be smaller); body/secondary text >= 12px (never <11pt iOS); allow Dynamic Type/system font scaling to grow rows (rows must grow, not clip). IF `(any-pointer: fine) and (hover: hover)` AND width >= medium THEN offer a density toggle (compact 40 / regular 48 / relaxed 56) and persist it.

### F6 Selection mode & bulk actions: explicit mode, count, select-all, contextual bar, undo
- Claim: Consensus across NN/g, Carbon, Android, Apple, Shopify: selecting enters a batch mode; a contextual bar shows count + actions; row-level actions are suppressed in batch mode; users can select all; destructive batch actions need feedback/undo.
- Evidence: NN/g Bulk actions (video summary) — T2 — VERIFIED — three guidelines: provide Select All, use a contextual action bar, give clear feedback with undo. Carbon — T1 — VERIFIED — batch action bar appears at table top; exit via Cancel or deselecting all; when batch mode is active, row action icons/overflow menus are disabled; multi-select = checkboxes. Android Views menus doc — T1 — VERIFIED — contextual action mode starts by touch-and-hold or checkbox, user can keep selecting; ends on deselect-all, Back, or "Done"; the bar visually replaces the app bar. Apple HIG lists-and-tables — T1 — VERIFIED — on iOS/iPadOS people must enter edit mode before selecting table items. Shopify index-table composition — T1 — VERIFIED — bulk bar replaces filters when rows are selected; indeterminate header checkbox for partial selection; "select all" option across the current view; clicking a row delegates to the checkbox.
- Corroboration / conflict: long-press as the only entry is undiscoverable (Apple context-menu page: context menus are hidden by default; always provide commands elsewhere). Material/Android uses long-press; Apple requires an explicit Edit/Select button. Resolve: do both.
- Scope: universal.
- Agent rule: IF a list supports multi-item actions THEN (a) visible "Select" affordance AND long-press shortcut; (b) in selection mode replace top bar with "N selected" + close + <=3 actions + overflow; (c) "Select all" (state whether it means loaded items or all matches); (d) disable row tap-through and per-row menus; (e) after destructive action show snackbar with Undo; (f) selection survives scroll and filter changes or says it was cleared.
- Stack notes: Compose `Modifier.combinedClickable` + TopAppBar swap; SwiftUI `List(selection:)` + `EditButton`/`.toolbar`; CSS: `aria-selected`/checkbox + live region announcing "3 selected".

### F7 Mobile filtering: own layer, batch apply with live count, visible applied-state, sticky entry point
- Claim: Filters live in a separate layer (bottom sheet or full-screen), the trigger stays reachable, applied filters are summarised outside the layer with per-item removal and "Clear all", and apply is batched with a result-count CTA unless updates are silent and instant.
- Evidence: Baymard (ecommerce-filter-ui) — T2 — VERIFIED — full-screen or bottom-sheet drawer on mobile; explicit "Show X results" apply button because live updates cause disorienting refreshes; CTA count updates as selections change; "Filter & Sort" trigger stays visible while scrolling; generous tap targets. Baymard (applied filters) — T2 — VERIFIED — 28% of benchmarked sites show no applied-filters overview; on mobile use a horizontally scrolling chip row with truncation/fade/count cues or stacked rows that don't push results too far down; individual "x" + "Clear all". NN/g Mobile faceted search — T2 — VERIFIED — prefer an overlay tray with results visible behind and a live result count so users can see effects (avoid pogo-sticking); label the entry "Filter"/"Refine". P&P mobile filters — T3 — VERIFIED — batch fetch recommended; live filtering not recommended unless silent; sticky Apply; use native pickers; do not mirror all desktop filters; save presets; in enterprise "no results" is legitimate, so empty states must be accurate. Carbon — T1 — VERIFIED — batch for multi-category or slow data, instant for single-category; closed flyout must show at least the count of applied filters; per-category and global clear. Smart Interface Design Patterns — T3 — VERIFIED — sticky Apply with count on the button; accordions inside the layer; applied filters above results to avoid layout shift.
- Corroboration / conflict: NN/g (live, results visible behind a partial tray) vs Baymard/P&P (batch with count). Both converge on "user always sees what a change will do" (count on CTA or results behind tray). Flip: fast local filtering on small lists (<~200 rows already on-device) -> instant apply is fine.
- Scope: universal (NN/g and Baymard evidence is e-commerce; enterprise adds saved views).
- Agent rule: IF filters > 2 categories THEN "Filters (n)" button in a sticky bar -> bottom sheet (medium detent) or full-screen for >5 groups; accordion groups; sticky footer "Show 128 results" + "Reset"; after apply, show chip row (scrollable, each removable, "Clear all"); the closed state always shows applied-count. IF enterprise THEN offer saved views/presets and exact empty state ("0 students match: Grade 7 + Absent today").

### F8 Sorting and search in data apps
- Claim: Sorting on mobile belongs in a single "Sort" control (sheet/popover with sort-by and order), not per-column header icons; global search has one clearly scoped home.
- Evidence: Shopify index-table composition — T1 — VERIFIED — Sort button opens a popover with "Sort by" and "Order by" choice lists; Pajamas — T1 — VERIFIED — sort icons hidden in stacked/responsive tables; nulls last in either direction; Apple HIG searching — T1 — VERIFIED — one clearly identified search location, always show scope (placeholder, scope bar/tokens), predictive suggestions, recent searches shown before typing with a way to clear them, optional attribute filters.
- Agent rule: IF a list is sortable THEN a "Sort: Due date" chip/button (state shown) opens a sheet; default sort stated in UI; keep header-click sorting only at >= medium width.

### F9 Pagination vs infinite scroll vs "Load more" in data apps (plus virtualization)
- Claim: Match the pattern to task: browsing homogeneous feeds -> infinite; goal-directed lookup/compare/admin -> "Load more" or pagination; on phones load 15-30 items per chunk. Always preserve position on Back.
- Evidence: Baymard (number-of-items) — T2 — VERIFIED — mobile: load 15-30 products at once (2-4 visible per viewport; fatigue sooner than desktop); desktop 50-150 depending on product type; "Load more" performs best. Smashing 2016 summarising Baymard — T3 — VERIFIED (dated) — pagination => users view far fewer items; infinite => 100+ items viewed but shallow attention; "Load more" balances; infinite pushes footer out of reach; use `history.pushState` for Back. NN/g Infinite scrolling — T2 — VERIFIED — use only for no-goal browsing; avoid when finding something specific, comparing distant items, or needing the footer; back-button position loss is the key failure; Load More or integrated pagination are hybrids. Admin dashboards -> pagination (T4 search snippet only).
- Corroboration / conflict: Smashing 2016 advises avoiding lazy-loading on mobile because of touch scroll-event limits — dated; Baymard's current blog recommends Load More + lazy-loading. IntersectionObserver is now the norm (MEMORY).
- Evidence (perf): web.dev virtualization — T1 — VERIFIED — render only the visible window; no DOM-size threshold given; measure with DevTools. web.dev content-visibility — T1 — VERIFIED — `content-visibility:auto` + `contain-intrinsic-size`, 232ms -> 30ms in the demo; offscreen content stays in the a11y tree and in-page search; Baseline Newly available Sept 2025 (Chrome/Edge 85, Firefox 125, Safari 18).
- Agent rule: IF list > ~100 rows THEN virtualize (or `content-visibility:auto` for simple static lists) AND keep a11y: expose total count (`aria-rowcount`/`aria-setsize`+`aria-posinset`, MEMORY) and keep search/filter server-side. IF goal-directed admin list THEN "Load more" (25-50) with count "Showing 50 of 1,240"; restore scroll + loaded pages on Back (store cursor/scrollY in history state/router cache).

### F10 Inline editing: avoid cell-level editing on phones; tap-to-edit in a sheet or detail screen
- Claim: Desktop systems favour inline cell edit or side panels; for phones, route edits through a focused sheet/screen with proper inputs and a Save/Cancel pair.
- Evidence: Atlassian Dynamic Table — T1 — VERIFIED — for complex multi-content tables prefer "more actions" menus that open modals rather than inline inputs; row-specific button labels ("Edit component 3"). NN/g Data tables — T2 — VERIFIED — single-record editing: non-modal side panels beat modals that obscure the data. P&P — T3 — VERIFIED — inline cell edit keeps context (desktop). Apple HIG sheets/modality — T1 — VERIFIED — use sheets for focused, narrowly scoped tasks; one sheet at a time; swipe-down dismissal needs unsaved-changes confirmation; medium detent for light tasks, large/full-screen for long forms.
- Scope: universal; the mobile conclusion is inference from these (opinion-level but consistent).
- Agent rule: IF a desktop grid has editable cells THEN on compact: tap row -> detail; "Edit" -> one field per sheet for single-field fixes (status, qty, date) or full form for multi-field; show optimistic update + Undo; for bulk edits (e.g., attendance) use dedicated toggles on the row, not free text.

### F11 Number/date formatting, signs and color
- Claim: Use locale-aware formatters; show sign/parentheses/icon in addition to color; keep exact values on detail screens when using compact notation.
- Evidence: MDN Intl.NumberFormat — T1 — VERIFIED — `currencySign:"accounting"` parenthesises negatives; `signDisplay` auto/always/exceptZero/negative/never; `notation:"compact"` -> "$1.5M"; `currencyDisplay` symbol/code/narrowSymbol/name. WCAG 1.4.1 — T1 — VERIFIED — color must not be the only means (green/red alone fails). Carbon status pattern — T1 — VERIFIED — pair color with icon/shape/text.
- Agent rule: IF showing money THEN `Intl.NumberFormat(locale,{style:'currency',currency,signDisplay:'exceptZero'})` (or accounting for ledgers); red/green is decoration only — also "-" or parentheses plus "Credit/Debit" or arrows; group transaction lists by day with day totals; separate "Pending" and "Posted" (MEMORY, banking convention, see F20).

### F12 Status badges
- Claim: A status must read without color, truncation, or hover.
- Evidence: Carbon status-indicator — T1 — VERIFIED — at least two of icon/shape/color/text; 3 attention levels (high/medium/low); 3:1 contrast; test in grayscale; icons left-aligned with text in tables. Atlassian Lozenge — T1 — VERIFIED — labels short, sentence case; 200px max width then truncates; lozenges are not focusable so truncated text is lost — keep short; reserve for important states, use tags for metadata. GOV.UK task list — T1 — VERIFIED — start with few statuses (completed/in progress/not started/cannot start/problem), each added status is harder to remember; reserve red for errors only.
- Agent rule: IF a row shows state THEN pill = icon + short text (<= ~16 chars) + semantic color; <= 5 distinct statuses per object type; same status vocabulary in list, detail and filters.

### F13 Hover-only controls fail on touch
- Evidence: NN/g tooltips — T2 — VERIFIED — tooltips don't exist on touchscreens; use tap-triggered popup tips from a "?" or "i" icon. Primer table — T1 — VERIFIED — row actions must stay visible, not appear on hover. Carbon table — T1 — VERIFIED — overflow menus persist when the UA lacks hover. web.dev PWA checklist — T1 — VERIFIED — activate on click/tap not just mouseover; support mouse, keyboard, stylus, touch. WCAG 1.4.13 — T1 — VERIFIED — hover/focus content must be dismissible, hoverable, persistent (page doesn't address touch). HIG context menus — T1 — VERIFIED — hidden by default, always provide the commands elsewhere.
- Agent rule: IF an affordance appears only on `:hover` THEN make it visible by default under `(hover: none)` or `(pointer: coarse)` (always-visible overflow "..." button), and replace tooltip help with tap-to-open help text or inline hint.

### F14 KPI tiles, dashboards, charts on mobile
- Claim: Mobile dashboards are "attention-first": ordered by importance, few headline numbers, charts simplified, detail on drill-down; the evidence for a specific "1-3 metrics" count is weak.
- Evidence: NN/g Dashboards — T2 — VERIFIED — at-a-glance single-view for quick decisions; length/2-D position encode quantity best (bars, lines); avoid pies, gauges, donuts for magnitude; color is secondary (up to ~8% of males are color-blind). Carbon dashboards — T1 — VERIFIED — put highest-priority metrics at the top; limit metrics; consistent colors/legend position; the page gives NO mobile or accessibility guidance. Apple HIG charts — T1 — VERIFIED — keep charts simple; reveal detail gradually; maximize plot width in compact layouts, short y-axis labels, put units in the title, optionally place long labels inside the plot; don't hide critical information behind interaction; expand hit targets for small marks; Audio Graphs for VoiceOver; accessibility labels with actual values ("60 minutes", not "rapid increase"); never rely on color alone. Carbon chart anatomy — T1 — VERIFIED — prefer direct labels to long legends; tooltips are hover-based; they admit a missing keyboard/data-table alternative for tiny slices. W3C WAI complex images — T1 — VERIFIED — provide short description + long description (adjacent text or data table in figure/figcaption). SAP Fiori Overview Page — T1 — SNIPPET — role/domain-based cards on one page. "Limit to 4-5 KPIs per view" — T4 — SNIPPET (vendor blogs: Sigma, Toucan, Querio) — treat as heuristic, not rule.
- Corroboration / conflict: none found for "1-3 headline metrics"; consensus is only "few". Brief asked for 1-3: record as opinion/heuristic.
- Scope: universal.
- Agent rule: IF building a mobile dashboard THEN (1) top block = "Needs attention" (counts of overdue/pending approvals/alerts, each tappable to a pre-filtered list); (2) then 3-5 KPI tiles (value + delta + period + optional sparkline; status icon + text); (3) then 1 primary chart per card, bar/line only, direct labels, tap-to-show-value with a persistent readout line (not hover tooltip); (4) "View table" toggle (accessible data-table fallback) on every chart; (5) filters (period/campus/class) in one sheet; (6) role-based default layout; no pies/gauges for magnitude.
- Stack notes: SwiftUI Swift Charts `accessibilityLabel`/audio graphs; Compose Canvas charts need `semantics { contentDescription }` + table fallback; web SVG `role="img"` + `<table>` sibling.

### F15 Enterprise forms and field-use flows
- Claim: Long forms become step/section flows with visible progress and resumability; use device capabilities instead of typing.
- Evidence: GOV.UK question pages — T1 — VERIFIED — one thing per page; progress indicators "do not scale well on small screens" so test without them first; back link on every page; never ask for data already known; "(optional)" instead of asterisks; avoid sliders (or give non-drag alternatives). GOV.UK task list — T1 — VERIFIED — for long multi-session transactions; user-controlled "completed?" prompt; always allow revisiting. NN/g progressive disclosure — T2 — VERIFIED — prioritize by task analysis and frequency; <= 2 disclosure levels. NN/g wizards — T2 — VERIFIED — for novices/infrequent tasks; show step list with current position; allow exit and resume; steps self-sufficient. NN/g mobile-ux — T2 — VERIFIED — typing is costly; use camera/GPS; save state and let users save state. MDN `capture` — T1 — VERIFIED — `<input type=file accept="image/*" capture="environment">` opens the rear camera on mobile; hint only; not Baseline.
- Agent rule: IF a form has > ~7 fields or mixed concerns THEN split into sections (accordion for review, steps for first-time) with autosave draft; IF receipts/ID/documents THEN camera capture + upload progress + retry; IF multi-session (HR onboarding) THEN task-list page with per-section status.

### F16 Offline / field use and sync status
- Evidence: Google Design Offline — T1 — VERIFIED — show offline-pin icon + word when content available offline; cloud-off + "no internet" when unavailable; show file size before downloads; progress with pause/cancel; make offline content discoverable (dedicated tab/button); snackbar on reconnect when queued work completes. web.dev PWA checklist — T1 — VERIFIED — custom offline page precached at SW install; IndexedDB for data; background sync for deferred actions. MDN Background Sync — T1 — VERIFIED — Chromium-only, not Baseline. web.dev offline cookbook — T1 — VERIFIED — cache-first for shell, network-first/SWR for data; app-shell vs data split.
- Scope: Web/PWA + universal UX.
- Agent rule: IF the app is used in the field THEN show a persistent but thin connectivity/sync indicator (Synced / Syncing n / Offline - n changes queued / Failed - retry), queue writes locally (outbox), never block reads of cached data, show "last updated" time on cached lists, and provide a foreground "sync now" because Background Sync is not available on Safari/Firefox.

### F17 Export/reporting on mobile
- Evidence: Web Share API (MDN) — T1 — VERIFIED — `navigator.share()/canShare()`, requires HTTPS + transient user activation; files supported; not Baseline (Safari iOS yes, Firefox desktop no). NN/g complex applications #5 — T2 — VERIFIED — support transitions between tools incl. export to Excel/PowerPoint/image/copy.
- Gap: no source on "email link vs download" for mobile; practice (MEMORY/opinion): iOS Safari handles downloads awkwardly in standalone PWAs; prefer share sheet (file) or emailed/in-app link to a server-generated report with expiry.
- Agent rule: IF user needs a report THEN primary action = Share (native share sheet with file or link) with fallback "Email me the link" and "Copy link"; desktop-only "Download CSV/XLSX" stays at >= medium width; generate server-side and show status when large.

### F18 Domain patterns (school/ERP/HRIS/CRM/finance) — composite, evidence-anchored inference
No domain-specific T1/T2 sources were found (search budget exhausted; vendor docs 403). The rows below combine verified generic evidence with domain convention (MEMORY/opinion). Treat as `inference` until corroborated.

| Domain pattern | Recommended mobile pattern | Evidence anchor | Confidence |
|---|---|---|---|
| Attendance marking | Class roster as a vertical list; each row = photo/name + 3-4 segmented states (Present/Absent/Late/Excused) or single tap-to-cycle plus "Mark all present" bulk action, sticky "Save/Submit (n of 32 marked)" bar; unmarked clearly different from "present"; autosave | selection/bulk (F6), segmented control <= 5 on iPhone (HIG), WCAG 2.5.1 no swipe-only, 44pt targets | inference |
| Grade entry | One student per screen (swipe/next) OR list with numeric keypad `inputmode="decimal"`; show validation range; never a spreadsheet grid on phone; allow sticky "next ungraded" | F10, NN/g mobile-ux typing cost | inference |
| Timetable / calendar | Agenda/day view as default on compact; week as horizontal day-pager or 3-day; month only as a navigator that opens the day agenda | Android window classes (reveal more on larger), no direct source for agenda-vs-month (Google Calendar convention, MEMORY) | opinion |
| Student/employee/contact profile | Header (photo, name, key status) + tabs/segmented sections (<= 5) or accordion; actions (call, message) in a sticky bar; permissions hide sections | HIG segmented/tab guidance, progressive disclosure <= 2 levels | inference |
| Parent-facing vs teacher-facing | Different IA by role: parent = "what happened/what's due/pay" (feed + child switcher); teacher = "do my tasks" (rosters, grading); don't share one navigation | role-based dashboards (Fiori OVP SNIPPET), F14 | opinion |
| Announcements/feed | Feed layout, unread state, pinned items, acknowledgment ("Seen") for mandatory notices | Material feed canonical layout (VERIFIED) | inference |
| Fee payment | Balance + due date first; pay CTA sticky; itemised list with status pills; receipt via share sheet; payment sheet handled by platform wallet | status pills F12, export F17; payment flows covered in another slice | opinion |
| Leave request / approval | Inbox list (requester, dates, days, balance impact) -> detail -> Approve/Reject with optional comment; batch approve for homogeneous items; undo | F6, F14 "needs attention", GOV.UK task-list statuses | inference |
| Timesheets | Day-by-day entry list with weekly total footer; copy-previous-week; submit sticky | F15 | opinion |
| Expense receipts | Camera capture first, OCR prefill, then minimal fields; offline queue | F15/F16 (`capture`) | inference |
| Org directory | Search-first list with scopes; tap -> contact card with call/message/email | HIG searching (VERIFIED) | inference |
| Payslips | Summary card (net pay) -> breakdown accordion -> share/download PDF; biometric re-auth | F14, F17 | opinion |
| CRM contact list/detail, call logging | Search + recent; detail with sticky call/email; post-call quick-log sheet | F7/F10 | opinion |
| Pipeline kanban on mobile | Do not port horizontal kanban; show a stage selector (segmented control if <= 5 stages, else scrollable chips) over a list of deals; "Move to stage" action instead of drag | WCAG 2.5.7 (kanban needs non-drag alternative, VERIFIED), HIG segmented <= 5 (VERIFIED), HIG drag-and-drop alternatives (VERIFIED) | inference (strong on the alternative-to-drag part) |
| Finance transactions | Group by day with day header; merchant/title left, amount right (tabular, signed); pending vs posted separated; search + filter chips | F4, F11 | opinion (banking convention) |
| Permission-based UI | Hide modules a role can never access; for temporarily unavailable features keep the control visible with reason (HIG: never disable/hide tab bar buttons for transient unavailability) | HIG tab-bars (VERIFIED) | inference |

---

### PART B — Responsive & adaptive

### F19 Vocabulary: responsive vs adaptive, and the five techniques
- Claim: Responsive = one fluid layout; adaptive = swap whole layouts at breakpoints. Both systems list the same five techniques.
- Evidence: Microsoft Windows responsive-design — T1 — VERIFIED — responsive: one layout with fluid content; adaptive: replaces one layout with another; techniques: reposition, resize, reflow, show/hide, re-architect (e.g., list/detail). Fluent 2 layout — T1 — VERIFIED — same five. Android adapt-layout — T1 — VERIFIED — methods: reflow, reveal, change presentation (e.g., bottom sheet -> side sheet). SAP Fiori — SNIPPET — claims responsive over adaptive.
- Agent rule: IF component is a grid/cards THEN responsive (reflow); IF navigation or list-detail THEN adaptive (swap bar/rail/drawer, one-pane/two-pane); IF content only matters on large screens THEN reveal (never hide critical tasks; web.dev: don't hide content by screen size alone).

### F20 Content-driven breakpoints beat device breakpoints (but named tiers help cross-team consistency)
- Evidence: web.dev RWD basics — T1 — VERIFIED — don't define breakpoints by device/brand/OS; start small and widen until the layout breaks; add breakpoints when lines exceed ~10 words (70-80 chars); major vs minor breakpoints; never disable zoom. Android: use window metrics not device type; confine size logic to app/content level and pass state down (Compose guide) — VERIFIED. Microsoft: design for the window (not the screen). Design systems nonetheless publish tiers (F21).
- Agent rule: IF writing CSS THEN mobile-first `min-width` queries at content-driven values; use design-system tiers only for page-scaffold changes (nav, panes); component internals use container queries.

### F21 Window size classes and breakpoint tables (verify current)
- Material/Android (VERIFIED, use-window-size-classes): width compact < 600dp, medium 600-839, expanded 840-1199, large 1200-1599, extra-large >= 1600; height compact < 480, medium 480-899, expanded >= 900. Large/XL need the adaptive library with `currentWindowAdaptiveInfo(supportLargeAndXLargeWidth = true)`. Coverage stats on the page: 99.96% of phones portrait compact width; 93.73% of tablets portrait medium; 97.22% of tablets landscape expanded; compact height = 99.78% of phones in landscape. Guidance: compact height -> avoid top app bar, use horizontal nav.
- Apple (VERIFIED, HIG layout): size classes compact/regular x width/height, determined by device, window configuration and multitasking state; decide layout by size class not device or orientation; keep functionality constant, vary content; iPad windows resize fluidly; apps cannot detect or control multitasking configuration (HIG multitasking). HIG gives no pt table in the fetched JSON.
- Others (VERIFIED): Carbon sm 320 / md 672 / lg 1056 / xlg 1312 / max 1584 px; Fluent 2: 320-479, 480-639, 640-1023, 1024-1365, 1366-1919, 1920+; Microsoft Windows: small <= 640, medium 641-1007, large >= 1008 epx; Power Apps default `SizeBreakpoints` [600, 900, 1200].
- Scope: per platform. Agent rule: IF Android/Compose THEN branch on `WindowSizeClass` (width first, then height), never `isTablet`; IF web THEN map to tiers <600 / 600-839 / 840-1199 / >=1200 for scaffold changes (matches Material) while letting content reflow in between.

### F22 Canonical layouts and pane behavior
- Evidence: Android canonical layouts — T1 — VERIFIED — list-detail: expanded shows both panes, compact/medium one pane at a time, back returns to list, state survives config changes; supporting pane: expanded 70/30, medium 50/50, compact -> sheet or on-demand; feed: compact single column, medium 2-3 columns, expanded multi-column; `GridCells.Adaptive(minSize=180.dp)` auto-columns; `NavigableListDetailPaneScaffold` supports up to 3 panes, default back behavior `PopUntilScaffoldValueChange`. Apple split views — T1 — VERIFIED — prefer split view in regular, not compact, environments; design for narrow/intermediate widths because iPad windows resize fluidly; persistently highlight selection in each pane. Fiori flexible column layout — T1 — SNIPPET — S: single column (rightmost column full screen); M: up to 2 columns; L/XL: up to 3.
- Agent rule: IF list+detail AND width >= 840dp/ expanded THEN two panes with highlighted selection; ELSE push navigation with Back; IF width >= 1200 THEN optional third pane (supporting/inspector) — otherwise cap content width instead of stretching.

### F23 Navigation adaptation: bar -> rail -> drawer/sidebar
- Evidence: Android NavigationSuiteScaffold — T1 — VERIFIED — compact: bottom bar; medium: bar or rail depending on orientation; expanded: rail; drawer optional (override at expanded via `NavigationSuiteType.NavigationDrawer`); tabletop posture: bar. Apple sidebars/tab bars — T1 — VERIFIED — tab bar first on iOS/iPadOS; `sidebarAdaptable` lets the same destinations appear as tab bar or sidebar; aim <= 5 tabs in the default list for continuity; sidebar <= 2 levels; never hide/disable tab buttons; avoid "More" overflow. Windows NavigationView — T1 — VERIFIED — pane top vs left by size.
- Agent rule: IF >5 top-level destinations on phone THEN consolidate (put long tail under a "More"/hub) rather than overflow; IF expanded width THEN rail/sidebar (labels visible), IF compact THEN bottom bar (3-5 items).

### F24 Max content width, line length, grids
- Evidence: Android adapt-layout — T1 — VERIFIED — set max width on content/components; don't stretch full width; don't scale UI uniformly; grids must change density between sizes ("tight and overwhelming" if the phone video grid is reused on tablet). Android codelab — T1 — VERIFIED — max line length 60 chars at expanded; 12-column grid at medium/expanded in the sample; 16dp pane padding; 24dp card spacing; description text 24sp. web.dev — T1 — VERIFIED — 70-80 chars. WCAG 1.4.8 (AAA) — T1 — VERIFIED — <= 80 chars (40 CJK), not meant for small screens. Carbon 2x grid — T1 — VERIFIED — 4 / 8 / 16 columns at sm/md/lg+; small has 0 margin and 16px padding (32px gutter); more items -> tile fixed boxes; more content per item -> scale boxes with fixed columns. Legacy Material MDC grid — T1 — VERIFIED — 4 phone / 8 tablet / 12 desktop columns (margins/gutters not stated in page). M3 current margins/gutters per class: not verifiable this session (m3 unfetchable) — MEMORY: compact 4 columns/16dp margin; medium 12 columns/24dp (some sources 8 columns); expanded 12 columns/24dp; large/XL 12 columns with fixed max width — treat as unverified. Android 8dp baseline grid (4dp for small elements) — VERIFIED; Windows multiples of 4 epx — VERIFIED; Fluent base unit 4px — VERIFIED.
- Agent rule: IF text-heavy content THEN `max-width: 60-75ch`; IF form THEN cap ~560-720px centered on wide screens; IF cards THEN `grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr))` (MEMORY syntax; principle verified via Compose `GridCells.Adaptive`); never go beyond ~1200-1600px content width without adding panes.

### F25 Fluid type/space and zoom safety
- Evidence: MDN clamp — T1 — VERIFIED — `clamp(min, preferred, max)`; keep max >= 2x min so text can reach 200% (WCAG 1.4.4); use rem not px for bounds (MEMORY on rem). W3C 1.4.4 — T1 — VERIFIED — responsive/media-query text changes must still allow 200% enlargement; "meta viewport allows zoom" is a test rule. Apple — support >= 200% via Dynamic Type; rows/containers must grow, text must not crop; adjacent items may stack vertically (HIG layout/accessibility) — VERIFIED. Android sp for text — VERIFIED.
- Agent rule: IF fluid headings THEN `font-size: clamp(1.25rem, 1rem + 1.5vw, 2rem)` (ensure max/min >= 2 is not required to be exact but verify at 200% zoom) — body text should stay fixed 16px/1rem; spacing via `clamp()` with rem.

### F26 Container queries and intrinsic layout
- Claim: Components (tables, KPI tiles, cards, list rows) should respond to their container; page scaffolds respond to viewport and user preferences.
- Evidence: MDN — T1 — VERIFIED — `container-type: inline-size`, `@container`, `cqi/cqw` units, fallback with media queries. web.dev baseline search result — T1 — SNIPPET — size container queries Baseline Newly available Feb 2023 (Chrome/Edge 105, Firefox 110, Safari 16), Widely available Aug 2025. LogRocket — T4 — VERIFIED — a container cannot query itself; custom properties not usable in conditions; style queries not fully supported; media queries still needed for print, orientation, `prefers-*`; grid items shouldn't be containers (wrapper needed). Pajamas table — T1 — VERIFIED — production use for table stacking. Compose analogue: `BoxWithConstraints` / adaptive `GridCells` — VERIFIED.
- Agent rule: IF a component appears in different panes (e.g., KPI tile in 1-col phone vs 3-col split) THEN `container-type:inline-size` on its wrapper and switch layout at ~360/480px container widths.

### F27 Orientation, multi-window, state preservation
- Evidence: WCAG 1.3.4 — T1 — VERIFIED — don't restrict to one orientation unless essential (check capture, piano); users mount devices fixed (wheelchair). MDN orientation — manifest value is default only; `screen.orientation.lock()` limited support. Android 16 — T1 — VERIFIED — for apps targeting API 36, on displays >= sw600dp orientation/resizability/aspect-ratio manifest limits are ignored (games exempt); temporary opt-out property not available when targeting API 37+. Android multi-window — T1 — VERIFIED — multi-window default since Android 12 (API 31); all visible activities RESUMED on Android 10+; don't pause video on ON_PAUSE; handle config changes; set min size. Foldables — VERIFIED — fold/unfold restarts the app: persist state (Parcelable/SavedState). Apple multitasking — VERIFIED — save/restore context.
- Agent rule: IF PWA THEN omit `orientation` (or `any`); IF Android THEN no `screenOrientation` locks, hoist state, test at 300x450dp minimum; IF form in progress during rotate/resize THEN keep input and scroll.

### F28 Foldables: size class first, fold awareness as enhancement
- Evidence: Android fold-aware — T1 — VERIFIED — `FoldingFeature`: state FLAT/HALF_OPENED, orientation HORIZONTAL/VERTICAL, `occlusionType` NONE/FULL, `isSeparating`; tabletop = HALF_OPENED + HORIZONTAL (content above, controls below); book = HALF_OPENED + VERTICAL (two pages); don't put interactive controls or text near an occluding fold; dual-screen reports separating. Learn-about-foldables — VERIFIED — don't rely on orientation; use size classes + FoldingFeature. Web: Chrome blog — T1 — VERIFIED — Viewport Segments API in Chrome/Edge 138 (JS `window.viewport.segments`, CSS `horizontal/vertical-viewport-segments` media features, `env(viewport-segment-*)`); Firefox/Safari no support; release date June 2025 — SNIPPET. MDN device-posture — T1 — VERIFIED — `continuous|folded`, experimental, not Baseline. web.dev — VERIFIED — still marked experimental syntax.
- Not verified: Surface Duo specifics (MEMORY: legacy dual-screen, discontinued line).
- Agent rule: IF layout adapts by window size class THEN foldables mostly work (inner unfolded display ~medium/expanded); add posture handling only for media/camera/reading apps; on web keep fold CSS as progressive enhancement behind `@media (horizontal-viewport-segments: 2)`.
- Android large-screen quality tiers — VERIFIED: Tier 3 (not letterboxed, basic input), Tier 2 (layout optimized for all sizes, enhanced input), Tier 1 (device-differentiated: multi-window, tabletop/book, drag-drop, stylus). Test configs: 841x701dp foldable, 1024x640dp 8" tablet, 1280x800dp 10.5" tablet, 1600x900dp 13" Chromebook (page also names a "Googlebook" 160ppi target).

### F29 Input modality (touch + pointer + keyboard)
- Evidence: MDN any-pointer — T1 — VERIFIED — `pointer` = primary input, `any-pointer` = any input; coarse/fine can both match on hybrids; use any-pointer for progressive enhancement; Baseline since Dec 2018. web.dev PWA checklist — VERIFIED — support mouse, keyboard, stylus and touch equally; Pointer Events. Android tiers — VERIFIED — keyboard, mouse, trackpad, stylus support even at Tier 3. HIG iPadOS — VERIFIED — multiple input modes; viewing distance and input determine density.
- Agent rule: IF sizing targets THEN use `@media (pointer: coarse)` for size and `@media (hover: hover)` for hover effects; do NOT infer "phone" from pointer:coarse (iPad + keyboard/trackpad, touch laptops); always keep keyboard focus order/visible focus; support shortcuts as accelerators with visible equivalents.

### F30 "Do not simply scale desktop down (or phone up)"
- Evidence: NN/g mobile-first-not-mobile-only — T2 — VERIFIED — porting mobile design to desktop (and vice versa) fails; desktop has less navigation need but different capacity; each platform needs its own optimized design. Android adapt-layout — T1 — VERIFIED — don't scale UI uniformly or keep same grid density. Microsoft Power Apps — T1 — VERIFIED — scale-to-fit makes a phone app look oversized in a big window and unable to use extra pixels. NN/g mobile-ux — VERIFIED — content-to-chrome ratio, opportunity cost; numbers cited (72s vs 150s sessions) are dated.
- Agent rule: IF converting a desktop app THEN follow Part C; IF scaling a phone layout up THEN add panes/density, cap widths, switch nav to rail/sidebar.

---

### PART C — Desktop → mobile conversion

### F31 Method (7 steps)
1. Audit tasks and screens; tag each with frequency, importance, urgency, mobile context (on-the-go, field, approvals). Evidence: NN/g progressive disclosure (task analysis, field studies, frequency stats) — VERIFIED.
2. Rank; cut or defer low-frequency/admin-heavy tasks to desktop ("continue on desktop" link). NN/g mobile-ux: opportunity cost of every element — VERIFIED.
3. Define mobile IA: <= 5 primary destinations, task-oriented (what needs me), role-aware. HIG tab bars — VERIFIED.
4. Reduce: fewer columns/fields/actions per screen; default values; use device capabilities (camera/GPS/biometrics) — NN/g — VERIFIED.
5. Progressive disclosure: <= 2 levels; sheets/accordions, not deep modals — NN/g, HIG modality — VERIFIED.
6. Re-layout: single column, vertical stacking, sticky primary action; adaptive navigation. Microsoft techniques — VERIFIED.
7. Replace desktop idioms (table below), then test with keyboard + screen reader + 200% text + one-handed + offline.
- Agent rule: output a task table (task | freq | mobile? | pattern) BEFORE designing screens.

### F32 Desktop idiom -> mobile equivalent mapping
| Desktop idiom | Mobile replacement | Source / basis | Tag |
|---|---|---|---|
| Multi-column data grid | Card list w/ key fields -> detail; or scroll table w/ sticky col; pop-in rows | NN/g mobile tables; Pajamas; SAP pop-in | VERIFIED/SNIPPET |
| Hover tooltip | Tap-to-open popup tip / inline helper text | NN/g tooltips | VERIFIED |
| Hover-reveal row actions | Always-visible overflow menu; swipe actions only as shortcut | Primer; Carbon; WCAG 2.5.1 | VERIFIED |
| Right-click context menu | Long-press menu + visible "..." overflow | HIG context menus | VERIFIED |
| Drag between columns/kanban | "Move to..." action sheet; reorder buttons | WCAG 2.5.7; HIG drag-drop | VERIFIED |
| Multi-column forms | Single column; one concern per section/page | GOV.UK question pages | VERIFIED |
| Mega menu / deep tree | Hierarchical push nav, <= 5 tabs, search | HIG tab bars/sidebars (<=2 levels) | VERIFIED |
| Split view (list+detail) | Push navigation list -> detail with Back; preserve scroll/selection | Android list-detail; HIG split views | VERIFIED |
| Dense toolbar | Primary action + overflow; contextual bar in selection mode | HIG toolbars (<=3 groups, More menu); Android CAB | VERIFIED |
| Inline cell edit | Tap row -> sheet/screen edit | Atlassian; HIG sheets | VERIFIED |
| Modal dialog stack | One sheet at a time; replace with full-screen step | HIG sheets/modality | VERIFIED |
| Keyboard shortcuts | Visible buttons/menu; shortcuts remain for keyboards | NN/g complex apps (accelerators), HIG | VERIFIED |
| Date-range pickers w/ two calendars | Native pickers or presets (Today/7d/Month) | P&P mobile filters (native OS components) | VERIFIED |
| Sidebar filters | Filter sheet with count CTA + chip summary | Baymard; Carbon | VERIFIED |
| Wide dashboards (12 widgets) | "Needs attention" + 3-5 KPI cards + drill-down | NN/g dashboards; Carbon | VERIFIED |
| Hover charts | Tap-to-value readout + table view | Apple charts; Carbon chart anatomy | VERIFIED |
| Bulk toolbar above table | Selection mode + contextual bar + Select all | NN/g bulk; Android CAB | VERIFIED |
| Export button -> file | Share sheet / email link | MDN Web Share | VERIFIED (partial) |
| Tabs of 8+ sections | Segmented control (<= 5) or accordion list | HIG segmented | VERIFIED |

---

### PART D — PWA, browser chrome, webviews

### F33 Install criteria (current) and per-browser reality
- Evidence: web.dev install-criteria — T1 — VERIFIED — Chrome fires `beforeinstallprompt` when: not already installed, user has clicked/tapped at least once and spent >= 30 seconds on the page (engagement heuristic), HTTPS, manifest with name or short_name, icons including 192px and 512px, start_url, display in {fullscreen, standalone, minimal-ui, window-controls-overlay}, `prefer_related_applications` absent/false. No service worker requirement is listed on the page. Android: `prefer_related_applications:true` sends users to the store. MDN Making PWAs installable — T1 — VERIFIED — Chrome/Samsung Internet on Android with GMS install a WebAPK; Firefox/Edge/Opera Android create browser-badged shortcuts; Firefox desktop doesn't install PWAs; Safari 17+ macOS "Add to Dock" works with or without manifest; iOS 16.4+ other browsers (Chrome, Edge, Firefox, Orion) can Add to Home Screen via Share menu; `beforeinstallprompt` not supported on iOS/Safari.
- iOS 26: WebKit Safari 26.0 — T1 — VERIFIED — every site added to Home Screen opens as a web app by default; user can turn off "Open as Web App"; manifest no longer required but used if present. Tsai (T4, comments) — VERIFIED — user-level control; limits remain (icons/theme/scope/splash customization, context actions) per commenters; web push only inside web-app containers.
- EU/DMA: Apple announced removing Home Screen web apps in EU in iOS 17.4 beta (Feb 2024) and reversed on 1 Mar 2024; works today — T4 — SNIPPET (multiple aggregator results; no Apple primary source fetched).
- Agent rule: IF targeting installability THEN ship manifest with name/short_name, 192+512 icons (plus maskable), start_url, id, display:standalone, no related_applications; test via DevTools Application > Manifest; do not depend on a service worker for installability but ship one for offline.

### F34 Install UX timing (custom prompts) — don't block first visit
- Evidence: web.dev promote-install — T1 — VERIFIED — wait for demonstrated interest; best moments: after purchase/sign-up/booking, repeat visits; never first visit; show the install control only after `beforeinstallprompt` fired; keep promotion out of critical flows; always dismissible and remember dismissal; re-prompt only after a relationship change (sign-in, purchase); snackbars 4-7 s. web.dev customize-install — T1 — VERIFIED — `e.preventDefault()` + stash event; `prompt()` from a user gesture; `userChoice` promise; `appinstalled` event fires for any install path; use `matchMedia('(display-mode: standalone)')` to hide UI when installed; log events when promo shown, choice made, installed. MDN — VERIFIED — preventing default suppresses the mini-infobar. Google Search interstitials — T1 — VERIFIED — full-page app-install interstitials are intrusive; use small banners, Smart App Banners (Safari) or in-app install flows.
- Agent rule: IF Chromium THEN capture `beforeinstallprompt`, show an inline "Install app" entry in settings/menu and one contextual banner after the 2nd+ session or after a completed task; cap re-prompt (e.g., dismissed -> wait 30-90 days, MEMORY heuristic); IF iOS THEN no API: show a dismissible instruction card ("Share -> Add to Home Screen") only to engaged iOS Safari users not in standalone (`navigator.standalone` / display-mode), and never as a blocking modal.

### F35 Manifest fields
| Field | Guidance | Source/Tag |
|---|---|---|
| `id` | Set explicit stable id so app identity survives start_url/manifest changes | web.dev add-manifest VERIFIED; WebKit says iOS 16.4 honors `id` VERIFIED |
| `start_url` | Deep into the app (not a marketing landing page) | web.dev VERIFIED |
| `scope` | Controls which URLs stay in-app | web.dev/MDN VERIFIED |
| `display` | `standalone` recommended; `minimal-ui`, `fullscreen`, `browser` | web.dev VERIFIED |
| `display_override` | Ordered fallback list, e.g. `["window-controls-overlay","standalone","browser"]` for desktop PWAs | MDN VERIFIED |
| `orientation` | Default only; avoid locking (WCAG 1.3.4); `any`/omit | MDN + W3C VERIFIED |
| `theme_color` / `background_color` | theme_color = toolbar; background_color = splash (with name+icon); also `<meta name=theme-color media=(prefers-color-scheme: dark)>` | MDN/web.dev VERIFIED |
| `icons` | 192 + 512 required for Chrome; maskable icon safe zone = circle radius 40% of width (outer 10% may crop); don't reuse maskable as `any` (adds padding) | web.dev maskable VERIFIED |
| conflict | web.dev add-manifest shows combined `"purpose":"any maskable"`; maskable-icon article advises separate icons | disagreement; prefer separate entries |
| `shortcuts` | Quick actions on long-press of launcher icon | web.dev/MDN VERIFIED |
| `screenshots` | 320-3840px; Chrome shows up to 8 desktop / 5 mobile; `description` <= 300 chars; richer install UI on Android only | web.dev VERIFIED; MDN VERIFIED |
| `share_target` | Chromium (Android + desktop) only, requires installed PWA; validate input | MDN VERIFIED |
| iOS extras | `apple-touch-icon` (180x180 iPhone, 152/167 iPad), `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` (default/black/black-translucent), `apple-mobile-web-app-title`, `apple-touch-startup-image`, `navigator.standalone` | Apple archive doc VERIFIED (legacy doc; iOS 26 reduces need) |

### F36 iOS PWA constraints (verify current)
- Evidence: WebKit web push — T1 — VERIFIED — iOS/iPadOS 16.4: push only for Home Screen web apps; manifest `display` standalone or fullscreen; permission request must follow a user gesture; Push API + Notifications API + Service Workers; Badging API (`setAppBadge/clearAppBadge`); manifest `id`; Focus integration. WebKit declarative push — VERIFIED — iOS/iPadOS 18.4: subscriptions/notifications without a service worker (still web apps saved to Home Screen). MDN Badging — VERIFIED — Safari 16.4+ Home Screen web apps only; Chromium too. WebKit ITP — VERIFIED (2020) — Safari browsing context: script-writable storage (IndexedDB, localStorage, SW registrations/cache, etc.) is deleted after 7 days without user interaction; Home Screen web apps exempt (own usage counter; deletion would be "a serious bug"). Not re-verified for iOS 26.
- Agent rule: IF the PWA needs reliable storage or push on iOS THEN require install (prompt user to Add to Home Screen) and request notification permission after a user tap; don't promise background sync on iOS; treat Safari-tab data as evictable (sync to server).

### F37 Standalone mode has no browser chrome
- Evidence: MDN display-mode — T1 — VERIFIED — `@media (display-mode: standalone|minimal-ui|fullscreen|window-controls-overlay|picture-in-picture)`, Baseline widely available since Jan 2020; Apple doc — status bar can't be hidden, only styled; `black-translucent` lets content extend under it. Capacitor App API — T1 — VERIFIED — Android `backButton` listener disables default behavior (call `window.history.back()` yourself; use `canGoBack`, `exitApp()`); Android 16 (target 36) enforces predictive back — `onBackPressed()` no longer called — VERIFIED.
- Agent rule: IF `display-mode: standalone` THEN show an in-app header back button where the stack depth > 1, a refresh action or pull-to-refresh, a share action, and an "Open in browser" link for external URLs; keep auth/OAuth flows in a system browser tab/Custom Tab (not an embedded view, see F41); persist scroll/route on app resume.

### F38 Viewport, safe areas, dynamic toolbars, keyboard
- Evidence: web.dev viewport-units — T1 — VERIFIED — `svh` (toolbars shown), `lvh` (toolbars retracted), `dvh` (tracks changes); `100vh` equals the large viewport so it bleeds past the visible area on load; dvh updates are not 60fps and can cause layout shifts; keyboard not counted; Chrome 108+/Firefox 101+/Safari 15.4+. WebKit iPhone X — T1 — VERIFIED — `viewport-fit=cover` + `env(safe-area-inset-*)`; `constant()` obsolete; combine with `max()` for landscape padding; always provide fallbacks. MDN env() — T1 — VERIFIED — env baseline since Jan 2020; also `safe-area-max-inset-*`, `keyboard-inset-*` (VirtualKeyboard API), `titlebar-area-*`, `viewport-segment-*`. Chrome 108 — T1 — VERIFIED — Android Chrome keyboard resizes only the visual viewport by default (`interactive-widget=resizes-visual`); fixed elements stay and can be covered by the keyboard; `resizes-content` restores old behavior; VirtualKeyboard API `overlaysContent`; aligns with iOS Safari. MDN viewport meta — VERIFIED — `interactive-widget` limited support. MDN Visual Viewport — VERIFIED — resize/scroll events, `offsetTop`, `height` used to float bars above the keyboard. Android layout-basics — VERIFIED — move the focused input up or attach input to keyboard; don't hide inputs.
- iOS 26 Safari — Apple forum (T4) — VERIFIED as a report — `position:fixed/sticky` content below the new floating bottom controls isn't rendered (clipped), so fixed bottom bars can't reach the page bottom; no Apple response or workaround found; WebKit's Safari 26.0 notes don't mention it. Treat as unresolved risk.
- Agent rule: IF full-height shell THEN `min-height:100svh` for content that must always fit, `100dvh` for app shells that should track toolbars (accept jank), never plain `100vh`; sticky bottom bars get `padding-bottom: env(safe-area-inset-bottom)` (+ `viewport-fit=cover`); IF keyboard-sensitive form THEN scroll focused field into view and use `visualViewport` or `interactive-widget=resizes-content` (Chromium) — test on iOS Safari separately; avoid bottom-fixed bars in Safari tabs on iOS 26 until verified (prefer in-flow bottom bars at page end or standalone-only fixed bars).

### F39 Touch/overscroll/zoom hygiene
- Evidence: MDN overscroll-behavior — T1 — VERIFIED — `contain`/`none` stop scroll chaining and (on html/body) disable native pull-to-refresh/swipe nav; Safari 16+; not Baseline. MDN touch-action — VERIFIED — `manipulation` removes double-tap-zoom delay (~300ms) but keeps pinch zoom; `none` can block zoom (a11y harm). MDN `-webkit-tap-highlight-color` — VERIFIED — non-standard; if set transparent, supply `:active`/focus feedback. MDN user-select — VERIFIED — don't overuse `none` (blocks copying; needs `-webkit-` prefix). Viewport meta — VERIFIED — `user-scalable=no`/`maximum-scale=1` violates WCAG 1.4.4; iOS 10+ ignores by default; WCAG 1.4.4 test rule "meta viewport allows zoom" — VERIFIED. web.dev — VERIFIED — avoid min/max-scale and user-scalable.
- Agent rule: apply `touch-action: manipulation` on controls; set `overscroll-behavior-y: contain` on modals/sheets/inner scrollers (and on `html` only for app-like PWAs that supply their own refresh); never disable zoom; allow text selection in data (IDs, amounts).

### F40 Service worker update UX and offline page
- Evidence: web.dev SW lifecycle — T1 — VERIFIED — new SW waits until old controls zero clients; `skipWaiting()` can leave pages loaded with old assets handled by the new SW (mismatch risk). Workbox — T1 — VERIFIED — prompt flow: `workbox-window` `waiting` event -> UI "update available" -> `messageSkipWaiting()` -> `controlling` -> reload; useful when precaching HTML; not needed with network-first runtime caching. web.dev PWA checklist — VERIFIED — custom offline page precached at install. Workbox fallback — VERIFIED — `setCatchHandler` returning precached `/offline.html` for documents; `offlineFallback()` recipe.
- Agent rule: IF precached app shell THEN show non-blocking snackbar "New version available — Reload" (persist until chosen; never auto-reload mid-form/draft; apply on next navigation or idle), IF dirty form THEN defer; ship `/offline.html` with branding, retry button and list of available cached sections.

### F41 In-app browsers/webviews (Instagram, Facebook, TikTok, LINE)
- Evidence: master.dev (Frontend Masters) — T3 — VERIFIED — in-app browsers lack extensions/downloads/bookmarks; apps can inject JS and observe input; sessions don't share logins/history; internals can be outdated; detect with libraries; escape to system browser via `intent:` on Android (iOS unreliable); manual instruction fallback. Search results (T3/T4) — SNIPPET — localStorage may be cleared on navigation in some webviews (use cookies/sessionStorage and server session); PWA install unavailable in webviews; Google blocks OAuth in embedded webviews (`disallowed_useragent`, Android UA contains `; wv`) since 2021 (Auth0 summary); Facebook/Instagram Android webviews failed to complete cross-document view transitions (GitHub issue). Android docs — VERIFIED — WebView has no navigation controls/address bar/browser features; use Custom Tabs for external content; "never allow navigation to untrusted sites in WebView" with JS bridges; Android design doc recommends browser intent over WebView in most cases.
- Agent rule: IF UA indicates in-app browser (heuristic + feature checks) THEN show a dismissible banner "Open in Safari/Chrome for the best experience" with copy-link fallback before login/checkout/install; don't rely on localStorage for sign-in; use redirect-based OAuth in the system browser; skip `view-transition` and install prompts there.

### F42 Capacitor/Ionic and TWA (high level)
- Evidence: Capacitor Status Bar — T1 — VERIFIED — `overlaysWebView` default true; `style`; `backgroundColor` only when not overlaying; as of Android 16 (API 36) overlay/background options unsupported because edge-to-edge is enforced; plugin page doesn't explain `env(safe-area-inset-*)`. Android 16 — VERIFIED — `windowOptOutEdgeToEdgeEnforcement` deprecated/disabled. Ionic forum/GitHub (T4) — SNIPPET — on Android WebView with edge-to-edge, `env(safe-area-inset-*)` can be 0; fixes: Capacitor `adjustMarginsForEdgeToEdge`, safe-area/SystemBars plugins. Capacitor App — VERIFIED — back button handling (F37). TWA — Chrome docs — VERIFIED (page appears stale: still says "preview") — TWA runs the web app in Chrome (not WebView), needs Digital Asset Links, Chrome 72+, Bubblewrap builds the shell; host app can't read cookies/localStorage.
- Agent rule: IF Capacitor THEN set both CSS safe-area padding and native inset handling, test status bar/nav bar on Android 15/16 and iOS; handle back button; use real browser (Custom Tab/SFSafariViewController) for external/OAuth links. IF Play Store distribution of a PWA THEN TWA via Bubblewrap/PWABuilder (check current docs; fetched page is old).

### F43 Landscape, keyboard, small heights
- Evidence: Android size classes — VERIFIED — compact height (<480dp; 99.78% of phones in landscape) -> avoid top app bar, use horizontal navigation; WCAG 1.4.10 — VERIFIED — content must work at 320 CSS px wide (vertical scroll) and 256 px high (horizontal scroll). NN/g mobile tables — VERIFIED — don't force landscape.
- Agent rule: IF height < ~480dp/px THEN collapse app bar/bottom bar on scroll, move primary action into content, avoid sticky stacks (top bar + chip row + bottom bar) that leave < 50% of height for content; test with keyboard open in landscape.

---

## Numbers table (value | applies to | source | tag)

| Value | Applies to | Source | Tag |
|---|---|---|---|
| < 600 / 600-839 / 840-1199 / 1200-1599 / >= 1600 dp | Material/Android width classes | developer.android.com use-window-size-classes | VERIFIED |
| < 480 / 480-899 / >= 900 dp | Android height classes | same | VERIFIED |
| 99.96% phones portrait compact; 93.73% tablets portrait medium; 97.22% tablets landscape expanded | Android coverage stats | same | VERIFIED |
| sw >= 600dp: orientation/resizable/aspect restrictions ignored (target API 36) | Android 16 | behavior-changes-16 | VERIFIED |
| 70/30 expanded, 50/50 medium supporting pane | Android supporting pane | canonical-layouts | VERIFIED |
| GridCells.Adaptive minSize 180dp | Android feed | canonical-layouts | VERIFIED |
| 8dp / 4dp baseline | Android | grids-and-units | VERIFIED |
| 4 / 8 / 12 columns phone/tablet/desktop | legacy Material (MDC grid) | material-components-web README | VERIFIED |
| 320 / 672 / 1056 / 1312 / 1584 px; 4/8/16 columns; 16px padding; 32px gutter | Carbon 2x grid | carbondesignsystem.com | VERIFIED |
| 320-479 / 480-639 / 640-1023 / 1024-1365 / 1366-1919 / 1920+ px | Fluent 2 | fluent2.microsoft.design/layout | VERIFIED |
| <= 640 / 641-1007 / >= 1008 epx | Windows responsive | learn.microsoft.com | VERIFIED |
| [600, 900, 1200] | Power Apps default breakpoints | learn.microsoft.com | VERIFIED |
| 24 / 32 / 40 (default) / 48 / 64 px row heights | Carbon table | carbondesignsystem.com | VERIFIED |
| 40 / 48 / 56 px condensed/regular/relaxed | P&P enterprise tables | pencilandpaper.io | VERIFIED |
| 44x44pt default, 28x28pt min | iOS/iPadOS controls | HIG accessibility | VERIFIED |
| 48x48dp | Android touch target | Fluent 2 page (also Material) | VERIFIED (via Fluent) |
| 24x24 CSS px | WCAG 2.5.8 AA min | W3C | VERIFIED |
| 17pt default / 11pt min (12 per accessibility page) | iOS text | HIG typography/accessibility | VERIFIED |
| 12px / 60% of text | Lighthouse legibility | developer.chrome.com | VERIFIED |
| 15-30 items mobile chunk; 50-150 desktop; 2-4 items/viewport | Baymard list loading | baymard.com | VERIFIED |
| 28% of sites lack applied-filters overview | Baymard | baymard.com | VERIFIED |
| <= 5 segments iPhone, 5-7 wide | segmented control | HIG | VERIFIED |
| <= 5 tabs default (iPad continuity); sidebar <= 2 levels | tab bar / sidebar | HIG | VERIFIED |
| <= 2 disclosure levels | progressive disclosure | NN/g | VERIFIED |
| 60 chars max line (expanded) | Android codelab | developer.android.com | VERIFIED |
| 70-80 chars | line length | web.dev RWD | VERIFIED |
| <= 80 chars (40 CJK) | WCAG 1.4.8 AAA | W3C | VERIFIED |
| 320 CSS px wide / 256 px high | WCAG 1.4.10 reflow | W3C | VERIFIED |
| 200% text enlargement; clamp max >= 2x min | WCAG 1.4.4 / MDN | W3C/MDN | VERIFIED |
| 192 + 512 px icons | Chrome install | web.dev | VERIFIED |
| click + 30 s engagement | Chrome beforeinstallprompt | web.dev | VERIFIED (heuristics can change) |
| maskable safe zone: circle radius 40% of width | maskable icons | web.dev | VERIFIED |
| screenshots 320-3840 px; 8 desktop / 5 mobile; description <= 300 chars | manifest | web.dev add-manifest | VERIFIED |
| snackbar 4-7 s | install promo | web.dev promote-install | VERIFIED |
| apple-touch-icon 180x180 (iPhone), 152 / 167 (iPad) | iOS | Apple archive doc | VERIFIED |
| 7 days (script-writable storage, Safari browsing context) | WebKit ITP | webkit.org 2020 | VERIFIED (2020 text) |
| Chrome 108 (resizes-visual), 108/101/15.4 (dvh), Chrome/Edge 138 (Viewport Segments), iOS 16.4 (push/badge), iOS 18.4 (declarative push), Safari 26 (open as web app default) | version gates | various | VERIFIED |
| Container queries: Chrome/Edge 105, Firefox 110, Safari 16 (Feb 2023) | CSS | web.dev baseline results | SNIPPET |
| Chrome 80 (Feb 2020) / Firefox 2019 / Safari 17 (Oct 2023) table semantics fixes | CSS display on tables | Roselli | VERIFIED |
| M3 margins 16/24dp, column counts compact 4 / medium 8-12 / expanded 12 | Material 3 | none this session | MEMORY (unverified) |

## Comparison tables

### Table patterns for mobile
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Card / stacked key-value | Readable, touch-friendly, no overflow | Loses cross-row comparison; long | Directories, tickets, invoices, leave requests; < few dozen visible | Numeric comparison; many rows per screen needed |
| Key columns + expand/pop-in row | Compact scan + full detail in place (SAP, accordion) | Extra taps; a11y toggles (aria-expanded) | 6-12 columns where 1-2 identify the row | Users need to compare hidden columns |
| Horizontal scroll + sticky 1st col + sticky header | Preserves table semantics and comparison (Roselli/Smashing) | Needs overflow cue; 2-D scroll fatigue | Grades, finance, schedules | Casual lookups; < 4 columns (just fit) |
| Pivot (rows<->columns) | Fits wide, short datasets (few rows x many columns) | Unfamiliar; header semantics get tricky | Timetables, comparisons of 2-4 entities | Long row lists |
| Master-detail (list -> detail) | Matches phone nav; supports list-detail on tablets | Needs state restore | Entities with many attributes | One-glance numeric tables |
| Summary + drill-down | Fast "what matters" (dashboards) | Hides raw data | Manager views, analytics | Data entry/audit |
| Bottom-sheet row detail | Keeps list context (HIG sheets) | Limited height; not for long edits | Quick read/edit of 3-6 fields | Long forms (use full screen) |
| Column chooser / in-view filter | User controls density (NN/g) | Setup cost; persistence needed | Power users on tablet | Casual users |
| Segmented views (Overview/Details/History) | Splits one big table by task | <= 5 segments | Profiles, deals | Many categories |

### Filter patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Bottom sheet + sticky "Show N results" | Thumb-reachable, batch, count preview (Baymard, Smart IDP) | Hides results behind sheet | 3-10 facets | > 5 groups with long option lists (use full-screen) |
| Full-screen filter page | Max space, deep facets | Context loss (NN/g prefers overlay) | Complex enterprise filters, saved views | Quick 1-2 filters |
| Overlay tray with live results behind | Immediate feedback (NN/g) | Partial results visible only; refresh jank | Fast, small datasets | Slow queries |
| Filter chips row (quick filters) | One-tap, visible state | Limited options; overflow | 3-6 common states (status, assigned to me) | Many dimensions |
| Live (instant) apply | Fewer taps | Disorienting refresh, request storm (Baymard/P&P) | Single-category, local data | Multi-category, remote data |
| Applied-filters summary | Orientation, removal (Baymard 28% missing) | Consumes vertical space | Always | - |

### Dashboard layout patterns (mobile)
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| "Needs attention" inbox-first | Action-oriented (role-based OVP idea) | Needs good prioritization | Approvals, school ops, HR | Pure analytics users |
| KPI tile stack (3-5) + drill-down | Fast status; matches phone | Can become tile soup | Managers, owners | > 6 tiles |
| Single-chart cards with segmented timeframe | Simple, accessible | Little comparison | Trends | Multi-series analysis |
| Horizontal KPI carousel | Saves height | Hidden items, a11y, no scroll cue | 2-3 secondary KPIs only | Primary KPIs |
| Pinned/customizable widgets | User relevance | Setup effort | Power users | New users |
| Embed desktop BI dashboard | Zero effort | Tiny, unreadable (anti-pattern) | Never as the primary mobile view | - |

### List/detail patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Push nav (one pane) | Simple, focus | Back/state complexity | Compact width | - |
| Two-pane list-detail | Fast triage, persistent selection | Needs >= expanded width | Tablets, foldables, desktop | Phone |
| Three-pane (nav/list/detail) | Power workflows (Fiori FCL: up to 3 at L/XL) | Width hungry | >= 1200dp | Medium |
| Supporting pane (70/30, 50/50) | Context beside main task | Compact fallback to sheet | Docs + comments | Equal-weight panes |
| Sheet detail (medium/large detent) | Context preserved | Short content only | Quick view | Edit-heavy |

### Install prompts
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Browser-native (omnibox icon, mini-infobar) | Zero effort, trusted | Low discoverability | Always available | - |
| In-app "Install" menu item/settings | Non-intrusive, always available | Needs `beforeinstallprompt` | All Chromium | iOS (no API) |
| Contextual banner after task/2nd session | High intent (web.dev) | Needs rules to avoid nagging | After purchase/sign-up | First visit |
| Full-screen interstitial/modal on load | - | Penalized (Google interstitials), blocks task | Never | Always |
| iOS instruction card (Share -> Add) | Only option on iOS | Manual, easy to miss | Engaged iOS Safari users | Already standalone / in-app browser |

## Anti-patterns found (problem -> why -> better -> source)
1. 10-column desktop table squeezed on phone -> fixed grid shrinks text below legibility and breaks WCAG-ish target needs -> card/pop-in or scroll+sticky column -> NN/g mobile tables; SAP pop-in (SNIPPET); Lighthouse 12px.
2. Horizontal scroll with no affordance -> users don't know more columns exist -> clipped next column/arrows/sticky identifier -> NN/g.
3. `display:block` on `<table>` without roles -> screen readers lose table semantics (Safari until 17) -> scroll container or ARIA roles or separate card markup -> Roselli; Smashing 2022.
4. Hover-only row actions/tooltips -> no hover on touch -> visible overflow button, popup tips -> NN/g tooltips; Primer; Carbon.
5. Tiny text in dense UIs (< 11-12px) -> desktop density reused -> >= 12px, Dynamic Type/rem, 44-48 targets -> Apple HIG; Lighthouse.
6. Modal on modal / stacked sheets -> context loss -> one sheet at a time, replace or dismiss-then-present -> HIG sheets/modality.
7. Desktop mega-form -> overload, typing cost -> sections/steps, one thing per page, autosave -> GOV.UK; NN/g.
8. Fixed-pixel layouts / device-keyed breakpoints -> brittle across foldables/windows -> content-driven breakpoints, container queries -> web.dev RWD; Android guidance.
9. `100vh` full-height shells -> bleeds under dynamic toolbars -> `svh/dvh` + safe-area padding -> web.dev viewport units.
10. Blocking install popup on first visit -> no demonstrated value; intrusive -> contextual, dismissible, remember dismissal -> web.dev promote-install; Google interstitials.
11. Disabling zoom (`user-scalable=no`) -> fails WCAG 1.4.4 -> allow zoom; handle tap delay with `touch-action: manipulation` -> MDN; W3C.
12. Drag-only kanban/reorder -> excludes keyboard/switch/motor users and is hard on phone -> Move-to menu, up/down buttons -> WCAG 2.5.7; HIG.
13. Color-only positive/negative or status -> fails 1.4.1 -> sign/parentheses/icon/text -> W3C; Carbon.
14. Infinite scroll for admin/goal tasks -> no footer, lost position, no comparison -> Load more/pagination with state restore -> NN/g; Baymard.
15. Live-apply filters on slow data on mobile -> disorienting refresh -> batch with count CTA -> Baymard; P&P.
16. Embedding desktop dashboard (12 widgets) -> unreadable -> attention-first KPI/drill-down -> NN/g dashboards; Apple charts.
17. Relying on long-press/swipe as the only path -> undiscoverable, fails 2.5.1 -> visible control + gesture shortcut -> HIG context menus; W3C.
18. Showing sign-in via embedded webview/in-app browser -> blocked/lost sessions -> system browser + escape banner -> master.dev; Auth0 (SNIPPET).

## Disagreements & weak-evidence zones
- Instant vs batch filters: NN/g (live with results visible) vs Baymard/P&P/Smart IDP (batch + count). Treated as converging on "show effect before commit"; choose by data speed.
- Card transform vs scroll: system docs split (Pajamas/USWDS/SAP/Lightning favor stacking for simple tables; Roselli/Smashing favor scroll for complex). Rule keyed on table complexity and task.
- "1-3 KPIs": only vendor blogs say 4-5; Carbon/NN/g say "few/limited"; no T1/T2 number. Keep as heuristic.
- Maskable icons: web.dev add-manifest example uses `"any maskable"`, web.dev maskable article advises separate icons.
- Text min: iOS typography page says min 11pt; accessibility page says 11-12; WCAG has no min text size; Lighthouse uses 12px; Material small label sizes unverified (MEMORY: 11-12sp).
- Load-more/lazy loading on mobile: Smashing 2016 (avoid lazy-load) vs Baymard now (Load more + lazy-loading).
- Install heuristics (click + 30 s) are Chrome-specific and can change; other browsers differ (MDN says Edge/Firefox similar).
- iOS 26 fixed-position behavior: single forum report, not corroborated by WebKit notes.
- Weak: domain-specific school/CRM/finance guidance (all inference), `pointer: coarse` caveats (MEMORY), M3 grid margins (MEMORY), Material density.
- Folk wisdom checked: "thumb zone" not needed here; "hamburger bad" not in slice; "card transform is the mobile table answer" — evidence says it is one of several and only for simple/small sets.

## Gaps (what I could not verify)
- Material 3 data table/list/density pages and exact M3 grid columns/margins/gutters per class (m3.material.io unfetchable; WebSearch budget exhausted).
- SAP Fiori responsive table/FCL/OVP primary pages and Salesforce Lightning responsive/mobile guidance (403/empty) — only snippets.
- School-management domain evidence (attendance, grading, timetable, parent vs teacher) — no T1/T2 sources fetched; table in F18 is inference. Same for HRIS (leave, timesheets, expenses), CRM kanban-on-mobile, banking transaction conventions (pending vs posted, day grouping).
- Salesforce/Workday offline and mobile-enterprise guides; email-link vs download behavior on mobile (iOS standalone download handling).
- Current (2026) status of: iOS 27/Safari 27 betas, Web Install API, Chrome PWA changes after 2025, `interactive-widget` support in Safari, Safari behavior for storage eviction of Home Screen apps on iOS 26, `display_override` iOS support, pull-to-refresh behavior in installed Chrome PWAs.
- Fluent 2 / Polaris / Lightning table mobile specifics (Polaris moved to shopify.dev; only the index-table composition was fetched).
- Apple HIG pt device widths/size-class table (not in the JSON excerpt).
- TWA page content appears outdated (mentions preview) — re-check developer.chrome.com for current TWA requirements/quality criteria.
- Virtualized-list accessibility attributes (`aria-rowcount`, `aria-setsize`, `aria-posinset`) cited from memory.
