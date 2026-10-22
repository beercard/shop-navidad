# 04 — Mobile UI Performance (web/PWA, native, cross-platform) framed as UX

Researched 2026-10-06. Slice owner: agent 04. All numbers below were pulled this session unless tagged MEMORY/SNIPPET.
Note on method: WebSearch budget was exhausted mid-session (shared 200-call cap), so a few topics (Lottie cost, Android blur API-level details, skeleton meta-analyses) rely on fetched pages only and are flagged in Gaps.
Tag key: VERIFIED = fetched page states it; SNIPPET = search excerpt only; MEMORY = training knowledge not re-verified.
"Summarizer caveat": WebFetch returns a model summary of the page, not raw text. Where a summary looked unreliable I re-fetched raw JSON/HTML (Apple JSON, Flutter HTML) and say so.

## Sources consulted (URL | tier | verified?)

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

---

## Findings

### F1 Frame budgets are a function of refresh rate; the budget is the UX unit
- Claim: Smoothness is "every frame inside the vsync interval." 60 Hz = 16.67 ms, 90 Hz = 11.1 ms, 120 Hz = 8.33 ms. A frame that overruns by even 1 ms is not shown late, it is dropped (Android Choreographer).
- Evidence: Android render vitals page — T1 — VERIFIED — 16/11/8 ms table; "overrun by 1 ms drops the frame." Apple hitches doc — T1 — VERIFIED — 120 Hz = 8.3 ms per stage; each render-loop stage (app commit, render-server CPU+GPU) has up to one vsync. Flutter ui-performance — T1 — VERIFIED — ~16 ms @60, ~8 ms @120; best-practices page says 8 ms build + 8 ms raster at 60 Hz. RN performance — T1 — VERIFIED — 16.67 ms.
- Corroboration / conflict: web.dev rendering-performance — T1 — VERIFIED — 16.66 ms nominal but only ~10 ms usable for your work because the browser has overhead; RAIL (web.dev/rail, marked superseded by Core Web Vitals but still the clearest budget table) — VERIFIED — 10 ms/frame, 100 ms response, 50 ms idle chunks.
- Scope: universal.
- Context (when it flips): Displays are adaptive (iPhone ProMotion 10–120 Hz; Android VRR). Do not hardcode 16.7 ms; use frame callbacks/timestamps and derive from the display. Low-power mode and thermal state lower the cap.
- Agent rule: IF generating animation/scroll code THEN budget for the lowest refresh rate you must support AND keep per-frame work tiny enough to still fit at 120 Hz on the target device class; never use fixed-step `setTimeout`/timers for animation; use rAF / CADisplayLink / Choreographer / framework animators.
- Stack notes: CSS/WAAPI -> compositor; SwiftUI/UIKit animations are paced by the system; Flutter/Compose animators are vsync-driven.

### F2 iOS ProMotion: opt in for custom Core Animation/CADisplayLink; system pacing for UIKit/SwiftUI
- Claim: ProMotion iPhones (10–120 Hz) cap Core Animation to the system default (60 Hz) unless the app opts in with Info.plist `CADisableMinimumFrameDurationOnPhone = true`. iPad Pro does not need the key. UIKit, SpriteKit, SwiftUI animations get frame pacing automatically; custom drawing should use `CADisplayLink.preferredFrameRateRange` / `CAFrameRateRange`.
- Evidence: Apple "Optimizing iPhone and iPad apps to support ProMotion displays" — T1 — VERIFIED (raw JSON). Devices listed: iPhone 13 Pro and later, iPhone 17 and later (incl. iPhone Air), several iPad Pros. Valid rates: iPhone 10–120 Hz (steps 120/80/60/48(iPad)/40/30/24/20/16/15/12/10); you cannot force a rate, only hint. System disables fast rates in Low Power Mode or when hot. Higher refresh = significant power. iOS 15+ games get special priority for 30/60 Hz ranges. Use as few display links as possible; group animations in one. Don't use timers that ignore the CA refresh cycle.
- Corroboration: CADisplayLink doc — T1 — VERIFIED — a slower but consistent frame rate looks smoother than a rate that skips frames. Flutter issue #94508 — T3 — VERIFIED — opt-in key was needed for Flutter iOS; owner says it was necessary but not sufficient.
- Scope: iOS (+ Flutter/RN on iOS: set the key).
- Context: Product call. Don't request 120 Hz for static or low-motion content; Apple tells you to prefer lower rates.
- Agent rule: IF native/Flutter/RN app targets iPhone AND has scroll/animation-heavy UI THEN add `CADisableMinimumFrameDurationOnPhone=true`; IF custom CADisplayLink THEN set `preferredFrameRateRange` with a min/preferred/max (e.g., 60–120, preferred 60 or 120 only for interactive motion) and compute animation from timestamps, not frame counts.

### F3 Android: slow/frozen frames, JankStats, FrameTimeline, Play vitals
- Claim: Android defines slow frames as 16–700 ms and frozen frames as 700 ms–5 s; >5 s is ANR territory. Prioritize ANRs, then frozen frames (most reproducible during startup/transitions), then slow frames.
- Evidence: Android vitals render page — T1 — VERIFIED. JankStats — T1 — VERIFIED: default heuristic flags a frame as jank at 2x the current refresh interval (≈33.3 ms at 60 Hz), tunable via `jankHeuristicMultiplier`; uses FrameMetrics (API 24+), `frameOverrunNanos` on API 31+. Android Studio jank-detection page — T1 — VERIFIED: Janky frames track on API 31+ (System Trace), export to Perfetto. Perfetto — T1 — VERIFIED: default tracer for Android/Chromium.
- Play vitals: crash/ANR "bad behavior" thresholds are published (user-perceived crash 1.09% overall / 8% per device; ANR 0.47% / 8% per device) — T1 — VERIFIED (Play Console Help). That page does NOT list slow-rendering or frozen-frame thresholds, so an agent must not assert "Play penalizes >X% slow frames" (older community figures exist; unverified here).
- Startup thresholds (vitals "bad"): cold >=5 s, warm >=2 s, hot >=1.5 s — T1 — VERIFIED (launch-time page). Splash: animated icon <=1000 ms; no artificial delay; hold splash only for essential local init — T1 — VERIFIED.
- Scope: Android.
- Agent rule: IF Android app THEN ship Baseline Profiles (Android docs claim ~30% faster code execution from first launch), measure with Macrobenchmark on a real mid-tier device in a release-like build, and wire `reportFullyDrawn()`/`ReportDrawnWhen` so TTFD is measured.

### F4 Apple hitches vs hangs: two different problems with different thresholds
- Claim: A hang is main-thread unresponsiveness during discrete interactions (Apple tools report at >250 ms; <100 ms is rarely noticed; a few hundred ms feels broken). A hitch is a late frame during continuous motion (scroll/drag/animation), and even a few ms is noticeable. Hitches split into commit hitches (app main thread missed the Core Animation commit deadline) and render hitches (render server/GPU too slow).
- Evidence: Apple "Understanding hangs/hitches" — T1 — VERIFIED (raw JSON). Xcode Organizer Hitches metric (field): <=10 ms/s good, <=25 warning, <=50 critical, >50 act now. SwiftUI Instruments: view-body updates >500 µs flagged orange, >1000 µs red.
- Conflict: an earlier summary of the HTML page claimed 5/10 ms/s bands; this contradicts the raw JSON. The 5/10 ms/s bands match my recollection of the WWDC20 Instruments (dev-time) guidance but I could not verify it — MEMORY. Use 10/25/50 for field data and treat 5 ms/s as a stricter lab target (MEMORY).
- Scope: iOS.
- Agent rule: IF reviewing iOS UI THEN separate "hang" (event handler > 100 ms, I/O or JSON parsing on main) from "hitch" (per-frame work > 8.3 ms at 120 Hz). Move work off main; keep SwiftUI `body` tiny.

### F5 Web animation: compositor-only is still the default rule, but the set and conditions have grown
- Claim: Animate `transform` and `opacity`. Layout properties (`width/height/top/left`) re-run layout+paint+composite; paint-only properties (colors, shadows, blurs) skip layout but repaint.
- Evidence: web.dev "Stick to compositor-only properties" — T1 — VERIFIED (only transform/opacity; layers cost memory; ~4–5 ms compositing target). web.dev Animations guide — T1 — VERIFIED (avoid animating top/left/width/height/shadows/blurs). web.dev rendering-performance — T1 — VERIFIED (3 pipeline paths: all five stages / skip layout / skip layout+paint). Lighthouse non-composited-animations audit — T1 — VERIFIED (still current, last updated 2024-12-08; non-composited animations jank on low-end phones and can count toward CLS). web.dev optimize-cls — VERIFIED: composited animations do not count toward CLS.
- Corroboration / newer facts: Blink animation README — T1 — VERIFIED: "currently transform, opacity, filter, backdrop-filter" are compositor-mutable. Chrome blog (2020) — T1 — VERIFIED: background-color and clip-path were "coming" (not confirmed shipped by the README). Bram.us Nov 2025 — T3 — VERIFIED: from Chrome 144 (Canary) `width`/`height` animations whose computed value does not actually change across keyframes can stay off the main thread; layout still runs when values really change; Firefox/Safari do not do this.
- Scope: Web.
- Context (flips): (1) filter/backdrop-filter animations are compositor-eligible but still GPU-expensive (see F17). (2) Compositor-only does not help if the animated element is huge, has many layers, or triggers texture re-raster. (3) With View Transitions the browser animates snapshots (transform/opacity-like), so layout-changing DOM updates inside a transition are not animated per frame by layout.
- Agent rule: IF animating on web THEN use `transform`/`opacity` (CSS transitions/animations or WAAPI `element.animate`, not per-frame JS style writes); animate size by scaling (FLIP technique) or via `grid-template-rows`/`clip-path` only after measuring; run `@media (prefers-reduced-motion: reduce)` alternatives.
- Stack notes: RN `Animated` with `useNativeDriver` supports transform/opacity only (RN animations doc, VERIFIED) — see F22 for the 0.85 change. Compose `graphicsLayer` (alpha/scale/translation) skips layout (Compose docs VERIFIED, see F19). Flutter: prefer `AnimatedOpacity`/`FadeTransition`, `Transform` over layout-affecting animation (F21).

