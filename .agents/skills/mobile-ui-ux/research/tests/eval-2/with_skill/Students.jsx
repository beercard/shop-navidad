// Students list + Edit flow skeleton (React function components, plain CSS). Compact (<600px) layout only.
// Decisions and assumptions: mobile-spec.md. API paths, field names and the 25-field list are placeholders.
import { useEffect, useId, useReducer, useRef, useState } from 'react';
import './styles.css';

const CLASSES = Array.from({ length: 12 }, (_, i) => String(i + 1));
const SORTS = { name: 'Name A–Z', attendanceAsc: 'Attendance, low to high', classAsc: 'Class', lastLogin: 'Last login' };
const FEE = { paid: ['✓', 'Paid'], due: ['!', 'Due soon'], overdue: ['✕', 'Overdue'] }; // icon + text + color, never color alone
const EMPTY = { classes: [], section: '', status: '', since: '' };
const pct = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 0 });
const send = (body, extra, method = 'POST') => ({ method, headers: { 'content-type': 'application/json', ...extra }, body: JSON.stringify(body) });
const qs = (o) => new URLSearchParams(Object.entries(o).filter(([, v]) => (Array.isArray(v) ? v.length : v)).map(([k, v]) => [k, String(v)]));
async function api(url, opts) { const r = await fetch(url, opts); if (!r.ok) throw Object.assign(new Error(r.statusText), { status: r.status }); return r.json(); }

function useBackToClose(close) { // Back closes the top overlay first; one history entry per overlay
  // Known limit (untested): racy when one overlay replaces another in the same commit; prefer router modal routes.
  const cb = useRef(close); cb.current = close;
  useEffect(() => {
    history.pushState({ overlay: true }, '');
    const pop = () => cb.current();
    addEventListener('popstate', pop);
    return () => { removeEventListener('popstate', pop); if (history.state?.overlay) history.back(); };
  }, []);
}

function useStudents(params, nonce) {
  const [s, set] = useState({ phase: 'loading', items: [], total: 0, next: null, slow: false });
  useEffect(() => {
    const ac = new AbortController(); let live = true;
    const slow = setTimeout(() => live && set((x) => ({ ...x, slow: true })), 300); // skeleton only after 300 ms
    const dead = setTimeout(() => ac.abort(), 15000);                                // every loader has a timeout exit
    const stop = () => { clearTimeout(slow); clearTimeout(dead); };
    set({ phase: 'loading', items: [], total: 0, next: null, slow: false });
    api('/api/students?' + qs({ ...params, limit: 25 }), { signal: ac.signal })
      .then((d) => live && set({ phase: d.items.length ? 'ready' : 'empty', slow: false, ...d }))
      .catch(() => live && set((x) => ({ ...x, phase: navigator.onLine ? 'error' : 'offline', slow: false })))
      .finally(stop);
    return () => { live = false; ac.abort(); stop(); };
  }, [qs(params).toString(), nonce]);
  const more = () => api('/api/students?' + qs({ ...params, limit: 25, cursor: s.next })) // "Load more" (25/batch), not infinite scroll
    .then((d) => set((x) => ({ ...x, ...d, items: [...x.items, ...d.items], failed: false }))).catch(() => set((x) => ({ ...x, failed: true })));
  return [s, more];
}

function Sheet({ title, onClose, footer, children }) { // native <dialog>: focus trap, Esc, inert background, focus return
  const ref = useRef(), id = useId();
  useBackToClose(onClose);
  useEffect(() => { ref.current.showModal(); ref.current.querySelector('[data-autofocus]')?.focus(); }, []);
  return (
    <dialog ref={ref} className="sheet" aria-labelledby={id} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <header className="bar"><h2 id={id}>{title}</h2><button onClick={onClose}>Close</button></header>
      <div className="body">{children}</div>
      {footer && <footer className="foot">{footer}</footer>}
    </dialog>
  );
}
const Actions = ({ title, items, onClose }) => (
  <Sheet title={title} onClose={onClose}>{items.map(([label, fn]) => <button key={label} className="opt" onClick={() => { onClose(); fn?.(); }}>{label}</button>)}</Sheet>
);
const Chip = ({ on, ...p }) => <button type="button" className="chip" aria-pressed={on} {...p} />;
const Group = ({ legend, options, value, pick }) => (
  <fieldset><legend>{legend}</legend>{options.map((o) => <Chip key={o} on={[].concat(value).includes(o)} onClick={() => pick(o)}>{o}</Chip>)}</fieldset>
);

