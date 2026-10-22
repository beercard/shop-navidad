# Mobile spec: school admin, Students list + Edit flow

Target: responsive web/PWA, phone-first (360-430 px), thumb-operated, patchy network. Priorities come from the desktop inventory, not usage data.

## 1. Task table (what staff do on a phone, ranked)

| # | Task | Desktop today | Phone priority | Mobile solution |
|---|------|---------------|----------------|-----------------|
| 1 | Find one student | scan/sort 10-col grid, filter panel | P0 | Search-first list, filter + sort sheets |
| 2 | Check fee and attendance status | read across columns | P0 | Both shown on the row; no tap needed |
| 3 | Call or message a guardian | phone column, hover "message" | P0 | Row action sheet; `tel:` link on detail |
| 4 | Navigate between 12 sections | left sidebar | P0 | Bottom tabs (4) + More |
| 5 | Fix a record (typo, new phone, class move) | 25-field modal | P1 | Full-screen sectioned form, 1-2 edits typical |
| 6 | Re-order list | column header sort | P1 | Sort sheet, 4 options |
| 7 | Act on several students (message, delete) | checkboxes + toolbar | P2 | Select mode + bottom action bar |
| 8 | Delete a student | hover icon | P2 | Overflow menu, confirm, undo |
| 9 | Compare or audit many rows by column | grid | P3 on phone | Not designed for phone; tablet/desktop table |
| 10 | Power-user shortcuts | keyboard, right-click | none | Dropped on touch; visible controls replace them |

## 2. Information architecture

- Bottom tab bar, 5 slots: **Students, Classes, Attendance, Messages, More**. 12 sections cannot fit; hamburger-only nav hides everything, so the top 4 get tabs (assumed; make it role-configurable, e.g. Fees for finance staff). Messages carries an unread badge.
- **More** is a grouped list: People (Teachers) / Academics (Grades, Timetable, Reports) / Operations (Fees, Library, Transport) / Settings.
- Students is a stack: **List -> Detail -> Edit**. Each is a real route (deep-linkable, browser/OS back works). Edit is full-screen, not a modal.
- Detail is the hub: every column not shown on the row lives here (guardian, phone, last login) plus Edit, Message, Call.

## 3. Idiom mapping (desktop to mobile)

| Desktop | Mobile | Note |
|---------|--------|------|
| Left sidebar, 12 items | Bottom tabs + More | Tab bar hidden in select mode (bulk bar takes its place) |
| 10-column data grid | Card-style list rows | See section 4 |
| Column sort | Sort sheet (radio list) | One active sort; current value in button label |
| Hover row actions (view/edit/delete/message) | Tap row = View. Visible 44 px "⋯" opens action sheet | Hover does not exist on touch |
| Swipe-to-reveal actions | Not in v1 | Hidden, collides with edge-back, needs an alternative anyway |
| Bulk toolbar above grid | Select mode: header becomes "N selected", bottom action bar | Entered by "Select" button or long-press |
| Left filter panel | Filter bottom sheet + removable chips under search | |
| 3-column 25-field modal | Full-screen single-column sectioned form | Section 7 |
| Keyboard shortcuts | None required. With hardware keyboard: Esc closes sheets and back-guards | Every action has a visible control |
| Right-click context menu | Long-press enters select mode; "⋯" sheet is the menu | Long-press never the only path |
| Pagination | Cursor paging, infinite scroll, windowed | Show count in header |

## 4. Table decision: card list, not a table

A 10-column grid needs roughly 1100 px. At 390 px, horizontal scroll loses the name column or forces a sticky first column that eats a third of the screen. A column-picker adds configuration work for a task (finding one student) that does not need it. Decision: **one row per student, columns triaged by task**.

| Column | Placement | Reason |
|--------|-----------|--------|
| photo | 44 px avatar, leading | Recognition; becomes a check mark in select mode |
| name | Row title (2 lines max) | Primary identifier |
| ID, class, section | Subtitle `ID · 5-B` | Disambiguates same names |
| attendance % | Right, text; "low" suffix under 75% | Status at a glance; not colour-only |
| fee status | Right, outlined tag with text | Same |
| guardian | Detail; searchable | Needed only after finding the student |
| phone | Detail as `tel:` link; "Message guardian" in action sheet | Action, not data |
| last login | Detail; filterable | Low frequency |

Row height about 68 px, so roughly 8 rows per screen under the header. Tablet (768-1023): list + detail split pane. Desktop (1024+): keep the existing grid; reuse hooks/data layer.

## 5. Filters

- Entry: "Filter" button beside search, count badge when active. Search + filters combine with AND.
- Sheet fields: Class, Section (options narrow by chosen class), Status, Last-login date range. Native `<select>` and `<input type=date>` give platform pickers.
- Primary button is **"Show N students"** (live count); "Reset" beside it. Nothing applies until confirmed.
- Applied filters appear as chips under search; tapping a chip removes it. "Clear search and filters" on the empty result.
- Filter + scroll position survive List -> Detail -> back.
- Date range targets last login in the skeleton. The desktop panel does not say which date; confirm with client.

## 6. Bulk actions

