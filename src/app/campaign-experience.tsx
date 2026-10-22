'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { brandCssVariables, getShoppingBrand, type ShoppingBrandId } from '@/lib/brand';
import styles from './campaign-app.module.css';

type Prize = { id: string; name: string; description?: string | null; imageUrl?: string | null; remainingStock: number; available: boolean };
type PublicCard = { publicId: string; location?: string | null; kind?: string };
type PublicCampaign = {
  shopping?: { slug: string; name: string; brandSettings?: Record<string, unknown> };
  campaign?: { id: string; name: string; startsAt: string; endsAt: string; rulesUrl?: string | null; settings?: Record<string, unknown> } | null;
  prizes?: Prize[];
  cards?: PublicCard[];
  clue?: { text: string; startsAt: string; endsAt: string } | null;
  collectionProgress?: { count: number; cardIds: string[] };
};
type SpinResult = { status: 'won' | 'no_prize'; prize?: { name?: string; description?: string }; redeemCode?: string; expiresAt?: string; cardId: string };
type View = 'inicio' | 'jugar' | 'descubrir' | 'premios' | 'progreso';

const VIEWS: Array<{ id: View; label: string }> = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'jugar', label: 'Jugar' },
  { id: 'descubrir', label: 'Descubrir' },
  { id: 'premios', label: 'Premios' },
  { id: 'progreso', label: 'Mi progreso' },
];
// Hash aliases keep older links (#premios, #jugar, #progreso, #ayuda) pointing at the right screen.
const HASH_VIEWS: Record<string, View> = { inicio: 'inicio', 'como-funciona': 'inicio', jugar: 'jugar', descubrir: 'descubrir', premios: 'premios', progreso: 'progreso', ayuda: 'progreso' };
const WHEEL_LABELS = ['REGALO', 'SORPRESA', 'OTRA VEZ', 'PREMIO', 'TARJETA', 'SUERTE'];
const CONFETTI = Array.from({ length: 18 }, (_, index) => ({ left: (index * 37) % 100, delay: (index % 6) * 0.12, hue: index % 3 }));

