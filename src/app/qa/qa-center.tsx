'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QACardLinks from './qa-card-links';

type ShoppingSlug = 'centenario' | 'uniplaza';
type StatusPayload = {
  isolated: true;
  baseUrl: string | null;
  baseUrlError: string | null;
  shops: { id: string; slug: ShoppingSlug; name: string }[];
  campaigns: { id: string; shoppingId: string; slug: string; name: string; status: string; startsAt: string; endsAt: string }[];
  prizes: { id: string; campaignId: string; shoppingId: string; name: string; totalStock: number; remainingStock: number; weight: number; active: boolean; imageUrl: string | null; details: unknown; campaign: { name: string; slug: string } }[];
  cards: { id: string; campaignId: string; shoppingId: string; publicId: string; status: string; location: string | null; campaign: { name: string; slug: string }; _count: { participations: number } }[];
  runs: { id: string; action: string; entityId: string; createdAt: string; metadata: Record<string, unknown>; actor?: { name: string } | null; shopping?: { slug: ShoppingSlug } | null }[];
  participations: { id: string; status: string; createdAt: string; shoppingId: string; campaign: { name: string; shopping: { slug: ShoppingSlug } }; card: { publicId: string }; prize: { name: string } | null }[];
  redeems: { id: string; status: string; expiresAt: string; redeemedAt: string | null; createdAt: string; campaign: { name: string; shopping: { slug: ShoppingSlug } }; prize: { name: string } }[];
};
type Scenario = { id: string; title: string; description: string };
const scenarios: Scenario[] = [
  { id: 'all-available', title: 'Todos los premios disponibles', description: 'Restituye stock inicial y verifica inventario activo.' },
  { id: 'one-exhausted', title: 'Un premio agotado', description: 'Agota solo la última unidad y comprueba que otros premios sigan disponibles.' },
  { id: 'all-exhausted', title: 'Todos los premios agotados', description: 'Vacía stock y confirma que no se anuncien premios disponibles.' },
  { id: 'server-error', title: 'Error de servidor recuperable', description: 'Verifica la respuesta 503 controlada del entorno QA, sin alterar la campaña.' },
  { id: 'campaign-inactive', title: 'Campaña pausada', description: 'Llama al servicio real de participación y espera CAMPAIGN_CLOSED.' },
  { id: 'campaign-expired', title: 'Campaña vencida', description: 'Prueba en el backend el rechazo fuera de vigencia.' },
  { id: 'cross-tenant-card', title: 'Tarjeta de otro shopping', description: 'Intenta usar la tarjeta QA del shopping opuesto.' },
  { id: 'duplicate-card', title: 'Tarjeta repetida', description: 'Verifica que segundo escaneo no cree otra participación ni colección.' },
  { id: 'collection-complete', title: 'Completar colección', description: 'Participa con las tres tarjetas distintas y comprueba 3/3.' },
  { id: 'last-prize-concurrent', title: 'Dos usuarios · última unidad', description: 'Ejecuta dos participaciones reales simultáneas y comprueba que no haya sobreventa.' },
  { id: 'redeem-cycle', title: 'Canje, repetición y shopping cruzado', description: 'Emite, canjea, repite y prueba el mismo código en el otro shopping.' },
];

