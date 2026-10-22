# UX writing and microcopy

Read this when: writing or reviewing any UI string: buttons, labels, errors, validation, confirmations, empty states, onboarding, permission rationales, notifications, loading text, destructive dialogs, dates/numbers, or localizing.

Tags: `[P-iOS]` `[P-AND]` platform · `[R]` research · `[C]` consensus across design systems · `[H]` heuristic. Sources: Apple HIG Writing/Alerts/Notifications, Microsoft Writing Style Guide and Win32 error guidelines, Polaris content guidelines, Atlassian messaging guidelines, GOV.UK Design System, Carbon, Mailchimp Content Style Guide, Google developer style guide, NN/g, CLDR. Research date 2026-10-06.

Principles: **concise, human, specific, actionable, consistent, contextual.** Every string answers: what happened, what it means for me, what can I do next.

Contents: 1 Voice and tone · 2 Buttons and labels · 3 Errors and validation · 4 Confirmations and destructive actions · 5 Empty states and onboarding · 6 Permission rationales · 7 Notifications · 8 Loading and status text · 9 Length budgets · 10 Capitalization · 11 Localization · 12 Dates, numbers, time · 13 Inclusive language · 14 Before/after examples · 15 Anti-patterns · 16 Evidence limits

---

## 1. Voice and tone

