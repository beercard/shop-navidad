// Students list + Edit flow, mobile skeleton. React 19 (inert={bool}), function components, plain CSS.
// Data/API arrive as props. Client-side filter/sort stands in for server queries + cursor paging.
import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

const FEE = { paid: 'Paid', due: 'Due', overdue: 'Overdue' };
const SORTS = { name: 'Name (A-Z)', attendance: 'Attendance (lowest first)', fee: 'Fee status (overdue first)', lastLogin: 'Last login (recent first)' };
const CMP = {
  name: (a, b) => a.name.localeCompare(b.name),
  attendance: (a, b) => a.attendance - b.attendance,
  fee: (a, b) => Object.keys(FEE).indexOf(b.fee) - Object.keys(FEE).indexOf(a.fee),
  lastLogin: (a, b) => (b.lastLogin || '').localeCompare(a.lastLogin || ''),
};
const EMPTY = { cls: '', section: '', status: '', from: '', to: '' };
const LABEL = { cls: 'Class', section: 'Section', status: 'Status', from: 'Login from', to: 'Login to' };
const day = s => (s.lastLogin || '').slice(0, 10);
const run = (list, q, f, sort) => list.filter(s =>
  (!q || `${s.name} ${s.studentId} ${s.guardian}`.toLowerCase().includes(q.toLowerCase())) &&
  (!f.cls || s.cls === f.cls) && (!f.section || s.section === f.section) && (!f.status || s.status === f.status) &&
  (!(f.from || f.to) || (day(s) && day(s) >= (f.from || '') && day(s) <= (f.to || '9999')))).sort(CMP[sort]);

function Sheet({ title, onClose, footer, children }) {          // bottom sheet; centered dialog >=768px
  const ref = useRef(null), close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const prev = document.activeElement, key = e => e.key === 'Escape' && close.current();
    ref.current.focus();
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); prev?.focus?.(); };
  }, []);
  return (
    <div className="scrim" onClick={onClose}>
      <section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="sheet" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </section>
    </div>
  );
}

function useLongPress(fn, ms = 450) {   // accelerator only: a visible "Select" button is the accessible path
  const t = useRef(0), fired = useRef(false), stop = () => clearTimeout(t.current);
  const on = {
    onPointerDown: () => { fired.current = false; t.current = setTimeout(() => { fired.current = true; fn(); navigator.vibrate?.(10); }, ms); },
    onPointerUp: stop, onPointerLeave: stop, onPointerCancel: stop, onContextMenu: e => e.preventDefault(),
  };
  return { fired, on };
}

const Row = memo(function Row({ s, selecting, selected, onOpen, onToggle, onMore }) {
  const lp = useLongPress(() => onToggle(s.id));
  const tap = () => { if (lp.fired.current) { lp.fired.current = false; return; } selecting ? onToggle(s.id) : onOpen(s); };
  const low = s.attendance < 75;     // threshold is an assumption
  return (
    <li className={'row' + (selected ? ' sel' : '')}>
      <button className="row-main" {...lp.on} onClick={tap} aria-pressed={selecting ? selected : undefined}>
        <span className="avatar">{selected ? '✓' : <img src={s.photo} alt="" width="44" height="44" loading="lazy" />}</span>
        <span className="who"><b>{s.name}</b><small>{s.studentId} · {s.cls}-{s.section}</small></span>
        <span className="meta"><span className={'tag ' + s.fee}>{FEE[s.fee]}</span><small className={low ? 'low' : ''}>{s.attendance}%{low && ' low'}</small></span>
      </button>
      {!selecting && <button className="more" aria-label={`Actions for ${s.name}`} onClick={() => onMore(s)}>⋯</button>}
    </li>
  );
});

function FilterSheet({ initial, options, count, onApply, onClose }) {
  const [d, setD] = useState(initial);
  const set = k => e => setD(p => ({ ...p, [k]: e.target.value }));
  const pick = (k, opts) => (
    <label className="field">{LABEL[k]}
      <select value={d[k]} onChange={set(k)}><option value="">All</option>{opts.map(o => <option key={o}>{o}</option>)}</select>
    </label>);
  return (
    <Sheet title="Filter students" onClose={onClose} footer={<>
      <button className="btn ghost" onClick={() => setD(EMPTY)}>Reset</button>
      <button className="btn" onClick={() => onApply(d)}>Show {count(d)} students</button></>}>
      {pick('cls', options.cls)}{pick('section', options.section)}{pick('status', options.status)}
      {['from', 'to'].map(k => <label key={k} className="field">{LABEL[k]}<input type="date" value={d[k]} onChange={set(k)} /></label>)}
    </Sheet>);
}

