# Mobile UI/UX Intelligence: research report, synthesis and validation

Research date 2026-10-06. This report is the evidence trail and overview behind the `mobile-ui-ux` skill (`../SKILL.md` + `../references/`). It follows the 13-part structure of the brief. Detailed, source-tagged notes are in `notes/` (12 slices, ~5,600 lines); every source is indexed in `SOURCES.md`. The skill files hold the actionable rules; this report explains where they came from, how strong the evidence is, and what is still unknown.

## How the research was done

- Twelve parallel research slices, each told to verify against primary sources and tag every claim `VERIFIED` (fetched, page states it), `SNIPPET` (search excerpt only) or `MEMORY` (not re-verified), with source tiers T1-T5, scope (universal / iOS / Android / web / product-specific / trend / opinion), numbers tables with units, comparison tables, anti-patterns, disagreements and gaps.
- Slices: 01 platform guidelines · 02 accessibility · 03 motion · 04 performance · 05 navigation/gestures/touch/IA · 06 forms/input/auth · 07 loading/empty/error/feedback/UX writing · 08 design systems/tokens/dark mode · 09 data-dense/responsive/PWA · 10 components/overlays · 11 product benchmarks · 12 psychology/anti-patterns/methodology.
- Primary sources actually read: Apple HIG (through its JSON endpoint) and Apple developer docs; developer.android.com and Material Components/Compose source (m3.material.io was unreachable); WCAG 2.2 and Understanding pages, WCAG 3.0 working draft, WAI-ARIA APG, WCAG2Mobile; web.dev/MDN/Chrome/WebKit; NIST SP 800-63B-4; NN/g, Baymard, GOV.UK, Carbon, Atlassian, Polaris, Fluent, Spectrum, Primer, Pajamas, USWDS; Uber Base, SAP Fiori, Salesforce mobile docs; company help centers/blogs; regulators (FTC, European Commission, EU DSA text); WebAIM Million 2026 and screen-reader survey; peer-reviewed abstracts.
- **Limits that shape the evidence quality:** the shared WebSearch budget (200 calls) ran out mid-run in every slice; m3.material.io, several design-system sites and many papers were unreachable; WebFetch passes pages through a summarizing model (slices re-read raw JSON/HTML/source where a number mattered and tag the difference); claims about product UIs are often T3-T4 and may be outdated. Each slice's Gaps section lists what is unverified.
- The brief's instruction to treat Dribbble/Behance-style inspiration as non-evidence was followed (T5 sources not used as evidence).

## PART 1: Research findings (headlines)

