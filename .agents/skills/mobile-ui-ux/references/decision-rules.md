# Decision rules (IF → THEN), consolidated

Read this when: you need a quick, explicit rule rather than the full discussion, or when auditing a design rule by rule. Every rule links to a topical file where the evidence, numbers, exceptions and stack notes live. Rules carry evidence tags: `[S]` standard · `[P]` platform (`[P-iOS]` `[P-AND]` `[P-WEB]` when one platform) · `[R]` research (`[R-weak]` thin or dated, `[R-T2]` practitioner model) · `[C]` consensus · `[H]` heuristic/judgment (also written `[O]` opinion) · `[D]` derived from sourced values · `[T]` trend (avoid unless asked) · `[L]` legal/policy. Rules marked `[H]` are our judgment: when in doubt, test with users.

Contents: A Hierarchy and information · B Navigation and structure · C Touch and gestures · D Overlays and containers · E Forms and input · F Feedback and states · G Loading and performance · H Motion · I Visual design and tokens · J Accessibility · K Responsive and platform · L Data-dense and enterprise · M Copy · N Ethics and trust · O Process

---

## A. Hierarchy and information (principles.md, navigation.md)

1. IF an action is primary THEN make it visually dominant (the single filled button) and reachable (bottom edge or sticky footer, ≥ 48dp). `[P][C]`
2. IF a screen has more than one primary action THEN establish an action hierarchy (one filled, 1-2 tonal/outlined, the rest text) instead of equal weight. `[P][C]`
3. IF content is secondary THEN disclose progressively (≤ 2 levels), signposted by a label, never hiding price, consent, or destructive consequences. `[R]`
4. IF a decision involves many unfamiliar options THEN structure them (group, sort, filter, search, recommend) instead of cutting or capping. `[R]`
5. IF desktop information cannot fit comfortably on mobile THEN redesign the hierarchy from a task table instead of shrinking everything. `[R]`
6. IF an interaction changes state THEN give immediate feedback (≤ ~100 ms). `[R][P]`
7. IF an operation takes noticeable time THEN communicate progress (see G). `[R]`
8. IF something can be recognized instead of recalled THEN show it (labels, recents, summaries, re-displayed input). `[R]`
9. IF a UI pattern exists only because it is trendy THEN do not use it without a clear UX reason; tag it `[T]`. `[H]`
10. IF the primary goal or user role is not stated THEN write a one-line assumption at the top of the reply and proceed; ask only when two plausible readings lead to different navigation structure. `[H]`

## B. Navigation and structure (navigation.md, components.md)

11. IF 3-5 peer destinations THEN a persistent bottom tab/navigation bar with icon + visible label; > 5 THEN 4 visible destinations by task frequency + a labeled hub as the 5th slot; never an auto-overflow "More". `[P][R]`
12. IF medium/expanded width THEN rail/sidebar; decide from window width, never device type. `[P]`
13. IF the destination is secondary or long-tail THEN a drawer/menu is acceptable, labeled "Menu". `[R]`
14. IF the tab bar exists THEN never hide or disable tabs; preserve per-tab state; show explanatory empty states. `[P]`
15. IF Back is involved THEN it is predictable: closes the top overlay first; never hijack it. Android: register back via the proper callback API; iOS: keep the nav stack and leading-edge swipe working and use the standard chevron; web/PWA: in-app Back in standalone. `[P][L]`
16. IF a screen is shareable THEN it has a URL/app link; deep links synthesize the parent stack. `[P]`
17. IF sticky or hide-on-scroll chrome THEN it is small, opaque, restorable on small upward scroll, and never hides the only primary action. `[R][P]`
18. IF search is a primary task THEN a visible field/tab in one predictable place with scope, recents and suggestions. `[P]`
19. IF > 2 levels of navigation are visible at once THEN flatten with filters/segmented controls/push. `[H]`
20. IF sibling views belong to one destination THEN top tabs/segmented (2-5 labels); IF different areas THEN the bottom bar. `[P][R]`

