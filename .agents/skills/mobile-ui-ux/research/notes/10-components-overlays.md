# 10 - Component & Overlay Pattern Selection for Mobile

Scope: buttons, navigation, cards/lists, menus, dialogs/sheets, form controls, feedback, content patterns, onboarding, search/filters, data-viz, visual-noise evidence. Written 2026-10-06.
Tool constraints this session (affect tags): m3.material.io was unreachable (ECONNREFUSED / empty JS shell) so M3 *guideline prose* is SNIPPET-only; M3 *numbers* come from androidx Compose token source + material-components-android docs (VERIFIED). WebSearch budget ran out after ~13 calls (shared cap). WebFetch output is machine-summarised, so numbers were cross-checked across sources where possible. "m1.material.io" = legacy Material 1 (deprecated); use only for pattern logic, not current numbers.
Source IDs below are used in findings. HIG JSON base: `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json`.

## Sources consulted
| ID | URL / slug | Tier | Tag |
|---|---|---|---|
| HIG | base above; slugs fetched: sheets, alerts, action-sheets, buttons, tab-bars, segmented-controls, lists-and-tables, pickers, toggles, menus, onboarding, searching, search-fields, modality, charts, steppers, sliders, text-fields, toolbars, context-menus, pull-down-buttons, popovers, page-controls, progress-indicators, collections, privacy, launching, entering-data, materials, gestures, managing-accounts. 404: navigation-bars, badging, refresh-content-controls | T1 | VERIFIED |
| UIKit-sheet | https://developer.apple.com/tutorials/data/documentation/uikit/uisheetpresentationcontroller.json | T1 | VERIFIED |
| MDC | https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/{BottomSheet,Dialog,FloatingActionButton,Snackbar,BottomNavigation,Card,Chip,DatePicker,Tabs,Carousel,Menu,Slider,TopAppBar,BottomAppBar,NavigationDrawer,SideSheet,Search,Switch,List}.md (Tooltip=stub; Badge 404; Button=index only) | T1 | VERIFIED |
| M3-tokens | https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/<X>Tokens.kt (Button{XSmall,Small,Medium,Large,XLarge}, Fab{Large,Medium}, ExtendedFabPrimary, NavigationBar, List, Switch, Checkbox, FilterChip, Badge, Snackbar, SearchBar, AppBarSmall, BottomAppBar, DragHandle, Dialog) | T1 (code) | VERIFIED |
| M3-snip | m3.material.io/components/{buttons,dialogs,cards,lists,bottom-sheets,floating-action-button}/guidelines + buttons/specs (search excerpts only) | T1 | SNIPPET |
| M3-droid | developer.android.com/develop/ui/compose/components/{dialog,bottom-sheets,snackbar,fab,segmented-button,badges,pull-to-refresh}; /training/permissions/requesting; /design/ui/mobile/guides/patterns/predictive-back | T1 | VERIFIED |
| M3E-research | https://design.google/library/expressive-material-design-google-research | T1 (vendor claim) | VERIFIED |
| M1 | https://m1.material.io/components/{dialogs,lists,snackbars-toasts,bottom-sheets,buttons,cards,chips,buttons-floating-action-button,steppers,tabs,bottom-navigation,menus,pickers,selection-controls}.html ; /patterns/{selection,swipe-to-refresh}.html | T1 legacy | VERIFIED |
| GOVUK | https://design-system.service.gov.uk/components/{button,date-input,select,radios,checkboxes,accordion,pagination,notification-banner,tabs,details}/ ; /patterns/dates/ ; raw govuk-frontend button/_mixin.scss | T2 | VERIFIED |
| Carbon | https://carbondesignsystem.com/components/{button,dropdown,modal,notification,toggle,tabs,radio-button,tooltip}/usage/ ; /data-visualization/{chart-anatomy,color-palettes,simple-charts,dashboards,chart-types}/ ; /patterns/empty-states-pattern/ | T1 | VERIFIED |
| Atlassian | https://atlassian.design/components/{button,modal-dialog,banner,flag,tooltip,avatar,avatar/examples,badge,toggle,tabs}/usage | T1 | VERIFIED |
| Fluent | https://fluent2.microsoft.design/components/web/react/core/{button,dialog,toast,drawer,messagebar}/usage (iOS pages 404) | T1 | VERIFIED |
| Spectrum | https://react-spectrum.adobe.com/react-spectrum/{AlertDialog,Dialog,Toast,Picker}.html (spectrum.adobe.com/page/* 404) | T1 | VERIFIED |
| Polaris | https://shopify.dev/docs/api/app-home/polaris-web-components/feedback-and-status-indicators/banner (polaris.shopify.com now redirects) | T1 | VERIFIED (banner only) |
| Lightning | v1.lightningdesignsystem.com/components/modals/ (blueprint only, no guidance) | T1 | VERIFIED (useless) |
| NNg | nngroup.com/articles/{bottom-sheet,modal-nonmodal-dialog,designing-effective-carousels,auto-forwarding,infinite-scrolling-tips,mobile-tutorials,mobile-app-onboarding,icon-usability,cards-component,confirmation-dialog,toggle-switch-guidelines,tooltip-guidelines,tabs-used-right,date-input,dropdown-list,mobile-accordions,mobile-navigation-patterns,radio-buttons-default-selection,contextual-swipe,flat-ui-less-attention-cause-uncertainty,liquid-glass,hamburger-menus,progressive-disclosure,search-visible-and-simple,wizards,aesthetic-usability-effect,ten-usability-heuristics,mobile-faceted-search,dashboards-preattentive}/ | T2 | VERIFIED |
| NNg-snip | nngroup.com/articles/{checkboxes-vs-radio-buttons,accordions-on-desktop}/ (search excerpt) | T2 | SNIPPET |
| Baymard | baymard.com/blog/{homepage-carousel,return-same-place,number-of-items-loaded-by-default,autocomplete-design} ; /research-articles/{mobile-ux-ecommerce,mobile-app-ux-trends,mobile-ecommerce-search-and-navigation,horizontal-filtering-sorting-design,slider-interfaces,back-button-expectations,current-state-product-list-and-filtering,collections/product-list} | T2 | VERIFIED |
| Smashing | https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/ (reports Baymard tests) | T2/T3 | VERIFIED |
| WCAG | w3.org/WAI/WCAG22/Understanding/{non-text-contrast,status-messages,timing-adjustable,target-size-minimum,dragging-movements,pointer-gestures}.html | T1 | VERIFIED |
| APG/WAI | w3.org/WAI/ARIA/apg/patterns/dialog-modal/ ; w3.org/WAI/tutorials/{carousels,images/complex}/ | T1 | VERIFIED |
| MDN | developer.mozilla.org/en-US/docs/Web/{HTML/Reference/Elements/input/date,HTML/Reference/Elements/dialog,API/Popover_API,CSS/overscroll-behavior} | T1 | VERIFIED |
| Other | inclusive-components.design/cards/ (T3) ; chartability.fizz.studio (T3) ; web.dev/articles/sign-in-form-best-practices (T1) | | VERIFIED |

## Findings

### A. Buttons and actions
### F1 Button hierarchy: one primary per view/area, differentiate by style not size
- Claim: Every system limits the single most-emphasised action; secondary actions get progressively quieter styles. M3 orders filled > tonal > elevated > outlined > text; text buttons suit dialogs/cards; elevated only when separation from a busy background is needed.
- Evidence: HIG buttons (T1 VERIFIED: prominent style for the most likely action, 1-2 per view, use style not size, never give primary role to a destructive action). GOVUK button (VERIFIED: one primary; secondary sparingly). Carbon button (VERIFIED: 5 variants primary/secondary/tertiary/ghost/danger, 1 primary per page, temporary flows excepted). Atlassian button (VERIFIED: one primary per page or area). Fluent button (VERIFIED: one primary per layout; equal-importance actions all neutral; many minor actions use outline/subtle/transparent). M3-snip (SNIPPET: filled = final/completing actions e.g. Save/Confirm; tonal = e.g. "Next" in onboarding; text = lowest, inside dialogs/cards).
- Corroboration/conflict: Full agreement. HIG allows 1-2 prominent (slightly looser).
- Scope: universal.
- Agent rule: IF a view has several actions THEN exactly 1 filled/primary (the one that completes the task); 1-2 secondary as tonal/outlined; the rest text/ghost. IF two actions are truly equal THEN same style for both (Fluent). Never style by size alone.
- Stack: Compose Button/FilledTonalButton/OutlinedButton/TextButton; SwiftUI .borderedProminent / .bordered / .plain; Flutter FilledButton/FilledButton.tonal/OutlinedButton/TextButton (MEMORY for API names).

### F2 Button size, target, and full-width on mobile
- Claim: Targets >= 44pt (iOS) / 48dp (Android) even if the visual is smaller; M3 Expressive adds five heights; full-width primary CTAs are a normal compact-screen pattern.
- Evidence: HIG buttons (VERIFIED 44x44pt). MDC Chip/Slider/BottomSheet docs (VERIFIED 48dp touch target pattern). WCAG 2.5.8 (VERIFIED 24x24 CSS px min w/ spacing exception; 44px is AAA 2.5.5). M3-tokens (VERIFIED heights XS 32 / S 40 / M 56 / L 96 / XL 136 dp; small padding 16dp, medium 24dp; icon-label gap 8dp; icon 20/24dp). GOVUK frontend mixin (VERIFIED: button is width:100% on mobile, auto from tablet breakpoint). Carbon (VERIFIED: fluid buttons used in modals/side panels; tertiary not fluid). HIG buttons (VERIFIED watchOS full-width for primary).
- Conflict: none; full-width is convention, no A/B evidence found. M3E 56dp+ buttons are Expressive-only (trend).
- Scope: universal (numbers per platform).
- Agent rule: IF the primary action closes a form, sheet or checkout step on a compact screen THEN full-width (or width-filling pair) button >= 48dp tall pinned at the end of content or in a sticky footer. IF buttons sit inline with text THEN auto width but >= 44x44pt/48dp target. Group secondary beneath, not beside, when labels > ~12 chars.

