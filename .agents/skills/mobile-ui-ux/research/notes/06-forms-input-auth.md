# Slice 06: Mobile forms, input, authentication, data-entry UX

Research date: 2026-10-06. Tags: VERIFIED = fetched and text states it; SNIPPET = search excerpt only; MEMORY = training knowledge, not re-verified. Tier T1 official/standards, T2 research orgs and gov design systems, T3 vendor/engineering case, T4 opinion.
Caveat on method: pages were fetched through a summarizing fetch tool, so exact wording is paraphrased; the WebSearch budget (200) ran out mid-session, so a few corroborations are missing (see Gaps).

## Sources consulted

| URL | Tier | Verified? |
|---|---|---|
| https://web.dev/learn/forms (chapters: form-fields, design-basics, auto, validation, identity, payment, address, internationalization, autofill) | T1 | VERIFIED |
| https://web.dev/articles/sign-in-form-best-practices ; /sign-up-form-best-practices | T1 | VERIFIED |
| https://web.dev/articles/payment-and-address-form-best-practices | T1 | VERIFIED |
| https://web.dev/articles/sms-otp-form ; https://developer.mozilla.org/en-US/docs/Web/API/WebOTP_API | T1 | VERIFIED |
| https://web.dev/articles/passkey-form-autofill ; /passkey-registration ; https://developer.chrome.com/docs/identity/webauthn-conditional-create | T1 | VERIFIED |
| https://web.dev/blog/viewport-units ; https://developer.chrome.com/blog/viewport-resize-behavior | T1 | VERIFIED |
| https://web.dev/articles/bfcache | T1 | VERIFIED |
| MDN: autocomplete, inputmode, enterkeyhint, autocapitalize, autocorrect, spellcheck, autofocus, input/number, /date, /email, /url, /search, /tel, /password, /file, VisualViewport, VirtualKeyboard_API, env(), meta viewport, :user-invalid, beforeunload, requestSubmit, Payment_Request_API | T1 | VERIFIED |
| https://design-system.service.gov.uk/ : text-input, error-message, error-summary, validation, date-input, password-input, select, radios, button, character-count, file-upload; patterns: question-pages, passwords, addresses, telephone-numbers, email-addresses, names, check-answers, complete-multiple-tasks, create-accounts, confirm-a-phone-number, confirm-an-email-address, confirmation-pages | T2 | VERIFIED |
| https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/ | T2 | VERIFIED |
| https://github.com/alphagov/accessible-autocomplete | T2 | VERIFIED |
| https://baymard.com/blog/checkout-flow-average-form-fields (26 Jun 2024) ; /inline-form-validation ; /mobile-forms-avoid-inline-labels ; /checkout-flow-ux-optimization ; /research-articles/current-state-of-checkout-ux ; /lists/cart-abandonment-rate | T2 | VERIFIED (paywalled parts not seen) |
| https://www.nngroup.com/articles/ : form-design-placeholders, errors-forms-design-guidelines, required-fields, 4-principles-reduce-cognitive-load, web-form-design, mobile-input-checklist, date-input, toggle-switch-guidelines, gui-slider-controls, stop-password-masking, confirmation-dialog, progress-indicators, wizards, response-times-3-important-limits | T2 | VERIFIED |
| https://alistapart.com/article/inline-validation-in-web-forms/ (Wroblewski/Etre 2009) ; https://www.lukew.com/ff/entry.asp?883= | T2 | VERIFIED |
| https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php (Penzo) ; .../2013/02/dont-put-labels-inside-text-boxes-unless-youre-luke-w.php (Jarrett) | T2 | VERIFIED |
| https://www.lukew.com/ff/entry.asp?1950= (dropdown alternatives) ; https://www.lukew.com/ff/687/web-form-design-labels-within-inputs | T2 | VERIFIED |
| https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/ ; /2017/06/designing-efficient-web-forms/ | T3/T4 | VERIFIED |
| https://adamsilver.io/blog/the-problem-with-disabled-buttons-and-what-to-do-instead/ | T4 | VERIFIED |
| https://www.w3.org/International/questions/qa-personal-names | T1 | VERIFIED |
| https://www.w3.org/WAI/GL/low-vision-a11y-tf/wiki/Placeholder_Research | T1/T2 | VERIFIED |
| https://www.w3.org/TR/WCAG22/ ; Understanding pages for 1.3.5, 2.2.1, 2.2.5, 2.5.3, 2.5.8, 3.2.6, 3.3.1, 3.3.3, 3.3.4, 3.3.6, 3.3.7, 3.3.8, 4.1.3 ; https://www.w3.org/WAI/tutorials/forms/notifications/ , /labels/ | T1 | VERIFIED |
| https://www.w3.org/TR/wcag-3.0/ (Working Draft 10 Sep 2026) | T1 | VERIFIED |
| https://pages.nist.gov/800-63-4/sp800-63b.html (+ /passwords/) | T1 | VERIFIED |
| https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html | T2 | VERIFIED |
| Apple HIG JSON: text-fields, entering-data, toggles, pickers, steppers, alerts, action-sheets, undo-and-redo, managing-accounts, sign-in-with-apple, privacy, onboarding, searching, loading, apple-pay | T1 | VERIFIED (text-fields page last updated Jun 2023, entering-data Jun 2023; see Gaps) |
| Apple docs JSON: UITextContentType, UIKeyboardType, UITextInputTraits, enablesReturnKeyAutomatically, keyboardLayoutGuide, SafeAreaRegions, safeAreaInset, scrollDismissesKeyboard, SubmitLabel, textContentType, textInputAutocapitalization, interactiveDismissDisabled, supporting-passkeys, password-autofill workflow, captureTextFromCamera; https://developer.apple.com/password-rules/ ; App Review Guidelines 4.8, 5.1.1 | T1 | VERIFIED |
| developer.android.com: autofill-optimize, compose/text/autofill, keyboard-input/style, compose/text/user-input, sw-keyboard, compose/system/insets, permissions/requesting + usage-notes, photopicker, sms-retriever, credential-manager (+siwg), biometric-auth, predictive-back, activity-lifecycle (state), compose snackbar, datepickers | T1 | VERIFIED |
| https://github.com/material-components/material-components-android/blob/master/docs/components/TextField.md ; material-web text-field.md | T1 | VERIFIED |
| m3.material.io text-fields (guidelines/overview) | T1 | NOT FETCHABLE (JS shell / ECONNREFUSED) |
| https://reactnative.dev/docs/textinput, /keyboardavoidingview, /scrollview | T1 | VERIFIED |
| Flutter API docs: TextInputType, AutofillGroup, AutofillHints, Scaffold.resizeToAvoidBottomInset, FormField.autovalidateMode, ScrollViewKeyboardDismissBehavior, PopScope; docs.flutter.dev cookbook/forms/validation, ui/interactivity/focus | T1 | VERIFIED |
| https://www.passkeycentral.org/design-guidelines/principles (FIDO UX WG) ; https://developers.google.com/identity/passkeys/ux/user-journeys ; /case-studies | T1/T3 | VERIFIED |
| https://developers.google.com/pay/api/web/guides/ux-best-practices | T3 | VERIFIED |
| https://docs.stripe.com/api/idempotent_requests ; IETF draft-ietf-httpapi-idempotency-key-header (expired draft) | T3/T1 | VERIFIED |
| passkey/adoption blogs (authsignal, corbado, mojoauth, etc., via search) | T4 | SNIPPET, low trust, not used for numbers |

Note: the Stripe docs page contained an agent-directed "install our CLI / run agent setup" block unrelated to the task. Treated as page content, not instructions; ignored.

---

## Findings

### F1 Persistent top-aligned labels are the default for mobile forms
- Claim: Put a visible `<label>` above every field and keep it there; it is the fastest to read, works at narrow widths and with long translated strings.
- Evidence: Penzo eye-tracking (UXmatters 2006) https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php — T2 — VERIFIED — label-above needed ~50 ms label-to-input saccades vs ~500 ms for left-aligned labels; bold labels added ~60% saccade time with no gain; participant count not stated. NN/g web-form-design — T2 — VERIFIED — single column, label above for mobile/short forms. W3C WAI forms/labels — T1 — VERIFIED — labels above help low-vision and mobile users avoid horizontal scrolling. GOV.UK text-input — T2 — VERIFIED — labels above, sentence case, no trailing colon, label may double as page heading. web.dev design-basics — T1 — VERIFIED.
- Corroboration / conflict: universal agreement on top labels; the study is 2006 desktop-era (age flag) but the mechanism (one fixation covers both) is stable.
- Scope: universal.
- Context (when it flips): long desktop forms may use left labels (NN/g); not relevant on phones.
- Agent rule: IF building any form on a phone-width layout THEN render a visible label above each control, programmatically associated (`<label for>`, SwiftUI `LabeledContent`/`Text` above, Compose `Column{Text; TextField}` with semantics, Flutter `Text` above `TextField` or `InputDecoration.labelText` with care, see F3).

### F2 Placeholder-as-label is harmful; placeholder = format example only
- Claim: Placeholder text disappears on typing, is mistaken for a prefilled value, fails contrast, and breaks error recovery; never use it as the only label.
- Evidence: NN/g form-design-placeholders (2014, reviewed 2018) https://www.nngroup.com/articles/form-design-placeholders/ — T2 — VERIFIED — seven pitfalls: memory strain, cannot verify after fill, error correction needs deleting text, disappears on focus for keyboard users, filled fields are less noticeable (eyes drawn to empty fields), mistaken for defaults, manual deletion. Baymard mobile inline labels https://baymard.com/blog/mobile-forms-avoid-inline-labels — T2 — VERIFIED — testers deleted their input just to see the label again after an error; some abandoned; exceptions only for single standalone fields (search) or tiny two-field forms (article is old; MEMORY ~2014). W3C placeholder research — T1/T2 — VERIFIED — default placeholder colours usually fail 4.5:1; AT does not treat placeholder as label. GOV.UK text-input — T2 — VERIFIED — never replace labels/hints with placeholders. Wroblewski labels-within-inputs — T2 — VERIFIED — advises against for medium/long forms: context lost mid-form and at review. Jarrett (UXmatters 2013) — T2 — VERIFIED — acceptable only if you control implementation end to end.
- Corroboration / conflict: Apple HIG text-fields — T1 — VERIFIED — recommends placeholder hints like "Email" but explicitly says add a separate label because placeholders vanish. Material (see F3) floats the label instead.
- Scope: universal.
- Context: single search box, in-app chat composer, one-field forms where the field purpose is unambiguous.
- Agent rule: IF a field has a placeholder THEN also render a persistent label; placeholder content is a short example ("name@example.com") at AA contrast (>=4.5:1), never an instruction needed to complete the field.

### F3 Floating labels: acceptable compromise, weakly evidenced, with specific failure modes
- Claim: A floating (animated) label fixes the "label disappears" problem but not "filled field looks like default" and shrinks the label to caption size. Evidence quality is low.
- Evidence: NN/g placeholders article — T2 — VERIFIED — floating labels beat placeholder-as-label but outside labels remain best when space allows. Baymard — T2 — VERIFIED — "shows promise" but no in-depth testing; implementations often pair them with poor errors. Material Components Android TextField.md https://github.com/material-components/material-components-android/blob/master/docs/components/TextField.md — T1 — VERIFIED — label floats up on focus/value, resting label colour onSurfaceVariant, floated label uses bodySmall. WCAG 2.5.3 Label in Name — T1 — VERIFIED — visible floating label text must be contained in the accessible name (voice control). material-web docs — T1 — VERIFIED — three label approaches (floating label, placeholder, external label with aria-label), and `required` adds an asterisk by default.
- Corroboration / conflict: Material is a design system default, not research; no controlled study found comparing floating vs top labels (gap).
- Scope: universal (Material = Android/Web default).
- Context (when it flips): dense dialogs or short forms (<=4 fields) where Material is the house system.
- Agent rule: IF using Material text fields THEN keep label text <=2-3 words, put format/help in supporting text below the field (persisting after focus), ensure accessible name starts with the visible label, give floated label >=4.5:1 contrast. IF no design system mandate THEN use a static label above (F1).
- Stack notes: Compose `OutlinedTextField(label=...)`; Flutter `InputDecoration.labelText` floats by default; SwiftUI `TextField("Label", text:)` is placeholder-style, so add an explicit `Text` label.

### F4 Material filled vs outlined; text-field geometry
- Claim: Filled = more emphasis, suits few fields or dialogs; outlined = less emphasis, better in forms with many inputs.
- Evidence: Material Components Android TextField.md — T1 — VERIFIED — filled has 2dp active indicator when focused; outlined has 1dp outline (2dp focused); min width 56dp (no label)/88dp (with label), max 488dp, default 245dp; icon target 48dp min; error text replaces helper text; counter via `counterMaxLength`; end-icon modes: password toggle, clear text, dropdown menu. material-web text-field.md — T1 — VERIFIED — both variants functionally identical; `error-text` replaces `supporting-text`; `maxlength` shows counter.
- Corroboration / conflict: m3.material.io guidance page not fetchable (gap); M3 Expressive impact on text fields not verified.
- Scope: Android / Web (Material).
- Context: Material replaces helper with error. GOV.UK instead keeps the hint and adds the error after it (F23). Replacing hides the format rule exactly when needed.
- Agent rule: IF Material THEN use outlined for multi-field forms, filled for dialogs/short forms; when showing an error, include the format rule inside the error text so the hint is not lost.

