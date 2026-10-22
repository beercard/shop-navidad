# Data-dense and enterprise mobile UI (tables, dashboards, bulk actions, desktop → mobile)

Read this when: building mobile UI for school management, ERP, CRM, HRIS, finance, analytics or admin dashboards; converting a desktop interface to mobile; displaying tables, KPIs, charts, filters, approvals or bulk actions on small screens; deciding whether to simplify instead of squeezing.

Tags: `[S]` standard · `[P-iOS]` `[P-AND]` `[P-WEB]` platform · `[R]` research · `[C]` consensus · `[H]` heuristic · `[inference]` our synthesis with no domain source. Research date 2026-10-06. Domain-specific (school/HRIS/CRM) patterns have no primary sources: they are built from verified generic evidence and labeled inference.

Contents: 1 Core principle · 2 Desktop → mobile method · 3 Idiom mapping table · 4 Tables · 5 Density and targets · 6 Selection and bulk actions · 7 Filters, sort, search · 8 Pagination and virtualization · 9 Inline editing · 10 Numbers, dates, status · 11 Hover-only controls · 12 KPI tiles and dashboards · 13 Enterprise forms · 14 Offline and sync · 15 Export · 16 Domain patterns · 17 Comparison tables · 18 Anti-patterns · 19 Evidence limits

---

## 1. Core principle: simplify before you reflow

Do not shrink a desktop screen. Content that fits one desktop screen can need ~5 phone screens (NN/g mobile UX); every element has an opportunity cost. Decide per task what mobile users actually do (look up, approve, capture, compare, edit), then redesign the information hierarchy for that. NN/g: mobile-first, not mobile-only: porting desktop to mobile (or the reverse) fails; each platform needs its own optimized design. Microsoft Power Apps: scale-to-fit makes a phone app look oversized in a big window and unable to use extra pixels. Android adapt-layout: don't scale UI uniformly or keep the same grid density. `[R][P-AND]`

## 2. Desktop → mobile conversion method (7 steps)

1. **Audit tasks and screens**: tag each with frequency, importance, urgency and mobile context (on the go, field, approvals). Output a table (task | frequency | mobile? | pattern) BEFORE designing screens. `[R: NN/g progressive disclosure]`
2. **Rank; cut or defer** low-frequency/admin-heavy tasks to desktop ("Continue on desktop" link).
3. **Define mobile IA**: ≤ 5 primary destinations, task-oriented ("what needs me"), role-aware (HIG tab bar).
4. **Reduce**: fewer columns/fields/actions per screen; defaults; use device capabilities (camera, GPS, biometrics) instead of typing.
5. **Progressive disclosure**: ≤ 2 levels; sheets/accordions, not deep modals.
6. **Re-layout**: single column, vertical stacking, sticky primary action; adaptive navigation (techniques: reposition, resize, reflow, show/hide, re-architect: Microsoft/Fluent; Android: reflow, reveal, change presentation).
7. **Replace desktop idioms** (next table), then test with keyboard + screen reader + 200% text + one-handed + offline.

## 3. Desktop idiom → mobile equivalent

| Desktop idiom | Mobile replacement | Basis |
|---|---|---|
| Multi-column data grid | Card list with key fields → detail; or scroll table with sticky column; or pop-in rows | NN/g mobile tables; Pajamas; SAP pop-in |
| Hover tooltip | Tap-to-open popup tip / inline helper text | NN/g tooltips |
| Hover-reveal row actions | Always-visible overflow menu; swipe actions only as shortcut | Primer; Carbon; WCAG 2.5.1 |
| Right-click context menu | Long-press menu + visible "…" overflow | HIG context menus |
| Drag between columns/kanban | "Move to…" action sheet; reorder buttons | WCAG 2.5.7; HIG drag-drop |
| Multi-column forms | Single column; one concern per section/page | GOV.UK question pages |
| Mega menu / deep tree | Hierarchical push nav, ≤ 5 tabs, search | HIG tab bars/sidebars (≤ 2 levels) |
| Split view (list + detail) | Push navigation list → detail with Back; preserve scroll/selection | Android list-detail; HIG split views |
| Dense toolbar | Primary action + overflow; contextual bar in selection mode | HIG toolbars (≤ 3 groups); Android CAB |
| Inline cell edit | Tap row → sheet/screen edit | Atlassian; HIG sheets |
| Modal dialog stack | One sheet at a time; full-screen step | HIG sheets/modality |
| Keyboard shortcuts | Visible buttons/menu; shortcuts remain for keyboards | NN/g complex apps; HIG |
| Date-range with two calendars | Native pickers or presets (Today / 7d / Month) | P&P mobile filters |
| Sidebar filters | Filter sheet with count CTA + chip summary | Baymard; Carbon |
| Wide dashboards (12 widgets) | "Needs attention" + 3-5 KPI cards + drill-down | NN/g dashboards; Carbon |
| Hover charts | Tap-to-value readout + table view | HIG charts; Carbon chart anatomy |
| Bulk toolbar above table | Selection mode + contextual bar + Select all | NN/g bulk; Android CAB |
| Export button → file | Share sheet / email link | MDN Web Share |
| Tabs of 8+ sections | Segmented control (≤ 5) or accordion list | HIG segmented |

