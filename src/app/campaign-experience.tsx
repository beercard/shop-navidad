'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { brandCssVariables, getShoppingBrand, type ShoppingBrandId } from '@/lib/brand';
import styles from './campaign-app.module.css';
import { CouponWallet } from './coupon-wallet';

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
type SpinResult = { status: 'won' | 'no_prize'; prize?: { name?: string; description?: string }; redeemCode?: string; redeemQr?: string; expiresAt?: string; cardId: string };
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
  const [wheelAngle, setWheelAngle] = useState(0);
  const [spinPhase, setSpinPhase] = useState<'idle' | 'accel' | 'cruise' | 'land'>('idle');
  const unlockText = typeof campaign?.campaign?.settings?.collectionUnlockText === 'string' ? campaign.campaign.settings.collectionUnlockText : typeof campaign?.shopping?.brandSettings?.collectionUnlockText === 'string' ? campaign.shopping.brandSettings.collectionUnlockText : 'El beneficio de la colección se informará cuando esté definido para esta campaña.';
  const collectionTarget = typeof campaign?.campaign?.settings?.collectionTarget === 'number' ? campaign.campaign.settings.collectionTarget : 3;
  const collected = Math.min(collectedIds.length, collectionTarget);
  const complete = collected >= collectionTarget;
  const availablePrizes = campaign?.prizes?.filter((prize) => prize.available && prize.remainingStock > 0) ?? [];
  const featuredPrize = availablePrizes.slice().sort((a, b) => b.remainingStock - a.remainingStock)[0] ?? campaign?.prizes?.[0];
  const cardCode = cardId.trim().toUpperCase();
  const codeStatus = !cardCode ? null : !campaign?.cards?.some((card) => card.publicId === cardCode) ? 'invalid' : collectedIds.includes(cardCode) ? 'repeated' : 'new';
  const canSpin = Boolean(campaign?.campaign) && !participating && Boolean(cardCode) && codeStatus !== 'invalid';

  useEffect(() => {
    const fromHash = HASH_VIEWS[window.location.hash.replace('#', '')];
    if (fromHash) setView(fromHash);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setCampaignLoading(true); setCampaignError('');
    const campaignSlug = new URLSearchParams(window.location.search).get('campaign');
    const query = campaignSlug ? `?campaign=${encodeURIComponent(campaignSlug)}` : '';
    fetch(`/api/campaigns/${shopping}/public${query}`, { signal: controller.signal, cache: 'no-store' })
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
    const submittedCode = cardCode;
    setParticipating(true); setParticipationError(''); setResult(null); setSpinPhase('accel');
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spinDurationMs = reducedMotion ? 0 : 3200;
    const t1 = !reducedMotion ? window.setTimeout(() => setSpinPhase('cruise'), 1000) : undefined;
    const t2 = !reducedMotion ? window.setTimeout(() => setSpinPhase('land'), 2200) : undefined;
    try {
      const startedAt = Date.now();
      // The server validates the card, the campaign window, duplicates and stock, and decides the prize.
      const response = await fetch('/api/participations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shoppingSlug: shopping, cardId: submittedCode, idempotencyKey: crypto.randomUUID() }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No pudimos registrar tu participación.');
      if (payload.status !== 'won' && payload.status !== 'no_prize') throw new Error('El servidor devolvió una respuesta inesperada.');
      const targetSectorIndex = payload.status === 'won' ? 3 : 2; // 3 = PREMIO, 2 = OTRA VEZ
      const sectorStopAngle = 360 - (targetSectorIndex * 60 + 30);
      setWheelAngle((prev) => {
        const baseTurns = Math.ceil(prev / 360) * 360 + 2160;
        return baseTurns + sectorStopAngle;
      });
      const elapsed = Date.now() - startedAt;
      if (spinDurationMs > elapsed) {
        await new Promise((resolve) => window.setTimeout(resolve, spinDurationMs - elapsed));
      }
      setResult({ ...payload, cardId: submittedCode });
      setCardId('');
      setCollectedIds(payload.collectionProgress?.cardIds ?? collectedIds);
      setReloadKey((key) => key + 1);
    } catch (error) { setParticipationError(error instanceof Error ? error.message : 'No pudimos registrar tu participación. Revisá la conexión e intentá de nuevo.'); }
    finally {
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
      setSpinPhase('idle');
      setParticipating(false);
    }
  }

  return <div className={styles.stage} data-testid="campaign-stage" data-shopping={shopping} style={brandCssVariables(brand, campaign?.shopping?.brandSettings) as CSSProperties}>
    <div className={styles.stageArt} aria-hidden="true"><Image src={`/campaign/${shopping}/hero.svg`} alt="" fill sizes="50vw" unoptimized /></div>
    <main className={styles.app} data-view={view}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="#inicio" onClick={(event) => { event.preventDefault(); goTo('inicio'); }}>
          <span className={styles.brandMonogram} aria-hidden="true">{shopping === 'centenario' ? 'C' : 'U'}</span>
          <span><strong>{brand.name}</strong><small>Navidad mágica</small></span>
        </a>
        <div className={styles.topActions}>
          <span className={styles.progressChip} aria-label={`Colección: ${collected} de ${collectionTarget} tarjetas`}>{collected}/{collectionTarget}</span>
        </div>
      </header>

      <div className={styles.screen}>
        {view === 'inicio' && <HomeScreen brandName={brand.name} title={brand.experience.heroTitle} emphasis={brand.experience.heroEmphasis} message={brand.experience.heroMessage} primaryAction={brand.experience.primaryAction} shopping={shopping} featured={featuredPrize} collectedIds={collectedIds} cards={campaign?.cards ?? []} collected={collected} target={collectionTarget} campaignName={campaign?.campaign?.name} loading={campaignLoading} error={campaignError} onRetry={() => setReloadKey((key) => key + 1)} onGo={goTo} onOpenPrize={(prize) => { goTo('premios'); setSelectedPrize(prize); }} />}
        {view === 'jugar' && <PlayScreen shopping={shopping} loading={campaignLoading} hasCampaign={Boolean(campaign?.campaign)} error={campaignError} participating={participating} spinPhase={spinPhase} wheelAngle={wheelAngle} participationError={participationError} result={result} cardCode={cardCode} codeStatus={codeStatus} canSpin={canSpin} collectedCount={collected} target={collectionTarget} onChange={(value) => { setCardId(value.toUpperCase()); setParticipationError(''); }} onClearResult={() => { setResult(null); setCardId(''); setParticipationError(''); }} onSpin={spin} onRetry={() => setReloadKey((key) => key + 1)} onGo={goTo} rulesUrl={campaign?.campaign?.rulesUrl} />}
        {view === 'descubrir' && <DiscoverScreen campaign={campaign} collectedIds={collectedIds} target={collectionTarget} showClue={showClue} onToggleClue={() => setShowClue((value) => !value)} loading={campaignLoading} onGo={goTo} />}
        {view === 'premios' && <PrizesScreen shopping={shopping} prizes={campaign?.prizes ?? []} loading={campaignLoading} error={campaignError} onOpen={setSelectedPrize} onGo={goTo} />}
        {view === 'progreso' && <ProgressScreen collected={collected} target={collectionTarget} complete={complete} unlockText={unlockText} wonPrize={result?.status === 'won' ? result.prize?.name : undefined} rulesUrl={campaign?.campaign?.rulesUrl} shoppingName={brand.name} shopping={shopping} refreshKey={result?.redeemCode ?? ''} onGo={goTo} />}
      </div>

      {view === 'jugar' && result?.status === 'won' && <Confetti />}
      <nav className={styles.tabbar} aria-label="Secciones de la campaña">
        {VIEWS.map((item) => <button key={item.id} className={`${styles.tab} ${view === item.id ? styles.tabActive : ''}`} aria-current={view === item.id ? 'page' : undefined} onClick={() => goTo(item.id)}><Icon name={item.id} /><span>{item.label}</span></button>)}
      </nav>
    </main>

    {selectedPrize && <Sheet label={selectedPrize.name} onClose={() => setSelectedPrize(null)}><PrizeDetail prize={selectedPrize} shopping={shopping} rulesUrl={campaign?.campaign?.rulesUrl} /></Sheet>}
  </div>;
}