### F6 `will-change` and layer count: a scalpel, not a default
- Claim: Promoting layers costs GPU memory/bandwidth, especially on low-memory devices; `will-change` is a last-resort hint to apply shortly before a change and remove after.
- Evidence: web.dev compositor article — T1 — VERIFIED ("every layer requires memory and management", don't promote unnecessarily). MDN will-change — T1 — VERIFIED: last resort; don't set on many elements or large containers (e.g., body); toggle via JS before/after rather than permanently in CSS; may create a stacking context up front. Animations guide — VERIFIED: use only if you see graphics issues.
- Baseline: will-change is Baseline High (Chrome 36, Safari 9.1/9.3 iOS) — VERIFIED.
- Scope: Web.
- Agent rule: IF an element is about to animate (hover/press/drawer open) THEN set `will-change: transform` on `pointerdown`/before opening and clear on `transitionend`; NEVER write `* { will-change: transform }` or `translateZ(0)` hacks globally.

### F7 Main-thread discipline: long tasks, forced layout, yielding (INP)
- Claim: Tasks >50 ms are "long"; INP measures input delay + handler time + presentation delay for every interaction (taps, keys), so mobile CPUs magnify cost. Break up work, yield, avoid read/write interleaving that forces synchronous layout.
- Evidence: web.dev optimize-long-tasks — T1 — VERIFIED (50 ms threshold; `scheduler.yield()` preferred; `isInputPending()` discouraged). web.dev INP — VERIFIED (≤200 ms good, >500 ms poor, p75). Layout-thrashing article — VERIFIED (batch reads first, then writes; example with 28 ms in layout per frame). Optimize-INP — VERIFIED (yield after visual update; reduce DOM size; `content-visibility`; avoid giant client-side HTML). Input-delay article — VERIFIED (avoid recurring timers; debounce; abort superseded work).
- Support: `scheduler.yield()` Chrome/Edge 129+, Firefox 142+, Safari not supported — VERIFIED (web.dev) — so fall back to `setTimeout`/polyfill.
- React: `useTransition` makes updates interruptible; controlled inputs must not be wrapped; transitions avoid replacing visible content with spinners — T1 — VERIFIED. React Compiler docs say it automates memoization — status/version not confirmed in fetched text (Gap).
- Scope: Web (React specifics: web + RN).
- Agent rule: IF an interaction handler does more than ~50 ms of work THEN do the minimum to paint feedback (class toggle/optimistic state), `await scheduler.yield?.() ?? new Promise(r=>setTimeout(r))`, then continue; never read `offsetHeight`/`getBoundingClientRect` between style writes in loops.

### F8 Touch input: passive listeners, `touch-action`, and the 300 ms delay
- Claim: A mobile-optimized viewport removes the 300–350 ms tap delay without disabling pinch zoom; `touch-action: manipulation` removes double-tap-zoom delay on specific elements. Touch/wheel listeners that can preventDefault delay scrolling unless passive.
- Evidence: Chrome blog — T1 — VERIFIED: `<meta name="viewport" content="width=device-width">` suffices (Chrome 32, 2014; iOS Safari 9.3, March 2016 per post). MDN touch-action — T1 — VERIFIED: values auto/none/pan-x/pan-y/manipulation/pinch-zoom; "widely available since Sept 2019"; `touch-action: none` can block zoom (accessibility warning). Chrome scrolling-intervention — T1 — VERIFIED: since Chrome 56 document-level touchstart/touchmove listeners default to passive; ~80% of listeners were effectively passive; top-1% scroll latency fell from >400 ms to ~250 ms. Lighthouse passive-listener audit was removed in Lighthouse 13 — VERIFIED.
- Conflict: the 2014 Chrome post says touch-action lacks Safari support; MDN (current) says widely available — trust MDN; the Chrome post is stale on this point.
- Scope: Web/PWA.
- Agent rule: IF PWA THEN include `width=device-width, initial-scale=1` and do NOT add `user-scalable=no`/`maximum-scale=1` (blocks zoom; accessibility); add `touch-action: manipulation` to buttons/controls; register custom touch/wheel handlers with `{passive:true}` unless you truly must preventDefault; use `touch-action` CSS instead of preventDefault to claim gestures (e.g., `pan-y` on horizontal carousels).

### F9 Scroll-linked effects: prefer CSS scroll-driven animations where supported
- Claim: `animation-timeline: scroll()/view()` lets scroll-linked effects run declaratively instead of scroll listeners on the main thread. Not Baseline yet because Firefox lacks default support.
- Evidence: web-features data — T1 — VERIFIED: Baseline false; Chrome/Edge 115, Safari 26 (iOS 26). MDN — T1 — VERIFIED API shape (`scroll-timeline`, `view-timeline`, `animation-range`).
- Off-main-thread behavior: MDN page did not state it; Chrome's implementation is documented elsewhere (MEMORY: transform/opacity scroll-driven animations can run on compositor). Flagged.
- Scope: Web.
- Agent rule: IF scroll-reveal/parallax/progress bar THEN use `@supports (animation-timeline: scroll())` with a plain static or IntersectionObserver fallback; animate only transform/opacity; never `window.onscroll` + style writes.

### F10 View Transitions API: usable progressive enhancement, still "Baseline Low"
- Claim: Same-document transitions: Chrome/Edge 111, Safari 18, Firefox 144. Cross-document (MPA): Chrome/Edge 126, Safari 18.2, Firefox none.
- Evidence: Chrome docs — T1 — VERIFIED; web-features: Baseline "low" as of 2025-10-14 — VERIFIED.
- Cost note: transitions snapshot old/new states and suppress rendering while the DOM updates, so a slow DOM update still shows as a frozen page; the animation itself is CSS on pseudo-elements.
- Scope: Web.
- Agent rule: IF route/list transitions on web THEN wrap in `if (document.startViewTransition)`; keep the DOM update synchronous and <~50 ms; respect `prefers-reduced-motion`.

### F11 `content-visibility`, `contain`, DOM size, virtualization
- Claim: Skip rendering of off-screen subtrees and keep DOM small to cut style/layout cost and INP.
- Evidence: web.dev content-visibility — T1 — VERIFIED: travel-blog demo 232 ms -> 30 ms render (7x); need `contain-intrinsic-size` (use `auto <len>` to remember real size); content stays in a11y tree; avoid layout-forcing DOM APIs on skipped subtrees. Baseline: Low, since 2025-09-15 (Chrome 108, Firefox 130, Safari 26) — VERIFIED. `contain` is Baseline High — VERIFIED. contain-intrinsic-size widely available since Sept 2023 — VERIFIED. Lighthouse DOM size: warn ~800 nodes, error ~1,400 nodes (audit now an "Optimize DOM size" insight in Lighthouse 13) — VERIFIED. web.dev dom-size-and-interactivity — VERIFIED (large DOM hurts initial render, updates, memory). Virtualization trade-offs (find-in-page, a11y, blank flashes) — web.dev react-window — VERIFIED.
- No authoritative "virtualize above N rows" number exists in any source fetched. The only official proxy is the Lighthouse node count. Treat "N > ~100 rows" as heuristic (MEMORY/opinion).
- Scope: Web.
- Agent rule: IF a below-the-fold feed section is heavy THEN `content-visibility:auto; contain-intrinsic-size:auto 600px` on each section; IF list >~ a few hundred complex items or DOM > ~1,400 nodes THEN virtualize (react-window/TanStack Virtual) and keep a11y semantics (aria-setsize/posinset) and "find" limitations documented.

### F12 Core Web Vitals: thresholds and what mobile reality looks like
- Claim: Good = LCP <=2.5 s, INP <=200 ms, CLS <=0.1 at the 75th percentile of page loads (segmented mobile/desktop). Poor = LCP >4.0 s, INP >500 ms, CLS >0.25.
- Evidence: web.dev vitals/lcp/inp/cls — T1 — VERIFIED (vitals page last updated 2024-10-31; INP replaced FID). CLS uses session windows (1 s gap, 5 s max), excludes shifts within 500 ms of user input. LCP target breakdown: TTFB ~40%, load delay <10%, load duration ~40%, render delay <10%; `fetchpriority="high"` on the LCP image; never `loading="lazy"` on it — web.dev optimize-lcp — VERIFIED. fetchpriority example: Google Flights LCP 2.6 s -> 1.9 s — web.dev — VERIFIED.
- Mobile reality: HTTP Archive Web Almanac 2025 — T2/T3 — VERIFIED (summary): 48% of mobile sites pass all three CWV; LCP good 62%, INP good 77% (74% in 2024), CLS good 81%.
- Business evidence (vendor/case-study quality): Deloitte/Google (37 brands, 4 weeks): a 0.1 s mobile speed gain -> retail conversion +8.4%, AOV +9.2%, travel conversion +10.1% — T3 — VERIFIED. web.dev case studies (BBC lost ~10% users per extra second; Vodafone LCP -31% -> sales +8%; redBus INP -> sales +7%) — T3 — VERIFIED but self-reported; years unclear. Treat as directional.
- Lab note: Lighthouse lab score weights (Lighthouse 10 doc): FCP 10, SI 10, LCP 25, TBT 30, CLS 25 — VERIFIED; INP is field-only, TBT is the lab proxy (MEMORY on the proxy statement).
- Scope: Web.
- Agent rule: IF reporting web perf THEN quote field p75 for the three vitals, not a single Lighthouse run; IF only lab available THEN say so and use TBT/LCP/CLS as proxies.

### F13 Device-class budgets: design for a mid-tier Android, not the dev laptop
- Claim: The performance floor that matters for global users is a mid-tier Android with slow cores; JS costs far more per byte than images.
- Evidence: Alex Russell, 2026 budgets — T2/T3 — VERIFIED: test device Samsung Galaxy A24 4G (Helio G99); P75 network 9 Mbps down / 3 Mbps up / 100 ms RTT; budgets assume 2 TLS connections. JS-light (15% JS) -> 3 s load: 2.0 MiB total, 0.3 MiB JS; 5 s: 3.7 MiB total, 0.57 MiB JS. JS-heavy (50% JS) -> 3 s: 1.2 MiB total, 0.62 MiB JS; 5 s: 2.3 MiB total, 1.15 MiB JS. Real mobile JS payloads: P50 680 KiB, P75 1.3 MiB. 2024 edition: Galaxy A51 test device, 7.2 Mbps/94 ms RTT, 5 s: 1.3 MiB total (650 KiB JS), 3 s: 730 KiB (365 KiB JS), "JS at least ~3x more expensive byte-for-byte."
- Corroboration: Web Almanac 2025 median mobile page ~2.1 MB, JS ~646 KB, images ~911 KB, fonts 122 KB — VERIFIED (summary). Lighthouse default mobile throttle: 4x CPU slowdown, 150 ms latency, 1.6 Mbps down / 750 Kbps up ("bottom 25% of 4G / top 25% of 3G") — T1 — VERIFIED. Lighthouse benchmark index classes: <125 low-end, 125–800 mid-tier, 800–1200 high-end (as of Chrome m86) — VERIFIED.
- Conflict/nuance: Russell's numbers are one practitioner's budget model (explicitly "teams with low perf maturity"), not a standard. Lighthouse 4x is described as mid-tier; DevTools says it cannot truly simulate mobile CPUs and offers Calibrate presets (VERIFIED).
- Scope: Web/PWA and (by analogy) RN/Flutter startup.
- Agent rule: IF setting a web budget THEN default to <=300–600 KiB critical-path JS (compressed) for a 3–5 s mobile target unless the user supplies analytics; test with 4x CPU + Slow 4G minimum and on a real low/mid Android when possible.

### F14 Images: format, size, decoding, loading, and memory
- Claim: Image bytes and decoded bitmap memory dominate mobile cost; set dimensions, size to display, lazy-load below the fold only, prioritise LCP image.
- Evidence (web): width/height on every `<img>` to prevent CLS; don't lazy-load likely-in-viewport/LCP images; Chrome loads lazy images when within 1,250 px (4G) / 2,500 px (3G or slower) of the viewport; in tests 97.5% of lazy images finished within 10 ms of becoming visible — web.dev lazy-loading — T1 — VERIFIED. `loading=lazy` Baseline High (Chrome 77, Firefox 121, Safari 16.4) — VERIFIED. `fetchpriority` Baseline 2024 (Chrome 101, Safari 17.2, Firefox 132) — MDN VERIFIED. `decoding="async"`: lets other content update while the image decodes; Baseline since Jan 2020; does not prevent empty-box flash (use `img.decode()` for swaps) — MDN VERIFIED. srcset/sizes are descriptive hints, browser decides — web.dev learn/images — VERIFIED (specific DPR/size numbers not in fetched text). Format guidance: prefer WebP/AVIF, vectors where possible — web.dev — VERIFIED (no savings % available from fetched page).
- Evidence (native memory): Bitmap memory = width x height x bytes/pixel (ARGB_8888 = 4); Android doc example 2592x1936 ≈ 19–20 MB; downsample with `inSampleSize`; use Glide/Coil — T1 — VERIFIED. iOS WWDC18 Memory Deep Dive — T1 — VERIFIED: memory is a function of dimensions not file size (2048x1536 JPEG: ~590 KB on disk, ~10–12 MB decoded); decoded buffers are dirty memory; use ImageIO `CGImageSourceCreateThumbnailAtIndex` to downsample without decoding full image (demo high-water 7.7 GB -> 93 MB); use `UIGraphicsImageRenderer` so masks use 1 bpp. Derived (my arithmetic): 1080x2400 full-screen RGBA ≈ 10.4 MB; a 12 MP 4000x3000 photo decoded ≈ 48 MB.
- Scope: universal (web delivery; native decode memory).
- Agent rule: IF `<img>` THEN always emit `width`/`height` (or `aspect-ratio`), `alt`, `decoding="async"`, `loading="lazy"` for below-fold only, `fetchpriority="high"` + no lazy for the hero/LCP; serve AVIF/WebP via `<picture>` with JPEG fallback and real `srcset`/`sizes`. IF native THEN decode at display size (Coil/Glide/Nuke/ImageIO), never load a full-res bitmap into a thumbnail, and cap in-memory image caches.

### F15 Fonts
- Claim: Font loading choice trades FOIT/FOUT/CLS. WOFF2 only; subset (`unicode-range`) especially CJK (10,000+ glyphs vs 100–1,000 Latin); variable fonts only when you actually use many weights; self-host with HTTP/2; preload sparingly; use `size-adjust` + override descriptors to match fallbacks.
- Evidence: web.dev font-best-practices — T1 — VERIFIED: optional = 100 ms block, no swap; swap = 0 block + infinite swap; block = 2–3 s; fallback = 100 ms block + 3 s swap; WOFF2 ~30% better than WOFF. optimize-cls — VERIFIED: `font-display: optional` + metric-override descriptors avoid relayout.
- Scope: Web/PWA (native: bundle fonts, avoid runtime download blocking first paint — MEMORY).
- Agent rule: IF custom web font THEN WOFF2, subset, `font-display: swap` (or `optional` for non-critical), `size-adjust`/ascent/descent overrides for the system fallback; prefer system UI font stack for app-like PWAs.

### F16 Third-party scripts, caching, offline, prefetching, bfcache
- Third-party: use async/defer, `preconnect`/`dns-prefetch` (100–500 ms saved on critical origins), lazy-load below-fold embeds, self-host where safe, facade heavy widgets — web.dev — T1 — VERIFIED (case numbers are self-reported T3).
- Service-worker strategies — web.dev offline-cookbook — T1 — VERIFIED: cache-first for versioned static assets; network-first for frequently updated content (drawback: slow-network waits); stale-while-revalidate for non-critical freshness (avatars); cache-then-network for feeds/timelines; network-only for non-GET/analytics.
- Offline-first (Android guide) — T1 — VERIFIED: local DB is source of truth, reads from local, writes local-first then sync; write strategies online-only (e.g., payments), queued (analytics), lazy (to-dos); last-write-wins sync; WorkManager for sync.
- Prefetch/prerender: Speculation Rules — T1 — VERIFIED: Chrome/Edge 109+ prerender, Chrome 121+ eagerness; Firefox none, Safari behind a flag; mobile "eager" = 50 ms after entering viewport, "moderate" = 500 ms after scroll stops; Chrome caps (10 immediate, 2 interactive prerenders) and respects Save-Data/energy saver; unsafe for logout/add-to-cart/side-effect URLs; MDN marks it not Baseline.
- bfcache — web.dev — VERIFIED: ~1 in 5 mobile navigations is back/forward; avoid `unload`, close connections, avoid `Cache-Control: no-store` where possible; bfcache restores count as instant LCP and reset CLS.
- Save-Data / Network Information: Chromium-only, "experimental"/not Baseline — MDN VERIFIED. Use as progressive enhancement only.
- Scope: Web/PWA (offline-first pattern is universal).
- Agent rule: IF PWA THEN default to cache-first for hashed static assets + stale-while-revalidate/cache-then-network for content; IF using Speculation Rules THEN use `moderate`/`conservative` eagerness and exclude mutating URLs; ALWAYS keep pages bfcache-eligible (`pagehide`, not `unload`).

### F17 Cost of blur / translucency / "glass" — real cost, weakly quantified in primary sources
- Claim: Backdrop/background blur samples many neighbouring pixels per pixel, forces offscreen render passes, and costs most when it covers large areas over content that changes every frame (scrolling). Cost scales with radius x area; stacking multiple blurred layers multiplies it. Hard official numbers are scarce.
- Evidence (official): Flutter `BackdropFilter` docs — T1 — VERIFIED: "relatively expensive, especially non-local like blur"; clip it to exactly the child's area; share a `BackdropKey` via `BackdropGroup` to combine multiple filters into one op; use `ImageFiltered` instead when you only need to filter one widget. Compose graphics docs — T1 — VERIFIED: setting a `RenderEffect` always forces an offscreen buffer; alpha<1 under `CompositingStrategy.Auto` also goes offscreen. Apple HIG Materials — T1 — VERIFIED: use Liquid Glass sparingly, only in the functional layer (bars, controls), not the content layer; behavior changes under Reduce Transparency/Increase Contrast. Chromium README — VERIFIED: filter and backdrop-filter are compositor-eligible (not "free").
- Evidence (platform support): `backdrop-filter` Baseline Low (Chrome 76, Edge 79, Firefox 103, Safari 18 unprefixed) — web-features VERIFIED. `prefers-reduced-transparency`: Chrome/Edge 119+ only, not Baseline — VERIFIED. Compose `Modifier.blur`/RenderEffect needs Android 12+ (API 31) and has no effect below (SNIPPET; Haze docs/issues); Chris Banes (T3, VERIFIED): platform blur progressive effect needs newer Android; Haze fallbacks translucent overlay on old Android; new platform backdrop API showed higher CPU frame times than Haze's source-based path in his benchmark.
- Evidence (weak/community): blog and GitHub issue reports of ~3.5 ms GPU time for `blur(18px)` on mid-range Android and of 78% -> 99% frames at 90 Hz after disabling backdrop-filter on a HUD (SNIPPET, T4). Use as "directionally consistent, not a rule." Liquid Glass battery/GPU claims in press (T4/T5) are contradictory and unreliable — not used.
- Corroboration/conflict: no T1 source gives a safe blur radius. Community heuristic "cap ~20 px on large surfaces, <=3–4 glass layers per viewport, never animate the blur radius" is T4 opinion.
- Scope: universal.
- Context (when it flips): Flagship GPUs (A17 Pro/M-series, recent Snapdragon/Tensor) handle a couple of small blurred bars fine. Risk is mid/low-end Android and full-screen blurs over scrolling content.
- Agent rule: IF using blur/glass THEN limit to 1–2 small chrome surfaces (nav/tab bar, sheet scrim), not per-card; keep blur static (animate opacity/transform of the surface, not radius); give an opaque (or high-alpha) fallback when `prefers-reduced-transparency`, Reduce Transparency, battery saver, or old Android; verify on a mid-tier device with profiler.
- Stack notes: Web `@supports (backdrop-filter: blur(1px))` + solid fallback; Flutter `ClipRect`+`BackdropFilter`+`BackdropGroup`; Compose prefer Haze/platform `blur` guarded by API 31/33 and fall back to scrim; SwiftUI use system materials/`glassEffect` rather than custom blurs.

### F18 Shadows, gradients, clipping, transparency, overdraw
- Android overdraw doc — T1 — VERIFIED: Debug GPU Overdraw colors (none=0x extra, blue=1x, green=2x, red=3x+; blue is typically fine, investigate red); remove hidden backgrounds; set window background and leave containers transparent; transparency (alpha) is a major overdraw source — prefer an already-translucent color over `Modifier.alpha` on opaque content; on low-end devices focus first on UI-thread work; flattening view hierarchies is no longer a performance requirement in Compose (single-pass layout).
- Core Animation guide (archived) — T1 — VERIFIED: set `shadowPath` explicitly (lets CA cache the shadow); mark layers opaque when possible; simplify CAShapeLayer paths; integral layer sizes; measure with Instruments. (Archive is old; the principle of offscreen render avoidance still holds, but exact triggers may differ on current iOS — MEMORY.)
- Flutter best-practices — T1 — VERIFIED: `saveLayer()` is one of the most expensive operations (offscreen buffer + render-target switch); avoid `Opacity` in animations (use `AnimatedOpacity`/`FadeInImage`); for static shapes/text apply alpha to the color; clipping is cheaper than Opacity but avoid `Clip.antiAliasWithSaveLayer`; use `borderRadius` on decorations instead of clip widgets; `ShaderMask`/`ColorFilter` are costly; use DevTools "Render Clip/Opacity/Physical Shape layers" toggles.
- Compose compositing strategy — T1 — VERIFIED: alpha<1 under Auto creates an offscreen buffer; `ModulateAlpha` avoids it when children don't overlap.
- SwiftUI `drawingGroup()` — T1 — VERIFIED: flattens a subtree into one offscreen bitmap; won't render views composited by Core Animation (placeholder shown). Use to speed complex vector/blur stacks only after measuring.
- Web: box-shadow/blur animations repaint (web.dev animations guide, VERIFIED); `border-radius`+`overflow:hidden` clipping and large gradients: no authoritative cost number found (Gap); csstriggers data looked outdated.
- Scope: universal.
- Agent rule: IF styling cards/lists THEN use a single static elevation (no animated shadow blur), avoid per-item `Opacity`/`alpha` wrappers (apply alpha to color), avoid clip+shadow combos on every row, and don't stack full-screen translucent overlays.

### F19 Jetpack Compose: recomposition is the performance model
- Evidence: Compose performance/bestpractices — T1 — VERIFIED: `remember` expensive work (ideally move to ViewModel); give Lazy items stable `key`s (otherwise moves recompose everything below); `derivedStateOf` so rapidly-changing state (scroll offset) only triggers recomposition when the derived boolean changes; defer state reads with lambda modifiers (`Modifier.offset { }`, `drawBehind {}`); avoid backwards writes. Phases doc — VERIFIED: state read in composition re-runs all three phases, in layout only layout+draw, in draw only draw. Stability doc — VERIFIED: unstable params force recomposition when parent recomposes; `List/Set/Map` count as unstable; use immutable/kotlinx collections or `@Immutable/@Stable`; strong skipping default since Kotlin 2.0.20. Lists doc — VERIFIED: add `contentType`, avoid 0-px initial item size, don't nest same-direction scrollables, measure in release only. Performance page — VERIFIED: release build + R8 + Baseline Profiles required for realistic numbers; since Compose 1.9.0 Compose and Views reach the same jank rate (Android's claim). Tooling — VERIFIED: Layout Inspector recomposition counts; composition tracing in system traces first.
- Scope: Android/Compose.
- Context (flips): "Recomposition isn't bad, unexpected recomposition is" (tooling page paraphrase). With strong skipping many manual `remember` lambdas are unnecessary.
- Agent rule: IF Compose list THEN `LazyColumn(items(list, key = { it.id }, contentType = { it.type }))`; IF reading scroll/animation state THEN pass `() -> T` providers and use `graphicsLayer {}`/`offset {}`/`drawBehind {}`; IF a derived boolean from fast-changing state THEN `derivedStateOf`.