// 25 fields in 5 sections (grouping is an assumption). [key, label, type, flags] r=required o=read-only
const SECTIONS = [
  ['Identity', [['name', 'Full name', 'text', 'r'], ['studentId', 'Student ID', 'text', 'o'], ['dob', 'Date of birth', 'date'], ['gender', 'Gender', 'select'], ['photo', 'Photo', 'file']]],
  ['Academic', [['cls', 'Class', 'select', 'r'], ['section', 'Section', 'select', 'r'], ['rollNo', 'Roll number', 'text'], ['admitted', 'Admission date', 'date'], ['status', 'Status', 'select']]],
  ['Guardian', [['guardian', 'Guardian name', 'text', 'r'], ['relation', 'Relationship', 'select'], ['phone', 'Phone', 'tel', 'r'], ['altPhone', 'Alternate phone', 'tel'], ['gEmail', 'Guardian email', 'email']]],
  ['Contact', [['address', 'Address', 'area'], ['city', 'City', 'text'], ['postcode', 'Postcode', 'text'], ['email', 'Student email', 'email'], ['emergency', 'Emergency phone', 'tel']]],
  ['Health & other', [['blood', 'Blood group', 'select'], ['allergies', 'Allergies', 'text'], ['medical', 'Medical notes', 'area'], ['transport', 'Transport route', 'select'], ['notes', 'Admin notes', 'area']]],
];
const TYPE = { tel: { type: 'tel', inputMode: 'tel', autoComplete: 'tel' }, email: { type: 'email', autoComplete: 'email' }, date: { type: 'date' } };
const validate = v => {
  const e = {};
  SECTIONS.forEach(([, fs]) => fs.forEach(([k, l, t, fl = '']) => {
    if (fl.includes('r') && !String(v[k] ?? '').trim()) e[k] = `${l} is required`;
    else if (t === 'tel' && v[k] && !/^\+?[\d\s()-]{7,16}$/.test(v[k])) e[k] = 'Enter a valid phone number';
    else if (t === 'email' && v[k] && !/^\S+@\S+\.\S+$/.test(v[k])) e[k] = 'Enter a valid email address';
  }));
  return e;
};

function Field({ f: [k, label, type, fl = ''], v, err, onChange, options }) {
  const id = 'f-' + k, on = e => onChange(k, e.target.value);
  const p = { id, name: k, readOnly: fl.includes('o'), 'aria-required': fl.includes('r'), 'aria-invalid': !!err, 'aria-describedby': err ? 'e-' + k : undefined };
  return (
    <div className="field">
      <label htmlFor={id}>{label}{fl.includes('r') && ' *'}</label>
      {type === 'select' ? <select {...p} value={v ?? ''} onChange={on}><option value="">Select…</option>{(options[k] || []).map(o => <option key={o}>{o}</option>)}</select>
        : type === 'area' ? <textarea {...p} rows={3} value={v ?? ''} onChange={on} />
        : type === 'file' ? <input {...p} type="file" accept="image/*" onChange={e => onChange(k, e.target.files[0])} />
        : <input {...p} {...(TYPE[type] || { type: 'text' })} value={v ?? ''} onChange={on} />}
      {err && <span id={'e-' + k} className="err">{err}</span>}
    </div>);
}

