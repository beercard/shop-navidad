# Sign-in, OTP and first-run flow: consumer money transfers (Flutter, iOS + Android)
Tags: [S] standard, [P] platform, [R] research, [C] consensus, [H] judgment/heuristic, [L] legal/policy. Code: `otp_screen.dart`, `app_theme.dart`.

## 1. Goal and primary action per screen (one filled button each)
| Screen | User goal | Primary action | Secondary (text buttons) |
|---|---|---|---|
| S0 Launch | Get in fast | none (system splash, no custom animation) | none |
| S1 Sign-in | Identify myself | "Continue" (phone number) | "Sign in with passkey" (if enrolled), "Use email instead", "See fees and rates" (public, read-only) |
| S2 Verify number | Prove I own the number | "Verify" (also auto-submits at 6 digits) | "Send a new code", "Change number", "Get the code by email instead" |
| S3 Sign in faster | Skip the code next time | "Turn on Face ID" (label follows device biometry) | "Not now" (same row, same size) |
| S4 First-run Home | Send money | "Send money" | checklist rows: Verify identity, Add recipient, Get transfer alerts |
| S5 Unlock (returning) | Open the app | system biometric prompt | "Use phone number instead" |
| S6 Session expired | Continue where I was | "Sign in" sheet over the preserved route | none |

## 2. Flow map
```
Launch -> session valid? -yes-> S5 Unlock -ok-> Home
          -no/expired-> S1 Sign-in -Continue-> S2 OTP -ok-> new device? -yes-> S3 -> Home (S4)
S1 -See fees-> public fee calculator (no account)     S2 -Change number-> S1     S2 -email-> S2 (email code)
Home checklist: Verify identity -> rationale -> camera -> KYC | Transfer alerts -> rationale -> OS prompt (on tap only)
```
Onboarding decision [H]: no tutorial carousel. NN/g found no task benefit from tutorials (91% vs 94% success, n=70, 4 iOS apps) [R]. Setup that functions (biometrics, KYC, alerts) is a checklist on Home; the fee/rate/total preview is the first-send screen's own job. If stakeholders require slides: max 3, Skip top-trailing, Next always visible, swipe optional, static art under Reduce Motion, A/B test against none.

## 3. Auth choices
- Primary: phone number + SMS code (sign-in and sign-up are one path, so the response is uniform: "If this number can sign in, we sent a code" [C], no account enumeration). Assumes a phone-number-identity market.
- Fallbacks: email code (alternative OTP method [S]); passkey/biometric for returning users via platform APIs (BiometricPrompt/Credential Manager, LocalAuthentication) [P]. No password: nothing to reuse or phish, but SMS is a "restricted" authenticator in NIST 800-63B-4 [S], so promote passkey on S3 and step up high-value transfers (explicit confirm tap after biometric) [P]. Flag SIM-swap risk to security.
- No Apple/Google sign-in: KYC needs a verified phone anyway; App Store 4.8 applies only when a third-party login is offered for the primary account [L, from memory, re-verify].
- Value before sign-in: public "See fees and rates" (needs real, regulated rates; assumption). Terms and Privacy are links beside Continue; no pre-checked marketing consent [L]. Whether explicit consent is legally required: ask counsel.
- Session: 401 -> S6 sheet, route and drafts kept, retry replays with the same idempotency key [R]. Money-moving actions always need per-use auth [P].

## 4. OTP rules (implemented in `otp_screen.dart`)
- One real field, `AutofillHints.oneTimeCode`, `TextInputType.number` (never a number-typed ID), digits-only formatter, decorative boxes underneath [R]. Paste of "123 456" works. Split inputs were rejected: no evidence, breaks paste/AT.
- 6 digits, auto-submit at length 6 plus a visible Verify button that stays enabled (short code -> "Enter all 6 digits.") [R].
- Copy states destination (masked) and lifetime: "We sent it by SMS to +62 812 ••• 3456. It expires in 10 minutes." Server: 10-minute single-use code (NIST), previous code valid until expiry, per-challenge idempotent verify [S].
- Resend: 30 s cooldown with deadline-based countdown (correct after backgrounding), text "Resend code in 24 s" (reason shown, not a mute disabled button) [H]. After resend: "New code sent to ..." in the live region. Assumed cap: 3 resends / 15 min, then email code or support (product to confirm).
- Attempts: server limit assumed 5 wrong codes, then lock; client shows `Retry-After` in minutes and disables the field [H]. Wrong or expired code clears the field and refocuses (exception to "preserve input", since an OTP is never reusable). Offline/5xx/timeout keep the code.
- Alternative method visible at all times. No CAPTCHA, no puzzle, paste allowed (WCAG 3.3.8) [S].
- Android auto-read needs the SMS User Consent API via plugin (no READ_SMS; Play restricts SMS permissions, from memory) [P]. iOS shows the code on the keyboard (QuickType).

