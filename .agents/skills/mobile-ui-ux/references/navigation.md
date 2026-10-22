# Navigation, gestures, touch ergonomics, information architecture

Read this when: designing app structure or top-level navigation, adding any gesture (swipe, long-press, drag, pull-to-refresh, pinch), placing controls for one-handed use, handling Back/deep links, sizing tap targets, laying out search/filter/sort, or deciding push vs sheet vs modal.

Tags: `[S]` WCAG · `[P-iOS]` `[P-AND]` `[P-WEB]` platform · `[R]` research (sample noted) · `[C]` consensus convention · `[H]` heuristic/our judgment. Research date 2026-10-06.

Contents: 1 Choose the navigation container · 2 Tab bar rules · 3 State, Back, deep links · 4 Overlays: push vs sheet vs modal · 5 Sticky and hide-on-scroll chrome · 6 Wayfinding · 7 Search, filter, sort · 8 Gestures · 9 Touch size and ergonomics · 10 Edges, safe areas, keyboard · 11 Information architecture · 12 Comparison tables · 13 Anti-patterns · 14 Evidence limits

---

## 1. Choose the navigation container

| Situation | Use | Notes |
|---|---|---|
| 3-5 peer top-level destinations, compact width | Persistent bottom tab/navigation bar with icon + visible label | Best-supported pattern: platform convention plus the NN/g hidden-nav study (website-based); the 5-slot cap is convention, not an experiment. For 2 destinations use a segmented control/top tabs. `[P-iOS][P-AND][R]` |
| > 5 top-level destinations | 4 destinations ranked by task frequency + a 5th labeled "More" hub screen (5 slots max, the UIKit cap); add in-page links to key tasks | A labeled hub the user taps is fine; an automatic overflow that silently hides primary sections is not. Reorderable bars beyond 5 (Linear, Teams) only for role-based power users `[H]`. |
| Medium/expanded width (tablet, foldable, landscape, desktop PWA) | Rail (Android, 3-7 items) or tab bar → sidebar (iPadOS; sidebars ≤ 2 levels) | Decide from window width, never `isTablet`. |
| Sibling views inside ONE destination | Top tabs or segmented control (2-5 short labels) | Not for app-level destinations. |
| Task-based single-task apps | Hub-and-spoke (home as menu) | Costs an extra step to switch areas. |
| Many items, secondary/long-tail only | Drawer/hamburger | Only for items outside the core; label it "Menu" with strong contrast. |

Evidence behind "don't hide primary navigation": NN/g's hamburger study (2016; 179 participants, 6 sites, remote; mostly websites) found hidden navigation was used far less (mobile: 57% hidden vs 86% combo; desktop 27% vs 48-50%), cut content discoverability by more than 20%, raised task difficulty +21% (vs visible) and slowed tasks (mobile ~15%, desktop 39%). NN/g's own mobile rule: show links when ≤ 4 top-level links; hide only when > 4. Facebook's 2013 move from drawer to bottom tab bar improved engagement (5-10M-user tests; no numbers published). Redbooth's reported gains (sessions > 2×, duration +70%, DAU +65%) are confounded by a simultaneous feature release. Counter-view (Hoober 2017): "eliminate hamburgers" goes too far; tertiary functions belong behind menus. Net: do not hide core navigation; hidden menus are fine for tertiary items. Strength: moderate for content sites, weak for modern native apps (no post-2020 controlled replication found). `[R][C]`

Rule: IF ≤ 5 regularly used destinations THEN show them persistently. IF a menu icon is unavoidable THEN add a text label, strong contrast and a platform-minimum target.

## 2. Tab bar rules

