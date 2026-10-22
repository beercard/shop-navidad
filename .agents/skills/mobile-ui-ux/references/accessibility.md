# Accessibility (first-class requirement, native + web/PWA)

Read this when: building any interactive UI (always skim sections 1-3), handling forms, dialogs/sheets, dynamic content, motion, color/dark mode, text scaling, or reviewing a screen for production readiness.

Tags: `[S]` WCAG 2.2 · `[P-iOS]` `[P-AND]` platform · `[R]` research · `[C]` consensus · `[H]` our judgment. Research date 2026-10-06.

Contents: 1 Standard to target · 2 Hard numbers · 3 Name/role/state contract · 4 Touch targets & gestures · 5 Text scaling & reflow · 6 Contrast, color, dark mode · 7 Reduced motion · 8 Dialogs, sheets, focus · 9 Status messages, loading, toasts · 10 Forms & authentication · 11 Navigation & route changes · 12 Platform settings to honor · 13 Stack API map · 14 Testing protocol · 15 Common failures in generated UI · 16 Evidence limits

---

## 1. Standard to target

- Build to **WCAG 2.2 Level AA** as the floor (AAA where cheap). WCAG 2.2 added 2.4.11, 2.4.12, 2.4.13, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8, 3.3.9 and removed 4.1.1. `[S]`
- WCAG 3.0 is a Working Draft (2026-09-10) that W3C itself says not to cite as a requirement; WCAG 2 will not be deprecated for years. Do not cite WCAG 3 tiers or APCA Lc values as compliance criteria. Use the WCAG 2 contrast ratio as the pass/fail gate; APCA can be an advisory extra for dark mode and thin/small text. `[S]`
- W3C "WCAG2Mobile" (Group Draft Note, 2025-05) maps WCAG 2.2 A/AA to native and hybrid apps (screens/views instead of pages; platform settings can satisfy text resize). The 2015 "Mobile Accessibility Mapping" draft is stale (it still says 9 mm targets). For native apps treat CSS px in WCAG numbers as roughly pt/dp (inference, not verified). `[S][H]`
- Regulatory exposure varies by market; tell the user to confirm obligations with counsel. WCAG 2.2 AA is a superset of 2.1 AA. `[L]`

## 2. Hard numbers (units named)

| Item | Value | Source tag |
|---|---|---|
| Target size, minimum (AA 2.5.8) | 24×24 CSS px, or a 24px-diameter circle centered on each undersized target must not intersect another target | `[S]` |
| Target size, enhanced (AAA 2.5.5) | 44×44 CSS px | `[S]` |
| iOS | 44×44 pt default, 28×28 pt stated minimum; ~12pt padding around bezeled controls, ~24pt around bezel-less | `[P-iOS]` |
| Android | 48×48 dp (~9 mm), ≥ 8 dp between targets; a 24dp icon sits inside a 48dp hit area | `[P-AND]` |
| Physical research | NN/g 1 cm × 1 cm (+~2 mm gap); Parhi 2006 ~9.2 mm discrete; Hoober 2017: ~7 mm centre, ~9-10 mm edge rows, ~12 mm corners (95% of taps) | `[R]` |
| Contrast text | 4.5:1 (large text 3:1; large = ≥ 18pt or ≥ 14pt bold, ~24px/~18.66px); AAA 7:1 (large 4.5:1) | `[S]` |
| Contrast non-text | 3:1 for UI component boundaries/states, focus rings, meaningful icons/graphics | `[S]` |
| Text enlargement | ≥ 200% (Apple: at least 200%; Android: font scale up to 200% since Android 14) | `[S][P-iOS][P-AND]` |
| Reflow | no 2-D scroll at 320 CSS px wide (vertical scrollers) / 256 px tall (horizontal) | `[S]` |
| Text spacing tolerance | line-height 1.5×, paragraph 2×, letter 0.12×, word 0.16× font size without clipping | `[S]` |
| Auto-moving content | > 5 s needs pause/stop/hide (2.2.2); audio > 3 s needs stop or independent volume (1.4.2) | `[S]` |
| Time limits | allow turn off / adjust ≥ 10× / extend with ≥ 20 s warning, extend ≥ 10 times (exceptions: real-time, essential, > 20 h) | `[S]` |
| Flashing | ≤ 3 flashes in any 1 s unless below flash thresholds | `[S]` |
| iOS text | body 17pt default, 11pt minimum; Dynamic Type body sizes 14/15/16/17/19/21/23, AX1 28, AX2 33, AX3 40, AX4 47, AX5 53 | `[P-iOS]` |
| Android text | body ≥ 12sp; sp for text and line-height | `[P-AND]` |
| Zoom | never `user-scalable=no`; `maximum-scale` must be ≥ 2 (axe), ideally allow 5 | `[S]` |