export function CampaignExperience({ initialShopping }: { initialShopping: ShoppingBrandId }) {
  const shopping = initialShopping;
  const brand = getShoppingBrand(shopping);
  const [view, setView] = useState<View>('inicio');
  const [campaign, setCampaign] = useState<PublicCampaign | null>(null);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [participating, setParticipating] = useState(false);
  const [participationError, setParticipationError] = useState('');
  const [result, setResult] = useState<SpinResult | null>(null);
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [cardId, setCardId] = useState('');
  const [showClue, setShowClue] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const unlockText = typeof campaign?.campaign?.settings?.collectionUnlockText === 'string' ? campaign.campaign.settings.collectionUnlockText : typeof campaign?.shopping?.brandSettings?.collectionUnlockText === 'string' ? campaign.shopping.brandSettings.collectionUnlockText : 'El beneficio de la colección se informará cuando esté definido para esta campaña.';
  const collectionTarget = typeof campaign?.campaign?.settings?.collectionTarget === 'number' ? campaign.campaign.settings.collectionTarget : 3;
  const collected = Math.min(collectedIds.length, collectionTarget);
  const complete = collected >= collectionTarget;
  const availablePrizes = campaign?.prizes?.filter((prize) => prize.available && prize.remainingStock > 0) ?? [];
  const featuredPrize = availablePrizes.slice().sort((a, b) => b.remainingStock - a.remainingStock)[0] ?? campaign?.prizes?.[0];
  const cardCode = cardId.trim().toUpperCase();
  const codeStatus = !cardCode ? null : !campaign?.cards?.some((card) => card.publicId === cardCode) ? 'invalid' : collectedIds.includes(cardCode) ? 'repeated' : 'new';
  const canSpin = Boolean(campaign?.campaign) && !participating && !result && Boolean(cardCode) && codeStatus !== 'invalid';

  useEffect(() => {
    const fromHash = HASH_VIEWS[window.location.hash.replace('#', '')];
    if (fromHash) setView(fromHash);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setCampaignLoading(true); setCampaignError('');
    fetch(`/api/campaigns/${shopping}/public`, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error || 'No pudimos consultar la campaña.'); setCampaign(payload); setCollectedIds(payload.collectionProgress?.cardIds ?? []); })
      .catch((error: unknown) => { if (!(error instanceof Error && error.name === 'AbortError')) { setCampaignError('La campaña no está disponible en este momento.'); setCampaign(null); } })
      .finally(() => { if (!controller.signal.aborted) setCampaignLoading(false); });
    return () => controller.abort();
  }, [shopping, reloadKey]);

  function goTo(next: View) {
    setView(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  }

  async function spin() {
    if (!canSpin || !campaign?.campaign) return;
    setParticipating(true); setParticipationError('');
    try {
      // The server validates the card, the campaign window, duplicates and stock, and decides the prize.
      const response = await fetch('/api/participations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shoppingSlug: shopping, cardId: cardCode, idempotencyKey: crypto.randomUUID() }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No pudimos registrar tu participación.');
      if (payload.status !== 'won' && payload.status !== 'no_prize') throw new Error('El servidor devolvió una respuesta inesperada.');
      setResult({ ...payload, cardId: cardCode });
      setCollectedIds(payload.collectionProgress?.cardIds ?? collectedIds);
      setReloadKey((key) => key + 1);
    } catch (error) { setParticipationError(error instanceof Error ? error.message : 'No pudimos registrar tu participación. Revisá la conexión e intentá de nuevo.'); }
    finally { setParticipating(false); }
  }

  return <div className={styles.stage} data-shopping={shopping} style={brandCssVariables(brand, campaign?.shopping?.brandSettings) as CSSProperties}>
    <div className={styles.stageArt} aria-hidden="true"><Image src={`/campaign/${shopping}/hero.svg`} alt="" fill sizes="50vw" unoptimized /></div>
    <main className={styles.app}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="#inicio" onClick={(event) => { event.preventDefault(); goTo('inicio'); }} aria-label={`${brand.name}, inicio`}>
          <span className={styles.seal} aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" /><path d="M20 9l2.6 6.4 6.9.5-5.3 4.4 1.7 6.7L20 23.4l-5.9 3.6 1.7-6.7-5.3-4.4 6.9-.5z" /></svg></span>
          <span><strong>{brand.shortName}</strong><small>Navidad mágica</small></span>
        </a>
        <div className={styles.topActions}>
          <span className={styles.progressChip} aria-label={`Colección: ${collected} de ${collectionTarget} tarjetas`}>{collected}/{collectionTarget}</span>
          <button className={styles.iconButton} onClick={() => setShowAdmin(true)} aria-label="Administración"><Icon name="admin" /></button>
        </div>
      </header>

      <div className={styles.screen}>
        {view === 'inicio' && <HomeScreen brandName={brand.name} title={brand.experience.heroTitle} emphasis={brand.experience.heroEmphasis} shopping={shopping} featured={featuredPrize} collected={collected} target={collectionTarget} campaignName={campaign?.campaign?.name} loading={campaignLoading} onGo={goTo} onOpenPrize={(prize) => { goTo('premios'); setSelectedPrize(prize); }} />}
        {view === 'jugar' && <PlayScreen shopping={shopping} loading={campaignLoading} hasCampaign={Boolean(campaign?.campaign)} error={campaignError} participating={participating} participationError={participationError} result={result} cardCode={cardCode} codeStatus={codeStatus} canSpin={canSpin} collectedCount={collected} target={collectionTarget} onChange={(value) => { setCardId(value.toUpperCase()); setResult(null); setParticipationError(''); }} onSpin={spin} onRetry={() => setReloadKey((key) => key + 1)} onGo={goTo} rulesUrl={campaign?.campaign?.rulesUrl} />}
        {view === 'descubrir' && <DiscoverScreen campaign={campaign} collectedIds={collectedIds} target={collectionTarget} showClue={showClue} onToggleClue={() => setShowClue((value) => !value)} loading={campaignLoading} onGo={goTo} />}
        {view === 'premios' && <PrizesScreen prizes={campaign?.prizes ?? []} loading={campaignLoading} error={campaignError} onOpen={setSelectedPrize} onGo={goTo} />}
        {view === 'progreso' && <ProgressScreen collected={collected} target={collectionTarget} complete={complete} unlockText={unlockText} wonPrize={result?.status === 'won' ? result.prize?.name : undefined} rulesUrl={campaign?.campaign?.rulesUrl} shoppingName={brand.name} onGo={goTo} />}
      </div>

      {view === 'jugar' && result?.status === 'won' && <Confetti />}
      <nav className={styles.tabbar} aria-label="Secciones de la campaña">
        {VIEWS.map((item) => <button key={item.id} className={`${styles.tab} ${view === item.id ? styles.tabActive : ''}`} aria-current={view === item.id ? 'page' : undefined} onClick={() => goTo(item.id)}><Icon name={item.id} /><span>{item.label}</span></button>)}
      </nav>
    </main>

    {selectedPrize && <Sheet label={selectedPrize.name} onClose={() => setSelectedPrize(null)}><PrizeDetail prize={selectedPrize} rulesUrl={campaign?.campaign?.rulesUrl} /></Sheet>}
    {showAdmin && <Sheet label="Acceso al panel" onClose={() => setShowAdmin(false)}><span className={styles.kicker}>Acceso privado</span><h2 className={styles.sheetTitle}>Administración</h2><p className={styles.muted}>El panel requiere una sesión autorizada.</p><a className={styles.primaryAction} href="/admin">Ir al acceso seguro</a></Sheet>}
  </div>;
}

