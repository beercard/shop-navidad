# 01 — Official platform design guidelines (Apple HIG, Material 3 / Android) + cross-platform comparison

Research date: 2026-10-06. Method: HIG pages fetched as JSON (`developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json`) and converted to text; Apple docs via `/tutorials/data/documentation/...json`; Android docs via curl of `developer.android.com`; Material component docs from `raw.githubusercontent.com/material-components/material-components-android/master/docs/...` (official T1, implementation-side); `m3.material.io` was UNREACHABLE (ECONNREFUSED from sandbox) and the web-search budget (200/200) ran out mid-session, so M3 *spec-site* statements are only used where a fetched Google/Android page repeats them. Everything is paraphrased.

**Currency check (important):** As of today iOS 27 / iPadOS 27 is shipping (rollout began 2026-09-14), Xcode 27 SDK ignores the Liquid Glass opt-out, HIG has a brand-new "Designing for iPhone Duo" page (2026-09-09, folding iPhone), Android 16 is current with Android 17 behavior changes published, Compose Material3 stable is 1.4.0 with 1.5.0-alpha29 (2026-09-23) graduating many M3 Expressive APIs to non-experimental. Training-data assumptions about "iOS 26 = newest" are stale.

## Sources consulted
| URL | Tier | Verified? |
|---|---|---|
| https://developer.apple.com/design/human-interface-guidelines/layout (JSON) | T1 | VERIFIED (changelog to 2026-09-09; no margin numbers in text) |
| .../human-interface-guidelines/tab-bars, toolbars, sheets, alerts, action-sheets, modality | T1 | VERIFIED |
| .../human-interface-guidelines/menus, pull-down-buttons, context-menus, lists-and-tables | T1 | VERIFIED |
| .../human-interface-guidelines/searching, search-fields, pickers, toggles, segmented-controls | T1 | VERIFIED |
| .../human-interface-guidelines/progress-indicators, loading, launching, onboarding, feedback, entering-data, text-fields | T1 | VERIFIED |
| .../human-interface-guidelines/gestures, playing-haptics, motion, scroll-views, sidebars, undo-and-redo | T1 | VERIFIED |
| .../human-interface-guidelines/typography (incl. tabbed Dynamic Type tables), color, dark-mode, materials, accessibility, buttons | T1 | VERIFIED |
| .../human-interface-guidelines/privacy, writing, designing-for-ios, design-principles, designing-for-iphone-duo | T1 | VERIFIED |
| https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass (JSON) | T1 | VERIFIED (the iOS 26 delta list) |
| https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility | T1 | VERIFIED |
| https://developer.apple.com/documentation/uikit/uitabbarcontroller; .../uikit/requesting-access-to-protected-resources; .../uikit/uiview/layoutmargins | T1 | VERIFIED |
| https://developer.apple.com/design/whats-new/ | T1 | VERIFIED via WebFetch summary (dates only; summary had some noise, cross-checked with page changelogs) |
| https://www.apple.com/os/ios/ ; https://www.apple.com/om/newsroom/2026/09/major-updates-for-apples-software-platforms-are-now-available/ | T1 | VERIFIED via WebFetch summary (slider, rollout date) |
| https://developer.android.com/design/ui/mobile/guides/foundations/system-bars; .../layout-and-content/edge-to-edge; .../layout-basics; .../grids-and-units; .../adapt-layout; .../patterns/predictive-back; .../foundations/accessibility; .../styles/themes | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/layouts/adaptive/window-size-classes; canonical-layouts; build-adaptive-navigation; adaptive-dos-and-donts; app-orientation-aspect-ratio-resizability | T1 | VERIFIED |
| https://developer.android.com/docs/quality-guidelines/large-screen-app-quality (now "Adaptive app quality guidelines", updated 2026-10-03) | T1 | VERIFIED |
| https://developer.android.com/about/versions/16/behavior-changes-16 ; .../17/behavior-changes-17 | T1 | VERIFIED |
| https://developer.android.com/guide/navigation/principles ; .../custom-back/predictive-back-gesture | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/components/navigation-bar, dialog, bottom-sheets, snackbar; .../designsystems/material3 | T1 | VERIFIED |
| https://developer.android.com/develop/ui/views/haptics/haptics-design-principles ; .../add-haptic-feedback (haptic-feedback page) | T1 | VERIFIED |
| https://developer.android.com/training/permissions/requesting ; .../usage-notes | T1 | VERIFIED |
| https://developer.android.com/about/versions/14/features (nonlinear font scaling to 200%) ; /training/multiscreen/screendensities | T1 | VERIFIED |
| https://developer.android.com/jetpack/androidx/releases/compose-material3 | T1 | VERIFIED (versions, graduation of Expressive APIs) |
| https://support.google.com/accessibility/android/answer/7101858 | T1 | VERIFIED via WebFetch summary (48dp ≈ 9mm, 8dp spacing) |
| material-components-android `docs/components/*.md` (BottomNavigation, NavigationRail, NavigationDrawer, TopAppBar, BottomAppBar, DockedToolbar, FloatingToolbar, BottomSheet, SideSheet, Dialog, Snackbar, FAB, ExtendedFAB, FabMenu, Chip, Card, List, Search, Switch, Slider, ProgressIndicator, ButtonGroup, ToggleButtonGroup, SplitButton, LoadingIndicator, Tabs, TextField, DatePicker, TimePicker, Menu, Carousel) | T1 (implementation-side of M3) | VERIFIED |
| material-components-android `docs/theming/Typography.md, Color.md, Shape.md, Motion.md` | T1 | VERIFIED |
| https://docs.flutter.dev/platform-integration/platform-adaptations ; /ui/adaptive-responsive/general | T1 (Flutter) | VERIFIED |
| https://design.google/library/expressive-material-design-google-research | T1-vendor (self-reported research) | VERIFIED via WebFetch summary |
| https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; target-size-enhanced.html | T1 | VERIFIED |
| https://www.nngroup.com/articles/hamburger-menus/ | T2 | VERIFIED via WebFetch summary |
| https://www.nngroup.com/articles/liquid-glass/ | T2 (expert review, not testing) | VERIFIED via WebFetch summary |
| https://lawsofux.com/jakobs-law/ | T2/T4 (no cited data on page) | VERIFIED via WebFetch summary |
| https://www.useyourloaf.com/blog/iphone-17-screen-sizes/ | T3 | VERIFIED via WebFetch summary |
| Web-search snippets (Wikipedia, etvbharat, techtimes, BGR etc.) about iOS 27 Liquid Glass tuning | T4 | SNIPPET only |

---
## Findings

### F1 Apple's design language right now: iOS 26 Liquid Glass → iOS 27 refinements
- Claim: iOS 26 (June 2025) introduced Liquid Glass; iOS 27 (announced 2026-06-08, rollout 2026-09-14) refines it (more uniform refraction, better contrast, a user slider from ultra-clear to fully tinted in Settings, sharper icons). Apps built with the iOS 27 SDK can no longer opt out of the new look.
- Evidence: Apple "Adopting Liquid Glass" (T1, VERIFIED) lists the iOS 26 delta: floating tab bars, grouped toolbars, inset half-sheets, action sheets anchored to their source, larger row heights, rounder corners, title-case section headers, search-tab semantics. apple.com/os/ios + Apple newsroom 2026-09 (T1, VERIFIED via fetch summary): slider "from ultraclear to fully tinted", refraction/contrast improvements, release 2026-09-14. UIDesignRequiresCompatibility doc (T1, VERIFIED): "ignored when you build for iOS 27 or later".
- Corroboration / conflict: NN/g (T2, expert review only, no sample) criticized iOS 26 legibility, cramped tab bars, lost back-button label, search moved to bottom. Apple adding a user transparency control in iOS 27 is consistent with those complaints (inference, not stated by Apple). "Reduced default transparency" in iOS 27 appears only in T4 snippets (SNIPPET).
- Scope: iOS (iPadOS/macOS share the material).
- Context (when it flips): Android/web/cross-platform apps do not inherit any of this; only native/system components pick it up automatically. Custom-drawn bars must opt in manually.
- Agent rule: IF targeting iOS 26+ THEN use system components (tab bar, toolbar, sheet, menu) and remove custom bar/sheet/popover backgrounds; never hard-code bar heights, corner radii or row heights; assume users may choose clear OR tinted glass and Reduce Transparency, so test legibility at both extremes. IF you must keep a pre-26 look THEN note the opt-out key is dead for iOS 27 SDK builds.
- Stack notes: SwiftUI `glassEffect`, `GlassEffectContainer`, `scrollEdgeEffectStyle`, `.tabBarMinimizeBehavior`, `TabView` `sidebarAdaptable`; UIKit `UITabBar` etc. Flutter/RN: Cupertino/native-bridged components only approximate it.