## 4. Tables on mobile

There is no single "responsive table". Decide by what the data is for:

| Data's job on mobile | Pattern |
|---|---|
| Look up / approve one record at a time (directory, tickets, invoices, leave requests) | Card/stacked key-value rows → tap-through detail (1 title + 1 status + 1-2 key values) |
| Compare across rows/columns (grades, finance, schedules) | Keep tabular; horizontal scroll with sticky first column + sticky header + visible overflow cue |
| Scan one key field then drill in | Key columns + expand/pop-in row (SAP: 1-2 columns in the row, the rest under it as label/value pairs) |
| Few rows × many columns | Pivot (rows↔columns), e.g. timetables, 2-4 entity comparisons |
| Many attributes per entity | Master-detail |
| Manager view | Summary + drill-down |
Never shrink to fit 8-10 columns. If > ~6 columns of secondary data → pop-in/expand row or a column chooser.

- NN/g Mobile Tables (VERIFIED): sticky headers, frozen left column, in-view/pre-view filtering, accordion grouping; cells legible without zoom (~2 columns for complex entries; numeric tables can be narrower); signal horizontal overflow with arrows or cut-off elements (not dots); don't force landscape. NN/g Data Tables: freeze header rows and columns if the table exceeds the screen; first column should be a human-readable name, not an ID. Pajamas: tabular + scroll when row comparison matters, or stack each row into key/value groups below a breakpoint (driven by container queries). USWDS: three stacked variants via `data-label`; scroll container `tabindex=0`. `[R][C]`
- **Preserve table semantics when reflowing (web):** CSS `display:block/flex/grid` on table elements historically stripped table roles (Chromium fixed Feb 2020/Oct 2023; Firefox Jan 2019 except `display:contents`; Safari 17 Oct 2023). Safest default: a native `<table>` inside a labeled, focusable scroll container (`role="region"` + `aria-labelledby` + `tabindex="0"` + `overflow:auto`, visible focus ring ≥ 3:1) with sticky headers. If you stack with CSS, re-apply `role=table/row/columnheader/cell`, or render a separate card `<ul>` for mobile and hide the unused one with `display:none` (removes it from the a11y tree). Stack only simple tables (≤ ~5 columns, one header row); anything with spans or multi-level headers scrolls. WCAG 1.4.10 excepts data tables from reflow (2-D scroll in their own container) but table headings, search, pagination and toolbars next to the table must reflow. `[S][R]`
- A partially visible next column (clipped ~20-30%) is the cheapest overflow affordance; add an edge fade as reinforcement (T4). Freeze column 1 and the header; "Columns" chooser if > 8 columns; persist user preferences.
- Card rows: the label carries what the column header did; numeric values right-aligned in a fixed trailing column with tabular figures; label stays visible, not icon-only; pairs keep order consistent.
- Right-align numerics, left-align text, headers match alignment (P&P, Primer); `font-variant-numeric: tabular-nums` (Baseline since 2020) so $1,111.11 doesn't look smaller than $999.99.

## 5. Density and targets