1. **Platform guidance converges on a small behavior contract** (persistent labeled navigation, interruption scaled to importance, layout by window class, user settings override taste, gestures as shortcuts, permission-late, 44-48 targets). Details differ in widgets and placement, not in the contract.
2. **Apple's design language moved to Liquid Glass (iOS 26, refined in iOS 27)**: glass belongs to the functional layer, never content; Apple later added a user transparency slider (inference: consistent with NN/g's expert-review legibility critique). **Material 3 Expressive** is an official component-level expansion; its research claims (46 studies, 18,000+ participants, "up to 4× faster") are vendor-reported without per-study methodology.
3. **Touch targets: one number does not exist.** Apple 44pt (28pt stated minimum), Android 48dp + 8dp spacing, WCAG 24 CSS px (AA) / 44 (AAA), research 7-12 mm depending on screen position and motion. Practical rule: 48 with ≥ 8 gaps; 24 is a legal floor.
4. **The thumb-zone folk model is weak.** Hoober's 2017 field data supersedes his 2013 grip statistics; people reach the top-corner Back button, most taps land mid-screen, and accuracy is worse at corners. Bottom navigation + centre content + top Back is the defensible compromise.
5. **Hidden primary navigation measurably hurts** (NN/g 2016, 179 participants, mostly websites: mobile hidden-nav usage 57% vs 86% combo; ~15% slower). Evidence is moderate for content sites and 10 years old; platform tab bars solved the problem differently.
6. **Gestures are never self-explanatory**; WCAG 2.5.1/2.5.7, HIG and Android all require visible alternatives. Swipe actions, long-press and pull-to-refresh are accelerators.
7. **Forms:** fewer fields beat fewer steps (Baymard: 11.3 average checkout fields vs ~8 needed); labels above; placeholders are not labels; `type=number` is wrong for identifiers; validate on blur except hard-rule fields; error summary + focus; never clear input; OTP as one `one-time-code` field; passwords pastable (NIST 800-63B-4); WCAG 3.3.7/3.3.8 are legal-grade requirements.
8. **Loading:** thresholds 0.1/1/10 s (NN/g) differ across systems (3 s Primer, 5 s Material, 10 s NN/g to go determinate); skeleton evidence is weak and contested (NN/g reasons; Mejtoft 2018 null; Viget n=136 negative); every loader needs an exit; delay-show/min-display values (200-500 ms) are heuristics.
9. **Errors/feedback:** specific, calm, local, recoverable; undo beats confirm (Raskin; NN/g); toasts are risky for anything actionable (WCAG 2.2.1 exemption only when the information is elsewhere).
10. **Motion:** numeric consensus is strong for duration (feedback ~100 ms, surfaces 200-300, full-screen ≤ 400-500), easing direction (decelerate in, accelerate out) and exit asymmetry (~0.7×); springs are the platform default for interruptible motion (Apple bounce 0 default; M3 spatial ζ 0.9, effects ζ 1.0). Press-scale, shake amplitude and like-pop sizes have no authoritative numbers (opinion). Research on animated transitions helping comprehension is narrow (data-viz).
11. **Performance:** frame budgets (16.67/11.1/8.33 ms), compositor-friendly animation, virtualization, image decode memory (w×h×4), blur/shadow costs are real but weakly quantified in primary sources; Web Vitals thresholds are precise; skeleton and optimistic-UI benefits are not measured. Dark mode saves battery only on OLED (3-9% at typical brightness; Purdue 2021).
12. **Accessibility:** WCAG 2.2 AA is the operative floor; WCAG 3.0 is a draft not to be cited; APCA is advisory; text scaling to AX5/200% and reflow at 320 CSS px are the most common real failures; WebAIM Million 2026: low contrast on 83.9% of home pages, ARIA pages have more errors (correlation).
13. **Design tokens:** DTCG 2025.10 is a stable interchange format (not a W3C Standard); tiered naming (primitive → semantic → component), role-based names; state layers .08/.10/.10/.16; 4-based spacing; M3 shape/type scales; dark = re-authored off-black with lighter surfaces, not inverted; in-app theme toggle policy differs by platform.
14. **Responsive:** window size classes (600/840/1200/1600 dp), canonical layouts, content-driven breakpoints, container queries, `svh/dvh`, safe areas, PWA install after demonstrated interest, iOS PWA constraints (push only for installed apps, 7-day storage eviction in Safari tabs), in-app browsers are hazardous.
15. **Data-dense UI:** simplify before reflowing; table pattern follows the data's job; preserve table semantics; selection mode + contextual bar; filters in a sheet with applied chips and a result-count CTA; dashboards attention-first. Domain patterns (school/HRIS/CRM) have no primary sources and are labeled inference.
16. **Psychology:** most "laws" have weaker UI transfer than their popular forms (Miller 7±2 is a myth for menus; Zeigarnik, decision fatigue, and choice overload as universals are contested; Hick is not "fewer is faster"); defaults and signifiers are well supported; dark-pattern prevalence and legal exposure are real and AI-generated UI reproduces them (55.8% in one CHI 2026 study).
17. **Products:** consensus patterns (bottom bar, non-modal sheet with detents, persistent create, mini-player, swipe actions + undo, optimistic UI + visible pending state) are real; many consumer engagement patterns (streaks, infinite feeds, gesture-only shortcuts) should not be imported into utility or enterprise apps.

