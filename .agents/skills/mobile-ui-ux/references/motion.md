# Motion design and micro-interactions

Read this when: adding any animation, transition, micro-interaction, haptic, loader or celebration; choosing durations/easing; implementing reduced-motion behavior; reviewing "does this animation earn its cost?".

Goal: smooth, purposeful, lightweight motion. Motion is a communication channel for orientation, feedback and status, never wallpaper.

Provenance tags: `[S]` sourced number (primary docs/NN/g) · `[D]` derived from sourced ranges · `[O]` opinion/convention with no authoritative number · `[P-iOS]` `[P-AND]` platform. Research date 2026-10-06. m3.material.io was unreachable; Material values come from Compose/Material Components source code, which is the better authority where the docs tables are stale.

Contents: 1 The three jobs of motion · 2 Timing laws · 3 Token table (tech-agnostic) · 4 Springs vs tweens · 5 Transition patterns · 6 Micro-interaction specs · 7 Page/state transitions · 8 Gesture-driven motion · 9 Haptics · 10 Loading motion · 11 Celebration/Lottie · 12 Reduced motion · 13 Performance coupling · 14 Anti-patterns · 15 Evidence limits

---

## 1. The three jobs of motion (tag every animation with one)

| Class | Job | Rules |
|---|---|---|
| **Functional** | Orientation, continuity, hierarchy: where something came from/went, what changed, what is interactive (navigation direction, list→detail, reorder, expand/collapse) | Allowed on repeat use, but keep short. |
| **Feedback** | Acknowledge, succeed, fail, progress (press state, toggle, completion, validation) | Fast (< 150 ms), small, local to the trigger, with a non-motion backup (text, icon, haptic). |
| **Decorative** | Personality/delight (onboarding hero, milestone celebration, branded loader) | Rare, earned, skippable, off under Reduce Motion, never on the critical path, never blocks input; at most one per screen; plays once or ≤ 5 s `[D]`. |

Agent rule: before writing an animation, name its job in a comment or spec. If it is decorative, justify it in one line or cut it. If an action fires more than a few times per session, shrink the motion to near nothing (HIG: avoid motion on frequent interactions). `[P-iOS][R]`

What animation is good for (NN/g): clarifying relationships (dependent fields appearing in place), explaining state changes, confirming direct manipulation, keeping object constancy when an object persists and moves or reshapes. Cause-effect only registers if the effect starts within 0.1 s of the action. Peripheral motion (edge slide-ins) forces involuntary attention shifts; slow in-place fades are far less distracting. Repeated animations become roadblocks. `[R]`
Research caution: evidence for animated transitions helping comprehension comes mostly from data-visualization experiments (Heer & Robertson 2007, Bederson & Boltman 1999; abstract-level only here); Tversky et al. 2002 found animation often fails to beat static graphics. Do not claim research backing for decorative motion. `[R-weak]`

## 2. Timing laws

