# Platform guidelines: iOS (HIG), Android (Material 3 / Android design), and how to adapt across them

Read this when: building for iOS or Android specifically, building cross-platform (Flutter, React Native, Capacitor, PWA), or deciding whether to follow a platform convention or ship one custom behavior.

Evidence tags used in this skill: `[S]` standard (WCAG, ISO) · `[P-iOS]` `[P-AND]` `[P-WEB]` platform guideline · `[R]` research-backed · `[C]` consensus convention without strong study · `[H]` heuristic / our judgment · `[T]` trend, avoid unless asked · `[L]` legal/policy. Research date: 2026-10-06. Platform versions move; anything marked "current as of" must be re-verified against the live docs before being asserted to a user.

Contents: 1 The principle layer · 2 Adopt vs unify · 3 iOS essentials · 4 Android essentials · 5 Differences table · 6 Currency notes · 7 When NOT to follow a platform's visual style

---

## 1. The principle layer (what both platforms agree on)

Both systems encode the same behavior contract; they differ mostly in *where things go* and *which widget is used*. Write rules at this level, then map to widgets per platform.

1. Separate a navigation/control layer from the content layer, and let content extend beneath the chrome with a thin legibility layer between them (iOS scroll-edge effect; Android edge-to-edge with transparent bars and protection scrims). `[P-iOS][P-AND]`
2. Primary navigation is persistent, labeled, few (3-5), and preserves per-section state. `[P-iOS][P-AND]`
3. Interruptions scale with importance: inline status → snackbar/banner → sheet → alert/dialog. Reversible actions get Undo; irreversible ones get a specific, verb-labeled confirmation. `[P-iOS][P-AND][R]`
4. Layout follows available space (size classes / window size classes), not device type, orientation or an `isTablet` flag. `[P-iOS][P-AND]`
5. User-controlled system settings (text size, contrast, motion, transparency, theme, haptics) override app taste. `[P-iOS][P-AND][S]`
6. Gestures are accelerators. Every important action also has a visible control. `[P-iOS][P-AND][S: WCAG 2.5.1]`
7. Ask for permissions late, in context, with a specific reason, and handle denial gracefully. `[P-iOS][P-AND]`
8. Tap targets default to 44pt (iOS; HIG's stated floor is 28pt, ~12pt padding around bezeled controls) / 48dp (Android, ≥ 8dp gaps). `[P-iOS][P-AND]`
9. Familiarity: build on known patterns and keep behavior consistent; deviate only with a stated reason and test evidence. `[P-iOS: HIG principles]`. Note the evidence for "Jakob's law" itself is practitioner testing plus a prototypicality study, not a controlled experiment: treat as a strong default, not a proven universal.

## 2. Adopt the platform vs unify (decision rule for cross-platform apps)

Flutter's official split is a useful template (verified in Flutter's platform-adaptations doc):

| Element | Rule | Why |
|---|---|---|
| Back / edge-swipe, scrolling physics, text editing & selection, keyboard handling, share and permission sheets, haptic idioms, safe-area/system-bar handling | Always adopt the platform behavior | OS-trained behaviors; breaking them reads as a bug |
| Switch, slider, picker, alert/dialog buttons, activity indicator, context menu | Use the platform widget or an adaptive equivalent | Users are trained on them; accessibility semantics come free |
| Tab/nav bar chrome, app bar, cards, button visual style | May unify to brand **if** the behavior contract (labels, persistence, hit targets, a11y) is kept | Persistent chrome can carry brand |
| Information architecture, content, copy, feature behavior | Unify across platforms | Product consistency |
| Search placement, FAB vs toolbar action, sheet vs dialog | Follow the platform when your users mostly live on one OS and rely on its trained habits; unify only when cross-platform parity is a product requirement and a usability test shows no task-time or error cost | Evidence is thin either way `[H]` |
| Dense enterprise surfaces | Custom density allowed; keep platform behaviors (back, text scale, insets, dark mode, a11y) | Android's own theming doc allows a fully custom brand theme |

Agent rule: IF a Material widget has an OS-integrated iOS equivalent (switch, picker, alert, large-title nav, edge-swipe back) THEN use the iOS-native or adaptive version on iOS. IF the product is a dense enterprise tool THEN keep platform behaviors but allow a compact density mode with documented hit-target exceptions.

## 3. iOS essentials (Apple HIG, fetched 2026-10-06)

