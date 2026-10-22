# Mobile UX anti-patterns (Problem → Why it happens → Better alternative)

Read this when: reviewing a design or generated UI, before declaring a screen finished, or when a request pulls toward a risky pattern. Each item ends with its evidence class: `[S]` standard, `[P]` platform, `[R]` research, `[C]` consensus, `[H]` judgment/opinion, `[T]` trend, `[L]` legal/policy. Items tagged `[H]`/`[T]` are our judgment, not evidence: say so when you cite them. Details and sources live in the topical files linked in each section.

Contents: 1 Layout and structure · 2 Touch and gestures · 3 Navigation · 4 Overlays and interruptions · 5 Forms and input · 6 Loading, errors, empty states · 7 Motion · 8 Visual noise and trends · 9 Typography, color, accessibility · 10 Performance · 11 Dark patterns · 12 Failures typical of AI-generated UI · 13 Weak-evidence claims not to cite as law

---

## 1. Layout and structure

| Anti-pattern | Why it happens | Better alternative | Class |
|---|---|---|---|
| Desktop UI squeezed onto mobile (multi-column layouts, hover-only affordances, dense tables, long nav) | Shrink-only breakpoints and reused desktop components | Re-prioritize content, single column, reflow at 320 CSS px, tap/long-press with visible alternatives, tables as cards or contained scroll, task table first (data-dense.md) | `[S 1.4.10][R]` |
| Fixed-pixel layouts, `isTablet` checks, orientation locks | Device-centric thinking | Window size classes, content-driven breakpoints, container queries (responsive.md) | `[P]` |
| Full-width text with no max measure on tablets/foldables/landscape | Fluid layout without a cap | Cap text columns ~50-75 characters (`max-width ≈ 70ch`) | `[R][S 1.4.8 AAA]` |
| `100vh` shells hiding content behind browser UI | `vh` = large viewport | `svh` for must-fit, `dvh` for adaptive shells | `[P-WEB]` |
| Sticky chrome (top bar + chip row + bottom bar + banners) consuming too much viewport, worst with the keyboard open | Stacked persistent elements | Budget all persistent chrome; ~25% viewport is a review trigger (our heuristic); verify with the keyboard open | `[H]` |
| Too many navigation levels | IA grew by org chart | ≤ 2 disclosure levels, flatten via search/filters, hubs for ≥ 15 children; keep the tab bar visible during navigation | `[R]` |

## 2. Touch and gestures

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Tiny touch targets / crowded edge controls | Aesthetic density, web link sizes | ≥ 44pt iOS, 48dp Android with ≥ 8dp gaps; WCAG floor 24 CSS px; expand the hit area, not the glyph | `[S][P][R]` |
| Gesture-only interactions (swipe-only delete, pinch-only zoom, drag-only reorder, hold-only record) | "Modern" feel | Single-pointer alternative for path-based and drag gestures; visible control + gesture accelerator | `[S 2.5.1/2.5.7][P]` |
| Hidden critical actions (behind overflow, long-press, swipe) | Clean minimal look | Keep the primary action visible; gestures as accelerators only | `[P][S]` |
| Interactive content under the gesture inset or at the very screen edge; carousels flush to the edge | Edge-to-edge zeal | Inset interactive content; side gutters + peek next card | `[P-AND][R]` |
| Destructive control next to a frequent one; swipe-to-delete with no undo | Convenience placement | Separate ≥ 8-16dp, destructive-styled and last in menus, undo or explicit-verb confirm | `[R]` |
| Pull-to-refresh as the only refresh, or on non-refreshable content | Convention copy | Visible refresh action + auto-refresh; use only for re-fetchable data | `[P-AND][C]` |
| Thumb-zone-only layouts | Misreading conceptual diagrams | Bottom nav + centre content + top Back; larger, spaced targets | `[R]` |

## 3. Navigation

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Hamburger/drawer as the sole nav for core features | Space economy | Visible bar for ≤ 5 core destinations; combo for more (NN/g: hidden nav used 57% vs 86% on mobile, ~15% slower) | `[R]` |
| > 5 bottom tabs, auto "More" overflow, hidden/disabled tabs | IA not pruned | Consolidate; rail/sidebar on wide windows; explanatory empty states | `[P]` |
| Icon-only navigation/unclear icons | Icon-first minimalism | Icon + visible label; only home/print/magnifier are reliably understood | `[R]` |
| Nested tabs-in-tabs, mixing navigation tabs and in-page tabs, stacked tab rows | Feature accumulation | One bar + segmented control/filters/push | `[R][H]` |
| Hijacking or breaking Back (dummy history, unpredictable overlays closing the app) | Engagement/ad tricks | `pushState` only for real screens; Back closes the top overlay; proper back dispatcher | `[L][P]` |
| Scroll-jacking, full-viewport snap pages | Trend | Native scroll with anchors | `[H]` |
| Hide-on-scroll chrome that loses the primary action or ignores a11y | Real-estate focus | Return on small upward scroll; never hide the only primary action; disable for AT users | `[R][P]` |