function HomeScreen({ brandName, title, emphasis, shopping, featured, collected, target, campaignName, loading, onGo, onOpenPrize }: { brandName: string; title: string; emphasis: string; shopping: ShoppingBrandId; featured?: Prize; collected: number; target: number; campaignName?: string; loading: boolean; onGo: (view: View) => void; onOpenPrize: (prize: Prize) => void }) {
  return <section className={styles.home} aria-labelledby="home-title">
    <div className={styles.heroArt}>
      <Image src={`/campaign/${shopping}/hero.svg`} alt="" fill sizes="(max-width: 900px) 100vw, 430px" priority unoptimized />
      <div className={styles.heroText}>
        <span className={styles.chip}>{loading ? 'Cargando campaña' : campaignName ?? brandName}</span>
        <h1 id="home-title">{title} <em>{emphasis}</em></h1>
      </div>
    </div>
    {featured && <button className={styles.featuredTicket} onClick={() => onOpenPrize(featured)} aria-label={`Premio destacado: ${featured.name}`}>
      <span className={styles.ticketThumb}>{featured.imageUrl ? <Image src={featured.imageUrl} alt="" fill sizes="72px" unoptimized /> : <GiftArt shopping={shopping} />}</span>
      <span className={styles.ticketBody}><small>PREMIO DESTACADO</small><strong>{featured.name}</strong><em className={featured.available && featured.remainingStock > 0 ? styles.stockOk : styles.stockOut}>{featured.available && featured.remainingStock > 0 ? `Quedan ${featured.remainingStock}` : 'Agotado'}</em></span>
      <span className={styles.ticketGo} aria-hidden="true">›</span>
    </button>}
    <div className={styles.ctaStack}>
      <button className={styles.primaryAction} onClick={() => onGo('jugar')}>Jugar ahora<Icon name="jugar" /></button>
      <div className={styles.secondaryRow}>
        <button className={styles.secondaryAction} onClick={() => onGo('descubrir')}><Icon name="descubrir" />Buscar tarjeta</button>
        <button className={styles.secondaryAction} onClick={() => onGo('premios')}><Icon name="premios" />Ver premios</button>
      </div>
    </div>
    <button className={styles.progressStrip} onClick={() => onGo('progreso')}>
      <span className={styles.dots} aria-hidden="true">{Array.from({ length: target }, (_, index) => <i key={index} className={index < collected ? styles.dotOn : ''} />)}</span>
      <span>{collected >= target ? 'Colección completa' : `Te faltan ${Math.max(0, target - collected)} tarjetas diferentes`}</span>
      <span aria-hidden="true">›</span>
    </button>
    <ol className={styles.howRow} aria-label="Cómo jugar">
      <li><b>01</b>Buscá una tarjeta en el shopping</li>
      <li><b>02</b>Escaneá su QR o NFC</li>
      <li><b>03</b>Girá y canjeá tu premio</li>
    </ol>
  </section>;
}

