# Preserve contract (regression checklist)

Create `preserve.md` before coding; tick after each screen.
- Routes/URLs and deep links (before → after identical or redirected).
- Each form: field names, validation rules, submit endpoint, success/error behavior.
- Each API call and payload shape, auth/session handling, roles and permission gating.
- Each user flow end to end (list steps; run before and after).
- Data displayed: every field currently shown is still reachable (may move to detail).
- Notifications, share targets, install, offline behavior, analytics events, SEO tags.
- Script hooks: ids, classes, data attributes used by JS, tests or tracking.
- Anything intentionally removed: list with reason and user approval.
