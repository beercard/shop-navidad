# Slice 12: UX psychology, cognitive load, anti-pattern catalogue, evidence methodology

Date of research: 2026-10-06. Author: research agent 12. All claims paraphrased. Tags: VERIFIED (fetched, page says it) / SNIPPET (search excerpt only) / MEMORY (training knowledge, not re-checked).
Caveat on process: WebSearch budget (200/session) ran out mid-run; the last ~6 planned searches (nudge meta-analyses, Johnson & Goldstein, Kivetz/Nunes) were replaced by Wikipedia/Cambridge fetches or marked MEMORY. WebFetch answers come from a small summarizer model, so numbers were cross-checked against a second source where possible.

Strength legend for psychology claims: STRONG = replicated/robust in its home paradigm; MODERATE = replicated but effect size/transfer limited; WEAK/CONTESTED = failed or mixed replications / meta-analyses ~0; MYTH = popular claim the sources do not support.
Second axis (critical for UI): TRANSFER = how well the lab result is shown to carry into real interfaces. L0 lab only; L1 analogy by practitioners; L2 tested in UI contexts; L3 replicated field/usability evidence.

---------------------------------------------------------------------------------------------------
## Sources consulted
| URL | Tier | Verified |
|---|---|---|
| https://lawsofux.com/hicks-law/ , /millers-law/ , /doherty-threshold/ , /serial-position-effect/ , /von-restorff-effect/ , /zeigarnik-effect/ , /peak-end-rule/ , /teslers-law/ , /postels-law/ , /parkinsons-law/ , /cognitive-load/ , /aesthetic-usability-effect/ , /goal-gradient-effect/ , /jakobs-law/ , /fittss-law/ | T4 (curated summaries, good citations) | VERIFIED (note: lawsofux says nothing on replication problems for Zeigarnik/peak-end) |
| https://en.wikipedia.org/wiki/Fitts%27s_law ; /Hick%27s_law ; /The_Magical_Number_Seven,_Plus_or_Minus_Two ; /Serial-position_effect ; /Von_Restorff_effect ; /Peak%E2%80%93end_rule ; /Cognitive_load ; /Principles_of_grouping ; /The_Design_of_Everyday_Things ; /Ego_depletion ; /Decision_fatigue ; /Loss_aversion ; /Overchoice ; /Nudge_theory ; /Default_effect ; /Replication_crisis ; /Aesthetic%E2%80%93usability_effect | T4 (secondary, used only to locate primary citations/status) | VERIFIED |
| https://www.nngroup.com/articles/ten-usability-heuristics/ (orig. 1994-04-24, reviewed 2024-01-30) | T2 | VERIFIED |
| NN/g: /articles/3-click-rule/ ; /videos/magical-number-7-ux/ ; /videos/hicks-law-long-menus/ ; /videos/number-items-navigation-menu/ ; /articles/hamburger-menus/ (2016-06-26) ; /articles/mobile-navigation-patterns/ (2015) ; /articles/popups/ ; /articles/form-design-placeholders/ ; /articles/auto-forwarding/ ; /articles/designing-effective-carousels/ ; /articles/skeleton-screens/ ; /articles/response-times-3-important-limits/ ; /articles/infinite-scrolling-tips/ ; /articles/error-message-guidelines/ ; /articles/confirmation-dialog/ ; /articles/scrolling-and-attention/ (2018) ; /articles/f-shaped-pattern-reading-web-content-discovered/ ; /articles/touch-target-size/ ; /articles/mobile-ux/ (2015) ; /articles/sticky-headers/ ; /articles/deceptive-patterns/ ; /articles/flat-ui-less-attention-cause-uncertainty/ (2017) ; /articles/liquid-glass/ (2025-10-10) ; /articles/icon-usability/ ; /articles/banner-blindness-old-and-new-findings/ ; /articles/progressive-disclosure/ (2006) ; /articles/minimize-cognitive-load/ ; /articles/mental-models/ ; /videos/jakobs-law-internet-ux/ (2017) ; /articles/aesthetic-usability-effect/ | T2 | VERIFIED |
| https://stephaniewalter.design/blog/your-menu-doesnt-need-millers-7-plus-minus-2-rule/ | T4 (practitioner, cites Miller/Cowan) | VERIFIED |
| https://www.cs.umd.edu/users/ben/goldenrules.html (Shneiderman) | T2 | VERIFIED |
| https://asktog.com/atc/principles-of-interaction-design/ (Tognazzini) | T2 practitioner | VERIFIED |
| https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php , /05/...part-2.php , /07/...part-3.php (Hoober 2017) | T2 practitioner-research | VERIFIED |
| https://alistapart.com/article/how-we-hold-our-gadgets/ (Clark) | T4 | VERIFIED |
| Search results only: Parhi/Karlson/Bederson 2006 (MobileHCI); Bi/Li/Zhai 2013 (CHI, FFitts); Fitts 1954 J Exp Psych 47(6):381-391; MacKenzie 1992 HCI 7:91-139 (yorku.ca/mack/hci1992.html); Cowan 2001 BBS 24(1):87-114; Iyengar & Lepper 2000 JPSP; Scheibehenne et al. 2010 JCR 37(3):409-425; Chernev et al. 2015 JCP 25:333-358; Ghibellini & Meier 2025 (Humanit Soc Sci Commun, Zeigarnik meta-analysis); Oulasvirta et al. CHI 2005 | T2 peer-reviewed | SNIPPET (abstract-level; publishers returned 403) |
| https://www.cambridge.org/core/product/identifier/S2398063X1800043X/type/journal_article (Jachimowicz et al. 2019 default meta-analysis) | T2 | VERIFIED |
| https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials | T1 | VERIFIED |
| https://developers.google.com/search/blog/2026/04/back-button-hijacking (content not retrievable; facts from 8 secondary search hits) | T1 URL / secondary content | SNIPPET |
| https://www.w3.org/WAI/WCAG22/Understanding/ : target-size-minimum, target-size-enhanced, resize-text, accessible-authentication-minimum, timing-adjustable, pause-stop-hide, images-of-text, visual-presentation, pointer-gestures, dragging-movements, contrast-minimum, audio-control, reflow, redundant-entry, identify-input-purpose | T1 | VERIFIED |
| Apple HIG JSON: privacy, onboarding, alerts, sheets, accessibility, tab-bars, gestures, materials, loading, motion (developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json) | T1 | VERIFIED |
| https://developer.android.com/training/permissions/requesting ; /develop/ui/views/touch-and-input/gestures/gesturenav ; /design/ui/mobile/guides/patterns/predictive-back ; /design/ui/mobile/guides/foundations/system-bars ; /guide/topics/ui/accessibility/principles ; https://support.google.com/accessibility/android/answer/7101858 ; https://github.com/material-components/material-components-android/blob/master/docs/components/BottomSheet.md | T1 | VERIFIED (m3.material.io bottom-sheets = empty shell) |
| https://web.dev/articles/vitals ; https://developer.mozilla.org/en-US/docs/Web/CSS/length ; https://developer.chrome.com/docs/lighthouse/seo/tap-targets | T1 | VERIFIED |
| https://baymard.com/lists/cart-abandonment-rate ; /blog/checkout-flow-average-form-fields ; /blog/line-length-readability | T2 | VERIFIED |
| https://www.deceptive.design/ , /types | T2 practitioner (Brignull) | VERIFIED |
| https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers ; https://www.gibsondunn.com/ftc-restarts-negative-option-rulemaking-after-eighth-circuit-vacatur-enforcement-under-rosca-continues/ ; https://www.springlex.eu/en/packages/dsa/dsa-regulation/article-25/ ; https://www.goodwinlaw.com/en/insights/publications/2025/11/alerts-practices-antc-from-dark-patterns-to-fair-play | T1 / law-firm secondary | VERIFIED |
| https://arxiv.org/abs/2502.13499 (Deception at Scale, CHI'26) ; https://arxiv.org/abs/1907.07032 (Mathur et al. 2019) | T2 peer-reviewed | VERIFIED |
| https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/ | T3 | VERIFIED |
| https://github.com/tkadlec/WPOStats/issues/41 (Google engineer on the 53% stat) ; Think with Google 2016/2017 speed reports | T3 | VERIFIED (issue) / SNIPPET (numbers) |
| https://erikrunyon.com/2013/01/carousel-interaction-stats/ | T3 single-site case study | VERIFIED |
| https://www.smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/ | T4 | VERIFIED |
| https://www.rfc-editor.org/rfc/rfc9413 | T1 (IETF) | VERIFIED |
| https://claude.com/blog/improving-frontend-design-through-skills ; Adam Wathan X post 1953510802159219096 | T3 / T4 | VERIFIED (blog) / SNIPPET (post) |
| https://www.betterads.org/mobile-large-sticky-ad/ ; https://www.betterads.org/mobile-ad-density-higher-than-30/ (Coalition for Better Ads; seen only in search results) | T2 industry standard | SNIPPET |

---------------------------------------------------------------------------------------------------
## Findings

### PART A: Psychology laws and heuristics, with honest evidence strength

Each entry: Claim | Evidence | Strength + Transfer | Misuse | Agent rule(s).

### A1 Hick-Hyman law (Hick 1952; Hyman 1953)
- Claim: In choice-reaction tasks, decision time grows with the log of the number of equally likely alternatives, T = b*log2(n+1) (Wikipedia; VERIFIED). It is about stimulus-response mapping, not "number of things on a screen".
- Evidence: lawsofux (VERIFIED) credits Hick & Hyman 1952/53; Wikipedia (VERIFIED) lists conditions: equally likely, unpracticed mappings; the law fails for randomly ordered word lists (linear scan), practised/compatible mappings flatten it, and ordered lists allow subdividing strategies (Landauer & Nachbar 1985; Seow 2005 says predictability relationships are sigmoid). NN/g (VERIFIED) says menu size is not capped at 7 and that long menus work when combined with other techniques (grouping, mega menu).
- Strength: STRONG as a lab law; WEAK as a UI mandate. Transfer L1. "Fewer choices is always faster" is a MISUSE.
- Agent rules: IF a screen presents many unfamiliar options THEN structure (group, sort, filter, search, recommended default) rather than amputate. IF options are familiar or visibly ordered (settings list, country list, alphabetical) THEN do not artificially cap length. IF user is deciding between unfamiliar plans/products THEN show a recommended option and keep comparisons side by side. NEVER encode "max N items per menu" as a rule; DO enforce "primary action is visually unambiguous" (one primary per screen) [H].
- Stack: any.