### F3 Destructive actions: style, confirm only when needed, prefer undo
- Claim: Mark destructive actions (red) but do not make them default/primary; confirm only for uncommon irreversible actions; undo beats confirmation.
- Evidence: HIG buttons+alerts (VERIFIED: destructive role = red, never primary; destructive alert style only for unintended destructive choices, not for deliberately chosen ones like Empty Trash; don't alert on common undoable actions). NNg confirmation-dialog (VERIFIED: reserve for serious consequences; specific text; verb button labels not Yes/No; no preselected default; undo is better; "type DELETE" for the worst). GOVUK button (VERIFIED: warning button rare; precede with confirmation step; not colour alone). Carbon button (VERIFIED: danger button cannot be icon-only). HIG pull-down (VERIFIED: destructive menu item red + confirm via action sheet). APG dialog (VERIFIED: focus the least destructive action).
- Scope: universal.
- Agent rule: IF action is reversible THEN do it + show snackbar with Undo (no dialog). IF irreversible/high-cost THEN dialog titled with the object ("Delete 3 photos?"), buttons "Delete" (destructive style) + "Cancel", initial focus on Cancel. NEVER use "Are you sure?" + Yes/No.

### F4 Disabled buttons vs always-enabled + validation; loading state
- Claim: Disabled buttons hide *why*; GOV.UK and Atlassian say avoid them in forms; HIG entering-data says gate Next until required data is present. Loading state belongs inside the button.
- Evidence: GOVUK button (VERIFIED: avoid disabled; poor contrast/confusion; `prevent-double-click`). Atlassian button (VERIFIED: avoid disabling esp. in forms; loading state does not disable function; show validation). HIG entering-data (VERIFIED: disable Next/Continue until required data present). HIG buttons (VERIFIED: spinner inside button, label may change "Checkout" -> "Checking out..."). WCAG 1.4.11 (VERIFIED: inactive components exempt from 3:1). web.dev sign-in (VERIFIED: disable submit after click to prevent duplicates).
- Conflict: HIG vs GOV.UK/Atlassian. Context: Apple's gate is for multi-step Next; GOV.UK research is on public services with low-literacy users.
- Scope: universal; flagged disagreement.
- Agent rule: DEFAULT = keep submit enabled, validate on submit/blur, focus first error, show specific messages. ALLOWED exception: wizard "Next" may be disabled only if an adjacent visible hint states what is missing. On submit: swap label to progressive verb + inline spinner, block repeat taps (not the whole screen), restore on error.

### F5 Icon-only buttons and unclear icons
- Claim: Only a handful of icons are universally understood; labels must be visible; tooltips are not a touch solution.
- Evidence: NNg icon-usability (VERIFIED: only home/print/magnifier broadly understood; visible text label required; test recognisability and memorability; if choosing an icon takes >5 s it will likely fail; icons are noticed more on mobile). NNg mobile-navigation-patterns (VERIFIED: labelled icons recommended). HIG buttons/toolbars (VERIFIED: familiar icons or text; text when clearer; SF Symbols; don't mix text and symbol in one toolbar group). Carbon button/tooltip (VERIFIED: icon-only needs tooltip; limit to standard icons). Atlassian button/tooltip (VERIFIED: icon-only needs label via tooltip but tooltips unreachable on touch/AT -> use helper text for essentials). NNg heuristic 6 (VERIFIED: recognition over recall).
- Scope: universal.
- Agent rule: IF an icon is not in {search, share, close, back, add, settings, home, delete, edit, more} THEN add a visible label (tab bars, FABs -> extended FAB, primary toolbar actions). Icon-only allowed for those standard icons + required accessible name (contentDescription / aria-label / accessibilityLabel) + 44/48 target.

### F6 FAB, extended FAB, and alternatives for the primary screen action
- Claim: FAB = single, most common, positive creation action; M3 Expressive deprecates small FAB, adds medium (80dp) and FAB menu replacing speed-dial; there is no empirical usability study found - it is a convention.
- Evidence: M1 FAB (VERIFIED legacy: one per screen; positive actions create/favourite/share/navigate; 56dp (mini 40dp for screens <= 460dp); 16dp mobile margin; speed dial 3-6 items; avoid for archive/trash/minor/non-specific). MDC FAB (VERIFIED: standard/medium/large; small deprecated in M3E; shifts up when Snackbar shows; hides under bottom sheets; needs contentDescription). M3-tokens (VERIFIED: medium 80dp / large 96dp / icons 28/32dp; extended 56dp, icon 24dp). MDC BottomAppBar (VERIFIED: up to 4 actions incl. FAB; 80dp; hideOnScroll auto-disabled under TalkBack). M3-snip (SNIPPET: FAB menu replaces speed dial/stacked small FABs). HIG toolbars (VERIFIED: one prominent primary action per toolbar, trailing, e.g. Done/Submit).
- Conflict: iOS has no FAB convention; primary create action sits in top-trailing toolbar (HIG) or bottom toolbar.
- Scope: Android (FAB); iOS uses toolbar.
- Agent rule: Android + list/feed screens with one create action -> Extended FAB (label+icon) bottom-end, scrolls out or collapses to icon on scroll; add bottom padding so it never covers the last row. iOS -> trailing toolbar prominent button. IF a form/checkout step has the primary action THEN bottom full-width button (not FAB). IF 2+ equal create actions THEN FAB menu (Android) / "+" pull-down menu (iOS), max 6 items. Do not combine FAB with a bottom sticky CTA on the same screen.

### B. Navigation
### F7 Bottom/tab bar: count, labels, badges, never hide
- Claim: 3-5 top-level destinations with icon+label; do not disable/hide tabs; avoid overflow "More"; navigation not actions.
- Evidence: HIG tab-bars (VERIFIED: aim <= 5 for default list; avoid overflow More tab; short single-word labels; badges only for critical info; keep tab bar visible; do not disable/hide tab buttons; tab bars navigate, toolbars act; iOS 26 Liquid Glass background, minimize-on-scroll option, avoid label colours clashing with content). MDC BottomNavigation (VERIFIED: 3-5 destinations; label modes; active indicator 56x32dp; container 80dp / 64dp in expressive). M3-tokens (VERIFIED NavigationBar ContainerHeight 64dp, TallContainerHeight 80dp). M1 bottom-nav (VERIFIED legacy: 3-5, avoid <3 (use tabs) or >6, hide on scroll down, unsuitable for single-task/settings screens, don't mix with tabs). NNg mobile-navigation-patterns (VERIFIED: tab bars suit sites with few options; >5 breaks touch-target size; label icons). NNg liquid-glass (VERIFIED critique: cramped bar, shifting controls hurt predictability).
- Scope: iOS/Android; web PWA mimic.
- Agent rule: IF 2 top-level views THEN segmented control/tabs not bottom bar; IF 3-5 THEN bottom bar with icon+label always visible; IF >5 THEN keep 4 + "More" screen or restructure IA (do not shrink targets). Badge only for actionable unread/critical. Active destination = filled icon + label colour + indicator (not colour alone).

### F8 Tabs vs segmented control vs chips (in-page switching)
- Claim: Segmented = 2-5 closely related views/options of one object; tabs = peer sections with distinct content; chips = filters/>5 options; none are for sequential steps or side-by-side comparison.
- Evidence: HIG segmented-controls (VERIFIED: closely related choices/subviews; max 5 on iPhone (5-7 on wide); equal widths; all text or all images; not for top-level sections). M3-droid segmented (VERIFIED: 2-5 options, more -> chips; single/multi select). NNg tabs-used-right (VERIFIED: few tabs; 1-2 word labels; no all-caps; strong active state esp. with 2 tabs; avoid mixing in-page with navigation tabs; no stacked tab rows; scrolled-off tabs get missed; accordions beat tabs on mobile). Carbon tabs (VERIFIED: avoid for filtering identical content (use content switcher), sequential processes (use progress indicator), side-by-side comparison; labels 1-2 words; scroll rather than truncate). Atlassian tabs (VERIFIED: low count; not for info needed simultaneously). GOVUK tabs (VERIFIED: never disable tabs; avoid when comparing; collapses to sequential list on small screens). MDC Tabs (VERIFIED: fixed vs scrollable; 48dp / 72dp (icon+text) heights; 2dp indicator). M1 tabs (VERIFIED legacy: don't combine with swipe-conflicting content like maps).
- Agent rule: IF 2-5 mutually exclusive options AND they change the *view of the same data* THEN segmented control. IF 2-6 peer content sections THEN tabs (scrollable only if > ~5; never two tab rows). IF > 5 options or multi-select filtering THEN chips. IF choice navigates to a different top-level area THEN bottom bar, not segmented.

### F9 Top app bar / toolbar actions and overflow
- Claim: Keep <= 2-3 visible actions; rest in overflow; one prominent confirm action trailing; overflow ("...") hurts discoverability so keep primary actions out of it.
- Evidence: HIG toolbars (VERIFIED: <= 3 logical groups; trailing = critical/primary; prefer symbols; text labels only when symbols fail; Liquid Glass: reduce custom backgrounds/tints, prefer monochrome with colourful content). HIG pull-down-buttons (VERIFIED: ellipsis "More" may hinder discoverability; never hide all view actions; need >= 3 items else standalone buttons). MDC TopAppBar (VERIFIED: small bar ?attr/actionBarSize ~56dp; M3-tokens AppBarSmall 64dp (flexible/expressive); items "ifRoom"/overflow; lift-on-scroll; content descriptions). MDC BottomAppBar (VERIFIED: <= 4 actions incl. FAB).
- Conflict: 56dp (classic) vs 64dp (flexible app bar tokens).
- Agent rule: Top bar: Back/Close (leading) + title + <= 2 icon actions + optional overflow. Modal sheets/full-screen modals: Cancel/Close leading, Done/Save trailing (HIG sheets). Never put the primary action in overflow.

### F10 Drawers and hamburger menus
- Claim: Hidden navigation measurably lowers discoverability; mobile penalty smaller than desktop; hybrid (some visible + menu) beats pure hidden. Standard (permanent) drawers do not suit phones.
- Evidence: NNg hamburger-menus (VERIFIED: navigation used in 57% of tasks when hidden vs 86% with combo on mobile (desktop 27% vs 48-50%); hidden nav cut content discovery >20%, +21% perceived difficulty, tasks +15% slower on mobile; recommend visible links when <= 4 options on mobile). MDC NavigationDrawer (VERIFIED: modal drawer for mobile w/ scrim; max width 280dp; radius 16dp; Esc closes; 48dp items; standard drawer unsuitable for phones). Fluent drawer (VERIFIED: overlay = modal; avoid actions needing frequent confirmation; warn if inputs would be lost on close). NNg mobile-navigation-patterns (VERIFIED: "Menu" label beats icon alone).
- Scope: universal; M3/Android drawer historically common, iOS prefers tab bar.
- Agent rule: IF <= 5 destinations THEN bottom bar, not drawer. IF > 5 THEN bottom bar for top 3-4 + a "Menu/More" destination; if a hamburger is used label it "Menu" or pair with visible items; drawer width <= 280dp / 80% screen, dismiss by scrim tap, Back and Esc.

### C. Containment: cards, lists, menus, overlays
### F11 Cards vs lists vs plain sections; clickable card pattern
- Claim: Cards fit heterogeneous browse content; homogeneous scannable items should be list rows/grids; don't box content that spacing/headings/dividers can group. Make the card (or its title) the single primary target; avoid nesting links.
- Evidence: NNg cards-component (VERIFIED: use for browsing heterogeneous content/dashboards/feeds; avoid for scan/compare/homogeneous items; cards consume more space; larger touch zones; don't replace lists for aesthetic modernisation). M1 cards (VERIFIED legacy: homogeneous -> list; image galleries -> grid tiles; primary action = card itself; <= 2 supplemental actions + overflow). M3-snip cards (SNIPPET: don't force content into cards when spacing, headlines or dividers give simpler hierarchy; elevated/filled/outlined variants). MDC Card (VERIFIED: checkable via long-press; draggable needs accessibility delegate; 1dp elevated/0dp filled+outlined). Inclusive Components (T3 VERIFIED: link on heading + ::after stretch; avoid nested links; raise secondary controls above overlay; use list markup, consistent heading level).
- Scope: universal.
- Agent rule: IF items are same shape, user compares/scans (contacts, orders, settings, transactions) THEN list rows (F12). IF items mix media/length/actions (feed, dashboard modules, recommendations) THEN cards. IF only grouping needed THEN section header + whitespace, no container. Card: one primary tap (whole card), <= 2 secondary actions (as buttons, >=44/48dp, own focus), others in overflow; never put a card in a card.
- Stack: Web `<a>` on heading with `::after{inset:0}`; Compose `Card(onClick)`; SwiftUI `NavigationLink` row.

### F12 Lists: line counts, leading/trailing, dividers, sections
- Claim: One-line 56dp / two-line 72dp / three-line 88dp (M3); > 3 lines -> use a card instead; use section headers (iOS grouped) rather than heavy dividers; chevron = navigates, info button = reveals.
- Evidence: M3-tokens ListTokens (VERIFIED: 56/72/88dp; leading icon 24, avatar 40, image 56x56, video 100x56; item top/bottom 10dp, leading/trailing 16dp, gap 12dp, segmented gap 2dp). M1 lists (VERIFIED legacy: 48/72/88dp; dense 40/60/76; 72dp text keyline; > 3 lines use cards; 8dp list top/bottom padding). M3-snip lists (SNIPPET: dividers recommended for three-line rows; structure via visuals, dividers, spacing). HIG lists-and-tables (VERIFIED: succinct text, middle-ellipsis truncation, prefer text rows (use collections for large images), headers/footers in grouped style, disclosure chevron to drill in vs info button, persistent highlight in navigation lists vs checkmark in option lists, avoid alphabetic index next to trailing controls). MDC List (VERIFIED: segmented lists, swipe-reveal, decorative elements must not take focus).
- Scope: universal; iOS min row ~44pt (MEMORY).
- Agent rule: Row = [leading icon/avatar/thumb] [headline + <= 2 supporting lines] [one trailing element: chevron | value | switch | checkbox | overflow]. Max 1 trailing control. Whole row is one target. Group with section headers; add dividers only when rows have 3 lines or no spacing. Truncate with ellipsis, give full text in detail.

### F13 Swipe actions, reorder, selection mode
- Claim: Swipe actions are hidden gestures: supplement, never the only path; reorder and drag need non-drag alternatives; selection mode via long-press with contextual action bar.
- Evidence: NNg contextual-swipe (VERIFIED, summariser-based: lack of signifiers, swipe hides the item identity, inconsistent semantics across apps, accidental destructive swipes; keep item visible, confirm/undo, consistent behaviour). HIG gestures (VERIFIED: custom gestures must be discoverable, optional, never the only path; avoid system-edge conflicts). WCAG 2.5.7 (VERIFIED: any drag needs single-pointer alternative e.g. up/down buttons) and 2.5.1 (VERIFIED: path-based/multipoint gestures need alternatives). M1 selection (VERIFIED legacy: long-press enters selection; checkmark overlay; avoid permanent checkboxes; deselect all/act to exit). HIG lists (VERIFIED: edit mode allows reorder). MDC Card/List (VERIFIED: draggable needs accessibility delegate).
- Agent rule: Every swipe action must also exist in overflow/long-press menu or detail screen. Swipe: <= 2 actions per side; destructive on the trailing edge, confirm via undo snackbar. Reorder: drag handle icon + "Move up/down" in menu (accessibility). Selection: long-press (or "Select" button) -> checkboxes appear + count in top bar + bulk-action bar; Back/X exits.

### F14 Menus: overflow, context, pull-down
- Claim: Menus are compact lists of commands; keep short, group with separators, one level; context menus are hidden so mirror every item elsewhere.
- Evidence: HIG menus (VERIFIED: ~5-6 items before splitting/submenus; submenu 1 level, <= 5 items; ellipsis if more input needed; icons all-or-none per group; unavailable items dimmed). HIG context-menus (VERIFIED: hidden by default; include only frequent task-specific items; <= ~3 groups; 1-level submenus; destructive last in red; hide unavailable; same actions available in main UI; preview of target). HIG pull-down (VERIFIED: >= 3 items; use pop-up button for mutually exclusive options). M1 menus (VERIFIED legacy: 48dp rows; 112-280dp width; use simple dialog if text wraps). MDC Menu (VERIFIED: dropdown vs exposed dropdown; 3dp elevation; screen readers read items).
- Agent rule: IF > 6 commands THEN split by group or use sheet. Destructive item last + red. Long-press menu is an accelerator only.

### F15 Dialogs/alerts: when, content, buttons, order
- Claim: Dialogs/alerts interrupt: use only for critical info, required decisions, or irreversible actions; <= 3 buttons (M1 says <= 2); verb labels; cancel always available.
- Evidence: HIG alerts (VERIFIED: use sparingly; not informational-only; not for common undoable actions; not at app start; <= 3 buttons; 1-2 word verb titles, avoid OK; always Cancel with destructive; never Cancel as default; preferred button trailing (row) / top (stack), Cancel leading / bottom; title <= ~2 lines). M1 dialogs (VERIFIED legacy: affirmative right, dismissive left; max 2 actions; descriptive verbs not OK; alerts often untitled; padding 24dp; dismiss via outside tap/Back; full-screen dialogs for multi-field tasks). M3-snip dialogs (SNIPPET: purposefully interruptive; dropdown less disruptive alternative; text buttons trailing-aligned; basic vs full-screen). MDC Dialog (VERIFIED: full-screen dialog for multi-step tasks). Carbon modal (VERIFIED: passive/transactional/danger/acknowledgment/progress; complex multi-step -> full page; non-critical -> toast/inline; frequent tasks belong on page; focus trap). Atlassian modal (VERIFIED: not for complex interactions/large tables/long scroll; close button required; no nested modals; initial focus on close button). Fluent dialog (VERIFIED: <= 3 actions; use toast for non-actionable updates; labels 1-2 words, single verb). Spectrum AlertDialog (VERIFIED: <= 3 buttons; always a visible title; autoFocusButton). NNg modal-nonmodal (VERIFIED: ok for critical errors, required info, wizard steps with progress; avoid for non-critical promos, checkout interruptions). M3-droid dialog (VERIFIED: onDismissRequest also fires on outside tap and Back). APG (VERIFIED: role=dialog, aria-modal, labelled, focus first element, Esc, return focus). MDN dialog (VERIFIED: showModal -> inert background, Esc, autofocus; closedby any/closerequest/none).
- Conflict/button order: iOS and Android agree for horizontal rows (dismissive leading, affirmative trailing); iOS stacks preferred button on top. "Reversed on Android" folk claim comes from Windows/older conventions (MEMORY) - treat as unsupported for current Material/HIG.
- Agent rule: IF info only/no decision THEN inline message or snackbar, not dialog. Title = question/statement of consequence; body only if adds info; buttons = specific verbs; dialog width follows platform. Android: text buttons, trailing; iOS: system alert. Never open a dialog from a dialog; never at launch.

### F16 Action sheets (iOS) / menu sheets
- Claim: Use for 2+ related choices after an intentional action; short title; cancel at bottom; destructive at top; don't scroll.
- Evidence: HIG action-sheets (VERIFIED: choices tied to intentional action (e.g. cancel draft: delete or save); Cancel at bottom if data could be lost; destructive style first/top; avoid scrolling; unavailable on visionOS) + HIG alerts (VERIFIED: use action sheet not alert for multiple choices). HIG pull-down (VERIFIED: destructive menu item confirms through action sheet).
- Agent rule: iOS multi-choice confirm -> action sheet (SwiftUI confirmationDialog, MEMORY); Android equivalent = modal bottom sheet list or dialog with <= 3 options.

### F17 Bottom sheets: modal vs standard, detents, handle, dismissal, scroll, keyboard
- Claim: Sheets are for brief, contextual, partly-referencing tasks; always give a visible close and Back support; never replace page-to-page flows, stack, or hold long content.
- Evidence: NNg bottom-sheet (VERIFIED: modal blocks with scrim vs non-modal coexists; don't stack; don't replace normal page flows; avoid lengthy content; add visible X (swipe/handle alone fails some users); support Back; swipe-down is a barrier for motor-impaired). HIG sheets (VERIFIED: medium+large detents, grabber for resizable sheets (tap cycles, VoiceOver works), vertical swipe dismiss, confirm if unsaved, Cancel leading/Done trailing/Back for steps, one sheet at a time, non-modal sheets for interacting with parent, complex flows -> full-screen). UIKit-sheet (VERIFIED: medium/large/custom detents; largestUndimmedDetentIdentifier gives non-modal; prefersScrollingExpandsWhenScrolledToEdge; prefersGrabberVisible). MDC BottomSheet (VERIFIED: standard (non-hideable by default) vs modal (hideable, scrim); max width 640dp; drag handle min 48dp target, tap cycles / double-tap hides via TalkBack; 5 states; 1dp elevation). M3-snip (SNIPPET: handle 32x4 pill with 48 hit area). M1 bottom-sheets (VERIFIED legacy: dismiss via swipe, X, outside tap (modal), Back; initial height <= 16:9 keyline; on large screens prefer dialogs/menus). M3-droid (VERIFIED: ModalBottomSheet onDismissRequest covers swipe/outside; predictive back supported for bottom sheets (MDC >= 1.10)). Baymard back-button (VERIFIED: overlays/lightboxes should close on Back; 37% don't; small close buttons hard on mobile). WCAG 2.5.7 (VERIFIED: drag needs non-drag alternative). MDN overscroll-behavior (VERIFIED: `contain` stops scroll chaining to the page behind a sheet). Spectrum Dialog/Picker (VERIFIED: popovers become modals/trays on mobile).
- Keyboard/focus: no authoritative source verified for sheet+keyboard; MDC Search (VERIFIED) recommends adjustNothing for its search view. APG (VERIFIED) for focus management: treat modal sheet as dialog (trap focus, Esc, return focus).
- Agent rule: USE sheet for: quick pick (<= ~7 rows), share/actions, filters preview with result count, compact detail preview, non-modal map/music panels. DON'T for: multi-step flows, long forms (> ~3 fields), primary navigation, content users must read at length, anything needing deep-link/back-stack (use page). Always: visible close/Done button, Back/Esc dismisses, drag handle only as accessory (>= 48dp hit area, accessible resize actions), scrim tap closes modal sheets only if no unsaved input (else confirm), one sheet at a time, content scrolls inside sheet with scroll-to-expand at edge, inputs inside sheet: expand to full detent when keyboard opens (HEURISTIC), bottom padding = safe area + keyboard.
- Stack: SwiftUI `.sheet` + `.presentationDetents([.medium,.large])` + `.presentationDragIndicator(.visible)` + `.interactiveDismissDisabled(hasChanges)` (MEMORY); Compose `ModalBottomSheet`; Flutter `showModalBottomSheet(showDragHandle:true,isScrollControlled:true)` (MEMORY); Web `<dialog>` + CSS bottom anchoring + `overscroll-behavior:contain` + `closedby`.

### F18 Modal dialog vs sheet vs full-screen modal vs pushed page vs inline expansion
- Claim: Use the lightest container that fits the task; deep/complex/multi-step -> full page; simple choice -> menu/sheet; reveal-in-place when context matters.
- Evidence: HIG modality (VERIFIED: modal only with clear benefit; simple, short, streamlined tasks; avoid app-within-app hierarchies; full-screen for in-depth/multistep; obvious dismissal; confirm if data loss; dismiss one modal before presenting another). HIG sheets (VERIFIED: consider alternatives for complex/prolonged workflows). HIG popovers (VERIFIED: compact iPhone -> use sheet not popover; not for critical info). NNg bottom-sheet + modal-nonmodal (VERIFIED). Carbon/Atlassian/MDC (VERIFIED: multi-step -> full page/full-screen dialog). MDC SideSheet (VERIFIED: modal/standard side sheets for larger widths). Baymard back-button (VERIFIED: perceived-new-state UI must map to Back).
- Agent rule: see decision tree D1. Task needs own URL/deep link/Back stack OR > ~5 inputs OR multi-step -> pushed page or full-screen modal with Cancel/Save (HIG). Contextual quick action on current item -> sheet/menu. Confirmation of destructive action -> alert. Optional detail on same item -> inline expansion (accordion). Anchored small help/choices -> popover on tablet, sheet on phone.

### D. Feedback and status
### F19 Snackbar vs toast vs banner vs dialog vs inline
- Claim: Feedback ladder: inline (persistent, near cause) > snackbar/toast (transient, non-critical, may carry 1 action e.g. Undo) > banner (persistent page-level) > dialog (blocking). Never put the only copy of important information in an auto-dismissing toast.
- Evidence: M1 snackbars (VERIFIED legacy: one at a time; <= 1 text action, never "Dismiss/Cancel"; >= 2 actions -> dialog; single line; 48dp (80dp two-line); FAB moves up). M3-tokens Snackbar (VERIFIED 48dp / 68dp two-line). MDC Snackbar (VERIFIED: short/long/indefinite; action undo/retry; optional close icon; anchor above FAB/nav; text read by a11y services). Compose snackbar (VERIFIED: confirm action, network status, data submission). Carbon notification (VERIFIED: toast ~5 s auto-dismiss; inline persists; callout non-dismissible; severity info/success/warning/error). Fluent toast (VERIFIED: ~7 s default, persists while task runs; <= 1 CTA, link text <= 36 chars; <= 4 stacked; critical -> dialog/MessageBar). Fluent MessageBar (VERIFIED: dismissed warning/error reappear next session). Spectrum Toast (VERIFIED: min 5 s; actionable toasts never auto-dismiss; timer pauses on interaction; aria landmark). Atlassian flag/banner (VERIFIED: never auto-dismiss critical; <= 2 links; banner = critical, persistent, one at a time, push content; inline message for important info). GOVUK notification-banner (VERIFIED: people often miss banners; not for validation errors; place before h1; success banner role=alert). Polaris banner (VERIFIED: single message, dismissible unless critical, contextual placement, avoid undismissable persistent banners). WCAG 4.1.3 (VERIFIED: status messages need role=status/alert without moving focus). WCAG 2.2.1 (VERIFIED: auto-dismissing toast OK only if info is available another way, else must be adjustable/extendable; 20 s extension rule).
- Conflict: durations 5 s (Carbon, Spectrum min) / 7 s (Fluent). NNg gives no number.
- Agent rule: IF result of user's own action and reversible -> snackbar 4-7 s with Undo (pause while a11y service/focus; make it >= 6 s if it has an action; actionable = persist until acted). IF form/field problem -> inline error at field + error summary (not toast). IF system/page condition persists (offline, payment failed) -> banner (dismissible only if non-critical). IF blocking decision -> dialog. Max 1 snackbar visible (queue), above bottom bar/FAB, `role=status` (or alert for errors), never the only record.

### F20 Tooltips on touch
- Claim: Hover tooltips do not exist on touch; essential info must be visible; use label, helper text, or tap-triggered popup tip/toggletip.
- Evidence: NNg tooltip-guidelines (VERIFIED: never vital info; touch alternative = popup tips triggered by tap on ?/i icons). Carbon tooltip (VERIFIED: no essential info; interactive content -> toggletip; touch uses click-triggered definition tooltips). Atlassian tooltip (VERIFIED: inaccessible on touch; not for essential information). MDC Tooltip (stub, VERIFIED unfinished).
- Agent rule: Icon-only mobile control -> visible label or long-press tooltip as extra only. Explanations -> inline helper text, "i" button opening small popover/sheet (focusable, dismissible, Esc/Back).

### F21 Badges, dots, counts
- Claim: Badges mark critical/unread state; dot = "something new", number = quantity; cap long numbers; do not rely on colour.
- Evidence: HIG tab-bars (VERIFIED: badges red ovals, only critical info). M3-tokens Badge (VERIFIED: small 6dp dot, large 16dp). M3-droid badges (VERIFIED: custom logic for "999+" formatting; show only when count > 0). Atlassian badge (VERIFIED: numeric only; don't use without context; no 99+ rule documented; localise numbers).
- Conflict/gap: Material convention caps at 999+ (MEMORY: MDC maxCharacterCount default 4), common iOS/web convention 99+ (MEMORY/opinion). No source mandates 99+.
- Agent rule: tab/nav badge: dot if "has new", number <= 99 then "99+" (HEURISTIC; keeps within 3 chars); add accessible text ("3 unread"); remove when zero.

### E. Inputs and selection
### F22 Text input / entering data
- Claim: Minimise typing; separate labels (not placeholder-only); right keyboard; validate at sensible times; clear button.
- Evidence: HIG text-fields (VERIFIED: labels as well as placeholder, appropriate keyboard type, secure fields, size field to expected length, stack vertically, validate email on blur and password before leaving field, clear button on iOS). HIG entering-data (VERIFIED: prefill/defaults, pickers/menus over typing, real-time validation, number formatters). GOVUK date-input (VERIFIED: inputmode="numeric"; autocomplete bday-*). Baymard mobile-ux (VERIFIED: 93% of mobile sites use generic validation errors instead of specific ones; 54% lack address validation). web.dev sign-in (VERIFIED: type=email, autocomplete current/new-password, show-password toggle, disable submit after click).
- Agent rule: Visible label above field, hint below, specific error below on blur/submit; `inputmode`/keyboard type per field; `autocomplete` tokens; never placeholder-only labels; mark optional not required when most are required.

### F23 Select vs radio vs segmented vs combobox vs picker (option-count thresholds)
- Claim: Few options -> visible controls; mid -> dropdown/picker; long -> searchable. Thresholds differ by system; no empirical optimum; mobile native pickers (sheet/wheel) are better than custom dropdowns.
- Evidence: NNg dropdown-list (VERIFIED: dropdown sweet spot ~5-10 options; < 5 use radios; ~15+ use combobox; USWDS radios for < 7; Carbon < 3; mobile dropdown issues: accidental dismissal while scrolling, fat-finger, hidden defaults). NNg-snip checkboxes-vs-radio (SNIPPET: M3 threshold ~6). Carbon dropdown (VERIFIED: never dropdown for 2 options -> radios; multiselect for 2+ criteria; combo box for large/dynamic lists). GOVUK select (VERIFIED: last resort; ask questions to reduce options; pre-select default only for settings). GOVUK radios (VERIFIED: no preselect; alphabetical; inline only for binary). Carbon radio (VERIFIED: no preselect; labels < 3 words; tiles when more info needed). M1 selection-controls (VERIFIED legacy: radios when users need to compare all options side-by-side, else dropdown saves space). HIG pickers (VERIFIED: medium-long predictable lists; short lists -> pull-down; very large -> list with index; minute steps that divide 60). HIG segmented (VERIFIED: <= 5 on iPhone). M3-droid segmented (VERIFIED: 2-5). Spectrum Picker (VERIFIED: becomes tray on mobile).
- Conflict: preselect default: NNg radio-buttons-default-selection (VERIFIED: preselect most cases) vs GOV.UK/Carbon (no preselect).
- Agent rule: see D3 thresholds. 2-4 options -> radio list (or segmented if it switches a view); 5-10 -> native picker/menu (sheet on phone); > ~15 or dynamic -> searchable combobox (full-screen search on phone). Preselect only when a safe default exists and the setting applies immediately; leave blank for questions/consents.

### F24 Switch vs checkbox
- Claim: Switch = immediate on/off setting, no Save; checkbox = form value submitted later, multi-select, or consent.
- Evidence: NNg toggle-switch-guidelines (VERIFIED: immediate effect, no Save; label states what "on" does; consistent On/Off placement; not colour alone). HIG toggles (VERIFIED: iOS switch only inside list rows; outside lists use button toggles; don't rely on colour alone; checkboxes for hierarchies). MDC Switch (VERIFIED: effects immediate; optional thumb icons 16dp). M3-tokens (VERIFIED: track 52x32dp, handle 24/16/28, state layer 40dp; checkbox box 18dp, state layer 40dp). Carbon toggle (VERIFIED: not for confirmation-needed actions or > 2 options). Atlassian toggle (VERIFIED: never require a button; label must not change with state; explain disabled toggles). GOVUK checkboxes (VERIFIED: single checkbox for on/off in forms; never pre-checked; exclusive "none" option).
- Agent rule: Settings row with immediate effect -> switch (label = feature name, constant). Form with Submit, agreements, multi-select lists, bulk selection -> checkbox. Switch failing to apply (network) -> revert + error.

### F25 Sliders and steppers
- Claim: Sliders are imprecise: pair with value display/text input; steppers for small increments only.
- Evidence: HIG sliders (VERIFIED: min leading/max trailing; add text field + stepper for wide ranges; labels). HIG steppers (VERIFIED: small increments; pair with field for wide/unpredictable ranges; stepper has no value display). Baymard slider-interfaces (VERIFIED: needs text-field fallback, non-linear scale for skewed data, clear dual-handle affordance, live results 250-500ms; don't ship without these). MDC Slider (VERIFIED: standard/centered/range; discrete stops; labels; 48dp thumb target). WCAG 2.5.7 (VERIFIED: sliders must work by tap, not only drag).
- Agent rule: range within ~0-100 where precision is unimportant -> slider with live value; price/quantity ranges -> slider + two numeric fields; integer 1-10 -> stepper; > 20 or free values -> numeric input with keypad.

### F26 Date and time inputs
- Claim: Type-in for known/distant dates; calendar for near-term/ranges/availability; wheels for time; native `<input type=date>` is acceptable but format varies.
- Evidence: GOVUK date-input + patterns/dates (VERIFIED: 3 numeric fields for known dates (birthdays); calendar only when picking from options or day-of-week matters; never calendar-only; accept month names). NNg date-input (VERIFIED: allow typing; pickers for < ~1 year, ranges, < 10 valid options; avoid endless scrolling pickers; flexible formats; spell out months). HIG pickers (VERIFIED: compact/inline/wheels styles; modes date/time/date+time/countdown; time interval dividing 60). MDC DatePicker (VERIFIED: docked (type+calendar), modal (swipe months; ranges), modal input; descriptive title). M1 pickers (VERIFIED legacy: modal on mobile). MDN input date (VERIFIED: OS picker, value yyyy-mm-dd, display locale-specific, min/max, baseline widely available since 2021, always validate server-side).
- Agent rule: see comparison table "Date input patterns".

### F27 Chips (assist / filter / input / suggestion)
- Claim: Four roles; 32dp visual, 48dp target; filter chips for filtering lists; input chips for entities; suggestion chips for generated replies/queries.
- Evidence: MDC Chip (VERIFIED: assist/filter/input/suggestion; 32dp; 48dp touch; spacing 8dp; single-line scrolling group; single-selection groups). M3-tokens FilterChip (VERIFIED 32dp, icon 18dp). Baymard (VERIFIED: applied filters as removable pills (66% mobile sites don't); horizontal filter bars: only 6-8 filter types, buttons beyond that get overlooked). M3-droid segmented (VERIFIED: > 5 options use chips).
- Agent rule: Chip row (single scrolling line, first chip visible partly cut to signal scroll) for <= ~6 quick filters + trailing "Filters" chip opening full filter sheet; selected chips use checkmark + fill (not colour alone).

### F28 Search: bar vs icon, suggestions, scope, results
- Claim: Make search a visible field when it is a primary task; show recent searches before typing and 4-8 suggestions while typing; start searching as the user types; show scope; show an explicit submit.
- Evidence: HIG searching + search-fields (VERIFIED: placeholder states scope; recent/predictive suggestions; search as tab or bottom toolbar on iOS; scope bars/tokens; broader default scope; clear button; immediate results). MDC Search (VERIFIED: search bar 56dp (M3-tokens) expands to full-screen search view with history/suggestions/results; adjustNothing soft input mode; content description). Baymard autocomplete + mobile (VERIFIED: mobile 4-8 suggestions (desktop <= 10); 72% of mobile sites don't suggest category scopes; 33% don't keep query on results page; 90% of apps lack visible submit button, 27% of mobile sites; style scope text differently; highlight the predicted remainder; 28% skip misspelling tolerance). NNg search-visible-and-simple (VERIFIED, desktop-era: visible box beat link, +91% usage on one site).
- Agent rule: Search-centric product (marketplace, library) -> persistent field at top (or iOS search tab). Secondary feature -> icon in top bar opening full-screen search. Empty-focus state: recent searches (clearable) + popular. Show results count, filters, no-result recovery with suggestions. Voice: add mic icon where platform offers it (MEMORY; no source verified).

### F29 Filters and sort UI on mobile
- Claim: Chips for top filters + one "All filters" overlay that keeps results/count visible; applied filters visible and removable; sort via menu/sheet.
- Evidence: NNg mobile-faceted-search (VERIFIED: overlay tray keeping results partly visible; fixed result count; label "Filter"/"Refine" not cryptic icon). Baymard (VERIFIED: 5 essential filters price/rating/colour/size/brand; 4 sorts price/rating/best-selling/newest; OR logic within one filter type; applied-filters overview; horizontal toolbars hide options). Baymard back-button (VERIFIED: 27% don't make Back undo filters/sorts). HIG searching (VERIFIED: scope bars).
- Agent rule: Filter button + active-count badge; full-height sheet with "Show N results" primary button and "Clear all"; applied filters as removable chips above list; sort = single-select sheet/menu with current value shown; push history state per applied filter so Back steps through.

### F. Content patterns
### F30 Pagination vs infinite scroll vs load-more
- Claim: Load-more (with lazy loading) tested best for product/search lists; infinite scroll encourages shallow browsing, blocks the footer and breaks refinding; pagination is slow but fine for search-like tasks with landmarks.
- Evidence: NNg infinite-scrolling-tips (VERIFIED: infinite scroll suits goal-less browsing (social/news) but hurts refinding, back-button position, footers, performance, SEO, keyboard/AT; load-more restores footer and control; avoid infinite scroll when users need to find/compare specific items). Smashing/Baymard (VERIFIED: pagination -> least browsing; infinite -> most items (100+) but superficial after ~50-150 and footer unreachable; load-more best balance). Baymard number-of-items-loaded (VERIFIED: mobile 15-30 items initially + "Load more", load all at once rather than lazy-load on mobile; desktop 100-150 visual/50-100 spec-driven; search results lower 25-75; > 90% of load-more sites break Back position). Baymard return-same-place (VERIFIED: 13% of sites reset list on Back; use history.pushState). GOVUK pagination (VERIFIED: use for search results/perf; not for linear flows; avoid infinite scroll for keyboard users; mobile: current + neighbours + first/last; page number in title). 
- Conflict: Smashing/Baymard says infinite scroll harmful for search and mobile; NNg says OK for entertainment/social feeds.
- Agent rule: Feed (social/news/video) -> infinite scroll with restorable scroll position + visible end/footer access (e.g. footer in a tab/menu). Catalogue/search/results -> load-more button (15-30 per batch on mobile) + preserve state on Back. Finite admin tables, legal/GOV-style -> pagination. All: URL/state per batch.

### F31 Carousels
- Claim: Low engagement; no auto-advance on mobile; max ~5 slides; visible controls; never gate important content; peeking items are the best swipe signifier for browse lists.
- Evidence: NNg designing-effective-carousels (VERIFIED: animated ads looked at ~27% of the time; <= 5 frames; controls inside carousel, large; no auto-forward on mobile; 3 words/s reading pace if auto-forwarded). NNg auto-forwarding (VERIFIED: content visible only a fraction of time (one offer 20%); accessibility harm; show new panel only on user request). Baymard homepage-carousel (VERIFIED: 10 requirements; first slide matters most; duplicate content elsewhere; high-contrast controls; desktop 5-7 s (text-heavy up to 10 s), pause on hover; stop on interaction; mobile: no auto-rotate, support swipe, HTML text, fast load). Baymard mobile-ecommerce-search-and-navigation (VERIFIED: 30% mobile sites auto-rotate). Baymard mobile-app (VERIFIED: 53% of apps use horizontal scroll areas so tall they hijack vertical scroll). MDC Carousel (VERIFIED: multi-browse, uncontained (last item partially visible), hero, full-screen). HIG page-controls (VERIFIED: ~10 dots max; centred bottom; alternatives grid/list). WAI carousels (VERIFIED: pause, keyboard, announcements, focus). WCAG 2.5.1 (VERIFIED: add prev/next buttons next to swipe).
- Agent rule: Browse of many peer items (photos, products, categories) -> horizontal scroller with next item peeking (~10-20% visible), no dots needed. Hero promos -> static, or <= 3-5 manual slides with dots + prev/next buttons, no autoplay on mobile. > 10 pages -> grid. Fixed height <= ~40% viewport. Slide text as real text.

### F32 Accordions and progressive disclosure
- Claim: Accordions are among the most useful mobile patterns for long reference content but must not hide what everyone needs; max two disclosure levels; keep Back behaviour sane.
- Evidence: NNg mobile-accordions (VERIFIED: condenses content; issues: expanded section scrolled to top feels like new page so Back mis-navigates; very long sections; fix: treat Back as collapse, sticky header/persistent collapse control, don't auto-expand first section). NNg-snip accordions-on-desktop (SNIPPET: debatable on desktop; good for FAQ/independent sections). NNg progressive-disclosure (VERIFIED: 2 levels best; clear signifier for the second level). GOVUK accordion + details (VERIFIED: don't hide content most users need; don't nest; not for question series; users avoid "details" thinking it leaves the page). Baymard back-button (VERIFIED: accordion checkouts must map Back to previous step).
- Agent rule: Use for FAQs, specs, settings groups, filters. Header = full-width tap target (>= 44/48) with chevron and visible label; allow multiple open; first closed unless single section; keep header sticky when content is long; never hide validation errors inside collapsed sections (auto-expand).

### F33 Steppers / progress trackers / multi-step
- Claim: Use a progress indicator only for linear multi-step tasks; label steps; allow Back; save progress.
- Evidence: NNg wizards (VERIFIED: for novice/infrequent tasks; visible step list with current highlighted; explicit Back/Next with descriptive labels; independent steps; allow saving). M1 steppers (VERIFIED legacy: mobile -> vertical stepper or dots (few steps) or progress bar (many/conditional); mark optional steps; no nesting; don't split short forms). Carbon tabs (VERIFIED: sequential processes use progress indicator not tabs). GOVUK pagination (VERIFIED: linear workflows use Continue + back link). HIG progress-indicators (VERIFIED: determinate preferred; never swap circular<->bar; accurate pacing; Cancel when safe).
- Agent rule: <= 3 steps -> "Step 2 of 3" text + thin bar; 4-7 -> labeled stepper (vertical on phone); conditional/unknown length -> progress bar without step numbers. One question per screen when high-stakes (GOV.UK pattern).

### F34 Onboarding and permission priming
- Claim: Most users skip tutorials; tutorials don't improve task success; value-first, skippable, contextual hints; ask permissions in context with a rationale.
- Evidence: NNg mobile-tutorials (VERIFIED: 70 users, 4 iOS apps; task success 91% (saw tutorial) vs 94% (skipped); perceived difficulty 4.92 vs 5.49 on 7-pt; time 93.5 s vs 85.2 s; no benefit). NNg mobile-app-onboarding (VERIFIED: 3 components feature promotion/customisation/instructions; avoid onboarding when possible; deck-of-cards tutorials discouraged; contextual help; interactive walkthroughs). HIG onboarding (VERIFIED: fast, fun, optional; learn by doing; contextual tips (TipKit); don't re-show skipped tutorials; permissions in onboarding only if needed to function else just-in-time; defaults; no licensing screens). HIG launching (VERIFIED: launch screen mirrors first screen, no branding/text; restore state). HIG privacy (VERIFIED: ask when needed; pre-permission screen only if essential, one neutral button ("Continue"), no cancel/bypass, no mimicking alert; purpose strings specific). Android requesting (VERIFIED: ask in context; rationale UI; graceful degradation; two-denial rule; one-time permission (Android 11+)). HIG managing-accounts (VERIFIED: delay sign-in; passkeys; Sign in with Apple; autofill; in-app account deletion).
- Agent rule: 0-3 optional value screens max (each skippable, progress dots, "Skip" top-trailing) only if needed for personalisation/setup; else land in the product with defaults + contextual coach marks (dismissible, once, near target). Permission: trigger from user action, pre-explain in one screen/sheet only when intent unclear, then system prompt; on denial show inline fallback + "Open Settings" link, don't re-ask on launch.

### F35 Authentication screens (brief; see slice 06)
- Claim: Delay sign-in until value; support passkeys/autofill; clear labels.
- Evidence: HIG managing-accounts + web.dev sign-in (both VERIFIED above).
- Agent rule: Email field type=email + autocomplete=username; password with show/hide toggle; single primary button; social/passkey options above or below consistently; forgot-password link adjacent.

### F36 Pull-to-refresh
- Claim: Supplement auto-sync; never the only way; avoid in drawers/maps; show last-updated context.
- Evidence: M1 swipe-to-refresh (VERIFIED legacy: lists/grids/cards with frequently updated content; auto-sync preferred; threshold + cancel; avoid in drawers/home widgets/pannable content). HIG progress-indicators (VERIFIED: refresh control hidden until pulled; optional "last updated" text). M3-droid pull-to-refresh (VERIFIED: PullToRefreshBox wraps a scrollable only). WCAG 2.5.7 (VERIFIED: browser-provided drag-to-refresh is exempt; custom drag needs alternative). MDN overscroll-behavior (VERIFIED: `none` disables native pull-to-refresh/glow).
- Agent rule: Add "Refresh" in overflow/toolbar for accessibility on feeds; show last-updated; on web PWAs with custom PTR set `overscroll-behavior-y: contain/none`.

### F37 Image galleries and zoom
- Claim: Gallery overlays must close on Back, support pinch/double-tap zoom and button alternatives, show position.
- Evidence: Baymard mobile-app-ux (VERIFIED: 80% of apps lack pinch-to-zoom). Baymard back-button (VERIFIED: 37% overlays don't close on Back). Baymard mobile-ux (VERIFIED: 57% limit review-image navigation to single review). HIG gestures (VERIFIED: pinch/double-tap standard zoom). WCAG 2.5.1 (VERIFIED: pinch needs +/- or double-tap/button alternative). MDC Carousel (VERIFIED: full-screen layout for portrait images). HIG page-controls (VERIFIED: <= ~10 dots).
- Agent rule: Tap image -> full-screen viewer with visible close (X), pinch + double-tap zoom, swipe between images, counter "3/12" (not dots when > 10), Back closes viewer, preserve list position.

### F38 Avatars
- Claim: Circle = person, square = entity; fall back to initials/default; hide decorative avatars from AT.
- Evidence: Atlassian avatar + examples (VERIFIED: circle person / square entity / hexagon agent; named sizes xxsmall 16px ... xxlarge; presence indicator; name prop for AT; decorative avatars hidden; default image fallback; initials rule not documented). M3-tokens List (VERIFIED: list leading avatar 40dp; SearchBar avatar 30dp). M3-snip lists (SNIPPET: "avatar label text" anatomy = initials in avatar container).
- Scope/gap: size scale beyond list/search is MEMORY (Atlassian xsmall 16 / small 24 / medium 32 / large 40 / xlarge 96 / xxlarge 128 px).
- Agent rule: list avatar 40dp; compact 24-32; profile header 64-96; fallback = 1-2 initials on deterministic tonal colour with >= 4.5:1 text contrast; image alt = name (or empty if name adjacent).

### F39 Data visualisation basics for mobile
- Claim: Chart only when comparison/trend/outlier insight is needed (otherwise show the number); prefer position/length encodings (bar/line); label directly; essential info must not depend on touch/hover; provide text + data table equivalents.
- Evidence: HIG charts (VERIFIED: bars compare categories, lines show change over time, points show outliers/relations; bar baseline zero; titles/subtitles summarise message; accessibility labels + audio graphs; don't require interaction to reveal critical data; enlarge hit targets, allow scrubbing; not colour-only (add shape/pattern); maximise plot width on compact; short axis labels). NNg dashboards-preattentive (VERIFIED: length & 2-D position decode best; skip pie/donut/treemap for quick-reference; no 3D; colour as reinforcement, ~8% of men colour-blind). Carbon (VERIFIED: direct labels over legends; data-table alternative; slices < 1 degree unreachable; 14-colour categorical sequence; sequential/diverging palettes; dashboards: strip distractions; Carbon gives no mobile-specific rules). WCAG 1.4.11 (VERIFIED: chart lines/segments need 3:1 vs adjacent colours). W3C complex images (VERIFIED: short alt + long description/data table). Chartability (T3 VERIFIED: 50 heuristics incl. contrast, no colour-only, touch targets, data tables, zoom/reflow).
- Gap: no authoritative mobile-specific chart sizing/label-count thresholds found; thresholds below are HEURISTIC.
- Agent rule: 1 number -> KPI tile (+ delta + sparkline). Trend -> line (<= 4 series) / bar for discrete periods (<= ~12 on 360dp wide, else scroll or aggregate). Category comparison -> horizontal bar sorted. Part-to-whole -> stacked bar or <= 4-slice donut with direct labels. Tap = tooltip pinned (not hover) above finger, large scrub target, values also in list below; legend only if > 1 series, direct-label last point; chart must expose summary text ("Steps rose 12% this week") and a "View data" table.

### F40 Tables / empty states / skeleton (brief; see slices 09 and 07)
- Tables: HIG lists-and-tables (VERIFIED: prefer text, middle truncation, collections for images). On phones convert rows to list items/cards with 2-3 key fields; allow horizontal scroll only with sticky first column (HEURISTIC; slice 09).
- Empty: Carbon empty-states (VERIFIED: 3 types no-data/user-action/error; replace the element it stands in; minimal contextual text; positive tone; CTA button or link).
- Agent rule: Empty state = illustration optional + one-line title + one-line help + one primary CTA that fixes it.

### G. Visual-noise, cards, shadows, gradients, rounded corners, unclear icons
### F41 What evidence exists on decoration and visual weight
- Claim: Evidence supports *clear signifiers and low clutter*, not any specific radius/shadow/gradient rule. "Too many rounded cards/shadows/gradients" is mostly opinion; but measurable harms exist for weak affordances, text on busy backgrounds and glass/translucency.
- Evidence: NNg flat-ui study (VERIFIED: 71 participants, 9 page pairs; weak-signifier pages took +22% time and +25% fixations; flat works with low density, predictable layouts, high-contrast spaced targets). NNg liquid-glass (VERIFIED critique: low contrast text on images, floating translucent controls, cramped tab bar, controls that move). HIG materials (VERIFIED: Liquid Glass belongs to controls/navigation layer, not content layer; use sparingly; clear variant needs ~35% dimming over bright media). HIG toolbars (VERIFIED: reduce custom backgrounds/tints). NNg heuristic 8 (VERIFIED: irrelevant/rarely needed information competes with relevant). NNg aesthetic-usability (VERIFIED: attractive designs are judged more usable, which can mask real problems; observe behaviour). M3-snip cards (SNIPPET: don't force content into cards when spacing/headings suffice). NNg cards (VERIFIED: don't replace lists just to modernise). Baymard mobile-app (VERIFIED: 21% of apps use illegible text over images; 76% avoid overly prominent ads). M3E-research (VERIFIED vendor claim: 46 studies, 18,000+ participants; key elements spotted up to 4x faster with expressive colour/shape/size/containment; the 87% preference figure is for ages 18-24; not independently reviewed - treat as T1 *claim*, scope trend).
- Scope: card/shadow/gradient/radius rules = opinion; contrast/legibility/signifier rules = evidence.
- Agent rule: One container level max (card inside card forbidden); max 2 elevation levels on a screen; no text directly on photos/gradients without scrim or 4.5:1 check at worst pixel; borders or fill (not only shadow) for tappable surfaces if layout is flat; prefer spacing + dividers when items are homogeneous; radius consistent per component class (token), never a rule of thumb about "bigger = friendlier".

### H. Cross-cutting accessibility rules for overlays and gestures
- WCAG 2.5.7 + 2.5.1 (VERIFIED): every drag/swipe/pinch needs a tap alternative. WCAG 2.5.8 (VERIFIED): >= 24 CSS px target (44 AAA). WCAG 4.1.3 (VERIFIED): status role. WCAG 2.2.1 (VERIFIED): auto-dismiss rule. WCAG 1.4.11 (VERIFIED): 3:1 UI/graphics. APG (VERIFIED): dialogs trap focus, Esc closes, restore focus; destructive -> focus safest button. MDC (VERIFIED): TalkBack disables hide-on-scroll bars; drag handle exposes resize actions. MDC predictive back (VERIFIED): bottom sheets, side sheets, search support predictive back (MDC >= 1.10); avoid touch targets under system gesture insets.

## Numbers table (value | applies to | source | tag)
| Value | Applies to | Source | Tag |
|---|---|---|---|
| 44x44 pt min hit region | iOS buttons | HIG buttons | VERIFIED |
| 48 dp touch target (visual may be smaller: chip 32dp, handle) | Android | MDC Chip/Slider/BottomSheet | VERIFIED |
| 24x24 CSS px min target (spacing exception); 44px = AAA | Web | WCAG 2.5.8 / 2.5.5 | VERIFIED |
| 44 px radio/checkbox target | Web (GOV.UK) | GOVUK radios | VERIFIED |
| Button height XS 32 / S 40 / M 56 / L 96 / XL 136 dp | M3 Expressive | M3-tokens | VERIFIED |
| Button padding S 16dp, M 24dp, L 48dp, XL 64dp; icon-label gap 8/8/12/16dp | M3 Expressive | M3-tokens | VERIFIED |
| Legacy button 36dp tall, 88dp min width, 48dp target | M1 (deprecated) | M1 buttons | VERIFIED legacy |
| FAB 56dp (standard/extended), medium 80dp, large 96dp; icons 24/28/32dp; mini 40dp (legacy); 16dp margin | Android | M3-tokens; M1 FAB | VERIFIED |
| Speed dial/FAB menu 3-6 items | Android | M1 FAB (legacy) | VERIFIED legacy |
| Nav bar container 64dp (tall 80dp); indicator 56x32dp; 3-5 destinations | Android | M3-tokens; MDC BottomNavigation | VERIFIED |
| Tab bar <= 5 default tabs; avoid More; single-word labels | iOS | HIG tab-bars | VERIFIED |
| Segmented control <= 5 (iPhone), 2-5 (M3) | iOS/Android | HIG; M3-droid | VERIFIED |
| Tabs height 48dp (text) / 72dp (icon+text), indicator 2dp | Android | MDC Tabs | VERIFIED |
| Top app bar small 64dp (flexible tokens) vs ~56dp classic | Android | M3-tokens; MDC TopAppBar | VERIFIED (disagree) |
| Bottom app bar 80dp, <= 4 actions incl. FAB | Android | MDC BottomAppBar; M3-tokens | VERIFIED |
| Search bar 56dp; avatar in bar 30dp | Android | M3-tokens SearchBar | VERIFIED |
| List one/two/three-line 56/72/88 dp; leading avatar 40dp, icon 24dp, image 56dp; padding 16dp, gap 12dp | Android | M3-tokens List | VERIFIED |
| Legacy list 48/72/88dp (dense 40/60/76) | M1 | M1 lists | VERIFIED legacy |
| Toolbar <= 3 logical groups; 1 prominent action | iOS | HIG toolbars | VERIFIED |
| Menu ~5-6 items; submenu 1 level <= 5; pull-down >= 3 items; context menu ~3 groups | iOS | HIG menus/pull-down/context-menus | VERIFIED |
| Menu rows 48dp; width 112-280dp; dropdown elevation 3dp | M1 / MDC | M1 menus; MDC Menu | VERIFIED |
| Alerts <= 3 buttons (Fluent/Spectrum/Carbon also 3); M1 <= 2 | all | HIG; Fluent; Spectrum; M1 | VERIFIED |
| Dialog padding 24dp; title-body gap 20dp; min button 64dp | M1 | M1 dialogs | VERIFIED legacy |
| Bottom sheet max width 640dp; handle target >= 48dp; 1dp elevation; handle visual 32x4 | Android | MDC BottomSheet; M3-snip | VERIFIED / SNIPPET |
| Sheet detents medium (~half) + large | iOS | HIG sheets; UIKit-sheet | VERIFIED |
| Nav drawer max 280dp, radius 16dp | Android | MDC NavigationDrawer | VERIFIED |
| Snackbar 48dp (1 line) / 68dp (2 lines) | Android Compose | M3-tokens Snackbar | VERIFIED |
| Snackbar 48dp / 80dp (mobile), 1 action | M1 | M1 snackbars | VERIFIED legacy |
| Toast durations: Carbon ~5s, Fluent 7s, Spectrum min 5s (actionable never auto-dismiss) | Web/cross | Carbon; Fluent; Spectrum | VERIFIED |
| Toast stack <= 4, 16px gap, CTA text <= 36 chars, 1 CTA | Fluent | Fluent toast | VERIFIED |
| Flag <= 2 links | Atlassian | Atlassian flag | VERIFIED |
| WCAG 2.2.1: 20 s to extend, >= 10 extensions; alt access exemption for toasts | Web | WCAG 2.2.1 | VERIFIED |
| Chip 32dp tall, 48dp target, 8dp gap, icon 18dp | Android | MDC Chip; M3-tokens | VERIFIED |
| Switch track 52x32dp, handle 24/16/28dp; checkbox 18dp, state layer 40dp | Android | M3-tokens | VERIFIED |
| Badge dot 6dp, count 16dp | Android | M3-tokens Badge | VERIFIED |
| Badge cap 999+ (Material) vs 99+ (convention) | - | M3-droid (custom); MEMORY | MEMORY |
| Dropdown sweet spot 5-10; < 5 radio; 15+ combobox; USWDS radio < 7; Carbon < 3; M3 ~6 | forms | NNg dropdown-list; NNg-snip | VERIFIED / SNIPPET |
| Page-control dots <= ~10 | iOS | HIG page-controls | VERIFIED |
| Carousel <= 5 frames; no auto-forward on mobile; 5-7s desktop (10s text) | web/mobile | NNg; Baymard | VERIFIED |
| Animated carousel content looked at ~27% | web | NNg carousels | VERIFIED |
| Mobile product list: 15-30 initial + Load more; search 25-75 (desktop); desktop 100-150 visual / 50-100 spec | e-com | Baymard number-of-items | VERIFIED |
| Autocomplete mobile 4-8 suggestions; desktop <= 10 | search | Baymard autocomplete-design | VERIFIED |
| Horizontal filter toolbar workable only for ~6-8 filter types | e-com | Baymard | VERIFIED |
| Slider live update 250-500ms | web | Baymard slider-interfaces | VERIFIED |
| Hidden vs visible nav usage on mobile 57% vs 86% (combo); desktop 27% vs 48-50% | nav | NNg hamburger-menus | VERIFIED |
| Tutorial vs skip: success 91% vs 94%; difficulty 4.92 vs 5.49 (7-pt); 93.5 s vs 85.2 s; n=70 | onboarding | NNg mobile-tutorials | VERIFIED |
| Flat/weak signifiers: +22% time, +25% fixations (n=71) | visual | NNg flat-ui | VERIFIED |
| 13% sites reset list on Back; >90% of Load-more sites break position; 37% overlays ignore Back; 27% filters/sort ignore Back | e-com | Baymard | VERIFIED |
| Android permission: second denial = no more prompts | Android | M3-droid requesting | VERIFIED |
| Date picker useful when < ~1 year range or < 10 valid options | dates | NNg date-input | VERIFIED |
| Time picker minute step divides 60 (e.g. 15) | iOS | HIG pickers | VERIFIED |
| 14 categorical chart colours; 3:1 contrast for chart graphics | data-viz | Carbon palettes; WCAG 1.4.11 | VERIFIED |
| Iconography time test: > 5 s to pick icon => icon likely unclear | icons | NNg icon-usability | VERIFIED |
| iOS control sizes (nav bar 44pt, tab bar 49pt, switch 51x31pt) | iOS | - | MEMORY |

## Comparison tables
### T1 Overlay/container: modal dialog vs bottom sheet vs full page vs inline expansion vs popover/menu
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Modal dialog / alert | Forces decision; clear focus trap (APG) | Interrupts, blocks context, overuse trains click-through (NNg) | Irreversible/critical confirm, required info, errors needing choice | Info-only, routine undoable actions, multi-step, long forms |
| Modal bottom sheet | Thumb reach, keeps context peeking, quick pick | Hidden dismissal, drag-only fails a11y, stacks badly (NNg) | Short pick lists, share/actions, filters, compact detail | Page-to-page flows, long content, primary nav, > ~3 inputs |
| Non-modal/standard sheet (detents) | Reference background while interacting (HIG) | Gesture conflicts with scroll; competes with map/content | Maps, media players, secondary panels | Content that must be read in full; small screens with keyboard |
| Full-screen modal | Focus for multi-step/complex task; own Cancel/Save (HIG, MDC) | "App within an app" if nested (HIG); loses context | Create/edit flows, media viewer, composition | Simple choices; drill-down navigation (use push) |
| Pushed page | Back stack, deep links, shareable state | Heavier transition | Hierarchical detail, anything with URL/identity | Quick yes/no, transient pick |
| Inline expansion (accordion/details) | Keeps context, no overlay | Hides content, disorients if scrolled (NNg) | Secondary/optional detail, FAQs | Content everyone needs (GOV.UK) |
| Popover / menu | Light, anchored, quick dismissal | Not on phone width (HIG: sheet instead); touch dismiss accidental | Command lists (<= 6), small anchored info on tablet | Warnings/critical info (HIG), long forms |

### T2 Feedback: snackbar vs toast vs banner vs dialog vs inline message
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Snackbar / toast | Non-blocking, Undo | Auto-dismiss may be missed (WCAG 2.2.1); one at a time | Result of own action; Undo/Retry; short status | Only copy of important info; > 1 action (use dialog); errors needing fix |
| Banner (page-level) | Persistent, prominent | Pushes content; missed often (GOV.UK); fatigue | System-wide/persistent condition (offline, payment, data loss) | Transient confirmations; validation errors |
| Dialog | Guarantees attention | Blocks | Irreversible decision | Non-actionable updates (Fluent: use toast) |
| Inline message | Adjacent to cause, persistent, accessible | Takes layout space | Field/section errors, warnings, form-level status | Cross-page events |
| Field error + summary | Recovery path, a11y | Needs focus mgmt | Form validation | Success notices |
(Android "Toast" system API is non-actionable and not swipeable per M1 - avoid for anything user must read.)

### T3 Tabs vs segmented control vs chips vs bottom navigation
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Bottom nav / tab bar | Always visible, thumb reach, top-level | 3-5 only; keeps space | App-level destinations | > 5 destinations, single-task screens, in-page filtering |
| Tabs (top, in-page) | Peer content sections, swipeable | Hidden tabs when scrolled; confusion with nav | 2-6 sibling views of one parent | Sequential steps, comparison, filtering same list (Carbon) |
| Segmented control | Compact, selection obvious, equal widths | <= 5; short labels | Switch view/mode of same data (Day/Week/Month) | Top-level navigation; long labels; > 5 |
| Chips | Many options, multi-select, scrollable | Small targets (32dp visual), low discoverability | Filters, input entities, suggestions | Primary navigation; 2-3 mutually exclusive modes |

### T4 Cards vs list rows vs table rows
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Card | Heterogeneous content, media, grouped actions (NNg) | Space-hungry, hard to compare | Feeds, dashboards, recommendations | Homogeneous scan/compare lists; card-in-card |
| List row | Fast scan, dense, consistent positions | Less media emphasis | Settings, messages, orders, contacts | Rich media browsing |
| Grid tile | Image-first (HIG collections; M1) | Text poor | Photos, products | Text-heavy items |
| Table row | Multi-attribute comparison, sorting | Poor on 360dp (slice 09) | Data-dense admin (tablet/desktop) | Phones unless condensed to 2-3 fields |

### T5 Pagination vs infinite scroll vs load more
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Pagination | Landmarks, footer reachable, SEO, easy refinding | Slow; users browse less (Baymard); small mobile targets | Search results, finite records, keyboard/AT-heavy | Casual browsing on mobile |
| Infinite scroll | Frictionless; best for feeds | Footer unreachable, lost position on Back, shallow browsing, a11y/perf (NNg, Baymard) | Social/news/video feeds | Finding/comparing items, search, need footer |
| Load more (+lazy-load) | User control; footer reachable; deeper focused browsing | Extra tap | Catalogues, search results, mobile lists (15-30/batch) | Endless feeds where tap kills flow |

### T6 Select vs radio vs segmented vs combobox vs picker
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Radio list | All options visible, lowest load (NNg) | Vertical space | 2-4 (<= ~6) mutually exclusive | > 7 options (HEURISTIC) |
| Segmented | Compact, one tap | <= 5, short labels | View/filter mode, 2-5 options | Long labels, > 5, nav |
| Select/dropdown/menu | Compact | Hidden default; mobile friction; GOV.UK last resort | 5-10 secondary options | Primary decisions, < 5 options |
| Native picker (wheel/sheet) | Platform familiar, mobile-optimised | Hidden list; slow for long lists | 5-15 predictable values, time | > ~25 unsorted options |
| Combobox/autocomplete | Scales to 100s; typing | Needs keyboard; async | > ~15 or dynamic data (countries, addresses) | Few options |

### T7 Switch vs checkbox
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| Switch | Immediate apply, strong on/off metaphor | Needs list-row context (HIG); ambiguity of state if label changes | Settings with instant effect | Forms requiring Submit; > 2 states; confirmation needed |
| Checkbox | Deferred submit, multi-select, hierarchy, mixed state | Smaller visual | Forms, consent, bulk select | Instant settings |
| Radio pair | Explicit labels for both states | Space | Binary choice with named options ("Pickup/Delivery") | On/off of one feature |

### T8 FAB vs bottom primary button vs top-bar action vs sticky CTA
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| FAB / extended FAB | High salience, thumb reach, Android convention | Covers content; no iOS convention; no empirical study | Create action on list/feed (Android) | Forms/checkout; multiple equal actions (use menu); with sticky CTA |
| Bottom full-width primary button | Completes flow, big target (GOV.UK full width on mobile) | Takes vertical space; conflicts with keyboard | Form/checkout/sheet confirmation | Browse screens |
| Top-bar action (trailing) | Platform-standard on iOS (HIG prominent Done) | Reach (top) | Done/Save in modals; 1-2 actions | Frequent one-handed primary action |
| Sticky CTA bar | Always reachable on long pages | Obscures content; competes with bottom nav | Product page "Add to cart", long forms | Short screens; when bottom nav present without careful stacking (HEURISTIC) |

### T9 Date input patterns
| Pattern | Strength | Weakness | Best use | Avoid when |
|---|---|---|---|---|
| 3 numeric fields (D/M/Y) | Fast for known dates, accessible (GOV.UK) | No weekday context | Birthdays, document dates | Choosing from availability |
| Single text field + format hint/mask | Fast typing, flexible (NNg) | Format ambiguity | Distant/known dates; power users | Global audiences without month names |
| Calendar picker (modal/inline) | Weekday/availability context; ranges | Slow for far dates; needs typing alt | Bookings, near-term (< ~1 yr), ranges | Birthdates/far past |
| Docked picker with typing (M3) | Both modes | Tablet/desktop oriented | Wider screens | Narrow phone (use modal) |
| Wheel/spinner | Familiar iOS, time entry | Endless scroll for dates | Time, short ranges | Far-away dates |
| Native `<input type=date>` | OS UI, validation, min/max | Display varies by locale/browser; styling limits | PWA default for simple cases | Needs consistent UX or strict formats |
| Relative/segmented (Today/Tomorrow) | One tap | Limited | Delivery/ scheduling shortcuts | Arbitrary dates |

## Component selection decision tree (agent ruleset)
Tags: [S] sourced (see finding), [H] heuristic/opinion derived from sources, labelled.
D1 Containers
- IF user must acknowledge/decide before continuing AND consequence is serious/irreversible THEN alert/dialog (<= 3 buttons, verb labels, cancel) [S F15, F3].
- IF result is reversible THEN act + snackbar with Undo (no dialog) [S F3, F19].
- IF choosing 1 of 2-6 actions after an intentional tap THEN iOS action sheet / Android bottom-sheet list or menu [S F16, F14].
- IF task is quick, contextual, <= ~3 inputs OR a pick list <= ~7 rows THEN bottom sheet (visible close, Back dismisses) [S F17; thresholds H].
- IF task is multi-step OR > ~5 inputs OR needs own URL/Back stack/long reading THEN full-screen modal (create/edit, Cancel/Save) or pushed page (navigation) [S F18; thresholds H].
- IF extra info is optional detail of the same item THEN inline expansion; IF everyone needs it THEN show it [S F32].
- IF anchored small choices on tablet/web THEN popover; on phone width convert to sheet [S HIG popovers, Spectrum].
D2 Navigation
- IF 3-5 top-level destinations THEN bottom nav/tab bar (icon+label) [S F7]. IF 2 THEN segmented/top tabs. IF > 5 THEN 4 + More or restructure [S/H].
- IF switching view of same data, 2-5 options THEN segmented; IF peer content sections THEN tabs; IF > 5 or multi-select THEN chips [S F8].
- IF > 2-3 visible toolbar actions THEN overflow; primary action never hidden [S F9].
- IF hidden nav (drawer) THEN pair with visible entries and label "Menu" [S F10].
D3 Choose-one-of-N (thresholds; sources conflict, defaults chosen)
- 2 options, binary state with immediate effect -> switch; labelled alternatives -> radio pair or segmented [S F24].
- 2-4 options -> radio list (visible) [S NNg <5, Carbon]; may use segmented if it switches a view and labels short.
- 5-10 -> native picker/menu/dropdown [S NNg 5-10]; 11-15 -> picker with sections or searchable sheet [H]; > 15 or dynamic -> combobox with search [S NNg ~15+].
- Known value (age, year, quantity) -> text input with right keyboard, not picker [S NNg dropdown-list].
- Multi-select <= ~7 -> checkbox list; more -> searchable multi-select sheet / chips [H].
- Numeric range imprecise -> slider + value; precise/wide -> numeric field (+ stepper for small range) [S F25].
D4 Date/time
- Known memorable date -> 3 fields; far past/future -> typing; near-term/availability/range -> calendar (modal on phone) with typing fallback; time -> wheel/clock + typing; relative -> chips [S F26].
D5 Feedback
- Field problem -> inline error + summary; persistent system condition -> banner; transient own-action result -> snackbar 4-7s (>= 6s with action; actionable persists) [S F19; durations vary].
- Never rely on toast alone for critical content; add status role [S WCAG].
D6 Lists/content
- Homogeneous scan/compare -> list rows; heterogeneous/media browse -> cards; image-first -> grid; data-dense -> condensed rows (not table) [S F11, F12, T4].
- Long ordered content from a feed -> infinite scroll w/ Back restore; catalogue/search -> load-more; finite records/keyboard-heavy -> pagination [S F30].
- > 5 horizontally browsable peers -> scroller with peek; promos -> static or manual <= 5; no mobile autoplay [S F31].
- Reference content long -> accordion; linear process -> stepper/progress (not tabs) [S F32, F33].
D7 Buttons/actions
- One primary per view; style hierarchy; destructive red but never default; icon-only only for standard icons + accessible name; others labelled [S F1, F3, F5].
- Android create-action on list -> extended FAB; iOS -> trailing toolbar; flow completion -> bottom full-width button [S/H F6].
D8 Gestures
- Each swipe/drag/pinch needs tap alternative; swipe actions <= 2 and mirrored in menu; long-press never sole path [S F13, WCAG 2.5.1/2.5.7].
D9 Onboarding/permissions
- Prefer no onboarding; 0-3 skippable screens; permission in context with brief rationale; no pre-prompt "Cancel" bypass on iOS pre-permission screen [S F34].
D10 Data
- 1 number -> KPI; trend -> line; category -> bar; avoid pie/donut for quick reference; label directly; text summary + data table [S F39; counts H].

## Anti-patterns found (problem -> why -> better -> source)
| Problem | Why it happens | Better alternative | Source |
|---|---|---|---|
| Bottom sheet for multi-step flow / long form / page navigation | Sheets look "native"; easy to ship | Full-screen modal or pushed page | NNg bottom-sheet; HIG sheets/modality |
| Sheet closable only by drag handle/swipe | Gesture-first design | Visible X/Done + Back + handle accessory | NNg; WCAG 2.5.7; MDC |
| Stacked/nested sheets and dialogs | Flow added incrementally | One overlay at a time; push a page | HIG modality; Atlassian modal |
| Confirmation dialog for every delete ("Are you sure?" Yes/No) | Safety reflex | Undo snackbar; specific destructive dialog only for irreversible | NNg confirmation-dialog; HIG alerts |
| Alert with "OK" as the only meaningful action; at app launch | Debug-message mindset | Inline message; verb buttons; never at launch | HIG alerts |
| Auto-dismissing toast as only error notice | Looks clean | Inline error / persistent banner; status role | WCAG 2.2.1, 4.1.3; Atlassian flag |
| Toasts with 2+ actions or "Dismiss" button | Overloading transient UI | Dialog for 2+ actions; swipe/timeout dismiss | M1 snackbars |
| Disabled primary button with no explanation | "Prevent errors" | Enabled + specific validation messages | GOV.UK button; Atlassian button |
| Tab bar with > 5 items / More overflow / hidden tabs | IA not pruned | 4 + More screen; restructure | HIG tab-bars; NNg; MDC |
| Icon-only nav or ambiguous icons | Minimal aesthetics | Icon+label; test recognisability | NNg icon-usability |
| Hover tooltips as only explanation | Desktop port | Visible helper text / tap popover | NNg tooltip; Atlassian; Carbon |
| Cards everywhere (card-in-card, homogeneous lists as cards) | Trend / template habit | Lists, section headers, spacing | NNg cards; M3-snip; M1 cards |
| Nested interactive elements in card; whole-card link containing buttons | Pointer-area hacks | Link on heading + raised secondary controls | Inclusive Components |
| Swipe-only actions | Looks tidy | Mirror in menu/detail; <= 2 actions | NNg contextual-swipe; HIG gestures |
| Auto-rotating carousels on mobile | Stakeholder promos | Static sections / manual carousel | NNg; Baymard; WAI |
| Infinite scroll for search/catalog; footer unreachable | Engagement metrics | Load-more + pushState | NNg; Baymard |
| Losing scroll/filters on Back (overlays, accordions, lists) | SPA state | History entries per state | Baymard back-button; NNg accordions |
| Long dropdown for few options; select for 2 options | Library default | Radios; segmented | NNg dropdown-list; Carbon |
| Slider alone for precise values | Looks modern | Add text field/stepper; tap-to-set | Baymard sliders; HIG; WCAG 2.5.7 |
| Date picker only (no typing) for DOB | Pattern reuse | Three numeric fields | GOV.UK; NNg date-input |
| Tutorial deck of 5 swipe screens; permissions at launch | Marketing/PM desire | Contextual hints; JIT permission | NNg mobile-tutorials; HIG onboarding/privacy |
| Pre-permission screen with Cancel/mimicked alert | Increase opt-in | One neutral "Continue" button | HIG privacy |
| Text over images/glass without scrim | Aesthetic trend | Scrim + contrast check; Liquid Glass only on control layer | NNg liquid-glass; HIG materials; Baymard (21% apps) |
| Pie/donut with many slices; color-only encodings | Defaults | Sorted bar; direct labels; patterns | NNg dashboards; HIG charts; Carbon |
| Charts needing hover/tap to see key numbers | Desktop port | Show values by default | HIG charts |
| FAB with sticky bottom CTA / FAB on forms | Material copy-paste | Single primary action pattern | M1 FAB (legacy); [H] |

## Disagreements & weak-evidence zones
- Preselect radios: NNg yes; GOV.UK + Carbon no. Context: preselect only for safe defaults/settings.
- Disabled submit: HIG entering-data says gate Next; GOV.UK/Atlassian say avoid. Context: low-literacy public services vs consumer wizards.
- Option thresholds (radio vs dropdown): Carbon <3, USWDS <7, M3 ~6, NNg <5 / 5-10 / 15+. No empirical optimum; my defaults (<=4 radio, 5-10 picker, >15 searchable) are a synthesis.
- Dialog button cap: HIG/Fluent/Spectrum/Carbon 3; M1 2. Dialog order folk claims (iOS vs Android reversed) not supported by HIG/M1 text; Windows is the real outlier (MEMORY).
- Toast duration: 5s (Carbon/Spectrum min) vs 7s (Fluent); WCAG says duration is fine if info available elsewhere.
- Nav bar height 64dp vs 80dp; top app bar 56dp vs 64dp: classic vs Expressive tokens; pick by M3 version.
- Accordions: NNg desktop "debatable", mobile "very useful"; GOV.UK avoids when universally needed.
- NNg "Tabs, Used Right" says bottom/side in-page tabs are overlooked; this does not apply to OS tab bars (HIG/M3 mandate bottom).
- Carousels: NNg/Baymard favour static; M3 promotes carousels for browse (peeking) - different use case; auto-forward is the evidence-backed problem, not swipeable lists.
- FAB: no controlled evidence found either way; M3 itself changed (small FAB dropped; menu). Treat as convention.
- Infinite scroll: NNg context-dependent vs Baymard "harmful for search/mobile".
- M3 Expressive: vendor research (46 studies/18k) not independently reviewed; "more expressive shapes = faster to find" claim is scope trend/vendor.
- Rounded corners/shadows/gradients: no neutral evidence; treat as opinion unless contrast/signifier harm shown.
- Swipe-action guidance from NNg relied on summariser text; the "limit swipe to destructive" nuance may be imprecise.

## Gaps (unfinished / unverified)
- m3.material.io guideline pages unreachable (only snippets; M3 guidance for lists dividers, FAB menu, bottom sheet handle size are SNIPPET). Not fetched: M3 chips/menus/tooltip/search prose; Expressive spec pages.
- Polaris (moved to shopify.dev; only Banner verified), Spectrum design pages, Lightning (blueprint only), Fluent iOS/Android pages: not obtained; Spectrum evidence is from React Spectrum docs.
- HIG navigation-bars, badging, refresh-content-controls pages 404; iOS control dimensions (nav bar 44pt, tab bar 49pt, switch 51x31) are MEMORY and iOS 26 Liquid Glass may change tab/toolbar metrics.
- No authoritative source verified for: bottom-sheet + keyboard interplay, sticky CTA vs FAB evidence, selection mode on iOS, sticky section headers, voice search, avatar initials rules, mobile chart label/series counts, image-gallery zoom UX beyond Baymard stats, "99+" badge convention.
- Baymard data is e-commerce-specific (transfer to other apps is an assumption); Baymard full articles are partly paywalled.
- Auth/empty/skeleton/table only briefly covered (see slices 06/07/09).
- WebSearch budget exhausted early; no broader T3 case-study sweep (Airbnb, Spotify, Google Maps, etc.), no Flutter/RN/SwiftUI API verification (API names flagged MEMORY).