**Design language.** iOS 26 introduced Liquid Glass; Apple's materials guidance says glass belongs to the functional layer (tab bars, toolbars, sidebars, sheets, menus, controls being touched) floating above content, never to content-layer surfaces such as cards or list rows. `[P-iOS]`
- Use system components; remove custom opaque bar/sheet/popover backgrounds; never hard-code bar heights, corner radii or row heights (they changed in iOS 26).
- Color: glass has no inherent color. Tint at most one primary action; prefer monochrome bars when content is colorful. Use the scroll-edge effect instead of custom gradient/opaque bar backgrounds.
- "Regular" glass for text-heavy components; "clear" only over rich media, and if the media behind is bright add roughly a 35% dark dim.
- Test legibility at both extremes of transparency and with Reduce Transparency / Increase Contrast. NN/g's expert review (not user testing) criticized iOS 26 legibility, cramped targets and lost back-button labels; Apple added a user transparency slider in the following release (inference: consistent with those complaints, not stated by Apple).
- Cross-platform and web apps do not inherit any of this. Do not imitate glass on content cards `[P-iOS]`. Backdrop-blur costs GPU on mid-range Android (see performance.md).

**Tab bar.** Navigation between top-level sections only, never actions. Keep it visible on every screen of a section (except under a modal). Never hide or disable tabs; show an explanatory empty state instead. Every tab gets a label (single words) plus a symbol. Badge only critical information. UIKit shows 4 tabs + "More" once 6+ are defined, so 5 is the practical iPhone maximum and HIG says avoid overflow. On iPad it can adapt to a sidebar (sidebars ≤ 2 levels). Search can be a dedicated trailing tab. `[P-iOS]`

**Toolbars / navigation bars.** HIG folded navigation-bar guidance into Toolbars. ≤ 3 groups; leading edge = back/close + title; trailing = at most one prominent primary action + a More menu; use the standard Back/Close symbols (do not label them); don't mix text-labeled and symbol buttons in one shared-background group; titles < 15 characters and never the app name; large title by default on iPhone, collapsing on scroll. `[P-iOS]`

**Sheets.** For focused, short tasks. Resizable detents (large, medium, custom) with a grabber; swipe-down dismisses; unsaved changes require a confirmation (action sheet), never silent discard; Cancel leading / Done trailing and never Done alone; only one sheet at a time; full-screen modal for multi-step or immersive work. iOS 26: half sheets inset from the display edge, larger corner radius, action sheets anchored to the triggering control. `[P-iOS]`