## PART 2: Cross-platform comparison

See `../references/platform-guidelines.md` §5 (14-row iOS vs Android vs universal-principle table with an adopt/unify decision and "what breaks if ignored") and §2 (adopt-vs-unify rule). Key conclusions: adopt platform behavior for back, scrolling physics, text editing, share/permission sheets, haptics and safe areas; use platform widgets for OS-integrated controls (switch, picker, alert); allow brand styling of persistent chrome if the behavior contract holds; unify IA, content and feature behavior; allow dense enterprise surfaces to use custom density; never re-skin iOS with Material (or vice versa); do not copy Liquid Glass or Expressive styling outside their platforms.

## PART 3: Best-practice synthesis (mobile UX principles)

The 17 derived principles are in `../references/principles.md` §1 (condensed in SKILL.md §3). They were derived from convergence across sources, not seeded from the brief's example list: they add reversibility over confirmation, loaders-with-exits, window-not-device adaptation, tokens as consistency, attention/trust ethics and "trends only with a reason".

## PART 4: Anti-patterns

`../references/anti-patterns.md`: ~80 items grouped by theme with Problem → Why → Alternative → evidence class, an AI-generated-UI section (synthesis, no measured ranking), and a list of folk claims not to cite. Notable evidence-thin items (opinion, not proof): excessive rounded cards/shadows/gradients, pull-to-refresh misuse, emoji icons, scroll-jacking, ellipsis truncation, sticky-chrome percentage. Evidence-backed ones include tiny targets, popups/interstitials, hidden navigation, gesture-only actions, long forms, placeholder labels, `type=number` for IDs, low contrast, text scaling failures, zoom disabling, session timeouts, auto-advancing carousels.

## PART 5: Motion principles

`../references/motion.md`: functional/feedback/decorative taxonomy; duration ladder (70-150 / 200-300 / 300-400 ms, 500 ms ceiling); easing tokens (M3 standard/enter/exit/emphasized); exit factor 0.7×; stagger ≤ 20 ms and ≤ 500 ms total; springs (M3 standard and expressive tokens; Apple smooth/snappy/bouncy and interactive spring); 20 micro-interaction specs with provenance tags; page/state transitions; predictive-back spec; haptics pairing; reduced-motion implementation per platform; performance coupling. Weak zones: press scale, shake amplitude, drag-lift scale, like-pop (opinion); M3 official size→duration table and Lottie costs unverified.

## PART 6: Performance principles

`../references/performance.md`: frame budgets and ProMotion opt-in; per-stack animation rules; main-thread/INP discipline; Web Vitals; mid-tier device budgets (Alex Russell model, a practitioner estimate); image decode memory; fonts; lists/virtualization (no authoritative threshold); blur/shadow/transparency costs; perceived-performance ladder with the skeleton caveat; battery; measurement playbook; 20-rule catalog with "flips when" conditions.

## PART 7: Accessibility principles

`../references/accessibility.md`: WCAG 2.2 AA as floor; numbers table; name/role/state contract; gesture alternatives; text scaling; contrast and dark-mode pitfalls; reduced motion; dialogs/focus; status messages/toasts; forms/authentication; route-change focus; platform settings inventory; stack API map; manual testing protocol; common failures of generated UI. Unknown: platform-wide usage rates of reduce motion/dark mode/increase contrast; real VoiceOver/TalkBack behavior for `aria-modal` and live regions in mobile browsers.

## PART 8: Design-system principles

`../references/design-tokens.md`: token philosophy and tiers; DTCG pipeline; default semantic colors with computed contrast; state layers; spacing/radius/type/elevation scales with source support; dark-mode rules (off-black, overlay formula, tinted near-black, optional OLED variant, 3-way setting policy); breakpoints and z-index; touch/density/icon/focus/opacity tokens; platform mapping table; component API principles. Values marked `[S]` are sourced, `[C]` computed from sourced inputs, `[R]` our recommendation.