- 3-5 items. Material: "three to five destinations of equal importance" for compact windows; rail 3-7. HIG gives no number but says avoid overflow; UIKit shows the first 4 + "More" once 6+ exist (5 effective slots); iPad default list ≤ 5. NN/g agrees (> 5 is hard to fit at target size); Hoober is stricter (more than four on a standard iPhone bar, "asking for trouble"). Labels need room to translate. No empirical 5-vs-6 test exists: the number is convention plus geometry (width/5 ≈ 64-86pt per item). Miller's 7±2 is NOT the justification. `[P-iOS][P-AND][R]`
- Always show a visible label on every item (NN/g icon usability: only home, print and magnifier are reliably understood; a clock icon used for history got zero clicks). Material's default label mode shows only the selected label at ≥ 4 items: override to always labeled. Selected state needs ≥ 2 cues (fill + label weight/color), never color alone. `[R][P-iOS]`
- Tab bar = navigation, never actions (HIG). Never hide or disable a tab: show an explanatory empty state. Keep the bar visible on every screen of the section; hiding it makes people lose their place (HIG). Badge only critical info.
- Preserve state per tab (separate stack + scroll position); re-tapping the active tab pops to its root and a second re-tap scrolls to top (convention from memory, not stated in Apple/Android pages). Android: `saveState/restoreState` multiple back stacks; SwiftUI one `NavigationStack` per tab; Flutter `StatefulShellRoute`/`IndexedStack`; RN one stack navigator per tab.
- Selected destination uses fill + weight. Do not nest tab rows ("tabs-in-tabs"): at most two navigation layers visible at once (bottom bar + optional top sibling tabs); a third becomes filter chips, a segmented control or a pushed screen. Top tabs ≤ 4-5 short labels; avoid scrollable top tabs for primary content. NN/g: never mix navigation tabs and in-page tabs in one control; don't stack rows (destroys spatial memory). The "no tabs in tabs" rule has only indirect support `[H]`.

## 3. State, Back and deep links

- **Back must be predictable.** iOS: leading-edge swipe + in-app chevron (use the standard symbol, not a "Back" text label). Android: system back + Up in the app bar; Up never exits the app; same stack within the app task. Back closes the top overlay before navigating. Preserve scroll and state on return (HIG launching also restores state on relaunch). `[P-iOS][P-AND]`
- Android: register back through `OnBackPressedCallback` / `PredictiveBackHandler` (apps targeting API 36 no longer receive `onBackPressed`/`KEYCODE_BACK`); enable callbacks only while they intercept (unsaved-changes dialog, open drawer/sheet).
- **Never hijack Back.** Google Search added an explicit back-button-hijacking spam policy (announced 2026-04-13, enforced from 2026-06-15; can originate in third-party scripts). `pushState` only for real screens users can name; no dummy entries, exit-intent traps, or redirects on `popstate`. `[L][P-WEB]`
- Web/SPA: one history entry per user-visible screen; restore scroll on `popstate` (`history.scrollRestoration`); keep pages bfcache-eligible (no `unload`, avoid `no-store`; ~1 in 5 mobile navigations are back/forward); real URLs, not hash-only state. Navigation API is Baseline since Jan 2026 (MDN). View Transitions can express push/pop direction (Chrome 111+, Safari 18, Firefox 144 same-document) with a reduced-motion fallback.
- **Deep links:** define a route table first; every shareable screen has a stable URL and app link. Android verified App Links (`assetlinks.json`, `autoVerify`) open without a chooser; iOS Universal Links (`apple-app-site-association`, Associated Domains) fall back to Safari. Cold-start deep links must synthesize the parent stack. Mobile-web users land on deep pages without passing home: every page needs orientation (logo/nav). PWA standalone mode has no browser back button: add an in-app back control (`@media (display-mode: standalone)`).
- Onboarding vs login wall: allow browsing and the core task before account creation; ask permissions at point of use with a pre-prompt benefit; NN/g found onboarding tutorials did not improve task performance, so prefer contextual tips with a visible Skip. `[R][P-iOS]`

**"More" defined:** a labeled hub the user taps (an explicit tab opening a screen) is acceptable; an automatic overflow that silently hides primary sections is not. **Long-press:** on a multi-select row it enters selection mode, otherwise it opens the row's context menu; always also a visible "…" and "Select". **History:** use `pushState` for states users would expect Back to undo (applied filter set, open overlay, real screen), `replaceState` for incremental typing, never dummy entries. **Save placement:** short edits (≤ ~5 fields) keep trailing Save in the bar (HIG); long forms use an in-flow end button or a sticky bottom bar. **Selection mode:** the contextual bar replaces the top bar; bottom nav stays unless the bulk bar needs its slot. **Many sections at medium width:** top 5-7 in the rail + a "More" destination, or an expanded rail/sidebar. Bulk "all N matching" destructive actions require a count-named confirm. Web hooks: long-press via a ~500 ms pointer timer plus `contextmenu`; overlays get a history entry or a `popstate` handler.

## 4. Overlays: push vs sheet vs modal