export default function QACenter({ adminName }: { adminName: string }) {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [shopping, setShopping] = useState<ShoppingSlug>('centenario');
  const [viewport, setViewport] = useState(390);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [seeding, setSeeding] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/qa/status', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo leer el entorno QA.');
      setData(payload);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo leer el entorno QA.');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  const selected = data?.shops.find((shop) => shop.slug === shopping);
  const campaign = data?.campaigns.find((item) => item.shoppingId === selected?.id && item.slug.startsWith('navidad-demo-')) ?? data?.campaigns.find((item) => item.shoppingId === selected?.id);
  const cards = data?.cards.filter((card) => card.shoppingId === selected?.id) ?? [];
  const demoCards = cards.filter((card) => card.campaign.slug.startsWith('navidad-demo-'));
  const prizes = data?.prizes.filter((prize) => prize.shoppingId === selected?.id) ?? [];
  const runs = data?.runs.filter((run) => !run.shopping?.slug || run.shopping.slug === shopping);
  const counts = useMemo(() => {
    const statuses = (runs ?? []).map((run) => String(run.metadata.status ?? 'PENDING'));
    return { total: scenarios.length, executed: statuses.filter((status) => status !== 'PENDING').length, passed: statuses.filter((status) => status === 'APPROVED').length, failed: statuses.filter((status) => status === 'FAILED').length };
  }, [runs]);

  async function runScenario(id: string) {
    setBusy(id); setError(''); setNotice('');
    try {
      if (id === 'server-error') {
        const response = await fetch('/api/qa/fault', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shoppingSlug: shopping }) });
        const payload = await response.json();
        if (payload.run) await refresh();
        if (response.status !== 503 || payload.run?.status !== 'APPROVED') throw new Error(payload.error ?? 'La prueba no recibió el error 503 esperado.');
        setNotice('Error 503 controlado recibido y registrado. Escenario aprobado.');
        return;
      }
      const response = await fetch('/api/qa/scenarios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shoppingSlug: shopping, scenario: id }) });
      const payload = await response.json();
      if (payload.run) await refresh();
      if (!response.ok) throw new Error(payload.run?.observed?.error ?? payload.error ?? 'La prueba no pasó.');
      setNotice(`${payload.run.scenario}: ${payload.run.status}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo ejecutar el escenario.');
      await refresh();
    } finally { setBusy(''); }
  }

  async function resetFixtures() {
    if (!window.confirm('Esto restablece las campañas, tarjetas, premios, participaciones y canjes de prueba en la base aislada QA. ¿Continuar?')) return;
    setBusy('reset'); setError(''); setNotice('');
    try {
      const response = await fetch('/api/qa/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ confirmation: 'RESET QA' }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'No se pudieron restablecer los fixtures.');
      setNotice('Fixtures QA restablecidos para ambos shoppings.');
      await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo restablecer el entorno.'); }
    finally { setBusy(''); }
  }

  async function seedDemo() {
    if (!window.confirm('Se crearán o actualizarán únicamente registros DEMO en la base aislada QA. Los stocks consumidos y las participaciones se conservan. ¿Continuar?')) return;
    setSeeding(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/qa/demo/seed', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'No se pudieron cargar los datos demo.');
      const counts = payload.result.counts as Record<string, number>;
      setNotice(`Datos DEMO listos: ${counts.prizesCreated + counts.prizesUpdated} premios, ${counts.cardsCreated + counts.cardsUpdated} tarjetas y ${counts.cluesCreated + counts.cluesUpdated} pistas.`);
      await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudieron cargar los datos demo.'); }
    finally { setSeeding(false); }
  }

  const moneyCount = prizes.reduce((sum, prize) => sum + prize.remainingStock, 0);
  const cardLinks = demoCards.map((card) => ({ ...card, shoppingSlug: shopping, shoppingName: selected?.name ?? (shopping === 'centenario' ? 'Centenario Shopping' : 'UniPlaza Shopping') }));
  return <main className="qa-shell">
    <header className="qa-header"><Link href="/" className="qa-brand">✳ Navidad Mágica <span>Centro de QA</span></Link><div><b>Modo de prueba aislado</b><small>Sesión: {adminName}</small></div></header>
    <div className="qa-layout">
      <aside className="qa-sidebar"><p>SHOPPING QA</p>{(['centenario', 'uniplaza'] as ShoppingSlug[]).map((slug) => <button key={slug} className={shopping === slug ? `active ${slug}` : ''} onClick={() => setShopping(slug)}>{slug === 'centenario' ? 'Centenario Shopping' : 'UniPlaza Shopping'}</button>)}<div className="qa-side-note">Las pruebas llaman a los mismos servicios de participación y canje, usando la base separada `QA_DATABASE_URL`.</div><button className="qa-reset" onClick={resetFixtures} disabled={busy !== ''}>{busy === 'reset' ? 'Restableciendo…' : 'Restablecer datos de prueba'}</button></aside>
      <section className="qa-content">
        <div className="qa-title-row"><div><span className="qa-eyebrow">ENTORNO AISLADO · NO PRODUCCIÓN</span><h1>{selected?.name ?? (shopping === 'centenario' ? 'Centenario Shopping' : 'UniPlaza Shopping')}</h1><p>Campaña, inventario, tarjetas y participantes ficticios persistidos solo en la base QA.</p></div><span className="qa-pill">{data?.isolated ? 'BASE AISLADA VERIFICADA' : 'VERIFICANDO'}</span></div>
        {error && <div className="qa-notice error" role="alert">{error}</div>}{notice && <div className="qa-notice success" role="status">{notice}</div>}
        <div className="qa-metrics"><article><small>Escenarios</small><strong>{counts.total}</strong><span>{counts.executed} ejecutados</span></article><article><small>Aprobados</small><strong>{counts.passed}</strong><span>por comparación esperada/observada</span></article><article><small>Fallidos</small><strong>{counts.failed}</strong><span>{loading ? 'Actualizando…' : 'última lectura del servidor'}</span></article><article><small>Stock de prueba</small><strong>{moneyCount}</strong><span>unidades en {prizes.length} premios</span></article></div>

        <section className="qa-demo-seed"><div><span className="qa-eyebrow">DATOS DEMO PERSISTIDOS</span><b>Campañas, premios y tarjetas para probar por QR/NFC</b><small>La carga es idempotente, solo toca registros DEMO y conserva stock consumido.</small></div><button onClick={() => void seedDemo()} disabled={seeding || busy !== ''}>{seeding ? 'Preparando…' : 'Cargar / actualizar datos demo'}</button></section>

        <div className="qa-main-grid"><section className="qa-panel"><div className="qa-panel-head"><div><span className="qa-eyebrow">EXPERIENCIA REAL</span><h2>Simulador participante</h2></div><Link href={`/${shopping}`} target="_blank">Abrir en otra pestaña ↗</Link></div><div className="qa-preview-tools"><label>Ancho de vista<select value={viewport} onChange={(event) => setViewport(Number(event.target.value))}>{[320,360,375,390,430,768,1024,1280,1440,1920].map((width) => <option value={width} key={width}>{width} px</option>)}</select></label><span>{campaign?.name ?? 'Fixture pendiente'}</span></div><div className="qa-frame-wrap"><iframe title={`Vista de prueba de ${selected?.name ?? shopping}`} src={`/${shopping}`} style={{ width: `min(${viewport}px, 100%)` }} /></div><div className="qa-cards"><h3>Tarjetas QA y rutas NFC/QR</h3>{cards.length ? cards.map((card) => <div key={card.id}><span><b>{card.publicId}</b><small>{card.location} · {card.status}</small></span><Link href={`/${shopping}/participar/${encodeURIComponent(card.publicId)}`} target="_blank">Abrir NFC/QR ↗</Link></div>) : <p>Ejecutá “Restablecer datos de prueba” para crear tarjetas QA.</p>}</div></section>

          <section className="qa-panel"><div className="qa-panel-head"><div><span className="qa-eyebrow">PRUEBAS DE BACKEND</span><h2>Escenarios</h2></div></div><p className="qa-hint">Las mutaciones, giros concurrentes y canjes usan servicios reales del backend sobre la base aislada.</p><div className="qa-scenarios">{scenarios.map((scenario) => {
            const last = runs?.find((run) => run.entityId === scenario.id);
            const status = String(last?.metadata.status ?? 'PENDING');
            return <article key={scenario.id}><div><b>{scenario.title}</b><small>{scenario.description}</small><span className={`qa-status ${status.toLowerCase()}`}>{status === 'PENDING' ? 'Pendiente' : status === 'APPROVED' ? 'Aprobada' : 'Fallida'}{last ? ` · ${new Date(last.createdAt).toLocaleString('es-AR')}` : ''}</span></div><button onClick={() => void runScenario(scenario.id)} disabled={busy !== '' || !cards.length}>{busy === scenario.id ? 'Ejecutando…' : 'Ejecutar'}</button></article>;
          })}</div></section></div>

        <section className="qa-panel qa-results"><div className="qa-panel-head"><div><span className="qa-eyebrow">RESULTADOS PERSISTIDOS</span><h2>Registro de QA</h2></div><button onClick={() => void refresh()} disabled={loading}>Actualizar</button></div>{runs?.length ? <div className="qa-table-wrap"><table><thead><tr><th>Shopping</th><th>Escenario</th><th>Estado</th><th>Esperado</th><th>Observado</th><th>Fecha</th></tr></thead><tbody>{runs.map((run) => <tr key={run.id}><td>{run.shopping?.slug ?? shopping}</td><td>{String(run.metadata.scenario ?? run.entityId)}</td><td>{String(run.metadata.status ?? '—')}</td><td>{String(run.metadata.expected ?? '—')}</td><td><code>{JSON.stringify(run.metadata.observed ?? {})}</code></td><td>{new Date(run.createdAt).toLocaleString('es-AR')}</td></tr>)}</tbody></table></div> : <p className="qa-hint">{loading ? 'Consultando resultados…' : 'Todavía no se ejecutaron escenarios para este shopping.'}</p>}</section>

        <QACardLinks cards={cardLinks} baseUrl={data?.baseUrl ?? null} baseUrlError={data?.baseUrlError ?? null} />

        <section className="qa-panel"><div className="qa-panel-head"><div><span className="qa-eyebrow">INVENTARIO DEMO</span><h2>Premios del shopping</h2></div><span>{prizes.filter((prize) => prize.campaign.slug.startsWith('navidad-demo-')).length} premios demo</span></div>{prizes.filter((prize) => prize.campaign.slug.startsWith('navidad-demo-')).length ? <div className="qa-prize-list">{prizes.filter((prize) => prize.campaign.slug.startsWith('navidad-demo-')).map((prize) => <article key={prize.id}>{prize.imageUrl && <Image src={prize.imageUrl} alt="" width={54} height={54} unoptimized />}<div><b>{prize.name}</b><small>{prize.remainingStock} / {prize.totalStock} disponibles · {prize.weight} puntos de probabilidad · {prize.active ? 'Activo' : 'Inactivo'}</small></div></article>)}</div> : <p className="qa-hint">Cargá los datos demo para preparar el inventario.</p>}</section>

        <div className="qa-main-grid"><section className="qa-panel"><div className="qa-panel-head"><div><span className="qa-eyebrow">PARTICIPACIONES PERSISTIDAS</span><h2>Actividad reciente</h2></div></div>{data?.participations.filter((item) => item.shoppingId === selected?.id).length ? <div className="qa-table-wrap"><table><thead><tr><th>Campaña</th><th>Tarjeta</th><th>Resultado</th><th>Premio</th><th>Fecha</th></tr></thead><tbody>{data.participations.filter((item) => item.shoppingId === selected?.id).map((item) => <tr key={item.id}><td>{item.campaign.name}</td><td>{item.card.publicId}</td><td>{item.status}</td><td>{item.prize?.name ?? 'Sin premio'}</td><td>{new Date(item.createdAt).toLocaleString('es-AR')}</td></tr>)}</tbody></table></div> : <p className="qa-hint">Las participaciones reales de prueba aparecerán acá después de escanear una tarjeta.</p>}</section>
          <section className="qa-panel"><div className="qa-panel-head"><div><span className="qa-eyebrow">CANJES PERSISTIDOS</span><h2>Historial de canjes</h2></div></div>{data?.redeems.filter((item) => item.campaign.shopping.slug === shopping).length ? <div className="qa-table-wrap"><table><thead><tr><th>Campaña</th><th>Premio</th><th>Estado</th><th>Vence</th><th>Canjeado</th></tr></thead><tbody>{data.redeems.filter((item) => item.campaign.shopping.slug === shopping).map((item) => <tr key={item.id}><td>{item.campaign.name}</td><td>{item.prize.name}</td><td>{item.status}</td><td>{new Date(item.expiresAt).toLocaleString('es-AR')}</td><td>{item.redeemedAt ? new Date(item.redeemedAt).toLocaleString('es-AR') : 'Pendiente'}</td></tr>)}</tbody></table></div> : <p className="qa-hint">Los canjes de esta campaña aparecerán cuando se valide un código.</p>}</section></div>
      </section>
    </div>
    <style>{`
      .qa-shell{min-height:100svh;background:#f4f6f5;color:#20353d;font-family:Arial,sans-serif}.qa-header{height:68px;padding:0 clamp(16px,3vw,40px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dfe5e6;background:white}.qa-brand{color:#20353d;text-decoration:none;font-weight:700}.qa-brand span{margin-left:12px;color:#627279;font-size:12px;font-weight:400}.qa-header>div{text-align:right;display:grid;gap:4px;font-size:12px}.qa-header small{color:#59696e}.qa-layout{display:grid;grid-template-columns:230px minmax(0,1fr);min-height:calc(100svh - 68px)}.qa-sidebar{background:#203e4d;color:white;padding:28px 16px;display:flex;flex-direction:column;gap:8px}.qa-sidebar>p{font:10px ui-monospace,monospace;letter-spacing:.16em;color:#bad0d2;margin:0 8px 8px}.qa-sidebar button{min-height:44px;padding:10px 12px;text-align:left;border:1px solid transparent;border-radius:7px;background:transparent;color:#e3ebec;cursor:pointer}.qa-sidebar button.active{background:#fff;color:#203e4d;font-weight:700}.qa-sidebar button.active.centenario{border-left:4px solid #b94f43}.qa-sidebar button.active.uniplaza{border-left:4px solid #b57642}.qa-side-note{margin:18px 8px;padding-top:15px;border-top:1px solid #ffffff35;color:#d6e0e0;font-size:11px;line-height:1.6}.qa-sidebar .qa-reset{margin-top:auto;background:#a64b3e;color:white;text-align:center;font-weight:700}.qa-sidebar button:focus-visible,.qa-panel button:focus-visible,.qa-panel a:focus-visible,.qa-sidebar a:focus-visible{outline:3px solid #d0a456;outline-offset:2px}.qa-content{min-width:0;padding:clamp(16px,3vw,38px);max-width:1720px;width:100%;margin:0 auto}.qa-title-row,.qa-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.qa-eyebrow{font:10px ui-monospace,monospace;letter-spacing:.15em;color:#60777f}.qa-title-row h1{font:600 clamp(26px,3vw,38px)/1.1 Georgia,serif;margin:10px 0}.qa-title-row p,.qa-hint{font-size:13px;line-height:1.65;color:#53646a}.qa-pill{flex:none;padding:9px 11px;border-radius:99px;background:#e3f1e8;color:#245f43;font:10px ui-monospace,monospace}.qa-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:24px 0}.qa-metrics article{background:white;border:1px solid #dce3e4;border-radius:10px;padding:15px;display:grid;gap:7px;min-width:0}.qa-metrics small,.qa-metrics span{color:#53646a;font-size:11px}.qa-metrics strong{font:600 28px Georgia}.qa-main-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:14px;align-items:start}.qa-panel{min-width:0;background:white;border:1px solid #dce3e4;border-radius:12px;padding:clamp(15px,2vw,22px);margin-bottom:14px}.qa-panel-head{align-items:center}.qa-panel h2{font:600 20px Georgia;margin:6px 0 0}.qa-panel-head>a,.qa-panel-head>button{color:#244f5c;font-size:12px;font-weight:600}.qa-preview-tools{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 10px;font-size:11px;color:#53646a}.qa-preview-tools label{display:flex;align-items:center;gap:8px}.qa-preview-tools select{min-height:38px;padding:6px;border:1px solid #c8d3d5;border-radius:5px}.qa-frame-wrap{max-width:100%;min-height:440px;max-height:610px;overflow:auto;border:1px solid #cfdadb;border-radius:8px;background:#edf2f2;display:flex;justify-content:center;align-items:flex-start;padding:6px}.qa-frame-wrap iframe{height:590px;max-width:100%;border:0;background:white;box-shadow:0 2px 10px #20353d20}.qa-cards{margin-top:20px}.qa-cards h3{font:600 15px Georgia}.qa-cards>div{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-top:1px solid #e2e7e8}.qa-cards span{display:grid;gap:4px}.qa-cards small{color:#53646a;font-size:11px}.qa-cards a{font-size:11px;color:#244f5c}.qa-scenarios{display:grid;gap:8px;margin-top:15px}.qa-scenarios article{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 0;border-top:1px solid #e2e7e8}.qa-scenarios article>div{min-width:0;display:grid;gap:5px}.qa-scenarios b{font-size:12px}.qa-scenarios small{color:#53646a;font-size:11px;line-height:1.5}.qa-status{font:10px ui-monospace,monospace;color:#53646a}.qa-status.approved{color:#246445}.qa-status.failed{color:#9d352c}.qa-scenarios button,.qa-results button{flex:none;min-height:40px;padding:8px 12px;border:0;border-radius:6px;background:#244f5c;color:white;font-size:11px;font-weight:700;cursor:pointer}.qa-scenarios button:disabled,.qa-results button:disabled{opacity:.55;cursor:not-allowed}.qa-results{margin-top:4px}.qa-table-wrap{overflow:auto;margin-top:14px}.qa-table-wrap table{width:100%;border-collapse:collapse;min-width:850px}.qa-table-wrap th,.qa-table-wrap td{padding:10px;text-align:left;vertical-align:top;border-bottom:1px solid #e2e7e8;font-size:11px;line-height:1.5}.qa-table-wrap th{color:#53646a}.qa-table-wrap code{display:block;max-width:300px;white-space:pre-wrap;overflow-wrap:anywhere}.qa-notice{margin:14px 0;padding:12px;border-radius:7px;font-size:13px}.qa-notice.error{background:#fde9e6;color:#812f27}.qa-notice.success{background:#e4f2e8;color:#235a3c}
      .qa-demo-seed{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px 18px;border:1px solid #d7e1df;border-radius:10px;background:#edf4f0;margin:18px 0}.qa-demo-seed>div{display:grid;gap:5px;min-width:0}.qa-demo-seed b{font-size:14px}.qa-demo-seed small{color:#53646a;font-size:11px}.qa-demo-seed button{flex:none;min-height:44px;padding:10px 14px;border:0;border-radius:6px;background:#244f5c;color:white;font-weight:700;cursor:pointer}.qa-demo-seed button:disabled{opacity:.55}.qa-prize-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:8px;margin-top:14px}.qa-prize-list article{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #e2e7e8;border-radius:8px;min-width:0}.qa-prize-list img{flex:none;object-fit:contain}.qa-prize-list article>div{display:grid;gap:5px;min-width:0}.qa-prize-list b{font-size:12px}.qa-prize-list small{color:#53646a;font-size:11px;line-height:1.4}
      @media(max-width:1050px){.qa-layout{grid-template-columns:190px minmax(0,1fr)}.qa-main-grid{grid-template-columns:1fr}.qa-frame-wrap iframe{height:540px}}
      @media(max-width:700px){.qa-header{height:auto;min-height:64px;gap:12px}.qa-layout{grid-template-columns:1fr}.qa-sidebar{padding:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.qa-sidebar>p,.qa-side-note,.qa-reset{grid-column:1/-1}.qa-side-note{margin:4px 8px}.qa-sidebar .qa-reset{margin-top:4px}.qa-title-row{flex-direction:column}.qa-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.qa-preview-tools{align-items:flex-start;flex-direction:column}.qa-cards>div{align-items:flex-start;flex-direction:column}.qa-demo-seed{align-items:stretch;flex-direction:column}.qa-header small{max-width:140px}.qa-brand span{display:block;margin:3px 0}}
      @media(prefers-reduced-motion:reduce){.qa-shell *{scroll-behavior:auto!important;transition:none!important}}
    `}</style>
  </main>;
}
