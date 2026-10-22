# Mobile UX principles, psychology with honest evidence, and how to weigh sources

Read this when: you need the reasoning behind a rule, must resolve a conflict between sources, are tempted to cite a "law of UX", or need to justify or challenge a design decision. SKILL.md carries the short form; this file carries the evidence.

Contents: 1 The principles (derived from the research) · 2 Psychology laws: what they say, evidence strength, what to do · 3 Heuristic sets mapped to mobile · 4 Cognitive-load techniques · 5 Mobile context (attention, grip) · 6 Persuasion vs dark patterns · 7 Folk wisdom audit · 8 Evidence methodology and tags · 9 Resolving conflicts between sources

---

## 1. The principles

Derived from the cross-platform research (Apple HIG, Material/Android, WCAG, NN/g, Baymard, GOV.UK, product case studies). Each states the behavior change it forces.

1. **Design from the user's task, not the screen inventory.** List the primary goal and its primary action first; everything else earns its place or is deferred. *Implementation:* one dominant action per view (one filled button), a "what is this screen for" sentence before layout, desktop conversions start from a task table (data-dense.md).
2. **Make the state of the system and the user's location always visible.** Titles, selected tabs, progress, sync status, pending states. *Implementation:* feedback within ~100 ms of every tap, a visible current-destination indicator, status text for anything > 1 s.
3. **Visible beats hidden; gestures only accelerate.** Primary navigation and primary actions are persistent and labeled; swipe, long-press, pull-to-refresh and edge gestures duplicate visible controls. *Implementation:* every gesture has a tap path (WCAG 2.5.1/2.5.7); no icon-only nav.
4. **Prefer recognition over recall and defaults over typing.** Pickers, autofill, recents, summaries on review screens, re-display of earlier input. *Implementation:* right keyboard + autocomplete tokens, prefilled values, no cross-screen memory demands.
5. **Reversible beats confirmed.** Undo (with soft delete) before confirm dialogs; confirm only serious, irreversible, costly actions; typed confirmation for catastrophic ones. *Implementation:* snackbar Undo ≥ 10 s; verb-labeled destructive dialog naming the object.
6. **Errors are calm, specific, local and recoverable.** What happened + what to do, next to the cause, input preserved, retry offered, failure never leaves an infinite loader. *Implementation:* error templates by status, inline validation, three exits for every loader.
7. **Respect the platform's contract and the user's settings.** Back, scrolling, text editing, safe areas, permissions, dark mode, text size, reduce motion, contrast. *Implementation:* adopt platform behavior; tokens and layouts survive 200% text, dark, increased contrast and reduced motion.
8. **Touch first, one hand where practical, but never thumb-zone-only.** Targets ≥ 48 with spacing; primary navigation at the bottom, primary content in the middle, Back at the top-leading; destructive controls away from frequent ones. *Implementation:* hit-area padding tokens, bottom padding so the last item scrolls to mid-screen.
9. **Accessibility is part of the design, not a pass at the end.** Names/roles/states, contrast, focus, motion, announcements, alternatives to gestures. *Implementation:* the accessibility checklist gates "done"; polish is never evidence of usability.
10. **Motion communicates; it does not decorate.** Functional (orientation), feedback (acknowledgment), decorative (rare). 100-300 ms, decelerate in/accelerate out, interruptible, never blocking, always with a reduced-motion path. *Implementation:* motion tokens; tag each animation by job.
11. **Performance is UX.** Frame budget, main-thread discipline, image/bytes budgets, virtualization, honest loading. *Implementation:* transform/opacity animation, measured on mid-tier devices, skeletons only with known layout.
12. **Reduce, then disclose progressively (≤ 2 levels).** Fewer fields, fewer columns, fewer choices at once, structured rather than amputated. *Implementation:* field cutting order, summary + drill-down, collapse secondary content with clear signifiers.
13. **Familiarity first, novelty with a reason.** Platform and domain conventions are strong defaults (consensus of three first-party sources, with thin experimental evidence); deviate only with a stated reason and a test plan. *Implementation:* use system components; justify custom ones.
14. **Adapt to the window, not the device.** Mobile-first, then add panes, rails and density as width grows; never scale desktop down or phone up. *Implementation:* window size classes, content-driven breakpoints, container queries, max widths.
15. **Consistency through tokens, restraint through hierarchy.** One scale for spacing/type/radius/motion; one primary emphasis per section; neutral surfaces, one accent; no decoration that carries no information. *Implementation:* semantic token layer; review for card-in-card, gradient/shadow noise, text over busy images.
16. **Respect attention and trust.** No dark patterns, no manufactured urgency, no nagging, no promos before value, permissions in context, data honestly disclosed. *Implementation:* the boundary test in section 6; default to the honest variant.
17. **Don't sacrifice usability for visual trends.** Trends ([T]) enter only on request and only if they pass contrast, signifier and performance checks. *Implementation:* tag trend-driven choices; see anti-patterns.md.

