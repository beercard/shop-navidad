# Slice 05 — Mobile navigation, gestures, touch ergonomics, information architecture

Research date: 2026-10-06. Written under a coordinator "stop and write" instruction, so some planned topics are in Gaps.
Tag honesty note: WebFetch returns a small-model summary of the page, not raw text. Where I also downloaded the raw page (Apple HIG JSON, Hoober/UXmatters, WCAG Understanding pages, Google blog, ALA/Clark) I mark `VERIFIED-RAW`. Where I only saw the summary I mark `VERIFIED` (summary may paraphrase loosely; re-check before hard-coding a number). `SNIPPET` = search-result excerpt only. `MEMORY` = not re-verified.
WebSearch budget ran out mid-session (shared cap), so Baymard and several product case studies could not be located.

## Sources consulted (table)

| URL | Tier | Verified? |
|---|---|---|
| https://developer.apple.com/design/human-interface-guidelines/tab-bars (via .../tutorials/data/design/human-interface-guidelines/tab-bars.json) | T1 | VERIFIED-RAW (change log: updated June 8, 2026 "terminology and art") |
| HIG accessibility.json, gestures.json, toolbars.json, sheets.json, modality.json, action-sheets.json, context-menus.json, drag-and-drop.json, undo-and-redo.json, search-fields.json, searching.json, scroll-views.json, split-views.json, sidebars.json, going-full-screen.json, onboarding.json, launching.json, lists-and-tables.json, playing-haptics.json, designing-for-iphone-duo.json (same base URL pattern) | T1 | VERIFIED-RAW (flattened to text) except iphone-duo, scroll-views, search-fields = summary only |
| https://developer.apple.com/design/whats-new/ | T1 | VERIFIED (summary): HIG updates Jun 8 2026 (tab bars, search, scroll views), Sep 9 2026 (Layout, iPhone Duo) |
| https://developer.apple.com/documentation/uikit/uitabbarcontroller (JSON) | T1 | VERIFIED-RAW (More-tab rule) |
| https://developer.apple.com/documentation/uikit/uinavigationcontroller/interactivepopgesturerecognizer (JSON) | T1 | VERIFIED-RAW |
| https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content | T1 | VERIFIED (summary) |
| https://developer.android.com/develop/ui/compose/components/navigation-bar | T1 | VERIFIED (summary): "three to five destinations of equal importance" |
| https://github.com/material-components/material-components-android (docs: BottomNavigation, NavigationRail, TopAppBar, BottomAppBar, FloatingActionButton, BottomSheet .md) | T1 (official M3 component docs) | VERIFIED (summary) |
| https://developer.android.com/design/ui/mobile/guides/foundations/system-bars, /predictive-back, /accessibility | T1 | VERIFIED (summary) |
| https://developer.android.com/guide/navigation/principles, /backstack/multi-back-stacks, /custom-back/predictive-back-gesture | T1 | VERIFIED (summary) |
| https://developer.android.com/about/versions/16/behavior-changes-16 and /17/behavior-changes-17 | T1 | VERIFIED (summary) |
| https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes, /build-adaptive-navigation, /list-detail | T1 | VERIFIED (summary) |
| https://developer.android.com/develop/ui/views/touch-and-input/gestures/gesturenav ; /swipe/add-swipe-interface ; /compose/components/pull-to-refresh ; /guide/topics/ui/accessibility/apps ; /haptics/haptics-principles ; /training/app-links | T1 | VERIFIED (summary) |
| https://m3.material.io/* | T1 | FAILED (ECONNREFUSED on single attempt, per brief moved on). Material 2 pages return empty shell. |
| https://www.w3.org/WAI/WCAG22/Understanding/{target-size-minimum, target-size-enhanced, dragging-movements, pointer-gestures, pointer-cancellation, focus-not-obscured-minimum, orientation, resize-text}.html | T1 | VERIFIED-RAW |
| https://developer.mozilla.org (env(), touch-action, overscroll-behavior, History API, Navigation API, History.scrollRestoration, meta viewport) | T1 | VERIFIED (summary) |
| https://web.dev/articles/bfcache ; https://web.dev/learn/pwa/app-design ; https://developer.chrome.com/docs/web-platform/view-transitions/ ; https://developer.chrome.com/blog/viewport-resize-behavior | T1/T3 | VERIFIED (summary) |
| https://developers.google.com/search/blog/2026/04/back-button-hijacking ; https://developers.google.com/search/docs/essentials/spam-policies | T1 | VERIFIED-RAW (blog), VERIFIED (policy page "last updated 2026-08-28") |
| https://learn.microsoft.com/en-us/windows/apps/design/input/guidelines-for-targeting ; https://fluent2.microsoft.design/layout | T1 | VERIFIED (summary; raw page header shows 2026-09-27 update) |
| https://www.nngroup.com/articles/hamburger-menus/ (2016-06-26) | T2 | VERIFIED (fetched twice, consistent) |
| NN/g: find-navigation-mobile-even-hamburger, support-mobile-navigation, mobile-navigation-patterns, mobile-subnavigation, mobile-tabs? (404) / tabs-used-right, icon-usability, touch-target-size, contextual-swipe, iphone-x, 3d-touch, mobile-carousels, 4-ios-rules-break, accidental-overlay-dismissal, bottom-sheet, sticky-headers, 3-click-rule, breadcrumbs, progressive-disclosure, defer-secondary-content-for-mobile, mini-ia-structuring-information, image-vs-list-mobile-navigation, split-buttons-navigation, mobile-accordions, infinite-scrolling-tips, tablet-usability, surface-duo, login-walls, mobile-app-onboarding, mobile-instructional-overlay, mobile-native-apps, mobile-faceted-search, filter-categories-values, search-visible-and-simple, modal-nonmodal-dialog, tree-testing, card-sorting-definition | T2 | VERIFIED (summaries) |
| UXmatters, Steven Hoober: 2013-02 "How Do Users Really Hold Mobile Devices?" ; 2017-03/05/07 "Design for Fingers, Touch, and People" Parts 1-3 | T2 | VERIFIED-RAW (parts 1-3); 2013 column VERIFIED (summary) |
| https://alistapart.com/article/how-we-hold-our-gadgets/ (Josh Clark, Designing for Touch excerpt, 2015-11-03) | T2 | VERIFIED-RAW |
| https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/ | T4 | VERIFIED (summary) |
| https://www.lukew.com/ff/entry.asp?1945 "Obvious Always Wins" (2015-04-27) | T2/T3 | VERIFIED (summary) |
| https://techcrunch.com/2013/09/18/facebooks-new-mobile-test-framework-births-bottom-tab-bar-navigation-redesign-for-ios-5-6-7/ ; https://redbooth.com/blog/hamburger-menu-iphone-app | T3 | VERIFIED (summary) |
| https://lawsofux.com/{jakobs-law,fittss-law,millers-law,hicks-law}/ | T4 (curated) | VERIFIED (summary) |
| https://arxiv.org/abs/2411.00381 (Tappy, Yamanaka et al., 2024) ; https://arxiv.org/abs/2601.19258 (GhostUI, Jan 2026) | T2 | VERIFIED (abstract only) |
| https://en.wikipedia.org/wiki/Pull-to-refresh | T4 | VERIFIED (summary) |
| Baymard mobile filtering/sorting/navigation | T2 | NOT OBTAINED (see Gaps) |

---

## Findings

