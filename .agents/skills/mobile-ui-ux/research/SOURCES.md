# Source index (auto-extracted from the 12 research slices)

Each section is the 'Sources consulted' table of one slice, copied verbatim from `notes/`. Tiers: T1 official platform/design-system/standards docs; T2 established UX research orgs and recognized practitioners; T3 mature-product case studies; T4 community/essays; T5 inspiration galleries (never evidence). Verification tags: VERIFIED (fetched and states it) / SNIPPET (search excerpt only) / MEMORY (training knowledge, not re-verified). Research date 2026-10-06. The WebSearch budget (200/session, shared) ran out mid-run, so each slice's Gaps section lists what could not be checked.

## 01-platform

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


## 02-accessibility


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



## 03-motion


| URL | Tier | Verified? |
|---|---|---|
| developer.apple.com/design/human-interface-guidelines/motion (JSON `.../motion.json`) | T1 | VERIFIED-R |
| HIG accessibility (JSON), section on fast-moving and blinking animations and Reduce Motion | T1 | VERIFIED-R |
| HIG playing-haptics (JSON) | T1 | VERIFIED-R |
| HIG loading, progress-indicators, launching, sheets, sf-symbols (JSON) | T1 | VERIFIED-R |
| developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass (JSON) | T1 | VERIFIED-R |
| Apple docs JSON: SwiftUI `Animation.smooth/snappy/bouncy` (+`(duration:extraBounce:)`), `spring(response:dampingFraction:)`, `spring(duration:bounce:)`, `interactiveSpring`, `easeInOut`; UIKit `isReduceMotionEnabled`, `prefersCrossFadeTransitions`, `UIView.animate(withDuration:)`, `.allowUserInteraction`, `.beginFromCurrentState`; SwiftUI `accessibilityReduceMotion`, `contentTransition(.numericText)` | T1 | VERIFIED-R |
| WWDC23 10158 "Animate with springs" (transcript) | T1 | VERIFIED-R |
| WWDC23 10156 "Explore SwiftUI animation" | T1 | VERIFIED-F |
| WWDC24 10145 "Enhance your UI animations and transitions" (transcript) | T1 | VERIFIED-R |
| WWDC25 323 "Build a SwiftUI app with the new design" (transcript) | T1 | VERIFIED-R |
| WWDC18 803 "Designing Fluid Interfaces" (transcript) | T1 | VERIFIED-R |
| androidx compose material3 `tokens/MotionTokens.kt`, `StandardMotionTokens.kt`, `ExpressiveMotionTokens.kt`, `MotionScheme.kt`, `MaterialTheme.kt`, `StateTokens.kt`, `Switch.kt`, `Checkbox.kt`, `TabRow.kt`, `Tab.kt`, `PullToRefresh.kt` (raw) | T1 | VERIFIED-R |
| androidx compose animation `EnterExitTransition.kt`, foundation `LazyItemScope.kt`, animation-core `AnimationSpec.kt` (`DefaultDurationMillis=300`), `Easing.kt`, dev reference for `Spring` | T1 | VERIFIED-R |
| androidx `SpringForce.java` (DynamicAnimation constants) | T1 | VERIFIED-R |
| material-components-android: `docs/theming/Motion.md`, `MaterialFade/FadeThrough/SharedAxis/ContainerTransform.java`, `BaseTransientBottomBar.java`, `SnackbarManager.java`, `dimens.xml`, `themes_base.xml` | T1 | VERIFIED-R |
| material-web `tokens/versions/v0_192/_md-sys-motion.scss` | T1 | VERIFIED-R |
| flutter/flutter `material/motion.dart` (Easing, Durations); flutter/packages `animations` (open_container, shared_axis, fade_through, fade_scale) | T1 | VERIFIED-R |
| api.flutter.dev `MediaQueryData.disableAnimations`, `dart:ui AccessibilityFeatures` | T1 | VERIFIED-R |
| m1.material.io `/motion/duration-easing`, `/material-motion`, `/choreography` (raw, `--compressed`) | T1 (legacy M1/M2) | VERIFIED-R |
| developer.android.com `design/ui/mobile/guides/patterns/predictive-back` | T1 | VERIFIED-R |
| developer.android.com `guide/navigation/custom-back/predictive-back-gesture` | T1 | VERIFIED-F |
| developer.android.com `reference/android/animation/ValueAnimator` (`areAnimatorsEnabled`), `Settings.Global` (`ANIMATOR_DURATION_SCALE`) | T1 | VERIFIED-R |
| developer.android.com compose `animation/customize`, spring-animation, haptics `haptic-feedback`, `copy-paste` | T1 | VERIFIED-F |
| nngroup.com/articles/animation-duration, animation-usability, skeleton-screens, response-times-3-important-limits, microinteractions | T2 | VERIFIED-R |
| carbondesignsystem.com `elements/motion/choreography` (raw) and `@carbon/motion` scss (jsdelivr raw) | T1 | VERIFIED-R |
| carbondesignsystem.com `elements/motion/overview` | T1 | VERIFIED-F |
| Shopify/polaris `polaris-tokens/src/themes/base/motion.ts` | T1 | VERIFIED-R |
| microsoft/fluentui `tokens/src/global/durations.ts`, `curves.ts` | T1 | VERIFIED-R |
| atlassian.design/foundations/motion | T1 | VERIFIED-F |
| fluent2.microsoft.design/motion (principles only) | T1 | VERIFIED-F |
| docs.swmansion.com Reanimated `withSpring` (raw) | T1 | VERIFIED-R |
| reactnative.dev `accessibilityinfo`, `animations` | T1 | VERIFIED-F |
| W3C WCAG 2.2 Understanding 2.3.3, 2.2.2, 2.3.1 | T1 | VERIFIED-F |
| MDN `prefers-reduced-motion`, Vibration API | T1 | VERIFIED-F |
| web.dev `animations-guide`, `stick-to-compositor-only-properties-and-manage-layer-count`, `rendering-performance`, `prefers-reduced-motion`, `replace-gifs-with-videos` | T1/T3 | VERIFIED-F |
| alistapart.com "Designing Safer Web Animation For Motion Sensitivity" (Val Head) | T2 | VERIFIED-F |
| lawsofux.com/doherty-threshold | T2 | VERIFIED-F |
| viget.com "A Bone to Pick with Skeleton Screens" | T3 | VERIFIED-F |
| Heer & Robertson 2007 (idl.uw.edu abstract page); Bederson & Boltman 1999 (search results); Tversky et al. 2002 (search results); Chevalier et al. 2016 (project page) | T2 | SNIPPET and abstract-level only. PDFs unreadable here. |
| abookapart.com Animation at Work (Nabors) blurb | T2 | VERIFIED-F, blurb only |
| github.com/Swiss-Activities/ds PR #8 (press 90 ms, scale 0.97/0.98) | T4, product-specific | VERIFIED-F |
| m3.material.io (all pages), android-developers blog on M3 Expressive, uxdesign.cc UX in Motion manifesto | not fetchable (JS shell, 404, 403, ECONNREFUSED) | UNVERIFIED. See Gaps. |



