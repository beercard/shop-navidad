# Slice 03 — Motion design and micro-interactions for mobile

Researcher notes, 2026-10-06. Scope: purposeful, light motion. Not animation overload.

## Tag legend (read first)
- `VERIFIED-R`: I read the raw source this session (GitHub raw source files, Apple doc JSON, NN/g and Material 1 raw HTML text, Apple HIG JSON, WWDC transcripts). Highest confidence.
- `VERIFIED-F`: fetched through the WebFetch summarizer only, raw text not re-read. Medium confidence. The summarizer got one number wrong this session: it reported Android DynamicAnimation damping constants as 0.75/0.65/0.55 when the source says 0.2/0.5/0.75/1.0. Treat VERIFIED-F numbers as needing a recheck before they become hard rules.
- `SNIPPET`: search-result excerpt only.
- `MEMORY`: training knowledge, not re-verified.
- `DERIVED`: my arithmetic or synthesis from verified inputs. Assumptions are stated.
- `OPINION`: practitioner convention with no authoritative numeric source.
- Raw evidence files are in `/private/tmp/claude-501/-Users-numenide-Documents-skills-mobile-ui-ux/ea4152be-4b53-453b-a71b-e32e3c153c94/scratchpad/raw/` (prefix `03-`).
- WebSearch budget ran out mid-session, and the coordinator stopped the research. Unfinished topics are listed under Gaps.

## Sources consulted

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

---

## Findings