1. **Duration ceiling.** Feedback ≈ 100 ms; partial-screen surfaces (menu, sheet, dialog, card expand) 200-300 ms; full-screen 300-400 ms; 500 ms is a hard ceiling for anything the user waits on. NN/g: 100-500 ms overall, 100-400 typical, checkbox/toggle ~100, modal 200-300, popup 300 in / 200-250 out; "far more common for animations to be too long than too short". Material 1: large mobile transitions up to 375 ms, > 400 "may feel too slow"; tablet +30%, wearable -30%. Atlassian: interactions 50-150, transitions 150-400. Carbon 70/110/150/240/400/700; Fluent 50-500. `[S]`
2. **Duration scales with distance/area traversed**, not with how important the animation feels (MDC, Fluent). No published formula. `[S]`
3. **Easing direction.** ENTER = decelerate (ease-out); EXIT = accelerate (ease-in); MOVE/RESIZE while visible = standard (ease-in-out); opacity/color = standard or linear; spinner/indeterminate loop = linear. Never linear for movement. Sources converge: NN/g, MDC, Carbon, Fluent, Polaris, Atlassian. `[S]`
4. **Exit faster than enter.** Observed exit/enter ratios 0.375-0.87 across sources (NN/g 200-250 vs 300; M1 195/225; MDC container transform 400/500; MDC fade 150/400). Default exit = 0.7 × enter (range 0.5-0.85). `[D]`
5. **Stagger** ≤ 20 ms per item, don't wait for each item to finish, total cascade ≤ 500 ms including item duration (Material 1; Carbon). Only stagger what appears on first view; never on repeat visits or refreshes; cap so the last item starts within ~100 ms of the first. Staggering many elements lengthens the interaction. `[S][D]`
6. **Never block input.** Do not make people wait for an animation; make motion cancelable/interruptible (HIG; M1). UIKit `UIView.animate` disables interaction on animated views unless `.allowUserInteraction` is passed, and without `.beginFromCurrentState` in-flight animations finish before the new one starts. `[P-iOS]`
7. **Respond to touch instantly**: highlight on touch-down, confirm on touch-up, allow cancel by dragging away (WWDC18 "Designing Fluid Interfaces"). `[P-iOS]`
8. **Mirror paths**: what leaves one way returns the same way; forward slides one direction, back reverses (HIG, WWDC18). `[P-iOS]`
9. Material long/extra-long tokens (450-1000 ms) are for full-screen or expressive moments only; productive UI stays ≤ 400 ms (reconciling M3 token range with NN/g and M1 ceilings). Note MDC source defaults for shared axis/fade-through/container transform enter are 450-500 ms: override to ≤ 400 for utilitarian apps. `[D]`

## 3. Token table (tech-agnostic; map to CSS custom properties, Compose `tween`/`spring`, SwiftUI `Animation`, Flutter `Duration`/`Curves`, RN Reanimated)

### Duration
| Token | Value | Use | Source support |
|---|---|---|---|
| `dur.instant` | 0 ms | Reduce Motion swap, snap states | Polaris 0; Atlassian reduced = instant |
| `dur.micro` | 100 ms | toggle, checkbox, press release, color change | NN/g ~100; M3 short2 100; Fluent 100; Carbon fast-02 110 |
| `dur.fast` | 150 ms | dropdown, menu, tooltip, fade out, small expansion | M3 short3; Carbon moderate-01 150; Atlassian dropdown 150 |
| `dur.base` | 250 ms | dialog, sheet, card expand, snackbar enter | M3 medium1; Carbon 240; Fluent 250; Atlassian modal 250; NN/g 200-300 |
| `dur.moderate` | 300 ms | medium surface moves, expansion | M3 medium2; Compose tween default 300; Carbon expansion 300 |
| `dur.large` | 400 ms | large/full-screen move (practical ceiling) | M3 medium4; Carbon slow-01; M1 ">400 too slow" |
| `dur.screen-max` | 500 ms | absolute ceiling; full-screen container/shared axis only | M3 long2; NN/g 500 "drag" |
| `dur.expressive` | 600-1000 ms | rare hero/celebration, never critical path | M3 long4-extra-long4 |
| `dur.exit-factor` | 0.7 × enter | all exits | derived |
| device scale | ×1.3 tablet / ×0.7 wearable | optional | M1 |

M3 full duration set: short1-4 = 50/100/150/200, medium1-4 = 250/300/350/400, long1-4 = 450/500/550/600, extra-long1-4 = 700/800/900/1000 ms. `[S]`

