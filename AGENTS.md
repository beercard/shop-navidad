# Project instructions

## Frontend design work

For new frontend interfaces, visual redesigns, or substantial UI modernization, use the project-local `frontend-app-builder` skill at `.agents/skills/frontend-app-builder/SKILL.md` when its description matches the task. Read its referenced `references/imagegen-website-concepts.md` when preparing a website design concept. Follow the project's existing framework and all task-specific requirements.

## Mobile UI/UX and PWA Skills

- For mobile UI implementation, responsive behavior, accessibility, or UX audits, use `$mobile-ui-ux` and consult only the topical references needed for the task.
- For a new PWA based on supplied screenshots or mockups, use `$pwa-from-reference-ui`; it depends on `$mobile-ui-ux`.
- For redesigning an existing app for mobile from references, use `$pwa-mobile-redesign`; it depends on `$mobile-ui-ux` and `$pwa-from-reference-ui`.
- This project is Next.js: follow its existing stack, routes, data/API contracts, and brand configuration instead of replacing it with a template stack. Verify platform-dependent PWA claims before reporting them. Do not deploy or push without the user's explicit authorization.

## Additional frontend design skills

- For visual design direction and frontend implementation, use `$frontend-design` when applicable; its upstream Apache-2.0 terms are included in `.agents/skills/frontend-design/LICENSE.txt`.
- For evidence-guided UI systems, interaction patterns, accessibility, and responsive audits, use `$ui-ux-pro-max`; Python 3 is required only when its bundled search script is useful.
- For distinctive art direction, redesigns, and browser-based visual review, use `$design-taste-frontend`; its inspection helper requires Node 22+ and an installed Chrome, Edge, or Chromium. Its asset search needs network access.
- Continue to follow this project's existing Next.js stack, brand separation, persistence/API contracts, and all user task requirements. Skills are guidance and do not authorize changes outside the requested scope.