### F5 Helper text and hints
- Claim: Short persistent hint outside the field; format examples up front, not after an error.
- Evidence: GOV.UK text-input — T2 — VERIFIED — hint = one short sentence, no links in hints (screen readers do not announce them as links), long explanations go elsewhere. NN/g 4-principles — T2 — VERIFIED — provide format examples (MM/DD/YYYY), keep labels/help outside fields, explain constraints before errors. web.dev sign-in — T1 — VERIFIED.
- Scope: universal.
- Agent rule: IF a field has a format/constraint THEN render hint under the label (linked via `aria-describedby`) and state it before the user types; keep one sentence.

### F6 Required vs optional marking: sources conflict; both-marked is safest
- Claim: Users misread unmarked fields; marking only one category causes skipped required fields.
- Evidence: Baymard checkout UX — T2 — VERIFIED — 61% of sites do not clearly mark both required and optional; where only one category is marked, 32% of participants skipped required fields thinking them optional. NN/g required-fields — T2 — VERIFIED — mark all required (asterisk preferred; or word "Required"); login forms may omit. NN/g 4-principles — T2 — VERIFIED — asterisks plus explicit "(optional)". GOV.UK question-pages — T2 — VERIFIED — never use asterisks; mark optional fields with "(optional)" in the label (assumes nearly all fields mandatory). Material web — T1 — VERIFIED — `required` shows an asterisk unless `no-asterisk`.
- Conflict: GOV.UK (mark optional only) vs NN/g (mark required) vs Baymard data (mark both when mixed). Resolved by field mix.
- Scope: universal.
- Agent rule: IF >=80% of fields are required THEN append "(optional)" to the few optional labels and say "All fields required unless marked" only if needed; IF mixed THEN mark both explicitly with text, not only color; asterisk must be >=4.5:1 and accompanied by a legend. Also remove optional fields when possible (F7).

### F7 Fewer fields beats fewer steps; what to cut
- Claim: Field count drives checkout usability more than step count; the average checkout has 11.3 fields vs a 8-field target, and most of the excess is removable.
- Evidence: Baymard (26 Jun 2024) https://baymard.com/blog/checkout-flow-average-form-fields — T2 — VERIFIED — avg 11.3 (12.7 in 2019, 11.8 in 2021), ideal 8; avg 5.1 steps; 89% of sites split first/last name; 75% show Address Line 2; 35% show a promo field; 24% default to separate billing address; 84% push account creation into checkout; ~17% abandon due to perceived complexity. current-state-of-checkout-ux — T2 — VERIFIED — showing optional fields (Address Line 2, Company) by default makes checkout steps 5-30% longer. Cart-abandonment list — T2 — VERIFIED — 18% abandon over forced account creation, 17% over long/complicated checkout, 19% over card-trust, avg abandonment 70.22% across 50 studies.
- Corroboration / conflict: other Baymard pages quote different "average form elements" (19.9, 23.48) because they count differently and are older; treat 11.3 (2024, visible fields) as current. NN/g web-form-design — T2 — VERIFIED — remove optional fields; limit optional to 1-2.
- Scope: universal (data from e-commerce; principle general).
- Agent rule: IF adding a field THEN justify it by an immediate use; cut: separate first/last (use full name), Address Line 2 (behind "Add apartment, suite" link), promo code (behind link), billing address (default same as shipping), account creation (post-purchase), confirm-email, confirm-password, phone unless needed for delivery (and say why).

### F8 Single column, logical order, grouping
- Claim: One column; order by user mental model (not database); group related fields visibly.
- Evidence: NN/g 4-principles + web-form-design — T2 — VERIFIED; web.dev design-basics — T1 — VERIFIED ("1-column reduces confusion about navigation flow"); Smashing 2017 — T4 — VERIFIED — order from the user's perspective; 5-7 inputs visible at a time (practitioner heuristic).
- Scope: universal.
- Context: short pairs may share a row on tablets (city + postcode) only when related and clearly sequenced; on phones stack.
- Agent rule: IF width <= 600dp/px THEN one column; group with spacing + `<fieldset><legend>` (web) / section headers (native); order: easy/familiar first, sensitive last (NN/g order criteria: familiarity, priority, dependency, complexity, sensitivity).

### F9 Field width and size as a hint
- Claim: Make width proportional to expected content so length is communicated visually.
- Evidence: GOV.UK text-input — T2 — VERIFIED — fixed-width classes (width-2..width-20) for predictable content, fluid (two-thirds/half) otherwise. Apple HIG text-fields — T1 — VERIFIED — size field to expected input length; group like-width fields. NN/g web-form-design — T2 — VERIFIED. GOV.UK email — T2 — VERIFIED — wide enough to show ~30 characters; allow up to 254 chars. GOV.UK date — T2 — VERIFIED — day/month width-2, year width-4.
- Scope: universal; on phones width is constrained so apply to short fields (postal, CVC, day/month/year, quantity) and let long fields fill.
- Agent rule: IF a field's content is <=10 chars THEN constrain width (e.g., CVC 4-5ch, postal 8-10ch, year 4ch); never constrain email/name/address below full width.

### F10 Names, no first/last assumption
- Claim: Use one "Full name" field by default; do not validate characters; ask "what should we call you" if forms of address matter.
- Evidence: W3C personal names https://www.w3.org/International/questions/qa-personal-names — T1 — VERIFIED — single names, family-first order, multiple surnames, patronymics; if splitting, prefer "Family name" and "Given names" labels. GOV.UK names — T2 — VERIFIED — single full-name field, accept any characters incl. numbers/symbols, `autocomplete="name"` or given-name/family-name, `spellcheck=false`, avoid titles. web.dev address + payment — T1 — VERIFIED — single name input; use Unicode-aware patterns (`\p{L}`) not Latin-only. Baymard — T2 — VERIFIED — 89% of sites split names; recommend single field.
- Scope: universal.
- Agent rule: IF collecting a person's name THEN one field, `autocomplete=name`, no max length below ~100, no regex beyond non-empty; IF the backend needs parts THEN store full name and parse server-side or ask a separate "preferred name".
- Stack notes: iOS `.name`; Android `AUTOFILL_HINT_PERSON_NAME`; Compose `ContentType.PersonFullName` (MEMORY for exact constant); Flutter `AutofillHints.name`.

### F11 Smart defaults, defer account creation, progressive profiling
- Claim: Prefill sensible values and gather the rest later; do not force sign-up before value.
- Evidence: Apple HIG entering-data — T1 — VERIFIED — prefill sensible defaults; use data from system sources with permission; prefer pickers over typing. Apple HIG onboarding — T1 — VERIFIED — postpone non-essential setup, give reasonable defaults. Apple HIG managing-accounts + sign-in-with-apple — T1 — VERIFIED — delay sign-in until value is clear; in commerce request account creation after purchase. Baymard — T2 — VERIFIED — move account creation to the confirmation page; billing = shipping default. GOV.UK radios — T2 — VERIFIED — never preselect answers to questions (risk of wrong submission), allowed for settings. Smashing 2017 — T4 — VERIFIED — geo-default country only when ~90% would choose it (opinion heuristic). GOV.UK create-accounts — T2 — VERIFIED — don't create accounts if the service works without them.
- Corroboration / conflict: progressive profiling as a named practice: MEMORY (no primary source found; HIG/Baymard/GOV.UK support the underlying idea).
- Scope: universal.
- Agent rule: IF a value can be inferred (locale, country, time zone, "same as shipping") THEN prefill and make it editable; IF it's a question whose answer carries meaning (consent, yes/no) THEN leave unselected.

### F12 Input masking: be liberal in what you accept
- Claim: Hard keystroke masks cause caret/paste/screen-reader problems; prefer accepting varied input and normalizing.
- Evidence: GOV.UK text-input + telephone-numbers — T2 — VERIFIED — avoid masks and auto-reformatting; allow spaces/hyphens/brackets; validate with libphonenumber. web.dev payment — T1 — VERIFIED — allow spaces in card number via `pattern="[0-9 ]+"`; test input masks (e.g., expiry) with screen readers. NN/g mobile-input-checklist — T2 — VERIFIED — accept varied formats and auto-format for the user. Smashing 2017 — T4 — VERIFIED — recommends masks for phone/card/date. Compose docs — T1 — VERIFIED — `OutputTransformation` formats display without changing the stored state; `InputTransformation` filters input.
- Conflict: GOV.UK (avoid) vs Smashing/NN/g (format for user). Resolution: normalize on input (strip spaces) and format display only for chunkable numbers (cards 4-4-4-4) without blocking characters.
- Agent rule: IF formatting is cosmetic THEN format display via transformation and store raw digits; never reject a character just because it's not in the mask; always accept paste of formatted strings.

### F13 Character counters
- Claim: Use only when a limit is real; do not hard-block typing.
- Evidence: GOV.UK character-count — T2 — VERIFIED — allow exceeding so users can paste and trim; optional threshold (e.g., 75%) to hide count until near the limit; screen-reader announcement delayed until typing stops; error above field "must be N characters or less". Material — T1 — VERIFIED — counter via `maxlength`/`counterMaxLength`. RN — T1 — VERIFIED — use `maxLength` prop rather than JS truncation to avoid flicker.
- Conflict: RN/Material `maxLength` hard-stops input, GOV.UK prefers soft limit.
- Agent rule: IF the limit is a soft business rule THEN soft limit with remaining-count message; IF a hard protocol limit (SMS 160, OTP length) THEN `maxLength`.

### F14 Choose input type and `inputmode` for keyboard; `type=number` is wrong for identifiers
- Claim: Use semantic types where they match (email, tel, url, search); for digit strings that are not quantities use `type=text inputmode=numeric`.
- Evidence: GOV.UK blog (24 Feb 2020) https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/ — T2 — VERIFIED — type=number cannot be dictated or selected in Dragon, is announced unlabeled in some NVDA setups, silently drops letters, rounds/exponents large numbers, and changes with scroll wheel; recommends `type=text inputmode=numeric pattern=[0-9]*`. MDN input/number — T1 — VERIFIED — only for incrementable numbers; not for card numbers, postal codes, phone; role spinbutton; locale decimal separators vary; use `inputmode`+`pattern`. MDN inputmode — T1 — VERIFIED — values none/text/decimal/numeric/tel/search/email/url; hint only, no validation; Baseline since Dec 2021. web.dev sms-otp + payment — T1 — VERIFIED — card number and OTP: `type=text` + `inputmode=numeric`.
- Corroboration: React Native `inputMode` mirrors HTML and wins over `keyboardType` — T1 — VERIFIED.
- Scope: Web (and the principle maps to native keyboard types, F17).
- Context (when it flips): use `type=number` only for true quantities where spinner/step makes sense; many teams still prefer `inputmode=decimal` + text for money and quantities.
- Agent rule: IF the value is an identifier (card, OTP, postcode, phone extension, account no.) THEN `type=text inputmode=numeric`; phones `type=tel`; amounts `inputmode=decimal`; email `type=email`; URL `type=url` (but accept missing scheme and normalize); search `type=search`.
- Gotcha: iOS numeric/decimal/phone pads have no Return key (RN docs note `onSubmitEditing` is not called with iOS `phone-pad`, VERIFIED; the "no return key" claim for number pad is MEMORY); provide a Done/Next affordance (web: Safari form assistant bar; native: input accessory toolbar).

### F15 `autocomplete` tokens: the full practical set and rules
- Claim: Always set the correct token; it feeds autofill, password managers, and satisfies WCAG 1.3.5 (AA).
- Evidence: MDN autocomplete https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete — T1 — VERIFIED — token order: optional `section-*`, optional `shipping|billing`, optional contact prefix (home/work/mobile/fax/pager), field token, optional `webauthn`. Tokens: name, honorific-prefix, given-name, additional-name, family-name, honorific-suffix, nickname, username, new-password, current-password, one-time-code, email, tel, tel-country-code, tel-national, tel-area-code, tel-local, tel-local-prefix, tel-local-suffix, tel-extension, impp, street-address, address-line1/2/3, address-level1/2/3/4, country, country-name, postal-code, cc-name/given-name/additional-name/family-name, cc-number, cc-exp, cc-exp-month, cc-exp-year, cc-csc, cc-type, transaction-currency, transaction-amount, organization, organization-title, bday, bday-day/month/year, sex, language, url, photo. Password managers ignore `autocomplete=off` on login fields. web.dev auto — T1 — VERIFIED — browsers also use `name`, `type`, `id`; keep `name`/`id` stable across deploys (sign-in guide). WCAG 1.3.5 — T1 — VERIFIED — AA, applies to fields collecting info about the user.
- Scope: Web; native equivalents in F17 and the cheat table.
- Agent rule: IF a field matches a token THEN set it; use `off` only for CAPTCHA/one-off tokens (MDN also lists OTP as a legitimate `one-time-code`, not `off`); for two addresses on one page use `shipping`/`billing` prefixes; use `section-*` for multiple people.

### F16 `autocapitalize`, `autocorrect`, `spellcheck`
- Claim: Disable "helpful" text services on structured data; keep them on for prose.
- Evidence: MDN autocapitalize — T1 — VERIFIED — virtual keyboards/voice only; values none/off, sentences/on, words, characters; ignored for email/url/password; Chrome/Safari default sentences, Firefox none; not Baseline. MDN autocorrect — T1 — VERIFIED — values on/off; always off for password/email/url; Baseline status "newly available September 2026" (current). MDN spellcheck — T1 — VERIFIED — some browsers send content to third parties; disable on sensitive data ("spell-jacking"). GOV.UK password-input — T2 — VERIFIED — `spellcheck=false`, `autocapitalize=none`. Baymard checkout — T2 — VERIFIED — disable autocorrect for names and addresses. NN/g mobile-input-checklist — T2 — VERIFIED — do not autocorrect names, addresses, emails. Apple UITextInputTraits — T1 — VERIFIED — separate autocapitalizationType, autocorrectionType, spellCheckingType, smartQuotesType, smartDashesType (smart punctuation can corrupt IDs/URLs; behaviour itself MEMORY), writingToolsBehavior (iOS 18+).
- Scope: universal.
- Agent rule: IF field is username/email/URL/code/password THEN autocapitalize none, autocorrect off, spellcheck false, smart dashes/quotes off (native); IF name/address THEN autocapitalize words, autocorrect off (words value for names: MEMORY, consistent with Baymard); IF free text THEN leave defaults.