## 4. Overlays and interruptions

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Excessive modals/popups/interstitials | Capture email/app installs/consent | Inline or nonmodal banners, contextual timing, one at a time; legal gates as small overlays | `[R][L]` |
| Excessive/nested bottom sheets; sheet for multi-step or long forms; sheet closable only by drag | Sheets feel native | One sheet at a time, visible Close, push/full-screen for multi-step | `[P][R]` |
| Forced app-install banners/full-page interstitials | Growth push | Small dismissible banner or in-app flow after value | `[P][L]` |
| Permission prompt at first launch; pre-prompt with "Allow" mimicry or a Cancel bypass | Early data grab | Ask in context on the user's tap, single neutral "Continue" | `[P]` |
| Account wall before value | Data capture | Browse/try/guest checkout, ask after the first success | `[R]` |
| Cookie/consent banner covering the screen, asymmetric accept/reject | Compliance by obstruction | Small, equal-weight controls, no pre-ticked categories | `[R][L]` |
| Confirm dialogs on everything / "Are you sure? Yes/No" | Safety reflex | Undo + soft delete; specific destructive dialogs only for irreversible | `[R]` |
| Toast as the only record of an error or result | Looks clean | Inline/banner + status role; Undo-only toast needs an alternate path | `[S 2.2.1/4.1.3][P]` |
| Sticky bars or promos before first meaningful task; rating prompt at launch | Growth | One prompt per session after engagement | `[R][P]` |

## 5. Forms and input

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Overly long forms | Each stakeholder adds fields | Cut fields (Baymard: 11.3 average vs ~8 needed), defer optional ones, autofill | `[R]` |
| Placeholder as label; floating-label shortcuts | Space saving | Persistent visible label above the field | `[R]` |
| Disabled submit with no explanation (forms with > 2 fields or hidden rules) | "Prevent errors" | Keep enabled, validate on submit, show what's missing | `[R][C]` |
| Premature inline errors while typing; success ticks on easy fields | Instant-feedback habit | Validate on blur/submit; live only for hard-rule fields | `[R]` |
| `type=number` for IDs/phones/cards/OTP; hard masks; blocking paste | Convenience | `inputmode`, normalize, accept formatted paste | `[R][S 3.3.8]` |
| Split one-digit OTP boxes without paste/autofill | Looks nice | One field `one-time-code` (or rebuild paste/autofill/backspace/labels) | `[R]` |
| Confirm-email / confirm-password fields; clearing the form after an error | Legacy | Verify by link/code; show/hide toggle; preserve input | `[R]` |
| CAPTCHAs / cognitive tests for sign-in | Bot defense by default | Passkeys, email link, password managers | `[S 3.3.8]` |
| Keyboard covering the submit button | Fixed bottom bars | In-flow submit, sticky inside the scroll container, insets/IME padding | `[P]` |

## 6. Loading, errors, empty states

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Infinite skeleton/spinner | No timeout/error design | Three exits: success, error, timeout; Retry re-enters loading | `[R][H]` |
| Skeleton for < 1 s loads, unknown layouts, or actions; frame-only skeletons | Skeleton folklore | Nothing or inline pending; progress for actions | `[R]` |
| Spinner-only for long waits; fake or stalled progress | Easy implementation | Determinate + text + Cancel + background | `[R][P]` |
| Generic "Something went wrong"/"Oops!"/blame-y/jargon errors; error color only | Template habit | Specific, calm, actionable; text + icon + border | `[R][P]` |
| Empty screens with no CTA | Missing state design | What/why/next + one action | `[R]` |
| Wiping screens on connectivity loss | No offline model | Cached reads + queued writes + sync status | `[R]` |

## 7. Motion

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Animation overload: bounce on everything, parallax, page-load choreography, long fade-ins on data screens | "Delight" culture | Functional/feedback motion only; 100-300 ms; bounce 0 by default | `[P][R]` |
| Animation that blocks interaction | Awaited transitions | Interruptible, retargetable, never gate input | `[P]` |
| Confetti/celebration for routine actions; auto-playing loops | Gamification | One small check; celebrate rare milestones, play once | `[R][S 2.2.2]` |
| No reduced-motion fallback | Forgotten | Per-platform detection + cross-fade/instant | `[S][P]` |
| Motion as the only signal (shake-only error) | Motion feels sufficient | Add text, icon, haptic | `[P][S 1.4.1]` |
| A different transition style per screen | Per-screen tinkering | Fixed token set; pattern by relationship | `[C]` |

