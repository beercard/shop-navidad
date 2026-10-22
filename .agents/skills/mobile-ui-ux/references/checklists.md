# Checklists

Read this when: starting a screen (section 1), before declaring any mobile UI complete (sections 2-9), or when reviewing someone else's. Tick every line or state why it does not apply. Items marked **(gate)** map to critical-failure gates in review-system.md.

Contents: 1 Before designing · 2 Structure and hierarchy · 3 Interaction and touch · 4 Content states · 5 Forms · 6 Accessibility · 7 Motion · 8 Performance · 9 Responsive and platform · 10 Data-dense additions · 11 Copy · 12 Release gate

## 1. Before designing (answer in writing, in the reply or a code comment)

- [ ] What is the user's primary goal on this screen, and what is THE primary action?
- [ ] What information is essential vs. what can be progressively disclosed?
- [ ] Who is the user (role, context: one-handed? outdoors? interrupted? offline?), which platform(s) and window sizes?
- [ ] What conventions of the platform and the domain apply (back, tabs, sheets, search placement, permissions)?
- [ ] What loading, empty, error, offline and permission-denied states exist for each data region?
- [ ] What gestures (if any) are used and what is each one's visible alternative?
- [ ] What does each animation communicate (functional / feedback / decorative) and is it worth its cost?
- [ ] Does a desktop original exist? If yes: task table (task | frequency | mobile? | pattern) produced first.
- [ ] Which tokens (type, spacing, color, radius, motion) already exist? Reuse before inventing.
- [ ] Are any requested patterns trends `[T]` or manipulative? Decide and tell the user.

## 2. Structure and hierarchy

- [ ] One dominant primary action per view; secondary visibly weaker; destructive not styled as primary.
- [ ] Persistent navigation: 3-5 labeled destinations (or a justified alternative); current location indicated; no hidden core navigation.
- [ ] Each screen has a title and a standard Back/Up.
- [ ] Containers justified: no card-in-card; grouping by spacing first; one container level.
- [ ] Right component for the job (components.md D1-D10): dialog vs sheet vs page, tabs vs segmented vs chips, switch vs checkbox, list vs card.
- [ ] Progressive disclosure ≤ 2 levels; nothing essential hidden (price, consent, destructive consequences).
- [ ] No more than ~25% of the viewport consumed by persistent chrome with the keyboard open.

## 3. Interaction and touch

- [ ] **(gate)** Every interactive target ≥ 44pt/48dp/44 CSS px with ≥ 8 spacing (never < 24 CSS px); hit areas extended, not glyphs.
- [ ] **(gate)** Every gesture has a visible single-tap alternative; swipe actions mirrored in a menu and AT custom actions.
- [ ] Feedback ≤ ~100 ms on every tap (pressed state, in-button spinner).
- [ ] Actions fire on pointer-up with slide-off cancel.
- [ ] Primary controls reachable one-handed, but not placed under gesture insets or at the very edge; Back/Close top-leading.
- [ ] Destructive controls separated from frequent ones; undo available.
- [ ] Haptics only for user-caused state changes, optional.

## 4. Content states (every data region)

- [ ] Loading: nothing under ~1 s; skeleton only for known layouts, spinner for modules, determinate + Cancel > 10 s; delayed show/min display.
- [ ] **(gate)** Loader has success/error/timeout exits; Retry re-enters loading.
- [ ] Empty variants designed (first-use, no results, filtered-to-zero, done, error-empty, offline, permission); no blank containers.
- [ ] **(gate)** Error messages specific and actionable, adjacent, text + icon; status → template map; draft preserved.
- [ ] Offline: cached reads, queued writes with status, calm indicator, sync action.
- [ ] Feedback surface matches severity (inline > banner > snackbar > dialog); actionable messages persist; undo before confirm.
- [ ] Stale data labeled ("Updated 2 min ago"); optimistic updates only for cheap reversible actions.

## 5. Forms

- [ ] Visible labels above fields; placeholders only for format examples.
- [ ] Fields cut/deferred where possible; single column; logical order; widths hint length.
- [ ] Correct `type`/`inputmode`/`autocomplete`/keyboard/IME action on every field (forms.md cheat table); `type=number` not used for identifiers.
- [ ] Focus advances with Next; last field submits; keyboard never hides the submit action. **(gate)**
- [ ] Validation timing by field type; errors specific; summary + focus on web; input preserved on failure. **(gate)**
- [ ] Submit enabled (unless short guided step with hint); in-flight state; idempotency key; no double submit.
- [ ] Passwords pastable, show/hide, passkey option; OTP single field with autofill; no CAPTCHA puzzle. 
- [ ] Destructive confirmations name the object with verb buttons; permissions requested in context.
- [ ] Draft autosave for multi-screen/long forms; dirty forms guard Back/Close/swipe-dismiss/route change (forms.md §8b); save state visible.