### F17 Native keyboard and autofill equivalents
- Claim: Each platform has a keyboard-type API and a separate autofill-semantics API; set both.
- Evidence: Apple UIKeyboardType — T1 — VERIFIED — default, asciiCapable, numbersAndPunctuation, URL, numberPad, phonePad, namePhonePad, emailAddress, decimalPad, twitter, webSearch, asciiCapableNumberPad. UITextContentType — T1 — VERIFIED — name parts, emailAddress, telephoneNumber, location, fullStreetAddress, streetAddressLine1/2, addressCity/State/CityAndState, postalCode, countryName, username, password, newPassword, oneTimeCode, creditCard* (number, name, parts, expiration/month/year, securityCode, type), birthdate/day/month/year, dateTime, flightNumber, shipmentTrackingNumber, URL, organizationName, jobTitle, nickname. SwiftUI `.textContentType`, `.keyboardType`, `.textInputAutocapitalization`, `.autocorrectionDisabled`, `.submitLabel` (continue, done, go, join, next, return, route, search, send; iOS 15+) with `.onSubmit` — T1 — VERIFIED. Android keyboard style — T1 — VERIFIED — inputType (text, textEmailAddress, phone, number, textPassword, textUri, textMultiLine) + modifiers (textCapSentences/Words/Characters, textAutoCorrect, textNoSuggestions); imeOptions (actionNext/Done/Send/Search/Go); `nextFocusForward`. Android autofill-optimize — T1 — VERIFIED — `autofillHints`/`AUTOFILL_HINT_*` (username, password, new username/password, credit card number/CSC/expiry parts, postal address parts, person name parts, phone, SMS OTP incl. per-character `generateSmsOtpHintForCharacterPosition` for split fields); `importantForAutofill`; `AutofillManager.commit()` after the whole form completes; AUTOFILL_TYPE_DATE for date widgets. Compose — T1 — VERIFIED — `Modifier.semantics{ contentType = ContentType.Username | EmailAddress | NewUsername | NewPassword | Password | SmsOtpCode | CreditCardNumber }`, combine with `+`; `KeyboardOptions(keyboardType, imeAction, capitalization, autoCorrect)`; `SecureTextField`. Flutter — T1 — VERIFIED — `TextInputType` (text, multiline, number [unsigned int], phone, datetime, emailAddress, url, visiblePassword, name, streetAddress, none; `numberWithOptions(signed, decimal)`), `AutofillHints.*`, wrap in `AutofillGroup` (default `onDisposeAction=commit`; use `TextInput.finishAutofillContext(shouldSave)`), `TextInputAction`. React Native — T1 — VERIFIED — `keyboardType` (default, number-pad, decimal-pad, numeric, email-address, phone-pad, url; iOS-only ascii-capable etc.; Android-only visible-password), `inputMode` (HTML-like, wins over keyboardType), `returnKeyType`/`enterKeyHint`, `textContentType` (iOS list above), `autoComplete` (cross-platform: additional-name, address-line1/2, birthdate-* (iOS17+), cc-* (iOS17+), country, current-password, email, family-name, given-name, honorific-*, name, new-password, off, one-time-code, postal-code, street-address, tel, username; Android-only: sms-otp, tel-national, tel-country-code, tel-device, username-new, password-new, postal-address-*…), `textContentType` wins if both set, `passwordRules` (iOS), `importantForAutofill` (Android), `submitBehavior`.
- Scope: iOS / Android / Flutter / RN.
- Agent rule: IF cross-platform (RN/Flutter) THEN set BOTH keyboard type and autofill hint per platform (RN: `autoComplete` + `textContentType`; Flutter: `AutofillHints` inside `AutofillGroup`). IF Android Compose THEN `contentType` semantics, not just keyboardType. See cheat table.

### F18 Return key behavior and focus advance
- Claim: Intermediate fields = Next, last field = Done/Go/Search/Send that submits; make sure focus actually moves.
- Evidence: MDN enterkeyhint — T1 — VERIFIED — enter/done/go/next/previous/search/send; Baseline Nov 2021; falls back to inference from type/inputmode/pattern. Android imeOptions + `nextFocusForward` — T1 — VERIFIED. SwiftUI `submitLabel` + `onSubmit` (+ `@FocusState` to move focus, MEMORY for FocusState detail). Flutter focus doc — T1 — VERIFIED — `TextInputAction.next` does not move focus by itself; you must call `FocusScope.of(context).nextFocus()` or requestFocus. RN — T1 — VERIFIED — `submitBehavior` default `blurAndSubmit` for single-line (return key blurs and fires `onSubmitEditing`); `onSubmitEditing` not called on iOS `phone-pad`. Apple `enablesReturnKeyAutomatically` — T1 — VERIFIED — return key disabled while field empty.
- Scope: universal.
- Agent rule: IF form has N fields THEN fields 1..N-1 `enterkeyhint=next`/`imeAction=Next`/`submitLabel(.next)` and move focus in code; field N uses the action verb (`go`/`done`/`send`) and triggers the same validation+submit as the button. IF a numeric pad lacks a Return key THEN add an accessory "Next/Done" bar (native) or rely on Safari's assistant bar (web, MEMORY).

### F19 Keyboard avoidance on the web
- Claim: On mobile the keyboard changes the visual viewport, not necessarily the layout viewport; fixed bottom bars and 100vh/dvh layouts can be covered; handle it explicitly.
- Evidence: Chrome 108 (Oct 2022) changed Android Chrome's default to `resizes-visual` to match iOS Safari; `interactive-widget=resizes-visual|resizes-content|overlays-content` is Chromium-only (not iOS) https://developer.chrome.com/blog/viewport-resize-behavior — T1 — VERIFIED. MDN VisualViewport — T1 — VERIFIED — shrinks when keyboard appears; `offsetTop/height/scale`; `resize`/`scroll` events; Widely available since Aug 2021. web.dev viewport-units — T1 — VERIFIED — dvh/svh/lvh deliberately ignore the virtual keyboard. MDN VirtualKeyboard API — T1 — VERIFIED — `navigator.virtualKeyboard.overlaysContent`, `env(keyboard-inset-height)`, `geometrychange`; experimental, Chrome/Android only. MDN env() — T1 — VERIFIED — `safe-area-inset-*` needs `viewport-fit=cover` on iOS; sticky footer example with `calc(1em + env(safe-area-inset-bottom))`. web.dev sign-in best practices — T1 — VERIFIED — make sure buttons aren't obscured by keyboard; consider a two-page flow. web.dev design-basics — T1 — VERIFIED — use >=16px (1rem) font in controls to avoid iOS Safari focus zoom (CSS-Tricks via snippet confirms threshold is the rendered size after transforms). MDN meta viewport — T1 — VERIFIED — do not use `user-scalable=no`/`maximum-scale` (WCAG zoom).
- Corroboration / conflict: Safari/Firefox support for `interactive-widget` unverified (gap).
- Scope: Web/PWA.
- Agent rule: IF a bottom-pinned CTA/composer must stay above the keyboard THEN: (a) prefer an in-flow submit button at the end of the form (nothing to avoid); (b) else `position: sticky; bottom: 0` inside the scroll container with safe-area padding; (c) else listen to `visualViewport` `resize/scroll` and translate the bar by `innerHeight - visualViewport.height - offsetTop` (iOS); (d) on Chrome Android optionally `interactive-widget=resizes-content`. After focus, `scrollIntoView({block:'center'})` on the field after the resize event settles (MEMORY). Set control font-size >=16px; never block zoom.

### F20 Keyboard avoidance on native stacks
- Claim: Each platform has an inset-based mechanism; use it instead of manual offsets.
- Evidence: Android sw-keyboard — T1 — VERIFIED — `adjustResize` resizes window (recommended); `adjustPan` pans window; `WindowInsetsCompat.Type.ime()` + `WindowInsetsAnimationCompat` for synced animation. Compose insets — T1 — VERIFIED — `Modifier.imePadding()`, `imeNestedScroll`, requires `adjustResize` and `enableEdgeToEdge()`; edge-to-edge is enforced when targeting SDK 35 (Android 15+). Apple UIKit `keyboardLayoutGuide` (iOS 15+) — T1 — VERIFIED — constrain views to its top anchor; follows interactive dismissal. SwiftUI — T1 — VERIFIED — keyboard safe-area region respected by default; `ignoresSafeArea(.keyboard)` opts out; `safeAreaInset(edge: .bottom)` keeps a bottom bar above the keyboard. Flutter — T1 — VERIFIED — `Scaffold.resizeToAvoidBottomInset` defaults true, uses `MediaQuery.viewInsets.bottom`. React Native — T1 — VERIFIED — `KeyboardAvoidingView` `behavior` = height|position|padding; set explicitly per platform; `keyboardVerticalOffset`.
- Scope: iOS / Android / Flutter / RN.
- Agent rule: IF Compose THEN `enableEdgeToEdge()` + `Scaffold` + `Modifier.imePadding()` on the scroll container, bottom bar via `bottomBar` with `imePadding`. IF SwiftUI THEN ScrollView + `.safeAreaInset(edge:.bottom)` for the CTA; don't `ignoresSafeArea(.keyboard)` unless intentionally overlaying. IF Flutter THEN keep `resizeToAvoidBottomInset` true, wrap form in `SingleChildScrollView`; for a bottom CTA place it in `bottomNavigationBar` wrapped with `Padding(bottom: viewInsets.bottom)` (MEMORY for the wrapper idiom). IF RN THEN `behavior={Platform.OS==='ios' ? 'padding' : undefined}` as a starting point (MEMORY for the exact ternary) and test with the header offset.

### F21 Keyboard dismissal
- Claim: Let scrolling and tapping outside dismiss the keyboard, but not at the cost of dropped taps.
- Evidence: SwiftUI `scrollDismissesKeyboard` (iOS 16+) — T1 — VERIFIED — `.immediately`, `.interactively`, `.never`, `.automatic`; scroll views dismiss on scroll by default on iOS 16+, TextEditor defaults to interactive. RN ScrollView — T1 — VERIFIED — `keyboardDismissMode` none (default)/on-drag/interactive (iOS only); `keyboardShouldPersistTaps` never (default; first tap only closes keyboard)/always/handled. Flutter — T1 — VERIFIED — `ScrollViewKeyboardDismissBehavior.manual` or `.onDrag`.
- Scope: native.
- Agent rule: IF a scrolling form has buttons below inputs THEN RN `keyboardShouldPersistTaps="handled"` and `keyboardDismissMode="on-drag"` (iOS `interactive`); Flutter `keyboardDismissBehavior: onDrag`; SwiftUI `.scrollDismissesKeyboard(.interactively)`; web: no built-in, blur active element on a deliberate gesture only (MEMORY).

### F22 When to validate: evidence and conflicts
- Claim: Do not validate while the user is mid-entry for a field that was valid/empty; validate on blur (or when the expected length is reached); clear an existing error immediately when corrected; validate empty required fields on submit; live feedback is warranted for hard-to-guess fields (password, username availability).
- Evidence: Wroblewski/Etre study https://alistapart.com/article/inline-validation-in-web-forms/ — T2 — VERIFIED — 22 participants (21-49), 6 forms within-subject (1 submit-only control + 5 inline variants varying timing after/while/before-and-while, persistent vs fading, inside vs outside field); best inline variant vs control: +22% success, -22% errors, +31% satisfaction, -42% completion time, -47% eye fixations; benefit concentrated in hard fields (username, password: 80-100% attention) while easy fields (name, address) were looked at by only 30-50% and a success tick on name confused people. Date: 2009. Baymard https://baymard.com/blog/inline-form-validation — T2 — VERIFIED — 31% of benchmarked sites have no inline validation; validate on blur or at expected character length; avoid premature errors; remove error as soon as the field becomes valid (even at keystroke, esp. confirm fields); positive confirmation helps. NN/g errors-forms — T2 — VERIFIED — validate after field completion not during typing; success indicators/strength meters for complex fields. Smashing 2022 — T3 — VERIFIED — "reward early, punish late": for a field already in error validate on each keystroke so the fix is acknowledged; for valid fields wait for blur; validate empty required fields only on submit; flag gross format errors (letters in digit field) immediately. web.dev sign-up — T1 — VERIFIED — show validation inline, reject breached passwords immediately with a reason. GOV.UK validation — T2 — VERIFIED — server-side always; validate on submit ("Continue"); on-blur is discouraged (slower typists/AT); client-side only if research shows need; add `novalidate`. Apple HIG entering-data — T1 — VERIFIED — "dynamically validate" (email on leaving the field, password before leaving) and gate Continue. Flutter — T1 — VERIFIED — `AutovalidateMode.onUserInteraction` validates on every change after first edit (premature errors); `always` validates before interaction; `onUnfocus` exists (MEMORY, not confirmed in fetched doc). CSS `:user-invalid`/`:user-valid` Baseline Nov 2023 — T1 — VERIFIED — match only after interaction (blur/submit attempt); `:invalid` matches on load.
- Corroboration / conflict: Baymard/NN/g/Smashing/Wroblewski converge on blur-timed inline validation; GOV.UK deliberately validates on submit only for public services with long-tail users. The 2009 study is small, lab, 17 years old, tested desktop; "22%" is the best of five variants on task success, not conversion.
- Scope: universal; the pattern is T2-supported, GOV.UK is the strongest dissent.
- Context (when it flips): hard fields (password rules, username/handle availability, promo code, card number length/Luhn) benefit from live checks; trivial text fields don't. Submit-only suits one-question-per-page flows (GOV.UK).
- Agent rule: IF field is easy free text THEN no inline success state; validate on blur only for format errors; empty required checked on submit. IF field has hidden rules (password, username, card, coupon) THEN live (debounced ~300-500 ms, MEMORY) feedback with specific messages; for card number validate when length reaches expected (Luhn) or on blur. IF a field is in error THEN re-validate on each input event and remove the error the moment it is valid. IF form is a short single-step flow THEN also acceptable to validate on submit only and show an error summary (F24).
- Stack notes: web `:user-invalid` + `aria-invalid` set from blur handler; Flutter use `AutovalidateMode.onUnfocus` or manual `onFocusChange`; RN track `touched` per field (Formik/RHF `mode: 'onTouched'`, MEMORY); SwiftUI track `@FocusState` change to mark touched.