## PART 9: AI implementation decision rules

120 tagged IF→THEN rules in `../references/decision-rules.md`; the 40 most important are in SKILL.md §5. Tags: `[S]` standard, `[P]` platform, `[R]` research, `[C]` consensus, `[H]` heuristic, `[L]` legal/policy.

## PART 10: Reusable skill architecture

```
mobile-ui-ux/
├── SKILL.md                     routing, workflow, decision framework, top rules, recipes, honesty rules
├── references/                  loaded on demand (progressive disclosure)
│   ├── principles.md            principles, psychology with evidence strength, dark-pattern test, conflict resolution
│   ├── decision-rules.md        120 IF→THEN rules
│   ├── platform-guidelines.md   iOS / Android / cross-platform
│   ├── navigation.md            nav, back, gestures, touch, IA
│   ├── components.md            selection ruleset + comparison tables
│   ├── forms.md                 forms, auth, keyboard, destructive actions, permissions
│   ├── states-feedback.md       loading/empty/error/offline/feedback
│   ├── ux-writing.md            microcopy, i18n
│   ├── motion.md                motion + haptics
│   ├── accessibility.md         WCAG 2.2 + native
│   ├── performance.md
│   ├── responsive.md            responsive, PWA, foldables
│   ├── data-dense.md            enterprise/data-dense + desktop→mobile
│   ├── design-tokens.md
│   ├── product-patterns.md      real-product benchmarks
│   ├── anti-patterns.md
│   ├── checklists.md
│   └── review-system.md         15 gates + 12 dimensions + verdict logic
└── research/                    evidence trail (not loaded by the skill): this report, SOURCES.md, notes/
```
Why `references/` instead of the brief's flat layout: SKILL.md stays small and routes; each reference is loaded only when relevant; research artifacts live outside the loading path. Files added beyond the brief's list: `decision-rules.md`, `states-feedback.md`, `data-dense.md`, `product-patterns.md`, `review-system.md`, `principles.md` merged psychology + methodology.

## PART 11: Complete SKILL.md

`../SKILL.md` (≈ 170 lines): frontmatter with a deliberately "pushy" trigger description; purpose; workflow; 17 condensed principles; the 15-question decision framework; the top-40 rules; reference map; recipes (new screen, desktop→mobile, native/cross-platform app, PWA, enterprise dashboard worked example, review); default token behavior; honesty and evidence rules; quality bar.

## PART 12: Supporting files

See the architecture above; each file opens with "Read this when…", a contents list, evidence tags and an "Evidence limits" section.

## PART 13: Mobile UX review checklist and scoring

`../references/checklists.md` (12 sections, gate items marked) and `../references/review-system.md` (15 critical-failure gates, 12 dimensions scored 0-10 with anchors, verdict from the weakest dimension rather than the mean; any gate failing = not production-ready regardless of score).

## Critical self-review (gaps, contradictions, vague rules, thin evidence)

Performed before finalizing: (1) an independent fidelity audit of every reference file against the raw notes (sampling ≥ 40-50 claims per file group, recomputing contrast ratios), (2) a cross-file contradiction and structure audit, (3) a decision-rule quality and missing-rule review, (4) a practical test: three realistic tasks run with and without the skill. Findings and the fixes applied are recorded in the section "Validation results" below.

### Evidence strength map (what to trust least)