Dense desktop row heights (Carbon xs 24 / sm 32 / md 40 default / lg 48 / xl 64 px; P&P condensed 40 / regular 48 / relaxed 56 px; Primer condensed/normal/spacious) are below touch minimums. Default comfortable on coarse pointers: rows ≥ 44pt/48dp, hit area ≥ 44×44 for checkboxes and controls (visual glyph may be smaller); body/secondary text ≥ 12px (never < 11pt iOS; Lighthouse fails pages with ≥ 40% of text under 12px); rows grow with Dynamic Type, never clip. Offer a density toggle (compact 40 / regular 48 / relaxed 56, persisted) only when `(any-pointer: fine) and (hover: hover)` and width ≥ medium. Salesforce mobile guidance: min font 14px. `[P-iOS][P-AND][S][C]`

## 6. Selection mode and bulk actions

Consensus across NN/g, Carbon, Android, Apple, Shopify: selecting enters an explicit mode; a contextual bar shows the count and actions; row-level actions are suppressed; users can select all; destructive batch actions get feedback/undo. Android: contextual action mode starts by touch-and-hold or checkbox and ends on deselect-all, Back or Done; HIG: iOS needs an edit mode before selecting rows. Long-press as the only entry is undiscoverable: do both.
Rule: (a) visible "Select" affordance AND long-press shortcut; (b) in selection mode replace the top bar with "N selected" + close + ≤ 3 actions + overflow; (c) "Select all" (state whether it means loaded items or all matches; header checkbox indeterminate for partial); (d) disable row tap-through and per-row menus; (e) after a destructive action show a snackbar with Undo; (f) selection survives scroll and filter changes or says it was cleared; web: `aria-selected`/checkbox + a live region announcing "3 selected". `[R][P-AND][P-iOS]`

## 7. Filters, sort, search

- Filters live in their own layer (bottom sheet or full screen for > 5 groups). The trigger stays reachable (sticky "Filter & Sort"). Applied filters are summarized outside the layer as a horizontally scrolling chip row (with truncation/fade/count cue) or stacked rows that don't push results too far down; each chip removable, plus "Clear all"; the closed trigger always shows the applied count. Apply is batched with a live "Show N results" CTA unless updates are silent and instant (fast local filtering of < ~200 rows already on-device). NN/g prefers an overlay tray with results visible behind and a live count; Baymard/P&P prefer batch with a count; both converge on "the user always sees what a change will do". Carbon: batch for multi-category or slow data, instant for single-category. Don't mirror every desktop filter; save presets/saved views; in enterprise "no results" is legitimate, so empty states must be exact ("0 students match: Grade 7 + Absent today"). Baymard: 28% of benchmarked sites show no applied-filters overview (another article says 20%). `[R]`
- Sort: a single "Sort: Due date" chip/button opening a sheet (sort-by + order), state shown, default sort stated; keep header-click sorting only at ≥ medium width (Shopify index table, Pajamas hide sort icons when stacked; nulls last in either direction).
- Search: one clearly scoped home; scope shown (placeholder/scope bar/tokens), recents before typing with a clear control, predictive suggestions (HIG).

## 8. Pagination, load more, virtualization

Match the pattern to the task: browsing homogeneous feeds → infinite; goal-directed lookup/compare/admin → "Load more" (15-30 on phones, Baymard; 25-50 only on tablet/desktop) with a count ("Showing 50 of 1,240") or pagination. Baymard: on phones load 15-30 items per chunk (2-4 visible per viewport; fatigue sooner than desktop; desktop 50-150); Load more performs best; always restore scroll position and loaded pages on Back (store cursor/scrollY in history state/router cache). NN/g: avoid infinite scroll when finding specific items, comparing, or needing the footer. Lists > ~100 rows → virtualize (or `content-visibility: auto` for simple static lists) while exposing total counts (`aria-rowcount`/`aria-setsize`+`aria-posinset`) and keeping search/filter server-side. See performance.md. `[R][H]`

## 9. Inline editing

Avoid cell-level editing on phones. Tap row → detail; "Edit" → one field per sheet for single-field fixes (status, quantity, date) or a full form for multi-field; optimistic update + Undo; bulk edits (e.g., attendance) use dedicated toggles on the row, not free text. Atlassian: prefer "more actions" menus that open modals over inline inputs for complex tables; HIG sheets: medium detent for light tasks, large/full-screen for long forms. NN/g: single-record editing — non-modal side panels beat modals that obscure the data (tablet+). `[C][inference for mobile conclusion]`

## 10. Numbers, dates, signs, status