- One voice, a tone that shifts with the user's state: errors = calm/neutral, success = brief/warm, destructive = serious/precise, first use = encouraging. Humor never in errors, payments, health or security. Microsoft: warm, relaxed, crisp, clear, ready to lend a hand. Mailchimp: plainspoken, genuine; "more important to be clear than entertaining". HIG: determine voice from the audience, keep a terminology list, read it aloud. NN/g "3 Cs": clarity, concision, character (character lowest priority); reading level ~6th-8th grade; users read only ~20-28% of page text. `[R][C]`
- Positions on loaded words (all verified in design-system docs): **"Sorry"**: Microsoft only for serious product-caused problems (data loss, can't continue); Atlassian avoids "please/sorry"; Polaris: don't over-apologize; GOV.UK avoids it in field messages. **"We"**: HIG avoids (ambiguous); Polaris avoids unless the company caused the problem. **"Please"**: Microsoft and Atlassian avoid (makes required actions sound optional). **"Oops"/humor**: HIG, GOV.UK, NN/g avoid; NN/g: humor goes stale. **Blame**: accountability on the system, never the user ("Couldn't save", not "You entered…"). Default: neutral, specific, active voice, no exclamation marks or emoji; apologize once, in the headline, only for serious product-caused failures. `[C]`
- Mailchimp/Microsoft: write for translation: short simple sentences, include articles and "that"/"who", avoid idioms, spell out metric units.

## 2. Buttons and labels

- **Verb-first, specific**: "Send invoice", "Save changes", "Delete project". Avoid "OK", "Submit", "Yes/No" (Yes/No only to answer a question; Microsoft). Alert buttons are 1-2 words, action verbs; "Cancel" always for cancelling (Cancel stops, Close closes). Polaris: {verb}+{noun} except Save/Close/Cancel/OK; drop articles ("Add menu item"); predictable ("Create order", not "New order"; "Buy shipping label", not "Buy"). GOV.UK: sentence case; "Continue" vs "Save and continue" only if data actually saves; "Pay", "Confirm and send". Flows: Continue/Next/Done; "Get Started" to begin. Avoid vague "Learn more"/"Click here"/"Shop now": describe destination/benefit (NN/g, HIG: "Learn more about UX Writing" over "Click here"). On touch say "tap", not "click". `[P-iOS][C]`
- Tab labels: single words (HIG), 1-2 words, plain language, no ALL CAPS (NN/g). Navigation items always keep a visible label.
- Settings descriptions describe the "on" state; switch labels name the feature and what "on" does; avoid "on/off" text (HIG). Avoid "disable/disabled" for features: use "turn off" (Polaris).
- Titles: nav titles < ~15 characters, never the app name (HIG); alert titles direct, ~2 lines max, message only if it adds value; say the object ("Delete 'Q3 budget'?").

## 3. Errors and validation

- **Formula**: [specific problem in the user's objects/numbers] + [cause only if known and useful] + [exact next step] + [one action]. Title ≤ 3-4 words if used; body ≤ 2 sentences; CTA 1-2 words (Atlassian). Place the message next to the problem; icon + text + color. `[R][C]`
- GOV.UK patterns: empty → "Enter your first name"; wrong format → "Enter an email address in the correct format, like name@example.com"; length → "Name must be 35 characters or less"; one message per failure type; echo the question; avoid "forbidden/illegal/sorry/invalid". HIG: instructional beats blame: "Choose a password with at least 8 characters" beats "That password is too short"; avoid "oops/uh-oh", "we", bare "Error", codes. Microsoft: separate message per known cause; avoid "bad" and "please"; generic only when the cause is unknown. Baymard: "Your card number is incomplete" beats "invalid".
- Generic fallback ("Something went wrong") is a last resort and must still carry an action ("Something went wrong. Refresh to try again."). You almost always know: offline vs timeout, HTTP class, which object, whether data was saved. Map status → template (offline, timeout, 401, 403, 404, 409, 422 field errors, 429, 5xx). Never show raw status codes; support IDs only in secondary text with Copy.
- Service-problem pages (GOV.UK): "Try again later", no "500", say what happened to entered answers, give a contact route. 404: "This page isn't available. Check the address or go back."
- Rate limit: "Too many attempts. Try again in 2 minutes." (honor `Retry-After`). Session expiry: "You've been signed out. Sign in to continue; your draft is saved."

## 4. Confirmations and destructive actions

- Name the object and the consequence; label buttons with the verbs; destructive style on the destructive verb; Cancel always present, not default. "Delete 'Q3 budget'? This permanently deletes the file for everyone it's shared with. You can't undo this." [Cancel] [Delete file]. Max three buttons (HIG); "Are you sure?" with Yes/No is the anti-pattern (NN/g). Reversible actions: no dialog: do it and show "<Object> deleted" [Undo]. Catastrophic: typed confirmation of the name/word.
- Save prompts: "Save changes to 'Draft'?" [Don't save] [Cancel] [Save].
- Success confirmations: noun + verb ("Profile updated"), 3-4 word title (Atlassian), no "successfully", no "Success!", result + how to undo + next step; lighter on frequent actions.

## 5. Empty states and onboarding

- Empty state: positive title with benefit ("Track your first expense", not "You don't have any expenses"), 1-2 sentences saying what belongs here and why it helps, one verb+noun button. Never make users feel guilty (Polaris). Search no-results: echo the query ("No results for 'blue sneekers'"), offer a fix ("Check the spelling or try fewer words") and a path. Filtered to zero: "No orders match these filters" [Clear filters]. Done state: "You're all caught up".
- Onboarding copy: value first, short, skippable, contextual hints over tutorials (NN/g: tutorials didn't improve task performance); defer ratings, purchases, non-essential setup (HIG). Never put essential information in empty states or transient UI (HIG: do not put crucial info there that will vanish).

## 6. Permission rationales

- Benefit, not feature; active voice; one specific sentence. Template (NN/g): "[App] would like to access your [resource] so that you can [benefit]." HIG purpose strings: "The app records during the night to detect snoring sounds." Tan et al. 2014 (via NN/g): a purpose string gave 12% more grants; best vs worst rationale an 81% lift. iOS pre-permission screen has ONE button ("Continue"/"Next"), no incentives, no "Allow" mimicry.
- Denied: "Camera access is off. Turn it on in Settings to scan receipts." [Open Settings] [Not now]: user-initiated, only when the user tries the blocked feature.

## 7. Notifications

HIG: title short, no period; body complete sentences in sentence case, don't truncate manually; hidden-preview text 1-2 words ("New comment"); ≤ 4 actions; don't add a button that merely opens the app; no sensitive data; errors go to in-app alerts. Specific and glanceable: "Sam commented on 'Q3 plan'", not "You have a new notification!". Platforms document no visible-character budgets: front-load the key fact in the first ~40-50 characters, body ≲ 120-150 `[H]`.

## 8. Loading and status text

Verb-ing + object when longer than a second ("Syncing your photos"); counts when known ("Syncing 3 of 12 photos"); no text for tiny loads. Button in flight: "Saving…" then "Saved". Avoid vague "Loading"/"Authenticating" (HIG), "Please wait" (Microsoft), and time promises ("This will only take a moment") unless true. Offline: "You're offline. Changes will sync when you reconnect." Offline banner: calm, specific.

## 9. Length budgets (verified where cited)

Alert button 1-2 words (HIG) · message CTA 1-2 words (Atlassian) · toast action 1 verb (Polaris) · toast ≤ 2 lines (Material/Android 12/Carbon) or ≤ 3 words (Polaris strict) · error title 3-4 words, body 1-2 sentences (Atlassian) · banner body 1-2 sentences (Polaris) · tooltip 60-75 characters (HIG macOS/visionOS) · alert title ~2 lines (HIG) · nav title < ~15 characters (HIG) · notification body: no documented limit.

## 10. Capitalization

Six design systems (Google, Polaris, Atlassian, GOV.UK, Mailchimp, Microsoft) use **sentence case**; M3 does too (memory). HIG allows either but says pick one per element type (title case = formal; alert/action buttons and notification titles are title-style; notification body sentence-style). Cross-platform default: sentence case everywhere; on iOS-native chrome (alert buttons, nav titles, tab labels) follow HIG title case when using native components. Never ALL CAPS; don't mix per element type.

## 11. Localization and i18n

- Externalize every string with full sentences and named or positional placeholders (`%1$s`); never concatenate fragments; use ICU/CLDR plurals (six categories: zero, one, two, few, many, other; Arabic and Welsh use all six); never "item(s)"; don't use plurals for non-grammatical counts ("Inbox (12)"). Android `plurals` quantity strings.
- Text expansion (IBM via W3C): translated length as a percent of English (IBM via W3C): up to 10 characters 200-300%; 11-20 180-200%; 21-30 160-180%; 31-50 140-160%; 51-70 151-170% (as printed, likely a typo); > 70 130%. The popular "30-40%" fits only long sentences; short labels can triple. Design containers for ≥ 200% expansion on short labels: wrap or flex, no fixed widths.
- RTL (HIG): flip directional controls (sliders, progress bars), back/next, direction-implying icons; do NOT reverse digit order within numbers, phone or card numbers; don't flip logos, checkmarks, photos, real-world object icons; align 3+ line paragraphs to the text language, not UI direction; numerals follow the locale. The "+2 pt font for Arabic/Hebrew beside uppercase Latin" claim is from a summary: verify before using. Mirror layout for RTL except digits/logos/checkmarks.

## 12. Dates, numbers, time

Use platform/`Intl.*` formatters, never hand-built strings. `Intl.RelativeTimeFormat` with `numeric:'auto'` gives "yesterday" (baseline since Sep 2020). Polaris timestamp ladder: < 1 min "Just now"; 1-60 min "13 minutes ago"; today "10:30 am"; yesterday "Yesterday at 10:30 am"; last 7 days "Friday at 10:30 am"; 7 days-1 year "Aug 14 at 10:30 am"; > 1 year "Aug 14, 2016" (Polaris's manual date rules are US-English only). Money: `Intl.NumberFormat(locale, {style:'currency', currency, signDisplay:'exceptZero'})` (accounting format for ledgers); currency as a 3-letter code where ambiguous; never rely on red/green alone for sign (add "-"/parentheses/"Credit/Debit").

## 13. Inclusive language

Plain language, gender-neutral, "you/your", avoid idioms/humor/metaphors and ableist terms (HIG Inclusion; Polaris; Atlassian). "Turn off" not "disable". Don't use "we" except for your company (HIG).

## 14. Before/after examples (30 scenarios; the rule each illustrates)

| # | Scenario | Before | After | Rule |
|---|---|---|---|---|
| 1 | Generic server error | "Something went wrong." | "Couldn't load your orders. Check your connection and try again." [Try again] | Specific object + cause + action |
| 2 | 5xx tone | "Oops! Something went wrong :(" | "Couldn't save your changes. Try again in a moment." [Try again] | No "oops", no emoji |
| 3 | Empty required field | "This field is required" | "Enter your email address" | Instruction formula |
| 4 | Wrong format | "Invalid email" | "Enter an email address in the correct format, like name@example.com" | Avoid "invalid"; tell the fix |
| 5 | Password rule | "That password is too short" | "Choose a password with at least 8 characters" | Instructional, not blame (use the real minimum your policy requires) |
| 6 | Card number | "Your card number is invalid" | "Your card number is incomplete" / "Enter the full number from the front of your card" | Adaptive messages |
| 7 | Payment declined | "Payment failed." | "Your bank declined this card. Try another card or contact your bank. Your cart is saved." | Cause (if safe) + recovery + preserved state |
| 8 | Destructive confirm | "Are you sure? [Yes] [No]" | "Delete 'Q3 budget'? This permanently deletes the file for everyone it's shared with. You can't undo this." [Cancel] [Delete file] | Name object + consequence; verb labels |
| 9 | Reversible delete | Confirm dialog | Perform now; snackbar "Conversation archived" [Undo] | Undo over confirm |
| 10 | Empty first use | "No items" | "Add your first expense" / "Track spending to see where your money goes." [Add expense] | Positive title, what/why/next, one CTA |
| 11 | No search results | "No results found" | "No results for 'blue sneekers'" / "Check the spelling or try fewer words." [Edit search] [Browse sneakers] | Echo query + alternatives |
| 12 | Filtered to zero | "No data" | "No orders match these filters" [Clear filters] | Explain why + recovery |
| 13 | Cleared inbox | "No messages" | "You're all caught up" | Restrained completion state |
| 14 | Permission rationale | "We need your location" | "Use your location to show pharmacies near you." | Benefit not feature; active voice |
| 15 | Permission denied | "Permission denied" | "Camera access is off. Turn it on in Settings to scan receipts." [Open Settings] [Not now] | Specific + user-initiated deep link |
| 16 | Button labels | "OK" / "Submit" | "Send invoice" / "Save changes" | Verb + noun |
| 17 | Loading text | "Loading…" | "Syncing 3 of 12 photos" | Specific + count |
| 18 | Button in flight | "Submit" (frozen) | "Saving…" (same width, taps ignored) then "Saved" | Immediate in-place feedback |
| 19 | Offline | "Network error" | Banner: "You're offline. Changes will sync when you reconnect." | Calm persistent + queued writes |
| 20 | Session expiry | "Error 401" | "You've been signed out. Sign in to continue; your draft is saved." | Preserve work |
| 21 | Rate limit | "429 Too Many Requests" | "Too many attempts. Try again in 2 minutes." | Honor Retry-After, plain language |
| 22 | Conflict | "409 Conflict" | "This changed on another device." [Review changes] [Keep mine] | Choice, no jargon |
| 23 | Partial batch | "Some items failed" | "12 of 15 photos uploaded. 3 couldn't upload." [Retry 3] | Counts + targeted retry |
| 24 | Success toast | "Your profile has been successfully updated!" | "Profile updated" | Noun + verb; no "successfully" |
| 25 | Not found | "404 Not Found" | "This page isn't available. Check the address or go back." | No codes/jargon |
| 26 | Save dialog | "Save changes? [Yes] [No]" | "Save changes to 'Draft'?" [Don't save] [Cancel] [Save] | Max 3 buttons, verb labels |
| 27 | Notification | "You have a new notification!" | "Sam commented on 'Q3 plan'" (hidden preview: "New comment") | Specific, glanceable |
| 28 | Plurals | "1 item(s) selected" | "1 item selected" / "3 items selected" via plural rules | CLDR plural categories |
| 29 | Relative time | "Updated 1 mins ago" | "Updated 1 minute ago" / "Just now" via `Intl.RelativeTimeFormat` | Formatter + ladder |
| 30 | Validation toast misuse | Toast: "Enter a valid phone number" | Inline under field: "Enter a phone number, like +44 20 7946 0000" | Errors adjacent to the field |

## 15. Anti-patterns

"Oops!", emoji, jokes in errors · blame ("You entered an invalid…") · "Invalid"/"Error"/raw codes · generic "Something went wrong" with no action · "OK/Yes/No/Submit" · "Are you sure?" · concatenated strings · "item(s)" · ALL CAPS · title case mixed with sentence case · "Please" and "we" · exclamation-heavy success ("Success!!") · fixed-width containers that break at +200% translation · promises of timing ("Just a moment") · error text only in a toast · placeholders as instructions.

## 16. Evidence limits

m3.material.io writing guidance unreachable; Material capitalization from memory. Notification visible-character budgets, FCM size and platform lock-screen line counts are undocumented or unverified. The RTL font-size tweak comes from a summary. Tan et al. 2014 figures are second-hand via NN/g. Polaris date rules are US-English only. The before/after rewrites are our synthesis built on the cited rules.