function EditStudent({ student, options, onSave, onClose }) {   // full-screen route in production (/students/:id/edit)
  const [v, setV] = useState(student), [err, setErr] = useState({}), [open, setOpen] = useState({ Identity: true });
  const [saving, setSaving] = useState(false), [leave, setLeave] = useState(false), head = useRef(null);
  const dirty = Object.keys(v).some(k => v[k] !== student[k]);
  const set = (k, val) => { setV(p => ({ ...p, [k]: val })); setErr(p => ({ ...p, [k]: undefined })); };
  const tryClose = () => (dirty ? setLeave(true) : onClose());
  useEffect(() => { head.current.focus(); }, []);                 // heading, not an input: avoids popping the keyboard
  useEffect(() => { const k = e => e.key === 'Escape' && !leave && tryClose(); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); });
  async function submit(e) {
    e.preventDefault();
    const errs = validate(v), bad = Object.keys(errs);
    setErr(errs);
    if (bad.length) {                                              // expand sections with errors, focus the first
      setOpen(o => ({ ...o, ...Object.fromEntries(SECTIONS.filter(([, fs]) => fs.some(f => errs[f[0]])).map(([n]) => [n, true])) }));
      requestAnimationFrame(() => document.getElementById('f-' + bad[0])?.focus());
      return;
    }
    setSaving(true);
    try { await onSave(v); onClose(); } catch (x) { setErr({ _form: x.message || 'Could not save. Your changes are kept.' }); setSaving(false); }
  }
  return (<>
    <div className="edit" role="dialog" aria-modal="true" aria-labelledby="edit-h">
      <header className="top bar" inert={leave}><button aria-label="Back" onClick={tryClose}>←</button><h1 id="edit-h" ref={head} tabIndex={-1}>Edit student</h1></header>
      <form className="edit-form" noValidate inert={leave} onSubmit={submit}
        onBlur={e => e.target.name && setErr(p => ({ ...p, [e.target.name]: validate(v)[e.target.name] }))}
        onFocus={e => e.target.scrollIntoView?.({ block: 'center' })}>
        {err._form && <p role="alert" className="err pad">{err._form}</p>}
        {SECTIONS.map(([name, fs]) => {
          const n = fs.filter(f => err[f[0]]).length, id = 'sec-' + name.replace(/\W/g, '');
          return (
            <section key={name} className="sec">
              <h2><button type="button" className="sec-h" aria-expanded={!!open[name]} aria-controls={id} onClick={() => setOpen(o => ({ ...o, [name]: !o[name] }))}>
                <span>{name}{n > 0 && <span className="err"> · {n} to fix</span>}</span><span aria-hidden="true">{open[name] ? '−' : '+'}</span></button></h2>
              <div id={id} hidden={!open[name]}>{fs.map(f => <Field key={f[0]} f={f} v={v[f[0]]} err={err[f[0]]} onChange={set} options={options} />)}</div>
            </section>);
        })}
        <footer className="edit-foot"><button className="btn" disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save changes'}</button></footer>
      </form>
    </div>
    {leave && <Sheet title="Discard changes?" onClose={() => setLeave(false)} footer={<>
      <button className="btn ghost" onClick={() => setLeave(false)}>Keep editing</button>
      <button className="btn danger" onClick={onClose}>Discard</button></>}><p className="pad">Your edits to {student.name} have not been saved.</p></Sheet>}
  </>);
}