### F20 SwiftUI: dependency graph, body cost, identity, @Observable
- Evidence: Apple "Understanding and improving SwiftUI performance" — T1 — VERIFIED: bodies must compute before the next frame; expensive `body` (compute, sync I/O) => hitches; move work async + cache; Instruments SwiftUI template: orange >500 µs, red >1000 µs body updates; Update Groups lane finds many short updates; cause graph. WWDC23 Demystify SwiftUI performance — T1 — VERIFIED (transcript): pass views only the data they need (narrow dependencies); `@Observable` limits dependencies to properties actually read; List/Table need a constant number of views per ForEach element (no `if` or `AnyView` inside rows, filter data before ForEach), otherwise SwiftUI must build all rows; keep identifier generation cheap; avoid synchronous work in initializers of `@State`/`@StateObject` objects (use `.task`). Observation migration doc — T1 — VERIFIED: `@Observable` updates views only for properties read in `body`, versus any `@Published` change for `ObservableObject` (iOS 17+). `.offset` does not change layout size (View.offset doc, VERIFIED) — position-only geometry effects are cheaper than layout changes (consistency with F5). `LazyVStack` creates items only as needed (VERIFIED).
- Scope: iOS/SwiftUI.
- Agent rule: IF SwiftUI list THEN `List`/`LazyVStack` with stable `Identifiable` ids, one root view per row, pre-filter data, no `AnyView`; IF models THEN prefer `@Observable` (iOS 17+) and pass leaf views value slices; IF heavy work THEN `.task { await ... }` not in `init`/`body`.

