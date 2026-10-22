# 02 — Accessibility for Mobile (native + web/PWA)

Research date: 2026-10-06. Tags: VERIFIED = fetched this session and page states it; SNIPPET = search-result excerpt only; MEMORY = training knowledge, not re-verified. Where a small summarizer model got a number wrong on first pass (it said 2.5.8 = 44px), I re-checked against raw W3C text and use the raw value.

## Sources consulted (URL | tier | verified?)

| URL | Tier | Verified? |
|---|---|---|
| https://www.w3.org/TR/WCAG22/ (raw text re-parsed) | T1 | VERIFIED |
| https://www.w3.org/WAI/WCAG22/Understanding/ (target-size-minimum, target-size-enhanced, reflow, text-spacing, dragging-movements, pointer-gestures, motion-actuation, focus-not-obscured-minimum, focus-appearance, status-messages, accessible-authentication-minimum, timing-adjustable, orientation, resize-text, contrast-minimum, non-text-contrast, label-in-name, identify-input-purpose, animation-from-interactions, three-flashes-or-below-threshold) | T1 | VERIFIED |
| https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ | T1 | VERIFIED |
| https://www.w3.org/TR/wcag-3.0/ (Working Draft 2026-09-10) and https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/ | T1 | VERIFIED |
| https://www.w3.org/TR/wcag2mobile-22/ (Group Draft Note, 2025-05-06) | T1 (draft Note) | VERIFIED |
| https://www.w3.org/TR/mobile-accessibility-mapping/ (First Public WD, 2015-02-26) | T1 (stale draft) | VERIFIED |
| https://www.w3.org/TR/coga-usable/ (WG Note 2021-04-29) | T1 | VERIFIED |
| https://www.w3.org/WAI/policies/european-union/ | T1 | VERIFIED (partly doubtful summary, see F31) |
| https://developer.apple.com/design/human-interface-guidelines/ via JSON: accessibility, typography, motion, voiceover, color, dark-mode, materials, sheets, alerts, gestures | T1 | VERIFIED |
| https://developer.apple.com/tutorials/data/documentation/ JSON: swiftui view-accessibility, dynamictypesize, colorschemecontrast, accessibilityreducemotion, accessibilitydifferentiatewithoutcolor, legibilityweight, accessibilityshowbuttonshapes, accessibilityreducetransparency, accessibilitynotification(+announcement), accessibilityhint, xcuiautomation/xcuiaccessibilityaudittype | T1 | VERIFIED (API names / short descriptions) |
| https://developer.apple.com/help/app-store-connect/manage-app-accessibility/ (overview, larger-text, sufficient-contrast, reduced-motion, voiceover, voice-control, differentiate-without-color, dark-interface evaluation criteria) | T1 | VERIFIED |
| https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass (JSON) | T1 | VERIFIED |
| https://developer.android.com/design/ui/mobile/guides/foundations/accessibility | T1 | VERIFIED |
| https://developer.android.com/guide/topics/ui/accessibility/principles, /testing | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/accessibility/ (api-defaults, key-steps, semantics, traversal, testing) and /touch-input/focus | T1 | VERIFIED |
| https://developer.android.com/about/versions/14/features (nonlinear font scaling) and /16/features | T1 | VERIFIED |
| https://developer.android.com/reference/android/view/accessibility/AccessibilityManager | T1 | VERIFIED |
| https://support.google.com/accessibility/android/answer/7101858 (touch target) | T1 | VERIFIED |
| https://m1.material.io/usability/accessibility.html, https://m2.material.io/design/color/dark-theme.html | T1 (old Material versions) | VERIFIED |
| m3.material.io (structure, bottom-sheets/accessibility) | T1 | NOT FETCHABLE (connection refused); M3 48dp/8dp statement is SNIPPET |
| https://reactnative.dev/docs/accessibility; https://docs.flutter.dev/ui/accessibility(/assistive-technologies); https://api.flutter.dev/flutter/widgets/Semantics-class.html | T1 | VERIFIED |
| https://www.w3.org/WAI/ARIA/apg/ (read-me-first, dialog-modal, tabs, disclosure, accordion, menu-button, combobox, alert, carousel, switch) | T1 | VERIFIED |
| https://www.w3.org/TR/using-aria/ | T1 | VERIFIED (4 rules shown; 5th "accessible name" rule is MEMORY) |
| https://developer.mozilla.org/ (prefers-reduced-motion, prefers-contrast, forced-colors, pointer, touch-action, :focus-visible, dialog, inert, meta viewport, text-size-adjust, ARIA live regions, aria-busy, manifest orientation) | T1/T2 | VERIFIED |
| https://web.dev/articles/prefers-reduced-motion; https://web.dev/learn/accessibility/(focus, aria-html); https://webkit.org/blog/7551/ and /3709/ | T1/T2 | VERIFIED |
| https://dequeuniversity.com/rules/axe/html/4.10/(meta-viewport, target-size) | T2 | VERIFIED |
| https://webaim.org/projects/million/ (2026), /screenreadersurvey10/, /screenreadersurvey11/ (Jul-Aug 2026) | T2 | VERIFIED |
| https://design-system.service.gov.uk/ (error-message, error-summary, validation, text-input) | T1/T2 | VERIFIED |
| https://www.nngroup.com/articles/(touch-target-size, dark-mode, form-design-placeholders) | T2 | VERIFIED |
| https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/773517 (Agrawal 2009) | T2 peer-reviewed | VERIFIED |
| https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/ | T3 | VERIFIED |
| http://adrianroselli.com/2020/01/defining-toast-messages.html; /2019/06/target-size-and-2-5-5.html; /2026/04/wcag3-contrast-as-of-april-2026.html | T2 practitioner | VERIFIED |
| https://www.scottohara.me/blog/2019/07/08/a-toast-to-a11y-toasts.html; /2023/01/26/use-the-dialog-element.html | T2 practitioner | VERIFIED |
| https://tetralogical.com/blog/2022/12/20/foundations-target-size/; https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/ | T2/T3 | VERIFIED |
| https://axesslab.com/disabled-buttons-suck/; https://v10.carbondesignsystem.com/components/notification/accessibility/; https://fluent2.microsoft.design/accessibility | T2/T1 | VERIFIED |
| https://appt.org/en/stats/font-size (Netherlands) | T3 | VERIFIED (thin methodology) |
| https://eevis.codes/blog/2022-12-12/android-animations-and-reduced-motion/ | T3 | VERIFIED |
| https://css-tricks.com/accessible-font-sizing-explained/ | T3 | VERIFIED |
| https://arxiv.org/abs/2501.03572; https://arxiv.org/abs/2607.20690 | T3 preprints | VERIFIED (abstracts) |
| https://lists.w3.org/Archives/Public/public-mobile-a11y-tf/2014Apr/att-0008/BBCMobileGuide10_comparison_with_WCAG2UAAG2-rev2.html (BBC MAG v1.0 topics, 2014) | T2 (old, secondary) | VERIFIED (old) |
| bbc.co.uk BBC Mobile Accessibility Guidelines (current) | T2 | NOT FETCHABLE (domain blocked); BBC GEL 7mm/44px numbers verified only via Roselli; 32px/24px fallback numbers are SNIPPET |
| Dynamic Type usage stats (Steipete/PSPDFKit, Immoweb), Android ~25% font increase | T3/T4 | SNIPPET |

---

## Findings

### F1 WCAG 2.2 is the operative standard; WCAG 3 is a draft you must not build to
- Claim: Conform to WCAG 2.2 A+AA (AAA where cheap). WCAG 3.0 is still a Working Draft (dated 2026-09-10), explicitly "inappropriate to cite" other than as work in progress, its conformance model was just revised, and W3C says WCAG 2 will not be deprecated for several years after WCAG 3 is finalized.
- Evidence: W3C WCAG 3.0 WD https://www.w3.org/TR/wcag-3.0/ — T1 — VERIFIED; intro https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/ — T1 — VERIFIED (best preparation is meeting WCAG 2.2 now; "a few more years").
- Corroboration: Roselli 2026-04 says earliest completion around 2030 (opinion/estimate) — T2 — VERIFIED.
- Scope: universal. 2.2 added 9 SC (2.4.11 AA, 2.4.12 AAA, 2.4.13 AAA, 2.5.7 AA, 2.5.8 AA, 3.2.6 A, 3.3.7 A, 3.3.8 AA, 3.3.9 AAA) and removed 4.1.1 Parsing — https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ — VERIFIED.
- Agent rule: IF asked "what standard" THEN target WCAG 2.2 AA as the floor; do not cite WCAG 3 Bronze/Silver/Gold (the current draft no longer uses those tiers; it uses core/supplemental requirements with assertion-based reporting — VERIFIED) or APCA Lc values as compliance criteria.