// Props: students[], options{cls,section,status,...}, state 'loading'|'error'|'ready'.
// onDelete(ids) -> Promise<undoFn> (assumes soft delete); onSave(values) -> Promise.
export default function Students({ students, options, state = 'ready', onRetry, onOpen, onSave, onDelete, onMessage }) {
  const [q, setQ] = useState(''), dq = useDeferredValue(q);
  const [filters, setFilters] = useState(EMPTY), [sort, setSort] = useState('name');
  const [selMode, setSelMode] = useState(false), [picked, setPicked] = useState(() => new Set());
  const [ui, setUi] = useState(null), [editing, setEditing] = useState(null), [toast, setToast] = useState(null);
  const rows = useMemo(() => run(students, dq, filters, sort), [students, dq, filters, sort]);
  const chips = Object.entries(filters).filter(([, x]) => x);
  const closeUi = useCallback(() => setUi(null), []);
  const openMore = useCallback(s => setUi({ t: 'more', s }), []);
  const toggle = useCallback(id => { setSelMode(true); setPicked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const endSel = () => { setSelMode(false); setPicked(new Set()); };
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 8000); return () => clearTimeout(t); }, [toast]);
  const del = async ids => {
    closeUi();
    try { const undo = await onDelete(ids); endSel(); setToast({ msg: `${ids.length} deleted`, undo }); }
    catch { setToast({ msg: 'Delete failed. Nothing was removed.' }); }
  };
  return (<>
    <main className="app" inert={!!(ui || editing)} aria-busy={state === 'loading'}>
      <header className="top">
        {selMode ? (
          <div className="bar"><button aria-label="Cancel selection" onClick={endSel}>✕</button><span className="grow">{picked.size} selected</span>
            <button onClick={() => setPicked(new Set(rows.map(r => r.id)))}>Select all</button></div>
        ) : (<>
          <div className="bar"><h1 className="grow">Students <small>{rows.length}</small></h1><button onClick={() => setSelMode(true)}>Select</button></div>
          <div className="bar">
            <input type="search" enterKeyHint="search" aria-label="Search by name, ID or guardian" placeholder="Name, ID or guardian" value={q} onChange={e => setQ(e.target.value)} />
            <button aria-label={`Filter${chips.length ? `, ${chips.length} active` : ''}`} onClick={() => setUi({ t: 'filter' })}>Filter{chips.length > 0 && <b className="badge">{chips.length}</b>}</button>
            <button aria-label={`Sort, currently ${SORTS[sort]}`} onClick={() => setUi({ t: 'sort' })}>Sort</button>
          </div>
          {chips.length > 0 && <div className="chips">{chips.map(([k, x]) =>
            <button key={k} className="chip" aria-label={`Remove filter ${LABEL[k]} ${x}`} onClick={() => setFilters(f => ({ ...f, [k]: '' }))}>{LABEL[k]}: {x} ✕</button>)}</div>}
        </>)}
      </header>
      <p className="sr" role="status">{selMode ? `${picked.size} selected` : ''}</p>
      {state === 'loading' && [...Array(8)].map((_, i) => <div key={i} className="skel" />)}
      {state === 'error' && <div className="empty" role="alert"><p>Couldn’t load students.</p><button className="btn" onClick={onRetry}>Try again</button></div>}
      {state === 'ready' && (rows.length
        ? <ul className="list">{rows.map(s => <Row key={s.id} s={s} selecting={selMode} selected={picked.has(s.id)} onOpen={onOpen} onToggle={toggle} onMore={openMore} />)}</ul>
        : <div className="empty"><p>{students.length ? 'No students match.' : 'No students yet.'}</p>
            {students.length > 0 && <button className="btn ghost" onClick={() => { setFilters(EMPTY); setQ(''); }}>Clear search and filters</button>}</div>)}
      {selMode && <nav className="bulk" aria-label="Bulk actions">
        <button disabled={!picked.size} onClick={() => onMessage([...picked])}>Message</button>
        <button className="bad" disabled={!picked.size} onClick={() => setUi({ t: 'del', ids: [...picked] })}>Delete</button></nav>}
    </main>
    {ui?.t === 'filter' && <FilterSheet initial={filters} options={options} count={d => run(students, dq, d, sort).length} onApply={f => { setFilters(f); closeUi(); }} onClose={closeUi} />}
    {ui?.t === 'sort' && <Sheet title="Sort by" onClose={closeUi}>{Object.entries(SORTS).map(([k, l]) =>
      <label key={k} className="opt"><input type="radio" name="sort" checked={sort === k} onChange={() => { setSort(k); closeUi(); }} />{l}</label>)}</Sheet>}
    {ui?.t === 'more' && <Sheet title={ui.s.name} onClose={closeUi}>
      {[['View', () => onOpen(ui.s)], ['Edit', () => setEditing(ui.s)], ['Message guardian', () => onMessage([ui.s.id])]].map(([l, fn]) =>
        <button key={l} className="opt" onClick={() => { closeUi(); fn(); }}>{l}</button>)}
      <button className="opt bad" onClick={() => setUi({ t: 'del', ids: [ui.s.id] })}>Delete…</button></Sheet>}
    {ui?.t === 'del' && <Sheet title={`Delete ${ui.ids.length} student${ui.ids.length > 1 ? 's' : ''}?`} onClose={closeUi} footer={<>
      <button className="btn ghost" onClick={closeUi}>Cancel</button><button className="btn danger" onClick={() => del(ui.ids)}>Delete</button></>}>
      <p className="pad">You can undo right after.</p></Sheet>}
    {editing && <EditStudent student={editing} options={options} onSave={onSave} onClose={() => setEditing(null)} />}
    {toast && <div className="toast" role="status">{toast.msg}{toast.undo && <button onClick={() => { toast.undo(); setToast(null); }}>Undo</button>}</div>}
  </>);
}
