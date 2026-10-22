# Mobile UI review system (scoring with critical-failure gates)

Contents: 1 Critical-failure gates · 2 Dimensions · 3 Overall verdict · 4 Review discipline

Read this when: evaluating a finished or in-progress mobile interface (yours or someone else's), producing a review/score, or deciding whether a screen is production-ready. Run checklists.md first, then score here.

Principle: **a score must never hide a critical failure.** Excellent visual design + an inaccessible interaction = NOT production-ready. Scoring has three layers: (1) critical-failure gates (any one blocks "production-ready" regardless of score), (2) twelve dimension scores 0-10 with anchors, (3) an overall verdict derived from the weakest dimensions, not the average.

## 1. Critical-failure gates (any ONE = "Not production-ready")

| # | Gate | Test |
|---|---|---|
| G1 | Primary task cannot be completed with a screen reader / switch / keyboard alternative | Complete the main task with VoiceOver/TalkBack or Tab-only; any dead end fails |
| G2 | Touch target below the floor on a primary action (< 44pt iOS, < 48dp Android, < 24 CSS px web) | Inspect hit areas of primary actions and navigation |
| G3 | Text/UI contrast fails WCAG AA on primary content (4.5:1 text, 3:1 UI) in any shipped theme | Check light, dark, increased contrast |
| G4 | Text clipped or content lost at 200% text scale / 320 CSS px reflow | Test AX5/200% and narrow width |
| G5 | Gesture-only path for an important action (no visible alternative) | List every gesture; find its tap path |
| G6 | Destructive or irreversible action without undo/confirmation (or confirmation on everything with no undo path) | Walk each destructive action |
| G7 | A loader, skeleton or spinner with no timeout/error exit; or a blank/dead-end empty or error state | Kill the network, return empty data, return an error |
| G8 | Data loss: input cleared on error, lost on rotation/interruption, or lost on Back (exception: password and OTP fields are cleared after a failed attempt by design) | Fill a form, trigger an error, rotate, background the app |
| G9 | Back behavior broken or hijacked; overlay can't be dismissed without a gesture | Press Back in every overlay and tab |
| G10 | Content hidden behind the keyboard, safe area, notch or system bars so a primary action is unreachable | Keyboard open, landscape, cutouts |
| G11 | Motion with no reduced-motion path on large/vestibular-triggering animation (parallax, zoom, auto-advancing, > 5 s auto-play) | Enable Reduce Motion |
| G12 | Deceptive pattern (fake urgency, pre-checked consent/add-on, asymmetric cancel, confirmshaming) | Apply the boundary test (principles.md §6) |
| G13 | Color is the only indicator of an error/status/selection on a primary flow | Grayscale pass |
| G14 | Zoom disabled (`user-scalable=no`/`maximum-scale=1`) or orientation locked without a real need | Inspect viewport/manifest |
| G15 | Performance: interaction or scroll visibly janky on the target device class, or a measured budget exceeded with no mitigation | Profile on a mid-tier device with a release build |

If any gate fails: verdict = **Not production-ready**, list the gates first, then still provide the scores to guide fixes.

## 2. Dimensions (score each 0-10; anchors)

Anchors apply to every dimension: **0-2** broken/harmful · **3-4** major gaps · **5-6** works but with notable issues · **7-8** solid with minor issues · **9-10** exemplary, evidence-backed, tested. Use whole numbers; justify each with one specific observation and one fix. Cap any dimension at 6 if it has an untested assumption that a gate would catch.

| Dimension | What a 9-10 looks like | Typical deductions |
|---|---|---|
| 1 UX (task fit, flow) | Primary goal and action obvious in 5 s; shortest path; defaults and autofill reduce effort; recoverable | Unclear goal, extra steps, unnecessary fields, no defaults |
| 2 Navigation | 3-5 visible labeled destinations (or justified alternative); predictable Back; state preserved; deep links; current location always clear | Hidden core nav, > 5 tabs, hijacked Back, lost state |
| 3 Visual hierarchy | One dominant element per section; consistent spacing/type tokens; neutral + one accent; grouping by proximity | Equal-weight actions, noise, card-in-card, text over busy images |
| 4 Interaction | Targets ≥ 48 with spacing; gestures are accelerators with visible twins; immediate feedback; one-handed viability; right controls for the data | Tiny/crowded targets, gesture-only, wrong control (dropdown for 3 options) |
| 5 Accessibility | Names/roles/states, contrast in all themes, scalable text, focus, announcements, reduced motion, alternatives to gestures; tested with AT | Missing names, color-only, fixed text, focus lost |
| 6 Motion | Every animation tagged functional/feedback; 100-300 ms; interruptible; reduced-motion path; no blocking | Decorative loops, long fades, bounce everywhere, no RM path |
| 7 Performance | Transform/opacity animation, virtualized lists, image/byte budgets, measured on mid-tier hardware, honest loading | Layout animation, unbounded lists, big blur, no measurement |
| 8 Responsiveness | Window-size-class aware; panes/rail at width; max widths; foldable/landscape/split-screen safe; PWA safe areas | Stretched phone UI, device-type checks, orientation lock |
| 9 Error handling | Calm specific messages; inline + summary; retry; draft preserved; offline/timeouts/permission-denied designed; no dead ends | Generic errors, lost input, infinite loaders |
| 10 Forms | Labels above, minimum fields, correct keyboards/autocomplete, timed validation, specific errors, idempotent submit, accessible auth | Placeholder labels, `type=number` IDs, premature errors, disabled-button traps |
| 11 Information architecture | Task-first, role-aware, progressive disclosure ≤ 2 levels, clear primary/secondary/tertiary actions, search/filter/sort fit the data | Org-chart IA, buried tasks, desktop hierarchy squeezed |
| 12 Platform consistency | Adopts OS behaviors (back, scroll, text editing, permissions, insets, dark mode, system components); brand only where the contract holds | Re-skinned OS controls, broken edge-swipes, ignored system settings |

## 3. Overall verdict

1. Compute the **mean** of the 12 scores (for information only).
2. Compute the **floor** = the minimum score.
3. Verdict:
   - Any gate failed → **Not production-ready** (regardless of mean).
   - Floor ≤ 4 → **Not production-ready** (a weak dimension is a defect, even if the mean is high).
   - Floor 5-6 or any dimension 5-6 with a user-facing consequence → **Needs work before release**.
   - Floor ≥ 7 and mean ≥ 7.5 → **Production-ready with minor polish**.
   - Floor ≥ 8 and mean ≥ 8.5 → **Strong**; remaining work is refinement.
4. Report format: verdict line → gates (pass/fail with evidence) → table of 12 scores each with one observation + one fix → top 5 fixes ordered by user impact → assumptions not tested (devices, AT, themes).

## 4. Review discipline

- Observe, don't assume: a pretty design is not evidence of usability (aesthetic-usability effect); check behavior, not looks.
- Review states, not just the happy path: loading, empty, error, offline, permission-denied, long text, 200% text, dark mode, small and large windows.
- Tag each finding with its evidence class (`[S]`, `[P]`, `[R]`, `[C]`, `[H]`); say when a finding is judgment. Never present folk claims (thumb zones, 7±2, 3-click) as requirements.
- Prefer the smallest fix that removes the failure; include a platform-appropriate implementation note when helpful.
- When the user's constraints conflict with a gate (e.g., brand mandates tiny targets), report the gate as failed and propose a compliant alternative, but respect their decision if they accept the risk.
