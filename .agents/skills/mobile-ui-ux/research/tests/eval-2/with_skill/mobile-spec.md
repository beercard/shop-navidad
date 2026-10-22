# School admin: desktop to mobile spec (Students list + Edit student)

Goal: let staff find a student, see fee/attendance status, reach a guardian and fix records from a phone. Primary action on the list: open a student; on Edit: Save. Tags: [S] standard, [P] platform, [R] research, [C] consensus, [H] our judgment. Personas, frequencies and the 25 fields are assumed (section 12). Nothing here was tested on a device.

## 1. Task table (done before screens)
| Task | Freq (assumed) | Mobile? | Pattern |
|---|---|---|---|
| Find a student by name/ID/class | daily | yes, primary | search-first list of card rows |
| Read fee status / attendance % | daily | yes | status in the row (icon+text), full set on detail |
| Call or message a guardian | daily | yes | row "⋯" and sticky Call/Message bar on detail |
| Filter (class, section, status, date) and sort | daily | yes | Filter sheet + applied chips; Sort sheet |
| Fix 1-3 fields (phone, class, section) | weekly | yes | detail row to one-field sheet (data-dense s9) |
| Message several guardians | weekly | yes | selection mode, Message |
| Move several students to another class | termly | yes | selection mode, Change class |
| Full record edit (25 fields) | rare | yes, reduced | full-screen sectioned form (section 7) |
| Archive a student | rare | yes | row "⋯" / bulk overflow + Undo |
| Delete permanently | rare | no | "Continue on desktop" |
| Column sorting, column layout, CSV export | weekly/rare | partly | Sort sheet; Export = share sheet; CSV download only at >= 600px |
| Keyboard shortcuts, right-click | power users | n/a on touch | visible equivalents; kept with a keyboard at >= 600px |

## 2. Information architecture
- 12 sections become 5 bottom-bar destinations by assumed frequency: Students, Attendance, Fees, Messages, More. Icon + always-visible label, current item marked with fill + label weight, state kept per tab [P][R].
- "More" is a labeled hub screen (not an auto-overflow) listing Classes, Teachers, Grades, Timetable, Reports, Library, Transport, Settings, with search. 4 + hub follows navigation.md s1 [P][C]; the order is [H] and needs analytics or a card sort (>= 15 people).
- Defer to desktop: Settings (mostly), report builder, transport route editing, library catalog admin. Mobile keeps lookup, view, share. Each shows "Continue on desktop" where cut.
- Window width decides chrome: < 600 bar, 600-839 rail (5 items + More), >= 840 labeled sidebar with all 12 (<= 2 levels) [P].
- Students screen: title + count, "Select" (top bar), visible search field, Filter button with count, Sort chip, applied chips. Back/Up on every pushed screen. Deep links: `/students?classes=7&section=B`, `/students/:id`, `/students/:id/edit`.
- Single admin role assumed. If teachers/parents use it, they get their own task-first IA (rule 106).

## 3. Desktop idiom to mobile mapping
| Desktop | Mobile |
|---|---|
| Left sidebar, 12 sections | bottom bar (4 + More hub); sidebar only at >= 840 |
| 10-column grid | card rows (section 4); table only on request at >= 600 |
| Column-header sorting | Sort sheet (single select, current value on the chip); header sort only at >= 600 |
| Hover row actions view/edit/delete/message | row tap = view; always-visible "⋯" 48 target opens Message, Call, Edit, Archive |
| Bulk toolbar above grid | selection mode + contextual bar (section 6) |
| Left filter panel | bottom Filter sheet, "Show N results", applied chips |
| Modal, 25 fields, 3 columns | pushed full-screen form, 1 column, 5 sections |
| Right-click menu | same menu from "⋯"; long-press starts selection (accelerators only) |
| Keyboard shortcuts | buttons exist for everything; shortcuts kept at >= 600 with a keyboard, with an off switch [S 2.1.4, not in skill] |
| Date range with two calendars | presets (Today, 7 days, 30 days) + custom via native date inputs |
| Delete | Archive with Undo; permanent delete on desktop |