### F2 Liquid Glass rules that matter for any imitation
- Claim: Glass is for the functional layer (tab bars, toolbars, sidebars, sheets, menus, controls while being touched) that floats above content, NOT for content-layer surfaces. Use it sparingly on custom controls; "regular" variant for text-heavy components, "clear" only over rich media; if media behind clear glass is bright add ~35% dark dim.
- Evidence: HIG materials, color, layout, toolbars, scroll-views (T1, VERIFIED). Content layer uses four standard materials (ultraThin, thin, regular, thick). Color: glass has no inherent color; apply color to the *background* of one primary action (prominent button), not to symbols/text; prefer monochrome bars when content is colorful. Scroll-edge effect (soft/hard/automatic) replaces custom gradient/opaque bar backgrounds; one per view/pane.
- Corroboration: Android's edge-to-edge doc (T1) solves the same legibility problem with status-bar "protection" gradients/scrims (F28) — same principle: content runs underneath, a thin protection layer preserves legibility.
- Scope: iOS; principle (separate navigation/control layer from content, content extends beneath) is universal.
- Context: Reduce Transparency / Increase Contrast / Reduce Motion and the new iOS 27 slider change glass rendering.
- Agent rule: IF building custom chrome on iOS THEN extend content under bars, add a scroll-edge/protection layer instead of a solid bar fill, tint at most one primary action, keep resting-state (scrolled-to-top) contrast legible. IF a design puts glass on cards/list rows THEN reject it.

### F3 iOS tab bar rules
- Claim: Tab bar = navigation between top-level sections only (never actions); keep it visible on every screen of the section (exception: covered by a modal); don't hide or disable tabs (explain empty sections instead); give every tab a label (single words) plus a filled-style symbol; badge only for critical info.
- Evidence: HIG tab-bars (T1, VERIFIED, changelog 2025-07-28, 2025-12-16, 2026-06-08). Tab bar preserves per-section navigation state. iOS: floats over content on glass; can minimize on scroll with a bottom accessory inline (e.g., mini-player); a dedicated Search tab can sit at the trailing end. iPadOS: tab bar near top that can convert to a sidebar; customization default list ≤5 tabs. Item count: HIG gives no number; UIKit (T1, VERIFIED) shows 4 tabs + "More" when 6+ are defined, i.e. 5 visible max on iPhone; HIG says avoid overflow.
- Corroboration: Android navigation bar for 3–5 equal-importance destinations (F18); NN/g hidden-nav study (T2): hidden navigation on mobile was used less (57% vs 86% for combo) and was ~15% slower, >20% less content discoverability (179 participants, 6 sites, remote; mostly *websites*).
- Scope: iOS (iPhone bottom; iPad top); principle universal.
- Context: more than ~5 primary areas → tab bar adapting to sidebar on iPad / Material expanded rail; never push the 6th item into "More" for core flows.
- Agent rule: IF an app has 2–5 peer top-level destinations THEN use a persistent tab/navigation bar with icon+label and per-tab state restoration. IF >5 THEN promote the top 4–5 and move the rest into a destination hub, search, or adaptive sidebar. NEVER hide/disable a tab; show an empty/explanatory state.
- Stack notes: SwiftUI `TabView` with `Tab` + `.tabViewStyle(.sidebarAdaptable)`; Compose `NavigationSuiteScaffold`; Flutter `CupertinoTabBar` vs `NavigationBar`.

### F4 iOS toolbars, navigation bars, large titles
- Claim: HIG now folds navigation-bar guidance into "Toolbars" (the `navigation-bars` slug 404s). Rules: ≤3 groups; leading edge = back/close + title; trailing = primary action (prominent style, only one) + More; use standard Back/Close symbols (do not label them "Back"/"Close"); icons without borders; never mix text-labeled and symbol buttons in one shared-background group; titles <15 chars, never the app name; large title by default on iPhone, collapsing to standard on scroll.
- Evidence: HIG toolbars (T1, VERIFIED, changelogs 2025-06-09, 2025-12-16). Flutter doc (T1) corroborates legacy iOS bar height 44pt (`toolbarHeight: 44`), VERIFIED but pre-Liquid-Glass.
- Corroboration: Material app bars (F19) have a title + nav icon + up to a few action icons + overflow; both hide secondary actions in an overflow/More menu.
- Scope: iOS (macOS/iPadOS differ: customizable toolbars, auto overflow).
- Agent rule: IF a screen has >3 actions THEN show the 1–3 most important as icons and put the rest in a More menu; IF a screen has a primary completion action THEN place exactly one prominent action at trailing edge; IF Back is customized THEN keep the system chevron look and edge-swipe behavior.

### F5 iOS sheets (modality)
- Claim: Sheets are for focused, short tasks. iPhone sheets support detents (large = full, medium ≈ half, custom heights); add a grabber on resizable sheets (tap cycles detents; VoiceOver-accessible); swipe-down must dismiss; if there are unsaved changes show an action sheet/confirmation instead of silently discarding; Cancel on leading edge, Done on trailing; if Done exists pair it with Cancel or Back (never all three); only one sheet at a time; use full-screen modal for multi-step/complex tasks; nonmodal sheets exist (e.g., Notes formatting).
- Evidence: HIG sheets + modality (T1, VERIFIED; sheets changelog 2026-03-24 "updated guidance for button placement"). iOS 26 delta (T1, VERIFIED): half sheets are inset from the display edge (content peeks through), corner radius increased, expanding to full height becomes more opaque; action sheets originate from the triggering control and let you interact with the rest of the UI.
- Corroboration: Material bottom sheets (F20): standard (non-modal, coexists with content) vs modal (scrim); drag handle (48dp touch target); modal hides via scrim tap/back/drag; max width 640dp; default shape ExtraLarge corners (28dp); both default to surface-container-low color (MDC docs, VERIFIED).
- Scope: iOS vs Android differ in chrome but converge on principle (see Comparison table 2).
- Agent rule: IF a task is short and parent context matters THEN use a resizable sheet with a visible grabber/handle and swipe/back-to-dismiss; IF dismissing would lose input THEN require confirmation; IF the task is multi-step or immersive THEN full-screen modal with explicit Close; NEVER stack sheets on sheets.
- Stack notes: SwiftUI `.presentationDetents([.medium,.large])`, `.presentationDragIndicator(.visible)`, `interactiveDismissDisabled`; Compose `ModalBottomSheet` + `SheetState`; web: `<dialog>` + drag handle, esc/back/swipe all dismiss.

### F6 Alerts vs action sheets vs menus (iOS)
- Claim: Alert = rare, interruptive, usually problem-or-confirmation; title + optional message + up to three buttons; verbs for buttons ("Delete", not "OK"); "Cancel" always titled Cancel; default button trailing/top; destructive style only for destructive actions the user did not already deliberately choose; don't alert for info-only, undoable or common actions, and never at launch; avoid scrolling alerts. Action sheet = choices tied to an intentional action (e.g., discard/save draft/keep editing): destructive at top, Cancel at bottom, avoid scrolling. Menus appear when the user asks; action sheets appear in response to an action.
- Evidence: HIG alerts, action-sheets, feedback, modality, pull-down-buttons (T1, VERIFIED). Pull-down menu destructive item → system shows a confirm action sheet (iOS) / popover (iPadOS).
- Corroboration: Material dialogs (F20): "purposefully interruptive", use sparingly (MDC docs, VERIFIED); Compose dialog doc lists confirm/request input/choose from list. Separately, HIG accessibility (cognitive section) advises minimizing auto-dismissing UI, which sits uneasily with Material's auto-dismissing snackbars — see Disagreements D3.
- Scope: iOS (principle universal).
- Agent rule: IF information is not actionable THEN show it inline (banner/status), not in a modal. IF user confirms an uncommon irreversible action THEN alert with specific verb button + Cancel. IF the choice is among related outcomes of an action the user just took THEN use an action sheet / confirmation dialog anchored to the source on iOS 26+. IF the action is common and undoable THEN do it and offer Undo.

### F7 Menus, pull-down buttons, context menus (iOS)
- Claim: Pull-down button needs ≥3 items to be worthwhile (fewer → buttons/toggles); don't hide all primary actions in one; More (…) menus hurt discoverability — balance. Context menus are hidden by default: always duplicate their items in visible UI; ≤ ~3 groups; submenus one level; destructive items last and red; hide (don't dim) unavailable items (opposite of regular menus, which dim); show either a context menu or an edit menu on an item, not both. Menu item icons (guidance updated 2025-07-28 and 2026-06-08): use sparingly, standard symbols, all-or-none within a group. Top context-menu actions should match swipe actions for the same row.
- Evidence: HIG menus, pull-down-buttons, context-menus, adopting-liquid-glass (T1, VERIFIED). iOS menu layouts: small (row of 4 icon-only), medium (row of 3 with labels), large (list).
- Corroboration: Material menus (dropdown, exposed dropdown) — less prominent and smaller than radio groups (MDC, VERIFIED). Flutter doc: iOS overflow icon is horizontal dots, Android vertical (VERIFIED).
- Scope: iOS; context-menu-as-only-path anti-pattern is universal (long-press is undiscoverable; accessibility needs alternative).
- Agent rule: IF an action is only reachable via long-press THEN also expose it in a visible control or row menu. IF a menu has 1–2 items THEN use buttons instead. Label menu items with verbs; ellipsis when more input follows.

