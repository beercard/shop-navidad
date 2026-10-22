# Slice 07: Loading, empty, error and feedback states + UX writing/microcopy

Researcher notes, 2026-10-06. Tag convention: VERIFIED = page/source fetched this session (WebFetch passes pages through a summarizing model, so numbers were cross-checked where it mattered; "(raw)" = I read the raw file/source/HTML myself). SNIPPET = search-result excerpt only. MEMORY = training knowledge, not re-verified. WebSearch budget ran out mid-session, so several topics are MEMORY or listed under Gaps.

## Sources consulted (URL | tier | verified?)

| URL | Tier | Verified |
|---|---|---|
| https://www.nngroup.com/articles/response-times-3-important-limits/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/skeleton-screens/ ("Skeleton Screens 101", reviewed Sep 2 2026) | T2 | VERIFIED (raw HTML) |
| https://www.nngroup.com/articles/progress-indicators/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/designing-for-waits-and-interruptions/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/error-message-guidelines/ , /error-messages-scoring-rubric/ , /hostile-error-messages/ , /errors-forms-design-guidelines/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/empty-state-interface-design/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/confirmation-dialog/ , /modal-nonmodal-dialog/ , /popups/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/permission-requests/ , /push-notification/ , /status-tracker-progress-update/ | T2 | VERIFIED |
| https://www.nngroup.com/articles/indicators-validations-notifications/ , /cart-feedback/ , /animation-duration/ , /3-cs-microcopy/ , /ux-writing-faqs/ | T2 | VERIFIED |
| https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens | T3 | VERIFIED |
| Mejtoft et al. 2018 (DOI 10.1145/3232078.3232086), abstract via Semantic Scholar API | T2 (peer-reviewed) | VERIFIED (abstract only) |
| https://baymard.com/research-articles/no-results-page , /credit-card-declined , /inline-form-validation , /adaptive-validation-error-messages | T2 (e-commerce context) | VERIFIED |
| https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{loading,progress-indicators,alerts,writing,feedback,notifications,privacy,playing-haptics,undo-and-redo,ratings-and-reviews,offering-help,entering-data,right-to-left,inclusion,live-activities}.json | T1 | VERIFIED (via summarizer) |
| https://developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications (JSON) and generating-a-remote-notification | T1 | VERIFIED (raw JSON) |
| Apple docs JSON: AccessibilityNotification.Announcement, UIApplication.openSettingsURLString, SwiftUI RedactionReasons.placeholder | T1 | VERIFIED (raw JSON) |
| https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/{Snackbar,LoadingIndicator,ProgressIndicator,Dialog,Banner}.md | T1 | VERIFIED |
| MCA source: snackbar/SnackbarManager.java, BaseTransientBottomBar.java, Snackbar.java | T1 | VERIFIED (raw) |
| AndroidX source: ContentLoadingProgressBar.java; compose material3 SnackbarHost.kt, Snackbar.kt, LoadingIndicator.kt; AOSP NotificationManagerService.java (Toast delays) | T1 | VERIFIED (raw) |
| https://m1.material.io/patterns/empty-states.html , /patterns/errors.html (legacy Material 1) | T1 (legacy) | VERIFIED |
| https://github.com/material-components/material-components-web/.../mdc-banner/README.md (M2 banner) | T1 (legacy) | VERIFIED |
| m3.material.io (snackbar, loading indicator, progress indicators), m2.material.io | T1 | NOT FETCHABLE (JS shell / connection refused); only SNIPPETs |
| developer.android.com: requesting permissions, permissions usage notes, notification-permission, notifications (compose), build-notification, toasts, offline-first, swipe refresh, compose pull-to-refresh, haptics principles, in-app review, progress-centric notifications (Android 16), string-resource | T1 | VERIFIED |
| https://carbondesignsystem.com/patterns/{empty-states-pattern,loading-pattern,notification-pattern,status-indicator-pattern}/ , /components/notification/usage/ , /components/inline-loading/usage/ | T1 | VERIFIED |
| Polaris (Shopify) MDX read raw from github.com/Shopify/polaris main: empty-state, error-messages, banner, spinner, toast (internal), grammar-and-mechanics, fundamentals, inclusive-language | T1 | VERIFIED (raw) |
| https://atlassian.design/components/{empty-state,flag,banner}/usage ; /foundations/content/designing-messages/ , /error-messages , /success-messages | T1 | VERIFIED |
| https://design-system.service.gov.uk/components/{error-message,error-summary,notification-banner,button}/ ; /patterns/{validation,page-not-found-pages,problem-with-the-service-pages}/ | T1/T2 | VERIFIED |
| https://primer.style/product/ui-patterns/{loading,notification-messaging,degraded-experiences,saving,empty-states}/ ; /accessibility/patterns/accessible-notifications-and-messages/ | T1 | VERIFIED (loading: raw HTML) |
| https://styleguide.mailchimp.com/{voice-and-tone,writing-principles,web-elements,writing-for-translation}/ | T2 | VERIFIED (web-elements gave only button guidance) |
| https://learn.microsoft.com/en-us/windows/win32/debug/error-message-guidelines ; style-guide: sorry, writing-tips (global), brand-voice | T1 | VERIFIED (raw) |
| https://developers.google.com/style/capitalization , /ui-elements (Google dev docs style guide) | T1 | VERIFIED |
| W3C WCAG 2.2 Understanding: 2.2.1, 2.2.2, 2.2.6, 3.3.1, 3.3.3, 3.3.4, 3.3.7, 4.1.3 | T1 | VERIFIED |
| https://www.w3.org/WAI/GL/wiki/Notification_of_Loading/Busy | T1 (proposal, not WCAG 2.2) | VERIFIED |
| MDN: role=status, aria-busy, Retry-After, Intl.RelativeTimeFormat, PWA offline/background | T1 | VERIFIED |
| https://web.dev/articles/{lcp-lazy-loading,stale-while-revalidate,prefers-reduced-motion} ; https://react.dev/reference/react/{Suspense,useOptimistic} | T1/T3 | VERIFIED |
| https://learn.microsoft.com/azure/architecture/patterns/retry | T1/T3 | VERIFIED (raw) |
| https://cldr.unicode.org/index/cldr-spec/plural-rules ; https://www.w3.org/International/articles/article-text-size.en | T1 | VERIFIED |
| https://alistapart.com/article/neveruseawarning/ (Raskin) ; https://support.google.com/mail/answer/2819488 ; https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials | T3/T1 | VERIFIED |
| https://adrianroselli.com/2020/01/defining-toast-messages.html | T4 (recognized a11y practitioner) | VERIFIED |
| Blog posts on spinner delay (pencilandpaper.io, boldist.co, eleken.co etc.) | T4 | SNIPPET only |
| AWS Builders Library (timeouts/retries/jitter), Stripe error-handling, Flutter snackbar.dart, blurhash README, FCM size doc | T1/T3 | FAILED to load (404 / JS shell / empty) |

---

## Findings