### F21 Flutter
- Evidence: Flutter ui-performance + devtools — T1 — VERIFIED: UI thread (Dart, builds layer tree) vs raster thread (Skia/Impeller render); red bars mark frames >16 ms (8 ms for 120 Hz); profile mode on a real device, slowest target hardware; performance overlay (P key). Best-practices — VERIFIED: `const` constructors; localize `setState`; split widgets; avoid costly `build()`; builder-based lazy lists/grids (`ListView.builder`) and avoid concrete child lists; avoid intrinsic passes in big grids; avoid `operator ==` on widgets; don't put non-animating subtrees inside `AnimatedBuilder`; saveLayer/Opacity/Clip guidance in F18. Impeller (raw docs HTML re-fetched) — VERIFIED: precompiles a smaller shader set at engine build time to kill runtime shader-compile jank; default on iOS (only engine) and Android API 29+ since Flutter 3.27; Android falls back to GL below API 29/no Vulkan; web still Skia; macOS/Linux/Windows default as of "Flutter 3.47". DevTools marks shader-compilation frames dark red.
- Scope: Flutter.
- Agent rule: IF Flutter THEN set `CADisableMinimumFrameDurationOnPhone` for iOS (F2), run `flutter run --profile` on a mid-tier phone, use `ListView.builder` with `itemExtent`/`prototypeItem` where heights are uniform (MEMORY on those props), `const` widgets, and `RepaintBoundary` only where DevTools shows repaint cost (caches consume GPU memory).

