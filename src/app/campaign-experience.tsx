'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brandCssVariables, getShoppingBrand, type ShoppingBrandId } from '@/lib/brand';
import styles from './campaign-app.module.css';
import { CouponWallet } from './coupon-wallet';
import { ParticipantRegistration } from './participant-registration';
import { playFeedback, readSoundPreference, saveSoundPreference } from './play-feedback';
import { campaignEndLabel, expiryLabel } from '@/lib/countdown';
import { formatMerchants } from '@/lib/merchant-list';

type Prize = { id: string; name: string; description?: string | null; imageUrl?: string | null; remainingStock: number; available: boolean; merchants?: string[] };
type PublicCard = { publicId: string; location?: string | null; kind?: string };
type CompletionRewardInfo = {
  enabled: boolean;
  unlocked: boolean;
  justUnlocked?: boolean;
  mode: 'EXTRA_RAFFLE_ENTRY' | 'EXCLUSIVE_DRAW';
  title: string;
  terms: string;
  completedCount: number;
  target: number;
  pendingCount: number;
  completedCardIds: string[];
  requiredCardIds: string[];
  completedAt: string | null;
  rewardId: string | null;
  referenceId: string | null;
  bonusRaffleEntriesCount: number;
  scanRaffleEntriesCount: number;
  totalRaffleEntriesCount: number;
  exclusiveDrawEligible: boolean;
};
type PublicCampaign = {
  shopping?: { slug: string; name: string; brandSettings?: Record<string, unknown> };
  campaign?: { id: string; name: string; startsAt: string; endsAt: string; rulesUrl?: string | null; settings?: Record<string, unknown> } | null;
  prizes?: Prize[];
  cards?: PublicCard[];
  cardCount?: number;
  clue?: { text: string; startsAt: string; endsAt: string; forNextCard?: boolean } | null;
  zones?: Array<{ name: string; total: number; found: number }>;
  collectionProgress?: { count: number; cardIds: string[] };
  completionReward?: CompletionRewardInfo | null;
  raffleEntriesCount?: number;
  scanRaffleEntriesCount?: number;
  bonusRaffleEntriesCount?: number;
  exclusiveDrawEligible?: boolean;
  instantPrizeWon?: { id: string; name: string; status: string } | null;
};
type SpinResult = {
  status: 'won' | 'no_prize';
  prize?: { id?: string; name?: string; description?: string };
  redeemCode?: string;
  redeemQr?: string;
  expiresAt?: string;
  cardId: string;
  alreadyParticipated?: boolean;
  duplicateRejected?: boolean;
  instantPrizeLimitReached?: boolean;
  priorInstantPrize?: { id: string; name: string } | null;
  completionReward?: CompletionRewardInfo | null;
  raffleEntriesCount?: number;
  scanRaffleEntriesCount?: number;
  bonusRaffleEntriesCount?: number;
  exclusiveDrawEligible?: boolean;
  raffleEntryAdded?: boolean;
};
type View = 'inicio' | 'jugar' | 'descubrir' | 'premios' | 'progreso';

const VIEWS: Array<{ id: View; label: string }> = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'jugar', label: 'Jugar' },
  { id: 'descubrir', label: 'Descubrir' },
  { id: 'premios', label: 'Premios' },
  { id: 'progreso', label: 'Mi progreso' },
];
const HASH_VIEWS: Record<string, View> = { inicio: 'inicio', 'como-funciona': 'inicio', jugar: 'jugar', descubrir: 'descubrir', premios: 'premios', progreso: 'progreso', ayuda: 'progreso' };
const WHEEL_LABELS = ['REGALO', 'SORPRESA', 'OTRA VEZ', 'PREMIO', 'TARJETA', 'SUERTE'];
const CONFETTI = Array.from({ length: 18 }, (_, index) => ({ left: (index * 37) % 100, delay: (index % 6) * 0.12, hue: index % 3 }));

const STATION_NAMES_CENTENARIO = ['Plaza Central · Nivel 1', 'Galería del Pino · Nivel 1', 'Paseo Gourmet · Nivel 2', 'Atrio Principal · PB', 'Terraza Norte · Nivel 2'];
const STATION_NAMES_UNIPLAZA = ['Explanada Abierta · Norte', 'Boulevard de Luces · Centro', 'Pabellón Gastronómico', 'Plaza del Reloj · Sur', 'Pasarela Cultural'];

/** Limpia nombres técnicos de semillas demo para presentar títulos comerciales reales sin ocultar que es entorno demo. */
export function formatPrizeName(raw?: string | null): { title: string; isDemo: boolean; tag: string } {
  if (!raw) return { title: 'Beneficio de temporada', isDemo: false, tag: 'BENEFICIO' };
  const isDemo = /DEMO|SIN VALOR COMERCIAL/i.test(raw);
  let clean = raw
    .replace(/^DEMO\s*[—·-]\s*SIN VALOR COMERCIAL\s*[·—-]?\s*/i, '')
    .replace(/\bdemo\b\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/^cup[oó]n\s+del\s+10%/i.test(clean)) clean = 'Beneficio 10% OFF en locales';
  else if (/^cup[oó]n\s+del\s+20%/i.test(clean)) clean = 'Beneficio 20% OFF preferencial';
  else if (/^gift\s*card\s+de\s+\$?10\.?000/i.test(clean)) clean = 'Gift Card $10.000 de regalo';
  else if (/^premio\s+especial/i.test(clean)) clean = 'Experiencia Especial 2×1';
  else if (/^regalo\s+sorpresa/i.test(clean)) clean = 'Presente Sorpresa de Navidad';
  else if (clean.length > 0) clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  const tag = /20%|10%/i.test(clean) ? 'DESCUENTO DIRECTO' : /gift\s*card|\$/i.test(clean) ? 'ORDEN DE COMPRA' : 'OBSEQUIO EXCLUSIVO';
  return { title: clean || raw, isDemo, tag };
}

function formatCampaignBadge(rawName?: string | null, brandName?: string): { label: string; isDemo: boolean } {
  if (!rawName) return { label: `Temporada Navideña · ${brandName ?? 'Shopping'}`, isDemo: false };
  const isDemo = /demo/i.test(rawName);
  const clean = rawName.replace(/\bdemo\b/gi, 'Edición Festiva').replace(/\s+[—-]\s+/g, ' · ').replace(/\s+/g, ' ').trim();
  return { label: clean, isDemo };
}

function formatLocationName(rawLocation: string | null | undefined, index: number, shopping: ShoppingBrandId): string {
  const fallbackList = shopping === 'centenario' ? STATION_NAMES_CENTENARIO : STATION_NAMES_UNIPLAZA;
  if (!rawLocation) return fallbackList[index % fallbackList.length];
  const match = rawLocation.match(/^Punto\s+demo\s+(\d+)$/i);
  if (match) {
    const num = Number(match[1]);
    return fallbackList[(num - 1) % fallbackList.length];
  }
  return rawLocation;
}

function formatUnlockCopy(rawUnlock: string, shoppingName: string): string {
  if (/Colecci[oó]n demo completada/i.test(rawUnlock)) {
    return `Al reunir las 3 postas en ${shoppingName}, desbloqueás el sello de Colección Completa y participás por los beneficios destacados de temporada.`;
  }
  return rawUnlock;
}