### Easing (cubic-bezier)
| Token | Value | Use |
|---|---|---|
| `ease.standard` | (0.2, 0, 0, 1) | on-screen move or resize (M3 standard; M3 "emphasized" is the same single Bezier in CSS/Compose; Android Views use a 2-segment path) |
| `ease.enter` | (0, 0, 0, 1) | entering (M3 standard-decelerate = Fluent decelerate-mid) |
| `ease.exit` | (0.3, 0, 1, 1) | exiting (M3 standard-accelerate) |
| `ease.enter-emphasized` | (0.05, 0.7, 0.1, 1) | hero entrance |
| `ease.exit-emphasized` | (0.3, 0, 0.8, 0.15) | hero exit |
| `ease.linear` | (0, 0, 1, 1) | spinner, indeterminate loop, alpha fade |
Legacy Material 2: standard (0.4,0,0.2,1), decelerate (0,0,0.2,1), accelerate (0.4,0,1,1). Carbon productive: standard (0.2,0,0.38,0.9), entrance (0,0,0.38,0.9), exit (0.2,0,1,0.9). `[S]`

### Springs (damping ratio / stiffness)
| Token | Values | Use |
|---|---|---|
| `spring.spatial.fast` | ζ 0.9 / k 1400 | switches, buttons, small elements |
| `spring.spatial.default` | ζ 0.9 / k 700 | sheets, drawers, partial-screen |
| `spring.spatial.slow` | ζ 0.9 / k 300 | full-screen |
| `spring.effects.fast/default/slow` | ζ 1.0 / k 3800 / 1600 / 800 | color and opacity: never overshoot |
| `spring.expressive.spatial` | default 0.8/380, fast 0.6/800, slow 0.8/200 | hero moments only |
| Apple | smooth (0.5 s, bounce 0), snappy (0.5, 0.15), bouncy (0.5, 0.3), `interactiveSpring(response 0.15, ζ 0.86)` | iOS |
Derived settling (unit mass, 2%): standard spatial fast ≈ 115 ms, default ≈ 165, slow ≈ 250; effects fast ≈ 95, default ≈ 145, slow ≈ 205. So the spring tokens sit in the same 100-350 ms window as the duration tokens. `[D]`
Policy: productive UI uses standard spatial springs (ζ 0.9) or a no-bounce spring. Bounce only when the driving gesture carried momentum or for a hero moment. Never put an overshooting spring on color or alpha.

### Choreography, loading, accessibility tokens
| Token | Value | Source |
|---|---|---|
| `stagger.step` | ≤ 20 ms | M1; Carbon |
| `stagger.max-total` | ≤ 500 ms | Carbon; cap beyond that is derived |
| `feedback.latency` | ≤ 100 ms touch → visible response | NN/g 0.1 s; WWDC18; HIG |
| `loop.max` | auto-play loop ≤ 5 s or provide pause | WCAG 2.2.2 |
| `flash.max` | ≤ 3 flashes/s | WCAG 2.3.1 |
| `rm.replace` | translate/scale/rotate/parallax/blur-in → opacity cross-fade ≤ 150 ms or instant; keep color, determinate progress; stop loops | HIG; MDN; Val Head; Atlassian |
| `press.scale` | 0.97-0.98 at most, optional | opinion `[O]`: one product's tokens (90 ms press, scale 0.98 card / 0.97 control), no platform number |
| M3 state layer opacity | hover 0.08, focus 0.10, pressed 0.10, dragged 0.16 | Compose `StateTokens.kt` |

## 4. Springs vs tweens

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Spring (bounce 0 / ζ 0.9-1) | Interruptible, velocity-continuous, no duration to tune | Settling time not exactly predictable | Any user-driven/interruptible state change: sheets, drags, toggles | Strictly choreographed timelines; web without a spring primitive |
| Spring with bounce | Reads physical; rewards gesture momentum | Playful; tiring when repeated | Swipe-to-dismiss with momentum; hero moments | Frequent actions, data-dense UI, color/opacity |
| Tween + cubic-bezier | Exact ms, easy to spec/test | Not velocity-continuous; restarts feel jerky | Fades, color, fixed choreography, web | Gesture-driven motion |
| Keyframes | Multi-stage pops, shake, draw | Costly to maintain, easy to overdo | Rare feedback moments | Anything frequent |