### F22 React Native
- Evidence: RN performance doc — T1 — VERIFIED: two frame rates (JS thread: React logic; UI thread: native layout/scroll); JS thread blocked by heavy renders drops JS frames (example: a setState dropping ~12 frames/200 ms); dev mode is slow—measure release builds; remove `console.log` in prod; `getItemLayout` for FlatList; use `useNativeDriver`; animate scale instead of image width/height. Animations doc — VERIFIED: native driver historically limited to transform/opacity. Reanimated glossary — VERIFIED: worklets run on the UI thread; shared values drive animations without JS-thread involvement. Profiling doc — VERIFIED: Android Studio system trace/Perfetto, threads UI/JS (`mqt_js`)/native modules/RenderThread, VSync highlighting; Hermes profiler, React DevTools profiler; always dev mode off.
- Architecture facts (blog posts, T1, VERIFIED): New Architecture default since 0.76; Legacy Architecture frozen 0.80; 0.82 (Oct 2025) runs New Architecture only; 0.84 (Feb 2026) Hermes V1 default and legacy arch code removal begins; 0.85 (Apr 2026) experimental "New Animation Backend" (from 0.85.1) lets Animated native driver animate layout props (flexbox/position) and boosts Reanimated; 0.83 stabilized Web Performance APIs (Performance Timeline, User Timing, Event Timing, Long Tasks) usable in production. Hermes V1 early benchmark (Expensify, 0.82 post): Android low-end TTI -7.6%, iOS -2.5%. Conflict: the RN "new architecture" docs landing page still says legacy not removed — it is stale vs the 0.82/0.84 blog posts; trust the blog.
- FlatList knobs (RN doc, VERIFIED): defaults windowSize 21, maxToRenderPerBatch 10, initialNumToRender 10, updateCellsBatchingPeriod 50 ms; `removeClippedSubviews` default true on Android/false on iOS (can drop content); memoize `renderItem`/`React.memo` rows; stable `keyExtractor`; keep rows light; trade-off memory vs responsiveness vs blank areas. FlashList v2 (library docs, VERIFIED): requires New Architecture, no `estimatedItemSize`, recycling-based; benchmark claims not stated on the pages fetched.
- Scope: React Native.
- Context (flips): Before 0.85, "native driver can't animate width/height" was a hard rule; after it (experimental), layout-prop native animation exists but still re-lays out each frame natively — measure.
- Agent rule: IF RN list THEN use FlashList v2 (New Arch) or tuned FlatList (`getItemLayout`/`keyExtractor`/memoized rows); IF animation THEN Reanimated worklets/`useNativeDriver` on transform/opacity; IF jank THEN profile release build, check JS vs UI thread first.

### F23 Lists, memory, pagination: mechanisms agree, thresholds don't exist
- All stacks virtualize by default: Compose `LazyColumn`, SwiftUI `LazyVStack`/`List`, Flutter `ListView.builder`, RN `FlatList`/FlashList, web react-window — all VERIFIED above. Do not render full collections in `Column`/`ScrollView`/`VStack`/non-builder `ListView`.
- Memory caches: bound them (Android manage-memory page: LruCache sized to available heap; MEMORY for "1/8 of heap" rule — page did not state it in the fetched text); keep decoded images at display size (F14).
- Infinite scroll vs pagination (NN/g, T2, VERIFIED): infinite scroll fits homogeneous, goalless browsing (social/news); problems: unreachable footer, lost position on back, heavier load on constrained mobile networks, SEO; prefer "Load more" or pagination when users compare/refind items. Baymard page not retrievable (Gap). No performance-specific study found; the performance argument is: unbounded DOM/view growth => use windowing or cap with "Load more".
- Agent rule: IF unbounded feed THEN virtualization + restore scroll position on back + a "Load more"/page-size cap with preserved state; IF product list/search results THEN pagination or Load more (NN/g), not pure infinite scroll.

### F24 Perceived performance: response-time limits and when to show what
- Claim: ~0.1 s feels instant (no feedback needed), ~1 s keeps thought flow, ~10 s is the attention limit. Doherty (IBM 1982) proposed 400 ms as the interaction pace that keeps productivity up.
- Evidence: NN/g (Nielsen 1993, republished; and 2010 Website Response Times) — T2 — VERIFIED. NN/g progress indicators — T2 — VERIFIED: show feedback for anything >~1 s; <1 s none; 1–10 s looped spinner (optionally with text); >10 s percent-done with time estimate; never static "Loading…" text; University of Nebraska–Lincoln finding cited: people with a continuous progress bar were more satisfied and willing to wait ~3x longer on average. Laws of UX — T2/T4 — VERIFIED (secondary). Apple HIG Loading/Progress — T1 — VERIFIED: show something immediately (placeholders), let people do other things while loading, prefer determinate over indeterminate, keep indicators moving, don't jump from spinner to bar, avoid vague text like "loading", consistent position, allow Cancel/Pause where sensible; avoid showing 90% in 5 s then 5 min for the last 10%. Apple HIG Launching — VERIFIED: launch screen must closely mimic first screen, no logos/text/branding, restore previous state. Android splash — VERIFIED: no artificial delay, dismiss at first frame. Apple HIG Motion — VERIFIED: don't make people wait for an animation to finish, avoid motion on frequent interactions, make motion cancellable.
- Progress-bar design research: Harrison et al. UIST 2007 (SNIPPET) — 22 participants, 5.5 s bars; progress functions that speed up toward the end were judged faster than linear; those with pauses near the end were judged slower. Small sample, lab-only.
- Scope: universal.
- Agent rule: IF an action <100 ms THEN no indicator; 100 ms–1 s THEN immediate local feedback (pressed state, optimistic UI) but no spinner (or delay spinner ~300–400 ms to avoid flash — the delay value is my heuristic, MEMORY); 1–10 s THEN spinner/skeleton (see F25); >10 s THEN determinate progress + estimate + cancel + allow backgrounding.

### F25 Skeleton screens: helpful in some tests, harmful in others — use with conditions
- Evidence (for): NN/g Skeleton Screens 101 — T2 — VERIFIED: use for full-page loads under 10 s (2–10 s sweet spot; spinners also fit), skip when <1 s (flashing), never for downloads/uploads/conversions (use progress bars), avoid "frame-only" skeletons (user thinks site is broken), mismatch between skeleton and real layout erodes trust, shimmer animation can distract/annoy and has accessibility concerns; NN/g cites one peer-reviewed study (Mejtoft et al. 2018). Mejtoft 2018 — SNIPPET — skeleton page scored higher on perceived speed and ease of navigation, but spinner users found the article faster and differences were not statistically significant. Luke Wroblewski (T2/T3, 2013-era opinion with product anecdote from Polar) — VERIFIED: progress indicators draw attention to waiting; skeletons emphasize progress.
- Evidence (against): Viget 2017 — T3 — VERIFIED: 136 participants via animated GIF simulations of the same duration; perceived wait skeleton 2.82 s vs spinner 2.41 s vs blank 2.29 s; only 59% agreed it loaded quickly (spinner 74%); task time 10.54 s vs 9.49 s. Authors list caveats (novelty, familiarity, short waits) and call for more testing.
- Evidence level: weak/contested. No strong meta-analysis fetched. The two most-cited experiments point opposite ways; both are small and simulated.
- Scope: universal; product-specific (data-heavy lists/feeds vs short interstitials).
- Agent rule: IF the layout of the incoming content is known and load is 1–10 s THEN a content-shaped skeleton (same dimensions as final => zero CLS) is reasonable; IF unknown/short THEN keep prior content and show subtle inline pending state (React `useTransition` pattern) or nothing; IF >10 s THEN progress bar. Do not claim "skeletons always feel faster." Keep skeleton animation subtle, respect reduced motion, and keep shimmer period slow (no authoritative value; avoid flashing).

