---
name: pwa-from-reference-ui
description: Build a polished, installable mobile PWA from reference UI images (screenshots, mockups, Dribbble/Figma exports, photos of an app) the user provides. Use whenever the user shares UI screenshots or mockups and wants them turned into a working mobile web app/PWA ("buat PWA dari gambar ini", "clone this UI", "implement this design", "make it match this screenshot"), even if they only say "ikuti contoh UI ini". It extracts layout, components, and design tokens from the images, keeps the look but fixes usability/accessibility problems using the mobile-ui-ux skill, then builds, installs-tests, and visually compares the result. Pairs with the mobile-ui-ux skill (load it for rules).
---

# PWA from reference UI images

Goal: faithful look, better behavior. Match the reference's visual language; never copy its usability or accessibility flaws. Requires the `mobile-ui-ux` skill for rules (read its SKILL.md first; use its references on demand).

## Workflow

1. **Intake.** View every image. Ask only what blocks the build: app purpose, stack (default: vanilla HTML/CSS/JS, no build step), data source (default: realistic mock JSON), languages. If the image is a trend-heavy design (glass, gradients, huge radii), keep the identity but flag costs.
2. **Analyze each screen** with `references/image-analysis.md`: screen inventory and flow map, layout grid, component list, token extraction (colors, type, spacing, radius, elevation), icon style, states visible and states missing, motion implied. Write `analysis.md` before coding. Mark every value as *measured*, *estimated* or *assumed*.
3. **Audit the reference** against mobile-ui-ux: contrast, target sizes, hidden gestures, icon-only nav, missing loading/empty/error/offline states, text scaling, safe areas. List deviations you will make and why (keep these small and visible to the user).
4. **Design the system.** Semantic tokens as CSS custom properties (light + dark if the reference implies it), component inventory, navigation per window width, state matrix per screen.
5. **Build the PWA** from `assets/` templates: `index.html` shell, `manifest.webmanifest`, `sw.js`, icons (192/512 + maskable), `viewport-fit=cover`, safe-area padding, `svh/dvh`, `touch-action: manipulation`, reduced-motion branch, in-app Back in standalone, offline page, update prompt. Real components, mock data, all states implemented, keyboard and screen-reader semantics.
6. **Verify visually.** Serve locally, screenshot at 360x800 and 390x844 (plus 768 and 1280 if responsive), compare with each reference side by side, fix the biggest differences first (layout, spacing, type, color), then re-check. Run Lighthouse/DevTools install criteria if available. Test offline, 200% text, dark mode, reduced motion.
7. **Report.** Fidelity (what matches, what deliberately differs), assumptions, untested conditions (real devices, iOS Safari install, screen readers), and gate results from `mobile-ui-ux/references/review-system.md`.

## Rules

- Do not invent brand assets (logos, photos, fonts) you cannot license: use placeholders, system fonts or open fonts and say so.
- Extract numbers by measurement when pixel dimensions are known (scale from the status-bar height or a known element); otherwise estimate and label as estimates. Round to the token scale (4/8-based).
- Never ship text on images without a scrim; never rely on color alone; keep targets >= 48 with gaps.
- One reference image means one state: design the missing states yourself using the system you derived.
- Real-person or third-party app screenshots: reproduce the pattern and structure, not trademarks or copyrighted artwork.
- Do not publish, deploy or share the result without the user's confirmation.