function PlayScreen(props: { shopping: ShoppingBrandId; loading: boolean; hasCampaign: boolean; error: string; participating: boolean; participationError: string; result: SpinResult | null; cardCode: string; codeStatus: 'invalid' | 'repeated' | 'new' | null; canSpin: boolean; collectedCount: number; target: number; onChange: (value: string) => void; onSpin: () => void; onRetry: () => void; onGo: (view: View) => void; rulesUrl?: string | null }) {
  const { shopping, loading, hasCampaign, error, participating, participationError, result, cardCode, codeStatus, canSpin, onChange, onSpin, onRetry, onGo } = props;
  const message = loading ? 'Consultando la campaña…' : !hasCampaign ? 'No hay una campaña activa para este shopping. Volvé más tarde.' : null;
  const hint = codeStatus === 'invalid' ? 'Ese código no figura en esta campaña. Revisá la tarjeta.' : codeStatus === 'repeated' ? 'Esta tarjeta ya la descubriste. Las repetidas no suman progreso.' : codeStatus === 'new' ? 'Tarjeta nueva: lista para girar.' : 'El código está impreso en la tarjeta o en el enlace QR.';
  const hintTone = codeStatus === 'invalid' ? styles.hintBad : codeStatus === 'repeated' ? styles.hintWarn : styles.hintNeutral;
  return <section className={styles.play} aria-labelledby="play-title">
    <div className={styles.screenHead}><span className={styles.kicker}>Minijuego</span><h2 id="play-title">Girá y descubrí</h2></div>
    <div className={`${styles.wheelWrap} ${participating ? styles.wheelBusy : ''}`} aria-busy={participating}>
      <Wheel spinning={participating} shopping={shopping} />
      <span className={styles.pointer} aria-hidden="true" />
    </div>
    <p className={styles.wheelState} role="status" aria-live="polite">{participating ? 'Validando tu tarjeta en el servidor…' : result ? (result.status === 'won' ? 'Premio confirmado' : 'Participación registrada') : 'La ruleta es decorativa: el premio lo confirma el servidor.'}</p>

    {result && <ResultCard result={result} onGo={onGo} />}

    {!result && <form className={styles.codeForm} onSubmit={(event) => { event.preventDefault(); onSpin(); }}>
      <label className={styles.label} htmlFor="card-id">Código de tu tarjeta</label>
      <input className={styles.codeInput} id="card-id" value={cardCode} placeholder="Ej.: CEN-001" onChange={(event) => onChange(event.target.value)} maxLength={40} disabled={participating || loading} autoComplete="off" inputMode="text" aria-describedby="card-hint" />
      <small id="card-hint" className={`${styles.hint} ${hintTone}`}>{hint}</small>
      <button type="submit" className={styles.spinButton} disabled={!canSpin || loading}>{participating ? 'Comprobando…' : loading ? 'Cargando campaña…' : !hasCampaign ? 'Participación no disponible' : 'Girar y descubrir'}</button>
    </form>}
    {result && <button className={styles.secondaryWide} onClick={() => onGo('descubrir')}>Buscar otra tarjeta</button>}

    {message && <p className={styles.notice} role="status">{message}</p>}
    {(error || participationError) && <div className={styles.errorBox} role="alert"><span>{participationError || error}</span>{!participating && <button onClick={onRetry}>Reintentar</button>}</div>}
  </section>;
}

function ResultCard({ result, onGo }: { result: SpinResult; onGo: (view: View) => void }) {
  const won = result.status === 'won';
  return <article className={`${styles.resultCard} ${won ? styles.resultWon : styles.resultNone}`} role="status" aria-live="polite">
    <span className={styles.resultKicker}>{won ? 'PREMIO CONFIRMADO' : 'SIN PREMIO ESTA VEZ'}</span>
    <h3>{won ? result.prize?.name : 'Gracias por jugar'}</h3>
    <p>{won ? result.prize?.description || 'Presentá el código en el comercio indicado para canjear.' : 'Seguí recorriendo: cada tarjeta nueva suma a tu colección.'}</p>
    {won && result.redeemCode && <code className={styles.redeemCode}>{result.redeemCode}</code>}
    {won && result.expiresAt && <small>Válido hasta {new Date(result.expiresAt).toLocaleString('es-AR')}</small>}
    {!won && <button className={styles.secondaryWide} onClick={() => onGo('descubrir')}>Buscar tarjetas</button>}
  </article>;
}