## 4. Table decision
Job = look up and act on one record, not compare columns. So card rows, not a shrunk grid (rule 101) [R].
- Row (min 88dp, whole row is the target to detail): 40dp avatar (alt empty, name adjacent); line 1 name (2-line clamp, name first, not ID [R]); line 2 "Grade 7-B · ID 20481"; line 3 "Attendance 92% · [icon] Overdue". Trailing: one "⋯" (48x48).
- Moved off the list: guardian, phone, last login (detail; phone is tap-to-call). Attendance < 75% shows "▲ Low" (threshold assumed). Fee status = icon + text + color, 3 states.
- Numbers via `Intl`, `tabular-nums` where aligned. Never truncate status or attendance.
- If the client confirms class-wide attendance/fee comparison is a mobile job: add a Table toggle at >= 600 (native `<table>` in a labeled focusable scroller, sticky name column + header, clipped next column as the overflow cue, Columns chooser). Not built.
- Load more, 25 per batch, "Showing 25 of 1,240" [R]; restore loaded pages and scroll on Back; virtualize or `content-visibility:auto` (section 10).

## 5. Filters, sort, search
- Search: one visible field, scope in placeholder ("Name, ID or guardian"), submits on the search key (cheap per-keystroke search not assumed). Recents: TODO.
- Filter button (count badge) opens a bottom sheet (4 groups, large detent) with Close; footer: Reset + "Show N results" (needs a count endpoint, else "Show results"). Class = 12 chips, Section = chips (valid for chosen class, TODO), Status = chips, Date = presets. Chips are 32 visual with 48 hit; selected = fill + check mark.
- Applied filters shown as removable chips + "Clear all" outside the sheet. Applying clears any selection and says so in the status region.
- Zero results states the query: "0 students match: Grade 7 + Section B + Overdue" with "Clear filters".
- URL carries the applied set; one history entry per applied set so Back steps through them [R, conflicts with "pushState only for named screens", see assumptions].
- Sort: "Sort: Name A-Z" chip opens a single-select sheet (name, attendance low-high, class, last login); default stated.

## 6. Bulk actions (selection mode)
- Enter by the visible "Select" button or long-press on a row (450 ms, touch). Exit by close, Back, or deselect-all.
- Top bar becomes: close, "N selected", Message, Change class, "⋯" (Export via share sheet, Archive). <= 3 actions + overflow [R].
- Below it: "Select all 25 loaded"; once all loaded are selected and more exist: "Select all 1,240 matching". The count always says which.
- Row tap toggles, checkbox is a real input inside the row label, per-row "⋯" hidden. Selection survives scroll and Load more; a filter change clears it (announced).
- Archive: <= 25 selected = act + Undo snackbar 10 s. All-matching or > 25: verb dialog first ("Archive 1,240 students" / "Keep students") [H]. Not built in the skeleton.
- Live region announces "3 selected". Partial failure: summary with counts and "Retry N".

## 7. Edit flow
- Container: pushed full-screen page `/students/:id/edit`, not a sheet (25 fields; own URL and Back stack) [C][H thresholds].
- Entry: detail "Edit" (full form) or one-field sheets from detail rows for common fixes. Top bar: Close (leading) + title only. Save is a sticky full-width bottom bar with safe-area padding (not in the top bar of a long form) [C].
- 25 fields to 5 sections as native `<details>` (accordion = review pattern): Student, Class and enrolment, Guardian and contact, Address and transport, Health and notes. First open; sections with errors auto-expand and show "needs attention". Ask the client to rank the 25; cut or move rare ones to desktop first.
- Fields: single column, label above, "(optional)" on the minority, 16px+ text, 48 min height, per-field `type/inputmode/autocomplete/enterkeyhint` from the forms.md cheat table; class = native select, section = radios or select, DOB = native date with min/max, phone `type=tel`. No `type=number` for IDs.
- Validation: format on blur, empty required on submit. Save stays enabled; on submit an alert summary takes focus ("2 fields need attention"), sections expand, `aria-invalid`+`aria-describedby`, input kept. Summary links to fields: TODO.
- Save: in-button "Saving…" same width, re-entrancy guard, idempotency key per edit session; success pops to detail + "Student saved" snackbar.
- Dirty: draft kept in `sessionStorage` (500 ms debounce), restored on reopen; Close/Back with edits opens "Discard changes?" with "Keep editing" (focused) and "Discard changes".
- Failures: 409 = someone else edited (compare, do not overwrite), 401 = sign-in sheet over the form with draft kept, offline = "Can't save offline, changes kept" (editing online-only in v1, [H]), 5xx = banner + Try again.