- Enter: visible "Select" button (works for keyboard, screen reader, switch) or long-press a row (accelerator).
- Select mode: header shows "N selected", Cancel, Select all. Search/filter/sort are hidden, so the selection can never contain rows the user cannot see.
- Bottom action bar (thumb zone) replaces the tab bar: Message, Delete. Actions disabled at 0 selected. The desktop toolbar's real action list is unknown; add others behind a "More" item, never past 4 slots.
- "Select all" covers loaded rows. For "all N matching", show a banner action and send the filter to the server, not 1,200 IDs.
- Delete: confirm sheet with count, then 8 s undo toast (needs soft delete from the API). Partial failure: list which failed, keep those selected.

## 7. Edit flow

- Entry: Detail "Edit" or row sheet "Edit". Full-screen route `/students/:id/edit`. Header: Back + title. Footer: sticky **Save changes**.
- 25 fields in 5 collapsible sections (grouping assumed): Identity, Academic, Guardian, Contact, Health & other. First open by default; others collapsed, header shows "· 2 to fix" when invalid. One column, labels above, never placeholder-as-label.
- Input types do the work: `tel`/`inputMode=tel`, `email`, native date, native selects, `autocomplete` tokens, camera/gallery for photo. Font 16 px+ so iOS does not zoom.
- Read-only: Student ID; attendance and fee status are computed elsewhere (assumed).
- Validation: on blur per field, again on submit. Submit with errors expands those sections and focuses the first invalid field. Server failure: banner, entered data kept.
- Save is enabled only when dirty. Leaving dirty (Back, Esc, OS back) opens "Discard changes?" with **Keep editing** as the safe choice.
- Production extras not in the skeleton: draft in `sessionStorage` (a phone call must not lose edits), `beforeunload` guard, version/ETag conflict prompt, optimistic row update after save, "Saved" toast.
- Keyboard: focused field scrolls to centre; footer is sticky inside the scroller; viewport meta `interactive-widget=resizes-content` for Chrome Android.

## 8. States

| State | Behaviour |
|-------|-----------|
| Loading | 8 skeleton rows, `aria-busy`; keep old data visible on refresh |
| Empty | No data: "No students yet" + Add (if permitted). Filtered: "No students match" + Clear search and filters |
| Error | Message + Try again; if refresh fails, keep stale list with banner |
| Offline | Banner; cached list readable; Save disabled with reason, draft kept |
| Saving / failed | Button "Saving…" blocks double-submit. Save or delete failure: banner/toast, nothing lost |
| Permission denied | Hide actions the role cannot do instead of disabling |
| Long or odd data | Name wraps to 2 lines, subtitle ellipsis; missing photo falls back to initials (not in skeleton) |

## 9. Accessibility

- Targets at least 44 px (WCAG 2.2 minimum is 24; 44/48 is the working target). 8 px between adjacent targets.
- Status never by colour alone: fee tag has text, low attendance has the word "low".
- Sheets: `role=dialog`, `aria-modal`, focus moves in, Esc closes, focus returns to opener, background `inert`.
- No gesture-only paths: long-press has the Select button; no swipe in v1. Rows are `aria-pressed` toggles in select mode; selected count is in a live region.
- Forms: real `<label>`, `aria-invalid` + `aria-describedby`, error alert, focus to first error, collapsed sections via `aria-expanded`.
- Honour `prefers-reduced-motion` and dark mode; no orientation lock; reflow at 200% text (names wrap, no fixed row height).

## 10. Performance

- Server cursor paging (50/page), search debounced 250 ms (`useDeferredValue` in skeleton). Rows memoised; `content-visibility:auto` now, true windowing past about 500 rows.
- Avatars 44 px with explicit width/height (no layout shift), `loading=lazy`, serve 88 px for 2x.
- Code-split Filter sheet and Edit form (largest piece). Targets, unmeasured: LCP under 2.5 s on mid-range Android over 4G; list-route JS under 100 KB gzip.

## 11. Responsive behaviour

| Width | Layout |
|-------|--------|
| under 768 | Bottom tabs, card list, bottom sheets, full-screen edit |
| 768-1023 | Nav rail, list + detail split, centred dialog sheets, edit as 720 px panel (2 columns possible) |
| 1024+ | Existing sidebar + grid, unchanged here |
| Landscape phone | Same as phone; sheets cap at 85 dvh; safe-area insets respected; tab bar may collapse |

## 12. Assumptions (confirm with client)

1. Responsive web/PWA, not a native app. React 19 (`inert={bool}`; on 18 pass `inert=""`).
2. Usage priorities and the four tab choices are inferred, not measured. Get analytics per role.
3. The 25 fields and their 5-way grouping are invented; the brief listed none. Which are required is unknown.
4. "Status" filter means enrolment status (active/inactive), separate from fee status.
5. Date range filters last login; low attendance threshold is 75%.
6. API supports cursor paging, server filtering, soft delete with undo, and ETag/version checks.
7. Bulk actions are Message + Delete (toolbar not described). Student ID is read-only; attendance and fee are computed.

## 13. Untested conditions

- Skeleton was not compiled, run, or rendered; no device, emulator or screen reader was used. Treat it as a structural sketch.
- iOS Safari: sticky footer with keyboard, `dvh`, long-press selection/callout. Android Chrome: `contextmenu` on long-press, `interactive-widget`, back gesture.
- Screen readers (VoiceOver, TalkBack): sheet focus handling and the live-region count are unverified; the sheets do not trap Tab beyond relying on `inert`.
- Colour contrast values are chosen to aim for AA but not measured, light or dark.
- Focus return after Edit, route-level back guard, offline behaviour, lists over about 1,000 rows, real data (long names, RTL, missing photos, 200%+ zoom).