## 5. Permission handling
Rule: ask on the user's tap of the feature, optional one-sentence rationale with a single neutral "Continue", then the OS prompt. Never at launch, never a fake "Allow", no incentive [P].
| Permission | Trigger | Rationale (benefit, one sentence) | If denied |
|---|---|---|---|
| Biometrics | S3 "Turn on Face ID" | "Open the app with Face ID instead of a code." | iOS asks once: S3 skipped, Settings > Security entry only. Lockout: "Face ID is locked. Use your phone passcode, then try again." Not enrolled: option hidden |
| Camera (KYC) | Tap "Verify identity" | "We scan your ID so you can send money." | Inline: "Camera access is off. Turn it on in Settings to scan your ID." [Open Settings] [Upload a photo instead] (system picker, no permission) |
| Notifications | Tap "Get transfer alerts" or after first transfer | "Get an alert when your transfer is delivered or needs action." | Row shows "Off in Settings"; status stays visible in-app; [Open Settings] only on tap; Android second denial is permanent |
| SMS, contacts, location, tracking | not requested in this flow | n/a | n/a (recipient entry is manual; system contact picker later needs no permission) |

## 6. States (loading / error / offline / denied), each with an exit
| Screen | Loading | Error | Offline | Denied |
|---|---|---|---|---|
| S1 | In-button spinner + "Sending code..." within 100 ms; at 5 s "Still sending..."; 15 s timeout | Bad format on blur: "Enter a phone number in the correct format, like +62 812 3456 7890". 429: "Too many requests. Try again in 2 minutes." Unsupported country: "[App] isn't available in your country yet." 5xx: "Couldn't send the code. Try again." Number preserved | Inline "You're offline. Connect to continue."; Continue still pressable and reports the same | n/a |
| S2 | In-button "Verifying..." (static icon under Reduce Motion), 15 s timeout -> "Couldn't verify the code. Your code is kept. Try again." | Wrong: "That code isn't right. 3 attempts left." Expired: "This code has expired. Send a new code." Locked: "Too many attempts. Try again in 12 min." Resend failed: "Couldn't send a new code. Try again." | "You're offline. Reconnect, then verify. Your code is kept." | n/a (no SMS permission) |
| S3 | System sheet | Failed/cancelled: back to S3 idle, "Not now" always works | n/a (local) | See section 5 |
| S4 Home | Skeleton only if load > ~1 s (delay 300 ms, hold 400 ms), exact final layout, never on buttons; 10 s -> error | In-place "Couldn't load your account." [Try again], navigation kept | First run, nothing cached: "You're offline. Connect to finish setup." [Try again]; otherwise banner "Offline. Showing saved data. Updated 3 min ago" | Camera/notification rows per section 5 |
| S4 empty | n/a | n/a | n/a | Designed first-use: "Send your first transfer" + one sentence + "Send money" |
| S5 | System prompt | 3 failures -> S1 with "Use phone number instead" | Local unlock works offline; network calls fail later with their own states | Biometric denied/not enrolled -> S1 |
| S6 | In-button | "Couldn't sign you in. Try again." | Inline offline note | n/a |
Surfaces: inline for fields, in-place for regions, banner only for persistent connectivity, snackbar never for errors, no dialogs. Errors never use "Oops/Please/Invalid", no codes [C].

## 7. Motion plan (every animation named by job; tokens in `Motion`)
| Element | Job | Enter / exit | Curve | Reduce Motion |
|---|---|---|---|---|
| S1 -> S2 push | functional | iOS system push; Android shared-axis X, 30 dp + fade, 300 / 210 ms | decelerate (0,0,0,1) / accelerate (0.3,0,1,1) | cross-fade 120 ms or instant |
| Button press | feedback | state layer 100 ms, no scale | standard (0.2,0,0,1) | keep (color only) |
| In-button spinner | feedback (progress) | appears <= 100 ms, loops | linear | static icon + text |
| OTP box active / error border | feedback | 100 ms colour/width only | standard | instant |
| Error / status message | feedback | opacity cross-fade 150 ms, no shake; + haptic + icon + text | standard | instant |
| Countdown, digit entry | none (text swap) | 0 ms | n/a | same |
| Verified | feedback | label swap + light haptic; navigation starts at once, never waits | n/a | same |
| Skeleton -> content | functional | cross-fade 150 ms; shimmer replaced by slow opacity pulse, static after 5 s | linear | static placeholder |
| Checklist item done | feedback | check fill 200 ms, no pop | standard | instant |
| Offline banner | functional | fade 200 / 140 ms, no slide | standard | instant |
| Custom sheets (rationale, S6) | functional | 250 / 175 ms, spring zeta 0.9 or decelerate | spring | fade 120 ms |
Decorative motion: none (no confetti, parallax, loops, Lottie). Concurrent animated elements per screen <= 3. Frequent actions (digit entry) get near-zero motion [P-iOS HIG].
Reduced motion: `MediaQuery.disableAnimationsOf(context)` through `Motion.of`; the skill says iOS Reduce Motion is a separate Flutter flag, so verify on a device (section 11).

