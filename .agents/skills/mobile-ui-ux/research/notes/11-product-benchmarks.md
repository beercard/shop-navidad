# 11 — Product benchmarks: patterns, not pixels

Researched 2026-10-06. Scope: what mature mobile products actually do, extracted into reusable patterns, with evidence tags. Built from first-party design-system pages, company blogs/changelogs/help centers, regulators, NN/g and Baymard, and news only where it relays a company statement.

Method notes
- WebSearch budget (200/session) ran out mid-session. Everything after that is direct fetches of known URLs. Some product areas therefore have thin or no sourcing (see Gaps).
- JS-rendered design systems (m3.material.io, base.uber.com, sap.com/design-system, faq.whatsapp.com) were NOT readable via WebFetch but WERE readable through the in-app Browser pane (navigate, then `document.body.innerText` via javascript_tool, after a 3-5 s wait). Useful tip for other slices.
- Tags: VERIFIED = fetched and the text states it; SNIPPET = search excerpt only; MEMORY = training knowledge, flagged.
- Scope tags: universal / iOS / Android / Web / product-specific / trend / opinion.

## Sources consulted

| URL | Tier | Verified? |
|---|---|---|
| https://base.uber.com/6d2425e9f/p/033e0d-sheet (Uber Base: Sheet) | T1 | VERIFIED (via Browser pane) |
| https://zeroheight.com/6d2425e9f/p/775209/t/929946 (Uber Base: Dialog, incl. "Dialog versus sheet?") | T1 | VERIFIED |
| https://base.uber.com/6d2425e9f/p/65ae6d (Uber Base: States) | T1 | VERIFIED |
| https://m3.material.io/components/bottom-sheets/guidelines | T1 | VERIFIED (Browser pane) |
| https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{sheets,tab-bars,gestures,managing-accounts,apple-pay,wallet,notifications,charting-data,playing-audio}.json | T1 | VERIFIED |
| https://www.sap.com/design-system/fiori-design-ios/v26-4/{discover/sap-design-system, patterns/navigation, patterns/modality, page-types/list-report, patterns/sort-and-filter/filter-overview, components/progress-indicators/skeleton-loading, patterns/authentication/biometric-authentication} | T1 | VERIFIED (Browser pane) |
| https://developer.salesforce.com/docs/platform/mobile-offline/guide/ux-a11y.html | T1 | VERIFIED (Browser pane) |
| https://developer.android.com/identity/sign-in/biometric-auth | T1 | VERIFIED |
| https://www.w3.org/WAI/WCAG22/Understanding/{pointer-gestures,dragging-movements}.html | T1 | VERIFIED |
| https://digital-strategy.ec.europa.eu/en/news/commission-preliminarily-finds-tiktoks-addictive-design-breach-digital-services-act | T1 (regulator) | VERIFIED |
| https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers | T1 (regulator) | VERIFIED (press release; full PDF unreadable) |
| https://faq.whatsapp.com/665923838265756 (read receipts / check marks; page served in Indonesian) | T1 (company) | VERIFIED (Browser pane) |
| https://blog.whatsapp.com/introducing-instant-video-messages | T3 | VERIFIED |
| https://www.notion.com/help/workspaces-on-mobile ; /help/writing-and-editing-basics | T1 (company docs) | VERIFIED |
| https://support.google.com/mail/answer/2819488 (Gmail undo send) | T1 (company docs) | VERIFIED |
| https://support.microsoft.com/en-us/accessibility/teams/use-a-screen-reader-to-explore-and-navigate-microsoft-teams | T1 (company docs) | VERIFIED |
| https://telegram.org/blog/telegram-5-ios | T3 | VERIFIED (describes swipe actions; macOS section) |
| https://linear.app/changelog/2024-09-19-introducing-linear-mobile ; /changelog/2025-10-16-mobile-app-redesign ; /now/linear-liquid-glass ; /now/behind-the-latest-design-refresh | T3 | VERIFIED |
| https://github.com/wzhudev/reverse-linear-sync-engine | T4 (community reverse engineering of Linear web client) | VERIFIED as a description, not as Linear's statement |
| https://9to5mac.com/2020/05/11/slack-ios-major-update-bottom-bar-ui/ ; https://designcompass.org/en/2023/08/14/slack-redesign/ ; Engadget Slack 2023 article | T4 (relay Slack statements) | VERIFIED |
| https://monzo.com/blog/how-we-unified-our-customers-activity-on-the-new-home-screen ; /blog/2018/02/15/android-crowdsourcing-merchant-data | T3 | VERIFIED |
| https://www.lyssna.com/blog/fee-transparency-ux-wise-vs-revolut/ | T4 (vendor study, n=20) | VERIFIED |
| https://baymard.com/blog/{mobile-commerce-design, current-state-product-list-and-filtering, how-to-design-applied-filters, responsive-upscaling, ecommerce-ux-best-practices, grocery-add-to-cart-buttons} ; /research-articles/current-state-ecommerce-product-page-ux | T2 | VERIFIED |
| https://www.nngroup.com/articles/bottom-sheet/ ; /articles/infinite-scrolling-tips/ ; /articles/infinite-scrolling/ | T2 | VERIFIED |
| https://shopify.engineering/back-to-native (Sep 2026) | T3 | VERIFIED |
| https://www.uber.com/us/en/blog/new-rider-app-architecture/ ; https://www.uber.com/us/en/u/redesigned-uber-app/ | T3 | VERIFIED |
| https://news.airbnb.com/2022-summer-release/ | T3 | VERIFIED |
| https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth ; /p/behind-the-product-duolingo-streaks ; https://blog.duolingo.com/how-duolingo-streak-builds-habit | T3 | VERIFIED |
| https://blog.classdojo.com/introducing-classdojo-translate/ | T3 (vendor claims) | VERIFIED |
| https://www.infoq.com/news/2023/09/reddit-feed-server-driven-ui ; TechCrunch 2024-04-24 Reddit comment navigation | T3/T4 | VERIFIED |
| https://culturedcode.com/things/support/articles/9780167/ ; https://www.todoist.com/inspiration/add-tasks-todoist | T1 (company docs) | VERIFIED |
| https://netflix about page "Downloading on Netflix just got smarter" | T1 | VERIFIED (Wi-Fi/storage specifics not in fetched text) |
| https://9to5google.com/2025/12/27/recap-material-3-expressive/ ; idownloadblog YouTube miniplayer 2025 | T4 | VERIFIED |
| https://commitconsulting.com/blog/workday-my-tasks-inbox | T4 (vendor-affiliated consultancy) | VERIFIED |
| https://www.deceptive.design/types | T2/T4 (practitioner taxonomy) | VERIFIED |
| Search snippets only: Airbnb mobile-web (Medium), Gmail swipe customization, Spotify mini-player 2021, WhatsApp voice lock, Telegram voice lock, Netflix Downloads for You (1/3/5 GB), Workday mobile QRG PDFs, Wise Neptune (55 components) | T4 | SNIPPET |
| Not readable: docs.wise.design/wise.design docs (redirect to 404), medium.com (403), Slack engineering (404), FTC PDF (binary), faq voice-message page (empty) | - | NOT FETCHED |

---

## Findings

### Part A — Productivity

### F1 Notion: four-slot bottom bar + toolbar-above-keyboard replaces desktop slash/hover
- Claim: Notion's mobile shell is a persistent bottom bar with Home, Search, Inbox, Create. Mobile editing drops slash commands and hover icons; block creation goes through a "+" menu and an editing toolbar docked above the keyboard (mentions, comments, image, indent, color, duplicate).
- Evidence: Notion Help (workspaces-on-mobile; writing-and-editing-basics) — T1 — VERIFIED — bar items and toolbar contents as above; "..." menu holds typography, undo/redo, copy block link.
- Corroboration: pattern matches Linear (bottom toolbar + create), Slack (compose button), HIG tab-bar advice.
- Scope: universal (product-specific details).
- Context (when it flips): help pages are undated; the app's bar may have changed since. Treat as "this pattern exists", not "this is current".
- Agent rule: IF the desktop editor relies on hover handles or `/` commands THEN on mobile expose the same block operations through a visible keyboard-attached toolbar plus an explicit "+" insert menu; never depend on hover or a hardware key.