function HomeScreen({ brandName, title, emphasis, message, primaryAction, shopping, featured, collectedIds, cards, collected, target, campaignName, loading, error, onRetry, onGo, onOpenPrize }: { brandName: string; title: string; emphasis: string; message: string; primaryAction: string; shopping: ShoppingBrandId; featured?: Prize; collectedIds: string[]; cards: PublicCard[]; collected: number; target: number; campaignName?: string; loading: boolean; error: string; onRetry: () => void; onGo: (view: View) => void; onOpenPrize: (prize: Prize) => void }) {
  const collectedCards = new Set(collectedIds);
  const centenario = shopping === 'centenario';
  return <section className={`${styles.home} ${centenario ? styles.centenarioHome : styles.uniplazaHome}`} aria-labelledby="home-title">
    <div className={styles.heroArt}>
      <div className={`${styles.heroText} ${centenario ? styles.centenarioHeroText : ''}`}>
        <span className={styles.chip}><i className={styles.chipDot} aria-hidden="true" />{loading ? 'Cargando campaña' : campaignName ?? `${brandName} · Campaña Oficial`}</span>
        <h1 id="home-title">{title} <em>{emphasis}</em></h1>
        <p>{message}</p>
        <button className={`${styles.heroPrimaryAction} ${!centenario ? styles.uniplazaHeroAction : ''}`} onClick={() => onGo('jugar')}><span>{primaryAction}</span><span aria-hidden="true">→</span></button>
      </div>
    </div>
    <section className={styles.passport} aria-labelledby="passport-title">
      <div className={styles.passportHeading}>
        <div>
          <small className={styles.passportEyebrow}>PASAPORTE DEL SHOPPING</small>
          <h2 id="passport-title">Tu colección</h2>
        </div>
        <span>{collected} de {target} postas</span>
      </div>
      <div className={styles.passportBar} aria-hidden="true"><span style={{ width: `${target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0}%` }} /></div>
      <button className={styles.passportSlots} onClick={() => onGo('progreso')} aria-describedby="passport-hint">
        {Array.from({ length: target }, (_, index) => {
          const cardId = [...collectedCards][index];
          const card = cardId ? cards.find((item) => item.publicId === cardId) : undefined;
          return <span key={index} className={`${styles.passportSlot} ${card ? styles.passportSlotFound : ''}`}>
            <b className={styles.postaTag}>POSTA 0{index + 1}</b>
            <span aria-hidden="true">{card ? '✓' : `0${index + 1}`}</span>
            <small>{card ? card.location || `Posta ${index + 1}` : 'Por activar'}</small>
          </span>;
        })}
      </button>
      <p id="passport-hint">{collected >= target ? 'Pasaporte completo. Revisá qué beneficio habilitó esta campaña.' : `Activá ${Math.max(0, target - collected)} tarjetas distintas en tu visita para completar el pasaporte.`}</p>
    </section>
    <ol className={styles.howRow} aria-label="Cómo participar">
      <li><StepIcon kind="search" /><b>1. Buscá</b><span>una posta en el shopping</span></li>
      <li><StepIcon kind="scan" /><b>2. Escaneá</b><span>su QR o ingresá el código</span></li>
      <li><StepIcon kind="gift" /><b>3. Canjeá</b><span>tu voucher QR en locales</span></li>
    </ol>
    <button className={styles.homeTextAction} onClick={() => onGo('descubrir')}>Ver pista de ubicación activa <Icon name="descubrir" /></button>
    {centenario ? <button className={`${styles.centenarioFeature} ${featured && (!featured.available || featured.remainingStock <= 0) ? styles.centenarioFeatureUnavailable : ''}`} onClick={() => featured ? onOpenPrize(featured) : onGo('premios')}>
      <span className={styles.centenarioFeatureCopy}><small>{featured ? '★ BENEFICIO DESTACADO' : 'BENEFICIOS DE CAMPAÑA'}</small><strong>{featured?.name ?? 'Conocé los beneficios de temporada'}</strong><em>{featured ? (featured.available && featured.remainingStock > 0 ? `● Disponibles hoy: ${featured.remainingStock} unidades` : 'Agotado') : 'Se mostrarán cuando haya una campaña activa.'}</em></span>
      <span className={styles.featureArrow} aria-hidden="true">→</span>
    </button> : <button className={`${styles.uniplazaFeature} ${featured && (!featured.available || featured.remainingStock <= 0) ? styles.uniplazaFeatureUnavailable : ''}`} onClick={() => error ? onRetry() : featured ? onOpenPrize(featured) : onGo('premios')}>
      <span className={styles.uniplazaFeatureCopy}><small>{featured ? '★ BENEFICIO DESTACADO' : 'CAMPAÑA NAVIDEÑA'}</small><strong>{featured?.name ?? (loading ? 'Estamos preparando la experiencia' : error ? 'No pudimos cargar la campaña' : campaignName ? 'No hay premios publicados todavía' : 'Los premios se anuncian acá')}</strong><em>{featured ? (featured.available && featured.remainingStock > 0 ? `● Disponibles hoy: ${featured.remainingStock} unidades` : 'Agotado') : loading ? 'Consultando disponibilidad…' : error ? 'Tocá para volver a intentar.' : campaignName ? 'Encontrá acá las novedades y condiciones de la campaña.' : 'Cuando haya una campaña activa, vas a encontrar acá sus premios y condiciones.'}</em><span aria-hidden="true">{featured ? <GiftArt shopping={shopping} /> : <Icon name="premios" />}</span></span>
      <span className={styles.uniplazaFeatureGo} aria-hidden="true">→</span>
    </button>}
    {centenario && error && <div className={styles.centenarioCampaignError} role="alert"><span>La campaña no está disponible en este momento.</span><button type="button" onClick={onRetry}>Reintentar</button></div>}
  </section>;
}