### F8 Lists, search, text input (iOS)
- Claim: Lists: succinct row text; selected-row highlight persists only in navigation hierarchies, transient for option lists (then checkmark); disclosure indicator = drill in, info button = reveal info (never navigation); avoid a section index when rows have trailing controls. Search: give it a primary position if important; ONE obvious search location; show scope; suggestions/recents (offer clear-history); iOS placements: search tab (standard landing page vs button that opens keyboard immediately), bottom toolbar (preferred "if there's room"), top toolbar, or inline field; placeholder text states scope. Text fields: show keyboard type matching content, clear button on trailing end, validate on blur (email) or live (username/password), prefer pickers/menus over typing, never prepopulate password, secure fields for secrets.
- Evidence: HIG lists-and-tables, searching, search-fields (updated 2026-06-08), text-fields, entering-data (T1, VERIFIED). Material counterpart: search bar (persistent, at top) vs search view (full-screen modal); Expressive adds app-bar-with-search, centered text, contained search view animation (MDC Search.md, VERIFIED). Material text fields: filled vs outlined, 48dp min icon size, max width 488dp (MDC, VERIFIED).
- Corroboration/conflict: Search placement conflicts — HIG pushes bottom/tab; Material keeps top (D6); NN/g expert review flags iOS 26's move of search to bottom as breaking learned habits (T2 opinion).
- Scope: iOS vs Android.
- Agent rule: IF search is a primary task THEN put it where the platform puts it (iOS: tab or bottom toolbar; Android: top search bar/app-bar search) and keep results scoped/labelled; IF unsure on iOS THEN prefer search tab when content is browse-heavy, bottom toolbar when search is a quick lookup.

### F9 Controls: switches, segmented controls, pickers, progress
- Claim (iOS): switch only inside a list row (otherwise use a toggle-style button with visible pressed state); don't recolor away from sufficient contrast; never rely on color alone for state. Segmented control: closely related options that change a view/state, ≤~5 segments on iPhone (5–7 on wide UIs), text OR icons not mixed, equal widths; for switching whole sections use tab bar. Pickers: for medium-long lists, in context near the field (not a new screen); short lists → pull-down; compact/inline/wheels date picker styles; minute interval must divide 60. Progress: prefer determinate; keep it moving; don't switch spinner→bar; consistent location; cancel/pause where safe; refresh control + automatic refreshes; "Loading" labels add no value; show something immediately (placeholders) and allow other actions.
- Evidence: HIG toggles, segmented-controls, pickers, progress-indicators, loading, buttons (T1, VERIFIED). Buttons: a button can show an activity indicator and change label ("Checkout" → "Checking out…").
- Corroboration: Material: switch toggles one setting and takes effect immediately without save (MDC Switch, VERIFIED) — consistent with iOS; Material segmented button is DEPRECATED in Expressive → connected button group / toggle button group (MDC, VERIFIED); date picker variants docked/modal/modal input, time picker dial/input (MDC, VERIFIED); progress indicators: linear/circular, "only one type should represent a given activity" (MDC ProgressIndicator.md, VERIFIED) — same principle as HIG "don't swap spinner↔bar"; Expressive adds wavy shape + 8dp thick track and a separate Loading Indicator for short waits.
- Scope: iOS / Android differ in widgets, converge on semantics.
- Agent rule: IF a setting applies instantly and is binary THEN switch (iOS: in a row). IF choosing among ≤5 closely related views/filters THEN segmented/connected button group. IF duration known THEN determinate progress. IF wait <~1–2 s THEN no spinner animation lasting longer than needed; show skeleton/placeholder only when layout is known (see other slices for skeleton evidence).

### F10 Gestures, edge-swipe back, haptics
- Claim: Standard gestures (tap activate/select; swipe reveal actions/dismiss/scroll; drag move; touch-hold reveal more; double-tap zoom; pinch zoom; rotate; iOS 3-finger swipe/shake = undo/redo) must keep their meaning; custom gestures only for frequent specialized tasks, must be discoverable, simple, distinct and never the only way; shortcut gestures supplement visible controls (swipe-back plus a Back button). People hold phones with reach to middle/bottom: swipe-to-go-back and row swipe actions matter. Haptics: use system patterns for their documented meaning (notification = outcome; impact = physical metaphor; selection = changing values); short, occasional, optional; sync with animation; don't haptic every tap.
- Evidence: HIG gestures, playing-haptics, designing-for-ios, accessibility (T1, VERIFIED). Android haptics doc (T1, VERIFIED): less is more; use `HapticFeedbackConstants` (CONFIRM/REJECT/VIRTUAL_KEY...) rather than legacy one-shot `vibrate(ms)`; a good key-click lasts ~10–20 ms; "buzzy" haptics are worse than none; scale strength with importance/frequency; co-design with visuals/audio.
- Corroboration: Flutter (T1, VERIFIED): text long-press word-select buzzes on Android but not iOS; iOS picker scroll gives a light impact, Android none → platform haptic idioms differ.
- Scope: universal principle; API/semantics platform-specific.
- Agent rule: IF a gesture performs an important action THEN provide a visible alternative control (swipe-to-delete → also delete in a menu/edit mode; Android a11y doc and HIG both require). IF adding haptics THEN use platform constants (`UIFeedbackGenerator` / `HapticFeedbackConstants`), one meaning per pattern, off-switchable.
- Stack notes: web: `navigator.vibrate` is Android-Chrome only and not iOS Safari (MEMORY) — treat as progressive enhancement.