### A2 Fitts's law and touch (Fitts 1954; MacKenzie 1992; Bi, Li, Zhai 2013)
- Claim: Movement time to a target rises with distance and falls with width. Fitts: ID=log2(2D/W). MacKenzie's Shannon form: ID=log2(D/W+1), standard in ISO 9241 work (Wikipedia, VERIFIED). Fitts 1954 is J Exp Psychol 47(6):381-391 (SNIPPET).
- Touch specifics: FFitts law (CHI 2013) adds an "absolute precision" noise term because finger endpoints scatter independent of speed, so small touch targets cost more than classic Fitts predicts (SNIPPET). Fingers are opaque and occlude small targets (Hoober, VERIFIED). Edge "infinite targets" are a mouse artefact (cursor stops at the screen edge, Wikipedia VERIFIED); a finger does not stop, and Hoober (VERIFIED) found touch accuracy is poor at edges/corners. On Android, edge swipes belong to the system back gesture and the bottom strip belongs to home/recents; apps cannot opt out of the bottom one (Android gesturenav, VERIFIED).
- Strength: STRONG for mouse pointing; MODERATE for touch (principle holds, constants differ). Transfer L2/L3.
- Agent rules: IF control is primary or frequent THEN make it larger and closer to the thumb's natural resting area than secondary controls [R]. IF placing controls at screen edge THEN keep them out of system gesture insets (Android) / home-indicator zone (iOS) and do not claim an "infinite target" benefit on touch. Sizes: see Numbers table (24 CSS px AA floor; 44pt/48dp practical floor; 9-10 mm physical). Separate adjacent targets by >=8dp [P]. Enlarge hit area with padding/`hitSlop`/`minimumInteractiveComponentSize` without enlarging the glyph.
- Stack: CSS `min-block-size`/padding or pseudo-element; RN `hitSlop`; Compose `Modifier.minimumInteractiveComponentSize()`; SwiftUI `.contentShape(Rectangle())` + frame.

### A3 Jakob's law, conventions, mental models
- Claim: Users spend most of their time on other products and expect yours to work the same (Nielsen; NN/g video 2017, VERIFIED). NN/g mental-models (VERIFIED): one wrong assumption can derail a session; align system to model (card sorting) or teach via clearer labels. Google Research 2012 (VERIFIED): first-impression beauty judgments form in ~17-50 ms and favour low complexity plus high prototypicality (typical-looking) designs.
- Strength: MODERATE. No controlled experiment titled "Jakob's law"; support is practitioner testing (NN/g) plus the prototypicality study (T3). Transfer L2.
- Agent rules: IF a platform component exists (tab bar, nav bar back, share sheet, date picker, pull-to-refresh, system permission alert) THEN use it, not a custom look-alike [P]. IF a domain flow has a dominant convention (cart icon top-right in commerce, step progress in checkout, swipe-back on iOS) THEN follow it. Deviate only with a stated reason and a test plan. Do not reinvent icons for standard actions [R: NN/g icon usability].
- Context (flips): novel products/games/media where novelty is the value; innovation is OK if the change is gradual or the old way stays reachable (lawsofux/NN/g).

### A4 Miller 1956, Cowan 2001, and the 7+-2 misuse
- Claim: Miller (Psychological Review 1956) described two separate limits (absolute judgment ~2-3 bits; immediate memory span ~7 chunks) and himself said there is nothing magical about seven (Wikipedia, VERIFIED; Walter VERIFIED cites his "pernicious Pythagorean coincidence" aside, I treat that quote as T4-reported). Cowan (2001, Behav Brain Sci 24:87-114) argued the working-memory limit is ~4 chunks (3-5) when chunking/rehearsal are blocked (SNIPPET + Wikipedia VERIFIED).
- Misuse: capping menus/tabs/lists at "7 plus or minus 2". Visible items are a recognition task, not recall (Walter, VERIFIED; NN/g video says implications exist "but not the ones you often hear" VERIFIED; NN/g "How many items in a navigation menu?" states it is not 7, VERIFIED title/summary, factors behind a video paywall = GAP).
- Strength: STRONG as memory-span research; MYTH as a UI item cap. Transfer: valid only where users must hold information in the head (cross-screen recall, codes, multi-step instructions).
- Agent rules: DO chunk strings users must read or retype (card 4-4-4-4, phone groups, OTP groups) [C]. DO NOT hold information that must be remembered across screens: re-display it (Shneiderman 8, VERIFIED; NN/g cognitive load "re-display previously entered info", VERIFIED). IF a nav/tab bar has >5 destinations THEN the reason is platform conventions (Apple "More" overflow; NN/g tab bar < 5 options, VERIFIED), not Miller [P/R].

### A5 Doherty threshold and response-time limits
- Claim: Doherty & Thadani (IBM Systems Journal 1982) tied productivity to <400 ms system response (lawsofux, VERIFIED). NN/g (VERIFIED, article dated 1993) uses three limits from Miller 1968 and Card et al. 1991: ~0.1 s feels instantaneous, ~1 s keeps flow of thought, ~10 s is the limit of focused attention; give percent-done progress beyond 10 s. Tognazzini (VERIFIED, T2 opinion) wants click acknowledgement within ~50 ms. Web: INP "good" <=200 ms, LCP <=2.5 s, CLS <=0.1 at p75 (web.dev VERIFIED).
- Strength: MODERATE (decades of perception research; 400 ms is one study of mainframe-era work; modern platform thresholds are stricter). Transfer L2.
- Agent rules: IF a tap changes state THEN show visible feedback (pressed state, spinner, optimistic update) within ~100 ms [R/H]. IF an operation exceeds ~1 s THEN show status; <1 s show nothing extra (NN/g skeleton page says skip indicators under 1 s, VERIFIED). >10 s needs determinate progress + cancel. DO NOT add artificial delay "to feel valuable" (lawsofux repeats this; weak evidence, labour-illusion studies are MEMORY): default none.

### A6 Serial position effect (Ebbinghaus; Murdock 1962)
- Claim: In free recall, first (primacy) and last (recency) list items are remembered better. Recency vanishes after a 15-30 s distractor delay; primacy persists (Wikipedia, VERIFIED). lawsofux (VERIFIED) turns this into "put key actions at far left/right of navigation".
- Evidence for UI: I found no controlled study that tab-bar/menu slot position changes task success; the support is analogy. What is well documented separately is click/position bias toward the first item (Notre Dame carousel: 84% of feature clicks on slide 1, ~1% of visitors clicked anything; single site 2012-13, VERIFIED).
- Strength: STRONG (lab memory) / WEAK-UNTESTED (nav placement). Transfer L1. A cheap heuristic, not a law.
- Agent rules [H]: IF ordering tabs/list items THEN place most important first and next-most-important last; put rarely used/destructive items in the middle or behind an overflow. IF a list is a recognition task with visible labels, treat position as a tiebreaker only. DO NOT hide the primary destination in an overflow to satisfy symmetry.

### A7 Von Restorff (isolation) effect (1933)
- Claim: The item that differs from its neighbours is remembered better (lawsofux/Wikipedia, VERIFIED). Proposed causes: extra rehearsal, own category, attention capture. Wikipedia notes lab word lists may understate the effect.
- Cautions: NN/g banner blindness (VERIFIED): users skip elements that look like ads (ad-like placement, distinctive styling, animation) and may avoid whole regions; on mobile anything that stands out from its context can be treated as an ad. lawsofux warns against color-only distinction and motion for vestibular-sensitive users.
- Strength: STRONG in lab; MODERATE in UI (conflict: distinct = noticed vs distinct = ad-like = ignored). Transfer L2.
- Agent rules: ONE primary emphasis per screen section (filled button); everything else secondary/tertiary. Reserve the destructive/error color for destructive/error. Differentiate by more than color (shape, weight, label) [S: WCAG 1.4.1]. Do not style legitimate content like an ad (gradient banner, badge spam).

