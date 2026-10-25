import type { Prisma } from '@prisma/client';
import { prisma } from './db';
import { sha256 } from './security';

export type CompletionRewardMode = 'EXTRA_RAFFLE_ENTRY' | 'EXCLUSIVE_DRAW';

export type CompletionRewardConfig = {
  enabled: boolean;
  mode: CompletionRewardMode;
  target: number;
  requiredCardIds: string[];
  title: string;
  terms: string;
  updatedAt?: string;
};

export type CompletionRewardStatus = {
  enabled: boolean;
  mode: CompletionRewardMode;
  title: string;
  description: string;
  terms: string;
  target: number;
  requiredCardIds: string[];
  completedCount: number;
  pendingCount: number;
  completedCardIds: string[];
  pendingCardIds: string[];
  unlocked: boolean;
  justUnlocked: boolean;
  rewardId: string | null;
  referenceId: string | null;
  completedAt: string | null;
  issuedAt: string | null;
  scanRaffleEntriesCount: number;
  bonusRaffleEntriesCount: number;
  totalRaffleEntriesCount: number;
  exclusiveDrawEligible: boolean;
};

type DbClient = Prisma.TransactionClient | typeof prisma;

export function parseCompletionRewardConfig(
  settings: unknown,
  activeCardPublicIds: string[] = [],
): CompletionRewardConfig {
  const raw = settings && typeof settings === 'object' && !Array.isArray(settings)
    ? (settings as Record<string, unknown>)
    : {};

  const enabled = typeof raw.completionRewardEnabled === 'boolean' ? raw.completionRewardEnabled : true;
  const mode: CompletionRewardMode = raw.completionRewardMode === 'EXCLUSIVE_DRAW'
    ? 'EXCLUSIVE_DRAW'
    : 'EXTRA_RAFFLE_ENTRY';

  const rawRequired = Array.isArray(raw.requiredCardIds)
    ? raw.requiredCardIds
        .map((id) => String(id).trim().toUpperCase())
        .filter((id) => id.length > 0 && (activeCardPublicIds.length === 0 || activeCardPublicIds.includes(id)))
    : [];
  const uniqueRequired = Array.from(new Set(rawRequired));

  const configuredTarget = typeof raw.collectionTarget === 'number' && Number.isFinite(raw.collectionTarget) && raw.collectionTarget >= 1
    ? Math.floor(raw.collectionTarget)
    : (activeCardPublicIds.length > 0 ? activeCardPublicIds.length : 3);

  const target = uniqueRequired.length > 0
    ? uniqueRequired.length
    : activeCardPublicIds.length > 0
      ? Math.min(configuredTarget, activeCardPublicIds.length)
      : configuredTarget;

  const defaultTitle = mode === 'EXCLUSIVE_DRAW'
    ? 'Acceso al Sorteo Exclusivo por Recorrido Completo'
    : 'Participación Extra para el Sorteo Final';

  const title = typeof raw.completionRewardTitle === 'string' && raw.completionRewardTitle.trim().length > 0
    ? raw.completionRewardTitle.trim()
    : defaultTitle;

  const defaultTerms = mode === 'EXCLUSIVE_DRAW'
    ? 'Al completar todas las postas requeridas de la campaña quedás habilitado automáticamente en el padrón del Sorteo Exclusivo de recorrido completo (máximo 1 acreditación por usuario y campaña).'
    : 'Al completar todas las postas requeridas de la campaña sumás automáticamente +1 participación adicional bonificada para el Sorteo Final (máximo 1 bonificación por usuario y campaña).';

  const rawTerms = typeof raw.completionRewardTerms === 'string' && raw.completionRewardTerms.trim().length > 0
    ? raw.completionRewardTerms.trim()
    : typeof raw.collectionUnlockText === 'string' && raw.collectionUnlockText.trim().length > 0 && !/Colecci[oó]n demo completada/i.test(raw.collectionUnlockText)
      ? raw.collectionUnlockText.trim()
      : defaultTerms;

  return {
    enabled,
    mode,
    target: Math.max(1, target),
    requiredCardIds: uniqueRequired,
    title,
    terms: rawTerms,
    updatedAt: typeof raw.completionConfigUpdatedAt === 'string' ? raw.completionConfigUpdatedAt : undefined,
  };
}