export function CampaignExperience({ initialShopping }: { initialShopping: ShoppingBrandId }) {
  const shopping = initialShopping;
  const brand = getShoppingBrand(shopping);
  const [view, setView] = useState<View>('inicio');
  const [campaign, setCampaign] = useState<PublicCampaign | null>(null);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState('');
  // Campaña inexistente o inactiva: no es un fallo de conexión, se informa como aviso neutro.
  const [campaignNotice, setCampaignNotice] = useState('');
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
  // Sonido del minijuego: apagado por defecto, se recuerda por dispositivo.
  const [soundOn, setSoundOn] = useState(false);
  useEffect(() => { setSoundOn(readSoundPreference()); }, []);
  function toggleSound() {
    setSoundOn((current) => { saveSoundPreference(!current); return !current; });
  }
  const [participantState, setParticipantState] = useState<{ registered: boolean; maskedPhone?: string } | null>(null);
  const [dismissedReg, setDismissedReg] = useState(false);

  const rawUnlockText = typeof campaign?.campaign?.settings?.collectionUnlockText === 'string'
    ? campaign.campaign.settings.collectionUnlockText
    : typeof campaign?.shopping?.brandSettings?.collectionUnlockText === 'string'
      ? campaign.shopping.brandSettings.collectionUnlockText
      : 'Al completar las 3 postas del recorrido habilitás el beneficio especial de temporada.';
  const unlockText = formatUnlockCopy(rawUnlockText, brand.name);
  const activeCompletionReward = result?.completionReward ?? campaign?.completionReward ?? null;
  const collectionTarget = activeCompletionReward?.target ?? (typeof campaign?.campaign?.settings?.collectionTarget === 'number' ? campaign.campaign.settings.collectionTarget : (campaign?.cardCount || 3));
  const collected = activeCompletionReward ? activeCompletionReward.completedCount : Math.min(collectedIds.length, collectionTarget);
  const raffleEntriesCount = activeCompletionReward?.totalRaffleEntriesCount ?? campaign?.raffleEntriesCount ?? collectedIds.length;
  const instantPrizeWon = campaign?.instantPrizeWon ?? (result?.status === 'won' && result.prize?.name ? { id: 'won', name: result.prize.name, status: 'WON' } : null);
  const complete = Boolean(activeCompletionReward?.unlocked) || collected >= collectionTarget;
  const availablePrizes = campaign?.prizes?.filter((prize) => prize.available && prize.remainingStock > 0) ?? [];
  const featuredPrize = availablePrizes.slice().sort((a, b) => b.remainingStock - a.remainingStock)[0] ?? campaign?.prizes?.[0];
  const cardCode = cardId.trim().toUpperCase();
  // La validez del código la decide el servidor al participar; el cliente solo distingue repetidas de nuevas.
  const codeStatus = !cardCode ? null : collectedIds.includes(cardCode) ? 'repeated' : 'new';
  const canSpin = Boolean(campaign?.campaign) && !participating && Boolean(cardCode);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get('card');
    if (cardParam) setCardId(cardParam.trim().toUpperCase());
    const fromHash = HASH_VIEWS[window.location.hash.replace('#', '')];
    if (fromHash) setView(fromHash);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setCampaignLoading(true);
    setCampaignError('');
    setCampaignNotice('');
    const campaignSlug = new URLSearchParams(window.location.search).get('campaign');
    const query = campaignSlug ? `?campaign=${encodeURIComponent(campaignSlug)}` : '';
    fetch(`/api/campaigns/${shopping}/public${query}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw Object.assign(new Error(payload.error || 'No pudimos consultar la campaña.'), { status: response.status });
        setCampaign(payload);
        setCollectedIds(payload.collectionProgress?.cardIds ?? []);
        if (payload.participant) {
          setParticipantState({
            registered: Boolean(payload.participant.registered),
            maskedPhone: payload.participant.maskedPhone,
          });
        } else {
          setParticipantState({ registered: false });
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setCampaign(null);
        const status = (error as { status?: number }).status;
        if (status === 404) {
          // Sin campaña activa el servidor responde 404 con un mensaje claro: no es un fallo de conexión.
          setCampaignNotice(error instanceof Error ? error.message : 'Todavía no hay una campaña activa en este shopping.');
        } else {
          setCampaignError(status
            ? 'La campaña no está disponible en este momento. Intentá nuevamente en unos minutos.'
            : 'No pudimos conectar con la campaña. Verificá tu conexión e intentá nuevamente.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCampaignLoading(false);
      });
    return () => controller.abort();
  }, [shopping, reloadKey]);

  function goTo(next: View) {
    setView(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  }

  function playWithCode(code: string) {
    setCardId(code.toUpperCase());
    setParticipationError('');
    goTo('jugar');
  }

  async function spin() {
    if (!canSpin || !campaign?.campaign) return;
    const submittedCode = cardCode;
    setParticipating(true);
    setParticipationError('');
    setResult(null);
    setSpinPhase('accel');
    playFeedback.spinStart(soundOn);
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spinDurationMs = reducedMotion ? 0 : 3200;
    const t1 = !reducedMotion ? window.setTimeout(() => setSpinPhase('cruise'), 1000) : undefined;
    const t2 = !reducedMotion ? window.setTimeout(() => setSpinPhase('land'), 2200) : undefined;
    try {
      const startedAt = Date.now();
      const response = await fetch('/api/participations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shoppingSlug: shopping, cardId: submittedCode, idempotencyKey: crypto.randomUUID() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No pudimos registrar tu participación.');
      if (payload.status !== 'won' && payload.status !== 'no_prize') throw new Error('El servidor devolvió una respuesta inesperada.');
      const targetSectorIndex = payload.status === 'won' ? 3 : 2;
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
      if (payload.status === 'won') playFeedback.win(soundOn); else playFeedback.noPrize(soundOn);
      setCardId('');
      setCollectedIds(payload.collectionProgress?.cardIds ?? collectedIds);
      setReloadKey((key) => key + 1);
    } catch (error) {
      playFeedback.error();
      setParticipationError(error instanceof Error ? error.message : 'No pudimos registrar tu participación. Revisá la conexión e intentá de nuevo.');
    } finally {
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
      setSpinPhase('idle');
      setParticipating(false);
    }
  }

  const heroPhotoSrc = shopping === 'centenario' ? '/campaign/centenario/hero-photo.webp' : '/campaign/uniplaza/hero-photo.jpg';
  const totalStock = availablePrizes.reduce((acc, item) => acc + item.remainingStock, 0);

  return (
    <div className={styles.stage} data-testid="campaign-stage" data-shopping={shopping} style={brandCssVariables(brand, campaign?.shopping?.brandSettings) as CSSProperties}>
      {/* El registro con celular es opcional: se ofrece al entrar a Jugar, no bloquea el resto de la app. */}
      {!campaignLoading && participantState && !participantState.registered && !dismissedReg && view === 'jugar' && (
        <ParticipantRegistration
          shopping={shopping}
          campaignName={campaign?.campaign?.name}
          rulesUrl={campaign?.campaign?.rulesUrl}
          onDismiss={() => setDismissedReg(true)}
          onSuccess={(data) => {
            setParticipantState({ registered: true, maskedPhone: data.phone });
            setReloadKey((k) => k + 1);
          }}
        />
      )}
      <aside className={styles.stageArt} aria-label="Presentación editorial del shopping">
        <div className={styles.stagePhotoWrap} aria-hidden="true">
          <Image src={heroPhotoSrc} alt="" fill sizes="50vw" priority className={styles.stagePhoto} />
          <div className={styles.stageOverlay} />
        </div>
        <div className={styles.stageEditorial}>
          <span className={styles.stageBadge}>{shopping === 'centenario' ? 'COLECCIÓN DE TEMPORADA · CENTENARIO' : 'PASEO URBANO A CIELO ABIERTO · UNIPLAZA'}</span>
          <p className={styles.stageHeadline}>{brand.experience.heroTitle} <em>{brand.experience.heroEmphasis}</em></p>
          <p>{brand.experience.heroMessage}</p>
          <div className={styles.stageStats}>
            <div><strong>{campaign?.cardCount ?? 10}</strong><span>Postas QR/NFC activas</span></div>
            <div><strong>{totalStock}</strong><span>Beneficios disponibles</span></div>
            <div><strong>{collected}/{collectionTarget}</strong><span>Tu pasaporte hoy</span></div>
          </div>
          <div className={styles.stageSwitcher}>
            <span>Experiencias del grupo:</span>
            <Link href="/centenario" className={shopping === 'centenario' ? styles.stageSwitchActive : ''}>Ir a Centenario</Link>
            <Link href="/uniplaza" className={shopping === 'uniplaza' ? styles.stageSwitchActive : ''}>Ir a UniPlaza</Link>
            <Link href="/merchant">Portal Comercios ↗</Link>
          </div>
        </div>
      </aside>

      <main className={styles.app} data-view={view}>
        <header className={styles.topbar}>
          <a className={styles.brand} href="#inicio" onClick={(event) => { event.preventDefault(); goTo('inicio'); }}>
            {brand.logo.src ? (
              <span className={`${styles.brandLogo} ${shopping === 'uniplaza' ? styles.brandLogoDark : ''}`}>
                <Image src={brand.logo.src} alt={brand.logo.alt} width={shopping === 'centenario' ? 584 : 661} height={shopping === 'centenario' ? 161 : 172} unoptimized priority style={{ height: 34, width: 'auto' }} />
              </span>
            ) : (
              <span className={styles.brandMonogram} aria-hidden="true">{shopping === 'centenario' ? 'C' : 'U'}</span>
            )}
            <span className={styles.brandCopy}>
              <strong className={brand.logo.src ? styles.srOnly : undefined}>{brand.name}</strong>            </span>
          </a>
          <div className={styles.topActions}>
            <button type="button" className={styles.progressChip} onClick={() => goTo('progreso')} title="Ver tus cupones y progreso de colección">
              <span className={styles.progressChipDot} aria-hidden="true" />
              <b>{collected}/{collectionTarget}</b> <small>postas</small>
            </button>
          </div>
        </header>

        {campaignNotice && <p className={styles.campaignNotice} role="status">{campaignNotice}</p>}
        <InstallPrompt shopping={shopping} />

        <div className={styles.screen}>
          {view === 'inicio' && (
            <>
            <HomeStatusStrip missing={Math.max(0, collectionTarget - collected)} endsAt={campaign?.campaign?.endsAt} onGo={goTo} />
            <HomeScreen
              brandName={brand.name}
              title={brand.experience.heroTitle}
              emphasis={brand.experience.heroEmphasis}
              message={brand.experience.heroMessage}
              primaryAction={brand.experience.primaryAction}
              shopping={shopping}
              featured={featuredPrize}
              totalStock={totalStock}
              collectedIds={collectedIds}
              cards={campaign?.cards ?? []}
              totalCards={campaign?.cardCount ?? 0}
              collected={collected}
              target={collectionTarget}
              raffleEntriesCount={raffleEntriesCount}
              instantPrizeWon={instantPrizeWon}
              completionReward={activeCompletionReward}
              campaignName={campaign?.campaign?.name}
              clueText={campaign?.clue?.text}
              loading={campaignLoading}
              error={campaignError}
              onRetry={() => setReloadKey((key) => key + 1)}
              onGo={goTo}
              onOpenPrize={(prize) => { goTo('premios'); setSelectedPrize(prize); }}
            />
            <div className={styles.homeShare}><ShareButton shopping={shopping} brandName={brand.name} /></div>
            </>
          )}
          {view === 'jugar' && (
            <PlayScreen
              shopping={shopping}
              loading={campaignLoading}
              hasCampaign={Boolean(campaign?.campaign)}
              error={campaignError}
              participating={participating}
              spinPhase={spinPhase}
              wheelAngle={wheelAngle}
              participationError={participationError}
              result={result}
              cardCode={cardCode}
              codeStatus={codeStatus}
              canSpin={canSpin}
              cards={campaign?.cards ?? []}
              collectedIds={collectedIds}
              collectedCount={collected}
              raffleEntriesCount={raffleEntriesCount}
              instantPrizeWon={instantPrizeWon}
              completionReward={activeCompletionReward}
              target={collectionTarget}
              onChange={(value) => { setCardId(value.toUpperCase()); setParticipationError(''); }}
              onClearResult={() => { setResult(null); setCardId(''); setParticipationError(''); }}
              onSpin={spin}
              onRetry={() => setReloadKey((key) => key + 1)}
              onGo={goTo}
              rulesUrl={campaign?.campaign?.rulesUrl}
              soundOn={soundOn}
              onToggleSound={toggleSound}
              brandName={brand.name}
              resultMerchants={result?.status === 'won' ? campaign?.prizes?.find((prize) => prize.id === result.prize?.id)?.merchants : undefined}
            />
          )}
          {view === 'descubrir' && (
            <DiscoverScreen
              shopping={shopping}
              campaign={campaign}
              collectedIds={collectedIds}
              raffleEntriesCount={raffleEntriesCount}
              completionReward={activeCompletionReward}
              target={collectionTarget}
              showClue={showClue}
              onToggleClue={() => setShowClue((value) => !value)}
              loading={campaignLoading}
              error={campaignError}
              onRetry={() => setReloadKey((key) => key + 1)}
              onSelectCard={playWithCode}
              onGo={goTo}
            />
          )}
          {view === 'premios' && (
            <PrizesScreen
              shopping={shopping}
              prizes={campaign?.prizes ?? []}
              loading={campaignLoading}
              error={campaignError}
              hasCampaign={Boolean(campaign?.campaign)}
              onRetry={() => setReloadKey((key) => key + 1)}
              onOpen={setSelectedPrize}
              onGo={goTo}
            />
          )}
          {view === 'progreso' && (
            <ProgressScreen
              collected={collected}
              raffleEntriesCount={raffleEntriesCount}
              instantPrizeWon={instantPrizeWon}
              completionReward={activeCompletionReward}
              target={collectionTarget}
              complete={complete}
              unlockText={unlockText}
              wonPrize={result?.status === 'won' ? result.prize?.name : instantPrizeWon?.name}
              rulesUrl={campaign?.campaign?.rulesUrl}
              shoppingName={brand.name}
              shopping={shopping}
              refreshKey={result?.redeemCode ?? ''}
              onGo={goTo}
            />
          )}
        </div>

        {view === 'jugar' && (result?.status === 'won' || Boolean(result?.completionReward?.justUnlocked)) && <Confetti />}
        <footer className={styles.appFooter}>
          <span>{brand.name}</span>
          <Link href="/merchant">Acceso Comercios</Link>
        </footer>

        <nav className={styles.tabbar} aria-label="Secciones de la campaña">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.tab} ${view === item.id ? styles.tabActive : ''}`}
              aria-current={view === item.id ? 'page' : undefined}
              onClick={() => goTo(item.id)}
            >
              <Icon name={item.id} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      {selectedPrize && (
        <Sheet label={formatPrizeName(selectedPrize.name).title} onClose={() => setSelectedPrize(null)}>
          <PrizeDetail prize={selectedPrize} shopping={shopping} rulesUrl={campaign?.campaign?.rulesUrl} onPlay={() => { setSelectedPrize(null); goTo('jugar'); }} />
        </Sheet>
      )}
    </div>
  );
}