## 6. Accessibility

- [ ] **(gate)** Names/roles/states on every control; icon-only buttons named; label contains the visible text.
- [ ] **(gate)** Contrast: text ≥ 4.5:1 (large 3:1), UI/focus ≥ 3:1 in light, dark, increased contrast.
- [ ] **(gate)** 200% text / AX5 and 320 CSS px reflow without clipping or lost content.
- [ ] **(gate)** Color never the only signal (grayscale pass).
- [ ] Visible focus ≥ 2px/3:1; nothing hidden by sticky bars; logical focus order; focus managed on route change, dialogs and sheets.
- [ ] Status messages announced (`role=status`/alert, native announcements); loading text present.
- [ ] Reduced motion honored; no flashing > 3/s; no auto-play > 5 s without pause. **(gate)**
- [ ] Zoom enabled; orientation unlocked. **(gate)**
- [ ] Screen-reader walkthrough of the primary task completed (VoiceOver and TalkBack where relevant).

## 7. Motion

- [ ] Each animation tagged functional/feedback/decorative; decorative ones justified and rare.
- [ ] Durations: feedback 70-150 ms, partial-screen 200-300 ms, full-screen 300-400 ms (≤ 500 ms ceiling); enter decelerate, exit accelerate (~0.7×).
- [ ] Interruptible; never blocks input; springs without bounce unless gesture momentum.
- [ ] Only transform/opacity animated for UI motion; no animated blur radius or shadow blur.
- [ ] Reduced-motion branch implemented per platform (cross-fade ≤ 150 ms or instant).

## 8. Performance

- [ ] Lists virtualized/lazy-built; position restored on Back.
- [ ] Images: dimensions, sized to display, lazy below the fold, hero eager; decoded at display size on native.
- [ ] Blur/translucency limited and with opaque fallbacks; no per-item opacity/clip wrappers.
- [ ] Main-thread work in handlers < ~50 ms or yielded; INP ≤ 200 ms, LCP ≤ 2.5 s, CLS ≤ 0.1 at p75 for web.
- [ ] JS/byte budget stated for the target device class; measured on a mid-tier device with a release build (state the method). **(gate if janky)**
- [ ] No polling; background work through platform schedulers; off-screen animation paused.

## 9. Responsive and platform

- [ ] Layout driven by window size classes/width; panes or rail at medium/expanded; max widths; no device-type checks.
- [ ] Safe areas/insets applied (top, bottom, sides; cutouts, home indicator, gesture bars); content not under system gestures. **(gate)**
- [ ] State survives rotation, resize, fold/unfold, split-screen.
- [ ] Platform behaviors adopted: Back (and predictive back), scrolling, text editing, share, permissions, dark mode follows system.
- [ ] Web/PWA: `width=device-width, initial-scale=1`, `viewport-fit=cover`, `svh/dvh` (not `100vh`), `touch-action: manipulation`, in-app Back in standalone, install prompt after interest, SW update prompt, offline page, bfcache-friendly.
- [ ] Platform-specific items checked: Android edge-to-edge + `OnBackPressedCallback`; iOS system components, size classes, Dynamic Type.

## 10. Data-dense additions

- [ ] Tables decided by task (cards / sticky-column scroll / pop-in); semantics preserved; overflow cue visible.
- [ ] Selection mode with count, Select all, contextual bar, undo.
- [ ] Filters in a sheet with "Show N results", applied chips, exact empty states; sort state visible.
- [ ] Numbers via `Intl`, tabular figures, sign + text; status = icon + text + color.
- [ ] Dashboards: needs-attention first, 3-5 KPI tiles, chart with text summary and table fallback.
- [ ] Hover-only controls replaced; density ≥ touch minimums.

## 11. Copy

- [ ] Verb-first buttons; sentence case; no "OK/Submit/Yes/No".
- [ ] Errors follow the formula; no "Oops/Invalid/Please", no blame, no codes.
- [ ] Destructive dialogs name the object and consequence.
- [ ] Strings externalized, plurals via rules, containers tolerate +200% expansion, dates/numbers via formatters.

## 12. Release gate

- [ ] All **(gate)** items pass; review-system.md scored; verdict recorded.
- [ ] States, platforms, themes, text sizes and windows not tested are listed as assumptions in the reply.
- [ ] Claims without sources are marked as judgment; platform versions/API names that change were verified or flagged.