- Use `Intl.NumberFormat` / platform formatters: `currencySign:"accounting"` parenthesizes negatives; `signDisplay` auto/always/exceptZero/negative/never; `notation:"compact"` → "$1.5M" (keep exact values on the detail screen); `currencyDisplay` symbol/code/narrowSymbol/name. Red/green is decoration only: add "-" or parentheses, "Credit/Debit" or arrows (WCAG 1.4.1); status pills = icon/shape + text + color (Carbon: ≥ 2 of icon/shape/color/text, 3 attention tiers, 3:1 contrast, test in grayscale). Group transaction lists by day with day totals; separate "Pending" and "Posted" (banking convention, memory). `[S][C]`
- Status badges: short text (≤ ~16 chars `[H]`), sentence case; Atlassian lozenges 200px max width then truncate (not focusable, so keep short); ≤ 5 distinct statuses per object type (GOV.UK task list: each added status is harder to remember; reserve red for errors); same vocabulary in list, detail and filters.

## 11. Hover-only controls fail on touch

NN/g: tooltips don't exist on touchscreens; use tap-triggered popup tips from a "?"/"i". Primer: row actions must stay visible, not appear on hover. Carbon: overflow menus persist when the UA lacks hover. HIG: context menus are hidden by default: provide commands elsewhere. Rule: if an affordance appears only on `:hover`, make it visible by default under `(hover: none)` or `(pointer: coarse)` (always-visible "…" button) and replace tooltip help with tap-to-open help text or inline hints. WCAG 1.4.13: hover/focus content must be dismissible, hoverable, persistent.

## 12. KPI tiles, dashboards, charts

- Mobile dashboards are **attention-first**: ordered by importance, a few headline numbers, simplified charts, detail on drill-down. The evidence for a specific count is weak: "1-3 headline metrics" is our opinion `[H]`; vendor blogs say 4-5 KPIs per view (heuristic, T4); Carbon says highest-priority metrics at top and limit them (no mobile or accessibility guidance on its page).
- Recipe: (1) top block "Needs attention" (counts of overdue/pending approvals/alerts, each tappable to a pre-filtered list); (2) then 3-5 KPI tiles (value + delta + period + optional sparkline; status icon + text); (3) then one primary chart per card, bar/line only, direct labels, tap-to-show-value with a persistent readout line (not a hover tooltip); (4) a "View table" toggle (accessible data-table fallback) on every chart; (5) period/campus/class filters in one sheet; (6) role-based default layout; no pies/gauges for magnitude (NN/g: length/2-D position encode quantity best; ~8% of males are color-blind). Approval workflows/task-inbox: SAP list-report + Workday patterns (product-patterns.md).
- HIG charts: simple charts, reveal detail gradually, maximize plot width in compact layouts, short y-axis labels, units in the title, don't hide critical information behind interaction, expand hit targets for small marks, Audio Graphs for VoiceOver, accessibility labels with actual values ("60 minutes", not "rapid increase"), never color alone. Carbon: direct labels over long legends; tooltips are hover-based. W3C complex images: short description + long description or adjacent data table. Native: Swift Charts `accessibilityLabel`/audio graphs; Compose Canvas charts need `semantics { contentDescription }` + table fallback; web SVG `role="img"` + a `<table>` sibling.
- Dashboards: role-based, "what needs my attention" vs analytics are different products: ask which one the user needs.

## 13. Enterprise forms and field use

Long forms → section/accordion/step flows with visible progress and resumability; use device capabilities instead of typing. GOV.UK: one thing per page; progress indicators "do not scale well on small screens" so test without; back link on every page; never ask for data already known; "(optional)" instead of asterisks; avoid sliders. GOV.UK task list for long multi-session transactions with a user-controlled "Have you completed this section?". NN/g wizards: novices/infrequent tasks; step list with current position; allow exit and resume. NN/g mobile UX: typing is costly, use camera/GPS, save state. MDN `capture`: `<input type=file accept="image/*" capture="environment">` opens the rear camera on mobile (hint only; not Baseline). Rule: > ~7 fields or mixed concerns → split into sections (accordion for review, steps for first-time) with autosave draft; receipts/ID/documents → camera capture + upload progress + retry; multi-session (HR onboarding) → task-list page with per-section status. Forms detail: forms.md. `[R]`

## 14. Offline, field use, and sync status

