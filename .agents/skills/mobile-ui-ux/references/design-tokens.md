# Design tokens: philosophy, default values, dark mode, platform mapping

Read this when: defining or reviewing a color/type/spacing/radius/elevation/motion/breakpoint system, setting up theming or dark mode, choosing default values when the user supplies no brand, or mapping tokens to CSS, Tailwind, Flutter, React Native, Compose or SwiftUI.

Tags: `[S]` sourced value · `[C]` computed from sourced inputs · `[R]` our recommendation (interpolated, no direct source) · `[P-iOS]` `[P-AND]` platform · `[H]` heuristic. Research date 2026-10-06. Material values come from androidx / material-web source (m3.material.io was unreachable).

Contents: 1 Philosophy · 2 Token tiers and naming · 3 Pipeline (DTCG → platforms) · 4 Modes · 5 Color roles + defaults · 6 Contrast facts · 7 States · 8 Spacing · 9 Radius · 10 Typography · 11 Elevation · 12 Dark mode · 13 Breakpoints, z-index · 14 Touch, density, icons, focus · 15 Motion tokens · 16 Platform mapping · 17 Component API principles · 18 Evidence limits

---

## 1. Philosophy

1. Tokens are **names for decisions**. Values may change per mode (light/dark/contrast/density/brand); names do not.
2. Components consume **semantic** tokens, never raw values. Raw values (hex, px) appear only in the primitive tier.
3. Name by **role**, not appearance: `color.text.secondary`, never `color.gray600` in a component and never `blue-button`.
4. Every background role has a named **foreground partner** (`on-*`) so contrast is checked per pair.
5. Fewer tokens beat more. Add a component token only when a component needs a value different from its semantic default, and document why. Token explosion and one-off values are the main failure of design systems.
6. Platform-native systems (Dynamic Type, Material theme, asset-catalog colors) are the delivery containers; tokens feed them, they do not replace them.

## 2. Tiers and naming

- Tier 1 primitive/reference (raw: `gray.900`, `space.4`), Tier 2 semantic/system (roles: `color.bg.raised`), Tier 3 component (`button.primary.bg`), consumed in that direction only. Material 3 (`--md-ref-*`, `--md-sys-*`, component tokens), Fluent (global + alias), Spectrum (primitive/semantic/component, component "a much smaller role"), Atlassian (`foundation.property.modifier`), Carbon (role identifiers identical across 4 themes) all converge. `[S]`
- Format `category.role[.emphasis][.state]`: `color.text.secondary`, `color.bg.raised`, `color.action.primary.pressed`. If a name contains a hue or brand, rename to the role.
- Scale numbering has no cross-system standard (Atlassian `space.100`=8px, Polaris `space-100`=4px, Carbon `spacing-05`=16px, Tailwind `4`=16px). Pick one and document it.
- Adopt Spectrum's usage order: components → semantic tokens → primitives only when necessary → component-specific tokens last.

## 3. Pipeline: one source, per-platform outputs

- Author in the **W3C Design Tokens Community Group format 2025.10** (Format, Color, Resolver modules; "Final Community Group Report" 2025-10-28; stable but NOT a W3C Standard). Token = `$value` + `$type` (+ `$description`, `$extensions`, `$deprecated`); aliases `{color.bg.canvas}`; groups with `$type`, `$root`, `$extends`. Types: color (object with colorSpace/components/alpha/hex), dimension (`px|rem` only: there is no dp/sp/pt, native targets transform), fontFamily, fontWeight, duration (`ms|s`), cubicBezier, number; composites: shadow, border, transition, typography, gradient. The Resolver module expresses modes via named modifier contexts (light/dark/darkHighContrast). `[S]`
- Style Dictionary (15 predefined transform groups: css, android, compose, ios-swift, flutter, react-native…; 40+ formats such as `css/variables`, `compose/object`, `flutter/class.dart`, `ios-swift/class.swift`, `android/resources`) or Terrazzo (claims full 2025.10 + resolver; vendor claim). Style Dictionary says 2025.10 is not yet fully supported (v5 WIP): check installed-version feature support before using color objects or resolver; fall back to hex strings + one file per mode. `[S]`
- Rule: never hand-copy hex values into platform code. Generate. If no token pipeline exists in the project, still centralize tokens in one file/theme object.