export function buildRewardDedupeKey(campaignId: string, participantId: string) {
  return sha256(`completion_reward:v1:${campaignId}:${participantId}`);
}

export function buildModeDedupeKey(mode: CompletionRewardMode, campaignId: string, participantId: string) {
  return mode === 'EXCLUSIVE_DRAW'
    ? sha256(`exclusive_draw:v1:${campaignId}:${participantId}`)
    : sha256(`extra_raffle:v1:${campaignId}:${participantId}`);
}

export function describeCompletionReward(
  config: CompletionRewardConfig,
  unlocked: boolean,
  pendingCount: number,
  effectiveMode: CompletionRewardMode = config.mode,
): string {
  if (!config.enabled && !unlocked) {
    return 'Completá las postas del recorrido para sellar tu pasaporte de temporada.';
  }
  if (unlocked) {
    return effectiveMode === 'EXCLUSIVE_DRAW'
      ? '¡Recorrido completo! Descubriste todas las postas y desbloqueaste tu acceso al Sorteo Exclusivo de la campaña.'
      : '¡Recorrido completo! Descubriste todas las postas y desbloqueaste una participación extra para el Sorteo Final.';
  }
  const missingLabel = pendingCount === 1 ? '1 posta' : `${pendingCount} postas`;
  return effectiveMode === 'EXCLUSIVE_DRAW'
    ? `¡Ya estás cerca! Descubrí ${missingLabel} más para desbloquear tu acceso al Sorteo Exclusivo de la campaña.`
    : `¡Ya estás cerca! Descubrí ${missingLabel} más para desbloquear +1 participación extra en el Sorteo Final.`;
}

function computeProgressAgainstConfig(
  config: CompletionRewardConfig,
  collectedPublicIds: string[],
  activeCardPublicIds: string[],
) {
  const uniqueCollected = Array.from(new Set(collectedPublicIds));
  if (config.requiredCardIds.length > 0) {
    const completedCardIds = config.requiredCardIds.filter((id) => uniqueCollected.includes(id));
    const pendingCardIds = config.requiredCardIds.filter((id) => !uniqueCollected.includes(id));
    return {
      target: config.requiredCardIds.length,
      completedCount: completedCardIds.length,
      pendingCount: pendingCardIds.length,
      completedCardIds,
      pendingCardIds,
      eligibleNow: completedCardIds.length >= config.requiredCardIds.length && config.requiredCardIds.length > 0,
    };
  }

  const validActiveSet = new Set(activeCardPublicIds);
  const validCollected = activeCardPublicIds.length > 0
    ? uniqueCollected.filter((id) => validActiveSet.has(id))
    : uniqueCollected;
  const completedCount = Math.min(validCollected.length, config.target);
  const pendingCount = Math.max(0, config.target - completedCount);
  const completedCardIds = validCollected.slice(0, config.target);
  const pendingCandidates = activeCardPublicIds.filter((id) => !validCollected.includes(id)).slice(0, pendingCount);

  return {
    target: config.target,
    completedCount,
    pendingCount,
    completedCardIds,
    pendingCardIds: pendingCandidates,
    eligibleNow: completedCount >= config.target && config.target > 0,
  };
}

