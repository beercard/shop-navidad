"use client";

import { ReactNode, useEffect, useState } from "react";

export type AdminRole = "SUPERADMIN" | "SHOPPING_OPERATOR" | "MERCHANT_VALIDATOR";
export type ModuleCampaign = { id: string; name: string };
type ShopOption = { slug: string; name: string };
type MerchantOption = { id: string; slug: string; name: string; shopping: { slug: string; name: string } };
type Save = (body: unknown) => void;

function PanelHead({ title, action }: { title: string; action?: ReactNode }) { return <div className="panel-head"><h2>{title}</h2>{action}</div>; }
function Empty({ message }: { message: string }) { return <div className="empty">{message}</div>; }
function Field({ name, label, type = "text", required, defaultValue, minLength, maxLength }: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string; minLength?: number; maxLength?: number }) { return <label>{label}<input name={name} type={type} required={required} defaultValue={defaultValue} minLength={minLength} maxLength={maxLength}/></label>; }
function asDateInput(date: Date) { return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
function toIso(data: FormData, key: string) { const value = data.get(key); return value ? new Date(String(value)).toISOString() : ""; }

export function roleName(role: AdminRole) { return ({ SUPERADMIN: "Administrador general", SHOPPING_OPERATOR: "Operador de shopping", MERCHANT_VALIDATOR: "Comercio validador" })[role]; }

export function CreateAdminUser({ shops, merchants = [], onSave }: { shops: ShopOption[]; merchants?: MerchantOption[]; onSave: Save }) {
  const [role, setRole] = useState<AdminRole>("SHOPPING_OPERATOR");
  return <details className="panel create-panel"><summary>＋ Crear usuario administrativo</summary><form action={(data) => { const merchantIds = data.getAll("merchantIds").map(String); const selectedMerchants = merchants.filter((merchant) => merchantIds.includes(merchant.id)); const shoppingSlugs = role === "SUPERADMIN" ? [] : role === "MERCHANT_VALIDATOR" ? Array.from(new Set(selectedMerchants.map((merchant) => merchant.shopping.slug))) : data.getAll("shoppingSlugs"); onSave({ name: data.get("name"), email: data.get("email"), password: data.get("password"), role, shoppingSlugs, merchantIds: role === "MERCHANT_VALIDATOR" ? merchantIds : [] }); }}>
    <div className="form-grid"><Field name="name" label="Nombre" required/><Field name="email" label="Correo" type="email" required/><Field name="password" label="Contraseña temporal (mínimo 12 caracteres)" type="password" required minLength={12}/><label>Rol<select value={role} onChange={(event) => setRole(event.target.value as AdminRole)}><option value="SUPERADMIN">Administrador general</option><option value="SHOPPING_OPERATOR">Operador de shopping</option><option value="MERCHANT_VALIDATOR">Comercio validador</option></select></label></div>
    {role === "SHOPPING_OPERATOR" && <fieldset className="scope-options"><legend>Acceso a shopping</legend>{shops.map((shop) => <label key={shop.slug}><input type="checkbox" name="shoppingSlugs" value={shop.slug}/>{shop.name}</label>)}</fieldset>}
    {role === "MERCHANT_VALIDATOR" && <label>Comercio asignado<select name="merchantIds" required defaultValue=""><option value="" disabled>Elegí el comercio de esta cuenta</option>{merchants.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name} · {merchant.shopping.name}</option>)}</select><small className="hint">Cada cuenta validadora queda vinculada a un único comercio.</small></label>}
    <button className="primary">Crear usuario</button>
  </form></details>;
}

export function ExperienceSettings({ shopping, initial, onSave }: { shopping: string; initial: Record<string, unknown>; onSave: Save }) {
  return <section className="panel"><PanelHead title="Experiencia pública y marca"/><p className="pending-note">Ajustes independientes de {shopping === "centenario" ? "Centenario Shopping" : "UniPlaza Shopping"}. Los valores se guardan en la configuración del shopping.</p>
    <form action={(data) => { const brandSettings: Record<string, string> = {}; for (const key of ["primary", "accent", "surface", "text", "fontPreset", "publicMessage", "collectionUnlockText"]) { const value = data.get(key); if (value !== null && String(value).trim()) brandSettings[key] = String(value).trim(); } onSave({ shoppingSlug: shopping, brandSettings }); }}>
      <div className="form-grid"><Field name="primary" label="Color principal (HEX)" defaultValue={String(initial.primary ?? "")}/><Field name="accent" label="Color de acento (HEX)" defaultValue={String(initial.accent ?? "")}/><Field name="surface" label="Color de fondo (HEX)" defaultValue={String(initial.surface ?? "")}/><Field name="text" label="Color de texto (HEX)" defaultValue={String(initial.text ?? "")}/><label>Tipografía<select name="fontPreset" defaultValue={String(initial.fontPreset ?? "classic")}><option value="classic">Clásica</option><option value="urban">Urbana</option></select></label><Field name="publicMessage" label="Mensaje público" defaultValue={String(initial.publicMessage ?? "")}/><Field name="collectionUnlockText" label="Mensaje de colección" defaultValue={String(initial.collectionUnlockText ?? "")}/></div><button className="primary">Guardar experiencia</button>
    </form>
  </section>;
}