## 2. Psychology laws: evidence strength and mobile consequences

Strength: STRONG = replicated in its home paradigm; MODERATE = replicated, limited transfer; CONTESTED/WEAK = failed or mixed replications; MYTH = popular claim the sources don't support. **Transfer** (lab → UI): L0 lab only; L1 practitioner analogy; L2 tested in UI contexts; L3 replicated field/usability evidence. Rules resting on L0/L1 evidence are heuristics `[H]` and carry no numeric thresholds.

| Law / effect | Strength | Transfer | What it actually says | Do (and don't) |
|---|---|---|---|---|
| Hick-Hyman (1952/53) | STRONG in lab; WEAK as a UI mandate | L1 | Choice-reaction time grows with log of equally likely alternatives; fails for ordered/familiar lists | Structure many unfamiliar options (group, sort, filter, search, recommend); don't cap length for familiar/ordered lists; never encode "max N items per menu". Do enforce one visually unambiguous primary action |
| Fitts (1954; MacKenzie; Bi/Li/Zhai 2013) | STRONG (touch MODERATE) | L2-L3 | Movement time rises with distance, falls with target width; finger endpoints scatter so small targets cost more | Bigger and closer targets for frequent/primary actions; no "infinite edge target" on touch (the finger doesn't stop at the edge; system gestures own the edges); padding/hit-slop not bigger glyphs; ≥ 8 between targets |
| Jakob's law | MODERATE | L2 | Users expect your product to work like others they use (practitioner testing + Google's 2012 prototypicality study: ~17-50 ms first impressions favor low complexity + typical layouts) | Use platform components and domain conventions; deviate only with reason and test plan; don't reinvent icons for standard actions |
| Miller 7±2 / Cowan 4±1 | STRONG as memory span; MYTH as a UI item cap | n/a | Working-memory chunk limits for held information | Chunk strings users read or retype (card 4-4-4-4, OTP groups); re-display information needed across screens; don't cap menus/tabs at 7 (visible items are recognition, not recall). Tab limits come from platform convention and geometry |
| Doherty / response-time limits | MODERATE | L2 | 0.1 s instantaneous, 1 s flow, 10 s attention (Miller 1968/Card 1991; Doherty 400 ms from a mainframe-era study; modern thresholds stricter) | Feedback ≲ 100 ms; status after ~1 s; determinate progress + cancel beyond 10 s; no artificial delay |
| Serial position (Murdock 1962) | STRONG in lab; WEAK untested for UI placement | L1 | First and last list items are recalled best (recency fades after 15-30 s distractor) | Heuristic `[H]`: most important first, next-most-important last in tab bars/lists; don't hide the primary destination in overflow for symmetry |
| Von Restorff (1933) | STRONG lab; MODERATE UI | L2 | The item that differs is remembered | One primary emphasis per section; reserve destructive/error color for those meanings; beware banner blindness: ad-like styling is ignored (NN/g) |
| Zeigarnik (1927) | CONTESTED | L0 | 2025 meta-analysis (59 studies) found no recall advantage for interrupted tasks; a tendency to resume remains | Don't justify nagging/"profile 60% complete" bars; do preserve and offer resume of real unfinished tasks |
| Peak-end (Kahneman) | MODERATE | L1 | Retrospective evaluation tracks peak and end | Design end states and worst moments deliberately (success screen with next step, error recovery, payment failure, empty state); don't end flows with a rating prompt/upsell; don't use it to justify delight animations on frequent actions |
| Tesler / Postel / Parkinson | axiom / heuristic / satire | L1 | Conservation of complexity; liberal in, conservative out; work expands to fill time | Absorb complexity the system can compute (locale, keyboard type, saved address) without hiding material info; accept human formats and echo the normalized value; reject or confirm ambiguous/security-sensitive input. Parkinson is not a UX finding |
| Progressive disclosure | MODERATE-STRONG | L2 | Essentials first, advanced on request (NN/g 2006): > 2 levels tend to disorient | Collapse secondary groups behind labeled disclosures, ≤ 2 levels; signpost by label not icon; persist expanded state; never hide price, consent, or destructive consequences |
| Recognition > recall | STRONG | L3 | Nielsen #6; Shneiderman #8 | Visible labels over icons; recents/suggestions; context in titles; review screens; no gesture-only commands; placeholder is not a label |
| Cognitive load (Sweller) | STRONG for instruction; MODERATE for apps | L1-L2 | Minimize extraneous load; manage intrinsic by sequencing; "germane" is contested | One primary task per screen; remove non-informational decoration; keep labels adjacent; consistent patterns; prefill/derive. Don't cite "germane load" |
| Gestalt (proximity, similarity, common region…) | STRONG | L2 | Perceptual grouping | Inner spacing < outer spacing; same style = same function; containers only when spacing can't group; no nested containers; peek the next item to signal scrollability |
| Signifiers/affordances (Norman); flat-UI study | MODERATE-STRONG | L2-L3 | NN/g eyetracking (71 participants, 9 page pairs): weak-signifier pages took +22% time and +25% fixations; harm shrinks with low density, conventional layout, high-contrast targets | Tappable must look tappable (shape, fill, underline for inline links, chevrons on navigational rows); keep depth/contrast cues on interactive elements in dense screens; every action gets feedback |
| Aesthetic-usability (Kurosu 1995; Tractinsky) | MODERATE | L2 | Attractive designs are rated easier (252 participants, ATM layouts); forgiveness covers minor, not large problems; can mask problems in testing | Polish is worthwhile but never evidence of usability: verify with behavior (task completion, hit-target error) |
| Goal-gradient / endowed progress | MODERATE | L2 | Effort accelerates near a goal | "Step 2 of 4" with a truthful bar; count already-done real work only if true; no fake progress |
| Default effect | STRONG (d = 0.68 in a 58-dataset meta-analysis, N = 73,675) | L3 | People stick with pre-set options | Pre-select the safest, most common, user-beneficial option, visible and changeable; remember last choice. NEVER pre-check consent, marketing opt-ins, add-ons, donations or insurance |
| Nudges overall | CONTESTED/modest | L2 | Published effects shrink after bias correction | Modest expectations; don't build strategy on nudges |
| Choice overload (jam study 2000) | CONTESTED as universal; conditional | L1 | Scheibehenne 2010 meta-analysis (63 conditions, N = 5,036): mean effect ≈ 0; Chernev 2015: moderators (set complexity, task difficulty, preference uncertainty, goal) | Reduce option load when users are unfamiliar, have no clear preference and options are hard to compare: recommend one, filter, compare, summarize differences; don't hide options from users who know what they want (search must reach everything). Never "limit to N options" |
| Decision fatigue / ego depletion | WEAK | L0 | Multi-lab replications found no effect | Don't cite; reduce needless decisions on Nielsen #7/#8 grounds |
| Loss aversion | CONTESTED | L1 | ~2× is disputed; small-stakes studies often show none | Don't build loss-framed pressure ("you'll lose your streak") into flows |

## 3. Heuristic sets mapped to mobile

**Nielsen's 10** (NN/g): (1) status: pressed states, progress for > 1 s, sync/offline/upload status, current tab selected, unread badges only for critical; test: every tap changes visible state in ≤ 100 ms. (2) real world match: plain language, local formats, no codes. (3) control and freedom: undo > confirm, visible Back/Close, swipe-back works, Cancel in sheets, no dead-end modals. (4) consistency: platform components, same icon = same meaning, one spacing scale. (5) error prevention: right keyboards, masks that accept paste, confirm only destructive/irreversible, disable-with-reason, autosave drafts. (6) recognition over recall. (7) flexibility: accelerators (swipe, long-press, widgets, quick actions) with visible equivalents, autofill, saved payment/address. (8) minimalist design: strip non-informational elements; one primary action. (9) recover from errors: say what, why, how to fix; preserve input; place next to the field. (10) help: contextual help, empty states that teach, no mandatory tutorials, searchable help.
**Shneiderman's 8 golden rules**: consistency; universal usability (Dynamic Type/TalkBack/switch; novice + expert paths); informative feedback proportional to the action (haptics for major, subtle for minor); dialogs yield closure (an end state per task); prevent errors; easy reversal (undo, soft delete, 30-day trash `[H]`); keep users in control (no surprise navigation, no auto-advancing carousels, no hijacked back); reduce short-term memory load.
**Norman**: visibility (keep the tab bar visible: HIG says hiding it makes users forget where they are); feedback (state change + haptic + screen-reader announcement); constraints (input types, pickers, disabling impossible choices *with explanation*); mapping (control placement matches effect; swipe direction matches the spatial model); consistency; affordances/signifiers.

## 4. Cognitive-load techniques for mobile

Chunking (sections with headers; group long identifiers; one decision cluster per screen) · defaults (derive and prefill; user-beneficial pre-selection only) · autofill and redundant entry (`autocomplete` tokens, WCAG 1.3.5 AA; never ask twice in one process, WCAG 3.3.7 A; allow paste and password managers, 3.3.8 AA) · progressive disclosure · visual hierarchy (one dominant element per screen; size/weight/contrast over color alone) · whitespace as a grouping tool (test with blur), not decoration · consistent patterns · reducing choices only under the conditions above · deferring registration (Baymard: 18% of abandoners cite forced account creation; 84% of sites don't delay it) · recognition cues · undo vs confirm (NN/g: confirmation overuse causes habituation).

## 5. Mobile context: attention, interruption, grip

- Attention is fragmented in public settings: Oulasvirta et al. CHI 2005 field study: attention left the phone often (roughly every 4-8 s in mobile settings; abstract-level only; 2005 phones and web-search tasks). Use the principle (design for glanceable, interruptible use; autosave multi-screen flows; put critical status at the top-level glance), not the numbers. NN/g (2015, 151 participants): mobile sessions ~72 s vs ~150 s desktop: dated, directional only. "Micro-moments" (Google/Ipsos 2015, n = 1,291) is a marketing taxonomy from survey self-report, usable as vocabulary only. Outdoor-glare contrast numbers: none found; rely on WCAG minimums and treat higher contrast as a default for body text `[H]`.
- Grip: Hoober 2013 (1,333 observations: 49% one hand, 36% cradled, 15% two hands) is superseded by Hoober 2017 (~75% of touches by one thumb; < 50% hold one-handed; people reach the top-corner Back button; most taps land mid-screen). Hoober asks designers to stop citing the 2013 study and the thumb-sweep diagram. Clark: design for the most constrained grip. Details in navigation.md.
- Rule: a flow of more than one screen autosaves state and restores it after interruption `[R]`; assume one hand + one thumb for primary flows; keep Back reachable and consistent; never rely on tiny text or low-contrast hints.

## 6. Persuasion vs dark patterns (default: do not implement manipulative patterns)

- Definitions: nudge = alters behavior predictably without forbidding options or changing incentives and is easy to avoid (Thaler & Sunstein). NN/g deceptive pattern = design that gets users to act in the company's interest by deceiving, misdirecting, shaming or obstructing. Prevalence: ~10% of major e-commerce sites and ~95% of trending mobile apps in studies NN/g cites; Mathur et al. 2019 found 1,818 instances of 15 types on ~11K shopping sites. deceptive.design types: sneaking, forced action, hard to cancel (roach motel), preselection, obstruction, hidden subscription (forced continuity), hidden costs, trick wording, visual interference, fake social proof, fake urgency, nagging, fake scarcity, disguised ads, confirmshaming, comparison prevention, addictive design, currency confusion.
- Law/policy (as of 2026-10; confirm with counsel): US FTC "Bringing Dark Patterns to Light" (2022): disguised ads/false urgency incl. fake countdown timers, hard-to-cancel, buried terms/junk fees, manipulated data sharing; ROSCA requires clear disclosure before billing, express consent, simple cancellation; the FTC click-to-cancel rule was vacated by the 8th Circuit (2025-07-08) and rulemaking restarted. EU DSA Art. 25 bans online-platform interfaces that deceive/manipulate or materially impair informed choice (repeated requests after refusal, harder cancel than sign-up); the Digital Fairness Act proposal is expected late 2026. Apple HIG: tracking pre-prompts must not mimic "Allow", show fake system alerts or add incentives. Google Search: back-button hijacking (enforced 2026-06-15) and intrusive interstitials. `[L]`
- AI relevance: "Deception at Scale" (CHI 2026; 1,296 LLM-generated e-commerce components, 4 LLMs): 55.8% had ≥ 1 deceptive design and 30.6% ≥ 2; business-goal prompts ("boost sales") raised the rate; values-centered prompting lowered it. So the skill sets an ethical default instead of leaving it to the model.
- **Boundary test** `[H]` derived from regulators: (1) would the user endorse this nudge if they saw how it works? (2) is opt-out/cancel as easy as opt-in (same channel, no more steps)? (3) are price, term, renewal and data use disclosed before commitment? (4) is every urgency/scarcity/social-proof claim true and verifiable? Fail any → do not implement.
- If asked for a "growth hack": name the pattern, state the legal/trust risk in one sentence, offer the honest equivalent: real deadline timers only for real deadlines; social proof from real data; price transparency up front; "remind me later" instead of nag; equal-weight accept/decline; in-app cancellation; progress and benefit-led copy. Proceed only with the honest variant.

| Tool | Evidence | Ethical status | Implement? |
|---|---|---|---|
| Helpful default | STRONG | Fine if in the user's interest, visible, changeable | Yes |
| Truthful progress | MODERATE | Fine | Yes |
| Real social proof (counts/ratings from real data) | MODERATE (memory) | Fine if real | Yes |
| Real scarcity/deadline | n/a | Fine if verifiable | Yes, with a source of truth |
| Loss-framed pressure | CONTESTED | Gray/risky | No by default |
| Confirmshaming, fake timers, preselected add-ons, roach motel | Works short-term | Deceptive; regulated | No |

## 7. Folk-wisdom audit (what is solid vs folk)

| Claim | What the evidence shows | Verdict |
|---|---|---|
| F-pattern governs mobile reading | NN/g work: 232 users, text-heavy desktop pages; Nielsen frames it as a failure of poor scannability; no mobile evidence | Folk on mobile: use hierarchy, short lines, front-loaded headings |
| Thumb-zone maps (green/yellow/red) | Hoober 2017 rejects the diagram; accuracy is better at the centre (7 mm) than corners (12 mm); Back button in the top corner is used constantly; Clark: comfort ≠ accuracy | Weak/contested: a reachability sanity check, not a placement law; never put primary actions in system gesture zones |
| "49% use one hand" | 2013 data; the author says it is outdated | Misused statistic |
| 3-click rule | NN/g: no published data support; Porter 2003: no more dropout after 3 clicks than after 12 | MYTH: information scent, label clarity, fast load matter |
| Above the fold / "users don't scroll" | NN/g 2018 eyetracking (120 participants, desktop): 57% of viewing time above the fold (80% in 2010), 74% in the first two screenfuls; people do scroll | "Top matters most" is solid; "no one scrolls" is false; fold is device-dependent |
| Attention span of a goldfish (8 s) | Traces to a 2015 deck citing Statistic Brain; no source found | MYTH |
| "40%/53% abandon after 3 s" | 40%: 2009 survey of stated expectations; 53%: DoubleClick 2016, a Google engineer says it was bounce rate; Google/SOASTA 2017: bounce probability +32% (1→3 s), +90% (1→5 s), +106% (1→6 s), +123% (1→10 s) | Direction solid; numbers misquoted: cite "bounce probability rises with load time", use Core Web Vitals thresholds |
| 7±2 items per menu | see Miller | MYTH |
| Fewer options always better | Hick/jam study: conditional | Conditional |
| "Make the CTA red/contrasting" | Distinctiveness helps recall; ad-like styling is ignored | Context-dependent: accessible contrast + one primary |
| Hamburger menus always bad | NN/g 2016: measurable costs; also says hide when > 4 links on mobile; native tab bars solved it differently | Conditional: costs real, alternatives needed |
| Skeleton screens always better than spinners | NN/g: depends on duration/scope; mixed experiments | Conditional |
| Zeigarnik drives engagement | Memory effect failed to replicate | Contested |
| Decision fatigue limits choices per session | Ego-depletion null results | Weak |
| Flat design is just as usable | NN/g 2017: weak signifiers cost 22% more time; harm shrinks with low density | Cost is real in dense UIs |
| 44pt = 44px = 9 mm | pt/dp/CSS px differ; Apple 44pt, Google 48dp (~9 mm), WCAG 24/44 CSS px | Units confusion |
| Rounded corners/shadows/gradients are bad (or good) | No neutral usability evidence; evidence is about signifiers, contrast, clutter | Opinion unless contrast/signifier harm is shown |

## 8. Evidence methodology and tags

Source tiers: **T1** official platform/design-system/standards docs (Apple HIG, Material/Android, WCAG, ARIA APG, web.dev/MDN, regulators); **T2** established UX research orgs and recognized practitioners (NN/g, Baymard, GOV.UK, peer-reviewed); **T3** case studies from mature products (engineering/design blogs, vendor research: single-context, supporting only); **T4** community/essays/laws-of-X collections (use to locate primary sources, never as sole basis); **T5** inspiration galleries (never evidence).
Classify every rule: universal perception/memory/motor fact · standard (WCAG, ISO) · platform convention (applies on that platform only) · product-specific · trend (tagged `[T]`, kept out of rules unless asked) · opinion (`[H]` with a reason). A platform guideline is authoritative only for its own platform and is a convention, not "proven by research". Prefer cognitive/perception/motor findings (Fitts, Gestalt, serial position, recognition) over social-priming-type effects (ego depletion, some nudges): the 2015 Open Science Collaboration replicated 36% of 100 psychology findings with effect sizes about half the original.
Statistic red flags: unsourced round numbers; "users" without a population; survey intent vs observed behavior; bounce vs abandonment; single-site cases; dated device assumptions; vendor marketing numbers; lab word-list effects applied to visible menus.
**Evidence tags used in rules**: `[S]` standard of record (WCAG SC id, NIST, ISO) · `[P-iOS]` `[P-AND]` `[P-WEB]` platform requirement or documented guideline · `[R]` research-backed (cite NN/g/Baymard/peer review; add L2/L3 when transfer matters) · `[C]` consensus convention (widely used, no strong study) · `[H]` heuristic/our judgment (state the reason; no threshold unless noted) · `[T]` trend (avoid unless asked) · `[L]` legal/policy exposure; `~` suffix = contested. Rule template: IF <observable condition> THEN <instruction> | WHY | TEST | TAG | SCOPE | EXCEPTION. Numbers only when tagged `[S]`/`[P]`/`[R]` and with the unit named (pt/dp/CSS px/mm).

## 9. Resolving conflicts between sources

| Conflict | Resolution |
|---|---|
| Touch target numbers (44pt / 48dp / 24 or 44 CSS px / 7-12 mm) | Platform number on that platform; use 48 cross-platform; research mm justifies going larger at edges/primary/walking; 24 CSS px is a legal floor, not a design target |
| Validation timing (HIG as-you-type / NN/g+Baymard on blur / GOV.UK on submit) | By field type: live for hard-rule fields (password, username, card); blur for format errors; submit for empty required; error summary on submit; short single-step flows may validate on submit only |
| Disabled submit (HIG gate vs GOV.UK/Atlassian avoid) | Keep enabled with > 2 fields or hidden rules; gate only short guided steps with a visible hint |
| Toasts (Material/Polaris/Carbon accept; Primer against; WCAG 2.2.1 exemption only if info is elsewhere) | Confirmation-only may auto-dismiss; anything actionable/error/sole record persists |
| Navigation labels (HIG always label vs Material auto) | Always labeled |
| In-app dark toggle (HIG discourages vs Android/NN/g recommend) | iOS-only: system default, override only for reading/media; cross-platform/web/Android: 3-way setting |
| Required marking (GOV.UK optional-only / NN/g required / Baymard both) | By field mix (see forms.md) |
| Skeleton vs spinner (NN/g vs Viget vs Mejtoft) | Conditional on duration and layout predictability; never "always better" |
| Settings deep link (NN/g give exact link vs Android don't pressure) | User-initiated "Open Settings" at the moment of need, never a repeated nag |
| Duration ceilings (M3 up to 1000 ms vs NN/g/M1 ~400-500 ms) | Productive UI ≤ 400 ms; M3 long tokens for rare expressive moments |
| Platform vs research (Liquid Glass vs NN/g legibility critique) | Follow HIG's layer rule + your own contrast checks |