function FilterSheet({ filters, onApply, onClose }) {
  const [d, setD] = useState(filters), [n, setN] = useState(null);
  const flip = (k) => (o) => setD((x) => ({ ...x, [k]: Array.isArray(x[k]) ? (x[k].includes(o) ? x[k].filter((v) => v !== o) : [...x[k], o]) : x[k] === o ? '' : o }));
  useEffect(() => { // live "Show N results"; needs a cheap count endpoint
    const ac = new AbortController(); api('/api/students/count?' + qs(d), { signal: ac.signal }).then((r) => setN(r.total)).catch(() => setN(null));
    return () => ac.abort();
  }, [d]);
  const G = (legend, k, options) => <Group legend={legend} options={options} value={d[k]} pick={flip(k)} />;
  return (
    <Sheet title="Filter" onClose={onClose} footer={<><button onClick={() => setD(EMPTY)}>Reset</button>
      <button className="primary" onClick={() => onApply(d)}>{n == null ? 'Show results' : `Show ${n} results`}</button></>}>
      {G('Class', 'classes', CLASSES)}{G('Section', 'section', ['A', 'B', 'C', 'D'])}{G('Status', 'status', ['Active', 'Inactive', 'Graduated'])}
      {G('Last login', 'since', ['Today', '7 days', '30 days'])}{/* TODO custom range: two native date inputs */}
    </Sheet>
  );
}

function Row({ s, i, total, selecting, checked, onOpen, onToggle, onMenu, onSelect }) {
  const t = useRef(), fired = useRef(false), [icon, fee] = FEE[s.fee], Main = selecting ? 'label' : 'button', stop = () => clearTimeout(t.current);
  const down = (e) => { if (e.pointerType === 'touch' && !selecting) { fired.current = false; t.current = setTimeout(() => { fired.current = true; onSelect(); }, 450); } };
  return (
    <li className="row" aria-setsize={total} aria-posinset={i + 1} data-selected={checked || undefined} onPointerDown={down} onPointerUp={stop} onPointerMove={stop} onPointerCancel={stop}
      onContextMenu={(e) => { e.preventDefault(); if (!fired.current && !selecting) onMenu(); }}>{/* right-click = same menu as the visible "⋯"; long-press = start selecting */}
      <Main className="main" onClick={selecting ? undefined : onOpen}>
        {selecting && <input type="checkbox" checked={checked} onChange={onToggle} />}
        <img src={`${s.photo}?w=80`} width="40" height="40" alt="" loading="lazy" decoding="async" />
        <span className="txt">
          <strong className="name">{s.name}</strong>
          <span>Grade {s.class}-{s.section} · ID {s.id}</span>
          <span>{s.att < 75 && '▲ Low · '}Attendance {pct.format(s.att / 100)} · <span className={'pill ' + s.fee}><i aria-hidden="true">{icon}</i> {fee}</span></span>
        </span>
      </Main>
      {!selecting && <button className="more" aria-label={`Actions for ${s.name}`} aria-haspopup="dialog" onClick={onMenu}>⋯</button>}
    </li>
  );
}

function Notice({ phase, slow, query, filters, onRetry, onClear }) {
  if (phase === 'loading') return slow ? <ul className="list" aria-hidden="true">{[...Array(6)].map((_, i) => <li key={i} className="skel" />)}</ul> : null;
  const active = [query && `"${query}"`, ...filters.classes.map((c) => `Grade ${c}`), filters.section && `Section ${filters.section}`, filters.status, filters.since].filter(Boolean);
  const T = { error: ["Couldn't load students", 'Check your connection and try again. Your filters are kept.', 'Retry'],
    offline: ["You're offline", 'Reconnect to load students. Cached reads are not in this skeleton.', 'Retry'],
    empty: active.length ? [`0 students match: ${active.join(' + ')}`, 'Remove a filter to see more.', 'Clear filters'] : ['No students yet', 'Students you add will appear here.'] }[phase];
  return T && <div className="notice" role={phase === 'empty' ? 'status' : 'alert'}><h2>{T[0]}</h2><p>{T[1]}</p>{T[2] && <button className="primary" onClick={phase === 'empty' ? onClear : onRetry}>{T[2]}</button>}</div>;
}