### F23 Error message content, format, placement
- Claim: Say what is wrong and how to fix it, specific per failure type, next to the field, in text, in the user's words.
- Evidence: GOV.UK error-message — T2 — VERIFIED — describe what happened and how to fix; avoid "this field is required"; separate messages for empty/too short/too long/bad format/invalid characters; error text after the question and hint; red border + visually-hidden "Error:" prefix; instruction style for missing ("Enter your first name") vs description for constraints ("Name must be 35 characters or less"); keep all input visible. NN/g errors-forms — T2 — VERIFIED — errors adjacent to field, colour plus icon, preserve input, avoid errors in tooltips/hover and modal-only, escalate help when the same error repeats. Baymard checkout — T2 — VERIFIED — 94% of sites don't use adaptive messages ("incomplete" vs "invalid"). WCAG 3.3.1/3.3.3 — T1 — VERIFIED — error identified in text, suggestion when known; colour/icon cannot be the only indicator. WCAG 3.3.3 — T1 — VERIFIED — security exception.
- Scope: universal.
- Agent rule: IF validation fails THEN message = "[what's wrong] + [what to do]" ("Enter an email address in the correct format, like name@example.com"); one message per field; never a code; keep the field's hint visible; icon + text + border, not colour alone.

### F24 Error summary, focus, accessible announcement
- Claim: After submit, show a summary at the top, move focus to it, link each item to its field, and also mark inline errors; announce dynamic errors without stealing focus.
- Evidence: GOV.UK error-summary — T2 — VERIFIED — always show a summary (even for one error), above the main heading below back link/breadcrumbs, focus moved on load, links to the first problematic input (first radio/checkbox, first date part), identical text to inline messages, "Error:" prefix in `<title>`. W3C WAI notifications tutorial — T1 — VERIFIED — summary with links + `aria-describedby` + `aria-invalid`; `aria-live="polite"` for typing feedback, `assertive` on change; focus first error after submit. WCAG 4.1.3 — T1 — VERIFIED — `role=status`/`alert`/`log`/live regions so messages announce without focus (e.g., "5 errors on page"). WCAG 3.3.1 — T1 — VERIFIED — also acceptable: moving focus to errored field.
- Corroboration / conflict: NN/g warns against relying on a summary alone (adjacent errors reduce memory load); GOV.UK uses both. Native equivalents (TalkBack `AccessibilityEvent`, iOS `UIAccessibility.post(.announcement)`, Compose `semantics{ error() }`, Flutter `SemanticsService.announce`) are MEMORY (not fetched).
- Scope: Web verified; native announcements MEMORY.
- Agent rule: IF form submit fails THEN (1) focus the summary (web) or the first invalid field (native), (2) summary items are links/actions that focus the field, (3) inline messages tied via `aria-describedby`, (4) set `aria-invalid="true"`; for live validation use a polite live region.

### F25 Preserve input; never clear the form
- Claim: Keep everything the user typed across validation failure, back navigation, interruption, process death; the only common exception is passwords after a failed login.
- Evidence: GOV.UK error-message + validation — T2 — VERIFIED — retain entered data; GOV.UK passwords pattern — T2 — VERIFIED — do not keep password input after an incorrect login. NN/g web-form-design — T2 — VERIFIED — preserve erroneous input; remove Reset/Clear buttons. Baymard — T2 — VERIFIED — never clear card data. WCAG 3.3.7 Redundant Entry (A, new in 2.2) — T1 — VERIFIED — don't make users re-enter info already supplied in the same process (e.g., "billing same as shipping"; keep entries after failed submit). Android activity-lifecycle — T1 — VERIFIED — process death can wipe state; use `rememberSaveable`/ViewModel/`SavedStateHandle` + local storage; instance state unsuitable for large data. MDN beforeunload — T1 — VERIFIED — generic browser dialog, needs sticky activation, unreliable on mobile; attach only while dirty; use `visibilitychange` to autosave. web.dev bfcache — T1 — VERIFIED — `beforeunload` no longer blocks bfcache in modern browsers but is unreliable; use `pagehide` instead of `unload`.
- Scope: universal.
- Agent rule: IF user can leave mid-form THEN autosave a draft locally (debounced) on `visibilitychange`/`onPause`/scene background; restore on return; on failed submit re-render with values (except passwords/OTP). On web attach `beforeunload` only when dirty and remove after save (desktop only helps).