## C. Touch and gestures (navigation.md, accessibility.md)

21. IF a gesture is not discoverable THEN provide a visible alternative interaction; every swipe/drag/pinch/hold has a tap path. `[S][P]`
22. IF a hit target is interactive THEN ≥ 44pt iOS / 48dp Android / ≥ 44 CSS px web with ≥ 8 spacing; never below 24 CSS px. `[S][P]`
23. IF a control is destructive or irreversible THEN separate it from frequent controls and make it undoable. `[R]`
24. IF an action fires on touch THEN fire on pointer-up inside the target and allow slide-off cancel. `[S 2.5.2]`
25. IF adding swipe actions THEN ≤ 2 per side, mirrored in a visible menu and AT custom actions, with Undo. `[H][S]`
26. IF a control sits near a screen edge or the Android gesture inset THEN inset it; leave carousel gutters and peek the next card. `[P]`
27. IF a flow is one-handed-critical THEN bottom nav + large targets + centre content + top Back; never thumb-zone-only. `[R]`
28. IF drag-reorder THEN visible handle + Move up/down. IF custom pinch THEN +/- buttons. `[S 2.5.7]`

## D. Overlays and containers (components.md)

29. IF the user must decide before continuing and the action is serious/irreversible THEN a dialog (≤ 2 buttons preferred, 3 max, verb-labeled, Cancel); IF reversible THEN act + Undo as a transient confirmation. `[P][R]`
30. IF a task is short, contextual, ≤ ~3 inputs THEN a sheet with visible Close + Back dismissal; IF multi-step/long/needs a URL THEN a full-screen modal or pushed page; never stack sheets. `[P][R][H thresholds]`
31. IF info is non-actionable THEN inline or snackbar, not a dialog. `[P]`
32. IF items are homogeneous and scanned/compared THEN list rows; heterogeneous/media browse THEN cards; grouping only THEN headers + whitespace; never card-in-card. `[R][H]`
33. IF a field has ≤ 4 options THEN radios; 5-10 THEN native picker/menu; > 15 or dynamic THEN searchable combobox; known value THEN typed input. `[R][H]`
34. IF a setting applies immediately THEN a switch; IF it needs Submit THEN a checkbox. `[P][R]`
35. IF long content with many items THEN virtualize and use Load more (15-30/batch on mobile) or pagination for task lists; infinite scroll only for leisure feeds. `[R]`
36. IF carousels THEN no mobile autoplay, ≤ 5 manual slides with buttons, or a peeking scroller. `[R][S]`

## E. Forms and input (forms.md)

37. IF a form field exists THEN a visible label above it; the placeholder is only a format example. `[R]`
38. IF adding a field THEN justify it by an immediate use; cut/defer first/last name split, Address Line 2, promo code, confirm-email/password. `[R]`
39. IF the value is an identifier THEN `type=text inputmode=numeric`, never `type=number`; set `autocomplete` and native autofill hints. `[R][S]`
40. IF validating THEN blur for format errors, live only for hard-rule fields, submit for empty required, clear errors the moment fixed, never style an error on the first keystroke (helper hints may update live). `[R]`
41. IF an error occurs THEN message = what + how to fix, adjacent, text + icon, summary + focus on web, input preserved. `[R][S]`
42. IF the form has > 2 fields or hidden rules THEN keep submit enabled; show in-flight state on the button; use an idempotency key. `[R]`
43. IF passwords THEN allow paste and managers, no composition rules, show/hide, blocklist, no confirm field; offer passkeys. `[S]`
44. IF OTP THEN one `one-time-code` field, auto-submit at length, resend cooldown, clear lifetime. `[S][R]`
45. IF a destructive action THEN undo first; confirm only serious/irreversible with named object + verb labels; typed confirmation for catastrophic. `[R][P]`
46. IF a permission is needed THEN ask in context on the user's tap with a one-sentence benefit; iOS prompts once, so a single-button priming screen helps; Android: rationale UI, second denial is permanent; handle denial with an inline "Open Settings" path. `[P]`
47. IF dates THEN known/far = typed fields, near/availability = calendar with typing fallback; never dropdown triples. `[R]`
48. IF a bottom CTA must stay above the keyboard THEN prefer an in-flow submit; else sticky in the scroll container with IME/safe-area padding. `[P]`
49. IF multi-step THEN steps of 3-6 related fields, "Step n of N", Back preserves data, review step for consequential submissions, autosave. `[R]`