export default function StudentsScreen() {
  const [query, setQuery] = useState(''), [filters, setFilters] = useState(EMPTY), [sort, setSort] = useState('name'), [nonce, reload] = useReducer((n) => n + 1, 0);
  const [sel, setSel] = useState(null), [all, setAll] = useState(false); // sel: null = browse mode, Set = selection mode
  const [sheet, setSheet] = useState(null), [editing, setEditing] = useState(null), [toast, setToast] = useState(null);
  const [data, more] = useStudents({ q: query, sort, ...filters }, nonce), count = all ? data.total : sel?.size;
  const chips = [...filters.classes.map((c) => ['classes', c, `Grade ${c}`]), ...['section', 'status', 'since'].filter((k) => filters[k]).map((k) => [k, filters[k], filters[k]])];
  const drop = ([k, v]) => setFilters((f) => ({ ...f, [k]: Array.isArray(f[k]) ? f[k].filter((x) => x !== v) : '' }));
  const toggle = (id) => { setAll(false); setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const exit = () => { setSel(null); setAll(false); }, close = () => setSheet(null);
  async function archive(ids) { // soft delete (assumed) + Undo; permanent delete stays on desktop. TODO >25 or all-matching: verb dialog first
    await api('/api/students/archive', send({ ids, allMatching: all, filters })); exit(); reload();
    setToast({ text: `${all ? data.total : ids.length} archived`, undo: () => api('/api/students/restore', send({ ids })).then(reload) });
  }
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 10000); return () => clearTimeout(t); }, [toast]); // actionable toast: 10 s
  return (<>
    <div hidden={!!editing}>{/* list stays mounted so loaded pages survive Back from Edit; TODO restore scrollY */}
      {sel ? <header className="bar"><button aria-label="Cancel selection" onClick={exit}>✕</button><h1>{count} selected</h1>
          <button>Message</button><button>Change class</button><button aria-label="More actions" onClick={() => setSheet({ bulk: 1 })}>⋯</button></header>
        : <header className="bar"><h1>Students <small>{data.total || ''}</small></h1><button onClick={() => setSel(new Set())}>Select</button></header>}
      <p role="status" className="sr">{sel ? `${count} selected` : data.phase === 'loading' ? 'Loading students' : `${data.items.length} of ${data.total} students`}</p>
      {sel ? <p className="strip"><button onClick={() => setSel(new Set(data.items.map((s) => s.id)))}>Select all {data.items.length} loaded</button>
          {data.total > data.items.length && sel.size === data.items.length && <button onClick={() => setAll(true)}>Select all {data.total} matching</button>}</p>
        : <>
          <form role="search" className="tools" onSubmit={(e) => { e.preventDefault(); setQuery(new FormData(e.currentTarget).get('q').trim()); }}>
            <input name="q" type="search" enterKeyHint="search" aria-label="Search students" placeholder="Name, ID or guardian" defaultValue={query} autoComplete="off" /></form>
          <div className="tools"><button onClick={() => setSheet('filter')}>Filter{chips.length ? ` (${chips.length})` : ''}</button><button onClick={() => setSheet('sort')}>Sort: {SORTS[sort]}</button></div>
          {chips.length > 0 && <div className="chips">{chips.map((c) => <button key={c[0] + c[1]} className="chip on" onClick={() => drop(c)}>{c[2]} ✕<span className="sr"> Remove filter</span></button>)}
            <button onClick={() => setFilters(EMPTY)}>Clear all</button></div>}</>}
      <Notice phase={data.phase} slow={data.slow} query={query} filters={filters} onRetry={reload} onClear={() => { setQuery(''); setFilters(EMPTY); }} />
      <ul className="list">{data.items.map((s, i) => <Row key={s.id} s={s} i={i} total={data.total} selecting={!!sel} checked={all || !!sel?.has(s.id)} onToggle={() => toggle(s.id)}
        onOpen={() => setEditing(s.id) /* real app: push the detail screen; Edit is its action */} onMenu={() => setSheet({ menu: s })} onSelect={() => setSel(new Set([s.id]))} />)}</ul>
      {data.next && <button className="more-btn" onClick={more}>{data.failed ? "Couldn't load more. Retry" : `Load more · ${data.items.length} of ${data.total}`}</button>}
    </div>
    {sheet === 'filter' && <FilterSheet filters={filters} onClose={close} onApply={(f) => { setFilters(f); close(); exit(); /* filter change clears selection */ }} />}
    {sheet === 'sort' && <Actions title="Sort" onClose={close} items={Object.entries(SORTS).map(([k, l]) => [(sort === k ? '✓ ' : '') + l, () => setSort(k)])} />}
    {sheet?.menu && <Actions title={sheet.menu.name} onClose={close} items={[['View', () => setEditing(sheet.menu.id)], ['Edit', () => setEditing(sheet.menu.id)], ['Message guardian'], ['Call guardian'], ['Archive', () => archive([sheet.menu.id])]]} />}
    {sheet?.bulk && <Actions title={`${count} selected`} onClose={close} items={[['Export (share sheet)'], [`Archive ${count} students`, () => archive([...sel])]]} />}
    {toast && <p className="toast" role="status">{toast.text}{toast.undo && <button onClick={() => { toast.undo(); setToast(null); }}>Undo</button>}</p>}
    {editing && <EditStudent id={editing} onDone={(msg) => { setEditing(null); msg && setToast({ text: msg }); }} />}
  </>);
}

