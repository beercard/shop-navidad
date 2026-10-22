---
name: mobile-ui-ux
description: Evidence-based mobile UI/UX design brain for any stack (PWA, responsive web, React/Next, Vue/Nuxt, Svelte, Flutter, React Native, Compose, SwiftUI, Capacitor/Ionic). Use whenever the user asks to build, design, review, redesign, audit, or convert any mobile screen, app, PWA, responsive page, or desktop-to-mobile interface, including dashboards, tables, forms, navigation, bottom sheets, lists, onboarding, auth, checkout, settings, data-dense enterprise apps (school, ERP, CRM, HRIS, finance, admin), loading/empty/error/offline states, mobile animations and micro-interactions, dark mode, tap targets, gestures, safe areas, accessibility, performance, or UX copy. Also trigger for "make it feel native/premium/smooth", "convert this desktop UI to mobile", "responsive PWA", "Flutter/Kotlin/Swift/React Native screen", or "review this mobile UI", even when the user never says "UX". It supplies decision rules, numbers, tokens, anti-patterns, a review score with critical-failure gates, and honest evidence tags.
---

# Mobile UI/UX skill

## 1. Purpose

Teach an agent how a professional mobile interface should **behave, feel, move, communicate and respond**, not merely how it looks. The skill is technology-agnostic: it states UX and interaction rules first, then maps them to stacks. Target feel: premium without flash, modern without trends, animated without noise, dense when needed without overwhelm, simple without being simplistic. Optimize for clarity, usability, hierarchy, responsiveness, accessibility, performance and polish, never for novelty, glassmorphism, gradients, decorative motion or huge rounded cards.

The rules come from primary sources (Apple HIG, Android/Material docs, WCAG 2.2, W3C ARIA APG, web.dev/MDN, NIST, regulators), research organizations (NN/g, Baymard, GOV.UK) and mature-product case studies, cross-checked and tagged by evidence strength. Part of the numeric detail is from memory or snippets (m3.material.io was unreachable): each file marks which. Research date 2026-10-06. Where evidence is thin, the files say so: do the same when you cite them.

## 2. How to use this skill (workflow)

1. **Triage the request**: new screen · whole app · desktop→mobile conversion · PWA/responsive · component question · review/audit. Pick the matching recipe in section 7.
2. **Frame before designing**: answer the questions in section 4 (briefly, in the reply or a code comment). If the user's goal or primary action is unclear, state your assumption.
3. **Load only the references you need** (section 6). Always skim `decision-rules.md` for the domain; open the topical file for numbers and exceptions.
4. **Decide in this order**: information hierarchy → navigation → components/containers → states (loading/empty/error/offline) → forms/input → tokens (type/space/color/radius) → motion → accessibility → performance → responsive/platform adaptation → copy.
5. **Implement** with semantic tokens and platform components. Keep rules technology-neutral in the reasoning; use the stack mapping tables (`design-tokens.md`, `accessibility.md`, `forms.md`, `responsive.md`) to translate.
6. **Verify**: run `checklists.md`, then score with `review-system.md`. Any critical-failure gate failing means the screen is not production-ready, whatever the score.
7. **Report honestly**: list assumptions, untested conditions (devices, assistive tech, themes, text sizes, window sizes), rules you judged rather than sourced, and platform facts you did not re-verify.

## 3. Core principles (condensed from principles.md)

1. Design from the user's task: one primary goal, one primary action, essentials first, everything else deferred.
2. Keep system state and location visible: feedback within ~100 ms, progress after ~1 s, current destination always marked.
3. Visible beats hidden: persistent labeled navigation; gestures are accelerators with visible alternatives.
4. Recognition over recall; defaults, autofill and pickers over typing.
5. Reversible beats confirmed: undo before dialogs; confirm only serious, irreversible actions.
6. Errors are calm, specific, local and recoverable; loaders always have an exit.
7. Respect the platform contract and the user's settings (back, scrolling, safe areas, permissions, dark mode, text size, reduced motion, contrast).
8. Touch first, one-handed where practical, never thumb-zone-only: targets ≥ 48 with spacing.
9. Accessibility is part of the design: names/roles/states, contrast, focus, announcements, alternatives.
10. Motion communicates, it does not decorate: 100-300 ms, interruptible, reduced-motion path.
11. Performance is UX: compositor-friendly animation, virtualized lists, honest loading, measured on mid-tier devices.
12. Reduce, then disclose progressively (≤ 2 levels); structure choices instead of capping them.
13. Familiarity first; novelty only with a stated reason and a test plan.
14. Adapt to the window, not the device; never scale desktop down or phone up.
15. Consistency via semantic tokens; restraint via one primary emphasis per section.
16. Respect attention and trust: no dark patterns, nagging or manufactured urgency.
17. Do not sacrifice usability for visual trends: trends enter only on request and only if they pass contrast, signifier and performance checks.