### F26 Disabled submit button: keep enabled by default
- Claim: Disabling submit until the form is valid hides why it's disabled, has poor contrast/focusability, and leaves users stuck; prefer enabled button + clear errors. Disable only the in-flight state.
- Evidence: GOV.UK button — T2 — VERIFIED — discourages disabled buttons unless research shows value. Adam Silver — T4 — VERIFIED — low contrast, not focusable, users may not notice it enabling when off-screen, feels broken with multiple errors. web.dev sign-in — T1 — VERIFIED — disable the submit button after click to prevent double submit. Apple HIG entering-data — T1 — VERIFIED — "make the button available only after people enter required data" (gating).
- Conflict: HIG (gate) vs GOV.UK/Silver (don't). Both defensible: HIG assumes a short guided native flow with visible required cues; GOV.UK targets long-tail users and AT.
- Scope: universal; platform convention differs.
- Agent rule: IF form has more than 2 fields OR any hidden rules THEN keep primary button enabled and show errors on press. IF native wizard step with 1-2 clearly required inputs (e.g., OTP of N digits, "Next" after name) THEN gating is acceptable, but expose why (hint/progress) and keep `accessibilityHint`/`aria-disabled` rather than `disabled` where possible (aria-disabled MEMORY).

### F27 Duplicate-submission prevention, loading state, idempotency
- Claim: Prevent accidental double submit client-side, show progress on the button itself, and make the server idempotent.
- Evidence: GOV.UK button — T2 — VERIFIED — `data-prevent-double-click` plus server-side protection; pair with loading indicator on slow connections. web.dev sign-in — T1 — VERIFIED. NN/g response times — T2 — VERIFIED — 0.1 s feels instant, 1 s keeps flow with no special feedback, 10 s limit of attention (needs progress/escape). NN/g progress-indicators — T2 — VERIFIED — <1 s no animation; 2-10 s looped spinner; >10 s percent-done; "willing to wait 3x longer with feedback". Stripe idempotent requests — T3 — VERIFIED — client-generated key (V4 UUID, <=255 chars), stored result replays same response including 500s, keys prunable after >=24 h, parameter mismatch errors, only POST needs it. IETF Idempotency-Key header draft — T1 — VERIFIED — expired draft (v07), never an RFC. Apple HIG loading — T1 — VERIFIED — don't block unrelated actions; determinate vs indeterminate indicators.
- Scope: universal.
- Agent rule: IF submit triggers a network call THEN generate an idempotency key when the form (or payment intent) is created, send it with every retry; on tap: ignore re-entrant taps, show inline spinner and change label ("Saving…"), keep the button focusable and announce via polite live region; if >10 s show progress and allow cancel. Never rely on disabling alone.

### F28 Passwords (sign-in and sign-up)
- Claim: Allow paste and password managers; no composition rules; check length + blocklist; show/hide toggle; no confirm field; no clearing; generic failure message.
- Evidence: NIST SP 800-63B-4 https://pages.nist.gov/800-63-4/sp800-63b.html — T1 — VERIFIED — min 15 chars if password is the only authenticator, 8 if used with MFA; accept >=64; no composition rules; no periodic change without compromise evidence; SHOULD allow paste; SHOULD offer show-password option; compare against blocklist; accept Unicode; do not truncate; KBA/hints not allowed for passwords. GOV.UK passwords — T2 — VERIFIED — min 8 chars, no max, block common passwords, let users paste, don't reveal which credential was wrong, don't retain failed password, allow 5-10 attempts before lockout, reset via time-limited link/code not questions. GOV.UK password-input — T2 — VERIFIED — show/hide button, hidden by default (user may not be private), distinct labels per toggle ("Show password" / "Show re-entered password"), a second field is not helpful when show/hide exists, `autocomplete` current/new-password, `spellcheck=false`, `autocapitalize=none`, announce state change; don't use for MFA codes. web.dev sign-in/sign-up — T1 — VERIFIED — `current-password`/`new-password`, stable `name`/`id`, toggle with aria-label, don't require confirm (raises abandonment), reject breached passwords (HIBP), `.well-known/change-password`. Apple passwordrules — T1 — VERIFIED — `passwordrules` attribute (required/allowed/max-consecutive/minlength/maxlength) so generated passwords satisfy your rules; RN `passwordRules` iOS. Apple password autofill workflow — T1 — VERIFIED — strong-password suggestions need associated domains; fields with `.username/.password/.newPassword` also enable multi-page flows (username on one screen, password on next); don't tear down UI while Face ID autofill runs. Nielsen 2009 https://www.nngroup.com/articles/stop-password-masking/ — T2 — VERIFIED — argued to unmask by default; later acknowledged IE10's reveal icon. OWASP forgot-password — T2 — VERIFIED — new password entered twice at reset, uniform responses to prevent enumeration.
- Corroboration / conflict: confirm field: GOV.UK/web.dev against, OWASP reset flow for it. Min length: GOV.UK 8 vs NIST 15 (single factor)/8 (MFA). Masking default: GOV.UK/MDN hidden by default vs Nielsen (2009) cleartext default; current practice = hidden + toggle.
- Scope: universal.
- Agent rule: IF sign-up THEN one password field with show/hide, `new-password`, `passwordrules`, min length 8-15 (say 15 when no MFA), live blocklist check with explanation, no composition rules, no confirm field; IF sign-in THEN `current-password`, keep identifier, clear password only on failure, generic error "Email or password incorrect"; always allow paste.

### F29 Passkeys, WebAuthn conditional UI, biometrics
- Claim: Offer passkeys via autofill/system sheets, keep passwords and a recovery channel, and prompt creation at account-management moments.
- Evidence: web.dev passkey-form-autofill — T1 — VERIFIED — `autocomplete="username webauthn"` on username field, `navigator.credentials.get({publicKey, mediation:'conditional', signal})`, feature-detect with `PublicKeyCredential.getClientCapabilities()` → `conditionalGet`; request stays pending until the user taps the field. web.dev passkey-registration — T1 — VERIFIED — prompt creation at registration, after password sign-in, or on management page; `excludeCredentials` to prevent duplicates; handle `NotAllowedError` (cancel) quietly; store AAGUID to show provider names; notify after creation. developer.chrome.com conditional create — T1 — VERIFIED — `credentials.create({mediation:'conditional'})` after a recent password sign-in with a saved password creates a passkey silently; works on Safari macOS and iOS browsers and Chrome desktop/Android; only after password sign-in (not magic link/SMS/federated); server must ignore UP/UV flags (false). Apple supporting-passkeys — T1 — VERIFIED — associated domain `webcredentials`, `ASAuthorizationController`, AutoFill-assisted request via `performAutoFillAssistedRequests()` with username field `textContentType=.username`, include password/Sign in with Apple requests as fallback. Android Credential Manager — T1 — VERIFIED — one bottom-sheet API for passkeys, passwords, Sign in with Google; replaces Smart Lock, One Tap, legacy Google Sign-In; SIWG: bottom sheet (filters to authorized accounts, auto sign-in) plus a persistent button for recovery/new account. BiometricPrompt — T1 — VERIFIED — classes BIOMETRIC_STRONG (Class 3), BIOMETRIC_WEAK, DEVICE_CREDENTIAL; can't combine DEVICE_CREDENTIAL with a negative button; `setConfirmationRequired(false)` allows passive face unlock for low-risk, require confirmation for purchases/health; use Credential Manager for sign-in, BiometricPrompt for re-auth. Apple HIG managing-accounts — T1 — VERIFIED — name the method ("Sign in with Face ID"), no in-app biometric opt-in setting duplicates, don't call it passcode.
- Prompt timing: FIDO passkeycentral — T1 — VERIFIED — prompt during account creation, recovery or settings; sign-in prompts performed worse (per snippet); "allow freedom and choice", wording tied to biometrics; recovery flows are a good moment; Google user-journeys — T3 — VERIFIED — four moments including during/after sign-in, after recovery, after reauthorization, security settings; keep email/phone fallback; label passkeys by provider and use "delete".
- Numbers (vendor-reported, T3, VERIFIED at developers.google.com/identity/passkeys/case-studies): X 2x login success; KAYAK ~half auth time; Zoho 6x faster; Tokyu 12x faster; Mercari ~3.9x faster; pixiv +29% login success; Dashlane +70% conversion (passkey vs password); Yahoo! JAPAN 11% adoption. Google aggregate (800M accounts, ~30% higher success, ~20% faster) SNIPPET only. Blog stats like "93% vs 63%" SNIPPET low-trust, not used.
- Scope: universal; native APIs differ.
- Agent rule: IF identifier-first sign-in THEN username field with `autocomplete="username webauthn"` + conditional mediation (web) / `performAutoFillAssistedRequests` (iOS) / Credential Manager sheet (Android); keep "Use password" and a recovery path. IF user just signed in with a password THEN try conditional create, else show a one-time dismissible "Create a passkey" interstitial and account-settings entry; never block sign-in on passkey enrollment.

### F30 One-time codes (OTP) and verification
- Claim: Use one text field with `one-time-code`; rely on OS autofill; if you split boxes you must rebuild paste/autofill/AT behavior.
- Evidence: web.dev sms-otp-form — T1 — VERIFIED — `type=text` (not number), `inputmode=numeric`, `autocomplete=one-time-code`; SMS last line `@example.com #123456` (origin-bound); WebOTP via `navigator.credentials.get({otp:{transport:['sms']}})` (HTTPS); Safari 12+ supports `one-time-code`; Chrome/Opera/Vivaldi Android support WebOTP; SMS OTP not the most secure, prefer WebAuthn. MDN WebOTP — T1 — VERIFIED — limited availability, Chrome Android; Permissions-Policy `otp-credentials`; Safari uses attribute only. GOV.UK confirm-a-phone-number — T2 — VERIFIED — single text input `one-time-code` + `inputmode=numeric`; 5-digit code; valid 15 min; after 15 min show expiry message and send a new one; after 2 h any code is "incorrect"; resend link "Not received a text message?" (can change number during account creation but not sign-in); previous codes stay valid in their window; specific length errors; rate limit after 10 wrong entries. NIST 800-63B-4 — T1 — VERIFIED — out-of-band code >=6 decimal digits, single use, valid exactly 10 minutes; PSTN/SMS is "restricted"; max 100 consecutive failures. Android SMS Retriever — T1 — VERIFIED — no READ_SMS permission, 11-char app hash in message, listens 5 minutes. Compose `ContentType.SmsOtpCode`; Android `AUTOFILL_HINT_SMS_OTP` / `generateSmsOtpHintForCharacterPosition` for one-digit-per-box layouts — T1 — VERIFIED. Apple UITextContentType.oneTimeCode — T1 — VERIFIED. GOV.UK confirm-an-email-address — T2 — VERIFIED — links expire, invalid after use, after replacement, or address change; explain expiry reason; resend; show address sent to.
- Corroboration / conflict: split-digit boxes: no authoritative evidence found; GOV.UK, web.dev, MDN all describe a single field. Android explicitly supports per-position hints for split boxes, so both are workable. Tradeoffs in comparison table.
- Scope: universal.
- Context: split boxes only when you can implement paste-whole-code distribution, autofill, backspace-to-previous, `aria-label="Digit n of N"` or, better, one visually styled single input (monospace + letter-spacing) / hidden real input behind decorative boxes.
- Agent rule: IF collecting a code THEN one input, `autocomplete=one-time-code`, `inputmode=numeric`, `maxlength=N`, auto-submit when length==N (and also keep a button), 6 digits (NIST min), tell users where it was sent and how long it lasts, resend with cooldown (30-60 s typical, MEMORY, show countdown in-label with polite live region), keep previously issued code valid until expiry, rate-limit server-side, offer alternative method.

### F31 Phone numbers
- Claim: `type=tel`, accept any common format, validate leniently with libphonenumber, explain why you need it.
- Evidence: GOV.UK telephone-numbers — T2 — VERIFIED — `type=tel`, `autocomplete=tel`, allow spaces/hyphens/brackets, use libphonenumber, specify domestic/international/mobile, example in error message, explain why, no masks/auto-reformat. MDN input/tel — T1 — VERIFIED — no built-in format validation (formats vary), server validation essential. web.dev — T1 — VERIFIED.
- Scope: universal.
- Agent rule: IF you need a phone THEN `type=tel autocomplete=tel`; if international is needed use a country-code control + national number (`tel-country-code`/`tel-national`) or accept E.164 with leading "+"; normalize server-side; never enforce a US pattern.

### F32 Addresses
- Claim: Few flexible fields (or one textarea), autofill tokens, optional line 2, locale-aware labels; lookup is a convenience.
- Evidence: Baymard — T2 — VERIFIED — hide Address Line 2/company behind a link, support lookup and autofill, country-specific formats, single name field. GOV.UK addresses — T2 — VERIFIED — prefer lookup for UK with manual fallback for international/missing; fields Address line 1 (required), 2 (optional), Town/city, County (optional), Postcode; narrower postcode field; tokens address-line1, address-level2, postal-code. web.dev address — T1 — VERIFIED — avoid "Address line 2" confusion (textarea or toggle), make postal code optional (not all countries), regional labels ("ZIP or postal code"), `autocomplete=country` with country codes in `<select>` or `country-name` for text; avoid lookup as the default (convenience only). web.dev payment/address best practices — T1 — VERIFIED — flexible lines to avoid breaking autofill. Apple/Google Pay — T1/T3 — VERIFIED — collect shipping address in the wallet sheet.
- Corroboration / conflict: GOV.UK (lookup first, UK) vs web.dev (lookup secondary, global). "Country first so fields adapt" is common practice (MEMORY; libaddressinput) with no fetched source.
- Scope: universal.
- Agent rule: IF global audience THEN country (default from locale, searchable) first, then adapt labels (State/Province/County, ZIP/Postcode) and required-ness; autofill tokens on every field (`shipping`/`billing` prefixes); lookup optional; don't force state dropdown; don't require postal code where none exists.

### F33 Email
- Claim: `type=email`, `autocomplete=email`, `spellcheck=false`, wide field; suggest corrections but allow the user to proceed; verify by link/code, not a second field.
- Evidence: GOV.UK email-addresses — T2 — VERIFIED — attributes above, ~30 chars visible, up to 254, allow paste, explain why, echo address back for check, detect typos (e.g., "homtail.com") but let user proceed. MDN input/email — T1 — VERIFIED — browser regex is permissive (accepts `a@b`), autocapitalize state always off, IDN support inconsistent, server-side validation mandatory. web.dev sign-up — T1 — VERIFIED — don't make users re-enter contact details for verification; send a code/link instead. Baymard (SNIPPET) — confirm-email/password fields with interdependent validity cause error-removal confusion. GOV.UK confirm-an-email-address — T2 — VERIFIED.
- Scope: universal.
- Agent rule: IF email THEN single field, trim whitespace, lowercase domain for comparison only, suggest on common-domain typos (non-blocking "Did you mean gmail.com?"), verify with a link or code; no confirm-email field.

### F34 Dates and birthdays
- Claim: Known/far dates = typed numeric fields (day/month/year) or a single text input accepting varied formats; near/unknown dates = calendar picker; avoid dropdown triples.
- Evidence: GOV.UK date-input — T2 — VERIFIED — three text inputs for dates users know or can look up, each `inputmode=numeric`, `bday-day/month/year` for DOB, accepts month names ("jan"), widths 2/2/4, error priority: missing → impossible → invalid, link to first erroring part. NN/g date-input — T2 — VERIFIED — typing is best for far dates (birthdates), pickers for dates within ~1 year, accept varied delimiters/no leading zeros, spell months for global clarity, no dropdown triplets, curated list when <10 options. Wroblewski — T2 — VERIFIED — a single date picker beat six dropdowns in travel tests. MDN `input type=date` — T1 — VERIFIED — native pickers, value always yyyy-mm-dd while display is locale-based, no placeholder, UI varies by browser, widely available since Apr 2021, use min/max for birthdates. Apple HIG pickers — T1 — VERIFIED — compact, inline, wheels (supports keyboard entry), automatic styles; modes date/time/date-time/countdown; use coarser minute intervals (e.g., 15). Android Compose M3 date pickers — T1 — VERIFIED — docked, modal, modal input (`DisplayMode.Input`) so users can type or pick; range picker. Android autofill — T1 — VERIFIED — custom date widgets implement `AUTOFILL_TYPE_DATE`.
- Scope: universal.
- Context: appointment/travel dates → calendar (with typed fallback); DOB → typed fields or wheel/`type=date` with min/max; if user already knows the date a picker is slower (NN/g).
- Agent rule: IF birthday THEN three numeric fields with `bday-*` (web) / `.birthdate*` (iOS 17+, RN `birthdate-*`) / typed text on Material `DatePicker(Input)`; IF near-future scheduling THEN calendar picker with disabled unavailable dates.

### F35 Numeric entry: steppers, sliders, currency, precision
- Claim: Steppers for small bounded counts, sliders only when approximate values are fine, text input for precise or large values; currency via prefix/suffix, not masks.
- Evidence: Apple HIG steppers — T1 — VERIFIED — small increments only; always show the value in an adjacent field; pair with a text field for large/varied values. Wroblewski dropdown alternatives — T2 — VERIFIED — steppers preferred for passenger count (max 8). NN/g sliders — T2 — VERIFIED — hard to control on touch, precision impossible on dense ranges, thumb hides labels below (show value above/beside), acceptable only when exact value is irrelevant; alternatives: typed input. GOV.UK text-input — T2 — VERIFIED — prefix £/€ and suffix kg/per item outside the input; `inputmode=numeric` for integers, `decimal` for decimals; `spellcheck=false`. MDN number — T1 — VERIFIED — locale decimal separators vary.
- Scope: universal.
- Agent rule: IF integer count <= ~10 THEN stepper with visible value (and long-press repeat); IF money/precise THEN decimal text field with currency affordance (use platform formatters such as `NumberFormatter`/`Intl.NumberFormat`, HIG says use number formatters and locale awareness); IF slider THEN show live value above the thumb, step snaps, offer a field for exact entry, and ensure keyboard/AT adjustability.

### F36 Choosing select-like controls: radio, native select, combobox
- Claim: Dropdowns are the last resort; prefer radios/segmented/steppers/pickers for short lists, searchable autocomplete for long lists; keep native controls on mobile where possible.
- Evidence: GOV.UK select — T2 — VERIFIED — "last resort" for public services; documented struggles: closing it, focus vs selected confusion, scrolling, pinch zoom on mobile, typing into it. GOV.UK radios — T2 — VERIFIED — no preselection for questions, add "None of the above"/"I do not know" because radios can't be unset, inline only for exactly two short options, conditional reveal kept simple. Wroblewski — T2 — VERIFIED — dropdown is a multi-step interaction (tap, scroll, find, select); alternatives performed better in tests (radio/segmented for travel class, stepper for passengers, date picker); keep dropdown as last resort. NN/g web-form-design — T2 — VERIFIED — avoid dropdowns when 2-3 radio buttons would do. Apple HIG pickers — T1 — VERIFIED — pickers for medium-long lists, pull-down buttons for short lists, lists for very large sets. accessible-autocomplete — T2 — VERIFIED — progressive enhancement of `<select>`; for a few hundred options max; country list has a dedicated package; render server-side `<select>` as the base. Material — T1 — VERIFIED — exposed dropdown menu as text-field end-icon mode. web.dev — T1 — VERIFIED — `autocomplete=country` with `<select>` of codes.
- Corroboration / conflict: native `<select>` on iOS/Android opens the OS picker, which avoids many GOV.UK-documented desktop problems; the evidence for dropdown harm is mostly desktop/older (Wroblewski ~2012; MEMORY on date).
- Scope: universal; thresholds are heuristics (no study gives numeric cut-off): <=5-7 options → radios/segmented; 8-~100 → native select/picker; ~100+ or familiar-typing lists (country, airport) → searchable combobox (heuristic, MEMORY).
- Agent rule: IF options <= 5 and visible space THEN radios (vertical stack on phone); IF 2 opposing short options THEN segmented control/radios; IF long known lists THEN combobox with type-ahead and full keyboard/AT support (ARIA combobox) or native picker; never build a custom `<div>` select that breaks native pickers/autofill.

### F37 Checkbox, radio, and switch semantics
- Claim: Switch = immediate effect on a setting; checkbox = a choice committed with the form; radio = one of many; don't mix.
- Evidence: NN/g toggle-switch — T2 — VERIFIED — toggles act instantly without Save; checkboxes require submission; concise non-neutral labels describing what "on" does; high contrast; don't mix toggles and radios for similar functions. Apple HIG toggles — T1 — VERIFIED — toggles for two opposing states; iOS: switch style only inside list rows, outside lists use toggle buttons; avoid "on/off" text; don't rely on colour alone; keep default green unless contrast needs; macOS: checkboxes for hierarchical/dependent settings. GOV.UK radios — T2 — VERIFIED (see F36).
- Scope: universal.
- Agent rule: IF the control saves immediately THEN switch with a leading label naming the feature and optimistic update + undo/failed-state; IF part of a form with Submit THEN checkbox; IF consent/terms THEN unchecked checkbox, never pre-checked.

### F38 File/photo upload, camera, scanning
- Claim: Prefer system pickers (no permission), state limits up front, allow camera capture and scan-to-fill.
- Evidence: MDN input/file — T1 — VERIFIED — `accept` is a hint only (validate server-side); `capture=user|environment` hints camera for image/video; `multiple`. GOV.UK file-upload — T2 — VERIFIED — state type/size limits, specific error per failure (missing, wrong type, too big, corrupt, password-protected), allow reuse of earlier uploads, larger always-visible drop zone (March 2025 update). Android Photo Picker — T1 — VERIFIED — no permissions, single/multiple, backported to Android 4.4-10 via Play services, falls back to `ACTION_OPEN_DOCUMENT`. Apple App Review 5.1.1(iii)/(iv) — T1 — VERIFIED — prefer out-of-process pickers/share sheets over full access; don't require access to unrelated resources; provide alternatives (e.g., manual address instead of Location). Apple `captureTextFromCamera` (Live Text, iOS 15+) — T1 — VERIFIED — scan text into any `UIKeyInput`/`UITextInput` field; check with `canPerformAction`.
- Scope: iOS/Android/Web.
- Agent rule: IF user must supply an image THEN picker first (no permission), camera as second option; for card/ID/serial entry offer "Scan" where the OS provides it (iOS Live Text, Safari AutoFill card scan MEMORY, Android ML Kit/Google Pay MEMORY) but keep typing as fallback.

### F39 Search inputs
- Claim: Use search semantics and keyboard Search key, reduce typing with suggestions/recents.
- Evidence: MDN input/search — T1 — VERIFIED — mobile shows a Search key; implicit `searchbox` role; clear button; `name=q`. Apple HIG searching — T1 — VERIFIED — placeholder/scope bar shows what is searched, predictive suggestions, recent searches before typing, let users clear history, single search location. enterkeyhint=search — MDN — VERIFIED.
- Scope: universal.
- Agent rule: IF search THEN `type=search enterkeyhint=search`, `autocapitalize=none autocorrect=off` for IDs/queries (tune), live suggestions debounced, no auto-submit on each keystroke unless results are cheap, clear affordance.

### F40 Rich text and long text
- Claim: Avoid rich-text editors on mobile forms; use a plain textarea (optionally Markdown) with counter only if needed.
- Evidence: none authoritative found; HIG text-fields says use text fields for small focused input and text views for larger input — T1 — VERIFIED. Rest is opinion.
- Scope: opinion.
- Agent rule: IF multi-line input THEN textarea/`TextEditor`, `enterkeyhint=enter` (or `send` for chat), autocorrect on, autosave draft; add formatting only if the product requires it.

### F41 Multi-step forms and wizards
- Claim: Split by real-world chunks, show position, preserve data, allow review and resume; step count matters less than field count.
- Evidence: Baymard — T2 — VERIFIED — fields drive usability more than steps; accordion: collapse completed steps into summaries and allow direct edit; guest checkout most prominent (only 38% of sites do; 62% fail). GOV.UK question-pages — T2 — VERIFIED — one thing per page; label/legend may be the page heading; only ask what's needed and explain why. GOV.UK check-answers — T2 — VERIFIED — review page before submit for small/medium transactions; "Change" links (hidden text for AT), return to review after edit, make clear it isn't submitted until confirmed. GOV.UK complete-multiple-tasks — T2 — VERIFIED — task list with statuses (Completed, Incomplete, In progress, Not yet started, Cannot start yet, There is a problem), "Have you completed this section?" for save progress. NN/g wizards — T2 — VERIFIED — for novice/infrequent tasks; show steps; sequential; descriptive buttons; save/resume; keep short; each step self-contained; remember preferences. NN/g progress-indicators — T2 — VERIFIED — show step counts for multi-step processes. WCAG 3.3.7, 3.3.4, 3.3.6, 2.2.5 — T1 — VERIFIED.
- Corroboration / conflict: GOV.UK (one question per page) vs Baymard (fewer fields, accordion/one-page checkout can be fine). GOV.UK's claim rests on service-team research, not published controlled comparisons (weak/context evidence).
- Scope: universal.
- Context: one-thing-per-page suits complex, branching, low-confidence audiences; checkout with autofill benefits from one scrolling page or a short accordion; mobile conversational apps (onboarding) favor 1 decision/screen.
- Agent rule: IF >8-10 fields or branching logic THEN split into steps of 3-6 related fields with "Step 2 of 4" + back that preserves data; IF checkout THEN accordion/single page with collapsed completed sections; ALWAYS finish with a review screen for consequential submissions; persist draft per step.

### F42 Checkout: guest, express pay, autofill, Payment Request
- Claim: Make guest/express the prominent path, collect data inside wallet sheets, defer account creation.
- Evidence: Baymard — T2 — VERIFIED — 18-19% abandon due to forced account creation; guest checkout most prominent button; account creation after purchase. Apple HIG apple-pay — T1 — VERIFIED — offer early (product page, cart), system button no smaller than others, collect shipping/contact/coupons in the Apple Pay sheet, request account creation on confirmation page, prefill registration from Apple Pay data, "Set up Apple Pay" only when supported but not configured. Google Pay — T3 — VERIFIED — place at top of payment methods, show "Pay" not "Continue", request address/email in sheet, guest checkout, data usable only for this transaction. MDN Payment Request — T1 — VERIFIED — secure contexts only; limited availability (not Baseline). web.dev payment — T1 — VERIFIED — show amount on the submit button, don't split card number, don't add manual card-type selector, `inputmode=numeric` + `cc-*`.
- Scope: universal; Apple Pay JS/PassKit specific to Apple.
- Agent rule: IF commerce THEN top of payment section: Apple Pay / Google Pay (system buttons), then guest checkout, then card form with `cc-*` autofill; ask for account after order success.

### F43 Auth friction, social login, magic link, remember-me, recovery
- Claim: Delay sign-in, offer federated + passkey + password options, treat email links/codes as one-time with clear lifetimes, make recovery safe and not enumerable.
- Evidence: Apple HIG managing-accounts — T1 — VERIFIED — don't require account until needed; prefer Sign in with Apple, passkeys, or 2FA with passwords; in-app account deletion with scheduling option; revoke SIWA tokens. HIG sign-in-with-apple — T1 — VERIFIED — button no smaller than other options and visible without scrolling; never ask for a password after SIWA; respect private relay email; support account linking. App Store Guideline 4.8 — T1 — VERIFIED — if you offer a third-party login for the primary account, also offer an equivalent privacy-preserving option (limited data: name+email, private email option, no ad tracking without consent) with listed exceptions; 5.1.1(v) account deletion in-app. GOV.UK create-accounts — T2 — VERIFIED — create accounts only if needed; avoid CAPTCHA; separate create vs sign-in screens. GOV.UK confirm email — T2 — VERIFIED — link rules. OWASP — T2 — VERIFIED — consistent responses, single-use time-limited tokens, rate limiting, invalidate sessions after reset, notify user, no auto-login, security questions only supplemental. web.dev sign-up — T1 — VERIFIED — federated login, `.well-known/change-password`, MFA beyond SMS. NIST — T1 — VERIFIED — AAL timeouts: AAL1 30 days overall; AAL2 24 h overall/1 h inactivity; AAL3 12 h/15 min.
- Magic links: same-device problems (email app switch, deep link, link opened on another device) are MEMORY; "remember me"/stay signed in: no research found; NIST gives session limits only.
- Scope: universal / iOS policy.
- Agent rule: IF app has accounts THEN allow browsing first; show passkey/autofill + "Continue with Apple/Google" (Apple parity per 4.8) + email code; account deletion in-app; recovery: uniform "If an account exists we've sent…", time-limited single-use link/code, prompt passkey creation after recovery.

### F44 WCAG 2.2 requirements that gate forms
- Claim: WCAG 2.2 (Rec 12 Dec 2024) is the operative standard; WCAG 3 is only a Working Draft (10 Sep 2026) and "does not replace WCAG 2".
- Evidence: https://www.w3.org/TR/WCAG22/ and https://www.w3.org/TR/wcag-3.0/ — T1 — VERIFIED. 3.3.1 Error Identification (A); 3.3.2 Labels or Instructions (A); 3.3.3 Error Suggestion (AA); 3.3.4 Error Prevention Legal/Financial/Data (AA: reversible, checked, or confirmed); 3.3.5 Help (AAA); 3.3.6 Error Prevention All (AAA); 3.3.7 Redundant Entry (A, new); 3.3.8 Accessible Authentication Minimum (AA, new); 3.3.9 Enhanced (AAA). 3.3.8: no cognitive-function test (remember/transcribe/manipulate; puzzles; character recall) unless an alternative or a mechanism exists (password manager/paste, email link, WebAuthn/OAuth, object-recognition or personal-content exceptions); applies to every authentication step including MFA and recovery, not to initial sign-up. 3.3.7: auto-populate or offer selection for repeated data, exceptions: essential, security (password creation), no longer valid. 1.3.5 Identify Input Purpose (AA) via autocomplete. 2.5.8 Target Size Minimum (AA): 24x24 CSS px with spacing/inline/equivalent/UA/essential exceptions; 2.5.5 Enhanced AAA 44x44. 2.2.1 Timing Adjustable (A): disable/adjust to >=10x/or warn >=20 s and allow >=10 extensions; >20 h exempt; 2.2.5 Re-authenticating (AAA): continue after re-auth without data loss. 3.2.6 Consistent Help (A). 2.5.3 Label in Name. 4.1.3 Status Messages (AA).
- Scope: universal/legal.
- Agent rule: IF authentication THEN never block paste, support password managers/passkeys/email-link as alternatives, no CAPTCHA puzzles as sole option; IF payment/delete/legal THEN reversible OR validated OR review-and-confirm step; IF multi-step THEN prefill repeated values.

### F45 Session expiry
- Claim: Warn before timeout, keep data, re-authenticate in place.
- Evidence: WCAG 2.2.1 and 2.2.5 — T1 — VERIFIED; NIST AAL timeouts — T1 — VERIFIED; Android process death/save state — T1 — VERIFIED.
- Agent rule: IF session may expire during a form THEN autosave draft, on 401 show re-auth sheet (biometric/passkey) over the form, replay the request with the same idempotency key, and restore state after login; warn >=20 s before forced logout when you control the timer.

### F46 Permission priming (notifications/camera/location)
- Claim: Ask in context at the moment of need, explain value, never pre-alert with fake system dialogs, handle denial gracefully.
- Evidence: Apple HIG privacy — T1 — VERIFIED — ask when feature is used (launch only if essential); purpose strings: active voice, specific, no vague "better experience"; a single custom explanatory screen allowed with one Continue button that opens the system alert; prohibited: incentives, mimicking Allow, screenshots/annotations, Cancel path bypassing alert; Location Button for one-time access; request only what's needed. Apple HIG onboarding — T1 — VERIFIED — put non-essential permissions at first use of feature. Android requesting — T1 — VERIFIED — check, rationale (`shouldShowRequestPermissionRationale`), request, handle; second denial = system stops prompting; degrade only affected features; Android 12+ shows camera/mic indicators. Android usage-notes — T1 — VERIFIED — prefer location button/camera intents/system pickers; request approximate not fine; monitor denial rates. App Store 5.1.1(iv) — T1 — VERIFIED — no manipulating consent; provide alternatives.
- Scope: iOS / Android.
- Context: notification permission (Android 13+ runtime) not separately fetched (MEMORY).
- Agent rule: IF a feature needs a permission THEN trigger on the user's tap of that feature, optionally one explanation sheet (value in one sentence + Continue), call the system prompt, on denial keep feature visible with an inline "Enable in Settings" path; never ask at first launch unless the app is useless without it.

### F47 Destructive actions: confirm vs undo vs typed confirmation
- Claim: Prefer undo for reversible/routine deletes; confirm only for serious irreversible actions; use typed confirmation for catastrophic ones; label buttons with the verb.
- Evidence: Raskin, A List Apart (21 Jul 2007) https://alistapart.com/article/neveruseawarning/ — T2 — VERIFIED — warnings get habituated; use undo (soft delete, time-limited). NN/g confirmation-dialog — T2 — VERIFIED — reserve for serious consequences; cry-wolf habituation; specific verb labels instead of Yes/No; catastrophic: type a word (Mailchimp "DELETE"). Apple HIG alerts — T1 — VERIFIED — avoid alerts for common undoable actions (offer undo); destructive style only when the user did not choose the action deliberately; always include Cancel; avoid OK/Yes/No, use verbs; max three buttons; no vague "Error" titles. HIG action-sheets — T1 — VERIFIED — destructive choice at top, Cancel at bottom. HIG undo-and-redo — T1 — VERIFIED — shake/three-finger swipe expected; don't redefine; describe what will be undone. GOV.UK button — T2 — VERIFIED — warning buttons for irreversible actions, add a confirmation step, never colour alone. Compose Snackbar — T1 — VERIFIED — action label ("Undo"), durations Short/Long/Indefinite. WCAG 3.3.4 — T1 — VERIFIED.
- Scope: universal.
- Agent rule: IF delete/archive/remove is single-item and recoverable THEN perform immediately + snackbar "Undo" (>=5-10 s; keep a soft-delete window server-side); IF bulk/irreversible/costly THEN dialog titled with the object, buttons "Delete project" / "Keep project", destructive style on the verb; IF catastrophic (account, workspace, data export gone) THEN require typed name/word plus a re-auth, explain consequences and timeline (HIG account deletion: schedule option).

### F48 Reducing cognitive load and typing: checklist
- Claim: Combine autofill, correct keyboards, sensible defaults, scanning, typo tolerance and formatting flexibility.
- Evidence: NN/g mobile-input-checklist — T2 — VERIFIED — eliminate fields, labels above, right keyboard, enable paste, allow abbreviations/typos, use device capabilities (camera, GPS, voice, contacts), derive values (state from ZIP), size fields to content, keep field visible with keyboard up in both orientations, no inside-field placeholders. Apple HIG entering-data — T1 — VERIFIED — minimize input, prefill, prefer pickers/menus, support paste and drag/drop, validate dynamically, never prepopulate password fields. NN/g 4-principles — T2 — VERIFIED — structure, transparency (upfront info, time, required docs, progress), clarity (plain 6th-8th grade language, positive wording, one question per question), support. Baymard — T2 — VERIFIED — Luhn check; numeric keyboards; large tap targets.
- Agent rule: apply in order: remove field → infer/prefill → autofill tokens → right keyboard → pick instead of type → scan → accept liberal formats → forgiving validation → undo.

### F49 Touch targets, font size, zoom in form controls
- Claim: Controls >=16 px font on web to avoid iOS focus zoom; targets >=44 pt (iOS) / 48 dp (Android) / 48 px web.dev, WCAG AA minimum 24 CSS px.
- Evidence: web.dev design-basics — T1 — VERIFIED — 48px tap target, >=1rem font to prevent iOS zoom, spacing between controls. WCAG 2.5.8 — T1 — VERIFIED (24 CSS px AA; 44 AAA). Material TextField.md — T1 — VERIFIED — icon target 48dp min. HIG 44 pt — MEMORY (other slice). MDN meta viewport — T1 — VERIFIED — never disable zoom.
- Agent rule: IF web THEN `input,select,textarea{font-size:max(16px,1rem)}` and 48px min-height; IF native THEN 44 pt/48 dp minimum hit area including icon buttons inside fields.

---

## Numbers table

| Value | Applies to | Source | Tag |
|---|---|---|---|
| 11.3 avg checkout form fields (2024); 8 recommended; 12.7 (2019); 11.8 (2021); 5.1 avg steps | e-commerce checkout | baymard.com/blog/checkout-flow-average-form-fields | VERIFIED |
| 89% split first/last name; 75% show Address Line 2; 35% promo field; 24% separate billing default; 84% account creation inside checkout | checkout field audit | same | VERIFIED |
| 5-30% longer checkout steps when optional fields visible | checkout | baymard.com/research-articles/current-state-of-checkout-ux | VERIFIED |
| 61% don't mark both required/optional; 32% skip required fields when only one type marked | forms | same | VERIFIED |
| 94% no adaptive error messages | checkout | same | VERIFIED |
| 31% of sites have no inline validation | e-commerce | baymard.com/blog/inline-form-validation | VERIFIED |
| 17% abandon for complexity; 18% forced account; 19% card trust; 70.22% avg cart abandonment (50 studies) | cart abandonment | baymard.com/lists/cart-abandonment-rate | VERIFIED |
| 62% sites don't make guest checkout most prominent (another page: only 38% do) | checkout | baymard current-state; /checkout-flow-ux-optimization | VERIFIED |
| Inline validation study: n=22, 6 forms; +22% success, -22% errors, +31% satisfaction, -42% time, -47% fixations; 30-50% viewed easy-field messages vs 80-100% for hard fields (2009) | validation | alistapart.com/article/inline-validation-in-web-forms/ | VERIFIED |
| Label above: ~50 ms label-input saccade vs ~500 ms left-aligned | label placement | uxmatters Penzo 2006 | VERIFIED |
| 16 px (1rem) min control font to avoid iOS Safari focus zoom | web inputs | web.dev design-basics | VERIFIED |
| 48 px tap target (web.dev); 24x24 CSS px AA (WCAG 2.5.8); 44x44 AAA (2.5.5); 48dp icon min (Material) | touch targets | web.dev / W3C / Material TextField.md | VERIFIED |
| Material text field: min width 56dp (88dp with label), max 488dp, default 245dp; outlined stroke 1dp/2dp focused; filled indicator 2dp focused | Material | material-components-android TextField.md | VERIFIED |
| GOV.UK email: show >=30 chars, accept 254; date widths 2/2/4 | GOV.UK components | email-addresses; date-input | VERIFIED |
| GOV.UK password: min 8, no max, 5-10 attempts before lock | passwords | patterns/passwords | VERIFIED |
| NIST 800-63B-4: password min 15 (single-factor) / 8 (with MFA); accept >=64 chars; OOB code >=6 digits, valid 10 min, SMS restricted; <=100 consecutive failures; AAL1 30 d, AAL2 24 h/1 h idle, AAL3 12 h/15 min | auth | pages.nist.gov/800-63-4/sp800-63b.html | VERIFIED |
| GOV.UK security code: 5 digits, valid 15 min, any code >2 h rejected, delay after 10 wrong entries | OTP | patterns/confirm-a-phone-number | VERIFIED |
| SMS Retriever: 11-char app hash, 5 min listen window | Android OTP | developer.android.com/identity/sms-retriever | VERIFIED |
| WebOTP SMS last line format `@domain #code` | web OTP | web.dev/articles/sms-otp-form; MDN | VERIFIED |
| WCAG 2.2.1: warn >=20 s, extend >=10 times, >20 h exempt | timeouts | w3.org Understanding 2.2.1 | VERIFIED |
| Stripe idempotency: UUID v4, <=255 chars, keys pruned >=24 h | double submit | docs.stripe.com/api/idempotent_requests | VERIFIED |
| NN/g response limits 0.1 s / 1 s / 10 s; spinner 2-10 s, percent-done >10 s | loading feedback | nngroup.com response-times, progress-indicators | VERIFIED |
| Chrome 108 (Oct 2022) default `interactive-widget=resizes-visual`; dvh Chrome 108+/Firefox 101+/Safari 15.4+ | web keyboard | chrome blog; web.dev viewport-units | VERIFIED |
| Baseline dates: inputmode Dec 2021; enterkeyhint Nov 2021; visualViewport Aug 2021; :user-invalid Nov 2023; type=date Apr 2021; autocorrect Sep 2026 | web platform | MDN pages | VERIFIED |
| WCAG 2.2 Rec 12 Dec 2024; WCAG 3.0 Working Draft 10 Sep 2026 | standards | w3.org/TR | VERIFIED |
| Android edge-to-edge enforced when targeting SDK 35 | IME insets | developer.android.com compose insets | VERIFIED |
| Sign in with Apple custom button min 140x30 pt | iOS | HIG sign-in-with-apple | VERIFIED |
| Alert max 3 buttons; HIG date picker minute intervals dividing 60 (e.g., 15) | iOS | HIG alerts, pickers | VERIFIED |
| Passkey vendor stats (X 2x success; pixiv +29%; Dashlane +70% conversion; Zoho 6x; Tokyu 12x; Mercari 3.9x; KAYAK ~0.5x time; Yahoo! JAPAN 11% adoption) | passkeys | developers.google.com/identity/passkeys/case-studies | VERIFIED (vendor-reported) |
| Smart-default 90% rule; 5-7 visible inputs | practitioner heuristics | Smashing 2017 | VERIFIED as claim, T4 opinion |
| NN/g "78% vs 42% error-free first submit" | form guidelines | nngroup web-form-design (summarizer output) | UNVERIFIED: do not use |

---

## Mobile form defaults cheat table
Legend: "*" = constant name from MEMORY, not re-verified this session. Timing: B = blur, S = submit, L = live (debounced), L-err = live only after first error (reward early), Len = when expected length reached.

| Field | Web (type / inputmode / autocomplete / enterkeyhint / other) | iOS UIKit / SwiftUI | Android View / Compose | Flutter | React Native | Timing |
|---|---|---|---|---|---|---|
| Email | `type=email` `autocomplete=email` `enterkeyhint=next` `spellcheck=false` (autocapitalize forced off) | `.emailAddress` + `textContentType(.emailAddress)`, autocap none | `textEmailAddress` + `AUTOFILL_HINT_EMAIL_ADDRESS`*; Compose `KeyboardType.Email` + `ContentType.EmailAddress` | `TextInputType.emailAddress` + `AutofillHints.email` | `keyboardType="email-address"` `autoComplete="email"` `textContentType="emailAddress"` `autoCapitalize="none"` | B (format only, permissive) + typo hint; verify by link/code |
| Username / identifier | `type=text` (or email) `autocomplete=username` (+ ` webauthn`) `autocapitalize=none` `autocorrect=off` `spellcheck=false` | `textContentType(.username)`, autocap none, autocorrect off | `AUTOFILL_HINT_USERNAME`; `ContentType.Username` | `AutofillHints.username` | `autoComplete="username"` `textContentType="username"` | S (sign-in); L debounced availability check (sign-up) |
| Current password | `type=password` `autocomplete=current-password` + show/hide, `spellcheck=false`, `autocapitalize=none` | `SecureField` / `isSecureTextEntry` + `.password` | `textPassword` + `AUTOFILL_HINT_PASSWORD`; Compose `SecureTextField` + `ContentType.Password` | `obscureText` + `AutofillHints.password` | `secureTextEntry` `autoComplete="current-password"` `textContentType="password"` | S only; generic error |
| New password | `autocomplete=new-password` `minlength` `passwordrules` | `.newPassword` + `passwordRules` | `AUTOFILL_HINT_NEW_PASSWORD`; `ContentType.NewPassword` | `AutofillHints.newPassword` | `autoComplete="new-password"` `textContentType="newPassword"` `passwordRules` | L (blocklist/length/strength), no confirm field |
| OTP / verification code | `type=text` `inputmode=numeric` `autocomplete=one-time-code` `maxlength=N` `enterkeyhint=done` `spellcheck=false`; WebOTP optional | `.oneTimeCode` + `.numberPad` | `AUTOFILL_HINT_SMS_OTP` + `number`; `ContentType.SmsOtpCode`; SMS Retriever/User Consent | `AutofillHints.oneTimeCode` + `TextInputType.number` | `autoComplete="one-time-code"` (Android `sms-otp`) `textContentType="oneTimeCode"` `keyboardType="number-pad"` | Len (auto-submit) + S |
| Phone | `type=tel` `autocomplete=tel` (or `tel-national` + country select) | `.phonePad` + `.telephoneNumber` | `phone` + `AUTOFILL_HINT_PHONE_NUMBER`; `KeyboardType.Phone` | `TextInputType.phone` + `AutofillHints.telephoneNumber` | `keyboardType="phone-pad"` `autoComplete="tel"` `textContentType="telephoneNumber"` | B, lenient (libphonenumber) |
| Full name | `type=text` `autocomplete=name` `autocapitalize=words`* `autocorrect=off` `spellcheck=false` | `.name`, autocap `.words`, autocorrect off | `textPersonName*|textCapWords*` + `AUTOFILL_HINT_PERSON_NAME`; `capitalization=Words` | `TextInputType.name` + `AutofillHints.name` + `TextCapitalization.words` | `autoCapitalize="words"` `autoComplete="name"` `textContentType="name"` | S (non-empty only) |
| Given / family name | `autocomplete=given-name` / `family-name` | `.givenName` / `.familyName` | `AUTOFILL_HINT_PERSON_NAME_GIVEN/FAMILY` | `AutofillHints.givenName/familyName` | `autoComplete="given-name"/"family-name"` | S |
| Street address | `autocomplete=street-address` (textarea) or `address-line1/2`; prefix `shipping`/`billing` | `.streetAddressLine1/.fullStreetAddress` | `AUTOFILL_HINT_POSTAL_ADDRESS_STREET_ADDRESS` | `AutofillHints.streetAddressLine1` | `autoComplete="street-address"` / `"address-line1"` | S |
| City / region | `address-level2` / `address-level1` | `.addressCity` / `.addressState` | postal-address locality/region hints | `AutofillHints.addressCity` | `textContentType="addressCity"` | S |
| Postal code | `autocomplete=postal-code`; `inputmode=numeric` only for digit-only countries | `.postalCode` | `AUTOFILL_HINT_POSTAL_CODE` | `AutofillHints.postalCode` | `autoComplete="postal-code"` | B/Len (country-aware) |
| Country | `<select autocomplete=country>` (codes) or combobox `country-name` | `.countryName` | n/a (picker) | `AutofillHints.countryName` | `autoComplete="country"` | S |
| Card number | `type=text` `inputmode=numeric` `autocomplete=cc-number` `pattern="[0-9 ]+"`, single field | `.creditCardNumber` + `.numberPad` | `AUTOFILL_HINT_CREDIT_CARD_NUMBER`; `ContentType.CreditCardNumber` | `AutofillHints.creditCardNumber` | `autoComplete="cc-number"` `textContentType="creditCardNumber"` | Len (Luhn) / B |
| Card expiry | `autocomplete=cc-exp` (one field MM/YY) or `cc-exp-month`+`cc-exp-year` | `.creditCardExpiration` (iOS 17+) | `AUTOFILL_HINT_CREDIT_CARD_EXPIRATION_DATE` | `AutofillHints.creditCardExpirationDate` | `autoComplete="cc-exp"` | B |
| Card CVC | `autocomplete=cc-csc` `inputmode=numeric` `minlength=3 maxlength=4`; label "Security code" | `.creditCardSecurityCode` (iOS 17+) | `AUTOFILL_HINT_CREDIT_CARD_SECURITY_CODE` | `AutofillHints.creditCardSecurityCode` | `autoComplete="cc-csc"` | B |
| Birthdate (known date) | 3 fields `bday-day/month/year` `inputmode=numeric` (GOV.UK) | `.birthdate*` (iOS 17+) / date picker | date widget `AUTOFILL_TYPE_DATE`; M3 `DatePicker` Input mode | `AutofillHints.birthday` | `autoComplete="birthdate-day"…` | S (priority: missing → impossible → invalid) |
| Integer / ID / PIN | `type=text` `inputmode=numeric` `pattern=[0-9]*` (NOT `type=number`) | `.numberPad` (or `.asciiCapableNumberPad`) | `number` (PIN: `numberPassword*`) | `TextInputType.number` | `keyboardType="number-pad"` | B |
| Decimal / currency | `inputmode=decimal` + prefix/suffix outside | `.decimalPad` + NumberFormatter | `numberDecimal*` | `numberWithOptions(decimal: true)` | `keyboardType="decimal-pad"` | B |
| URL | `type=url` (normalize missing scheme) `autocapitalize=none` | `.URL` | `textUri` | `TextInputType.url` | `keyboardType="url"` | B |
| Search | `type=search` `enterkeyhint=search` `name=q` | `.webSearch`/search bar, `.submitLabel(.search)` | `imeOptions actionSearch` | `TextInputAction.search` | `returnKeyType="search"` | L (suggestions) + S |
| Free text / message | `<textarea>` `enterkeyhint=enter|send` autocorrect on | `TextEditor`; `.sentences` | `textMultiLine|textCapSentences` | `TextInputType.multiline` | `multiline` `autoCapitalize="sentences"` | S / character-count soft limit |
| Code/serial (A-Z0-9) | `inputmode=text` `autocapitalize=characters` `autocorrect=off` `spellcheck=false` | `.asciiCapable`, smart dashes/quotes off | `textNoSuggestions|textCapCharacters` | `TextInputType.text` + `TextCapitalization.characters` | `autoCapitalize="characters"` `autoCorrect={false}` | B |

---

## Comparison tables

### Label patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Static label above (T2 evidence) | Persistent, fast scan, AT-friendly, translates | Uses vertical space | Default for all forms | Never a problem; only space-constrained search bars |
| Floating label (Material) | Saves space, label stays visible when filled | Small label, filled field looks like a default, limited testing, 2.5.3 pitfalls | Material-system dialogs/short forms | Long forms, low-vision audiences, long labels |
| Placeholder as label | Minimal | Disappears, contrast, AT, error recovery | Single search box only | Anything with errors or review |
| Left label | Dense desktop | Horizontal scan, narrow screens | Long desktop forms | Phones |

### Validation timing
| Strategy | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Submit only + error summary (GOV.UK) | No premature errors, simple, AT-robust | Late discovery | Short/medium public forms, one-thing-per-page | Long single-page forms with hidden rules |
| On blur + clear on input (reward early, punish late) | Fixes acknowledged quickly, little interruption | Needs per-field state; blur false positives (accidental tab) | Most mobile forms | Empty required fields (wait for submit) |
| Live per keystroke | Immediate guidance | Premature errors, noise, a11y chatter | Password strength, username/promo availability, char limits | Names, addresses, emails |
| Length-triggered (Len) | Catches typos at the right time | Needs known length | Card, postcode, OTP | Variable-length data |
| Gate the button (HIG) | Prevents empty submit | Opaque, a11y issues | 1-2 required fields in short native steps | Complex forms |

### OTP input patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Single `one-time-code` field | OS autofill, WebOTP, paste, AT-simple | Less "designed" look | Default | Never |
| Split digit boxes | Visual clarity, chunking | Paste/autofill/backspace/AT must be rebuilt; caret and focus bugs; Android offers per-position hints | Native apps with proven handling | Web without paste-distribute, or if you can't test AT |
| Single input styled as boxes (letter-spacing/overlay) | Keeps behaviors, looks like boxes | Alignment hacks | Brand-driven designs | - |
| Magic link | No typing | Cross-device/app switching, link expiry | Email-centric low-risk | Shared devices, security-sensitive |
| Passkey/biometric | Fast, phishing-resistant | Enrollment, recovery design | Primary for returning users | No recovery path |

### Date input
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| 3 numeric text fields (GOV.UK) | Fast for known dates, AT-safe, autofill `bday-*` | More fields | DOB, known past dates | Near-future scheduling |
| Calendar picker | Contextual (weekdays, availability) | Slow for far dates | Booking within ~1 yr | Birthdates |
| Native `type=date`/wheel | Familiar OS UI | Inconsistent, no placeholder, locale | Simple internal forms; with min/max | Public forms needing consistent errors |
| Dropdown triple | Constrained | Many taps, slow (NN/g, Wroblewski) | - | Always avoid |
| Single text field with flexible parsing | Fast | Needs parser | Power users, dates far away | Ambiguous locales without format hint |

### Select-like controls
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Radios (stacked) | Options visible, 1 tap | Vertical space | <= ~5-7 options | Long lists |
| Segmented control/pull-down | Compact | Limited labels | 2-4 short options | Long labels |
| Native select/picker | OS UI, familiar | Opaque, desktop issues (GOV.UK) | Mid-size lists | Needs search |
| Combobox/autocomplete | Type-ahead, scalable | Hard to build accessibly | Country, city, long lists (<= few hundred in GOV.UK component) | Short lists |
| Stepper | Quick small counts | Not for big ranges | 1-8 quantities | Large values |
| Slider | Fast approximate | Imprecise, thumb occlusion | Rough filters | Exact values |

### Multi-step patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| One thing per page (GOV.UK) | Focus, easy error recovery, resumable | Many pages, slower for experts | Complex/branching public services | Short known forms |
| Single page | Fast for autofill users | Long scroll, overwhelm | Checkout with <=8-12 fields | Branching |
| Accordion checkout | Compact, editable | Needs good summaries | Mobile checkout (Baymard) | Poor state handling |
| Wizard (NN/g) | Novices, rare tasks | Tedious if long | Setup/config | Repeated expert tasks |
| Task list (GOV.UK) | Multi-session, order-free | Needs status logic | Long applications | Short flows |

### Confirm vs undo
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Undo snackbar | No friction, no habituation | Needs soft delete/timing | Reversible deletes/archives | Truly irreversible/external effects |
| Confirm dialog (verb buttons) | Clear stop | Habituation | Serious/costly actions | Routine actions |
| Typed confirmation | Forces attention | Friction | Catastrophic (delete workspace) | Common actions |
| Review/check-answers page | Catches errors across fields | Extra step | Submissions with legal/financial effect | Quick settings |

### Authentication methods
| Method | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Passkey (conditional UI/Credential Manager) | Phishing-resistant, fast (vendor stats) | Recovery/enrollment | Primary sign-in | No fallback |
| Password + manager | Universal | Phishing, user burden | Fallback | Forced rules/no paste |
| Social/Apple/Google | One tap | Parity rules (App Store 4.8), dependency | Consumer apps | Enterprise-only |
| Email code/link | No password | Delivery delays, app switching | Low-frequency sign-in, verify | High-frequency |
| SMS OTP | Familiar | NIST "restricted", SIM swap | Secondary where needed | Primary for high-risk |
| Biometric re-auth | Quick step-up | Device-bound only | Re-authorize sensitive actions | First sign-in |

---

## Anti-patterns found

| Problem | Why it happens | Better alternative | Source |
|---|---|---|---|
| Placeholder as label | Space/looks clean | Persistent label + example placeholder | NN/g, Baymard, GOV.UK |
| `type=number` for card/OTP/phone/ZIP | "numeric keyboard" shortcut | `type=text inputmode=numeric` | GOV.UK blog, MDN, web.dev |
| Split first/last name, strict Latin regex | Database schema leaks into UI | One full-name field, Unicode-aware validation | W3C, GOV.UK, Baymard |
| Premature "invalid email" while typing | Live validation on keystroke | Validate on blur; clear on input | Baymard, NN/g, Smashing |
| Clearing the form on error | Server redirect re-renders empty | Re-render with values (not passwords) | GOV.UK, NN/g, WCAG 3.3.7 |
| Disabled submit with no explanation | Prevents bad submits cheaply | Enabled button + error summary | GOV.UK, A. Silver |
| Confirm-password / confirm-email fields | Copy of legacy pattern | Show/hide toggle; verify by link/code | GOV.UK, web.dev |
| Blocking paste in password/OTP | Misguided security | Allow paste, password managers | NIST, GOV.UK, WCAG 3.3.8 |
| Composition rules / forced rotation | Compliance habit | Length + blocklist, rotate on compromise | NIST 800-63B-4 |
| `autocomplete=off` on login/address | Fear of storing data | Correct tokens | MDN, WCAG 1.3.5 |
| Input masks that fight paste/caret | Visual neatness | Liberal input + display formatting | GOV.UK, web.dev |
| Fixed bottom bar hidden by keyboard (web) | 100vh/`position: fixed` assumptions | In-flow submit, sticky, visualViewport | Chrome blog, web.dev |
| Font <16 px on iOS web inputs | Compact design | >=16 px | web.dev |
| Disabling zoom to stop focus-zoom | Quick hack | Fix font size | MDN meta viewport |
| Autofocus on page load (mobile) | "Save a tap" | Focus only in dialogs/search pages | MDN autofocus |
| Dropdown for 3 options / date triple | Component reuse | Radios / date field | GOV.UK, NN/g, Wroblewski |
| Confirm dialog for every delete | Safety reflex | Undo snackbar | Raskin, NN/g, HIG |
| "Yes/No/OK" dialog buttons | Lazy copy | Verb labels, "Cancel" | HIG, NN/g |
| Permission prompt at first launch | Get it over with | Ask at point of use, rationale | HIG, Android |
| Fake "Allow" pre-alert screens | Boost grant rate | One-button explainer then system alert | HIG privacy |
| Sliders for precise values | Looks modern | Stepper/text field | NN/g |
| Account creation before purchase | Marketing data | Guest + post-purchase account | Baymard, HIG Apple Pay |
| Split OTP boxes without paste/AT | Visual preference | Single input or hardened widget | web.dev, GOV.UK, Android docs |
| SMS-only MFA as the only option | Familiarity | Passkeys/authenticator + SMS fallback | web.dev, NIST |
| Assuming `autocorrect`/smart punctuation harmless | Defaults | Disable on IDs/emails/URLs | Baymard, MDN, UITextInputTraits |
| Re-using `FocusNode`/not moving focus on "Next" | Flutter default | Explicit `nextFocus()` | Flutter docs |

---

## Disagreements and weak-evidence zones

1. Required vs optional marking: GOV.UK (never asterisks, mark optional) vs NN/g (asterisk required) vs Baymard (mark both). Pick by field mix (F6).
2. Inline vs submit-only validation: Baymard/NN/g/Smashing/Wroblewski/HIG favor blur-timed or dynamic validation; GOV.UK favors submit-only. The headline "22% better" is from n=22, 2009, best of five variants on task success, and the same paper shows no benefit for easy fields.
3. Disabled submit: HIG gates Continue; GOV.UK and A. Silver forbid; web.dev disables after click.
4. Floating labels: NN/g tolerates; Baymard says untested; Material ships by default; no controlled evidence.
5. Password confirm field: GOV.UK/web.dev/GOV.UK-research against; OWASP reset flow for. Show-by-default (Nielsen 2009) vs hidden-with-toggle (everyone now).
6. Password minimum: GOV.UK 8 vs NIST 15 (single-factor). Lockout: GOV.UK 5-10 vs NIST 100 failures (different threat models).
7. Masks: GOV.UK avoid vs Smashing/NN/g auto-format.
8. Address lookup: GOV.UK lookup-first (UK) vs web.dev lookup-secondary (global).
9. One-thing-per-page vs single-page checkout (GOV.UK vs Baymard); GOV.UK evidence is service research, not published controlled comparisons.
10. Passkey prompt timing: FIDO says account tasks (creation/recovery/settings), sign-in prompts underperformed; Google lists sign-in as one of four moments.
11. Dropdown harm evidence is desktop/older; mobile native pickers may differ.
12. Weak or no evidence: split OTP boxes; resend-timer durations; thumb-zone placement for sticky CTAs; "7+-2" field counts (Smashing "5-7 inputs at a time" is a heuristic, not a finding); country-first address ordering; passkey adoption stats from blogs; numeric thresholds for radio-vs-select; magic-link usability.
13. Vendor stats (Google case studies) are self-reported, selected successes.
14. Baymard numbers drift across pages (11.3 vs 19.9 vs 23.48 "form elements") because of different definitions/years.

---

## Gaps (what I could not verify)

- m3.material.io text-field guidelines, M3 Expressive form changes: pages unfetchable; relied on Material Components Android/material-web docs.
- Apple HIG text-fields and entering-data pages are dated June 2023; iOS 26 / Liquid Glass impact on text fields, keyboards, and autofill not verified.
- Safari/Firefox support for `interactive-widget`; whether iOS Safari now exposes keyboard geometry other than via visualViewport.
- Claim that iOS number/decimal pads lack a Return key (only implied by RN docs note); Safari's form assistant bar behavior.
- Split-box OTP: iOS autofill into multiple fields; authoritative guidance (none found).
- Flutter `AutovalidateMode.onUnfocus` details; `FocusState`-based focus advance in SwiftUI; RN `KeyboardAvoidingView` best config.
- Native screen-reader error announcements (TalkBack/VoiceOver/Compose semantics `error()`), only MEMORY.
- Android 13+ notification runtime permission UX specifics; Android 14+/16 autofill and Credential Manager autofill changes.
- Progressive profiling, magic-link, remember-me, resend-timer research: no primary sources.
- Country-first address UX and libaddressinput guidance.
- Camera card scanning (Safari AutoFill scan, ML Kit, Google Pay) details beyond iOS Live Text.
- Baymard inline-labels article date (believed ~2014).
- NIST SP 800-63B-4 final publication date (believed 2025); only page text checked.
- WebSearch quota (200/200) exhausted partway, so Baymard/NN/g paywalled sections and additional corroboration (e.g., Bargas-Avila et al. 2007 "Do not show errors right away", Seckler et al. 2015 form guideline evaluation: MEMORY) were not fetched.