- Weak / opinion: rounded-corner, shadow and gradient guidance; press/shake/like-pop motion numbers; skeleton benefits; optimistic-UI benefits; FAB effectiveness; swipe-action counts; hide-on-scroll benefit; select-control option thresholds; KPI counts for dashboards; sticky-chrome viewport percentage; school/HRIS/CRM domain patterns; spinner delay values; tab-in-tab rule; 3-level screen depth cap.
- Vendor/self-reported: M3 Expressive research, passkey case studies, Duolingo metrics, ClassDojo claims, Deloitte/Google speed study, Lyssna Wise-vs-Revolut test, Workday consultancy blog.
- Dated: hamburger study (2016), Penzo label eye-tracking (2006), Wroblewski validation study (2009, n=22), Hoober 2013 grips, NN/g mobile session lengths (2015), Oulasvirta 2005.
- Unverified because sources were unreachable: m3.material.io guideline prose, tonal elevation levels and top-app-bar heights, Spectrum/Lightning pages, iOS layout margins, Android back-gesture inset width, Play Console jank thresholds, Lottie/SVG filter costs, any authoritative list-virtualization threshold.

### Questions the research could not answer

Independent (non-vendor) evidence for Material 3 Expressive; controlled evidence on FAB vs alternatives; post-2020 replications of the hamburger study; platform-wide usage of accessibility settings; real-world VoiceOver/TalkBack behavior for ARIA patterns in mobile browsers; safe blur radii on mid-tier hardware; whether split-box OTP inputs help or hurt; whether skeletons help in the field; foldable/tablet reach data newer than 2015.

## Validation results (status at the time the usage limit was reached)

**Done**
- Independent fidelity audits A1 (platform, navigation, components, product patterns; ~95 claims, ~75 matched exactly) and A2 (forms, states, writing, accessibility; ~65 claims, most matched) are in `audit/A1.md` and `audit/A2.md`, each with ~15 exact old→new fixes.
- Practical tests: eval-2 (desktop→mobile) with and without the skill, eval-3 (Flutter fintech) with the skill, eval-1 and eval-3 baselines, in `tests/`. Honest result: a strong model without the skill already produces a good spec on well-known patterns; the skill's measurable additions were calibrated evidence tags, explicit assumption/untested lists, gate language, `Intl`/tabular figures, archive thresholds, idempotency, and it exposed its own contradictions (see `audit/T2-feedback.md`, `audit/T3-feedback.md`).
- Fixes already applied: bottom-bar count unified to 3-5 with "4 + labeled More hub" above five (navigation, SKILL, decision-rules); NIST OTP lifetime corrected to "at most 10 minutes"; G8 gets a password/OTP exception; snackbar duration and feedback-ladder order made consistent in components.md.

**Not done (audit agents A3 motion/performance/tokens/responsive and A4 global consistency were stopped before reporting; eval-1 with-skill was stopped)**
- Apply the remaining fixes listed in `audit/A1.md` (items F3, F6-F15 and the "additional smaller fixes": swipe actions 1-2 per side, top tabs 2-5, Notre Dame misattribution, 25-75 search range is desktop, Hoober wording, adopt-vs-unify wording, tags on untagged rules) and `audit/A2.md` (loader delay and select thresholds unified, reduced-motion cross-fade 150 ms, Baymard 94%/98%, Harrison tagged snippet, IBM expansion typo, unsaved-changes leave-guard and save-state sections, deleted-state empty state).
- Apply the skill-feedback items in `audit/T2-feedback.md` (More-hub definition, long-press meaning, history-entry rule, Save placement, WCAG 2.1.4, PII in draft autosave, web long-press hook) and `audit/T3-feedback.md` (Flutter reduce-motion API, SemanticsService deprecation note, haptics mapping, app-lock vs system biometric toggle wording, money-flow guidance: step-up auth, OTP attempt/resend caps, Flutter SMS autofill route, `#B3261E` contrast recompute).
- Re-run contrast recomputation for the default token table in `references/design-tokens.md` §5 (A3 was doing this; one tester measured `#B3261E` on white at ≈ 6.54:1, not 6.2:1).
- Re-run the global cross-reference audit (section anchors cited in SKILL.md, e.g. `principles.md §7`, `design-tokens.md §16`) that A4 had not finished.