### F1 Response-time limits drive which indicator to use (and when to use none)
- Claim: 0.1 s feels instantaneous (no feedback needed), 1 s is the limit for flow of thought (show that the system is working for 0.1-1 s delays), 10 s is the limit for keeping attention (percent-done indicator plus a way to cancel). Between 2 and 10 s use a looped animation (spinner) or skeleton; below 1 s show nothing; above 10 s show a determinate bar with explanatory text.
- Evidence: NN/g Response Times - T2 - VERIFIED - 0.1/1/10 s; percent-done for "more than about 10 seconds". NN/g Skeleton Screens 101 - T2 - VERIFIED (raw) - spinners best at 2-10 s; skeleton for waits under 10 s; progress bars strongly recommended above 10 s; under 1 s neither is necessary and flashing can annoy. NN/g Progress Indicators - T2 - VERIFIED - looped animation "only for fast actions"; not under 1 s, not over 10 s; static "Loading..." text alone insufficient; include text such as "Updating address 3 of 50"; allow cancel.
- Corroboration: Primer Loading (T1, raw) - under 1 s do not show a loading state (flashing makes product feel slower); 1-3 s indeterminate; 3-10 s determinate if possible; more than 10 s determinate and treat as background task. Carbon Loading - skeleton "a few seconds", full-screen loading when more than a few seconds, progress indicator if process runs minutes. Material Components Android LoadingIndicator doc - M3 Expressive loading indicator is for waits under 5 s; use ProgressIndicator when the process can become determinate. M3 site snippet adds "under 200 ms show content, 200 ms-5 s loading indicator, over 5 s progress indicator" (SNIPPET, m3 not fetchable). Apple HIG Loading - system progress indicator "when loading takes more than a moment or two"; determinate when duration known.
- Scope: universal.
- Context (when it flips): thresholds differ by 3x between systems (Primer 3 s vs Material 5 s vs NN/g 10 s for "switch to determinate"). Use the strictest (earliest) when the duration is actually known; if duration is unknowable, a spinner is acceptable well past 10 s only with a message, background option and cancel.
- Agent rule: IF expected wait <~1 s THEN show no loader (keep the control's pressed/disabled state for 0.1 s feedback). IF 1-3 s THEN indeterminate spinner (in place) or skeleton (full-screen). IF 3-10 s THEN skeleton for full-page, spinner for single module, determinate bar if progress is measurable. IF >10 s THEN determinate bar + text ("3 of 12") + Cancel + allow background and notify on completion. Always implement a timeout to an error state (F9).

### F2 Do not flash loaders: delay-show + minimum display time
- Claim: A loader that appears for 100 ms is worse than none. Standard fix: do not render until a delay passes; once shown, keep it for a minimum time. Treat exact numbers as tuned heuristics anchored by AndroidX's 500/500.
- Evidence: AndroidX ContentLoadingProgressBar source - T1 - VERIFIED (raw) - `MIN_DELAY_MS = 500`, `MIN_SHOW_TIME_MS = 500`; if hide() is called before the delay elapses the bar is never shown; once shown it stays visible at least 500 ms. Material Components `app:showDelay` / `app:minHideDelay` exist but default to 0 ms - T1 - VERIFIED. React reveals suspended boundaries at most once per 300 ms - T1 - VERIFIED. Primer: under 1 s do not show. Blog heuristics (200-300 ms delay, ~400 ms min show) - T4 - SNIPPET.
- Conflict: delay values range 200 ms (blogs, M3 snippet) to 500 ms (AndroidX). No peer-reviewed source for an optimal number; flag as HEURISTIC.
- Scope: universal.
- Agent rule: IF the loader is for a request that usually returns <~1 s THEN delay showing it 200-300 ms (500 ms acceptable) and, once visible, hold ~400-500 ms. NEVER delay the immediate pressed/disabled state on the control that was tapped (NN/g: unacknowledged clicks are assumed not registered).
- Stack notes: Android `ContentLoadingProgressBar` or MCA `showDelay`/`minHideDelay`; React Suspense + `startTransition` keeps old UI instead of fallback; CSS: `animation-delay` on loader + `opacity:0` start.

### F3 Skeleton screens: useful layout placeholder, not a proven perception trick
- Claim: Use skeletons for full-page/container loads of 1-10 s where final layout is predictable; they do not clearly make waits feel shorter. Evidence is thin and mixed.
- Evidence: NN/g (T2, raw) - skeletons are for full-page loads only; three types (static boxes, animated shimmer/pulse, frame-only); frame-only "not recommended" (equivalent to a spinner); animation "can be distracting, annoying, or even create accessibility problems"; spinners better on a single module. Mejtoft et al. 2018 - T2 peer-reviewed - VERIFIED (abstract) - skeleton page rated higher on perceived speed and ease of navigation, but spinner users found the article faster; authors state no significant differences. Viget test - T3 - VERIFIED - 136 participants, GIF-based, skeleton 2.82 s perceived wait vs spinner 2.41 s vs blank 2.29 s; skeleton "worst by all metrics"; small cells, real durations unstated. Carbon - T1 - skeleton for container/data components (tiles, lists, tables, cards) on initial load; NOT for toasts, menus, modals, buttons, inputs, checkboxes. Polaris Spinner - T1 (raw) - spinners only for content that cannot be shown as skeleton (e.g. charts); not for whole-page load. Primer - skeleton for large areas of loading content.
- Corroboration / conflict: NN/g frames skeleton as reducing perceived time (reasoned, no cited effect size in the article body I read); Viget contradicts; Mejtoft is null. The "skeleton is always better than a spinner" claim is folk wisdom without strong evidence.
- Scope: universal; strongest for web/mobile list/detail screens with stable layout.
- Context (when it flips): skeleton hurts when the layout is unpredictable (content shapes differ, causing a jump), when the wait is <1 s (flash), when loading is an action (save/upload), or when loads may stall (F9).
- Agent rule: IF full-screen/list first load, 1-10 s, layout known THEN skeleton whose block sizes match final layout (avoids layout shift) and swap in place without re-flow. IF single card/chart THEN inline spinner. IF action (save, upload, convert) THEN progress or inline button state, never skeleton. NEVER use frame-only skeleton. NEVER skeleton buttons/inputs/modals/toasts (Carbon).
- Shimmer vs static: no controlled evidence found. NN/g warns about distracting animation; web.dev lists skeletons as "keep but modify" under reduced motion; Primer says loading animation should NOT be disabled for reduced-motion users but must stay subtle. Resolution (judgement, flagged): under `prefers-reduced-motion: reduce` replace shimmer sweep with a slow opacity pulse or static placeholder, and cap shimmer to a gentle low-contrast gradient.
- Stack notes: SwiftUI `.redacted(reason: .placeholder)` masks real views to placeholder shapes keeping size/shape (VERIFIED, Apple docs JSON); CSS: reserve exact heights/aspect-ratio; Flutter/Compose: custom shimmer or placeholder modifiers (not verified this session).

### F4 Determinate vs indeterminate, and progress honesty
- Claim: Prefer determinate indicators when progress is measurable; keep pace consistent; keep indicators animated; switch from indeterminate to determinate when possible; never change visual style (spinner to bar) mid-task.
- Evidence: Apple HIG Progress Indicators - T1 - VERIFIED - nine best practices incl. "avoid 90% quickly then last 10% slow" (looks frozen or deceptive), stationary indicator reads as stalled, avoid vague labels like "loading"/"authenticating", offer Cancel (Pause + Cancel with confirm if cancel loses data). NN/g - percent-done is "most informative"; start slower and accelerate toward the end; cites a Nebraska-Lincoln study of 3x longer willingness to wait with progress bar (second-hand through NN/g; underlying study not checked) - T2 - VERIFIED (secondhand). Material Components - indeterminate to determinate transition supported on ProgressIndicator; LoadingIndicator must not transition (use ProgressIndicator instead) - T1 - VERIFIED. HIG says do not swap shapes; Material says for multiple sequential processes show overall progress not each step.
- Context (when it flips): fake/estimated progress that stalls at 99% is worse than honest indeterminate. HIG watchOS: avoid indeterminate spinners entirely; notify on completion.
- Agent rule: IF measurable (bytes, items, steps) THEN determinate with text ("Uploading 3 of 12"); ELSE indeterminate plus plain-language stage text. NEVER let a determinate bar sit at 100% while work continues; show "Finishing..." with indeterminate state instead.
- MEMORY (not re-verified): Myers 1985 and Harrison et al. 2007 are the classic studies on percent-done and perceived-duration of progress bar animation; I only reached their titles.

### F5 Progressive rendering, stale-while-revalidate, optimistic UI
- Claim: Show something useful immediately: cached/local data, incrementally loaded items, stale content marked as refreshing. Use optimistic updates only when the action is very likely to succeed and is reversible.
- Evidence: HIG Loading - show content immediately, placeholders replaced as content arrives; allow background loading - T1 - VERIFIED. Primer Loading - "don't wait for every item" to render; consolidate adjacent loaders into one - T1 - VERIFIED. React Suspense - use transitions/`useDeferredValue` to keep already-visible UI instead of hiding it behind a fallback; dim stale results with opacity - T1 - VERIFIED. web.dev stale-while-revalidate - instant cached response; browsers give no staleness signal so the UI must - T1 - VERIFIED. Android Offline-first guide - read local source of truth immediately, write locally first (lazy writes) - T1 - VERIFIED. React `useOptimistic` - optimistic state auto-reverts if the action throws - T1 - VERIFIED.
- Optimistic-UI safety criteria (low failure rate, reversible, no money/legal/irreversible side effects, visible rollback explanation) are my synthesis; I found no T1 source stating them (labelled opinion/design reasoning). Android guide supports "online-only writes for bank transfers/time-sensitive transactions".
- Agent rule: IF the action is a toggle/like/reorder/archive (cheap, reversible, >~99% success) THEN apply instantly, roll back on failure with a message plus Retry. IF payment, send, delete-permanently, or server validation decides outcome THEN show pending state until confirmed. When showing cached data while refreshing, show "Updated 2 min ago" and a subtle refreshing indicator.

### F6 Button loading states and duplicate submissions
- Claim: When a tap starts work, immediately show state on the button itself, block repeat activation, keep the layout stable, and report completion.
- Evidence: Carbon Inline Loading - T1 - VERIFIED - interactive elements tied to the button disabled while loading; labels "Saving..." then "Saved"; success state lasts 1.5 s; on error component goes inactive and an inline notification appears; use for brief create/update/delete; never show loading on multiple items at once except initial page load. Primer - semantically disable post-submit but do not apply `aria-disabled` to the initiating button; elsewhere Primer Saving says never disable save buttons (not focusable, poor contrast) - T1 - VERIFIED. GOV.UK Button - `preventDoubleClick`; avoid disabled buttons (poor contrast, confusing); pair with server-side protection - T1 - VERIFIED.
- Conflict: "disable during flight" (Carbon) vs "never disable" (Primer saving, GOV.UK). Synthesis: do not use the HTML/native disabled state for validation gating; during in-flight, keep the control focusable, swap label to progress text, ignore repeat input, and rely on server idempotency keys.
- Agent rule: IF button triggers async work THEN: (1) change within 100 ms: spinner + verb-ing label ("Saving..."), (2) fix min-width so the button does not resize (heuristic, no source), (3) ignore taps while in flight, (4) on success briefly show done state (~1.5 s per Carbon) or navigate, (5) on failure restore the button and show inline error with preserved input.

### F7 Long operations: background it and notify
- Evidence: NN/g Long waits - T2 - VERIFIED - progress for waits >10 s with percent/time/steps; allow lengthy operations to run in the background and give a prominent completion notification with a summary (start, end, results, errors). HIG Loading - background loading; BackgroundAssets for big downloads - T1 - VERIFIED. HIG Live Activities - T1 - VERIFIED - tasks with defined start/end, typically not over 8 h; update only when content changes; alert sparingly; end immediately and set dismissal ~15-30 min; do not duplicate with push for the same updates; not for ads or sensitive data. Android 16 progress-centric notifications (`Notification.ProgressStyle`) for user-initiated start-to-end journeys (rideshare, delivery, navigation) - T1 - VERIFIED. NN/g status trackers - T2 - VERIFIED - push plus pull, plain language not backend codes, low-granularity updates during quiet periods ("Joined the processing queue").
- Agent rule: IF operation >10 s or needs the app closed THEN run it as background work (WorkManager / BGTaskScheduler / service worker Background Sync), show persistent progress somewhere non-blocking, and notify on completion/failure with an actionable deep link. IF the operation reports to a live status (ride, delivery) THEN Live Activity (iOS) / progress-centric notification (Android 16+).

### F8 Pull-to-refresh and refresh feedback
- Evidence: HIG Progress Indicators (iOS refresh control) - T1 - VERIFIED - hidden until pulled; do automatic periodic updates, do not rely only on manual refresh; optional title should convey value such as "Last updated: 2 minutes ago" not an instruction. Android Swipe-to-refresh - T1 - VERIFIED - provide an alternative refresh action calling the same update path; always end the indicator (`setRefreshing(false)`). Compose `PullToRefreshBox` (`isRefreshing`, `onRefresh`, custom indicator, keep threshold consistent) - T1 - VERIFIED.
- Agent rule: IF a list is refreshable THEN support pull gesture AND a visible/accessible alternative (toolbar/menu action or retry button) mapping to the same function; end the spinner on both success and failure; show "Updated <relative time>" after success; on failure keep prior data and show a retry affordance, not an empty screen.

### F9 "Skeleton forever": loading must terminate in an error
- Evidence: Carbon Loading - T1 - VERIFIED - a screen reader should be told if the app is loading, busy, gets stuck, or a process fails. Azure Retry pattern - T1 - VERIFIED (raw) - interactive apps fail fast after few retries and show a message; do not retry forever; implement retry only at one layer; circuit-break on long-lasting faults. NN/g 10 s attention limit (F1). No source gives a canonical timeout number.
- Heuristic (flagged): fetch timeout 10-15 s on interactive reads; at ~5-8 s upgrade loader copy ("Still loading your orders..."); at timeout swap skeleton/spinner for error-empty state with Retry and preserved navigation.
- Agent rule: EVERY loading state has three exits: success, error, and timeout; never an unbounded skeleton/spinner. Retry button re-enters loading, not a page reload.

### F10 Announce loading and status to assistive tech
- Claim: Visual-only loaders leave screen-reader users guessing; announce start (if long), progress milestones, completion and failure without stealing focus.
- Evidence: WCAG 2.2 SC 4.1.3 Status Messages (AA) - T1 - VERIFIED - success results, progress, "application busy", and errors must be programmatically determinable (`role=status`/`alert`/live regions) without receiving focus; dialogs and changes of context are out of scope. MDN `role=status` - T1 - VERIFIED - implicit `aria-live=polite`, `aria-atomic=true`; the live region must exist in the DOM before content is injected; use `alert` only for time-critical info. Primer Loading - T1 - VERIFIED (raw) - label indicators specifically, use `aria-busy` on live regions during updates, move focus to new content or error. WAI "Notification of Loading/Busy" - T1 proposal (not in WCAG 2.2) - VERIFIED. Material Components - set `contentDescription` on progress/loading indicators; contained variant needs 3:1 contrast; linear tracks of 4 dp or less may not render a TalkBack focus ring - T1 - VERIFIED. Apple - `AccessibilityNotification.Announcement` / `UIAccessibility.post(.announcement)` for events that do not update UI or only briefly - T1 - VERIFIED (raw JSON). Polaris Spinner label: "Loading", "Submitting", "Processing", as few words as possible - T1 - VERIFIED (raw).
- Disagreement: MDN says prefer `role=status`/live over `aria-busy`; Primer recommends toggling `aria-busy` on a live region while it updates. Use live region; treat `aria-busy` as optional and test with screen readers (support inconsistent - MEMORY).
- Agent rule: IF loader takes >~1 s THEN a persistent `role=status` region says what is loading ("Loading orders"); on completion update the same region ("12 orders loaded"). Do NOT announce every percent tick (heuristic): announce milestones (25/50/75/100) or elapsed. Errors use `role=alert`. On native: set content descriptions/accessibility labels; post announcement on completion.

### F11 Image lazy-loading and placeholders
- Evidence: web.dev (T1) - VERIFIED - never lazy-load above-the-fold/LCP images; sites using lazy loading indiscriminately had median LCP 3,546 ms vs 2,922 ms without; keep lazy loading for the rest; reserve space (width/height/aspect-ratio) to avoid layout shift (implied, not detailed in the fetched page).
- Placeholders (blurhash, dominant color, LQIP): MEMORY - blurhash README did not load; typical blurhash strings are ~20-30 chars (unverified). Rule is design judgement.
- Agent rule: IF image below the fold THEN lazy-load with reserved aspect-ratio box and a low-cost placeholder (dominant color or blurhash); IF first/hero image THEN eager + `fetchpriority=high`; on image error show a neutral broken-image tile with Retry for tap, not a collapsed hole.

### F12 Empty states: types, anatomy (what / why / next), restraint
- Claim: Every empty region needs status (why empty), a learning cue (what belongs here), and a direct path (one primary action). Type determines tone and CTA.
- Evidence: NN/g Empty State - T2 - VERIFIED - three guidelines: communicate system status, provide learning cues ("pull revelations"), provide direct pathways. Carbon - T1 - VERIFIED - types (no data/first use, user-action states like no results or completion, error states incl. permissions); anatomy: optional image, title (positive: "Start by adding..." not "You don't have..."), body (next step, why empty, benefit), primary action, optional secondary doc link; one actionable item; no dead ends; decorative image with empty alt; do not repeat the same illustration across empty states. Polaris - T1 (raw) - action-oriented title ("Create orders and send invoices" not "Orders and invoices"); never make users feel guilty; one primary CTA; {verb}+{noun} buttons; empty-state component for a full page, not small areas; illustration is decorative (empty alt). Atlassian - T1 - VERIFIED - types: blank slate (inspirational), completion (celebratory), no results (neutral, motivational); sentence-case header, imperative CTAs, limit CTAs; omit illustration when space is tight or competing visuals; widths 464 px (wide) / 304 px (narrow). Primer Blankslate - T1 - VERIFIED - first-time user (playful graphic OK), temporarily empty, error (graphic must reinforce that something went wrong; no playful art); do not use vague "There was a problem"; do not push unrelated alternatives. Apple HIG Writing - T1 - VERIFIED - empty states should guide next steps with clear contextual messaging; do not put crucial info there that will vanish. M1 (legacy) - first-touch/initial and nothing-found; starter content, dismissible educational cards, "best match".
- Conflict: M1 says the tagline should NOT be worded like a CTA and image should be non-interactive (to avoid false affordance). Carbon, Polaris, Atlassian, NN/g all say include an explicit action button. M1 is legacy (m3 snippet suggests no dedicated M3 empty-state page - SNIPPET). Follow modern consensus: explicit button; keep illustration non-interactive.
- Type template (synthesis built on above; adapt per type):

| Type | Title | Body | Action |
|---|---|---|---|
| First use / zero data | Positive/benefit ("Track your first expense") | what belongs here + why useful | Primary: create |
| No search results | Echo query ("No results for 'x'") | spelling/broaden/alternatives | Edit search / browse |
| Filtered to zero | "No <items> match these filters" | show active filters | "Clear filters" |
| Cleared / done ("inbox zero") | Short, restrained celebration | optional next best action | None or secondary |
| Error-empty (load failed) | What failed ("Couldn't load orders") | cause if known | Retry |
| Offline-empty | "You're offline" | what's available offline | Retry / view saved |
| Permission-needed | What capability is off | benefit + degrade note | "Open Settings" / "Allow" |
| Deleted / archived (empty Trash) | "Trash is empty" | retention rule | none |

- Agent rule: IF region can be empty THEN design an empty variant per type above; NEVER render a blank container; <=1 primary action; copy: positive title, 1-2 sentence body, verb+noun button. Illustration optional, decorative (empty alt), omitted in tight spaces, never playful on error variants.

### F13 Search no-results and filtered-to-zero recovery
- Evidence: Baymard - T2 (e-commerce benchmark) - VERIFIED - about 50% of ecommerce sites lack effective no-results recovery; five strategies: related categories from query words, alternative/simplified searches (preview or auto-apply with explanation), personalized recommendations, support contact, popular products; "search tips alone" ineffective. M1 - show best-match results clearly labeled when query was misspelled.
- Agent rule: IF zero results THEN echo the query (editable), explain why if known (filters/spelling), offer 2-3 concrete alternatives (broader query, removed filter, related categories), keep search field focused; IF filters caused zero THEN "Clear filters" as primary and list the active chips.

### F14 Error message anatomy and formula
- Claim: Good error text answers: what happened (specifically), why (only if useful), what to do next, and what is preserved. Short, plain, non-blaming, near the problem.
- Evidence: NN/g Error Message Guidelines + Scoring Rubric - T2 - VERIFIED - 12 guidelines in Visibility/Communication/Efficiency: place at source; at least 3 indicators (not color alone); severity-appropriate (modals only for serious, banners/toasts for minor); avoid premature display; plain language at ~7-8th-grade level; front-load; constructive advice; accountability on the system, positive tone; preserve input; reduce correction effort; contextual help resource; avoid humor that goes stale; avoid "invalid"/"illegal". Microsoft Win32 error guidelines - T1 (raw) - state what happened and why, end result, how to prevent; write a separate message per known cause (generic only if cause unknown); avoid the words "bad" and "please"; do not blame; complete simple sentences; Yes/No only for a question; no "error" in title bar. Polaris Error messages - T1 (raw) - explain what's wrong and what to do; be specific with exact numbers/data; do not over-apologize or say "we" unless the company caused it; avoid "invalid"; only explain backstory if helpful or no solution; anatomy: optional heading (effect), body (fix + help link), CTA (one-step fix). Atlassian - T1 - VERIFIED - title 3-4 words, body 1-2 sentences (reason, action, consequence), CTA 1-2 words; if the cause is unknown say something went wrong and offer a solution. GOV.UK Error message - T1 - VERIFIED - formulas: empty "Enter X"; wrong format "Enter X in the correct format"; length "X must be 35 characters or less"; error text should echo the question; avoid "forbidden/illegal/sorry". Apple HIG Writing - T1 - VERIFIED - display near the problem, avoid blame, instructional: "Choose a password with at least 8 characters" beats "That password is too short"; avoid "oops"/"uh-oh"; avoid "we".
- Baymard - T2 - VERIFIED - 98% of sites use generic validation messages; "Your card number is incomplete" beats "invalid"; specific messages reduce recovery time (some users took up to 5 min) and abandonment.
- Formula (synthesis): [specific problem, user's object] + [cause only if known and useful] + [exact next step] + [action button]. Title <=3-4 words if used; body <=2 sentences.
- Agent rule: IF generating an error string THEN use the formula; include numbers/names from the user's data; never "Invalid X", "Error", "Failed", "Oops", "Please", "Sorry" (except F21 cases).

### F15 Validation timing and placement (sources conflict)
- Evidence: NN/g Hostile Error Messages + Form errors - T2 - VERIFIED - do not show errors while the user is still typing; validate when leaving the field; errors adjacent to field; do not rely on summary alone; avoid modals that hide the form; if the same error repeats 3+ times provide an escalation (support). Baymard Inline validation - T2 - VERIFIED - validate on blur (or once correct length for fixed-length inputs); remove error immediately as the value becomes valid; positive confirmation helps; 31% of sites lacked inline validation. GOV.UK Validation - T1 - VERIFIED - validate when user tries to continue (not on blur); show error summary at top with focus moved + "Error: " page title prefix + inline errors; keep entered data; turn off HTML5 native validation for consistent messages; "Always show an error summary... even if one error"; summary text identical to inline text; link to first field. Apple HIG Entering data - T1 - VERIFIED - validate dynamically "as they enter" and give inline feedback ASAP; prefill; use formatters. M1 Errors (legacy) - show error text only after interaction; disable form submission if inline errors exist. WCAG 3.3.1 - error identified and described in text (not color alone); 3.3.3 suggestions when known; 3.3.4 reversible/checked/confirmed for legal/financial/data-deleting submissions; 3.3.7 Redundant Entry: do not make users retype - T1 - VERIFIED.
- Disagreements: (a) HIG real-time vs NN/g/Baymard on-blur vs GOV.UK on-submit; (b) M1 "disable submit" vs GOV.UK/Primer "avoid disabled". Resolution by input type: real-time helper hints (password rules, character counters, username availability) while typing but only styled as errors after blur/submit; on submit keep button enabled and show the summary.
- Agent rule: IF form field THEN: persistent label (not placeholder) + helper text; error text below field in text (+icon + color + border); validate on blur (never on first keystroke); clear the error live as soon as the value becomes valid; on submit with errors scroll/focus to first invalid field (mobile) or error summary (web), keep all entered values, keep keyboard type correct; submit button stays enabled.

### F16 Error taxonomy: placement and severity hierarchy

| Situation | Primary surface | Retry | Preserve | Sources |
|---|---|---|---|---|
| Field validation | Inline under field (+ summary on web) | n/a | all input | NN/g, GOV.UK, Polaris |
| Content region failed to load | In-place error-empty state in that region | Retry button | rest of screen | Primer degraded, Carbon |
| Offline, reads cached | Subtle persistent indicator/banner | auto on reconnect | cached data | M1 Errors, Android offline-first |
| Offline, write | Queue + per-item "Waiting to sync" | auto | queued item | Android offline-first |
| Write failed (non-critical) | Snackbar/toast with Retry (message short, action persists) or inline item state | manual | draft | Polaris toast, Material |
| Server 5xx / timeout | In-place or full-page "Couldn't load..." | manual + limited auto | input | GOV.UK problem-with-service, Azure |
| Rate limit 429 | Inline/banner with wait time | after Retry-After | input | MDN |
| Permission denied | Inline at point of need | "Open Settings" (user-initiated) | n/a | Android, NN/g, HIG |
| Auth/session expiry | Dialog or sign-in sheet; keep route and draft | after sign-in | draft | WCAG 2.2.1/2.2.6 |
| Not found/deleted | Full-page/in-place "isn't available" | Go back/Search | n/a | GOV.UK page-not-found |
| Conflict/stale data | Dialog or inline compare | choose version | both versions | synthesis (opinion) |
| Payment failure | Inline on payment step | change method/retry | cart, fields | Baymard |
| Destructive action failed | Banner/inline at the object | Retry | object state | Polaris banner example |
| Partial batch failure | Summary with counts + failed item list | "Retry N" | successes | Polaris multi-error pattern (synthesis) |

- Evidence for hierarchy: NN/g Rubric (modals for serious only; banners/toasts for minor), HIG Alerts - T1 - VERIFIED - alerts only for critical info needed immediately, never on startup, not for undoable common actions, not for purely informational content; HIG Notifications: errors go in alerts, not notifications; Polaris Toast (internal doc, raw) - rarely use error toast; only non-critical, relevant now, <=3 words (e.g., "Internet disconnected"); use banner for persistent errors; Atlassian Banner/Flag - critical system-level only; never auto-dismiss critical errors; Carbon Notification - toast without action may auto-dismiss, with action persists, critical never auto-dismiss; Primer Notification messaging - T1 - VERIFIED - banner (page-level) vs inline message; critical for errors; place near related action; Primer Degraded experiences - T1 - VERIFIED - do not conceal; show page-level error only when primary experience fails; replace broken sections with brief error or blankslate; hide counts when data unavailable; <=5 outage messages per page; keep controls (use inactive not disabled). M1 Errors - three types: user input, app errors, incompatible state; dialog blocks, snackbar for peripheral.
- Agent rule: choose the least interruptive surface that still guarantees the user can't miss what they must act on. Priority: inline > in-place region > banner > snackbar (non-critical only) > dialog (must-decide) > full page (primary experience lost).

### F17 Network, timeout, 5xx and rate-limit handling (auto vs manual retry)
- Evidence: Azure Retry pattern - T1 - VERIFIED (raw) - retry only transient faults; cancel if non-transient; immediate retry only for rare faults; delay with increasing (exponential) spacing and spread requests across clients; interactive apps fail fast with short delays and tell the user; retry only where full context known (avoid stacked retry layers); idempotency required; log early failures as info. MDN Retry-After - T1 - VERIFIED - seconds or HTTP-date for 429/503. Android Offline-first - T1 - VERIFIED - exponential backoff, WorkManager retry on failure, queue writes, LCE (loading/content/error) UI state model.
- Jitter/"retry storm" specifics: MEMORY (AWS Builders Library page failed to load; Azure page states spreading requests).
- Agent rule: IF idempotent GET fails with network/5xx THEN auto-retry 1-2 times silently with backoff+jitter, then show manual Retry. IF non-idempotent POST fails THEN do NOT blindly auto-retry unless an idempotency key is used; show state "Not sent" with Retry. IF 429 THEN honor Retry-After and show remaining wait. NEVER retry indefinitely in the foreground; escalate to background sync with sync status.
- GOV.UK problem-with-the-service - T1 - VERIFIED - say "Try again later", no "500"/"technical difficulties"; say what happened to entered answers; give contact route; store entered data for a stated time (e.g., 30 days example). Support/error IDs: show only when users can pass it to support (Polaris: explain backend only if helpful; Microsoft: separate text for admins vs users; NN/g: avoid obscure codes unless needed); put it in secondary text with Copy.

### F18 Permission rationale, denial and settings deep links
- Evidence: Apple HIG Privacy - T1 - VERIFIED - request only when feature needs it, not at launch (unless required for core function); purpose strings must say how/why in active voice, sentence case ("The app records during the night to detect snoring sounds."); a pre-alert custom screen must have ONE button ("Continue"/"Next"), no incentives, no "Allow" mimicry, no images of the system alert, no dismissal bypass; Settings > Privacy lets users change later. Apple Notifications authorization doc - T1 - VERIFIED (raw) - ask in context (after first scheduled task), prompts only once (later requests do not prompt); provisional authorization delivers quietly to Notification Center with Keep/Turn Off, lets you request on first launch. Android permissions - T1 - VERIFIED - ask in context; `shouldShowRequestPermissionRationale` for educational UI; after two denials system dialog stops appearing; degrade gracefully: minimize loss, guide attention, be specific, don't block UI with full-screen warnings, accept the choice; says "don't link to system settings in an effort to convince the user to change their decision". Android 13 notification permission - T1 - VERIFIED - ask after user sees value (e.g., following an account, placing an order, or after 3-4 launches). NN/g Permission Requests - T2 - VERIFIED - explain benefits not features; Tan et al. 2014 via NN/g: purpose string gave 12% more grants vs none, and best vs worst rationale gave 81% lift; template "[App] would like to access your [resource] so that you can [benefit]"; after denial explain what's unavailable and "provide a link to the exact place in settings". NN/g Push Notification - T2 - VERIFIED - do not ask on first launch; explain what notifications you'll send.
- Conflict: NN/g says link to the exact settings location; Android says do not link to settings to pressure. Reconcile: show the Settings link only at the moment the user tries the blocked feature and make it user-initiated ("Open Settings" button next to a clear explanation); never repeat nag modals; keep the app usable.
- Agent rule: IF permission is optional THEN ask at point of use with one-sentence benefit (own primer only if value non-obvious; iOS primer has single "Continue"). IF denied THEN inline degraded state: "Camera access is off. Turn it on in Settings to scan receipts." + [Open Settings] using `UIApplication.openSettingsURLString` / `ACTION_APPLICATION_DETAILS_SETTINGS` (latter MEMORY). IF notifications THEN delay prompt until a trigger moment; consider iOS provisional authorization. Web: ask on user gesture after value is shown (MEMORY).

### F19 Auth/session expiry, conflict, payment, destructive and batch failures
- Session expiry - Evidence: WCAG 2.2.1 Timing Adjustable (A) - VERIFIED - user can turn off, adjust (>=10x), or be warned >=20 s before expiry and extend with simple action (at least 10 times); exceptions: real-time, essential, >20 h. WCAG 2.2.6 (AAA) - VERIFIED - warn of inactivity duration that loses data unless preserved >20 h. Rule: warn before expiry, offer "Stay signed in", and preserve drafts across re-auth (3.3.7 Redundant Entry).
- Payment failure - Baymard - T2 - VERIFIED - 30% of "card declined" abandonments recoverable with better handling; 34% of sites fail to retain sensitive card fields after validation errors; adaptive messages. Show specific cause when safe; keep non-sensitive fields; offer other payment method; do not clear cart. (Revealing raw decline codes is a security trade-off; Stripe guidance not fetched - Gap.)
- Destructive action failure / partial failure: no T1 source found. Polaris "To save this product, make 2 changes:" list pattern (raw) is the nearest model for multi-error summaries. Rule (synthesis): report counts ("12 of 15 uploaded"), name failures, keep successes, offer "Retry 3".
- Conflict/stale data: Android Offline-first uses last-write-wins with timestamps - T1 - VERIFIED; it silently loses edits. For rich/user-authored content prefer surfacing conflicts (opinion; no source).
- Agent rule: IF 401 mid-task THEN show sign-in sheet in place, then resume the action; never discard in-progress input.

### F20 Preserve user work and the error-to-recovery transition
- Evidence: NN/g (preserve input); GOV.UK Error message/Validation (do not clear fields) - VERIFIED; Baymard preserve card fields; WCAG 3.3.7; Primer Saving - data preserved and failure feedback shown - VERIFIED; GOV.UK Notification banner - never auto-dismiss, remove success banner when user navigates away - VERIFIED; Baymard - remove errors keystroke-live once fixed.
- Agent rule: on any failure keep draft in memory and persist to disk if the app could be killed; on retry success clear the error immediately, announce result via status role, restore focus to a logical place (not top of page); do not leave stale error banners after the condition resolves (Atlassian: banners "only disappear when no longer required").

### F21 Tone: apology, "we", humor, "please"
- Evidence table of positions (all VERIFIED):

| Topic | Positions |
|---|---|
| "Sorry" | Microsoft: only for serious product-caused problems (data loss, can't continue, needs support); not for network or external problems. Atlassian: avoid "please"/"sorry" (undermine credibility). GOV.UK: avoid "sorry" in field messages, yet its service-problem page headline uses "Sorry, there is a problem with the service". Polaris: do not over-apologize. |
| "We" | Apple HIG: avoid "we" (ambiguous; HIG Inclusion says "we" only for your company). Polaris: avoid "we" unless the company caused the problem. Atlassian: uses "we" instead of "you" to avoid blame. |
| "Please" | Microsoft: avoid (makes required actions sound optional). Atlassian: avoid. |
| Humor/"Oops" | HIG: avoid "oops/uh-oh" (insincere). GOV.UK: no "oops", no humor. NN/g: avoid humor that goes stale; only for truly catastrophic unrecoverable failures an apology plus something novel may salvage. Mailchimp: clarity over entertainment. Carbon: no flippant language in errors. |
| Blame | NN/g rubric: accountability on the system. Microsoft: never make the user feel at fault. HIG: avoid blame. |

- Agent rule: default to neutral, specific, active voice; blame the system's state not the user ("Couldn't save" not "You entered..."); no "Oops", exclamation marks, emoji, or "please"; apologize only for serious product-caused failures, once, in the headline.

### F22 "Something went wrong" as last resort: what extra info exists
- Evidence: Atlassian - if cause unknown, say something went wrong and offer a solution; Polaris example "Something went wrong. Refresh your browser to try again." as the no-solution fallback; HIG - avoid vague "Error" titles; Primer - avoid "There was a problem"; Microsoft - generic only if cause cannot be determined.
- Information you almost always have: offline vs online; request timed out vs refused; HTTP class (401/403/404/409/422/429/5xx); which object/action; whether data was saved/queued; retry availability; support ID.
- Agent rule: map status to message templates (offline, timeout, 401, 403, 404, 409, 422 field errors, 429, 5xx); the generic message is the single fallback template and must still include an action.

### F23 Toast / snackbar rules
- Claim: transient, non-critical, one at a time, optional single action; timing and accessibility are the real risks.
- Numbers (all source-code or doc VERIFIED unless noted):
  - Compose M3 `SnackbarDuration`: Short 4000 ms, Long 10000 ms, Indefinite = never; duration is adjusted via `AccessibilityManager.calculateRecommendedTimeoutMillis`. (SnackbarHost.kt)
  - Material Components Android (Views): SHORT 1500 ms, LONG 2750 ms defaults (SnackbarManager.java); uses `getRecommendedTimeoutMillis` with controls/text flags when accessibility services are on (BaseTransientBottomBar/Snackbar.java).
  - M3 guideline text: no-action snackbars auto-dismiss in ~4-10 s depending on platform; snackbars with actions should persist until acted on; up to two lines, 48-64 dp tall - T1 - SNIPPET (m3.material.io not fetchable). Compose KDoc independently says "Material recommended spec of a maximum of 2 lines" - VERIFIED.
  - AOSP Toast: 2000 ms / 3500 ms. Android 12+ toasts are limited to two lines.
  - Polaris toast: default 5000 ms; with an action at least 10,000 ms; message <=3 words, pattern noun + verb ("Product updated"); action 1 verb; only include an action if the same action exists elsewhere on the page; no "Cancel"/"OK"/"Dismiss" actions.
  - Carbon: toast optional auto-dismiss 5 s; toast with action persists; two lines max; one action.
  - Gmail Undo Send: 5, 10, 20 or 30 s cancel window (user selectable) - VERIFIED.
- WCAG: 2.2.1 allows disappearing messages when the same information is available elsewhere (Understanding doc's inbox example) - VERIFIED. NN/g Cart Feedback - disappearing overlay failed when users needed to verify what was added - VERIFIED. Primer (T1) states toasts "pose significant accessibility concerns" and recommends banners/dialogs/inline instead - VERIFIED; Roselli (T4) lists failures: timing, focus order, live-region raw-text announcement - VERIFIED. Polaris toast accessibility: avoid for critical info; may be unreachable by keyboard; ensure action is available elsewhere.
- Position/queue: MCA - one snackbar at a time; `setAnchorView` to sit above FAB/BottomAppBar/BottomNavigation - VERIFIED. Carbon stacks toasts at top; Material is bottom. Keyboard overlap not verified (Gap).
- iOS has no system snackbar; custom toasts must post an accessibility announcement (VERIFIED API above).
- Agent rule: IF message is non-critical, result of a user action, and info is available elsewhere THEN snackbar/toast: <=2 lines (or <=3 words under Polaris style), 4-6 s without action (heuristic), >=10 s with an action (Polaris 10 s; Material Indefinite option), swipe/close to dismiss, one at a time (queue or replace), above bottom nav/FAB, announce via status role / accessibility announcement, honor system accessibility timeout. IF info must be acted on or is an error needing a decision THEN NOT a toast: use inline/banner/dialog.

### F24 Banner (persistent, non-modal)
- Evidence: M2 banner (MDC README, legacy) - VERIFIED - important succinct message with up to two text actions, persistent and non-modal, below top app bar, one at a time; MCA Banner doc says the component is "yet to be completed" - VERIFIED (so there is no M3 Android Banner). Atlassian Banner - VERIFIED - critical messaging only (data loss, functionality, site-wide), not dismissible, only error/warning, one at a time, pushes content down, truncates if long. Polaris Banner (raw) - sparingly; dismissible unless critical; tones success/info/warning/critical; body 1-2 sentences; <=1 primary action; default to toast for success unless delayed/persistent/has CTA; critical and warning use `role=alert`, others `role=status`; do not move focus on page load. Carbon - system/product-level, persist until dismissed, one at a time. GOV.UK Notification banner - max one per page; never auto-dismiss; success banner only to confirm an expected outcome; do not combine with error summary.
- Agent rule: banner = persistent status that applies to the screen/system (offline, sync paused, payment past due). One at a time, directly under the header, action = verb phrase, auto-remove when condition resolves, dismissible only if non-critical.

### F25 Dialogs and alerts (blocking)
- Evidence: HIG Alerts - VERIFIED - max 3 buttons; title direct, ~2 lines max; message only if it adds value; buttons 1-2 words, action verbs, avoid "OK" except informational; always "Cancel" for cancellation; destructive style only for destructive actions the user did not deliberately choose (e.g., not "Empty Trash" they just chose); never at launch; not for undoable common actions. NN/g Modal vs nonmodal - VERIFIED - modals only for critical error prevention, essential info to continue, wizard steps, effort-reducing info; never for newsletters; avoid in checkout/high-stakes research flows. NN/g Confirmation dialogs - VERIFIED - limit to serious actions (crying wolf), be specific not "Are you sure?", descriptive labels ("Delete file"/"Keep file"), no default Yes for dangerous actions, typed confirmation for rare catastrophic (Mailchimp "DELETE"), offer "don't ask again" only for educational confirms. Microsoft - Yes/No only after a question. Material Components Dialog - "purposefully interruptive... sparingly" - VERIFIED. Polaris warning example - inline warning "Changing store currency will affect reporting, pricing, and more" beats an "Are you sure" dialog - VERIFIED (raw).
- Agent rule: IF a decision must be made before continuing and cannot be deferred or undone THEN dialog with title naming action+object, 1-2 sentence consequence, buttons verb-labelled (Cancel left/trailing per platform, destructive in destructive style when not user-chosen), default focus on the safe choice. IF reversible THEN no dialog (F26).

### F26 Undo beats confirm
- Evidence: Raskin (A List Apart) - T3 - VERIFIED - warning dialogs fail through habituation; solution is undo; Gmail shows "moved to trash" + Undo and keeps item in Trash (two safety layers). NN/g Confirmation - T2 - provide undo "to great lengths". Gmail Undo Send 5/10/20/30 s - VERIFIED. HIG Undo/Redo - T1 - VERIFIED - do not redefine shake-to-undo; describe what will be undone ("Undo Typing"); show the result visibly; unlimited undo. WCAG 3.3.4 - reversible OR checked OR confirmed for legal/financial/data-deleting submissions - VERIFIED. Polaris toast - undo action only if reachable elsewhere.
- Agent rule: reversible -> perform immediately + snackbar "<Object> deleted" [Undo] (>=5-10 s; persists while a screen reader is focused); soft-delete with retention (Trash/Archive) as second layer; irreversible + costly -> confirm dialog naming object + consequence; catastrophic -> typed confirmation. Undo must also work if the snackbar is missed (alternate path).

### F27 Success feedback: when to show vs stay silent
- Evidence: HIG Feedback - VERIFIED - match feedback intensity to importance; users expect success by default, so confirm only significant actions (e.g., Apple Pay); integrate status into the interface near the item. Primer Notification messaging/Saving - success "sparingly"; no visual save indicator on auto-saved fields (mistaken for validation); inline message without redirect, banner with redirect. GOV.UK - green banner only to confirm an expected outcome when the journey isn't otherwise confirmed. Atlassian Success messages - VERIFIED - avoid "Success!" and "successfully"; 3-4 word sentence-case title; result, how to undo, next step; do not overdo enthusiasm; lighter on frequent actions. Polaris toast examples "Product updated" - noun + verb. NN/g Cart Feedback - persistent confirmation incl. product/options; badge + persistent confirmation + changed button state. WCAG 4.1.3 - success must be announced programmatically.
- Agent rule: silent when the UI itself shows the result in place (toggle flips, item appears) -- still update accessibility state; short confirmation (toast/inline) for background/non-visible results (saved, sent, copied); persistent confirmation page/banner for money, legal, or irreversible outcomes with details; NEVER a modal for success.

### F28 Inline status, badges, color-only signals
- Evidence: Carbon Status Indicators - VERIFIED - never color alone; pair with shape or icon plus text; three attention tiers (high/medium/low). NN/g Rubric - at least 3 indicators. WCAG 3.3.1 - error described in text. HIG Notifications - badge = unread count only, not for weather/scores/dates; do not mimic badges; not the sole channel. HIG Feedback - multiple channels (color, text, sound, haptics).
- Agent rule: every status = icon/shape + label + color; red/yellow reserved for real problems (NN/g hostile patterns: don't style routine info like "No attachments" as errors; Polaris: red for must-fix, yellow for warnings).

### F29 Notifications, priming, and promos frequency
- Evidence: HIG Notifications - VERIFIED - six rules (concise, no duplicates, no task instructions, errors in alerts not notifications, subtle in foreground, no sensitive data); title short title-case without period; body complete sentences in sentence case, do not truncate manually; hidden-preview text 1-2 words ("Friend request"); <=4 actions; do not add a button that merely opens the app; badges = unread count. Android Notifications - VERIFIED - collapsed text truncated to one line, use BigText/Messaging/Inbox styles for more; auto-group at 4+ notifications; Android 15+ cooldown (up to 2 min) dims repeated notifications; update existing notification instead of re-posting; importance levels (urgent/high/medium/low). NN/g Push - VERIFIED - don't ask at first launch, explain notification types, combine if more than five at once, in-app preference controls; Telefonica 2016: 56 notifications/day (second-hand). NN/g Popups - VERIFIED - acceptable only for legal compliance or critical warnings; avg 25 popups/week encountered; six bad-timing moments (before page load, immediately after login, before interaction, premature feedback requests, mid critical task, stacked popups). Google intrusive interstitials - T1 - VERIFIED - full-page and overlay promos that block content hurt search; exceptions legal/age gates/login; recommend small banners. HIG Ratings - VERIFIED - system limits prompt to 3 times per 365 days; wait >=1-2 weeks; after engagement, not at launch. Google Play in-app review - VERIFIED - quota is an implementation detail; do not build a button for it; no pre-questions like "Do you like the app?". HIG Offering Help/TipKit - VERIFIED - tips for features with <=3 actions, 1-2 sentences, limit frequency (e.g., once per 24 h), eligibility rules. APNs payload 4 KB (4096 bytes; 5 KB for VoIP) - VERIFIED (raw).
- Agent rule: no promo/interstitial before the user completes a first meaningful task; at most one in-app prompt per session; never over a task in progress; permission/rating prompts triggered by value moments; combine >5 simultaneous notifications; respect quiet failures: errors from the app -> in-app alert, not push.

### F30 Offline and connectivity UX
- Evidence: Android Offline-first - VERIFIED - local source of truth; reads show local immediately; writes: online-only (bank transfers), queued (analytics), lazy (to-dos; local first, sync later); WorkManager with network constraint + exponential backoff; conflict resolution by last-write-wins timestamps; UX: show connectivity status, queue actions, indicate sync status (syncing/synced/error), display cached data. M1 Errors (legacy) - VERIFIED - for offline use an unobtrusive persistent indicator rather than aggressive warnings. Primer Degraded experiences - global banner linking to status, hide counts, inactive buttons. MDN PWA offline - VERIFIED - cache-first for static, network-first for dynamic, fallback page, Background Sync, notify user of syncing; `navigator.onLine` is unreliable (implied; MEMORY for specifics). web.dev SWR - show stale + label it. HIG refresh title "Last updated" - VERIFIED.
- Agent rule: IF offline THEN show persistent, calm indicator ("Offline - showing saved items"), keep reads working from cache with "Updated <time>", queue writes with per-item status ("Waiting to sync" -> "Synced"/"Couldn't sync, Retry"), block only truly online-only actions with an explanation, auto-resume on reconnect, never wipe screens on connectivity loss.

### F31 Button labels and length budgets
- Evidence: HIG Writing - VERIFIED - verbs; "Send" over "Let's do it!"; "Learn more about UX Writing" over "Click here"; Continue/Next/Done for flows; "Get Started" to start. HIG Alerts - 1-2 word buttons, action verbs, avoid "OK" except informational. NN/g UX Writing FAQ - avoid vague "Learn More"/"Shop Now"; describe destination/benefit. Polaris - {verb}+{noun} except Save/Close/Cancel/OK; drop articles ("Add menu item"); predictable ("Create order", not "New order"; "Buy shipping label", not "Buy"). Atlassian - imperative 1-2 words in message CTAs. GOV.UK Button - sentence case; "Continue" vs "Save and continue" only if data actually saved; "Confirm and send"; "Pay". Mailchimp - always include verbs; sentence case. Microsoft - Yes/No only with a question; Cancel stops, Close closes.
- Length budgets (VERIFIED where cited): alert button 1-2 words (HIG); message CTA 1-2 words (Atlassian); toast action 1 verb (Polaris); toast <=2 lines (Material/Android 12/Carbon) or <=3 words (Polaris strict); error title 3-4 words, body 1-2 sentences (Atlassian); banner body 1-2 sentences (Polaris); tooltip 60-75 chars (HIG, macOS/visionOS); flag text over 5 lines scrolls (Atlassian); alert title ~2 lines (HIG); Carbon notifications 2 lines.

### F32 Capitalization convention differences
- HIG: either style; pick one per UI element type; title case = formal, sentence case = casual; alert title sentence-style if a full sentence, else title-case fragment; alert/action buttons title-style; notification title title-style no period, body sentence-style. Material/MCA: M3 uses sentence case (MEMORY; m3 not fetchable, MCA docs gave no explicit rule). Google dev style, Polaris, Atlassian, GOV.UK, Mailchimp, Microsoft: sentence case (all VERIFIED).
- Agent rule: cross-platform default sentence case everywhere (consensus of 6 design systems); on iOS-native-looking chrome (alert buttons, nav bar titles, tab labels) follow HIG convention (title case) when implementing with native components; never ALL CAPS (M1/M2 buttons used caps; MEMORY); do not mix per element type.

### F33 Localization and i18n mechanics
- Text expansion (IBM table via W3C, VERIFIED): up to 10 chars -> +200-300%; 11-20 -> 180-200%; 21-30 -> 160-180%; 31-50 -> 140-160%; 51-70 -> 151-170%; >70 -> ~130%. The popular "30-40%" figure only fits long sentences; button labels and short strings can triple. CJK may shrink in characters but need more height/width per glyph.
- Plurals: CLDR six categories (zero, one, two, few, many, other) - VERIFIED; Arabic and Welsh use all six; do not write "1 hour(s)"; Android `plurals` quantity strings - VERIFIED; don't use plurals for non-grammatical distinctions ("Inbox (12)"); quantity-neutral phrasing "Books: 1" avoids work; use positional placeholders `%1$s`; no concatenation. Mailchimp: repeat helper verbs/markers; avoid idioms; metric units spelled out; currency as 3-letter code (translation context). Microsoft global writing tips - VERIFIED - short simple sentences, include articles/"that"/"who", avoid idioms and modifier stacks.
- RTL (HIG, VERIFIED via summarizer): flip directional controls (sliders, progress bars), back/next, icons implying direction; do NOT reverse digit order within numbers, phone numbers, card numbers; do not flip logos, checkmarks, photos, real-world object icons; align 3+ line paragraphs to text language, not UI direction; numerals follow locale (Western vs Eastern Arabic); increase Arabic/Hebrew font ~2 pt when next to uppercase Latin (per HIG summary; verify before using).
- Numbers/dates/time: use `Intl.*`/platform formatters (Polaris says time is localized by `Intl.DateTimeFormat`); `Intl.RelativeTimeFormat` with `numeric:'auto'` gives "yesterday" (MDN baseline since Sep 2020). Polaris timestamp ladder (VERIFIED raw): <1 min "Just now"; 1-60 min "13 minutes ago"; today "10:30 am"; yesterday "Yesterday at 10:30 am"; last 7 days "Friday at 10:30 am"; 7 days-1 year "Aug 14 at 10:30 am"; >1 year "Aug 14, 2016". Manual date rules there are US-English only.
- Agent rule: externalize every string with full sentences and named/positional placeholders; ICU/CLDR plurals; never build sentences from fragments; design containers for >=200% expansion on short labels (wrap or flex, no fixed widths); mirror layout for RTL except digits/logos/check marks.

### F34 Voice and tone
- Evidence: Microsoft voice (VERIFIED) - warm and relaxed, crisp and clear, ready to lend a hand; constant voice, tone adapts to context and customer state of mind. Mailchimp (VERIFIED) - plainspoken, genuine, translators, dry humor; tone shifts with emotional state; "more important to be clear than entertaining". HIG Writing - determine voice via audience; consistent terminology list; serious for critical, light for achievements; read aloud. NN/g 3 Cs - clarity, concision, character (character lowest priority); reading level 6th-8th grade; users read only ~20-28% of page text. Atlassian - inform to build trust; encourage forward; satisfy by meeting expectations; success tone scales with frequency.
- Agent rule: one voice (plain, active, contractions OK), tone slider by state: errors = calm/neutral, success = brief/warm, destructive = serious/precise, first-use = encouraging. Humor never in errors/payments/health.

### F35 Loading microcopy and inclusive language
- Evidence: HIG Progress - avoid vague "loading"/"authenticating"; Polaris - spinner label states the action ("Loading", "Submitting", "Processing") in few words; Carbon - "Saving..." / "Saved"; NN/g - "Updating address 3 of 50"; HIG writing - settings descriptions describe the "on" state; Microsoft - avoid "please" (e.g., "Please wait"). Inclusive: HIG Inclusion - plain language, gender-neutral, "you/your", avoid idioms/humor; Polaris Inclusive language (raw) - avoid "disable/disabled" for features (use "turn off") except HTML element states; avoid metaphors/idioms/ableist terms; Atlassian similar.
- Agent rule: loader copy = verb-ing + object when more than a second ("Syncing your photos") and counts when known; for tiny loads use no text. Avoid time-promising copy ("This will only take a moment") unless true.

### F36 Permission rationale and notification copy specifics
- HIG purpose-string rules (F18) and NN/g template are the verified anchors. Notification copy rules (F29). Visible-character budgets per platform (iOS lock screen lines, Android collapsed/heads-up char counts) are NOT documented by Apple/Google in sources I reached: Apple says do not truncate manually; Android says one collapsed line. Treat any char budget as MEMORY/heuristic: front-load the key fact in the first ~40-50 characters; keep body under ~120-150 chars; use BigText/expanded for longer. (Flag: unverified numbers.)

---

## Before/after copy examples (rule illustrated)

| # | Scenario | Before | After | Rule / source |
|---|---|---|---|---|
| 1 | Generic server error | "Something went wrong." | "Couldn't load your orders. Check your connection and try again." [Try again] | Specific object + cause + action (Microsoft per-cause, Polaris, Atlassian) |
| 2 | 5xx, tone | "Oops! Something went wrong :(" | "Couldn't save your changes. Try again in a moment." [Try again] | No "oops", no emoji (HIG, GOV.UK) |
| 3 | Empty required field | "This field is required" | "Enter your email address" | GOV.UK instruction formula |
| 4 | Wrong format | "Invalid email" | "Enter an email address in the correct format, like name@example.com" | Avoid "invalid"; tell the fix (GOV.UK, NN/g) |
| 5 | Password rule | "That password is too short" | "Choose a password with at least 8 characters" | Instructional, not blame (HIG) |
| 6 | Card number | "Your card number is invalid" | "Your card number is incomplete" / "Enter all 16 digits" | Adaptive messages (Baymard) |
| 7 | Payment declined | "Payment failed." | "Your bank declined this card. Try another card or contact your bank. Your cart is saved." | Cause (if safe) + recovery + preserved state (Baymard) - security trade-off flagged |
| 8 | Destructive confirm | "Are you sure? [Yes] [No]" | Title "Delete 'Q3 budget'?" Body "This permanently deletes the file for everyone it's shared with. You can't undo this." [Cancel] [Delete file] | Name object + consequence; action-verb labels (NN/g, HIG) |
| 9 | Reversible delete | Confirm dialog | Perform now; snackbar "Conversation archived" [Undo] | Undo over confirm (Raskin, NN/g) |
| 10 | Empty first use | "No items" | "Add your first expense" / "Track spending to see where your money goes." [Add expense] | Positive title, what/why/next, one CTA (Carbon, Polaris) |
| 11 | No search results | "No results found" | "No results for 'blue sneekers'" / "Check the spelling or try fewer words." [Edit search] [Browse sneakers] | Echo query + alternatives (Baymard) |
| 12 | Filtered to zero | "No data" | "No orders match these filters" [Clear filters] | Explain why + recovery (Carbon user-action state) |
| 13 | Cleared inbox | "No messages" | "You're all caught up" | Completion state, restrained (Atlassian) |
| 14 | Permission rationale | "We need your location" | "Use your location to show pharmacies near you." (purpose string: "Your location is used to show pharmacies within walking distance.") | Benefit not feature; active voice (HIG, NN/g) |
| 15 | Permission denied | "Permission denied" | "Camera access is off. Turn it on in Settings to scan receipts." [Open Settings] [Not now] | Specific + user-initiated deep link (NN/g, Android) |
| 16 | Button labels | "OK" / "Submit" | "Send invoice" / "Save changes" | Verb + noun (HIG, Polaris) |
| 17 | Loading text | "Loading..." | "Syncing 3 of 12 photos" | Specific + count (NN/g, HIG) |
| 18 | Button in flight | "Submit" (frozen) | "Saving..." (same width, taps ignored) then "Saved" | Immediate in-place feedback (Carbon) |
| 19 | Offline | "Network error" | Banner: "You're offline. Changes will sync when you reconnect." | Calm persistent + queued writes (M1, Android offline-first) |
| 20 | Session expiry | "Error 401" | "You've been signed out. Sign in to continue; your draft is saved." | Preserve work (WCAG 2.2.1/3.3.7) |
| 21 | Rate limit | "429 Too Many Requests" | "Too many attempts. Try again in 2 minutes." | Honor Retry-After, plain language (MDN, GOV.UK) |
| 22 | Conflict | "409 Conflict" | "This changed on another device. [Review changes] [Keep mine]" | Choice, no jargon (synthesis) |
| 23 | Partial batch | "Some items failed" | "12 of 15 photos uploaded. 3 couldn't upload." [Retry 3] | Counts + targeted retry (Polaris list pattern, synthesis) |
| 24 | Success toast | "Your profile has been successfully updated!" | "Profile updated" | Noun + verb; no "successfully" (Polaris, Atlassian) |
| 25 | Not found | "404 Not Found" | "This page isn't available. Check the address or go back." | No codes/jargon (GOV.UK, Polaris) |
| 26 | Save dialog | "Save changes? [Yes] [No]" | "Save changes to 'Draft'?" [Don't save] [Cancel] [Save] | Max 3 buttons, verb labels (HIG, Microsoft) |
| 27 | Notification | "You have a new notification!" | "Sam commented on 'Q3 plan'" (hidden preview: "New comment") | Specific, glanceable (HIG) |
| 28 | Plurals | "1 item(s) selected" | "1 item selected" / "3 items selected" via plural rules | CLDR/Android quantity strings |
| 29 | Relative time | "Updated 1 mins ago" | "Updated 1 minute ago" / "Just now" via Intl.RelativeTimeFormat | Formatter + ladder (MDN, Polaris) |
| 30 | Validation toast misuse | Toast: "Enter a valid phone number" | Inline under field: "Enter a phone number with 10 digits" | Errors adjacent to field (NN/g) |

## Numbers table (value | applies to | source | tag)

| Value | Applies to | Source | Tag |
|---|---|---|---|
| 0.1 s / 1 s / 10 s | Response-time perception limits | NN/g | VERIFIED |
| <1 s: no loader; 1-3 s indeterminate; 3-10 s determinate; >10 s determinate + background | Loader selection | Primer | VERIFIED |
| 2-10 s spinner or skeleton; >10 s progress bar | Loader selection | NN/g skeleton | VERIFIED |
| <5 s loading indicator; progress indicator otherwise | M3 Expressive | MCA docs | VERIFIED |
| 200 ms instant / 200 ms-5 s loading / >5 s progress | M3 | m3 snippet | SNIPPET |
| 500 ms delay, 500 ms min show | Android ContentLoadingProgressBar | AndroidX source | VERIFIED |
| showDelay / minHideDelay default 0 ms | MCA ProgressIndicator | MCA docs | VERIFIED |
| 300 ms reveal throttle | React Suspense | react.dev | VERIFIED |
| 200-300 ms delay, ~400-500 ms min | Anti-flash heuristics | blogs | SNIPPET (T4) |
| 1.5 s done state | Carbon inline loading | Carbon | VERIFIED |
| 100 ms feedback; 200-300 ms modals; 100-500 ms range; avoid 500 ms+ | UI animation duration | NN/g | VERIFIED |
| Skeleton 2.82 s vs spinner 2.41 s vs blank 2.29 s perceived (n=136) | Viget test | Viget | VERIFIED |
| Toast 2000/3500 ms | AOSP Toast | AOSP source | VERIFIED |
| Snackbar 1500/2750 ms | MCA Views | MCA source | VERIFIED |
| Snackbar 4000/10000 ms, indefinite | Compose M3 | AndroidX source | VERIFIED |
| 4-10 s; 2 lines; 48-64 dp | M3 snackbar | m3 snippet | SNIPPET |
| 5000 ms default; >=10000 ms with action; <=3 words | Polaris toast | Polaris raw | VERIFIED |
| 5 s auto-dismiss optional; 2 lines | Carbon toast | Carbon | VERIFIED |
| 5/10/20/30 s | Gmail Undo Send | Google support | VERIFIED |
| warn >=20 s before expiry; extend >=10 times; 20 h exception; adjust >=10x | WCAG 2.2.1 | W3C | VERIFIED |
| 5 s then pause/stop/hide (loading preloader exempt when sole content) | WCAG 2.2.2 | W3C | VERIFIED |
| >20 h data preservation or warn | WCAG 2.2.6 (AAA) | W3C | VERIFIED |
| Max 3 buttons; title ~2 lines; 1-2 word buttons | HIG Alerts | Apple | VERIFIED |
| 60-75 chars | HIG tooltips (Mac/visionOS) | Apple | VERIFIED |
| <=4 actions per notification | HIG | Apple | VERIFIED |
| 3 prompts/365 days; >=1-2 weeks | Ratings prompts | Apple | VERIFIED |
| Auto-group at 4+; cooldown <=2 min | Android 7+/15+ | Android docs | VERIFIED |
| Combine if >5 at once; 56 notifications/day (2016) | Push | NN/g | VERIFIED |
| 4 KB (4096 B); 5 KB VoIP | APNs payload | Apple docs | VERIFIED |
| <=8 h; visible up to 4 h after end; dismissal 15-30 min | Live Activities | HIG | VERIFIED |
| 25 popups/week encountered | NN/g popups | NN/g | VERIFIED |
| +12% grants with purpose string; +81% best vs worst rationale | Tan et al. 2014 via NN/g | NN/g | VERIFIED (second-hand) |
| ~50% no-results fail; 98% generic messages; 31% no inline validation; 30% card-declined recoverable; 34% don't retain card data | Ecommerce | Baymard | VERIFIED (e-commerce) |
| Text expansion 200-300% (<=10 chars) down to ~130% (>70 chars) | Translation | W3C/IBM | VERIFIED |
| 3-4 words title, 1-2 sentences body, 1-2 word CTA | Atlassian messages | Atlassian | VERIFIED |
| 1-2 sentences | Polaris banner body | Polaris raw | VERIFIED |
| 6-8th grade reading level (rubric 7-8) | Copy | NN/g | VERIFIED |
| 3:1 contrast; track <=4 dp focus ring caveat | MCA indicators | MCA docs | VERIFIED |
| Atlassian empty state 464 px / 304 px; Polaris 40 px spacing | Empty state layout | Atlassian/Polaris | VERIFIED |

## Comparison tables

| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Nothing (no loader) | No flash | Silent if slower than expected | <1 s work | Unknown/variable duration without delayed fallback |
| Delayed spinner | Avoids flicker | Magic numbers | Variable 0-5 s requests | User needs instant press feedback |
| Skeleton | Shows layout, reduces CLS | Mixed evidence; can stall; motion issues | Full-page/list first load 1-10 s | Actions, <1 s, unpredictable layouts |
| Spinner | Simple, cheap | No duration info | Single module/button | Whole-page long loads |
| Determinate bar | Informative; users wait longer | Needs real measurement | >3-10 s, uploads, imports | Unknown progress (fake bars) |
| Optimistic UI | Feels instant | Rollback confusion | Low-risk reversible toggles | Money/irreversible |
| Stale-while-revalidate | Instant paint | Stale data confusion | Feeds, dashboards | Safety/financial figures |
| Toast/snackbar | Non-blocking | Timed, missable, a11y issues | Brief non-critical confirmation/undo | Errors needing action, critical info |
| Banner | Persistent, calm | Takes space, banner blindness | Screen/system-level state | Per-field errors |
| Inline message | Right place, persistent | Layout shift | Validation, section errors | Global events |
| Dialog/alert | Guaranteed attention | Interruptive, habituation | Irreversible must-decide | Success, routine undoable actions |
| Undo | Fast, forgiving | Needs reversible backend | Delete/archive/send | Irreversible by nature |
| Confirm dialog | Prevents catastrophic | Habituation | Rare, severe, irreversible | Routine actions |

## Anti-patterns found (problem -> why it happens -> better alternative -> source)

- Infinite skeleton/spinner -> no timeout/error path -> time out to error-empty with Retry; announce stuck state -> Carbon a11y, Azure retry.
- Spinner-only for long waits -> no duration info -> determinate bar + cancel + background -> NN/g.
- Flashing 80 ms loader -> no delay/min-show -> delay + min display -> AndroidX, Primer.
- Frame-only skeleton -> looks like blank screen -> content wireframe -> NN/g.
- "Oops!"/emoji/jokes in errors -> brand-voice habit -> neutral specific text -> HIG, GOV.UK, NN/g.
- Blame ("You entered an invalid...") / "Invalid" -> developer vocabulary -> instruction ("Enter...") -> NN/g, Polaris.
- Error by color only -> style shortcut -> icon + text + color -> NN/g, Carbon, WCAG 3.3.1.
- Toast for errors requiring action -> ease of implementation -> inline/banner with Retry -> Polaris, Atlassian.
- Toast containing info users need to verify -> auto-dismiss -> persistent confirmation -> NN/g cart-feedback.
- Modal for success -> over-celebration -> inline/toast/silent -> HIG, Primer.
- Hidden loading on buttons (no in-flight state) -> double submits -> in-button state + idempotency -> Carbon, GOV.UK.
- Empty screen with no CTA -> missing state design -> what/why/next + one action -> NN/g, Carbon.
- "Are you sure?" Yes/No dialogs -> generic copy -> named object + verb buttons or undo -> NN/g, Raskin.
- Permission prompt at launch -> maximize ask early -> contextual ask after value -> HIG, Android, NN/g.
- Nagging users to change denied permission -> growth pressure -> degrade gracefully -> Android docs.
- Premature validation while typing -> instant feedback habit -> validate on blur/submit -> NN/g, Baymard, GOV.UK.
- Clearing form after error -> framework default -> preserve all input -> GOV.UK, Baymard.
- Unbounded retry loops -> naive resilience -> bounded backoff, fail fast interactively -> Azure.
- Concatenated strings/"item(s)" -> English-only thinking -> ICU plurals/placeholders -> CLDR, Android.
- Interstitial promos on entry -> acquisition goals -> small banners after value -> Google, NN/g popups.

## Disagreements & weak-evidence zones

1. Skeleton vs spinner: Mejtoft (null), Viget (skeleton worse), NN/g (reasoned benefit). No evidence for shimmer vs pulse. Treat as layout-placeholder tool, not perception hack.
2. Loader thresholds differ (Primer 3 s, Material 5 s, NN/g 10 s); anti-flash delays (200-500 ms) are heuristic.
3. Validation timing: HIG (as-you-type) vs NN/g/Baymard (on blur) vs GOV.UK (on submit).
4. Disabled buttons: M1 (disable if invalid), Carbon (disable while loading) vs GOV.UK/Primer (avoid disabled).
5. Toasts: Material/Polaris/Carbon accept them with caveats; Primer recommends not using them; WCAG 2.2.1 exemption applies only when info is available elsewhere.
6. Settings deep links: NN/g (provide exact link) vs Android (don't link to pressure).
7. Apology/"we": HIG avoid "we"; Atlassian uses "we" to avoid blame and bans "sorry/please"; Microsoft permits "sorry" for serious product faults.
8. Empty-state CTA: M1 (not CTA-worded, non-interactive) vs Carbon/Polaris/Atlassian/NN/g (explicit CTA).
9. `aria-busy`: MDN advises against combining; Primer recommends it on live regions.
10. Reduced motion: web.dev says keep-but-modify skeleton/feedback animation; Primer says do not disable loading animation; WCAG 2.2.2 exempts sole-content preloaders.
11. Second-hand stats: NN/g progress-bar "3x longer" and Tan et al. percentages are cited via NN/g; underlying papers not read. Baymard stats are e-commerce, benchmark years not confirmed.
12. Optimistic UI safety criteria and batch/conflict error UX are synthesis (no T1 source found).

## Gaps (what I could not verify; stopped per coordinator instruction)

- m3.material.io pages (snackbar, banner, empty states, progress, dialogs, writing/communication) were unreachable: only snippets and MCA/AndroidX source; Material writing and capitalization rules are MEMORY.
- Notification visible-character limits per platform (iOS/Android lock screen/heads-up) and FCM size limit: not verified (FCM page 404, no search budget).
- Harrison 2007 / Myers 1985 progress-bar studies, Nebraska-Lincoln study: not read directly.
- BlurHash/LQIP specifics, image placeholder evidence: README 404.
- AWS Builders Library backoff/jitter, Stripe decline-code guidance, Flutter SnackBar (default duration, accessibleNavigation behavior) fetches failed; RN/Flutter/Compose skeleton/shimmer libraries not checked.
- Snackbar position relative to on-screen keyboard (Android/iOS), Compose Scaffold behavior: not verified.
- Conflict-resolution UX (CRDT/merge), batch partial failure UX, payment-failure copy beyond Baymard: no authoritative source reached.
- Android `ACTION_APPLICATION_DETAILS_SETTINGS`, iOS `UNAuthorizationOptions.provisional` naming, web notification permission rules: MEMORY or partial.
- Atlassian empty-state copy page and Carbon empty-state numbers (character limits) not found; Fluent 2/Spectrum/Lightning guidance not consulted.
- iOS 26 / Liquid Glass changes to alerts/progress indicators: not checked (HIG pages fetched had no version info).
- WCAG 3 draft status for loading/busy notifications: only the WAI wiki proposal was read.