### F2 Linear Mobile: companion app for away-from-keyboard jobs, not a port
- Claim: Linear positions mobile around three jobs: stay informed, file issues, unblock teammates. Inbox rows get archive and snooze controls; create-issue is reachable everywhere. The Oct 2025 redesign added a bottom toolbar for core flows and a "Create Issue" button at the top of every screen, built on a custom frosted-glass material.
- Evidence: Linear changelog 2024-09-19 and 2025-10-16 — T3 — VERIFIED. Linear "A Linear spin on Liquid Glass" — T3 — VERIFIED: they rebuilt the glass in SwiftUI instead of using Apple's API; deliberately omitted refraction because it hurts legibility in dense UIs; the material adapts to Increase Contrast by drawing solid outlines; tab bar is customizable and can exceed five items because roles differ (IC vs exec).
- Corroboration: "not every element should carry equal visual weight" and "structure felt, not seen" from Linear's web refresh (VERIFIED, web only, does not cover mobile).
- Scope: product-specific, with transferable principles.
- Context: >5 tabs works for power users with role-based customization; HIG warns overflow hides content (F40).
- Agent rule: IF a mobile app companions a keyboard-heavy desktop tool THEN limit mobile to triage/capture/unblock jobs, keep create reachable on every screen, make nav chrome visually recede, and if using translucent glass in an information-dense UI, skip refraction and honor Increase Contrast / Reduce Transparency with solid fallbacks.

### F3 Linear "feels instant": local-first data, optimistic mutations, durable outbox
- Claim: the instant feel comes from client-side data, not animation tricks. A community reverse-engineering of Linear's web client describes: IndexedDB as local store, a global sync id, MobX-observable models, mutations applied to memory immediately, transactions batched to the server and persisted locally so they survive a crash, deltas pushed over WebSocket, related data hydrated lazily.
- Evidence: reverse-linear-sync-engine repo — T4 — VERIFIED as a description (not an official Linear statement). Search snippets repeat "loads most pages under 50 ms" — SNIPPET, third-party, not relied on.
- Corroboration: WhatsApp's clock/tick model (F23) and Gmail's undo window (F7) are the same idea from other products: act now, show pending state, reconcile later.
- Scope: Web evidence; Linear's native mobile apps are separate codebases and parity is unverified.
- Context (flips): do not use optimistic UI for money movement, irreversible deletes, or anything with server-side validation that often rejects. There, show a pending state and wait for confirmation.
- Agent rule: IF actions are small, frequent, and rarely rejected (triage, toggles, reorder, comment) THEN apply locally first, persist an outbox, show per-item pending/failed state with retry, and roll back visibly on rejection. IF the action moves money or is irreversible THEN use pessimistic confirmation plus explicit "pending" status.

### F4 Slack: from hamburger to a bottom bar, then to user-centric tabs
- Claim: 2020 iOS redesign replaced the hidden menu with a bottom bar (Home, DMs, Mentions, You), made the Jump To quick switcher more prominent because mobile users were not using it, added a bottom-right compose button and a shortcuts bolt in the composer. 2023 redesign shortened the mobile bar to Home, DMs, Activity, moved from workspace-centric to user-centric organization, and added top tiles for unreads and threads with swipe-through of unreads.
- Evidence: 9to5Mac 2020 (quoting Slack release notes) — T4 relaying T1 — VERIFIED; Design Compass 2023 (CPO quote on staying organized) — T4 — VERIFIED; Engadget 2023 — T4 — VERIFIED. Slack stated motive in 2020: features accumulated and structure needed a reset.
- Also in 2020: left swipe returns to previous conversation, right swipe reveals workspaces/settings (gesture shortcuts).
- Scope: product-specific; transferable IA principle.
- Context: tab set changed between 2020 and 2023, which is evidence that tab IA should be re-tested as features grow.
- Agent rule: IF the nav currently hides destinations behind a hamburger THEN promote the 3-5 most used destinations to a bottom bar organized by user intent (read, converse, attention) rather than org structure; make search/quick-switch visually prominent when analytics show it is underused; treat swipe-between-conversations as a shortcut only (F25).

### F5 Microsoft Teams: bottom bar + top utility toolbar + More
- Claim: iOS bottom bar: Activity, Chat, Calendar, Calls. Android adds Files as a fifth. A top toolbar holds the More menu button (profile, presence, settings, Saved, Files), Search, current tab title, and tab-specific buttons. Other docs describe user-reorderable app bar items.
- Evidence: Microsoft Support accessibility page — T1 — VERIFIED (iOS/Android layout); reorder behavior — SNIPPET.
- Corroboration/conflict: HIG says avoid overflow "More" tabs because hidden items are harder to find (F40). Teams puts More in the top toolbar rather than as a tab, and lets users reorder.
- Scope: product-specific; also shows iOS/Android parity is not required (Files only on Android).
- Agent rule: IF you must exceed 5 destinations THEN rank by frequency, let users reorder, and keep overflow out of the tab bar (profile/settings/saved in a top-level menu); do not hide frequent destinations in "More".

### F6 Google Workspace / Gmail: Material 3 Expressive in a flagship app
- Claim: Gmail on Android adopted M3 Expressive in 2025: card-style list, solid-filled Compose FAB, search pill with avatar moved outside the pill. Across Google apps the bottom nav bar returned to a shorter height; Google Chat uses a floating glass-style pill toolbar for frequent actions, not primary nav.
- Evidence: Android Police / 9to5Google coverage — T4 — SNIPPET/VERIFIED (9to5Google recap fetched). The recap author criticizes over-containerized, denser layouts and oversized buttons (opinion, T4).
- Scope: Android; trend.
- Agent rule: IF adopting M3 Expressive THEN do it via the platform components and test density; do not read Google's own mixed adoption (some apps skipped the new search bar because they lacked a hamburger/avatar) as proof the pattern fits every app.

### F7 Gmail undo-send and swipe actions: delayed commit instead of confirmation dialogs
- Claim: after Send, Gmail shows "Message sent" with Undo for a configurable window of 5, 10, 20 or 30 seconds. On mobile, left and right swipe in the list are user-configurable (archive, delete, read/unread, snooze, move) with an undo toast.
- Evidence: Gmail Help (undo send) — T1 — VERIFIED. Swipe customization and undo toast — SNIPPET (third-party how-tos).
- Scope: universal principle; web+mobile behaviors.
- Context: undo works because the commit is delayed or reversible; for payments, regulators/banks require explicit confirmation plus step-up (F11).
- Agent rule: IF an action is high-frequency and reversible THEN execute immediately with a time-boxed Undo (snackbar) rather than a confirm dialog; IF swipe actions exist THEN make them configurable, show a matching visible control elsewhere, and keep Undo (F25).

### F8 Quick capture (Things, Todoist): capture surfaces beyond the app
- Claim: Todoist Quick Add parses natural-language dates/labels/priority/project in one field; also share-sheet capture, home-screen widgets, Android Quick Settings tile, voice, email/plugins. Things accepts natural-language dates ("tues 8am", "2p", "17d"); on iPhone the documented path is swipe right on a to-do to reveal When, then pull down for the natural-language field.
- Evidence: Todoist inspiration page — T1 — VERIFIED; Things support article — T1 — VERIFIED.
- Scope: universal for capture; iOS/Android specifics as stated.
- Context (when it flips): the Things path begins with a swipe; check a visible non-gesture route exists (F25). NL parsing needs a visible preview of the parsed result to avoid silent mis-parses (principle; no source).
- Agent rule: IF the core job is "get it out of my head" THEN make capture a one-field flow with NL parsing and echo the parsed date/project as chips before commit; add share-sheet, widget, and quick-settings entry points.

### Part B — Finance

### F9 Wise: show the math, early and live
- Claim: Wise's flow shows fee, exchange rate and the recipient amount updating as you type; combined total comes early. A small moderated test found people identified total cost far more often on Wise than Revolut.
- Evidence: Lyssna study — T4 vendor — VERIFIED — n=20 US adults aged 35-65, split 10/10, task: find total cost to send USD 500 to Spain; Wise mean 3 min 39 s vs Revolut 7 min 6 s; correct cost identified 70% vs 30%; run on websites, not native apps; vendor-published, small n. Wise Neptune design system exists with ~55 components including bottom-sheet — SNIPPET; wise.design docs not readable.
- Corroboration: Apple Pay HIG requires itemized lines and a clear total (F10); FTC lists hidden fees/drip pricing as a dark pattern (F36).
- Scope: universal for any price/fee flow.
- Agent rule: IF a user commits money THEN show amount sent, each fee, rate (if FX), and amount received/total on the same screen, updating live; label the total explicitly; never reveal a mandatory fee only at the final step.