function CompletionRewardCredential({
  completionReward,
  inCard = false,
}: {
  completionReward?: CompletionRewardInfo | null;
  inCard?: boolean;
}) {
  if (!completionReward || !completionReward.enabled) return null;

  if (completionReward.unlocked) {
    const isExclusive = completionReward.mode === 'EXCLUSIVE_DRAW';
    return (
      <div
        className={`${styles.completionCredential} ${inCard ? styles.completionCredentialInCard : ''} ${completionReward.justUnlocked ? styles.completionJustUnlocked : ''}`}
        data-testid="completion-reward-credential"
        data-mode={completionReward.mode}
        role="status"
      >
        <div className={styles.completionTop}>
          <span className={styles.completionKicker}>
            {completionReward.justUnlocked ? '★ ¡RECORRIDO COMPLETO DESBLOQUEADO!' : '★ RECOMPENSA POR RECORRIDO COMPLETO'}
          </span>
          {completionReward.referenceId && (
            <span className={styles.completionRefBadge}>REF. {completionReward.referenceId}</span>
          )}
        </div>
        <h4>
          {isExclusive
            ? 'Acceso habilitado al Sorteo Exclusivo'
            : '+1 Participación extra en el Sorteo Final'}
        </h4>
        <p>{completionReward.terms}</p>
        <div className={styles.completionMetaRow}>
          {isExclusive ? (
            <>
              <span className={styles.completionMetaPill}>Sorteo Exclusivo: Elegible ✓</span>
              <span className={styles.completionMetaPill}>Chances Sorteo General: {completionReward.scanRaffleEntriesCount}</span>
            </>
          ) : (
            <>
              <span className={styles.completionMetaPill}>Chances escaneo: {completionReward.scanRaffleEntriesCount}</span>
              <span className={styles.completionMetaPill}>Extra recorrido: +{completionReward.bonusRaffleEntriesCount}</span>
              <span className={styles.completionMetaPill}>Total Sorteo Final: {completionReward.totalRaffleEntriesCount}</span>
            </>
          )}
          {completionReward.completedAt && (
            <span className={styles.completionMetaPill}>
              Completado: {new Date(completionReward.completedAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          )}
        </div>
      </div>
    );
  }

  const missing = completionReward.pendingCount;
  const rewardLabel = completionReward.mode === 'EXCLUSIVE_DRAW'
    ? 'Acceso al Sorteo Exclusivo por completar el recorrido'
    : '+1 participación extra en el Sorteo Final';

  return (
    <div className={`${styles.completionPendingNote} ${inCard ? '' : styles.completionPendingStandalone}`} data-testid="completion-reward-pending">
      <strong>Recompensa por completar todas las postas:</strong> Te {missing === 1 ? 'falta 1 posta válida' : `faltan ${missing} postas válidas`} ({completionReward.completedCount}/{completionReward.target}) para desbloquear <em>{rewardLabel}</em>.
    </div>
  );
}

function HomeScreen({
  brandName, title, emphasis, message, primaryAction, shopping, featured, totalStock, collectedIds, cards, totalCards, collected, target, raffleEntriesCount, instantPrizeWon, completionReward, campaignName, clueText, loading, error, onRetry, onGo, onOpenPrize,
}: {
  brandName: string; title: string; emphasis: string; message: string; primaryAction: string; shopping: ShoppingBrandId; featured?: Prize; totalStock: number; collectedIds: string[]; cards: PublicCard[]; totalCards: number; collected: number; target: number; raffleEntriesCount: number; instantPrizeWon?: { id: string; name: string; status: string } | null; completionReward?: CompletionRewardInfo | null; campaignName?: string; clueText?: string; loading: boolean; error: string; onRetry: () => void; onGo: (view: View) => void; onOpenPrize: (prize: Prize) => void;
}) {
  const collectedCards = new Set(collectedIds);
  const centenario = shopping === 'centenario';
  const badge = formatCampaignBadge(campaignName, brandName);
  const featuredMeta = featured ? formatPrizeName(featured.name) : null;
  const progressPercent = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  if (centenario) {
    return (
      <section className={`${styles.home} ${styles.centenarioHome}`} aria-labelledby="home-title">
        {/* HERO EDITORIAL BOUTIQUE — CENTENARIO */}
        <div className={styles.centenarioHeroCard}>
          <div className={styles.centenarioHeroMedia} aria-hidden="true">
            <Image src="/campaign/centenario/hero-photo.webp" alt="" fill sizes="(max-width: 900px) 100vw, 460px" priority className={styles.heroImg} />
            <div className={styles.centenarioHeroScrim} />
          </div>
          <div className={styles.centenarioHeroContent}>
            <div className={styles.heroTopRow}>
              <span className={styles.chip}>
                <i className={styles.chipDot} aria-hidden="true" />
                {loading ? 'Sincronizando temporada…' : badge.label}
              </span>
              {badge.isDemo && <span className={styles.demoPill} title="Entorno de demostración sin valor comercial">DEMO</span>}
            </div>
            <h1 id="home-title">{title} <em>{emphasis}</em></h1>
            <p className={styles.heroLead}>{message}</p>
            <div className={styles.heroActionGroup}>
              <button className={styles.heroPrimaryAction} onClick={() => onGo('jugar')}>
                <span>{primaryAction}</span>
                <span aria-hidden="true">→</span>
              </button>
              <button type="button" className={styles.heroGhostAction} onClick={() => onGo('descubrir')}>
                Explorar postas ({totalCards || 10})
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.stateAlert} role="alert">
            <div>
              <strong>No pudimos cargar la campaña</strong>
              <span>{error}</span>
            </div>
            <button type="button" onClick={onRetry}>Reintentar</button>
          </div>
        )}

        {/* PASAPORTE ARTESANAL DE SELLOS — CENTENARIO */}
        <section className={styles.centenarioPassport} aria-labelledby="passport-title">
          <div className={styles.passportHeader}>
            <div>
              <small className={styles.passportEyebrow}>LIBRETA DE COLECCIÓN · CENTENARIO</small>
              <h2 id="passport-title">Tu colección</h2>
            </div>
            <span className={styles.passportCounterPill}>{collected} de {target} sellos · {raffleEntriesCount} {raffleEntriesCount === 1 ? 'chance' : 'chances'}</span>
          </div>
          <div className={styles.passportBar} aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <button type="button" className={styles.centenarioStampGrid} onClick={() => onGo('progreso')} aria-describedby="passport-hint">
            {Array.from({ length: target }, (_, index) => {
              const foundId = [...collectedCards][index];
              const card = foundId ? cards.find((item) => item.publicId === foundId) : undefined;
              const stationLabel = formatLocationName(card?.location, index, shopping);
              return (
                <span key={index} className={`${styles.centenarioStamp} ${foundId ? styles.centenarioStampFound : ''}`}>
                  <b className={styles.postaTag}>SELLO 0{index + 1}</b>
                  <span className={styles.stampMedallion} aria-hidden="true">{foundId ? '✓' : `0${index + 1}`}</span>
                  <strong className={styles.stampStatus}>{foundId ? 'Sellado' : 'Disponible'}</strong>
                  <small className={styles.stampLocation}>{foundId ? stationLabel : 'En recorrido'}</small>
                </span>
              );
            })}
          </button>
          <p id="passport-hint" className={styles.passportFooterHint}>
            {instantPrizeWon
              ? `★ Ya obtuviste tu premio instantáneo (${formatPrizeName(instantPrizeWon.name).title}). Cada nueva posta válida suma +1 chance para el Sorteo Final (${raffleEntriesCount} acumuladas).`
              : collected >= target
                ? `¡Pasaporte completo! Tenés ${raffleEntriesCount} participaciones acumuladas para el Sorteo Final.`
                : `Cada cartel QR distinto te da 1 giro por premio instantáneo (máx. 1 por campaña) y suma +1 chance para el Sorteo Final.`}
          </p>
          <CompletionRewardCredential completionReward={completionReward} inCard />
        </section>

        {/* VITRINA DE BENEFICIO DESTACADO CON FOTOGRAFÍA REAL */}
        <button
          type="button"
          className={`${styles.centenarioFeatureCard} ${featured && (!featured.available || featured.remainingStock <= 0) ? styles.featureUnavailable : ''}`}
          onClick={() => (featured ? onOpenPrize(featured) : onGo('premios'))}
        >
          <div className={styles.centenarioFeatureMedia} aria-hidden="true">
            <Image src="/campaign/centenario/featured-gift.webp" alt="" fill sizes="(max-width: 900px) 100vw, 440px" className={styles.featureImg} />
            <div className={styles.centenarioFeatureScrim} />
          </div>
          <div className={styles.centenarioFeatureBody}>
            <div className={styles.featureTagRow}>
              <small className={styles.featureEyebrow}>★ {featuredMeta ? featuredMeta.tag : 'CATÁLOGO DE TEMPORADA'}</small>
              {featured && (
                <span className={styles.featureStockPill}>
                  {featured.available && featured.remainingStock > 0 ? `${featured.remainingStock} disponibles` : 'Agotado'}
                </span>
              )}
            </div>
            <strong>{featuredMeta ? featuredMeta.title : loading ? 'Preparando beneficios del día…' : 'Conocé los regalos de temporada'}</strong>
            <em>
              {featured
                ? `${totalStock} beneficios activos hoy en locales adheridos · Tocá para ver condiciones`
                : 'Consultá el catálogo completo de locales participantes.'}
            </em>
          </div>
          <span className={styles.featureArrow} aria-hidden="true">→</span>
        </button>

        {/* GUÍA EDITORIAL EN LISTA HORIZONTAL + PISTA DEL DÍA */}
        <section className={styles.centenarioEditorialGuide} aria-label="Cómo participar">
          <div className={styles.guideHeader}>
            <small>CÓMO PARTICIPAR</small>
            <h3>Tres pasos en tu visita</h3>
          </div>
          <ol className={styles.centenarioStepsList}>
            <li>
              <span className={styles.romanNum}>I</span>
              <div>
                <b>Recorré las postas</b>
                <span>Ubicadas en plazas y galerías del shopping.</span>
              </div>
            </li>
            <li>
              <span className={styles.romanNum}>II</span>
              <div>
                <b>Escaneá o cargá el código</b>
                <span>Activá la tarjeta en la ruleta de temporada.</span>
              </div>
            </li>
            <li>
              <span className={styles.romanNum}>III</span>
              <div>
                <b>Canjeá con tu QR digital</b>
                <span>Presentá tu voucher directo en el comercio.</span>
              </div>
            </li>
          </ol>
          <button type="button" className={styles.centenarioClueBar} onClick={() => onGo('descubrir')}>
            <div>
              <small>PISTA ACTIVA DE HOY</small>
              <span>{clueText ? 'Hay una pista disponible para encontrar tu próxima tarjeta' : 'Ver mapa de postas y pistas del recorrido'}</span>
            </div>
            <b aria-hidden="true">Ver →</b>
          </button>
        </section>
      </section>
    );
  }

  /* =========================================================================
     UNIPLAZA SHOPPING — URBAN NIGHT PROMENADE & CONTEMPORARY CLUB
     Composición propia: Hero arquitectónico nocturno, Circuito de Estaciones
     Conectadas (Wayfinding Track), Bento Grid asimétrico y Showcase fotográfico.
     ========================================================================= */
  return (
    <section className={`${styles.home} ${styles.uniplazaHome}`} aria-labelledby="home-title">
      {/* HERO ARQUITECTÓNICO NOCTURNO — UNIPLAZA */}
      <div className={styles.uniplazaHeroCard}>
        <div className={styles.uniplazaHeroMedia} aria-hidden="true">
          <Image src="/campaign/uniplaza/hero-photo.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 460px" priority className={styles.heroImg} />
          <div className={styles.uniplazaHeroScrim} />
        </div>
        <div className={styles.uniplazaHeroContent}>
          <div className={styles.heroTopRow}>
            <span className={styles.uniplazaLiveBadge}>
              <i className={styles.chipDot} aria-hidden="true" />
              {loading ? 'CONECTANDO PASEO…' : badge.label}
            </span>
            {badge.isDemo && <span className={styles.demoPill}>DEMO</span>}
          </div>
          <h1 id="home-title">{title} <em>{emphasis}</em></h1>
          <p className={styles.heroLead}>{message}</p>
          <div className={styles.uniplazaHeroMetrics}>
            <div><b>{totalCards || 10}</b><span>Estaciones activas</span></div>
            <div><b>{totalStock}</b><span>Vouchers hoy</span></div>
          </div>
          <div className={styles.heroActionGroup}>
            <button className={`${styles.heroPrimaryAction} ${styles.uniplazaHeroAction}`} onClick={() => onGo('jugar')}>
              <span>{primaryAction}</span>
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" className={styles.uniplazaGhostAction} onClick={() => onGo('premios')}>
              Catálogo
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.stateAlert} role="alert">
          <div>
            <strong>No pudimos cargar la campaña</strong>
            <span>{error}</span>
          </div>
          <button type="button" onClick={onRetry}>Reintentar</button>
        </div>
      )}

      {/* CIRCUITO URBANO DE ESTACIONES (WAYFINDING TRACK) — UNIPLAZA */}
      <section className={styles.uniplazaCircuit} aria-labelledby="passport-title">
        <div className={styles.circuitTop}>
          <div>
            <small className={styles.uniplazaEyebrow}>CIRCUITO URBANO · WAYFINDING</small>
            <h2 id="passport-title">Tu colección</h2>
          </div>
          <div className={styles.circuitBadge}>
            <strong>{collected}/{target}</strong>
            <span>estaciones · {raffleEntriesCount} chances</span>
          </div>
        </div>

        <div className={styles.uniplazaTrackBar} aria-hidden="true">
          <span style={{ width: `${progressPercent}%` }} />
        </div>

        <button type="button" className={styles.uniplazaNodes} onClick={() => onGo('progreso')} aria-describedby="passport-hint">
          {Array.from({ length: target }, (_, index) => {
            const foundId = [...collectedCards][index];
            const card = foundId ? cards.find((item) => item.publicId === foundId) : undefined;
            const stationLabel = formatLocationName(card?.location, index, shopping);
            return (
              <span key={index} className={`${styles.uniplazaNode} ${foundId ? styles.uniplazaNodeActive : ''}`}>
                <span className={styles.nodeIndex}>{foundId ? '✓' : `0${index + 1}`}</span>
                <span className={styles.nodeCopy}>
                  <b>ESTACIÓN 0{index + 1} · {foundId ? 'ACTIVA' : 'PENDIENTE'}</b>
                  <strong>{stationLabel}</strong>
                </span>
                <span className={styles.nodeTag}>{foundId ? foundId : 'Escanear QR'}</span>
              </span>
            );
          })}
        </button>
        <p id="passport-hint" className={styles.passportFooterHint}>
          {instantPrizeWon
            ? `★ Ya obtuviste tu beneficio instantáneo (${formatPrizeName(instantPrizeWon.name).title}). Seguí escaneando estaciones distintas para sumar chances al Sorteo Final (${raffleEntriesCount} acumuladas).`
            : collected >= target
              ? `Circuito completo · ${raffleEntriesCount} participaciones acumuladas para el Sorteo Final.`
              : `Cada estación QR distinta habilita 1 giro (máx. 1 premio directo por campaña) y suma +1 chance para el Sorteo Final.`}
        </p>
        <CompletionRewardCredential completionReward={completionReward} inCard />
      </section>

      {/* SHOWCASE FOTOGRÁFICO NOCTURNO — UNIPLAZA */}
      <button
        type="button"
        className={`${styles.uniplazaFeatureCard} ${featured && (!featured.available || featured.remainingStock <= 0) ? styles.featureUnavailable : ''}`}
        onClick={() => (error ? onRetry() : featured ? onOpenPrize(featured) : onGo('premios'))}
      >
        <div className={styles.uniplazaFeatureMedia} aria-hidden="true">
          <Image src="/campaign/uniplaza/featured-gift.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 440px" className={styles.featureImg} />
          <div className={styles.uniplazaFeatureScrim} />
        </div>
        <div className={styles.uniplazaFeatureBody}>
          <div className={styles.featureTagRow}>
            <small className={styles.uniplazaFeatureEyebrow}>★ {featuredMeta ? featuredMeta.tag : 'BENEFICIO DE PASEO'}</small>
            {featured && (
              <span className={styles.uniplazaStockPill}>
                {featured.available && featured.remainingStock > 0 ? `${featured.remainingStock} en stock` : 'Agotado'}
              </span>
            )}
          </div>
          <strong>{featuredMeta ? featuredMeta.title : loading ? 'Consultando beneficios activos…' : 'Beneficios exclusivos en locales'}</strong>
          <em>
            {featured
              ? 'Validación inmediata con código QR en comercios adheridos de UniPlaza'
              : 'Tocá para explorar todos los beneficios de la campaña.'}
          </em>
        </div>
        <span className={styles.uniplazaFeatureArrow} aria-hidden="true">→</span>
      </button>

      {/* BENTO GRID ASIMÉTRICO URBANO + RADAR DE PISTA */}
      <div className={styles.uniplazaBento} aria-label="Cómo participar">
        <button type="button" className={styles.bentoRadar} onClick={() => onGo('descubrir')}>
          <span className={styles.bentoKicker}>RADAR DEL PASEO</span>
          <strong>¿Buscás la próxima estación?</strong>
          <p>{clueText ? 'Hay una pista activa lista para desbloquear tu siguiente posta.' : 'Consultá las ubicaciones habilitadas en las plazas abiertas.'}</p>
          <span className={styles.bentoLink}>Abrir mapa y pista →</span>
        </button>
        <div className={styles.bentoSteps}>
          <div><StepIcon kind="search" /><b>1. Explorá</b><span>las plazas abiertas</span></div>
          <div><StepIcon kind="scan" /><b>2. Activá</b><span>QR/NFC en la ruleta</span></div>
          <div><StepIcon kind="gift" /><b>3. Canjeá</b><span>tu pase en el local</span></div>
        </div>
      </div>
    </section>
  );
}