function Wheel({ spinning, shopping }: { spinning: boolean; shopping: ShoppingBrandId }) {
  const segments = WHEEL_LABELS.map((label, index) => {
    const start = (index * 60 - 90) * (Math.PI / 180);
    const end = ((index + 1) * 60 - 90) * (Math.PI / 180);
    const mid = (index * 60 - 60) * (Math.PI / 180);
    return { label, d: `M0 0 L${(Math.cos(start) * 96).toFixed(2)} ${(Math.sin(start) * 96).toFixed(2)} A96 96 0 0 1 ${(Math.cos(end) * 96).toFixed(2)} ${(Math.sin(end) * 96).toFixed(2)} Z`, tx: (Math.cos(mid) * 58).toFixed(2), ty: (Math.sin(mid) * 58).toFixed(2), angle: index * 60 };
  });
  return <svg className={`${styles.wheel} ${spinning ? styles.wheelSpin : ''}`} viewBox="-100 -100 200 200" role="img" aria-label={`Ruleta decorativa de ${shopping === 'centenario' ? 'Centenario' : 'UniPlaza'}`}>
    <circle r="100" className={styles.wheelRim} />
    {segments.map((segment, index) => <g key={segment.label}>
      <path d={segment.d} className={index % 2 ? styles.segmentB : styles.segmentA} />
      <text transform={`translate(${segment.tx} ${segment.ty}) rotate(${segment.angle + 30})`} textAnchor="middle" dominantBaseline="middle">{segment.label}</text>
    </g>)}
    <circle r="22" className={styles.wheelHub} />
    <text className={styles.hubText} textAnchor="middle" dominantBaseline="middle">{shopping === 'centenario' ? 'C' : 'U'}</text>
  </svg>;
}

function DiscoverScreen({ campaign, collectedIds, target, showClue, onToggleClue, loading, onGo }: { campaign: PublicCampaign | null; collectedIds: string[]; target: number; showClue: boolean; onToggleClue: () => void; loading: boolean; onGo: (view: View) => void }) {
  const slots = Array.from({ length: target }, (_, index) => collectedIds[index]);
  const discovered = collectedIds.length;
  return <section className={styles.discover} aria-labelledby="discover-title">
    <div className={styles.screenHead}><span className={styles.kicker}>Búsqueda del tesoro</span><h2 id="discover-title">Tu colección</h2><p>Encontrá tarjetas diferentes. Las repetidas no suman progreso.</p></div>
    <div className={styles.collectionCount}><strong>{Math.min(discovered, target)}<small>/{target}</small></strong><span>{Math.max(0, target - discovered) > 0 ? `faltan ${Math.max(0, target - discovered)}` : 'completa'}</span></div>
    <div className={styles.slotGrid} role="list" aria-label={`Tarjetas: ${Math.min(discovered, target)} de ${target} descubiertas`}>
      {slots.map((publicId, index) => {
        const card = publicId ? campaign?.cards?.find((item) => item.publicId === publicId) : undefined;
        return <div role="listitem" key={index} className={`${styles.slot} ${publicId ? styles.slotFound : ''}`}>
          <span className={styles.slotNumber}>{String(index + 1).padStart(2, '0')}</span>
          {publicId ? <><strong className={styles.slotId}>{publicId}</strong><small>{card?.location || 'Descubierta'}</small></> : <><strong className={styles.slotMystery} aria-hidden="true">?</strong><small>Por descubrir</small></>}
        </div>;
      })}
    </div>
    <p className={`${styles.muted} ${styles.inset}`}>{loading ? 'Cargando tarjetas…' :'Escaneá el QR o NFC de cada tarjeta o ingresá su código en Jugar.'}</p>
    <button className={styles.secondaryWide} onClick={() => onGo('jugar')}>Ir a Jugar</button>
    <div className={styles.clueBlock}>
      <div><b>¿Necesitás una pista?</b><p>Una ayuda para seguir explorando.</p></div>
      <button onClick={onToggleClue} aria-expanded={showClue}>{showClue ? 'Ocultar' : 'Ver pista'}</button>
      {showClue && <div className={styles.clueText} role="status">{loading ? 'Buscando la pista…' : campaign?.clue?.text ?? 'Hoy no hay pistas activas para este shopping.'}</div>}
    </div>
  </section>;
}