## 04-performance


| URL | Tier | Verified |
|---|---|---|
| https://web.dev/articles/vitals | T1 | VERIFIED (updated 2024-10-31) |
| https://web.dev/articles/inp , /lcp , /cls , /optimize-lcp , /optimize-cls , /optimize-inp , /optimize-input-delay | T1 | VERIFIED |
| https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count | T1 | VERIFIED |
| https://web.dev/articles/animations-guide | T1 | VERIFIED |
| https://web.dev/articles/rendering-performance , /avoid-large-complex-layouts-and-layout-thrashing , /optimize-long-tasks , /rail | T1 | VERIFIED |
| https://web.dev/articles/content-visibility , /dom-size-and-interactivity , /browser-level-image-lazy-loading , /fetch-priority , /font-best-practices , /offline-cookbook , /virtualize-long-lists-react-window , /bfcache , /efficiently-load-third-party-javascript , /why-speed-matters | T1 | VERIFIED |
| https://developer.chrome.com/blog/scrolling-intervention , /300ms-tap-delay-gone-away , /hardware-accelerated-animations | T1 | VERIFIED (300ms post is 2014-era; Safari remark stale) |
| https://developer.chrome.com/docs/web-platform/view-transitions , /prerender-pages | T1 | VERIFIED |
| https://developer.chrome.com/docs/lighthouse/performance/dom-size , /non-composited-animations , /lighthouse-scoring (performance-scoring) | T1 | VERIFIED |
| https://developer.chrome.com/docs/devtools/performance (+ /overview, /reference), /devtools/rendering/performance | T1 | VERIFIED |
| https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/core/animation/README.md | T1 | VERIFIED |
| https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md | T1 | VERIFIED |
| https://raw.githubusercontent.com/web-platform-dx/web-features/main/features/{scroll-driven-animations,view-transitions,content-visibility,contain,backdrop-filter,will-change,loading-lazy,prefers-reduced-transparency}.yml.dist | T1 (Baseline data) | VERIFIED |
| MDN: will-change, touch-action, scheduler.yield, fetchPriority, decoding, contain-intrinsic-size, Save-Data, Network Information API, Speculation Rules, Web Animations API, CSS scroll-driven animations | T1 | VERIFIED |
| https://www.bram.us/2025/11/13/animating-css-width-or-height-no-longer-force-a-main-thread-animation-in-chrome-under-the-right-conditions/ | T3 (Chrome DevRel) | VERIFIED |
| https://infrequently.org/2024/01/performance-inequality-gap-2024/ and /2025/11/performance-inequality-gap-2026/ | T2/T3 (Alex Russell, Microsoft Edge) | VERIFIED |
| https://almanac.httparchive.org/en/2025/performance , /page-weight | T2/T3 | VERIFIED (page-weight summary internally inconsistent on YoY; see Gaps) |
| https://www.deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions.html | T3 (commissioned by Google) | VERIFIED |
| https://developer.android.com/topic/performance/vitals/render , /launch-time , /anr , /jankstats , /issues , /benchmarking/macrobenchmark-overview , /baselineprofiles/overview | T1 | VERIFIED |
| https://developer.android.com/studio/profile/jank-detection ; https://perfetto.dev/docs/ | T1 | VERIFIED |
| https://support.google.com/googleplay/android-developer/answer/9844486 (Android vitals thresholds) | T1 | VERIFIED |
| https://developer.android.com/develop/ui/compose/performance , /performance/bestpractices , /performance/stability , /phases , /lists , /performance/tooling , /graphics/draw/modifiers , /animation/introduction | T1 | VERIFIED |
| https://developer.android.com/topic/performance/rendering/overdraw ; /graphics/load-bitmap ; /graphics/manage-memory ; /media/optimize/performance/frame-rate ; /power ; /develop/background-work/background-tasks ; /topic/architecture/data-layer/offline-first ; /develop/ui/views/launch/splash-screen ; /theming/darktheme | T1 | VERIFIED |
| https://chrisbanes.me/posts/compose-progressive-blur/ | T3 (Android GDE, Haze author) | VERIFIED |
| https://developer.apple.com/tutorials/data/documentation/quartzcore/optimizing-iphone-and-ipad-apps-to-support-promotion-displays.json | T1 | VERIFIED (raw JSON) |
| https://developer.apple.com/tutorials/data/documentation/xcode/understanding-hitches-in-your-app.json , /understanding-hangs-in-your-app.json , /understanding-and-improving-swiftui-performance.json , /reducing-your-app-s-launch-time.json | T1 | VERIFIED (raw JSON) |
| https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{loading,progress-indicators,launching,materials,motion}.json | T1 | VERIFIED (raw JSON) |
| Apple docs JSON: swiftui/view/offset(x:y:), drawinggroup, lazyvstack, migrating-from-the-observable-object-protocol-to-the-observable-macro; quartzcore/cadisplaylink | T1 | VERIFIED |
| https://developer.apple.com/videos/play/wwdc2023/10160/ (Demystify SwiftUI performance) ; /wwdc2018/416/ (iOS Memory Deep Dive) | T1 | VERIFIED (transcript summary) |
| https://developer.apple.com/library/archive/.../CoreAnimation_guide/ImprovingAnimationPerformance/ | T1 (archived) | VERIFIED |
| https://docs.flutter.dev/perf/ui-performance , /perf/best-practices , /perf/impeller (raw HTML re-fetched), /perf/rendering-performance , /tools/devtools/performance ; api.flutter.dev BackdropFilter | T1 | VERIFIED |
| https://reactnative.dev/docs/performance , /optimizing-flatlist-configuration , /profiling , /animations ; blog 0.82, 0.83, 0.84, 0.85 | T1 | VERIFIED (docs landing page for New Arch is stale vs blog) |
| https://shopify.github.io/flash-list/docs/ , /v2-migration/ | T1 (library docs) | VERIFIED |
| https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary/ | T1 | VERIFIED |
| https://react.dev/reference/react/useTransition , /useOptimistic , /learn/react-compiler | T1 | VERIFIED (compiler status not stated in fetched text) |
| https://www.nngroup.com/articles/response-times-3-important-limits/ , /progress-indicators/ , /skeleton-screens/ , /website-response-times/ , /infinite-scrolling-tips/ | T2 | VERIFIED |
| https://lawsofux.com/doherty-threshold/ | T2/T4 | VERIFIED |
| https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens/ | T3 | VERIFIED |
| Mejtoft et al., ECCE 2018 "The effect of skeleton screens" (dl.acm.org 10.1145/3232078.3232086) | T2 | SNIPPET (ACM returned 403) |
| Harrison et al., UIST 2007 "Rethinking the progress bar" | T2 | SNIPPET (search excerpt) |
| https://www.lukew.com/ff/entry.asp?1797 | T2/T3 | VERIFIED |
| https://www.sciencedaily.com/releases/2021/07/210729122156.htm (Purdue dark-mode study; paper doi 10.1145/3458864.3467682) | T2 (secondary of peer-reviewed) | VERIFIED via press summary |
| Android Dev Summit 2019 dark-theme claims (up to ~63% at max brightness) | T3 | SNIPPET only |
| Liquid Glass battery/GPU figures (BGR, MacRumors, ithinkdiff, Medium) | T4/T5 | SNIPPET — NOT used as evidence |
| https://csstriggers.com | T4 | fetched, looked outdated/inconsistent — NOT used |