Apple model: springs are SwiftUI's default since iOS 17 (bare `withAnimation` = smooth spring). Duration is perceptual, not settling time; if unsure use bounce 0, ~0.15 slightly brisk, ~0.3 noticeably bouncy, above ~0.4 feels exaggerated for UI. Springs retarget mid-flight and keep velocity (tweens add up on interruption). Compose defaults: `tween` 300 ms; `spring()` damping 1.0 stiffness medium (1500); `animateItem` and `AnimatedVisibility` use stiffness 400. Reanimated `withSpring` defaults damping 120/stiffness 900/mass 4. `[P-iOS][P-AND][S]` For stacks without spring primitives (CSS), use the decelerate Bezier as the equivalent.

## 5. Transition patterns (Material names; the logic generalizes)

| Pattern | Use for | Avoid for | Defaults in Material source |
|---|---|---|---|
| Container transform | one item opens into its detail | items without a stable container | enter 500 / return 400 ms, emphasized |
| Shared axis (X/Y/Z) | forward/back, steppers, onboarding, spatial/sequence relationships | peer tabs | 450 ms, 30 dp slide + fade |
| Fade through | unrelated peer destinations (tabs, bottom nav) | hierarchical drill-in | 450 ms, incoming scale from 0.92 |
| Fade (+ scale from 0.8-0.92) | menus, dialogs, FAB in/out | full-screen change | enter 400 / exit 150 ms |
| Crossfade | Reduce Motion substitute | only orientation cue | n/a |
Flutter `animations` package: OpenContainer 300 ms; shared-axis slide ±30; fade-through scale 0.92; fade-scale 150 in / 75 out from 0.80. Because MDC defaults exceed the NN/g ceiling, override to ≤ 400 ms for productive UI. `[S][D]`
Agent rule: hierarchical drill-in = container transform or shared axis X; peer destinations = fade through with no lateral slide; dialog/menu/FAB = fade + scale with a much faster exit. Do not give every navigation the same slide. Fixed token set; pattern chosen by relationship.

## 6. Micro-interaction specs

Provenance: `[S]` sourced, `[D]` derived, `[O]` opinion. "RM" = Reduce Motion fallback.

