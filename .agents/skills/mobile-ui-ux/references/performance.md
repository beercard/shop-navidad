# Performance as UX (web/PWA, native, cross-platform)

Read this when: animating anything, building lists/feeds, using images/fonts/blur/shadows, setting a performance budget, reviewing "janky" UI, or choosing loading/skeleton/optimistic strategies (deeper loading UX is in states-feedback.md).

Tags: `[S]` `[P-iOS]` `[P-AND]` `[P-WEB]` platform/standard · `[R]` research · `[C]` consensus · `[H]` heuristic · `[T]` trend. Research date 2026-10-06. Frame and Web Vitals thresholds below were read from primary docs; items marked UNVERIFIED are memory.

Contents: 1 Frame budgets · 2 Animation rules per stack · 3 Main-thread and input · 4 Images, fonts, bytes · 5 Lists and memory · 6 Cost of visual effects · 7 Perceived performance · 8 Battery · 9 Measuring · 10 Rule catalog with flip conditions · 11 Anti-patterns · 12 Known gaps

---

## 1. Frame budgets: smoothness is "every frame inside the vsync interval"

- 60 Hz = 16.67 ms, 90 Hz = 11.1 ms, 120 Hz = 8.33 ms per frame. A frame that overruns by even 1 ms is dropped, not shown late `[P-AND: Android render vitals; P-iOS: hitches doc]`.
- Web: nominal 16.66 ms but only ~10 ms is usable for your work at 60 Hz (browser overhead) `[P-WEB: web.dev rendering performance / RAIL]`. RAIL is "superseded" by Core Web Vitals but remains the only explicit statement of the 10 ms figure. There is no authoritative 120 Hz web budget.
- Displays are adaptive (iPhone ProMotion 10-120 Hz; Android variable refresh). Do not hard-code 16.7 ms: drive animation from frame callbacks and timestamps (rAF, CADisplayLink, Choreographer, framework animators), never fixed-step timers. Low Power Mode and thermal state lower the cap.
- iOS: ProMotion iPhones cap Core Animation at 60 Hz unless Info.plist `CADisableMinimumFrameDurationOnPhone = true` (needed for custom Core Animation, Flutter and RN on iPhone; UIKit/SwiftUI get pacing automatically). Custom CADisplayLink: set `preferredFrameRateRange`; request high rates only for interactive motion because high rates cost significant power `[P-iOS]`.
- Android: "slow frame" 16-700 ms, "frozen frame" 700 ms-5 s, > 5 s is ANR territory. JankStats flags jank at 2× the refresh interval by default. Android's frame-rate doc: higher refresh costs power; requested rates are hints `[P-AND]`.
- iOS distinguishes **hangs** (main thread unresponsive during discrete interaction; tools report > 250 ms, < 100 ms rarely noticed) from **hitches** (late frames during continuous motion; even a few ms is noticeable). Xcode Organizer hitch-rate bands: ≤ 10 ms/s good, ≤ 25 warning, ≤ 50 critical, > 50 act now `[P-iOS]`. A stricter 5/10 ms/s lab guidance exists but is UNVERIFIED.

Agent rule: budget animation work for the lowest refresh rate you must support while keeping per-frame work small enough to fit 120 Hz on the target device class.

## 2. Animation rules per stack

**Web.** Animate `transform` and `opacity`; layout properties (`width/height/top/left`) re-run layout + paint + composite; shadows, blurs and colors repaint `[P-WEB: web.dev compositor-only, animations guide; Lighthouse non-composited-animations]`.
- Chromium's compositor-mutable set is transform, opacity, filter and backdrop-filter. Chrome 144+ can keep width/height animations off the main thread only when the computed value does not actually change across keyframes; Firefox/Safari do not.
- Use CSS transitions/animations or WAAPI `element.animate()`, not per-frame JS style writes. For size changes use FLIP (measure, invert with transform, play) or measure `grid-template-rows`/`clip-path` first.
- `will-change` is a last resort: set it just before the change (pointerdown, before opening a drawer), remove on `transitionend`. Never `* { will-change: transform }` or global `translateZ(0)`. Each layer costs GPU memory `[P-WEB: MDN, web.dev]`.
- CSS scroll-driven animations (`animation-timeline: scroll()/view()`): not Baseline (no default Firefox); Chrome/Edge 115, Safari 26. Use `@supports` with a static or IntersectionObserver fallback. Never `window.onscroll` + style writes.
- View Transitions: same-document Chrome/Edge 111, Safari 18, Firefox 144; cross-document Chrome 126, Safari 18.2. Baseline "low". Wrap in `if (document.startViewTransition)`, keep the DOM update synchronous and ≲ 50 ms (a slow update shows as a frozen page), respect reduced motion.
- Touch: viewport `width=device-width, initial-scale=1` removes the legacy 300 ms tap delay with no need to disable zoom. Add `touch-action: manipulation` on controls. Register touch/wheel listeners `{passive:true}` unless you must `preventDefault`; use `touch-action` CSS to claim gestures. Never `user-scalable=no` or `maximum-scale=1` `[S: WCAG 1.4.4]`.