## 4. Decision framework (answer these for any mobile UI)

```
What is the user's primary goal? What is THE primary action?
What information is essential? What can be progressively disclosed?
What interaction is most natural on this platform (tap, form control, sheet, push)?
What feedback does each interaction need (state change, progress, success, failure)?
What happens while loading? When there is no data? When something fails? Offline?
When a permission is denied? When text is 200% and the theme is dark?
How does this behave with one hand? With a screen reader or switch? With reduced motion?
How does it behave on a small phone, a large phone, landscape, split-screen, a foldable, a tablet, a desktop PWA window?
Does each animation communicate something? Is it worth its performance cost?
Which conventions (platform and domain) apply, and where am I deviating and why?
```

## 5. Decision rules: the ~43 that matter most (numbers are defaults; evidence tags live in `decision-rules.md`; many thresholds are `[H]` judgment) (full set of 120 in `references/decision-rules.md`)

```
IF an action is primary                       → make it visually dominant (one filled button) and reachable.
IF several actions compete                    → hierarchy: 1 filled, 1-2 secondary, rest text; never equal weight.
IF content is secondary                       → progressive disclosure (≤ 2 levels), signposted by a label.
IF an interaction changes state               → immediate feedback (≤ ~100 ms).
IF an operation takes noticeable time         → communicate progress; <1 s nothing, 1-10 s spinner/skeleton, >10 s determinate + cancel.
IF an error can be recovered                  → provide a recovery action; preserve the user's input.
IF a loader exists                            → it has success, error and timeout exits.
IF a gesture is not discoverable              → provide a visible alternative; every swipe/drag/pinch has a tap path.
IF a target is interactive                    → ≥ 44pt iOS / 48dp Android / 44 CSS px, ≥ 8 spacing; never < 24 CSS px.
IF 3-5 peer destinations                      → persistent bottom bar with icon + label; >5 → 4 visible + labeled hub as the 5th slot; never hide core nav.
IF medium/expanded width                      → rail/sidebar/panes, decided by window width, never device type.
IF a task is short and contextual             → sheet with visible Close + Back dismissal; multi-step/long → page or full-screen modal.
IF action is reversible                       → perform + Undo snackbar; IF irreversible/serious → verb-labeled dialog naming the object.
IF information is non-actionable              → inline or snackbar, not a dialog.
IF a toast is the only record of a result     → don't; use inline/banner + status role.
IF items are homogeneous and compared         → list rows; heterogeneous/media → cards; never card-in-card.
IF 2-4 options (≤5 with room) → radios; 5-10 → picker/menu; 11-15 → sectioned/searchable picker; >15 or dynamic → searchable combobox; known value → typed input. [H]
IF a setting applies immediately              → switch; needs Submit → checkbox.
IF a form field exists                        → visible label above; placeholder = format example only.
IF a value is an identifier (card/OTP/postcode)→ text + inputmode numeric, never type=number; set autocomplete.
IF validating                                 → blur for format, live only for hard-rule fields, submit for empty required.
IF the form has >2 fields or hidden rules     → keep submit enabled; in-button progress; idempotency key.
IF a region can be empty                      → designed empty state: what / why / next, one action.
IF showing a skeleton                         → only for known layouts, exact final sizes, never for actions.
IF optimistic UI                              → only cheap reversible actions; roll back visibly; never payments.
IF animating                                  → transform/opacity only; feedback 70-150 ms, surfaces 200-300 ms, full-screen ≤ 400 ms.
IF entering → decelerate; exiting → accelerate (~0.7× enter); user-driven → spring with bounce 0 by default.
IF Reduce Motion is on                        → no translate/scale/parallax; cross-fade ≤ 150 ms or instant; stop loops.
IF animation does not communicate state       → question it; IF it hurts performance → simplify it.
IF text                                       → scalable units, no fixed-height text boxes, survives 200% and 320 CSS px.
IF contrast                                   → text ≥ 4.5:1 (large 3:1), UI/focus ≥ 3:1 in every theme; color never the only signal.
IF dark mode                                  → re-author (off-black, lighter surfaces for elevation), never invert; follow the system.
IF list can grow                              → virtualize; Load more (15-30/batch) for task lists; infinite scroll only for leisure feeds.
IF blur/translucency                          → ≤ 1-2 small static chrome surfaces with opaque fallback.
IF desktop information cannot fit             → redesign the hierarchy from a task table; don't shrink.
IF a table                                    → by job: lookup→cards, compare→sticky-column scroll, drill-in→pop-in; never 8-10 shrunk columns.
IF a platform behavior is OS-integrated       → adopt it (back, scroll, text editing, permissions, safe areas).
IF a component violates platform a11y conventions → redesign it.
IF a pattern exists only because it is trendy → don't use it without a clear UX reason.
IF a request implies urgency/scarcity/pre-checked consent/hard cancel → apply the boundary test; offer the honest variant.
```