Google Design Offline: show an offline-pin icon + word when content is available offline; cloud-off + "no internet" when unavailable; show file size before downloads; progress with pause/cancel; make offline content discoverable (dedicated tab/button); snackbar on reconnect when queued work completes. Rule: in the field show a persistent but thin connectivity/sync indicator (Synced / Syncing n / Offline: n changes queued / Failed: retry), queue writes in a local outbox, never block reads of cached data, show "last updated" on cached lists, provide a foreground "sync now" because Background Sync is Chromium-only. PWA: custom offline page precached at SW install; IndexedDB for data. More in states-feedback.md.

## 15. Export and reporting on mobile

Primary action = Share (native share sheet with file or link; Web Share API needs HTTPS + user activation, not Baseline) with fallbacks "Email me the link" and "Copy link"; desktop-only "Download CSV/XLSX" stays at ≥ medium width; generate server-side and show status for large reports. NN/g complex applications: support transitions between tools including export (Excel/PowerPoint/image/copy). No source on "email link vs download" for mobile; iOS Safari handles downloads awkwardly in standalone PWAs (memory): prefer the share sheet or an emailed/in-app link to a server-generated report with expiry. `[R][H]`

## 16. Domain patterns (inference; labeled by confidence)

| Domain pattern | Recommended mobile pattern | Evidence anchor | Confidence |
|---|---|---|---|
| Attendance marking | Class roster as a vertical list; each row = photo/name + 3-4 segmented states (Present/Absent/Late/Excused) or single tap-to-cycle + "Mark all present"; sticky "Save/Submit (n of 32 marked)" bar; unmarked clearly different from "present"; autosave | selection/bulk, segmented ≤ 5 (HIG), WCAG 2.5.1, 44pt targets | inference |
| Grade entry | One student per screen (swipe/next) OR list with numeric keypad `inputmode="decimal"`; show validation range; never a spreadsheet grid on phone; sticky "next ungraded" | inline edit rules, NN/g typing cost | inference |
| Timetable/calendar | Agenda/day view default on compact; week as horizontal day-pager or 3-day; month only as a navigator that opens the day agenda | Android reveal-more-on-larger; Google Calendar convention (memory) | opinion |
| Student/employee/contact profile | Header (photo, name, key status) + tabs/segmented sections (≤ 5) or accordion; actions (call, message) in a sticky bar; permissions hide sections | HIG segmented/tab guidance; progressive disclosure ≤ 2 levels | inference |
| Parent-facing vs teacher-facing | Different IA per role: parent = "what happened / what's due / pay" (feed + child switcher); teacher = "do my tasks" (rosters, grading); don't share one navigation | role-based dashboards (Fiori), KPI recipe | opinion |
| Announcements/feed | Feed layout, unread state, pinned items, acknowledgment ("Seen") for mandatory notices | Material feed canonical layout | inference |
| Fee payment | Balance + due date first; pay CTA sticky; itemized list with status pills; receipt via share sheet; platform wallet payment sheet | status pills, export | opinion |
| Leave request/approval | Inbox list (requester, dates, days, balance impact) → detail → Approve/Reject with optional comment; batch approve for homogeneous items; undo | bulk, "needs attention", GOV.UK statuses, Workday | inference |
| Timesheets | Day-by-day entry list with weekly total footer; copy-previous-week; submit sticky | enterprise forms | opinion |
| Expense receipts | Camera capture first, OCR prefill, minimal fields; offline queue | `capture`, offline | inference |
| Org directory | Search-first list with scopes; tap → contact card with call/message/email | HIG searching | inference |
| Payslips | Summary card (net pay) → breakdown accordion → share/download PDF; biometric re-auth | KPI recipe, export | opinion |
| CRM contact list/detail, call logging | Search + recent; detail with sticky call/email; post-call quick-log sheet | filters, inline edit | opinion |
| Pipeline kanban | Do not port horizontal kanban: a stage selector (segmented if ≤ 5 stages, else scrollable chips) over a list of deals; "Move to stage" action instead of drag | WCAG 2.5.7 (strong), HIG segmented ≤ 5, HIG drag alternatives | inference (strong on non-drag alternative) |
| Finance transactions | Group by day with a day header; merchant/title left, amount right (tabular, signed); pending vs posted separated; search + filter chips | numeric formatting, banking convention | opinion |
| Permission-based UI | Hide modules a role can never access; for temporarily unavailable features keep the control visible with a reason (HIG: never disable/hide tab bar buttons for transient unavailability) | HIG tab bars | inference |