### A8 Zeigarnik effect (1927)
- Claim (popular): unfinished tasks are remembered better, so use "incomplete" cues to drive engagement.
- Evidence: A 2025 meta-analysis (Ghibellini & Meier, 59 studies after screening 1,455; SNIPPET) reports no recall advantage for interrupted tasks outside Zeigarnik's own data (ratio ~0.99) but a reliable tendency to resume interrupted tasks (Ovsiankina effect). lawsofux says nothing about this.
- Strength: WEAK/CONTESTED for the memory claim; resumption tendency MODERATE. Transfer L1.
- Agent rules: DO NOT justify nagging, "profile 60% complete" guilt bars, or fake incompletion with Zeigarnik. DO preserve and offer resume of real unfinished tasks (drafts, carts, uploads) because that is user-benefit and system-status [R: Nielsen #1/#3, Tognazzini "protect users' work"].

### A9 Peak-end rule (Kahneman et al. 1993; Redelmeier & Kahneman 1996)
- Claim: Retrospective evaluation of an episode tracks its peak intensity and its end more than its duration (cold-water: 60 s at 14C vs same + 30 s at 15C; people preferred repeating the longer one; lawsofux/Wikipedia VERIFIED).
- Limits (Wikipedia VERIFIED): "not an outstandingly good predictor"; a 2008 study found the most memorable moment predicted remembered happiness better than peak or end; boundary conditions for day-long experiences.
- Strength: MODERATE. Transfer L1 (no product-level replication found).
- Agent rules [H]: Design end states deliberately (success screen with next step, clear error recovery, order confirmation) and the worst moment (payment failure, empty state, loading). Do not end a flow with a rating prompt, upsell, or interstitial (Apple HIG onboarding: no rating/purchase requests at launch, VERIFIED). Do not cite peak-end to justify delight animations on frequent actions.

### A10 Tesler's law (conservation of complexity)
- Origin: Larry Tesler, Xerox PARC (lawsofux, VERIFIED). Tognazzini is cited as a counterpoint (users take on harder tasks when tools get easier). It is a design axiom, not an experimental result. Rate: opinion/axiom (T4), Transfer L1.
- Agent rule [H]: absorb complexity the system can compute (locale, timezone, keyboard type, saved address, detected card type, default currency) instead of asking; never absorb it by hiding material information (costs, terms, data sharing).

### A11 Postel's law
- Claim: Be liberal in what you accept, conservative in what you send (lawsofux, VERIFIED). IETF RFC 9413 (2023, VERIFIED) argues indefinite tolerance causes protocol decay and recommends clear, early feedback on errors.
- Strength: engineering heuristic; UX use is sound for human text input. Transfer L1.
- Agent rules: ACCEPT human formats (spaces/dashes in phone/card numbers, case-insensitive email, trailing spaces, pasted OTP [S: WCAG 3.3.8 requires paste]) and normalize; echo the normalized value back. REJECT or confirm ambiguous or security-sensitive input; do not silently coerce amounts/dates (show interpreted value).

### A12 Parkinson's law
- Origin: 1955 humorous Economist essay (lawsofux, VERIFIED). Not a UX finding. Rate: MYTH as evidence. If a skill wants "reduce task time", cite Nielsen #7/#8 and autofill (WCAG 1.3.5/3.3.7), not Parkinson.

### A13 Progressive disclosure
- Claim (Nielsen, NN/g 2006, VERIFIED): show essentials first, defer advanced options to a secondary level on request; improves learnability, efficiency, error rate. Designs with more than 2 levels tend to disorient (>3 clearly bad). Staged disclosure (wizard) is for linear tasks; progressive disclosure for feature-rich hierarchies. Apple onboarding: provide sensible defaults, defer setup (VERIFIED).
- Strength: MODERATE-STRONG (long practitioner testing). Transfer L2.
- Agent rules: IF a screen has >1 advanced/rare option group THEN collapse behind a clearly labelled disclosure ("Advanced", "Show more") and keep it <=2 levels. Hidden things must be signposted by label, not by icon only. Persist the user's expanded state. Do not hide anything the user must see to avoid harm (price, consent text, destructive consequences).

### A14 Recognition over recall (Nielsen heuristic #6; Shneiderman #8)
- Claim: Make options visible and retrievable rather than memorized (NN/g, VERIFIED).
- Strength: STRONG (cognitive psychology of recognition vs recall). Transfer L3.
- Agent rules: visible labels over icon-only [R]; show recent/suggested items in search and pickers; keep context in nav title/selected state; show entered data on review screens; avoid gesture-only/hidden commands (Hoober; Apple HIG gestures, VERIFIED); placeholder text must not be the label [R: NN/g].

### A15 Cognitive load theory (Sweller 1988)
- Claim: Working memory is limited; extraneous load (caused by presentation) should be minimized, intrinsic load (task difficulty) managed by sequencing/chunking. Germane load is contested; later work says the three types do not simply add (Wikipedia, VERIFIED). NN/g (VERIFIED) lists: remove clutter, use familiar mental models, offload (defaults, re-display, pictures), chunk, fast responses.
- Strength: STRONG for instructional split-attention/redundancy effects; MODERATE for application to app UIs. Transfer L1-L2.
- Agent rules: one primary task per screen on mobile; remove decoration that carries no information; keep labels adjacent to controls (split attention); keep consistent patterns; prefill/derive instead of ask. Do not use "germane load" as a design justification.

### A16 Gestalt grouping (Wertheimer 1923; Palmer 1992 common region; Palmer & Rock 1994 uniform connectedness)
- Claim: proximity, similarity, continuity, closure, common fate, common region group items perceptually (Wikipedia, VERIFIED; the page flags missing citations; primary attributions for common region/connectedness = MEMORY).
- Strength: STRONG (perception). Transfer L2.
- Agent rules: inner spacing < outer spacing (a label closer to its field than to the previous field); same style = same function; use a container (card/section background) only when grouping is not clear from spacing; do not nest containers inside containers by default. Horizontal scrollers: let the next item peek so continuity signals scrollability (NN/g carousel guidance, VERIFIED).

### A17 Affordances, signifiers, feedback, mapping (Norman)
- Claim: Norman's 2013 revision separates affordance (what is possible) from signifier (what communicates it); four main principles listed on Wikipedia (VERIFIED): visibility, conceptual model, mappings, feedback; gulfs of execution/evaluation. The book also lists constraints and discoverability (MEMORY).
- Evidence for UI: NN/g eyetracking (VERIFIED): 71 participants, 9 page pairs; weak-signifier (flat) versions cost 22% more time and 25% more fixations; harm shrinks only with low density, conventional layout, high-contrast interactive elements.
- Strength: MODERATE-STRONG. Transfer L2-L3.
- Agent rules: tappable must look tappable (shape, fill, underline for inline links, chevrons on navigational rows); keep or add depth/contrast cues on interactive elements in dense screens; every action gets feedback (pressed, in-progress, done); map swipe direction to spatial model (swipe right-to-left to advance) and keep back-swipe consistent.

### A18 Aesthetic-usability effect (Kurosu & Kashimura 1995; Tractinsky 1997/2000)
- Claim: Attractive designs are rated easier to use (26 ATM layouts, 252 participants; perceived ease correlated more with beauty than with actual ease; NN/g, VERIFIED). NN/g: forgiveness covers minor problems, not large ones; it can mask problems in testing, so watch behaviour not ratings.
- Strength: MODERATE (replicated, boundary clear). Transfer L2.
- Agent rules: polish is worthwhile but never evidence of usability; verify with behaviour tests (task completion, hit-target error). Low visual complexity + conventional layout beats novelty on first impression (Google 2012).

### A19 Goal-gradient and endowed progress
- Claim: effort accelerates near a goal (Hull 1932 rats; Kivetz, Urminsky & Zheng 2006 on loyalty cards; lawsofux VERIFIED for Hull and framing; Kivetz/Nunes & Dreze specifics = MEMORY).
- Strength: MODERATE. Transfer L2 (loyalty cards/commerce).
- Agent rules: multi-step flows show "Step 2 of 4" and a truthful bar [R: Nielsen #1]; count already-done real work as progress (account created = 1 of 4) only if true. No fake progress, no moving finish lines.

### A20 Default effect and nudges
- Claim: People stick with pre-set options. Meta-analysis (Jachimowicz et al. 2019; 58 datasets, 55 studies, N=73,675): d = 0.68; stronger when the default is read as endorsed or as the status quo; weaker in some domains (Cambridge, VERIFIED). Nudges broadly: Mertens et al. found an average effect; Maier et al. 2022 say no evidence after publication-bias correction; DellaVigna & Linos 2022 found nudge-unit effects of 1.4 pp vs 8.7 pp in published papers; Szaszi et al. say heterogeneity, defaults are among the strong ones (Wikipedia Nudge, VERIFIED secondary; PNAS paper itself 403 = GAP).
- Strength: defaults STRONG (existence), nudges overall CONTESTED/MODERATE-small in practice. Transfer L3 for defaults.
- Agent rules: pre-select the safest, most common, user-beneficial option and keep it visible and changeable; remember the user's last choice. NEVER pre-check consent, marketing opt-ins, add-ons, donations, or insurance (deceptive.design "preselection"; FTC privacy findings; GDPR) [L]. Defaults are a power tool: state in code comments who benefits.

### A21 Choice overload (Iyengar & Lepper 2000; Scheibehenne 2010; Chernev 2015)
- Claim (jam study, JPSP 2000; 24 vs 6 jams ~3% vs ~30% bought, SNIPPET): more options can reduce purchase/satisfaction.
- Evidence: Scheibehenne, Greifeneder & Todd 2010 meta-analysis: 63 conditions, 50 experiments, N=5,036; mean effect virtually zero with large between-study variance (SNIPPET). Chernev, Bockenholt & Goodman 2015: 99 observations, N=7,202; four moderators: choice-set complexity, decision-task difficulty, preference uncertainty, decision goal (SNIPPET). Wikipedia Overchoice (VERIFIED) lists preconditions: no prior preference, no dominant option, low familiarity.
- Strength: WEAK/CONTESTED as universal; MODERATE conditional on the moderators. Transfer L1.
- Agent rules: do not tell the skill "limit to N options". DO reduce option load when users are unfamiliar, have no clear preference, and the options are hard to compare: recommend one, filter, compare, summarise differences. Do not hide options from users who know what they want (search must reach everything).

### A22 Decision fatigue / ego depletion
- Claim: deciding depletes a resource and lowers later decision quality.
- Evidence: Hagger et al. 2016 23-lab replication (>2,000 participants) found no ego depletion effect; Vohs et al. 2021 36 labs/3,531 participants found ~0; bias-corrected earlier meta-analyses shrink it to near zero (Wikipedia Ego_depletion, VERIFIED). The parole-judge study (Danziger 2011) is widely re-explained as an artefact of case ordering (critiques by Weinshall-Margel & Shapard; Glockner 2016, MEMORY).
- Strength: WEAK/CONTESTED. Do not cite as a reason for UI design. Reducing needless decisions is still justified by Nielsen #7/#8 and effort, not depletion.

### A23 Loss aversion
- Claim: losses loom ~2x larger than gains (prospect theory 1979). Wikipedia (VERIFIED): contested (Gal & Rucker 2018 argue inertia), partly defended (Yechiam 2019; Mrkva 2020), and small-stakes studies often show none ("magnitude-dependent loss aversion"). Alternative: "loss attention".
- Strength: MODERATE-CONTESTED. Rule: do not build loss-framed pressure ("you will lose your streak/points/discount") into flows; it is ethically fraught and empirically less certain than marketing claims imply [H/L].

### A24 Short summary table (Strength x Transfer)
| Law | Strength | Transfer | Use as |
|---|---|---|---|
| Hick-Hyman | STRONG lab / WEAK mandate | L1 | structure choices, never cap |
| Fitts | STRONG (touch MODERATE) | L2-3 | bigger, closer, spaced targets |
| Jakob | MODERATE | L2 | follow platform + domain conventions |
| Miller/Cowan | STRONG memory / MYTH as nav cap | n/a | chunk strings, avoid cross-screen recall |
| Doherty/Nielsen limits | MODERATE | L2 | feedback timing ladder |
| Serial position | STRONG lab / WEAK UI | L1 | tiebreaker ordering |
| Von Restorff | STRONG lab / MODERATE UI | L2 | single primary emphasis |
| Zeigarnik | WEAK/CONTESTED | L0 | do not use |
| Peak-end | MODERATE | L1 | design end/worst states |
| Tesler, Postel, Parkinson | axiom / heuristic / satire | L1 | tie-breakers only |
| Progressive disclosure | MODERATE-STRONG | L2 | <=2 levels |
| Recognition > recall | STRONG | L3 | visible labels/options |
| Cognitive load (extraneous) | STRONG instr. / MODERATE UI | L1-2 | remove clutter |
| Gestalt | STRONG | L2 | spacing/grouping |
| Signifiers | MODERATE-STRONG | L2-3 | affordance cues |
| Aesthetic-usability | MODERATE | L2 | polish != proof |
| Goal-gradient | MODERATE | L2 | truthful progress |
| Defaults | STRONG | L3 | helpful, visible defaults |
| Nudges overall | CONTESTED | L2 | modest expectations |
| Choice overload | CONTESTED/conditional | L1 | structure, recommend |
| Decision fatigue | WEAK | L0 | do not use |
| Loss aversion | CONTESTED | L1 | do not exploit |

### A25 Nielsen's 10 usability heuristics (NN/g page; orig. 1994, reviewed 2024-01-30) mapped to mobile
(Titles VERIFIED; implementations = our mapping, tag [R] where NN/g supports, else [H].)
1. Visibility of system status: pressed states, progress for >1 s, sync/offline/upload status, current tab selected, unread badges only for critical (HIG tab bars). Test: every tap produces visible change <=100 ms.
2. Match with real world: plain language, local formats (dates, currency, units), no internal codes ("Error 329347", HIG alerts).
3. User control and freedom: undo > confirm; visible Back/Close; swipe-back works; Cancel in sheets; no dead-end modals (HIG sheets: Done must pair with Cancel/Back).
4. Consistency and standards: platform components; same icon = same meaning; same spacing scale; Jakob.
5. Error prevention: right keyboard types, input masks that accept pasted text, confirm only truly destructive/irreversible, disable-with-reason, autosave drafts.
6. Recognition rather than recall: labels, recents, suggestions, show summary on review.
7. Flexibility and efficiency: shortcuts as accelerators (swipe actions, long-press, widgets, quick actions) with visible equivalents; autofill; saved payment/address.
8. Aesthetic and minimalist design: strip non-informational elements; one primary action; consider Liquid Glass/gradients/shadows only where they carry meaning.
9. Recognize, diagnose, recover from errors: say what, why, how to fix, preserve input, place next to field (NN/g error guidelines, VERIFIED).
10. Help and documentation: contextual help, empty states that teach, no mandatory tutorials (HIG onboarding optional), searchable help.

### A26 Shneiderman's 8 golden rules (UMD page, VERIFIED) mapped
1 consistency; 2 universal usability (Dynamic Type/TalkBack/switch; novice+expert paths); 3 informative feedback proportional to action (haptics for major, subtle for minor); 4 dialogs yield closure (end state per task: confirmation screen); 5 prevent errors; 6 easy reversal (undo, soft delete, trash 30-day [H]); 7 keep users in control (no surprise navigation, no auto-advancing carousels, no hijacked back); 8 reduce short-term memory load (re-display data, avoid cross-screen recall).

### A27 Norman principles mapped (Wikipedia VERIFIED + MEMORY for constraints)
Visibility = keep tab bar visible when navigating (HIG: hiding it makes users forget where they are, VERIFIED); feedback = state change + haptic + announcement for screen readers; constraints = input types, pickers, disabling impossible choices with explanation; mapping = control placement matches effect (volume slider direction, swipe-to-delete direction); consistency = platform; affordances/signifiers = see A17.

### A28 Cognitive load reduction techniques for mobile (what to do)
- Chunking [H/R]: split by meaning (sections with headers), format long identifiers in groups, one decision cluster per screen.
- Defaults [R]: derive and prefill (locale, saved address); user-beneficial pre-selection only (A20).
- Autofill and redundant entry [S]: `autocomplete` tokens expose input purpose (WCAG 1.3.5 AA, VERIFIED); never ask for the same data twice within a process (3.3.7 A, VERIFIED); allow paste in password/OTP and password-manager fill (3.3.8 AA, VERIFIED).
- Progressive disclosure [R]: A13.
- Visual hierarchy [R]: one dominant element per screen; size/weight/contrast over color alone.
- Whitespace [H]: whitespace is a grouping tool (Gestalt proximity) not decoration; label it as such and test with blur.
- Consistent patterns [R]: platform controls; same location for same action.
- Reduce choices [R/conditional]: A1/A21; recommend, filter, compare.
- Defer registration [R]: Baymard (VERIFIED): "required account creation" cited by 18% of abandoners; 84% of sites do not delay account creation to after the order (checkout fields article); Apple: defer permission/setup until needed.
- Recognition cues [R]: A14.
- Undo vs confirm [R]: NN/g confirmation page (VERIFIED): confirmation dialogs only for serious or irreversible actions; specific wording and verb buttons; overuse causes habituation; undo is the stronger safeguard. Apple alerts (VERIFIED): avoid alerts for common undoable actions; always provide Cancel; do not make Cancel default on destructive alerts.

### A29 Attention, interruption, mobile context (what is solid vs folk)
- Interruptions/fragmentation: Oulasvirta et al. CHI 2005 field study across 9 urban situations: visual attention left the phone often (SNIPPET: roughly every 4-8 s in mobile settings; ~16 s spans in the lab; away in 35% of page loads in lab vs 46-80% in field). STRONG for "attention is fragmented in public settings" (peer-reviewed, field), but dated (2005 phones, web search tasks). Use the principle, not the numbers. Transfer L2.
- Session length: NN/g (VERIFIED, 2015, 151 participants over years) reports average mobile sessions ~72 s vs ~150 s desktop; dated, treat as direction only.
- "Micro-moments" (Google/Ipsos, Aug 2015, n=1,291 US smartphone users; SNIPPET): a marketing taxonomy (I-want-to-know/go/do/buy) built on survey self-report, not experimental evidence. Use as vocabulary only.
- Grip and reach: Hoober 2013 (1,333 observations; 49% one hand, 36% cradled, 15% two-handed; SNIPPET/VERIFIED via Clark) was superseded by Hoober 2017 (VERIFIED): ~75% of touches by one thumb, fewer than 50% hold one-handed, people reach the top-corner Back button, people touch mostly the middle of the screen; he asks designers to stop citing the 2013 study and the thumb-sweep diagram. Clark (ALA, VERIFIED) advises designing for the most constrained grip.
- Glare/outdoor: no peer-reviewed number found in this session; rely on contrast minimums (WCAG 4.5:1/3:1) and treat higher contrast as a [H] default for body text; Tognazzini (VERIFIED) wants high-contrast text and testing with older users.
- Poor networks: Apple HIG loading (VERIFIED): show something immediately, placeholders, background loading; NN/g mobile UX: lightweight pages, save state.
- Agent rules: IF a flow takes >1 screen THEN autosave state and restore after interruption [R]. IF a task's key info is needed at decision time THEN show it on that screen (no cross-screen recall). Put critical status at top-level glance (title, badge, banner). Assume one hand + one thumb for primary flows; keep Back reachable and consistent. Never rely on tiny text or low-contrast hints in glare contexts.

### A30 Persuasion vs dark patterns
- Definitions: Thaler & Sunstein nudge = alters behaviour predictably without forbidding options or changing incentives, and is easy/cheap to avoid (Wikipedia, VERIFIED). NN/g deceptive pattern = design that gets users to act in the company's interest by deceiving, misdirecting, shaming or obstructing (VERIFIED); coined ~2010; prevalence: ~10% of major e-commerce sites and ~95% of trending mobile apps in the studies NN/g cites (secondary, VERIFIED at NN/g; primary papers: Mathur et al. 2019 crawled ~11K shopping sites/53K pages and found 1,818 instances of 15 types in 7 categories, 22 third-party vendors selling them, VERIFIED arXiv abstract; Di Geronimo et al. CHI 2020 on 240 apps = MEMORY/secondary).
- deceptive.design types list (VERIFIED): sneaking, forced action, hard to cancel (roach motel), preselection, obstruction, hidden subscription (forced continuity), hidden costs, trick wording, visual interference, fake social proof, fake urgency, nagging, fake scarcity, disguised ads, confirmshaming, comparison prevention, addictive design, currency confusion. "Sneak into basket" = sneaking.
- Law (as of 2026-10): US: FTC "Bringing Dark Patterns to Light" (2022) names four recurring tactics (disguised ads/false urgency incl. fake countdown timers; hard-to-cancel; buried terms/junk fees; manipulated data sharing; VERIFIED). ROSCA still requires clear disclosure before taking billing info, express informed consent, simple cancellation (Gibson Dunn, VERIFIED). The FTC "click-to-cancel" rule was vacated by the 8th Circuit on 2025-07-08; FTC restarted rulemaking (draft ANPRM sent 2026-01-30, comments due 2026-04-13; VERIFIED). EU: DSA Art. 25 bans online-platform interfaces that deceive/manipulate or materially impair free informed choices; carve-out when UCPD/GDPR cover the practice; Commission may issue guidance on emphasis on options, repeated requests after refusal, harder cancel than sign-up (VERIFIED). Digital Fairness Act proposal expected Q3/Q4 2026, in force late 2027 earliest (VERIFIED, law-firm). Apple HIG tracking prompts: custom pre-prompts must not mimic "Allow", show fake system alerts or add incentives (VERIFIED).
- AI relevance: Deception at Scale (CHI 2026; 1,296 LLM-generated e-commerce components, 4 LLMs, 15 component types): 55.8% had >=1 deceptive design, 30.6% >=2; business-goal prompts ("boost sales") raised the rate; values-centered prompting lowered it (VERIFIED, arXiv abstract). So the skill must set an ethical default, not leave it to the model.
- Skill policy (recommended):
  - DEFAULT: do not implement fake urgency/scarcity, confirmshaming, roach-motel cancellation, forced continuity, hidden costs, nagging after refusal, sneaking/preselected add-ons or consents, disguised ads, fake social proof, pre-ticked consent, asymmetric button styling on consent/cancel.
  - Boundary test [H, derived from regulators]: (1) Would the user endorse this nudge if they saw how it works? (2) Is the opt-out/cancel as easy as the opt-in (same channel, <= same steps)? (3) Are price, term, renewal, data use disclosed before commitment? (4) Is any urgency/scarcity/social-proof claim true and verifiable? Fail any = do not implement.
  - IF user asks for a "growth hack": name the pattern, explain legal/trust risk in one sentence, offer an honest equivalent: real deadline timers only for real deadlines; honest social proof from real data; price transparency up-front; "remind me later" instead of nag; equal-weight accept/decline; cancel in-app; progress and benefit-led copy. Proceed only with the honest variant.
  - A/B-test caution: NN/g (VERIFIED) notes A/B obsession and competitor imitation drive these patterns; optimizing a conversion metric alone selects for them.

---------------------------------------------------------------------------------------------------
### PART B: Anti-pattern catalogue (Problem -> Why it happens -> Better alternative -> Sources+tag)
Tags: [S] standard/WCAG, [P] platform guideline, [R] research, [C] consensus convention, [H] heuristic/our judgment, [T] trend, [L] legal/policy.

B1 Desktop UI squeezed onto mobile -> multi-column layouts, hover-only affordances, dense tables, small targets, long nav -> reuse of desktop components via shrink-only breakpoints -> re-prioritize content, single column, reflow at 320 CSS px with no 2-D scroll [S: WCAG 1.4.10], replace hover with tap/long-press+visible alternatives, tables as lists/cards or contained scroll; high content-to-chrome ratio, touch-size targets, undo for accidental touches [R: NN/g mobile UX 2015] (VERIFIED).
B2 Tiny touch targets -> mis-taps, slip errors, perceived difficulty even when no error -> aesthetic density, copying web link sizes -> >=44x44pt (iOS), 48x48dp + 8dp gaps (Android), WCAG AA floor 24x24 CSS px, AAA 44x44; expand hit area; NN/g 1 cm baseline, 2 cm for primary/in-motion [S][P][R] (VERIFIED; see Numbers).
B3 Excessive modals/popups/interstitials -> interrupts before value; dismissed without reading; Google ranking signal for intrusive mobile interstitials (no size threshold published) -> temptation to capture email/app installs/consent -> inline or nonmodal banners at screen edge, contextual timing (after task, not during), one at a time; legal gates (age, cookies) as small overlays not redirects [R: NN/g popups, 10 problem patterns][P: Google Search] (VERIFIED).
B4 Excessive/nested bottom sheets -> stacked sheets disorient on dismissal; sheets for long workflows trap users -> sheets feel modern and "native" -> Apple: sheets for scoped tasks only, never stack, Done must pair with Cancel/Back, not for primary navigation; push a full-screen page for multi-step work; give sheet a drag handle with accessible expand/collapse and >=48dp touch area (Material) [P] (VERIFIED). "Excessive" threshold is [H]: one sheet at a time, >2 sheet types in one flow = review.
B5 Hidden critical actions -> primary function behind overflow, long-press, or swipe -> clean minimal look -> keep primary action visible; gestures as accelerators only [P: HIG gestures][S: WCAG 2.5.1 A] (VERIFIED); Hoober: visible consistent controls (VERIFIED).
B6 Gesture-only interactions -> inaccessible to motor/switch/voice users and undiscoverable -> gesture delight -> provide single-pointer alternative for path-based and drag gestures [S: 2.5.1, 2.5.7 AA] (VERIFIED); HIG: custom gestures must be discoverable, distinct and never the sole route for critical actions.
B7 Unclear/icon-only icons -> ambiguity; hover tooltips do not exist on touch -> icon-first minimalism -> always visible text label except near-universal icons (home, print, search magnifier; hamburger ambiguous) [R: NN/g icon usability]; tab bars carry labels, single words (HIG) (VERIFIED).
B8 Excessive animation -> distraction, vestibular harm, perceived slowness -> "delight" culture -> purposeful, brief, optional motion; no animation of frequent interactions; respect reduce-motion; pause/stop/hide for auto-moving content >5 s [P: HIG motion][S: WCAG 2.2.2] (VERIFIED). Durations: see slice on motion; NN/g sticky-header reveal 300-400 ms (VERIFIED).
B9 Infinite skeleton/spinner -> user cannot tell stalled from loading -> no timeout/error design -> NN/g: skeleton for full-page loads <10 s, spinner for 2-10 s module waits, progress bar beyond 10 s; skeletons do not replace performance work [R] (VERIFIED); Apple: show content as soon as possible, avoid blank screen [P]; [H] add timeout state with retry and cached content after ~10 s.
B10 Unnecessary carousels -> low engagement; first slide takes nearly all clicks -> stakeholder politics ("everyone gets a slide") -> single static hero or vertical list; if carousel: <=5 frames, large controls, peeking next item, never auto-forward on mobile, duplicate content elsewhere [R: NN/g; Runyon 2013, one university site, 84% first slide, ~1% engaged] (VERIFIED).
B11 Excessive rounded cards/shadows/gradients -> no direct evidence that any one of these harms; real evidence is on complexity and signifiers: high visual complexity lowers first-impression appeal (Google 2012, VERIFIED), and removing depth cues from interactive elements raised time by 22% (NN/g 2017, VERIFIED). Cause: default component kits and trend copying. Better: use a container only when spacing/alignment cannot group; keep depth/contrast on controls; avoid card-in-card. Tag [H]/[T]; do not cite as research-backed.
B12 Visual noise/clutter -> extraneous load, missed primary action -> additive feature requests -> remove non-informational elements (Nielsen #8; NN/g cognitive load) [R] (VERIFIED).
B13 Inconsistent spacing/typography -> perceived sloppiness, harder scanning, broken grouping -> ad-hoc values -> token scale (e.g., 4/8-based spacing, type ramp) [C/H]; Shneiderman #1, Nielsen #4 (VERIFIED).
B14 Too many navigation levels -> disorientation -> IA grew by org chart -> >2 levels of disclosure poorly usable, >3 clearly harmful [R: NN/g progressive disclosure]; flatten via search/filters; keep tab bar visible during navigation [P: HIG] (VERIFIED). The "3-click rule" itself is false (B-folk table).
B15 Overly long forms -> abandonment -> fields added by each stakeholder -> Baymard: avg 11.3 checkout fields vs ~8 needed; 17% cite long/complicated checkout (VERIFIED); single name field, hide address line 2 and coupon behind links, hide billing when same, delay account creation; autocomplete tokens [S: 1.3.5], no redundant entry [S: 3.3.7].
B16 Destructive actions without confirm/undo (and the opposite: confirm on everything) -> data loss or habituation -> inconsistent policy -> undo/soft delete first; confirm only serious or irreversible, name the object and use verb buttons; destructive-styled button, Cancel present and not default [R: NN/g][P: HIG alerts] (VERIFIED).
B17 Generic error messages -> user cannot recover -> "Something went wrong" templates -> state what happened, why, how to fix; adjacent to the problem; preserve input; avoid "invalid"; do not show errors before the user finishes (NN/g); HIG: no bare "Error"/codes (VERIFIED).
B18 Inaccessible color usage -> color-blind users miss status -> color-only encoding -> pair color with icon/text/shape [S: 1.4.1][P: HIG, Android principles] (VERIFIED); Tognazzini ~10% of males color-blind (VERIFIED, T2 claim).
B19 Animation that blocks interaction -> tap-wait-tap friction -> sequential choreography -> allow cancel/interrupt, do not require waiting for repeated interactions [P: HIG motion] (VERIFIED).
B20 Low-contrast "aesthetic" gray text and tiny captions -> unreadable in glare/for low vision -> brand minimalism -> contrast >=4.5:1 normal text, 3:1 large (>=18pt or 14pt bold) [S: 1.4.3]; Apple default 17pt, minimum 11pt (a floor, not a target), support >=200% enlargement [P] (VERIFIED). Placeholder/hint text and disabled states are exempt in WCAG but should stay legible [H].
B21 Placeholder as label -> disappears, strains memory, mistaken for filled value, fails contrast/screen readers -> floating-label shortcuts -> persistent visible label above/beside field; hints outside the field [R: NN/g, 7 problems, 2014/2018] (VERIFIED). Floating labels that remain visible after focus are a [C] compromise, not endorsed by NN/g.
B22 Disabled button without explanation -> user stalls, not focusable, grey fails contrast -> inline validation fashion -> leave enabled and validate on submit with clear errors; or keep focusable + explain why; legitimate uses: in-flight duplicate-submit prevention, unavailable inventory [C: Smashing/Adam Silver; no controlled study found] (VERIFIED/T4). HIG: never disable/hide tab bar items, explain emptiness instead [P].
B23 Infinite scroll with unreachable footer -> cannot reach footer; position lost on Back -> engagement metrics -> "Load more" or pagination; restore scroll position; reserve infinite scroll for homogeneous browse feeds [R: NN/g] (VERIFIED).
B24 Hijacking scroll/back -> back button breaks, users trapped -> engagement/ad tricks -> never manipulate history to prevent Back [L: Google spam policy announced 2026-04-13, enforced from 2026-06-15; sites liable for third-party scripts (SNIPPET from multiple secondary sources)]. Scroll-jacking (custom wheel/touch scroll physics): [H] no authoritative study located; Shneiderman #7 (keep users in control). Use native scroll.
B25 Forced app-install banners -> blocks content, ranking risk -> growth push -> small dismissible native banner (Smart App Banner or Chrome install prompt) only; Google accepts banners using "only a small fraction of the screen"; NN/g: generic app promos without benefit are a problem pattern [P: Google][R: NN/g popups] (VERIFIED).
B26 Permission prompt at first launch -> low grant rate, mistrust, Android: two denials = permanent block -> early data grab -> ask in context when the user triggers the feature; explain with specific purpose string; pre-alert screen has one "Continue" button and no skip; handle denial gracefully [P: HIG privacy + Android permissions] (VERIFIED). Exception: when obvious (navigation app asking location).
B27 Fake urgency/countdown/scarcity -> manipulation, regulatory exposure -> conversion pressure -> use only real deadlines/stock; FTC lists false countdown timers; DSA Art. 25 [L] (VERIFIED).
B28 Autoplay audio/video -> startle, screen-reader conflict -> engagement metrics -> no autoplay with sound; if audio >3 s provide stop or independent volume [S: 1.4.2]; auto-moving content >5 s needs pause/stop/hide [S: 2.2.2] (VERIFIED).
B29 Sticky bars consuming too much viewport -> content area shrinks, worst with keyboard open -> stacked headers/tab bars/FAB/banners -> NO verified universal threshold. Evidence: Coalition for Better Ads treats a sticky ad >30% of the screen (and >30% ad density) as disruptive (SNIPPET; ad-specific); NN/g sticky headers: cost is highest on mobile, keep minimum sizes (1 cm taps, ~16 pt text), hide-on-scroll-down/show-on-scroll-up with 300-400 ms reveal; The New Yorker ~13:1 content:chrome on iPhone 11 Pro (VERIFIED). Heuristic [H]: budget all persistent chrome (status area + nav + bottom bar + banners) and verify with keyboard open; treat ~25% as a review trigger, 30% as the hard stop borrowed from the ad standard; label as our judgment.
B30 Full-width text with no max measure (tablets/foldables/landscape) -> long lines hurt reading -> fluid layout -> cap text column ~50-75 characters (Baymard, Emil Ruder 50-60; `max-width` ~70ch/34em); WCAG 1.4.8 AAA caps at 80 characters (40 CJK) [R][S-AAA] (VERIFIED). Use readable-content-width (iOS `readableContentGuide`) / `widthIn(max=)` / `max-width: 70ch`.
B31 Pull-to-refresh on non-refreshable content -> gesture implies data refresh that never changes; conflicts with scroll-to-top -> consistency theatre -> only on lists backed by re-fetchable remote data; provide visible refresh button when gesture-only is risky (WCAG 2.5.1 alternatives). [C]; no source fetched (NN/g URL 404; m3 shell) = GAP.
B32 Hamburger-only primary navigation -> hidden nav lowers discoverability and use -> screen-space economy -> NN/g 2016 (179 participants, 6 sites): hidden-nav usage 27% desktop vs 48-50% visible/combo, 57% vs 86% on mobile; discoverability down >20%; task difficulty +21%; task time +39% desktop/+15% mobile. NN/g mobile advice: visible nav for <=4 links; tab bar for <5 key destinations; "Menu" word may beat the icon; hamburger fits content-heavy browse sites [R] (VERIFIED). Counter-view: study is 2016, mostly websites; platform tab bars/“More” overflow are the app-native equivalent. Use bottom tab bar (3-5) for top-level destinations [P: HIG].
B33 Auto-advancing carousels -> content flashes before reading; ad blindness; accessibility -> promotional pressure -> show new panel only on user request [R: NN/g auto-forwarding; NN/g carousels says do not auto-forward on mobile][S: 2.2.2] (VERIFIED).
B34 CAPTCHAs -> cognitive tests exclude users -> bot defence by default -> avoid; WCAG 3.3.8 AA permits object-recognition/personal-content CAPTCHAs but says avoid; offer WebAuthn/passkeys, email link, allow password managers and paste [S] (VERIFIED).
B35 Account wall before value -> abandonment -> data-capture goals -> let users browse/try/guest-checkout; ask for account after the first success; Baymard: 18% of abandoners cite forced account creation (VERIFIED); HIG onboarding: defer, offer defaults.
B36 Cookie/consent banner covering the screen -> dismissed hastily; blocks content; dark patterns on "reject" -> compliance design -> small, equal-weight accept/reject, no pre-ticked categories, not full-screen; NN/g: users dismiss modal overlays without reading; FTC lists no-definitive-reject and repeated prompts as privacy dark patterns [R][L] (VERIFIED).
B37 Text in images -> cannot scale/translate/select/screen-read -> design export shortcuts -> live text with alt where needed [S: 1.4.5; logos exempt] (VERIFIED).
B38 Fixed font sizes ignoring Dynamic Type/sp -> unreadable for low vision; clipped layouts -> hard-coded px/pt -> scalable text styles (iOS text styles, Android sp, web rem), layout wraps and grows, test at largest accessibility size; support >=200% [P: HIG][S: 1.4.4] (VERIFIED).
B39 `user-scalable=no` / maximum-scale locks -> blocks pinch zoom -> "app-like" feel -> never disable zoom; WCAG 1.4.4 plus an ACT rule "meta viewport allows zoom" (Understanding page, VERIFIED); Lighthouse audit specifics (user-scalable=no, maximum-scale < 5) = MEMORY (page 404).
B40 100vh bugs -> content hidden behind browser UI on mobile -> `vh` equals large viewport (lvh) today -> use `dvh`/`svh`/`lvh` deliberately: `svh` for must-be-visible, `dvh` for adaptive (can cost performance while resizing); [P: MDN VERIFIED].
B41 Truncating essential info with ellipsis -> price/status/date cut off; no touch equivalent of hover title -> fixed single-line rows -> let essential text wrap; truncate only secondary text, with a way to read it (expand/detail); must survive 200% text without loss of content [S: 1.4.4] ; ellipsis policy itself = [H].
B42 Session timeouts without warning -> lost work -> security default -> warn, allow >=10 extensions, >=20 s to extend, save drafts; exceptions: real-time, essential, >20 h [S: 2.2.1] (VERIFIED).
B43 Purple/indigo gradient default -> sameness -> models sample the statistical center of training data ("distributional convergence", Anthropic blog VERIFIED); Wathan's 2025 post attributes the indigo habit to Tailwind UI's old default (SNIPPET, T4 anecdote) -> choose palette from brand/product context; avoid accent defaults [T/H].
B44 Glassmorphism everywhere -> low contrast text over busy content, reduced hit spacing -> trend copying -> Apple: Liquid Glass belongs to the functional/navigation layer, never the content layer; use sparingly; no glass-on-glass; "clear" variant over media needs ~35% dark dimming for bright content [P: HIG materials] (VERIFIED). NN/g (2025-10-10) critiques iOS 26 for legibility, crowded targets, shifting navigation [R-opinion T2] (VERIFIED). Web equivalents (backdrop-filter cards) must still meet 4.5:1 over worst-case background.
B45 Emoji as UI icons -> inconsistent rendering across OS versions, size/alignment drift, no semantic accessible name -> speed -> platform symbol sets (SF Symbols, Material Symbols) or SVG with accessible labels [H]; no authoritative source fetched = GAP. Emoji in user-generated content is fine.
B46 Identical card grids / everything equally emphasized -> no hierarchy, no scan path -> templated output -> rank by importance: vary size/position for the primary item, group related, use list rows where comparison matters [H; Von Restorff/Gestalt logic]; AI-slop lists are T4 (smoothui, developersdigest, etc.) not evidence.
B47 Lorem ipsum / fake data left in screens -> hides real content lengths, empty/error/loading states, long names and locales -> speed -> realistic content, longest/shortest strings, empty/error/offline states for every data view [H]; AI-slop sources T4.
B48 Decorative hero illustration on data/task screens -> consumes above-the-fold space, ignored as ad-like -> marketing reflex -> remove from task screens; use only on onboarding/empty states if informative [R: NN/g banner blindness; NN/g mobile UX content-to-chrome] (VERIFIED).
B49 Rating/review prompt or large download at launch -> annoyance -> growth -> wait until the user is engaged; bundle content; brief splash [P: HIG onboarding] (VERIFIED).
B50 Mandatory multi-slide onboarding/tutorial -> skipped, taught features can be learned in context -> product-tour habit -> optional, interactive, contextual tips; do not repeat if skipped [P: HIG onboarding] (VERIFIED).
B51 Edge swipe components under system gesture areas -> drawer/carousel fights Back -> edge-to-edge zeal -> keep custom edge gestures inboard of gesture insets; exclusion rects max 200 dp vertical; bottom strip cannot be opted out [P: Android gesturenav, VERIFIED].
B52 Tab bar overflow into "More" or disabled/hidden tabs -> hides destinations, looks unstable -> too many top-level sections -> fewer, label tabs, explain empty content instead of hiding [P: HIG tab bars] (VERIFIED).
B53 Premature inline validation / errors while typing -> flagged before user finished -> over-eager validation -> validate on blur/submit [R: NN/g error guidelines "avoid premature error display"] (VERIFIED).
B54 LLM-default deceptive components (preselected upsells, trick wording, visual interference) -> trained on web patterns + business prompts -> state values in the prompt/skill; run a deceptive-pattern audit (A30 boundary test) [R: CHI'26] (VERIFIED).

### PART B2: Folk-wisdom audit (what is solid vs folk)
| Claim | What the evidence shows | Verdict |
|---|---|---|
| F-pattern governs mobile reading | NN/g F-pattern work: 232 users, text-heavy desktop pages (corporate About, product pages, SERPs); Nielsen frames it as a failure of poor scannability, not a goal; article does not cover mobile (VERIFIED). No mobile evidence found | Folk on mobile; use hierarchy, short lines, front-loaded headings [H] |
| Thumb-zone maps (green/yellow/red) | Hoober 2017 (VERIFIED) rejects the thumb-sweep diagram: people reach the top-corner Back button; touch accuracy is better in the center (7 mm) than corners (12 mm); grips change; phones got larger. Clark advises design for most constrained grip | Weak/contested. Fine as a "reachability" sanity check, not a placement law; never put primary actions in system gesture zones |
| "49% use one hand" | From Hoober 2013 (1,333 observations); author says outdated; 2017: <50% one-handed, ~75% one thumb | Misused statistic |
| 3-click rule | NN/g (VERIFIED): no published data support; Porter's analysis: no more dropout after 3 clicks than after 12; some users went 25 | MYTH. Instead: information scent, label clarity, fast load |
| Above the fold / "users don't scroll" | NN/g 2018 eyetracking (120 participants, >130k fixations, desktop): 57% of viewing time above the fold (80% in 2010), 74% in first two screenfuls, 81% in first three; attention drops sharply after the fold but people scroll (VERIFIED). Mobile not covered | "Top matters most" is solid; "no one scrolls" is false; fold location is device-dependent |
| Attention span of a goldfish (8 s) | Traces to a 2015 Microsoft Canada deck citing Statistic Brain; BBC and others could not find a source (SNIPPET, multiple) | MYTH. Do not design to "8 seconds" |
| "40% abandon after 3 s" / "53% leave after 3 s" | 40%: 2009 Akamai/Forrester survey of 1,048 shoppers, stated expectations (SNIPPET). 53%: Google/DoubleClick 2016 on >10k mobile domains; a Google engineer says it measured bounce rate, not abandonment (VERIFIED, WPOStats issue). Google/SOASTA 2017 reports bounce probability +32% (1 to 3 s), +90% (1 to 5 s), +106% (1 to 6 s), +123% (1 to 10 s) (SNIPPET) | Direction solid (slower = more bounce), numbers misquoted; cite as "bounce probability rises with load time", use Core Web Vitals thresholds as targets |
| 7+-2 items per menu | See A4 | MYTH |
| Fewer options always better (Hick/jam) | See A1/A21 | Conditional |
| "Make CTA red / contrasting" (Von Restorff) | Distinctiveness helps recall, ad-like styling is ignored (NN/g banner blindness) | Context-dependent; accessible contrast + one primary |
| Hamburger menus always bad | NN/g 2016 shows measurable costs; also says hide when >4 links on mobile (VERIFIED); native tab bars solved this differently | Conditional: costs real, alternatives needed |
| Skeleton screens always better than spinners | NN/g: depends on duration/scope; <1 s none; module waits spinner; >10 s progress bar (VERIFIED) | Conditional |
| Zeigarnik drives engagement | Memory effect failed to replicate (2025 meta-analysis, SNIPPET) | Contested |
| Decision fatigue limits choices per session | Ego depletion multi-lab null results (VERIFIED via Wikipedia) | Weak |
| Flat design is cleaner and just as usable | NN/g 2017: weak signifiers cost 22% more time; harm shrinks with low density | Cost is real in dense UIs |
| 44pt = 44px = 9 mm | pt/dp/CSS px differ; Apple 44pt, Google 48dp (~9 mm), WCAG 24/44 CSS px | Units confusion; see Numbers |

### PART C: Methodology: ranking, classifying and tagging evidence (for the skill author)
C1 Source ranking (highest first)
1. T1 requirements: WCAG 2.2 (W3C), platform guidelines (Apple HIG, Android/Material docs), search/browser vendor docs (Google Search Central, MDN, web.dev), law/regulator documents (FTC, EU DSA). They define "must/should" for their domain, but a platform doc is authoritative only for its own platform.
2. T2 evidence: peer-reviewed studies and meta-analyses; NN/g, Baymard, GOV.UK (own testing, stated sample/method). Check: sample, method, date, whether the claim is stated in the source or inferred.
3. T3 mature-product case studies / vendor research (Google Research, engineering blogs): single context, use as support only.
4. T4 community/essays/law-collections (lawsofux, Medium): use to find primary sources; never as the sole basis.
5. T5 galleries (Dribbble, Mobbin): inspiration only.
C2 Distinguish claim type (classify every rule)
- Universal perception/memory/motor fact (Fitts, recognition>recall, Gestalt, contrast ratios, response-time limits).
- Standard (WCAG, ISO).
- Platform convention (HIG, Material): applies only on that platform; check "iOS vs Android vs web".
- Product-specific (this app's audience, domain, brand).
- Trend (glassmorphism, bento grids, gradients): must be tagged [T] and kept out of rules unless the user asks.
- Opinion (essays, laws-of-X lists): [H] with a stated reason.
C3 Lab-to-UI transfer ladder (add to any psychology-based rule): L0 lab only -> L1 practitioner analogy -> L2 tested in interface studies -> L3 replicated field/usability evidence. Rules that rely on L0/L1 evidence get [H] and no numeric thresholds.
C4 Replication and meta-analysis check: the 2015 Open Science Collaboration replicated 36% of 100 psychology findings with effect sizes about half the original (VERIFIED via Wikipedia); social psychology fared worse than cognitive. Prefer cognitive/perception/motor findings (Fitts, Gestalt, serial position, recognition) over social-priming-type effects (ego depletion, Zeigarnik memory claim, some nudges).
C5 Statistic red flags: unsourced round numbers; "users" without population; survey intent vs observed behaviour (Akamai 2009); bounce vs abandonment; single-site cases (Notre Dame carousel); dated device assumptions (2013 grip data, 2015 session length); vendor marketing numbers; effect sizes from lab word lists applied to visible menus.
C6 Compact evidence tag scheme for rules inside the skill (one tag per rule, optional second tag):
- [S] standard/regulation of record (WCAG SC id, ISO) 
- [P-iOS] / [P-AND] / [P-WEB] platform requirement or documented guideline 
- [R] research-backed (cite NN/g/Baymard/peer-review; add `L2`/`L3` if transfer matters) 
- [C] consensus convention (widely used, no strong study; e.g., bottom tab bar, spacing scales) 
- [H] heuristic/our judgment (state reason; no threshold unless noted) 
- [T] trend: avoid unless the brief asks 
- [L] legal/policy exposure (FTC/DSA/Google spam policy) 
- Optional strength suffix on psychology-derived rules: `~` = contested.
Example rules: "Tap targets >=44x44pt iOS / 48x48dp Android, 8dp gaps [P-iOS][P-AND][S: 2.5.8 floor 24px]"; "Do not cap navigation at 7 items; use grouping [R]"; "Place key destinations first/last in tab bars [H]"; "Never pre-check consent boxes [L]".
C7 Rule-writing template: IF <observable condition> THEN <instruction> | WHY (one line) | TEST (how an agent or human verifies) | TAG | SCOPE | EXCEPTION. Numbers only when tagged [S]/[P]/[R] and with unit named (pt/dp/CSS px/mm).
C8 Conflict handling: if platform guideline and research disagree (e.g., Apple 44pt vs Hoober 7-12 mm vs WCAG 24 px), state each number, name its unit, and pick the platform number on that platform; use the larger for web/cross-platform.

---------------------------------------------------------------------------------------------------
## Numbers table (value | applies to | source | tag)
| Value | Applies to | Source | Tag |
|---|---|---|---|
| 24x24 CSS px (AA); spacing exception: 24 px circle on each target must not overlap | web/any pointer | WCAG 2.5.8 (VERIFIED) | [S] |
| 44x44 CSS px (AAA) | web | WCAG 2.5.5 (VERIFIED) | [S] |
| 44x44 pt default, 28x28 pt minimum (iOS/iPadOS controls); ~12 pt padding around bezeled elements | iOS | Apple HIG accessibility (VERIFIED) | [P-iOS] |
| 48x48 dp, 8 dp spacing, ~9 mm physical; Google says 7-10 mm recommended | Android | Google accessibility help; Lighthouse 48x48 px/8 px (VERIFIED) | [P-AND] |
| 9.2 mm discrete, 9.6 mm serial taps (one-handed thumb, no performance loss) | research | Parhi et al. 2006 (SNIPPET) | [R] |
| 1 cm x 1 cm baseline; 2 cm for primary actions while moving; fingertips 1.6-2 cm, thumb contact ~2.5 cm | research/NN/g | NN/g touch targets (VERIFIED) | [R] |
| 7 mm center, ~9-10 mm edge rows, 12 mm corners (95% of taps) | research | Hoober 2017 (VERIFIED) | [R] |
| 44 pt ~ 6.9 mm if 1 pt = 1/163 in | derived | (arithmetic; pt is not fixed physical) | [H] |
| 4.5:1 normal text; 3:1 large (18 pt or 14 pt bold; ~24 px / ~18.5 px) | all | WCAG 1.4.3 (VERIFIED) | [S] |
| Text enlargement >=200%; reflow at 320 CSS px (400% zoom) | all/web | WCAG 1.4.4 / 1.4.10; HIG (VERIFIED) | [S][P] |
| iOS default text 17 pt, minimum 11 pt | iOS | HIG accessibility (VERIFIED) | [P-iOS] |
| Line length 50-75 chars optimal; <=80 chars (40 CJK) AAA | reading text | Baymard; WCAG 1.4.8 (VERIFIED) | [R][S] |
| 0.1 s / 1 s / 10 s response limits | feedback | NN/g (VERIFIED) | [R] |
| 400 ms | Doherty threshold | lawsofux (VERIFIED) | [R] |
| INP <=200 ms, LCP <=2.5 s, CLS <=0.1 (p75) | web | web.dev (VERIFIED) | [P-WEB] |
| Skeleton <10 s, spinner 2-10 s, progress bar >10 s | loading | NN/g (VERIFIED) | [R] |
| Carousel <=5 frames; no auto-forward on mobile | carousels | NN/g (VERIFIED) | [R] |
| Tab bar <5 options; hamburger when >4 links | mobile nav | NN/g 2015/2016 (VERIFIED) | [R] |
| Progressive disclosure <=2 levels | IA | NN/g (VERIFIED) | [R] |
| 5 s (auto-moving content), 3 s (auto audio) | autoplay | WCAG 2.2.2 / 1.4.2 (VERIFIED) | [S] |
| Time limits: 10x adjust, >=20 s warning to extend, extend >=10 times, exempt >20 h | sessions | WCAG 2.2.1 (VERIFIED) | [S] |
| 200 dp max vertical gesture-exclusion height; bottom gesture area cannot be excluded | Android | Android gesturenav (VERIFIED) | [P-AND] |
| 35% dark dimming for clear Liquid Glass over bright media | iOS 26 | HIG materials (VERIFIED) | [P-iOS] |
| >30% screen (sticky ad), >30% ad density | ads, mobile | Coalition for Better Ads (SNIPPET) | [R-industry] |
| ~25% viewport as persistent-chrome review trigger | mobile chrome | our heuristic | [H] |
| 13:1 content:chrome example | sticky header | NN/g (VERIFIED) | [R] |
| 11.3 avg checkout fields vs ~8 | checkout | Baymard 2024 (VERIFIED) | [R] |
| 70.22% avg cart abandonment; extra costs 40%, slow delivery 20%, security 19%, forced account 18%, long checkout 17% (of non-browsing abandoners) | e-commerce | Baymard (VERIFIED) | [R] |
| Hamburger study: 179 participants, 6 sites; discoverability -20%+; difficulty +21%; time +39% desktop/+15% mobile | nav | NN/g 2016 (VERIFIED) | [R] |
| Flat UI: +22% time, +25% fixations (71 participants) | signifiers | NN/g 2017 (VERIFIED) | [R] |
| 57% above fold (2018) vs 80% (2010); 74% first two screenfuls | desktop attention | NN/g (VERIFIED) | [R] |
| Mobile session ~72 s vs desktop ~150 s (2015) | context | NN/g (VERIFIED, dated) | [R-dated] |
| Attention away from phone every ~4-8 s in public settings (2005) | context | Oulasvirta et al. (SNIPPET) | [R-dated] |
| Default effect d=0.68 (58 datasets, N=73,675) | defaults | Jachimowicz 2019 (VERIFIED) | [R] |
| Choice overload mean effect ~0 (63 conditions, N=5,036) | choice | Scheibehenne 2010 (SNIPPET) | [R] |
| 55.8% of LLM e-commerce components contained >=1 deceptive design; 30.6% >=2 | AI UI | arXiv 2502.13499 (VERIFIED) | [R] |
| Back-button hijacking: policy announced 2026-04-13, enforced 2026-06-15 | web SEO | Google Search Central (SNIPPET) | [L] |
| FTC click-to-cancel vacated 2025-07-08; ANPRM draft 2026-01-30; comments due 2026-04-13 | US subs | Gibson Dunn (VERIFIED) | [L] |

## Comparison tables
Confirm vs undo vs soft-delete (destructive action handling)
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Undo (snackbar/toast with timeout) | Best safety net, no interruption (NN/g) | Needs reversible backend; toast may time out for screen-reader users (WCAG 2.2.1) | Delete, archive, move | Irreversible external effects (payment, send) |
| Confirmation dialog | Stops serious mistakes | Habituation if overused (NN/g); modal interruption | Irreversible/high-cost actions; name object, verb buttons | Routine undoable actions (HIG says avoid) |
| Typed confirmation | Breaks autopilot | Heavy friction | Account/data wipe | Frequent actions |
| Soft delete/trash | Recovery days later | Storage, UI for trash | User content | Legally must erase immediately (offer undo window + hard delete) |

Hidden vs visible navigation (mobile)
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Bottom tab bar, 3-5 labeled | Visible, platform-native, supports serial-position placement | Screen cost; overflow "More" hides items | Frequent top-level destinations | >5 destinations; one-task apps |
| Hamburger/drawer | Many items, small space | Lower discoverability/use, +21% difficulty (NN/g) | Browse-heavy secondary nav | Primary frequent navigation |
| Hub-and-spoke (home as nav) | Focus on tasks | Extra step per switch | Task-per-session apps | Frequent cross-section switching |

Loading indicators
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| None | No noise | n/a | <1 s | >1 s |
| Skeleton | Structure preview, lower perceived wait | Misleading if never resolves; layout shift if mismatched | Full-page 1-10 s | >10 s; unknown failure |
| Spinner | Simple | No structure | 2-10 s module | Whole-page waits |
| Determinate progress | Honest, reduces anxiety | Needs measurable work | >10 s, uploads | Unknown duration |

Persuasion tools: ethical status
| Tool | Evidence | Ethical status | Implement? |
|---|---|---|---|
| Helpful default | STRONG | Fine when in user interest, visible, changeable | Yes |
| Truthful progress | MODERATE | Fine | Yes |
| Real social proof (counts, ratings from real data) | MODERATE (MEMORY) | Fine if real | Yes |
| Real scarcity/deadline | n/a | Fine if verifiable | Yes, with source of truth |
| Loss-framed pressure | CONTESTED | Gray/risky | No by default |
| Confirmshaming, fake timers, preselected add-ons, roach motel | works short-term | Deceptive; regulated | No |

---------------------------------------------------------------------------------------------------
## Anti-patterns found (summary pointers)
See Part B (B1-B54). Highest-impact, best-supported (research or standard): B2 tiny targets, B3 popups, B5/B6 hidden/gesture-only, B7 icon-only, B15 long forms, B16 confirm/undo, B20 low contrast, B21 placeholder labels, B26 launch permission, B32 hamburger-only, B33/B10 carousels, B35 account wall, B38/B39 text scaling and zoom, B42 timeouts. Evidence-thin (label [H]/[T]): B11 shadows/rounded/gradients, B29 viewport percentage for sticky chrome, B31 pull-to-refresh, B41 ellipsis policy, B43-B47 AI visual tells, B45 emoji icons.

## Disagreements & weak-evidence zones
1. Touch-target numbers disagree by unit and rationale: WCAG 24 CSS px (floor, AA) vs 44 px (AAA) vs Apple 44 pt (28 pt minimum) vs Google 48 dp (~9 mm) vs Parhi 9.2-9.6 mm vs NN/g 10 mm vs Hoober 7 mm center/12 mm corners. Resolve: platform number on platform; research numbers justify going larger at edges and for primary/in-motion use; 24 px is a legal floor, not a design target.
2. Hamburger menus: NN/g 2016 shows costs; platform design prefers bottom tab bars; no post-2020 controlled mobile-app study located. Hick-based arguments for "hide to reduce choices" are weak.
3. Single-page vs multi-step forms/checkout: no universal winner found; Baymard-style field reduction (11.3 to ~8) and deferral of account creation are the supported levers (multi-step vs single-page = MEMORY, GAP).
4. Zeigarnik, ego depletion/decision fatigue, loss aversion, choice overload (universal), nudges overall: contested; the skill should avoid citing them as justification.
5. Aesthetic-usability vs flat-design signifier study: beauty increases forgiveness, but removing signifiers still costs time; both true.
6. Von Restorff vs banner blindness: distinctiveness aids recall, ad-like distinctiveness is ignored.
7. Peak-end: lab-robust, product-level evidence thin; "delight at the end" claims are heuristics.
8. Thumb-zone: practitioner diagrams (Clark/Hoober 2013) vs Hoober 2017 field data; phone sizes changed; no large controlled study of bottom vs top placement success rate found.
9. Sticky chrome size thresholds: only ad-industry (30%) standards exist; any "25%" figure is our heuristic.
10. Skeleton screens: NN/g endorses by duration; perceived-speed research is mixed (MEMORY); do not mandate.
11. Platform vs research: Apple Liquid Glass (HIG: use sparingly in functional layer) vs NN/g critique of legibility/spacing in iOS 26: both T1/T2; recommend following HIG layer rule plus own contrast checks.

## Gaps (could not verify)
- Primary papers behind: Murdock 1962 (serial position), Kivetz et al. 2006 / Nunes & Dreze 2006 numbers, Johnson & Goldstein 2003 percentages, Maier 2022 PNAS (403), Mertens 2022 effect size, Danziger/critique details, Di Geronimo 2020 numbers, Oulasvirta 2005 full text (only abstract-level snippet), Think with Google PDFs (binary, no PDF tooling), Google 2016 interstitial blog (fetch returned only archive nav), Google back-button-hijacking blog (same; facts come from 8 secondary articles).
- NN/g "How many items in a navigation menu?" four factors (video paywall); NN/g pull-to-refresh and truncation articles (404).
- No authoritative source on: emoji-as-icons, scroll-jacking, pull-to-refresh misuse, ellipsis truncation, sticky-chrome percentage for nav bars, outdoor-glare contrast numbers, multi-step vs single-page forms, bottom-sheet overuse thresholds.
- m3.material.io pages are empty shells; Material guidance came from the GitHub docs only.
- Lighthouse meta-viewport audit page 404; viewport zoom specifics tagged MEMORY.
- lawsofux attributions are loose in places (e.g. credits Ebbinghaus for the serial position term and implies "strategic delays" benefit); I used it only as a pointer to primary sources.
- Not covered here (other slices): detailed motion durations/easing, Dynamic Type scales, Material 3 Expressive, WCAG 3 draft status.