### F10 Apple Pay HIG: amount display and checkout friction
- Claim: payment sheet lists card, amount including tax/fees, shipping; total line reads "Pay <Business>" (name both parties for marketplaces); use itemized lines; use "Amount Pending" when the final amount may change; collect size/color/quantity before the sheet; do not force account creation before purchase (ask after confirmation); do not hide or disable the button, explain unavailability after tap; place Apple Pay above/right of Add to Cart; min button 100x30 pt (Donate 140x30 pt).
- Evidence: HIG apple-pay.json — T1 — VERIFIED.
- Scope: iOS (principles universal).
- Agent rule: IF building checkout THEN gather all options before the payment step, put express payment first, show a named total with itemized lines, flag variable amounts as pending, and defer account creation until after payment.

### F11 Step-up auth and biometrics (Android + HIG + SAP)
- Claim: Android BiometricPrompt defaults to requiring an explicit confirmation tap after biometric success (appropriate for purchases); `setConfirmationRequired(false)` is a hint for low-risk re-auth. Allowed authenticators: BIOMETRIC_STRONG, BIOMETRIC_WEAK, DEVICE_CREDENTIAL; DEVICE_CREDENTIAL cannot be combined with a negative button. For high-value transactions bind auth to a keystore key requiring authentication on every use. HIG: defer sign-in, prefer passkeys / Sign in with Apple, label buttons "Sign in with Face ID" (only for the biometry the device has), do not add an in-app biometric toggle (system controls it), and never call it "passcode". SAP Fiori iOS: biometric consent screen with icon matching the device, short benefit line, "learn more", and a non-blocking "Not now" for Touch ID.
- Evidence: Android Developers biometric-auth — T1 — VERIFIED; HIG managing-accounts — T1 — VERIFIED; SAP biometric pattern — T1 — VERIFIED.
- Scope: Android + iOS.
- Agent rule: IF an action moves money or changes credentials THEN require per-use authentication (crypto-bound where the platform allows) with explicit confirmation; IF re-opening a low-risk session THEN biometric without extra confirmation; always provide a device-credential fallback; label with the actual biometry name.

### F12 Monzo feed: merchant-first rows, unified timeline, de-duplication
- Claim: rows show merchant name, location and logo instead of raw merchant strings; Android users can submit corrections (name, location, logo source). The 2023-era unified home feed merges personal, joint and connected external accounts into one timeline with account badges, collapses upcoming bills into one expandable item, de-duplicates account/pot transfers, and fixes chronological ordering of open-banking items with time ranges because some banks post at midnight. The backend decides layout ("dynamic feed service") so all clients change without releases; feed is paginated to avoid memory spikes.
- Evidence: Monzo blog 2018-02-15 and the unified-home-screen post — T3 — VERIFIED. Community threads about pending display — SNIPPET.
- Scope: product-specific; transferable list-design principles.
- Agent rule: IF showing a transaction list THEN lead with the human merchant name and category/icon, show pending vs settled distinctly, de-duplicate internal transfers, keep ordering stable under late-arriving data, aggregate predictable future items, and offer a correction path for bad merchant data; paginate.

### F13 Apple Wallet passes: glanceable front, details on the back
- Claim: put the essential value (balance, event date) in header fields visible when collapsed; keep front uncluttered; legal/fine print on back; use API barcodes not baked-in images; change notifications only for time-critical updates; ask permission before deleting a pass; text must not be baked into images; avoid device-specific wording.
- Evidence: HIG wallet.json — T1 — VERIFIED (icon 38x38 pt; logo 50-160 pt wide x 50 pt; strip 375x144 pt).
- Scope: iOS; transferable to any card/balance UI.
- Agent rule: IF a card/balance/ticket UI is the glanceable object THEN the collapsed state shows one primary value; everything rare goes behind a details view.

### F14 Spend-insight charts
- Claim: HIG says give a headline summary above charts, add accessibility labels/elements, avoid over-packing, keep colors and layouts consistent between summary and expanded views, and let people reveal detail progressively.
- Evidence: HIG charting-data.json — T1 — VERIFIED.
- Gap: no product-specific (Revolut, Monzo Trends) chart source found.
- Agent rule: IF showing spend by category THEN lead with a one-sentence takeaway, provide a tabular alternative / accessibility labels, and let tap-through reveal the transactions behind a segment.

### Part C — Commerce

### F15 Baymard mobile product lists and filters
- Claim: 78% of mobile sites have poor or mediocre product-list UX. Filters take extra steps on mobile; show applied filters as horizontally scrolling chips (with a truncation cue) or stacked rows; never show only a count; 69% of mobile sites lack all four core sorts (price, rating, best-selling, newest); a separate filter interface with a sticky apply control works on mobile (snippet).
- Evidence: Baymard product-list benchmark and applied-filters article — T2 — VERIFIED. Sticky apply — SNIPPET.
- Conflict: share of sites lacking an applied-filters overview is 28% in one article and 20% in another (different benchmark vintages). Use "roughly a quarter".
- Corroboration: SAP Fiori iOS: filter feedback bar for contextual quick filters and applied-filter display; full-screen sort/filter form with a results button for complex filtering (F30).
- Scope: universal (commerce/list screens).
- Agent rule: IF a list is filterable THEN show applied filters as removable chips above the list at all times, offer 3-5 quick filters inline, and put heavy filters in a full-screen sheet with a live "Show N results" button; include the four core sorts.