## 8. Visual noise and trends

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Excessive rounded cards, card-in-card, identical card grids | Default component kits | Use a container only when spacing can't group; one container level; rank by importance | `[H]` (no neutral evidence for radius per se) |
| Excessive shadows/gradients, glassmorphism everywhere | Trend copying | Single static elevation; glass only on the navigation/control layer with scrim and contrast checks | `[T][P]` |
| Text over images/gradients/glass without a scrim | Aesthetic trend | Scrim + 4.5:1 check at the worst pixel | `[S][R]` |
| Flat signifiers on interactive elements in dense screens | Minimalism | Keep depth/contrast cues (NN/g: +22% time, +25% fixations with weak signifiers) | `[R]` |
| Visual noise/clutter, decorative hero illustrations on task screens | Marketing reflex | Remove non-informational elements (Nielsen #8); illustrations only on onboarding/empty states | `[R]` |
| Inconsistent spacing/typography | Ad-hoc values | Token scale | `[C]` |
| Emoji as UI icons; lorem ipsum/fake data left in screens | Speed | Platform symbol sets or accessible SVG; realistic content incl. longest strings and empty/error states | `[H]` |

## 9. Typography, color, accessibility

| Anti-pattern | Why | Better | Class |
|---|---|---|---|
| Low-contrast "aesthetic" gray text; tiny captions (< 11-12px) | Brand minimalism | ≥ 4.5:1 normal text; ≥ 12px | `[S][P]` |
| Fixed font sizes ignoring Dynamic Type/sp; fixed-height text boxes; `user-scalable=no` | Hard-coded values | Text styles/sp/rem; min-height; allow zoom | `[S][P]` |
| Color-only status/errors | Style shortcut | Color + icon/text/shape | `[S 1.4.1]` |
| Truncating essential info with an ellipsis (price/status/date) | Fixed single-line rows | Wrap essential text; truncate secondary only, with a way to read it | `[S 1.4.4][H]` |
| Session timeout without warning | Security default | Warn ≥ 20 s, allow extension, save drafts | `[S 2.2.1]` |
| Autoplay audio/video; auto-advancing carousels; unnecessary carousels | Engagement metrics | No autoplay with sound; manual controls; static or peeking scroller | `[S][R]` |
| Placeholder-only, div-buttons, icon buttons without names, focus lost after navigation, positive tabindex, `outline:none` | Framework/AI habits | Native elements, names, focus management, visible focus | `[S]` |

## 10. Performance

Animating layout properties or shadows; global `will-change`; non-passive scroll listeners; images without dimensions/decoding at display size; lazy-loading the hero; full-viewport blur over scrolling content; unbounded lists; hundreds of KB of JS to render static content; polling and held wake locks; artificial splash delays. Alternatives and evidence: performance.md.

## 11. Dark patterns (default: do not implement)

Fake urgency/countdown/scarcity; confirmshaming; roach-motel cancellation; forced continuity/hidden subscription; hidden costs/sneak-into-basket; pre-checked consent/add-ons; nagging after refusal; disguised ads; fake social proof; asymmetric accept/decline styling; addictive loops (infinite feeds, streak guilt) in utility/enterprise/minor audiences. Why they appear: conversion-metric optimization, A/B obsession, copying competitors, and business-goal prompts to LLMs (55.8% of LLM-generated e-commerce components contained ≥ 1 deceptive design in one CHI 2026 study). Alternative: apply the boundary test in principles.md section 6 and offer the honest variant. `[L][R]`

## 12. Failures typical of AI-generated mobile UI (our synthesis; no measured ranking exists)

Purple/indigo gradients and "statistical-center" default palettes (models sample the center of training data; pick palette from brand/product context) `[T]` · glassmorphism on every card `[T]` · emoji icons · identical card grids with no hierarchy · lorem ipsum and perfect fake data (hides long names, empty/error/loading/offline states, locales) · decorative hero illustrations on data screens · every state implemented except loading/empty/error/offline · `div` buttons and icon buttons without names · placeholder-as-label · color-only errors · disabled submit traps · fixed px text and fixed-height text containers · `user-scalable=no` · focus lost after navigation · toasts as the only feedback · gesture-only actions · motion with no reduced-motion branch · desktop layouts shrunk · bounce on everything · fake urgency copy when prompted for conversion. The accessibility part is backed by WebAIM Million 2026 failure classes (low contrast 83.9%, missing alt 53.1%, missing labels 51%, empty links 46.3%, empty buttons 30.6%) and two 2025-26 preprints on LLM-generated UI barriers; the rest is judgment.

## 13. Weak-evidence claims not to cite as law

F-pattern on mobile; thumb-zone color maps and "49% one-handed"; the 3-click rule; "users don't scroll"; the goldfish attention span; "40%/53% abandon after 3 s"; Miller's 7±2 as a menu cap; "fewer options always better"; Zeigarnik and decision fatigue as design drivers; "rounded corners/shadows/gradients harm usability" (or help it); "skeletons are always better"; "hamburger menus always bad"; M3 Expressive's "4× faster" claim; the 60-30-10 color rule; any single "thumb reach" percentage. Cite them as folklore or conditional, not as requirements (see principles.md section 7).