### F1 Duration ceiling for mobile UI is about 100–400 ms. Past 500 ms it feels like a drag.
- Claim: Feedback animations should be about 100 ms. Substantial screen changes are 200–300 ms. 400 ms is "very slow", for big movements only. Around 500 ms animations feel like a drag. Animations are far more often too long than too short.
- Evidence:
  - NN/g Executing UX Animations (https://www.nngroup.com/articles/animation-duration/), T2, VERIFIED-R: 100–500 ms overall, 100–400 ms typical, checkbox/toggle about 100 ms, modal 200–300 ms, popup 300 in / 200–250 out, "far more common for animations to be too long than too short".
  - Material 1 duration-easing (https://m1.material.io/motion/duration-easing.html), T1 legacy, VERIFIED-R: large and complex full-screen transitions up to 375 ms, enter 225, leave 195, over 400 "may feel too slow"; tablet +30%, wearable −30%; desktop 150–200 ms.
  - Material 1 material-motion, VERIFIED-R: large animations on mobile 300–400 ms, small 150–200 ms.
  - Atlassian, VERIFIED-F: interactions 50–150 ms, transitions 150–400 ms, dropdown 150, modal 250.
  - Carbon, VERIFIED-R: fast-01 70, fast-02 110, moderate-01 150, moderate-02 240, slow-01 400, slow-02 700 ms (slow-02 is used for background dimming).
  - Fluent tokens, VERIFIED-R: 50/100/150/200/250/300/400/500 ms.
  - Polaris, VERIFIED-R: 0–500 in 50 ms steps, plus 5000.
- Corroboration / conflict: M3 allows up to 1000 ms (extra-long4). MDC defaults use 450–500 ms for shared axis, fade through and container transform enter (see F5). That exceeds NN/g and M1 ceilings. Reconcile: M3 long and extra-long tokens are for full-screen or expressive moments only. Productive UI stays at or under 400 ms.
- Scope: universal.
- Context (when it flips): Full-screen container transforms or large distances can use 400–500 ms. Wearables are about 30% faster, tablets about 30% slower (M1).
- Agent rule: IF an animation is feedback on a control THEN 70–150 ms. IF it moves a partial-screen surface (menu, sheet, dialog, card expand) THEN 200–300 ms. IF it is a full-screen transition THEN 300–400 ms, and 500 ms is a hard ceiling. Never exceed 500 ms for anything the user waits on.

### F2 Easing direction: decelerate to enter, accelerate to exit, standard for on-screen moves. Never linear for movement.
- Claim: ease-out (decelerate) for entering, ease-in (accelerate) for exiting, ease-in-out or standard for moves that stay on screen. Linear is for continuous mechanical motion only (spinners, progress).
- Evidence:
  - NN/g, VERIFIED-R: ease-out on entrance lets the eye predict where the object stops. Ease-in on exit feels like accelerating away. Fully linear motion looks unnatural.
  - MDC Motion.md, VERIFIED-R: standard is "begin and end on screen", standard-decelerate "enter the screen", standard-accelerate "exit the screen". The emphasized variants follow the same split.
  - Carbon scss, VERIFIED-R: entrance, exit and standard curves in productive and expressive variants.
  - Polaris, VERIFIED-R: linear "for continuous and mechanical animations, such as rotating spinners".
  - Fluent, VERIFIED-R: decelerate, accelerate and easy-ease families.
  - Atlassian, VERIFIED-F: ease-out for entrance, ease-in practical for exit.
- Corroboration: Strong convergence. M3 standard-decelerate `cubic-bezier(0,0,0,1)` equals Fluent `curveDecelerateMid`. Same family as Carbon entrance (0,0,.38,.9).
- Scope: universal.
- Agent rule: ENTER = decelerate curve. EXIT = accelerate curve. MOVE or RESIZE while visible = standard curve. COLOR or OPACITY change = standard or linear (MDC uses linear for the fade alpha). SPINNER or INDETERMINATE LOOP = linear.

### F3 M3 easing tokens: exact values
- Claim: M3 easing tokens are the values below. In CSS and Compose, `emphasized` and `standard` are the same single Bezier. On Android Views, emphasized is a two-segment path interpolator.
- Evidence (all VERIFIED-R):
  - material-web tokens v0_192, Compose `MotionTokens.kt`, Flutter `motion.dart`, MDC `Motion.md`.
  - Android `m3_sys_motion_easing_emphasized` is a path interpolator (`pathData` string resource). MDC docs give `M 0,0 C 0.05,0, 0.133333,0.06, 0.166666,0.4 C 0.208333,0.82, 0.25,1, 1,1`.
- Values: see Numbers table N1.
- Context: Flutter exposes `Easing.emphasizedAccelerate/Decelerate`, `standard`, etc. Legacy M2 curves are kept as `legacy*` tokens: (0.4,0,0.2,1), decelerate (0,0,0.2,1), accelerate (0.4,0,1,1).
- Agent rule: Define emphasized-decelerate (0.05,0.7,0.1,1) for hero entrances and emphasized-accelerate (0.3,0,0.8,0.15) for hero exits. Use the plain standard trio for everything utilitarian.

### F4 M3 duration tokens and size-proportional duration
- Claim: 16 duration tokens, 50 to 1000 ms. Duration increases with the area or distance traversed. Small utility transitions use short, medium areas use medium, full screen uses long.
- Evidence:
  - MDC Motion.md, VERIFIED-R: "duration should increase as the area/traversal of an animation increases". Token list short1–4 = 50/100/150/200, medium1–4 = 250/300/350/400, long1–4 = 450/500/550/600, extra-long1–4 = 700/800/900/1000.
  - Compose `MotionTokens.kt`, VERIFIED-R: same numbers.
  - Compose `AnimationSpec.kt`, VERIFIED-R: default `tween` duration is 300 ms.
  - Search snippet that M3 says exit/dismiss/collapse use shorter durations: SNIPPET, m3.material.io unreachable.
- Agent rule: Pick the duration token by size of the thing that moves, not by how important the animation feels.

### F5 The four M3 transition patterns, with the defaults actually in code (and where the docs disagree)
- Claim: Container transform (a container becomes the next screen), shared axis (spatial or sequence relationship, X/Y/Z), fade through (unrelated peer destinations), fade (elements entering or leaving within screen bounds: menus, dialogs, FAB).
- Evidence (MDC source on master, VERIFIED-R):
  - MaterialContainerTransform: enter `motionDurationLong2` (500 ms), return `motionDurationMedium4` (400 ms), emphasized easing.
  - MaterialSharedAxis: `motionDurationLong1` (450 ms), emphasized, slide distance 30 dp (X/Y), Z uses scale, plus a secondary fade-through.
  - MaterialFadeThrough: `motionDurationLong1` (450 ms), emphasized, incoming scale starts at 0.92.
  - MaterialFade: enter `motionDurationMedium4` (400 ms) with emphasized-decelerate, exit `motionDurationShort3` (150 ms) with emphasized-accelerate, enter scale from 0.8.
  - Flutter `animations` package (VERIFIED-R): OpenContainer 300 ms; shared axis slide ±30; scaled axis 0.80; fade-through scale-in 0.92; fade-scale 150 ms in and 75 ms out, scale from 0.80.
- Conflict: The MDC `Motion.md` tables still list older defaults (300 ms, 250 ms outgoing, fade 150/75). They also pair the token name `motionDurationLong1` with "300 ms" although Long1 = 450 ms. The docs table is stale. Source code is the better authority.
- Scope: Android and Flutter (Material). The patterns generalize.
- Agent rule: Hierarchical drill-in (list to detail) = container transform or shared axis X. Peer top-level destinations (tabs, bottom nav) = fade through, no lateral slide. Dialog, menu or FAB appearing = fade (+ scale from 0.8–0.92), exit much faster than enter. Do not give every navigation the same slide.

### F6 M3 springs: spatial vs effects, standard vs expressive (official values)
- Claim: M3 now defines motion as springs with three speeds (fast, default, slow) and two types. Spatial springs move or resize things and may overshoot. Effects springs animate color or opacity and must not overshoot (damping 1.0). Speed is chosen by component size: small switches/buttons = fast, partial-screen (bottom sheet, nav drawer) = default, full-screen = slow. Two schemes exist. Standard is "basic motion scheme for utilitarian UI elements and recurring interactions". Expressive is "recommended for prominent UI elements and hero interactions".
- Evidence:
  - Compose `MotionScheme.kt` KDoc plus `StandardMotionTokens.kt` and `ExpressiveMotionTokens.kt`, VERIFIED-R. Values in Numbers N3.
  - MDC `Motion.md` "Springs" section, VERIFIED-R: six attributes, same standard values. Example: animate a button's shape with FastSpatial and its color with FastEffects.
  - Compose `MaterialTheme` default is `MotionScheme.standard()`. `MaterialExpressiveTheme` defaults to `expressive()`. VERIFIED-R.
  - Compose components use the scheme: Switch thumb = FastSpatial, TabRow indicator = DefaultSpatial, Tab content color = DefaultEffects/FastEffects, Checkbox = DefaultSpatial. VERIFIED-R.
- DERIVED (unit mass, 2% settling): standard fast spatial about 115 ms, default about 165 ms, slow about 250 ms. Expressive default about 250 ms (1.5% overshoot), fast about 230 ms (about 9.5% overshoot), slow about 345 ms (1.5% overshoot). Effects: fast about 95 ms, default about 145 ms, slow about 205 ms. This shows the token set sits in the same 100–350 ms window as the duration tokens.
- Not found: an official statement of how M3 Expressive research justified bounce. m3.material.io was unreachable.
- Scope: Android (Compose, Views via MDC), Flutter/web by analogy.
- Agent rule: Productive screens use standard-scheme values (damping 0.9) or a no-bounce spring. Use expressive overshoot only for hero moments. Never put a spatial (overshooting) spring on color or alpha.

### F7 Apple springs: duration and bounce model, presets, interruption
- Claim: Apple's model is perceptual `duration` plus `bounce`. Springs are SwiftUI's default animation since iOS 17. Presets: `.smooth` (bounce 0), `.snappy` (bounce 0.15), `.bouncy` (bounce 0.3), each with default duration 0.5 s. Springs preserve velocity from gestures and from interrupted animations.
- Evidence:
  - Apple doc JSON for `smooth/snappy/bouncy(duration:extraBounce:)`, VERIFIED-R: default duration 0.5, base bounce 0 / 0.15 / 0.3.
  - `spring(response:dampingFraction:)` defaults 0.5 / 0.825, VERIFIED-R. `interactiveSpring(response: 0.15, dampingFraction: 0.86, blendDuration: 0.25)`, "intended for driving interactive animations", VERIFIED-R. `easeInOut` default duration 0.35 s, VERIFIED-R.
  - WWDC23 10158, VERIFIED-R: if unsure, use bounce 0; around 15% is slightly brisker; around 30% is noticeable bounce; be cautious above about 0.4 because it feels exaggerated for UI; consistency matters; "duration" is perceptual and not the settling time, so don't wait on settling for user-facing logic. Springs retarget mid-flight and keep velocity, which makes interruptions feel smooth.
  - WWDC23 10156, VERIFIED-F: smooth spring is the default for bare `withAnimation` in iOS 17+. Springs merge on interruption while timing curves add up.
  - WWDC24 10145, VERIFIED-R: during a drag, each change event creates an `.interactiveSpring` that retargets the last one. On release, a normal spring continues with the preserved velocity. UIKit can now animate with SwiftUI Animation types.
- Corroboration: Android docs, VERIFIED-F: use springs for user-driven animations that may be interrupted. They guarantee velocity continuity. DynamicAnimation constants VERIFIED-R: damping 0.2 / 0.5 / 0.75 / 1.0, stiffness 50 / 200 / 1500 / 10000. Compose `Spring` adds StiffnessMediumLow 400 (VERIFIED-R).
- Conversion (transcript lists the formulas but the damping equation is ambiguous as shown): mass 1, stiffness = (2π/duration)². From these, damping ratio ζ = 1 − bounce for bounce ≥ 0 (DERIVED, not stated by Apple). So snappy ≈ ζ 0.85 and bouncy ≈ ζ 0.70.
- Scope: iOS, iPadOS, macOS, visionOS (SwiftUI/UIKit/Core Animation).
- Agent rule: Default every non-trivial state change to a spring, not a fixed-duration curve, wherever the platform offers it. For a no-spring stack (CSS), use the equivalent decelerate Bezier. Give springs bounce 0 unless the driving gesture carried momentum.

### F8 Apple's fluid-interface principles (response, redirection, rubber-banding, momentum)
- Claim:
  - Respond instantly to every touch, including taps and presses. Any added delay feels disconnected.
  - Let motion be interruptible and redirectable at every moment.
  - Mirror paths: what leaves one way should return the same way.
  - Soft edges: rubber-band instead of hard stops, and hand off between trackers on smooth curves.
  - Content tracks the finger 1:1 during a drag.
  - Start tuning with no overshoot (100% damping).
  - Add bounce only when the gesture had momentum in that direction (WWDC18: tap to open Now Playing = 100% damping, swipe-to-dismiss = 80% damping).
  - Project momentum (velocity plus scroll deceleration rate) to choose the destination, not just nearest position.
  - Highlight a button immediately on touch-down but confirm only on touch-up. Give the tap target extra margin. Allow cancel by dragging away.
  - Detect all competing gestures from the start so no feedback is delayed.
- Evidence: WWDC18 803 transcript, T1, VERIFIED-R (direct reading).
- Corroboration: HIG Motion, VERIFIED-R: "let people cancel motion", don't make people wait for an animation, and realistic motion follows gestures (reveal by sliding down means dismissing sideways is disorienting). UIKit docs, VERIFIED-R: `UIView.animate` disables user interaction on the animated views unless `.allowUserInteraction`. Without `.beginFromCurrentState`, in-flight animations finish before the new one starts.
- Scope: universal principles. The numbers are iOS.
- Agent rule: Never let an animation gate input. In UIKit pass `.allowUserInteraction` and `.beginFromCurrentState`, or use `UIViewPropertyAnimator`. In SwiftUI, tapping mid-animation must retarget. A swipe-driven dismiss must hand velocity to the exit spring.

### F9 iOS 18 / iOS 26: what changed
- Claim:
  - iOS 18 added the navigation zoom transition. It is continuously interactive, so the user can grab and drag it mid-transition. An interrupted push becomes a pop (the pushed view controller always reaches "appeared").
  - iOS 26 Liquid Glass adds fluid morphing animations. Buttons morph into menus, popovers and sheets. Dialogs morph out of their buttons. Custom glass can use `.interactive()` (scale, bounce, shimmer on touch). Glass groups morph via `GlassEffectContainer` and `glassEffectID`.
  - Half sheets expand and turn opaque when full height.
  - Apple states that translucency and morphing animations adapt to Reduce Transparency and Reduce Motion, and asks developers to test custom elements and animations under those settings.
- Evidence: WWDC24 10145 (VERIFIED-R); WWDC25 323 transcript (VERIFIED-R); Adopting Liquid Glass (VERIFIED-R).
- Not found: any official numeric duration or spring for Liquid Glass morphs.
- Agent rule: On iOS prefer system components and system transitions (zoom, sheet morph). Do not rebuild them with custom tweens. Keep custom glass or morph effects minimal, with a Reduce Motion fallback.

### F10 Android predictive back is a motion spec that follows the gesture
- Claim:
  - System animations on by default from Android 15 (developer option on 13–14). Cross-activity, cross-task and back-to-home are system-driven.
  - Custom in-app back must be progress-driven, not time-driven, via `PredictiveBackHandler` or `PredictiveBackProgress`.
- Evidence (VERIFIED-R, Android design page):
  - Full-screen exit scale 100% to 90%, incoming 110% to 100%.
  - Cross-fade at 35% progress: exit fades out by 35%, enter starts at 35%, so neither screen shows at that mark.
  - Interpolator `(0.1, 0.1, 0, 1)`.
  - Cancel returns swiftly.
  - Shared-element variant: x-shift ((screen width / 20) − 8) dp, y-shift ((height / 20) − 8) dp, min scale 90%, 8 dp edge margin, map progress through STANDARD_DECELERATE `(0,0,0,1)`. A subtle overshoot is suggested for tactility.
  - Do not use raw linear progress.
- VERIFIED-F (guide page): Android 16 adds a navigation-observer callback priority. `android:enableOnBackInvokedCallback` default true.
- Scope: Android.
- Agent rule: Android back must be interruptible. Drive transform and opacity from gesture progress through a decelerate curve. On commit, finish from the current progress, not from zero. On cancel, return fast.

### F11 HIG Motion: purposeful, optional, brief, cancelable
- Claim, paraphrased from HIG (VERIFIED-R): add motion purposefully; never make it the only way to convey important information (supplement with haptics or audio); realistic feedback that follows gestures; brief and precise feedback feels lightweight; avoid motion on frequent interactions; let people cancel; SF Symbols animations are a sanctioned lightweight option.
- Scope: iOS, iPadOS, macOS, tvOS, visionOS.
- Agent rule: Before adding an animation, name its job (orientation, feedback, status). If it fires more than a few times per session, shrink it to near nothing. Pair critical feedback with a non-motion channel.

### F12 When animation helps comprehension and when it hurts (NN/g)
- Claim:
  - Animation helps by clarifying relationships (dependent fields appearing in place), explaining state changes, and confirming direct manipulation. Cause-effect only reads if the effect begins within 0.1 s of the action.
  - Peripheral motion (slide-ins at screen edges) forces involuntary attention shifts. A slow fade with no position change is far less distracting.
  - Repeated animations become roadblocks ("nice the first time, but now it's getting annoying").
  - Fast transitions suit direct, user-triggered changes. Slower, no-position-shift transitions suit indirect or system-triggered ones.
  - Response limits: 0.1 s feels instant, 1 s keeps flow, 10 s is the attention limit. Under 0.1–1 s no special feedback is needed beyond the result. Over 10 s needs percent-done plus a way to interrupt.
- Evidence: NN/g animation-usability, response-times, animation-duration, microinteractions (all VERIFIED-R). NN/g cites Pratt et al. 2010, "It's Alive!", Psychological Science, 21, 1724–1730, for animate motion capturing attention (cited, not read here).
- Doherty threshold (about 400 ms for system feedback), VERIFIED-F, T2 (lawsofux).
- Scope: universal.
- Agent rule: Direct manipulation gets fast motion within 100 ms of touch. System-initiated changes (new message, async update) get a quiet, in-place fade, never a slide from the edge. Do not animate repeated actions.

### F13 Research on animated transitions: what is actually known
- Claim: Animated transitions can help people keep track of objects (object constancy) in spatial or data contexts, but the evidence is narrow and does not say "animate everything".
- Evidence (abstract-level only, SNIPPET): Heer & Robertson 2007 reported two controlled experiments finding animated transitions between statistical graphics can significantly improve graphical perception. Staged transitions and congruence/apprehension principles are proposed. Bederson & Boltman 1999 found animating viewpoint change improved reconstruction of a spatial layout with no time penalty. Tversky, Morrison & Betrancourt 2002 found the evidence that animated graphics beat static ones "not encouraging", because animations are often too fast or complex to perceive (apprehension principle). Chevalier et al. (project page, VERIFIED-F): staggered timing may matter less than expected for tracking multiple objects.
- Scope: universal, research-level. Mostly data-visualization contexts and not mobile app chrome.
- Agent rule: Use animated transitions where an object persists and moves or changes shape (reorder, expand, reposition) so the user can keep track. Do not claim research backing for decorative motion.

### F14 Taxonomy and restraint rules
- Functional (orientation, continuity, hierarchy): navigation direction, container-to-detail, reorder, expand/collapse. Allowed on first use and repeated use, tuned short. Sources: MDC patterns, WWDC18 spatial consistency.
- Feedback (acknowledge, success, error, progress): press state, toggle, completion, validation. Fast (under 150 ms), small, local to the trigger, with a non-motion backup. Sources: HIG, NN/g microinteractions.
- Decorative (delight, brand): onboarding hero, milestone celebration, branded loader. Rare, earned, skippable, off for Reduce Motion. Carbon calls expressive motion something to use sparingly for rhythmic breaks. Atlassian reserves expression for low-frequency moments such as onboarding and milestones (VERIFIED-F).
- Evidence for the split: Carbon productive vs expressive (VERIFIED-F); Fluent "Functional" first (VERIFIED-F); M3 standard vs expressive KDoc (VERIFIED-R); Chevalier et al. roles (VERIFIED-F, abstract-level).
- Restraint rules for decorative (DERIVED from the above): at most one decorative moment per screen; none on frequent or repeated actions; never on the critical path; never blocks input; skippable; has a static fallback; stops after one play or at most 5 s (WCAG 2.2.2).
- Agent rule: Tag every animation functional, feedback, or decorative in the spec. If decorative, justify it in one line or cut it.

### F15 Stagger, asymmetry, distance, interruption (the timing laws)
- Stagger: Material 1: stagger each item no more than 20 ms apart and don't wait for each item to finish. Carbon: 20 ms stagger on table content, and keep total time within 500 ms (VERIFIED-R for both). M1 also says staggering many elements lengthens the interaction and frustrates users.
- Enter vs exit asymmetry, observed ratios (exit/enter): NN/g 200–250 over 300 = 0.67–0.83; M1 195/225 = 0.87; MDC container transform 400/500 = 0.8; MDC fade 150/400 = 0.375 (source default); Flutter fade-scale 75/150 = 0.5. Atlassian says exit faster than entrance (VERIFIED-F). DERIVED default: exit = 0.7 × enter, range 0.5–0.85.
- Distance/size proportional duration: MDC and Fluent say larger elements get longer durations (VERIFIED-R, VERIFIED-F). No published formula. NN/g gives none either.
- Interruptibility: see F7, F8. UIKit `beginFromCurrentState`, SwiftUI spring retarget, Android spring retarget.
- Never block input: HIG, M1 ("Animate quickly so the user never has to wait for the animation to finish"), UIKit default disables interaction on animated views.
- Agent rule: per-item stagger 20 ms or less. Only stagger what is visible on first appearance. Cap the cascade so the last item starts within about 100 ms of the first (DERIVED/OPINION; no source gives an item-count cap). Do not stagger on repeat visits or data refreshes.

### F16 Reduced motion: what to replace and what to keep
- HIG, VERIFIED-R. When Reduce Motion is on, reduce automatic and repetitive animations including zooming, scaling and peripheral motion. Specific practices: tighten springs to reduce bounce, track animations directly with gestures, avoid animating depth changes in z, replace x/y/z transitions with fades, avoid animating into and out of blurs.
- Val Head (ALA), VERIFIED-F: large-scale, mismatched-direction (parallax) and long-distance motion is the problem. Pure opacity, color and blur changes "are unlikely to be problematic". Reduced motion does not mean no motion.
- MDN, VERIFIED-F: replace scale with opacity dissolve. Baseline widely available since January 2020.
- Atlassian, VERIFIED-F: when reduced motion is active, motion is off and instant. Carbon, VERIFIED-F: provide reduced-motion alternatives and static state communication.
- WCAG 2.2, VERIFIED-F: 2.3.3 Animation from Interactions, AAA (motion animation triggered by interaction can be disabled unless essential). 2.2.2 Pause, Stop, Hide, A (moving or blinking content that starts automatically and lasts over 5 seconds needs a mechanism). 2.3.1 Three Flashes, A (no more than 3 flashes in any one second; luminance change of 10% or more counts as a general flash).
- Platform detection (details in Reduced-motion implementation table):
  - Web: `@media (prefers-reduced-motion: reduce)`.
  - iOS: `UIAccessibility.isReduceMotionEnabled`, `prefersCrossFadeTransitions`, SwiftUI `accessibilityReduceMotion`.
  - Android: `ANIMATOR_DURATION_SCALE` = 0, `ValueAnimator.areAnimatorsEnabled()`.
  - Flutter: `MediaQuery.disableAnimations`.
  - RN: `AccessibilityInfo.isReduceMotionEnabled`.
- Scope: universal.
- Agent rule: With Reduce Motion on: no translate, scale, rotate, parallax or blur-in. Use opacity cross-fade 100–150 ms or an instant swap. Keep color changes, determinate progress, and static state indicators. Stop all auto-playing loops. Add haptic and text for anything motion used to signal.

### F17 Performance coupling (conclusions only; slice 04 owns the detail)
- Web (web.dev, VERIFIED-F): only `transform` and `opacity` are compositor-only. Avoid animating properties that trigger layout or paint. `will-change` sparingly and remove it when done, because every layer costs memory, which matters on low-end phones. About 10 ms of work per frame at 60 fps (16.7 ms budget minus overhead).
- NN/g (VERIFIED-R) notes that opacity changes can be expensive on some platforms with many elements changing at once. That conflicts with the "opacity is cheap" web guidance in the many-elements case.
- React Native (VERIFIED-F): `useNativeDriver` supports non-layout properties such as `transform` and `opacity`, not flexbox or position props.
- Large-area motion costs more both perceptually (Val Head: relative size) and in rendering.
- Native equivalents: animate layer-level transform and opacity (MEMORY, not re-verified).
- Agent rule: Animate transform and opacity only. Never animate width, height, top, left or margin on a long list or large surface. For expand/collapse of unknown height use the platform's layout-animation primitive.

### F18 Loading, skeletons, and progress motion
- NN/g skeleton screens, VERIFIED-R:
  - Under 1 s, no skeleton or spinner needed.
  - 2–10 s: spinner for a single module; skeleton for a full-screen load (not frame-only skeletons).
  - Over 10 s: progress bar.
  - Skeleton shimmer or pulse "can potentially be distracting, annoying, or even create accessibility problems".
- HIG progress-indicators, VERIFIED-R: even out the pace of progress. Showing 90% in 5 s then 10% in 5 min can feel deceptive. HIG loading: don't leave a blank screen, show placeholders then replace.
- Viget test, VERIFIED-F, T3: 136 participants on animated GIFs. Skeleton rated slower (2.82 s perceived vs spinner 2.41 s vs blank 2.29 s). Small, one study, simulated. Treat it as a counterweight to the "skeleton is always better" folk rule, not as proof.
- Agent rule: Show nothing for the first ~1 s, then a skeleton (full screen) or spinner (module). Never shimmer indefinitely. Past about 10 s, switch to a determinate bar or an error with retry. Under Reduce Motion, use static grey placeholders.

### F19 Haptics as motion's sibling
- HIG, VERIFIED-R: use system haptic patterns according to documented meaning; keep haptics consistent and causal; prefer haptics that complement other feedback (match intensity and sharpness to the animation); avoid overuse; prefer short haptics for discrete events; make haptics optional. Notification: success, warning, error. Impact: light, medium, heavy, rigid, soft (the HIG example is a tap when a view snaps into place). Selection: while values change.
- Android, VERIFIED-F / VERIFIED-R (Compose `HapticFeedbackType` KDoc): CONFIRM (success), REJECT (failure), GESTURE_START/END, GESTURE_THRESHOLD_ACTIVATE (swipe/drag such as pull-to-refresh reaching its threshold), TOGGLE_ON/OFF, SEGMENT_TICK / SEGMENT_FREQUENT_TICK, LONG_PRESS, CONTEXT_CLICK, KEYBOARD_TAP, VIRTUAL_KEY. `View.performHapticFeedback` needs no VIBRATE permission and respects the system setting.
- Web: Vibration API is not Baseline (VERIFIED-F). iOS Safari lacking support is MEMORY.
- Agent rule: Pair haptics only with state changes the user caused and should notice (toggle, threshold crossed, success/error, snap, drop). Never haptic on scroll, on every list tap, or on decorative animation. Respect the OS haptics setting.

### F20 Celebration, Lottie, GIF
- NN/g (VERIFIED-R) shows Asana's occasional flying unicorn after completing a task as a gamified microinteraction layered on a utilitarian confirmation; the author likes it; the product's own competitor (Trello) uses no fanfare. It is occasional ("occasionally soars"), not every time.
- web.dev (VERIFIED-F): the example GIF was 3.7 MB vs 551 KB MP4 vs 341 KB WebM. Autoplaying looped video needs `autoplay loop muted playsinline`. The page doesn't cover reduced motion.
- Lottie size and CPU cost: not verified (Gap).
- Agent rule: Celebration only for rare, earned milestones (first completion, goal reached, purchase). One play, at most about 2 s, skippable, with a Reduce Motion static version. Routine actions get a small check, not confetti. Prefer video or vector with a poster over GIF.

---

## Micro-interaction specs
Provenance legend: `[S]` sourced number, `[D]` derived from sourced ranges, `[O]` opinion/convention with no authoritative number. "RM" = Reduce Motion fallback.

| Interaction | Latency / duration | Easing or spring | Properties | Origin / size of change | Haptic | RM fallback | Provenance |
|---|---|---|---|---|---|---|---|
| Button press | Visual response at touch-down, under 100 ms; press-in about 70–90 ms; release spring-back about 100–150 ms | Fast spatial spring (std 0.9/1400) or decelerate; state layer fade | State layer opacity 10% pressed [S: M3 `PressedStateLayerOpacity` 0.1]; optional scale | Center; scale 0.97–0.98 at most [O: Swiss-Activities PR T4, product-specific; no platform number] | None for ordinary buttons | Keep state layer or color; drop scale | Latency [S HIG/WWDC18, NN/g 0.1 s]; 70 ms [S Carbon fast-01]; 90 ms [T4] |
| Toggle / switch | Thumb 100–150 ms (about 115 ms std fast spatial) | M3 FastSpatial spring; color via FastEffects | Thumb translate, track color | Thumb travel only; no scale | Light tick (iOS system toggles auto-play; Android TOGGLE_ON/OFF) | Instant thumb jump + color | [S NN/g ~100 ms; M3 Switch.kt FastSpatial]; [D settle] |
| Checkbox / radio | 100–150 ms | DefaultSpatial spring (M3 Checkbox) or standard curve | Check stroke or fill, color | Center | Optional light | Instant check | [S NN/g ~100 ms; Checkbox.kt]; [D] |
| Favorite / like | 200–300 ms total | Spring bounce at most 0.15–0.3, or standard tween | Fill swap + brief pop: scale 1→1.15→1 | Icon center; pop 10–20% [O]. Polaris example keyframe 0.85 then 1.05 (T3, not a recommendation) | Light impact or selection (success if it posts) | Fill and color swap only, no pop | NN/g Gap heart "short duration" [S, VERIFIED-R]; scale size [O] |
| Bookmark | Same as favorite, usually without the pop | Standard | Icon fill + color; optional one-line confirmation | none | Selection | Fill swap | [D from favorite] |
| Copy | Icon/label swap 100–150 ms; confirmation visible 1.5–2 s then revert | Fade | Icon morph (copy to check) or "Copied" label | Local to the control | Android CONFIRM / iOS success notification [O] | Same (no motion needed) | Android 13+ shows a system confirmation, so apps should not add a toast or snackbar [S, VERIFIED-F]. Below 13, Toast/Snackbar [S]. Timing 1.5 s [S: MDC short snackbar 1500 ms] |
| Success | 200–300 ms | Decelerate; check stroke draw or fade | Check + color | Local to the form or button | iOS success; Android CONFIRM [S HIG/Android] | Instant check + text | [D] NN/g 200–300 ms; no confetti for routine [O] |
| Error | Inline message appears 150–250 ms; if shake used, 300–400 ms, 2–3 cycles, about 8–10 px [O] | Standard; shake linear or sine | Message + icon + color + focus move; shake optional | Field or form | iOS error; Android REJECT | No shake; color flash + message + haptic | HIG: never rely on motion alone [S]; shake numbers [O] |
| Delete + undo | Row exit 150–200 ms (fade + collapse); siblings reflow spring about 165–250 ms; undo snackbar 1.5–2.75 s short/long defaults (Android) | Accelerate on exit; spring reflow (Compose default stiffness 400) | Opacity + height + translate | Row | Optional light impact on commit | Instant removal + snackbar | [S Compose `animateItem` spring MediumLow; MDC 1500/2750 ms]; exit ms [D] |
| Expand / collapse | Open 200–300 ms; close about 0.7 × open | Standard; Compose default spring MediumLow | Height/clip + chevron rotate 180° + content fade lag about 50 ms [O] | Top edge or chevron center | None | Crossfade or instant | [S Carbon moderate-02 240 ms and `$transition-expansion` 300 ms]; chevron/lag [O] |
| Tab indicator | Slide about 165–250 ms | M3 DefaultSpatial spring (std 0.9/700) | Indicator x and width; label color FastEffects | n/a | Selection (optional) | Instant move + color | [S TabRow.kt, Tab.kt]; ms [D] |
| Pull-to-refresh | Threshold 80 dp; overshoot capped at 200% of threshold with decreasing tension; settle to indicator 200–300 ms | Rubber-band during pull; standard on release | Content translate + spinner | Top | Android GESTURE_THRESHOLD_ACTIVATE at threshold | Spinner only, no content translation | [S PullToRefresh.kt 80 dp]; HIG refresh control advice: titles optional |
| List item insert / remove | Insert about 250–300 ms; remove 150–200 ms | Compose default spring MediumLow (fade + placement) | Opacity + translate | Item | None | Instant | [S `LazyItemScope.animateItem`]; ms [D] |
| Snackbar enter / exit | Enter 200–250 ms (source default in M3 theme is 500 ms; see Disagreements); exit 100–150 ms | Enter decelerate; exit accelerate; fade + scale 0.8→1 | Opacity + scale (fade mode) or translate | Bottom, above nav | None | Fade only | [S BaseTransientBottomBar: legacy 250/150/75; M3-theme 500/250]; recommendation [D] |
| Skeleton to content | Cross-fade 100–200 ms | Standard | Opacity only; fixed layout to avoid shift | n/a | None | Instant swap | Duration [O/D]; timing thresholds [S NN/g] |
| Number change | 200–400 ms | Standard; SwiftUI `contentTransition(.numericText)` | Digit roll or cross-fade; tabular figures | n/a | None | Instant swap | API [S Apple doc]; ms [O] |
| Progress / loading | Continuous | Linear for indeterminate loops; determinate follows real progress | Rotation, bar fill | n/a | None | Static indicator + text | [S Polaris, HIG even-pace, NN/g 10 s] |
| Long-press | Visual begins at touch-down; threshold about 400–500 ms [MEMORY] | Slow scale-down or ring | Scale 0.97 → 0.95 [O] or progress ring | Center | LONG_PRESS (Android) at threshold; iOS impact | No scale | Haptic constants [S]; threshold [MEMORY]; scale [O] |
| Drag pickup / drop | Pickup 100–150 ms; track 1:1; drop settles with spring carrying release velocity | Interactive spring (iOS response 0.15, ζ 0.86) while dragging | Scale 1.02–1.05 + shadow [O]; translate | Touch point | Start: light; drop: impact light/soft (HIG: tap when a view snaps in place) | No scale; keep shadow | 1:1 tracking [S WWDC18]; interactive spring [S Apple doc]; scale [O] |

---

## Page and state transitions

| Transition | Pattern | Timing | Notes | Provenance |
|---|---|---|---|---|
| Navigation push/pop (hierarchy) | M3 shared axis X (forward left, backward right), 30 dp slide + fade; iOS push slides from the trailing edge | MDC 450 ms emphasized; iOS system default (MEMORY about 0.35 s) | Symmetric path: reverse on back. Under Reduce Motion, cross-fade (iOS `prefersCrossFadeTransitions`) | [S MDC, WWDC18]; iOS ms [MEMORY] |
| Peer destinations (tabs, bottom nav) | Fade through, scale 0.92→1 | 300–450 ms | No lateral slide between peers | [S MDC source] |
| Modal / dialog | Fade (+ scale 0.8–0.92) in; faster out | Atlassian modal 250 ms; MaterialFade 400 in / 150 out | Close the first sheet before opening another (HIG sheets) | [S Atlassian-F, MDC, HIG] |
| Bottom sheet | Spring (M3 default-spatial: partial-screen) or system sheet | about 165–250 ms equivalent | Predictive-back-aware on Android. iOS: use system detents | [S MDC spring-by-size; Adopting Liquid Glass] |
| Shared element / hero | M3 container transform; iOS 18 zoom transition | MDC 500 in / 400 out; iOS system | Must be interruptible (zoom is) | [S MDC, WWDC24] |
| Loading to loaded | Skeleton/spinner then cross-fade | 100–200 ms | See F18 | [S NN/g] |
| Empty to populated | Fade in; no stagger on first load unless a few items | 150–250 ms | | [D] |
| Disabled to enabled | Color/opacity only | M3 effects spring (std fast about 95 ms) | No movement | [S MotionScheme] |
| Error to success | Cross-fade message + icon swap | 150–250 ms | Not motion-only | [D] |
| Collapsed to expanded | See micro table | 200–300 ms | | [S Carbon] |
| Inactive to active | Indicator slide + color | about 165–250 ms | | [S TabRow.kt] |

---

## Reduced-motion implementation by platform

| Platform | Detect | Subscribe | Replace | Source |
|---|---|---|---|---|
| Web/PWA | `@media (prefers-reduced-motion: reduce)` (`no-preference` = animations OK). Put the reduce rule after the default. | `matchMedia(...).addEventListener('change', …)` | Disable transform animations; keep opacity and color | MDN, web.dev (VERIFIED-F) |
| iOS UIKit | `UIAccessibility.isReduceMotionEnabled`; `UIAccessibility.prefersCrossFadeTransitions` (Reduce Motion + Prefer Cross-Fade) | `reduceMotionStatusDidChangeNotification` | Fades in place of slides/zoom; tighter springs | Apple docs (VERIFIED-R) + HIG |
| iOS SwiftUI | `@Environment(\.accessibilityReduceMotion)` | automatic | Same | Apple docs (VERIFIED-R) |
| Android | `Settings.Global.ANIMATOR_DURATION_SCALE` (0.0 = animations end immediately); `ValueAnimator.areAnimatorsEnabled()` (API 26; also false in Battery Saver) | Content observer on setting | Skip non-essential; custom canvas/Lottie must check manually. Compose ≥1.2 respecting it is SNIPPET only | Android reference (VERIFIED-R); Compose claim SNIPPET |
| Flutter | `MediaQuery.disableAnimations` (Android "Remove animations"). Per current docs, iOS reduced motion is separate: `PlatformDispatcher.accessibilityFeatures.reduceMotion` (does not set `disableAnimations`). `AnimationController` adjusts playback itself. | rebuild on MediaQuery change | Custom explicit animations must check and skip or shorten | api.flutter.dev (VERIFIED-R) |
| React Native | `AccessibilityInfo.isReduceMotionEnabled()` (iOS, Android); iOS-only `prefersCrossFadeTransitions()` | `reduceMotionChanged` event (also true when Android Transition Animation Scale = off) | Reanimated `reduceMotion` param defaults to `ReduceMotion.System` | RN docs (VERIFIED-F), Reanimated (VERIFIED-R) |

---

## Numbers table

| # | Value | Applies to | Source | Tag |
|---|---|---|---|---|
| N1 | M3 easing: linear (0,0,1,1); standard (0.2,0,0,1); standard-accelerate (0.3,0,1,1); standard-decelerate (0,0,0,1); emphasized (0.2,0,0,1) in CSS/Compose (Android Views: 2-segment path); emphasized-accelerate (0.3,0,0.8,0.15); emphasized-decelerate (0.05,0.7,0.1,1) | all | material-web `_md-sys-motion.scss`; Compose `MotionTokens.kt`; Flutter `motion.dart`; MDC | VERIFIED-R |
| N1b | M2/legacy: standard (0.4,0,0.2,1); decelerate (0,0,0.2,1); accelerate (0.4,0,1,1); sharp (0.4,0,0.6,1) | legacy Material | MDC, M1 duration page | VERIFIED-R |
| N2 | M3 durations ms: short1–4 = 50/100/150/200; medium1–4 = 250/300/350/400; long1–4 = 450/500/550/600; extra-long1–4 = 700/800/900/1000 | all | Compose, MDC, material-web, Flutter | VERIFIED-R |
| N3 | M3 standard springs (damping, stiffness): spatial default 0.9/700, fast 0.9/1400, slow 0.9/300; effects default 1.0/1600, fast 1.0/3800, slow 1.0/800 | Compose, MDC | `StandardMotionTokens.kt`; MDC Springs | VERIFIED-R |
| N3b | M3 expressive springs: spatial default 0.8/380, fast 0.6/800, slow 0.8/200; effects identical to standard (1.0 / 1600, 3800, 800) | Compose | `ExpressiveMotionTokens.kt` | VERIFIED-R |
| N3c | Derived settling (unit mass, 2%): std spatial fast about 115 ms, default about 165, slow about 250; expressive default about 250, fast about 230, slow about 345; effects fast about 95, default about 145, slow about 205 ms | | my arithmetic | DERIVED |
| N4 | Android spring constants (Compose and View): damping 0.2 (high bouncy), 0.5 (medium), 0.75 (low), 1.0 (none); stiffness high 10000, medium 1500, medium-low 400, low 200, very low 50 | Android | `SpringForce.java`; Compose `Spring` reference | VERIFIED-R |
| N5 | Compose defaults: `tween` 300 ms; `spring()` damping 1.0, stiffness 1500 (medium); `AnimatedVisibility`, `animateItem` use stiffness 400 | Compose | `AnimationSpec.kt`; `EnterExitTransition.kt`; `LazyItemScope.kt`; customize doc | VERIFIED-R (defaults for `spring()` per doc VERIFIED-F) |
| N6 | SwiftUI: `.smooth` = duration 0.5, bounce 0; `.snappy` = 0.5, 0.15; `.bouncy` = 0.5, 0.3; `spring(response:0.5, dampingFraction:0.825)`; `interactiveSpring(response:0.15, dampingFraction:0.86, blendDuration:0.25)`; `easeInOut` 0.35 s; bounce above about 0.4 "may feel too exaggerated" | iOS | Apple docs JSON; WWDC23 10158 | VERIFIED-R |
| N7 | MDC transition defaults (source, master): container transform 500 in / 400 out; shared axis 450 (30 dp slide); fade through 450 (scale 0.92); fade 400 in / 150 out (scale from 0.8); all emphasized family | Android Views | MDC Java | VERIFIED-R |
| N8 | Flutter animations pkg: OpenContainer 300 ms; shared-axis slide 30; scaled 0.80; fade-through scale 0.92; fade-scale 150 in / 75 out from 0.80 | Flutter | flutter/packages | VERIFIED-R |
| N9 | Material 1: enter 225, exit 195, large up to 375, ">400 may feel too slow", tablet +30%, wearable −30%, desktop 150–200; mobile large 300–400, small 150–200; stagger no more than 20 ms apart | legacy Material | m1.material.io | VERIFIED-R |
| N10 | NN/g: ~100 ms feedback; 200–300 modal; 100–400 typical; 500 "real drag"; popup 300 in / 200–250 out; 0.1 s instant, 1 s flow, 10 s attention; effect must begin within 0.1 s; skeleton not needed under 1 s, use 2–10 s, bar over 10 s | universal | NN/g | VERIFIED-R |
| N11 | Carbon: fast-01 70, fast-02 110, moderate-01 150, moderate-02 240, slow-01 400, slow-02 700; `$transition-base` 250, `$transition-expansion` 300; stagger 20 ms, total within 500 ms | web/IBM | `@carbon/motion` scss; choreography page | VERIFIED-R |
| N11b | Carbon easings productive: standard (0.2,0,0.38,0.9), entrance (0,0,0.38,0.9), exit (0.2,0,1,0.9); expressive: (0.4,0.14,0.3,1), (0,0,0.3,1), (0.4,0.14,1,1) | | jsdelivr scss | VERIFIED-R |
| N12 | Fluent durations 50/100/150/200/250/300/400/500; curves: accelerate max (0.9,0.1,1,0.2), mid (1,0,1,1), min (0.8,0,0.78,1); decelerate max (0.1,0.9,0.2,1), mid (0,0,0,1), min (0.33,0,0.1,1); easy-ease max (0.8,0,0.2,1), easy-ease (0.33,0,0.67,1) | | fluentui tokens | VERIFIED-R |
| N13 | Polaris durations 0–500 by 50, 5000; ease (0.25,0.1,0.25,1), ease-in (0.42,0,1,1), ease-out (0.19,0.91,0.38,1), ease-in-out (0.42,0,0.58,1), linear | | polaris-tokens | VERIFIED-R |
| N14 | Atlassian: interactions 50–150, transitions 150–400; ease-out bold (0,0.4,0,1), ease-in-out bold (0.4,0,0,1), ease-in practical (0.6,0,0.8,0.6), ease-out practical (0.4,1,0.6,1) | | atlassian.design | VERIFIED-F |
| N15 | Predictive back: exit scale 100→90%, enter 110→100%, cross-fade at 35% progress, interpolator (0.1,0.1,0,1), shared-element min scale 90%, 8 dp margin, x-shift (w/20 − 8) dp | Android | Android design page | VERIFIED-R |
| N16 | M3 state layer opacity: hover 0.08, focus 0.10, pressed 0.10, dragged 0.16 | | `StateTokens.kt` | VERIFIED-R |
| N17 | Pull-to-refresh threshold 80 dp; overshoot cap 200% with decaying tension | M3 Compose | `PullToRefresh.kt` | VERIFIED-R |
| N18 | Snackbar: SHORT 1500 ms, LONG 2750 ms, INDEFINITE; M3-theme enter fade/scale 500 ms, exit 250 ms; legacy slide 250, fade in 150, out 75; scale from 0.8 | Android MDC | `SnackbarManager.java`, `BaseTransientBottomBar.java` | VERIFIED-R |
| N19 | WCAG 2.3.1: max 3 flashes per second; area threshold 25% of any 10° visual field; 2.2.2: 5 s auto-start rule | web, universal | W3C Understanding | VERIFIED-F |
| N20 | web.dev: about 10 ms of work per frame at 60 fps; compositing about 4–5 ms; GIF 3.7 MB vs MP4 551 KB vs WebM 341 KB | web | web.dev | VERIFIED-F |
| N21 | Reanimated `withSpring` defaults: physics damping 120, stiffness 900, mass 4; duration-based duration 550 ms (actual about 1.5×), dampingRatio 1; `reduceMotion: System` | React Native | Reanimated docs | VERIFIED-R |
| N22 | Press feedback example: 90 ms press, scale 0.98 card / 0.97 control | one product's tokens | Swiss-Activities PR #8 | T4, VERIFIED-F, product-specific |
| N23 | iOS 18: zoom transition continuously interactive; push interrupted converts to pop | iOS | WWDC24 10145 | VERIFIED-R |

---

## Comparison tables

### Spring vs tween vs keyframe
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Spring (bounce 0 / ζ 0.9–1) | Interruptible, velocity-continuous, no fixed duration to tune | Settling time not exactly predictable; can't hand a designer an exact ms | Any user-driven or interruptible state change; sheets, drags, toggles | Strictly choreographed multi-element timelines; web without a spring primitive |
| Spring with bounce | Reads physical, rewards gesture momentum | Reads as playful; gets old when repeated | Swipe-to-dismiss with momentum; hero moments | Frequent actions; serious or data-dense UI; color/opacity |
| Tween + cubic-bezier | Exact ms, easy to spec and test | Not velocity-continuous; restarts feel jerky | Fades, color, fixed choreography, web | Gesture-driven motion |
| Keyframes | Multi-stage pops, shake, draw | Expensive to maintain; easy to overdo | Rare feedback moments | Anything frequent |

### Transition patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Container transform | Strong continuity from list item to detail | Complex; shared-element bugs | One item opens into its detail | Items without a stable bounding container |
| Shared axis | Conveys direction | Lateral slide implies hierarchy | Forward/back, steppers, onboarding | Peer tabs |
| Fade through | Simple, calm, cheap | No spatial cue | Peer destinations, unrelated content | Hierarchical drill-in |
| Fade (+ scale) | Lightweight | Not orienting | Menus, dialogs, FAB | Full-screen change |
| Crossfade (reduce-motion substitute) | Safe for vestibular users | Loses spatial cue | Reduce Motion, slow devices | Never as the only orientation cue without other cues |

---

## Anti-patterns found

| Problem | Why it happens | Better alternative | Source |
|---|---|---|---|
| Bounce on everything | Springs are fun; defaults copied from hero examples | Bounce 0 default; bounce only when gesture carried momentum; never on color/alpha | WWDC23, WWDC18, MDC effects springs |
| Parallax and page-load choreography | Marketing-site habits | Static layout; at most one in-place fade | NN/g, Val Head, WCAG 2.3.3 |
| Long fade-ins on data screens | "Polish" | Show data immediately; at most 100–150 ms crossfade | NN/g frequency, HIG frequent interactions |
| Animation blocks taps | `UIView.animate` default disables interaction; modal transitions awaited | `.allowUserInteraction`, retargetable springs, never await an animation for the next input | UIKit docs, HIG, M1 |
| Skeleton shimmer forever | No timeout path | Show after about 1 s; static after about 5 s; error/retry after about 10 s | NN/g, WCAG 2.2.2 |
| Confetti for routine actions | Delight culture | One small check; save celebration for milestones | NN/g microinteractions, Atlassian |
| Auto-playing loops | Lottie/GIF as decoration | Play once; pause control; static under Reduce Motion | WCAG 2.2.2, HIG accessibility |
| Motion with no Reduce Motion fallback | Forgotten | Per-platform detection table above | HIG, WCAG 2.3.3, MDN |
| Every transition a different style | Per-screen tinkering | Fixed token set; pattern by relationship | MDC patterns, Fluent "Consistent" |
| Long default durations | Library defaults (e.g. M3 snackbar fade 500 ms) | Override to 200–250 ms enter | NN/g, source defaults |
| Motion as only signal (shake as only error, color-only success) | Motion feels sufficient | Add text, icon, haptic | HIG Motion, WCAG 1.4.1 |
| Slide-ins in peripheral vision for system notices | Attention-grabbing by design | Slow fade, no position change | NN/g animation-usability |

---

## Disagreements and weak-evidence zones
1. M3 emphasized curve: Android Views use a 2-segment path interpolator, while CSS, Compose and material-web use `cubic-bezier(0.2,0,0,1)`, which is identical to standard. For tech-agnostic specs use the single Bezier and note the Android path as the high-fidelity version.
2. Material docs vs code: MDC `Motion.md` tables show 300 ms or 150/75 ms defaults, while the Java source uses 450–500 ms for several transitions. Rely on the source; expect the 450–500 ms values to exceed NN/g and M1 ceilings.
3. M3 vs NN/g/M1 duration ceilings: M3 offers up to 1000 ms; NN/g says about 500 ms feels like a drag; M1 says over 400 ms may feel too slow. Choose NN/g and M1 for productive UI; M3 long tokens for rare expressive moments.
4. Exit/enter ratio varies from 0.375 to 0.87 across sources. No study fixes the number. DERIVED default 0.7.
5. Spring bounce: Apple says start at bounce 0 and be cautious above about 0.4. M3 expressive spatial springs overshoot by design (about 1.5% default, about 9.5% fast). Reconcile as: overshoot is a hero-moment tool in both systems.
6. Skeleton screens: NN/g recommends them for full-page waits of 2–10 s; the Viget experiment found no perceived-speed benefit. The evidence is mixed and weak both ways.
7. Opacity cost: web.dev calls opacity compositor-cheap; NN/g warns about opacity cost with many simultaneous elements on some platforms.
8. Flutter reduced motion on iOS: current docs say `disableAnimations` does not carry iOS Reduce Motion, which is exposed separately as `reduceMotion`. Older behavior may differ.
9. Press scale and shake amplitude have no authoritative number. Treated as opinion.
10. Research on animated transitions is mostly from data-visualization settings; do not over-apply to mobile app chrome. Tversky et al. found animation often fails to beat static graphics.

---

## Gaps (could not verify)
- All m3.material.io pages were unreachable (JS shell, ECONNREFUSED). Not verified: official "applying easing and duration" size-to-duration table, M3 snackbar 4–10 s guidance, M3 Expressive research claims, official M3 container-transform spec durations.
- Lottie size and CPU cost numbers; dotLottie compression percentage (no number on the page). Only GIF-vs-video (web.dev) verified.
- Disney 12 principles in UI and Issara Willenskomer's UX in Motion principles (page returned 403). Val Head's book and Rachel Nabors' book beyond blurbs.
- Heer & Robertson and Bederson & Boltman numerics (PDFs not readable here); Pratt et al. 2010 not read.
- iOS system timings (navigation push, sheet, keyboard). UIRefreshControl's built-in haptic. Android long-press timeout (assumed about 400–500 ms, MEMORY).
- Whether Compose animations respect "Remove animations" automatically (SNIPPET only). Android "Remove animations" scaling all three animation scales (MEMORY).
- Atlassian and Fluent 2 numeric guidance beyond tokens (Atlassian only via fetch summary; its own token page 404).
- Haptic support on web (Vibration API on iOS Safari).
- Authoritative numbers for press scale, shake amplitude, like-pop scale, drag-lift scale, skeleton minimum display time.
- Spectrum (Adobe), Lightning, GOV.UK motion guidance not checked. WebSearch budget ran out and research was stopped by the coordinator.

---

## Proposed motion token table (tech-agnostic skill)

### Duration tokens
| Token | Value | Use | Source support |
|---|---|---|---|
| `dur.instant` | 0 ms | Reduce Motion swap, snap states | Polaris 0; Atlassian reduced = instant |
| `dur.micro` | 100 ms | Toggle, checkbox, press release, color change | NN/g ~100; M3 short2 100; Fluent faster 100; Carbon fast-02 110; Atlassian 50–150 |
| `dur.fast` | 150 ms | Dropdown, menu, tooltip, fade out, small expansion | M3 short3; Carbon moderate-01; Fluent fast; Atlassian dropdown 150; MDC fade exit 150 |
| `dur.base` | 250 ms | Dialog, sheet, card expand, snackbar enter | M3 medium1; Carbon moderate-02 240; Fluent gentle 250; Atlassian modal 250; NN/g 200–300; M1 enter 225 |
| `dur.moderate` | 300 ms | Medium surface moves, expansion | M3 medium2; M1 baseline 300; Fluent slow 300; Carbon expansion 300; Compose tween default 300 |
| `dur.large` | 400 ms | Large or full-screen move (practical ceiling) | M3 medium4; Carbon slow-01; Fluent slower 400; M1 "over 400 too slow"; NN/g "400 very slow" |
| `dur.screen-max` | 500 ms | Absolute ceiling, full-screen container or shared axis only | M3 long2; MDC container-transform enter; NN/g 500 "drag" |
| `dur.expressive` | 600–1000 ms | Rare hero or celebration only; never on critical path | M3 long4–extra-long4; Carbon slow-02 700 (background dim) |
| `dur.exit-factor` | 0.7 × enter (0.5–0.85) | All exits | NN/g, M1, MDC code ratios (DERIVED) |
| `dur.scale-tablet` / `dur.scale-wearable` | ×1.3 / ×0.7 | Device adjustments | M1 (legacy, VERIFIED-R) |

### Easing tokens
| Token | cubic-bezier | Use | Source support |
|---|---|---|---|
| `ease.standard` | (0.2, 0, 0, 1) | On-screen move or resize | M3 standard |
| `ease.enter` | (0, 0, 0, 1) | Entering | M3 standard-decelerate; Fluent decelerate-mid; Carbon entrance family |
| `ease.exit` | (0.3, 0, 1, 1) | Exiting | M3 standard-accelerate |
| `ease.enter-emphasized` | (0.05, 0.7, 0.1, 1) | Hero entrance | M3 emphasized-decelerate |
| `ease.exit-emphasized` | (0.3, 0, 0.8, 0.15) | Hero exit | M3 emphasized-accelerate |
| `ease.linear` | (0, 0, 1, 1) | Spinner, indeterminate loop, alpha fade | M3 linear; Polaris linear note; MDC fade uses linear |

### Spring tokens
| Token | Values | Use | Source support |
|---|---|---|---|
| `spring.spatial.fast` | std ζ 0.9 / k 1400 | Switches, buttons, small elements | StandardMotionTokens; MDC |
| `spring.spatial.default` | std ζ 0.9 / k 700 | Sheets, drawers, partial-screen | same |
| `spring.spatial.slow` | std ζ 0.9 / k 300 | Full-screen | same |
| `spring.effects.fast/default/slow` | ζ 1.0 / k 3800 / 1600 / 800 | Color and opacity (no overshoot) | same |
| `spring.expressive.*` | spatial default 0.8/380, fast 0.6/800, slow 0.8/200; effects as standard | Hero moments only | ExpressiveMotionTokens |
| Apple equivalents | smooth (0.5 s, bounce 0), snappy (0.5, 0.15), bouncy (0.5, 0.3), interactive (response 0.15, ζ 0.86) | iOS | Apple docs; WWDC23 |
| Default policy | Productive UI: std spatial or bounce 0. Bounce only with gesture momentum or hero. Never spatial spring on color/alpha. | | WWDC18/23, MDC, KDoc |

### Choreography, loading and accessibility tokens
| Token | Value | Source support |
|---|---|---|
| `stagger.step` | at most 20 ms | M1 choreography; Carbon choreography |
| `stagger.max-total` | at most 500 ms including item duration; first-screen items only | Carbon (DERIVED cap beyond that) |
| `feedback.latency` | at most 100 ms from touch to visible response | NN/g 0.1 s; WWDC18; HIG |
| `loading.show-after` | about 1000 ms before showing skeleton/spinner (not in the first second) | NN/g skeleton, response times |
| `loading.skeleton-range` | 2–10 s skeleton or spinner; over 10 s determinate bar or error | NN/g |
| `loop.max` | auto-play loop at most 5 s, or a pause control | WCAG 2.2.2 |
| `flash.max` | at most 3 flashes per second | WCAG 2.3.1 |
| `rm.replace` | translate, scale, rotate, parallax, blur-in become opacity cross-fade at most 150 ms or instant; keep color, determinate progress; stop loops | HIG accessibility; MDN; Val Head; Atlassian |
| `press.scale` | 0.97–0.98 at most, optional (OPINION; T4 only) | Swiss-Activities PR (product-specific) |