### F26 Optimistic UI and local-first reads
- Evidence: React `useOptimistic` — T1 — VERIFIED: shows temporary state during an Action and auto-reverts if it fails; use reducers for lists; mark per-item pending. Android offline-first — T1 — VERIFIED (reads from local, local-first writes, three write strategies; "online-only" for critical transactions such as bank transfers). Apple HIG loading — VERIFIED (show something right away).
- No controlled study fetched quantifying optimistic UI benefits (Gap); rationale is the 0.1 s/1 s limits (F24).
- Scope: universal.
- Context (flips): Do not apply optimistically to irreversible/financial/destructive actions; show explicit failure + undo/retry state.
- Agent rule: IF low-risk toggle/like/reorder/delete-with-undo THEN update UI immediately, persist async, revert + toast on failure; IF payment/transfer/irreversible THEN require server confirmation (determinate state).

### F27 Battery: refresh rate, animations, polling, wake locks, network, dark mode
- Android power guidance — T1 — VERIFIED: reduce/refactor/defer; WorkManager respects Doze and batches; minimize and promptly release wake locks; batch network; push (FCM) instead of polling; right-size location accuracy. Android background tasks — VERIFIED: do not poll, avoid timers/alarms for frequent work, no invisible foreground services, 10-min task limit; high-priority FCM may start foreground services. Play vitals thresholds exist for partial wake locks (>5% of battery sessions with partial wake locks totalling >3 h, beta) — VERIFIED. Android vitals issues list (wakeups, background Wi-Fi scans, background network) — VERIFIED. Android frame-rate doc — VERIFIED: higher refresh = more power; no guarantee your requested rate is granted; don't call `setFrameRate` every frame.
- Apple: ProMotion doc — VERIFIED: use lower refresh rates whenever possible, high rates = significant power. Energy Efficiency Guide (archived) — summarized principles reduce/defer/coalesce, avoid polling, coalesce network (radio tail ~20–30 s — MEMORY, summary only), prefer low-accuracy location, Energy Impact instrument.
- Dark mode on OLED: Purdue (Hu et al., MobiSys 2021; 4 phones: Pixel 2, Moto Z3, Pixel 4, Pixel 5; 6 apps; 60 s runs) — T2 — VERIFIED via ScienceDaily: dark mode saves 3–9% display power at 30–50% brightness, 39–47% at 100% brightness; brightness dominates; also lower brightness in light mode can draw the same power as higher brightness in dark mode. Google ADS 2019 claim (up to ~63% at max brightness for YouTube) — T3 — SNIPPET, vendor demo, treat as upper bound. Android docs list dark theme benefits without percentages — VERIFIED. Savings apply to OLED only (LCD ~none — MEMORY).
- Scope: universal (dark-mode numbers = OLED phones).
- Agent rule: IF user asks "does dark mode save battery" THEN answer: yes on OLED, small (single-digit %) at typical brightness, large only at very high brightness; do not make it the justification for pure-black UIs. IF background sync THEN WorkManager/BGTaskScheduler, push over polling, batch requests, no wake locks without release. IF continuous animation (loaders, Lottie, video backgrounds) THEN pause when off-screen/in background/low-power/reduced-motion.

### F28 Measurement playbook (what an agent should instruct)
- Web: field first (CrUX/PageSpeed Insights/`web-vitals` lib), then Lighthouse (mobile default 4x CPU, 150 ms RTT, 1.6 Mbps — VERIFIED) and WebPageTest on a real mid-tier Android (WebPageTest docs host failed TLS this session — Gap). Chrome DevTools Performance panel: CPU throttling, Calibrate presets for low/mid-tier, Live metrics (LCP/INP/CLS), FPS meter, Frames lane; Rendering tab: Paint flashing, Layer borders, Layout shift regions, Frame Rendering Stats, Scrolling Performance Issues — all VERIFIED. Throttle caveat: DevTools says it cannot truly simulate mobile CPU architecture. Older DevTools tutorial uses 4x for demos and mentions 20x for low-end (VERIFIED, dated); 6x as a common "low-end" setting is MEMORY.
- Android: Macrobenchmark (StartupTimingMetric, FrameTimingMetric; real device; non-debuggable release-like variant; Android 14+ recommended for full state persistence) — VERIFIED; JankStats in field; Perfetto/System Trace + Android Studio Janky Frames track; Profile GPU Rendering and Debug GPU Overdraw; Compose Layout Inspector recomposition counts + composition tracing; Baseline Profile generation via Macrobenchmark; Play vitals.
- iOS: Instruments (Animation Hitches, Hangs, SwiftUI template with Long View Body Updates, Time Profiler), Xcode Organizer (Hitches, Launch Time p50/p90, hangs), MetricKit (animation hitch ratio, launch metrics) — VERIFIED; Energy Impact instrument (MEMORY via archived guide). Test cold and warm launch; Apple notes launch spectrum varies, so test multiple device states.
- Flutter: `--profile` on real device, Performance Overlay, DevTools Performance (UI/raster, jank frames >16 ms red, shader compile frames dark red, Track widget builds/layouts/paints, layer toggles) — VERIFIED.
- RN: release builds only; Performance Monitor (UI/JS FPS), Hermes profiler, React DevTools profiler, Android system trace + Perfetto, Xcode Instruments — VERIFIED.
- Device class guidance: Android docs say emulators are not representative for Macrobenchmark and require real devices (VERIFIED); Flutter says profile on the slowest device you support (VERIFIED); Alex Russell: Galaxy A24-class device for web (VERIFIED). iOS: oldest supported iPhone + non-ProMotion + ProMotion model.
- Agent rule: ALWAYS state the measurement method with a target device class and build type; never claim "60 fps" from a simulator/debug build.

### F29 Effects with weak evidence in fetched sources (flagged)
- Lottie/After Effects, SVG filters, autoplay video, large gradients, border-radius+overflow clip on the web: no authoritative cost data retrieved (lottie.airbnb.tech docs are an empty JS shell via fetch; search budget exhausted). MEMORY-level guidance: Lottie masks/mattes/merge paths are the costly features and can force software/offscreen rendering; animate-forever and off-screen-playing Lottie/video burn CPU/GPU and battery; SVG `feGaussianBlur` on large regions is expensive and not GPU-friendly on every engine; autoplay video should be muted/inline/paused off-screen (`prefers-reduced-motion`, data saver). Agent should prefer CSS/native vector animation for simple loops, test Lottie on a mid-tier device, and cap duration/loop count.
- Android vector drawables (Android docs, VERIFIED): prefer vectors for icons/logos to cut APK size and density variants; no stated rasterization-cost numbers.
- Widget/DOM tree depth: Flutter/Compose/SwiftUI docs here do not give depth thresholds; Android says flattening is no longer required in Compose (F18); Lighthouse (web) reports max DOM depth and children but the fetched page cited only the 800/1,400 node thresholds.

---

## Numbers table (value | applies to | source | tag)