## F. Feedback and states (states-feedback.md)

50. IF a region can be empty THEN design the type-specific empty state (what/why/next, ≤ 1 primary action); never render a blank container. `[R]`
51. IF an error can be recovered THEN provide a recovery action (Retry, change method, Open Settings); keep the draft; map status → template. `[R]`
52. IF a loader exists THEN it ends in success, error or timeout; never unbounded. `[R][H]`
53. IF the duration is measurable (upload, export, install) THEN show determinate progress from the start; IF unknown THEN <1 s no loader, 1-10 s skeleton (container with known layout) or spinner (single module), >10 s determinate-style text + Cancel + background. `[R]`
54. IF a loader would flash for under ~300 ms THEN delay it 200-300 ms and hold it ≥ 400-500 ms once shown (AndroidX defaults to 500/500; platform default, not a standard); never delay the tapped control's pressed state. `[H]`
55. IF a skeleton THEN only for known layouts with the exact final sizes; never for actions or unknown layouts. `[R]`
56. IF feedback is routine and visible elsewhere THEN a transient confirmation (Android snackbar; iOS inline state or banner) of 4-6 s `[H]`, honoring system timeout settings; IF it carries an error, Undo as the only recovery, or needs action THEN persistent (inline/banner/dialog). `[P][S]`
57. IF a system-wide condition persists (offline, payment past due) THEN a banner that auto-removes when resolved. `[P]`
58. IF optimistic UI THEN only for actions reversible in-app with a high success rate and a visible rollback; never payments, messages sent to others, or deletions without soft delete; roll back visibly with Retry. `[H]`
59. IF the product has field or low-connectivity use THEN offline reads and queued writes with per-item status and a calm indicator; otherwise show a clear offline state and block writes; state which scope you chose (online-only / cached reads / queued writes / full sync). `[H]`
60. IF a status exists THEN icon/shape + label + color; never color alone. `[S 1.4.1]`

## G. Loading and performance (performance.md)

61. IF animating on web THEN transform/opacity only (compositor-friendly); on native prefer layer-level transform/opacity; IF an animation drops frames on a mid-tier device THEN simplify it. `[P-WEB][R]`
62. IF a list can grow THEN virtualize/lazy-build it and restore position on Back. `[R]`
63. IF images THEN dimensions set, sized to display, lazy only below the fold, hero eager with high priority. `[P-WEB]`
64. IF blur/translucency THEN ≤ 1-2 small static chrome surfaces with an opaque fallback; never animate the blur radius. `[R][H]`
65. IF performance is claimed THEN state method, device class and build type; never "60 fps" from a simulator/debug build. `[R]`
66. IF a web budget is unspecified THEN ≤ 300-600 KiB compressed critical-path JS for a mid-tier Android 3-5 s target; test on 4× CPU + slow 4G minimum. `[H]`
67. IF long handlers THEN give visual feedback first, yield, then continue (INP ≤ 200 ms at p75). `[P-WEB]`
68. IF polling THEN use push/WorkManager/BGTaskScheduler instead; pause off-screen animation. `[P]`

## H. Motion (motion.md)