**React Native.** Use Reanimated worklets or `useNativeDriver` (historically transform/opacity only; RN 0.85 added an experimental backend that can animate layout props natively; measure). JS-thread blocking drops JS frames; judge performance on release builds only. FlatList defaults: windowSize 21, maxToRenderPerBatch 10, initialNumToRender 10; use `getItemLayout`, stable `keyExtractor`, memoized rows, or FlashList v2 (New Architecture).

**Compose.** State read in composition re-runs all phases; read in layout re-runs layout+draw; read in draw only draw. Pass `() -> T` providers and use `graphicsLayer {}`/`offset {}`/`drawBehind {}` for scroll/animation-linked state. `LazyColumn(items(list, key = { it.id }, contentType = ...))`. `derivedStateOf` for booleans derived from fast state. Collections are unstable parameters unless immutable. Measure in release with Baseline Profiles.

**SwiftUI.** `body` must finish before the next frame; instruments flag body updates > 500 µs (orange) and > 1000 µs (red). Narrow dependencies (`@Observable` iOS 17+ tracks only properties read), constant number of views per `ForEach` element (no `if`/`AnyView` in rows), heavy work in `.task` not in `init`/`body`. `.offset` does not change layout size, so it's cheaper than layout-affecting changes. `drawingGroup()` only after measuring.

**Flutter.** UI thread builds the layer tree; raster thread draws. Profile mode on the slowest real device you support. `const` constructors, localized `setState`, `ListView.builder`, avoid `Opacity`/`saveLayer` in animations (use `AnimatedOpacity`, apply alpha to the color), prefer `borderRadius` on decorations over clip widgets. Impeller removes runtime shader-compile jank (default on iOS and Android API 29+).

## 3. Main-thread discipline (web)

- Tasks > 50 ms are "long". INP measures input delay + handler time + presentation delay for every interaction; good ≤ 200 ms, poor > 500 ms at p75 `[P-WEB]`.
- Give visual feedback first (class toggle/optimistic state), then `await scheduler.yield()` (Chrome 129+, Firefox 142+, Safari unsupported: fall back to `setTimeout`), then continue the work.
- Never read layout (`offsetHeight`, `getBoundingClientRect`) between style writes in a loop. Batch reads, then writes.
- React: `useTransition` makes updates interruptible and avoids replacing visible content with spinners; `useOptimistic` for reversible writes.

Web Vitals (field, p75, segment by mobile): LCP ≤ 2.5 s good / > 4.0 s poor; INP ≤ 200 ms / > 500 ms; CLS ≤ 0.1 / > 0.25. Quote field data, not a single Lighthouse run. In the 2025 Web Almanac only 48% of mobile sites passed all three. LCP: put `fetchpriority="high"` on the hero image, never `loading="lazy"` on it. CLS: reserve space for images, ads, embeds; composited animations do not count toward CLS `[P-WEB]`.

## 4. Images, fonts, bytes