## 6. Reference map (read when)

| File | Read when |
|---|---|
| `references/principles.md` | You need reasoning, a psychology law's real evidence, a conflict resolved between sources, the dark-pattern boundary test, or the folk-wisdom audit |
| `references/decision-rules.md` | You want the full IF→THEN rule set (120 rules, tagged) or are auditing rule by rule |
| `references/platform-guidelines.md` | Targeting iOS/Android/cross-platform; adopt-vs-unify decisions; iOS 26 Liquid Glass / M3 Expressive facts; platform differences table |
| `references/navigation.md` | App structure, tab bars, Back, deep links, gestures, touch sizes/ergonomics, thumb-zone critique, search/filter/sort placement, IA |
| `references/components.md` | Choosing buttons/sheets/dialogs/menus/chips/cards/lists/pickers/carousels/pagination/charts; comparison tables; component numbers |
| `references/forms.md` | Any form, auth, OTP, checkout, keyboard handling, validation, destructive confirmations, permissions; field→keyboard/autofill cheat table |
| `references/states-feedback.md` | Loading ladder, skeletons, progress, empty states, error taxonomy, retry, toasts/banners/dialogs, undo, offline, notifications |
| `references/ux-writing.md` | Any UI string; 30 before/after rewrites; localization; capitalization; length budgets |
| `references/motion.md` | Any animation, transition, micro-interaction, haptic; motion tokens; reduced-motion implementation |
| `references/accessibility.md` | WCAG 2.2 numbers, screen readers, focus, text scaling, contrast, dialogs, live regions, stack API map, testing protocol |
| `references/performance.md` | Frame budgets, animation cost, lists/images/fonts, blur/shadows, perceived performance, battery, measurement, budgets |
| `references/responsive.md` | Breakpoints/window size classes, canonical layouts, foldables, PWA install/manifest, safe areas/keyboard/viewport units, iOS PWA limits, webviews |
| `references/data-dense.md` | Tables, dashboards, selection/bulk actions, filters, enterprise forms, desktop→mobile method + idiom map, school/ERP/CRM/HRIS/finance patterns |
| `references/design-tokens.md` | Token philosophy, default values, type scale, spacing/radius/elevation, dark mode, DTCG pipeline, mapping to CSS/Tailwind/Flutter/RN/Compose/SwiftUI |
| `references/product-patterns.md` | Benchmarks from real products by category; what NOT to import from consumer apps into utility/enterprise |
| `references/anti-patterns.md` | Reviewing for failures; AI-generated UI tells; folk claims not to cite |
| `references/checklists.md` | Before building and before declaring done |
| `references/review-system.md` | Scoring a UI: 15 critical-failure gates + 12 dimensions + verdict logic |
| `research/` | Evidence trail: `RESEARCH-REPORT.md` (Parts 1-13 overview, validation audit) and `notes/` (raw per-slice notes with sources and VERIFIED/SNIPPET/MEMORY tags) |

## 7. Recipes for common requests

**"Build this mobile screen / feature"**: frame (section 4) → pick the container and navigation context → define the data states (loading/empty/error/offline) → choose components with `components.md` D1-D10 → forms with `forms.md` → tokens (default set if no brand) → motion only where it communicates → implement with platform components → run `checklists.md`. Deliver the screen plus a short "decisions and assumptions" note.

**"Convert this desktop interface to mobile"**: produce the task table first (task | frequency | mobile? | pattern); cut/defer low-frequency admin tasks ("continue on desktop"); define ≤ 5 task-oriented destinations; map desktop idioms with the table in `data-dense.md` §3 (hover → tap/inline, right-click → long-press + overflow, drag → "move to", multi-column → single column, split view → push, inline edit → sheet); decide tables by job; keep filters in a sheet with applied chips; state what moved to desktop. Never ship a shrunken desktop layout.

**"Create a Flutter / React Native / Compose / SwiftUI app"**: same workflow; adopt platform behaviors (back, safe areas, text scaling, pickers, permissions); build a semantic token layer (`design-tokens.md` §16 mapping) first; respect Dynamic Type/sp and reduced motion; use native or adaptive components for OS-integrated controls (`platform-guidelines.md` §2); profile on a mid-tier device in release/profile mode (`performance.md` §9).