export async function readCompletionRewardState(input: {
  db?: DbClient;
  campaignId: string;
  participantId?: string | null;
  settings: unknown;
  activeCardPublicIds: string[];
  collectedPublicIds: string[];
}): Promise<CompletionRewardStatus> {
  const db = input.db ?? prisma;
  const config = parseCompletionRewardConfig(input.settings, input.activeCardPublicIds);
  const progress = computeProgressAgainstConfig(config, input.collectedPublicIds, input.activeCardPublicIds);
  const scanRaffleEntriesCount = Array.from(new Set(input.collectedPublicIds)).length;

  if (!input.participantId) {
    return {
      enabled: config.enabled,
      mode: config.mode,
      title: config.title,
      description: describeCompletionReward(config, false, progress.pendingCount, config.mode),
      terms: config.terms,
      target: progress.target,
      requiredCardIds: config.requiredCardIds,
      completedCount: progress.completedCount,
      pendingCount: progress.pendingCount,
      completedCardIds: progress.completedCardIds,
      pendingCardIds: progress.pendingCardIds,
      unlocked: false,
      justUnlocked: false,
      rewardId: null,
      referenceId: null,
      completedAt: null,
      issuedAt: null,
      scanRaffleEntriesCount,
      bonusRaffleEntriesCount: 0,
      totalRaffleEntriesCount: scanRaffleEntriesCount,
      exclusiveDrawEligible: false,
    };
  }

  const existingEvent = await db.event.findUnique({
    where: { dedupeKey: buildRewardDedupeKey(input.campaignId, input.participantId) },
  });

  if (existingEvent) {
    const meta = existingEvent.metadata && typeof existingEvent.metadata === 'object' && !Array.isArray(existingEvent.metadata)
      ? (existingEvent.metadata as Record<string, unknown>)
      : {};
    const issuedMode: CompletionRewardMode = meta.mode === 'EXCLUSIVE_DRAW' ? 'EXCLUSIVE_DRAW' : 'EXTRA_RAFFLE_ENTRY';
    const snapshotCards = Array.isArray(meta.completedCardIds)
      ? meta.completedCardIds.map(String)
      : progress.completedCardIds;
    const snapshotTarget = typeof meta.requiredTarget === 'number' ? meta.requiredTarget : progress.target;
    const bonusRaffleEntriesCount = issuedMode === 'EXTRA_RAFFLE_ENTRY' ? 1 : 0;

    return {
      enabled: true,
      mode: issuedMode,
      title: typeof meta.title === 'string' ? meta.title : config.title,
      description: describeCompletionReward(config, true, 0, issuedMode),
      terms: typeof meta.terms === 'string' ? meta.terms : config.terms,
      target: snapshotTarget,
      requiredCardIds: config.requiredCardIds,
      completedCount: Math.max(progress.completedCount, snapshotTarget),
      pendingCount: 0,
      completedCardIds: snapshotCards,
      pendingCardIds: [],
      unlocked: true,
      justUnlocked: false,
      rewardId: typeof meta.rewardId === 'string' ? meta.rewardId : `RWD-${existingEvent.id.slice(0, 8).toUpperCase()}`,
      referenceId: typeof meta.referenceId === 'string' ? meta.referenceId : `REF-${existingEvent.id.slice(0, 8).toUpperCase()}`,
      completedAt: typeof meta.completedAt === 'string' ? meta.completedAt : existingEvent.createdAt.toISOString(),
      issuedAt: typeof meta.issuedAt === 'string' ? meta.issuedAt : existingEvent.createdAt.toISOString(),
      scanRaffleEntriesCount,
      bonusRaffleEntriesCount,
      totalRaffleEntriesCount: scanRaffleEntriesCount + bonusRaffleEntriesCount,
      exclusiveDrawEligible: issuedMode === 'EXCLUSIVE_DRAW',
    };
  }

  return {
    enabled: config.enabled,
    mode: config.mode,
    title: config.title,
    description: describeCompletionReward(config, false, progress.pendingCount, config.mode),
    terms: config.terms,
    target: progress.target,
    requiredCardIds: config.requiredCardIds,
    completedCount: progress.completedCount,
    pendingCount: progress.pendingCount,
    completedCardIds: progress.completedCardIds,
    pendingCardIds: progress.pendingCardIds,
    unlocked: false,
    justUnlocked: false,
    rewardId: null,
    referenceId: null,
    completedAt: null,
    issuedAt: null,
    scanRaffleEntriesCount,
    bonusRaffleEntriesCount: 0,
    totalRaffleEntriesCount: scanRaffleEntriesCount,
    exclusiveDrawEligible: false,
  };
}

