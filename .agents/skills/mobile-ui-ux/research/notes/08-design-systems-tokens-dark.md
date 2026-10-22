# Slice 08 — Design systems, tokens, typography, color, spacing, elevation, dark mode

Researched 2026-10-06. Convention: evidence cites source IDs `[S#]` -> full URLs in the table below. Tags: VERIFIED (fetched; Apple HIG/Material pages were read through the fetch tool's summarizer, so exact table cells were spot-checked against known values where possible), SNIPPET, MEMORY. "COMPUTED" = my own arithmetic on verified inputs (script: scratchpad/contrast08.py, rec08.py). "REC" = our recommendation, not a sourced value.
Tool limits hit: WebSearch budget exhausted mid-session (200/200); m3.material.io unreachable (ECONNREFUSED) -> Material numbers taken from androidx/material-web source (T1, stronger than the site anyway).

## Sources consulted
| ID | URL (abbrev.) | Tier | Verified |
|---|---|---|---|
| S1 | https://www.designtokens.org/tr/2025.10/format/ (Format Module) | T1 | VERIFIED |
| S2 | https://www.designtokens.org/tr/2025.10/color/ ; /resolver/ (S3) | T1 | VERIFIED |
| S4 | https://www.designtokens.org/ (status) ; /tr/drafts/format/ (next draft) | T1 | VERIFIED |
| S5 | https://styledictionary.com/info/dtcg/ ; /reference/hooks/{transform-groups,transforms,formats}/predefined/ ; /reference/config/ | T1 | VERIFIED |
| S6 | https://terrazzo.app/docs/ | T1 | VERIFIED |
| S7 | developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json | T1 | VERIFIED |
| S8 | .../color.json ; S9 .../dark-mode.json ; S10 .../materials.json ; S11 .../accessibility.json ; S12 .../layout.json ; S13 .../buttons.json ; S14 .../toolbars.json ; S15 .../sf-symbols.json + icons.json | T1 | VERIFIED |
| S16 | https://developer.apple.com/videos/play/wwdc2025/356/ ; .../documentation/technologyoverviews/adopting-liquid-glass (JSON) | T1 | VERIFIED |
| S17 | raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/{tokens/StateTokens,ElevationTokens,ShapeTokens,MotionTokens,TypeScaleTokens,ColorSchemeKeyTokens,PaletteTokens,ColorDarkTokens,FilledButtonTokens,OutlinedTextFieldTokens,NavigationBarTokens}.kt ; ColorScheme.kt ; InteractiveComponentSize.kt | T1 (source of truth) | VERIFIED |
| S18 | github.com/material-components/material-web docs/theming/{README,color,typography,shape}.md | T1 | VERIFIED |
| S19 | github.com/material-foundation/material-color-utilities (README; typescript/hct/hct.ts, contrast/contrast.ts, palettes/core_palette.ts, dynamiccolor/color_spec_2021.ts) | T1 | VERIFIED |
| S20 | material-components-android .../elevation/ElevationOverlayProvider.java | T1 | VERIFIED |
| S21 | https://developer.android.com/develop/ui/compose/designsystems/{material3,custom} ; /develop/ui/compose/layouts/adaptive/use-window-size-classes | T1 | VERIFIED |
| S22 | https://developer.android.com/develop/ui/views/theming/darktheme | T1 | VERIFIED |
| S23 | https://developer.android.com/about/versions/14/features (non-linear font scaling) | T1 | VERIFIED |
| S24 | https://developer.android.com/design/ui/mobile/guides/layout-and-content/{grids-and-units,layout-basics} ; /styles/themes ; /guide/topics/ui/accessibility/principles | T1 | VERIFIED |
| S25 | https://m2.material.io/design/color/dark-theme.html ; /text-legibility.html | T1 | PARTIAL (fetch returned only headline facts; overlay % table not captured) |
| S26 | https://design.google/library/expressive-material-design-google-research | T1 (vendor research) | VERIFIED |
| S27 | composables.com MaterialExpressiveTheme API ; M3 Expressive web-search snippets | T3 | VERIFIED / SNIPPET |
| S28 | api.flutter.dev (ThemeExtension, ColorScheme.fromSeed, VisualDensity, MaterialTapTargetSize); docs.flutter.dev/release/breaking-changes/material-color-utilities | T1 | VERIFIED |
| S29 | https://reactnative.dev/docs/appearance | T1 | VERIFIED |
| S30 | carbondesignsystem.com/elements/{spacing,typography/type-sets,themes,color,2x-grid,icons/usage,motion}/... ; unpkg.com/@carbon/themes/scss/generated/_themes.scss (real token hex) | T1 | VERIFIED |
| S31 | unpkg.com/@shopify/polaris-tokens/dist/css/styles.css (values; version unspecified) ; github.com/Shopify/polaris-react-archive/discussions/6613 | T1/T3 | VERIFIED (names not captured). polaris-react.shopify.com now 301s to shopify.dev web-components docs |
| S32 | atlassian.design/foundations/{spacing,tokens/design-tokens,elevation,color,typography} ; /components/tokens/all-tokens | T1 | VERIFIED |
| S33 | fluent2.microsoft.design/{typography,design-tokens,layout,shapes,motion} | T1 | VERIFIED |
| S34 | https://spectrum.adobe.com/page/design-tokens | T1 | VERIFIED (color-system, platform-scale pages 404) |
| S35 | Salesforce Lightning density (search snippet + SLDS2 page, empty) | T1/T3 | SNIPPET |
| S36 | radix-ui.com/colors/docs/palette-composition/* ; /themes/docs/theme/{color,spacing} ; unpkg.com/@radix-ui/themes/tokens/base.css ; /primitives/docs/overview/introduction | T1 | VERIFIED |
| S37 | design-system.service.gov.uk/styles/{spacing,type-scale}/ | T1/T2 | VERIFIED |
| S38 | https://primer.style/product/primitives/size | T1 | VERIFIED |
| S39 | https://unpkg.com/open-props/open-props.min.css | T1 (OSS) | VERIFIED |
| S40 | tailwindcss.com/docs/{theme,responsive-design,box-shadow,font-size,border-radius,z-index} | T1 | VERIFIED |
| S41 | ui.shadcn.com/docs/{theming,tailwind-v4} ; S42 getbootstrap.com/docs/5.3/layout/breakpoints/ | T1 | VERIFIED |
| S43 | w3.org/WAI/WCAG22/Understanding/{contrast-minimum,non-text-contrast,target-size-minimum,focus-appearance,text-spacing,visual-presentation,resize-text,use-of-color} ; w3.org/WAI/standards-guidelines/wcag/ ; w3.org/TR/wcag-3.0/ | T1 | VERIFIED |
| S44 | developer.mozilla.org: color-scheme, light-dark(), meta theme-color, prefers-contrast, prefers-reduced-transparency, font-variant-numeric, line-clamp, font-family | T1 | VERIFIED |
| S45 | https://web.dev/articles/prefers-color-scheme | T1/T3 | VERIFIED |
| S46 | https://www.nngroup.com/articles/dark-mode/ | T2 | VERIFIED |
| S47 | https://www.nngroup.com/articles/design-systems-101/ | T2 | VERIFIED |
| S48 | https://baymard.com/blog/line-length-readability | T2 | VERIFIED |
| S49 | https://pubmed.ncbi.nlm.nih.gov/16913943/ (Bar & Neta 2006) | T2 | VERIFIED (abstract summary) |
| S50 | Purdue/MobiSys 2021 OLED dark-mode power (via search result summary) | T2 | SNIPPET |
| S51 | Piepenbrock 2013 / Dobres 2017 (via NN/g S46 + search summary) | T2 | SNIPPET (original), VERIFIED (as cited by NN/g) |
| S52 | noahgilmore.com/blog/dark-mode-uicolor-compatibility ; sarunw.com/posts/dark-color-cheat-sheet/ (iOS 13 system color hex extracted) | T3/T4 | VERIFIED (third-party extraction; not Apple-published; iOS 26 values may differ) |
| S53 | css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/ (search snippet) | T3 | SNIPPET |
| S54 | https://help.figma.com/hc/en-us/articles/15339657135383 (variables) | T1 | VERIFIED |
| S55 | developer.apple.com/documentation/swiftui/{environmentvalues,color} | T1 | VERIFIED (ScaledMetric page returned nothing -> MEMORY) |
| S56 | https://developers.google.com/fonts/docs/material_symbols | T1 | VERIFIED |

---
## Findings

### F1 DTCG format: a stable spec exists (2025.10); use it as the interchange format, not as a runtime
- Claim: The Design Tokens Community Group published Format, Color and Resolver modules v2025.10 as "Final Community Group Report" on 2025-10-28 and calls them stable; they are NOT a W3C Standard (Community Final Specification Agreement). A later editor's draft is flagged "do not implement".
- Evidence: S1,S2,S3,S4 — T1 — VERIFIED. Token = `$value` (required) + `$type` (required unless inherited) + optional `$description`, `$extensions` (reverse-domain keys), `$deprecated` (bool|string). Names may not start with `$` or contain `{ } .`. Aliases: `{group.token}` (whole value) or JSON-Pointer `$ref: "#/a/b"` (property-level). Groups: nest freely, can carry `$type`, `$root` token name, `$extends` (deep-merge inheritance); circular refs forbidden.
- Types: basic = color, dimension `{value, unit: px|rem}`, fontFamily (string|array), fontWeight (1–1000 or preset), duration `{value, unit: ms|s}`, cubicBezier [x1,y1,x2,y2], number. Composite = strokeStyle, border {color,width,style}, transition {duration,delay,timingFunction}, shadow {color,offsetX,offsetY,blur,spread}(or array), gradient, typography. Color value = object `{colorSpace, components[], alpha?, hex?}` with 14 spaces incl. srgb, display-p3, oklch, oklab, hsl (S2).
- Resolver module (S3): "sets" (token sources, later overrides earlier), "modifiers" with named "contexts" (e.g. light/dark/darkHighContrast), and a resolution-order array — this is the standard way to express theme/mode switching.
- Corroboration: S4 lists Adobe, Figma, Sketch, Penpot, Framer, Zeplin, Tokens Studio, Style Dictionary, Supernova as adopters. Style Dictionary v4+ has first-class DTCG but says 2025.10 is not fully supported yet (v5 WIP) (S5, VERIFIED, page undated). Terrazzo claims full 2025.10 + resolver support with plugins for CSS, Sass, JS/TS, Swift, Tailwind, Vanilla Extract (S6, VERIFIED, vendor claim). Figma variables = collections + modes + aliasing + scoping, but no DTCG import/export statement found in the help page (S54).
- Scope: universal. Context: dimension only allows `px|rem` -> there is no `dp`/`sp`/`pt` unit; native targets must transform (1px -> 1dp/1pt convention, `rem`*16) and apply sp/Dynamic Type at the platform layer.
- Agent rule: IF a project has/needs a token source of truth THEN author `tokens/*.json` in DTCG 2025.10 (`$value/$type/$description`, aliases `{color.bg.canvas}`), model modes via resolver (or one file per mode merged by the build), and generate per-platform outputs; never hand-copy hex values into platform code. IF the toolchain is Style Dictionary < v5 THEN check which DTCG features (color objects, resolver) the installed version supports before using them; fall back to hex strings + per-mode files.

### F2 Three token tiers; name by role, never by appearance
- Claim: Mature systems converge on primitive/reference (raw values) -> semantic/system (roles) -> component (element attributes), with components consuming semantic tokens; component tokens are deliberately limited.
- Evidence: Material 3 = reference `--md-ref-*` (raw hex/px/font), system `--md-sys-*` (roles: color, typescale, shape, elevation), component tokens e.g. `--md-filled-button-container-shape` (no `comp` prefix) (S18, T1, VERIFIED). Fluent 2 = global tokens + alias tokens (alias adds meaning; composite aliases for shadow/typography) (S33, VERIFIED). Spectrum = primitive/global (`blue-800`), semantic (`accent-background-color-default`), component-specific "a much smaller role"; usage order: components -> semantic -> primitive only when necessary -> component-specific (S34, VERIFIED). Atlassian = `foundation.property.modifier` e.g. `color.icon.success`; "select by meaning, not by matching hex" (S32, VERIFIED). Carbon = role identifiers (`$layer-01`, `$text-secondary`) with identical names across 4 themes (S30, VERIFIED). Polaris: group+subgroup+variants (`--p-color-text-interactive-hover`, `--p-space-4`); community debated value-literal vs scale numbering, leaning to scale-based except space (S31 discussion, T3, VERIFIED). DTCG color spec: recommends ordered numeric scales (100,200,300) over sequential numbering for extensibility; base/alias/component levels (S2).
- Conflict: numbering schemes differ — Atlassian `space.100`=8px (multiplier of 8), Polaris `space-100`=4px (multiplier of 4 -> %-of-base), Carbon `spacing-05`=16px (ordinal), Radix `--space-4`=16px (ordinal), Tailwind `4`=16px (multiplier of 4). No cross-system standard.
- Scope: universal.
- Agent rule: IF naming a token THEN use `category.role[.emphasis][.state]` (`color.text.secondary`, `color.bg.raised`, `color.action.primary.pressed`); primitives may be value/scale-named (`gray.900`, `space.4`) but components must never reference primitives directly; add a component token only when a component needs a different value than its semantic default (and document why). IF a name contains a hue or a brand ("blue-button", "teal-header") THEN rename to the role.
- Stack notes: CSS custom properties `--color-text-secondary`; Tailwind v4 `@theme` namespaces `--color-*`, `--text-*`, `--spacing`, `--radius-*`, `--shadow-*`, `--breakpoint-*`, `--ease-*` generate utilities (S40); Compose: `MaterialTheme.colorScheme.onSurfaceVariant`; Flutter `ColorScheme` + `ThemeExtension`.

### F3 Token pipeline: how tokens reach each platform
- Claim: One DTCG source -> Style Dictionary (or Terrazzo) -> per-platform artifacts; platform theming containers exist on every stack.
- Evidence (S5, T1, VERIFIED): Style Dictionary has 15 predefined transform groups (web/js/css/scss/less, android, compose, ios, ios-swift, flutter, flutter-separate, react-native, html, assets) and 40+ formats incl. `css/variables`, `javascript/es6|esm`, `typescript/es6-declarations`, `android/resources|colors|dimens|fontDimens`, `ios-swift/class.swift|enum.swift`, `compose/object`, `flutter/class.dart`, `json/nested`. Notable transforms: `color/hex8android` (alpha-first), `color/composeColor` (`Color(0xFF009688)`), `color/UIColorSwift`, `color/ColorSwiftUI`, `color/hex8flutter`, `size/pxToRem`, `size/compose/remToDp`, `size/flutter/remToDouble` (x16), `name/kebab|camel`, `typography/css/shorthand`, `shadow/css/shorthand`; `expand` splits composite tokens (typography/border) into leaf tokens for formats that cannot hold objects. Config shape: `source[]`, `platforms{ transformGroup, buildPath, files[{destination,format}] }`; ESM-only latest. `usesDtcg: true` flag for DTCG keys — MEMORY (not confirmed on fetched page).
- Platform containers (all VERIFIED):
  - Web: CSS custom properties; Tailwind v4 `@theme` (and `@theme inline` to alias `--color-background: var(--background)` so a `.dark` class can override the raw vars; the shadcn pattern) (S40,S41).
  - Compose: `MaterialTheme(colorScheme, typography, shapes)`; extra tokens via `CompositionLocalProvider` + `staticCompositionLocalOf` (documented "ExtendedColors"/custom design system pattern) or extension properties on `ColorScheme`/`Typography` (S21).
  - Flutter: `ThemeData(colorScheme: ColorScheme.fromSeed(...))` + `ThemeExtension<T>` (must implement `copyWith` and `lerp`; registered in `ThemeData.extensions`, read via `Theme.of(context).extension<T>()`; `lerp` gives animated theme switches) (S28).
  - React Native: no official token container -> own theme object in Context, keyed by `useColorScheme()`; `Appearance.setColorScheme('light'|'dark'|'auto'|'unspecified')` overrides app-level scheme (S29). Style Dictionary has a `react-native` group (S5).
  - SwiftUI/UIKit: Xcode asset-catalog Color Sets with Any/Dark (and High Contrast) appearances, `Color("name")`; semantic `.primary/.secondary`; read `@Environment(\.colorScheme, \.dynamicTypeSize, \.colorSchemeContrast, \.accessibilityReduceTransparency, \.accessibilityReduceMotion)`; custom values via `@Entry` environment keys (S55 VERIFIED; HIG S9 says use Color Set assets). `@ScaledMetric(relativeTo:)` for padding/icon sizes that follow text size — MEMORY (page empty).
  - Android Views: `Theme.*.DayNight` + theme attributes (`?attr/colorSurface`, `?attr/colorOnSurface`, `?android:attr/textColorPrimary`), never hard-coded `#FFFFFF` (S22).
- Agent rule: IF generating multi-platform code THEN emit: CSS vars (+ Tailwind `@theme inline` bridge), Compose `object`/`ColorScheme` + CompositionLocal extension, Flutter `ThemeExtension` + `ColorScheme`, RN theme object per scheme, SwiftUI asset-catalog colors + `Environment` keys — all from the same token names (camelCase/kebab per platform transform).

### F4 Modes/themes: tokens keep names, values change (color, density, motion, contrast)
- Claim: A theme = a collection of values for the same token names; modes include light, dark, high-contrast, and non-color variations (compact/cozy, reduced motion).
- Evidence: Atlassian S32 VERIFIED (themes can also change typography, motion, density using same names). Carbon: White, g10, g90, g100 — same roles, values differ (S30). Radix Themes: `appearance`, `accentColor`, `grayColor`, `scaling` 90–110% (uniformly scales space/font/radius) (S36). Apple: custom colors must supply light, dark and Increased Contrast variants (S8,S9). Android: adopt system light/dark/dynamic/contrast; "locking to light" is called out as something to avoid (S24). Material: ColorScheme.fromSeed `contrastLevel` -1..1 (S28).
- Agent rule: IF adding a theme dimension THEN add a mode axis to the token source (`mode: light|dark`, `contrast: standard|high`, `density: comfortable|compact`, optional `brand`), not duplicate component code. Provide at minimum light + dark; add increased-contrast values for text/border/focus tokens (CSS `@media (prefers-contrast: more)`, iOS `colorSchemeContrast`, Flutter `contrastLevel`).

### F5 Semantic color roles — the minimum viable set (sources compared)
- Claim: Every serious system defines roles for: page background, layered surfaces, text (3–4 levels), borders (subtle/strong), action/brand with its own on-color, status (error/success/warning/info) with container variants, focus, scrim — and names the foreground partner explicitly.
- Evidence: M3 ColorSchemeKeyTokens (S17 VERIFIED): primary/secondary/tertiary x {color, on, container, on-container, fixed, fixed-dim, on-fixed, on-fixed-variant}, error/errorContainer/onError/onErrorContainer, background/onBackground, surface/onSurface/surfaceVariant/onSurfaceVariant, surfaceDim/Bright, surfaceContainerLowest/Low/(none)/High/Highest, outline/outlineVariant, inverseSurface/inverseOnSurface/inversePrimary, scrim, surfaceTint. Carbon token groups: Background, Layer(01-03), Field, Border, Text, Link, Icon, Support, Focus, Skeleton (S30). Atlassian roles: brand, neutral, danger, warning, success, information, discovery, accent, inverse; emphasis levels subtlest/default/bold (S32). shadcn: `X`/`X-foreground` pairs (background, card, popover, primary, secondary, muted, accent) + destructive, border, input, ring, chart-1..5, sidebar-* (S41). iOS: systemBackground x3 (+Grouped x3), label x4 (label/secondary/tertiary/quaternary), placeholderText, separator/opaqueSeparator, link, systemGray..6, system hues (S8). Radix: 12-step scale per hue with fixed jobs (S36).
- Radix 12-step semantics (S36 VERIFIED): 1–2 app/subtle backgrounds; 3 component bg, 4 hover, 5 pressed/selected; 6 subtle border (non-interactive), 7 interactive border, 8 strong border/focus ring; 9 solid (purest), 10 solid hover; 11 low-contrast text (guaranteed APCA Lc 60), 12 high-contrast text (Lc 90) on step 2. Step 9 takes white text except Sky/Mint/Lime/Yellow/Amber (dark text). Gray choice: pure gray or tinted (mauve, slate, sage, olive, sand); semantic pairings error=red/ruby/tomato/crimson, success=green/teal/jade/grass/mint, warning=yellow/amber/orange, info=blue/indigo/sky/cyan.
- Agent rule: IF defining color tokens THEN ship at least: `bg.canvas, bg.raised, bg.overlay, bg.sunken, bg.inverse; text.{primary,secondary,tertiary,disabled,inverse,link}; border.{subtle,strong,focus}; icon.{primary,secondary,disabled}; action.primary.{bg,fg,bg-hover,bg-pressed,container,on-container}; status.{danger,warning,success,info}.{fg,bg,on-bg,border}; scrim; state-layer opacities`. Every background role has a named foreground partner (`on-*`/`*-foreground`) so contrast is checked per pair.

### F6 Contrast numbers and what "accessible color" means in 2026
- Claim: WCAG 2.2 AA is the operative standard; WCAG 3.0 is still a working draft with the contrast algorithm "yet to be determined" (so APCA is not normative).
- Evidence: S43 VERIFIED — 1.4.3: 4.5:1 text, 3:1 large text (>=18pt regular ≈24px, or >=14pt bold ≈18.7px); no rounding (4.499 fails); exempt: inactive/disabled components, pure decoration, logotypes. 1.4.11: 3:1 for UI component boundaries/indicators needed to identify them, focus indicators and meaningful graphics; hover alone not required. 2.5.8 (AA): target >=24x24 CSS px or spacing exception (24px-circle rule); AAA 2.5.5 is stricter (44x44 — MEMORY). 2.4.13 Focus Appearance (AAA): focus indicator area >= 2 CSS px perimeter and 3:1 change; note 2.4.11 Focus Not Obscured (Minimum) is the AA one (fetch summary mislabeled it "Enhanced"; correct = MEMORY). 1.4.1 use of color: never color alone (labels/icons/patterns); visited-link exemption. 1.4.12 text spacing must survive: line-height 1.5x, paragraph 2x, letter 0.12x, word 0.16x font size. 1.4.4 resize to 200%; relative units. WCAG 2.2 = current Recommendation (2023-10-05, updated 2024-12-12), ISO/IEC 40500:2025; WCAG 3.0 Working Draft (page dated 2026-09-10) "does not deprecate WCAG 2".
- Corroboration: Apple HIG (S11): 4.5:1 up to 17pt, 3:1 for 18pt+ or bold; S9 dark-mode page: min 4.5:1, prefer 7:1 for small text. Carbon: 4.5 text / 3 large+graphics (S30). Atlassian: 3:1 for UI and text >=24px, 4.5:1 below 24px (S32). Android: 4.5/3 and 48dp targets (S24). Radix steps 11/12 target APCA Lc 60/90 (S36) — APCA is a vendor choice, not WCAG-conformant proof.
- HCT tone shortcut (S19 hct.ts, VERIFIED): "a tone difference of 40 guarantees >=3.0, of 50 guarantees >=4.5". COMPUTED nuance: tone 100 vs 50 = 4.48:1 (#777777 on white) — so "50 apart" is a design rule of thumb, off by 0.02 at the extreme; M3 pairs (e.g. primary 40 / on-primary 100) use >=60 apart. Tone 0 vs 100 = 21:1.
- COMPUTED traps in published platform colors: iOS 26 systemRed light (255,56,60) on white = 3.57:1 (fails 4.5 for small text; ok for large/graphics); the Increased-Contrast variant (233,21,45) = 4.56:1 (S8 values). iOS 13-era secondaryLabel (60,60,67 @60%) on white = 3.44:1 and tertiaryLabel @30% = 1.74:1 (S52 extraction; alpha colors change with the backdrop). Carbon white-theme success #24A148 on white = 3.35:1 and warning #F1C21B = 1.68:1 — usable as icons/fills with text labels, not as small text. Carbon `text-placeholder` (40% alpha) = 2.55:1 and `text-disabled` (25%) = 1.73:1 on white.
- Agent rule: IF text < 24px (or <18.7px bold) THEN contrast >= 4.5:1 against its actual backdrop (compute per surface level, light and dark); large text and icons/borders/focus >= 3:1; disabled is exempt but keep >= ~2.5:1 so it stays perceivable. IF using a status color as text THEN use the darker "text" variant (tone <= 40 in light, >= 80 in dark) not the fill color. IF a secondary text uses alpha THEN verify on every surface it can appear on; prefer solid tokens. Do not adopt APCA as the pass/fail criterion; may use it as a supplementary check.

### F7 Interaction states: numbers (Material source) and touch vs pointer
- Claim: States are expressed as overlay "state layers" of the content color at fixed opacities, plus fixed disabled treatment.
- Evidence: S17 VERIFIED — StateTokens: hover 0.08, focus 0.10, pressed 0.10, dragged 0.16. (The brief's "12%" is a disabled value, not a state layer.) Disabled: FilledButton container 0.10 (current Compose; M3 spec era = 0.12), icon 0.38, label 0.38; OutlinedTextField input 0.38, label 0.38, outline 0.12; text-field container height 56dp; outline 1dp, focused outline 2dp; NavigationBar container 64dp, elevation Level2, label style LabelMedium, icon-label gap 4dp (S17). Material 2 legacy text emphasis 87/60/38% for high/medium/disabled (S25 SNIPPET-level facts). Carbon encodes disabled/placeholder as alpha on text: 25% / 40% (S30 `_themes.scss`). HIG: use press state on custom buttons; system supplies hover/selection (S13,S14). Atlassian token modifiers `hovered/pressed/selected` (S32) and Radix steps 3→4→5 (S36).
- Context: hover is pointer-only (iPadOS/Android with mouse/stylus, desktop-class PWAs). WCAG 1.4.11 does not require hover contrast (S43).
- Agent rule: IF an element is interactive THEN define default / pressed / focused (keyboard/switch) / disabled / loading / error / selected (+ hover under `@media (hover:hover)`, dragged where draggable) and implement pressed feedback on touch within one frame budget (slice 03). Use: state layer = content color at 8% hover, 10% focus, 10% pressed, 16% dragged; disabled content = 38% of content color, disabled container/outline = 12% (10% for filled buttons); focus always gets a visible ring (F21). Disabled must also be non-focusable/announced as disabled; do not rely on opacity alone to explain why (add helper text).
- Stack notes: CSS `@media (hover:hover) and (pointer:fine)` for hover; Compose `MutableInteractionSource` + `indication`; Flutter `WidgetStateProperty`; SwiftUI `ButtonStyle` `configuration.isPressed`.

### F8 Spacing: 4pt-based scale; 8pt for layout rhythm
- Claim: Every major system is a 4-based (or 8-based with 4 half-steps) scale; the "4 vs 8" debate is mostly naming — layout containers snap to 8, fine alignment/inline gaps to 4.
- Evidence: Android: 8dp grid for layout/components/spacing, 4dp grid for icons/type/small details (S24 VERIFIED). Atlassian: base 8px (`space.100`), steps 0/2/4/6/8/12/16/20/24/32/40/48/64/80; small 0–8, medium 12–24, large 32–80; "elements close together are assumed related" (S32 VERIFIED). Carbon: spacing-01..13 = 2,4,8,12,16,24,32,40,48,64,80,96,160 px; 8px "mini unit" for grid; component spacing uses scale for padding/margin, layout spacing via Stack (parents own gaps) (S30 VERIFIED). Fluent: 4px base; 0,2,4,6,8,10,12,16,20,24,28,32,36,40,48,52,56; 2/6/10 exist to align padded icons to the 4px grid (S33 VERIFIED). Polaris values (px, names not captured): 0,1,2,4,6,8,12,16,20,24,32,40,48,64,80,96,112,128 (S31 VERIFIED). Radix Themes: 4,8,12,16,24,32,40,48,64 x `--scaling` (S36 VERIFIED). Tailwind: `--spacing: 0.25rem` multiplier (S40 VERIFIED). Open Props `--size-1..15`: .25,.5,1,1.25,1.5,1.75,2,3,4,5,7.5,10,15,20,30 rem (S39). GOV.UK: scale unit 0–9, units 0–3 fixed (<=15px), units 4–9 grow at 640px+ (unit 6: 20px mobile -> 30px tablet+); also a static variant (S37 VERIFIED); full list 0,5,10,15,20,25,30,40,50,60 is MEMORY.
- Platform layout margins (HIG/Material side margins 16pt/16dp compact, 20/24 larger) — MEMORY, not re-verified this session.
- Agent rule: IF no brand scale exists THEN use `space` = 0,2,4,8,12,16,20,24,32,40,48,64,80 (4pt-based; 2 only for hairline/icon padding); inside components use <=16, between components 16–24, between sections 32–48. Group by proximity: related items <= 8–12 apart, separate groups >= 24 apart. Screen horizontal margin 16 (phones) scaling to 24 at medium+ (REC). Do not invent off-scale values (13px, 18px); never use `sp`/text-scaled units for padding/heights (S23).

### F9 Radius scale, nested radius, and "excessive rounding"
- Claim: Use a small named radius scale; nested shapes should be concentric (inner = outer − padding); capsule = height/2 only for single-line controls. Evidence that heavy rounding improves or harms usability is weak either way.
- Evidence (values): M3 ShapeTokens (S17 VERIFIED): none 0, XS 4, S 8, M 12, L 16, "Large-increased" 20, XL 28, "XL-increased" 32, XXL 48, full (circle) — the 20/32/48 additions arrive with Expressive. (Android docs show XL = 24 in the Reply sample — customized, not default (S21).) Fluent: 0 (nav/tab bars), 2 small badges, 4 buttons/dropdowns, 8 large buttons, 12 sheets/popovers, circle (S33). Primer: 3/6/12/full (S38). Radix: 3,4,6,8,12,16 x `--radius-factor` {0, .75, 1, 1.5} (S36). Tailwind: 2,4,6,8,12,16,24,32,full (S40). Polaris: 0,2,4,6,8,12,16,20,30,pill (S31). shadcn base 0.625rem derived scale (S41). Open Props: 2px,5px,1rem,2rem,4rem,8rem,round (S39).
- Concentricity: Apple WWDC25 defines fixed (constant radius), capsule (radius = half height) and concentric (radius = parent radius minus padding); use concentric for nested content (e.g. artwork in cards), capsule + extra margin near the phone's screen edge (S16 VERIFIED); toolbars: custom components must be concentric with bar corners (S14). Fluent: avoid rounding where it leaves awkward gaps (split buttons) or at screen edges where a component bleeds to the edge (S33). Tailwind docs show `calc(var(--radius-xl) - 1px)` for concentric border-radius (S40).
- Evidence on rounding: Bar & Neta 2006 found people prefer curved over angular object contours (aesthetic preference for everyday objects; proposed threat-avoidance mechanism) (S49 VERIFIED) — not a usability result for UI. Google's M3 Expressive research (46 studies, >18,000 participants) reports preference (87% among 18–24 in one measure) and key elements found "up to 4x faster" when shape, size, color, containment and motion were combined; vendor research, effects are confounded across five techniques, and it warns that abandoning familiar patterns hurt usability (S26 VERIFIED).
- Opinion zone: "more rounded = friendlier/modern" and "too round = childish" are trend/brand statements. No evidence found that radius per se changes task performance.
- Agent rule: IF choosing radii THEN pick one scale (default `radius` = 0,4,8,12,16,28,full) and map: inputs/buttons 8–12 (or full for single-line pill buttons), cards 12–16, sheets/dialogs 16–28 (top corners only for bottom sheets), chips/badges full, images 8–12. IF nesting THEN `inner = max(0, outer − padding)`; IF a component touches screen edges THEN radius 0 on the touching side. IF a container can wrap to multiple lines THEN do not use `full` (text clips against the curve). Avoid radius > 28 on anything with text.

### F10 Typography: scales, base size, line height, weights, tracking
- Claim: Native body default is 17pt (iOS) / 16sp (Material) / 16px (web); platform text styles should be used on native; cross-platform apps define role tokens and map.
- iOS default (Large) text styles, size/leading pt (S7 VERIFIED): Large Title 34/41 Regular; Title1 28/34; Title2 22/28; Title3 20/25; Headline 17/22 Semibold; Body 17/22; Callout 16/21; Subhead 15/20; Footnote 13/18; Caption1 12/16; Caption2 11/13. Emphasized weights: Bold for titles, Semibold for others. Dynamic Type Body ranges 14pt (xSmall) -> 17 (Large) -> 23 (xxxLarge) -> 28 (AX1) -> 53 (AX5); Large Title 31 -> 60 (S7). HIG default/min sizes: iOS 17/11 pt, macOS 13/10, visionOS 17/12, watchOS 16/12 (S7,S11).
- Material 3 type scale, size/line-height/tracking in sp (S17 TypeScaleTokens VERIFIED): Display L 57/64/-0.2, M 45/52/0, S 36/44/0; Headline L 32/40, M 28/36, S 24/32 (tracking 0); Title L 22/28/0 Regular, M 16/24/+0.2 Medium, S 14/20/+0.1 Medium; Body L 16/24/+0.5, M 14/20/+0.2, S 12/16/+0.4 (Regular); Label L 14/20/+0.1, M 12/16/+0.5, S 11/16/+0.5 (Medium). Fonts: brand (display/headline/title-L) vs plain (title M/S, body, label).
- Carbon (S30 VERIFIED): productive (base 14px, fixed, dense) vs expressive (base 16px, fluid headings) — body-compact-01 14/18, body-01 14/20 (+0.16px), body-02 16/24 (0), heading-01 14/20 w600, heading-03 20/28 w400, heading-04 28/36, heading-05 32/40, heading-06 42/50 w300, heading-07 54/64 w300; label/helper/legal 12/16 (+0.32px); code 12/16 mono; fluid display 54–92 with -0.64px at >=60. Fluent 2 ramp web px/ iOS pt / Android sp: Caption2 10/14 (web), 12/16 (Android); Caption1 12/16 | 13/18 | 13/18; Body1 14/20 | 17/22 | 16/24; Subtitle1 20/26; Title3 24/32 | 20/25 | 18/24; Title2 28/36 | 22/28 | 20/24; Title1 32/40 | 28/34 | 24/32; LargeTitle 40/52 | 34/41 | 34/44; Display 68/92 | 60/70 | 60/72 (S33). Tailwind: xs 12, sm 14, base 16, lg 18, xl 20, 2xl 24, 3xl 30, 4xl 36, 5xl 48...; line heights 1.33/1.43/1.5/1.56/1.4/1.33/1.2/1.11/1 (S40). Radix: 12,14,16,18,20,24,28,35,60px w/ line-heights 16,20,24,26,28,30,36,40,60 (S36). Atlassian: body default 14px, headings 32->12px bold, code 12px (S32). GOV.UK: six points 16/19/24/36/48/80, line heights in 5px multiples, headings shrink under 640px (XL 32 -> 48) (S37). Polaris font sizes (rem->px): 11,12,13,14,16,18,20,22,24,30,32,36,40; weights 450/550/650/700 (variable Inter) (S31, names not captured).
- COMPUTED line-height ratios: iOS body 1.29 (17/22), callout 1.31, footnote 1.38, caption2 1.18; M3 body L 1.50, M 1.43, S 1.33, label S 1.45; Carbon 1.43 (14/20) & 1.50 (16/24); Tailwind base 1.5; Radix 1.5. WCAG: authors need to tolerate 1.5x (1.4.12); 1.4.8 (AAA) wants >=1.5 within paragraphs (S43).
- Minimum size: HIG iOS 11pt floor; M3 smallest style 11sp; Carbon smallest 12px; Fluent web Caption2 = 10px (outlier); WCAG sets no minimum text size (MEMORY). Weights: HIG prefers Regular/Medium/Semibold/Bold and says avoid Ultralight/Thin/Light (S7). Carbon uses weight 300 only >=42px; M3 uses Medium for labels/titles; Radix 300/400/500/700.
- Tracking: HIG says system fonts adjust tracking automatically per size (don't hand-tune with system fonts); M3/Carbon use small positive tracking at small sizes (0.4–0.5sp; 0.16–0.32px) and slightly negative at display sizes (-0.2sp; -0.64px).
- Scaling: HIG asks support for >=200% enlargement on iOS (>=140% watchOS), keep hierarchy, minimize truncation, stack layouts at large sizes, avoid tight leading for 3+ lines (S7,S11). Android 14: font scale up to 200%, non-linear curve (large text scales less); use sp for textSize AND lineHeight; never sp for padding/heights; convert with `TypedValue.applyDimension`, don't use `scaledDensity`/`fontScale` math (S23). WCAG 1.4.4: 200% resize with relative units; media queries must still permit 200% (S43). Web: root 16px + rem units (Atlassian/GOV.UK/Polaris all use rem) (S32,S37).
- Fonts: Fluent default families Segoe UI (web/Windows), SF Pro (iOS/macOS), Roboto (Android) (S33). Polaris stack: Inter, -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif (S31). Radix default stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Open Sans', system-ui, sans-serif (S36). MDN: `system-ui` is meant for UI chrome, may render poorly for some scripts; use `sans-serif` for long body text; `ui-sans-serif/ui-monospace/ui-rounded` exist (S44). HIG: custom fonts must stay legible at the minimum sizes and support Dynamic Type & Bold Text (S7). SF/New York are variable fonts with dynamic optical sizing (S7).
- Numbers: `font-variant-numeric: tabular-nums` (Baseline widely available since 2020) for equal-width digits in tables/prices/timers (S44). Native equivalents (MEMORY): SwiftUI `.monospacedDigit()`, Compose `fontFeatureSettings="tnum"`, Flutter `FontFeature.tabularFigures()`.
- Line length: 50–75 characters ideal, max 80 (WCAG 1.4.8 AAA, 40 for CJK); in CSS ~`70ch`/`34em`; mobile portrait rarely an issue, landscape/tablet is (S48 VERIFIED, S43).
- Truncation: CSS `line-clamp` (standard) is "limited availability" — ship `-webkit-line-clamp` with `display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden` (S44). Flutter `maxLines`+`overflow: TextOverflow.ellipsis`; SwiftUI `.lineLimit(n)`; Compose `maxLines`+`TextOverflow.Ellipsis` (MEMORY).
- iOS Safari zooms the page when focusing an input with computed font-size < 16px; fix with >=16px (`font-size:max(16px,1em)` or `@media (pointer:coarse)`), do not disable pinch zoom (S53 SNIPPET).
- Agent rule: IF native iOS THEN use system text styles (`.body`, `.headline`...) and never fixed sizes; IF native Android/Compose THEN `MaterialTheme.typography.*` in sp; IF web/cross-platform THEN define roles `type.{display,title-lg,title-md,title-sm,body-lg,body-md,body-sm,label,caption,code}` with size/line-height/weight/tracking tokens and set size in rem/sp. Default body = 16 (web/Android) / 17 (iOS); line-height 1.4–1.5 for body; min readable text 12 (11 only for tab-bar-type labels, still scaling); max two weights in a screen plus one emphasis; avoid weights <400; set `tabular-nums` on any column of numbers; clamp titles at 2 lines and body previews at 2–3 lines but never truncate price, status, error or time; test at 200% font scale and with 1.4.12 overrides; inputs >= 16px on web.

### F11 Elevation: tonal vs shadow vs border vs material
- Claim: Elevation is expressed by (a) surface lightness steps, (b) shadows, (c) borders, (d) blur materials; choose by theme and density.
- Evidence: M3 elevation levels 0,1,3,6,8,12 dp (S17 VERIFIED). Compose `surfaceColorAtElevation` = surfaceTint at alpha `(4.5·ln(elev+1)+2)/100` composited over surface (S17 ColorScheme.kt; same formula in MDC `ElevationOverlayProvider`, S20, VERIFIED). COMPUTED alphas: 1dp 5.1%, 2dp 6.9%, 3dp 8.2%, 4dp 9.2%, 6dp 10.8%, 8dp 11.9%, 12dp 13.5%, 16dp 14.7%, 24dp 16.5%. Material 3 now also provides discrete surface-container roles (lowest -> highest) instead of computing overlays (S17,S19). Atlassian: sunken / default (`elevation.surface`) / raised / overlay (+ overflow shadow); always pair `surface.raised` with `shadow.raised` (same for overlay); in dark mode shadows are hard to perceive so higher surfaces get lighter; z-index 100–800 by role (S32 VERIFIED). Carbon: layer tokens `layer-01/02/03`; light themes alternate White/Gray10, dark themes get progressively lighter; borders (subtle/strong) carry separation in dense UIs (S30). Apple: Liquid Glass = functional layer for controls/nav floating above content, never in the content layer; regular vs clear variants; standard materials ultraThin/thin/regular/thick; thicker = more contrast, thinner = more context; avoid quaternary label on thin/ultraThin; clear variant over bright media needs ~35% dark dim layer (S10 VERIFIED). Radix shadows pair a 1px alpha ring with a soft drop (e.g. `0 0 0 1px gray-a3, 0 3px 12px -4px black-a2`) (S36). Tailwind default shadows: xs `0 1px 2px 0 rgb(0 0 0/.05)`, sm two-layer `.1`, md `0 4px 6px -1px`, lg `0 10px 15px -3px`, xl `0 20px 25px -5px`, 2xl `0 25px 50px -12px /.25` (S40).
- COMPUTED: surface steps are tiny in luminance contrast — dark 1dp (#1E1E1E) vs #121212 = 1.12:1; iOS #1C1C1E vs #000 = 1.23:1; Carbon g100 #262626 vs #161616 = 1.20:1; M3 light container #F3EDF7 vs surface #FEF7FF = 1.09:1. They signal hierarchy but never satisfy 3:1 for boundaries.
- Agent rule: IF light theme THEN raised surfaces = same/lighter fill + shadow (levels 1/3/6/8/12) and/or 1px subtle border; IF dark theme THEN no reliance on shadows: raise by lightening the fill (steps in F12) and keep the border for inputs/cards >=3:1 where identification matters; IF dense/data UI THEN prefer 1px borders + 1–2 layer steps over shadows (Carbon pattern); IF iOS 26 THEN let system bars/tab bars/sheets use Liquid Glass — remove custom backgrounds on bars, don't put glass on glass, don't use glass in content cells; offer solid fallback when Reduce Transparency on (CSS `@media (prefers-reduced-transparency)` not Baseline yet). Shadows: always multi-layer low-alpha; pair each elevation token with a surface-fill token.

### F12 Dark mode palette: don't invert; lighter = higher; tinted near-black; off-black default
- Claim: Dark palettes are re-authored, not inverted: lower saturation accents, near-black (not necessarily #000) canvas, elevation by lightness, text slightly off-white.
- Evidence: HIG: dark colors are not always inversions of light ones; use dynamic/system colors and Color Set assets; base (dimmer) vs elevated (brighter) backgrounds switch automatically when UI is in the foreground (sheets, popovers, multitasking) — custom backgrounds undermine this (S9 VERIFIED). iOS 13-era dark values (S52, VERIFIED extraction): systemBackground #000000, secondary #1C1C1E, tertiary #2C2C2E, grouped same; labels #FFFFFF / #EBEBF5 @ 60% / 30% / 18%; separator #545458 @ 60%, opaque #38383A. M3 dark (S17 ColorDarkTokens + PaletteTokens, VERIFIED): surface/background = neutral tone 6 (#141218 in baseline), containers lowest 4 (#0D0D13), low 10 (#1D1B20), container 12 (#212126), high 17 (#2B2930), highest 22 (#36343B), bright 24, dim 6; onSurface tone 90 (#E6E0E9), onSurfaceVariant 80 (#CAC4D0), outline 60 (#938F99), outlineVariant 30 (#49454F), primary 80 (#D0BCFF), primaryContainer 30, onPrimaryContainer 90, error 80 (#F2B8B5), errorContainer 30, scrim tone 0. Light counterpart (S19 color_spec_2021): surface 98, containers 100/96/94/92/90, onSurface 10, outline 50, primary 40, onPrimary 100, container 90/on-container 30 (later algorithm moved on-container tones — Flutter notes the change to `on*Container`, S28). M2 dark: base #121212, primary at tone 200, desaturated accents, white text at 87/60/38% (S25 headline facts); M2 elevation overlay % per dp (0/5/7/8/9/11/12/14/15/16 for 0,1,2,3,4,6,8,12,16,24dp) reproduces within rounding from the verified formula (COMPUTED above). Carbon g100: background #161616, layers #262626 / #393939 / #525252, border-subtle #525252, border-strong #6F6F6F, text-primary #F4F4F4, text-secondary #C6C6C6, error #FA4D56, success #42BE65, info #4589FF, warning #F1C21B, focus #FFFFFF, overlay rgba(0,0,0,.6) (S30 VERIFIED).
- COMPUTED overlays over #121212 (white tint): 1dp #1E1E1E, 2dp #222222, 3dp #262626, 4dp #282828, 6dp #2B2B2B, 8dp #2E2E2E, 12dp #323232, 16dp #353535, 24dp #393939. COMPUTED text: white on #121212 18.73:1, white@87% (#E0E0E0) 14.19:1, @60% (#A0A0A0) 7.16:1, @38% (#6C6C6C) 3.57:1; M3 onSurface on #141218 14.35:1; M3 outline 5.87:1; outlineVariant 1.99:1 (decorative only).
- Pure black vs off-black: true black = max AMOLED saving and iOS uses it as base; off-black (#121212/#141218/#161616) is the Material/Carbon default. Power: Purdue (MobiSys 2021) measured ~39–47% display-power saving of dark mode at 100% brightness but only ~3–9% at 30–50% brightness (S50 SNIPPET). Smearing (slow dark-to-colour OLED pixel transitions while scrolling) is widely reported but I found only forum/news evidence, no T1/T2 measurement (SNIPPET, T4/T5). Lost hierarchy: steps from true black are as small as from off-black (iOS #1C1C1E vs #000 = 1.23:1 vs #1E1E1E vs #121212 = 1.12:1, COMPUTED), so hierarchy is carried by borders/material anyway. No source supports "halation" as a reason against pure black beyond NN/g's astigmatism-polarity discussion (S46) and web.dev's "avoid pure white, use rgb(250,250,250)" (S45).
- Agent rule: default dark canvas = #121212-class off-black (REC `#121212`), raise via the verified overlay formula (REC steps `#1E1E1E / #262626 / #2E2E2E / #353535`); offer an optional "true black (OLED)" variant (`bg.canvas = #000000`, raised `#1C1C1E`) as a setting on OLED-heavy/media apps; text primary = off-white (`#E6E6E6`, not `#FFFFFF`), secondary ~`#A6A6A6`, tertiary ~`#8C8C8C`; accents: shift to lighter, less saturated tones (HCT tone 80 vs light tone 40); status colors: use the lighter dark-theme variants (see F16); outlines/borders brighter (tone 60) not just the inverse. Verify every text/surface pair >= 4.5:1 per elevation step.

### F13 Dark mode policy: follow system, offer override — platforms disagree
- Claim: Default = follow the system; whether to add an in-app override differs by platform guidance.
- Evidence: Apple HIG: avoid an app-specific appearance setting (extra work; users may think the app is broken); consider a permanently dark UI only for immersive media (e.g. Stocks); test with Increase Contrast and Reduce Transparency (S9 VERIFIED). Android: provide three options Light / Dark / System default (recommended) via `AppCompatDelegate` (API 31+: `UiModeManager.setApplicationNightMode`); "locking to light" is discouraged (S22,S24 VERIFIED). NN/g: light mode measurably better for normal-vision legibility (positive polarity: Piepenbrock 2013; Dobres 2017 — advantage grows with smaller text and dim ambient light), dark better for some low-vision conditions (cataract-type cloudy media; Legge 1985), possible myopia association with sustained light mode (Aleman 2018); recommends letting users switch, especially in long-form reading apps (S46 VERIFIED; S51). web.dev: allow opt-out toggle (S45). RN: `Appearance.setColorScheme` supports override or `auto` (S29).
- Disagreement: HIG vs Android/NN/g on in-app toggle. Resolution: iOS-only product -> follow system, add toggle only if product needs it (reading, media, long sessions); cross-platform/web/Android -> 3-way setting.
- Agent rule: IF building cross-platform/web/Android THEN ship Settings > Appearance: System (default) / Light / Dark persisted per user; IF iOS-only THEN default to system and add override only for reading/media apps. Never ship dark-only unless content is immersive media. Dark mode is not a "feature to finish later": ship it with the first release if any text/surface exists, or lock `color-scheme: light` explicitly.

### F14 Dark mode implementation details (web first-paint, native)
- Claim: Wrong-theme flash is avoidable with a declared color-scheme before CSS and a pre-paint script; use semantic tokens so no per-component dark code is needed.
- Evidence: MDN: `<meta name="color-scheme" content="light dark">` before any CSS prevents canvas flash; `color-scheme` also drives canvas, scrollbars and form-control defaults; `only light/only dark` blocks UA auto-dark (S44 VERIFIED, Baseline since 2022). `light-dark(a,b)` (Baseline 2024; works with colors, and now images/gradients) requires `color-scheme: light dark` on the element/root (S44). `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="...">` supported Safari 15+/iOS 15+ and Chrome Android, not Firefox; PWA manifest `theme_color` can override (S44,S45). web.dev: conditional `<link media="(prefers-color-scheme: dark)">`, variables-only dark.css, `color-scheme: light dark` in `:root`; 0.5s color/background transition shown as example (S45 VERIFIED). `@media (prefers-contrast: more|less|custom)` Baseline since 2022; `prefers-reduced-transparency` not Baseline (S44). Android: DayNight theme + theme attributes; launch screens use `?android:attr/colorBackground`; handle `uiMode` config changes; `forceDarkAllowed` is only a stopgap (S22).
- Agent rule (web): in `<head>` first: `<meta name="color-scheme" content="light dark">` + two `theme-color` metas with media; then a tiny blocking inline script that reads the saved choice and sets `document.documentElement.dataset.theme` and `style.colorScheme` before first paint (pattern = MEMORY; not in fetched docs); define tokens once as `:root{color-scheme:light dark; --bg: light-dark(#fff,#121212)}` or as `[data-theme=dark]` overrides; keep SVG icons `currentColor`; picture `<source media="(prefers-color-scheme: dark)">` for art direction. Theme-change transition: none on first paint; <=200ms colour-only on user toggle (REC; web.dev's 0.5s is a demo). Flutter: use `ThemeExtension.lerp` for animated switching. Native: use dynamic colors/asset-catalog variants; handle `uiMode` (Android) without restarting flows.

### F15 Images, illustrations, icons, logos in dark mode
- Evidence: HIG: slightly darken bright content images to avoid glow; separate light/dark assets when one asset fails (e.g. need an outline on dark); asset catalogs bundle variants; SF Symbols adapt automatically; system vibrancy/labels over materials (S9 VERIFIED). web.dev: `filter: grayscale(50%)` on photos in dark mode and `invert(100%)` on mono SVG icons (S45 VERIFIED — presented as a technique; "research shows most prefer less vibrant images" is claimed without citation there = weak). Prefer `currentColor` SVG.
- Agent rule: IF an image has a white/transparent-on-white matte or dark text THEN provide a dark variant or place on a neutral raised tile; IF logos are mono-dark THEN ship a light variant; dim photos ~10–20% only if they glare (REC; start with `brightness(.9)`), never invert photos; ensure 3:1 for icons on both themes; shadows don't work on dark — use outline/lightness.

### F16 Status colors that stay accessible; color-independence
- Claim: Status needs color + icon/text; keep separate "fill" and "text" variants, and light/dark variants.
- Evidence: WCAG 1.4.1 (color never the only cue) (S43); HIG: use shapes/glyphs/labels, test Increased Contrast; Android: shapes, labels, patterns, haptics; Carbon token roles `support-error/success/warning/info` with different light/dark values (S30). COMPUTED contrast of Carbon values: light error #DA1E28 5.00:1 on white, success #24A148 3.35:1, warning #F1C21B 1.68:1; dark error #FA4D56 5.40:1 and info #4589FF 5.41:1 on #161616. M3: error 40 #B3261E = 6.21:1 on #FEF7FF; dark error 80 #F2B8B5 = 10.89:1 on #141218; errorContainer = tone 30 in dark with onErrorContainer tone 90 (S17). Atlassian bold vs subtle backgrounds with inverse text (S32). Radix: warning yellow/amber need dark text on step 9 (S36). iOS system hues have light/dark/increased-contrast variants — e.g. red (255,56,60) light, (255,66,69) dark, (233,21,45)/(255,97,101) high-contrast (S8).
- Agent rule: IF showing status THEN icon + text label + color (never color alone); fill tokens (`status.danger.bg`) and text tokens (`status.danger.fg`) are different tokens; yellow/amber fills use dark text; define dark-theme variants (lighter, less saturated; M3 tone 80 text/tone 30 container); validate text variant >=4.5:1 and icon/border >=3:1; form errors: text + icon + `aria-invalid`/semantic error announce (slice 06).

### F17 Brand color restraint, "60-30-10", neutral temperature, fatigue
- Claim: The 60-30-10 ratio is an interior-design folk heuristic with no UI-research source found; the defensible principle is "neutral-dominant surfaces, one accent, color reserved for meaning/emphasis".
- Evidence: HIG Liquid Glass color: reserve color for elements needing emphasis; tint only the primary action background; avoid coloring multiple controls; prefer monochrome toolbars over colorful content (S8,S14 VERIFIED); HIG buttons: limit prominent/filled to 1–2 per view, use style not size for primary (S13). M3 uses chroma-4 and chroma-8 tinted neutrals derived from the seed hue (core palette: a1 chroma >=48, a2 16, a3 24, n1 4, n2 8, error 84) (S19 VERIFIED). Radix offers six neutral grays (pure + mauve/slate/sage/olive/sand) to match brand temperature (S36). Evidence that saturated color on large surfaces causes fatigue: none found (HIG visionOS warns about bright high-contrast objects on dark in immersive settings only; M2 recommends desaturation in dark) -> opinion.
- Agent rule: neutrals cover ~all large surfaces; one brand accent for primary action/selection/links; semantic colors only for status; cap saturated fills to controls and small accents; choose neutral temperature (warm/cool/tinted) to match brand but keep chroma ~4–8 in HCT or <=3% saturation; never present 60/30/10 as a requirement.

### F18 Breakpoints and window size classes
- Claim: Use window size classes (Material) for adaptive layout; for web use mobile-first min-width queries in rem; three practical tiers.
- Evidence: Material/Android window size classes width: compact <600dp, medium 600–839, expanded 840–1199, large 1200–1599, extra-large >=1600; height: compact <480, medium 480–899, expanded >=900; phones portrait 99.96% compact; dynamic (fold/multi-window); design expanded first then adapt (S21 VERIFIED). iOS: size classes compact/regular per dimension, decide by size class not device/orientation (S12 VERIFIED). Fluent: small 320–479, medium 480–639, large 640–1023, XL 1024–1365, XXL 1366–1919, XXXL 1920+ (S33). Carbon 2x grid: sm 320 (4 cols), md 672 (8), lg 1056 (16), xlg 1312 (16), max 1584 (16); margins 0/16/16/16/24; 8px mini unit; 16px column padding => 32px gutter option (S30). Polaris (rem->px): 0, 490, 768, 1040, 1440 (S31 values). Primer: 320, 544, 768, 1012, 1280, 1400 (S38). Bootstrap 5.3: 576/768/992/1200/1400 (S42). Tailwind v4: 640/768/1024/1280/1536 (40rem, 48, 64, 80, 96) mobile-first; container queries e.g. `@md` = 28rem (S40).
- Agent rule: IF native THEN branch on window size class (width), not device; IF web THEN tokens `bp.medium=600px (37.5rem)`, `bp.expanded=840px (52.5rem)`, `bp.large=1200px`, `bp.xlarge=1600px` (REC = Material numbers in rem) with component-level container queries for cards/lists; phone = compact; tablet portrait = medium; tablet landscape/desktop = expanded+. Content max width ~ 70ch for reading, grid margins 16/24; use `rem` so browser zoom triggers reflow (MEMORY).

### F19 z-index / layers
- Evidence: Atlassian assigns z-index 100–800 by elevation role (S32); Polaris z-index scale values `auto,100,400,510,512...520` (S31 values); Tailwind 0,10,20,30,40,50 (S40); Open Props `--layer-1..5` = 1..5 plus `--layer-important` 2147483647 (S39).
- Agent rule (web only; native uses draw order/`Stack`/`zIndex`): semantic tokens `z.base 0, z.raised 10, z.sticky 100, z.nav 200, z.dropdown 300, z.scrim 400, z.modal 500, z.toast 600, z.tooltip 700` (REC, 100-steps like Atlassian); never write raw z-index numbers in components; create stacking context with `isolation:isolate` on app root; toasts above modals; scrim directly under its modal.

### F20 Touch target, density, and scale tokens
- Claim: Hit-area minimum is a token; density changes spacing/control height, not text size or hit area.
- Evidence: HIG: hit region >=44x44pt (visionOS 60); iOS control default 44, minimum 28 (S11,S13); ~12pt padding around bezeled elements and ~24pt around unbezeled (S11). Android: 48dp targets with 8dp gaps (S24); Compose `LocalMinimumInteractiveComponentSize` default 48dp (opt-out risk documented) (S17); Flutter `MaterialTapTargetSize.padded` (48x48 default) vs `shrinkWrap` (S28). WCAG 2.5.8 AA 24x24 CSS px (+spacing exception) (S43). Carbon: interactive icons need >=44px targets (S30). Primer controls: xsmall 24, small 28, medium 32, large 40, xlarge 48; stack gap condensed 8 / normal 16 / spacious 24; coarse pointers get larger gaps (S38). M3: text field 56dp, nav bar 64dp (S17). HIG button sizes (visionOS list): mini 28, small 32, regular 44, large 52, XL 64 (S13). Flutter `VisualDensity`: -4..4 units of 4 logical px; standard default on mobile, compact default on desktop; does not change text, icon or padding (S28). Radix `scaling` 90–110% (S36). SLDS: comfy (default; labels above fields, more spacing) vs compact (labels inline); compact reported ~30% more information density; user preference (S35 SNIPPET). Atlassian: compact/cozy as themes (S32).
- Agent rule: token `size.touch.min = 48` (cross-platform; satisfies 44 iOS/48 Android/24 WCAG) — visible control may be smaller (icon 24 inside 48 target) but hit area never; spacing between adjacent targets >=8. Density tokens: `density.comfortable` (default; control h 40–48, list row 56–64) and `density.compact` (control visual h 32–36 only for pointer/desktop or data tables; row 40–48) — on phones, compact reduces padding and row height, not hit area or font below 12/14. Provide user-selectable density only for dense enterprise apps (SLDS pattern).

### F21 Focus ring, borders, strokes, opacity, scrim, icon sizes
- Evidence: Atlassian `border.width` 1px, `border.width.selected` 2px, `border.width.focused` 2px (S32 VERIFIED). M3 outlined field 1dp / focused 2dp (S17). WCAG 2.4.13: focus area >= 2px perimeter, 3:1 change (S43); 1.4.11: 3:1 against adjacent colors (S43). Fluent strokes thin 1, thick 2, thicker 3–4, thickest 4–6 (S33). Carbon focus color #0F62FE (white theme) / #FFFFFF (g100) (S30). Icons: Material Symbols axes FILL 0–1, wght 100–700, GRAD (-50..200 per S56; other sources -25..200), opsz 20–48dp; default weight 400, recommended display size 24px (S56 VERIFIED). Carbon icon sizes 16 (default for components) / 20 / 24 / 32; 16/20 pair with 14/16 text; icons need same 4.5:1 as type there; center-align icons with text (S30). HIG: SF Symbols 9 weights x 3 scales (small/medium/large relative to cap height), 4 rendering modes; match icon stroke weight to adjacent text weight; use vectors (S15). Scrim: Carbon overlay rgba(0,0,0,.6) (S30 VERIFIED); M3 scrim role = black (tone 0), opacity ~32% (MEMORY). Dimming 35% for clear Liquid Glass over bright media (S10).
- Agent rule: focus ring = 2px solid, offset 2px, color token `border.focus` with >=3:1 vs both the control and the page; never remove outlines without replacement; `forced-colors` support. Border default 1px (`border.width.thin`), selected/focused 2px. Icon tokens `size.icon.{sm 16, md 20, lg 24, xl 32}`; 24 default on touch; match weight to text. Opacity tokens: `opacity.disabled.content .38`, `opacity.disabled.container .12`, `opacity.scrim .32–.6` (REC .5), `opacity.pressed .10`.

### F22 Motion token shapes (cross-ref slice 03)
- Evidence: M3 durations (ms): short 50/100/150/200, medium 250/300/350/400, long 450/500/550/600, extra-long 700/800/900/1000; easings (cubic-bezier): standard (0.2,0,0,1), standard-accelerate (0.3,0,1,1), standard-decelerate (0,0,0,1), emphasized-accelerate (0.3,0,0.8,0.15), emphasized-decelerate (0.05,0.7,0.1,1), legacy (0.4,0,0.2,1) (S17 VERIFIED; Compose uses (0.2,0,0,1) for emphasized too). Carbon: fast 70/110, moderate 150/240, slow 400/700 ms; productive vs expressive easing x standard/entrance/exit (S30). M3 Expressive adds spring-based `MotionScheme.expressive()` (lower damping, overshoot) vs `standard()` (S27 SNIPPET/T3). DTCG types: `duration`, `cubicBezier`, composite `transition` (S1).
- Agent rule: tokens `motion.duration.{instant 0, fast 100, base 200, slow 300, slower 500}` + `motion.easing.{standard, decelerate(enter), accelerate(exit), emphasized}`; add `motion.reduce` switch; details in slice 03.

### F23 Design-system component API & consistency principles
- Claim: Consistency comes from a single token layer + component specs listing every state; components consume semantic tokens; unstyled primitives separate behavior from style.
- Evidence: NN/g: design system = repository (style guide, component library with names/descriptions/attributes/states/code, pattern library) + people; ROI when "years" of replicable work expected; min team interaction designer + visual designer + developer (S47 VERIFIED). Radix Primitives: unstyled, WAI-ARIA patterns, focus + keyboard handled, composition via parts and `asChild`, uncontrolled by default with controlled option (S36 VERIFIED). Spectrum: components first, semantic tokens, primitives sparingly, component-specific tokens intentionally limited (S34). Material: component tokens override via scoped selectors rather than forking components (S18). Atlassian: pick tokens by meaning (S32). Radix Themes: `color` prop overrides accent with nesting, `highContrast` prop (S36). HIG: semantic roles for buttons (normal/primary/cancel/destructive), style not size distinguishes primary (S13). M3E research caveat: keep familiar patterns (S26).
- Agent rule: every component spec = anatomy + variants (visual emphasis: filled/tonal/outlined/text) x sizes (sm/md/lg) x states (default, hover[pointer], pressed, focus, disabled, loading, error, selected) with token per cell; props: `variant`, `size`, `tone` (neutral/primary/danger), `disabled`, `loading`; slots: `leading`, `label`, `trailing`; avoid boolean explosion (`isPrimary`+`isLarge`+`isRed`); behavior in headless primitives, style in tokens; publish do/don't + content guidelines; document deprecation (`$deprecated`) before removal.

### F24 Platform context 2026: iOS 26 Liquid Glass and Material 3 Expressive affect tokens
- Evidence (S16 VERIFIED): Liquid Glass = functional layer above content; adopt by recompiling with the current SDK, removing custom bar/sheet/popover backgrounds, using `scrollEdgeEffectStyle`, `ConcentricRectangle`, `.glass/.glassProminent` button styles, `GlassEffectContainer` for performance; `UIDesignRequiresCompatibility` Info.plist key preserves old look; hierarchy via layout/grouping not decoration; system colors refined across Light/Dark/Increased Contrast for glass; HIG color page updated Dec 2025 (S8). Material 3 Expressive: `MaterialExpressiveTheme(colorScheme, motionScheme, shapes, typography)` in Compose (S27); material-color-utilities has SPEC_2021 (library default), SPEC_2025 (Expressive default) and SPEC_2026 — 2025 spec cannot produce low-contrast themes; Flutter color-utils 0.13.0 changed `on{Primary,Secondary,Tertiary,Error}Container` (S27 SNIPPET; S28 VERIFIED); new shape tokens (20/32/48dp) and morphing (S17; "35 new shapes" SNIPPET).
- Agent rule: on iOS 26 use system components for chrome; keep tokens for content layer; on Material target use `MaterialExpressiveTheme` only if brand needs expressive motion/shape — it is opt-in and (per S27) experimental API surface; regenerate color schemes after bumping material-color-utilities and re-verify contrast.

---
## Proposed tech-agnostic token set (names + defaults + mappings)
Tags: [S] sourced value, [C] computed from sourced inputs, [R] our recommendation (no direct source or interpolated). Units: px = dp = pt for layout; type in px/sp/pt per platform.

### Color (semantic tier; light | dark)
| Token | Light | Dark | Basis |
|---|---|---|---|
| color.bg.canvas | #FFFFFF | #121212 | [S] Carbon white bg / M2 dark base; M3 #141218, Carbon g100 #161616 are equivalents; optional OLED `#000000` (iOS base) |
| color.bg.sunken | #F4F4F4 | #0D0D0D | [S] Carbon layer-01 / [R] analog of M3 tone-4 #0D0D13 |
| color.bg.raised | #FFFFFF (+border/shadow L1) | #1E1E1E | [C] 1dp overlay on #121212 |
| color.bg.overlay | #FFFFFF (+shadow L3) | #2E2E2E | [C] 8dp overlay (menus, sheets); dialogs #353535 [C] 16dp |
| color.bg.inverse | #1A1A1A | #E6E6E6 | [R] M3 inverseSurface tone 20/90 pattern |
| color.text.primary | #1A1A1A (17.4:1) | #E6E6E6 (15.0:1) | [R] within sourced ranges #161616–#212121 / #E0E0E0–#F4F4F4 |
| color.text.secondary | #595959 (7.0:1) | #A6A6A6 (7.7:1; 5.6 on overlay) | [R]; Carbon #525252/#C6C6C6, M2 60% #666/#A0A0A0 |
| color.text.tertiary (hint, ≥4.5) | #6E6E6E (5.1:1) | #8C8C8C (5.6:1; 5.0 on raised) | [R]; avoids alpha-40% placeholders (2.55:1) |
| color.text.disabled | #9E9E9E | #6C6C6C | [C] 38% of black/white (Material legacy) |
| color.border.subtle | #C6C6C6 | #525252 | [S] Carbon border-subtle-01 (decorative, 1.7:1) |
| color.border.strong (inputs) | #8D8D8D (3.32:1) | #6F6F6F | [S] Carbon border-strong-01; meets 1.4.11 3:1 |
| color.border.focus | #0F62FE | #FFFFFF | [S] Carbon focus; ring 2px, offset 2px |
| color.action.primary.bg / .fg | brand tone 40 / tone 100 | brand tone 80 / tone 20 | [S] M3 HCT roles; brand hue app-specific |
| color.action.primary.container / .on-container | tone 90 / tone 10–30 | tone 30 / tone 90 | [S] M3 dark tokens; light on-container 30 (2021 spec) -> 10 (newer) |
| color.status.danger.fg / .bg | #B3261E or #DA1E28 | #F2B8B5 or #FA4D56 | [S] M3 error40/80; Carbon error (5.0:1 / 5.4:1) |
| color.status.success.fg | ≥4.5 variant (tone ≤40; Carbon #24A148 is 3.35:1 = icon only) | #42BE65 | [S] Carbon; text variant [R] |
| color.status.warning.bg | #F1C21B with dark text | #F1C21B with dark text | [S] Carbon; text on it #161616 |
| color.status.info.fg | #0043CE | #4589FF (5.4:1) | [S] Carbon |
| color.scrim | #000 @ 0.5 | #000 @ 0.6 | [R]; Carbon .6 [S], M3 ~.32 [MEMORY] |
| color.state.{hover,focus,pressed,dragged} | .08/.10/.10/.16 of content color | same | [S] M3 StateTokens |

### Scales and shapes
| Token | Default | Basis |
|---|---|---|
| space.{0,0.5,1,2,3,4,5,6,8,10,12,16,20} | 0,2,4,8,12,16,20,24,32,40,48,64,80 (index = px/4) | [S] Atlassian/Fluent/Polaris-aligned 4pt scale; 8 for layout [S Android] |
| space.inset.screen | 16 (compact) / 24 (medium+) | [R] (platform margins MEMORY) |
| radius.{none,xs,sm,md,lg,xl,full} | 0,4,8,12,16,28,9999 | [S] M3 ShapeTokens |
| radius.nested | max(0, outer − padding); capsule = height/2 | [S] Apple WWDC25 |
| elevation.{0..5} | 0,1,3,6,8,12 dp | [S] M3 |
| shadow.{sm,md,lg} (light) | `0 1px 3px 0 rgb(0 0 0/.1),0 1px 2px -1px rgb(0 0 0/.1)` / `0 4px 6px -1px …/.1,0 2px 4px -2px …/.1` / `0 10px 15px -3px …/.1,0 4px 6px -4px …/.1` | [S] Tailwind defaults; dark theme: none, use bg.* |
| border.width.{thin,thick} | 1 / 2 | [S] Atlassian, M3 |
| size.touch.min | 48 | [R] covers 44 iOS / 48 Android / 24 WCAG |
| size.control.{sm,md,lg} | 32 / 40 / 48 visual height | [R] (Primer 28/32/40/48; M3 field 56) |
| size.icon.{sm,md,lg,xl} | 16 / 20 / 24 / 32 | [S] Carbon; Material 24 default |
| opacity.disabled.{content,container} | .38 / .12 | [S] M3 tokens |
| density.{comfortable,compact} | ×1.0 / −4…−8 px control height, tighter rows; never below hit-area min | [R]; Flutter step=4px [S] |
| z.{base,raised,sticky,nav,dropdown,scrim,modal,toast,tooltip} | 0,10,100,200,300,400,500,600,700 | [R] (Atlassian 100–800 pattern) |
| bp.{compact,medium,expanded,large,xlarge} | 0, 600, 840, 1200, 1600 | [S] Android window size classes |
| motion.duration.{fast,base,slow,slower} | 100,200,300,500 ms | [R] within M3/Carbon ranges |
| motion.easing.standard/decel/accel | (0.2,0,0,1) / (0,0,0,1) / (0.3,0,1,1) | [S] M3 |

### Type roles (size/line-height; weight) — tech-agnostic default with native anchors
| Token | Web/Android default | iOS native anchor | Basis |
|---|---|---|---|
| type.display | 36/44 (Regular) | Large Title 34/41 | [S] M3 display-S / HIG |
| type.title-lg | 28/36 | Title 1 28/34 | [S] M3 headline-M, Fluent Title 2, Carbon heading-04 |
| type.title-md | 22/28 | Title 2 22/28 | [S] M3 title-L |
| type.title-sm | 16/24 Medium (600 on web) | Headline 17/22 Semibold | [S] M3 title-M |
| type.body-lg (default body) | 16/24, tracking +0.5sp (M3) / 0 (web) | Body 17/22 | [S] |
| type.body-md | 14/20 | Subhead 15/20 / Callout 16/21 | [S] |
| type.body-sm / caption | 12/16 | Footnote 13/18, Caption1 12/16 | [S] |
| type.label | 14/20 Medium; 12/16 Medium; 11/16 floor | Caption2 11/13 floor | [S] M3 label L/M/S; HIG 11 min |
| type.numeric | any role + tabular-nums | `.monospacedDigit()` | [S] MDN / MEMORY |
| type.mono | 12–14/16–20 | SF Mono | [S] Carbon code-01/02 |
| font.family.sans | system-ui stack per platform (Fluent: Segoe UI / SF Pro / Roboto) | SF Pro | [S] |
| font.weight.{regular,medium,semibold,bold} | 400,500,600,700 (avoid <400) | same | [S] HIG |

### Platform mapping cheat-sheet
| Category | CSS / Tailwind v4 | Flutter | React Native | Compose / Android | SwiftUI / iOS |
|---|---|---|---|---|---|
| Color roles | `--color-*` custom props; `@theme inline` bridge; `light-dark()`; `[data-theme]` | `ColorScheme` (+`ThemeExtension<AppTokens>` for non-M3 roles) | theme object by `useColorScheme()`; `Appearance.setColorScheme` | `MaterialTheme.colorScheme` + CompositionLocal extension; XML `?attr/color*` | Asset-catalog Color Sets (Any/Dark/High Contrast); `Color("name")`; `Environment` keys |
| Spacing / radius / size | `--spacing`, `--radius-*` | `const` classes / `ThemeExtension` | numeric constants | `Dp` objects / `Shapes` | `CGFloat` constants; `@ScaledMetric` (MEMORY) for text-relative |
| Type | `--text-*` (+line-height/weight sub-vars), rem | `TextTheme` (sp, scales with `MediaQuery.textScaler`) | `fontSize` + `allowFontScaling` (MEMORY) | `Typography` (sp) | text styles / `Font.TextStyle` (Dynamic Type) |
| Elevation | `--shadow-*` + `bg.*` steps | `elevation`, surfaceContainer* | platform shadow props (iOS shadow*, Android `elevation`) (MEMORY) | `tonalElevation`/`shadowElevation`, surfaceContainer* | materials / `.shadow`, Liquid Glass |
| Breakpoints | `@media (min-width: …rem)`, container queries | `LayoutBuilder` + size classes | `useWindowDimensions` | `WindowSizeClass` | `horizontalSizeClass` |
| Density | `--density` multiplier on control/row vars | `VisualDensity` | multiplier in theme | `LocalMinimumInteractiveComponentSize`, density in component params | `controlSize`, `ScaledMetric` |
| Build | Style Dictionary `css/variables`, Terrazzo CSS/Tailwind | `flutter/class.dart` | `react-native` group (JS) | `compose/object`, `android/resources` | `ios-swift/class.swift`, `ColorSwiftUI` |

---
## Numbers table
| Value | Applies to | Source | Tag |
|---|---|---|---|
| State layers: hover .08, focus .10, pressed .10, dragged .16 | Material 3 | S17 StateTokens | VERIFIED |
| Disabled: content/icon/label .38; field outline .12; filled-button container .10 | M3 Compose | S17 | VERIFIED |
| Elevation L0–L5 = 0,1,3,6,8,12 dp | M3 | S17 | VERIFIED |
| Overlay alpha = (4.5·ln(elev+1)+2)/100, clamp 1 | M2/M3 dark tonal elevation | S17,S20 | VERIFIED |
| Shape: 0/4/8/12/16/(20)/28/(32)/(48)/full | M3 | S17 | VERIFIED |
| Motion durations 50…1000 ms in 50 steps; Carbon 70/110/150/240/400/700 | M3 / Carbon | S17,S30 | VERIFIED |
| Type scale Display 57/45/36, Headline 32/28/24, Title 22/16/14, Body 16/14/12, Label 14/12/11 (sp) | M3 | S17 | VERIFIED |
| iOS Body 17/22; Large Title 34/41; Caption2 11/13; min 11pt | iOS | S7 | VERIFIED |
| Hit target 44x44 pt (28 min); 48dp + 8dp gap; 24x24 CSS px AA | iOS / Android / WCAG | S11,S24,S43 | VERIFIED |
| Contrast 4.5:1 text, 3:1 large text/UI/focus; no rounding | WCAG 2.2 AA | S43 | VERIFIED |
| Large text = 18pt (24px) or 14pt bold (≈18.7px) | WCAG | S43 | VERIFIED |
| HCT tone gap 40 -> 3:1; 50 -> 4.5:1 (100 vs 50 = 4.48 COMPUTED) | Material color utils | S19 | VERIFIED/COMPUTED |
| Text spacing 1.5 / 2 / 0.12 / 0.16 | WCAG 1.4.12 | S43 | VERIFIED |
| Line length 50–75 ideal, ≤80 max | web text | S48,S43 | VERIFIED |
| Dynamic Type support ≥200% (iOS) ; Android 14 up to 200% non-linear | text scaling | S11,S23 | VERIFIED |
| Window size classes 600/840/1200/1600 dp; height 480/900 | Android | S21 | VERIFIED |
| Carbon grid 320/672/1056/1312/1584, cols 4/8/16/16/16 | web | S30 | VERIFIED |
| Tailwind bp 640/768/1024/1280/1536; Bootstrap 576/768/992/1200/1400; Primer 320/544/768/1012/1280/1400; Polaris 0/490/768/1040/1440; Fluent 320/480/640/1024/1366/1920 | web | S40,S42,S38,S31,S33 | VERIFIED |
| Spacing: Carbon 2…160; Atlassian 8-base; Fluent 4-base; Radix 4–64; Android 8dp/4dp | scales | S30,S32,S33,S36,S24 | VERIFIED |
| Radius: Fluent 0/2/4/8/12; Primer 3/6/12; Tailwind 2…32; Radix 3…16 ×factor | scales | S33,S38,S40,S36 | VERIFIED |
| iOS dark bg #000000 / #1C1C1E / #2C2C2E; labels alpha 1/.6/.3/.18 | iOS 13-era | S52 | VERIFIED (3rd party) |
| M3 dark: surface #141218 (tone 6); containers tone 4/10/12/17/22/24; onSurface #E6E0E9; primary #D0BCFF | M3 baseline | S17 | VERIFIED |
| Carbon g100: bg #161616; layers #262626/#393939/#525252; text #F4F4F4/#C6C6C6; overlay .6 | Carbon | S30 | VERIFIED |
| M2 dark base #121212; text 87/60/38% | Material 2 | S25 | VERIFIED (headline) |
| Dark-mode power saving 39–47% @100% brightness; 3–9% @30–50% | OLED | S50 | SNIPPET |
| HIG clear-glass dim 35% over bright media | iOS 26 | S10 | VERIFIED |
| Atlassian border 1/2/2 px; z-index 100–800; Radix steps 11/12 = Lc 60/90 | tokens | S32,S36 | VERIFIED |
| Control sizes Primer 24/28/32/40/48; Flutter VisualDensity step 4px (−4..4) | density | S38,S28 | VERIFIED |
| Material Symbols opsz 20–48, default 24px, wght 100–700 | icons | S56 | VERIFIED |
| iOS Safari zooms inputs <16px | web | S53 | SNIPPET |
| COMPUTED contrasts: white/#121212 18.73; #E6E6E6/#121212 15.01; #A6A6A6/#121212 7.70; #595959/#FFF 7.00; iOS26 red/white 3.57; #8D8D8D/#FFF 3.32; #767676/#FFF 4.54 (lightest gray passing AA) | pairs | S57 | COMPUTED |

## Comparison tables
### Token tier models
| System | Tiers | Naming | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|---|---|
| Material 3 | ref / sys / comp | `--md-sys-color-on-surface-variant` | Complete; generators (HCT) make accessible pairs | Heavy; purple baseline; component tokens numerous | Android/Flutter/Compose, brand via seed | Need non-M3 look without rewriting comps |
| Fluent 2 | global / alias | descriptive alias | Light/dark/HC built in; 4px spacing | Two tiers, less component isolation | Cross-platform Microsoft-style | Mobile-first consumer polish |
| Spectrum | primitive / semantic / component | what-affects-when | Clear usage order; scales/color themes | Docs partly unreachable | Large multi-product suites | Small apps |
| Atlassian | foundation.property.modifier | `color.background.neutral.hovered` | Great role clarity, emphasis levels | Verbose | Productivity/SaaS | Tiny token budgets |
| Carbon | role + layers | `$layer-01`, `$text-secondary` | Layering model, productive/expressive types | Gray-heavy; web-first | Dense enterprise/data | Playful consumer |
| Radix Colors/Themes | 12 fixed steps/hue | `--accent-9` | Step semantics make dark mode mechanical | Not designed to be customized | Web React apps | Native mobile |
| shadcn | CSS vars X/X-foreground | `--primary-foreground` | Simple, Tailwind v4 bridge, `.dark` override | Few tiers; copy-paste components | Web MVPs | Strict governance |

### Elevation strategies
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Shadow only | Familiar | Invisible in dark | Light themes | Dark/OLED |
| Tonal surface steps | Works in dark; calm | Low contrast (1.1–1.5:1) | Dark/M3 | Needs boundary identification |
| 1px border + layer step | Crisp, cheap, dense | Busy if overused | Data tables, enterprise (Carbon) | Immersive/editorial |
| Blur/Liquid Glass | Context, depth | Legibility risk; perf; Reduce Transparency fallbacks | iOS 26 bars/overlays | Content cells, text-heavy surfaces |

### Dark canvas choices
| Choice | Strength | Weakness | Best use |
|---|---|---|---|
| #000000 | Max OLED saving, iOS-native | Smearing reports, harsh vs white text | iOS base, media, optional OLED theme |
| #121212 / #141218 / #161616 | Room for elevation steps, softer | Slightly less saving | Default |
| Colored dark (brand-tinted, chroma 4–8) | Cohesive | Contrast tuning per hue | M3-style brand |

## Anti-patterns found
| Problem -> why -> alternative | Source |
|---|---|
| Value-named semantic tokens (`blue-button`) -> breaks on rebrand/dark -> role names | S32,S34 |
| One-off hex/px in components -> drift, dark mode gaps -> tokens only; lint | S9,S22 |
| Components referencing primitives -> theme can't re-map -> go through semantic tier | S34 |
| Token explosion (component token per prop) -> unmaintainable -> add only on divergence | S34 |
| Inverting light palette for dark -> glare, wrong hierarchy -> re-author | S9 |
| Shadows for dark elevation -> invisible -> lighten surfaces | S32,S20 |
| Pure `#FFFFFF` text on `#000000` everywhere -> glare/halation reports; flat -> off-white text, off-black or layered surfaces | S45,S46 |
| Alpha-based secondary/placeholder text -> contrast depends on backdrop (iOS secondaryLabel 3.4:1 on white, Carbon placeholder 2.6:1) -> solid tokens verified per surface | S52,S30 (COMPUTED) |
| System red/green as small text -> <4.5:1 -> darker text variant or icon + label | S8 (COMPUTED) |
| Padding/height in sp/em -> breaks layout at 200% scale -> dp for layout, sp for text | S23 |
| Text <12 on content -> unreadable, no support for scaling -> floor 12 (11 for chrome labels) | S7,S17 |
| Locking light theme / no dark support on Android -> accessibility regress | S24 |
| App-specific appearance toggle on iOS without need -> extra work, confusion (HIG) | S9 |
| Disabled shown only by opacity -> unexplained dead control -> reason text + semantics | S43 |
| Undocumented state matrix -> inconsistent hover/focus/error -> spec every state | S47 |
| Theme flash on web -> no `color-scheme` meta/pre-paint script | S44 |
| Excessive radius on multi-line text containers -> clipped text/awkward gaps | S33 |
| Boolean prop explosion in components -> use variant/tone/size enums | S36 (principle) |

## Disagreements & weak-evidence zones
- In-app dark toggle: HIG says avoid; Android/NN/g/web.dev say provide (F13). Context decides.
- Dark canvas: iOS #000 vs M2 #121212 vs M3 #141218 vs Carbon #161616. No T1 source gives a measured legibility reason for either; power numbers are condition-dependent (SNIPPET); smear evidence is anecdotal.
- Dark vs light legibility: positive polarity favors light mode for normal vision (NN/g S46, S51); dark helps some low-vision users. "Dark is easier on eyes" as general claim: not supported.
- Spacing naming: 4px-multiplier (Polaris/Tailwind) vs 8px-multiplier (Atlassian) vs ordinal (Carbon/Radix) — cosmetic, no evidence for one.
- Rounding/"friendly" shapes: only aesthetic-preference evidence (S49) and vendor research with confounds (S26). Trend, not rule.
- 60-30-10, saturated-surface fatigue: no UI evidence found (opinion).
- Disabled container opacity: 12% (older M3 spec/outline) vs 10% (current Compose filled button).
- APCA vs WCAG ratio: WCAG 3 contrast algorithm undecided (S43); Radix uses APCA targets; WCAG 2.2 ratios remain the legal/compliance basis.
- Fluent type ramp names offset from Apple's (Fluent iOS Caption1 13/18 = Apple Footnote).
- HIG accessibility table lists iOS minimum control 28pt while default is 44pt; Android/Material enforce 48dp; resolve with 48 token.
- Polaris has migrated to shopify.dev web components; legacy token docs not reachable, so token names for Polaris are partly unknown.

## Gaps (could not verify)
- m3.material.io pages (color roles, state layers, density -1..-3, elevation guidance) unreachable; used androidx/material-web source instead. Material density scale and M3 layout margins (16/24dp) unverified (MEMORY).
- M2 elevation overlay % table and "15.8:1" figure: page text not captured; reproduced via verified formula only.
- Apple: exact margins (16/20pt), iOS 26 dark-mode base/elevated hex values, systemBackground values after iOS 26 (third-party iOS 13 extraction only), Liquid Glass opacity/blur numbers (not published).
- Adobe Spectrum color themes / platform scale (medium vs large) pages 404 -> unverified (MEMORY: desktop "medium" vs mobile "large" scale).
- Salesforce SLDS density specifics (SLDS2 page empty; 30% from snippet).
- Atlassian opacity/radius/shadow token values not captured (all-tokens page truncated).
- Style Dictionary `usesDtcg` flag and exact v5 DTCG 2025.10 coverage; Figma DTCG import/export.
- Native tabular-figure APIs, Compose/SwiftUI truncation APIs, `@ScaledMetric` behaviour: MEMORY.
- Pre-paint theme script pattern and `rem`-based media queries: MEMORY (standard practice, not in fetched docs).
- Dark-mode image-dimming percentages and theme-transition durations: no research source (REC only).
- WebSearch budget exhausted: no verification of nested-radius rule beyond Apple/Tailwind, GOV.UK full spacing list, Open Props rationale.