function PrizesScreen({ prizes, loading, error, onOpen, onGo }: { prizes: Prize[]; loading: boolean; error: string; onOpen: (prize: Prize) => void; onGo: (view: View) => void }) {
  const ordered = prizes.slice().sort((a, b) => Number(b.available && b.remainingStock > 0) - Number(a.available && a.remainingStock > 0));
  const [featured, ...rest] = ordered;
  if (loading) return <section className={styles.prizes}><p className={styles.muted}>Consultando disponibilidad…</p></section>;
  if (!prizes.length) return <section className={styles.prizes}><div className={styles.screenHead}><h2>Premios</h2></div><p className={styles.notice} role="status">{error || 'Los premios se mostrarán cuando haya una campaña activa.'}</p><button className={styles.secondaryWide} onClick={() => onGo('jugar')}>Ir a Jugar</button></section>;
  const isAvailable = (prize: Prize) => prize.available && prize.remainingStock > 0;
  return <section className={styles.prizes} aria-labelledby="prizes-title">
    <div className={styles.screenHead}><span className={styles.kicker}>Catálogo</span><h2 id="prizes-title">Premios</h2><p>Disponibilidad real según la campaña activa.</p></div>
    {featured && <button className={styles.hero} onClick={() => onOpen(featured)}>
      <span className={styles.heroThumb}>{featured.imageUrl ? <Image src={featured.imageUrl} alt="" fill sizes="(max-width: 430px) 100vw, 430px" unoptimized /> : <GiftArt shopping="centenario" />}</span>
      <span className={styles.heroInfo}><small>DESTACADO</small><strong>{featured.name}</strong><em className={isAvailable(featured) ? styles.stockOk : styles.stockOut}>{isAvailable(featured) ? `Quedan ${featured.remainingStock}` : 'Agotado'}</em></span>
    </button>}
    <ul className={styles.prizeList}>{rest.map((prize) => <li key={prize.id}><button className={`${styles.prizeRow} ${isAvailable(prize) ? '' : styles.prizeSoldOut}`} onClick={() => onOpen(prize)}>
      <span className={styles.prizeRowThumb}>{prize.imageUrl ? <Image src={prize.imageUrl} alt="" fill sizes="76px" unoptimized /> : <GiftArt shopping="uniplaza" />}</span>
      <span className={styles.prizeRowBody}><strong>{prize.name}</strong><em className={isAvailable(prize) ? styles.stockOk : styles.stockOut}>{isAvailable(prize) ? `Quedan ${prize.remainingStock}` : 'Agotado'}</em></span>
      <span aria-hidden="true">›</span>
    </button></li>)}</ul>
  </section>;
}

function PrizeDetail({ prize, rulesUrl }: { prize: Prize; rulesUrl?: string | null }) {
  const available = prize.available && prize.remainingStock > 0;
  return <div className={styles.detail}>
    <span className={styles.detailImage}>{prize.imageUrl ? <Image src={prize.imageUrl} alt={prize.name} fill sizes="400px" unoptimized /> : <GiftArt shopping="centenario" />}</span>
    <span className={available ? styles.stockOk : styles.stockOut}>{available ? `Quedan ${prize.remainingStock} disponibles` : 'Agotado'}</span>
    <h2 className={styles.sheetTitle}>{prize.name}</h2>
    <p className={styles.muted}>{prize.description || 'Consultá las condiciones de participación.'}</p>
    <div className={styles.conditions}><b>Cómo canjear</b><p>Obtené el código participando con una tarjeta. Presentalo en el comercio indicado dentro del plazo que muestre tu resultado.</p>{rulesUrl && <a href={rulesUrl} target="_blank" rel="noreferrer">Leer bases y condiciones</a>}</div>
  </div>;
}