**"Build a responsive PWA"**: mobile-first CSS with content-driven breakpoints and container queries; `width=device-width, initial-scale=1`, `viewport-fit=cover`, safe-area padding, `svh/dvh`; adaptive navigation (bar → rail → sidebar); manifest + install UX after demonstrated interest; standalone-mode Back/refresh; offline page and SW update prompt; iOS limits (`responsive.md` §12-15); accessibility and performance budgets.

**"Build a mobile dashboard for an enterprise app"** (worked example of the expected output):
- *Goal/action*: managers need "what needs my attention now" and a few health numbers; primary action = open the item that needs action.
- *IA*: ≤ 5 task destinations by role (e.g., Home, Tasks/Approvals, Reports, People, More-as-hub); search in one place.
- *Home layout*: "Needs attention" block (counts tappable into pre-filtered lists) → 3-5 KPI tiles (value + delta + period + sparkline, status icon + text) → one primary chart per card (bar/line, direct labels, tap-to-value readout, "View table" fallback) → shortcuts. Filters (period/campus/class) in one sheet with applied chips.
- *States*: skeleton for known tile layout (1-10 s), per-tile error with Retry, empty ("No approvals pending, you're all caught up"), offline banner with "Updated 3 min ago".
- *Interaction*: whole-row/tile targets ≥ 48dp; no hover; swipe actions only as accelerators with overflow equivalents; approvals with explicit Approve / Send back / Reject and Undo.
- *Tokens*: default set, comfortable density, tabular figures, `Intl` formatting, status = icon + text + color.
- *Motion*: 100-250 ms fades/cross-fades for tile refresh; no entrance choreography; reduced-motion path.
- *A11y/perf/responsive*: 200% text, AT names on charts, table fallback; virtualized lists; at ≥ 840dp two-pane list-detail and rail.
- *Reply includes*: the decisions above, assumptions, untested conditions, judgment calls (e.g., "3-5 KPI tiles is our heuristic").

**"Review this mobile UI"**: observe states, not just the happy path; run gates and dimensions from `review-system.md`; tag each finding with its evidence class; give the top 5 fixes by user impact and an implementation note per platform.

## 8. Defaults when the user gives no brand or constraints

Use the default token set in `design-tokens.md` §5-§10 (4-based spacing, 0/4/8/12/16/28/full radius, type roles with 16/17-base body, neutral surfaces + one accent, `#121212` dark canvas, state layers .08/.10/.10/.16, motion 100/150/250/300/400 ms with standard/enter/exit curves). Platform defaults: follow the system for dark mode and text size; sentence case copy; comfortable density; bottom navigation for 3-5 destinations on compact widths.

## 9. Honesty and evidence rules (non-negotiable)

Tag legend: `[S]` standard · `[P]`/`[P-iOS]`/`[P-AND]`/`[P-WEB]` platform · `[R]` research (`[R-weak]` thin/dated, `[R-T2]` practitioner model) · `[C]` consensus · `[H]`/`[O]` heuristic/opinion · `[D]` derived from sourced values · `[T]` trend · `[L]` legal/policy.

- **Tag your own rules** with the evidence classes used in the files: `[S]` standard, `[P]` platform guideline, `[R]` research, `[C]` consensus convention, `[H]` heuristic/judgment, `[T]` trend, `[L]` legal/policy. Never present `[H]`/`[T]` as proven. When asked "why?", cite the class, not folklore.
- Do not cite folk claims as law (thumb-zone maps, "49% one-handed", the 3-click rule, 7±2 menus, "users don't scroll", 3-second abandonment, F-pattern on mobile, rounded-corner or gradient "research"). See `principles.md` §7.
- Platform versions, Baseline status, API names and store policies change. The files carry a research date; verify anything volatile (iOS/Android version behavior, browser support, regulations) against current documentation before asserting it to a user, or flag it.
- m3.material.io, several design-system sites and some papers were unreachable during research; the affected numbers are marked memory/snippet in the files. Say so when you rely on them.
- If a user's constraint conflicts with a critical gate (e.g., brand mandates tiny targets), report the failed gate, propose a compliant alternative, and respect their informed decision.
- Ethical default: do not implement dark patterns; apply the boundary test and offer the honest variant.
- Do not invent product details; benchmark claims in `product-patterns.md` are "this pattern existed", not "this is current".

## 10. Quality bar

Before presenting a mobile UI as complete: all critical gates pass; `checklists.md` is done; the 12 dimensions are scored with the minimum ≥ 7 for "production-ready"; every state (loading, empty, error, offline, permission-denied, long text, 200% text, dark mode, small and large windows) has been designed or explicitly listed as out of scope; the reply states assumptions and anything untested.