export async function evaluateAndIssueCompletionReward(input: {
  tx: Prisma.TransactionClient;
  shoppingId: string;
  campaignId: string;
  participantId: string;
  triggerCardId: string;
  settings: unknown;
  activeCardPublicIds: string[];
  collectedPublicIds: string[];
}): Promise<CompletionRewardStatus> {
  const currentState = await readCompletionRewardState({
    db: input.tx,
    campaignId: input.campaignId,
    participantId: input.participantId,
    settings: input.settings,
    activeCardPublicIds: input.activeCardPublicIds,
    collectedPublicIds: input.collectedPublicIds,
  });

  if (currentState.unlocked || !currentState.enabled) {
    return currentState;
  }

  const config = parseCompletionRewardConfig(input.settings, input.activeCardPublicIds);
  const progress = computeProgressAgainstConfig(config, input.collectedPublicIds, input.activeCardPublicIds);

  if (!progress.eligibleNow) {
    return currentState;
  }

  const nowIso = new Date().toISOString();
  const rewardDedupeKey = buildRewardDedupeKey(input.campaignId, input.participantId);
  const modeDedupeKey = buildModeDedupeKey(config.mode, input.campaignId, input.participantId);
  const shortHash = rewardDedupeKey.slice(0, 8).toUpperCase();
  const rewardId = `RWD-${shortHash}`;
  const referenceId = config.mode === 'EXCLUSIVE_DRAW'
    ? `EXCL-${shortHash}`
    : `BONUS-${shortHash}`;
  const auditRef = `AUD-${rewardDedupeKey.slice(8, 16).toUpperCase()}`;

  const metadata = {
    rewardId,
    referenceId,
    auditRef,
    mode: config.mode,
    status: 'ISSUED',
    title: config.title,
    terms: config.terms,
    requiredTarget: progress.target,
    requiredCardIds: config.requiredCardIds,
    completedCardIds: progress.completedCardIds,
    completedAt: nowIso,
    issuedAt: nowIso,
  };

  await input.tx.event.upsert({
    where: { dedupeKey: rewardDedupeKey },
    create: {
      eventType: 'ROUTE_COMPLETION_REWARD_ISSUED',
      shoppingId: input.shoppingId,
      campaignId: input.campaignId,
      participantId: input.participantId,
      cardId: input.triggerCardId,
      dedupeKey: rewardDedupeKey,
      metadata,
    },
    update: {},
  });

  await input.tx.event.upsert({
    where: { dedupeKey: modeDedupeKey },
    create: {
      eventType: config.mode === 'EXCLUSIVE_DRAW'
        ? 'EXCLUSIVE_DRAW_ELIGIBILITY_ISSUED'
        : 'EXTRA_RAFFLE_ENTRY_ISSUED',
      shoppingId: input.shoppingId,
      campaignId: input.campaignId,
      participantId: input.participantId,
      cardId: input.triggerCardId,
      dedupeKey: modeDedupeKey,
      metadata: {
        source: 'ROUTE_COMPLETION',
        rewardId,
        referenceId,
        auditRef,
        completedCardIds: progress.completedCardIds,
        issuedAt: nowIso,
      },
    },
    update: {},
  });

  const scanRaffleEntriesCount = Array.from(new Set(input.collectedPublicIds)).length;
  const bonusRaffleEntriesCount = config.mode === 'EXTRA_RAFFLE_ENTRY' ? 1 : 0;

  return {
    enabled: true,
    mode: config.mode,
    title: config.title,
    description: describeCompletionReward(config, true, 0, config.mode),
    terms: config.terms,
    target: progress.target,
    requiredCardIds: config.requiredCardIds,
    completedCount: progress.completedCount,
    pendingCount: 0,
    completedCardIds: progress.completedCardIds,
    pendingCardIds: [],
    unlocked: true,
    justUnlocked: true,
    rewardId,
    referenceId,
    completedAt: nowIso,
    issuedAt: nowIso,
    scanRaffleEntriesCount,
    bonusRaffleEntriesCount,
    totalRaffleEntriesCount: scanRaffleEntriesCount + bonusRaffleEntriesCount,
    exclusiveDrawEligible: config.mode === 'EXCLUSIVE_DRAW',
  };
}