| Pattern | Best use | Avoid when |
|---|---|---|
| Push (stack) | Drill-down into detail; hierarchy | Tasks that branch from the current context |
| Sheet (medium/large detents, bottom sheet) | Short scoped tasks, pickers, filters, share, secondary details; keeps context visible | Multi-step flows, primary navigation, stacked sheets |
| Full-screen modal | Compose, camera/editor, multi-step creation | Simple confirmations; NN/g warns against modal interruptions in checkout |
| Alert/dialog | Destructive/irreversible confirms, blocking errors | Promos, optional info, common undoable actions |
| Popover/menu | Context actions | Primary navigation |

- NN/g accidental-overlay-dismissal (8 participants, qualitative): people dismiss overlays by close button, tap outside, swipe down, browser Back and horizontal swipe; full-page overlays look like pages so Back/gesture loses place. Fixes: Back closes the top overlay, always a visible Close, avoid stacking, prefer partial overlays. NN/g bottom sheets: provide a close button (grab handles are overlooked and swipe is ambiguous with system gestures), support Back, not for multi-step flows or primary nav.
- iOS: grabber on resizable sheets, swipe-down dismiss with an action-sheet confirmation if data would be lost, Cancel leading + Done trailing, Back replaces Cancel in later steps, never Cancel + Done + Back together, one sheet at a time. Material bottom sheets: drag handle min 48dp with accessibility actions, max 640dp wide, predictive-back aware.
- Rule: IF the task is a few fields and context matters THEN a medium-detent sheet with visible Close and Back-closes-sheet. IF multi-step/complex THEN push or full-screen modal. IF unsaved changes AND swipe-dismiss THEN confirm. Max one modal layer. Web: give sheets a history entry or handle `popstate`, trap focus, return focus on close.

## 5. Sticky and hide-on-scroll chrome

- Persistent chrome costs content space (NN/g example chrome-to-content ratios 13:1 good vs 2:1 bad); keep headers small and **opaque** (translucent hurts legibility). Hide-on-scroll is acceptable only if the bar returns on a small reverse scroll (300-400 ms slide-in), the primary action/tab bar stays reachable, hiding is disabled for screen-reader/switch/keyboard users (Material disables `hideOnScroll` under TalkBack), and `scroll-padding-top/bottom` keeps focused fields visible (WCAG 2.4.11). If the bar holds the only primary action, don't hide it. No measured task benefit for hide-on-scroll was found: the justification is screen real estate. `[R][P-AND][S]`
- Budget all persistent chrome (status area + top bar + chip row + bottom bar + banners) and verify with the keyboard open. About 25% of viewport as a review trigger is our heuristic `[H]` (only an ad-industry 30% standard exists).

## 6. Wayfinding

