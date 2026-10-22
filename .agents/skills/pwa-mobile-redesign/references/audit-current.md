# Auditing the current mobile UI

Do in this order and save evidence.

1. **Capture**: headless browser or browser tool, mobile emulation (360x800, 390x844, DPR 2-3, touch). Per key route: full-page screenshot, viewport screenshot, with keyboard open for forms, dark mode, 200% text, landscape, offline (throttle/disable network), slow 4G + 4x CPU.
2. **Inventory**: sitemap/routes, primary tasks ranked by frequency, nav model, components, forms and fields, API calls (network panel), auth and roles, third-party scripts.
3. **Metrics**: Lighthouse mobile (performance, accessibility, best practices, PWA/installability), LCP/INP/CLS, JS and image bytes, DOM size, console errors, service worker and manifest status.
4. **UX checks**: run `mobile-ui-ux/references/checklists.md`; list failed gates G1-G15; tap targets under 48, contrast under 4.5:1, text under 12px, hover-only controls, horizontal scroll bugs, `100vh` bugs, zoom disabled, missing states, fixed bars hiding content with keyboard, desktop layouts shrunk, modal stacks.
5. **Rank** problems by user impact and effort; separate "style" problems (match reference) from "UX" problems (rules) from "bugs".
6. **Write** `audit.md`: summary, scorecard, top 10 issues with screenshot refs, inventory, risks for redesign.
