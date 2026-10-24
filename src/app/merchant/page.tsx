"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { brandCssVariables, getShoppingBrand, type ShoppingBrandId } from "@/lib/brand";
import { AlertIcon, CheckIcon, ClockIcon, KeyboardIcon, ListIcon, LogoutIcon, ScanIcon, ShieldIcon, SpinnerIcon, WifiOffIcon } from "./icons";
import { haptics } from "./haptics";
import { QrScanner } from "./qr-scanner";
import styles from "./merchant.module.css";

type MerchantSession = { user: { id: string; name: string }; merchant: { id: string; slug: string; name: string; shopping: { slug: ShoppingBrandId; name: string } } };
type Preview = { prize: { name: string; description: string | null }; campaign: string; expiresAt: string; maskedCode: string };
type Redeemed = { ok: true; prize: { name: string }; campaign: string; redeemedAt: string; maskedCode?: string; alreadyRedeemed?: boolean };
type HistoryRow = { id: string; maskedCode: string; redeemedAt: string | null; prize: { name: string }; campaign: { name: string }; redeemedBy: { name: string } | null };
type HistoryResponse = { merchant: { name: string; shoppingName: string }; todayCount: number; redemptions: HistoryRow[] };
type Screen = "validate" | "history" | "security";
type Range = "all" | "week" | "today";

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(" ");

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store", headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No pudimos completar la operación.");
  return data as T;
}

function localDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function displayDate(value: string | null) {
  return value ? new Date(value).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) : "—";
}

/** Normaliza igual que el servidor: sin espacios y en mayúsculas. La validación real sigue siendo la del backend. */
function normalizeCode(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}
const CODE_PATTERN = /^[A-Z0-9-]{8,40}$/;

function readCouponFromQr(value: string) {
  const raw = value.trim();
  let candidate = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      candidate = url.searchParams.get("code") || url.searchParams.get("coupon") || "";
    } catch { return null; }
  }
  const normalized = normalizeCode(candidate);
  return CODE_PATTERN.test(normalized) ? normalized : null;
}

function Notice({ kind, children, title }: { kind: "error" | "success" | "info"; children: React.ReactNode; title?: string }) {
  const Icon = kind === "success" ? CheckIcon : kind === "error" ? AlertIcon : ClockIcon;
  return <div className={styles.notice} data-kind={kind} role={kind === "error" ? "alert" : "status"}><Icon width={20} height={20} /><div>{title && <strong>{title}</strong>}{children}</div></div>;
}