## 05-navigation-gestures-touch-ia


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



## 06-forms-input-auth


| URL | Tier | Verified? |
|---|---|---|
| https://web.dev/learn/forms (chapters: form-fields, design-basics, auto, validation, identity, payment, address, internationalization, autofill) | T1 | VERIFIED |
| https://web.dev/articles/sign-in-form-best-practices ; /sign-up-form-best-practices | T1 | VERIFIED |
| https://web.dev/articles/payment-and-address-form-best-practices | T1 | VERIFIED |
| https://web.dev/articles/sms-otp-form ; https://developer.mozilla.org/en-US/docs/Web/API/WebOTP_API | T1 | VERIFIED |
| https://web.dev/articles/passkey-form-autofill ; /passkey-registration ; https://developer.chrome.com/docs/identity/webauthn-conditional-create | T1 | VERIFIED |
| https://web.dev/blog/viewport-units ; https://developer.chrome.com/blog/viewport-resize-behavior | T1 | VERIFIED |
| https://web.dev/articles/bfcache | T1 | VERIFIED |
| MDN: autocomplete, inputmode, enterkeyhint, autocapitalize, autocorrect, spellcheck, autofocus, input/number, /date, /email, /url, /search, /tel, /password, /file, VisualViewport, VirtualKeyboard_API, env(), meta viewport, :user-invalid, beforeunload, requestSubmit, Payment_Request_API | T1 | VERIFIED |
| https://design-system.service.gov.uk/ : text-input, error-message, error-summary, validation, date-input, password-input, select, radios, button, character-count, file-upload; patterns: question-pages, passwords, addresses, telephone-numbers, email-addresses, names, check-answers, complete-multiple-tasks, create-accounts, confirm-a-phone-number, confirm-an-email-address, confirmation-pages | T2 | VERIFIED |
| https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/ | T2 | VERIFIED |
| https://github.com/alphagov/accessible-autocomplete | T2 | VERIFIED |
| https://baymard.com/blog/checkout-flow-average-form-fields (26 Jun 2024) ; /inline-form-validation ; /mobile-forms-avoid-inline-labels ; /checkout-flow-ux-optimization ; /research-articles/current-state-of-checkout-ux ; /lists/cart-abandonment-rate | T2 | VERIFIED (paywalled parts not seen) |
| https://www.nngroup.com/articles/ : form-design-placeholders, errors-forms-design-guidelines, required-fields, 4-principles-reduce-cognitive-load, web-form-design, mobile-input-checklist, date-input, toggle-switch-guidelines, gui-slider-controls, stop-password-masking, confirmation-dialog, progress-indicators, wizards, response-times-3-important-limits | T2 | VERIFIED |
| https://alistapart.com/article/inline-validation-in-web-forms/ (Wroblewski/Etre 2009) ; https://www.lukew.com/ff/entry.asp?883= | T2 | VERIFIED |
| https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php (Penzo) ; .../2013/02/dont-put-labels-inside-text-boxes-unless-youre-luke-w.php (Jarrett) | T2 | VERIFIED |
| https://www.lukew.com/ff/entry.asp?1950= (dropdown alternatives) ; https://www.lukew.com/ff/687/web-form-design-labels-within-inputs | T2 | VERIFIED |
| https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/ ; /2017/06/designing-efficient-web-forms/ | T3/T4 | VERIFIED |
| https://adamsilver.io/blog/the-problem-with-disabled-buttons-and-what-to-do-instead/ | T4 | VERIFIED |
| https://www.w3.org/International/questions/qa-personal-names | T1 | VERIFIED |
| https://www.w3.org/WAI/GL/low-vision-a11y-tf/wiki/Placeholder_Research | T1/T2 | VERIFIED |
| https://www.w3.org/TR/WCAG22/ ; Understanding pages for 1.3.5, 2.2.1, 2.2.5, 2.5.3, 2.5.8, 3.2.6, 3.3.1, 3.3.3, 3.3.4, 3.3.6, 3.3.7, 3.3.8, 4.1.3 ; https://www.w3.org/WAI/tutorials/forms/notifications/ , /labels/ | T1 | VERIFIED |
| https://www.w3.org/TR/wcag-3.0/ (Working Draft 10 Sep 2026) | T1 | VERIFIED |
| https://pages.nist.gov/800-63-4/sp800-63b.html (+ /passwords/) | T1 | VERIFIED |
| https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html | T2 | VERIFIED |
| Apple HIG JSON: text-fields, entering-data, toggles, pickers, steppers, alerts, action-sheets, undo-and-redo, managing-accounts, sign-in-with-apple, privacy, onboarding, searching, loading, apple-pay | T1 | VERIFIED (text-fields page last updated Jun 2023, entering-data Jun 2023; see Gaps) |
| Apple docs JSON: UITextContentType, UIKeyboardType, UITextInputTraits, enablesReturnKeyAutomatically, keyboardLayoutGuide, SafeAreaRegions, safeAreaInset, scrollDismissesKeyboard, SubmitLabel, textContentType, textInputAutocapitalization, interactiveDismissDisabled, supporting-passkeys, password-autofill workflow, captureTextFromCamera; https://developer.apple.com/password-rules/ ; App Review Guidelines 4.8, 5.1.1 | T1 | VERIFIED |
| developer.android.com: autofill-optimize, compose/text/autofill, keyboard-input/style, compose/text/user-input, sw-keyboard, compose/system/insets, permissions/requesting + usage-notes, photopicker, sms-retriever, credential-manager (+siwg), biometric-auth, predictive-back, activity-lifecycle (state), compose snackbar, datepickers | T1 | VERIFIED |
| https://github.com/material-components/material-components-android/blob/master/docs/components/TextField.md ; material-web text-field.md | T1 | VERIFIED |
| m3.material.io text-fields (guidelines/overview) | T1 | NOT FETCHABLE (JS shell / ECONNREFUSED) |
| https://reactnative.dev/docs/textinput, /keyboardavoidingview, /scrollview | T1 | VERIFIED |
| Flutter API docs: TextInputType, AutofillGroup, AutofillHints, Scaffold.resizeToAvoidBottomInset, FormField.autovalidateMode, ScrollViewKeyboardDismissBehavior, PopScope; docs.flutter.dev cookbook/forms/validation, ui/interactivity/focus | T1 | VERIFIED |
| https://www.passkeycentral.org/design-guidelines/principles (FIDO UX WG) ; https://developers.google.com/identity/passkeys/ux/user-journeys ; /case-studies | T1/T3 | VERIFIED |
| https://developers.google.com/pay/api/web/guides/ux-best-practices | T3 | VERIFIED |
| https://docs.stripe.com/api/idempotent_requests ; IETF draft-ietf-httpapi-idempotency-key-header (expired draft) | T3/T1 | VERIFIED |
| passkey/adoption blogs (authsignal, corbado, mojoauth, etc., via search) | T4 | SNIPPET, low trust, not used for numbers |