Every screen: a title, a standard Back/Up affordance top-leading, and a selected-state indicator on the current destination. iOS large titles collapse on scroll and return on scroll-to-top, reminding people where they are. HIG: persistent selection highlight in split views. On mobile web replace full breadcrumbs with a single "← Parent" link (NN/g: don't wrap breadcrumbs; keep 1 cm targets; show only the parent level).

## 7. Search, filter, sort

- One primary search location per app. Visible field/bar on the root of content-heavy tabs, not just an icon (NN/g: visible input beat a link/icon on one site, desktop-era evidence). iOS: search tab when search is a primary destination or content is browse-heavy; bottom toolbar for quick lookup; top when bottom content must not be covered. Android: top search bar / app-bar search. Show scope (placeholder, scope bar), recents before typing, suggestions while typing, clearable history. `[P-iOS][P-AND]`
- Filters: button labeled "Filter" with an active-count badge → sheet or full-screen (for > 5 groups) with accordion groups; sticky footer "Show N results" + "Reset"; after applying, show removable chips above results and "Clear all". Sort is a separate control. (Full filter evidence and enterprise patterns in data-dense.md.) `[R: Baymard, NN/g]`

## 8. Gestures

- Core rule: **gestures are accelerators; every important action also has a visible control.** HIG: custom gestures only when necessary, discoverable, simple, distinct, never the only path; indicate when a gesture is unavailable; give immediate feedback. Android: don't rely solely on gestures (add a delete button, custom accessibility actions). WCAG 2.5.1 (A), 2.5.7 (AA), 2.5.2 (A), 1.3.4 (AA). Hidden gestures without indicators are hard for users and automation agents alike (GhostUI, arXiv 2026, abstract only). `[P-iOS][P-AND][S][R]`
- Standard vocabulary (HIG): tap = activate/select; swipe = reveal actions/dismiss/scroll; drag = move; touch-and-hold = reveal more controls; double-tap = zoom; pinch = magnify; rotate. Never redefine standard gestures (three-finger undo, shake).
- **Swipe actions** (NN/g contextual swipe, qualitative): unclear where swipe works, reveals obscure the item, apps use opposite meanings (Spotify save vs delete), horizontal swipe conflicts with back/carousels. Limit to 1-2 actions per side (count is `[H]`), full-swipe only for the least destructive default, always provide undo (snackbar) not a confirm dialog, and mirror every action in a visible overflow/detail path plus screen-reader custom actions. Row with ≥ 2 secondary actions: row tap → detail, "⋯" for overflow, swipe optional.
- **Long-press/context menus** are hidden by default: mirror every item in visible UI; ≤ ~3 groups, one submenu level, destructive last and red. Multi-select: a visible "Select" affordance plus long-press shortcut; contextual action bar shows count and actions.
- **Pull-to-refresh**: acceptable shortcut for remote lists, never the only path (Android: always provide a refresh action in the app bar). Also auto-refresh on open/foreground and show "last updated". Use only for re-fetchable data. Custom web PTR: `overscroll-behavior-y: contain`; for app-like web also stops accidental browser PTR and scroll chaining out of sheets. No HIG or NN/g study was found for PTR (convention only).
- **Drag-reorder**: visible handle + Move up/down or an Edit mode (WCAG 2.5.7). **Pinch/zoom** on maps/images: add +/- buttons; never disable page zoom. **Edge gestures**: the OS owns the edges (below).
- Fire actions on pointer-up inside the target, allow slide-off cancel (WCAG 2.5.2); highlight on touch-down. Gesture progress follows the finger 1:1; haptic on threshold crossing, never per scroll tick.

## 9. Touch size and ergonomics

**Numbers (units named; each from a different standard):**
| Source | Value |
|---|---|
| Apple HIG (iOS/iPadOS) | 44×44pt default, 28×28pt minimum; ~12pt padding around bezeled controls, ~24pt around bezel-less (watchOS 44/28, macOS 28/20, visionOS 60/28, tvOS 66/56) |
| Android / Material / Fluent 2 | 48×48dp (Fluent: 44 iOS/web, 48 Android), ≥ 8dp between targets |
| WCAG 2.2 | 24×24 CSS px AA (spacing exception), 44×44 CSS px AAA |
| Microsoft | 7.5 mm (40×40 px at 135 PPI) |
| NN/g | 1 cm × 1 cm minimum + ~2 mm gap; fingertip 1.6-2 cm, thumb ~2.5 cm |
| Research via Hoober (secondhand): Parhi 2006 | 9.2 mm discrete / 9.6 mm serial one-handed thumb sufficient, no gain at 11.5 mm |
| Henze 2011 (100M taps) | errors rise sharply below 15 mm, > 40% errors for < 8 mm |
| Schildbach & Rukzio 2010 (walking) | 6.74 mm up to 23% errors; ~10 mm much better; 20 mm nearly eliminates |
| Hoober 2017 (own data, 95% of taps) | 7 mm at screen centre, ~9-10 mm edge rows, 12 mm corners; design ~20% larger than you think |

- Rule: interactive area ≥ 44×44 (iOS pt / web px) and ≥ 48×48 dp (Android); the visual icon may be 24 inside the larger hit area (padding, `hitSlop`, `minimumInteractiveComponentSize`, `.contentShape`); ≥ 8 between adjacent targets; make the whole row/card the target. Floor never below 24 CSS px. For high-consequence, edge/corner, walking or one-handed contexts go ~10 mm+ (≈ 48-56dp). Hoober warns pixel standards are "useless" physically (a 7 mm design can render 5-9 mm); treat mm as ergonomic targets and pt/dp/px as implementation floors. `[P-iOS][P-AND][S][R]`
- **How people hold phones — and the thumb-zone critique.** Hoober 2013 (1,333 observations): 49% one-handed, 36% cradled, 15% two-handed; Hoober 2017 supersedes it (he says the 2013 column contains outdated assumptions): ~75% of touches are one thumb, fewer than 50% hold one-handed, people reach the top-corner Back button, most taps land in the centre, and thumb-sweep diagrams are "well-known, but incorrect". Clark (2015): thumbs drive ~75% of interactions; comfort ≠ accuracy (bottom and top-right corners least accurate for right-handers). Park 2008 (via Hoober): bottom is comfortable but least accurate. Phablets: both hands ~70%; tablets: seated 88% of use, thumbs on middle-to-top third of sides, bottom/top edges hostile. Do not cite "49% one-handed" as current. `[R]`
- Placement rule: persistent navigation and the primary action at the bottom edge (comfortable for one-handed use) BUT large (≥ 48), spaced and inset from the gesture bar; primary content in the middle; Back/Close at top-leading (people do reach it); rarely used or destructive controls in corners or menus, away from frequent targets; pad the bottom of long pages so the last item scrolls to mid-screen. Never design "thumb-zone only" layouts; verify on a ≥ 6.5 in device.
- **Accidental-tap prevention**: assume imprecision. Destructive action = separated ≥ 8-16dp from neighbors and not in the default thumb spot, destructive-styled and last in menus, undo (preferred) or explicit-verb confirmation ("Delete 3 photos"). Don't put unrecoverable actions beside frequent ones (Hoober: Send next to formatting). Hold-to-confirm only for irreversible high-stakes actions and needs an accessible tap alternative `[H]`.

## 10. Edges, safe areas, keyboard, foldables

- Android: inward edge swipes from left/right are system Back; bottom-edge swipes are home/recents and apps cannot opt out; don't put critical targets in the bottom gesture inset (~40dp reported by a secondary summary; exclusion rects limited to ~200dp vertical via snippet: re-check); use `setSystemGestureExclusionRects` only for small precision gestures. iOS: `interactivePopGestureRecognizer` pops on a leading-edge swipe. Horizontal carousels: ≥ 16dp side gutter and peek the next card (NN/g: users reach the last item in ~3-4 steps); don't start custom horizontal swipes in the outer ~20dp (exact back-gesture inset in dp not found in primary docs); a drawer opened by edge swipe must also open from a visible button. `[P-AND][P-iOS][R]`
- Always apply top/bottom/left/right insets to bars and FABs (landscape side insets for cutouts). Web: `viewport-fit=cover` + `env(safe-area-inset-*)`. Scroll the focused field above the keyboard with padding; never hide the submit button behind it. Never lock orientation (WCAG 1.3.4; Android ignores locks on ≥ 600dp targeting API 36).
- Foldables/large screens: list-detail = compact push (Back returns to list), regular split panes with persistent selection highlight; keep state across fold/unfold/rotate; avoid key controls on the fold axis. iPhone Duo (HIG, new 2026-09-09): bars may move to the vertical axis on the outer display; use size classes + safe-area insets.

## 11. Information architecture

- Choose navigation by **task frequency** (top level = tasks done weekly), not org chart or feature list (NN/g mini-IA). Before finalizing, run a card sort (≥ 15 participants qualitative, 30-50 quantitative) and a tree test; follow platform idioms where the OS owns behavior (Back, share, dialogs).
- Depth: limit **disclosure within a screen to 2 levels** (NN/g: 3+ signals redesign); the "3-click rule" is a myth (Porter 2003: no extra drop-off after 3 clicks), what matters is clear labels/information scent, wayfinding and fast loads. Cap screen depth at about 3 levels below a tab root `[H]`; use hub/landing pages for ≥ 15 children; NN/g mobile subnavigation: accordion for < 6 subcategories, section menus for 6-15, category landing pages for 15+; avoid sequential drill-in menus (Android Back confuses them). Text lists at broad levels, image grids deeper.
- Content prioritization: first screen shows the essentials; defer secondary content behind expandable sections or secondary pages (many users never open deferred content: label deferred sections clearly, never defer what is needed for the decision). One primary action per screen; secondary actions visibly weaker; tertiary in menus.
- Master/detail: phone = push with Back; tablet/foldable = split panes with persistent selection (≥ 840dp-equivalent). Keep state across size changes.
- Floating/primary actions: one primary action per screen. Android: FAB (56dp, medium 80 recommended, large 96; small 40 deprecated; 16dp margin, never covering list content: add bottom padding). iOS: prominent trailing toolbar action or bottom prominent button. NN/g: don't put Submit in a top bar of a long form; place it at the end of the form or in a sticky bottom bar.
- Deep structure: show title + current location on every screen; each screen should be useful if entered from a deep link.

## 12. Comparison tables

Navigation containers

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Bottom tab/nav bar (3-5) | Always visible, one tap, state per tab (visible/combo nav 86% vs hidden 57% on mobile) | Max ~5; takes 56-80dp; bottom gesture area interplay | App-level destinations of equal importance, compact width | > 5 equal destinations; one-task flows; very short landscape heights (use rail) |
| Drawer/hamburger | Fits many items | Low discoverability; ~15% slower on mobile; edge-swipe conflicts with Back | Secondary destinations, permanent drawer at expanded width, content-first browse | Sole nav for core features |
| Top tabs/segmented | Sibling views of one destination | Overflow hides tabs; farther from thumb | 2-5 views of one content type | App-level nav; nested under another tab row |
| Rail | Persistent nav on wide windows; 3-7 items; FAB slot | 80dp of width | Medium/expanded, landscape, tablets/foldables | Compact portrait phones |
| Sidebar | Many sections, ≤ 2 levels | Space-hungry | iPad/large windows | Compact width |
| Hub | Simple for task-based apps | Extra step to switch | Settings, booking, wizards | Frequent switching |

Action exposure

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Visible buttons | Discoverable, accessible | Space/clutter | Primary 1-2 actions | Many actions per row |
| Overflow "⋯" | Compact, discoverable icon | Hidden items, 2 taps | Secondary/rare actions | Frequent primary action |
| Swipe actions | Fast for experts | No signifier; conflicts with back/carousel; obscures content | Accelerator for 1-2 actions (delete with undo) | Only path; many actions; horizontally paged screens |
| Long-press/context menu | Rich, native | Hidden by default | Shortcuts mirroring visible UI | Core functions; selection entry without a cue |
| Selection mode + action bar | Batch actions, explicit | Needs entry affordance | Multi-select lists | Single-item workflows |

## 13. Anti-patterns (problem → why → better)

1. Hamburger/drawer as sole nav for core features → low salience → visible bar for ≤ 5 core destinations. 2. > 5 bottom tabs or auto-overflow "More" → squeezed labels, hidden sections → consolidate, rail/sidebar on wide windows. 3. Icon-only navigation → ambiguity → icon + visible label. 4. Gesture-only actions (swipe-only delete, pinch-only zoom, drag-only reorder) → invisible, fails 2.5.1/2.5.7 → visible control + gesture accelerator. 5. Hijacking Back → breaks the core expectation and is now a spam violation → `pushState` only for real screens. 6. Unpredictable Back (closes the app/menu instead of the overlay) → Back = undo last layer via the proper dispatcher. 7. Nested tabs-in-tabs; mixing navigation tabs and in-page tabs → one bar + segmented/filters/push. 8. Scroll-jacking/full-viewport snap scroll → native scroll with anchors. 9. Hide-on-scroll that loses the primary action or ignores a11y → keep the primary action fixed. 10. Translucent sticky headers → opaque, small bars. 11. Sticky bars covering focused fields → `scroll-padding`, WCAG 2.4.11. 12. Disabling zoom → never. 13. Stacked modals/sheets; "app within an app" in a sheet → one layer, push for multi-step. 14. Swipe-to-delete without undo, opposite meanings per direction → undo + consistency. 15. Tiny or crowded edge targets → ≥ 44/48 + spacing. 16. Destructive control beside a frequent control → separate + undo. 17. Interactive content under the gesture inset or at the very screen edge → inset it. 18. Carousels flush to the screen edge → gutter + peek. 19. Dots-only paging indicator, ambiguous plus/three-line icons → peek content, carets. 20. Forced login/onboarding before value → contextual tips, deferred registration. 21. Infinite scroll without position restoration → "Load more" + restore. 22. `unload` handlers/`no-store` on app pages → block bfcache. 23. Thumb-zone-only layouts → bottom nav + centre content + top Back.

## 14. Evidence limits

Baymard mobile filter/sort/nav findings were not obtained. The touch-size papers (Parhi, Henze, Park, Lee, Schildbach) were not read directly; their numbers come through Hoober's notes. Facebook has no published numbers; Polar/Zeebox/Spotify cases are unverified. No Apple HIG page on navigation styles or pull-to-refresh was found. The Android back-gesture inset in dp, swipe-action usage rates, hide-on-scroll task impact and tablet/foldable reach data newer than 2015 are unknown. The hamburger study is 2016, website-heavy; the 5-tab limit, "tabs in tabs" rule, 3-level screen depth cap and swipe-actions-per-row count are convention or judgment.