- Every `<img>`: `width`/`height` (or `aspect-ratio`), `alt`, `decoding="async"`, `loading="lazy"` only below the fold, `fetchpriority="high"` and no lazy for the LCP image. Serve AVIF/WebP via `<picture>` with a JPEG fallback and real `srcset`/`sizes`. Chrome starts lazy images ~1,250 px (4G) / 2,500 px (3G) before the viewport `[P-WEB]`.
- Native decoded-bitmap memory = width × height × 4 bytes (ARGB_8888). A 12 MP photo decodes to ~48 MB; a 1080×2400 full-screen RGBA bitmap ≈ 10 MB. Decode at display size (Coil/Glide, Nuke, ImageIO thumbnail APIs, `inSampleSize`), cap in-memory image caches `[P-AND][P-iOS]`.
- Fonts: WOFF2 only (~30% smaller than WOFF), subset (`unicode-range`; CJK fonts are huge), `font-display: swap` (or `optional` for non-critical), `size-adjust`/override descriptors to match the fallback, prefer a system font stack for app-like PWAs `[P-WEB]`.
- Budget for mid-tier Android, not the dev laptop. Alex Russell's 2026 model (Galaxy A24 4G class, 9 Mbps/100 ms RTT): for a 3 s load ~2.0 MiB total with ~0.3 MiB JS (JS-light), or ~1.2 MiB with ~0.62 MiB JS (JS-heavy); for 5 s about 3.7 MiB / 0.57 MiB JS or 2.3 / 1.15. JS costs far more per byte than images. Real P50 mobile JS ≈ 680 KiB. This is a practitioner model, not a standard. `[R-T2]` Default to ≤ 300-600 KiB compressed critical-path JS unless the user supplies analytics `[H]`.
- Lighthouse mobile lab throttling: 4× CPU, 150 ms RTT, 1.6 Mbps. DevTools says it cannot truly emulate mobile CPUs; use a real mid-tier phone for decisions near thresholds.
- Third-party scripts: async/defer, `preconnect` critical origins, facade heavy embeds. Keep pages bfcache-eligible: use `pagehide` not `unload`; avoid `Cache-Control: no-store` where possible (~1 in 5 mobile navigations are back/forward).
- Service-worker strategies: cache-first for hashed static assets; stale-while-revalidate for non-critical freshness; cache-then-network for feeds; network-first for must-be-fresh content with a timeout; network-only for non-GET/analytics.
- Speculation Rules prerender: Chrome/Edge only; use `moderate`/`conservative` eagerness; never on state-changing URLs.

## 5. Lists and memory

- Every stack virtualizes by default (LazyColumn, LazyVStack/List, ListView.builder, FlatList/FlashList, react-window). Never render full collections in a plain `Column`/`VStack`/`ScrollView`.
- No authoritative "virtualize above N rows" number exists. Lighthouse's DOM size proxy: warn ~800 nodes, error ~1,400. Heuristic: virtualize above roughly 100 complex rows or when DOM > ~1,400 nodes `[H]`. `content-visibility: auto` + `contain-intrinsic-size: auto <height>` can cut render cost sharply on long static sections (web.dev demo: 232 ms → 30 ms; Baseline "low" since 2025-09) and keeps content in the accessibility tree.
- Virtualization breaks find-in-page and can blank-flash: expose total counts (`aria-setsize`/`aria-posinset`/`aria-rowcount`) and keep search/filter server-side.
- Infinite scroll only for homogeneous, goalless browsing; otherwise "Load more" or pagination. Mobile chunk of 15-30 items (Baymard). Always restore position and loaded pages on Back `[R: NN/g, Baymard]`.

## 6. Cost of visual effects (real cost, weakly quantified in primary sources)