Note: the Stripe docs page contained an agent-directed "install our CLI / run agent setup" block unrelated to the task. Treated as page content, not instructions; ignored.



## 07-states-feedback-writing


| URL | Tier | Verified |
|---|---|---|
| https://www.nngroup.com/articles/response-times-3-important-limits/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/skeleton-screens/ ("Skeleton Screens 101", reviewed Sep 2 2026) | T2 | VERIFIED (raw HTML) |
| https://www.nngroup.com/articles/progress-indicators/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/designing-for-waits-and-interruptions/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/error-message-guidelines/ , /error-messages-scoring-rubric/ , /hostile-error-messages/ , /errors-forms-design-guidelines/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/empty-state-interface-design/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/confirmation-dialog/ , /modal-nonmodal-dialog/ , /popups/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/permission-requests/ , /push-notification/ , /status-tracker-progress-update/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/indicators-validations-notifications/ , /cart-feedback/ , /animation-duration/ , /3-cs-microcopy/ , /ux-writing-faqs/ | T2 | VERIFIED |
| https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens | T3 | VERIFIED |
| Mejtoft et al. 2018 (DOI 10.1145/3232078.3232086), abstract via Semantic Scholar API | T2 (peer-reviewed) | VERIFIED (abstract only) |
| https://baymard.com/research-articles/no-results-page , /credit-card-declined , /inline-form-validation , /adaptive-validation-error-messages | T2 (e-commerce context) | VERIFIED |
| https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{loading,progress-indicators,alerts,writing,feedback,notifications,privacy,playing-haptics,undo-and-redo,ratings-and-reviews,offering-help,entering-data,right-to-left,inclusion,live-activities}.json | T1 | VERIFIED (via summarizer) |
| https://developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications (JSON) and generating-a-remote-notification | T1 | VERIFIED (raw JSON) |
| Apple docs JSON: AccessibilityNotification.Announcement, UIApplication.openSettingsURLString, SwiftUI RedactionReasons.placeholder | T1 | VERIFIED (raw JSON) |
| https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/{Snackbar,LoadingIndicator,ProgressIndicator,Dialog,Banner}.md | T1 | VERIFIED |
| MCA source: snackbar/SnackbarManager.java, BaseTransientBottomBar.java, Snackbar.java | T1 | VERIFIED (raw) |
| AndroidX source: ContentLoadingProgressBar.java; compose material3 SnackbarHost.kt, Snackbar.kt, LoadingIndicator.kt; AOSP NotificationManagerService.java (Toast delays) | T1 | VERIFIED (raw) |
| https://m1.material.io/patterns/empty-states.html , /patterns/errors.html (legacy Material 1) | T1 (legacy) | VERIFIED |
| https://github.com/material-components/material-components-web/.../mdc-banner/README.md (M2 banner) | T1 (legacy) | VERIFIED |
| m3.material.io (snackbar, loading indicator, progress indicators), m2.material.io | T1 | NOT FETCHABLE (JS shell / connection refused); only SNIPPETs |
| developer.android.com: requesting permissions, permissions usage notes, notification-permission, notifications (compose), build-notification, toasts, offline-first, swipe refresh, compose pull-to-refresh, haptics principles, in-app review, progress-centric notifications (Android 16), string-resource | T1 | VERIFIED |
| https://carbondesignsystem.com/patterns/{empty-states-pattern,loading-pattern,notification-pattern,status-indicator-pattern}/ , /components/notification/usage/ , /components/inline-loading/usage/ | T1 | VERIFIED |
| Polaris (Shopify) MDX read raw from github.com/Shopify/polaris main: empty-state, error-messages, banner, spinner, toast (internal), grammar-and-mechanics, fundamentals, inclusive-language | T1 | VERIFIED (raw) |
| https://atlassian.design/components/{empty-state,flag,banner}/usage ; /foundations/content/designing-messages/ , /error-messages , /success-messages | T1 | VERIFIED |
| https://design-system.service.gov.uk/components/{error-message,error-summary,notification-banner,button}/ ; /patterns/{validation,page-not-found-pages,problem-with-the-service-pages}/ | T1/T2 | VERIFIED |
| https://primer.style/product/ui-patterns/{loading,notification-messaging,degraded-experiences,saving,empty-states}/ ; /accessibility/patterns/accessible-notifications-and-messages/ | T1 | VERIFIED (loading: raw HTML) |
| https://styleguide.mailchimp.com/{voice-and-tone,writing-principles,web-elements,writing-for-translation}/ | T2 | VERIFIED (web-elements gave only button guidance) |
| https://learn.microsoft.com/en-us/windows/win32/debug/error-message-guidelines ; style-guide: sorry, writing-tips (global), brand-voice | T1 | VERIFIED (raw) |
| https://developers.google.com/style/capitalization , /ui-elements (Google dev docs style guide) | T1 | VERIFIED |
| W3C WCAG 2.2 Understanding: 2.2.1, 2.2.2, 2.2.6, 3.3.1, 3.3.3, 3.3.4, 3.3.7, 4.1.3 | T1 | VERIFIED |
| https://www.w3.org/WAI/GL/wiki/Notification_of_Loading/Busy | T1 (proposal, not WCAG 2.2) | VERIFIED |
| MDN: role=status, aria-busy, Retry-After, Intl.RelativeTimeFormat, PWA offline/background | T1 | VERIFIED |
| https://web.dev/articles/{lcp-lazy-loading,stale-while-revalidate,prefers-reduced-motion} ; https://react.dev/reference/react/{Suspense,useOptimistic} | T1/T3 | VERIFIED |
| https://learn.microsoft.com/azure/architecture/patterns/retry | T1/T3 | VERIFIED (raw) |
| https://cldr.unicode.org/index/cldr-spec/plural-rules ; https://www.w3.org/International/articles/article-text-size.en | T1 | VERIFIED |
| https://alistapart.com/article/neveruseawarning/ (Raskin) ; https://support.google.com/mail/answer/2819488 ; https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials | T3/T1 | VERIFIED |
| https://adrianroselli.com/2020/01/defining-toast-messages.html | T4 (recognized a11y practitioner) | VERIFIED |
| Blog posts on spinner delay (pencilandpaper.io, boldist.co, eleken.co etc.) | T4 | SNIPPET only |
| AWS Builders Library (timeouts/retries/jitter), Stripe error-handling, Flutter snackbar.dart, blurhash README, FCM size doc | T1/T3 | FAILED to load (404 / JS shell / empty) |