function StepIcon({ kind }: { kind: 'search' | 'scan' | 'gift' }) {
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.2" /><path d="m15.3 15.3 4.2 4.2" /></>,
    scan: <><path d="M8 4H5a1 1 0 0 0-1 1v3m12-4h3a1 1 0 0 1 1 1v3M4 16v3a1 1 0 0 0 1 1h3m12-4v3a1 1 0 0 1-1 1h-3M8 12h8" /></>,
    gift: <><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7.5h18V10H3zM12 7.5V20m0-12.5c-2-4-5.5-3-4.5-1S10.5 7.5 12 7.5zm0 0c2-4 5.5-3 4.5-1S13.5 7.5 12 7.5z" /></>,
  };
  return <span className={styles.howIcon} aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[kind]}</svg></span>;
}

function PlayScreen(props: { shopping: ShoppingBrandId; loading: boolean; hasCampaign: boolean; error: string; participating: boolean; spinPhase: 'idle' | 'accel' | 'cruise' | 'land'; wheelAngle: number; participationError: string; result: SpinResult | null; cardCode: string; codeStatus: 'invalid' | 'repeated' | 'new' | null; canSpin: boolean; collectedCount: number; target: number; onChange: (value: string) => void; onClearResult: () => void; onSpin: () => void; onRetry: () => void; onGo: (view: View) => void; rulesUrl?: string | null }) {
  const { shopping, loading, hasCampaign, error, participating, spinPhase, wheelAngle, participationError, result, cardCode, codeStatus, canSpin, onChange, onClearResult, onSpin, onRetry, onGo } = props;
  const message = loading ? 'Consultando la campaña…' : !hasCampaign ? 'No hay una campaña activa para este shopping. Volvé más tarde.' : null;
  const hint = codeStatus === 'invalid' ? 'Ese código no figura en esta campaña. Revisá la tarjeta.' : codeStatus === 'repeated' ? 'Esta tarjeta ya la descubriste. Las repetidas no suman progreso.' : codeStatus === 'new' ? 'Tarjeta nueva: lista para girar.' : 'El código está impreso en la tarjeta o en el enlace QR.';
  const hintTone = codeStatus === 'invalid' ? styles.hintBad : codeStatus === 'repeated' ? styles.hintWarn : styles.hintNeutral;
  const wheelStatusText = participating
    ? spinPhase === 'accel'
      ? '¡Girando la ruleta! Validando tu tarjeta en el servidor…'
      : spinPhase === 'cruise'
        ? '¡Tomando velocidad! Buscando premios disponibles…'
        : '¡Frenando en tu resultado!…'
    : result
      ? (result.status === 'won' ? 'Premio confirmado' : 'Participación registrada')
      : 'La ruleta es decorativa: el premio lo confirma el servidor.';
  return <section className={styles.play} aria-labelledby="play-title">
    <div className={styles.screenHead}><span className={styles.kicker}>Minijuego</span><h2 id="play-title">Girá y descubrí</h2></div>
    <div className={`${styles.wheelWrap} ${participating ? styles.wheelBusy : ''}`} aria-busy={participating}>
      <Wheel spinning={participating} angle={wheelAngle} shopping={shopping} />
      <span className={`${styles.pointer} ${participating ? styles.pointerBounce : ''}`} aria-hidden="true" />
    </div>
    <p className={styles.wheelState} role="status" aria-live="polite">{wheelStatusText}</p>

    {result && <ResultCard result={result} onGo={onGo} onPlayAnother={() => { onClearResult(); document.getElementById('card-id')?.focus(); }} />}

    <form className={styles.codeForm} onSubmit={(event) => { event.preventDefault(); onSpin(); }}>
      <label className={styles.label} htmlFor="card-id">{result ? '¿Tenés otra tarjeta? Ingresá otro código' : 'Código de tu tarjeta'}</label>
      <input className={styles.codeInput} id="card-id" value={cardCode} placeholder="Ej.: CEN-DEMO-002" onChange={(event) => onChange(event.target.value)} maxLength={40} disabled={participating || loading} autoComplete="off" inputMode="text" aria-describedby="card-hint" />
      <small id="card-hint" className={`${styles.hint} ${hintTone}`}>{hint}</small>
      <button type="submit" className={styles.spinButton} disabled={!canSpin || loading}>{participating ? 'Girando ruleta…' : loading ? 'Cargando campaña…' : !hasCampaign ? 'Participación no disponible' : result ? 'Girar con este nuevo código' : 'Girar y descubrir'}</button>
    </form>
    {result && <button className={styles.secondaryWide} onClick={() => onGo('descubrir')}>Buscar otra tarjeta</button>}

    {message && <p className={styles.notice} role="status">{message}</p>}
    {(error || participationError) && <div className={styles.errorBox} role="alert"><span>{participationError || error}</span>{!participating && <button onClick={onRetry}>Reintentar</button>}</div>}
  </section>;
}