## 8. Accessibility
- Names/roles/states: field "Verification code, 6 digits"; boxes excluded from semantics; title is a header; buttons keep visible text as name (Label in Name, WCAG 2.5.3) [S].
- Announcements: one persistent live region for errors and "code sent" (no focus move) [S 4.1.3]. `SemanticsService.announce` is deprecated for Android API 36 (Flutter 3.32 notes), so the live region is the announcement path. Countdown is not announced per tick.
- Focus: field autofocused on S2; after an error focus stays in the field; system Back never intercepted.
- Targets >= 48 dp (`minimumSize`, `MaterialTapTargetSize.padded`), >= 8 gaps [S][P]. Boxes use min height, never fixed; digits `FittedBox(scaleDown)`; screen scrolls; no text-scale clamp; QA at 200% / AX5 and 320 dp.
- Contrast computed (script, WCAG formula): light text 17.4, secondary 7.0, tertiary 5.1, input border 3.32, focus 5.0, onPrimary 5.0, danger 6.5; dark 15.0 / 7.7 / 5.6 / 3.73 / 18.7 / 6.4 / 11.0. Error = 2 px border + icon + text, never colour alone [S].
- Auth: paste and password managers/OS autofill allowed, no puzzle, passkey alternative [S 3.3.8]. Orientation unlocked; keyboard never covers Verify (in-flow button in a scroll view, safe area) [S].
- Switch/Voice Control: every action is a visible button; no gesture-only path (no carousel, no swipe).

## 9. Performance
- Targets [H]: cold start to S1 interactive <= 2 s on a mid-tier Android; S2 keystroke-to-box update inside one frame; profile on the slowest supported device in profile mode (DevTools, UI and raster threads), Impeller on.
- Design choices: opacity-only animations, no `Opacity`/blur/saveLayer, no custom fonts (system SF/Roboto), static vector art, one periodic timer cancelled in `dispose`, no polling, no Lottie. Known inefficiency: `setState` per keystroke rebuilds the whole S2 tree (cheap, but narrow to a `ValueListenableBuilder` if profiling says so).
- Not measured: nothing was run (section 11).

## 10. Ethics check (boundary test, principles.md) [H]
1. Would users endorse each nudge? Biometric opt-in is off by default, never pre-ticked; passkey push is one dismissible card, re-offered only in Settings.
2. Opt-out as easy as opt-in: "Not now" equals "Turn on" in size and position; turning it off lives in the same Settings row.
3. Disclosure before commitment: fees and rates visible before sign-in and on the first-send screen; the last step may not reveal a mandatory fee. Data use line: "We use your number to verify you and meet legal checks."
4. Every urgency claim is real: the countdown mirrors a server timer; no "limited offer", no referral bonus, no streaks or guilt copy in a money app. No confirmshaming ("No, keep me less secure" banned). Result: pass; no growth-hack request was made.

## 11. Assumptions, judgment calls, untested conditions
Assumptions: phone-number identity; backend supports 6-digit OTP, 10-minute expiry, idempotent verify, resend cooldown, `Retry-After`; KYC legally required before the first transfer (compliance/PSD2 SCA rules not researched, the skill has no fintech compliance section); no brand (default tokens, blue accent); English strings only (containers allow +200%); phone portrait first; wider windows should cap content at about 480 dp, not implemented in the sample.
Judgment (not sourced): 30 s cooldown, 3 resends, 5 attempts, no carousel, 15 s timeouts, 300/400 ms skeleton delays, 48 dp OTP box minimum height.
Untested: Android shared-axis is specified but not wired in code (theme uses the predictive-back builder). Dart SDK absent, so the code was never compiled, analysed or run (`ThemeData.copyWith(inputDecorationTheme:)` type may differ on the newest Flutter; `PredictiveBackPageTransitionsBuilder` needs the manifest opt-in). No VoiceOver/TalkBack pass (the `Semantics` label merge over `TextField` is unverified), no Voice Control, no AX5/200% run, no increased-contrast tokens, no dark-mode visual check, no RTL, no foldable/tablet. iOS Reduce Motion mapping, Android SMS autofill, iOS QuickType, SMS-permission policy and App Store 4.8 are from memory/docs, not re-verified. Contrast was computed only for the pairs listed.
Gate self-check: G2-G14 pass by design (G1, G4, G10, G11 unverified on device); G15 unmeasured. Verdict: not shippable as production-ready until the device passes are done; Performance dimension capped at 6.