## 4. Modes

A theme = values for the same token names. Axes: `mode: light|dark`, `contrast: standard|high`, `density: comfortable|compact`, optional `brand`. Do not duplicate component code per mode. Minimum: light + dark; add increased-contrast values for text, border and focus tokens (CSS `@media (prefers-contrast: more)`, iOS `colorSchemeContrast`, Flutter `contrastLevel`). Apple requires light, dark and increased-contrast variants for custom colors even in single-appearance apps. `[P-iOS][S]`

## 5. Semantic color roles and default values (use when the user has no brand)

Minimum viable set: `bg.{canvas,sunken,raised,overlay,inverse}`, `text.{primary,secondary,tertiary,disabled,inverse,link}`, `border.{subtle,strong,focus}`, `icon.{primary,secondary,disabled}`, `action.primary.{bg,fg,bg-hover,bg-pressed,container,on-container}`, `status.{danger,warning,success,info}.{fg,bg,on-bg,border}`, `scrim`, state-layer opacities. (M3: primary/secondary/tertiary × {color,on,container,on-container}, error, surface + dim/bright + five container levels, on-surface(-variant), outline(-variant), inverse*, scrim. Carbon groups: Background, Layer, Field, Border, Text, Link, Icon, Support, Focus, Skeleton. iOS: systemBackground ×3, label ×4, separator, link, system hues. Radix: 12-step scale per hue, with fixed jobs per step: 1-2 backgrounds, 3-5 component bg/hover/pressed, 6-8 borders, 9-10 solid, 11-12 text.)

| Token | Light | Dark | Basis |
|---|---|---|---|
| `color.bg.canvas` | #FFFFFF | #121212 | Carbon white / M2 dark base; M3 #141218 and Carbon g100 #161616 are equivalents; optional OLED #000000 `[S][R]` |
| `color.bg.sunken` | #F4F4F4 | #0D0D0D | `[S]` Carbon layer-01 / `[R]` |
| `color.bg.raised` | #FFFFFF + border/shadow L1 | #1E1E1E | `[C]` 1dp overlay on #121212 |
| `color.bg.overlay` | #FFFFFF + shadow L3 | #2E2E2E (dialogs #353535) | `[C]` 8dp/16dp overlay |
| `color.bg.inverse` | #1A1A1A | #E6E6E6 | `[R]` |
| `color.text.primary` | #1A1A1A (17.4:1) | #E6E6E6 (15.0:1) | `[R]` within sourced ranges |
| `color.text.secondary` | #595959 (7.0:1) | #A6A6A6 (7.7:1) | `[R]`; Carbon #525252/#C6C6C6 |
| `color.text.tertiary` (hint, ≥ 4.5) | #6E6E6E (5.1:1) | #A0A0A0 (7.2:1 on #121212; ≥ 4.7:1 on every raised surface) | `[R]` avoids alpha-40% placeholders (2.55:1) |
| `color.text.disabled` | #9E9E9E | #6C6C6C | `[C]` 38% |
| `color.border.subtle` | #C6C6C6 | #525252 | `[S]` Carbon (decorative, ~1.7:1) |
| `color.border.strong` (inputs) | #8D8D8D (3.32:1) | #8A8A8A (≥ 3.5:1 on #121212-#353535) | `[S]` Carbon light; dark value `[C]` (Carbon #6F6F6F fails 3:1 on raised surfaces: 2.7:1 on #2E2E2E) |
| `color.border.focus` | #0F62FE | #FFFFFF | `[S]` Carbon; 2px ring, 2px offset |
| `color.action.primary.bg/.fg` | brand tone 40 / tone 100 | brand tone 80 / tone 20 | `[S]` M3 HCT roles |
| `color.status.danger.fg` | #B3261E or #DA1E28 (6.54/5.0:1 on white) | #F2B8B5 or #FA4D56 | `[S]` M3 error 40/80; Carbon |
| `color.status.success.fg` | use a ≥ 4.5 variant (tone ≤ 40); Carbon #24A148 is 3.35:1 = icon/fill only | #42BE65 | `[S]`/`[R]` |
| `color.status.warning.bg` | #F1C21B with dark text (1.68:1 on white: never as text) | same with dark text | `[S]` Carbon |
| `color.status.info.fg` | #0043CE | #4589FF (5.4:1 on #161616; 5.6:1 on #121212) | `[S]` Carbon |
| `color.scrim` | #000 @ 0.5 | #000 @ 0.6 | `[R]`; Carbon 0.6, M3 ~0.32 (memory) |

