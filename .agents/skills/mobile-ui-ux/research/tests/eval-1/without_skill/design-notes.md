# Northfield Academy: Home screen design notes

Deliverable: `home.html` (227 lines, 26.7 KB raw, about 9.6 KB gzipped). It is vanilla HTML, CSS and JS with no
dependencies. Preview it with `?role=parent|teacher&state=ready|loading|empty|error|offline|partial`, or use the
"Preview controls" disclosure at the bottom of the page.

## 1. Goal and primary action
The home screen answers one question: **what needs me right now?** It is not a data warehouse.
- **Teacher.** Primary action is **Take attendance** for the next class. It is the most frequent, time-boxed task of
  the day, and the roster must open in one tap.
- **Parent.** Primary action is **resolve the most urgent thing about my child**. Rule used for the hero slot:
  unexplained absence today (**Report a reason**) beats fees due within 14 days (**Pay $420.00**), which beats a plain
  "Aiden is present" confirmation with no button. Reassurance is the default; action appears only when needed.
- Exactly one filled, high-contrast hero per role. Everything below it is scannable context, not competing CTAs.

## 2. Information architecture
- Bottom tab bar, 5 items, always labelled: Home, Attendance, Grades, then **Fees** (parent) or **Messages**
  (teacher), then More. Teachers do not manage fees, so the tab is not shown to them. At 768px or wider the bar
  becomes a left rail with the same items and order.
- Home order (parent): child switcher, hero, Attendance (30-day rate plus last 5 school days), Recent grades,
  Fees, Announcements.
- Home order (teacher): hero (next class), Today schedule, Grades to enter, Needs follow-up (3+ days absent),
  Announcements.
- Parents with several children get a persistent chip switcher above the cards. All cards re-scope to the selected
  child, so there are no per-card dropdowns.
- Header: greeting, date, "Updated 8:12 AM" freshness, a refresh button and a notifications button (unread count
  in the label). Account and settings live under More to keep the header light.

## 3. Component choices
| Need | Component | Why |
|---|---|---|
| Child switch | Native radio inputs styled as chips | Free arrow-key and screen-reader semantics; selected chip also shows a check, so it is not colour-only |
| Hero | Single solid card, one white button | Strongest visual weight; the button sits full-width in the thumb zone on phones |
| Attendance status | Icon plus text label plus colour (check, clock, x, minus) | Colour-blind safe; four statuses: Present, Late, Absent, Excused |
| 5-day history | Ordered list of day, icon, label | Pattern recognition at a glance; today ringed and read as "(today)" |
| Grades | Row with score, percent and trend arrow with text alternative | Whole row is a 56px target leading to detail |
| Fees | Big outstanding amount plus progress bar plus "paid of total" | Answers "how much, how far along" without a table |
| Teacher schedule | Time, class, room, status tag (Taken 27/28, Next) | Status is visible without opening a class |
| Feedback | Toast (`role=status`) for actions, inline banner for connectivity | Non-blocking; no modals on home |

## 4. States
Every state is reachable through the preview controls.
- **ready.** Fixed demo clock (Tue 6 Oct 2026, 08:12). Aiden shows fee-due; Sofia shows absence and fees settled.
- **loading.** Skeleton cards with reserved heights, `aria-busy`, a hidden "Loading your dashboard" label and a
  spinning refresh icon. The shimmer is replaced by a static grey under reduced motion.
- **empty.** Teacher with no classes (holiday): explanation, the next class, "Open timetable". Parent with no linked
  student (first run): explanation plus "Enter link code". Section-level empty: Grade 2A shows "No grades posted
  yet", with the next publish date instead of a blank card.
- **error.** Full-page `role=alert`: plain-language cause, reassurance that nothing was lost, **Try again**, and a
  support reference code. Retry moves focus to `<main>` and announces "Dashboard updated".
- **offline.** Amber banner plus "Offline, saved 8:05 AM" in the header. Cached data stays visible. Pay becomes
  `aria-disabled` "Reconnect to pay" (still focusable, and it explains itself in a toast). Teacher attendance stays
  enabled because it is offline-first and syncs later. Driven by the real `online`/`offline` events.
- **partial.** One card fails (grades, or grades-to-enter) with an inline Retry; the rest of the page stays usable.