function StepIcon({ kind }: { kind: 'search' | 'scan' | 'gift' }) {
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.2" /><path d="m15.3 15.3 4.2 4.2" /></>,
    scan: <><path d="M8 4H5a1 1 0 0 0-1 1v3m12-4h3a1 1 0 0 1 1 1v3M4 16v3a1 1 0 0 0 1 1h3m12-4v3a1 1 0 0 1-1 1h-3M8 12h8" /></>,
    gift: <><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7.5h18V10H3zM12 7.5V20m0-12.5c-2-4-5.5-3-4.5-1S10.5 7.5 12 7.5zm0 0c2-4 5.5-3 4.5-1S13.5 7.5 12 7.5z" /></>,
  };
  return <span className={styles.howIcon} aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths[kind]}</svg></span>;
}

function PlayScreen(props: {
  shopping: ShoppingBrandId; loading: boolean; hasCampaign: boolean; error: string; participating: boolean; spinPhase: 'idle' | 'accel' | 'cruise' | 'land'; wheelAngle: number; participationError: string; result: SpinResult | null; cardCode: string; codeStatus: 'invalid' | 'repeated' | 'new' | null; canSpin: boolean; cards: PublicCard[]; collectedIds: string[]; collectedCount: number; raffleEntriesCount: number; instantPrizeWon?: { id: string; name: string; status: string } | null; completionReward?: CompletionRewardInfo | null; target: number; onChange: (value: string) => void; onClearResult: () => void; onSpin: () => void; onRetry: () => void; onGo: (view: View) => void; rulesUrl?: string | null;
  soundOn: boolean; onToggleSound: () => void; brandName: string; resultMerchants?: string[];
}) {
  const { shopping, loading, hasCampaign, error, participating, spinPhase, wheelAngle, participationError, result, cardCode, codeStatus, canSpin, cards, collectedIds, collectedCount, raffleEntriesCount, instantPrizeWon, completionReward, target, onChange, onClearResult, onSpin, onRetry, onGo, soundOn, onToggleSound, brandName, resultMerchants } = props;
  const demoCards = cards.filter((c) => /DEMO/i.test(c.publicId)).slice(0, 5);
  const hint = codeStatus === 'repeated'
      ? 'Ya utilizaste esta posta en esta campaña. Consultar de nuevo recupera tu resultado previo sin sumar jugadas ni chances extra.'
      : codeStatus === 'new'
        ? instantPrizeWon
          ? `✓ Posta nueva verificada. Ya tenés tu premio instantáneo de campaña; activarla suma +1 participación al Sorteo Final.`
          : '✓ Posta verificada y nueva para tu pasaporte. ¡Lista para girar y sumar +1 chance al Sorteo Final!'
        : 'Ingresá el código impreso debajo del QR de la posta.';
  const hintTone = codeStatus === 'repeated' ? styles.hintWarn : codeStatus === 'new' ? styles.hintGood : styles.hintNeutral;
  const wheelStatusText = participating
    ? spinPhase === 'accel'
      ? '¡Girando la ruleta! Verificando posta…'
      : spinPhase === 'cruise'
        ? '¡A toda velocidad! Consultando beneficios disponibles…'
        : '¡Frenando en tu resultado!…'
    : result
      ? (result.status === 'won' ? '★ Beneficio asignado y guardado en tu billetera' : 'Participación registrada en tu recorrido')
      : cardCode && codeStatus === 'new'
        ? `Posta ${cardCode} lista · Tocá «Girar y descubrir»`
        : `Tu pasaporte hoy: ${collectedCount} de ${target} postas · ${raffleEntriesCount} ${raffleEntriesCount === 1 ? 'chance' : 'chances'} Sorteo Final`;

  return (
    <section className={styles.play} aria-labelledby="play-title">
      <div className={styles.screenHead}>
        <span className={styles.kicker}>{shopping === 'centenario' ? 'RULETA DE TEMPORADA' : 'DINÁMICA INTERACTIVA'}</span>
        <h2 id="play-title">Girá y descubrí</h2>
        <ul className={styles.ruleChips} aria-label="Reglas del juego">
          <li>1 jugada por posta</li>
          <li>1 premio instantáneo</li>
          <li>+1 chance por posta nueva</li>
        </ul>
        <button type="button" className={styles.soundToggle} aria-pressed={soundOn} onClick={onToggleSound}>
          <SoundIcon on={soundOn} />
          {soundOn ? 'Sonido activado' : 'Sonido desactivado'}
        </button>
      </div>

      <div className={`${styles.wheelWrap} ${participating ? styles.wheelBusy : ''}`} aria-busy={participating}>
        <Wheel spinning={participating} angle={wheelAngle} shopping={shopping} />
        <span className={`${styles.pointer} ${participating ? styles.pointerBounce : ''}`} aria-hidden="true" />
      </div>
      <p className={styles.wheelState} role="status" aria-live="polite">{wheelStatusText}</p>

      {result && (
        <ResultCard
          result={result}
          raffleEntriesCount={result.raffleEntriesCount ?? raffleEntriesCount}
          completionReward={result.completionReward ?? completionReward}
          merchants={resultMerchants}
          missing={Math.max(0, target - collectedCount)}
          shopping={shopping}
          brandName={brandName}
          onGo={onGo}
          onPlayAnother={() => {
            onClearResult();
            document.getElementById('card-id')?.focus();
          }}
        />
      )}
      {!result && completionReward?.unlocked && (
        <CompletionRewardCredential completionReward={completionReward} />
      )}

      <form className={styles.codeForm} onSubmit={(event) => { event.preventDefault(); onSpin(); }}>
        <div className={styles.codeFormHeader}>
          <label className={styles.label} htmlFor="card-id">Código de tu tarjeta</label>
          {result && <span className={styles.multiPlayBadge}>Podés jugar otro código</span>}
        </div>
        <input
          className={styles.codeInput}
          id="card-id"
          value={cardCode}
          placeholder={shopping === 'centenario' ? 'Ej.: CEN-DEMO-001' : 'Ej.: UNI-DEMO-001'}
          onChange={(event) => onChange(event.target.value)}
          maxLength={40}
          disabled={participating || loading}
          autoComplete="off"
          inputMode="text"
          aria-describedby="card-hint"
        />
        <small id="card-hint" className={`${styles.hint} ${hintTone}`}>{hint}</small>

        {demoCards.length > 0 && (
          <div className={styles.quickCards} aria-label="Tarjetas de demostración disponibles">
            <span className={styles.quickCardsLabel}>Probar posta rápida:</span>
            <div className={styles.quickCardPills}>
              {demoCards.map((item) => {
                const isCollected = collectedIds.includes(item.publicId);
                const isSelected = cardCode === item.publicId;
                return (
                  <button
                    key={item.publicId}
                    type="button"
                    disabled={participating}
                    className={`${styles.quickPill} ${isSelected ? styles.quickPillActive : ''} ${isCollected ? styles.quickPillDone : ''}`}
                    onClick={() => onChange(item.publicId)}
                  >
                    <span>{item.publicId.replace('-DEMO-', '-')}</span>
                    <small>{isCollected ? '✓' : 'Nueva'}</small>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button type="submit" className={styles.spinButton} disabled={!canSpin || loading}>
          {participating
            ? 'Girando ruleta…'
            : loading
              ? 'Sincronizando campaña…'
              : !hasCampaign
                ? 'Campaña no disponible'
                : result
                  ? 'Girar con este nuevo código'
                  : 'Girar y descubrir'}
        </button>
        <small className={styles.legalMicrocopy}>La animación es representativa; la asignación se valida en tiempo real según stock de campaña.</small>
      </form>

      {!loading && !hasCampaign && !error && (
        <div className={styles.emptyCampaignBox} role="status">
          <strong>Campaña fuera de ventana activa</strong>
          <p>En este momento no hay una campaña habilitada para registrar participaciones en este shopping.</p>
        </div>
      )}

      {(error || participationError) && (
        <div className={styles.errorBox} role="alert">
          <span>{participationError || error}</span>
          {!participating && <button type="button" onClick={onRetry}>Reintentar</button>}
        </div>
      )}
    </section>
  );
}

function ResultCard({ result, raffleEntriesCount, completionReward, merchants, missing, shopping, brandName, onGo, onPlayAnother }: { result: SpinResult; raffleEntriesCount: number; completionReward?: CompletionRewardInfo | null; merchants?: string[]; missing: number; shopping: ShoppingBrandId; brandName: string; onGo: (view: View) => void; onPlayAnother: () => void }) {
  const won = result.status === 'won';
  const [copied, setCopied] = useState(false);
  const formattedPrize = formatPrizeName(result.prize?.name);

  async function copyVoucherCode() {
    if (!result.redeemCode) return;
    try {
      await navigator.clipboard.writeText(result.redeemCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { /* fallback manual selection */ }
  }

  return (
    <article className={`${styles.resultCard} ${won ? styles.resultWon : styles.resultNone}`} role="status" aria-live="polite">
      <div className={styles.resultHeader}>
        <span className={styles.resultKicker}>{won ? 'PREMIO CONFIRMADO' : 'SIN PREMIO ESTA VEZ'}</span>
        <span className={styles.resultCardTag}>{result.cardId}</span>
      </div>
      <h3>{won ? 'Premio confirmado' : 'Participación registrada'}</h3>
      {won && <strong className={styles.resultPrizeSubtitle}>{formattedPrize.title}</strong>}
      {result.alreadyParticipated && (
        <p className={styles.resultDuplicateBanner}>
          Posta ya registrada anteriormente en esta campaña · Mostramos tu resultado previo sin generar nuevas jugadas ni participaciones duplicadas.
        </p>
      )}
      {!won && result.instantPrizeLimitReached && (
        <p className={styles.resultDuplicateBanner}>
          Ya obtuviste tu premio instantáneo máximo en esta campaña ({formatPrizeName(result.priorInstantPrize?.name).title}). ¡Esta nueva posta sumó +1 participación verificada para el Sorteo Final!
        </p>
      )}
      <p>
        {won
          ? result.prize?.description || 'Presentá el código QR en el comercio adherido para hacer efectivo tu beneficio.'
          : result.alreadyParticipated
            ? 'Este cartel QR ya había sido utilizado. Escaneá otro cartel distinto del shopping para sumar una nueva participación al Sorteo Final.'
            : 'Esta posta quedó registrada en tu pasaporte y sumó +1 participación para el Sorteo Final. Probá con otra tarjeta del recorrido.'}
      </p>
      {won && (
        <p className={styles.resultWhere}>
          <b>Dónde canjearlo:</b> {formatMerchants(merchants, 3) ?? 'consultá en atención al cliente del shopping.'}
        </p>
      )}
      {missing === 1 && !completionReward?.unlocked && (
        <p className={styles.nudge} role="note">¡Te falta 1 posta para completar tu colección!</p>
      )}
      <div className={styles.rafflePillRow}>
        <span className={styles.raffleEntryBadge}>
          ★ Participaciones Sorteo Final: <strong>{raffleEntriesCount}</strong> {result.raffleEntryAdded ? '(+1 sumada)' : ''}
        </span>
      </div>
      {completionReward?.unlocked && (
        <CompletionRewardCredential completionReward={completionReward} inCard />
      )}

      {won && result.redeemCode && (
        <div className={styles.voucherPass}>
          <p className={styles.redeemInstruction}>
            Mostrá este pase QR en caja. Tu cupón quedó guardado automáticamente en <strong>Mi progreso → Mis cupones</strong>.
          </p>
          {result.redeemQr && (
            <Image
              unoptimized
              className={styles.redeemQr}
              src={result.redeemQr}
              width={220}
              height={220}
              alt={`Código QR de canje para ${formattedPrize.title}`}
            />
          )}
          <code className={styles.redeemCode}>{result.redeemCode}</code>
          <button type="button" className={styles.copyCodeBtn} onClick={copyVoucherCode}>
            {copied ? '✓ Código copiado al portapapeles' : 'Copiar código alfanumérico'}
          </button>
        </div>
      )}
      {won && result.expiresAt && <small className={styles.resultExpiry}>{expiryLabel(result.expiresAt).text}</small>}

      <div className={styles.resultActions}>
        <button type="button" className={styles.resultActionBtn} onClick={onPlayAnother}>Buscar otra tarjeta</button>
        {won ? (
          <button type="button" className={styles.resultActionSecondary} onClick={() => onGo('progreso')}>Ver mis cupones QR</button>
        ) : (
          <button type="button" className={styles.resultActionSecondary} onClick={() => onGo('descubrir')}>Ver postas disponibles</button>
        )}
      </div>
      <ShareButton shopping={shopping} brandName={brandName} />
    </article>
  );
}

function Wheel({ spinning, angle, shopping }: { spinning: boolean; angle: number; shopping: ShoppingBrandId }) {
  const segments = WHEEL_LABELS.map((label, index) => {
    const start = (index * 60 - 90) * (Math.PI / 180);
    const end = ((index + 1) * 60 - 90) * (Math.PI / 180);
    const mid = (index * 60 - 60) * (Math.PI / 180);
    return {
      label,
      d: `M0 0 L${(Math.cos(start) * 92).toFixed(2)} ${(Math.sin(start) * 92).toFixed(2)} A92 92 0 0 1 ${(Math.cos(end) * 92).toFixed(2)} ${(Math.sin(end) * 92).toFixed(2)} Z`,
      tx: (Math.cos(mid) * 56).toFixed(2),
      ty: (Math.sin(mid) * 56).toFixed(2),
      angle: index * 60,
    };
  });
  const bulbs = Array.from({ length: 12 }, (_, idx) => {
    const rad = (idx * 30 - 90) * (Math.PI / 180);
    return { cx: (Math.cos(rad) * 96).toFixed(2), cy: (Math.sin(rad) * 96).toFixed(2), even: idx % 2 === 0 };
  });
  return (
    <svg
      data-testid="campaign-wheel"
      data-spinning={spinning}
      className={`${styles.wheel} ${spinning ? styles.wheelSpin : ''}`}
      style={angle > 0 ? { transform: `rotate(${angle}deg)` } : undefined}
      viewBox="-104 -104 208 208"
      role="img"
      aria-label={`Ruleta de campaña de ${shopping === 'centenario' ? 'Centenario' : 'UniPlaza'}`}
    >
      <circle r="100" className={styles.wheelOuterRim} />
      <circle r="93" className={styles.wheelRim} />
      {segments.map((segment, index) => (
        <g key={segment.label}>
          <path d={segment.d} className={index % 2 ? styles.segmentB : styles.segmentA} />
          <text transform={`translate(${segment.tx} ${segment.ty}) rotate(${segment.angle + 30})`} textAnchor="middle" dominantBaseline="middle">
            {segment.label}
          </text>
        </g>
      ))}
      {bulbs.map((bulb, idx) => (
        <circle key={idx} cx={bulb.cx} cy={bulb.cy} r="2.8" className={`${styles.wheelBulb} ${bulb.even ? styles.wheelBulbA : styles.wheelBulbB}`} />
      ))}
      <circle r="24" className={styles.wheelHubGlow} />
      <circle r="20" className={styles.wheelHub} />
      <text className={styles.hubText} textAnchor="middle" dominantBaseline="middle">{shopping === 'centenario' ? 'C' : 'U'}</text>
    </svg>
  );
}

function DiscoverScreen({
  shopping, campaign, collectedIds, raffleEntriesCount, completionReward, target, showClue, onToggleClue, loading, error, onRetry, onSelectCard, onGo,
}: {
  shopping: ShoppingBrandId; campaign: PublicCampaign | null; collectedIds: string[]; raffleEntriesCount: number; completionReward?: CompletionRewardInfo | null; target: number; showClue: boolean; onToggleClue: () => void; loading: boolean; error: string; onRetry: () => void; onSelectCard: (code: string) => void; onGo: (view: View) => void;
}) {
  const slots = Array.from({ length: target }, (_, index) => collectedIds[index]);
  const discovered = Math.min(collectedIds.length, target);
  const allCards = campaign?.cards ?? [];

  return (
    <section className={styles.discover} aria-labelledby="discover-title">
      <div className={styles.screenHead}>
        <span className={styles.kicker}>{shopping === 'centenario' ? 'RECORRIDO DE POSTAS' : 'MAPA DE ESTACIONES'}</span>
        <h2 id="discover-title">Tu colección</h2>
        <p>Cada posta distinta suma un sello a tu pasaporte y +1 participación para el Sorteo Final.</p>
      </div>

      {error && (
        <div className={styles.stateAlert} role="alert">
          <div><strong>No pudimos cargar las postas</strong><span>{error}</span></div>
          <button type="button" onClick={onRetry}>Reintentar</button>
        </div>
      )}

      <div className={styles.collectionSummaryCard}>
        <div className={styles.collectionCount}>
          <strong>{discovered}<small>/{target}</small></strong>
          <div>
            <b>{target - discovered > 0 ? `Te faltan ${target - discovered} postas · ${raffleEntriesCount} chances Sorteo Final` : `¡Colección completada! · ${raffleEntriesCount} chances Sorteo Final`}</b>
            <span>{target - discovered > 0 ? 'Las tarjetas repetidas no suman avance ni chances adicionales' : 'Podés seguir escaneando postas distintas para sumar chances al Sorteo Final'}</span>
          </div>
        </div>
        <div className={styles.discoverBar} aria-hidden="true">
          <span style={{ width: `${target > 0 ? Math.min(100, Math.round((discovered / target) * 100)) : 0}%` }} />
        </div>
        <CompletionRewardCredential completionReward={completionReward} inCard />
      </div>

      <div className={styles.slotGrid} role="list" aria-label={`Tarjetas: ${discovered} de ${target} descubiertas`}>
        {slots.map((publicId, index) => {
          const card = publicId ? allCards.find((item) => item.publicId === publicId) : undefined;
          const locName = formatLocationName(card?.location, index, shopping);
          return (
            <div role="listitem" key={index} className={`${styles.slot} ${publicId ? styles.slotFound : ''}`}>
              <span className={styles.slotNumber}>POSTA {String(index + 1).padStart(2, '0')}</span>
              {publicId ? (
                <>
                  <span className={styles.slotBadgeOk} aria-hidden="true">✓</span>
                  <strong className={styles.slotId}>{publicId}</strong>
                  <small>{locName}</small>
                </>
              ) : (
                <>
                  <strong className={styles.slotMystery} aria-hidden="true">0{index + 1}</strong>
                  <small>Pendiente</small>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* PISTA ACTIVA */}
      <div className={styles.clueBlock}>
        <div>
          <span className={styles.clueEyebrow}>{campaign?.clue?.forNextCard ? 'PISTA PARA TU PRÓXIMA POSTA' : 'PISTA DEL DÍA'}</span>
          <b>¿Dónde está la próxima posta?</b>
          <p>{campaign?.clue?.forNextCard ? 'Cada posta que encontrás desbloquea la pista de la siguiente.' : 'Desplegá la orientación activa del shopping para encontrar tu siguiente código.'}</p>
        </div>
        <button type="button" onClick={onToggleClue} aria-expanded={showClue}>
          {showClue ? 'Ocultar pista' : 'Revelar pista'}
        </button>
        {showClue && (
          <div className={styles.clueText} role="status">
            {loading ? 'Consultando pista activa…' : campaign?.clue?.text ?? 'Hoy no hay pistas adicionales programadas. Buscá los tótems QR en los accesos principales.'}
          </div>
        )}
      </div>

      {/* MAPA POR ZONAS: avance por sector sin revelar la ubicación exacta de cada posta */}
      {Boolean(campaign?.zones?.length) && (
        <section className={styles.zoneMap} aria-labelledby="zones-title">
          <h3 id="zones-title">Postas por zona</h3>
          <ul>
            {campaign!.zones!.map((zone) => (
              <li key={zone.name} className={zone.found >= zone.total ? styles.zoneDone : ''}>
                <span className={styles.zoneName}>{zone.name}</span>
                <span className={styles.zoneCount}>{zone.found}/{zone.total}</span>
                <span className={styles.zoneBar} aria-hidden="true"><i style={{ width: `${Math.round((zone.found / zone.total) * 100)}%` }} /></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* DIRECTORIO INTERACTIVO DE POSTAS DEL SHOPPING */}
      {allCards.length > 0 && (
        <div className={styles.stationDirectory}>
          <div className={styles.directoryHead}>
            <h3>Postas habilitadas en el shopping</h3>
            <span>{allCards.length} puntos</span>
          </div>
          <ul className={styles.stationList}>
            {allCards.slice(0, 6).map((card, idx) => {
              const visited = collectedIds.includes(card.publicId);
              return (
                <li key={card.publicId} className={`${styles.stationRow} ${visited ? styles.stationRowVisited : ''}`}>
                  <div className={styles.stationInfo}>
                    <strong>{formatLocationName(card.location, idx, shopping)}</strong>
                    <small>Código: <code>{card.publicId}</code></small>
                  </div>
                  <button type="button" className={styles.stationPlayBtn} onClick={() => onSelectCard(card.publicId)}>
                    {visited ? 'Volver a girar' : 'Usar código →'}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button type="button" className={styles.secondaryWide} onClick={() => onGo('jugar')}>
        Ir a la ruleta manual
      </button>
    </section>
  );
}

function PrizesScreen({
  shopping, prizes, loading, error, hasCampaign, onRetry, onOpen, onGo,
}: {
  shopping: ShoppingBrandId; prizes: Prize[]; loading: boolean; error: string; hasCampaign: boolean; onRetry: () => void; onOpen: (prize: Prize) => void; onGo: (view: View) => void;
}) {
  const ordered = prizes.slice().sort((a, b) => Number(b.available && b.remainingStock > 0) - Number(a.available && a.remainingStock > 0));
  const [featured, ...rest] = ordered;
  const isAvailable = (prize: Prize) => prize.available && prize.remainingStock > 0;

  if (loading) {
    return (
      <section className={styles.prizes} aria-labelledby="prizes-title">
        <div className={styles.screenHead}><span className={styles.kicker}>Catálogo</span><h2 id="prizes-title">Premios</h2><p>Cargando beneficios y stock en tiempo real…</p></div>
        <div className={styles.skeletonStack} role="status" aria-label="Cargando premios">
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.prizes} aria-labelledby="prizes-title">
        <div className={styles.screenHead}><span className={styles.kicker}>Catálogo</span><h2 id="prizes-title">Premios</h2></div>
        <div className={styles.stateAlert} role="alert">
          <div><strong>No pudimos cargar el catálogo</strong><span>{error}</span></div>
          <button type="button" onClick={onRetry}>Reintentar</button>
        </div>
      </section>
    );
  }

  if (!prizes.length) {
    return (
      <section className={styles.prizes} aria-labelledby="prizes-title">
        <div className={styles.screenHead}><span className={styles.kicker}>Catálogo</span><h2 id="prizes-title">Premios</h2></div>
        <div className={styles.emptyCampaignBox} role="status">
          <strong>{hasCampaign ? 'Sin beneficios publicados' : 'Campaña en preparación'}</strong>
          <p>{hasCampaign ? 'Esta campaña aún no tiene premios visibles en el catálogo público.' : 'Los beneficios y descuentos se publicarán acá apenas comience la campaña activa.'}</p>
        </div>
        <button type="button" className={styles.secondaryWide} onClick={() => onGo('jugar')}>Ir a Jugar</button>
      </section>
    );
  }

  const featuredMeta = featured ? formatPrizeName(featured.name) : null;

  return (
    <section className={styles.prizes} aria-labelledby="prizes-title">
      <div className={styles.screenHead}>
        <span className={styles.kicker}>{shopping === 'centenario' ? 'BENEFICIOS DE TEMPORADA' : 'RECOMPENSAS DEL PASEO'}</span>
        <h2 id="prizes-title">Premios</h2>
        <p>Stock actualizado en tiempo real. Tocá cualquier beneficio para ver cómo canjearlo en los locales.</p>
      </div>

      {featured && featuredMeta && (
        <button type="button" className={styles.hero} onClick={() => onOpen(featured)}>
          <span className={styles.heroThumb}>
            {featured.imageUrl ? (
              <Image src={featured.imageUrl} alt="" fill sizes="(max-width: 430px) 100vw, 430px" unoptimized />
            ) : (
              <GiftArt shopping={shopping} />
            )}
          </span>
          <span className={styles.heroInfo}>
            <div className={styles.prizeTagLine}>
              <small>★ DESTACADO · {featuredMeta.tag}</small>
              {featuredMeta.isDemo && <span className={styles.demoMicroTag}>Modo demo</span>}
            </div>
            <strong>{featuredMeta.title}</strong>
            {featured.description && <p className={styles.prizeHeroDesc}>{featured.description}</p>}
            <em className={isAvailable(featured) ? styles.stockOk : styles.stockOut}>
              {isAvailable(featured) ? `● Disponibles hoy: ${featured.remainingStock} unidades` : 'Agotado'}
            </em>
          </span>
        </button>
      )}

      <ul className={styles.prizeList}>
        {rest.map((prize) => {
          const meta = formatPrizeName(prize.name);
          return (
            <li key={prize.id}>
              <button
                type="button"
                className={`${styles.prizeRow} ${isAvailable(prize) ? '' : styles.prizeSoldOut}`}
                onClick={() => onOpen(prize)}
              >
                <span className={styles.prizeRowThumb}>
                  {prize.imageUrl ? <Image src={prize.imageUrl} alt="" fill sizes="88px" unoptimized /> : <GiftArt shopping={shopping} />}
                </span>
                <span className={styles.prizeRowBody}>
                  <small className={styles.prizeRowKicker}>{meta.tag}</small>
                  <strong>{meta.title}</strong>
                  <em className={isAvailable(prize) ? styles.stockOk : styles.stockOut}>
                    {isAvailable(prize) ? `Quedan ${prize.remainingStock} disponibles` : 'Agotado'}
                  </em>
                </span>
                <span className={styles.prizeChevron} aria-hidden="true">→</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PrizeDetail({ prize, shopping, rulesUrl, onPlay }: { prize: Prize; shopping: ShoppingBrandId; rulesUrl?: string | null; onPlay: () => void }) {
  const available = prize.available && prize.remainingStock > 0;
  const meta = formatPrizeName(prize.name);
  return (
    <div className={styles.detail}>
      <span className={styles.detailImage}>
        {prize.imageUrl ? <Image src={prize.imageUrl} alt={meta.title} fill sizes="400px" unoptimized /> : <GiftArt shopping={shopping} />}
      </span>
      <div className={styles.detailMetaRow}>
        <span className={available ? styles.stockOk : styles.stockOut}>{available ? `● Quedan ${prize.remainingStock} disponibles` : 'Agotado'}</span>
        {meta.isDemo && <span className={styles.demoMicroTag}>Demo sin valor comercial</span>}
      </div>
      <h2 className={styles.sheetTitle}>{meta.title}</h2>
      <p className={styles.muted}>{prize.description || 'Beneficio sujeto a disponibilidad de stock de la campaña activa.'}</p>
      <div className={styles.conditions}>
        <b>Cómo obtener y canjear este beneficio</b>
        <p>1. Escaneá una posta QR/NFC o ingresá su código en la sección Jugar.<br />2. Si la ruleta te asigna este beneficio, recibirás un voucher QR único en el acto.<br />3. Presentalo en el local adherido antes de su fecha de vencimiento.</p>
        <p><b>Dónde canjearlo:</b> {formatMerchants(prize.merchants, 6) ?? 'consultá en atención al cliente del shopping.'}</p>
        {rulesUrl && <a href={rulesUrl} target="_blank" rel="noreferrer">Consultar bases y condiciones legales ↗</a>}
      </div>
      <button type="button" className={styles.spinButton} onClick={onPlay}>Participar por este beneficio →</button>
    </div>
  );
}

function ProgressScreen({
  collected, raffleEntriesCount, instantPrizeWon, completionReward, target, complete, unlockText, wonPrize, rulesUrl, shoppingName, shopping, refreshKey, onGo,
}: {
  shopping: ShoppingBrandId; refreshKey: string; collected: number; raffleEntriesCount: number; instantPrizeWon?: { id: string; name: string; status: string } | null; completionReward?: CompletionRewardInfo | null; target: number; complete: boolean; unlockText: string; wonPrize?: string; rulesUrl?: string | null; shoppingName: string; onGo: (view: View) => void;
}) {
  const ratio = target > 0 ? Math.min(collected / target, 1) : 0;
  const circumference = 2 * Math.PI * 52;
  return (
    <section className={styles.progress} aria-labelledby="progress-title">
      <div className={styles.screenHead}>
        <span className={styles.kicker}>BILLETERA Y RECORRIDO</span>
        <h2 id="progress-title">Mi progreso</h2>
        <p>Tus cupones QR listos para presentar en caja, tu pasaporte y tus chances para el Sorteo Final en {shoppingName}.</p>
      </div>

      {/* BILLETERA DE CUPONES QR PRIMERO PARA ACCESO INMEDIATO EN CAJA */}
      <CouponWallet shopping={shopping} refreshKey={refreshKey} />

      <NotificationOptIn shopping={shopping} />

      <CompletionRewardCredential completionReward={completionReward} />

      <div className={styles.ringCard}>
        <svg viewBox="0 0 120 120" className={styles.ring} aria-hidden="true">
          <circle cx="60" cy="60" r="52" className={styles.ringTrack} />
          <circle cx="60" cy="60" r="52" className={styles.ringFill} strokeLinecap={ratio > 0 ? 'round' : 'butt'} strokeDasharray={`${(ratio * circumference).toFixed(1)} ${circumference.toFixed(1)}`} />
        </svg>
        <div className={styles.ringText}>
          <strong>{collected}/{target}</strong>
          <span>postas</span>
        </div>
        <div className={styles.ringCopy}>
          <b>{complete ? '¡Colección completada!' : 'Pasaporte en curso'} · {raffleEntriesCount} {raffleEntriesCount === 1 ? 'chance' : 'chances'}</b>
          <p>
            {instantPrizeWon
              ? `Premio instantáneo de campaña obtenido (${formatPrizeName(instantPrizeWon.name).title}). Tenés ${raffleEntriesCount} ${raffleEntriesCount === 1 ? 'participación acumulada' : 'participaciones acumuladas'} para el Sorteo Final.`
              : complete
                ? `Reuniste todas las postas requeridas en ${shoppingName} y sumaste ${raffleEntriesCount} chances para el Sorteo Final.`
                : `Te faltan ${Math.max(0, target - collected)} postas distintas para completar el álbum. Cada posta suma +1 chance al Sorteo Final.`}
          </p>
        </div>
      </div>

      <div className={styles.achievements} aria-label="Insignias de campaña">
        <div className={collected >= 1 ? styles.achieved : styles.locked}>
          <b>{collected >= 1 ? '✓' : '01'}</b>
          <span>Primera posta</span>
        </div>
        <div className={complete ? styles.achieved : styles.locked}>
          <b>{complete ? '★' : '03'}</b>
          <span>Pasaporte completo</span>
        </div>
        <div className={wonPrize ? styles.achieved : styles.locked}>
          <b>{wonPrize ? '✦' : 'QR'}</b>
          <span>Voucher ganado</span>
        </div>
      </div>

      <div className={styles.rewardBox}>
        <b>{completionReward?.title || 'Beneficio por completar el pasaporte'}</b>
        <p>{completionReward?.terms || unlockText}</p>
      </div>

      <div className={styles.linkRow}>
        {rulesUrl ? (
          <a href={rulesUrl} target="_blank" rel="noreferrer">Bases y condiciones ↗</a>
        ) : (
          <span className={styles.muted}>Temporada oficial · {shoppingName}</span>
        )}
        <button type="button" onClick={() => onGo('jugar')}>Cargar otra tarjeta →</button>
      </div>
    </section>
  );
}

function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className={styles.sheetBackdrop} onClick={onClose}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={label} onClick={(event) => event.stopPropagation()}>
        <span className={styles.grip} aria-hidden="true" />
        <button type="button" className={styles.sheetClose} onClick={onClose} aria-label="Cerrar">×</button>
        {children}
      </div>
    </div>
  );
}

function Confetti() {
  return (
    <div className={styles.confetti} aria-hidden="true">
      {CONFETTI.map((piece, index) => (
        <i key={index} style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, background: piece.hue === 0 ? 'var(--festive)' : piece.hue === 1 ? 'var(--brand-accent-soft)' : 'var(--brand-accent)' } as CSSProperties} />
      ))}
    </div>
  );
}

function GiftArt({ shopping }: { shopping: ShoppingBrandId }) {
  return (
    <svg className={styles.giftArt} viewBox="0 0 80 80" aria-hidden="true" data-shopping={shopping}>
      <rect x="14" y="30" width="52" height="40" rx="5" className={styles.giftBody} />
      <rect x="14" y="22" width="52" height="12" rx="4" className={styles.giftLid} />
      <rect x="36" y="22" width="8" height="48" className={styles.giftRibbon} />
    </svg>
  );
}

// Franja de estado de Inicio: muestra un solo mensaje, el más útil. Primero el empujón de "te falta 1 posta";
// si no aplica, el cierre de campaña cuando falta poco. Ambos salen de datos reales.
function HomeStatusStrip({ missing, endsAt, onGo }: { missing: number; endsAt?: string; onGo: (view: View) => void }) {
  if (missing === 1) {
    return <div className={styles.statusStrip} role="note">
      <span>¡Te falta 1 posta para completar tu colección!</span>
      <button type="button" onClick={() => onGo('descubrir')}>Buscarla</button>
    </div>;
  }
  const endLabel = endsAt ? campaignEndLabel(endsAt) : null;
  if (!endLabel) return null;
  return <div className={styles.statusStrip} role="note"><span>{endLabel}</span></div>;
}

// Compartir la campaña con el menú nativo; sin códigos ni datos de cupones. Si no hay menú nativo, copia el enlace.
function ShareButton({ shopping, brandName }: { shopping: ShoppingBrandId; brandName: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = `${window.location.origin}/${shopping}`;
    const text = `Estoy jugando a Navidad Mágica en ${brandName}: buscá las postas y girá la ruleta.`;
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: `Navidad Mágica · ${brandName}`, text, url }); } catch { /* la persona canceló */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { /* sin portapapeles disponible */ }
  }
  return <button type="button" className={styles.shareButton} onClick={share}>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>
    <span aria-live="polite">{copied ? 'Enlace copiado' : 'Contale a alguien'}</span>
  </button>;
}

// Avisos push opcionales: el permiso se pide solo al tocar "Activar avisos", nunca al cargar la página.
type NotifyState = 'checking' | 'unsupported' | 'ios-install' | 'off' | 'on' | 'denied' | 'busy';

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function NotificationOptIn({ shopping }: { shopping: ShoppingBrandId }) {
  const [state, setState] = useState<NotifyState>('checking');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
      if (!supported) { if (active) setState(isIos && !standalone ? 'ios-install' : 'unsupported'); return; }
      const config = await fetch('/api/push', { cache: 'no-store' }).then((response) => response.json()).catch(() => null) as { enabled?: boolean; publicKey?: string | null } | null;
      if (!active) return;
      if (!config?.enabled || !config.publicKey) { setState('unsupported'); return; }
      setPublicKey(config.publicKey);
      if (Notification.permission === 'denied') { setState('denied'); return; }
      const registration = await navigator.serviceWorker.getRegistration();
      const existing = await registration?.pushManager.getSubscription();
      if (active) setState(existing ? 'on' : 'off');
    })();
    return () => { active = false; };
  }, []);

  async function enable() {
    if (!publicKey) return;
    setState('busy');
    setMessage('');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setState(permission === 'denied' ? 'denied' : 'off'); return; }
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) throw new Error('Los avisos necesitan la app instalada o abierta desde el sitio publicado.');
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
      const response = await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shoppingSlug: shopping, subscription: subscription.toJSON() }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        await subscription.unsubscribe().catch(() => undefined);
        throw new Error(payload.error || 'No pudimos activar los avisos.');
      }
      setState('on');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos activar los avisos.');
      setState('off');
    }
  }

  async function disable() {
    setState('busy');
    setMessage('');
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await fetch('/api/push', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: subscription.endpoint }) });
        await subscription.unsubscribe();
      }
      setState('off');
    } catch {
      setMessage('No pudimos desactivar los avisos. Probá de nuevo.');
      setState('on');
    }
  }

  if (state === 'checking' || state === 'unsupported') return null;
  const copy: Record<Exclude<NotifyState, 'checking' | 'unsupported'>, string> = {
    'ios-install': 'En iPhone, primero instalá la app (Compartir → Agregar a inicio) para recibir avisos.',
    off: 'Te avisamos si un cupón está por vencer o si hay una pista nueva. Nada más.',
    on: 'Avisos activados: cupón por vencer y pistas nuevas.',
    denied: 'Bloqueaste las notificaciones. Podés habilitarlas desde la configuración del navegador.',
    busy: 'Un momento…',
  };
  return <section className={styles.notifyCard} aria-labelledby="notify-title">
    <div>
      <h3 id="notify-title">Avisos</h3>
      <p>{copy[state]}</p>
      {message && <p className={styles.notifyError} role="alert">{message}</p>}
    </div>
    {state === 'off' && <button type="button" className={styles.notifyButton} onClick={enable}>Activar avisos</button>}
    {state === 'on' && <button type="button" className={styles.notifyButtonSecondary} onClick={disable}>Desactivar</button>}
    {state === 'busy' && <button type="button" className={styles.notifyButton} disabled>Un momento…</button>}
  </section>;
}

function SoundIcon({ on }: { on: boolean }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H3v6h3l5 4z" />
    {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m22 9-6 6M16 9l6 6" />}
  </svg>;
}

// Invitación a instalar la PWA. Chrome/Edge/Android disparan beforeinstallprompt; iOS Safari no, así que se muestra una guía manual.
const INSTALL_DISMISSED_KEY = 'navidad-install-dismissed';

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

function InstallPrompt({ shopping }: { shopping: ShoppingBrandId }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<'hidden' | 'install' | 'ios'>('hidden');

  useEffect(() => {
    let dismissed = false;
    try { dismissed = window.localStorage.getItem(INSTALL_DISMISSED_KEY) === shopping; } catch { dismissed = false; }
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (dismissed || standalone) return;
    const onPrompt = (event: Event) => { event.preventDefault(); setDeferred(event as BeforeInstallPromptEvent); setMode('install'); };
    const onInstalled = () => setMode('hidden');
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);
    if (isIos) setMode('ios');
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [shopping]);

  if (mode === 'hidden') return null;

  function dismiss() {
    try { window.localStorage.setItem(INSTALL_DISMISSED_KEY, shopping); } catch { /* sin almacenamiento: solo se oculta en esta visita */ }
    setMode('hidden');
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') setMode('hidden');
    setDeferred(null);
  }

  return <aside className={styles.installBar} aria-label="Instalar la aplicación">
    <div>
      <strong>Tenela a mano</strong>
      <span>{mode === 'ios' ? 'Tocá Compartir y después “Agregar a inicio” para instalarla.' : 'Instalala en tu celular para volver a la campaña en un toque.'}</span>
    </div>
    {mode === 'install' && <button type="button" className={styles.installButton} onClick={install}>Instalar</button>}
    <button type="button" className={styles.installDismiss} onClick={dismiss}>Ahora no</button>
  </aside>;
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
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