function ResultCard({ result, onGo, onPlayAnother }: { result: SpinResult; onGo: (view: View) => void; onPlayAnother: () => void }) {
  const won = result.status === 'won';
  const [copied, setCopied] = useState(false);
  async function copyVoucherCode() {
    if (!result.redeemCode) return;
    try {
      await navigator.clipboard.writeText(result.redeemCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { /* fallback manual selection */ }
  }
  return <article className={`${styles.resultCard} ${won ? styles.resultWon : styles.resultNone}`} role="status" aria-live="polite">
    <span className={styles.resultKicker}>{won ? 'PREMIO CONFIRMADO' : 'SIN PREMIO ESTA VEZ'}</span>
    <h3>{won ? result.prize?.name : 'Gracias por jugar'}</h3>
    <p>{won ? result.prize?.description || 'Presentá el código en el comercio indicado para canjear.' : 'Seguí recorriendo: cada tarjeta nueva suma a tu colección.'}</p>
    {won && result.redeemCode && <div className={styles.voucherPass}>
      <p className={styles.redeemInstruction}>Mostrá este QR en el comercio indicado. Tu cupón también quedó guardado en <strong>Mi progreso → Mis cupones</strong>, así que podés cargar otra tarjeta ahora sin perderlo.</p>
      {result.redeemQr && <Image unoptimized className={styles.redeemQr} src={result.redeemQr} width={220} height={220} alt={`Código QR de canje para ${result.prize?.name ?? 'tu premio'}`} /> }
      <code className={styles.redeemCode}>{result.redeemCode}</code>
      <button type="button" className={styles.copyCodeBtn} onClick={copyVoucherCode}>{copied ? '✓ Código copiado' : 'Copiar código de canje'}</button>
    </div>}
    {won && result.expiresAt && <small>Válido hasta {new Date(result.expiresAt).toLocaleString('es-AR')}</small>}
    <div className={styles.resultActions}>
      <button type="button" className={styles.resultActionBtn} onClick={onPlayAnother}>Ingresar otro código</button>
      {won && <button type="button" className={styles.resultActionSecondary} onClick={() => onGo('progreso')}>Ver mis cupones QR</button>}
    </div>
    {!won && <button className={styles.secondaryWide} onClick={() => onGo('descubrir')}>Buscar tarjetas</button>}
  </article>;
}

function Wheel({ spinning, angle, shopping }: { spinning: boolean; angle: number; shopping: ShoppingBrandId }) {
  const segments = WHEEL_LABELS.map((label, index) => {
    const start = (index * 60 - 90) * (Math.PI / 180);
    const end = ((index + 1) * 60 - 90) * (Math.PI / 180);
    const mid = (index * 60 - 60) * (Math.PI / 180);
    return { label, d: `M0 0 L${(Math.cos(start) * 92).toFixed(2)} ${(Math.sin(start) * 92).toFixed(2)} A92 92 0 0 1 ${(Math.cos(end) * 92).toFixed(2)} ${(Math.sin(end) * 92).toFixed(2)} Z`, tx: (Math.cos(mid) * 56).toFixed(2), ty: (Math.sin(mid) * 56).toFixed(2), angle: index * 60 };
  });
  const bulbs = Array.from({ length: 12 }, (_, idx) => {
    const rad = (idx * 30 - 90) * (Math.PI / 180);
    return { cx: (Math.cos(rad) * 96).toFixed(2), cy: (Math.sin(rad) * 96).toFixed(2), even: idx % 2 === 0 };
  });
  return <svg data-testid="campaign-wheel" data-spinning={spinning} className={`${styles.wheel} ${spinning ? styles.wheelSpin : ''}`} style={angle > 0 ? { transform: `rotate(${angle}deg)` } : undefined} viewBox="-104 -104 208 208" role="img" aria-label={`Ruleta decorativa de ${shopping === 'centenario' ? 'Centenario' : 'UniPlaza'}`}>
    <circle r="100" className={styles.wheelOuterRim} />
    <circle r="93" className={styles.wheelRim} />
    {segments.map((segment, index) => <g key={segment.label}>
      <path d={segment.d} className={index % 2 ? styles.segmentB : styles.segmentA} />
      <text transform={`translate(${segment.tx} ${segment.ty}) rotate(${segment.angle + 30})`} textAnchor="middle" dominantBaseline="middle">{segment.label}</text>
    </g>)}
    {bulbs.map((bulb, idx) => <circle key={idx} cx={bulb.cx} cy={bulb.cy} r="2.8" className={`${styles.wheelBulb} ${bulb.even ? styles.wheelBulbA : styles.wheelBulbB}`} />)}
    <circle r="24" className={styles.wheelHubGlow} />
    <circle r="20" className={styles.wheelHub} />
    <text className={styles.hubText} textAnchor="middle" dominantBaseline="middle">{shopping === 'centenario' ? 'C' : 'U'}</text>
  </svg>;
}

function DiscoverScreen({ campaign, collectedIds, target, showClue, onToggleClue, loading, onGo }: { campaign: PublicCampaign | null; collectedIds: string[]; target: number; showClue: boolean; onToggleClue: () => void; loading: boolean; onGo: (view: View) => void }) {
  const slots = Array.from({ length: target }, (_, index) => collectedIds[index]);
  const discovered = collectedIds.length;
  return <section className={styles.discover} aria-labelledby="discover-title">
    <div className={styles.screenHead}><span className={styles.kicker}>Búsqueda del tesoro</span><h2 id="discover-title">Tu colección</h2><p>Encontrá tarjetas diferentes. Las repetidas no suman progreso.</p></div>
    <div className={styles.collectionCount}><strong>{Math.min(discovered, target)}<small>/{target}</small></strong><span>{Math.max(0, target - discovered) > 0 ? `faltan ${Math.max(0, target - discovered)}` : 'completa'}</span></div>
    <div className={styles.discoverBar} aria-hidden="true"><span style={{ width: `${target > 0 ? Math.min(100, Math.round((Math.min(discovered, target) / target) * 100)) : 0}%` }} /></div>
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

function PrizesScreen({ shopping, prizes, loading, error, onOpen, onGo }: { shopping: ShoppingBrandId; prizes: Prize[]; loading: boolean; error: string; onOpen: (prize: Prize) => void; onGo: (view: View) => void }) {
  const ordered = prizes.slice().sort((a, b) => Number(b.available && b.remainingStock > 0) - Number(a.available && a.remainingStock > 0));
  const [featured, ...rest] = ordered;
  if (loading) return <section className={styles.prizes}><p className={styles.muted}>Consultando disponibilidad…</p></section>;
  if (!prizes.length) return <section className={styles.prizes}><div className={styles.screenHead}><h2>Premios</h2></div><p className={styles.notice} role="status">{error || 'Los premios se mostrarán cuando haya una campaña activa.'}</p><button className={styles.secondaryWide} onClick={() => onGo('jugar')}>Ir a Jugar</button></section>;
  const isAvailable = (prize: Prize) => prize.available && prize.remainingStock > 0;
  return <section className={styles.prizes} aria-labelledby="prizes-title">
    <div className={styles.screenHead}><span className={styles.kicker}>Catálogo</span><h2 id="prizes-title">Premios</h2><p>Disponibilidad real según la campaña activa.</p></div>
    {featured && <button className={styles.hero} onClick={() => onOpen(featured)}>
      <span className={styles.heroThumb}>{featured.imageUrl ? <Image src={featured.imageUrl} alt="" fill sizes="(max-width: 430px) 100vw, 430px" unoptimized /> : <GiftArt shopping={shopping} />}</span>
      <span className={styles.heroInfo}><small>DESTACADO</small><strong>{featured.name}</strong><em className={isAvailable(featured) ? styles.stockOk : styles.stockOut}>{isAvailable(featured) ? `Quedan ${featured.remainingStock}` : 'Agotado'}</em></span>
    </button>}
    <ul className={styles.prizeList}>{rest.map((prize) => <li key={prize.id}><button className={`${styles.prizeRow} ${isAvailable(prize) ? '' : styles.prizeSoldOut}`} onClick={() => onOpen(prize)}>
      <span className={styles.prizeRowThumb}>{prize.imageUrl ? <Image src={prize.imageUrl} alt="" fill sizes="76px" unoptimized /> : <GiftArt shopping={shopping} />}</span>
      <span className={styles.prizeRowBody}><strong>{prize.name}</strong><em className={isAvailable(prize) ? styles.stockOk : styles.stockOut}>{isAvailable(prize) ? `Quedan ${prize.remainingStock}` : 'Agotado'}</em></span>
      <span aria-hidden="true">›</span>
    </button></li>)}</ul>
  </section>;
}

function PrizeDetail({ prize, shopping, rulesUrl }: { prize: Prize; shopping: ShoppingBrandId; rulesUrl?: string | null }) {
  const available = prize.available && prize.remainingStock > 0;
  return <div className={styles.detail}>
    <span className={styles.detailImage}>{prize.imageUrl ? <Image src={prize.imageUrl} alt={prize.name} fill sizes="400px" unoptimized /> : <GiftArt shopping={shopping} />}</span>
    <span className={available ? styles.stockOk : styles.stockOut}>{available ? `Quedan ${prize.remainingStock} disponibles` : 'Agotado'}</span>
    <h2 className={styles.sheetTitle}>{prize.name}</h2>
    <p className={styles.muted}>{prize.description || 'Consultá las condiciones de participación.'}</p>
    <div className={styles.conditions}><b>Cómo canjear</b><p>Obtené el código participando con una tarjeta. Presentalo en el comercio indicado dentro del plazo que muestre tu resultado.</p>{rulesUrl && <a href={rulesUrl} target="_blank" rel="noreferrer">Leer bases y condiciones</a>}</div>
  </div>;
}

function ProgressScreen({ collected, target, complete, unlockText, wonPrize, rulesUrl, shoppingName, shopping, refreshKey, onGo }: { shopping: ShoppingBrandId; refreshKey: string; collected: number; target: number; complete: boolean; unlockText: string; wonPrize?: string; rulesUrl?: string | null; shoppingName: string; onGo: (view: View) => void }) {
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
    <CouponWallet shopping={shopping} refreshKey={refreshKey} />
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