| Interaction | Latency/duration | Easing/spring | Properties | Haptic | RM fallback | Provenance |
|---|---|---|---|---|---|---|
| Button press | visual response at touch-down < 100 ms; press-in ~70-90 ms; release 100-150 ms | fast spatial spring or decelerate | state layer 10% pressed; optional scale ≤ 0.97-0.98 from center | none for ordinary buttons | keep state layer/color, drop scale | latency `[S]`; 70 ms Carbon `[S]`; scale `[O]` |
| Toggle/switch | thumb 100-150 ms | fast spatial spring; color via effects spring | thumb translate + track color; no scale | light tick (iOS system toggles automatic; Android TOGGLE_ON/OFF) | instant jump + color | `[S]` NN/g ~100 ms; M3 Switch FastSpatial |
| Checkbox/radio | 100-150 ms | default spatial spring or standard | check stroke/fill, color | optional light | instant check | `[S]` |
| Favorite/like | 200-300 ms total | bounce ≤ 0.15-0.3 or standard tween | fill swap + brief pop 1→1.15→1 | light impact/selection | fill + color swap only, no pop | duration `[S]` NN/g; pop size `[O]` |
| Bookmark | as favorite without the pop | standard | icon fill + color, optional one-line confirmation | selection | fill swap | `[D]` |
| Copy | icon/label swap 100-150 ms; confirmation visible 1.5-2 s | fade | icon morph (copy → check) or "Copied" label | CONFIRM / success | same | Android 13+ shows a system confirmation: do not add a toast `[S]`; below 13 use Toast/Snackbar |
| Success | 200-300 ms | decelerate; check draw or fade | check + color | success notification / CONFIRM | instant check + text | `[D]`; no confetti for routine |
| Error | inline message 150-250 ms; if shake used 300-400 ms, 2-3 cycles, ~8-10 px | standard; sine/linear shake | message + icon + color + focus move | error / REJECT | no shake; color flash + message + haptic | HIG: never motion alone `[S]`; shake numbers `[O]` |
| Delete + undo | row exit 150-200 ms (fade + collapse); siblings reflow spring ~165-250 ms; undo snackbar visible long enough to read | accelerate on exit; spring reflow | opacity + height + translate | optional light impact on commit | instant removal + snackbar | `[S]` Compose `animateItem`; exit ms `[D]` |
| Expand/collapse | open 200-300 ms; close ≈ 0.7 × open | standard | height/clip + chevron rotate 180° + content fade lag ~50 ms | none | cross-fade or instant | Carbon 240/300 ms `[S]`; chevron/lag `[O]` |
| Tab indicator | slide ~165-250 ms | default spatial spring | indicator x/width; label color effects spring | selection (optional) | instant move + color | `[S]` M3 TabRow |
| Pull-to-refresh | threshold 80 dp; overshoot capped ~200% of threshold with decaying tension; settle 200-300 ms | rubber-band while pulling; standard on release | content translate + spinner | GESTURE_THRESHOLD_ACTIVATE at threshold | spinner only, no content translation | `[S]` M3 PullToRefresh |
| List insert/remove | insert ~250-300 ms; remove 150-200 ms | Compose default spring (stiffness 400) | opacity + translate | none | instant | `[S][D]` |
| Snackbar | enter 200-250 ms; exit 100-150 ms | enter decelerate; exit accelerate; fade + scale 0.8→1 | opacity + scale | none | fade only | recommendation `[D]`; MDC M3-theme default is 500/250 ms: override |
| Skeleton → content | cross-fade 100-200 ms | standard | opacity only; fixed layout to avoid shift | none | instant swap | `[D]` |
| Number change | 200-400 ms | standard; SwiftUI `contentTransition(.numericText)` | digit roll/cross-fade; tabular figures | none | instant swap | API `[S]`; ms `[O]` |
| Progress/loading | continuous | linear for indeterminate; determinate follows real progress | rotation/bar fill | none | static indicator + text | `[S]` Polaris, HIG even pace |
| Long-press | visual starts at touch-down; threshold ~400-500 ms | slow scale-down or ring | scale 0.97→0.95 or progress ring | LONG_PRESS at threshold | no scale | threshold from memory `[O]` |
| Drag pickup/drop | pickup 100-150 ms; track 1:1; drop settles with spring carrying release velocity | interactive spring (response 0.15, ζ 0.86) | scale 1.02-1.05 + shadow; translate | pickup light; drop light/soft impact | no scale; keep shadow | 1:1 tracking `[S]` WWDC18; scales `[O]` |

## 7. Page and state transitions

| Transition | Pattern | Timing | Provenance |
|---|---|---|---|
| Navigation push/pop (hierarchy) | shared axis X (forward left, back right), 30 dp slide + fade; iOS push slides from trailing edge; symmetric reverse on back | MDC 450 ms emphasized (override ≤ 400); iOS system default | `[S]` |
| Peer destinations (tabs, bottom nav) | fade through, scale 0.92→1 | 300-450 ms | `[S]` |
| Modal/dialog | fade (+ scale 0.8-0.92) in; faster out; close the first sheet before opening another | Atlassian modal 250 ms; MaterialFade 400 in / 150 out | `[S]` |
| Bottom sheet | spring (default spatial) or system sheet; predictive-back aware on Android; iOS: system detents | ~165-250 ms equivalent | `[S]` |
| Shared element/hero | container transform; iOS 18 zoom transition (continuously interactive; an interrupted push becomes a pop) | MDC 500/400; iOS system | `[S]` |
| Loading → loaded | skeleton/spinner then cross-fade | 100-200 ms | `[S]` NN/g |
| Empty → populated | fade in; no stagger on first load unless a few items | 150-250 ms | `[D]` |
| Disabled → enabled | color/opacity only, no movement | effects spring (~95 ms) | `[S]` |
| Error → success | cross-fade message + icon swap; not motion-only | 150-250 ms | `[D]` |
| Collapsed → expanded | see micro table | 200-300 ms | `[S]` Carbon |
| Inactive → active | indicator slide + color | ~165-250 ms | `[S]` |