| Value | Applies to | Source | Tag |
|---|---|---|---|
| 16.67 / 11.1 / 8.33 ms | frame at 60/90/120 Hz | Android render vitals (rounds 16/11/8); Apple hitches doc (8.3 ms @120) | VERIFIED |
| ~10 ms of 16.66 ms usable | web main-thread work per 60 Hz frame | web.dev rendering-performance, RAIL | VERIFIED |
| 4–5 ms | compositing time target while scrolling/transitions | web.dev compositor-only | VERIFIED |
| 100 ms / 10 ms / 50 ms / 1000 ms (and 5 s load) | RAIL response / animation frame / idle chunk / load | web.dev RAIL (superseded by CWV) | VERIFIED |
| 50 ms | long task threshold | web.dev optimize-long-tasks | VERIFIED |
| LCP <=2.5 s good, >4.0 s poor | web, p75 | web.dev lcp | VERIFIED |
| INP <=200 ms good, >500 ms poor | web, p75 | web.dev inp | VERIFIED |
| CLS <=0.1 good, >0.25 poor | web, p75 | web.dev cls | VERIFIED |
| CLS excludes shifts within 500 ms of input; session window 1 s gap / 5 s max | web | web.dev cls/optimize-cls | VERIFIED |
| LCP split: TTFB ~40 / load delay <10 / load time ~40 / render delay <10 (%) | web | web.dev optimize-lcp | VERIFIED |
| DOM nodes warn ~800, error ~1,400 | web | Lighthouse docs / web.dev | VERIFIED |
| lazy-load distance 1,250 px (4G) / 2,500 px (3G) | Chrome | web.dev lazy loading | VERIFIED |
| 232 ms -> 30 ms render (7x) | content-visibility demo | web.dev | VERIFIED |
| 2.6 s -> 1.9 s LCP (Google Flights) | fetchpriority | web.dev | VERIFIED |
| 300–350 ms | legacy mobile tap delay removed by `width=device-width` | Chrome blog | VERIFIED |
| top-1% scroll time >400 ms -> ~250 ms | passive-by-default touch listeners | Chrome blog | VERIFIED |
| Lighthouse mobile: 4x CPU, 150 ms RTT, 1.6 Mbps/750 Kbps | web lab | Lighthouse throttling doc | VERIFIED |
| Lighthouse weights FCP10 SI10 LCP25 TBT30 CLS25 | web lab score | Lighthouse scoring (v10) | VERIFIED |
| Mid-tier mobile budget (2026): 3 s: 2.0 MiB total/0.3 MiB JS (JS-light) or 1.2 MiB/0.62 MiB (JS-heavy); 5 s: 3.7/0.57 or 2.3/1.15 MiB | web, Galaxy A24 4G class, 9 Mbps/100 ms RTT | Alex Russell | VERIFIED |
| Mobile median JS 680 KiB (P50), 1.3 MiB (P75) | web | Alex Russell 2026 | VERIFIED |
| Median mobile page ~2.1 MB; JS ~646 KB; images ~911 KB; fonts 122 KB; 15 image requests | web | Web Almanac 2025 | VERIFIED (summary) |
| Mobile CWV pass 48% (LCP 62, INP 77, CLS 81) | web | Web Almanac 2025 | VERIFIED (summary) |
| 0.1 s speedup: retail conv +8.4%, AOV +9.2%; travel conv +10.1% | mobile web, 37 brands | Deloitte/Google | VERIFIED (T3) |
| slow frame 16–700 ms; frozen 700 ms–5 s; ANR >5 s | Android | Android render vitals | VERIFIED |
| JankStats jank = 2x refresh interval (33.3 ms @60 Hz) default | Android | JankStats doc | VERIFIED |
| Cold start >=5 s, warm >=2 s, hot >=1.5 s = bad | Android vitals | Android launch-time doc | VERIFIED |
| Crash 1.09% (8% per device); ANR 0.47% (8% per device) = bad behavior | Android Play vitals | Play Console Help | VERIFIED |
| Partial wake locks >3 h in >5% battery sessions (beta) | Android Play vitals | Play Console Help | VERIFIED |
| Animated splash icon <=1000 ms; delayed start <=166 ms | Android 12+ | splash-screen doc | VERIFIED |
| Baseline Profiles ~30% faster code execution from first launch | Android | Android docs | VERIFIED |
| iPhone ProMotion 10–120 Hz; iPad Pro 24–120 Hz | iOS | Apple ProMotion doc | VERIFIED |
| Hitch rate <=10 / <=25 / <=50 / >50 ms/s = good/warn/critical/act now | iOS Organizer | Apple hitches doc | VERIFIED |
| Hang tools report at >250 ms; <100 ms rarely noticed | iOS | Apple hangs doc | VERIFIED |
| SwiftUI body >500 µs orange, >1000 µs red | iOS Instruments | Apple SwiftUI perf doc | VERIFIED |
| 8 ms build + 8 ms raster at 60 Hz | Flutter | Flutter best-practices | VERIFIED |
| FlatList windowSize 21, maxToRenderPerBatch 10, initialNumToRender 10, updateCellsBatchingPeriod 50 ms | RN | RN doc | VERIFIED |
| Bitmap bytes = w x h x 4 (ARGB_8888); 2592x1936 ≈ 19–20 MB | Android/iOS/any | Android doc; WWDC18 | VERIFIED |
| 0.1 s / 1 s / 10 s response limits | universal | NN/g | VERIFIED |
| Progress feedback: <1 s none; 1–10 s looped; >10 s percent-done | universal | NN/g | VERIFIED |
| 400 ms Doherty threshold | universal | Laws of UX (IBM 1982) | VERIFIED (secondary) |
| Dark mode OLED saves 3–9% @30–50% brightness; 39–47% @100% | OLED phones | Purdue/ScienceDaily | VERIFIED |
| WOFF2 ~30% smaller than WOFF; font-display optional block 100 ms | web | web.dev fonts | VERIFIED |
| Speculation Rules: 10 immediate + 2 interactive prerender caps; mobile eager = 50 ms in viewport | Chrome | Chrome docs | VERIFIED |

Where numbers disagree: Hitch thresholds (Organizer 10/25/50 ms/s field vs a lab stricter 5/10 ms/s I could not verify); throttling (Lighthouse 4x vs old DevTools tutorial 20x vs "6x low-end" folk); frame budget (16.67 nominal vs ~10 ms usable on web); Android doc rounds 16/11/8, exact 16.67/11.11/8.33.

## Comparison tables

### Animation approach (pattern | strength | weakness | best use | avoid when)
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| CSS transform/opacity (transition/animation, WAAPI) | compositor-thread, immune to JS jank (T1) | only moves/fades/scales | press feedback, sheets, drawers, toasts | you need real layout reflow of siblings |
| FLIP (measure, invert, play) | animates layout change via transform | needs JS measure; layout once | list reorder, expand/collapse | many items (measure cost) |
| Animating width/height/top/left | simple | layout+paint every frame (T1); Chrome 144 partial relief only when values don't change | rare, small | any scroll/gesture-linked motion |
| CSS scroll-driven animations | no scroll listeners | not Baseline (no Firefox); fallback needed | reveal/parallax/progress | must-work on all browsers without fallback |
| View Transitions | cross-state morphs w/ little code | Baseline Low; DOM update still blocks | route/list↔detail | slow DOM updates; reduced motion not honored |
| RN Animated `useNativeDriver` / Reanimated worklets | UI thread, no JS involvement | layout props limited (until 0.85 experimental) | gestures, transforms | JS-only logic per frame |
| Compose `graphicsLayer` / lambda modifiers | skips composition/layout | needs lambda discipline | scroll/gesture-linked, alpha/scale | size animations that must reflow |
| SwiftUI `.offset/.scaleEffect/.opacity` | geometry effects, no layout change | still main-thread body diffing | most UI | complex animated subtrees (use drawingGroup after measuring) |

### Blur / translucency (pattern | strength | weakness | best use | avoid when)
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| System material (UIVisualEffectView/Liquid Glass, M3 surfaces) | OS-optimized, adapts to accessibility settings | still GPU cost; design guidance says sparingly | nav/tab bars, sheets | content-layer cards |
| Custom CSS `backdrop-filter` | one-liner, Baseline Low | cost scales with radius x area, repaints on scroll | small sticky header with `@supports` fallback | full-screen, many layers, mid/low-end Android |
| Flutter `BackdropFilter` (+`BackdropGroup`) | shareable key combines passes | "relatively expensive" (T1) | 1–2 overlays, clipped | full-screen, inside `Opacity` |
| Compose `Modifier.blur`/Haze | API 31+ RenderEffect; Haze fallbacks | no-op/stale on old Android; offscreen buffer | foreground blur, glass bars | API <31 without fallback |
| Solid/high-alpha surface + subtle border | cheapest, accessible | less "premium" | default, low-end fallback | n/a |

### Loading feedback (pattern | strength | weakness | best use | avoid when)
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| No indicator | zero noise | none <~1 s only | <1 s | >1 s |
| Spinner/activity (looped) | simple, shows liveness | no duration info | 1–10 s unknown | >10 s or known duration |
| Skeleton | preserves layout/CLS; shows structure | mixed evidence (F25); mismatch erodes trust | full-screen loads 1–10 s with known layout | <1 s; uploads/downloads; unknown layout |
| Determinate progress bar | best satisfaction/wait tolerance (NN/g) | needs real progress; avoid stalls | >10 s, uploads, conversions | tiny waits |
| Optimistic update | feels instant | needs rollback/undo | low-risk writes | financial/irreversible |
| Keep stale content + pending hint | no flash/empty state | stale data risk | refreshes, tab switches | first load |

### Service-worker caching (strategy | strength | weakness | best use | avoid when)
| Strategy | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Cache-first | instant, offline | stale unless versioned | hashed static assets, fonts | frequently changing data |
| Network-first | fresh | slow on bad network | news/article body | flaky mobile networks without timeout |
| Stale-while-revalidate | instant + eventual fresh | one-visit staleness | avatars, non-critical data | must-be-current data |
| Cache-then-network | instant + update | needs page coordination | feeds/timelines | simple pages |
| Network-only | correctness | no offline | analytics, POST | read content |

