# Loading, empty, error, offline and feedback states

Read this when: any screen loads data, can be empty, can fail, runs a long operation, needs a toast/snackbar/banner/dialog, handles offline, or asks for a permission. Every data view needs all of: loading, content, empty, error, offline (and often permission-denied). Copy rules and rewrites are in ux-writing.md.

Tags: `[S]` WCAG · `[P-iOS]` `[P-AND]` `[P-WEB]` platform · `[R]` research · `[C]` consensus · `[H]` heuristic · `[L]` policy. Research date 2026-10-06. m3.material.io was unreachable: Material figures come from Material Components/Compose source code.

Contents: 1 Loading ladder · 2 Delay/min-display · 3 Skeletons · 4 Progress honesty · 5 Progressive rendering, stale, optimistic · 6 Button loading + duplicate submits · 7 Long operations · 8 Pull-to-refresh · 9 Every loader must terminate · 10 Announce status · 11 Empty states · 12 Errors · 13 Retry · 14 Surfaces: toast/snackbar/banner/dialog · 15 Undo vs confirm · 16 Success feedback · 17 Notifications and prompts · 18 Offline · 19 Anti-patterns · 20 Evidence limits

---

## 1. Loading ladder

| Expected wait | Show | Source |
|---|---|---|
| < ~1 s | No loader. Keep the tapped control's pressed/disabled state (feedback within 0.1 s) | NN/g 0.1/1/10 s; Primer: under 1 s do not show a loading state |
| 1-3 s | Indeterminate spinner in place, or skeleton for full-screen | Primer; NN/g 2-10 s spinner |
| 3-10 s | Skeleton for full-page/list first load (layout known); spinner for a single module; determinate bar if measurable | NN/g Skeleton 101; Primer |
| > 10 s | Determinate bar + text ("3 of 12") + Cancel + allow background, notify on completion | NN/g; HIG |
Thresholds differ by system (Primer 3 s vs Material Expressive 5 s vs NN/g 10 s for "switch to determinate"). Use the earliest when the duration is actually known; when unknowable a spinner can run longer only with explanatory text, a background option and Cancel. `[R][P-iOS][P-AND]` Material's Expressive loading indicator is for waits under ~5 s (use ProgressIndicator when it can become determinate).

## 2. Do not flash loaders

A loader visible for 100 ms is worse than none. Delay showing it, and once shown keep it for a minimum time. AndroidX `ContentLoadingProgressBar`: `MIN_DELAY_MS = 500`, `MIN_SHOW_TIME_MS = 500`; React reveals suspended boundaries at most once per 300 ms; blogs say 200-300 ms delay and ~400 ms min show (no peer-reviewed optimum). Rule `[H]`: for requests that usually return < ~1 s, delay the loader 200-300 ms (500 acceptable) and hold ~400-500 ms once visible. NEVER delay the immediate pressed/disabled state on the control that was tapped (NN/g: unacknowledged clicks are assumed not registered). Material `showDelay`/`minHideDelay` default to 0, so set them.

## 3. Skeleton screens: a layout placeholder, not a proven perception trick