export function CreateClue({ shopping, campaigns, ensureCampaigns, onSave }: { shopping: string; campaigns: ModuleCampaign[]; ensureCampaigns: () => void; onSave: Save }) {
  useEffect(() => { if (!campaigns.length) ensureCampaigns(); }, [campaigns.length, ensureCampaigns]);
  return <details className="panel create-panel"><summary>＋ Programar pista</summary><form action={(data) => onSave({ shoppingSlug: shopping, campaignId: data.get("campaignId"), text: data.get("text"), startsAt: toIso(data, "startsAt"), endsAt: toIso(data, "endsAt"), active: true })}>
    <div className="form-grid"><label>Campaña<select name="campaignId" required defaultValue=""><option value="" disabled>Elegí una campaña</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></label><Field name="startsAt" label="Visible desde" type="datetime-local" defaultValue={asDateInput(new Date())}/><Field name="endsAt" label="Visible hasta" type="datetime-local" defaultValue={asDateInput(new Date(Date.now() + 86400000))}/><label className="wide-field">Texto de la pista<textarea name="text" required minLength={5} maxLength={1000} rows={3}/></label></div>
    <button className="primary" disabled={!campaigns.length}>Programar pista</button>{!campaigns.length && <small className="hint">Creá primero una campaña.</small>}
  </form></details>;
}

export function ReportsView({ analytics, loading, onRetry, csvHref }: { analytics: Record<string, unknown> | null; loading: boolean; onRetry: () => void; csvHref: string }) {
  const data = (analytics && typeof analytics.analytics === "object" && analytics.analytics ? analytics.analytics : analytics) as Record<string, unknown> | null;
  const entries = Object.entries(data ?? {});
  const scalars = entries.filter(([, value]) => ["number", "string", "boolean"].includes(typeof value));
  const arrays = entries.filter(([, value]) => Array.isArray(value));
  const objects = entries.filter(([, value]) => !!value && typeof value === "object" && !Array.isArray(value));
  return <>
    <section className="panel"><PanelHead title="Informes" action={<a className="secondary" href={csvHref}>Descargar CSV de tarjetas</a>}/><p className="pending-note">Las métricas y desgloses se cargan desde el servidor para el shopping seleccionado.</p>
      {loading && <div className="loading">Cargando informe…</div>}{!loading && !entries.length && <Empty message="No hay estadísticas disponibles para este shopping."/>}
      {scalars.length > 0 && <div className="metric-grid report-metrics">{scalars.map(([key, value]) => <article className="metric" key={key}><span>{label(key)}</span><strong>{String(value)}</strong></article>)}</div>}
      {objects.map(([key, value]) => { const metrics = Object.entries(value as Record<string, unknown>).filter(([, item]) => ["number", "string", "boolean"].includes(typeof item)); return <section className="report-block" key={key}><h3>{label(key)}</h3>{metrics.length ? <div className="metric-grid">{metrics.map(([metric, amount]) => <article className="metric" key={metric}><span>{label(metric)}</span><strong>{String(amount)}</strong></article>)}</div> : <Empty message="Sin métricas en este grupo."/>}</section>; })}
      {arrays.map(([key, value]) => <Breakdown key={key} title={label(key)} rows={value as unknown[]}/>)}
    </section><button className="secondary retry-report" onClick={onRetry}>Actualizar informe</button>
  </>;
}
function label(value: string) { return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase()); }
function Breakdown({ title, rows }: { title: string; rows: unknown[] }) { const records = rows.filter((row): row is Record<string, unknown> => !!row && typeof row === "object" && !Array.isArray(row)); const columns = Array.from(new Set(records.flatMap((row) => Object.keys(row)))); return <section className="report-block"><h3>{title}</h3>{!rows.length ? <Empty message="Sin datos en este período."/> : records.length && columns.length ? <div className="table-wrap stack-sm"><table><thead><tr>{columns.map((column) => <th key={column}>{label(column)}</th>)}</tr></thead><tbody>{records.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column} data-label={label(column)}>{typeof row[column] === "object" ? JSON.stringify(row[column]) : String(row[column] ?? "—")}</td>)}</tr>)}</tbody></table></div> : <p>{rows.map(String).join(", ")}</p>}</section>; }

export async function validateRedeem(shopping: string, code: string) {
  const response = await fetch("/api/redeems/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shoppingSlug: shopping, code: code.trim() }), cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Error " + response.status);
  return payload as { prize?: { name: string; description?: string }; campaign?: string; redeemedAt?: string };
}