## 8. Gesture-driven and platform motion

- **Apple fluid principles** (WWDC18): content tracks the finger 1:1; start tuning with no overshoot (100% damping); add bounce only when the gesture had momentum (tap to open = 100% damping, swipe-to-dismiss ≈ 80%); project momentum (velocity + deceleration rate) to choose the destination instead of nearest position; rubber-band at edges instead of hard stops; detect competing gestures from the start so no feedback is delayed; make motion interruptible and redirectable at any moment. `[P-iOS]`
- During drag use an interactive spring that retargets each change event; on release a normal spring continues with the preserved velocity. A swipe-driven dismiss must hand its velocity to the exit spring. `[P-iOS]`
- **iOS 26 Liquid Glass**: system morphing (buttons morph into menus/sheets, glass groups via `GlassEffectContainer`); prefer system components and transitions to custom tweens; test under Reduce Transparency/Reduce Motion; no official numeric durations exist for glass morphs. `[P-iOS]`
- **Android predictive back**: progress-driven, not time-driven. Full-screen exit scale 100→90%, incoming 110→100%, cross-fade at 35% progress (exit gone by 35%, enter begins at 35%), interpolator (0.1,0.1,0,1); shared-element variant x-shift (width/20 − 8) dp, min scale 90%, 8 dp edge margin, progress mapped through standard-decelerate (0,0,0,1). On commit finish from the current progress; on cancel return fast. Do not use raw linear progress. `[P-AND]`
- HIG motion: purposeful, optional, brief, realistic to the gesture direction, cancelable; never the only way to convey important information (supplement with haptics/audio). `[P-iOS]`

## 9. Haptics (motion's sibling)

- Pair haptics only with state changes the user caused and should notice: toggle, threshold crossed, success/error, snap into place, drop. Never on scroll, every list tap, or decorative animation. Short, consistent, causal, optional; respect the OS setting. `[P-iOS][P-AND]`
- iOS: notification (success/warning/error), impact (light/medium/heavy/rigid/soft; HIG example = a tap when a view snaps into place), selection (while values change). Android: `HapticFeedbackConstants`/Compose `HapticFeedbackType`: CONFIRM, REJECT, GESTURE_START/END, GESTURE_THRESHOLD_ACTIVATE, TOGGLE_ON/OFF, SEGMENT_TICK, LONG_PRESS, CONTEXT_CLICK; `performHapticFeedback` needs no VIBRATE permission. Web Vibration API is not Baseline (iOS Safari lacks it: memory): progressive enhancement only.

## 10. Loading motion (see states-feedback.md for the full loading ladder)

- Show nothing for sub-second waits; skeleton (full screen) or spinner (single module) for ~1-10 s; determinate bar beyond 10 s (NN/g). Skeleton shimmer or pulse "can be distracting, annoying, or create accessibility problems": keep it subtle and slow, stop after a few seconds, show a static placeholder under Reduce Motion, and give it an error/retry path by ~10 s. HIG: even out the pace of progress (90% in 5 s then 10% in 5 min feels deceptive); don't leave a blank screen. `[S][R]`
- Evidence for skeletons is mixed (Viget n=136 simulated test: skeleton felt slower than spinner or blank). Conditional, never "always better". `[R-weak]`

## 11. Celebration, Lottie, GIF

- Celebration only for rare, earned milestones (first completion, goal reached, purchase): one play, ≤ ~2 s, skippable, static under Reduce Motion. Routine actions get a small check, not confetti. NN/g's Asana example is occasional, not every time. `[R][D]`
- Prefer video or vector with a poster over GIF (web.dev example: GIF 3.7 MB vs MP4 551 KB vs WebM 341 KB); autoplaying loop video needs `autoplay loop muted playsinline`. Lottie size/CPU cost was not verified: test on a mid-tier device, cap loops, pause off-screen. `[S][H]`