export default function MerchantPage() {
  const [session, setSession] = useState<MerchantSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<Redeemed | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [range, setRange] = useState<Range>("all");
  const [screen, setScreen] = useState<Screen>("validate");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const [historyBusy, setHistoryBusy] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [notice, setNotice] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const shopping = session?.merchant.shopping.slug;
  const brand = useMemo(() => shopping ? getShoppingBrand(shopping) : getShoppingBrand("centenario"), [shopping]);
  const brandStyle = useMemo(() => brandCssVariables(brand) as CSSProperties, [brand]);
  const view = scannerOpen ? "scan" : result ? "result" : preview ? "confirm" : screen;
  const focusedFlow = view === "scan" || view === "confirm" || view === "result";

  const loadHistory = useCallback(async (selectedRange: Range = range) => {
    if (!session) return;
    setHistoryBusy(true);
    setHistoryError("");
    const params = new URLSearchParams();
    if (selectedRange === "today") params.set("from", localDate());
    if (selectedRange === "week") params.set("from", localDate(6));
    try {
      const query = params.toString();
      const data = await api<HistoryResponse>("/api/merchant/coupons/history" + (query ? "?" + query : ""));
      setHistory(data.redemptions);
      setTodayCount(data.todayCount);
    } catch (cause) {
      setHistoryError(cause instanceof Error ? cause.message : "No pudimos cargar el historial.");
    } finally { setHistoryBusy(false); }
  }, [range, session]);

  const loadSession = useCallback(async () => {
    const data = await api<MerchantSession>("/api/merchant/session");
    if (!data.merchant) throw new Error("La cuenta no tiene un único comercio activo asignado. Contactá al administrador.");
    setSession(data);
    return data;
  }, []);

  useEffect(() => {
    let active = true;
    api<MerchantSession>("/api/merchant/session").then((data) => {
      if (!active) return;
      if (!data.merchant) throw new Error("La cuenta no tiene un único comercio activo asignado. Contactá al administrador.");
      setSession(data);
    }).catch(() => { if (active) setSession(null); }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setOnline(navigator.onLine);
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  useEffect(() => {
    if (session) void loadHistory("all");
  }, [session, loadHistory]);

  useEffect(() => {
    if (session && screen === "history") void loadHistory(range);
  }, [session, screen, range, loadHistory]);

  // Al cambiar de pantalla el foco pasa al título: lector de pantalla y teclado siguen el flujo.
  useEffect(() => {
    if (session) headingRef.current?.focus({ preventScroll: false });
  }, [view, session]);

  useEffect(() => {
    if (manualOpen && view === "validate") codeInputRef.current?.focus();
  }, [manualOpen, view]);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      await loadSession();
      setPassword("");
      setError("");
      setScreen("validate");
    } catch (cause) {
      await api("/api/auth/logout", { method: "POST" }).catch(() => undefined);
      setSession(null);
      setError(cause instanceof Error ? cause.message : "No se pudo iniciar sesión. Revisá los datos e intentá de nuevo.");
    } finally { setBusy(false); }
  }

  async function signOut() {
    setBusy(true);
    try { await api("/api/auth/logout", { method: "POST" }); }
    finally {
      setSession(null); setPreview(null); setResult(null); setHistory([]); setCode(""); setNotice(""); setError(""); setManualOpen(false); setBusy(false);
    }
  }

  async function lookup(value = code) {
    if (!session || busy) return;
    const normalized = normalizeCode(value);
    if (!CODE_PATTERN.test(normalized)) { setCodeError("Ingresá el código completo: entre 8 y 40 letras, números o guiones."); setManualOpen(true); return; }
    setCodeError("");
    if (!navigator.onLine) { setError("No hay conexión. Conectate para consultar el cupón: no se puede confirmar un canje sin validarlo en línea."); return; }
    setBusy(true); setError(""); setNotice(""); setPreview(null); setResult(null); setCode(normalized);
    try {
      const data = await api<{ valid: true } & Preview>("/api/merchant/coupons/lookup", { method: "POST", body: JSON.stringify({ code: normalized }) });
      setPreview(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos verificar el código. Revisalo e intentá otra vez.");
      haptics.error();
      setManualOpen(true);
    } finally { setBusy(false); }
  }

  function handleQr(value: string) {
    const coupon = readCouponFromQr(value);
    setScannerOpen(false);
    if (!coupon) { setError("El QR no contiene un código de cupón válido. Probá con el QR del premio o ingresá el código manualmente."); return; }
    setCode(coupon);
    void lookup(coupon);
  }

  async function redeem() {
    if (!session || !preview || busy || !online) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const data = await api<Redeemed>("/api/merchant/coupons/redeem", { method: "POST", body: JSON.stringify({ code }) });
      setResult({ ...data, maskedCode: preview.maskedCode });
      haptics.success();
      setPreview(null);
      setCode("");
      setManualOpen(false);
      void loadHistory("all");
    } catch (cause) {
      haptics.error();
      setError((cause instanceof Error ? cause.message : "No recibimos la confirmación.") + " No entregues el premio hasta ver la confirmación. Podés reintentar: el servidor evita duplicar el canje.");
    } finally { setBusy(false); }
  }

  function backToScanner() {
    setPreview(null); setResult(null); setError(""); setNotice(""); setCode(""); setCodeError(""); setScreen("validate");
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setError(""); setNotice(""); setPasswordChanged(false); setPasswordBusy(true);
    try {
      await api("/api/auth/password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) });
      setCurrentPassword(""); setNewPassword(""); setPasswordChanged(true);
      setNotice("Contraseña actualizada. La sesión segura sigue activa en este dispositivo.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cambiar la contraseña."); }
    finally { setPasswordBusy(false); }
  }

  const connection = <span className={styles.connection} data-online={online} role="status">{online ? "En línea" : "Sin conexión"}</span>;
  const offlineBar = !online && <div className={styles.offlineBar} role="status"><WifiOffIcon width={20} height={20} /><span><strong>Sin conexión.</strong> No se puede consultar ni canjear hasta que vuelva internet. Cuando se recupere, podés seguir desde acá.</span></div>;

  if (checking) return <main className={styles.page} style={brandStyle}><div className={styles.fullPageState} role="status">Comprobando la sesión segura…</div></main>;

  if (!session) return <main className={styles.page} style={brandStyle} data-shopping="centenario">
    <header className={styles.header}><div className={styles.headerInner}><span className={styles.brand}><span className={styles.brandMark} aria-hidden="true">✳</span><span className={styles.brandName}>Navidad Mágica</span></span>{connection}</div></header>
    <div className={styles.loginWrap}>
      <div className={styles.loginMark} aria-hidden="true">✳</div>
      <h1 className={styles.loginTitle}>Portal de comercios</h1>
      <p className={styles.loginLead}>Ingresá con la cuenta de tu local para validar los premios de Navidad Mágica.</p>
      {offlineBar}
      {error && <Notice kind="error">{error}</Notice>}
      <form className={styles.form} onSubmit={signIn}>
        <label className={styles.field}>Correo<input className={styles.input} type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className={styles.field}>Contraseña<input className={styles.input} type="password" autoComplete="current-password" maxLength={200} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button className={cx(styles.button, styles.buttonPrimary, styles.buttonWide, styles.buttonBig)} type="submit" disabled={busy || !online}>{busy && <SpinnerIcon className={styles.spin} />}{busy ? "Ingresando…" : "Ingresar"}</button>
      </form>
      <p className={styles.reassure}>La sesión queda protegida en este dispositivo por hasta 8 horas. Si olvidaste la contraseña, pedile al administrador del shopping que restablezca el acceso.</p>
    </div>
  </main>;

  const scanDisabled = !online || busy;

  return <div className={styles.page} style={brandStyle} data-shopping={shopping}>
    <header className={styles.header}><div className={styles.headerInner}><span className={styles.brand}><span className={styles.brandMark} aria-hidden="true">✳</span><span className={styles.brandName}>Navidad Mágica</span></span>{connection}</div></header>
    <div className={styles.shell} data-bar={view === "confirm" || view === "result"}>
      {offlineBar}

      {view === "validate" && <div className={styles.stack}>
        <section className={styles.identity} aria-labelledby="merchant-title">
          <p className={styles.shopping}>{session.merchant.shopping.name}</p>
          <h1 id="merchant-title" ref={headingRef} tabIndex={-1} className={cx(styles.title, styles.focusTarget)}>{session.merchant.name}</h1>
          <p className={styles.account}><span>Cuenta {session.user.name}</span><button className={styles.textButton} type="button" disabled={busy} onClick={() => void signOut()}><LogoutIcon width={16} height={16} />Cerrar sesión</button></p>
        </section>

        <div className={styles.todayRow}>
          <p><span className={styles.todayCount}>{todayCount}</span>Canjes de hoy</p>
          <button className={styles.textButton} type="button" onClick={() => setScreen("history")}>Ver canjes</button>
        </div>

        <div className={styles.actions}>
        {error && <Notice kind="error">{error}</Notice>}
        {notice && <Notice kind="success">{notice}</Notice>}

        <button className={styles.scanButton} type="button" disabled={scanDisabled} onClick={() => { setError(""); setScannerOpen(true); }}><ScanIcon />Escanear QR</button>
        <button className={styles.manualToggle} type="button" aria-expanded={manualOpen} aria-controls="manual-form" disabled={busy} onClick={() => { setError(""); setManualOpen((open) => !open); }}><KeyboardIcon width={22} height={22} />Ingresar código manualmente</button>

        {manualOpen && <form id="manual-form" className={styles.manualForm} onSubmit={(event) => { event.preventDefault(); void lookup(); }} noValidate>
          <label className={styles.field} htmlFor="manual-code">Código del cupón</label>
          <input ref={codeInputRef} id="manual-code" className={cx(styles.input, styles.codeInput)} type="text" inputMode="text" enterKeyHint="go" autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={48} placeholder="ABCD-EFGH-JKLM-NPQR" value={code} aria-invalid={Boolean(codeError)} aria-describedby={codeError ? "code-error" : "code-hint"} onChange={(event) => { setCode(event.target.value.toUpperCase()); setCodeError(""); setError(""); }} />
          {codeError ? <p id="code-error" className={styles.hint} style={{ color: "var(--state-danger-ink)", fontWeight: 600 }} role="alert">{codeError}</p> : <small id="code-hint" className={styles.hint}>Podés escribirlo con o sin guiones ni espacios.</small>}
          <button className={cx(styles.button, styles.buttonPrimary, styles.buttonWide)} type="submit" disabled={busy || !online}>{busy && <SpinnerIcon className={styles.spin} />}{busy ? "Consultando al servidor…" : "Consultar cupón"}</button>
        </form>}

        <p className={styles.reassure}>Primero consultamos el premio. El canje solo se registra cuando lo confirmás.</p>
        </div>
      </div>}

      {view === "scan" && <QrScanner onCode={handleQr} onClose={() => setScannerOpen(false)} onError={setError} />}

      {view === "confirm" && preview && <>
        <section className={styles.ticket} aria-labelledby="confirm-title">
          <p className={styles.ticketStatus}><ShieldIcon width={20} height={20} />Cupón válido para {session.merchant.name}</p>
          <h1 id="confirm-title" ref={headingRef} tabIndex={-1} className={cx(styles.ticketPrize, styles.focusTarget)}>{preview.prize.name}</h1>
          {preview.prize.description && <p className={styles.ticketText}>{preview.prize.description}</p>}
          <div className={styles.ticketRule} aria-hidden="true" />
          <dl className={styles.facts}>
            <div><dt>Campaña</dt><dd>{preview.campaign}</dd></div>
            <div><dt>Vence</dt><dd>{displayDate(preview.expiresAt)}</dd></div>
            <div><dt>Cupón</dt><dd className={styles.mono}>{preview.maskedCode}</dd></div>
          </dl>
        </section>
        {error && <Notice kind="error" title="No se confirmó el canje">{error}</Notice>}
        <p className={styles.reassure}>Entregá el premio solo después de ver la confirmación del servidor.</p>
        <div className={styles.actionBar}>
          <button className={cx(styles.button, styles.buttonPrimary, styles.buttonWide, styles.buttonBig)} type="button" disabled={busy || !online} onClick={() => void redeem()}>{busy ? <SpinnerIcon className={styles.spin} /> : <CheckIcon />}{busy ? "Confirmando en el servidor…" : "Confirmar canje"}</button>
          <button className={styles.textButton} style={{ justifyContent: "center", marginLeft: 0 }} type="button" disabled={busy} onClick={backToScanner}>Cancelar y volver al escáner</button>
        </div>
      </>}

      {view === "result" && result && <>
        <section className={styles.ticket} aria-labelledby="success-title" role="status">
          <div className={styles.badgeOk}><CheckIcon /></div>
          <h1 id="success-title" ref={headingRef} tabIndex={-1} className={cx(styles.ticketPrize, styles.focusTarget)}>Cupón canjeado correctamente</h1>
          <p className={styles.ticketText}>{result.alreadyRedeemed ? "Este canje ya estaba confirmado por tu cuenta; no se duplicó." : "El servidor confirmó el canje. Ya podés entregar el premio."}</p>
          <div className={styles.ticketRule} aria-hidden="true" />
          <dl className={styles.facts}>
            <div><dt>Premio</dt><dd>{result.prize.name}</dd></div>
            <div><dt>Fecha y hora</dt><dd><time dateTime={result.redeemedAt}>{displayDate(result.redeemedAt)}</time></dd></div>
            <div><dt>Cupón</dt><dd className={styles.mono}>{result.maskedCode || "••••-••••"}</dd></div>
          </dl>
        </section>
        <div className={styles.actionBar}>
          <button className={cx(styles.button, styles.buttonPrimary, styles.buttonWide, styles.buttonBig)} type="button" onClick={backToScanner}><ScanIcon />Validar otro cupón</button>
        </div>
      </>}

      {view === "history" && <section aria-labelledby="history-title">
        <h1 id="history-title" ref={headingRef} tabIndex={-1} className={cx(styles.sectionTitle, styles.focusTarget)}>Historial de canjes</h1>
        <p className={styles.hint}>Solo canjes confirmados por {session.merchant.name}.</p>
        <div className={styles.historyControls}><label htmlFor="history-range" className={styles.field}>Período</label><select id="history-range" className={styles.select} value={range} onChange={(event) => setRange(event.target.value as Range)}><option value="all">Todos</option><option value="week">Últimos 7 días</option><option value="today">Hoy</option></select></div>
        {historyError && <Notice kind="error">{historyError} <button type="button" className={styles.textButton} onClick={() => void loadHistory(range)}>Reintentar</button></Notice>}
        {historyBusy && !history.length ? <div role="status" aria-label="Cargando canjes" style={{ display: "grid", gap: 10 }}><div className={styles.skeleton} /><div className={styles.skeleton} /><div className={styles.skeleton} /></div>
          : !history.length ? <div className={styles.empty}><strong>Todavía no hay canjes en este período</strong>Los canjes que confirmes en este local van a aparecer acá.</div>
            : <ul className={styles.historyList}>{history.map((item) => <li className={styles.historyItem} key={item.id}>
              <div className={styles.historyTop}><span className={styles.historyPrize}>{item.prize.name}</span><span className={styles.chip}><CheckIcon />Confirmado</span></div>
              <time className={styles.historyMeta} dateTime={item.redeemedAt ?? undefined}>{displayDate(item.redeemedAt)}</time>
              <span className={styles.historyMeta}>Cupón <span className={styles.mono}>{item.maskedCode}</span> · {item.redeemedBy?.name ?? "Cuenta de comercio"}</span>
            </li>)}</ul>}
      </section>}

      {view === "security" && <section aria-labelledby="security-title">
        <h1 id="security-title" ref={headingRef} tabIndex={-1} className={cx(styles.sectionTitle, styles.focusTarget)}>Seguridad</h1>
        <div className={styles.card}>
          <h2>Tu sesión</h2>
          <p>Usa una cookie segura y se cierra a las 8 horas. El administrador puede suspender el acceso o generar una contraseña temporal.</p>
          <button className={cx(styles.button, styles.buttonSecondary, styles.buttonWide)} type="button" disabled={busy} onClick={() => void signOut()}><LogoutIcon />Cerrar sesión</button>
        </div>
        <div className={styles.card}>
          <details className={styles.passwordDisclosure}>
            <summary>Cambiar contraseña</summary>
            <form className={styles.form} onSubmit={changePassword}>
              <label className={styles.field}>Contraseña actual<input className={styles.input} type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} minLength={1} maxLength={200} required /></label>
              <label className={styles.field}>Nueva contraseña<input className={styles.input} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={12} maxLength={200} aria-describedby="password-hint" required /><small id="password-hint">Usá al menos 12 caracteres. No la compartas por este portal.</small></label>
              {error && <Notice kind="error">{error}</Notice>}
              <button className={cx(styles.button, styles.buttonPrimary, styles.buttonWide)} type="submit" disabled={passwordBusy}>{passwordBusy && <SpinnerIcon className={styles.spin} />}{passwordBusy ? "Actualizando…" : "Guardar contraseña"}</button>
              {passwordChanged && <Notice kind="success">{notice}</Notice>}
            </form>
          </details>
        </div>
      </section>}
    </div>

    {!focusedFlow && <nav className={styles.nav} aria-label="Portal de comercios">
      <button type="button" aria-current={screen === "validate" ? "page" : undefined} onClick={() => { setScreen("validate"); setError(""); }}><ScanIcon />Validar</button>
      <button type="button" aria-current={screen === "history" ? "page" : undefined} onClick={() => { setScreen("history"); setError(""); }}><ListIcon />Historial</button>
      <button type="button" aria-current={screen === "security" ? "page" : undefined} onClick={() => { setScreen("security"); setError(""); }}><ShieldIcon />Seguridad</button>
    </nav>}
  </div>;
}