69. IF animation does not communicate state or feedback THEN question whether it is necessary; tag each animation functional/feedback/decorative. `[H]`
70. IF an animation impacts performance THEN simplify it. `[R]`
71. IF it is feedback on a control THEN ~100 ms (70-150); partial-screen surfaces 200-300 ms; full-screen ≤ 400 ms; never > 500 ms. Synthesized from NN/g and Material. `[H]`
72. IF entering THEN decelerate; exiting THEN accelerate, ≈ 0.7× enter; moving on screen THEN standard; spinners linear. `[C]`
73. IF user-driven or interruptible THEN a spring (bounce 0 by default); overshoot only with gesture momentum or a hero moment; never on color/alpha. `[P]`
74. IF staggering THEN ≤ 20 ms/item, total ≤ 500 ms, first view only; default to no stagger in utility apps. `[H]`
75. IF Reduce Motion is on THEN no translate/scale/parallax/blur-in; cross-fade ≤ 150 ms or instant; keep color and determinate progress; stop loops. `[H][P]`
76. IF a haptic THEN pair only with user-caused state changes; never on scroll; respect the OS setting. `[P]`
77. IF celebration THEN only rare earned milestones, once, skippable. `[R][H]`

## I. Visual design and tokens (design-tokens.md)

78. IF defining values THEN semantic tokens consumed by components; names by role; foreground partner per background. `[C]`
79. IF no brand scale exists THEN use the default token set (Material-derived radius/state layers; 4-based space; type roles; neutral + one accent). `[C]`
80. IF dark mode THEN re-author (off-black canvas, lighter surfaces for elevation, desaturated accents), never invert; follow the system by default with an override setting where the platform allows. `[P][R]`
81. IF nesting rounded shapes THEN inner radius = outer − padding. `[P]`
82. IF text sits on images/glass THEN scrim + contrast check at the worst pixel. `[S]`
83. IF a component violates platform accessibility conventions THEN redesign it. `[S][P]`
84. IF a visual treatment (gradient, glass, heavy radius, shadow) has no communicative job THEN remove it. `[H]`
85. IF status colors are used as text THEN use the darker text variant, not the fill color. `[S]`

## J. Accessibility (accessibility.md)

86. IF interactive THEN accessible name, role, state; label contains the visible text. `[S]`
87. IF text THEN scalable units; no fixed-height text containers; survives 200% and AX5; reflows at 320 CSS px. `[S][P]`
88. IF contrast THEN text ≥ 4.5:1 (large 3:1), UI parts/focus ≥ 3:1, in every theme. `[S]`
89. IF dynamic content THEN a polite status announcement; errors `role=alert`; focus management on route change and dialogs. `[S]`
90. IF a dialog/sheet THEN focus trap, Esc/Back dismiss, focus return, inert background. `[S][P]`
91. IF authentication THEN no cognitive tests, never block paste. `[S 3.3.8]`
92. IF `autocomplete` applies THEN set it (1.3.5); IF repeated data THEN autopopulate (3.3.7). `[S]`
93. IF never-disable-zoom THEN `user-scalable=no` and `maximum-scale=1` are banned. `[S]`

## K. Responsive and platform (responsive.md, platform-guidelines.md)

94. IF an OS-integrated behavior (back, scroll, text editing, share, permissions, safe areas) THEN adopt the platform behavior. `[P]`
95. IF cross-platform chrome THEN brand styling is fine if the behavior contract (labels, persistence, targets, a11y) holds. `[P]`
96. IF Material and iOS conventions differ THEN follow the platform on that platform; unify IA/content/behavior across platforms. `[P]`
97. IF Android targets API 35+/36+ THEN edge-to-edge + insets, predictive back, resizable/orientation-free layouts. `[P-AND]`
98. IF iOS 26+ THEN system components for bars/sheets, glass only for the functional layer. `[P-iOS]`
99. IF a PWA THEN install prompt only after demonstrated interest; in-app Back and refresh in standalone; `svh/dvh`, safe-area padding, SW update prompt, offline page. `[P-WEB]`
100. IF width/height classes change at runtime (fold, split-screen, rotation) THEN preserve state. `[P]`