### F16 Baymard product page: sticky add-to-cart and mobile PDP basics
- Claim: attach a sticky product summary (title, price, variation, Add to Cart) so the buy action stays reachable while reading long pages; make the primary button prominent and unique (#791). Snippet: avoid a full-width sticky bar, give it breathing room. Benchmarks: only 38% of mobile sites (36% of apps) reach decent PDP performance; 57% use dropdowns for size; 67% give no shipping estimate; 81% lack unit pricing.
- Evidence: Baymard responsive-upscaling and product-page benchmark — T2 — VERIFIED; guideline #791 — VERIFIED (ecommerce best-practices list); "not full-width" — SNIPPET. Conversion-lift claims (5-15%) from vendor blogs — SNIPPET, not independent; do not use.
- Scope: universal commerce.
- Context: a sticky CTA is not a license to hide the total cost (F36). Hide it when the in-page button is visible to avoid duplicates (SNIPPET).
- Agent rule: IF the PDP scrolls past the CTA THEN show a sticky bar with price + variant summary + primary CTA that appears only after the inline CTA leaves the viewport; show shipping estimate and size options as visible buttons.

### F17 Baymard on mobile context: overview, taps, interruptions
- Claim: the most severe mobile issue is lack of page overview (viewport shows fragments; keyboard removes about 40% of the view at checkout). 63% of participants abandoned items or sites for preventable usability issues. Unintended taps stem from too-small hit areas, not "fat fingers". Users were interrupted on average every 20 minutes (some every 4.5), so forms must not lose data and carts/favorites must persist.
- Evidence: Baymard "Understanding Mobile E-Commerce UX: 5 Overarching Issues" — T2 — VERIFIED (15 sites tested).
- Scope: universal.
- Agent rule: IF a flow has forms THEN autosave drafts and restore on return; keep carts/draft state server-side; give tap targets platform-minimum size and spacing; show progress/context so users keep orientation.

### F18 Grocery add-to-cart becomes a quantity stepper
- Claim: after adding an item, the Add button should turn into a quantity control (editable number field, not only +/-) so users see what is already in the cart; small "in cart" labels were overlooked on mobile.
- Evidence: Baymard grocery guideline — T2 — VERIFIED.
- Scope: commerce lists with repeat adds (grocery, food delivery, retail).
- Agent rule: IF users add many items in one session THEN replace the add button in place with a stepper and typed quantity.

### Part D — Social

### F19 Instagram 2025 tab experiment (growth-driven IA)
- Claim: Instagram tested a layout that puts Reels and DMs first, replaces the dedicated post-create tab with DMs, adds swiping between tabs; Mosseri's stated reason is that Reels and DMs drove most recent growth; Meta concedes users need time to adapt.
- Evidence: Engadget — T4 relaying Meta — VERIFIED.
- Scope: product-specific, trend.
- Agent rule: IF your product's tab IA is being chosen to maximize engagement of one feed THEN stop and ask whether it serves the user's jobs; do not copy Instagram's tab order into utility or enterprise apps.

### F20 Infinite scroll and addictive design: evidence and regulation
- Claim: NN/g: infinite scroll fits aimless browsing of homogeneous items; it hurts goal-directed finding, comparison, and refinding; a "Load more" button restores footer access and signals end of content; always restore scroll position on return. The European Commission's preliminary finding (6 Feb 2026) says TikTok's infinite scroll, autoplay, push notifications and highly personalized recommender can push users into compulsive "autopilot" use; it suggests disabling infinite scroll over time, adding effective screen-time breaks including overnight, and changing recommendations; it judged existing time tools ineffective because they are easy to dismiss and add little friction.
- Evidence: NN/g infinite-scrolling-tips and infinite-scrolling — T2 — VERIFIED; EC press release — T1 regulator — VERIFIED (preliminary, not a final decision).
- Scope: universal (feeds) + regulatory (EU).
- Agent rule: IF the screen supports a task (search, compare, review, approve, transact) THEN use pagination or Load more with position restore; reserve infinite scroll for leisure feeds, and even then provide visible end/break affordances if serving minors.

### F21 Reddit: consistent conversation navigation + server-driven feeds
- Claim: tapping the comments button jumps to the top of comments; a sticky context bar returns to the post in one tap; swipeable media can be browsed while viewing comments. Feeds use server-driven UI: backend sends UI cells, enabling layout changes without app releases and about 12% faster feed loads, at the cost of moving presentation logic to the server.
- Evidence: TechCrunch 2024-04-24 (rationale: conversations should not depend on post type) — T4 — VERIFIED; InfoQ 2023 — T3 — VERIFIED.
- Scope: product-specific + architecture.
- Agent rule: IF a detail screen has two main regions (content + discussion) THEN give one-tap jump between them and a sticky context bar; IF considering SDUI THEN accept that clients become renderers and keep a client-side fallback for offline.

### Part E — Communication

### F23 WhatsApp message status model (numbering skips F22 by design)
- Claim: one check = sent, second check = delivered to recipient's phone or linked device, two blue checks = read; a clock icon means not yet sent/delivered (connection). In groups, second check appears when all members received, blue when all read. Editing a message resets read receipts. A Message info screen lists delivered / read-or-seen / played (voice). Voice notes have a separate played state. Read receipts can be turned off in Privacy (not for groups or voice played receipts).
- Evidence: WhatsApp Help Center (read receipts) — T1 — VERIFIED (fetched Indonesian version; semantics clear).
- Scope: product-specific, widely emulated.
- Context: status ticks create social pressure; the privacy toggle exists for that reason.
- Agent rule: IF the app has messaging or any send action THEN model states pending (clock) -> sent -> delivered -> read, render each distinctly (not color alone: check count differs), expose per-message detail, and offer a read-receipt opt-out when social pressure is a concern.

### F24 Hold-to-record with lock; video notes
- Claim: WhatsApp video notes: press and hold the camera icon, swipe up to lock into hands-free recording; capped at 60 s; recipient sees autoplay muted with tap for sound. Voice notes follow the same hold, slide-up-to-lock, slide-left-to-cancel scheme; Telegram uses a similar long-press on the mic with lock.
- Evidence: WhatsApp blog (video notes) — T3 — VERIFIED; voice-note lock/cancel — SNIPPET (faq excerpt + how-to articles); Telegram — SNIPPET.
- Corroboration (accessibility): WCAG 2.5.1 requires a single-pointer, non-path alternative for path-based gestures; 2.5.7 requires non-dragging alternatives; HIG says custom gestures must never be the only way.
- Scope: universal pattern, accessibility-constrained.
- Agent rule: IF you ship hold-to-record THEN also provide tap-to-start / tap-to-stop (or a visible lock button), a visible cancel control, a recording timer, and haptic/visual feedback; never make the gesture the sole path.

### F25 Swipe actions in lists: ubiquitous, needs a visible twin
- Claim: Telegram's chat list swipes: right = mark read/unread, left = pin/mute/delete; swipe to reply in threads. Slack 2020 used swipes for last-conversation and workspaces. Gmail swipes are configurable. HIG lists Swipe as "reveal actions, dismiss, scroll" and also states custom gestures must be discoverable and never exclusive.
- Evidence: Telegram 5.0 blog — T3 — VERIFIED; HIG gestures — T1 — VERIFIED; WCAG 2.5.1 — T1 — VERIFIED; Salesforce mobile guidance (provide a button; gestures only as shortcuts) — T1 — VERIFIED.
- Scope: universal.
- Agent rule: IF a row has swipe actions THEN limit to 1-3 high-frequency, non-destructive-first actions, provide the same actions in a visible menu/long-press/edit mode, label with icon+text, and add Undo for destructive ones.

### Part F — Travel, maps, mobility

### F26 Sheet-over-map with detents (Uber Base, M3, HIG, NN/g)
- Claim: Uber's sheet lets two related surfaces be used at once; a common use is location results or details over a map. Expandable sheets snap between three positions: collapsed at 10-30% of screen height (configurable), middle at 40-80% (usually the default start), expanded at top (60 px below the status bar), with optional near-full and full via custom code. Stop dragging and it snaps to the nearest detent. Scrolling inside at expanded state docks the header. Grabber tap cycles detents; its tap area is at least 48 px high. Motion: 400 ms, entry cubic-bezier(0.23,1,0.32,1), exit cubic-bezier(0.86,0,0.07,1). Narrow screens (<600) anchor to the bottom at full width; wide screens use side sheets.
- Evidence: Uber Base Sheet — T1 — VERIFIED. M3 bottom sheets — T1 — VERIFIED: standard sheets coexist with the main UI (location info over a map; music player over album browsing), can have preset positions from full-height to a preview, drag handle must have a single-pointer alternative, cycling through heights and closing must work without dragging; modal sheets cap initial height at 50% of the screen, dismiss by scrim tap, swipe, or an in-sheet close; predictive back on Android. HIG sheets — T1 — VERIFIED: large and medium detents (medium about half height), grabber with VoiceOver support and tap-to-cycle, nonmodal option, support swipe-to-dismiss with action-sheet confirm for unsaved changes, avoid sheets for complex multi-step flows. NN/g — T2 — VERIFIED: Google Maps as the nonmodal example; start compact then expand; do not stack sheets; always provide a visible close because swipe-only dismissal is inaccessible.
- Corroboration: 4 independent T1/T2 sources agree on the model; numbers differ slightly (see Numbers table).
- Scope: universal (Android/iOS/Web mobile).
- Context (flips): complex or prolonged flows go full-screen (HIG, Uber "Dialog vs sheet" says high-volume or multi-step content favors sheet/full screen, short 2-3 option choices favor dialog).
- Agent rule: IF the screen is map/list/canvas + details THEN implement a non-modal sheet with 3 detents (peek ~15-25%, half ~50%, expanded to just under the top), a visible grabber with tap-to-cycle and a keyboard/screen-reader path to each detent, snap to nearest detent, make the map reserve inset equal to the sheet height, and give a visible close/collapse control; convert to modal (scrim, required dismiss) only when background context is no longer needed.
- Stack notes: Compose `BottomSheetScaffold`/`ModalBottomSheet`, SwiftUI `presentationDetents` + `presentationBackgroundInteraction`, UIKit `UISheetPresentationController`, Flutter `DraggableScrollableSheet` — verify details in the platform slice.

### F27 Uber Base: Dialog vs Sheet decision and sheet etiquette
- Claim: pick Sheet if the user needs to reference the surface behind, needs to collapse content to see it, content is high-volume/scrolling, or the experience launches other dialogs; pick Dialog for single-step tasks, short content, or a choice among 2-3 options. A sheet should have a title (confirmed in interviews with blind and low-vision riders/eaters; relates to WCAG 2.4.2), a dismiss "X" at the trailing edge, and an explicit dismiss action (X, Cancel, or primary confirm); scrim tap, ESC and swipe are supplemental only. Sheets pair with a button dock. Header text truncates after 2 lines by default (up to 3). Interactive states: pressed overlay 8% black (light) / 20% white (dark), hover 4% / 10%, focus ring 3 px, disabled images at 40% opacity, selected state needs 3:1 contrast and must not rely on color alone.
- Evidence: Uber Base Dialog, Sheet, States pages — T1 — VERIFIED.
- Scope: universal principles; Uber-specific tokens.
- Agent rule: IF unsure between dialog and sheet THEN apply the questions: reference the background? -> sheet; 2-3 options, short? -> dialog; multi-step or long? -> sheet/full screen; always include title, explicit dismiss, and button dock for confirm/cancel.

### F28 Airbnb 2022: category-first discovery, map follows context
- Claim: Airbnb restructured search around ~55-56 categories (style, location, activity), using ML on titles, descriptions, photo captions and reviews to categorize about 4 million homes; as users switch categories the map zooms to where those homes are; Split Stays surfaces paired homes (stated: ~40% more listings for longer stays) with an animated line between them on the map. Medium-sourced designer write-ups say the mobile search became a one-question-at-a-time sheet and that tab bars replaced a hamburger menu (not verified firsthand).
- Evidence: news.airbnb.com 2022 Summer Release — T3 — VERIFIED (categories, ML, map zoom, 40%); count differs 55 (release) vs 56 (secondary coverage). Mobile-web tab-bar and "one question at a time" — SNIPPET (Medium).
- Scope: product-specific.
- Context: discovery-first suits browse-able inventory; goal-directed search (known destination/date) still needs a fast text path.
- Agent rule: IF inventory is large and users cannot name what they want THEN offer curated category entry points with the map/list reacting to the category, and keep a direct search path for known-item users.

### F29 Uber rider app: personalization + lock-screen reassurance + core isolation
- Claim: Feb 2023 redesign: home personalized to likely destinations/ride types, Services tab consolidating products, Activity hub for history, live trip tracking from the lock screen without unlocking. Architecture: unidirectional data flow, shared architecture across iOS/Android, optional features behind flags that can be disabled globally without touching core ride-request, availability target 99.99% for core rider functions.
- Evidence: uber.com redesigned-app page — T3 — VERIFIED; Uber engineering blog (Riblets) — T3 — VERIFIED.
- Scope: product-specific; principles transferable.
- Agent rule: IF the user is waiting on a physical-world event (ride, delivery, pickup) THEN surface status where they already look (Live Activity/lock screen/notification) with ETA and clear next action; isolate the core transaction flow so experiments cannot break it.

### Part G — Media

### F30 Persistent mini-player pattern
- Claim: HIG: a tab bar can carry a bottom accessory such as the Music mini-player which minimizes inline with the tab bar on scroll, expanding again on tab tap or scroll to top. M3: a standard bottom sheet is the right container for a persistent audio player that coexists with browsing. YouTube's 2025 redesign: a floating, resizable miniplayer with just play/pause and close overlaid and 10 s skip below, detached from the bottom bar and tuckable to edges. Spotify (2021) floating mini-player with album-art color (SNIPPET).
- Evidence: HIG tab-bars.json — T1 — VERIFIED; M3 bottom sheets — T1 — VERIFIED; iDownloadBlog — T4 — VERIFIED; Android Police/9to5Google Spotify — T4 — SNIPPET. HIG playing-audio — T1 — VERIFIED: use system volume view, do not repurpose standard transport controls, distinguish resumable vs non-resumable interruptions, notify other apps when finishing.
- Scope: universal for media.
- Agent rule: IF media continues while the user navigates THEN keep a mini-player pinned above the tab bar (or as an accessory) with play/pause + title + progress, tap to expand to a full now-playing sheet; never place anything between it and the tab bar; honor audio-session interruptions.

### F31 Netflix: automatic offline management
- Claim: Smart Downloads deletes the watched episode and fetches the next one, user-opt-in; Downloads for You adds recommendation-based downloads with a user-chosen storage cap of 1, 3 or 5 GB on Wi-Fi.
- Evidence: Netflix newsroom — T1 — VERIFIED (auto-delete + next, optional); storage caps and Wi-Fi-only — SNIPPET (TechCrunch/MakeUseOf).
- Scope: product-specific.
- Agent rule: IF offline is a core promise THEN automate cleanup/prefetch under explicit user opt-in with a visible storage cap and Wi-Fi-only default.

### Part H — Education

### F32 Duolingo streaks: effective, ethically double-edged
- Claim: Duolingo's own writing says streaks drive early habit via visible progress and later via loss aversion; retention is most fragile in the first 7 days; reaching a 10-day streak correlates with much lower drop-off; leaderboards and notifications were the other two growth levers; they restrained notification volume after learning from another company's opt-out collapse. Mitigations: Streak Freeze (equipping two lifted daily active learners 0.38%), richer extend-streak animation (+1.7% new-learner retention), simplifying the streak to one lesson per day after entangling it with XP confused users, letting users choose their commitment, copy tests (600+ streak experiments; "commit to my goal" beat "continue"). Duolingo itself notes breaking a streak can demotivate and discourage starting one.
- Evidence: Duolingo blog (how streak builds habit) — T3 — VERIFIED; Lenny's (Jorge Mazal, former Duolingo CPO) growth article and "Behind the product: Streaks" — T3 — VERIFIED: CURR up 21% over four years, daily churn down over 40%, DAU 4.5x, leaderboards +17% learning time. All metrics are company-reported engagement metrics, not learning outcomes.
- Scope: product-specific; consumer habit app.
- Context (when it flips): fine for self-chosen, voluntary habits with forgiveness mechanics; harmful when the user is not the one benefiting (employees, parents, patients, borrowers) or when the loss mechanic is monetized through anxiety.
- Agent rule: IF you add a streak THEN make it user-chosen, forgiving (freeze/repair), simple (one clear daily action), and cap reminders; IF the audience is parents, students under 13, employees, or money users THEN do not import streaks, leaderboards or guilt copy.

### F33 ClassDojo: parent-facing simplicity = inline, one-tap translation
- Claim: Translate lets a parent convert announcements, stories, portfolios and messages with one tap into their language; built because >22% of US families do not speak English at home and teachers reported (75%) these parents were less engaged. Launched with 34 languages, available on web, iOS, Android.
- Evidence: ClassDojo blog — T3 (vendor claims) — VERIFIED. No independent usability research found on parent portals; search results were vendor marketing.
- Scope: product-specific; transferable to any parent/guardian app.
- Agent rule: IF the audience includes guardians with varied literacy/language THEN make translation and plain-language summaries one tap inside the message/announcement itself, keep the app task list short (announcements, messages, attendance/grades glance), avoid gamified behavior metrics visible to peers, and notify sparingly (F35).

### Part I — Enterprise / B2B

### F34 SAP Fiori for iOS: role-based, task-first structure
- Claim: five principles (role-based, delightful, coherent, simple, adaptive); role-based means show only what a person's job needs. Navigation: choose hierarchical (single content category, drill-down) or flat (tab bar, one tab per content category, optional search tab, profile on the right of the nav bar). Modal use: only for critical info needing acknowledgment, not for routine navigation; alerts max two actions; avoid stacking modal layers; keep modal tasks self-contained; follow swipe-down-to-dismiss on iPhone.
- Evidence: SAP Fiori for iOS (sap-design-system, navigation, modality) — T1 — VERIFIED.
- Scope: iOS (principles universal).
- Agent rule: IF the app serves job roles THEN derive tabs from the role's top tasks and hide the rest; use hierarchical navigation for deep single-domain data and flat for multi-domain; modals only for decisions.

### F35 SAP list-report page type = the approval/task-list template
- Claim: use for a large list of items of the same object type; title includes a count ("Tasks (100)"); nav bar holds Filter/Add/Edit with 1-2 icon actions in compact width (1-3 in regular); search bar either always visible or hidden until pull-down; a filter feedback bar shows applied/frequent filters and each is tappable to remove; list cells must carry all key info so users can decide without opening; empty-after-filter needs placeholder text. Sort-and-filter form opens full screen in compact width and closes with a results button; use the feedback bar for contextual instant filtering and the form for complex filtering.
- Evidence: SAP list-report and filter-overview pages — T1 — VERIFIED.
- Corroboration: Baymard applied-filters (F15), Workday inbox (F36).
- Scope: universal enterprise lists.
- Agent rule: IF the screen is an inbox/queue THEN title with count, put key decision fields in the row, show applied filters as removable chips, use a full-screen filter form with a results button for heavy filtering, and handle empty/filtered-out states explicitly.

### F36 Workday inbox and approvals
- Claim: mobile approvals follow inbox -> item -> action buttons (Approve / Send Back / Deny) at the bottom; the newer My Tasks inbox adds bulk approve for eligible items, Simple vs Detailed density, keyword search (called the biggest improvement), filters, sorts (Newest, Oldest, Due Soonest), delegation shortcut.
- Evidence: Commit Consulting blog — T4 vendor-affiliated — VERIFIED; university/state quick-reference guides — SNIPPET.
- Scope: product-specific.
- Context: bulk approve is safe only for low-risk, uniform items.
- Agent rule: IF building approvals THEN row = requester, type, amount/date, due; detail = summary first, supporting data collapsible; three explicit outcomes (approve, send back with comment, reject); bulk approve only where policy allows; support delegation and search.

### F37 Salesforce mobile guidance: anti-carousel, anti-gesture-only
- Claim: avoid horizontally swiping tabs and carousels because content is easy to miss; if unavoidable, keep the last item reachable in 3-4 swipes; prefer vertical lists or cards; tables should collapse to tile lists on narrow screens; never make gestures the only path; minimum font 14 px (14/16/18/20 scale); contrast 4.5:1 for regular text and 3:1 for icons and large text (large = 24 px or 18 px bold); not all base components are mobile-ready (tabs do not stack).
- Evidence: Salesforce Mobile and Offline Developer Guide, accessible mobile design — T1 — VERIFIED.
- Corroboration: Baymard #957 avoid autorotating carousels on mobile homepages (VERIFIED list); WCAG 2.5.1.
- Scope: universal.
- Agent rule: IF tempted by swipeable tabs/carousels THEN use a vertical list, segmented control, or chips with scroll cue; ensure every swipe has a button.

### Part J — Cross-product behaviors

### F38 Skeleton/placeholder loading, with a threshold
- Claim: SAP says use skeletons only when the target layout is known and load time exceeds 1 s; placeholder shapes should match the real content type; avoid overly detailed placeholders; do not combine with other indicators; show feedback if loading is slow or fails; shimmer is black at 8% opacity sweeping left to right; text placeholders use five height options (13, 20, 28, 41, 57 pt). Uber Base lists a "preloading" state where a placeholder replaces most images and text; Workday Canvas ships a Skeleton component.
- Evidence: SAP skeleton-loading — T1 — VERIFIED; Uber Base States — T1 — VERIFIED; Workday Canvas component list — T1 — VERIFIED (existence only).
- Conflict/context: skeletons are not universally better than spinners (see Disagreements).
- Agent rule: IF content layout is known and p50 load > ~1 s THEN show matching skeleton; IF under ~1 s THEN show nothing/keep previous content; IF layout unknown or operation is a user action THEN use a progress indicator; always add timeout, error, retry.

### F39 Create is always reachable; placement varies
- Claim: Slack compose button (bottom right), Gmail Compose FAB, Notion Create tab, Linear top-of-screen Create Issue on every screen, Instagram moved create off the tab bar to the top.
- Evidence: 9to5Mac, Android Police, Notion Help, Linear changelog, Engadget — VERIFIED/SNIPPET as above.
- Scope: universal intent, product-specific placement.
- Agent rule: IF creation is a primary job THEN keep one persistent create affordance (FAB, tab, or top button) visible on top-level screens; choose placement by platform convention (FAB on Android, top-trailing or center tab on iOS) and test one-handed reach.

### F40 Bottom bar as the default top-level nav, with a discipline on count and overflow
- Claim: Slack, Teams, Notion, Linear, Google apps, SAP Fiori iOS (flat navigation), Instagram all use a bottom bar for top-level destinations. HIG: pick the number needed, avoid overflow "More", up to 5 on iPad for compact/regular consistency, badges only for critical info, dedicated search tab at the trailing end, and bottom accessories can minimize on scroll.
- Evidence: HIG tab-bars.json — T1 — VERIFIED (plus items above).
- Scope: universal on phones.
- Agent rule: IF 3-5 destinations are used often THEN bottom bar; IF more THEN rank, merge, or add a user-reorderable bar with profile/settings in a top menu; use badges sparingly (HIG) and give each tab an icon plus label.

### F41 Notification restraint
- Claim: HIG: do not send repeated notifications for the same thing, do not use them to tell people to do tasks, do not include sensitive info, use badges only for unread notification counts, give users control. Duolingo says it capped notification volume after seeing opt-outs hurt the channel. EU Commission lists push notifications among addictive-design features in TikTok.
- Evidence: HIG notifications.json — T1 — VERIFIED; Lenny's Duolingo — T3 — VERIFIED; EC — T1 — VERIFIED.
- Scope: universal.
- Agent rule: IF a notification is triggered THEN it must carry new, specific, glanceable information, be user-configurable by category, and never be a guilt or streak nag.

### F42 Native fidelity and platform parity trend
- Claim: Shopify announced (10 Sep 2026) moving the Shop app and others from React Native back to Swift/Kotlin, citing AI coding agents changing the cost of building twice and wanting fewer layers between code and platform capabilities; the Shop app was rebuilt in 12 weeks; principle: iOS and Android at feature parity at all times; business logic decoupled from UI. Linear built native iOS/Android; Reddit rebuilt its apps with Jetpack Compose and SDUI.
- Evidence: Shopify Engineering — T3 — VERIFIED; Linear changelog — T3 — VERIFIED; Reddit coverage — T3/T4 — VERIFIED.
- Scope: trend (tooling economics), not a UX rule.
- Agent rule: IF stack choice is open THEN prefer the stack that gives first-class access to platform components (sheets, tab bars, biometrics, Live Activities); if cross-platform, wrap platform primitives rather than re-drawing them.

---

## Cross-product consensus (patterns appearing in >=3 unrelated products)

| # | Pattern | Seen in (tag) | Strength |
|---|---|---|---|
| C1 | Bottom bar of 3-5 top-level destinations, hamburger retired | Slack, Teams, Notion, Linear, Google apps, Instagram, SAP Fiori iOS (all VERIFIED); Airbnb mobile web, Spotify (SNIPPET) | Strong |
| C2 | Non-modal bottom sheet for secondary content over a primary canvas, with detents | Uber Base, Google Maps (via M3/NN/g), Apple HIG (Notes, Maps-style), Airbnb map (VERIFIED/SNIPPET) | Strong |
| C3 | Persistent, always-reachable create action | Slack, Gmail, Notion, Linear, Instagram (changed placement) | Strong on intent, none on placement |
| C4 | Persistent mini-player / accessory above tab bar | Apple Music (HIG), YouTube, Spotify, M3 audio-player sheet | Strong |
| C5 | Swipe row actions + Undo | Gmail, Telegram, Slack, Things, Linear inbox (icons) | Strong usage, but must have visible twin (WCAG/HIG/Salesforce) |
| C6 | Optimistic action + visible pending state + reversal window | Linear, WhatsApp ticks/clock, Gmail undo | Medium-strong |
| C7 | Applied-filter chips visible above list | Baymard recommendation, SAP filter feedback bar, Airbnb categories (as scoped filters, inferred) | Medium |
| C8 | Search made prominent / own tab | Slack Jump To, Notion Search, HIG search tab, Google search pill | Medium |
| C9 | Skeleton placeholders for known layouts | SAP, Uber Base, Workday Canvas | Medium (threshold-bound) |
| C10 | Server-driven feed/layout and flag-isolated core flows | Reddit, Monzo, Uber | Medium (engineering) |
| C11 | Platform-native chrome (tabs, sheets, biometrics) over custom | Shopify (back to native), Linear (native + custom glass respecting accessibility), SAP (follows HIG), Reddit Compose | Trend + T1 |

Not consensus (do not generalize): pull-to-refresh (no source fetched; MEMORY only, appears in most feeds), empty-state CTAs (only SAP's "placeholder text when filter returns nothing" verified), FAB vs top-button vs tab for create.

## Category-specific conventions

- Finance/trust: show fee + rate + total together, live (Wise study, FTC hidden-fee category); itemized total with named payee (Apple Pay); transaction rows merchant-first with de-duplication and stable ordering (Monzo); per-use authentication with explicit confirmation for money movement (Android, HIG); glanceable front with one primary value (Wallet); chart headline + accessibility (HIG). No verified source for amount sign/currency formatting; see Gaps.
- Messaging: five-state send model with clock/ticks and message-info detail (WhatsApp); hold-to-record with lock and cancel plus non-gesture twin; swipe actions in chat list; composer keeps a persistent shortcut entry (Slack bolt).
- Commerce: sticky summary + CTA (Baymard), applied-filter chips, 4 core sorts, buttons not dropdowns for size, shipping estimate on PDP, quantity stepper replacing Add in grocery, express payment first (HIG).
- Maps/mobility: sheet over map with 3 detents and visible close; map reacts to context (Airbnb categories); ETA and status on lock screen (Uber Live Activity-like).
- Media: persistent mini-player accessory above the tab bar that expands to a now-playing sheet; resume semantics on interruptions; automated offline with storage cap.
- Enterprise: task-first, role-based IA; list-report with count in title and decision-ready rows; approvals with explicit Approve / Send Back / Reject; avoid carousels and gesture-only; density option (Simple/Detailed); search as top inbox feature.
- Education/parent-facing: inline one-tap translation, announcements + messages first, minimal gamification, restrained notifications.

## Main pattern table

| Pattern | Seen in | Principle | Use when | Avoid when |
|---|---|---|---|---|
| Bottom tab bar (3-5) | Slack, Teams, Notion, Linear, Google, SAP | Recognition over recall; one-thumb reach | 3-5 frequent destinations of equal rank | >5 equal items (use sidebar/reorderable bar); single-task apps |
| Non-modal bottom sheet, 3 detents | Uber Base, M3, HIG, Google Maps | Two related surfaces at once; progressive disclosure | Details/results over map, canvas or list | Multi-step flows, long forms, content needing full attention |
| Modal sheet / dialog split | Uber Base, M3, SAP | Interrupt only when needed | Dialog: 2-3 options, short; sheet: scrolling or reference needed | Routine navigation (SAP) |
| Visible close + gesture dismissal | NN/g, Uber Base, M3 | Swipe is a shortcut; explicit control is the baseline | Every sheet | Never remove the explicit control |
| Persistent create | Slack, Gmail, Notion, Linear | Reduce time-to-capture | Capture/compose is the main job | Read-only/monitoring apps |
| Mini-player accessory | HIG Music, YouTube, Spotify | Continuity while browsing | Media continues across screens | Short clips that end quickly |
| Swipe row actions + Undo | Gmail, Telegram, Things | Speed for experts | 1-3 frequent actions, plus visible twin | Gesture is the only path; destructive without undo |
| Undo window instead of confirm | Gmail | Recoverability beats interruption | Frequent reversible actions | Money movement, irreversible erasure |
| Optimistic UI + outbox | Linear, WhatsApp | Perceived performance; trust via visible state | Small frequent low-reject edits | Payments, server-validated writes |
| Applied-filter chips | Baymard, SAP | Visibility of system state | Any filtered list | Single-filter lists |
| Full-screen filter form + "Show N" | SAP, Baymard (snippet) | Batch heavy input, see result count | Many facets | Quick 2-3 filters (use inline chips) |
| Sticky summary + CTA | Baymard | Keep primary action in reach | Long PDP with variants | When it hides total cost or duplicates visible CTA |
| Quantity stepper replaces Add | Baymard grocery | Confirm state in place | Repeat-add contexts | One-off purchases |
| Fee + rate + total live | Wise (study), Apple Pay | Transparency builds trust | Any paid flow | Never hide mandatory fees |
| Per-use auth for sensitive acts | Android, HIG | Match friction to risk | Transfers, credential change | Low-risk reads (use passive biometric) |
| Message status ticks | WhatsApp | Feedback, accountability | Messaging, send flows | When social pressure harms (offer opt-out) |
| Hold-to-record + lock | WhatsApp, Telegram | One-handed capture | Voice/video notes | Without tap alternative |
| Skeleton (>1 s) | SAP, Uber | Perceived progress with known layout | Known layout, load >1 s | Fast loads, unknown layout, actions |
| Infinite scroll | TikTok, feeds | Frictionless browsing | Leisure feeds of homogeneous items | Task/search/compare lists; minors without breaks |
| Streaks + freeze | Duolingo | Habit formation via commitment | Self-chosen voluntary habit | Enterprise, finance, parent apps, guilt copy |
| Role-based task-first IA | SAP, Workday | Show what the job needs | Enterprise mobile | Consumer exploration apps |
| Inline translation | ClassDojo | Remove language barrier at point of reading | Multilingual guardians/users | Legal text where translation is non-binding (add disclaimer) |
| Server-driven layout | Reddit, Monzo | Ship UI without releases | Feeds with frequent layout change | Offline-first or highly interactive screens |

## Numbers table

| Value | Applies to | Source | Tag |
|---|---|---|---|
| Collapsed detent 10-30% screen height | Sheet | Uber Base | VERIFIED |
| Middle detent 40-80% screen height (default start) | Sheet | Uber Base | VERIFIED |
| Expanded detent: 60 px below status bar (default); near-full/full custom | Sheet | Uber Base | VERIFIED |
| Narrow breakpoint < 600 -> bottom-anchored; wide -> side sheet | Sheet | Uber Base | VERIFIED |
| Grabber tap area >= 48 px high; iPhone home-indicator area 34 dp | Sheet | Uber Base | VERIFIED |
| Sheet motion 400 ms; in cubic-bezier(0.23,1,0.32,1); out cubic-bezier(0.86,0,0.07,1) | Sheet | Uber Base | VERIFIED |
| Modal sheet initial height <= 50% of screen | Modal bottom sheet | M3 | VERIFIED |
| Medium detent ~ half expanded height | iOS sheet | HIG | VERIFIED |
| Sheet title truncates after 2 lines (config up to 3) | Sheet header | Uber Base | VERIFIED |
| Pressed overlay 8% black / 20% white; hover 4% / 10%; focus ring 3 px; disabled image 40% opacity; selected contrast 3:1 | Interaction states | Uber Base | VERIFIED |
| Skeleton threshold > 1 s; shimmer black 8% opacity L->R; text placeholder heights 13/20/28/41/57 pt | Loading | SAP Fiori iOS | VERIFIED |
| Nav-bar actions: compact 1-2 icons, regular 1-3 | List report | SAP Fiori iOS | VERIFIED |
| Min font 14 px; scale 14/16/18/20 px | Mobile web in Salesforce | Salesforce | VERIFIED |
| Contrast 4.5:1 text; 3:1 icons/large text; large = >=24 px or >=18 px bold | Mobile | Salesforce | VERIFIED |
| Last carousel/tab item reachable in 3-4 swipes (else avoid) | Carousels | Salesforce | VERIFIED |
| Apple Pay button >= 100x30 pt; Donate >= 140x30 pt; margin 1/10 of height | Checkout | HIG | VERIFIED |
| Wallet icon 38x38 pt; logo 50-160 x 50 pt; strip 375x144 pt | Passes | HIG | VERIFIED |
| Undo-send window 5/10/20/30 s | Email | Gmail Help | VERIFIED |
| Video note max 60 s | Messaging | WhatsApp blog | VERIFIED |
| Downloads for You cap 1/3/5 GB | Offline | TechCrunch/MakeUseOf | SNIPPET |
| 78% mobile sites poor/mediocre product lists; 69% lack all 4 sorts | Commerce | Baymard | VERIFIED |
| 38% mobile sites decent PDP (48% desktop; apps 36%) | Commerce | Baymard | VERIFIED |
| 28% (or 20%) sites lack applied-filters overview | Commerce | Baymard (two articles) | VERIFIED, conflicting |
| Keyboard removes ~40% of viewport in checkout; interruptions every ~20 min (some 4.5 min) | Mobile commerce | Baymard | VERIFIED |
| 57% sizes by dropdown; 67% no shipping estimate; 81% no unit price | PDP | Baymard | VERIFIED |
| Streak animation +1.7% new-learner retention; two freezes +0.38% DAU; CURR +21% in 4 y; leaderboards +17% learning time | Duolingo | Duolingo blog, Lenny's | VERIFIED (company-reported) |
| Feed load 12% faster with SDUI | Reddit | InfoQ | VERIFIED |
| Core rider availability target 99.99% | Uber | Uber blog | VERIFIED |
| ~4M homes categorized; 55 (or 56) categories; ~40% more listings (Split Stays) | Airbnb | Airbnb news | VERIFIED |
| Wise 3:39 vs Revolut 7:06; 70% vs 30% correct total (n=20) | Fee transparency | Lyssna | VERIFIED, weak |
| EC preliminary finding date 6 Feb 2026 | TikTok DSA | EC | VERIFIED |
| Shop app rebuilt native in 12 weeks; announced 10 Sep 2026 | Shopify | Shopify Eng | VERIFIED |

## Comparison tables

Sheet dismissal models
| Model | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Swipe down only | Natural, fast | Inaccessible to many (NN/g, M3, Uber) | Never alone | Always |
| Explicit X/Cancel + swipe | Accessible and fast | Slightly more chrome | Default | - |
| Scrim tap + X | Familiar on modal | Accidental loss of input | Modal sheets without unsaved data | Forms with unsaved changes (HIG: confirm via action sheet) |

Create affordance placement
| Placement | Example | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|---|
| FAB bottom-right | Slack, Gmail | Thumb-reachable, platform-native on Android | Covers content | Single dominant create action | Multiple equal creates |
| Center/tab slot | Notion | Visible with nav | Costs a tab | Create is frequent | >4 tabs |
| Top-of-screen button | Linear, Instagram new | Frees bottom bar | Harder one-handed reach | Many creates, tab-limited | Large phones one-handed |

Infinite scroll vs alternatives
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Infinite scroll | Low friction (NN/g) | Refinding, footer, compulsion (EC) | Leisure feeds | Tasks, comparison, minors without breaks |
| Load more + lazy load | Footer reachable, user control (NN/g) | One tap per batch | Search results, catalogs | Pure entertainment feeds |
| Pagination | Landmarks, refinding | More taps | Catalogs, admin lists | Casual browsing |

Optimistic vs pessimistic updates
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Optimistic + outbox | Instant feel | Rollback UX needed | Triage/toggles | Money, destructive |
| Delayed commit + undo | Safe and quick | Delay on side effects | Send/archive | Real-time side effects |
| Pessimistic + progress | Truthful | Slower feel | Payments | Frequent micro-edits |

## Anti-patterns found (problem -> why -> better -> source)

1. Gesture-only shortcuts (swipe-to-reply, hold-to-lock, swipe-to-reveal date field) -> speed for experts, ignores motor/assistive users -> keep visible twin controls, gestures as shortcuts -> WCAG 2.5.1/2.5.7, HIG gestures, Salesforce — VERIFIED. Things' documented NL-date path starts with a swipe; confirm a tap path exists.
2. Horizontal swipe tabs/carousels for essential content -> low discoverability, missed content -> vertical list/chips with visible scroll cue; if a carousel, reach last item in 3-4 steps and add buttons -> Salesforce, Baymard #957 — VERIFIED.
3. Infinite scroll on task screens -> no landmarks, footer unreachable, refinding hard -> Load more / pagination, restore scroll position -> NN/g — VERIFIED.
4. Engagement-driven feed design (infinite scroll + autoplay + push + hyper-personalization) -> compulsive use; now a regulatory risk in the EU -> breaks, caps, user-controllable feeds -> EC finding — VERIFIED (preliminary).
5. Streak guilt + loss aversion as a retention lever -> anxiety, burnout; monetizing anxiety -> forgiveness mechanics, user-chosen goals, restraint -> Duolingo own caveats — VERIFIED; wellbeing critiques are T4 (SNIPPET).
6. Hidden or late fees, fake urgency, hard cancellation -> trust loss, FTC enforcement category -> upfront totals, easy cancel -> FTC press release; deceptive.design types — VERIFIED.
7. Overflow "More" tab hiding frequent destinations -> out of sight -> rank/merge or put profile/settings in a top menu -> HIG — VERIFIED.
8. Translucent glass over dense content without accessibility fallbacks -> legibility -> no refraction, solid outlines under Increase Contrast -> Linear, HIG tab-bar color guidance — VERIFIED.
9. Stacked sheets and sheets for complex flows -> disorientation -> single sheet or full screen -> NN/g, HIG, Uber — VERIFIED.
10. Static Add button in repeat-add contexts -> users cannot see what is in cart -> stepper in place -> Baymard — VERIFIED.
11. Disabling or hiding express pay when unavailable -> confusion -> show it and explain on tap -> HIG Apple Pay — VERIFIED.
12. Badges for non-notification data; repeated notifications for the same event -> badge blindness, opt-outs -> notification-only badges; one notification per event -> HIG — VERIFIED.
13. Mixed-type lists under one list-report (people + tasks) -> unclear actions -> separate object types -> SAP — VERIFIED.
14. Optimistic UI for payments -> user acts on false confirmation -> pending state + server confirmation -> principle; WhatsApp clock icon model as inspiration — VERIFIED for clock icon.

## Trendy-but-weak patterns seen in these apps (do not import by default)

| Trend | Where | Why weak | Evidence status |
|---|---|---|---|
| Auto-minimizing tab bar / bottom accessory on scroll | iOS 26 tab bars (HIG), Apple Music, YouTube miniplayer tuck | Hides navigation; no usability study found that shows a net benefit; platform feature, so acceptable when return-on-scroll-up/tap is clear | HIG documents it VERIFIED; benefit evidence none (opinion) |
| Reels/algorithm-first home with create demoted | Instagram 2025 | Optimizes engagement; "takes time to get used to" per Meta | VERIFIED (Engadget) |
| Streaks, leaderboards, mascot guilt | Duolingo | Fine in a voluntary habit app; harmful elsewhere | VERIFIED company; ethics T4 |
| Over-containerization, oversized buttons | M3 Expressive in Google apps | Density loss, comic proportions per one critic | T4 opinion |
| Custom glass/frosted nav | Linear, Gmail Chat, iOS 26 | Legibility risk in dense UIs; Linear omitted refraction | VERIFIED |
| Sticky CTA "5-15% uplift" claims | Shopify-theme/vendor blogs | Non-independent; Baymard supports the rationale, not these numbers | SNIPPET |
| Server-driven UI as universal fix | Reddit, Monzo | Moves complexity to backend; offline weak | VERIFIED (tradeoff stated) |
| AI/agent-written native rewrites | Shopify | Tooling story, not UX | VERIFIED; do not generalize |

What NOT to import into enterprise/utility apps: engagement streaks and leaderboards, autoplay/infinite feeds, algorithmic tab reorder, guilt-based push copy, social read-receipt pressure (unless needed for work accountability), full-bleed immersive chrome that hides nav, gesture-only flows.

## Disagreements & weak-evidence zones

- Skeleton vs spinner: SAP says skeleton only when layout known and wait >1 s; other slices may cite NN/g for "skeletons not always better". Keep the threshold rule.
- Applied filters missing: 28% vs 20% (Baymard articles of different dates).
- Airbnb category count 55 (company release) vs 56 (secondary coverage).
- Sheet dismissal: HIG treats swipe-to-dismiss as expected; NN/g, Uber and M3 insist on an explicit visible control too. Resolution: support both.
- Tab overflow: HIG discourages "More"; Teams and Linear use overflow/customization successfully for power users. Context: role-based enterprise apps vs consumer.
- Wise transparency study: n=20, web, vendor-run; direction is plausible and consistent with FTC and HIG principles but the effect size is not reliable.
- Duolingo effect sizes are company-reported engagement, not learning outcomes; "streaks help learning" is unproven here.
- Linear sync details: from a community reverse-engineering of the web client; native mobile apps may differ.
- Slack/Instagram tab changes show IA churn; no published usability data on either change.
- Auto-hiding bars: no empirical source in this slice; treated as opinion.
- Workday evidence is vendor/consultancy and quick-reference guides; weakest enterprise source.

## Gaps (could not verify)

- Money formatting (sign, currency placement, tabular numerals, negative styling) and masked-data conventions: no product source fetched; defer to the typography/formatting slice and platform locale APIs.
- Revolut, Cash App, PayPal, Chime, N26: no credible first-party or research source found (only portfolio case studies; excluded as T5-like).
- Amazon, Etsy, Instacart, DoorDash, Booking, Expedia, Citymapper: not sourced.
- Instagram Stories, composers, TikTok full-screen paging, X: no first-party source fetched (EU finding covers TikTok's design critique only).
- iMessage, Signal, Messenger: not sourced. Voice-note lock/cancel for WhatsApp and Telegram is SNIPPET only (official help page was blank in the Browser pane).
- Google Classroom, Khan Academy, Coursera, Quizlet, Seesaw, Schoology, PowerSchool: not sourced; parent-portal search returned vendor marketing, so attendance/grades UX has no research backing here.
- HubSpot, Asana, Jira, ServiceNow, Zoho mobile: not sourced. Workday Canvas site is web-focused.
- Spotify and YouTube first-party design sources: not found; mini-player claims for them rely on news (T4).
- Wise docs (Neptune/wise.design) unreadable (redirect to 404); Medium blogs blocked (403); Slack engineering post not found.
- Baymard guideline text on "do not use a full-width sticky button" is only a snippet.
- WebSearch quota exhausted at 200; some planned searches (NN/g banking, Apple Wallet UX studies, Google Wallet, PayPal) were not run.
- MEMORY items: none used as evidence except where marked; pull-to-refresh is noted as widespread but unsourced.