## 5. Design tokens
All values are CSS custom properties on `:root`, with a dark override under `prefers-color-scheme`.
- Colour roles: `--bg --surface --surface-2 --text --muted --line --brand --on-brand --brand-soft --hero`, plus
  status pairs `--ok/--ok-bg --warn/--warn-bg --bad/--bad-bg`. Text and background pairs were chosen for at least
  4.5:1 (muted text on surface is about 7:1).
- Spacing is a 4px scale (`--s1` to `--s6`). Radii are 12px for controls and 16px for cards.
- Type: system font stack (no webfont), `rem` sizes from 0.75rem (nav labels) to 2.25rem (hero amount), with
  `tabular-nums` on every figure. Body is 16px, and 13px is the floor for secondary text.
- Sizing: `--tap: 48px` (above the 44pt iOS and 48dp Android minimums), `--nav: 64px`.
- Brand blue is used for the interactive and primary role only. Green, amber and red mean status and never decorate.

## 6. Motion
- Cards rise 10px and fade in over 280ms (`cubic-bezier(.2,.8,.2,1)`), staggered 45ms. The progress bar grows over
  700ms and buttons press to scale .98 in 120ms. Only `transform`, `opacity` and `width` animate.
- Shimmer (1.4s) and refresh spin (0.8s) mean "working"; nothing else loops. `prefers-reduced-motion: reduce`
  disables all animation and transitions globally.

## 7. Accessibility
- Landmarks: skip link, `nav` (labelled), `main`, `header`. One `h1`, then each card is a `section` labelled by
  its `h2`. The hero heading is meaningful ("Amount due: $420.00").
- Never colour alone: icons and text on status, check on the selected chip, text arrows on trends, the `aria-current`
  tab has a pill plus colour.
- Focus: 3px visible outline on every control (white on the blue hero), a logical DOM order, and the child switcher
  lives outside `<main>` so re-rendering never drops keyboard focus. Targets are 48px or larger.
- Live regions: `#live` (polite) announces updating, updated, offline and failure. The offline banner and toasts are
  `role=status`. The error card is `role=alert`.
- Respects system colour scheme and text scaling (rem units); the viewport meta does not block zoom.

## 8. Performance
- One file with inline CSS and JS, no network requests, no images (inline SVG sprite) and no webfont. Therefore no
  render-blocking requests and no FOIT.
- Skeletons reserve realistic heights to limit layout shift. Below-the-fold cards use `content-visibility:auto`.
- Production plan: service worker with precached app shell, stale-while-revalidate for `/api/dashboard`, IndexedDB
  queue for offline attendance marks (Background Sync where available), and a versioned cache with an "Update
  available" toast.

## 9. Responsive behaviour
- Under 768px: single column, bottom tab bar, and safe-area padding (`env(safe-area-inset-*)`, `viewport-fit=cover`).
- 768px and up: 96px left rail, two-column card grid, hero spans full width, button no longer full-width.
- 1100px and up: three columns, content capped at 1120px.
- The chip switcher scrolls horizontally on narrow screens. Grid tracks use `minmax(0,1fr)` to prevent overflow.

## 10. Assumptions
- Currency is USD and the locale is en-US (placeholder; should come from the school record). The roster, grading
  scale and the "30 days" window are mock data.
- Role comes from the signed-in account. The role toggle in the preview controls is demo tooling and must be
  removed in production.
- The 5-day strip shows school days only.
- Tab and row links are placeholders (`#attend`, etc.) and show a "not part of this prototype" toast. Action
  buttons also only show toasts.
- Dark mode follows the OS only (no in-app toggle). The fee threshold is 14 days.

## 11. Untested conditions
Verified only in the desktop app's embedded Chromium pane, at 375, 820 and 1280px, in light and dark. In that pane I
checked: no horizontal overflow in 12 role and state combinations, retry flow and focus handoff, no console errors,
and a scripted contrast spot check with no failures in the one view sampled.
Not verified:
- Real devices, and iOS Safari specifically (`dvh`, safe-area insets, sticky header with the dynamic toolbar).
- Screen readers (VoiceOver, TalkBack): announcement order and verbosity are unconfirmed.
- PWA installability, offline reload and service worker. The manifest, icons and sw.js are not in this file, since a
  manifest cannot be reliably inlined.
- Lighthouse and Core Web Vitals on a throttled mid-range Android device.
- Forced-colours mode, RTL, 200% text zoom, and long names or very long class labels.
- Pull-to-refresh (not implemented; a refresh button is provided). Landscape phone with the bottom bar.
- Real data: slow, partial or 401 responses, and token expiry.