Rule of thumb that satisfies every row: **tap target ≥ 44×44 pt (iOS) / 48×48 dp (Android) / 44-48 CSS px (web) with ≥ 8 gap; text ≥ 4.5:1; UI parts ≥ 3:1; text in sp/rem/text styles.** Never ship a hit area under 24 CSS px.

## 3. Name / role / state contract

- Every interactive element needs an accessible **name**, a **role/trait** and exposed **state** (WCAG 4.1.2, 1.1.1). Icon-only buttons are the single most common failure.
- Label in Name (2.5.3): the accessible name must contain the visible label text (ideally start with it) so Voice Control users can say what they see.
- Labels should not repeat role or state ("button", "checked"); use traits/state. Destructive actions say what they affect ("Delete item from cart"). Hints only when the result is not obvious.
- Group icon+text rows into one element; mark decorative images hidden. Headings are real headings (screen-reader users find content by heading: 67.8% first method in WebAIM #11, landmarks 3.4%; self-selected respondents).
- Native first, ARIA second: `<button>`, `<a href>`, `<input>`, `<select>`, `<dialog>`, `<details>` before any `role`. WebAIM Million 2026: pages using ARIA averaged 59.1 errors vs 42 without (correlation). If a div must be a control: role + tabindex=0 + Enter/Space + name + state + visible focus. APG notes it does not say which patterns work on mobile browsers.

## 4. Touch targets and gestures

- Expand hit areas via padding/`hitSlop`/`minimumInteractiveComponentSize`/`.frame(minWidth:minHeight:)` + `.contentShape(Rectangle())`, not by enlarging glyphs. Inline text links are exempt from 2.5.8/2.5.5 but need comfortable line-height. High-stakes, edge-of-screen and one-handed targets deserve ≥ 48. `[S][P-iOS][P-AND]`
- **2.5.1 (A)**: every multipoint or path-based gesture (pinch, two-finger, swipe, flick) needs a single-pointer alternative. **2.5.7 (AA)**: every dragging movement needs a non-drag alternative (reorder → Move up/down or "Move to"; slider → tap/steppers/numeric entry; carousel → prev/next). **2.5.4**: shake/tilt needs a button and a way to disable. **2.5.2**: do not fire on touch-down; allow abort (fire on pointer-up/`onClick`). Exempt: OS/AT gestures, native scroll and pull-to-refresh, signatures. `[S]`
- Swipe actions: also expose them as a visible overflow/detail button AND as screen-reader custom actions (`accessibilityAction(named:)`, Compose `customActions`, RN `accessibilityActions`). Voice Control users reach hidden swipe actions through custom actions.
- Context menus and long-press are hidden by default: always duplicate the commands in visible UI. `[P-iOS]`

## 5. Text scaling and reflow

- Use semantic text styles (iOS text styles, Android sp, web rem). Never fixed-height text containers: use min-height and let text wrap. Avoid truncation in scrollable regions. `[P-iOS][P-AND]`
- At accessibility sizes (iOS `dynamicTypeSize.isAccessibilitySize`, Android 200%) switch horizontal stacks to vertical, drop columns, keep primary content first, scale meaningful icons. Chrome that cannot grow (tab bars, toolbars) uses Apple's Large Content Viewer pattern. `[P-iOS]`
- Android 14 scales text non-linearly: never assume 4sp + 20sp = 24sp; do not read `fontScale` yourself.
- Web: leave `html` font size at the browser default, use `rem`; iOS Safari follows Dynamic Type only for fonts set with `font: -apple-system-body` etc. Never `text-size-adjust: none`. Test at 200% text and 400% zoom (= 320 px wide). Data tables get their own scroll container; toolbars/search/pagination next to the table must still reflow.
- QA matrix: iOS AX5 (~3.1× default), Android 200% font + max display size, Flutter `textScaler` 2.0-3.0, 320 px wide web.
- Usage evidence is thin: roughly a quarter of users in the few app datasets available change text size (Netherlands field research: "more than a fifth"). Do not quote precise percentages.

## 6. Contrast, color, dark mode

- Check contrast for placeholder, helper text, disabled-but-informative text, text over images (add a scrim), every theme (light, dark, increased contrast) and glass/translucent surfaces (worst-case background). WebAIM Million 2026: low-contrast text on 83.9% of home pages. WCAG exempts disabled controls, which is why disabled styling is often illegible: keep it readable `[H]`.
- Color is never the only signal (1.4.1): errors, status, selected state, links, required fields, charts. Pair color with icon/shape/text; test every screen in grayscale. iOS exposes Differentiate Without Color and Button Shapes settings.
- Dark mode is an accessibility feature for light-sensitive users but not automatically more legible. Apple: Increase Contrast + Reduce Transparency in dark mode can reduce contrast between dark text and dark backgrounds; avoid gray-on-black. Material dark: base #121212 gives 15.8:1 for white, keep ≥ 4.5:1 on elevated surfaces, use desaturated tones to avoid vibration. NN/g: for normal vision, light mode beat dark for acuity and reading especially small text; low-vision users with cloudy media did better in dark; no significant short-term fatigue difference; offer a toggle. Define dark tokens separately; never invert. `[P-iOS][P-AND][R]`
- Provide four token variants: default, dark, increased-contrast, and (web) forced-colors where borders/outlines replace shadows and background images. `prefers-contrast` is Baseline since 2022. `[S][P-WEB]`

## 7. Reduced motion ("reduce" does not mean "none")

- Read the system flag: CSS `@media (prefers-reduced-motion: reduce)` (also `matchMedia` in JS), iOS `accessibilityReduceMotion`, Android "Remove animations" (animator duration scale 0; Compose follows it from 1.2.0), RN `AccessibilityInfo.isReduceMotionEnabled()`, Flutter `MediaQuery.disableAnimations`. Do not gate this behind an in-app toggle only. `[P-iOS][P-AND][P-WEB]`
- Replace the vestibular triggers; keep the meaning: parallax and depth blur → static layers; zoom/scale/slide transitions → short crossfade (≤ 150 ms or instant is our default `[H]`; Apple gives no ms); springs/bounce → no overshoot; auto-advancing carousel → no autoplay, manual controls; looping Lottie/skeleton shimmer → static frame or very slow opacity; meaningful feedback (add to cart) → color/highlight fade or static change; haptics and label changes keep working. Apple's evaluation logic: categorize each animation (decorative → remove; meaningful → replace). `[P-iOS]`
- Triggers per Apple/WebKit: zooming/scaling that simulates depth, parallax, spinning, large panning, peripheral motion, blur animation, auto-advancing content. Only remove what you know is a trigger; pinch-zoom is user-controlled and stays. `[P-iOS][P-WEB]`
- Vestibular basis: Agrawal 2009 (NHANES, n=5,086) found 35.4% of US adults 40+ failed a balance test, rising to 84.8% at 80+. That is balance-test prevalence, not the share who get motion symptoms; say "large, age-skewed population". `[R]`
- 2.3.1: no more than 3 flashes/s. 2.2.2: pause/stop/hide for auto-moving content > 5 s. 2.3.3 (AAA) names parallax and scroll-triggered decorative animation.

## 8. Dialogs, sheets, focus

- Modal contract: focus moves in, stays in, returns to the invoker; background is inert; Escape or a visible close dismisses; the dialog is labeled. On web prefer `<dialog>` + `showModal()` (top layer, inert background, Esc, focus return, implicit role=dialog/aria-modal). Provide an explicit close button for touch. Use `autofocus` on the least destructive action for destructive confirmations. Do not use `aria-modal` without actually making the background inert. `[P-WEB]`
- Bottom sheets: visible close/Done, a drag handle is never the only dismissal (2.5.7), Esc/back works, background inert, announce title (`paneTitle`, `AccessibilityNotification.ScreenChanged`). iOS modal views must block VoiceOver access to the background and support `accessibilityPerformEscape()`. `[P-iOS][P-AND]`
- Focus visible (2.4.7). **2.4.11 (AA)**: a focused component must not be entirely hidden by sticky headers/footers, cookie banners, chat widgets, bottom sheets or toasts. Use `scroll-padding-top/bottom` equal to sticky bar heights; keep bottom CTAs from covering the focused field (visualViewport / `interactive-widget=resizes-content`). Never `outline: none` alone; `:focus-visible` outline ≥ 3:1 (1.4.11); 2 px is the AAA 2.4.13 target. `[S]`
- Disclosure/accordion = `<button aria-expanded>`; tabs per APG (tablist/tab/tabpanel, arrow keys); a bottom navigation bar that changes screens is navigation (`<nav>`, `aria-current="page"`), not necessarily a tablist; switch = `role="switch"` + `aria-checked` and the label must not change with state; carousel needs prev/next buttons and a pause control first, no autoplay. Prefer native `<select>`/`<datalist>` on mobile unless filtering is required.

- Single-character shortcuts (WCAG 2.1.4, Level A): must be turn-off-able, remappable, or active only on focus; keep visible buttons for every shortcut. Focus order must match visual/reading order (2.4.3); no positive `tabindex`. Hover/focus content (1.4.13) must be dismissible, hoverable and persistent; give touch an equivalent. `[S]`

## 9. Status messages, loading, toasts

- 4.1.3 (AA): status messages (success, result counts, waiting, errors) must be programmatically determinable without moving focus (`role=status`, `role=alert`, `aria-live`). The live region must exist before its content changes; `polite` by default, `assertive` sparingly. `aria-busy` is not an announcement. Native: iOS `AccessibilityNotification` (Announcement, LayoutChanged, ScreenChanged), Compose `liveRegion`, RN `announceForAccessibility`, Flutter `SemanticsService.announce`.
- Loading = visible indicator + text + a polite announcement at start ("Loading results") and end ("12 results" / error). Do not announce every progress tick. Skeletons need the same status text. One persistent status container per screen.
- Toasts/snackbars: W3C's own Understanding doc lets a timed message pass if the same information is available elsewhere; Roselli and Carbon are stricter; Apple HIG discourages timed UI. Agent rule: confirmation-only messages ("Saved") may auto-dismiss if the result is visible elsewhere, pause on hover/focus, and scale duration with the platform preference (Android `getRecommendedTimeoutMillis()`, API 29+). Anything with an action (Undo), an error, or the only record of a result persists until dismissed or lives in an inline banner. Never trap focus in a toast; also expose Undo in-context.

## 10. Forms and authentication

- Visible `<label>` above the field; hint via `aria-describedby`; mark required in text ("(required)") or mark optional; placeholder is never the label (NN/g: disappears, strains memory, low contrast, mistaken for a value). `[R][S 3.3.2]`
- `autocomplete` tokens (1.3.5 AA) and correct `inputmode`/`type`; `inputmode="numeric"`/`"decimal"` instead of `type="number"` for codes and IDs.
- Errors (3.3.1/3.3.3): identify the field, describe in text, suggest a fix, never color alone; on submit move focus to an error summary (web) or announce + focus the first invalid field (native); preserve input. GOV.UK pattern: summary at top linking to fields, inline message above the field with a hidden "Error:" prefix, same wording in both, page title prefixed "Error:".
- Keep the submit button enabled and show what is missing on press: disabled buttons are skipped by AT/keyboard, WCAG exempts them from contrast, and they give no reason. Legit uses: in-flight duplicate-submit prevention, unavailable inventory.
- Redundant entry (3.3.7): autopopulate or let users select data already entered. Consistent help (3.2.6). Error prevention (3.3.4) for legal/financial/data changes: reversible, checked or confirmed.
- **Accessible authentication (3.3.8 AA)**: no cognitive-function test (memory, transcription, puzzle) without an alternative; never block paste or password managers; one-digit-per-box OTP fields that break paste fail; offer passkeys/WebAuthn, email link, or OAuth; avoid CAPTCHAs.

## 11. Navigation, structure, route changes

- Use landmarks (`header/nav/main/footer/aside`, label multiple `nav`s) but invest in headings. One `<main>`. Skip links.
- SPA/PWA route change: update `document.title`, move focus to the new page's `<h1>` (tabindex=-1) or main region, optionally announce (Gatsby user testing: focusing the heading was the best experience for screen-reader users). Never leave focus on a removed element.
- Native: unique screen titles, accurate headings, logical grouping/order, post ScreenChanged/LayoutChanged and set accessibility focus on the new title; reload must not reset reading position. Compose `traversalIndex`/`isTraversalGroup`; RN/Flutter ordering via semantics sort keys.
- Orientation (1.3.4 AA): never lock to one orientation unless essential; omit PWA manifest `orientation` or use `any`.

## 12. Platform settings to honor

- iOS: VoiceOver, Voice Control, Switch Control, Full Keyboard Access, AssistiveTouch, Pointer Control; Dynamic Type (AX1-AX5), Bold Text, Increase Contrast, Reduce Transparency, Reduce Motion, Differentiate Without Color, Button Shapes, Smart Invert, Dim Flashing Lights, Assistive Access. iOS 26+ App Store "Accessibility Nutrition Labels" publish evaluation criteria you can use as a QA checklist (VoiceOver, Voice Control, Larger Text, Dark Interface, Differentiate Without Color, Sufficient Contrast, Reduced Motion, Captions, Audio Descriptions). `[P-iOS]`
- Android: TalkBack, Switch Access, Voice Access, font size to 200% + display size, Remove animations, "Time to take action", outline text (Android 16). `[P-AND]`
- Web: `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, `prefers-color-scheme`, `pointer: coarse`, `any-pointer`.
- Liquid Glass: test custom elements with reduced transparency/motion and the user's chosen glass look; use the regular (more opaque) variant for text-heavy components; never put small text over variable content without a scrim.

## 13. Stack API map

| Concept | SwiftUI/UIKit | Compose | React Native | Flutter | Web |
|---|---|---|---|---|---|
| Name | `.accessibilityLabel`, `accessibilityInputLabels` | `contentDescription`, `semantics{}` | `accessibilityLabel` | `Semantics(label:)` | label / `aria-label` / text |
| Role/trait | `.accessibilityAddTraits` | `Role`, `clickable(role)` | `accessibilityRole` / `role` | `Semantics(button:true)` | native element / `role` |
| State/value | `.accessibilityValue` | `stateDescription`, `toggleableState` | `accessibilityState/Value` | `Semantics(value:)` | `aria-checked/expanded/selected` |
| Hint | `.accessibilityHint` | `onClickLabel` | `accessibilityHint` | `Semantics(hint:)` | `aria-describedby` |
| Group/hide | `.accessibilityElement(children:)`, `.accessibilityHidden` | `mergeDescendants`, null description | `accessible`, `importantForAccessibility` | `MergeSemantics`, `ExcludeSemantics` | `aria-hidden` (never on focusable), `inert` |
| Heading | header trait | `heading()` | `accessibilityRole="header"` | `Semantics(header:true)` | `<h1-h6>` |
| Announce | `AccessibilityNotification.Announcement` | `liveRegion` | `announceForAccessibility` | `SemanticsService.announce` | `role=status` / `aria-live` |
| Custom action | `.accessibilityAction(named:)` | `customActions` | `accessibilityActions` | `customSemanticsActions` | visible buttons |
| Reduce motion | `accessibilityReduceMotion` | animator scale | `isReduceMotionEnabled` | `MediaQuery.disableAnimations` | `prefers-reduced-motion` |
| Text scale | `dynamicTypeSize`, text styles | `sp` | `allowFontScaling` | `MediaQuery.textScaler` | `rem` |

## 14. Testing protocol (manual steps matter: automation finds only a subset)

1. Complete the main task eyes-closed with VoiceOver (iOS Safari/native) and TalkBack (Chrome/native).
2. Text at AX5 / Android 200% / 320 px width; check clipping, truncation, stacking.
3. Grayscale pass. 4. Reduce Motion + Remove animations. 5. Increase Contrast + dark mode. 6. External keyboard Tab/Shift-Tab, visible focus, nothing hidden by sticky bars. 7. Voice Control "Show names". 8. Switch scanning.
Tools: axe (`target-size`, `meta-viewport`), Lighthouse, Android Accessibility Scanner and Compose `enableAccessibilityChecks()`, Apple Accessibility Inspector and `XCUIAccessibilityAuditType`, Flutter tap-target guideline tests.

## 15. Common failures in generated UI (synthesis from WebAIM failure classes and WCAG/APG rules, not a measured ranking)

Div/span "buttons"; icon-only controls without names; placeholder-as-label; color-only errors/status; disabled-button traps with no reason; low-contrast gray text and captions; fixed px/pt text and fixed-height text boxes; `user-scalable=no` or `maximum-scale=1`; focus lost or left on removed elements after navigation; positive tabindex; `outline: none`; toasts as the only record of a result; modals without focus management or inert background; swipe/drag-only actions; split one-digit OTP boxes that block paste; auto-advancing carousels; missing `lang`; text in images; motion with no reduced-motion branch; orientation locks. WebAIM Million 2026 top failures: low contrast 83.9%, missing alt 53.1%, missing form labels 51%, empty links 46.3%, empty buttons 30.6%, missing language 13.5%.

## 16. Evidence limits

No reliable platform-wide statistics were found for Reduce Motion, dark-mode, Increase Contrast, Switch/Voice Control share. Screen-reader survey data (WebAIM #11, n=1,780; iOS 73.3% / Android 24.0%; VoiceOver 72.2% vs TalkBack 29.5% among mobile screen-reader users) comes from self-selected respondents. How `aria-modal` and live regions behave on iOS VoiceOver and TalkBack in mobile browsers was not verified: test on devices. Material 3 Expressive accessibility specifics are unverified (m3.material.io unreachable).