- Blur/backdrop-filter: samples many pixels, forces offscreen passes; cost scales with radius × area × layers and is worst over content that changes every frame. All T1 sources call it "expensive" (Flutter BackdropFilter), "offscreen buffer" (Compose RenderEffect) or "use sparingly" (HIG Materials); none gives a safe radius. Circulating numbers ("cap ~20 px", "≤ 3-4 glass layers") are community opinion `[H]`.
- Rule: limit blur to 1-2 small chrome surfaces (nav/tab bar, sheet scrim), never per-card; do not animate the blur radius (animate the surface's opacity/transform); give an opaque or high-alpha fallback when `prefers-reduced-transparency`, Reduce Transparency, battery saver, or old Android (Compose blur needs API 31+); verify on a mid-tier device.
- Shadows: use one static elevation; do not animate shadow blur; set `shadowPath` on iOS layers; avoid per-row clip+shadow combos.
- Transparency: apply alpha to the color, not to an opaque container (`Modifier.alpha`, Flutter `Opacity`, CSS opacity on large trees can all force offscreen buffers). Android Debug GPU Overdraw: blue (1×) typically fine; investigate red (3×+). Remove hidden backgrounds.
- UNVERIFIED (memory-level, no authoritative source retrieved): Lottie masks/mattes are costly; large SVG blur filters are costly; autoplay video and always-looping animations burn battery; large gradients and border-radius+overflow clipping: no source; measure before assuming they are cheap or costly. Prefer CSS/native vector animation for simple loops, test Lottie on a mid-tier device, cap loops, pause off-screen/background/low-power/reduced-motion.

## 7. Perceived performance

- Response-time limits (Miller 1968 / Card et al. 1991 via NN/g): ~0.1 s feels instantaneous, ~1 s keeps flow of thought, ~10 s is the limit of attention `[R]`. Doherty's 400 ms is one mainframe-era result; modern platform thresholds are stricter.
- Feedback ladder: < 100 ms none needed beyond a pressed state; 100 ms-1 s immediate local feedback (pressed state, optimistic update), no spinner (or delay the spinner 200-300 ms (500 acceptable) to avoid flash: delay value is `[H]`); 1-10 s looped spinner or content-shaped skeleton; > 10 s determinate progress with estimate, cancel, and permission to background `[R: NN/g; P-iOS: HIG loading]`.
- Skeletons: evidence is weak and contested. NN/g recommends them for full-page loads under 10 s with known layout (skip < 1 s; never for uploads/downloads); the one peer-reviewed study they cite found no significant differences; Viget's n=136 simulated test found skeletons *felt* slower than a spinner. So: conditional, never "always better". Match final layout exactly (zero layout shift), keep shimmer subtle and slow, honor reduced motion, add a timeout → error state `[H]`.
- Progress-bar research (Harrison 2007, n=22 lab): bars that speed toward the end feel faster; pauses near the end feel slower. Small sample; never fake progress.
- Optimistic UI: for low-risk, reversible writes (like, toggle, reorder, delete-with-undo): update immediately, persist async, revert plus message on failure. For payments, transfers, irreversible actions: wait for server confirmation `[P-AND offline-first guidance; H]`. No controlled study quantified the benefit.
- Launch: launch screen mimics the first screen, no branding or artificial splash delay, restore state; Android cold start ≥ 5 s, warm ≥ 2 s, hot ≥ 1.5 s are flagged "bad" `[P-iOS][P-AND]`.
- Business stats (Deloitte/Google: 0.1 s mobile speedup → +8.4% retail conversion; BBC ~10% users lost per extra second) are commissioned or self-reported case data: directional only. Do not cite "53% abandon after 3 s": a Google engineer said it measured bounce rate, not abandonment `[R-weak]`.

## 8. Battery

- Prefer push over polling; batch network; WorkManager/BGTaskScheduler; release wake locks; right-size location accuracy; pause off-screen or backgrounded animation, video and Lottie `[P-AND][P-iOS]`.
- Dark mode saves battery only on OLED. Purdue (MobiSys 2021, 4 phones): 3-9% display power at 30-50% brightness, 39-47% at 100% brightness; brightness dominates. Don't justify pure-black UIs on battery alone `[R]`.
- Keep refresh-rate requests modest; do not force 120 Hz for static UI.

## 9. Measuring (always state method + device class + build type)

- Web: field first (CrUX, PageSpeed Insights, the `web-vitals` library), then Lighthouse (mobile preset) and DevTools Performance panel with CPU throttling or Calibrate presets, Rendering tab (paint flashing, layer borders, layout-shift regions). Test a real low/mid Android when possible.
- Android: Macrobenchmark (StartupTimingMetric, FrameTimingMetric) on a real device with a release-like build; JankStats in field; Perfetto/System Trace; Baseline Profiles (~30% faster code execution from first launch per Android docs); Debug GPU Overdraw; Layout Inspector recomposition counts. Emulators are not representative.
- iOS: Instruments (Animation Hitches, Hangs, SwiftUI template), Xcode Organizer (Hitches, Launch Time), MetricKit. Test oldest supported iPhone plus a non-ProMotion and a ProMotion model.
- Flutter: `flutter run --profile`, Performance Overlay, DevTools (red = > 16 ms; shader-compile frames flagged). RN: release builds only; Performance Monitor, Hermes profiler, Android system trace.
- Never claim "60 fps" from a simulator or debug build.

## 10. Rule catalog (with strength and when it flips)

| # | Rule | Strength | Flips when |
|---|---|---|---|
| R1 | Animate transform/opacity; avoid layout-affecting properties during motion | Strong (3 T1) | Chrome 144+ unchanged-size case; small Compose/SwiftUI layout animations are cheap; RN 0.85 experimental native layout animation |
| R2 | Run per-frame work on compositor/UI thread, not JS main thread | Strong | trivial work |
| R3 | `will-change` only transiently | Strong | small, constantly animating element |
| R4 | Judge performance on release/profile builds on real mid-tier devices | Strong | n/a |
| R5 | Feedback within ~100 ms; handlers < 50 ms | Strong | n/a |
| R6 | Images: dimensions set, sized to display, lazy only below fold, LCP prioritized | Strong | n/a |
| R7 | Decoded bitmap memory = w×h×4; downsample | Strong | wide-color formats double it |
| R8 | Virtualize/lazy-build long lists | Strong for mechanism; no numeric threshold | tiny static lists |
| R9 | Limit blur/backdrop and translucent layers | Moderate (T1 says expensive; no numbers) | flagship-only, small bars |
| R10 | Don't animate blur radius or shadow blur | Weak-moderate | static usage is fine |
| R11 | `content-visibility:auto` for long off-screen sections | Moderate-strong | anchors/find needed before render |
| R12 | Skeletons only for known-layout 1-10 s loads | Weak (contested) | very short waits |
| R13 | Determinate progress for > 10 s | Strong | unknowable duration |
| R14 | Restore state; launch screen mimics first screen; no artificial splash delay | Strong | n/a |
| R15 | Push over polling; batch network | Strong | n/a |
| R16 | Modest refresh-rate requests | Strong | games, pro motion content |
| R17 | Never disable zoom "for performance" | Strong | n/a |
| R18 | Per-stack discipline (Compose keys/lambdas; SwiftUI narrow deps; Flutter const/local setState) | Strong (T1 each) | Compose strong skipping makes some manual work redundant |
| R19 | Dark mode is a minor battery lever on OLED at normal brightness | Strong (peer-reviewed) | max brightness outdoors |
| R20 | Pause off-screen/backgrounded animation and video | Moderate | n/a |

## 11. Anti-patterns (problem → why → better)

- Global `will-change`/`translateZ(0)` → layer explosion, GPU memory → apply just before animating.
- Animating top/left/width/height/box-shadow for UI motion → layout/paint every frame → transform/opacity or FLIP.
- Layout reads inside write loops → forced synchronous layout → batch reads then writes.
- Non-passive scroll/touch listeners → scroll waits on JS → `{passive:true}` or `touch-action`.
- `user-scalable=no` for tap delay → breaks zoom/a11y, unnecessary since 2014/2016 → `width=device-width` + `touch-action: manipulation`.
- `loading="lazy"` on the hero image → delays LCP.
- Missing image dimensions or late-injected banners → CLS → reserve space.
- Hundreds of KB of JS to render static content → main-thread cost on mid-tier Android.
- Huge DOMs with no windowing → slow style/layout/INP.
- Full-viewport blur over scrolling content; many glass layers → GPU fill cost.
- Flutter `Opacity`/`saveLayer` wrappers per item; Android `Modifier.alpha` over opaque content → offscreen buffers.
- Compose unkeyed lazy items or scroll state read in composition; SwiftUI `AnyView`/`if` in rows or heavy `body`; RN dev-mode judgments and un-memoized rows.
- Decoding full-resolution photos for thumbnails → OOM/jetsam.
- Polling timers, wake locks held across work → battery.
- Artificial splash delays; static "Loading…" text; spinner for a known > 10 s task; bar stuck at 90%; skeleton for < 1 s loads.
- Making users wait for a decorative animation; speculation prerender on mutating URLs; `unload` handlers.

## 12. Known gaps (do not assert numbers for these)

Play Console slow-render/frozen-frame percentages; safe blur radius/area; Lottie/SVG-filter/gradient/clip costs; any authoritative virtualization threshold; Apple lab hitch bands of 5/10 ms/s and a 400 ms launch target (memory only); skeleton-screen meta-analysis; real-world 120 Hz web budget; React Compiler status; WebPageTest-specific numbers.