### F1 Hidden primary navigation measurably hurts discoverability and speed (NN/g hamburger study)
- Claim: Navigation hidden behind a menu button is used far less and makes tasks slower and harder than visible or combo (some links visible + a menu) navigation. Effect is bigger on desktop, but real on mobile.
- Evidence: NN/g "Hamburger Menus and Hidden Navigation Hurt UX Metrics" (2016-06-26) https://www.nngroup.com/articles/hamburger-menus/ — T2 — VERIFIED (two fetches agree). 179 participants, 6 live sites, desktop + smartphone, remote testing with WhatUsersDo. Numbers: nav usage desktop hidden 27% / combo 50% / visible 48%; mobile hidden 57% / combo 86%. Content discoverability drop >20% with hidden nav. Task-difficulty rating (1-7): hidden 2.6, combo 2.3, visible 2.1 (+21% hidden vs visible, +11% vs combo). Task time: desktop at least 39% slower; mobile 15% slower; mobile users overall 12% slower than desktop. Time to first nav use: desktop hidden 31s vs combo 23s vs visible 26s; mobile hidden 26s vs combo 24s.
- Companion: https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/ — T2 — VERIFIED. Same 179 users. Best: Supermarket HQ 89% nav usage; worst: Bloomberg 44% (low-salience arrow icon). Discoverability drivers: icon salience, placement at top, distinct from logo, hybrid (visible + hidden), repeating nav (footer/bottom). If hiding: high contrast, text label, clear tappable signifier.
- Corroboration / conflict:
  - NN/g's own stated mobile rule: show links if ≤4 top-level links; hide only if >4 (same article) — VERIFIED.
  - Facebook 2013: bottom tab bar beat side drawer across engagement/satisfaction/revenue/speed metrics in tests with 5–10M users; no numbers published — TechCrunch https://techcrunch.com/2013/09/18/facebooks-new-mobile-test-framework-births-bottom-tab-bar-navigation-redesign-for-ios-5-6-7/ — T3 — VERIFIED (summary).
  - Redbooth moving hamburger to tab bar: sessions more than doubled, session duration +70%, DAU +65% — but release also shipped chat and testing was informal (company's own caveat) — https://redbooth.com/blog/hamburger-menu-iphone-app — T3 — VERIFIED (summary). Treat as confounded.
  - LukeW "Obvious Always Wins" lists Polar and Zeebox engagement drops after moving to toggle/drawer; I could not verify the numbers (TheNextWeb fetch failed) — T3 — VERIFIED only that the post makes the claim.
  - Counter-view: Hoober 2017 says "hamburger must be eliminated" goes too far; in his tests 100% of participants found an option on the menu within seconds, but advises tertiary functions only behind menus — UXmatters Part 1 — T2 — VERIFIED-RAW (his own small tests, not a published study).
  - NN/g mobile-navigation-patterns: hamburger = high space efficiency, low discoverability; fine for browse-heavy sites where nav is secondary — T2 — VERIFIED.
- Scope: universal (study mostly content/ecommerce sites, 2016; apps not separately tested).
- Context (when it flips): many top-level destinations (>5), content-first/browse sites, tertiary items (settings, help, legal). Study did not fully test the visible-only condition on mobile (per summary of limitations).
- Agent rule: IF the product has ≤5 top-level destinations used regularly THEN show them persistently (tab bar / bottom nav / rail) and never put them only behind a menu icon. IF >5 THEN visible bar for the top 3–5 by task frequency + one menu/"More" for the remainder, and add in-page links to key tasks from the home screen. IF a menu icon is unavoidable THEN give it a text label ("Menu"), strong contrast, ≥ platform min target.
- Stack notes: Web: duplicate main nav as footer links or in-page task links (NN/g support-mobile-navigation, VERIFIED).

### F2 Bottom/tab bar item counts: 3–5 is the platform convention; research only says "hard to fit more"
- Claim: Material says 3–5 destinations; Apple gives no hard number but says fewer is easier and avoids More; iPhone UIKit shows a More item when ≥6 tabs (so 5 effective slots).
- Evidence:
  - Material (Compose docs): "Three to five destinations of equal importance" for compact windows — https://developer.android.com/develop/ui/compose/components/navigation-bar — T1 — VERIFIED (summary). Material Components Android: "Navigation bars can have three to five destinations", max 5 menu items — T1 — VERIFIED (summary). m3.material.io snippet says the same and warns >5 collides and leaves no room for translated labels — SNIPPET.
  - Apple HIG tab bars: "appropriate number of tabs", fewer is easier; avoid overflow More tab; iPad customizable tab bar: default list of five or fewer; don't hide/disable tabs when empty (explain emptiness) — https://developer.apple.com/design/human-interface-guidelines/tab-bars — T1 — VERIFIED-RAW.
  - UIKit UITabBarController: with six or more view controllers it shows the first four plus a standard More item — T1 — VERIFIED-RAW.
  - NN/g: more than 5 options is hard to fit while keeping touch-target size — https://www.nngroup.com/articles/mobile-navigation-patterns/ — T2 — VERIFIED (summary).
  - Hoober 2017: more than four items on an iOS bar (five on largest phones) "asking for trouble" — Part 3 — T2 — VERIFIED-RAW.
- Corroboration / conflict: Platform + NN/g + Hoober converge on ≤5. No empirical study comparing 5 vs 6 tabs was found; the number is convention + geometry (width/5 on a 320–430pt screen ≈ 64–86pt per item). Miller's 7±2 is NOT the justification (lawsofux explicitly warns against using it for menus) — VERIFIED (summary).
- Scope: universal (iOS/Android phones). Rails/sidebars have higher limits (see F3).
- Context (when it flips): tablets/foldables/landscape use rail or sidebar; apps with deep sections use a sidebar-adaptable tab bar on iPad.
- Agent rule: IF destinations ≤5 THEN bottom bar. IF 6+ THEN consolidate (merge, move to profile/settings) before adding a More tab; if unavoidable, make "More" an explicit labeled hub, never an auto-overflow with hidden primary sections. Never disable/hide a tab; show an empty state with explanation (HIG).
- Stack notes: Compose `NavigationBar` + `NavigationBarItem(label=…)`; SwiftUI `TabView` with `Tab`; Flutter `NavigationBar` (M3) asserts 2–5 destinations (MEMORY); RN `@react-navigation/bottom-tabs` has no cap, enforce yourself.

### F3 Match navigation component to window size, not device
- Claim: bar on compact widths; rail (or sidebar) on larger; drawer for many destinations or expanded.
- Evidence: Android window size classes: width compact <600dp, medium 600–<840, expanded 840–<1200, large 1200–<1600, extra-large ≥1600; height compact <480, medium 480–<900, expanded ≥900 (99.96% of phones in portrait are width-compact; 99.78% of phones in landscape are height-compact) — https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes — T1 — VERIFIED (summary). NavigationSuiteScaffold default: navigation bar if width or height is compact or in tabletop posture; rail otherwise; drawer is an opt-in custom choice at expanded — https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation — T1 — VERIFIED (summary; the summarizer's own table contradicted its quoted sentence for "medium", I trust the sentence).
  - Rail: 3–7 destinations collapsed, 80dp wide default (96dp in M3 Expressive), optional FAB/menu in header — material-components-android NavigationRail.md — T1 — VERIFIED (summary).
  - Apple: use size classes not device/orientation; iPad tab bar sits at top and can convert to a sidebar; sidebars show at most two levels, do not hide by default; split views belong in regular (not compact) width — HIG layout, tab-bars, sidebars, split-views — T1 — VERIFIED-RAW.
- Scope: iOS / Android / universal principle.
- Agent rule: IF width class compact THEN bottom bar (≤5). IF medium/expanded THEN rail (Android) or tab bar→sidebar (iPadOS). IF landscape phone (height compact) THEN bar/rail but limit chrome height. Drive from available window width (including split-screen/foldable), never from `isTablet`.
- Stack notes: CSS container/media queries on width; Flutter `LayoutBuilder` + `NavigationRail`/`NavigationBar`; SwiftUI `horizontalSizeClass`, `.tabViewStyle(.sidebarAdaptable)` (MEMORY for the exact modifier name).

### F4 Icons need labels (navigation especially)
- Claim: Only a handful of icons are self-explanatory; nav icons should carry a visible text label.
- Evidence: NN/g Icon Usability https://www.nngroup.com/articles/icon-usability/ — T2 — VERIFIED (summary): only home, print, magnifying glass are widely understood; a label must accompany icons and be always visible for navigation; hamburger, heart/star ambiguous; a clock icon used for history got zero clicks; "5-second" recognizability check. Apple HIG: include tab labels, single words — VERIFIED-RAW. Material Components default `labelVisibilityMode=auto` shows labels for ≤3 items and only the selected label for 4+ (a component default, not a design rule) — VERIFIED (summary). Hoober: "People tap only what they see"; boundary/box tappable things — Part 3 — VERIFIED-RAW. NN/g tabs: labels 1–2 words, avoid ALL CAPS, plain language — VERIFIED (summary).
- Corroboration / conflict: Android's auto label hiding conflicts with NN/g/HIG; choose `labeled` always. A claim that adding the word "Menu" to a hamburger gave +42% clicks appears only in a blog excerpt — SNIPPET, vendor anecdote, do not cite as evidence.
- Scope: universal.
- Agent rule: IF an icon is not home/search/(print) THEN pair with a visible label. In bottom bars, show labels on all items (set labeled mode). Selected state needs ≥2 cues (NN/g tabs-used-right: e.g., color + underline/weight/fill) and must not rely on color alone.

### F5 Preserve per-tab state; back must be predictable
- Claim: Each tab keeps its own navigation stack and scroll position; re-tapping the active tab pops to root/scrolls to top; back retraces history; Up never exits the app.
- Evidence:
  - Apple HIG tab bars: tabs "preserve the current navigation state within each section"; keep tab bar visible (hiding it makes people forget where they are) except under modals — VERIFIED-RAW.
  - Android Navigation: multiple back stacks via `saveState`/`restoreState` for bottom-nav tabs; fixed start destination; Up and Back identical within the app task; Up never exits the app; deep links synthesize a back stack — https://developer.android.com/guide/navigation/backstack/multi-back-stacks and /principles — T1 — VERIFIED (summary).
  - HIG launching: restore previous state including scroll position on relaunch — VERIFIED-RAW.
  - Web: `history.pushState/replaceState/popstate`; initial entry has no state unless you `replaceState`; `history.scrollRestoration` auto|manual (widely available since Jan 2020); Navigation API (`navigate` event, `intercept()`, `scroll()`) is "Baseline 2026 newly available" since Jan 2026 — MDN — T1 — VERIFIED (summary). bfcache: 1 in 10 navigations on desktop and 1 in 5 on mobile are back/forward; avoid `unload` handlers and `Cache-Control: no-store` to stay eligible — web.dev — T1 — VERIFIED (summary).
  - NN/g infinite scroll: returning via Back often lands at the top of a long feed; pagination/"load more" restores more gracefully — VERIFIED (summary).
- Scope: universal; iOS/Android specifics above.
- Agent rule: IF tabbed THEN keep each tab's stack + scroll alive (Compose `saveState/restoreState`; SwiftUI one `NavigationStack` per tab; Flutter `StatefulShellRoute`/IndexedStack; RN one stack navigator per tab). IF re-tap active tab THEN pop to its root; second re-tap scrolls to top (convention, MEMORY — Apple/Android docs did not state this in the pages I read). IF web SPA THEN one history entry per user-visible screen, restore scroll on popstate, use bfcache-friendly pages.

### F6 Never hijack Back (now a Google Search spam violation)
- Claim: Manipulating history so Back does not return to the previous page is explicitly punished.
- Evidence: Google Search Central blog, April 13, 2026: new explicit "malicious practices" spam policy for back button hijacking, enforcement from June 15, 2026, manual actions or automated demotion; may originate from third-party libraries/ad platforms — https://developers.google.com/search/blog/2026/04/back-button-hijacking — T1 — VERIFIED-RAW. Spam-policies page lists it (page last updated 2026-08-28) — VERIFIED (summary). MDN History API guide cautions against trapping users — VERIFIED (summary).
- Corroboration: NN/g — Back is the lifeline; a "Back" link that behaves like cancel breaks expectations (search snippet; the overlay article was fetched — F7) .
- Scope: Web/PWA (policy), universal principle.
- Agent rule: NEVER push dummy history entries, intercept Back to show promos/exit-intent, or redirect on popstate. `pushState` only for real screen/state changes the user can name. Audit third-party scripts for history manipulation.

### F7 Overlays, sheets and modals: one dismissal model, Back must close the top layer
- Claim: Overlay/sheet dismissal causes accidental navigation loss; support every expected dismissal method consistently, never stack.
- Evidence: NN/g accidental overlay dismissal (8-participant study) — five dismissal methods (close button, tap outside, swipe down, browser Back, horizontal swipe); stacked/full-page overlays look like pages so people hit Back/gesture and lose place; fix: support Back as "undo/close", always have a visible Close, avoid stacking, prefer partial overlays — https://www.nngroup.com/articles/accidental-overlay-dismissal/ — T2 — VERIFIED (summary). NN/g bottom sheets: provide close button (grab handles are overlooked, swipe is ambiguous with system gestures), support Back, not for multi-step flows or primary navigation, don't stack — VERIFIED (summary). Apple HIG sheets: medium/large detents, grabber on resizable sheets, support swipe-down dismiss and confirm via action sheet if data would be lost, Cancel (leading) + Done (trailing), Back replaces Cancel in later steps of multistep flows, never show Cancel+Done+Back together, one sheet at a time, nonmodal sheets exist (button placement guidance updated Mar 24, 2026) — VERIFIED-RAW. HIG modality: use modal only for critical info, narrowly scoped tasks, immersion; no "app within an app"; dismiss one modal before presenting another; full-screen for in-depth/multistep (photo/video/editing) — VERIFIED-RAW. Material bottom sheet: modal vs standard, drag handle with 48dp min touch size and accessibility actions (tap cycles states), max width 640dp, modal sheets support predictive back; standard sheets need an `OnBackPressedCallback` — VERIFIED (summary). NN/g modal vs nonmodal: modals for destructive/irreversible/required info; avoid for checkout or nonessential promos; nonmodal dialogs become full-screen modals on mobile — VERIFIED (summary).
- Scope: universal.
- Agent rule: IF a task is ≤ a few fields and context matters THEN sheet (medium detent) with visible Close + Back-closes-sheet. IF multi-step/complex THEN push or full-screen modal with Cancel/Back rules above. IF unsaved changes AND swipe-dismiss THEN intercept and confirm with an action sheet/discard dialog. Max one modal layer. Web: give sheets a history entry or handle `popstate`/Back to close, trap focus, return focus on close.

### F8 Sticky / hide-on-scroll chrome: keep small, opaque, restorable; evidence is mostly guideline-level
- Claim: Persistent chrome costs content space; hide-on-scroll is acceptable if the bar returns on a small upward scroll and primary actions are not lost.
- Evidence: NN/g Sticky Headers https://www.nngroup.com/articles/sticky-headers/ — T2 — VERIFIED (summary): keep headers small; opaque with high contrast (translucent hurts legibility); partially persistent (reappear on scroll up) headers: 300–400 ms slide-in, avoid distracting animation; examples of chrome-to-content ratio 13:1 (good) vs 2:1 (bad); do a cost/benefit check on what must be persistent. NN/g Menu Design: sticky menus "especially welcome" on small screens — VERIFIED (summary). Apple HIG: tab bar should stay visible; toolbars may hide contextually with a reliable way to restore; iOS tab bar can minimize on scroll with an accessory (exit by tapping a tab or scrolling to top); full-screen content may hide bars, restore with tap/swipe — VERIFIED-RAW. Material: `hideOnScroll` on bottom app bar is disabled when TalkBack is on; bottom app bar deprecated in favor of docked toolbar (≤4 actions incl. FAB in the old bar) — VERIFIED (summary). WCAG 2.4.11 (AA): focused element must not be entirely hidden by sticky headers/footers/non-modal dialogs — VERIFIED-RAW.
- Corroboration / conflict: I found no quantitative study that hide-on-scroll improves task success; the justification is screen real estate. Scope for claims = guideline + platform behavior.
- Scope: universal.
- Agent rule: IF chrome hides on scroll THEN (a) it returns on any small reverse scroll and when focus moves into it, (b) the primary action/tab bar remains reachable within one gesture, (c) disable the hiding for screen-reader/switch/keyboard users, (d) use `scroll-padding-top/bottom` so focused fields aren't obscured. IF the bar holds the only primary action THEN don't hide it.
- Stack notes: CSS `position: sticky` + `scroll-padding`; Compose `TopAppBarDefaults.enterAlwaysScrollBehavior()` (MEMORY for exact name); SwiftUI automatic.

### F9 Search placement
- Claim: One primary, discoverable search location per app; bottom is fine on iOS; Material offers a "search app bar" for home pages.
- Evidence: HIG Searching (updated Jun 8, 2026): give search a primary position if important, aim for one primary location, show recent searches before typing and suggestions while typing, let people clear history, show scope via placeholder/scope bar/title — VERIFIED (summary). HIG search fields: on iOS, search can be a tab (standard tab style = landing page for discovery; button style = immediate keyboard, returns to previous tab) or a toolbar item (bottom toolbar if room — "easy to reach"; top when bottom content must not be covered, e.g. Wallet); start searching as soon as typing begins; categorize/limit results; scope bar above results — VERIFIED (summary). Material TopAppBar docs list a "search app bar" for emphasized search entry on home pages — VERIFIED (summary). NN/g search: a visible input box beat a link/icon (one site: +91% search usage); old, desktop-era — VERIFIED (summary) but weak for mobile.
- Scope: iOS (tab/toolbar styles), Android (search bar), universal principle.
- Agent rule: IF content-heavy (catalog, library, messages) THEN visible search field or bottom/top search bar on the root of each tab, not just an icon; IF search is a primary destination THEN on iOS use the search tab; add recents + suggestions; keep scope visible.

### F10 Gestures: always visible alternative, never the only path
- Claim: Gestures have no natural signifiers; use them as accelerators over visible controls.
- Evidence:
  - Apple HIG gestures (VERIFIED-RAW): custom gestures only when necessary and must be discoverable, straightforward, distinct, and not the only way to do an important action; shortcut gestures supplement (e.g., Back button + swipe shortcut); indicate when a gesture is unavailable; give immediate feedback; don't redefine standard gestures (undo three-finger swipe, shake). Standard vocabulary: tap (activate/select), swipe (reveal actions, dismiss, scroll), drag (move), touch-and-hold (reveal more controls), double tap (zoom in/out), zoom/pinch (magnify), rotate. Accessibility HIG: provide onscreen alternatives (e.g., delete button alongside swipe-to-delete); avoid custom multifinger gestures for frequent actions — VERIFIED-RAW.
  - Android: "Don't rely solely on gestures"; example: don't require swipe-to-delete, add a delete button; add `CustomAccessibilityAction` for `SwipeToDismissBox`; label long-click actions (`onLongClickLabel`) — https://developer.android.com/design/ui/mobile/guides/foundations/accessibility and /guide/topics/ui/accessibility/principles — T1 — VERIFIED (summary).
  - NN/g contextual swipe (T2, VERIFIED summary): unclear where swipe works; reveals obscure the item; apps use opposite meanings (Spotify save vs delete); direction/state dependence adds load; horizontal swipe conflicts with navigation/back; recommendations: limit to destructive actions, stay consistent, give undo/confirmation, keep content visible, avoid overuse, add signifiers.
  - NN/g iPhone X (VERIFIED summary): swipe ambiguity (same gesture, different meaning by location/length/direction); the home bar is a weak visual cue; works there because essential functions have alternatives.
  - NN/g 3D Touch/hidden gestures (VERIFIED summary): no natural signifiers; use only as enhancement; consistency; confusion with long press.
  - Hoober 2017 Part 3: "People tap only what they see"; he is "firmly on the side of boring interfaces"; bound/box tappable items — VERIFIED-RAW.
  - GhostUI (arXiv 2601.19258, Jan 2026): hidden gestures such as long press and swipe without indicators are hard for users and for automation agents — abstract only — VERIFIED (summary).
  - WCAG 2.2: 2.5.1 Pointer Gestures (A): anything done by multipoint or path-based gesture must also work with a single pointer without a path (swipe/flick counts as path-based); 2.5.7 Dragging Movements (AA): single-pointer non-drag alternative; 2.5.2 Pointer Cancellation (A): don't fire on down-event, or allow abort/undo/up-reversal; 1.3.4 Orientation (AA): don't lock to portrait/landscape unless essential — VERIFIED-RAW.
- Scope: universal.
- Agent rule: For every gesture, ship a visible control path with the same effect (button, menu item, edit mode). Trigger actions on pointer-up inside the target; allow slide-off to cancel. Pinch/zoom/rotate/two-finger: add +/− buttons (maps, images). Pointer-drag reorder: add move up/down controls or "Reorder" mode. Provide screen-reader custom actions for swipe rows.
- Stack notes: Web: Pointer Events (`pointerup`), `touch-action: pan-y` on horizontally-swipeable rows only; RN: `accessibilityActions`; SwiftUI: `.accessibilityAction`; Compose: `semantics { customActions }`.

### F11 Swipe-to-reveal / swipe-to-delete: acceptable as accelerator, destructive actions need undo
- Claim: Reserve for secondary accelerators; destructive swipe must be undoable or confirmed; actions must also be in a visible/overflow/detail path.
- Evidence: NN/g contextual swipe recs (F10). HIG context menus: hidden by default so mirror every item in main UI; keep few items; ≤ about three groups; destructive last, red; one submenu level max — VERIFIED-RAW. HIG action sheets: destructive first/prominent, Cancel at bottom, avoid scrolling sheets — VERIFIED-RAW. HIG undo and redo: let people undo repeatedly, show results, avoid redefining standard gestures — VERIFIED-RAW. HIG lists-and-tables: iOS requires an edit mode before selecting rows; persistently highlight selected row in navigation lists; disclosure indicator for hierarchy — VERIFIED-RAW. Hoober: never place unrecoverable actions near frequently used controls; provide undo — Part 3 — VERIFIED-RAW.
- Scope: iOS/Android/universal.
- Agent rule: IF row has ≥2 secondary actions THEN row tap → detail (where all actions live), trailing "⋯" menu for the overflow, swipe optional. Limit swipe to 1–2 actions per side (opinion/MEMORY on count), full-swipe only for the least-destructive default; for delete use undo snackbar/toast (≥5 s, MEMORY) rather than confirm dialogs. Multi-select: long-press enters selection mode with a contextual action bar that shows count and a Done/close.

### F12 Pull-to-refresh: fine as a shortcut, never the only way, and prevent accidental browser PTR in app-like web
- Claim: A convention, but invisible and error-prone; provide a refresh control or auto-refresh.
- Evidence: Android SwipeRefreshLayout docs: always provide a refresh action in the app bar for people who can't swipe — https://developer.android.com/develop/ui/views/touch-and-input/swipe/add-swipe-interface — T1 — VERIFIED (summary). Compose has `PullToRefreshBox` (state/indicator API) — VERIFIED (summary). MDN `overscroll-behavior: contain|none` disables native pull-to-refresh and swipe-navigation chaining (not Baseline; inconsistent across browsers) — VERIFIED (summary). web.dev PWA design: set `overscroll-behavior-y: contain` on body when you implement custom PTR — VERIFIED (summary). History: Loren Brichter, Tweetie, 2008; Chrome Android made it default by v75 (2019) — Wikipedia — T4 — VERIFIED (summary). I could not find an Apple HIG page for it (slug 404) or an NN/g study (search budget).
- Scope: iOS/Android/Web.
- Agent rule: IF a feed/list shows remote data THEN auto-refresh on open/foreground + keep PTR as a shortcut + visible "last updated"/refresh affordance in an overflow or toolbar; show progress at top; never use PTR for destructive actions. IF custom full-screen web app THEN `overscroll-behavior-y: contain` to avoid accidental browser reloads and scroll chaining out of sheets/drawers.

### F13 Edge-gesture conflicts: system back/home vs drawers, carousels, sliders
- Claim: The OS owns screen edges; do not rely on edge swipes for app features and pad interactive content away from them.
- Evidence: Android gesture navigation docs (VERIFIED summary): inward swipe from left/right edge = system Back; bottom-edge swipes = home/quick-switch and apps cannot opt out; use `setSystemGestureExclusionRects` (API 29+) only for precision gestures in small areas (not for scroll views/buttons); `DrawerLayout` and `SeekBar` handle it; don't place critical touch targets in the bottom edge area — https://developer.android.com/develop/ui/views/touch-and-input/gestures/gesturenav. Exclusion limit of 200dp vertical extent comes from the API reference excerpt — SNIPPET. Android system-bars guide: keep the gesture navigation bar transparent, don't add touch targets under gesture insets — VERIFIED (summary). Predictive back page: avoid touch targets completely under gesture areas (typically bottom ~40dp) — VERIFIED (summary; number not re-checked in a primary spec). iOS: `interactivePopGestureRecognizer` pops on a swipe from the leading screen edge — VERIFIED-RAW. NN/g carousels: swipes at screen edges trigger back/app switch; leave side gutters; show peek of next item; users view ~3–4 items; support swipe plus arrows — VERIFIED (summary). Hoober: screens curve/cases raise bezels, so edge gestures/targets may be unreachable; pad them — Part 3 — VERIFIED-RAW.
- Scope: iOS/Android.
- Agent rule: Put horizontal carousels with ≥16dp side padding and peek next card; don't start custom horizontal swipes within the outer ~20dp (MEMORY on exact width; the OS back-gesture inset is not stated numerically in pages I read) of the left/right edge; never place buttons in the bottom gesture inset (use bottom safe-area/inset padding). A hamburger/drawer opened by edge swipe must also open from a visible button.

### F14 Predictive back and Back behavior on Android (current as of Android 16/17)
- Claim: Apps must use the OnBackPressedDispatcher/callback APIs; old `onBackPressed()` and KEYCODE_BACK stop working for apps targeting API 36.
- Evidence: Android 16 behavior changes: apps targeting API 36 get predictive back system animations by default; `onBackPressed()` not called; `KEYCODE_BACK` not dispatched; opt-out `android:enableOnBackInvokedCallback="false"` (temporary) — https://developer.android.com/about/versions/16/behavior-changes-16 — T1 — VERIFIED (summary). Android 15+: system animations (back-to-home, cross-activity, cross-task) default on for compliant apps; Android 13–14 via developer option; AndroidX Activity 1.6.0+ — /predictive-back-gesture — VERIFIED (summary). Edge-to-edge opt-out removed for Android 16 targets — VERIFIED (summary). Android 17: targeting API 37 can no longer opt out of the large-screen orientation/resizability-ignored behavior (sw ≥600dp) — VERIFIED (summary). Design spec for full-screen back preview: exit scale 100%→90%, enter 110%→100%, fade-through at 35% progress — VERIFIED (summary; not re-checked).
- Scope: Android.
- Agent rule: Use `BackHandler`/`PredictiveBackHandler`/`OnBackPressedCallback`, enable callbacks only while they intercept (e.g., unsaved-changes dialog, open drawer/sheet); keep them single-purpose. Never rely on `onBackPressed`. Support all orientations/resizing on sw≥600dp.
- Stack notes: Flutter `PopScope` (MEMORY), RN `BackHandler` + React Navigation default.

### F15 Touch-target sizes: platform minimums vs research vs WCAG (see Numbers table)
- Claim: Platform numbers are convenience minimums in logical units; research shows required physical size depends on screen position, posture and motion, and that spacing/padding matters as much as size.
- Evidence: Apple HIG accessibility: iOS/iPadOS default 44×44 pt, minimum 28×28 pt; macOS 28/20; visionOS 60/28; watchOS 44/28; tvOS 66/56; add ~12 pt padding around bezeled controls and ~24 pt around non-bezeled — VERIFIED-RAW. Android: ≥48dp touch target even if visual element is smaller (icon visual 24dp — the 24dp icon size is MEMORY here; the 48dp is VERIFIED) — VERIFIED (summary). Fluent 2: 44×44 iOS/web, 48×48 Android — VERIFIED (summary). Microsoft Windows apps: 7.5 mm square (40×40 px at 135 PPI, 1.0×) and scale up for frequent/consequential targets — VERIFIED (raw page text). NN/g: 1 cm × 1 cm (0.4 in), fingertip 1.6–2 cm, thumb impact ~2.5 cm (MIT Touch Lab), ~2 mm minimum spacing, cites Parhi/Karlson/Bederson 2006 — VERIFIED (summary). WCAG 2.2: 2.5.8 AA 24×24 CSS px with spacing/equivalent/inline/user-agent/essential exceptions (spacing test: a 24 px circle centered on each undersized target must not intersect another target or circle); 2.5.5 AAA 44×44 CSS px — VERIFIED-RAW.
- Research (via Hoober Part 3 reference notes, VERIFIED-RAW but secondhand): Parhi et al. 2006: 9.2 mm (discrete) / 9.6 mm (serial) sufficient for one-handed thumb, no gain at 11.5 mm; Henze et al. 2011 (100M taps): below 15 mm errors rise sharply, >40% errors for targets <8 mm, edges worse than center; Schildbach & Rukzio 2010 (walking): 6.74 mm → up to 23% errors, ~10 mm much better, 20 mm nearly eliminates errors; Lee & Zhai 2009: 10 mm buttons 98–99.4% accuracy; Park et al. 2008: 10 mm better than 7 mm, 4 mm "a disaster", bottom of screen hard to tap accurately; Ng/Brewster/Williamson CHI'14: carrying a bag in the other hand degrades far-corner accuracy to >30 mm; Sesto et al. 2012: 20 mm best for users with disabilities (force measure). Hoober's own data: 7 mm at screen center vs 12 mm at corners, sizes chosen to contain 95% of taps (R95); rows ≥9–10 mm for edge lists; design ~20% larger than you think you need.
- Disagreement: Hoober (2017) calls any pixel-based standard "useless" (dp/pt vary by device; a 7 mm design can render 5–9 mm) and says Apple/Google sizes follow platform convenience more than human factors; WCAG 24 px (~6.35 mm at 96 dpi reference) is below every research minimum above and is a floor with spacing exemptions, not a target.
- Scope: universal; units differ by platform.
- Agent rule: Interactive area ≥44×44 pt on iOS, ≥48×48 dp on Android, ≥44×44 CSS px on web (≥24×24 only when truly constrained and spaced per 2.5.8). Visual icon can be smaller (e.g., 24) if padding/hit-slop extends the tappable area to the minimum. Space adjacent targets ≥8 dp/pt (≈2 mm NN/g; HIG gives 12 pt around bezeled controls); make the whole row/card/button the target, not just the label/icon. For high-consequence or edge/corner/one-handed/walking contexts go ~10 mm+ (≈ 48–56 dp) and keep unrecoverable actions away from frequent controls.
- Stack notes: CSS `min-block-size: 44px; min-inline-size: 44px` or `::before{inset:-8px}` for hit-slop; RN `hitSlop`; Compose `Modifier.minimumInteractiveComponentSize()`; SwiftUI `.frame(minWidth:44,minHeight:44)` + `.contentShape(Rectangle())`; Flutter `MaterialTapTargetSize.padded`.

### F16 How people actually hold phones: data and the thumb-zone critique
- Claim: Grip is varied and shifting; "bottom = easy, top-left = unreachable" maps are oversimplified; accuracy and viewing favor the middle of the screen; still, the bottom is the most comfortable resting zone for one-handed use.
- Evidence:
  - Hoober 2013 (UXmatters, 1,333 street observations over two months ending Jan 8, 2013; 780 touching the screen): one hand 49% (right thumb 67%, left 33%); cradled (one hand holds, other touches) 36% (thumb 72%, finger 28%, left-hand support 79%); two hands 15% (portrait 90%); limits stated: demographics/devices unknown, tablets largely absent, only first grip recorded — T2 — VERIFIED (summary).
  - Hoober 2017 (Parts 1–3, 1,300+ phone observations plus 651 more in schools/offices/homes; cites a study with 120M touch events): says his 2013 column contains outdated assumptions; 75% of users touch with one thumb only; fewer than 50% hold one-handed; 36% cradle; 10% hold in one hand and tap with a finger of the other; 41% hold with both hands and thumb-type when typing; thumb-sweep charts are "well-known, but incorrect" because people use the Back button (often top corner) all the time and prefer the center of the screen; most taps fall in the center half of the page; people scroll at the far side of content; tablets used in a stand/on table about two-thirds of the time — T2 — VERIFIED-RAW. Recommended framework: primary content at center; secondary actions along top/bottom edges (tabs, search/compose); tertiary functions in menus opened from corners; pad the bottom of long pages so the last item can scroll to the middle.
  - Josh Clark, Designing for Touch (ALA excerpt, 2015): thumbs drive 75% of interactions; "only a third of the screen is truly effortless" (bottom, side opposite the thumb); comfort ≠ accuracy (a separate fan-shaped accurate zone; bottom and top-right corners least accurate for right-handers per Qian Fei/Alibaba); top-vs-bottom matters more than left-vs-right; accommodate the most constrained grip; phablets: both hands 70% of the time, index finger of other hand 35%, thumbs 60%, and the one-handed thumb zone is smaller than on phones; tablets: thumbs settle at middle-to-top third of the sides, bottom/top edges are hostile, 88% of tablet use seated vs 19% of phone use, large tablets put down in ~2 of 3 sessions (flat 40%, stand 22%), small tablets 69% handheld — T2 — VERIFIED-RAW (Hoober & Shank data cited secondhand).
  - Smashing (T4): swipe areas ≥45 px; conceptual zones; acknowledges breaking conventions sometimes — VERIFIED (summary).
- Corroboration / conflict: Park et al. 2008 (via Hoober) reports the bottom of the screen was hard to tap accurately although comfortable; Apple moved search and toolbars to the bottom in iOS 26 and says bottom search is "easy to reach" (HIG search fields) — platform preference, not a controlled study. Material layout basics: keep essential/primary navigation in reachable areas, FAB for reachable primary action — VERIFIED (summary).
- Scope: universal; strongest for 4–6.7 in phones; tablets/foldables differ.
- Context (when it flips): large phones, walking/carrying, tablets (use side/top corners), left-handed use, foldables.
- Agent rule: Do not build "thumb-zone-only" layouts. Put persistent navigation and the primary action at the bottom edge (comfortable, one-handed) BUT make them big (≥ 48 dp), spaced, and inset from the gesture bar; keep primary content in the middle; keep Back/Close at top-leading (standard) because people do reach it; put rarely-used/destructive controls in corners or menus, away from frequent targets. Allow content to scroll its last element to mid-screen (bottom padding). Verify on a ≥6.5 in device.
- Stack notes: CSS `padding-bottom: calc(env(safe-area-inset-bottom) + 24px)` on scrollers; Compose `contentPadding`; SwiftUI `safeAreaInset`.

### F17 Accidental-tap prevention
- Claim: Assume imprecision; design so a mis-tap is cheap.
- Evidence: Hoober Part 3 (VERIFIED-RAW): R95 concept; put dangerous/unrecoverable items (e.g., Send) far from frequently used controls or provide undo; edge-adjacent rows ≥9–10 mm. Microsoft targeting: severe-consequence targets get more padding and distance from content edge — VERIFIED (raw page text). HIG: action sheets for destructive confirmation; undo and redo; drag-drop undo — VERIFIED-RAW. WCAG 2.5.2 pointer cancellation — VERIFIED-RAW. NN/g overlay dismissal (F7), contextual swipe (F10).
- Agent rule: Destructive action = (1) separated ≥ 8–16 dp from neighbors and not in the thumb-default spot, (2) styled as destructive and last in menus, (3) undo (preferred) or confirm with explicit verb ("Delete 3 photos"). Hold-to-confirm: use for irreversible/high-stakes only (MEMORY: not in HIG/Material pages I read; must have a tap alternative with confirm for accessibility). Fire on pointer-up.

### F18 Safe areas, gesture bars, cutouts, keyboards, landscape
- Claim: Draw edge-to-edge but inset interactive content by system insets; account for keyboard and display regions.
- Evidence: HIG layout: respect safe areas so Dynamic Island/home indicator/toolbars don't obscure content; extend backgrounds under bars; layout by size classes (updated Sep 9, 2026) — VERIFIED-RAW (+ whats-new summary). Android: edge-to-edge enforced from Android 15, no opt-out for Android 16 targets; use `WindowInsets`; gesture nav bar transparent; button-nav gets scrim; sync with keyboard via `WindowInsetsAnimationCompat`; cutouts vary — VERIFIED (summary). Android layout basics: move/attach text input above keyboard, don't hide inputs — VERIFIED (summary). Web: `viewport-fit=cover` + `env(safe-area-inset-top|right|bottom|left)` (Baseline widely available since Jan 2020), `env(keyboard-inset-*)` via VirtualKeyboard API; `interactive-widget` = resizes-visual (default; Chrome 108+), resizes-content, overlays-content — VERIFIED (summary). HIG going full screen: home indicator auto-hides, one swipe exits; consider requiring two swipes for games; let people restore hidden chrome — VERIFIED-RAW. HIG virtual keyboards: pick keyboard type for the content — VERIFIED-RAW (page skimmed).
- Agent rule: Always apply top/bottom/left/right insets to bars and FABs, including landscape left/right (cutout/notch side). Scroll the focused field above the keyboard with padding; don't hide the submit button behind it. Don't lock orientation (WCAG 1.3.4; Android 16/17 ignore locks on sw≥600dp).
- Gap: exact dp of Android's back-gesture edge region not found in primary docs.

### F19 Foldables and large screens
- Claim: Navigation must adapt to hinge/poses and to window size changes; controls follow content.
- Evidence: Apple HIG "Designing for iPhone Duo" (new Sep 9, 2026; summary only) — outer compact/inner regular size classes; reserved regions (cameras, fold); tab bars/toolbars move to the vertical axis on the outer display (inner portrait keeps horizontal bars); bar compression behavior (navigation-focused apps keep the tab bar and overflow toolbar items; task-focused minimize the tab bar); keep navigation containers outside arrangement views; even-number grid columns around the fold; keep controls near the content they affect for reachability; keep controls consistent across poses — VERIFIED (summary). Android: tabletop posture → navigation bar; large screens ignore orientation/resizability locks (sw≥600dp); list-detail: one pane on compact, two on larger, with Back behaviors `PopUntilScaffoldValueChange` (default) etc. — VERIFIED (summary). NN/g Surface Duo (older): spine obscures content, mode switches without cues, drag-drop rarely supported — VERIFIED (summary). Clark: tablets posture varies, side/top-corner thumbs — VERIFIED-RAW.
- Agent rule: Build list-detail as: compact = push (list → detail, Back returns to list), regular = split panes with persistent selection highlight (HIG). Keep state across fold/unfold/rotate. Avoid placing key controls on the fold axis.
- Gap: I could not independently confirm iPhone Duo hardware details beyond the HIG page.

### F20 Progressive disclosure, hierarchy depth, and the "3-click" myth
- Claim: Depth is fine if each step is clear; limit disclosure levels, not clicks.
- Evidence: NN/g progressive disclosure: frequent features primary, rare ones secondary; max 2 disclosure levels, 3+ signals redesign; relevant to mobile — VERIFIED (summary). NN/g 3-click rule: no published data support it; Porter 2003 found no increase in drop-off or decrease in satisfaction beyond 3 clicks; what matters: labels/information scent, wayfinding cues, landing pages/hubs, fast loads — VERIFIED (summary). NN/g defer secondary content: first screen minimum essentials; expandable sections or secondary pages; many users never open deferred content — VERIFIED (summary). NN/g mini-IA: chunk by usage, not org chart — VERIFIED (summary). NN/g mobile subnavigation: sequential (drill-in) menus confuse (esp. Android Back); accordion for <6 subcategories, section menus for 6–15, category landing pages for 15+ — VERIFIED (summary). NN/g image-vs-list nav: text lists at broad levels, image grids deeper; image grids needed ~4 screens of scrolling vs ~1 in one comparison — VERIFIED (summary). HIG sidebar ≤2 levels; HIG modality: avoid deep hierarchy inside modals — VERIFIED-RAW. Hoober: architect the app so drilling through categories isn't needed — VERIFIED-RAW.
- Agent rule: Cap nav hierarchy at about 3 levels of screens below a tab root (opinion/synthesis; evidence only says clarity > count) and disclosure within a screen at 2 levels. Each screen shows title, current location, and a standard back label/affordance. Use hubs for ≥15 children.

### F21 Wayfinding: title, current location, back label
- Claim: People need to always know where they are and how to go back.
- Evidence: HIG toolbars: large title transitions to standard on scroll and returns on scroll-to-top, "reminding them of their current location"; use standard Back and Close buttons — don't use a text label that says Back or Close (prefer standard symbols) — VERIFIED-RAW. HIG tab bar: selected tab highlighted, tab bar visible — VERIFIED-RAW. HIG lists/split views: persistent highlight of selection — VERIFIED-RAW. NN/g tabs: ≥2 selection indicators; never stack rows ("destroys spatial memory"); don't mix navigation tabs and in-page tabs in one control — VERIFIED (summary). NN/g breadcrumbs mobile: don't wrap, keep 1 cm targets, show only parent level — VERIFIED (summary). Android: top app bar nav icon needs contentDescription — VERIFIED (summary).
- Agent rule: Title on every screen; Back/Up top-leading; selected nav item uses fill+label weight; on mobile web replace full breadcrumbs with a single "← Parent" link.

### F22 Tabs: top segmented/tabs vs bottom navigation; no tabs-in-tabs
- Claim: Use bottom navigation for app-level destinations and top tabs/segmented controls for sibling views within one destination; avoid nested/duplicated tab layers.
- Evidence: NN/g Tabs Used Right (VERIFIED summary): overflowing tabs turn into a carousel that hides tabs, fewer is better; navigation tabs vs in-page tabs differ in expectations (new page vs instant panel); never mix. HIG: tab bar = navigation, not actions; segmented controls/tab views are different (macOS tab views max ~6; not for iOS) — VERIFIED-RAW. Material top-level destinations use navigation bar; in-screen sibling views use Tabs (MEMORY; not re-fetched).
- Corroboration / conflict: "No tabs inside tabs" is a design-community rule with only indirect support (spatial memory and ambiguity of two selection states); I found no controlled study. Tag opinion/synthesis.
- Agent rule: At most two navigation layers visible at once (bottom bar + optional top sibling tabs); if a screen needs a third, use filter chips, a segmented control, or push a new screen. Top tabs: ≤4–5 short labels visible, avoid scrollable tabs for primary content (discoverability).

### F23 Floating action patterns / primary action
- Claim: One primary action per screen; Material FAB for it; Apple uses a prominent button in toolbars/trailing edge or content.
- Evidence: Material FAB: "represents the primary action of a screen"; sizes regular 56dp, medium (recommended in most situations), large 96dp; small 40dp deprecated in M3 — VERIFIED (summary). Bottom app bar: up to 4 actions including FAB but being deprecated for the docked toolbar — VERIFIED (summary). HIG toolbars: trailing edge holds primary action like Done (`prominent` style, trailing only); scrolling toolbar button for important non-primary action; ≤3 groups; More menu — VERIFIED-RAW. NN/g 4 iOS rules to break: top-bar form Submit conflicts with top-to-bottom flow — place at end of form or sticky bottom; plus icon ambiguous; dots page control overlooked — VERIFIED (summary; T2 qualitative).
- Scope: Android (FAB), iOS (toolbar), cross-platform products choose one idiom per platform (NN/g mobile-native-apps: Banana Republic Android tab bar felt non-native) — VERIFIED (summary).
- Agent rule: IF a screen has one dominant create/add action THEN FAB (Android/M3) or trailing toolbar/bottom prominent button (iOS), above the bottom inset and never covering list content (add bottom content padding); keep ≥ 16 dp from screen edge.

### F24 Onboarding vs login wall
- Claim: Minimize front-loaded onboarding; let people use the app before sign-in.
- Evidence: HIG onboarding: fast, fun, optional; teach through interaction; prefer contextual tips; postpone nonessential setup; request permissions in context or integrate with onboarding with explanation; let people experience the app before rating/purchase prompts — VERIFIED-RAW. HIG launching: launch instantly, launch screen should mirror first screen, restore state — VERIFIED-RAW. NN/g mobile app onboarding: tutorials didn't improve task performance; use contextual help; visible Skip — VERIFIED (summary). NN/g instructional overlays: one interaction at a time, avoid sequential tips; short-term retention ~20 s claim — VERIFIED (summary). NN/g login walls: forcing login before value → abandonment; guest checkout; deferred registration after purchase; no numbers in the article — VERIFIED (summary).
- Agent rule: Allow browsing and core task before account creation; ask for permissions at point of use with a pre-prompt explaining the benefit; if coach marks are used, one per feature, dismissible, and re-findable in Help.

### F25 Deep links and URL-per-screen
- Claim: Every shareable screen has a stable URL/link; verified app links avoid disambiguation; deep links open with a synthesized back stack.
- Evidence: Android App Links (verified via `assetlinks.json`, `autoVerify`) open directly, no chooser; plain deep links get a disambiguation dialog; Dynamic App Links from Android 15; recommended for your own domain — https://developer.android.com/training/app-links — VERIFIED (summary). Android Navigation deep links synthesize back stack — VERIFIED (summary). Apple Universal Links: `apple-app-site-association` at `/.well-known/`, Associated Domains `applinks:`, falls back to Safari when app not installed, handle with `onOpenURL` / `NSUserActivity` — VERIFIED (summary). PWA: in standalone display mode there is no browser back button, so add an in-app back control (`@media (display-mode: standalone)`), and use `viewport-fit=cover` + safe areas — web.dev — VERIFIED (summary). NN/g mobile-native-apps (Walgreens): mobile web users land on deep pages without passing the homepage, so each page needs orientation (logo/nav) — VERIFIED (summary).
- Agent rule: Define a route table first; each screen/state that's shareable gets a URL and an app link; handle cold-start deep links by building parent stack. In SPAs use real URLs (not hash-only state) and make Back work; view transitions can express push/pop direction (Chrome 111+ same-document, 126+ cross-document; Safari 18/18.2; Firefox 144 same-document) with `prefers-reduced-motion` fallback (MEMORY on the media query, not on the page).

### F26 Haptics and gesture feedback
- Claim: Short, purposeful, optional haptics reinforce gesture state; always pair with visual feedback.
- Evidence: HIG haptics: use system patterns per documented meaning, consistent cause/effect, complement visual/audio, avoid overuse, short for discrete events, make optional — VERIFIED-RAW. Android haptic principles: use `HapticFeedbackConstants` (CONFIRM, REJECT, GESTURE_START, GESTURE_END, LONG_PRESS), subtle for frequent events, stronger for important, key-click feedback 10–20 ms, avoid "buzzy" for touch, respect system settings — VERIFIED (summary). HIG gestures: give immediate feedback during a gesture and communicate the extent of movement; show unavailable state — VERIFIED-RAW.
- Agent rule: Press feedback visible within one frame (ripple/highlight on down, action on up); gesture progress follows the finger 1:1; haptic on threshold crossing (e.g., swipe commit), never on every scroll tick. Web: `navigator.vibrate` is not available on iOS Safari (MEMORY) — do not depend on it.

### F27 Filter/sort/search results on mobile
- Claim: Keep filters and results visible together (tray overlay), prioritize filter categories, use collapsible groups.
- Evidence: NN/g Mobile Faceted Search (VERIFIED summary): show filters as overlay tray over results, fixed header with result count, clear "Filter/Refine" label (not cryptic icon). NN/g filter categories: appropriate, predictable, jargon-free, prioritized; collapsed accordions on mobile — VERIFIED (summary; article doesn't resolve instant-apply vs Apply button). HIG search fields: scope bar to narrow results, tokens — VERIFIED (summary).
- Gap: Baymard mobile filtering/sorting findings not obtained.
- Agent rule: Filter button labeled "Filter" with active-count badge; sheet with sticky "Show N results"/Apply and Clear; sort as a separate control (sheet/menu); reflect applied filters as removable chips above results.

### F28 List/detail and IA framing
- Claim: Phone = push navigation with Back; tablet/foldable = split panes with persistent selection.
- Evidence: HIG split views: prefer in regular environments, persistent selection highlight; Android list-detail (F19); NN/g tablets: users still want search and a working Back; split-screen subdivision hurts; swipe ambiguity increases — VERIFIED (summary). NN/g mobile navigation patterns defines hub-and-spoke ("navigation hub") as suited to task-based, single-task apps, with the cost of returning home — VERIFIED (summary). HIG/Apple "navigation styles" (hierarchical, flat, content-driven) page was not found in current HIG index; the old taxonomy is not re-verified — MEMORY.
- Task-based vs feature-based nav: no primary source fetched; NN/g mini-IA says organize by how people want to access info rather than the org chart (VERIFIED summary). Card sorting (≥15 participants qualitative, 30–50 quantitative) generates groupings; tree testing validates findability with directness metric (NN/g) — VERIFIED (summary).
- Mental models: Jakob's Law (people expect your product to work like others they use) → follow platform nav idioms — VERIFIED (summary, T4). NN/g mobile-native-apps: don't ship identical iOS/Android navigation; Android has system Back and the iOS bottom tab bar felt clunky on Android in one example — VERIFIED (summary).
- Agent rule: Choose nav by task frequency: top-level = tasks users do weekly; run a card sort + tree test before finalizing; follow platform idioms (iOS: bottom tab bar + large titles + sheets; Android: navigation bar + top app bar + predictive back) when native; for cross-platform apps keep the same IA but swap idioms where the OS owns behavior (Back, share sheet, dialogs).

---

## Numbers table (value | applies to | source | tag)

| Value | Applies to | Source | Tag |
|---|---|---|---|
| 44×44 pt default, 28×28 pt minimum | iOS/iPadOS controls | HIG accessibility | VERIFIED-RAW |
| 44/28 pt (default/min) | watchOS | HIG accessibility | VERIFIED-RAW |
| 28/20 pt | macOS | HIG accessibility | VERIFIED-RAW |
| 60/28 pt | visionOS | HIG accessibility | VERIFIED-RAW |
| 66/56 pt | tvOS | HIG accessibility | VERIFIED-RAW |
| ~12 pt padding around bezeled controls; ~24 pt around non-bezeled | iOS spacing | HIG accessibility | VERIFIED-RAW |
| 48×48 dp minimum touch target (even if visual is smaller) | Android | developer.android.com accessibility | VERIFIED (summary) |
| 44×44 (iOS & web), 48×48 (Android) | Fluent 2 | fluent2.microsoft.design/layout | VERIFIED (summary) |
| 7.5 mm square (40×40 px @135 PPI, 1.0×) | Windows touch | learn.microsoft.com targeting | VERIFIED (raw page) |
| 7 mm normal / 9 mm important / 5 mm if no room; 2 mm spacing | legacy Windows Phone | via Hoober Part 2 reference | VERIFIED-RAW (secondhand) |
| 24×24 CSS px (AA) with exceptions | WCAG 2.5.8 | W3C | VERIFIED-RAW |
| 44×44 CSS px (AAA) | WCAG 2.5.5 | W3C | VERIFIED-RAW |
| 1 cm × 1 cm minimum; ~2 mm spacing; fingertip 1.6–2 cm; thumb 2.5 cm | research-derived guideline | NN/g touch-target-size | VERIFIED (summary) |
| 9.2 mm discrete / 9.6 mm serial; no gain at 11.5 mm | one-handed thumb | Parhi et al. 2006 via Hoober | VERIFIED-RAW (secondhand) |
| 7 mm center, 12 mm corners (95% of taps) | phone touch accuracy | Hoober 2017 | VERIFIED-RAW |
| rows ≥9–10 mm at screen edges; design ~20% larger | list rows/edge | Hoober 2017 | VERIFIED-RAW |
| <15 mm errors rise; >40% errors for <8 mm | large-scale taps | Henze et al. 2011 via Hoober | VERIFIED-RAW (secondhand) |
| 6.74 mm up to 23% errors walking; ~10 mm much better; 20 mm solves almost all | walking | Schildbach & Rukzio 2010 via Hoober | VERIFIED-RAW (secondhand) |
| 10 mm → 98–99.4% accuracy | thumb/finger soft buttons | Lee & Zhai 2009 via Hoober | VERIFIED-RAW (secondhand) |
| >30 mm far-corner error when carrying a bag | encumbered one-hand | Ng et al. CHI'14 via Hoober | VERIFIED-RAW (secondhand) |
| 17 pt/6 mm min, 23 pt/8 mm preferred, 43 pt/15 mm max | Hoober older guidance | search snippet of 2014-era article | SNIPPET (superseded by 2017 R95 numbers; do not use) |
| 49% one-handed / 36% cradle / 15% two-handed (n=1,333; 780 touching) | grips, 2013 | Hoober 2013 | VERIFIED (summary) |
| 75% one thumb only; <50% one hand; 36% cradle; 10% finger of other hand; 41% two hands typing | grips, 2017 | Hoober 2017 | VERIFIED-RAW |
| thumbs 75% of interactions; ~1/3 of screen effortless | phones | Clark 2015 | VERIFIED-RAW |
| phablet: 70% two hands; 35% index finger; 60% thumbs | phablets | Hoober & Shank via Clark | VERIFIED-RAW (secondhand) |
| tablet: 88% seated (phone 19%); large tablets down ~2/3 sessions; 69% small tablet handheld; portrait 60/40 | tablets | Hoober & Shank via Clark | VERIFIED-RAW (secondhand) |
| Bottom nav bar: 3–5 destinations | Android/M3 | Android docs, GH docs | VERIFIED (summary) |
| Nav rail: 3–7 destinations collapsed; 80 dp wide (96 dp expressive) | Android/M3 | GH NavigationRail.md | VERIFIED (summary) |
| Active indicator 56×32 dp; M3 Expressive ≥600dp bar height 80→64 dp, indicator 64→56 dp | M3 nav bar | GH BottomNavigation.md | VERIFIED (summary, re-check) |
| Bottom app bar ≤4 actions incl. FAB (deprecated → docked toolbar) | Android | GH BottomAppBar.md | VERIFIED (summary) |
| FAB 56 dp regular, 96 dp large, 40 dp small deprecated | M3 | GH FloatingActionButton.md | VERIFIED (summary) |
| Bottom sheet drag handle min 48 dp; max width 640 dp | M3 | GH BottomSheet.md | VERIFIED (summary) |
| iPhone: 6+ tabs → first 4 + More | UIKit | UITabBarController doc | VERIFIED-RAW |
| iPad customizable tab bar default ≤5 | iPadOS | HIG tab-bars | VERIFIED-RAW |
| Toolbar groups ≤3 | HIG toolbars | HIG | VERIFIED-RAW |
| Sidebar ≤2 hierarchy levels | HIG sidebars | HIG | VERIFIED-RAW |
| macOS tab view ≤6 tabs (not iOS) | macOS | HIG tab-views | VERIFIED-RAW |
| Context menu ≤ ~3 groups, 1 submenu level | HIG | context-menus | VERIFIED-RAW |
| Progressive disclosure ≤2 levels | NN/g | progressive-disclosure | VERIFIED (summary) |
| Mobile: show nav if ≤4 top-level links, hide if >4 | NN/g | hamburger-menus | VERIFIED (summary) |
| Accordion <6 subcategories; 6–15 section menu; 15+ landing page | NN/g | mobile-subnavigation | VERIFIED (summary) |
| Carousel: reach last item in 3–4 steps | NN/g | mobile-carousels | VERIFIED (summary) |
| Sticky header slide-in 300–400 ms | NN/g | sticky-headers | VERIFIED (summary) |
| Window width classes: 600 / 840 / 1200 / 1600 dp; height 480 / 900 dp | Android | use-window-size-classes | VERIFIED (summary) |
| Large-screen orientation/resizability ignored at sw ≥600 dp (API 36); no opt-out for API 37 | Android | behavior-changes 16/17 | VERIFIED (summary) |
| Predictive back: 100→90% scale, 35% swap threshold, 8 dp margin | Android | predictive-back design | VERIFIED (summary) |
| Gesture exclusion limit 200 dp vertical | Android | API reference excerpt | SNIPPET |
| Bottom gesture area "typically ~40 dp" | Android | predictive-back design page | VERIFIED (summary; secondary) |
| 2.5.1/2.5.2/2.5.7 (A/A/AA); 2.4.11 AA | WCAG 2.2 | W3C | VERIFIED-RAW |
| back/forward = 1 in 10 desktop, 1 in 5 mobile navigations | web | web.dev bfcache | VERIFIED (summary) |
| Haptic key-click 10–20 ms | Android | haptics principles | VERIFIED (summary) |
| Hamburger study: 27/50/48% desktop usage, 57/86% mobile; >20% discoverability drop; +21%/+11% difficulty; 39%/15% slower tasks | NN/g 2016 | hamburger-menus | VERIFIED (summary) |
| Redbooth: sessions >2×, duration +70%, DAU +65% | product case, confounded | redbooth blog | VERIFIED (summary) |
| Card sort ≥15 qualitative; 30–50 quantitative | research method | NN/g | VERIFIED (summary) |
| Back-button hijacking: announced Apr 13 2026; enforced Jun 15 2026 | Web/SEO | Google blog | VERIFIED-RAW |

Unit note: CSS px, iOS pt, Android dp are logical units, not mm; Hoober reports a nominal 7 mm design can render 5–9 mm. Treat mm figures as ergonomic targets and pt/dp/px as platform floors. (Hoober VERIFIED-RAW; the 1 CSS px = 1/96 in reference definition is MEMORY.)

---

## Comparison tables

### Navigation containers

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Bottom tab/navigation bar (3–5) | Always visible, one tap, state per tab, high discoverability (NN/g: visible/combo nav used 86% vs hidden 57% on mobile) | Max ~5 items, consumes ~56–80 dp height, bottom gesture area interplay | App-level destinations of equal importance, compact width | >5 equal destinations; one-task flows; landscape phones with tiny height (use rail) |
| Navigation drawer / hamburger | Fits many items; space-efficient | Low discoverability; −15% task speed on mobile; edge-swipe conflicts with system Back | Overflow/secondary destinations, expanded-width permanent drawer, content-first browse apps | Sole nav for core features (F1) |
| Top tabs / segmented control | Sibling views of one destination; swipe optional | Overflow hides tabs; stacked rows hurt memory; top is farther for thumb | 2–5 views of same content type | As primary app nav; nested under another tab row |
| Navigation rail | Persistent nav on wider windows, 3–7 items, FAB slot | Takes 80 dp width | Medium/expanded windows, landscape, tablets/foldables | Compact portrait phones |
| Sidebar (iPadOS/regular) | Many sections, ≤2 levels | Space-hungry | iPad/large windows, tab bar → sidebar adaptive | Compact width |
| Navigation hub (home as menu) | Simple for task-based single-task apps | Extra step back to switch areas | Settings, flight booking, wizards (NN/g) | Frequent switching between areas |
| Top app bar + overflow | Standard title/back/actions | Top actions are hard to reach one-handed | Screen-level actions, search | Primary app-level nav |

### Presentation: push vs modal vs sheet vs full screen

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Push (stack) | Preserves hierarchy, Back/swipe-back natural | Deep stacks lose orientation | Drill-down into detail | Tasks that interrupt/branch from current context |
| Sheet (medium/large detents, bottom sheet) | Keeps context visible; quick scoped tasks | Dismissal ambiguity; data loss on swipe | Short pickers/filters/share, secondary details | Multi-step flows, primary nav, stacking sheets (NN/g, HIG) |
| Full-screen modal | Focus, immersive, multi-step tasks | Hides context; "app in app" risk | Compose, camera/editor, checkout steps (but NN/g warns against modals for checkout interruptions) | Simple confirmations |
| Alert / dialog | Critical interruption | Blocks everything | Destructive/irreversible confirms, errors | Promos, optional info (NN/g) |
| Popover/menu | Lightweight, in-context | Small targets, hidden until invoked | Context actions | Primary navigation |

### Action exposure: swipe actions vs overflow vs long-press vs visible buttons

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Visible buttons | Discoverable, accessible, fastest to learn | Space/clutter | Primary 1–2 actions | Many actions per row |
| Overflow ("⋯") menu | Compact, discoverable icon | Hidden items, 2 taps | Secondary/rare actions | Frequent primary action |
| Swipe actions | Fast for experts, scan-friendly | No signifier; conflicts with back/carousel; obscures content; ambiguous direction | Accelerator for 1–2 actions (esp. delete w/ undo) | Only path; many actions; screens with horizontal paging |
| Long-press / context menu | Rich, native | Hidden by default; weak discoverability (NN/g 3D Touch) | Shortcuts that mirror visible UI (HIG: always mirror) | Core functions; selection entry without visible cue |
| Selection mode + action bar | Batch actions, explicit | Needs entry affordance | Multi-select lists | Single-item workflows |

---

## Anti-patterns found (problem -> why -> better alternative -> source)

1. Hamburger/drawer as sole nav for core features -> low salience means ~30% fewer uses (mobile hidden 57% vs combo 86%), −15% speed -> visible bar for ≤5 core destinations, combo for more -> NN/g hamburger study (VERIFIED).
2. More than 5 bottom tabs / auto-overflow "More" -> labels/targets squeezed; hidden sections hard to find -> consolidate, sidebar/rail at larger widths -> HIG tab bars, Material docs, UIKit rule (VERIFIED).
3. Icon-only navigation -> icons ambiguous; clock-icon test had zero taps -> icon + visible label -> NN/g icon usability (VERIFIED).
4. Gesture-only actions (swipe-only delete, pinch-only zoom, drag-only reorder) -> invisible, inaccessible, fails WCAG 2.5.1/2.5.7 -> visible control + gesture accelerator -> HIG, WCAG, NN/g (VERIFIED).
5. Hijacking Back (dummy history, exit-intent traps) -> breaks core expectation; now a Google spam violation (Apr 13 2026, enforced Jun 15 2026) -> `pushState` only for real screens -> Google blog (VERIFIED-RAW).
6. Unpredictable Back (closes app/menu instead of overlay; custom back not wired to system) -> stacked/ambiguous overlays; Android Back confusion in sequential menus -> Back = undo last layer; use OnBackPressedDispatcher -> NN/g overlays/subnav, Android docs (VERIFIED).
7. Nested tabs-in-tabs / stacked tab rows -> spatial memory loss, two selection states -> one bar + segmented/filters/push -> NN/g tabs (stacked rows VERIFIED; nesting = opinion).
8. Mixing navigation tabs and in-page tabs in one control -> disorientation -> separate controls -> NN/g tabs-used-right (VERIFIED).
9. Scroll-jacking / full-viewport snap pages -> people dislike reading that way; also traps zoom -> native scroll with anchors -> Hoober Part 2 ("avoid the trendy approach... snap") (VERIFIED-RAW; he cites no study in that passage).
10. Hide-on-scroll that loses the primary action or ignores a11y -> content reachable only after reverse scroll; TalkBack disables Material's hideOnScroll -> keep primary action fixed, restore on small up-scroll -> NN/g sticky headers, Material docs (VERIFIED).
11. Translucent sticky headers over content -> low contrast hurts reading -> opaque, small bars -> NN/g sticky headers (VERIFIED).
12. Sticky bars covering focused fields -> keyboard/switch users lose focus -> `scroll-padding`, WCAG 2.4.11 -> W3C (VERIFIED-RAW).
13. Disabling page zoom (`user-scalable=no`, `maximum-scale`, `touch-action:none` globally) -> blocks low-vision zoom -> allow zoom; MDN says iOS 10+ ignores it anyway -> MDN (VERIFIED summary).
14. Stacked modals/sheets; "app within an app" in a sheet -> clutter, dismissal confusion -> one layer, push for multi-step -> HIG modality/sheets, NN/g (VERIFIED).
15. Swipe-to-delete without undo; opposite meanings per direction -> accidental data loss -> undo + consistency -> NN/g contextual swipe (VERIFIED).
16. Tiny targets or crowded edge controls -> error rates >40% under 8 mm (Henze via Hoober) -> ≥44/48 + spacing -> HIG, Android, Hoober (VERIFIED-RAW secondhand).
17. Destructive control next to frequent control (Send beside formatting) -> unrecoverable mistakes -> separate + undo -> Hoober Part 3 (VERIFIED-RAW).
18. Interactive content under the Android gesture-nav inset or at the very screen edge -> system gestures win; curved screens/cases block edges -> inset it -> Android docs, Hoober (VERIFIED).
19. Horizontal carousels flush to screen edge -> collide with iOS/Android back swipe -> gutter + peek -> NN/g carousels (VERIFIED).
20. Dots-only paging indicator; plus icon for expand; three-line "move" icon beside hamburger -> overlooked or ambiguous -> peek content, carets, direct drag -> NN/g 4 iOS rules (VERIFIED).
21. Forced login/onboarding before value -> abandonment; tutorials didn't improve task performance -> contextual tips, deferred registration -> NN/g, HIG (VERIFIED).
22. Infinite scroll without position restoration -> Back dumps user at top -> pagination/"load more" + restore -> NN/g (VERIFIED).
23. Using `unload` handlers/`no-store` on app pages -> blocks bfcache so Back is slow -> avoid -> web.dev (VERIFIED).
24. Using "thumb-zone" maps to push all controls into one corner -> Back button in top corner is used constantly; accuracy is better at center -> bottom nav + center content + top back -> Hoober 2017 (VERIFIED-RAW).

---

## Disagreements & weak-evidence zones

- Hamburger menus: NN/g 2016 (179 users, content sites, desktop+mobile; says visible/combo beat hidden) vs Hoober 2017 ("goes too far"; his menu-found-within-seconds result is internal) vs product A/B stories (Facebook strong but unquantified; Redbooth confounded; Polar/Zeebox unverified). Consensus: don't hide core, hidden is fine for tertiary. Strength: moderate for content sites, weak for modern native apps (2016, pre-gesture-nav era; I found no post-2020 controlled replication).
- Bottom-tab count (5): convention from Material/NN/g/Hoober, geometry-based, no empirical 5-vs-6 test found. Apple deliberately gives no number; UIKit implementation cap of 5 slots.
- Thumb zone: comfort maps (Hurff/Clark) vs accuracy/viewing data favoring center (Hoober, R95 numbers) vs Park et al. showing bottom is least accurate. Clark himself separates comfort from accuracy. The thumb-zone images are conceptual; do not treat as measured heatmaps. Hoober's 2013 column is superseded by his 2017 series (he says so).
- Touch size numbers conflict (44 pt, 48 dp, 7.5 mm MS, 9–10 mm research, 24 px WCAG AA, 44 px AAA). Resolution: platform floors for implementation; research mm for high-risk contexts; WCAG 24 px is a legal floor with exemptions, not a design target.
- Label visibility: Material component default hides labels at ≥4 items; NN/g/HIG say show labels. Pick labeled.
- Hide-on-scroll: widely practiced; only guideline-level support (NN/g sticky headers), no measured benefit found; a11y downside documented (Material disables for TalkBack).
- Swipe actions: NN/g (T2, qualitative) says limit to destructive; Apple/Android treat them as standard accelerators; no usage-rate data found.
- Pull-to-refresh: used everywhere; I found no NN/g/HIG page; criticisms are T4 (Wikipedia). Treat as convention requiring an alternative (Android doc).
- 3-click rule: debunked (Porter 2003 via NN/g); but NN/g's counter is about clear labeling and wayfinding, not unlimited depth.
- "Tabs in tabs" and "max 3 levels" are synthesis/opinion; evidence supports clarity and ≤2 disclosure levels, not a specific depth.
- Hold-to-confirm and the exact number of swipe actions per row: MEMORY/opinion.
- Material 3 Expressive navigation changes: from component docs only (summarized); m3.material.io unreachable.
- Trend vs rule: iOS 26-27 Liquid Glass floating bottom tab bars/search at bottom; M3 Expressive docked/floating toolbars. These are platform direction (T1) but not evidence of better usability; Apple revised Liquid Glass at WWDC26 for legibility (Wikipedia-sourced search snippet only — SNIPPET).

---

## Gaps (what I could not verify; unfinished topics)

- Baymard mobile filtering/sorting/navigation/search findings: not obtained (article URLs unknown; site returned shells; WebSearch budget exhausted).
- m3.material.io pages (Navigation bar, rail, drawer, gestures, FAB menu, "Expressive") unreachable; Material gesture vocabulary and exact M3 nav spec not verified beyond Android/GitHub component docs. M3 Expressive details (floating/docked toolbar dimensions) not fetched (Toolbar.md 404).
- Apple "navigation styles" (hierarchical/flat/content-driven) and a pull-to-refresh HIG page: not found in current HIG index; iOS 26/27 specifics limited to change-log entries (tab bars, search, scroll views) and the pages above. iPhone Duo page read via summary only (raw saved in scratchpad `raw05/designing-for-iphone-duo.hig.txt`).
- Android back-gesture edge width in dp and exact gesture-exclusion limits (200 dp is SNIPPET); bottom 40 dp figure is from a summary.
- Primary papers (Parhi 2006, Henze 2011, Park 2008, Lee & Zhai 2009, Schildbach 2010, Bergstrom-Lehtovirta CHI'14, Ng CHI'14, Qian Fei) were not read; numbers come via Hoober's reference notes. Hoober & Shank phablet/tablet stats are secondhand via Clark.
- Facebook exact metrics, Spotify/Polar/Zeebox numbers (TheNextWeb fetch failed), Instagram/YouTube nav history: not verified.
- No evidence gathered on: swipe-action usage rates; hide-on-scroll task impact; hold-to-confirm patterns; undo toast durations; selection-mode/contextual action bar guidance from Material; drag-handle/reorder specifics beyond HIG/WCAG/NN/g; screen-reader gesture models (VoiceOver/TalkBack); iOS keyboard layout guide details; CSS `svh/lvh/dvh` (web.dev page 404, MEMORY only); iOS standalone-PWA back-swipe behavior; PWA manifest `scope`/`id`/navigation-capturing; WCAG 3 draft status; web haptics support.
- Tablet/foldable thumb-reach research newer than 2015 (Clark/Hoober) not found; Surface Duo NN/g article is old.
- Items marked MEMORY in this file: re-tap-active-tab-scrolls-to-top convention; exact SwiftUI/Compose/Flutter modifier names; Flutter NavigationBar 2–5 assertion; `navigator.vibrate` iOS support; 1 CSS px definition; swipe-actions-per-row count; undo toast ≥5 s; Material top tabs vs nav bar usage.