## Rule catalog (rule | evidence strength | scope | flips when)
| ID | Rule | Strength | Scope | Flips when |
|---|---|---|---|---|
| R1 | Animate transform/opacity; avoid layout-affecting properties during motion | Strong (T1 x3: web.dev, Chromium, Lighthouse) | Web, RN, Compose, SwiftUI | Chrome 144+ unchanged-size case; Compose/SwiftUI layout anims on small subtrees cheap enough; RN 0.85 experimental layout native driver |
| R2 | Do per-frame work in compositor/UI thread, not JS main thread | Strong | all | trivial work |
| R3 | `will-change` only transiently | Strong (MDN, web.dev) | Web | element animates constantly and is small |
| R4 | Use release/profile builds on real mid-tier devices to judge perf | Strong (Android, Flutter, RN docs) | native/cross | n/a |
| R5 | Feedback within ~100 ms of input; handlers <50 ms | Strong (Apple, web.dev, NN/g) | universal | n/a |
| R6 | Images: dimensions set, sized to display, lazy only below fold, LCP prioritized | Strong (web.dev/MDN) | Web | native decode at display size equivalent |
| R7 | Decoded bitmap memory = w x h x 4 — downsample | Strong (Android, Apple) | native | wide-color 8 bpp doubles it |
| R8 | Virtualize/lazy-build long lists | Strong for mechanism, none for threshold | all | tiny static lists (<~tens of rows) not worth it (heuristic) |
| R9 | Limit blur/backdrop and translucent layers on mobile | Moderate (T1 says "expensive"/"sparingly", no numbers) | all | flagship-only, small bars |
| R10 | Don't animate blur radius / shadow blur | Weak-moderate (T1: shadows/blurs repaint; magnitude from T4) | Web, native | static (non-animated) usage fine |
| R11 | Use `content-visibility:auto` for long off-screen sections | Moderate-strong (T1 + demo; Baseline Low) | Web | content needs find-in-page/anchors before render; Safari <26 |
| R12 | Skeletons only for known-layout 1–10 s loads | Weak (contested studies) | universal | very short waits |
| R13 | Prefer determinate progress for >10 s | Strong (NN/g, Apple) | universal | unknowable duration |
| R14 | Restore state + launch screen mimics first screen; no artificial splash delay | Strong (Apple HIG, Android) | native | n/a |
| R15 | Prefer push over polling; batch network; WorkManager/BGTask | Strong (Android/Apple) | native, PWA (push) | n/a |
| R16 | Keep refresh-rate requests modest; don't force 120 Hz for static UI | Strong (Apple, Android) | iOS/Android | games/pro motion content |
| R17 | Don't disable zoom for "perf" (viewport tricks) | Strong (MDN a11y warning; modern viewport removes delay) | Web | n/a |
| R18 | Compose: stable keys, derivedStateOf, lambda modifiers; SwiftUI: narrow dependencies, constant views per row; Flutter: const + localized setState | Strong (T1 each) | per-stack | after Compose strong skipping some manual work redundant |
| R19 | Dark mode is a minor battery lever on OLED at normal brightness | Strong (peer-reviewed) | OLED | max brightness outdoors |
| R20 | Pause/stop off-screen or backgrounded animation/video | Moderate (Apple/Android power docs; no numbers) | all | n/a |

## Anti-patterns found (problem -> why it happens -> better alternative -> source)
- Global `will-change`/`translateZ(0)` on everything -> layer explosion, GPU memory, slower low-end -> apply only before animating; remove after -> web.dev compositor, MDN.
- Animating `top/left/width/height/box-shadow` for UI motion -> layout/paint every frame -> transform/opacity or FLIP -> web.dev animations guide.
- Reading layout (`offsetHeight`) inside loops that write styles -> forced synchronous layout -> batch reads then writes -> web.dev layout-thrashing.
- `scroll`/`touchmove` listeners that aren't passive -> scroll waits on JS -> `{passive:true}` or `touch-action` -> Chrome scrolling intervention.
- `user-scalable=no` to remove tap delay (legacy trick) -> breaks zoom/a11y; unnecessary since 2014/2016 -> `width=device-width` + `touch-action: manipulation` -> Chrome 300 ms post, MDN.
- `loading="lazy"` on the hero image -> delays LCP -> eager + `fetchpriority=high` -> web.dev optimize-lcp.
- Missing `width`/`height` on images, late-injected banners above content -> CLS -> reserve space/aspect-ratio/skeleton same size -> web.dev optimize-cls.
- Shipping hundreds of KB of JS framework to render static content -> main-thread budget on mid-tier Android -> reduce/split JS; budget table F13 -> Alex Russell.
- Huge DOMs (>1,400 nodes) with no windowing -> slow style/layout/INP -> virtualize or `content-visibility` -> Lighthouse, web.dev.
- Full-viewport blur panels over scrolling content; stacking many glass layers -> GPU fill/bandwidth -> small static chrome surfaces, opaque fallback -> Flutter docs (expensive), Compose docs (offscreen), HIG (sparingly).
- Wrapping many items in Flutter `Opacity`/`Clip.antiAliasWithSaveLayer`/`ShaderMask` -> saveLayer per frame -> color alpha, `AnimatedOpacity`, borderRadius decoration -> Flutter best-practices.
- Android `Modifier.alpha` over opaque content, hidden full backgrounds -> overdraw/offscreen -> alpha in color; remove backgrounds -> Android overdraw doc.
- Compose: unkeyed lazy items, reading scroll state in composition, `List<T>` params treated unstable, sorting in composable body -> mass recomposition -> keys, lambda reads, immutable collections, `remember`/ViewModel -> Compose docs.
- SwiftUI: `AnyView`/`if` inside `ForEach` rows, heavy work in `body`/`init`, whole-struct dependency -> all rows built, hitches -> constant views/row, `.task`, pass slices, `@Observable` -> WWDC23, Apple docs.
- RN: dev-mode perf judgments, `console.log` in prod, un-memoized FlatList rows, JS-driven per-frame animation -> JS-thread frame drops -> release builds, memoize, Reanimated/native driver -> RN docs.
- Decoding full-res photos for thumbnails (Android/iOS) -> hundreds of MB, OOM/jetsam -> downsample (ImageIO, inSampleSize/Coil) -> Android docs, WWDC18.
- Polling timers, exact alarms, wake locks held across work -> battery, Play vitals flags -> push, WorkManager, release wake locks -> Android power docs.
- Artificial splash delays / branded launch screens -> perceived slowness -> launch screen = first screen; dismiss at first frame -> Apple HIG, Android splash doc.
- Static "Loading…" text, spinner for a known >10 s task, bar that sticks at 90% -> uncertainty/abandonment -> determinate with even pacing -> NN/g, Apple HIG.
- Skeleton for <1 s loads or unknown layouts -> flicker/mismatch -> no indicator or inline pending -> NN/g.
- Making users wait for decorative animation before acting -> perceived latency -> allow interrupt, short, skippable -> Apple HIG motion.
- Speculation Rules `prerender` on state-changing URLs / `immediate` eagerness everywhere -> wasted data/battery, side effects -> `moderate`/`conservative`, exclude mutating routes -> Chrome docs/MDN.
- `unload` handlers / `no-store` everywhere -> kills bfcache -> `pagehide` -> web.dev bfcache.

## Disagreements & weak-evidence zones
1. Skeleton vs spinner: NN/g recommends skeletons for full-page <10 s loads, citing a study whose own results were not significant (Mejtoft SNIPPET); Viget found the opposite on perceived time (n=136, simulated GIFs). No large field experiment found. Evidence level: weak. Say "conditional", not "always".
2. Compositor-only set: web.dev says transform+opacity only; Blink says transform, opacity, filter, backdrop-filter; Chrome 144 adds a width/height special case; Firefox/Safari differ. Rule of thumb stands, but engines are converging toward more cases.
3. Blur cost: all T1 sources call it expensive, none gives a safe radius/area. Numbers circulating (3.5 ms GPU, "cap 20 px") are T4. Press claims about Liquid Glass battery drain conflict (1% vs 13%); not trusted.
4. Hitch thresholds: Organizer field bands (10/25/50 ms/s) vs unverified lab bands (5/10). Clarify which context when quoting.
5. Throttling: Lighthouse says 4x ≈ mid-tier; DevTools cautions it cannot emulate mobile CPUs; calibrated presets recommended. Use real devices for decisions near thresholds.
6. RN docs landing pages lag the blog (legacy arch "not removed" vs removed in 0.82). Trust dated blog posts.
7. Virtualization threshold: no authoritative N. Lighthouse node counts are the only official proxy.
8. Web.dev RAIL is labeled superseded by Core Web Vitals but still the only explicit "10 ms of 16.66 ms" statement; INP's 200 ms is not an animation budget.
9. Business-impact stats (Deloitte, BBC, Vodafone, 53% abandonment at >3 s folklore) are vendor/case-study evidence; the 53% figure was not re-verified (Think with Google page redirected) — do not cite it.
10. Dark-mode battery: Purdue (peer-reviewed, 4 Pixels/Moto, 60 s tests) vs Google's 2019 higher claims (vendor, max brightness); real savings depend on brightness and app palette.

## Gaps (what I could not verify)
- Play Console slow-rendering / frozen-frame "bad behavior" percentages (page fetched lists only crash/ANR/wake lock thresholds) — do not assert numbers.
- WWDC20 Instruments hitch bands (5/10 ms/s) and WWDC19 launch target (400 ms) — MEMORY only; Apple's own current doc gives Organizer bands only.
- Lottie cost model, SVG filter cost, autoplay video guidance, large-gradient and border-radius+overflow clip costs on web — no authoritative sources fetched (search budget exhausted; Lottie docs are a JS shell).
- Exact blur radius/area safe limits; Android `Modifier.blur` official API-level text (relied on Haze/Chris Banes + snippet: API 31+).
- Compose "1/8 of heap" cache rule, Flutter `itemExtent`/`prototypeItem`, DevTools "6x" low-end preset, iOS radio tail 20–30 s — MEMORY.
- Whether CSS scroll-driven animations run on the compositor in all engines (MDN page silent) — MEMORY.
- Baymard infinite-scroll/pagination data (page paywalled/empty); ACM Mejtoft paper full text (403); Harrison UIST 2007 full text (snippet only).
- React Compiler stability/version (docs page excerpt didn't state); Web Almanac page-weight YoY inconsistency (summary said +8.4% vs 2.4 MB median, headline median 2,164 KB) — use headline numbers with caution.
- Real-world frame-budget guidance for web at 120 Hz (no authoritative doc; RAIL's 10 ms is 60 Hz-based).
- WebPageTest official docs host failed TLS; used no WPT-specific numbers.