**Alerts vs action sheets vs menus.** Alert: rare, interruptive; title + optional message + up to 3 buttons; verb labels ("Delete", not "OK"); Cancel titled Cancel; destructive style only for destructive actions the user did not already deliberately choose; never at launch; not for info-only or common undoable actions. Action sheet: choices tied to an action the user just took (destructive at top, Cancel at bottom). Menu: appears when the user asks. Pull-down buttons need ≥ 3 items; context menus are hidden by default so always duplicate their commands in visible UI; hide (don't dim) unavailable context-menu items. `[P-iOS]`

**Lists, search, text input.** Succinct rows; disclosure indicator = drill in, info button = reveal info. Search: one obvious location, always show scope, offer recents with a clear-history control. iOS placements: search tab (browse-heavy content), bottom toolbar (quick lookup, preferred "if there's room"), top toolbar, inline. Text fields: keyboard type matches content, clear button, never prepopulate passwords, prefer pickers/menus over typing. `[P-iOS]`

**Controls.** Switch only inside a list row (otherwise a toggle-style button). Segmented control: closely related options that change a view, ≤ ~5 segments on iPhone, text OR icons not both; for whole sections use a tab bar. Pickers in context near the field, not a new screen. Progress: prefer determinate, keep it moving, don't swap spinner for bar, show placeholders immediately, allow other actions during loading, avoid vague "Loading" labels. A button may show an activity indicator and change label ("Checkout" → "Checking out…"). `[P-iOS]`

**Gestures and haptics.** Standard gestures keep their standard meaning. Custom gestures only for frequent specialized tasks, discoverable and never the only path. Haptics: use system patterns for their documented meaning (notification = outcome, impact = physical metaphor, selection = changing values); short, occasional, optional, in sync with animation. `[P-iOS]`

**Typography.** Default body 17pt, minimum 11pt (a floor, not a target). Use Dynamic Type text styles; avoid Ultralight/Thin/Light; support ≥ 200% enlargement; at large sizes stack horizontal layouts and minimize truncation. Default (Large) sizes in pt/leading: Large Title 34/41, Title 1 28/34, Title 2 22/28, Title 3 20/25, Headline 17/22 semibold, Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption 1 12/16, Caption 2 11/13. Accessibility sizes for body go AX1 28 → AX5 53pt. `[P-iOS]`

**Color / dark mode.** Semantic system colors; never hard-code system color values; provide light, dark AND increased-contrast variants for every custom color; no app-specific appearance toggle (HIG discourages; Android allows one); dark mode uses a base vs elevated background pair; contrast ≥ 4.5:1 minimum, aim 7:1 for small text in dark mode; never color alone. `[P-iOS]`

**Motion.** Purposeful, optional, brief, realistic to gesture direction (slide down in → slide down out); avoid motion on frequent interactions; never make people wait for an animation; always allow cancel. Reduce Motion: tighten springs, track gestures, replace x/y/z travel with fades, avoid blur and depth animation. HIG gives no duration or easing numbers. `[P-iOS]`

**Permissions & onboarding.** Ask only when the feature needs it. Purpose string = one specific active-voice sentence. A pre-permission screen has ONE button titled "Continue/Next" (never "Allow", no Cancel); tracking prompts must not be preceded by manipulative screens (App Store rejection). iOS asks once; after denial the app must link to Settings. Launch screen resembles the first screen, no text or branding; restore state. Onboarding optional, interactive, short; defer ratings and purchases. `[P-iOS]`

**Layout.** Use safe areas, layout margins and readable guides. HIG no longer publishes numeric margins (16pt compact / 20pt regular are `[H]` memory, do not hard-code). Branch on size classes (compact/regular × width/height), not device idiom. Keep functionality constant while varying how much is visible. Extend backgrounds under bars. New in the current HIG: "iPhone Duo" (folding iPhone) page: toolbars/tab bars may move to the side; use size classes plus safe-area insets, avoid fixed widths. Portrait safe-area insets on recent iPhones are roughly 62pt top / 34pt bottom; use APIs, never constants.

## 4. Android essentials (developer.android.com + Material Components docs)

**Navigation containers.**
- Navigation bar: 3-5 destinations of equal importance, compact windows. Rail: 3-7 destinations (collapsed), medium+ windows. Expanded rail (Material 3 Expressive) replaces the navigation drawer, which is deprecated. `NavigationSuiteScaffold` picks bar vs rail from window size (bar when width or height is compact). `[P-AND]`
- Component default label mode shows only the selected label when ≥ 4 items; HIG says always label. Override to always labeled on compact. `[H]` consistent with NN/g icon+label evidence.
- Top app bar: search / small / medium flexible / large flexible; collapse on scroll; contextual action bar replaces the bar in selection mode. FAB: the single primary create action of a screen; 56dp (medium 80, large 96), 16dp margin, FAB menu 2-6 actions. `[P-AND]`

**Overlays.** Bottom sheets: standard (non-modal, coexists) vs modal (scrim); max width 640dp; drag handle with 48dp target; should become side sheets on large windows. Dialogs: basic and full-screen; "purposefully interruptive" so sparingly. Snackbar: brief process status, no required input, one at a time, auto-dismiss, at most one action (undo/retry). `[P-AND]`

**Components.** Chips (assist/filter/input/suggestion): 32dp visual, 48dp touch target. Cards elevated/filled/outlined. Tabs: primary 48dp (72dp icon+text), secondary within content. Switch effect is immediate. Text fields filled/outlined, max width 488dp. Segmented buttons are deprecated in Expressive in favor of connected button groups. Date picker docked/modal/modal-input; time picker dial/input. `[P-AND]`

**Color/type/shape.** Roles, not colors: primary/secondary/tertiary + on-/container/on-container, error, surface (dim/bright, five container levels), on-surface(-variant), outline(-variant), inverse. Dynamic color (Android 12+) with a branded static fallback. Elevation is tonal surface-container roles plus shadow only where needed. Type scale in sp: Display 57/45/36, Headline 32/28/24, Title 22/16/14, Body 16/14/12, Label 14/12/11, plus emphasized variants. Shape scale dp: 0/4/8/12/16/20/28/32/48/full. 8dp grid, 4dp for small elements. `[P-AND]`

**Edge-to-edge and back.** Edge-to-edge is enforced for apps targeting API 35+, and the opt-out was removed for API 36 targets: draw backgrounds edge to edge, inset text and buttons using WindowInsets, never put tap/drag targets under gesture insets, keep the gesture-nav bar transparent. Predictive back previews the destination: register back handling through `OnBackPressedCallback`/`PredictiveBackHandler`, never raw key events; exit scale 100→90%, 8dp edge margin. `[P-AND]`

**Large screens (target API 36+).** On displays with smallest width ≥ 600dp, manifest orientation/resizability/aspect-ratio locks are ignored; the opt-out is gone for API 37. Treat "phone portrait only" as a bug on ≥ 600dp. Adaptive quality tiers: Tier 3 adaptive-ready, Tier 2 optimized, Tier 1 differentiated (postures, drag and drop, stylus). `[P-AND]`

**Permissions.** Ask in context; rationale UI allowed when `shouldShowRequestPermissionRationale`; a second deny is permanent; never request everything at startup; degrade gracefully. `[P-AND]`

**Haptics.** Use `HapticFeedbackConstants` (CONFIRM/REJECT/…) not legacy `vibrate(ms)`; a key-click is ~10-20ms; clear > rich > buzzy; less is more. `[P-AND]`

## 5. Where iOS and Android differ (and what breaks if ignored)

| Topic | iOS | Android | Cross-platform decision |
|---|---|---|---|
| Back | Leading-edge swipe + in-app chevron (no "Back" text); modals dismissed by swipe-down/Cancel | System back (gesture/button) + Up in app bar; predictive back preview; back stack | Adopt per platform. Breaking it conflicts carousels/drawers with edge swipes or exits the app unexpectedly |
| Primary nav | Bottom tab bar (iPhone), top→sidebar (iPad); search tab trailing | Bottom bar (compact), rail (medium+) | Unify structure, adapt chrome |
| Dialogs | Alert ≤ 3 buttons, default trailing/top; separate action sheet | Dialog with text buttons; full-screen dialog; snackbar | Platform widgets; verb labels on both |
| Sheets | Detents + grabber, inset half sheet | Standard/modal bottom sheet, handle, ≤ 640dp, side sheet on large | Unify behavior, native chrome |
| Pickers | Wheel/compact/inline | Docked/modal/input, dial/input | Adopt per platform; always allow keyboard entry |
| Switches | Only in a list row | Anywhere in settings | Platform widget |
| Search | Tab / bottom toolbar / inline | Top search bar / app-bar search | Platform placement |
| Permission mechanics | One system prompt, denial permanent until Settings; single "Continue" pre-screen | Re-askable once with rationale; second deny permanent | Unify the flow, not the API |
| Haptics | Notification / impact / selection generators | `HapticFeedbackConstants` | Platform APIs |
| Units/type | pt, SF Pro, 17pt body | dp/sp, Roboto/system, 16sp body | Unify tokens, map per platform |
| System bars | Safe areas, scroll-edge effect | Enforced edge-to-edge, gesture insets | Platform inset APIs |
| Dark mode | Follow system; HIG discourages app toggle | Follow system; in-app override OK | Default = system on both |
| Overflow icon / back glyph | Horizontal ellipsis / chevron | Vertical dots / arrow | Platform icon (Flutter does this) |
| Scroll physics, text selection | Elastic overscroll; cursor at word edge | Stretch/glow; drag handle | Adopt per platform |

## 6. Currency notes (verify before asserting)

- As of the 2026-10 research pass: Apple's current design language is Liquid Glass (iOS 26, refined in iOS 27); Xcode 27 builds can no longer opt out via `UIDesignRequiresCompatibility`. Android 16 is current with Android 17 behavior changes published; Compose Material3 stable 1.4.0 with 1.5 alphas graduating many Expressive APIs.
- Material 3 Expressive is an official expansion of Material 3 in the component libraries (new bar heights, expanded rail, flexible app bars, docked/floating toolbars, FAB menu, connected button groups, spring motion). Google's marketing research claims (e.g., large-sample preference and "up to 4× faster" spotting of key elements) are vendor-reported with no per-study methodology: do not cite them as design rules. `[H]`
- m3.material.io spec pages were unreachable during research; Material guidance above comes from developer.android.com and the Material Components Android docs. Tonal elevation levels, top-app-bar heights and global state-layer opacity tables are unverified memory.

## 7. When NOT to follow "Material" or "HIG" visuals

1. Never skin an iOS build with Material widgets for OS-integrated controls (switch, picker, alert, edge-swipe back, large-title nav). Flutter calls these trained behaviors; HIG forbids repurposing system patterns.
2. Dense enterprise/data apps: Material's 48dp controls, FAB and expressive shape/motion cost density. Use M3 *principles* (tokens, window classes, accessibility), not its visual defaults. A compact density mode is legitimate.
3. Do not copy Expressive's vibrant, shape-morphing styles into task-critical flows. Evidence is vendor-reported.
4. Do not mimic Liquid Glass in non-Apple UIs. It is a functional-layer material, and Apple itself added user controls for it.
5. Never tell the user a platform guideline is "proven by research" when the platform doc simply asserts it. Say "platform convention".