Restraint: neutrals cover almost all large surfaces; one brand accent for primary action, selection and links; semantic colors only for status; saturated fills only on controls and small accents. HIG: tint at most one primary action, limit prominent buttons to 1-2 per view. The "60-30-10" ratio is an interior-design folk heuristic with no UI-research source: never present it as a requirement. No evidence found that saturated large surfaces cause fatigue (opinion). `[P-iOS][H]`

**Material-derived defaults:** the radius scale, state-layer opacities, `#121212` canvas and duration names come from Material 3. On iOS-first products use system semantic colors (true-black base `#000` with raised grays), concentric shapes and Dynamic Type instead, keeping the token names.

## 6. Contrast facts to check against

- WCAG 2.2 AA: text 4.5:1, large (≥ 18pt regular ≈ 24px, or ≥ 14pt bold ≈ 18.7px) 3:1, UI boundaries/focus/meaningful graphics 3:1; no rounding (4.499 fails); disabled controls exempt. `[S]`
- Computed traps in published platform colors: iOS 26 systemRed light (255,56,60) on white = 3.57:1 (fails for small text), increased-contrast variant 4.56:1; iOS 13-era secondaryLabel on white 3.44:1; Carbon white-theme success #24A148 = 3.35:1 and warning #F1C21B = 1.68:1; Carbon `text-placeholder` (40% alpha) 2.55:1, `text-disabled` 1.73:1. Use status colors as text only through a darker text variant (tone ≤ 40 in light, ≥ 80 in dark). Verify alpha-based text on every surface it can appear on; prefer solid tokens. `[C]`
- HCT shortcut (material-color-utilities): a tone difference of 40 guarantees ≥ 3.0, of 50 guarantees ≥ 4.5 (computed nuance: tone 100 vs 50 = 4.48, off by 0.02; M3 pairs use ≥ 60 apart). `[S][C]`
- APCA is advisory only; Radix steps 11/12 target APCA Lc 60/90 (vendor choice). WCAG 2 ratio is the gate.

## 7. Interaction states

State layer = content color overlaid at **hover 0.08, focus 0.10, pressed 0.10, dragged 0.16** (Compose `StateTokens`). Disabled: content/icon/label 0.38, outline/container 0.12 (filled-button container 0.10 in current Compose). Define for every interactive element: default / pressed / focused (keyboard, switch) / disabled / loading / error / selected (+ hover under `@media (hover:hover)`, dragged where draggable). Disabled must also be non-focusable and announced as disabled; do not rely on opacity alone to explain why (add helper text). Touch pressed feedback ≤ ~100 ms (ideally the next frame). `[S]`

## 8. Spacing

4-based scale; layout rhythm snaps to 8, fine alignment/inline gaps to 4 (Android: 8dp grid for layout, 4dp for icons/type/small details). Atlassian base 8 with steps 0/2/4/6/8/12/16/20/24/32/40/48/64/80; Carbon 2/4/8/12/16/24/32/40/48/64/80/96/160; Fluent 4px base with 2/6/10 for icon alignment; Tailwind multiplier 0.25rem. GOV.UK units 0-3 fixed, 4-9 grow at 640px+. `[S]`
Default scale `[R]`: `space` = 0,2,4,8,12,16,20,24,32,40,48,64,80 (2 only for hairline/icon padding). Inside components ≤ 16; between components 16-24; between sections 32-48. Proximity: related items ≤ 8-12 apart, separate groups ≥ 24 apart (Gestalt; Atlassian "close together assumed related"). Screen horizontal margin 16 on phones, 24 at medium+ (`[R]`; platform margins are memory). No off-scale values (13px, 18px). Never use text-scaled units (sp) for padding or heights.

## 9. Radius