### F11 iOS typography and Dynamic Type
- Claim: Default body = 17 pt (min 11 pt); system font SF Pro (NY serif optional); use built-in text styles + Dynamic Type; avoid Ultralight/Thin/Light; users should be able to enlarge text ≥200%; at large sizes prioritize meaningful content (tab titles don't need to grow), stack horizontal layouts, reduce columns, minimize truncation, keep hierarchy; increase meaningful icon size with text.
- Evidence: HIG typography (full per-size tables extracted from tabbed JSON), accessibility (T1, VERIFIED). Default ("Large") iOS table in Numbers. Emphasized weights added to Dynamic Type specs 2025-12-16.
- Corroboration: Android: sp for text, dp for layout; ≥12sp body floor; Android 14 non-linear font scaling up to 200% (T1, VERIFIED); M3 type scale in Numbers; Compose guidance "never use sp for layout sizes" (screendensities doc, VERIFIED).
- Scope: iOS/Android; universal principle: user-controlled text scale must reflow, not clip.
- Agent rule: IF specifying type THEN reference semantic roles (title/body/caption) mapped to platform text styles; test at 200% (iOS AX sizes up to AX5: body 53 pt) and with long localized strings; allow multi-line and vertical stacking.
- Stack notes: CSS `rem`/`clamp()` with user font-size respected, avoid `px` for text; Flutter `MediaQuery.textScaler`; RN `allowFontScaling`/`maxFontSizeMultiplier` (MEMORY).

### F12 iOS color, dark mode, contrast
- Claim: Use semantic system colors (label/secondaryLabel/…, systemBackground levels, grouped vs ungrouped backgrounds); never hard-code system color values (they shift per release); never repurpose semantic meanings (don't use separator color as text); provide light, dark AND increased-contrast variants for every custom color, even in single-appearance apps; no app-specific appearance toggle; dark mode uses base vs elevated backgrounds for layered surfaces; contrast: ≥4.5:1 minimum in dark mode, aim 7:1 for small text; Apple's inspector uses WCAG AA: ≤17pt 4.5:1, 18pt 3:1, any bold 3:1; don't rely on color alone (add shape/icon/text).
- Evidence: HIG color, dark-mode, accessibility (T1, VERIFIED).
- Corroboration: Android (T1, VERIFIED): follow system light/dark; don't lock to light; in-app theme controls are acceptable (differs from HIG); contrast 4.5:1 text, 3:1 surfaces/non-text; dynamic color from wallpaper (Android 12+) with custom fallback theme.
- Scope: iOS vs Android (in-app theme toggle policy differs).
- Agent rule: IF an app is cross-platform THEN respect OS appearance by default; on iOS don't ship an in-app dark/light switch (offer only if user research demands it; HIG discourages); on Android an in-app override is acceptable. Define semantic tokens (surface/onSurface/outline/…); derive both modes.

### F13 Motion (HIG vs Material)
- Claim (HIG): motion must be purposeful, optional, brief, realistic to gesture direction (slide down in → slide down out), avoid motion on frequent interactions, never make people wait for an animation, always allow cancel; honor Reduce Motion by tightening springs, tracking gestures, replacing x/y/z travel with fades, avoiding blur animation and depth animation; Liquid Glass motion responds to touch more strongly than to pointer. HIG gives NO duration/easing numbers.
- Evidence: HIG motion, accessibility (T1, VERIFIED). Material gives tokens (see Numbers): durations 50–1000 ms in 16 steps, 7 easings, 6 spring slots (fast/default/slow × spatial/effects) (MDC Motion.md, VERIFIED).
- Scope: universal principle; numeric tokens Android/M3 only.
- Agent rule: IF you need motion values on Android/M3 THEN use the token set (e.g., standard easing cubic-bezier(0.2,0,0,1), 200–500 ms by travel distance, springs for spatial motion); IF on iOS THEN prefer system spring animations and standard transitions; ALWAYS provide a Reduce-Motion path (cross-fade).

### F14 Permissions, privacy, onboarding, launching, writing
- Claim: Ask only when the feature needs it (in context; at launch only if the app can't function without it); purpose string = one specific active-voice sentence; a pre-permission screen must have ONE button that opens the system prompt, titled "Continue/Next" (never "Allow", no Cancel) except legal consent; tracking prompts must not be preceded by manipulative screens (App Store rejection). iOS asks once — after deny the OS never re-prompts (app must link to Settings). Location button gives one-time access. Launch screen = near-identical to first screen, no text/branding; restore previous state; onboarding optional, interactive, short, defer ratings/purchases and non-essential setup; writing: verbs, no "oops", errors adjacent to field and say how to fix, avoid "we"/"your" overuse, empty states give next step, "tap" not "click".
- Evidence: HIG privacy, launching, onboarding, writing, entering-data (T1, VERIFIED); Apple "requesting access to protected resources" (T1, VERIFIED: system prompt first time only; denial persists). Android permissions (T1, VERIFIED): ask in context; don't block the user from an educational flow; degrade gracefully; a rationale UI is allowed/encouraged when `shouldShowRequestPermissionRationale`; a second Deny = permanent (no more system dialog); never request everything at startup.
- Scope: iOS vs Android differ in mechanics (D7); principles identical.
- Agent rule: IF a feature needs a permission THEN: (1) trigger from the user action, (2) optional one-screen rationale with a single neutral CTA (iOS) / dismissible rationale (Android), (3) fire the system prompt, (4) handle denial by disabling the feature with an explanation + deep link to Settings. NEVER fire permission prompts in a cold start sequence.

### F15 Touch target sizes (the number conflict resolved)
- Claim: Apple: hit region ≥44×44 pt default; HIG accessibility table also lists a 28×28 pt *minimum* control size on iOS/iPadOS; add ≈12 pt padding around bezeled controls and ≈24 pt around bezel-less ones. Android/Material: ≥48×48 dp (≈9 mm; recommended physical range 7–10 mm) with ≥8 dp between targets, even if the visual is smaller. WCAG 2.2: 24×24 CSS px minimum (AA 2.5.8, spacing exception) and 44×44 CSS px enhanced (AAA 2.5.5).
- Evidence: HIG buttons + accessibility (T1, VERIFIED); Android accessibility + Google Support (T1, VERIFIED); WCAG (T1, VERIFIED). 44 pt on a 163–153 pt/in iPhone ≈ 7 mm (derived estimate, MEMORY).
- Corroboration: NN/g Liquid Glass review cites 1 cm guideline violation in cramped bars (T2 expert opinion).
- Scope: universal; numbers differ by platform.
- Context: dense enterprise/desktop-like UIs may use 28–32 targets only with ≥24 spacing and pointer/stylus input; touch-primary flows stay at ≥44/48.
- Agent rule: IF unspecified THEN size tap targets ≥48×48 (satisfies 44pt, 48dp and both WCAG levels), extend hit area beyond the glyph (padding/hit-slop), keep ≥8 dp gap. Never go below 28 even on iOS; below 44 only for secondary actions with generous spacing.

### F16 iOS layout, safe areas, size classes (+ iPhone Duo)
- Claim: Use system safe areas, layout margins and readable guides (HIG layout publishes no numeric margins now); decide layout from size classes (compact/regular horizontal+vertical), not from device idiom or orientation; keep functionality constant while changing how much is visible (tab bar → sidebar, reveal overflow actions); support text-size and locale changes; extend full-bleed backgrounds under bars. NEW (2026-09-09): iPhone Duo (two displays + hinge): outer display compact width, inner regular width; system moves toolbars/tab bars to the SIDE (vertical axis) except inner display in portrait; reserved regions (cameras, fold) — use size classes + safe-area insets, avoid fixed widths; prefer even column counts in grids; "arrangement view" containers for primary/secondary panes; keep nav containers outside them.
- Evidence: HIG layout, designing-for-iphone-duo (T1, VERIFIED); UIKit `layoutMargins` doc (T1, VERIFIED: subviews default 8 pt, root view reflects system minimum margins). Portrait safe-area insets (T3, VERIFIED via fetch summary): iPhone 17/17 Pro 402×874 pt top 62 bottom 34; 17 Pro Max 440×956; iPhone Air 420×912 top 68.
- Corroboration: Android window size classes (F29) — same idea (size class not device type); Apple has 2 classes vs Android 5.
- Scope: iOS.
- Agent rule: IF building responsive mobile UI THEN branch on available width/height classes (not on "isTablet"/"isIPhone"), honor safe-area insets on all four sides, cap content/text measure on wide windows, and treat bars as possibly on the side.
- Stack notes: CSS `env(safe-area-inset-*)`, `viewport-fit=cover`, container/width queries; Flutter `SafeArea`/`MediaQuery.sizeOf`/`LayoutBuilder`; RN `react-native-safe-area-context`.

### F17 HIG design principles (re-introduced 2026-06-08)
- Claim: Eight principles — Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight. Familiarity explicitly says build on known patterns and keep behavior consistent; Agency says guided flows must be skippable and mistakes recoverable; Flexibility says approach every platform with intention.
- Evidence: HIG design-principles (T1, VERIFIED).
- Corroboration: Jakob's Law (lawsofux, T2/T4): users prefer products that work like others they know — page cites no empirical study (weak-evidence zone, but consistent with Apple/Google/Flutter guidance).
- Scope: universal.
- Agent rule: IF choosing between a novel and a platform-standard pattern for a basic task THEN pick the standard unless testing shows a measured win.

### F18 Material 3 and "M3 Expressive": what is official vs marketing
- Claim: M3 Expressive is an official expansion of Material 3 (not a new "Material 4"), implemented in Material Components for Android (`Material3Expressive` themes) and Compose Material3 (stable 1.4.0; 1.5 alphas, 2026-09-23, graduating TopAppBar flexible variants, FloatingToolbar, FAB/FAB menu, buttons, menus from experimental). Google says it complements the Android 16 system UI visual style. Concrete, verifiable changes: nav bar height 80→64 dp; nav rail 80→96 dp and a new *expanded* rail that replaces the navigation drawer (drawer deprecated); bottom app bar → docked toolbar (shorter) + floating toolbar; top app bar renamed "app bar" with search app bar + medium/large *flexible* variants (old medium/large deprecated; subtitles, wrapping, left/center title); FAB sizes 56/80/96 dp, medium FAB "most recommended", small FAB deprecated, surface FABs deprecated, FAB menu (2–6 actions); extended FAB small/medium/large (56/80/96); button groups (standard/connected) replace segmented buttons; split button; icon buttons in 5 sizes × round/square with shape morph; slider XS–XL, vertical, inset icon; progress indicators gain wavy shape and 8 dp thick track plus loading indicator; emphasized type scale; spring-based motion (6 spring tokens).
- Evidence: MDC docs per component (T1, VERIFIED, each has an "M3 Expressive" section); Compose M3 doc + release notes (T1, VERIFIED).
- Marketing / weakly-evidenced: Google's design blog claims 46 studies, >18,000 participants, 87% preference among 18–24-year-olds, "up to 4×" faster spotting of key UI elements, +32%/+34%/+30% brand perception (vendor-reported). The article gives no per-study sample sizes, significance tests or independence; it also concedes novelty/familiarity effects (VERIFIED via fetch summary). Treat as directional, not as rules.
- Scope: Android/Material only (Compose, Views, Flutter via Material 3 lib, Web via material-web). Wear OS uses a separate library.
- Agent rule: IF targeting Android THEN adopt M3 + selectively Expressive components that solve a task problem (flexible app bar, expanded rail, docked/floating toolbar, medium FAB, connected button group); don't adopt shape-morph/wavy/vibrant color for its own sake in dense or utilitarian apps. NEVER cite the "4× faster" claim as a design rule.

### F19 Android/Material navigation containers and window-size-class rules
- Claim: Navigation bar: 3–5 destinations of equal importance, consistent across screens, compact windows. Navigation rail (collapsed): 3 to no more than 7 destinations, medium+ windows; expanded rail (Expressive) replaces the drawer, non-modal, collapses back to the rail. Drawer: standard (tablet/desktop, coexists with content) vs modal (mobile, scrim) — now deprecated in favor of expanded rail. Adaptive default: `NavigationSuiteScaffold` shows a bar when width OR height is compact (or tabletop posture), otherwise a rail. Expressive nav bar gets horizontal icon-start items at ≥600 dp. Label visibility default AUTO = labeled for ≤3 items, selected-only for 4+ (component default).
- Evidence: Compose navigation-bar doc + adaptive-navigation doc (T1, VERIFIED); MDC BottomNavigation, NavigationRail, NavigationDrawer (T1, VERIFIED); system-bars doc says switching rail↔bar by window size class is the common Android pattern (VERIFIED).
- Corroboration: HIG: tab bar adapts to sidebar on iPad; "Consider a tab bar first"; sidebars show ≤2 levels (VERIFIED). Flutter adaptive doc recommends NavigationBar small / NavigationRail large (VERIFIED).
- Conflict: MDC default label mode hides unselected labels at 4+ items while HIG says always label tabs (D4).
- Scope: Android (iPad analog in F3).
- Agent rule: IF compact width THEN 3–5 item bottom bar with always-visible labels (override AUTO label mode); IF medium/expanded THEN rail (≤7), expanded rail for secondary destinations; IF >7 destinations THEN information-architecture problem — restructure.
- Stack notes: Compose `NavigationSuiteScaffold`, `WindowSizeClass`; Flutter `NavigationBar`/`NavigationRail`/`NavigationDrawer`; CSS: `@media (min-width:600px)` / `840px`.

### F20 Android/Material app bars, FAB, sheets, dialogs, snackbars
- Claim: App bars: search / small / medium flexible / large flexible; collapse on scroll (small can collapse to status-bar height or scroll away); contextual action bar replaces the bar during selection; avoid stacking custom status-bar protection with the built-in one. FAB = the single primary action of a screen (not a generic "+"); FAB menu opens 2–6 related actions in the same place; keep a 16 dp margin; snackbars shouldn't cover it. Bottom sheets: standard (no scrim, coexists) vs modal (scrim); ≤640 dp wide; handle; should become side sheets on larger windows. Dialogs: basic (alert/quick selection/confirmation) and full-screen (multi-task; the only dialog that other dialogs may appear over); interruptive → sparingly. Snackbar: brief status of a process, no required input, one at a time, auto-dismiss (short/long/indefinite), may carry one action (undo/retry), swipe-dismiss.
- Evidence: MDC TopAppBar, FAB, ExtendedFAB, FabMenu, BottomSheet, SideSheet, Dialog, Snackbar (T1, VERIFIED); Compose dialog/bottom-sheet/snackbar docs (T1, VERIFIED); Android edge-to-edge doc: collapse bars on scroll, translucent bars when content scrolls under (VERIFIED); adapt-layout doc: bottom sheet can change presentation to side sheet at large sizes (VERIFIED).
- Corroboration: iOS counterparts in F5/F6; HIG has no snackbar — it favors inline status and discourages time-boxed UI (accessibility, cognitive): D3.
- Scope: Android; snackbar pattern is used on iOS cross-platform apps as "toast" but is NOT an iOS system pattern.
- Agent rule: IF a transient confirmation with Undo is needed on Android THEN snackbar (≥ accessibility-recommended timeout; persist when it carries an action the user may need); IF on iOS THEN prefer inline confirmation + undo affordance or haptic, or a toast only as a clearly custom component. Reserve one FAB per screen for the primary create action; hide/shrink it on scroll only if the action remains reachable.

### F21 Material selection, list and container components
- Claim: Chips: assist / filter / input / suggestion; min height 32 dp but 48 dp touch target enforced. Cards: elevated / filled / outlined; 8 dp margins on mobile; default elevation 0 (outlined/filled), 1 dp (elevated). Lists: one-, two-, three-line items. Tabs: primary (under app bar, main destinations; 48 dp inline text / 72 dp icon+text) vs secondary (within content). Switch effect immediate. Slider thumb 48 dp touch target. Segmented buttons deprecated (→ connected button group). Date picker docked/modal/modal-input; time picker dial/input. Carousel strategies (multi-browse, hero, full-screen). Text fields filled/outlined, max width 488 dp.
- Evidence: MDC docs (T1, VERIFIED).
- Scope: Android/Material.
- Agent rule: IF filtering a list by facets THEN filter chips (min 48 dp target); IF in-content view switching of 2–5 options THEN tabs or connected button group; IF a card is a whole-item tap target THEN make the entire card the target and keep inner actions ≥48 dp apart.

### F22 Material color, type, shape, elevation, state
- Claim: Color roles: primary/secondary/tertiary (+ on-, container, on-container, fixed), error, surface, surface-dim/bright, five surface-container levels, on-surface(-variant), outline(-variant), inverse. Dynamic color (Android 12+, wallpaper-derived; separate tables for API 31–33 and 34+) with a branded static fallback theme. Elevation is now expressed as tonal surface-container roles (library ≥1.11 replaced elevation overlays) + shadows only where needed. Type scale: 15 baseline roles (Display 57/45/36, Headline 32/28/24, Title 22/16/14, Body 16/14/12, Label 14/12/11 sp) + 15 *emphasized* variants (one weight step heavier). Shape scale: 0/4/8/12/16/20/28/32/48 dp + full.
- Evidence: MDC theming docs (Typography.md, Color.md, Shape.md) and Android themes doc (T1, VERIFIED).
- Scope: Android/Material; the *semantic role* idea is universal.
- Agent rule: IF theming cross-platform THEN define semantic roles (surface levels, on-colors, outline, error, container pairs) and map per platform; always pair "container" with "on-container"; don't pick colors per component.

### F23 Edge-to-edge, system bars, gesture insets (Android 15+)
- Claim: Android 15 enforced edge-to-edge for apps targeting 35; Android 16 removed the opt-out for apps targeting 36. Bars should be transparent/translucent; draw backgrounds/dividers edge-to-edge but inset text/buttons via WindowInsets (system bar, gesture, display-cutout insets); never put tap/drag targets under gesture insets (collides with back/home swipes); keep the gesture-nav bar transparent (no background or extra scrim); three-button nav gets a scrim only when content scrolls under it; solid app-bar backgrounds may draw into cutouts but critical UI is inset; carousels can scroll through cutouts; separate protection per pane/drawer.
- Evidence: Android system-bars + edge-to-edge docs; Android 16 behavior changes (T1, VERIFIED).
- Corroboration: iOS safe areas/scroll-edge effect (F2, F16).
- Scope: Android.
- Agent rule: IF Android THEN call edge-to-edge setup, consume insets per component (not blanket padding), and test with 3-button and gesture nav, cutouts, landscape.
- Stack notes: Compose `enableEdgeToEdge()`, `Modifier.windowInsetsPadding`, `Scaffold` contentPadding; Flutter `SafeArea` + `SystemUiMode.edgeToEdge`; web `env(safe-area-inset-*)`.

### F24 Predictive back (Android)
- Claim: Back gesture previews the destination before commit. System animations (back-to-home, cross-task, cross-activity) are on by default for apps targeting API 36 on Android 16+; `onBackPressed`/`KEYCODE_BACK` are no longer delivered; opt-out flag (`enableOnBackInvokedCallback=false`) is temporary and ineffective for target 37. Custom full-screen transitions: scale 100→90%, enter 110→100%, exit fade by 35% progress then enter fade, 8 dp edge margin, x-shift = width/20−8 dp, preview eased with decelerate (0,0,0,1); cancel springs back; fling absorbs velocity. Material bottom/side sheets and search support it (MDC ≥1.10.0-alpha02).
- Evidence: Android predictive-back design + behavior-changes-16 + custom-back docs (T1, VERIFIED).
- Corroboration: iOS interactive pop gesture (edge swipe, interruptible) — same principle: show the back target during the gesture. Flutter doc: iOS edge swipe, Android system back (VERIFIED).
- Scope: Android (iOS analog built into nav controller).
- Agent rule: IF app has custom back handling THEN register via the supported callback/handler API (`OnBackPressedCallback` / `PredictiveBackHandler`), never intercept raw key events; IF custom transition THEN use the published scale/margin/threshold values; IF web THEN `popstate`/history API only (no equivalent preview).

### F25 Window size classes and canonical layouts (Android)
- Claim: Width classes compact <600, medium 600–839, expanded 840–1199, large 1200–1599, extra-large ≥1600 dp; height classes compact <480, medium 480–899, expanded ≥900 dp. Classes come from the WINDOW (split-screen, desktop windows, fold state), not device type; they change at runtime. Width matters most; also check height (phone landscape: medium width but compact height → two-pane impractical). Design for expanded first, then medium. Canonical layouts: list-detail (expanded shows both; compact/medium shows one with Back; state preserved across size changes), supporting pane (≈2/3 main, medium splits 50/50, expanded 70/30; supporting content is meaningless alone — else use list-detail), feed (adaptive grid; sample min column 180 dp). Adaptive methods: reflow, reveal, presentation change; set max widths; never stretch buttons/inputs; compact = one pane.
- Evidence: Android window-size-classes, canonical-layouts, adapt-layout docs (T1, VERIFIED, updated 2026-09-22).
- Corroboration: Apple size classes (2 per axis) and "keep functionality, vary visible amount" (F16).
- Scope: Android; breakpoints 600/840 are also the Material web/Flutter convention.
- Agent rule: IF building responsive UI in any stack THEN adopt 600/840 dp-equivalent width breakpoints (CSS px), keep one pane <600, rail/sidebar+list-detail ≥840, and keep content measure ≤~70–75 characters/≤ a max width.

### F26 Android large-screen rules are now mandatory in practice
- Claim: For apps targeting API 36, orientation/aspect-ratio/resizability restrictions are ignored on displays with smallest width ≥600 dp (tablets, large-foldable inner screens, desktop windowing); phones, flip covers and games (appCategory) are exempt; opt-out property is removed for API 37. Google's "large screen app quality" is now "Adaptive app quality" with Tier 3 adaptive-ready (full-window, no letterbox, basic keyboard/mouse/stylus), Tier 2 adaptive-optimized (layouts for all sizes), Tier 1 adaptive-differentiated (postures, drag-drop, stylus, multitasking); test devices: foldable 841×701 dp, 8" tablet 1024×640, 10.5" 1280×800, 13" Chromebook 1600×900 (a new "Googlebook 160 ppi" class is listed).
- Evidence: Android orientation doc, behavior-changes-16/17, quality guidelines (T1, VERIFIED).
- Scope: Android.
- Agent rule: IF an Android app locks portrait THEN remove it and make layouts resizable; treat "phone portrait only" as a bug on ≥600 dp.

### F27 Cross-platform: what to adopt vs unify
- Claim: Flutter's official philosophy splits platform adaptation into (1) OS-environment behaviors (scrolling physics, text editing, back/edge-swipe, haptic idioms, overflow/back icons) — match the platform automatically; and (2) SDK-conventional UI patterns (parallel tabs, alert dialogs) — design choices Flutter does NOT adapt for you. For OS-integrated input/selection/system-info controls (switch, slider, activity indicator, checkbox, radio, alert dialog) Flutter recommends following platform conventions because users are trained on them; for persistent chrome (tab bar, app bar) it says brand-consistent styling is reasonable as long as it is cohesive. HIG principle "approach every platform with intention" and Android's themes doc ("custom brand theme is fine") agree.
- Evidence: Flutter platform-adaptations (T1, VERIFIED); HIG design-principles (VERIFIED); Android themes doc (VERIFIED).
- Scope: universal decision rule (see Decision table below).
- Agent rule: use the decision rule in "Adopt vs unify" table.

### F28 Underlying principles (tech-agnostic restatements)
- Claim: Both systems encode the same few ideas: (a) separate navigation/control layer from content and let content extend beneath it (glass+scroll-edge / transparent bars+protection); (b) navigation chrome is persistent, labeled, few, and state-preserving; (c) interruptions scale with importance (inline → snackbar/banner → sheet/dialog → alert), destructive/irreversible gets friction, reversible gets undo; (d) layout follows available space, not device type (size classes/window size classes); (e) user-controlled system settings (text size, contrast, motion, theme, haptics) override app taste; (f) gestures are shortcuts, visible controls are primary; (g) ask permission late, in context, with a specific reason; (h) tap targets ≥44–48 with spacing. Differences are mostly *where things go* and *which widget* — not the underlying behavior contract.
- Evidence: synthesis of F2–F27 (inference from T1 sources above; tag: INFERENCE).
- Agent rule: write rules at the principle level and map to platform widgets in a lookup table, not in the principle statement.

### F29 When NOT to apply "follow Material" (or "follow HIG")
- Claim: (1) Never skin an iOS build with Material widgets for OS-integrated controls (switch, picker, alert, edge-swipe back, large-title nav): Flutter's docs call these trained behaviors, and HIG forbids repurposing system patterns (e.g., custom Back/Close must look and behave the same). (2) Dense enterprise/data-heavy apps (tables, multi-column forms, 28–32 dp controls, keyboard/mouse): Material's chunky 48 dp controls, FAB and expressive shape/motion cost density; Android's own docs allow a fully custom theme/brand and say to test contrast/legibility; use M3 *principles* (tokens, window classes, a11y) rather than visual defaults. (3) Don't copy Expressive's vibrant/morphing styles into task-critical flows (evidence base is vendor-reported, F18). (4) Don't mimic Liquid Glass in non-Apple UIs (HIG: glass only for functional layer; Apple itself added a transparency slider).
- Evidence: Flutter adaptations; HIG toolbars (custom Back); Android themes doc; F18 caveat (T1 + inference).
- Scope: cross-platform decision; opinion where marked "inference".
- Agent rule: IF Material component has an iOS system equivalent that is OS-integrated THEN use the iOS-native/adaptive version on iOS. IF the product is a dense enterprise tool THEN keep platform *behaviors* (back, text scale, insets, dark mode, a11y) but allow a compact density mode with documented hit-target exceptions.

### F30 Familiarity evidence strength
- Claim: "Follow platform conventions" is grounded in learned expectations; the specific research is thin: Jakob's Law page cites no studies; NN/g's hidden-nav study (n=179, 6 sites) supports visible navigation over hidden on mobile but was web-site based and found mobile penalties smaller than desktop; NN/g's Liquid Glass piece is expert review. Apple/Google/Flutter all independently assert platform-convention value, but none publishes A/B data in these pages.
- Evidence: lawsofux, NN/g (T2, VERIFIED via fetch summaries); HIG principles (T1).
- Agent rule: treat conventions as strong defaults (consensus across three first-party sources) rather than proven universals; justify deviations with test evidence.

---
## Numbers table (value | applies to | source | tag)
| Value | Applies to | Source | Tag |
|---|---|---|---|
| 44×44 pt default hit region / control size | iOS/iPadOS | HIG buttons, accessibility | VERIFIED |
| 28×28 pt minimum control size | iOS/iPadOS | HIG accessibility | VERIFIED |
| ≈12 pt padding around bezeled controls; ≈24 pt around bezel-less | iOS | HIG accessibility | VERIFIED |
| 60×60 pt / buttons centers ≥60 pt apart | visionOS (ignore for mobile) | HIG buttons | VERIFIED |
| 48×48 dp (≈9 mm), ≥8 dp spacing, 7–10 mm recommended range | Android | Android a11y + Google Support | VERIFIED |
| 24×24 CSS px AA minimum (with spacing exception); 44×44 CSS px AAA | Web/WCAG 2.2 | W3C 2.5.8 / 2.5.5 | VERIFIED |
| 17 pt default body; 11 pt minimum | iOS text | HIG typography/accessibility | VERIFIED |
| iOS Large(default) text styles pt/leading: LargeTitle 34/41, Title1 28/34, Title2 22/28, Title3 20/25, Headline 17/22 semibold, Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption1 12/16, Caption2 11/13 | iOS | HIG typography tabs | VERIFIED |
| iOS xSmall body 14/19 … xxxLarge body 23/29 | iOS | HIG typography tabs | VERIFIED |
| iOS accessibility sizes body: AX1 28/34, AX2 33/40, AX3 40/48, AX4 47/56, AX5 53/62 | iOS | HIG typography tabs | VERIFIED |
| Enlarge text ≥200% (140% watchOS) | iOS | HIG accessibility | VERIFIED |
| Contrast: ≤17pt 4.5:1; 18pt 3:1; bold 3:1 (Apple inspector, WCAG AA); dark mode min 4.5:1, target 7:1 | iOS | HIG accessibility, dark-mode | VERIFIED |
| Text 4.5:1; surfaces/non-text 3:1; body ≥12 sp | Android | Android a11y | VERIFIED |
| Android system font scale up to 200% (nonlinear) | Android 14+ | Android 14 features | VERIFIED |
| M3 type scale (sp): Display 57/45/36; Headline 32/28/24; Title 22 (regular), 16/14 (medium); Body 16/14/12; Label 14/12/11 (medium); emphasized = one step heavier | Android/M3 | MDC Typography.md | VERIFIED |
| M3 shape scale dp: 0, 4, 8, 12, 16, 20, 28, 32, 48, full(50%) | M3 | MDC Shape.md | VERIFIED |
| Baseline grid 8 dp; small elements 4 dp | Android | Android grids-and-units | VERIFIED |
| Window width classes: <600 / 600–839 / 840–1199 / 1200–1599 / ≥1600 dp | Android | WSC doc | VERIFIED |
| Window height classes: <480 / 480–899 / ≥900 dp | Android | WSC doc | VERIFIED |
| Supporting pane split: medium 50/50; expanded 70/30 | Android | canonical-layouts | VERIFIED |
| Adaptive feed sample min column 180 dp | Android sample | canonical-layouts | VERIFIED |
| Orientation/resizability ignored at smallest width ≥600 dp for target API 36 (no opt-out at API 37) | Android | behavior-changes-16/17 | VERIFIED |
| Nav bar: 3–5 destinations; height 80→64 dp (Expressive); icon 24 dp; indicator 56×32 dp default | Android | Compose nav bar doc; MDC | VERIFIED |
| Nav rail: 3–7 destinations collapsed; width 80→96 dp (Expressive) | Android | MDC NavigationRail | VERIFIED |
| FAB 56 dp; medium 80 dp; large 96 dp; mini/small 40 dp (deprecated); extended FAB small/medium/large 56/80/96 | Android | MDC FAB docs | VERIFIED |
| FAB menu: 2–6 actions | Android | MDC FloatingActionButtonMenu | VERIFIED |
| Bottom sheet max width 640 dp; default elevation 1 dp; drag handle min 48 dp; half-expanded ratio 0.5 | Android | MDC BottomSheet | VERIFIED |
| Chip min height 32 dp, touch target 48 dp; tabs 48 dp (inline) / 72 dp (icon+text) | Android | MDC | VERIFIED |
| Card margin 8 dp (mobile); elevation 0/1 dp; dragged 8/2 dp | Android | MDC Card | VERIFIED |
| Text field max width 488 dp; icon min 48 dp | Android | MDC TextField | VERIFIED |
| Predictive back: exit scale 100→90%, enter 110→100%, fade at 35% progress, 8 dp margin, x-shift (W/20−8) dp, interpolator (.1,.1,0,1) / decelerate (0,0,0,1) | Android | Predictive back design | VERIFIED |
| Motion durations (ms): 50,100,150,200 | 250,300,350,400 | 450,500,550,600 | 700,800,900,1000 | M3 | MDC Motion.md | VERIFIED |
| M3 easing: standard (0.2,0,0,1); decelerate (0,0,0,1); accelerate (0.3,0,1,1); emphasized-decel (0.05,0.7,0.1,1); emphasized-accel (0.3,0,0.8,0.15) | M3 | MDC Motion.md | VERIFIED |
| M3 springs (damping/stiffness): fast spatial 0.9/1400, fast effects 1/3800, default spatial 0.9/700, default effects 1/1600, slow spatial 0.9/300, slow effects 1/800 | M3 | MDC Motion.md | VERIFIED |
| Ripple/state opacity examples: 8% hover, 10% pressed (list), 12%/16% (buttons, nav) | M3 | MDC component tables | VERIFIED (component-level; global state-layer table not fetched) |
| Haptic key-click ≈10–20 ms; actuator ring-down +20–50 ms | Android | Haptics design principles | VERIFIED |
| Clear-glass dim layer 35% over bright media | iOS | HIG materials | VERIFIED |
| iPhone portrait safe area top 62 / bottom 34 pt (17, 17 Pro, 17 Pro Max); Air top 68 | iOS devices | Use Your Loaf | VERIFIED (T3, via fetch summary) |
| iPhone screens (pt): 17/17 Pro 402×874; 17 Pro Max 440×956; Air 420×912 | iOS devices | Use Your Loaf | VERIFIED (T3) |
| iOS tab bar: 6+ items → 4 + More (5 visible) | iOS | UIKit UITabBarController doc | VERIFIED |
| Toolbar groups ≤3; title <15 chars; segmented ≤5 (iPhone); pull-down ≥3 items; context menu ≤~3 groups; submenu one level (~≤5 items); sidebar ≤2 levels; alert ≤3 buttons, title ≤2 lines | iOS | HIG pages | VERIFIED |
| Legacy iOS nav bar 44 pt; tab bar 49 pt (83 pt w/ home indicator) | iOS ≤25 | Flutter doc for 44; 49/83 MEMORY | 44 VERIFIED / 49,83 MEMORY — do not hard-code; Liquid Glass bars float and differ |
| iOS layout margins 16 pt (compact) / 20 pt (regular) | iOS | MEMORY — HIG no longer publishes; UIKit doc only says "system minimum margins" | MEMORY |
| 1 dp ≈ 1 px at 160 dpi; sp for text only | Android | grids-and-units | VERIFIED |
| Material standard screen margin 16 dp compact / 24 dp medium+ | Android | MEMORY (not on fetched pages) | MEMORY |

---
## Comparison tables

### Table 1 — Primary navigation / structure patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| iOS tab bar (floating glass, ≤5) | Persistent, labeled, state-preserving; thumb-reachable | Space for ≤5; glass legibility issues (NN/g opinion) | 3–5 peer sections | Actions, >5 sections, hiding on some screens |
| iPadOS tab bar → sidebar (`sidebarAdaptable`) | One structure scales to iPad | Needs adaptive handling | Apps with many sections on large screens | Single-purpose phone-only utilities |
| Sidebar (split view) | Many destinations, ≤2 levels | Space-hungry | iPad/Mac/large windows | Compact widths (use tab bar) |
| Material navigation bar | Same contract as tab bar; 3–5 items | AUTO label mode hides labels at 4+ | Compact windows | ≥600 dp wide windows, >5 items |
| Material rail (3–7) | Reachable on tablets, saves vertical space | Takes horizontal space | Medium+ windows | Compact phones |
| Expanded rail / (old) drawer | Large IA; secondary destinations | Drawer deprecated; modal drawer hides nav | Expanded/large windows, desktop | Phone primary nav (hidden nav is slower, NN/g) |
| Top tabs (M3 primary/secondary) | Switch content within a section | Not for app-level destinations | Related content views (2–5) | As the app's only global nav on phones |
| Hamburger/hidden nav | Max space | NN/g: lower use (57% vs 86%), ~15% slower, >20% less discoverability (websites) | Secondary/long-tail destinations | Primary navigation of ≤5 sections |

### Table 2 — Interruption / overlay patterns
| Pattern (iOS ↔ Android) | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Alert ↔ basic dialog | Forces decision | Blocks everything | Rare irreversible/critical choices | Info-only, common/undoable actions, at launch |
| Action sheet/confirmation dialog (anchored on 26+) ↔ modal bottom sheet / menu | Options tied to an action | Scrolling hurts | Discard/save/cancel style choices | >~5 options; use menu/list sheet |
| Menu/pull-down ↔ dropdown menu | Compact choices | Discoverability of "…" | ≥3 related commands | 1–2 commands |
| Context menu ↔ long-press/ contextual action bar | Fast for power users | Hidden | Shortcuts duplicating visible UI | Only path to an action |
| Resizable sheet (detents, grabber) ↔ standard/modal bottom sheet | Keeps context; progressive disclosure | Gesture conflicts with scroll | Short tasks, secondary content | Complex multi-step (full-screen) |
| Full-screen modal ↔ full-screen dialog | Focus | Loses context | Multi-step creation/editing | Quick choices |
| Inline status/banner ↔ snackbar | Non-blocking | Snackbar auto-dismiss vs a11y | Process results, undo | Critical info that must persist |

### Table 3 — iOS vs Android: where they differ and where they overlap
| Topic | iOS (HIG) | Android (Material/Android) | Universal principle | Adopt platform or unify? | What breaks if ignored |
|---|---|---|---|---|---|
| Back navigation | No system back button; leading-edge swipe + in-app Back chevron (no "Back" text); modals dismissed by swipe-down/Cancel | System back (gesture/button) + Up in app bar; Up never exits app; predictive back preview; back stack with fixed start destination | Always provide a way back; gesture is a shortcut | ADOPT per platform (OS behavior) | Edge-swipe conflicts with custom carousels/drawers; Android back exits app unexpectedly or double-handles |
| Tab/primary nav placement | Bottom (iPhone), top→sidebar (iPad); can minimize on scroll; search tab trailing | Bottom navigation bar compact; rail medium+; (drawer deprecated) | Persistent, ≤5, labeled | Unify structure, adapt chrome per platform | Users can't find sections; 6th tab hidden |
| Dialogs/alerts | Alert (≤3 buttons, default trailing/top), action sheet separate | Dialog w/ text buttons; full-screen dialog; snackbar | Verb buttons, Cancel, sparingly | Adopt per platform for OS-integrated alerts | Wrong button order/semantics, "OK" ambiguity |
| Sheets | Detents + grabber, inset half sheet, swipe dismiss | Standard (non-modal) & modal bottom sheet, handle, ≤640 dp, side sheet on large | Short task, dismissible | Unify behavior, native chrome | Sheet can't be dismissed; stacked sheets |
| Pickers | Wheel/compact/inline date picker; in context | Docked/modal/input date picker; dial/input time picker; dialog-hosted | Choose in context; allow keyboard entry | Adopt per platform | Foreign picker feels broken; no keyboard path |
| Switches/toggles | Switch only in list row; toggle button elsewhere | Switch for settings, effect immediate; thumb icon optional | Immediate effect, clear state | Adopt per platform widget | Mis-sized hit area, state ambiguity |
| Search | Tab / bottom toolbar / inline; scope + tokens | Search bar/view at top; app-bar search (Expressive) | One predictable place | Adopt per platform placement | Search discoverability drops |
| Permission prompts | Prompt shown once, denial permanent (Settings); pre-screen single "Continue" | Prompt in context; rationale UI; 2nd deny = permanent; one-time permissions | Late, contextual, specific | Unify flow, platform prompts | Lost permission can't be re-requested; rejection (iOS tracking) |
| Haptics | Notification/impact/selection generators; system controls haptic by default | `HapticFeedbackConstants` (CONFIRM/REJECT/…); clear > rich > buzzy | Short, meaningful, optional | Adopt per platform APIs | Buzzy/long vibration, haptic spam |
| Typography/units | pt; SF Pro; Dynamic Type; 17 pt body | dp/sp; Roboto/Google Sans (system); 16 sp body; font scale to 200% | Semantic text roles, reflow | Unify tokens, map per platform | Clipped text at large sizes |
| System/status bars | Safe areas; Dynamic Island; scroll-edge effect | Edge-to-edge enforced; transparent bars; gesture insets | Content under bars with protection | Adopt per platform insets APIs | Content under cutouts/home indicator; opaque bars |
| Large screens | Size classes (2/axis); tab→sidebar; iPhone Duo vertical bars | 5 window width classes; rail; canonical layouts; orientation lock ignored ≥600 dp | Layout from available window, not device | Unify breakpoints (600/840-ish), native containers | Stretched/letterboxed UI |
| Overflow icon, back glyph | Horizontal ellipsis; chevron | Vertical dots; arrow with stem | Recognizable icon | Adopt per platform (Flutter does automatically) | Low recognition |
| Scrolling physics | Elastic overscroll, stacking momentum, status-bar tap to top | Glow/stretch overscroll, no stacking | Predictable inertial scroll | ADOPT per platform | Feels "off" / non-native |
| Text editing | Cursor at tapped word edge, no handle | Cursor at tap + drag handle; long-press selects word | Standard selection | ADOPT per platform | Selection gestures break |
| Dark mode | Follow system; avoid app toggle | Follow system; in-app override OK | Respect OS | Unify default=system | Users must set theme twice |

### Table 4 — Adopt platform convention vs ship one custom behavior (decision rule)
| Element | Rule | Rationale |
|---|---|---|
| Back/edge-swipe, scrolling physics, text editing/selection, keyboard, share/permission sheets, haptic idioms, status/safe-area handling | ALWAYS adopt platform behavior | OS-trained behaviors (Flutter case 1); breaking them reads as a bug |
| Switch, slider, picker, alert/dialog buttons, activity indicator, context menu | Adopt platform widget (or platform-adaptive) | Users trained on them; a11y semantics provided |
| Tab/nav bar chrome, app bar, cards, buttons visual style | May unify to brand if behavior contract (labels, persistence, targets, a11y) is kept | Persistent chrome can carry brand (Flutter doc) |
| Information architecture, content, copy, feature behavior | Unify across platforms | Product consistency |
| Search placement, FAB vs toolbar action, sheet vs dialog | Follow platform when users on that OS switch often; unify when cross-platform parity is a product requirement and testing shows no cost | Trade-off; evidence limited |
| Dense enterprise surfaces | Custom density allowed; keep behaviors | Android themes doc allows full custom theme |

---
## Anti-patterns found (problem → why → better alternative → source)
- Hiding/disabling tab-bar items when content is unavailable → UI feels unstable → keep tab, show explanatory empty state → HIG tab-bars.
- Putting actions (Add, Share) in the tab bar → tab bar is navigation → toolbar/FAB → HIG tab-bars, MDC FAB.
- 6+ tabs (iOS "More") / 6–7+ bottom-nav items → overflow hides sections → restructure IA, adaptive sidebar/rail → UIKit doc, Compose nav bar doc.
- Alert for non-actionable info, alert at launch, "OK" as a destructive confirm → interruption without value/ambiguity → inline status; specific verb buttons → HIG alerts.
- Action choices presented in an alert/menu instead of an action sheet → wrong trigger expectation → confirmation dialog/action sheet → HIG action-sheets.
- Stacked sheets / sheet without dismissal affordance / discarding unsaved edits on swipe → lost context/data → one sheet, confirm on dirty dismissal → HIG sheets, modality.
- Context-menu-only or swipe-only actions → undiscoverable, a11y fail → visible alternative → HIG context-menus; Android a11y (trash icon example).
- Custom Back label/gesture that differs from system → users can't predict → standard chevron/edge swipe → HIG toolbars.
- Pre-permission screen with an "Allow" button or a Cancel path → manipulates system prompt (App Store rejection for tracking) → single "Continue" → HIG privacy.
- Permission requests at cold start → denial risk; Android 2nd deny permanent → in-context ask → Android permissions docs.
- Custom opaque bar/sheet/popover backgrounds on iOS 26+ → fight glass/scroll-edge effect → remove, use scroll-edge effect → Adopting Liquid Glass.
- Glass/blur on content cards; clear glass over bright media without dim → clutter/illegible → standard materials; ~35% dim → HIG materials.
- Hard-coded system colors, no increased-contrast variant, app-specific dark toggle on iOS → drift, double settings → semantic colors + 3 variants → HIG color/dark-mode.
- Fixed type sizes, clipped text at 200%, thin weights → inaccessible → text styles, reflow, ≥ Regular weight → HIG typography, Android a11y.
- Targets <44/48 or crowded without spacing → mis-taps → ≥48 with ≥8 spacing → HIG/Android/WCAG.
- Locking orientation / fixed widths / `isTablet` checks → letterboxing, broken multitasking/foldables/iPhone Duo → window/size classes → Android orientation doc, HIG layout.
- Placing taps/drags under gesture insets; opaque system bars after Android 15 → conflicts with back/home → inset interactive elements → edge-to-edge doc.
- Intercepting raw back key (`onBackPressed`/KEYCODE_BACK) → silently broken on target 36 → `OnBackPressedCallback`/`PredictiveBackHandler` → behavior-changes-16.
- Legacy one-shot vibrate for tap feedback → buzzy → HapticFeedbackConstants → Android haptics.
- Stacking snackbars / using for critical info; auto-dismissing messages users must act on → missed info → one at a time; persistent banner/dialog for critical → MDC Snackbar; HIG accessibility.
- Switch outside list row on iOS; segmented control with >5 items on iPhone; mixing text+icons in one segmented control → HIG toggles/segmented.
- Wholesale Material skin on iOS (or iOS skin on Android) → breaks OS-trained behaviors → adaptive widgets for OS-integrated controls → Flutter adaptations.
- Adopting M3 Expressive's marketing claims as design requirements (e.g., "4× faster") → unsupported → treat as hypothesis → design.google article caveats.

---
## Disagreements & weak-evidence zones
- D1 Target size numbers: Apple 44 default/28 min, Android 48 (+8 spacing), WCAG 24 AA/44 AAA, NN/g 1 cm cited by expert review. Not a contradiction (different sizes of "safe floor") — use 48 as a cross-platform default; 28/24 only with spacing and for secondary controls.
- D2 Switch usage: HIG restricts iOS switches to list rows; Material uses switches for settings anywhere. Resolve per platform.
- D3 Time-boxed UI: HIG accessibility says minimize auto-dismissing elements; Material snackbars are auto-dismissing by design (duration presets; Compose has Indefinite). Mitigate: use accessibility timeout, persist when an action is offered.
- D4 Nav labels: HIG says label every tab; MDC navigation bar default label mode shows only the selected label when ≥4 items. Override to labeled.
- D5 In-app theme toggle: HIG discourages app-specific appearance; Android says in-app override is fine ("recommend" following system but offers controls).
- D6 Search placement: HIG (bottom/tab, iOS 26) vs Material (top search bar); NN/g (expert opinion) criticizes the iOS 26 move.
- D7 Permission mechanics: iOS one-shot system prompt vs Android re-askable once with rationale; unify flow, not API.
- D8 Large-screen thresholds: HIG binary compact/regular vs Android 5 width classes; breakpoint equivalence is approximate (compact ≈ <600).
- D9 M3 Expressive: official component specs are verifiable; effectiveness claims are vendor-reported with minimal methodology; independent evidence absent in this session.
- D10 Liquid Glass: Apple asserts clarity/depth benefits; NN/g expert review lists legibility/predictability problems; Apple's own iOS 27 slider and contrast tuning suggest the problems were real (inference). iOS 27 "reduced transparency by default" is SNIPPET-level.
- Weak/folk-evidence flags: "thumb zone" claims (HIG only says controls in the middle/bottom are easier to reach — qualitative; no maps/percentages in HIG); "7±2 items" not used by either system (HIG/Material cite 3–5 tabs and ≤5 segments, rationale = space/reachability, not Miller); "hamburger menus are bad" — NN/g data (179 participants, websites) shows a penalty (≈15% slower, 57% vs 86% usage) but smaller on mobile than desktop and mostly about *discoverability of primary nav*.

## Gaps (what I could not verify)
- m3.material.io spec/guideline pages (unreachable, search budget exhausted): exact M3 guidance text on dialog action counts, snackbar duration numbers, FAB placement rules, nav bar "when to use" text beyond the Compose doc, global state-layer opacity table, tonal elevation levels (0/1/3/6/8/12 dp are MEMORY), M3 top-app-bar heights (64/112/152 dp MEMORY), Expressive "35 shapes" claim, Android 16 system-UI visual specifics.
- Apple: published layout margin values (HIG no longer lists them), actual Liquid Glass bar heights/corner radii, iOS 27 HIG deltas beyond changelog headlines, WWDC26 session content, whether iOS 27 reduces default transparency (T4 only), iPhone Duo hit/fold dimensions, Apple's "Snippets"/Siri AI pages (out of scope).
- No hands-on device verification; no independent (non-vendor) studies on Expressive; NN/g Liquid Glass piece is expert review, not testing.
- HIG sliders/steppers/page controls/popovers pages fetched but not mined; Android date/time picker interaction rules not mined beyond variants.
- Haptic pattern *names* for UIFeedbackGenerator subtypes (success/warning/error; light/medium/heavy/soft/rigid) are MEMORY (docs fetched confirm only the three categories).
- "Tap the already-selected tab pops to root / scrolls to top" iOS convention is MEMORY (Flutter doc verifies only status-bar tap-to-top).