## 08-design-systems-tokens-dark

| ID | URL (abbrev.) | Tier | Verified |
|---|---|---|---|
| S1 | https://www.designtokens.org/tr/2025.10/format/ (Format Module) | T1 | VERIFIED |
| S2 | https://www.designtokens.org/tr/2025.10/color/ ; /resolver/ (S3) | T1 | VERIFIED |
| S4 | https://www.designtokens.org/ (status) ; /tr/drafts/format/ (next draft) | T1 | VERIFIED |
| S5 | https://styledictionary.com/info/dtcg/ ; /reference/hooks/{transform-groups,transforms,formats}/predefined/ ; /reference/config/ | T1 | VERIFIED |
| S6 | https://terrazzo.app/docs/ | T1 | VERIFIED |
| S7 | developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json | T1 | VERIFIED |
| S8 | .../color.json ; S9 .../dark-mode.json ; S10 .../materials.json ; S11 .../accessibility.json ; S12 .../layout.json ; S13 .../buttons.json ; S14 .../toolbars.json ; S15 .../sf-symbols.json + icons.json | T1 | VERIFIED |
| S16 | https://developer.apple.com/videos/play/wwdc2025/356/ ; .../documentation/technologyoverviews/adopting-liquid-glass (JSON) | T1 | VERIFIED |
| S17 | raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/{tokens/StateTokens,ElevationTokens,ShapeTokens,MotionTokens,TypeScaleTokens,ColorSchemeKeyTokens,PaletteTokens,ColorDarkTokens,FilledButtonTokens,OutlinedTextFieldTokens,NavigationBarTokens}.kt ; ColorScheme.kt ; InteractiveComponentSize.kt | T1 (source of truth) | VERIFIED |
| S18 | github.com/material-components/material-web docs/theming/{README,color,typography,shape}.md | T1 | VERIFIED |
| S19 | github.com/material-foundation/material-color-utilities (README; typescript/hct/hct.ts, contrast/contrast.ts, palettes/core_palette.ts, dynamiccolor/color_spec_2021.ts) | T1 | VERIFIED |
| S20 | material-components-android .../elevation/ElevationOverlayProvider.java | T1 | VERIFIED |
| S21 | https://developer.android.com/develop/ui/compose/designsystems/{material3,custom} ; /develop/ui/compose/layouts/adaptive/use-window-size-classes | T1 | VERIFIED |
| S22 | https://developer.android.com/develop/ui/views/theming/darktheme | T1 | VERIFIED |
| S23 | https://developer.android.com/about/versions/14/features (non-linear font scaling) | T1 | VERIFIED |
| S24 | https://developer.android.com/design/ui/mobile/guides/layout-and-content/{grids-and-units,layout-basics} ; /styles/themes ; /guide/topics/ui/accessibility/principles | T1 | VERIFIED |
| S25 | https://m2.material.io/design/color/dark-theme.html ; /text-legibility.html | T1 | PARTIAL (fetch returned only headline facts; overlay % table not captured) |
| S26 | https://design.google/library/expressive-material-design-google-research | T1 (vendor research) | VERIFIED |
| S27 | composables.com MaterialExpressiveTheme API ; M3 Expressive web-search snippets | T3 | VERIFIED / SNIPPET |
| S28 | api.flutter.dev (ThemeExtension, ColorScheme.fromSeed, VisualDensity, MaterialTapTargetSize); docs.flutter.dev/release/breaking-changes/material-color-utilities | T1 | VERIFIED |
| S29 | https://reactnative.dev/docs/appearance | T1 | VERIFIED |
| S30 | carbondesignsystem.com/elements/{spacing,typography/type-sets,themes,color,2x-grid,icons/usage,motion}/... ; unpkg.com/@carbon/themes/scss/generated/_themes.scss (real token hex) | T1 | VERIFIED |
| S31 | unpkg.com/@shopify/polaris-tokens/dist/css/styles.css (values; version unspecified) ; github.com/Shopify/polaris-react-archive/discussions/6613 | T1/T3 | VERIFIED (names not captured). polaris-react.shopify.com now 301s to shopify.dev web-components docs |
| S32 | atlassian.design/foundations/{spacing,tokens/design-tokens,elevation,color,typography} ; /components/tokens/all-tokens | T1 | VERIFIED |
| S33 | fluent2.microsoft.design/{typography,design-tokens,layout,shapes,motion} | T1 | VERIFIED |
| S34 | https://spectrum.adobe.com/page/design-tokens | T1 | VERIFIED (color-system, platform-scale pages 404) |
| S35 | Salesforce Lightning density (search snippet + SLDS2 page, empty) | T1/T3 | SNIPPET |
| S36 | radix-ui.com/colors/docs/palette-composition/* ; /themes/docs/theme/{color,spacing} ; unpkg.com/@radix-ui/themes/tokens/base.css ; /primitives/docs/overview/introduction | T1 | VERIFIED |
| S37 | design-system.service.gov.uk/styles/{spacing,type-scale}/ | T1/T2 | VERIFIED |
| S38 | https://primer.style/product/primitives/size | T1 | VERIFIED |
| S39 | https://unpkg.com/open-props/open-props.min.css | T1 (OSS) | VERIFIED |
| S40 | tailwindcss.com/docs/{theme,responsive-design,box-shadow,font-size,border-radius,z-index} | T1 | VERIFIED |
| S41 | ui.shadcn.com/docs/{theming,tailwind-v4} ; S42 getbootstrap.com/docs/5.3/layout/breakpoints/ | T1 | VERIFIED |
| S43 | w3.org/WAI/WCAG22/Understanding/{contrast-minimum,non-text-contrast,target-size-minimum,focus-appearance,text-spacing,visual-presentation,resize-text,use-of-color} ; w3.org/WAI/standards-guidelines/wcag/ ; w3.org/TR/wcag-3.0/ | T1 | VERIFIED |
| S44 | developer.mozilla.org: color-scheme, light-dark(), meta theme-color, prefers-contrast, prefers-reduced-transparency, font-variant-numeric, line-clamp, font-family | T1 | VERIFIED |
| S45 | https://web.dev/articles/prefers-color-scheme | T1/T3 | VERIFIED |
| S46 | https://www.nngroup.com/articles/dark-mode/ | T2 | VERIFIED |
| S47 | https://www.nngroup.com/articles/design-systems-101/ | T2 | VERIFIED |
| S48 | https://baymard.com/blog/line-length-readability | T2 | VERIFIED |
| S49 | https://pubmed.ncbi.nlm.nih.gov/16913943/ (Bar & Neta 2006) | T2 | VERIFIED (abstract summary) |
| S50 | Purdue/MobiSys 2021 OLED dark-mode power (via search result summary) | T2 | SNIPPET |
| S51 | Piepenbrock 2013 / Dobres 2017 (via NN/g S46 + search summary) | T2 | SNIPPET (original), VERIFIED (as cited by NN/g) |
| S52 | noahgilmore.com/blog/dark-mode-uicolor-compatibility ; sarunw.com/posts/dark-color-cheat-sheet/ (iOS 13 system color hex extracted) | T3/T4 | VERIFIED (third-party extraction; not Apple-published; iOS 26 values may differ) |
| S53 | css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/ (search snippet) | T3 | SNIPPET |
| S54 | https://help.figma.com/hc/en-us/articles/15339657135383 (variables) | T1 | VERIFIED |
| S55 | developer.apple.com/documentation/swiftui/{environmentvalues,color} | T1 | VERIFIED (ScaledMetric page returned nothing -> MEMORY) |
| S56 | https://developers.google.com/fonts/docs/material_symbols | T1 | VERIFIED |


## 09-dense-responsive-pwa


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



## 10-components-overlays

| ID | URL / slug | Tier | Tag |
|---|---|---|---|
| HIG | base above; slugs fetched: sheets, alerts, action-sheets, buttons, tab-bars, segmented-controls, lists-and-tables, pickers, toggles, menus, onboarding, searching, search-fields, modality, charts, steppers, sliders, text-fields, toolbars, context-menus, pull-down-buttons, popovers, page-controls, progress-indicators, collections, privacy, launching, entering-data, materials, gestures, managing-accounts. 404: navigation-bars, badging, refresh-content-controls | T1 | VERIFIED |
| UIKit-sheet | https://developer.apple.com/tutorials/data/documentation/uikit/uisheetpresentationcontroller.json | T1 | VERIFIED |
| MDC | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/{BottomSheet,Dialog,FloatingActionButton,Snackbar,BottomNavigation,Card,Chip,DatePicker,Tabs,Carousel,Menu,Slider,TopAppBar,BottomAppBar,NavigationDrawer,SideSheet,Search,Switch,List}.md (Tooltip=stub; Badge 404; Button=index only) | T1 | VERIFIED |
| M3-tokens | https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/<X>Tokens.kt (Button{XSmall,Small,Medium,Large,XLarge}, Fab{Large,Medium}, ExtendedFabPrimary, NavigationBar, List, Switch, Checkbox, FilterChip, Badge, Snackbar, SearchBar, AppBarSmall, BottomAppBar, DragHandle, Dialog) | T1 (code) | VERIFIED |
| M3-snip | m3.material.io/components/{buttons,dialogs,cards,lists,bottom-sheets,floating-action-button}/guidelines + buttons/specs (search excerpts only) | T1 | SNIPPET |
| M3-droid | developer.android.com/develop/ui/compose/components/{dialog,bottom-sheets,snackbar,fab,segmented-button,badges,pull-to-refresh}; /training/permissions/requesting; /design/ui/mobile/guides/patterns/predictive-back | T1 | VERIFIED |
| M3E-research | https://design.google/library/expressive-material-design-google-research | T1 (vendor claim) | VERIFIED |
| M1 | https://m1.material.io/components/{dialogs,lists,snackbars-toasts,bottom-sheets,buttons,cards,chips,buttons-floating-action-button,steppers,tabs,bottom-navigation,menus,pickers,selection-controls}.html ; /patterns/{selection,swipe-to-refresh}.html | T1 legacy | VERIFIED |
| GOVUK | https://design-system.service.gov.uk/components/{button,date-input,select,radios,checkboxes,accordion,pagination,notification-banner,tabs,details}/ ; /patterns/dates/ ; raw govuk-frontend button/_mixin.scss | T2 | VERIFIED |
| Carbon | https://carbondesignsystem.com/components/{button,dropdown,modal,notification,toggle,tabs,radio-button,tooltip}/usage/ ; /data-visualization/{chart-anatomy,color-palettes,simple-charts,dashboards,chart-types}/ ; /patterns/empty-states-pattern/ | T1 | VERIFIED |
| Atlassian | https://atlassian.design/components/{button,modal-dialog,banner,flag,tooltip,avatar,avatar/examples,badge,toggle,tabs}/usage | T1 | VERIFIED |
| Fluent | https://fluent2.microsoft.design/components/web/react/core/{button,dialog,toast,drawer,messagebar}/usage (iOS pages 404) | T1 | VERIFIED |
| Spectrum | https://react-spectrum.adobe.com/react-spectrum/{AlertDialog,Dialog,Toast,Picker}.html (spectrum.adobe.com/page/* 404) | T1 | VERIFIED |
| Polaris | https://shopify.dev/docs/api/app-home/polaris-web-components/feedback-and-status-indicators/banner (polaris.shopify.com now redirects) | T1 | VERIFIED (banner only) |
| Lightning | v1.lightningdesignsystem.com/components/modals/ (blueprint only, no guidance) | T1 | VERIFIED (useless) |
| NNg | nngroup.com/articles/{bottom-sheet,modal-nonmodal-dialog,designing-effective-carousels,auto-forwarding,infinite-scrolling-tips,mobile-tutorials,mobile-app-onboarding,icon-usability,cards-component,confirmation-dialog,toggle-switch-guidelines,tooltip-guidelines,tabs-used-right,date-input,dropdown-list,mobile-accordions,mobile-navigation-patterns,radio-buttons-default-selection,contextual-swipe,flat-ui-less-attention-cause-uncertainty,liquid-glass,hamburger-menus,progressive-disclosure,search-visible-and-simple,wizards,aesthetic-usability-effect,ten-usability-heuristics,mobile-faceted-search,dashboards-preattentive}/ | T2 | VERIFIED |
| NNg-snip | nngroup.com/articles/{checkboxes-vs-radio-buttons,accordions-on-desktop}/ (search excerpt) | T2 | SNIPPET |
| Baymard | baymard.com/blog/{homepage-carousel,return-same-place,number-of-items-loaded-by-default,autocomplete-design} ; /research-articles/{mobile-ux-ecommerce,mobile-app-ux-trends,mobile-ecommerce-search-and-navigation,horizontal-filtering-sorting-design,slider-interfaces,back-button-expectations,current-state-product-list-and-filtering,collections/product-list} | T2 | VERIFIED |
| Smashing | https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/ (reports Baymard tests) | T2/T3 | VERIFIED |
| WCAG | w3.org/WAI/WCAG22/Understanding/{non-text-contrast,status-messages,timing-adjustable,target-size-minimum,dragging-movements,pointer-gestures}.html | T1 | VERIFIED |
| APG/WAI | w3.org/WAI/ARIA/apg/patterns/dialog-modal/ ; w3.org/WAI/tutorials/{carousels,images/complex}/ | T1 | VERIFIED |
| MDN | developer.mozilla.org/en-US/docs/Web/{HTML/Reference/Elements/input/date,HTML/Reference/Elements/dialog,API/Popover_API,CSS/overscroll-behavior} | T1 | VERIFIED |
| Other | inclusive-components.design/cards/ (T3) ; chartability.fizz.studio (T3) ; web.dev/articles/sign-in-form-best-practices (T1) | | VERIFIED |


## 11-product-benchmarks


| URL | Tier | Verified? |
|---|---|---|
| https://base.uber.com/6d2425e9f/p/033e0d-sheet (Uber Base: Sheet) | T1 | VERIFIED (via Browser pane) |
| https://zeroheight.com/6d2425e9f/p/775209/t/929946 (Uber Base: Dialog, incl. "Dialog versus sheet?") | T1 | VERIFIED |
| https://base.uber.com/6d2425e9f/p/65ae6d (Uber Base: States) | T1 | VERIFIED |
| https://m3.material.io/components/bottom-sheets/guidelines | T1 | VERIFIED (Browser pane) |
| https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{sheets,tab-bars,gestures,managing-accounts,apple-pay,wallet,notifications,charting-data,playing-audio}.json | T1 | VERIFIED |
| https://www.sap.com/design-system/fiori-design-ios/v26-4/{discover/sap-design-system, patterns/navigation, patterns/modality, page-types/list-report, patterns/sort-and-filter/filter-overview, components/progress-indicators/skeleton-loading, patterns/authentication/biometric-authentication} | T1 | VERIFIED (Browser pane) |
| https://developer.salesforce.com/docs/platform/mobile-offline/guide/ux-a11y.html | T1 | VERIFIED (Browser pane) |
| https://developer.android.com/identity/sign-in/biometric-auth | T1 | VERIFIED |
| https://www.w3.org/WAI/WCAG22/Understanding/{pointer-gestures,dragging-movements}.html | T1 | VERIFIED |
| https://digital-strategy.ec.europa.eu/en/news/commission-preliminarily-finds-tiktoks-addictive-design-breach-digital-services-act | T1 (regulator) | VERIFIED |
| https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers | T1 (regulator) | VERIFIED (press release; full PDF unreadable) |
| https://faq.whatsapp.com/665923838265756 (read receipts / check marks; page served in Indonesian) | T1 (company) | VERIFIED (Browser pane) |
| https://blog.whatsapp.com/introducing-instant-video-messages | T3 | VERIFIED |
| https://www.notion.com/help/workspaces-on-mobile ; /help/writing-and-editing-basics | T1 (company docs) | VERIFIED |
| https://support.google.com/mail/answer/2819488 (Gmail undo send) | T1 (company docs) | VERIFIED |
| https://support.microsoft.com/en-us/accessibility/teams/use-a-screen-reader-to-explore-and-navigate-microsoft-teams | T1 (company docs) | VERIFIED |
| https://telegram.org/blog/telegram-5-ios | T3 | VERIFIED (describes swipe actions; macOS section) |
| https://linear.app/changelog/2024-09-19-introducing-linear-mobile ; /changelog/2025-10-16-mobile-app-redesign ; /now/linear-liquid-glass ; /now/behind-the-latest-design-refresh | T3 | VERIFIED |
| https://github.com/wzhudev/reverse-linear-sync-engine | T4 (community reverse engineering of Linear web client) | VERIFIED as a description, not as Linear's statement |
| https://9to5mac.com/2020/05/11/slack-ios-major-update-bottom-bar-ui/ ; https://designcompass.org/en/2023/08/14/slack-redesign/ ; Engadget Slack 2023 article | T4 (relay Slack statements) | VERIFIED |
| https://monzo.com/blog/how-we-unified-our-customers-activity-on-the-new-home-screen ; /blog/2018/02/15/android-crowdsourcing-merchant-data | T3 | VERIFIED |
| https://www.lyssna.com/blog/fee-transparency-ux-wise-vs-revolut/ | T4 (vendor study, n=20) | VERIFIED |
| https://baymard.com/blog/{mobile-commerce-design, current-state-product-list-and-filtering, how-to-design-applied-filters, responsive-upscaling, ecommerce-ux-best-practices, grocery-add-to-cart-buttons} ; /research-articles/current-state-ecommerce-product-page-ux | T2 | VERIFIED |
| https://www.nngroup.com/articles/bottom-sheet/ ; /articles/infinite-scrolling-tips/ ; /articles/infinite-scrolling/ | T2 | VERIFIED |
| https://shopify.engineering/back-to-native (Sep 2026) | T3 | VERIFIED |
| https://www.uber.com/us/en/blog/new-rider-app-architecture/ ; https://www.uber.com/us/en/u/redesigned-uber-app/ | T3 | VERIFIED |
| https://news.airbnb.com/2022-summer-release/ | T3 | VERIFIED |
| https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth ; /p/behind-the-product-duolingo-streaks ; https://blog.duolingo.com/how-duolingo-streak-builds-habit | T3 | VERIFIED |
| https://blog.classdojo.com/introducing-classdojo-translate/ | T3 (vendor claims) | VERIFIED |
| https://www.infoq.com/news/2023/09/reddit-feed-server-driven-ui ; TechCrunch 2024-04-24 Reddit comment navigation | T3/T4 | VERIFIED |
| https://culturedcode.com/things/support/articles/9780167/ ; https://www.todoist.com/inspiration/add-tasks-todoist | T1 (company docs) | VERIFIED |
| https://netflix about page "Downloading on Netflix just got smarter" | T1 | VERIFIED (Wi-Fi/storage specifics not in fetched text) |
| https://9to5google.com/2025/12/27/recap-material-3-expressive/ ; idownloadblog YouTube miniplayer 2025 | T4 | VERIFIED |
| https://commitconsulting.com/blog/workday-my-tasks-inbox | T4 (vendor-affiliated consultancy) | VERIFIED |
| https://www.deceptive.design/types | T2/T4 (practitioner taxonomy) | VERIFIED |
| Search snippets only: Airbnb mobile-web (Medium), Gmail swipe customization, Spotify mini-player 2021, WhatsApp voice lock, Telegram voice lock, Netflix Downloads for You (1/3/5 GB), Workday mobile QRG PDFs, Wise Neptune (55 components) | T4 | SNIPPET |
| Not readable: docs.wise.design/wise.design docs (redirect to 404), medium.com (403), Slack engineering (404), FTC PDF (binary), faq voice-message page (empty) | - | NOT FETCHED |



## 12-psychology-antipatterns

| URL | Tier | Verified |
|---|---|---|
| https://lawsofux.com/hicks-law/ , /millers-law/ , /doherty-threshold/ , /serial-position-effect/ , /von-restorff-effect/ , /zeigarnik-effect/ , /peak-end-rule/ , /teslers-law/ , /postels-law/ , /parkinsons-law/ , /cognitive-load/ , /aesthetic-usability-effect/ , /goal-gradient-effect/ , /jakobs-law/ , /fittss-law/ | T4 (curated summaries, good citations) | VERIFIED (note: lawsofux says nothing on replication problems for Zeigarnik/peak-end) |
| https://en.wikipedia.org/wiki/Fitts%27s_law ; /Hick%27s_law ; /The_Magical_Number_Seven,_Plus_or_Minus_Two ; /Serial-position_effect ; /Von_Restorff_effect ; /Peak%E2%80%93end_rule ; /Cognitive_load ; /Principles_of_grouping ; /The_Design_of_Everyday_Things ; /Ego_depletion ; /Decision_fatigue ; /Loss_aversion ; /Overchoice ; /Nudge_theory ; /Default_effect ; /Replication_crisis ; /Aesthetic%E2%80%93usability_effect | T4 (secondary, used only to locate primary citations/status) | VERIFIED |
| https://www.nngroup.com/articles/ten-usability-heuristics/ (orig. 1994-04-24, reviewed 2024-01-30) | T2 | VERIFIED |
| NN/g: /articles/3-click-rule/ ; /videos/magical-number-7-ux/ ; /videos/hicks-law-long-menus/ ; /videos/number-items-navigation-menu/ ; /articles/hamburger-menus/ (2016-06-26) ; /articles/mobile-navigation-patterns/ (2015) ; /articles/popups/ ; /articles/form-design-placeholders/ ; /articles/auto-forwarding/ ; /articles/designing-effective-carousels/ ; /articles/skeleton-screens/ ; /articles/response-times-3-important-limits/ ; /articles/infinite-scrolling-tips/ ; /articles/error-message-guidelines/ ; /articles/confirmation-dialog/ ; /articles/scrolling-and-attention/ (2018) ; /articles/f-shaped-pattern-reading-web-content-discovered/ ; /articles/touch-target-size/ ; /articles/mobile-ux/ (2015) ; /articles/sticky-headers/ ; /articles/deceptive-patterns/ ; /articles/flat-ui-less-attention-cause-uncertainty/ (2017) ; /articles/liquid-glass/ (2025-10-10) ; /articles/icon-usability/ ; /articles/banner-blindness-old-and-new-findings/ ; /articles/progressive-disclosure/ (2006) ; /articles/minimize-cognitive-load/ ; /articles/mental-models/ ; /videos/jakobs-law-internet-ux/ (2017) ; /articles/aesthetic-usability-effect/ | T2 | VERIFIED |
| https://stephaniewalter.design/blog/your-menu-doesnt-need-millers-7-plus-minus-2-rule/ | T4 (practitioner, cites Miller/Cowan) | VERIFIED |
| https://www.cs.umd.edu/users/ben/goldenrules.html (Shneiderman) | T2 | VERIFIED |
| https://asktog.com/atc/principles-of-interaction-design/ (Tognazzini) | T2 practitioner | VERIFIED |
| https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php , /05/...part-2.php , /07/...part-3.php (Hoober 2017) | T2 practitioner-research | VERIFIED |
| https://alistapart.com/article/how-we-hold-our-gadgets/ (Clark) | T4 | VERIFIED |
| Search results only: Parhi/Karlson/Bederson 2006 (MobileHCI); Bi/Li/Zhai 2013 (CHI, FFitts); Fitts 1954 J Exp Psych 47(6):381-391; MacKenzie 1992 HCI 7:91-139 (yorku.ca/mack/hci1992.html); Cowan 2001 BBS 24(1):87-114; Iyengar & Lepper 2000 JPSP; Scheibehenne et al. 2010 JCR 37(3):409-425; Chernev et al. 2015 JCP 25:333-358; Ghibellini & Meier 2025 (Humanit Soc Sci Commun, Zeigarnik meta-analysis); Oulasvirta et al. CHI 2005 | T2 peer-reviewed | SNIPPET (abstract-level; publishers returned 403) |
| https://www.cambridge.org/core/product/identifier/S2398063X1800043X/type/journal_article (Jachimowicz et al. 2019 default meta-analysis) | T2 | VERIFIED |
| https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials | T1 | VERIFIED |
| https://developers.google.com/search/blog/2026/04/back-button-hijacking (content not retrievable; facts from 8 secondary search hits) | T1 URL / secondary content | SNIPPET |
| https://www.w3.org/WAI/WCAG22/Understanding/ : target-size-minimum, target-size-enhanced, resize-text, accessible-authentication-minimum, timing-adjustable, pause-stop-hide, images-of-text, visual-presentation, pointer-gestures, dragging-movements, contrast-minimum, audio-control, reflow, redundant-entry, identify-input-purpose | T1 | VERIFIED |
| Apple HIG JSON: privacy, onboarding, alerts, sheets, accessibility, tab-bars, gestures, materials, loading, motion (developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json) | T1 | VERIFIED |
| https://developer.android.com/training/permissions/requesting ; /develop/ui/views/touch-and-input/gestures/gesturenav ; /design/ui/mobile/guides/patterns/predictive-back ; /design/ui/mobile/guides/foundations/system-bars ; /guide/topics/ui/accessibility/principles ; https://support.google.com/accessibility/android/answer/7101858 ; https://github.com/material-components/material-components-android/blob/master/docs/components/BottomSheet.md | T1 | VERIFIED (m3.material.io bottom-sheets = empty shell) |
| https://web.dev/articles/vitals ; https://developer.mozilla.org/en-US/docs/Web/CSS/length ; https://developer.chrome.com/docs/lighthouse/seo/tap-targets | T1 | VERIFIED |
| https://baymard.com/lists/cart-abandonment-rate ; /blog/checkout-flow-average-form-fields ; /blog/line-length-readability | T2 | VERIFIED |
| https://www.deceptive.design/ , /types | T2 practitioner (Brignull) | VERIFIED |
| https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers ; https://www.gibsondunn.com/ftc-restarts-negative-option-rulemaking-after-eighth-circuit-vacatur-enforcement-under-rosca-continues/ ; https://www.springlex.eu/en/packages/dsa/dsa-regulation/article-25/ ; https://www.goodwinlaw.com/en/insights/publications/2025/11/alerts-practices-antc-from-dark-patterns-to-fair-play | T1 / law-firm secondary | VERIFIED |
| https://arxiv.org/abs/2502.13499 (Deception at Scale, CHI'26) ; https://arxiv.org/abs/1907.07032 (Mathur et al. 2019) | T2 peer-reviewed | VERIFIED |
| https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/ | T3 | VERIFIED |
| https://github.com/tkadlec/WPOStats/issues/41 (Google engineer on the 53% stat) ; Think with Google 2016/2017 speed reports | T3 | VERIFIED (issue) / SNIPPET (numbers) |
| https://erikrunyon.com/2013/01/carousel-interaction-stats/ | T3 single-site case study | VERIFIED |
| https://www.smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/ | T4 | VERIFIED |
| https://www.rfc-editor.org/rfc/rfc9413 | T1 (IETF) | VERIFIED |
| https://claude.com/blog/improving-frontend-design-through-skills ; Adam Wathan X post 1953510802159219096 | T3 / T4 | VERIFIED (blog) / SNIPPET (post) |
| https://www.betterads.org/mobile-large-sticky-ad/ ; https://www.betterads.org/mobile-ad-density-higher-than-30/ (Coalition for Better Ads; seen only in search results) | T2 industry standard | SNIPPET |

---------------------------------------------------------------------------------------------------