## 8. States
| State | Design |
|---|---|
| Loading | nothing for 300 ms; then 6 skeleton rows at exact 88dp; 15 s timeout to error-empty; status region says "Loading students" |
| First use | "No students yet" + next step (Add student not in brief) |
| No search results / filtered to zero | echo query or filters + Clear filters |
| Error-empty | "Couldn't load students", filters kept, Retry re-enters loading |
| Offline | cached reads, "Updated 3 min ago" banner, Sync now: spec only, skeleton shows an offline notice |
| Load more fails | button turns to "Couldn't load more. Retry" |
| Permission | roles without contact access: guardian/phone rows hidden, not disabled |
| Long text / 200% | name clamps at 2 lines, supporting lines wrap, pill wraps, rows grow, "⋯" stays 48 |
| Dark | re-authored tokens, off-black canvas; contrast not measured |

## 9. Accessibility
- List = `ul`/`li` with `aria-setsize/posinset`; row name comes from visible text; "⋯" labeled "Actions for {name}". Selection = real checkboxes + live count. No swipe actions shipped, so no custom-action need yet.
- Sheets/dialogs: native `<dialog>.showModal()` (focus trap, Esc, inert background, focus return) + visible Close + Back closes top overlay. Edit page focuses its `h1` on open.
- Targets >= 48 with >= 8 gap (chips 32 visual / 48 hit); pills and status never color-only; focus ring 2px; sticky bars covered by `scroll-padding`.
- Reduce Motion: sheet slide becomes 120 ms fade, skeleton pulse stops. Zoom enabled, orientation unlocked.
- Screen-reader and Voice Control walkthroughs not run.

## 10. Performance
- Rows use `content-visibility:auto` + `contain-intrinsic-size`; batches of 25; search/filter/sort server-side. Switch to a virtualizer if lists regularly exceed ~100 loaded rows [H].
- Avatars from a thumbnail endpoint (`?w=80`, 40x40 set, lazy, async decode), never full photos. No blur, no shadows, only transform/opacity motion.
- No UI library: React + one CSS file. Budget <= 300-600 KiB compressed critical JS on a mid-tier Android [H]; code-split Filter sheet and Edit page. Not measured.

## 11. Responsive
- < 600 compact: as above. 600-839: rail, list capped at 720px, still push navigation. >= 840: list-detail two panes with persistent selection highlight; Table toggle available. >= 1200: the existing desktop UI may stay. Decided by window width, never device type [P].
- `viewport-fit=cover`, safe-area insets on bars/sheets/save bar, `dvh` for sheets, never `100vh`. State survives rotation/resize. Short landscape: collapse top bar on scroll, keep chrome < ~25% of height with keyboard open [H].

## 12. Assumptions
- Users are front-office/admin staff on phones; tasks and frequencies in s1 are guesses. Search exists or may be added. Statuses (Active/Inactive/Graduated) and "date range = last login" are guesses; which date the client filters is open.
- Archive is a server-side soft delete with restore; count, archive, restore, PATCH endpoints exist; PATCH honors `Idempotency-Key`. Cursor pagination exists.
- Student data is about minors: drafts live in `sessionStorage` only; the client must decide on data-protection rules.
- Judgment calls (not sourced): 5-destination order, 75% "Low" threshold, 450 ms long-press, 10 s snackbar, archive dialog above 25, push one history entry per applied filter set (components.md s9) vs "pushState only for named screens" (navigation.md s3), sticky bottom Save (forms.md s12) vs Save trailing in the top bar (components.md s2), long-press = select (data-dense s6) vs long-press = menu (data-dense s3).

## 13. Untested conditions
Real devices (small phone, large phone, foldable), iOS Safari and Android Chrome behavior of `<dialog>`, `content-visibility`, `contextmenu` on long-press and the history-based Back hook (can race when one overlay replaces another); VoiceOver/TalkBack/Voice Control; 200% text and 320px reflow; dark and increased contrast (no ratios computed); Reduce Motion; slow network and offline; keyboard-open layout of the sticky Save bar; very long names and RTL/localization; large lists (> 1,000 rows); data-protection review; user testing of the IA and the Select/long-press discoverability. Gates G1-G15 pass only as design intent; none was verified.