function ProgressScreen({ collected, target, complete, unlockText, wonPrize, rulesUrl, shoppingName, onGo }: { collected: number; target: number; complete: boolean; unlockText: string; wonPrize?: string; rulesUrl?: string | null; shoppingName: string; onGo: (view: View) => void }) {
  const ratio = target > 0 ? Math.min(collected / target, 1) : 0;
  const circumference = 2 * Math.PI * 52;
  return <section className={styles.progress} aria-labelledby="progress-title">
    <div className={styles.screenHead}><span className={styles.kicker}>Tu avance</span><h2 id="progress-title">Mi progreso</h2></div>
    <div className={styles.ringCard}>
      <svg viewBox="0 0 120 120" className={styles.ring} aria-hidden="true"><circle cx="60" cy="60" r="52" className={styles.ringTrack} /><circle cx="60" cy="60" r="52" className={styles.ringFill} strokeLinecap={ratio > 0 ? 'round' : 'butt'} strokeDasharray={`${(ratio * circumference).toFixed(1)} ${circumference.toFixed(1)}`} /></svg>
      <div className={styles.ringText}><strong>{collected}/{target}</strong><span>tarjetas</span></div>
      <p>{complete ? `Completaste tu colección en ${shoppingName}.` : `Te faltan ${Math.max(0, target - collected)} tarjetas diferentes.`}</p>
    </div>
    <div className={styles.achievements} aria-label="Logros">
      <div className={collected >= 1 ? styles.achieved : styles.locked}><b>{collected >= 1 ? '★' : '○'}</b><span>Primera tarjeta</span></div>
      <div className={complete ? styles.achieved : styles.locked}><b>{complete ? '★' : '○'}</b><span>Colección completa</span></div>
      <div className={wonPrize ? styles.achieved : styles.locked}><b>{wonPrize ? '★' : '○'}</b><span>Premio en esta sesión</span></div>
    </div>
    <div className={styles.rewardBox}><b>Qué desbloquea la colección</b><p>{unlockText}</p></div>
    <ol className={styles.steps}><li>Encontrá una tarjeta en el shopping.</li><li>Escaneá el QR o NFC, o ingresá el código.</li><li>Girá y revisá tu resultado.</li><li>Canjeá tu premio en el comercio indicado.</li></ol>
    <div className={styles.linkRow}>{rulesUrl ? <a href={rulesUrl} target="_blank" rel="noreferrer">Bases y condiciones</a> : <span className={styles.muted}>Las condiciones se informarán durante la campaña.</span>}<button onClick={() => onGo('jugar')}>Ir a Jugar</button></div>
  </section>;
}

function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className={styles.sheetBackdrop} onClick={onClose}>
    <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={label} onClick={(event) => event.stopPropagation()}>
      <span className={styles.grip} aria-hidden="true" />
      <button className={styles.sheetClose} onClick={onClose} aria-label="Cerrar">×</button>
      {children}
    </div>
  </div>;
}

function Confetti() {
  return <div className={styles.confetti} aria-hidden="true">{CONFETTI.map((piece, index) => <i key={index} style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, background: piece.hue === 0 ? 'var(--festive)' : piece.hue === 1 ? 'var(--brand-accent-soft)' : 'var(--brand-accent)' } as CSSProperties} />)}</div>;
}

function GiftArt({ shopping }: { shopping: ShoppingBrandId }) {
  return <svg className={styles.giftArt} viewBox="0 0 80 80" aria-hidden="true" data-shopping={shopping}><rect x="14" y="30" width="52" height="40" rx="5" className={styles.giftBody} /><rect x="14" y="22" width="52" height="12" rx="4" className={styles.giftLid} /><rect x="36" y="22" width="8" height="48" className={styles.giftRibbon} /></svg>;
}

function Icon({ name }: { name: View | 'admin' }) {
  const paths: Record<View | 'admin', ReactNode> = {
    inicio: <path d="M3.5 11 12 4l8.5 7V19a1 1 0 0 1-1 1h-5v-5h-5v5h-5a1 1 0 0 1-1-1z" />,
    jugar: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.5 12h17M6.5 6.5l11 11" /></>,
    descubrir: <><rect x="4" y="5" width="11" height="14" rx="2" transform="rotate(-8 9.5 12)" /><rect x="9" y="5" width="11" height="14" rx="2" /></>,
    premios: <><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7.5h18v2.5H3zM12 7.5V20M12 7.5C10 3.5 6.5 4.5 7.5 6.5S10.5 7.5 12 7.5zm0 0c2-4 5.5-3 4.5-1S13.5 7.5 12 7.5z" /></>,
    progreso: <path d="M5 19V11M12 19V5M19 19v-6" />,
    admin: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  };
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