Use one small named scale. M3: 0/4/8/12/16/(20)/28/(32)/(48)/full (20/32/48 arrive with Expressive); Fluent 0 (nav/tab bars), 2, 4, 8, 12, circle; Tailwind 2/4/6/8/12/16/24/32/full. Default `[R]`: 0,4,8,12,16,28,full. Mapping: inputs/buttons 8-12 (full for single-line pill buttons), cards 12-16, sheets/dialogs 16-28 (top corners only for bottom sheets), chips/badges full, images 8-12. Nested shapes are **concentric**: inner = max(0, outer − padding); capsule = height/2 (Apple WWDC25; Tailwind `calc(var(--radius-xl) - 1px)`). A component touching the screen edge gets radius 0 on the touching side. Do not use `full` on containers that can wrap to multiple lines; avoid radius > 28 on anything with text. Evidence that heavier rounding helps or harms usability is weak either way (Bar & Neta 2006 is an aesthetic preference for object contours, not a UI usability result; Google's Expressive research is vendor-reported and confounded). "Excessive rounding" is a trend/brand call `[T]`.

## 10. Typography

- Body defaults: iOS 17pt, Android 16sp, web 16px. Use platform text styles on native; cross-platform apps define role tokens and map.
- iOS default (Large) text styles size/leading pt: Large Title 34/41, Title 1 28/34, Title 2 22/28, Title 3 20/25, Headline 17/22 semibold, Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption 1 12/16, Caption 2 11/13. Body spans 14 (xSmall) → 17 → 23 (xxxLarge) → 28 (AX1) → 53 (AX5). `[P-iOS]`
- M3 type scale sp (size/line-height/tracking): Display L 57/64/-0.2, M 45/52, S 36/44; Headline L 32/40, M 28/36, S 24/32; Title L 22/28 Regular, M 16/24/+0.2 Medium, S 14/20/+0.1 Medium; Body L 16/24/+0.5, M 14/20/+0.2, S 12/16/+0.4; Label L 14/20/+0.1, M 12/16/+0.5, S 11/16/+0.5 Medium. `[P-AND]`
- Carbon: productive (base 14px, fixed, dense) vs expressive (base 16px, fluid headings). Fluent ramp: Caption1 12/16, Body1 14/20 web | 17/22 iOS | 16/24 Android, Title3 24/32, Title2 28/36, Title1 32/40, LargeTitle 40/52, Display 68/92. `[S]`
- Tech-agnostic default roles `[R]`: `type.display` 36/44; `title-lg` 28/36; `title-md` 22/28; `title-sm` 16/24 medium (iOS Headline 17/22 semibold); `body-lg` (default) 16/24 (iOS Body 17/22); `body-md` 14/20; `body-sm`/caption 12/16 (iOS Footnote 13/18); `label` 14/20 medium, 12/16, 11/16 floor; `numeric` = any role + tabular figures; `mono` 12-14/16-20. Weights 400/500/600/700; avoid < 400 (HIG: avoid Ultralight/Thin/Light). Max two weights per screen plus one emphasis.
- Line height: body 1.4-1.5 (computed: iOS body 1.29, M3 body 1.5/1.43/1.33, Carbon 1.43/1.5, Tailwind base 1.5). WCAG 1.4.12 requires tolerating 1.5×.
- Minimum text size: HIG 11pt floor, M3 smallest 11sp, Carbon 12px, Lighthouse treats < 12px as illegible; WCAG sets none. Use 12 as the web minimum; 11 only for tab-bar-type labels (still scaling).
- Tracking: system fonts adjust automatically (don't hand-tune); M3/Carbon use small positive tracking at small sizes and slightly negative at display sizes.
- Scaling: ≥ 200% on iOS; Android 14 non-linear to 200% (sp for text and line-height, never for padding/heights; never read `fontScale` yourself); web rem with 16px root, `clamp()` with max ≥ 2× min so 200% is reachable. iOS Safari zooms a focused input with computed font-size < 16px: use ≥ 16px on web inputs (`font-size: max(16px, 1em)` or `@media (pointer: coarse)`), never disable zoom.
- `font-variant-numeric: tabular-nums` (Baseline since 2020) for prices, timers, table columns; native: SwiftUI `.monospacedDigit()`, Compose `fontFeatureSettings="tnum"`, Flutter `FontFeature.tabularFigures()` (memory).
- Line length 50-75 characters ideal, ≤ 80 (WCAG 1.4.8 AAA; 40 CJK): `max-width: ~70ch`.
- Truncation: clamp titles at 2 lines and previews at 2-3 lines, but never truncate price, status, error or time. CSS `-webkit-line-clamp` + `display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden`; Flutter `maxLines` + `TextOverflow.ellipsis`; SwiftUI `.lineLimit(n)`; Compose `maxLines` + `TextOverflow.Ellipsis`.
- Fonts: system fonts for app UI (SF Pro, Roboto, Segoe UI); MDN: `system-ui` for chrome, `sans-serif` for long body text; custom fonts must support Dynamic Type/Bold Text.

## 11. Elevation

- Four tools: lightness steps, shadows, borders, blur materials. M3 levels 0,1,3,6,8,12 dp. Tonal overlay alpha = (4.5·ln(elev+1)+2)/100: computed 1dp 5.1%, 2dp 6.9%, 3dp 8.2%, 4dp 9.2%, 6dp 10.8%, 8dp 11.9%, 12dp 13.5%, 16dp 14.7%, 24dp 16.5%. Over #121212 (white tint): 1dp #1E1E1E, 3dp #262626, 8dp #2E2E2E, 16dp #353535, 24dp #393939. `[S][C]`
- Surface steps are tiny in contrast terms (dark 1dp vs #121212 = 1.12:1; iOS #1C1C1E vs #000 = 1.23:1; M3 light container vs surface 1.09:1): they signal hierarchy but never satisfy 3:1 for boundaries. Inputs and cards that must be identified need a border ≥ 3:1. `[C]`
- Light theme: same/lighter fill + shadow (levels 1/3/6/8/12) and/or 1px subtle border. Dark theme: no reliance on shadows (hard to perceive); raise by lightening the fill. Dense data UI: 1px borders + 1-2 layer steps over shadows (Carbon). Shadows: multi-layer low-alpha (Tailwind defaults: xs `0 1px 2px 0 rgb(0 0 0/.05)`, sm two-layer .1, md `0 4px 6px -1px`, lg `0 10px 15px -3px`, xl `0 20px 25px -5px`). Pair each elevation token with a surface-fill token (Atlassian: `surface.raised` with `shadow.raised`).
- iOS 26: Liquid Glass is the functional layer (bars, controls, sheets); never in content cells, never glass-on-glass; remove custom bar backgrounds; solid fallback under Reduce Transparency. Web `prefers-reduced-transparency` is not Baseline.

## 12. Dark mode (re-author, never invert)

- Do not invert. HIG: dark colors are not always inversions; base (dimmer) vs elevated (brighter) backgrounds switch automatically for foreground contexts (sheets, popovers); custom backgrounds undermine this. `[P-iOS]`
- Default canvas = off-black `#121212`-class; raise via the overlay steps above. M3 dark baseline surface tone 6 (#141218); containers 4/10/12/17/22; onSurface tone 90 (#E6E0E9), onSurfaceVariant 80, outline 60 (#938F99; 5.87:1), outlineVariant 30 (1.99:1, decorative only), primary 80, error 80 (#F2B8B5), errorContainer 30. Carbon g100: bg #161616, layers #262626/#393939/#525252, text #F4F4F4/#C6C6C6, error #FA4D56, success #42BE65, info #4589FF, warning #F1C21B, focus #FFFFFF. `[S]`
- Computed text on #121212: white 18.73:1, white@87% 14.19:1, @60% 7.16:1, @38% 3.57:1. Text primary off-white (#E6E6E6 not #FFFFFF; web.dev suggests rgb(250,250,250)); secondary ~#A6A6A6, tertiary ~#8C8C8C. Accents lighter and less saturated (HCT tone 80 vs 40). Borders brighter (tone 60), not simply inverted.
- Optional true-black (OLED) variant: `bg.canvas #000000`, raised `#1C1C1E` (iOS base). True black maximizes OLED savings; smearing of dark-to-color OLED pixels is reported only in forum/news sources (no T1/T2 measurement); no source supports "halation" beyond NN/g's astigmatism discussion. Battery: Purdue found 39-47% display-power savings at 100% brightness but 3-9% at 30-50%: do not justify pure black on battery alone. `[R][S]`
- Policy: default follow system. Android and NN/g recommend an in-app Light/Dark/System setting; HIG discourages app-specific appearance toggles. Cross-platform/web/Android: ship Settings > Appearance: System (default) / Light / Dark persisted per user. iOS-only: follow system and add an override only for reading/media apps. Never ship dark-only unless content is immersive media. NN/g: light mode is measurably better for normal-vision legibility (especially small text/dim ambient light); dark is better for some low-vision conditions: offer the choice. Either ship dark mode with the first release or lock `color-scheme: light` explicitly.
- Web implementation: `<meta name="color-scheme" content="light dark">` before any CSS (prevents canvas flash); two `<meta name="theme-color" media="(prefers-color-scheme: …)">`; a tiny blocking inline script reads the saved choice and sets `data-theme` and `style.colorScheme` before first paint (pattern from memory); define tokens once with `light-dark()` (Baseline 2024, needs `color-scheme: light dark`) or `[data-theme=dark]` overrides; SVG icons `currentColor`; `<picture><source media="(prefers-color-scheme: dark)">` for art direction. No transition on first paint; ≤ 200 ms color-only on user toggle `[R]`. Flutter `ThemeExtension.lerp` for animated switching. Android: DayNight theme + theme attributes, never hard-coded #FFFFFF, `forceDarkAllowed` is a stopgap, launch screens use `?android:attr/colorBackground`.
- Images/icons in dark: slightly darken bright photos if they glare (`brightness(.9)` start; never invert photos); provide dark variants for logos/illustrations with white mattes or dark text; icons need ≥ 3:1 in both themes; shadows don't work on dark: use outline/lightness (HIG, web.dev).
- Status colors need separate fill and text variants, light and dark variants, and never color alone (icon + text + color). Yellow/amber fills carry dark text.

## 13. Breakpoints and layers

- Window size classes (Material): width compact < 600, medium 600-839, expanded 840-1199, large 1200-1599, extra-large ≥ 1600 dp; height compact < 480, medium 480-899, expanded ≥ 900. Phones portrait are compact 99.96% of the time. iOS: compact/regular per axis. Others: Carbon 320/672/1056/1312/1584 (4/8/16 columns); Fluent 320/480/640/1024/1366/1920; Bootstrap 576/768/992/1200/1400; Tailwind v4 640/768/1024/1280/1536. `[S]`
- Default `[R]`: `bp.medium = 600 (37.5rem)`, `bp.expanded = 840 (52.5rem)`, `bp.large = 1200`, `bp.xlarge = 1600`; native branches on window size class (width first), never device type; web is mobile-first `min-width` in rem with component-level container queries.
- z-index (web only) `[R]`: `z.base 0, raised 10, sticky 100, nav 200, dropdown 300, scrim 400, modal 500, toast 600, tooltip 700`; never raw numbers in components; `isolation: isolate` on the app root; toasts above modals; scrim directly under its modal. (Atlassian 100-800 pattern; Tailwind 0-50.)

## 14. Touch, density, icons, focus, opacity

- `size.touch.min = 48` (satisfies 44 iOS, 48 Android, 24 WCAG): the visible control may be smaller (24 icon inside a 48 target); the hit area never; ≥ 8 between adjacent targets. Compose `minimumInteractiveComponentSize` defaults to 48dp; Flutter `MaterialTapTargetSize.padded`. `[S][R]`
- Density: `comfortable` (default; control 40-48, list row 56-64) and `compact` (visual control 32-36 only for pointer/desktop or data tables; row 40-48). On phones density reduces padding and row height, never hit area or text below 12/14. Flutter `VisualDensity` steps are 4px. Offer user-selectable density only for dense enterprise apps (SLDS comfy/compact; Primer condensed/normal/spacious; Carbon row sizes 24/32/40/48/64). `[S][R]`
- Icons: `size.icon` 16 / 20 / 24 / 32 (24 default on touch; Carbon 16/20/24/32); match icon stroke weight to adjacent text weight (HIG; Material Symbols weight axis 100-700, default 400); center-align with text; icons need 3:1 (4.5:1 when they carry the only meaning of text-sized glyphs).
- Focus ring `[R]`: 2px solid, offset 2px, `color.border.focus`, ≥ 3:1 against both control and page; never remove outlines without replacement; support `forced-colors`. Borders: 1px default, 2px selected/focused (Atlassian; M3 field 1dp/2dp). Opacity tokens: disabled content .38, disabled container .12, scrim .5 (.32-.6), pressed .10.

## 15. Motion tokens

Defined in motion.md (durations 0/100/150/250/300/400/500 ms, easing standard (0.2,0,0,1) / enter (0,0,0,1) / exit (0.3,0,1,1), springs ζ 0.9 spatial / 1.0 effects). DTCG supports `duration`, `cubicBezier` and composite `transition`. Add a `motion.reduce` switch.

## 16. Platform mapping

| Category | CSS / Tailwind v4 | Flutter | React Native | Compose / Android | SwiftUI / iOS |
|---|---|---|---|---|---|
| Color roles | `--color-*`; `@theme inline` bridge so a `.dark` class overrides raw vars; `light-dark()`; `[data-theme]` | `ColorScheme` + `ThemeExtension<AppTokens>` (needs `copyWith` + `lerp`) | theme object in Context keyed by `useColorScheme()`; `Appearance.setColorScheme` | `MaterialTheme.colorScheme` + CompositionLocal extension; XML `?attr/color*` | asset-catalog Color Sets (Any/Dark/High Contrast); `Color("name")`; `@Entry` environment keys |
| Spacing/radius/size | `--spacing`, `--radius-*` | const classes / ThemeExtension | numeric constants | `Dp` objects / `Shapes` | `CGFloat` constants; `@ScaledMetric` for text-relative (memory) |
| Type | `--text-*` + line-height/weight sub-vars, rem | `TextTheme` (sp; `MediaQuery.textScaler`) | `fontSize` + `allowFontScaling` (memory) | `Typography` (sp) | text styles / Dynamic Type |
| Elevation | `--shadow-*` + `bg.*` steps | `elevation`, surfaceContainer* | platform shadow props / `elevation` | `tonalElevation`/`shadowElevation` | materials / `.shadow`, Liquid Glass |
| Breakpoints | `@media (min-width)` + container queries | `LayoutBuilder` + size classes | `useWindowDimensions` | `WindowSizeClass` | `horizontalSizeClass` |
| Density | `--density` multiplier | `VisualDensity` | theme multiplier | `LocalMinimumInteractiveComponentSize` | `controlSize` |
| Build | Style Dictionary `css/variables`, Terrazzo | `flutter/class.dart` | `react-native` group | `compose/object`, `android/resources` | `ios-swift/class.swift`, `ColorSwiftUI` |

Tailwind v4 `@theme` namespaces `--color-*`, `--text-*`, `--spacing`, `--radius-*`, `--shadow-*`, `--breakpoint-*`, `--ease-*` generate utilities. Compose: extra tokens via `CompositionLocalProvider` + `staticCompositionLocalOf`. Android Views: `Theme.*.DayNight` + theme attributes.

## 17. Component API principles

- Every component spec = anatomy + variants (emphasis: filled/tonal/outlined/text) × sizes (sm/md/lg) × states (default, hover[pointer], pressed, focus, disabled, loading, error, selected) with a token per cell. Props: `variant`, `size`, `tone` (neutral/primary/danger), `disabled`, `loading`; slots `leading`, `label`, `trailing`. Avoid boolean explosion (`isPrimary` + `isLarge` + `isRed`).
- Separate behavior (headless primitives that handle focus, keyboard, ARIA) from style (tokens): Radix Primitives pattern. Publish do/don't and content guidelines; mark `$deprecated` before removing. HIG distinguishes primary by style, not size; limit prominent buttons to 1-2 per view.
- NN/g: a design system is a repository (style guide, component library with names/states/code, pattern library) plus people; ROI needs years of replicable work.
- iOS 26: use system components for chrome and keep tokens for the content layer. Material 3 Expressive is opt-in (`MaterialExpressiveTheme`, experimental API surface); regenerate color schemes after bumping material-color-utilities (SPEC_2021 default, SPEC_2025 for Expressive) and re-verify contrast.

## 18. Evidence limits

m3.material.io unreachable (M3 density, layout margins, scrim opacity, tonal elevation levels are memory); iOS dark-mode hex values are an iOS 13-era third-party extraction (iOS 26 values differ); Spectrum color/scale pages 404; Salesforce density is a snippet; the M2 dark overlay table was reproduced from the formula; the nested-radius rule rests on Apple and Tailwind only; platform layout margins (16pt/20pt, 16dp/24dp) are memory.