### F2 Mobile guidance from W3C is thin and partly stale — use WCAG2Mobile as the mapping, not the 2015 draft
- Claim: "WCAG2Mobile" (Group Draft Note, 2025-05-06) maps WCAG 2.2 A/AA to native, hybrid and mobile-web apps (phones/tablets only; non-normative; AAA excluded). It substitutes "screens/views" for pages and says: 1.4.4 may be satisfied via platform settings (platform may not scale all text to 200%), 1.4.10 reflow applies where platform can present 320 CSS px, 1.4.12 only where the app lets users override spacing (iOS/Android generally don't), 2.1.1 can be met through the platform's keyboard interface, 1.3.4 best practice is all four orientations.
- Evidence: https://www.w3.org/TR/wcag2mobile-22/ — T1 — VERIFIED. The 2015 "Mobile Accessibility: How WCAG 2.0..." First Public WD still states "9 mm x 9 mm" touch targets and touchend-over-touchstart — https://www.w3.org/TR/mobile-accessibility-mapping/ — T1 stale — VERIFIED (use as history only; superseded by 2.5.8/2.5.5 and platform numbers).
- Context: 2.4.7 Focus Visible guidance in WCAG2Mobile is still marked work-in-progress (VERIFIED).
- Agent rule: IF native app THEN treat CSS px in WCAG numbers as ≈ pt (iOS) / dp (Android) (this equivalence is MEMORY/inference; WCAG2Mobile defers to the WCAG2ICT "CSS pixel" definition and I did not verify its wording).

### F3 Touch target size and spacing: three tiers of numbers, one practical rule
- Claim: Floor (WCAG 2.5.8 AA) = 24x24 CSS px, with a spacing escape hatch; enhanced (2.5.5 AAA) = 44x44 CSS px; Apple default 44x44 pt but a stated minimum of 28x28 pt; Android/Material 48x48 dp with >=8dp between targets.
- Evidence:
  - WCAG 2.5.8 normative text: 24x24 CSS px except Spacing (a 24px-diameter circle centred on each undersized target's bounding box must not intersect another target or another undersized target's circle), Equivalent, Inline, User-agent control, Essential; sliders/colour pickers count as one target — https://www.w3.org/TR/WCAG22/ raw — T1 — VERIFIED.
  - 2.5.5 AAA: 44x44 CSS px, exceptions Equivalent, Inline, User agent, Essential — VERIFIED (raw).
  - Apple HIG: default 44x44 pt, minimum 28x28 pt on iOS/iPadOS; ~12 pt padding around bezeled elements, ~24 pt around borderless elements — https://developer.apple.com/design/human-interface-guidelines/accessibility (JSON) — T1 — VERIFIED.
  - Android: >=48dp (~9 mm), >=8dp separation; a 24dp icon may sit inside a 48dp hit area; Views use minWidth/minHeight or TouchDelegate, Compose uses sizeIn or merged semantics — https://support.google.com/accessibility/android/answer/7101858 — T1 — VERIFIED; Compose Material components (Checkbox, RadioButton, Switch, Slider) apply `minimumInteractiveComponentSize` (48dp) only when interactive — api-defaults page — VERIFIED.
  - NN/g: 1 cm x 1 cm minimum, ~2 mm gap; based on Parhi/Karlson/Bederson 2006 one-handed thumb study; MIT Touch Lab: fingertip 1.6-2 cm, thumb ~2.5 cm — https://www.nngroup.com/articles/touch-target-size/ — T2 — VERIFIED.
  - BBC GEL: 7 mm (44 px) recommended, 5 mm special-case minimum (via Roselli) — T2 secondary — VERIFIED; 32px/24px fallback tiers — SNIPPET.
  - Hoober positional research (via Smashing): ~11 mm top, ~7 mm centre, ~12 mm bottom of screen — T3 secondary — VERIFIED (secondary); author suggests 30x30 px minimum, 48x48 for high-stakes.
  - Microsoft Fluent: 40x40 effective px (Roselli table) — T3 secondary — VERIFIED (secondary); Fluent's own accessibility page lists no target size — VERIFIED.
- Corroboration / conflict: Apple's HIG moved to a two-tier statement (44 default / 28 min); most other sources still say 44-48 "minimum". Physical size varies with density: a 44 px square is ~8.25 mm on an iPad vs ~6.75 mm on an iPad mini (Roselli) — T2 — VERIFIED. 2.5.8 is measured in CSS px independent of zoom (Understanding) — VERIFIED.
- Scope: universal (units differ).
- Context (when it flips): inline text links are exempt from 2.5.8/2.5.5 but should still get comfortable line-height and spacing; dense data UIs (maps, chart points) can claim "Essential"; high-stakes/irreversible actions, edge-of-screen and one-handed targets warrant >=48.
- Agent rule: IF building any tappable control THEN make the hit area >=44x44 pt/CSS px on iOS/web and >=48x48 dp on Android (visual glyph may be 24px inside it), separate adjacent targets by >=8 dp/px (>=12 pt for bezeled iOS controls); NEVER ship a hit area under 24 CSS px; use the 24px-circle spacing exception only for genuinely dense toolbars/inline groups. Expand via padding / `minimumInteractiveComponentSize` / `.frame(minWidth:minHeight:)` + `.contentShape(Rectangle())` rather than enlarging glyphs.
- Stack notes: CSS `@media (pointer: coarse)` can enlarge targets for touch (MDN, VERIFIED) but do not rely on it for the 24px floor; automate with axe `target-size` (WCAG 2.2 AA, 24px + circle rule, impact serious — VERIFIED), Android Accessibility Scanner (flags target size and contrast — VERIFIED), Flutter `androidTapTargetGuideline`/`iOSTapTargetGuideline`/`labeledTapTargetGuideline` (names VERIFIED; the 44 vs 48 values are MEMORY).

### F4 Gestures: every swipe/pinch/drag/shake needs a visible single-tap alternative
- Claim: WCAG 2.5.1 (A) requires single-pointer, non-path-based alternatives for multipoint (pinch, two-finger) and path-based (swipe, flick, traced shapes) gestures; keyboard operability alone does not satisfy it. 2.5.7 (AA, new in 2.2) requires a non-dragging alternative for any dragging (slider thumb -> tap on track or +/- buttons; reorder -> up/down buttons or "move to" menu; carousel -> prev/next buttons; numeric text entry). 2.5.4 (A) requires UI buttons as alternative to shake/tilt and ability to disable motion actuation. 2.5.2 (A) requires one of: no down-event execution, abort/undo, up-reversal, or essential.
- Evidence: WCAG raw text + Understanding pages for 2.5.1, 2.5.7, 2.5.4, 2.5.2 — T1 — VERIFIED. Exempt: OS/AT/user-agent gestures, native scroll and pull-to-refresh, signatures (essential). Apple HIG: offer an on-screen alternative for each gesture (example: swipe-to-delete plus Edit-then-tap-to-delete), avoid custom multi-finger gestures, use simplest gesture for frequent tasks — T1 — VERIFIED. Apple VoiceOver criteria: drag-and-drop, multi-touch and context menus must be exposed via custom actions or rotors — VERIFIED. Android design guide: provide accessibility actions so all flows work without gestures — VERIFIED. Compose `customActions = listOf(CustomAccessibilityAction(...))`, RN `accessibilityActions`+`onAccessibilityAction` — VERIFIED. SwiftUI `accessibilityAction(named:_:)`, `accessibilityAdjustableAction`, `accessibilityDragPoint/DropPoint`, `accessibilityZoomAction` exist — VERIFIED (API index). Voice Control: hidden swipe-revealed controls must be reachable via custom actions ("Show actions for <number>") — VERIFIED.
- Scope: universal.
- Agent rule: IF an item has swipe actions THEN also expose them as (a) a visible overflow/"more" button or detail-screen button and (b) screen-reader custom actions (`accessibilityAction(named:)` / `customActions` / `accessibilityActions`). IF drag-reorder THEN add Move up/Move down controls or an "Edit" mode with explicit handles + actions. IF pinch-zoom is custom (maps, images) THEN add +/- buttons. IF shake/tilt exists THEN add a button and a settings switch to disable it. Fire actions on pointer-up/`onClick`, never on touch-down, and allow slide-off cancel.

### F5 Text scaling: design for iOS AX5 (~3.1x) and Android 200%; never fix text container heights
- Claim: ~25-40% of users in the few app datasets available change text size (see F27), so scaling is a core path, not an edge case.
- Evidence (iOS): Dynamic Type has 7 standard sizes (xSmall..xxxLarge, default Large) plus 5 accessibility sizes AX1-AX5. Body size by category: 14, 15, 16, **17** (default), 19, 21, 23, then AX1 28, AX2 33, AX3 40, AX4 47, AX5 53 pt (leading 62 at AX5). So xxxLarge = 1.35x default, AX3 = 2.35x, AX5 = 3.1x (ratios computed). HIG: support enlarging text by at least 200% (140% watchOS); default 17 pt / minimum 11 pt on iOS; verify at largest accessibility size; keep as much useful text visible at AX5 as at the largest standard size; avoid truncation in scrollable regions; switch to stacked layouts and fewer columns at large sizes; keep primary elements on top; scale meaningful icons — https://developer.apple.com/design/human-interface-guidelines/typography (JSON tables) — T1 — VERIFIED. Apple's Larger Text nutrition-label criteria: text must reach >=200% (AX3 is >200%, AX5 >300%), wrap side-by-side items vertically, avoid severe truncation, test other languages/RTL; Zoom/Hover Text do not count as app support — VERIFIED.
- Evidence (Android): font scale up to 200% since Android 14 (was 130%), applied non-linearly (large text scales less than small); use sp for text and for `lineHeight`; never assume 4sp+20sp=24sp; do not read `fontScale`/`scaledDensity`; convert with `TypedValue.applyDimension/deriveDimension`; test via Settings > Accessibility > Display size and text > Font size — https://developer.android.com/about/versions/14/features — T1 — VERIFIED. Compose guide: avoid fixed heights, avoid truncation, test at 200% — VERIFIED. Android design guide: body text minimum 12 sp — VERIFIED. Flutter: UI should survive very large text/display scale; `MediaQuery.textScaler` — Flutter page names it only via assistive-tech doc — VERIFIED (names).
- Scope: iOS/Android/universal.
- Context: Large Content Viewer (`accessibilityShowsLargeContentViewer`) is Apple's pattern for chrome that cannot grow (tab bars, toolbars) — API existence VERIFIED; usage guidance MEMORY.
- Agent rule: IF writing any text THEN use semantic text styles / sp / rem (never fixed px/pt on iOS/Android); allow multi-line wrap; use min-height not height; at `dynamicTypeSize.isAccessibilitySize` (or >=accessibility1) switch HStack->VStack, rows -> stacked, drop columns; QA at iOS AX5, Android 200% + display size max, Flutter `textScaler` 2.0-3.0.
- Stack notes: SwiftUI `@Environment(\.dynamicTypeSize)`, `ViewThatFits`, `@ScaledMetric` (name MEMORY; env + ViewThatFits VERIFIED). Compose `sp`, `wrapContentHeight`. RN: `allowFontScaling`/`maxFontSizeMultiplier` (MEMORY — not seen in fetched doc; cap only with care). Web: `rem`/`em`, no px on `html`; iOS Safari only follows Dynamic Type for fonts set with `font: -apple-system-body` etc. (WebKit blog — VERIFIED; CSS-Tricks corroborates — VERIFIED).

### F6 Web zoom, viewport and text-size-adjust
- Claim: Never disable pinch zoom. axe fails `user-scalable=no` or `maximum-scale` < 2 (WCAG 1.4.4); MDN says WCAG needs >=2x and recommends allowing up to 5x; iOS 10+ ignores `user-scalable`/`maximum-scale` by default. `text-size-adjust: none` breaks mobile text inflation/zoom (MDN), is not Baseline.
- Evidence: https://dequeuniversity.com/rules/axe/html/4.10/meta-viewport — T2 — VERIFIED; MDN meta viewport (raw text checked: "iOS10+ ignores it by default", the summarizer's claim about Android was NOT in the page) — VERIFIED; MDN `touch-action`: `manipulation` keeps pan + pinch-zoom while removing double-tap-zoom delay; `none` disables browser zoom/pan handling — VERIFIED.
- Agent rule: viewport = `width=device-width, initial-scale=1` (add `viewport-fit=cover` + `env(safe-area-inset-*)` when edge-to-edge); never `user-scalable=no`/`maximum-scale=1`; use `touch-action: manipulation` on controls (not `none`); never set `text-size-adjust: none`; leave `html` font-size at browser default and use rem; test at 200% text and 400% zoom.
- Android Chrome honouring `user-scalable=no` unless "Force enable zoom" is MEMORY (not verified).

### F7 Reflow (320 CSS px) and text spacing
- Claim: 1.4.10 (AA): no loss of content/function and no 2-D scrolling at 320 CSS px wide (vertical scrollers) or 256 CSS px tall (horizontal scrollers); 320 = 1280 px viewport at 400% zoom, 256 = 1024 at 400%. Exempt: maps/diagrams, video, games, presentations, data tables (not individual cells), toolbars that must stay visible. 1.4.12 (AA): content must tolerate user-applied line-height 1.5x, paragraph spacing 2x, letter-spacing 0.12x, word-spacing 0.16x font size, with no clipping/overlap; authors are not required to adopt those values.
- Evidence: WCAG raw + Understanding reflow/text-spacing — T1 — VERIFIED. Understanding warns many mobile UAs do not shrink the viewport to 320 px for testing.
- Agent rule: IF layout is fixed-height/overflow-hidden for text THEN replace with min-height + wrap; test at a 320 px-wide viewport and with a text-spacing bookmarklet/user stylesheet; wide tables get their own scroll container only if essential. Native: spacing override rarely available (WCAG2Mobile), but never clip text.

### F8 Contrast: numbers, scope, exceptions
- Claim: 1.4.3 AA 4.5:1 (large text 3:1; large = >=18 pt or >=14 pt bold, ~24 px / ~18.66 px); values are not rounded (4.499 fails); exceptions: inactive UI components, pure decoration, logotypes. 1.4.6 AAA 7:1 (large 4.5:1). 1.4.11 AA 3:1 for UI component boundaries/states (input borders, checkbox/switch state, focus ring, icons that carry meaning) and meaningful graphics. 2.4.13 AAA focus: >=2 CSS px thick perimeter area and 3:1 change between focused/unfocused.
- Evidence: Understanding contrast-minimum / non-text-contrast / focus-appearance; WCAG raw — T1 — VERIFIED. Apple HIG: Level AA guidance (4.5:1 up to 17 pt; 3:1 at 18 pt+ or bold), supply a higher-contrast scheme when Increase Contrast is on, check both appearances, prefer system colours — VERIFIED; Apple Sufficient Contrast criteria: text 4.5:1, non-text 3:1, test with Bold Text + Increase Contrast + Reduce Transparency (individually and together) in light and dark — VERIFIED. Android design: 4.5:1 text, 3:1 non-text vs surface — VERIFIED; Flutter checklist 4.5:1 (disabled excepted) — VERIFIED. Fluent: 4.5:1, large 3:1 at 18.5px bold/24px, 3:1 non-text — VERIFIED.
- Context: WebAIM Million 2026: low-contrast text on 83.9% of home pages — VERIFIED. Disabled controls are exempt, which is why disabled-state styling is often illegible (F20).
- Agent rule: IF choosing colours THEN verify with the WCAG 2 luminance ratio (text >=4.5, large >=3, UI/icons/borders/focus >=3), including placeholder, helper text, disabled-but-informative text, text on images (add scrim), and in every theme (light, dark, increased contrast). Treat 7:1 as the target for small body text (Apple dark-mode page says "strive for 7:1" on custom colours).

### F9 APCA / WCAG 3 contrast: what an agent should rely on
- Claim: APCA (Lc values) is not in WCAG 2.2 and was removed from the WCAG 3 working drafts in 2023; the current WCAG 3 WD says the contrast algorithm is "yet to be determined" (assumes a size/weight factor). Apple's HIG names WCAG ratios and APCA as the two popular measures but uses WCAG AA numbers for its own guidance.
- Evidence: https://www.w3.org/TR/wcag-3.0/ — VERIFIED; Roselli 2026-04 — VERIFIED; HIG accessibility — VERIFIED.
- Disagreement: APCA proponents say APCA-passing colours usually exceed WCAG 2 minimums (comment on Roselli, T4); WCAG 2 ratio is known to over-pass some dark-mode and thin-text pairs.
- Agent rule: use WCAG 2 ratios as the pass/fail gate (legal baseline); optionally run APCA as an additional advisory check for dark mode / thin or small text; never replace the WCAG 2 gate with APCA. Do not quote "Lc 75" as a requirement.

### F10 Dark mode pitfalls
- Claim: dark mode is an accessibility feature for light-sensitive users but is not automatically more legible: Apple warns Increase Contrast + Reduce Transparency in dark mode can reduce contrast between dark text and dark backgrounds; Apple's Dark Interface criteria say avoid gray-on-black and test with Increase Contrast; Smart Invert can flip semantic colours (red Delete -> green). Material dark theme: base surface #121212, white on it = 15.8:1, keep >=4.5:1 on elevated surfaces, use desaturated tones (200-50 range) to avoid vibration. NN/g: for normal vision, light mode outperformed dark mode for acuity/reading, especially small text; low-vision users with cloudy media (cataract) did better in dark; no significant fatigue difference short-term; recommends offering a toggle.
- Evidence: https://developer.apple.com/design/human-interface-guidelines/dark-mode — VERIFIED (min 4.5:1; strive 7:1 for custom small text); Apple dark-interface criteria — VERIFIED; https://m2.material.io/design/color/dark-theme.html — VERIFIED; https://www.nngroup.com/articles/dark-mode/ — VERIFIED.
- Agent rule: IF supporting dark mode THEN define dark palette tokens separately (not inversion), re-run all contrast checks in dark and in increased-contrast variants, avoid pure saturated brand colours on dark, keep icons/illustrations legible (add outline where needed — Apple), follow system setting by default and offer an override. Halation/astigmatism claims about pure white-on-black are MEMORY and unverified here — treat as opinion.

### F11 Colour is never the only signal
- Claim: WCAG 1.4.1 (A); Apple HIG ("use shapes/icons in addition to colour"), Apple criterion tests with the Grayscale colour filter; Android: use more than colour (strokes, icons, text). Includes errors, status dots, selected state, charts, links, required fields.
- Evidence: WCAG raw 1.4.1 — VERIFIED; HIG accessibility/color — VERIFIED; Apple Differentiate-Without-Color criteria — VERIFIED; Android principles page ("Use cues other than color") — VERIFIED. SwiftUI `accessibilityDifferentiateWithoutColor` (shapes/glyphs when true) and `accessibilityShowButtonShapes` — VERIFIED.
- Agent rule: every status/error/selection = colour + icon/shape/text. Error text + icon + border, not only red. Test every screen in grayscale. Charts: direct labels or patterns.

### F12 Reduced motion: "reduce" does not mean "none"
- Claim: `prefers-reduced-motion: reduce` (Baseline since Jan 2020) signals the user wants less motion; MDN and web.dev both say it does not mean no animation: replace vestibular triggers (scaling/zooming that simulates depth, parallax, spinning/vortex, large panning, peripheral motion) with opacity/crossfade or static change, and keep essential feedback in a simpler form. iOS Reduce Motion originated in iOS 7 (WebKit blog).
- Evidence: MDN https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — VERIFIED (OS paths: iOS Settings > Accessibility > Motion; Android 9+ "Remove animations"; Windows 11 Animation effects); web.dev — VERIFIED (JS animations need `matchMedia` listener; conditional stylesheets); WebKit — VERIFIED ("only remove animations you know are triggers"; pinch-zoom is user-controlled and stays). Apple HIG Accessibility: when Reduce Motion is on cut automatic/repetitive animation, zooming/scaling, peripheral motion, z-axis depth, tighten springs/bounce, avoid animating into/out of blur, use fades in place of x/y/z transitions, tie motion to gestures — VERIFIED. Apple Reduced Motion criteria: must change depth simulation (parallax, animated blur, depth-of-field), spinning/multi-speed/multi-axis motion and auto-advancing carousels; replacements = dissolve, highlight fade, colour shift, static change; categorise each animation (decorative -> remove; meaningful -> replace) — VERIFIED. SwiftUI `accessibilityReduceMotion` ("avoid large animations, especially simulated third dimension") — VERIFIED. Android: "Remove animations" sets animator duration scale to 0; Compose animation classes follow it from 1.2.0; Lottie shows first frame; detect with `Settings.Global.ANIMATOR_DURATION_SCALE` (wrap in try/catch, default 1f) — T3 — VERIFIED (blog author); Compose >=1.2.0 also SNIPPET. RN `AccessibilityInfo.isReduceMotionEnabled()`; Flutter `MediaQuery.disableAnimations` — VERIFIED (names).
- Basis: WCAG 2.3.3 (AAA) calls out parallax and scroll-triggered decorative animation, essential exception, recommends honouring the OS/UA setting — VERIFIED; no prevalence stats given. Research caveat in F26.
- Related criteria: 2.2.2 Pause, Stop, Hide (A): auto-starting moving/blinking/scrolling content lasting >5 s and presented alongside other content needs pause/stop/hide; auto-updating content needs pause/stop/hide or frequency control — raw — VERIFIED. 2.3.1 (A): no more than 3 flashes in any 1 s unless below general/red flash thresholds (area ~341x256 px at 1024x768, <25% of a 10-degree field); tools PEAT/Harding — VERIFIED. Apple "Dim Flashing Lights" setting — HIG — VERIFIED.
- Agent rule: wrap every non-essential animation in a reduced-motion branch. Defaults to implement: parallax -> static; zoom/scale/slide page transitions -> 150-200 ms crossfade (duration is MEMORY/opinion; Apple gives no ms); springs/bounce -> no overshoot; auto-advancing carousel -> no autoplay; looping Lottie/skeleton shimmer -> static frame or very slow opacity; haptic/colour/label change keeps feedback. Never gate this behind an in-app toggle only; read the system flag.
- Stack notes: CSS `@media (prefers-reduced-motion: reduce)` (also read in JS with `matchMedia`); SwiftUI `@Environment(\.accessibilityReduceMotion)` + `withAnimation(reduceMotion ? nil : ...)`; Compose: respect animator scale automatically, still branch custom shared-element/parallax code.

### F13 Names, roles, states, hints: the screen-reader contract
- Claim: Every interactive element needs an accessible name, a role/trait and exposed state (WCAG 4.1.2 A, 1.1.1 A). Apple VoiceOver criteria: concise, out-of-context labels; destructive actions say what they affect ("Delete item from cart"); labels should NOT include the control type ("button") or state ("checked") — use traits/state; images described or marked decorative; charts via chart API/text; update state on change. SwiftUI hint = brief phrase of the result ("Purchases the item"). Android: `contentDescription`/semantics for icons, `null` for decorative, `onClickLabel`, `stateDescription`, `Role`, `heading()`, `mergeDescendants`, `paneTitle`, collection info; Android 16 adds expanded state, required field, tri-state checkbox, multiple labels, outline-text query.
- Evidence: Apple VoiceOver criteria — VERIFIED; HIG VoiceOver (titles/headings, grouping and order, report layout changes, rotor, exclude decorative) — VERIFIED; Adopting Liquid Glass: provide an accessibility label for every icon (so VoiceOver and Voice Control users can use text labels) — VERIFIED; Compose principles/api-defaults/semantics — VERIFIED; Android 16 features — VERIFIED; RN props — VERIFIED; Flutter Semantics props (label, hint, value, button, header, liveRegion, customSemanticsActions, sortKey, container, excludeSemantics) — VERIFIED.
- Label in Name (2.5.3, A): accessible name must contain the visible label text (ideally starting with it) so Voice Control/Dragon users can say what they see; `aria-label` that diverges from visible text is the classic failure; symbols like "B" or ">" get function names — VERIFIED. Apple Voice Control criteria agree (labels must match visible text; "Leave call" vs "End call" mismatch); `accessibilityInputLabels` adds alternates — VERIFIED.
- Agent rule: IF icon-only button THEN supply name (SwiftUI `Label` + `.labelStyle(.iconOnly)` or `.accessibilityLabel`, Compose `contentDescription`, RN `accessibilityLabel`, Flutter `Semantics(label)`/`tooltip`, web `aria-label` or visually-hidden text). Name = visible text (+ extras after it). Hints only when the result is not obvious; never repeat label or role. Group icon+text rows into one element (SwiftUI `.accessibilityElement(children: .combine)`, Compose `mergeDescendants`, Flutter `MergeSemantics`). Mark decorative images hidden.

### F14 Native first, ARIA second (and APG's mobile caveat)
- Claim: Use the native element; ARIA is a promise to implement keyboard behaviour; no ARIA beats bad ARIA. W3C Using ARIA rules: (1) native HTML if available, (2) do not change native semantics, (3) interactive controls must be keyboard operable (Enter and Space for role=button), (4) never `role=presentation`/`aria-hidden=true` on focusable elements (a 5th rule, interactive elements need an accessible name, is MEMORY). APG states it does not say which patterns work on mobile browsers/touch and that some ARIA features are unsupported in any mobile browser.
- Evidence: https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/ — VERIFIED; https://www.w3.org/TR/using-aria/ — VERIFIED; web.dev ARIA/HTML — VERIFIED. WebAIM Million 2026: pages with ARIA averaged 59.1 errors vs 42 without (~41% more); empty buttons 30.6%, empty links 46.3%, missing labels 51%; 95.9% of pages fail; average 56.1 errors (+10.1% YoY); report attributes growing complexity partly to frameworks and AI-assisted coding — VERIFIED (correlation, not causation).
- Agent rule: `<button>`, `<a href>`, `<input>`, `<select>`, `<dialog>`, `<details>` before any `role`. If a div must act as a control: role + tabindex=0 + Enter/Space + name + state + visible focus. Test with VoiceOver (iOS Safari) and TalkBack (Chrome), not only desktop.

### F15 Modal dialogs, sheets, drawers
- Claim: Modal = focus moves in, stays in, returns to the invoker; background is inert; Escape (or a visible close) dismisses; labelled. Native `<dialog>.showModal()` provides top layer, inert background, Esc, `::backdrop`, auto-focus of first focusable (override with `autofocus`), focus return, implicit role=dialog and aria-modal=true; always provide an explicit close button for touch; `closedby` attribute (any / closerequest / none) controls light-dismiss; do not put tabindex on `<dialog>`. APG: focus first focusable, or a static element/title for long/structured content, or the safest option for destructive confirmations; return focus to invoker unless gone.
- Evidence: MDN dialog — VERIFIED; MDN inert (not focusable/clickable, hidden from AT; baseline 2023) — VERIFIED; APG dialog-modal — VERIFIED; Scott O'Hara 2023: native dialog is now generally the better option; warns against modals as page replacement — VERIFIED. Apple: modal views must block VoiceOver access to background, support `accessibilityPerformEscape()` for dismissal; screen changes move focus logically — VERIFIED. HIG sheets: Cancel/Close dismisses without saving, Done confirms; pair Done with Cancel or Back; avoid all three; Cancel leading, Done trailing in iOS toolbars — VERIFIED. HIG alerts: avoid informational-only alerts; provide alternative ways to cancel — VERIFIED. Compose: `paneTitle` for window-like components; restore focus after dialogs — VERIFIED. RN: `accessibilityViewIsModal`/`aria-modal` (iOS) — VERIFIED.
- Scope: universal; aria-modal reliability on iOS VoiceOver not verified (a11ysupport fetch returned nothing) — gap.
- Agent rule: web: use `<dialog>` + `showModal()` (+ `inert` on the app root only if you roll your own), label with `aria-labelledby`, `autofocus` on the least destructive action, restore focus to trigger. Bottom sheets: visible close/Done button, drag handle is not the only dismissal (2.5.7), Esc/back works, background inert, announce title (`paneTitle`, `AccessibilityNotification.ScreenChanged`). Do not use `aria-modal` without actually making the background inert.

### F16 APG patterns that matter on mobile (tabs, disclosure/accordion, menu button, combobox, switch, carousel)
- Tabs: roles tablist/tab/tabpanel, `aria-selected`, `aria-controls`, panel `aria-labelledby`; arrow keys move between tabs, Home/End optional, Tab leaves into panel; automatic activation recommended when panels are preloaded; `aria-orientation="vertical"` for vertical lists — VERIFIED. A bottom navigation bar that changes screens is navigation (`<nav>` with `aria-current="page"`), not necessarily a tablist (inference/MEMORY).
- Disclosure/accordion: a `<button>` with `aria-expanded` (true/false), optional `aria-controls`; Enter/Space toggle; accordion headers are buttons inside headings; panel `region` role optional and avoided when >~6 panels can be open — VERIFIED. Prefer native `<details>/<summary>` (MEMORY).
- Menu button: `aria-haspopup="menu"`, `aria-expanded`, Enter/Space open and focus first item; described as for application-style menus — VERIFIED; the "do not use role=menu for site navigation" caution was NOT in the fetched text (MEMORY).
- Combobox/listbox: DOM focus stays on the input, `aria-activedescendant` tracks the option, `aria-expanded`, `aria-controls`, `aria-autocomplete` none/list/both; page gives no mobile/touch guidance — VERIFIED. Prefer native `<select>` / `<datalist>` on mobile unless the design needs filtering (opinion).
- Switch: `role="switch"` + `aria-checked`, or checkbox with role; Space toggles; the label must not change when state changes — VERIFIED.
- Carousel: previous/next buttons, a rotation (pause) control first in the tab order, autoplay stops on focus/hover, slides `role="group"` + `aria-roledescription="slide"`, `aria-live="off"` while rotating and `polite` when not — VERIFIED.
- Agent rule: use these only when a native element can't do the job; on mobile always supply visible buttons (no swipe-only carousels; WCAG 2.5.1), no autoplay by default (2.2.2).

### F17 Status messages, loading and live announcements
- Claim: 4.1.3 (AA): status messages (success, results count, waiting state, progress, errors) must be programmatically determinable (role=status / alert / log or aria-live) without moving focus. MDN: the live region must exist (empty) before content changes — safest in initial markup; if injected via JS, defer the update a tick; `polite` (default choice) vs `assertive` (sparingly); `aria-live="off"` does not mean "never announce"; `role=alert` gets special handling; live regions announce plain text only. `aria-busy="true"` tells AT to wait while multiple parts update, then set false; it is not a loading announcement by itself.
- Evidence: Understanding 4.1.3 — VERIFIED; MDN live regions + aria-busy — VERIFIED; APG alert (assertive, no focus change, avoid auto-dismiss, use alertdialog if interaction needed) — VERIFIED.
- Native: iOS `AccessibilityNotification` types = Announcement (with priority; `.high` interrupts), LayoutChanged, ScreenChanged, PageScrolled — VERIFIED; HIG: report visible content/layout changes to VoiceOver; Apple VO criteria: temporary status banners must be conveyed via AccessibilityNotification — VERIFIED. Android Compose `liveRegion = LiveRegionMode.Polite/Assertive`, `paneTitle`, `error(...)`, `progressBarRangeInfo`; Android 16 adds indeterminate progress range type — VERIFIED. RN `AccessibilityInfo.announceForAccessibility`, Android `accessibilityLiveRegion`/`aria-live` — VERIFIED. Flutter `SemanticsService.announce`, `Semantics(liveRegion:)` — VERIFIED.
- Agent rule: loading = visible indicator + text and a polite status announcement at start ("Loading results") and end ("12 results" / error); do not announce every progress tick (throttle, e.g. at milestones); skeleton screens need the same status text; form success = status region; blocking error = alert or focus the error summary. Keep one persistent status container per screen.
- Unverified: real-world iOS VoiceOver/TalkBack behaviour differences for `aria-live` in mobile browsers (gap).

### F18 Toasts/snackbars and timing (2.2.1)
- Claim: Auto-dismissing toasts are risky; W3C's own Understanding doc says a timed message does not need to be time-adjustable if the user can get the same information elsewhere (email-client toast + Inbox example), but if there is no other way to discover the information or perform the function, each message must meet 2.2.1 (turn off / adjust >=10x / extend with >=20 s warning, >=10 times; exceptions real-time, essential, >20 h).
- Evidence: Understanding timing-adjustable (raw text re-checked) — T1 — VERIFIED. Roselli reads it more strictly (toasts fail unless persistent; hard for keyboard users to reach; Esc-dismiss clashes) and prefers persistent inline messages or a notification archive; if toasts, `role=status` + `aria-atomic`, never auto-dismiss — VERIFIED. O'Hara: toast = status message; avoid interactive controls (Undo) inside; put the action elsewhere too; keep history — VERIFIED. Carbon: avoid timed toasts for critical/lengthy messages — VERIFIED. Apple HIG: minimise timed UI, prefer explicit dismissal, as auto-dismiss hurts people who need more time and users of assistive tech — VERIFIED. Android: `AccessibilityManager.getRecommendedTimeoutMillis()` (API 29+) returns the user's "Time to take action" preference; flags for icons/controls/text — VERIFIED. Material Snackbar durations Short/Long/Indefinite exist (VERIFIED), millisecond values (Compose Short ~4 s, Long ~10 s) are MEMORY.
- Disagreement: W3C Understanding (lenient when info is available elsewhere) vs Roselli (strict). Resolution for agents: follow the stricter practice for anything actionable.
- Agent rule: confirmation-only messages ("Saved") may auto-dismiss if the result is visible elsewhere, but pause on hover/focus and scale duration by the platform preference (Android recommended timeout; iOS prefer none); anything with an action (Undo), an error, or the only record of a result must persist until dismissed or live in an inline banner; announce via polite status (alert only for urgent); never trap focus in a toast; also expose Undo in-context (e.g. menu) for 2.5.1/2.2.1.

### F19 Forms: labels, errors, autofill, validation, authentication
- Labels/instructions: 3.3.2 (A); visible `<label for>`; hidden labels allowed only when context is obvious; fieldset/legend for groups — W3C WAI forms tutorial — VERIFIED. Placeholder is not a label: NN/g (disappearing text strains memory, low contrast, mistaken for filled values, not always read aloud); GOV.UK: avoid placeholder for labels/hints; floating labels = compromise (NN/g) — VERIFIED.
- Identify Input Purpose (1.3.5, AA): use HTML `autocomplete` tokens (name, given-name, family-name, email, tel, street-address, postal-code, bday, ...) for fields about the user — VERIFIED. (`one-time-code`, `cc-number`, `new-password` tokens are MEMORY.)
- Error identification (3.3.1 A): identify the field in error and describe in text; suggestion (3.3.3 AA); prevention for legal/financial/data (3.3.4 AA: reversible, checked, or confirmed) — raw WCAG — VERIFIED. GOV.UK: error summary at top of main (focus moves to it on page load; nested role=alert; each item links to the first field of the question), inline message above the field with hidden "Error:" prefix linked via `aria-describedby`, red border (not colour alone), keep entered values, same wording in summary and inline, prefix page title with "Error:", validate on submit not on blur unless research shows otherwise, `novalidate` on form, accept varied formats — VERIFIED.
- Redundant Entry (3.3.7, A): info already entered in the same process must be auto-populated or selectable (exceptions essential/security/invalid) — VERIFIED. Consistent Help (3.2.6, A): help mechanisms repeat in same relative order across pages — VERIFIED.
- Accessible Authentication (3.3.8, AA): no cognitive function test (memory, transcription, puzzle, calculation) unless alternative or assistive mechanism exists; do not block paste or password-manager fill; split one-digit-per-box OTP fields that break paste fail; allow optional show-password; WebAuthn/passkeys/email link/OAuth satisfy; object recognition and personal-content exceptions exist at AA but not at AAA 3.3.9 — Understanding + raw — VERIFIED.
- Mobile keyboards: `inputmode="numeric"/"decimal"` instead of `type="number"` (accidental increment, unclear validation); `spellcheck=false` for codes; GOV.UK — VERIFIED. `enterkeyhint` — MEMORY.
- Disabled submit button: Axess Lab: disabled buttons are skipped by AT/keyboard, WCAG exempts them from contrast, give no reason; keep the button enabled and show what is missing on press — VERIFIED (opinion-heavy T2).
- Disagreement: GOV.UK says never use `required` attribute and use `novalidate` (own error summary instead of browser bubbles) vs common practice/WAI to mark required fields; AT support for native validation bubbles is inconsistent (MEMORY). Both agree required state must be visible in text and exposed (Android 16 adds `setFieldRequired`, Flutter/Compose via semantics).
- Agent rule: visible label above field; hint via `aria-describedby`; required marked in text ("(required)") or mark optional; correct `autocomplete`/`inputmode`/`type`; submit enabled; on submit with errors move focus to error summary (web) or announce + focus first invalid (native); errors say what and how to fix; preserve input; don't block paste; OTP = one field with `autocomplete="one-time-code"` (MEMORY for token); offer passkey/biometric sign-in.

### F20 Navigation structure, route changes and focus management
- Landmarks: use `header/nav/main/footer/aside`, label multiple `nav`s (`aria-label`) — WAI regions tutorial — VERIFIED. But screen reader users rely far more on headings: WebAIM #11 (Jul-Aug 2026): headings are the first method for finding info on long pages for 67.8%, landmarks only 3.4% (28.3% use them often or always when present) — VERIFIED (self-selected respondents).
- SPA/PWA route changes: Gatsby user testing found focusing the page heading on route change was the best experience for screen reader users (clear, saves time) vs resetting focus to app wrapper; also `aria-current`, hidden headings for sections, a skip-link style control that takes focus and is operable; combine with live-region announcement; focus outlines on non-interactive targets confused switch users — VERIFIED (2019, T3).
- Native: HIG: give each screen a unique title, accurate headings, group/order elements; Apple VO criteria: reload must not reset reading position, screen changes move focus logically, support rotor; `ScreenChanged` notification; Compose `traversalIndex`/`isTraversalGroup` (default left-to-right, top-to-bottom), Material v1: focus from top to bottom/most to least important — VERIFIED.
- Agent rule: on route/screen change: update `document.title`, move focus to the new page's `<h1>` (tabindex=-1) or the main region, optionally announce; do not leave focus on a removed element; use skip links; one `<main>`; headings in order with no skipped levels for navigation use (hierarchy skipping is opinion/MEMORY). Native: post ScreenChanged/LayoutChanged and set accessibility focus on the screen title.

### F21 Focus visibility, keyboard and switch/voice access on mobile
- Claim: Mobile users use external keyboards (iPadOS/Android tablets, Full Keyboard Access), Switch Control/Switch Access, Voice Control/Voice Access. WCAG 2.4.7 (AA) visible focus; 2.4.11 (AA, new): a focused component must not be entirely hidden by author content (sticky headers/footers, cookie banners, chat widgets, bottom sheets, toasts); user-opened content that can be dismissed without moving focus is excepted; 2.4.12 AAA none hidden; 2.4.13 AAA (2 px, 3:1 change). `:focus-visible` uses UA heuristics (no ring on tap for buttons, ring for text fields/keyboard); never remove outlines without a replacement; MDN notes focus indicator must meet 3:1.
- Evidence: WCAG raw + Understanding 2.4.11 / 2.4.13 — VERIFIED; MDN :focus-visible — VERIFIED; web.dev focus (avoid positive tabindex, tabindex 0/-1, skip links, 3:1 focus indicator) — VERIFIED. Apple HIG: support Full Keyboard Access and don't override system shortcuts; support Switch Control; test AssistiveTouch/Pointer Control — VERIFIED. Android: Switch Access testing (only actionable items highlighted, all gestures as selectable controls, text editing possible), Voice Access testing; Compose focus APIs (`focusable`, `focusProperties`, `FocusRequester`, `focusGroup`; default visible focus indication; Tab = 1-D, arrows = 2-D) — VERIFIED.
- Agent rule: add `scroll-padding-top/bottom` equal to sticky bar heights (technique in Understanding; value is project-specific); keep bottom CTAs from covering the focused field (visualViewport/`interactive-widget=resizes-content`, MDN meta viewport — VERIFIED); style `:focus-visible` with >=2 px outline, 3:1, offset; never `outline:none` alone; test with Tab on an external keyboard.

### F22 Orientation and PWA manifest
- Claim: 1.3.4 (AA) forbids locking to one orientation unless essential (bank check, piano app, slides, VR). Users with wheelchair-mounted devices cannot rotate. WCAG2Mobile: support all four orientations. A manifest `orientation: "portrait"` (or CSS/JS lock) would fail 1.3.4 (inference from the SC; MDN manifest page contains no a11y note and lists `any`/`natural` etc.).
- Evidence: Understanding orientation — VERIFIED; MDN manifest orientation — VERIFIED (values).
- Agent rule: omit `orientation` (or `any`); native apps: support all orientations except genuinely essential; never lock for convenience; make landscape usable (safe areas, split layouts).

### F23 Cognitive accessibility and calm interfaces
- W3C COGA (WG Note 2021): 8 objectives — understand what things are/how to use them; find what they need; clear content; avoid mistakes/know how to correct; focus (limit interruptions, orientation cues); no reliance on memory; help and support; adaptation/personalization — VERIFIED. Patterns: avoid data loss and timeouts (4.5.9), error prevention (4.5.4), limit interruptions (4.6.1) — VERIFIED.
- Apple HIG cognitive guidance: simple consistent interactions, system gestures over custom, explicit dismissal over timers, no autoplay media without controls, Assistive Access (single-interaction screens, double confirmation for hard-to-reverse actions) — VERIFIED.
- Agent rule: confirm destructive/irreversible actions with undo or a second step (3.3.4 for legal/financial/data); persist drafts across timeouts; one primary task per screen; consistent placement of help (3.2.6).

### F24 iOS 26 / Liquid Glass accessibility implications (current as of 2026)
- Claim: Apple asks developers to test custom elements, colours and animations with accessibility settings that reduce transparency or motion and with the user's chosen Liquid Glass look; system components adapt automatically. HIG materials: appearance of Liquid Glass variants changes under Reduce Transparency/Increase Contrast; use the regular (more opaque, luminosity-adjusting) variant for text-heavy components like alerts, sidebars, popovers; add a dimming layer behind clear Liquid Glass when needed; custom colours need light, dark and increased-contrast variants even if the app ships in one appearance. Accessibility Nutrition Labels (iOS 26+) let apps declare VoiceOver, Voice Control, Larger Text, Dark Interface, Differentiate Without Color Alone, Sufficient Contrast, Reduced Motion, Captions, Audio Descriptions, each with published evaluation criteria (F5, F8, F10, F12, F13).
- Evidence: Adopting Liquid Glass JSON; HIG materials, color; Nutrition-label overview — VERIFIED. Android counterpart: Android 16 replaces "high contrast text" with outline text and adds `AccessibilityManager` APIs to read it — VERIFIED. Material 3 Expressive accessibility specifics — NOT VERIFIED (m3 unfetchable).
- Agent rule: with translucent/glass surfaces, never place small text over variable content without a scrim; honour `accessibilityReduceTransparency`/`colorSchemeContrast`; treat Apple's evaluation criteria as an executable QA checklist.

### F25 Platform setting inventory an agent should honour
- iOS: VoiceOver, Voice Control, Switch Control, Full Keyboard Access, AssistiveTouch, Pointer Control (HIG — VERIFIED); Dynamic Type / Larger Text (AX1-AX5), Bold Text (`legibilityWeight`), Increase Contrast (`colorSchemeContrast`), Reduce Transparency, Reduce Motion, Differentiate Without Color, Button Shapes, Smart Invert (`accessibilityInvertColors`), Dim Flashing Lights, Assistive Access (all VERIFIED via HIG/SwiftUI docs); Voice Control "show numbers/names" is the test method (VERIFIED).
- Android: TalkBack (swipe linear nav, explore by touch), Switch Access, Voice Access, font size up to 200% + display size, Remove animations (animator scale 0), "Time to take action" (recommended timeout API), outline text (Android 16), colour correction/inversion (MEMORY) — VERIFIED except noted.
- Web: `prefers-reduced-motion`, `prefers-contrast: more|less|custom` (Baseline since May 2022), `forced-colors: active` (Windows HC; borders/outlines needed because box-shadow/background-images are removed — VERIFIED), `prefers-color-scheme` (MEMORY), `pointer: coarse` (VERIFIED), `any-pointer`.
- Agent rule: implement design tokens with 4 variants: default, dark, increased-contrast, (forced-colors on web); don't rely on shadows alone for boundaries.

### F26 Vestibular research basis (what the numbers really are)
- Agrawal et al. 2009 (NHANES 2001-2004, n=5,086 adults 40+): 35.4% (~69 million US adults) had vestibular dysfunction on a modified Romberg balance test; 18.5% at 40-49, 84.8% at 80+; ~32% of those with no dizziness history still tested impaired; test cannot separate central vs peripheral causes — https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/773517 — T2 — VERIFIED. WebKit's reduced-motion article cites "as many as 69 million" — VERIFIED.
- Interpretation: this is a balance-test prevalence, not the share of users who experience motion-triggered symptoms or enable Reduce Motion. WCAG 2.3.3 gives no prevalence number (VERIFIED). Treat as "large, age-skewed population" not a precise figure.

### F27 Evidence on how many users use these settings
- Text size: Netherlands field research (appt.org): "more than a fifth" normally increase text size on iOS and on Android; no sample size/method on page — T3 — VERIFIED (weak). Per-app iOS telemetry via Steipete/PSPDFKit tweet: "at least a quarter" non-default; ~30% (PSPDFKit), 29% (Immoweb), a Medium post claiming >40% — T4 — SNIPPET. Android ~25% increase font size — SNIPPET. Apple/Google do not publish platform-wide numbers (not found).
- Screen readers (survey, not population): WebAIM #11 (Jul-Aug 2026, 1,780 valid responses): primary mobile platform iOS 73.3% / Android 24.0%; VoiceOver 72.2% vs TalkBack 29.5% among mobile screen reader users (multi-select); ~91.8% of respondents use a screen reader on mobile; #10 (Dec 2023-Jan 2024, n=1,539) had iOS 70.6%/Android 27.6% — T2 — VERIFIED; respondents are recruited via accessibility mailing lists, not representative of all disabled users or of general population.
- Reduce Motion enabled share, dark mode share, Switch Control/Voice Control share, Increase Contrast share: unknown/not found (search budget exhausted before these were queried).
- Agent rule: don't cite specific percentages in the skill except as "roughly a quarter of users in available app datasets change text size"; prioritise iOS VoiceOver then TalkBack for screen reader QA.

### F28 Stack API mapping (high level)
| Concept | SwiftUI/UIKit | Compose | React Native | Flutter | Web |
|---|---|---|---|---|---|
| Name | `.accessibilityLabel`, `accessibilityInputLabels` | `contentDescription`, `semantics{}` | `accessibilityLabel` | `Semantics(label:)`, `semanticsLabel` | label/`aria-label`/text |
| Role/trait | `.accessibilityAddTraits` | `Role`, `clickable(role)` | `accessibilityRole`/`role` | `Semantics(button:true)` | native element/`role` |
| State/value | `.accessibilityValue` | `stateDescription`, `toggleableState` | `accessibilityState/Value`, `aria-*` | `Semantics(value:)` | `aria-checked/expanded/selected` |
| Hint | `.accessibilityHint` | `onClickLabel` | `accessibilityHint` | `Semantics(hint:)` | `aria-describedby` |
| Group/hide | `.accessibilityElement(children:)`, `.accessibilityHidden` | `mergeDescendants`, `clearAndSetSemantics`, null desc | `accessible`, `importantForAccessibility`, `accessibilityElementsHidden` | `MergeSemantics`, `ExcludeSemantics` | `aria-hidden` (never on focusable), `inert` |
| Heading | `.accessibilityHeading` / header trait | `heading()` | `accessibilityRole="header"` (MEMORY) | `Semantics(header:true)` | `<h1-h6>` |
| Announce | `AccessibilityNotification.Announcement(...).post()` | `liveRegion`, (announce via view) | `AccessibilityInfo.announceForAccessibility` | `SemanticsService.announce` | `role=status`/`aria-live` |
| Custom action | `.accessibilityAction(named:)` | `customActions` | `accessibilityActions` | `customSemanticsActions` | visible buttons |
| Focus order | `.accessibilitySortPriority`, `accessibilityRotor` | `traversalIndex`, `isTraversalGroup` | `experimental_accessibilityOrder` | `sortKey` | DOM order |
| Reduce motion | `accessibilityReduceMotion` | animator scale (Compose >=1.2.0 follows) | `AccessibilityInfo.isReduceMotionEnabled` | `MediaQuery.disableAnimations` | `prefers-reduced-motion` |
| Text scale | `dynamicTypeSize`, text styles | `sp`, `LocalDensity.fontScale` | `allowFontScaling` (MEMORY) | `MediaQuery.textScaler` | `rem`, `-apple-system-body` |
| Contrast pref | `colorSchemeContrast` | (n/a verified) | (n/a verified) | `MediaQuery.highContrast` | `prefers-contrast` |
| Colour-only | `accessibilityDifferentiateWithoutColor` | design rule | design rule | design rule | design rule |
(All names VERIFIED against fetched docs except those marked MEMORY.)

### F29 Testing: what automation covers
- Apple: `XCUIAccessibilityAuditType` = action, contrast, dynamicType, elementDetection, hitRegion, parentChild, sufficientElementDescription, textClipped, trait (and `all`) — VERIFIED (type list); the `performAccessibilityAudit` call itself is MEMORY (not seen). Xcode Accessibility Inspector — HIG — VERIFIED.
- Android: Compose `enableAccessibilityChecks()` (Compose 1.8.0+, `ui-test-junit4-accessibility`) checks labels, touch target, contrast, traversal; Accessibility Scanner app; Play pre-launch report flags target size, low contrast, labelling, implementation; manual TalkBack + Switch Access + Voice Access — VERIFIED.
- Web: axe rules (`meta-viewport`, `target-size`, colour contrast), Lighthouse (MEMORY); Flutter guideline tests — VERIFIED (names).
- Limits: automation finds a subset (WebAIM Million counts only detectable failures; MEMORY on "~30-40% of issues detectable").
- Manual protocol for the skill: (1) VoiceOver/TalkBack complete the main task eyes-closed; (2) text at AX5/200% + 320 px width; (3) grayscale; (4) Reduce Motion + Remove animations; (5) Increase Contrast + dark; (6) external keyboard Tab/Shift-Tab; (7) Voice Control "Show names"; (8) Switch scan.

### F30 Gestures/Dismissal for custom bottom sheets and swipe back — see F4/F15 (no extra source).

### F31 Legal/regulatory context (low confidence; not core)
- EN 301 549 incorporates WCAG 2.1 AA verbatim for web content and WCAG 2.0 AA via WCAG2ICT for non-web (W3C EU policy page) — VERIFIED; the page-summary claim that the EAA "references WCAG 2.2" looks wrong/uncertain — treat as unverified. EAA application date (28 June 2025) and US DOJ Title II WCAG 2.1 AA rule are MEMORY.
- Agent rule: tell users to confirm obligations with counsel; build to 2.2 AA which is a superset of 2.1 AA.

### F32 Evidence on AI-generated accessibility failures is thin
- ChatGPT study (arXiv 2501.03572, Jan 2025, T3 preprint): default generated page code often lacks WCAG compliance; handles simple fixes, struggles with intricate ones; screenshots plus structured feedback improve results — VERIFIED (abstract). arXiv 2607.20690 (July 2026, T3 preprint): LLM/coding-agent-generated Tailwind UIs exhibit accessibility barriers, deceptive patterns, weak hierarchy; 19 principles incl. WCAG 2.2 — VERIFIED (abstract). WebAIM Million 2026 attributes part of rising complexity to automated/AI-assisted coding — VERIFIED. The specific list in "Anti-patterns" below is therefore my synthesis from the top WebAIM failure classes and APG/WCAG rules, not a measured ranking of LLM failure modes.

---

## Numbers table (value | applies to | source | tag)

| Value | Applies to | Source | Tag |
|---|---|---|---|
| 24x24 CSS px (+ 24 px-diameter circle spacing exception) | WCAG 2.5.8 AA target minimum | W3C WCAG 2.2 raw | VERIFIED |
| 44x44 CSS px | WCAG 2.5.5 AAA | W3C WCAG 2.2 raw | VERIFIED |
| 44x44 pt default / 28x28 pt minimum | iOS/iPadOS controls | Apple HIG accessibility | VERIFIED |
| ~12 pt padding (bezeled) / ~24 pt (borderless) | iOS spacing | Apple HIG accessibility | VERIFIED |
| 48x48 dp (~9 mm), >=8 dp gap | Android/Material | Google a11y help + Material v1 | VERIFIED |
| 48x48 px | Flutter release checklist | docs.flutter.dev/ui/accessibility | VERIFIED |
| 7 mm (44 px), 5 mm special case | BBC GEL | via Roselli | VERIFIED (secondary) |
| 1 cm x 1 cm; ~2 mm gap | NN/g | nngroup.com | VERIFIED |
| fingertip 1.6-2 cm; thumb ~2.5 cm | MIT Touch Lab via NN/g | nngroup.com | VERIFIED |
| ~11 mm top / 7 mm centre / 12 mm bottom | Hoober via Smashing | smashingmagazine.com | VERIFIED (secondary) |
| 40x40 effective px | Microsoft Fluent (via Roselli) | adrianroselli.com | VERIFIED (secondary) |
| 9 mm x 9 mm | W3C 2015 mobile draft | w3.org/TR/mobile-accessibility-mapping | VERIFIED (stale) |
| 4.5:1 / 3:1 large | WCAG 1.4.3 AA | W3C | VERIFIED |
| 7:1 / 4.5:1 large | WCAG 1.4.6 AAA | W3C | VERIFIED |
| 3:1 | WCAG 1.4.11 UI components and graphics | W3C | VERIFIED |
| large text = 18 pt or 14 pt bold (~24 px / ~18.66 px) | WCAG | W3C | VERIFIED |
| 2 CSS px perimeter area, 3:1 focused vs unfocused | WCAG 2.4.13 AAA | W3C | VERIFIED |
| 15.8:1 white on #121212; >=4.5:1 on elevated | Material dark theme | m2.material.io | VERIFIED |
| >=4.5:1 minimum, strive 7:1 custom small text | Apple dark mode | HIG dark-mode | VERIFIED |
| 200% | WCAG 1.4.4; Apple "at least 200% (140% watchOS)"; Android max font scale (14+) | W3C/Apple/Android | VERIFIED |
| iOS Body pt: 14,15,16,17,19,21,23, AX1 28, AX2 33, AX3 40, AX4 47, AX5 53 | Dynamic Type | HIG typography tables | VERIFIED |
| iOS default 17 pt / min 11 pt; Android body min 12 sp | type sizes | HIG / Android design | VERIFIED |
| 320 CSS px (=1280 px at 400%) / 256 CSS px (=1024 at 400%) | WCAG 1.4.10 | W3C | VERIFIED |
| 1.5x line-height, 2x paragraph, 0.12x letter, 0.16x word | WCAG 1.4.12 | W3C | VERIFIED |
| >5 s auto-moving content needs pause/stop/hide | WCAG 2.2.2 | W3C | VERIFIED |
| turn off / adjust >=10x / extend with >=20 s warning, >=10 times; >20 h exception | WCAG 2.2.1 | W3C | VERIFIED |
| <=3 flashes/s; ~341x256 px at 1024x768 (<25% of 10 deg) | WCAG 2.3.1 | W3C | VERIFIED |
| maximum-scale must be >=2 (axe); best practice up to 5x | meta viewport | Deque / MDN | VERIFIED |
| aria-live: polite default; assertive sparingly | live regions | MDN | VERIFIED |
| ARIA pages 59.1 avg errors vs 42 without; overall 56.1/page, 95.9% fail | web | WebAIM Million 2026 | VERIFIED |
| low contrast 83.9%, alt 53.1%, labels 51%, empty links 46.3%, empty buttons 30.6%, lang 13.5% | web top failures | WebAIM Million 2026 | VERIFIED |
| headings 67.8%, landmarks 3.4% as primary find method; iOS 73.3% vs Android 24.0% | screen reader users | WebAIM #11 | VERIFIED |
| 35.4% (~69 M) US adults 40+ vestibular dysfunction (balance test) | vestibular | Agrawal 2009 | VERIFIED |
| Compose Snackbar Short ~4 s / Long ~10 s | Android | MEMORY | MEMORY |
| >20% increase text size (NL); ~25-30% (iOS app datasets) | usage | appt.org; Steipete tweet | VERIFIED / SNIPPET |

## Comparison tables

### Target size standards
| Standard | Number | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|---|
| WCAG 2.5.8 AA | 24 CSS px + spacing | legal floor, objective | too small for comfortable thumb use | compliance gate, dense toolbars | as design target |
| WCAG 2.5.5 AAA | 44 CSS px | matches Apple, simple | AAA, not legally required | default for web controls | inline text links |
| Apple HIG | 44 pt default / 28 pt min | platform-native | two tiers confuse | iOS | cramped rows w/o padding |
| Material/Android | 48 dp + 8 dp gap | clear spacing rule | physical size ~9 mm varies little | Android, Flutter | n/a |
| NN/g / research | 1 cm, 2 mm gap | physical basis | based on older thumb studies | sanity check | n/a |

### Announcing changes
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Persistent inline message (static region) | meets 2.2.1, discoverable | takes layout space | errors, save results with actions | trivial confirmations |
| `role=status` / polite live region | non-interrupting, 4.1.3 | plain text only; must pre-exist | search counts, "Saved", loading | urgent errors |
| `role=alert` / assertive | immediate | interrupts, spam risk | blocking errors | frequent updates |
| Auto-dismiss toast/snackbar | low visual weight | timing, magnifier/switch users miss it | info available elsewhere | sole record, Undo-only |
| Modal alert dialog | forces attention | interrupts | irreversible confirm | informational notices (HIG) |

### Focus handling on navigation (Gatsby research)
| Approach | Result |
|---|---|
| Live region only | works but weaker orientation |
| Focus app wrapper/top | overwhelming on large apps |
| Focus new page heading | preferred by screen reader users |
| Skip-link style operable control + announcement | proposed recommendation |

### Reduced-motion replacements
| Original | Replace with | Source |
|---|---|---|
| parallax / depth blur | static layers | Apple criteria, MDN |
| zoom/scale transition | crossfade/dissolve | Apple HIG/criteria, web.dev |
| slide x/y/z transition | fade | Apple HIG |
| auto-advancing carousel | paused, manual controls | Apple criteria, APG |
| springy bounce | tighter/no overshoot | Apple HIG |
| looping animation (Lottie) | first/static frame | Android blog |
| meaningful feedback (add to cart) | colour/highlight fade, static change | Apple criteria |

### Dialog implementations
| Option | Strength | Weakness | Best use |
|---|---|---|---|
| Native `<dialog>` + `showModal()` | top layer, inert, Esc, focus return | non-modal dialog gaps, `closedby` support varies | default web modal |
| ARIA custom dialog | full control | you must trap/restore focus, iOS aria-modal uncertain | legacy only |
| Platform sheet (SwiftUI/Material) | native a11y | custom gestures break; needs Cancel/Done | native apps |

### Text scaling strategies (Android docs)
| Strategy | Strength | Weakness |
|---|---|---|
| Density scaling (everything scales, reflows) | best for reading layouts | larger layout shifts |
| Font scaling only | simple | layout stays fixed, clipping risk |

## Anti-patterns found (problem -> why it happens -> better alternative -> source)
1. div/span as button -> fast styling, no role/keyboard -> `<button>`; if impossible role+tabindex+Enter/Space+name -> APG read-me-first, Using ARIA — VERIFIED.
2. Icon-only button/link with no name -> assumes icon is self-explanatory -> label every icon -> WebAIM 30.6% empty buttons; Apple Liquid Glass doc — VERIFIED.
3. Placeholder as label -> compact design trend -> persistent visible label -> NN/g, GOV.UK — VERIFIED.
4. Colour-only errors/status/selection -> brand colour usage -> icon/text/shape + colour; grayscale test -> WCAG 1.4.1, HIG, Apple criteria — VERIFIED.
5. Disabled-button trap (submit greyed, no reason) -> premature validation -> keep enabled, explain on press -> Axess Lab; WCAG exempts disabled from contrast — VERIFIED.
6. Focus lost after route change/dialog close -> SPA re-render removes focused node -> focus heading/main, return focus to invoker -> Gatsby research, APG dialog — VERIFIED.
7. `user-scalable=no` / `maximum-scale=1` / `text-size-adjust: none` -> prevent iOS input zoom or layout shift -> 16px+ inputs, flexible layout; allow zoom -> axe, MDN — VERIFIED.
8. Fixed-height text containers, px font sizes, truncation of key text -> pixel-perfect mockups -> min-height, sp/rem/text styles, stacked layouts at large sizes -> HIG typography, Android docs — VERIFIED.
9. Gesture-only actions (swipe-delete, drag-reorder, pinch-only zoom, shake undo) -> gestures feel modern -> visible controls + custom actions -> WCAG 2.5.1/2.5.7/2.5.4, HIG — VERIFIED.
10. Auto-dismiss toast carrying the only error/Undo -> snackbar default behaviour -> persistent inline message, scaled timeout, undo elsewhere -> Understanding 2.2.1, Roselli, O'Hara, HIG — VERIFIED.
11. `outline: none` with no replacement; focus hidden under sticky bars -> aesthetics -> `:focus-visible` style, `scroll-padding` -> MDN, web.dev, WCAG 2.4.11 — VERIFIED.
12. `aria-label` unrelated to visible text -> copy/translation drift -> name contains visible text -> WCAG 2.5.3, Apple Voice Control — VERIFIED.
13. Switch/toggle whose label flips with state -> "Enable/Disable" copy -> constant label + state — APG switch — VERIFIED.
14. `aria-hidden` on focusable, role=menu misuse, ARIA everywhere -> cargo-culting -> native first -> Using ARIA rule 4, WebAIM ARIA correlation — VERIFIED.
15. Blocking paste/password-manager, one-digit-per-box OTP, CAPTCHA puzzle login -> security folklore -> allow paste, single OTP field, passkeys -> WCAG 3.3.8 Understanding — VERIFIED.
16. Hover-only tooltips/menus on touch -> desktop-first -> tap/focus equivalents, dismissible/hoverable/persistent content -> WCAG 1.4.13 — VERIFIED.
17. Orientation lock (manifest/CSS/native) -> portrait-only comfort -> support all -> WCAG 1.3.4 — VERIFIED (manifest case inference).
18. Autoplay carousel/video/parallax with no pause or reduced-motion branch -> marketing motion -> pause control, static/crossfade -> WCAG 2.2.2, 2.3.3, APG carousel, Apple criteria — VERIFIED.
19. Bottom sheet/modal built from divs, background still reachable by VoiceOver/TalkBack -> no inert -> `<dialog>`/`inert`/modal APIs -> Apple VO criteria, MDN inert — VERIFIED.
20. Low-contrast placeholder, disabled-informative, gray-on-black dark mode -> "subtle" style -> 4.5:1/3:1 in all appearances -> WCAG, Apple dark interface — VERIFIED.
21. `type=number` for IDs/phone/codes, no `autocomplete`/`inputmode` -> default input type -> `inputmode`, `autocomplete` -> GOV.UK, WCAG 1.3.5 — VERIFIED.
22. Silent loading/skeleton and silent form success -> visual-only feedback -> polite status text -> WCAG 4.1.3 — VERIFIED.
23. Live region created and filled in the same tick -> dynamic injection -> pre-existing empty region -> MDN — VERIFIED.
24. Labels containing "button"/"checked", hints that repeat the label -> over-description -> use traits/state, short result-hints -> Apple VO criteria, SwiftUI docs — VERIFIED.
25. Tiny icon toolbars with <24 px targets/no spacing -> density -> 44/48 hit areas -> WCAG 2.5.8, HIG, Android — VERIFIED.
(Items 1-25 are classes grounded in WCAG/platform rules; the claim that AI agents commonly produce them is supported only indirectly — see F32.)

## Disagreements & weak-evidence zones
- Target size: 24 (WCAG AA) vs 44 (WCAG AAA/Apple default) vs 28 (Apple "minimum") vs 48 dp (Android) vs 1 cm (NN/g). Use the tiered rule in F3.
- Toast timing: W3C Understanding allows timed messages when info exists elsewhere; Roselli says they fail unless persistent; GOV.UK/Carbon/HIG lean toward avoiding timers.
- `required` / native validation: GOV.UK avoids `required` and uses `novalidate`; WAI/APG practice marks required and uses native validation. Decide per stack; always show required state in text.
- APCA vs WCAG 2 ratio: APCA is not standardised; WCAG 3 contrast algorithm undecided. Use WCAG 2 for gate.
- Dark mode "better for eyes": NN/g found light mode better for normal-vision reading; dark helps some low-vision groups and light-sensitive users; no solid fatigue evidence.
- Landmarks: recommended by W3C, but only 3.4% of screen reader users primarily navigate by them (headings 67.8%): both matter, prioritise headings.
- Reduce Motion path in iOS Settings differs between sources (Motion vs Display & Text Size); don't hard-code UI paths in the skill.
- Usage statistics are app-specific/survey-biased (F27).
- Mobile support for ARIA patterns is not documented by APG; behaviour differs by browser/AT pair.

## Gaps (what you could not verify)
- Search budget was exhausted mid-session; coordinator then stopped research. Not done: prevalence of Reduce Motion, dark mode, Increase Contrast, Voice Control/Switch Control; platform-wide text-size stats (Apple/Google).
- m3.material.io pages (Material 3 accessibility, bottom sheet/snackbar/Expressive guidance) unfetchable; Android Snackbar millisecond durations and Compose `SnackbarHostState` accessible-timeout behaviour are MEMORY.
- BBC Mobile Accessibility Guidelines current text (domain blocked): only the 2014 topic list and BBC GEL numbers via a secondary source.
- aria-modal / live-region / combobox behaviour on iOS VoiceOver and Android TalkBack in mobile browsers (a11ysupport.io fetch empty); Chrome-on-Android system font scale behaviour for rem text; `user-scalable=no` on Android Chrome.
- `performAccessibilityAudit` call, SwiftUI `@ScaledMetric`, RN `allowFontScaling`/`maxFontSizeMultiplier`, Flutter tap target guideline numeric values, HTML `autocomplete="one-time-code"`, `enterkeyhint`: MEMORY.
- WCAG2ICT "CSS pixel" equivalence for pt/dp (used as rule of thumb).
- Legal specifics (EAA date, US ADA rules) MEMORY / unverified.
- No quantitative evidence found on how often AI code generators produce each anti-pattern.
- Not covered in depth: captions/audio description, haptics, speech/dictation UX, CAPTCHAs beyond 3.3.8, haptic-only feedback, Assistive Access app design, tablet/foldable keyboard shortcuts.