// The real form has 25 fields the client has not listed: five sections, one column, labels above (spec section 7).
const SECTIONS = [
  ['Student', [['fullName', 'Full name', { required: true, autoComplete: 'name' }], ['dob', 'Date of birth', { type: 'date', autoComplete: 'bday' }]]],
  ['Class and enrolment', [['class', 'Class', { required: true, select: CLASSES }], ['section', 'Section', { select: ['A', 'B', 'C', 'D'] }]]],
  ['Guardian and contact', [['phone', 'Guardian phone', { required: true, type: 'tel', autoComplete: 'tel' }], ['email', 'Guardian email', { type: 'email', autoComplete: 'email', spellCheck: false, autoCapitalize: 'none' }]]],
  ['Address and transport', [['postcode', 'Postcode', { autoComplete: 'postal-code' }]]],
  ['Health and notes', [['allergies', 'Allergies', {}]]],
];

function EditStudent({ id, onDone }) {
  const [vals, setVals] = useState(null), [errs, setErrs] = useState({}), [open, setOpen] = useState(new Set([0])), [banner, setBanner] = useState('');
  const [busy, setBusy] = useState(false), [confirm, setConfirm] = useState(false), [dirty, setDirty] = useState(false), [tries, again] = useReducer((n) => n + 1, 0);
  const [key] = useState(() => crypto.randomUUID()), h1 = useRef(), sum = useRef(), flight = useRef(false), draft = `draft:${id}`; // sessionStorage, not localStorage: minors' data
  const requestClose = () => (dirty ? (history.pushState({ overlay: true }, ''), setConfirm(true)) : onDone()); // Back/Close with edits asks first
  useBackToClose(requestClose);
  useEffect(() => { h1.current.focus(); }, []); // route change: focus the heading
  useEffect(() => { if (banner) sum.current?.focus(); }, [banner]);
  useEffect(() => {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), 15000);
    api(`/api/students/${id}`, { signal: ac.signal }).then((s) => { let d; try { d = JSON.parse(sessionStorage.getItem(draft)); } catch {} setVals(d || s); setDirty(!!d); setBanner(''); })
      .catch(() => setBanner("Couldn't load this student. Check your connection and retry.")).finally(() => clearTimeout(t));
    return () => ac.abort();
  }, [id, tries]);
  useEffect(() => { if (!dirty) return; const t = setTimeout(() => { try { sessionStorage.setItem(draft, JSON.stringify(vals)); } catch {} }, 500); return () => clearTimeout(t); }, [vals, dirty]);
  const problem = ([n, label, { required }], blur) => (!blur && required && !String(vals[n] ?? '').trim() ? `Enter ${label.toLowerCase()}`
    : n === 'phone' && vals.phone && vals.phone.replace(/\D/g, '').length < 6 ? 'Enter a phone number with at least 6 digits' : ''); // required: on submit; format: on blur
  async function save() {
    if (flight.current) return; // ignore re-entrant taps; the button stays enabled and focusable
    const e = {}; SECTIONS.forEach(([, fs]) => fs.forEach((f) => { const m = problem(f); if (m) e[f[0]] = m; })); setErrs(e);
    if (Object.keys(e).length) { setOpen(new Set(SECTIONS.flatMap(([, fs], i) => (fs.some((f) => e[f[0]]) ? [i] : [])))); return setBanner(`${Object.keys(e).length} fields need attention`); } // TODO link each item to its field
    flight.current = true; setBusy(true); setBanner('');
    try { await api(`/api/students/${id}`, send(vals, { 'Idempotency-Key': key }, 'PATCH')); sessionStorage.removeItem(draft); onDone('Student saved'); }
    catch (x) { setBanner(x.status === 409 ? 'Someone else changed this student. Reload to compare, then re-apply your edits.' : x.status === 401 ? 'Your session expired. Sign in again; your changes are kept.' : "Couldn't save. Your changes are kept. Try again."); }
    finally { flight.current = false; setBusy(false); }
  }
  return (
    <main className="edit">
      <header className="bar"><button aria-label="Close" onClick={requestClose}>✕</button><h1 ref={h1} tabIndex={-1}>Edit student</h1></header>
      {banner && <p className="banner" role="alert" ref={sum} tabIndex={-1}>⚠ {banner}{!vals && <button onClick={again}>Retry</button>}</p>}
      {vals && <form noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
        {SECTIONS.map(([title, fields], i) => (
          <details key={title} open={open.has(i)} onToggle={(e) => setOpen((o) => { const n = new Set(o); e.currentTarget.open ? n.add(i) : n.delete(i); return n; })}>
            <summary>{title}{fields.some((f) => errs[f[0]]) && <span className="err"> ⚠ needs attention</span>}</summary>
            {fields.map((f) => <Field key={f[0]} f={f} value={vals[f[0]]} error={errs[f[0]]} onChange={(v) => { setVals((x) => ({ ...x, [f[0]]: v })); setDirty(true); }} onBlur={() => setErrs((x) => ({ ...x, [f[0]]: problem(f, true) }))} />)}
          </details>))}
        <div className="foot save"><button type="submit" className="primary" aria-busy={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div>
      </form>}
      {confirm && <Sheet title="Discard changes?" onClose={() => setConfirm(false)} footer={<><button data-autofocus onClick={() => setConfirm(false)}>Keep editing</button>
        <button className="danger" onClick={() => { sessionStorage.removeItem(draft); onDone(); }}>Discard changes</button></>}><p>Your edits to this student have not been saved.</p></Sheet>}
    </main>
  );
}

function Field({ f: [n, label, { select, required, ...attrs }], value, error, onChange, onBlur }) {
  const id = useId(), Ctl = select ? 'select' : 'input';
  return (
    <div className="field"><label htmlFor={id}>{label}{!required && ' (optional)'}</label>
      <Ctl id={id} name={n} value={value ?? ''} enterKeyHint="next" aria-invalid={!!error} aria-describedby={error ? id + 'e' : undefined} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} {...attrs}>
        {select && [<option key="" value="" />, ...select.map((o) => <option key={o}>{o}</option>)]}</Ctl>
      {error && <p id={id + 'e'} className="err">⚠ {error}</p>}</div>
  );
}