- Use for full-page or container first loads of 1-10 s where the final layout is predictable; block sizes match the final layout exactly so swapping causes no reflow. NEVER frame-only skeletons (equivalent to a spinner; "not recommended"). NEVER skeleton buttons, inputs, modals, toasts (Carbon). Actions (save, upload, convert) get progress or in-button state, not skeletons. Polaris: spinners only for content that cannot be shown as a skeleton (e.g., charts). `[R][C]`
- Evidence is mixed and weak: NN/g reasons skeletons reduce perceived time but cites no effect size; Mejtoft 2018 (peer-reviewed) found skeleton pages rated higher on perceived speed/ease but spinner users found the article faster, no significant differences; Viget (n=136, simulated GIFs) found skeleton perceived waits longer (2.82 s vs spinner 2.41 s vs blank 2.29 s). "Skeleton is always better than a spinner" is folk wisdom. Say "conditional". `[R-weak]`
- Shimmer: NN/g warns it can distract/annoy/create accessibility problems. Under `prefers-reduced-motion: reduce` replace the sweep with a slow low-contrast opacity pulse or a static placeholder (web.dev lists skeletons as "keep but modify"; Primer says don't disable loading animation entirely but keep it subtle). No controlled evidence for shimmer vs static `[H]`. SwiftUI `.redacted(reason: .placeholder)` keeps size/shape.

## 4. Determinate vs indeterminate, and honesty

Prefer determinate when measurable (bytes, items, steps). HIG: keep the pace even (90% in 5 s then 10% in 5 min looks frozen/deceptive), keep indicators animated (stationary reads as stalled), never swap spinner for bar mid-task, avoid vague "Loading"/"Authenticating", offer Cancel (Pause + Cancel with confirm if cancel loses data). Material: only one indicator type should represent a given activity; for sequential processes show overall progress. Never sit at 100% while work continues: show "Finishing…" indeterminate. Harrison et al. 2007 (lab; ~22 participants per a search snippet, paper not read): bars that sped up toward the end were judged faster. `[R-weak]` NN/g (second-hand): people with a progress bar were willing to wait ~3× longer. Never fake progress. `[P-iOS][R-weak]`

## 5. Progressive rendering, stale-while-revalidate, optimistic UI

- Show something useful immediately: cached/local data, incrementally loaded items, placeholders replaced as content arrives; consolidate adjacent loaders into one (Primer). React: keep already-visible UI with transitions/`useDeferredValue` rather than hiding it behind a fallback; dim stale results. SWR: browsers give no staleness signal, so show "Updated 2 min ago" and a subtle refreshing indicator. Android offline-first: read local immediately, write local first. `[P-iOS][P-AND][P-WEB]`
- Optimistic UI only for cheap, reversible actions with ~99%+ success (toggle, like, reorder, archive): apply instantly, roll back on failure with a message + Retry. Payments, sends, permanent deletes, server-decided validation: show a pending state until confirmed (Android guide: online-only writes for bank transfers). These safety criteria are our synthesis; React `useOptimistic` auto-reverts if the action throws `[H]`.
- Images: lazy-load below the fold with a reserved aspect-ratio box and a cheap placeholder (dominant color/blurhash; blurhash facts unverified); never lazy-load the hero/LCP (web.dev: sites lazy-loading indiscriminately had median LCP 3,546 ms vs 2,922 ms); on error show a neutral tile with Retry, not a collapsed hole.

## 6. Button loading states and duplicate submits

On a tap that starts work, within 100 ms: spinner + verb-ing label ("Saving…"), fixed min-width so the button doesn't resize `[H]`, ignore repeat taps, keep it focusable; on success briefly show done (~1.5 s, Carbon "Saved") or navigate; on failure restore the button and show an inline error with preserved input. Sources conflict (Carbon disables while loading; Primer/GOV.UK discourage disabled buttons): do not use the disabled state for validation gating; during flight keep the control focusable, ignore input, rely on server idempotency keys. Never show loading on several items at once except initial page load. `[C]`

## 7. Long operations

> 10 s or needs the app closed: run as background work (WorkManager / BGTaskScheduler / service-worker Background Sync), show persistent non-blocking progress, notify on completion/failure with a deep link and a summary (start, end, results, errors). Live status (ride, delivery): iOS Live Activities (tasks with a start/end, typically ≤ 8 h; update only on change; end promptly; don't duplicate with push; not for ads or sensitive data) / Android 16 progress-centric notifications (`Notification.ProgressStyle`). Status trackers use plain language, not backend codes, with low-granularity updates in quiet periods ("Joined the processing queue"). `[P-iOS][P-AND][R]`

## 8. Pull-to-refresh and refresh feedback

Support the gesture AND a visible alternative (toolbar/menu action or retry) mapped to the same function (Android doc). Do automatic periodic updates, don't rely on manual refresh alone (HIG). Optional title should convey value ("Last updated 2 minutes ago"), not an instruction. End the spinner on success AND failure; on failure keep prior data and show a retry affordance, not an empty screen. Compose `PullToRefreshBox`.

## 9. Every loader must terminate: success, error, or timeout

"Skeleton forever" is a bug. Azure retry guidance: interactive apps fail fast after a few retries and tell the user. Heuristic timeouts `[H]`: 10-15 s on interactive reads; at ~5-8 s upgrade the copy ("Still loading your orders…"); at timeout swap the loader for an error-empty state with Retry and preserved navigation. Retry re-enters loading (not a full page reload). Carbon: tell screen-reader users if the app is loading, busy, stuck, or failed.

## 10. Announce loading and status

WCAG 4.1.3 (AA): success results, progress, "busy" and errors must be programmatically determinable without taking focus. Loader > ~1 s: a persistent `role=status` region says what is loading ("Loading orders"), then updates the same region ("12 orders loaded"); errors use `role=alert`; the live region must exist before content changes; announce milestones (25/50/75/100), not every tick `[H]`; `aria-busy` is optional (MDN prefers live regions; Primer toggles `aria-busy`; support inconsistent). Native: `contentDescription`/accessibility labels on indicators, `AccessibilityNotification.Announcement`, `liveRegion`. Material: contained indicators need 3:1; linear tracks ≤ 4dp may not render a TalkBack focus ring. Polaris spinner labels: "Loading", "Submitting", "Processing". `[S][P-AND][P-iOS]`

## 11. Empty states

Every region that can be empty has a designed variant. Communicate (NN/g) status (why empty), a learning cue (what belongs here), and a direct pathway. Anatomy: optional decorative illustration (empty alt; omit in tight spaces; never playful on error variants; don't reuse the same art), title (positive: "Start by adding…", never "You don't have…"), 1-2 sentence body (next step, why empty, benefit), ≤ 1 primary action as verb+noun, optional doc link. No dead ends. Never render a blank container. Sources: NN/g, Carbon, Polaris, Atlassian, Primer, HIG Writing. M1 (legacy) said don't word the tagline as a CTA; modern systems all include an explicit button: follow the modern consensus; keep the illustration non-interactive. `[R][C]`

| Type | Title | Body | Action |
|---|---|---|---|
| First use / zero data | Benefit ("Track your first expense") | what belongs here + why useful | Primary: create |
| No search results | Echo the query ("No results for 'x'") | spelling / broaden / alternatives | Edit search / browse |
| Filtered to zero | "No <items> match these filters" | show active filters | "Clear filters" |
| Cleared / done | Short, restrained ("You're all caught up") | optional next best action | none or secondary |
| Error-empty (load failed) | What failed ("Couldn't load orders") | cause if known | Retry |
| Offline-empty | "You're offline" | what's available offline | Retry / view saved |
| Permission-needed | What capability is off | benefit + degrade note | "Open Settings" / "Allow" |
| Deleted/archived | "Trash is empty" | retention rule | none |

Search no-results (Baymard, e-commerce): ~50% of sites lack effective recovery; strategies: related categories from query words, alternative/simplified searches (preview or auto-apply with explanation), recommendations, support contact, popular items; "search tips alone" is ineffective. If filters caused zero: "Clear filters" as primary and list the active chips. Keep the search field focused.

## 12. Errors

**Anatomy:** what happened (specific, in the user's objects/numbers) + why (only if known and useful) + the exact next step + an action button + what is preserved. Short, plain, non-blaming, near the problem, ≥ 3 indicators (text, icon, color/position; never color alone). Blame the system's state, not the user ("Couldn't save", not "You entered…"). Never "Invalid X", "Error", "Failed", "Oops", "Please", "Sorry" except for serious product-caused failures. NN/g rubric: place at the source; modals only for serious; avoid premature display; plain language ~7th-8th grade; front-load; preserve input; reduce correction effort; escalate help if the same error repeats 3+ times. Baymard: 98% of sites use generic validation messages ("Your card number is incomplete" beats "invalid"; some users took up to 5 min to recover). Formula `[H]`: [specific problem, user's object] + [cause if known] + [exact next step] + [action]. Title ≤ 3-4 words, body ≤ 2 sentences (Atlassian). `[R]`

"Something went wrong" is the last resort, but you almost always have more: online/offline, timeout vs refused, HTTP class (401/403/404/409/422/429/5xx), which object/action, whether data was saved/queued, retry availability, a support ID. Map status → template (offline, timeout, 401, 403, 404, 409, 422 field errors, 429, 5xx); the generic message is the single fallback template and must still include an action. Show a support/error ID only where users can pass it to support, in secondary text with Copy.

**Surface by situation (least interruptive that still guarantees the user can't miss what they must act on):** inline > in-place region > banner > snackbar (non-critical only) > dialog (must-decide) > full page (primary experience lost).

| Situation | Primary surface | Retry | Preserve |
|---|---|---|---|
| Field validation | inline under the field (+ summary on web) | n/a | all input |
| Content region failed | in-place error-empty state in that region | Retry button | rest of screen |
| Offline, reading cached | subtle persistent indicator/banner | auto on reconnect | cached data |
| Offline, write | queue + per-item "Waiting to sync" | auto | queued item |
| Write failed (non-critical) | snackbar with Retry or inline item state | manual | draft |
| Server 5xx / timeout | in-place or full-page "Couldn't load…" | manual + limited auto | input |
| Rate limit 429 | inline/banner with wait time (Retry-After) | after wait | input |
| Permission denied | inline at point of need | "Open Settings" (user-initiated) | n/a |
| Auth/session expiry | sign-in sheet; keep route and draft | after sign-in | draft |
| Not found/deleted | in-place "isn't available" | Go back/Search | n/a |
| Conflict/stale data | dialog or inline compare | choose version | both versions (synthesis) |
| Payment failure | inline on the payment step | change method/retry | cart, non-sensitive fields |
| Destructive action failed | banner/inline at the object | Retry | object state |
| Partial batch failure | summary with counts + failed list | "Retry N" | successes |

Payment (Baymard): 30% of "card declined" abandonments are recoverable with better handling; 34% of sites fail to retain card fields after validation errors; show the specific cause when safe, offer another method, keep the cart (revealing raw decline codes is a security trade-off). Session expiry: warn ≥ 20 s before when you control the timer (WCAG 2.2.1), offer "Stay signed in", preserve drafts across re-auth. Conflict on user-authored content: surface the conflict (last-write-wins silently loses edits: opinion).

Tone positions (all verified in design-system docs): "Sorry": Microsoft only for serious product-caused problems; Atlassian avoids "please"/"sorry"; Polaris: don't over-apologize; GOV.UK avoids it in field messages. "We": HIG avoids; Polaris avoids unless the company caused it. "Please": Microsoft and Atlassian avoid (makes required actions sound optional). Humor/"Oops": HIG, GOV.UK, NN/g avoid. Default: neutral, specific, active voice, no exclamation marks or emoji; apologize once, in the headline, only for serious product-caused failures.

## 13. Retry

- Idempotent GET failing on network/5xx: auto-retry 1-2 times silently with exponential backoff + jitter, then show a manual Retry. Non-idempotent POST: do not auto-retry unless an idempotency key is used; show "Not sent" with Retry. 429: honor `Retry-After` (seconds or HTTP-date) and show the wait. Never retry indefinitely in the foreground; escalate to background sync with a sync status. Retry at one layer only; circuit-break long-lasting faults (Azure retry pattern); log early failures as info. `[R][C]`
- On any failure keep the draft in memory and persist it if the app could be killed; on retry success clear the error immediately, announce via status role, restore focus to a logical place (not page top); don't leave stale banners after the condition resolves (Atlassian: banners disappear when no longer required).
- GOV.UK service-problem pages: say "Try again later", no "500", say what happened to entered answers, give a contact route.

## 14. Transient and persistent surfaces

**Snackbar/toast** (non-critical, result of a user action, information available elsewhere, one at a time, optional single action): ≤ 2 lines (Material/Android 12 toast/Carbon) or ≤ 3 words in Polaris style ("Product updated": noun + verb; no "successfully"); duration without an action 4-6 s `[H]`, with an action ≥ 10 s and persistent when it is the only path to Undo or carries an error (Polaris 10 s; Material has Indefinite); swipe/close to dismiss; queue or replace; sit above the bottom nav/FAB (`setAnchorView`); announce via status role / accessibility announcement; honor the system accessibility timeout. Numbers: Compose M3 Short 4000 ms / Long 10000 ms / Indefinite (adjusted via `AccessibilityManager` recommended timeout); Material Components Views SHORT 1500 / LONG 2750 ms; AOSP Toast 2000/3500 ms; Polaris default 5000 ms, with action ≥ 10,000; Carbon 5 s (with action persists); Gmail Undo Send 5/10/20/30 s. Errors needing a decision are NOT toasts. iOS has no system snackbar: a custom toast must post an accessibility announcement. WCAG 2.2.1 allows disappearing messages when the same information is available elsewhere; Primer says toasts "pose significant accessibility concerns"; NN/g cart feedback: a disappearing overlay failed when users needed to verify what was added. `[P-AND][S][R]`
**Banner** (persistent, non-modal, screen/system-level: offline, sync paused, payment past due): one at a time, directly under the header, ≤ 1 primary action (verb phrase), auto-remove when the condition resolves, dismissible only if non-critical, never auto-dismiss critical; critical/warning `role=alert`, others `role=status`; don't move focus on load. There is no M3 Android Banner (component docs say "yet to be completed"). GOV.UK notification banner: max one per page, never auto-dismiss, don't combine with an error summary.
**Dialog/alert** (blocking): only when a decision must be made before continuing and cannot be deferred or undone; title names action + object, 1-2 sentence consequence, verb-labeled buttons, default focus on the safe choice, destructive style only when the user didn't deliberately choose it, ≤ 3 buttons, never at launch (HIG; NN/g modal vs nonmodal: modals for critical error prevention, essential info, wizard steps; never for newsletters; avoid in checkout). Polaris: an inline warning ("Changing store currency will affect reporting…") beats an "Are you sure" dialog.

## 15. Undo beats confirm

Raskin (A List Apart 2007): warning dialogs fail through habituation; the fix is undo (Gmail shows "moved to trash" + Undo and keeps the item in Trash: two safety layers). Reversible → perform immediately + snackbar "<Object> deleted" [Undo] (≥ 10 s; persist while a screen reader or the user is focused on it; same Undo reachable in context) + soft-delete retention (Trash/Archive). Irreversible + costly → confirm dialog naming the object + consequence. Catastrophic → typed confirmation (Mailchimp "DELETE"). Undo must also work if the snackbar is missed (alternate path). HIG undo/redo: don't redefine shake-to-undo; describe what will be undone. WCAG 3.3.4: reversible, checked or confirmed for legal/financial/data-deleting submissions. `[R][P-iOS][S]`

## 16. Success feedback: show vs stay silent

HIG Feedback: match intensity to importance; users expect success, so confirm only significant actions. Silent when the UI shows the result in place (toggle flips, item appears), but still update accessibility state; short confirmation (toast/inline) for background/non-visible results (saved, sent, copied); persistent confirmation page/banner for money, legal, irreversible outcomes with details; NEVER a modal for success. Don't show a visual save indicator on auto-saved fields (mistaken for validation: Primer). Atlassian: avoid "Success!"/"successfully"; 3-4 word sentence-case title; result, how to undo, next step; lighter on frequent actions. Cart: badge + persistent confirmation + changed button state (NN/g). Inline status always icon/shape + label + color (Carbon three attention tiers); red/yellow reserved for real problems. `[P-iOS][R]`

## 17. Notifications, prompts, promos, ratings

- Ask for notification permission only at a trigger moment (after the user sees value; Android 13: e.g., after following an account/placing an order/after 3-4 launches; iOS provisional authorization delivers quietly with Keep/Turn Off). iOS prompts once; Android second denial is permanent. NN/g: don't ask on first launch; explain what you'll send; combine if more than five arrive at once. Permission rationale: benefit not feature; template "[App] would like to access your [resource] so that you can [benefit]" (Tan 2014 via NN/g: a purpose string gave 12% more grants; best vs worst rationale an 81% lift). On denial explain what's unavailable and give a user-initiated "Open Settings" at the moment of need: NN/g says link the exact settings place; Android says don't link to Settings to pressure: show it only when the user tries the blocked feature, never as a repeated nag. `[P-iOS][P-AND][R]`
- Notification content (HIG): concise, no duplicates, no task instructions, errors in in-app alerts not notifications, no sensitive data; title short, no period; badge = unread count only; don't add a button that merely opens the app. Android: update the existing notification instead of re-posting; auto-group at 4+; cooldown dims repeats. APNs payload 4 KB. Visible-character budgets are undocumented: front-load the key fact in the first ~40-50 characters, body ≲ 120-150 `[H]`.
- Promos/interstitials: no promo before a first meaningful task; at most one in-app prompt per session; never over a task in progress. NN/g popups: acceptable only for legal compliance or critical warnings (avg 25 popups/week; six bad-timing moments: before page load, right after login, before interaction, premature feedback requests, mid-task, stacked). Google: intrusive full-page/overlay promos hurt search ranking; small banners are fine. Ratings: system limits the prompt to 3 per 365 days; ask after engagement, not at launch; Play in-app review: no pre-questions like "Do you like the app?". TipKit: tips for features with ≤ 3 actions, 1-2 sentences, limited frequency. `[R][L][P-iOS][P-AND]`

## 18. Offline and connectivity

Show a persistent, calm indicator ("Offline: showing saved items"), keep reads working from cache with "Updated <time>", queue writes with per-item status ("Waiting to sync" → "Synced" / "Couldn't sync, Retry"), block only truly online-only actions with an explanation, auto-resume on reconnect, never wipe screens on connectivity loss, and provide a foreground "sync now" where Background Sync is unavailable (Safari/Firefox). Android offline-first: local DB is the source of truth; write strategies online-only (bank transfers), queued (analytics), lazy (to-dos); WorkManager with network constraint + exponential backoff; last-write-wins (loses edits: surface conflicts for user-authored content). Show file size before downloads; make offline content discoverable. Primer degraded experiences: don't conceal; show a page-level error only when the primary experience fails; replace broken sections with a brief error or blank slate; hide counts when data is unavailable; keep controls (inactive, not disabled). PWA: cache-first static, network-first/SWR dynamic, branded offline page. `navigator.onLine` is unreliable (memory). `[P-AND][P-WEB][R]`

## 19. Anti-patterns (problem → better)

Infinite skeleton/spinner → three exits (success/error/timeout). Spinner-only for long waits → determinate + text + cancel. "Oops!"/blame-y/jargon errors → specific, calm, actionable. Error shown by color only → text + icon + border. Toast for errors needing action → inline/banner/dialog. Modal for success → in-place confirmation. Hidden loading on buttons → in-button state within 100 ms. Empty screens with no CTA → designed empty variants. Skeleton for sub-second loads or unknown layout → nothing or inline pending. Confirm dialogs on everything → undo. Fake or stalled progress → honest indeterminate. Clearing user input on error → preserve. Permission prompt at first launch → ask in context. Full-page promo before value → inline, contextual, one per session. Wiping screens on connectivity loss → cached reads + queue.

## 20. Evidence limits

m3.material.io snackbar/banner/empty-state/writing guidance unreachable (some Material rules are snippet-only or memory). Notification character limits, the FCM size limit, Stripe/AWS retry guidance, Flutter snackbar, blurhash facts unverified. The progress-bar studies (Myers, Harrison) were not read; NN/g's "3× longer" figure is second-hand. Optimistic-UI safety criteria, conflict resolution and batch-failure UX are our synthesis. iOS 26 HIG changes for these topics were not checked. Spinner delay/min-display numbers are heuristics.
