---
name: pwa-mobile-redesign
description: Audit an existing web app/PWA's current mobile UI, then rebuild its mobile interface in the visual style of reference images the user provides while maximizing UX, without breaking existing features. Use whenever the user wants to "rombak/redesign/revamp/modernize" an existing site or PWA for mobile, "perbaiki tampilan mobile web saya", "ubah UI PWA ini sesuai gambar ini", or wants a before/after of a live app, even if they only give a URL or repo plus screenshots. Does a measured baseline audit first (screenshots, Lighthouse, accessibility, flows), keeps all functions and data wiring, applies the mobile-ui-ux rules, and proves the improvement with before/after evidence. Pairs with mobile-ui-ux (rules) and pwa-from-reference-ui (image-to-tokens method).
---

# PWA mobile redesign (audit → restyle → optimize UX → prove)

Inputs: the current app (URL and/or repo path), reference images for the target style, and any must-keep constraints. Load `mobile-ui-ux` for rules and `pwa-from-reference-ui` (`references/image-analysis.md`) for reading the images.

## Workflow

1. **Intake and safety.** Confirm: URL/repo, stack, auth needed (never enter user passwords; ask for a test account or have the user log in), what must not change (routes, API calls, IDs, analytics, SEO, copy). Work on a branch or copy; never deploy or push without confirmation.
2. **Baseline audit of the current mobile UI** (`references/audit-current.md`). Capture screenshots of every key route at 360x800 and 390x844 (and 768, 1280 if responsive), light and dark if supported. Record: route/screen inventory, user flows and primary tasks, component inventory, current tokens (colors, type, spacing), states present/missing, console errors, network and Lighthouse numbers, install criteria, offline behavior, accessibility findings, tap-target and contrast failures, 200% text and landscape behavior. Save to `audit/before/` and write `audit.md` with the top problems ranked by user impact. Score with `mobile-ui-ux/references/review-system.md` (gates + 12 dimensions).
3. **Preserve contract** (`references/preserve-contract.md`). List every function, route, form, API call, permission and data field the redesign must keep; this is the regression checklist.
4. **Style extraction from reference images.** Follow `pwa-from-reference-ui`: tokens, layout language, component shapes, icon style, motion mood. Decide what to adopt, adapt or reject (flag reference flaws such as low contrast or icon-only nav).
5. **UX redesign plan.** For each screen: goal, primary action, information hierarchy, navigation (3-5 persistent destinations), component choices, state matrix (loading/empty/error/offline/permission), forms and keyboard, copy, motion with reduced-motion path, performance budget. Show the plan as a short before→after table; ask the user to confirm only if a change alters a must-keep or the IA.
6. **Implement incrementally.** Introduce the token layer first (CSS custom properties), then shell/navigation, then screens by traffic order. Keep business logic and data wiring untouched; restyle and restructure markup/CSS/components. Add missing states, accessibility semantics, safe areas, install/offline polish. Commit in small steps if a git repo exists.
7. **Verify against baseline.** Re-run the same screenshots, Lighthouse, accessibility and flow checks; run the preserve-contract checklist; compare each screen with the reference images (style fidelity) and with `audit/before/` (functional parity). Fix regressions before reporting.
8. **Report** using `assets/report-template.md`: before/after screenshots, metric deltas, what changed and why (rule/evidence tag), deliberate deviations from the reference, assumptions, untested conditions (real devices, iOS Safari install, screen readers), gate results.

## Rules

- Measure before and after; never claim improvement without both numbers or screenshots.
- Functionality parity beats beauty: any lost feature is a defect.
- Keep URLs, form field names, ids/classes used by scripts or tests unless the user approves a rename.
- Prefer progressive change over a rewrite; avoid adding frameworks or heavy libraries (budget in `mobile-ui-ux/references/performance.md`).
- Respect the reference style but fix its accessibility and usability flaws and say so.
- Do not scrape or copy third-party copyrighted assets; use placeholders and open fonts.
- Do not change production data, send forms with real data, or trigger payments while testing.