## 12. Reduced motion (implementation summary; full rules in accessibility.md)

| Platform | Detect | Replace |
|---|---|---|
| Web/PWA | `@media (prefers-reduced-motion: reduce)` + `matchMedia` change listener (write the reduce rule after the default) | disable transform animations; keep opacity/color |
| iOS UIKit | `UIAccessibility.isReduceMotionEnabled`, `prefersCrossFadeTransitions`; observe `reduceMotionStatusDidChangeNotification` | fades instead of slides/zoom; tighter springs |
| iOS SwiftUI | `@Environment(\.accessibilityReduceMotion)` | `withAnimation(reduceMotion ? nil : ...)` |
| Android | `Settings.Global.ANIMATOR_DURATION_SCALE` (0 = off), `ValueAnimator.areAnimatorsEnabled()` (also false in Battery Saver) | skip non-essential; custom canvas/Lottie must check manually |
| Flutter | `MediaQuery.disableAnimations` (Android); iOS reduce motion is a separate `accessibilityFeatures.reduceMotion` flag | custom explicit animations check and skip/shorten |
| React Native | `AccessibilityInfo.isReduceMotionEnabled()`, `reduceMotionChanged`; Reanimated `reduceMotion` param defaults to System | as above |

Rule: with Reduce Motion on, no translate/scale/rotate/parallax/blur-in. Use an opacity cross-fade of 100-150 ms or an instant swap. Keep color changes, determinate progress and static state indicators. Stop auto-play loops. Add haptic/text for anything motion used to signal. Remove only what is a trigger; pinch-zoom stays. "Reduce" is not "none".

## 13. Performance coupling (detail in performance.md)

Animate `transform` and `opacity` only. Never animate width, height, top, left or margin on long lists or large surfaces; for expand/collapse of unknown height use the platform layout-animation primitive or FLIP. `will-change` transiently. RN native driver historically supports only non-layout properties. Large-area motion costs more both perceptually and in rendering. NN/g warns opacity can be expensive with many simultaneously changing elements on some platforms: keep concurrent animated elements few. If an animation misses frames on a mid-tier device, simplify it (shorter, smaller, fewer layers) before optimizing it.

## 14. Anti-patterns (problem → why → better)

- Bounce on everything → springs are fun, defaults copied from hero examples → bounce 0 by default; never on color/alpha.
- Parallax and page-load choreography → marketing-site habits → static layout; at most one in-place fade.
- Long fade-ins on data screens → "polish" → show data immediately; ≤ 100-150 ms crossfade.
- Animation blocks taps → `UIView.animate` default disables interaction; awaited modal transitions → `.allowUserInteraction`, retargetable springs, never await an animation for the next input.
- Skeleton shimmer forever → no timeout path → show after the first second, static after a few seconds `[H]`, error/retry after ~10 s.
- Confetti for routine actions → delight culture → one small check; save celebration for milestones.
- Auto-playing loops → Lottie/GIF as decoration → play once; pause control; static under Reduce Motion.
- No Reduce Motion fallback → forgotten → per-platform detection above.
- A different transition style on every screen → per-screen tinkering → fixed token set; pattern by relationship.
- Library default durations too long (e.g., M3 snackbar fade 500 ms) → override to 200-250 ms enter.
- Motion as the only signal (shake-only error, color-only success) → add text, icon, haptic.
- Slide-ins from the screen edge for system notices → attention-grabbing by design → slow fade, no position change.

## 15. Evidence limits

Unverified: Material's official size→duration table and snackbar 4-10 s guidance; Lottie size/CPU cost; iOS system timings (push, sheet, keyboard); Android long-press timeout (assumed 400-500 ms); whether Compose automatically follows "Remove animations" (Compose ≥ 1.2.0 per a snippet); authoritative numbers for press scale, shake amplitude, like-pop scale, drag-lift scale and skeleton minimum display time (all opinion here); Disney's 12 principles and UX-in-Motion principles (memory only). Heer/Robertson and Bederson/Boltman numerics were not readable.