## 17. Comparison tables

Table patterns

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Card / stacked key-value | Readable, touch-friendly, no overflow | Loses cross-row comparison; long | Directories, tickets, invoices, leave requests; < few dozen visible | Numeric comparison; many rows per screen needed |
| Key columns + expand/pop-in | Compact scan + full detail in place | Extra taps; `aria-expanded` toggles | 6-12 columns where 1-2 identify the row | Users compare hidden columns |
| Scroll + sticky col + sticky header | Preserves semantics and comparison | Needs overflow cue; 2-D scroll fatigue | Grades, finance, schedules | Casual lookups; < 4 columns (just fit) |
| Pivot | Fits wide, short datasets | Unfamiliar; header semantics tricky | Timetables, comparing 2-4 entities | Long row lists |
| Master-detail | Matches phone nav; list-detail on tablets | Needs state restore | Entities with many attributes | One-glance numeric tables |
| Summary + drill-down | Fast "what matters" | Hides raw data | Manager views, analytics | Data entry/audit |
| Bottom-sheet row detail | Keeps list context | Limited height; not for long edits | Quick read/edit of 3-6 fields | Long forms (use full screen) |
| Column chooser / in-view filter | User controls density | Setup cost; persistence | Power users on tablet | Casual users |
| Segmented views (Overview/Details/History) | Splits one big table by task | ≤ 5 segments | Profiles, deals | Many categories |

Filter patterns

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Bottom sheet + sticky "Show N results" | Thumb-reachable, batch, count preview | Hides results behind the sheet | 3-10 facets | > 5 groups with long option lists (full-screen) |
| Full-screen filter page | Max space, deep facets | Context loss | Complex enterprise filters, saved views | Quick 1-2 filters |
| Overlay tray with live results behind | Immediate feedback | Partial results; refresh jank | Fast, small datasets | Slow queries |
| Filter chips row | One-tap, visible state | Limited options; overflow | 3-6 common states | Many dimensions |
| Live (instant) apply | Fewer taps | Disorienting refresh, request storm | Single-category, local data | Multi-category, remote data |
| Applied-filters summary | Orientation, removal | Uses vertical space | Always | n/a |

Dashboard layouts

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| "Needs attention" inbox-first | Action-oriented | Needs good prioritization | Approvals, school ops, HR | Pure analytics users |
| KPI tile stack (3-5) + drill-down | Fast status | Can become tile soup | Managers, owners | > 6 tiles |
| Single-chart cards + segmented timeframe | Simple, accessible | Little comparison | Trends | Multi-series analysis |
| Horizontal KPI carousel | Saves height | Hidden items, a11y, no scroll cue | 2-3 secondary KPIs only | Primary KPIs |
| Pinned/customizable widgets | User relevance | Setup effort | Power users | New users |

## 18. Anti-patterns

Squeezed desktop tables with 8-10 columns → card/pop-in/scroll with sticky column. Horizontal scroll without an overflow cue → clipped next column + arrows. Hover-only controls → always-visible overflow. Tiny text in dense UIs (< 12px) → ≥ 12-14. Modals-on-modals → one sheet. Desktop mega-forms → sections/steps. Fixed-pixel layouts → rem/size classes. `100vh` bugs → `svh`/`dvh`. Selection without a count or exit → contextual bar. Inline cell edit on phones → sheet edit. Pies/gauges for magnitude → bars/lines. Red/green only for money sign → sign + text. Infinite scroll for admin lists → Load more/pagination with position restore. Horizontal KPI carousels for primary KPIs → vertical stack. Grid-like kanban boards → stage selector + "Move to".

## 19. Evidence limits

m3.material.io unfetchable; SAP Fiori and Salesforce Lightning doc sites returned 403/empty shells (their claims are snippets, though SAP/Salesforce pages were later read in a browser pane per product-patterns.md); school/HRIS/CRM/finance domain patterns have no primary sources; "1-3 headline metrics" has no evidence; mobile card transform "falls apart past a few dozen records" is an unsourced snippet; the 12% / 4-5 KPI / density numbers come from design-system pages and vendor blogs, not studies.
