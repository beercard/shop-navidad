"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Campaign = { id: string; name: string };
type Location = { id: string; slug: string; name: string; sector: string | null; active: boolean; campaign: { id: string; name: string } | null; _count: { events: number } };
type Merchant = { id: string; slug: string; name: string; sector: string | null; active: boolean; users?: { user: { id: string; name: string; email: string; active: boolean } }[]; prizes: { prizeId: string }[]; _count: { users: number; prizes: number; redemptions: number } };
type User = { id: string; name: string; email: string; active: boolean };
type Prize = { id: string; name: string };
const NO_ASSIGNED_USERS: NonNullable<Merchant["users"]> = [];

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store", headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Error ${response.status}`);
  return data as T;
}

export function LocationsManager({ shopping, campaigns }: { shopping: string; campaigns: Campaign[] }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    try { setError(""); setLocations((await call<{ locations: Location[] }>(`/api/admin/locations?shoppingSlug=${shopping}`)).locations); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron cargar las ubicaciones."); }
  }, [shopping]);
  useEffect(() => { void load(); }, [load]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const data = new FormData(event.currentTarget);
    try {
      await call("/api/admin/locations", { method: "POST", body: JSON.stringify({ shoppingSlug: shopping, slug: data.get("slug"), name: data.get("name"), sector: data.get("sector") || null, campaignId: data.get("campaignId") || null }) });
      event.currentTarget.reset(); setNotice("Ubicación registrada. Ya podés crear un enlace NFC o QR con su slug."); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar la ubicación."); }
    finally { setBusy(false); }
  }
  async function toggle(location: Location) {
    setBusy(true); setError(""); setNotice("");
    try { await call(`/api/admin/locations/${location.id}`, { method: "PATCH", body: JSON.stringify({ shoppingSlug: shopping, active: !location.active }) }); setNotice(`Ubicación ${location.active ? "desactivada" : "activada"}.`); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo actualizar la ubicación."); }
    finally { setBusy(false); }
  }
  return <>
    <section className="panel"><h2>Nueva ubicación NFC / QR</h2><p className="pending-note">Cada ubicación tiene una dirección pública propia. El QR no contiene permisos; solo identifica el shopping y el cartel.</p><form onSubmit={save}><div className="form-grid"><label>Slug del enlace<input name="slug" required minLength={2} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="patio-central"/></label><label>Nombre visible<input name="name" required minLength={2} maxLength={120} placeholder="Patio central"/></label><label>Sector<input name="sector" maxLength={120} placeholder="Planta baja"/></label><label>Campaña<select name="campaignId" defaultValue=""><option value="">Usar campaña vigente automáticamente</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></label></div><button className="primary" disabled={busy}>{busy ? "Guardando…" : "Registrar ubicación"}</button></form>{error && <p role="alert" className="error-text">{error}</p>}{notice && <p role="status" className="success-text">{notice}</p>}</section>
    <section className="panel"><h2>Ubicaciones de {shopping === "centenario" ? "Centenario Shopping" : "UniPlaza Shopping"}</h2>{!locations.length ? <p className="empty">Todavía no hay ubicaciones.</p> : locations.map((item) => <article className="list-row" key={item.id}><div><b>{item.name}</b><small>/{item.slug} · {item.sector || "Sin sector"} · {item.campaign?.name || "Campaña vigente"} · {item._count.events} visitas registradas</small><small>Ruta pública: /nfc/{shopping}/{item.slug}</small></div><div className="row-actions">{item.active && <a className="secondary" href={`/api/admin/locations/${item.id}/qr?shoppingSlug=${shopping}`}>Descargar QR SVG</a>}<span className={`badge ${item.active ? "on" : ""}`}>{item.active ? "Activa" : "Pausada"}</span><button className="secondary" disabled={busy} onClick={() => void toggle(item)}>{item.active ? "Desactivar" : "Activar"}</button></div></article>)}</section>
  </>;
}

export function MerchantsManager({ shopping, canAssignUsers }: { shopping: string; canAssignUsers: boolean }) {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [slug, setSlug] = useState(""); const [name, setName] = useState(""); const [sector, setSector] = useState("");
  const load = useCallback(async () => {
    try {
      setError("");
      const [merchantData, userData, prizeData] = await Promise.all([
        call<{ merchants: Merchant[] }>(`/api/admin/merchants?shoppingSlug=${shopping}`),
        canAssignUsers ? call<{ users: User[] }>(`/api/admin/merchant-validators?shoppingSlug=${shopping}`) : Promise.resolve({ users: [] as User[] }),
        call<{ prizes: Prize[] }>(`/api/admin/prizes?shoppingSlug=${shopping}`),
      ]);
      setMerchants(merchantData.merchants); setUsers(userData.users); setPrizes(prizeData.prizes);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron cargar los comercios."); }
  }, [shopping, canAssignUsers]);
  useEffect(() => { void load(); }, [load]);
  async function create(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try { await call("/api/admin/merchants", { method: "POST", body: JSON.stringify({ shoppingSlug: shopping, slug, name, sector: sector || null }) }); setSlug(""); setName(""); setSector(""); setNotice("Comercio creado."); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo crear el comercio."); }
    finally { setBusy(false); }
  }
  async function assign(merchant: Merchant, kind: "users" | "prizes", ids: string[]) {
    setBusy(true); setError(""); setNotice("");
    const endpoint = kind === "users" ? "users" : "prizes";
    const key = kind === "users" ? "userIds" : "prizeIds";
    try { await call(`/api/admin/merchants/${merchant.id}/${endpoint}`, { method: "PUT", body: JSON.stringify({ shoppingSlug: shopping, [key]: ids }) }); setNotice(kind === "users" ? "Validadores asignados." : "Premios habilitados para este comercio."); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar la asignación."); }
    finally { setBusy(false); }
  }
  async function toggle(merchant: Merchant) {
    setBusy(true); setError(""); setNotice("");
    try { await call(`/api/admin/merchants/${merchant.id}`, { method: "PATCH", body: JSON.stringify({ shoppingSlug: shopping, active: !merchant.active }) }); setNotice(`Comercio ${merchant.active ? "desactivado" : "activado"}.`); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo actualizar el comercio."); }
    finally { setBusy(false); }
  }
  return <>
    <section className="panel"><h2>Nuevo comercio validador</h2><form onSubmit={create}><div className="form-grid"><label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={120}/></label><label>Slug<input value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase())} required minLength={2} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="jugueteria-centro"/></label><label>Sector<input value={sector} onChange={(event) => setSector(event.target.value)} maxLength={120}/></label></div><button className="primary" disabled={busy}>{busy ? "Guardando…" : "Crear comercio"}</button></form></section>
    {error && <section className="panel" role="alert">{error}</section>}{notice && <section className="panel" role="status">{notice}</section>}
    {!merchants.length ? <section className="panel empty">No hay comercios registrados para este shopping.</section> : merchants.map((merchant) => <MerchantRow key={merchant.id} merchant={merchant} users={users} prizes={prizes} canAssignUsers={canAssignUsers} busy={busy} onAssign={assign} onToggle={toggle}/>)}
  </>;
}

function MerchantRow({ merchant, users, prizes, canAssignUsers, busy, onAssign, onToggle }: { merchant: Merchant; users: User[]; prizes: Prize[]; canAssignUsers: boolean; busy: boolean; onAssign: (merchant: Merchant, kind: "users" | "prizes", ids: string[]) => void; onToggle: (merchant: Merchant) => void }) {
  const assignedUsers = merchant.users ?? NO_ASSIGNED_USERS;
  const [userIds, setUserIds] = useState(assignedUsers.map(({ user }) => user.id));
  const [prizeIds, setPrizeIds] = useState(merchant.prizes.map(({ prizeId }) => prizeId));
  useEffect(() => { setUserIds(assignedUsers.map(({ user }) => user.id)); setPrizeIds(merchant.prizes.map(({ prizeId }) => prizeId)); }, [merchant, assignedUsers]);
  return <section className="panel"><div className="panel-head"><div><h2>{merchant.name}</h2><p className="pending-note">/{merchant.slug} · {merchant.sector || "Sin sector"} · {merchant._count.redemptions} canjes</p></div><button className="secondary" disabled={busy} onClick={() => onToggle(merchant)}>{merchant.active ? "Desactivar" : "Activar"}</button></div>
    <fieldset className="scope-options"><legend>Validadoras y validadores</legend>{canAssignUsers ? users.length ? users.map((user) => <label key={user.id}><input type="checkbox" checked={userIds.includes(user.id)} disabled={!merchant.active || busy} onChange={(event) => setUserIds((current) => event.target.checked ? [...current, user.id] : current.filter((id) => id !== user.id))}/>{user.name} · {user.email}</label>) : <p className="pending-note">No hay usuarios validadores activos asignados a este shopping. Crealos en Usuarios y roles.</p> : <p className="pending-note">Solo el superadministrador puede asignar cuentas validadoras a un comercio.</p>}{canAssignUsers && <button type="button" className="secondary" disabled={!merchant.active || busy} onClick={() => onAssign(merchant, "users", userIds)}>Guardar validadores</button>}</fieldset>
    <fieldset className="scope-options"><legend>Premios que se pueden canjear aquí</legend>{prizes.length ? prizes.map((prize) => <label key={prize.id}><input type="checkbox" checked={prizeIds.includes(prize.id)} disabled={!merchant.active || busy} onChange={(event) => setPrizeIds((current) => event.target.checked ? [...current, prize.id] : current.filter((id) => id !== prize.id))}/>{prize.name}</label>) : <p className="pending-note">No hay premios registrados para este shopping.</p>}<button type="button" className="secondary" disabled={!merchant.active || busy} onClick={() => onAssign(merchant, "prizes", prizeIds)}>Guardar premios habilitados</button></fieldset>
  </section>;
}