## L. Data-dense and enterprise (data-dense.md, product-patterns.md)

101. IF a table THEN decide by the data's job: lookup → cards, compare → scroll with sticky column + header, drill-in → pop-in; never 8-10 shrunk columns. `[R]`
102. IF multi-select THEN an explicit selection mode with count, Select all, contextual bar, Undo. `[R]`
103. IF filters THEN own layer, applied-chip summary, "Show N results", exact empty states. `[R]`
104. IF a dashboard THEN "needs attention" first, 3-5 KPI tiles, one primary chart per card, tap-to-value, table fallback; no pies/gauges for magnitude. `[R][H]`
105. IF numbers THEN `Intl` formatters, tabular figures, sign + text beyond color. `[S][C]`
106. IF roles differ (parent/teacher, requester/approver) THEN different task-first IA per role. `[H]`
107. IF consumer engagement patterns (streaks, infinite feeds) are tempting in an enterprise/utility/minor-audience app THEN do not import them; in leisure products use them only user-chosen, forgiving and capped. `[R][L]`

## M. Copy (ux-writing.md)

108. IF a button THEN verb-first and specific; never "OK/Submit/Yes/No" except informational. `[P][C]`
109. IF an error string THEN formula: specific problem + cause if known + exact next step + action; no "Oops", "Invalid", "Please", blame. `[R][C]`
110. IF a destructive dialog THEN name the object and consequence, verb labels, Cancel not default. `[R][P]`
111. IF empty/onboarding/permission copy THEN positive title, one benefit sentence, one CTA. `[R]`
112. IF localizing THEN externalized full sentences, ICU plurals, ≥ 200% expansion on short labels, `Intl` for dates/numbers. `[S]`
113. IF capitalization THEN sentence case by default (Material/GOV.UK); iOS-native chrome follows HIG title case: a platform split, not a universal rule. `[C][P-iOS]`

## N. Ethics and trust

114. IF a request asks for urgency, scarcity, confirmshaming, hard cancellation, pre-checked consent or nagging THEN apply the boundary test and offer the honest variant. `[L][R]`
115. IF asking for data THEN say why, ask late, and never before value. `[P][R]`

## O. Process

116. IF a source disagrees with another THEN state both numbers with units and use the resolution table (principles.md section 9).
117. IF a claim has no source THEN tag it `[H]` and say so to the user.
118. IF the brief omits states THEN design loading, empty, error, offline and permission-denied anyway.
119. IF unsure about a platform fact that changes (iOS/Android versions, Baseline status, API names) THEN verify against current docs before asserting.
120. IF reviewing a finished screen THEN run checklists.md, then score with review-system.md; critical failures override the score.

## P. Added from audit (gaps an agent would otherwise guess)

121. IF the product needs offline, push on iOS, or home-screen presence but not store distribution THEN ship a PWA; IF it needs background execution, deep OS integration, or store discovery THEN native or a native wrapper. `[H]`
122. IF offline-first THEN scope it to the core read path plus a queued-write outbox; label online-only actions; test with the network off. `[H]`
123. IF RTL locales are supported THEN use logical CSS properties (`margin-inline`, `inset-inline`), mirror directional icons and progress, never reverse digits. `[P]`
124. IF push notifications THEN ask after a value moment, let users choose categories, never send for errors or nagging. `[P][R]`
125. IF tablets/iPad are in scope THEN decide by window class: two panes from ≥ 840 dp-equivalent, sidebar/rail, capped content width. `[P]`
126. IF showing money, dates or numbers THEN use `Intl`/platform formatters and tabular figures. `[S][C]`
127. IF a rule here is stated with a Material term (snackbar, FAB, `#121212` canvas, shape scale) THEN on iOS use the HIG equivalent (inline confirmation/toast, toolbar action, system backgrounds, concentric shapes). `[P]`
