'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { brandCssVariables, getShoppingBrand, type ShoppingBrandId } from '@/lib/brand';

type PublicPayload = {
  shopping?: { slug: ShoppingBrandId; name: string; brandSettings?: Record<string, unknown> };
  campaign?: { id: string; name: string; startsAt: string; endsAt: string } | null;
  cards?: Array<{ publicId: string; location?: string | null; kind?: string }>;
  prizes?: Array<{ remainingStock: number }>;
};

type PlayResult = {
  status: 'won' | 'no_prize';
  prize?: { name: string; description?: string | null };
  redeemCode?: string;
  expiresAt?: string;
};

const shoppingIds: ShoppingBrandId[] = ['centenario', 'uniplaza'];

export default function ParticipateClient({ cardId, lockedShopping }: { cardId: string; lockedShopping?: ShoppingBrandId }) {
  const [shopping, setShopping] = useState<ShoppingBrandId>(lockedShopping ?? 'centenario');
  const [payload, setPayload] = useState<PublicPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<PlayResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function findCard() {
      setLoading(true);
      setError('');
      setPayload(null);
      let temporarilyUnavailable = false;
      for (const shoppingSlug of lockedShopping ? [lockedShopping] : shoppingIds) {
        try {
          const response = await fetch(`/api/campaigns/${shoppingSlug}/public`, { cache: 'no-store', signal: controller.signal });
          const data = await response.json();
          if (response.status >= 500) temporarilyUnavailable = true;
          if (!response.ok) continue;
          if (data.cards?.some((card: { publicId: string }) => card.publicId === cardId)) {
            setShopping(shoppingSlug);
            setPayload(data);
            return;
          }
        } catch (reason) {
          if (reason instanceof Error && reason.name === 'AbortError') return;
          temporarilyUnavailable = true;
        }
      }
      if (!controller.signal.aborted) setError(temporarilyUnavailable ? 'No podemos verificar la tarjeta ahora. Revisá tu conexión e intentá de nuevo.' : 'No encontramos esta tarjeta activa. Revisá el enlace o consultá al equipo del shopping.');
    }
    findCard().finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [cardId, reloadKey, lockedShopping]);

  async function participate() {
    if (submitting || !payload?.campaign) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/participations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shoppingSlug: shopping, cardId, idempotencyKey: crypto.randomUUID() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos registrar tu participación.');
      if (data.status !== 'won' && data.status !== 'no_prize') throw new Error('No pudimos confirmar el resultado.');
      setResult(data);
    } catch (reason) {
      setError(reason instanceof Error && reason.name === 'Error' ? reason.message : 'No pudimos conectar con la campaña. Revisá tu conexión e intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  const brand = getShoppingBrand(shopping);
  return (
    <main className="site-shell participate-shell" data-shopping={shopping} style={brandCssVariables(brand, payload?.shopping?.brandSettings) as CSSProperties}>
      <header className="participate-header"><Link className="brand" href={`/${shopping}`} aria-label={`Volver a la campaña de ${brand.name}`}><span className="brand-mark" aria-hidden="true">✳</span><span>NAVIDAD<span className="brand-light">MÁGICA</span><small className="brand-shopping-name">{brand.name}</small></span></Link><span>{payload?.shopping?.name ?? brand.name}</span></header>
      <section className="participate-card" aria-live="polite">
        <span className="participate-kicker">NAVIDAD MÁGICA · {payload?.shopping?.name ?? brand.name}</span>
        <div className="participate-icon" aria-hidden="true">{result?.status === 'won' ? '🎁' : '✳'}</div>
        <h1>{result ? result.status === 'won' ? '¡Encontraste tu premio!' : 'Participación registrada' : 'Encontraste una tarjeta'}</h1>
        <p className="participate-description">{result ? result.status === 'won' ? 'El servidor confirmó este premio para tu participación.' : 'El servidor registró tu participación. Esta tarjeta no asignó un premio.' : 'Validaremos esta tarjeta y la campaña antes de registrar tu participación.'}</p>
        <div className="participate-card-id"><span>CÓDIGO DE TARJETA</span><strong>{cardId}</strong>{payload?.cards?.find(card => card.publicId === cardId)?.location && <small>{payload.cards.find(card => card.publicId === cardId)?.location}</small>}</div>
        {loading && <p className="participate-status" role="status">Verificando tarjeta y campaña…</p>}
        {error && <p className="participate-error" role="alert">{error}</p>}
        {error && !payload?.campaign && !loading && <button className="participate-retry" onClick={() => setReloadKey(key => key + 1)}>Reintentar verificación ↻</button>}
        {result?.status === 'won' && <div className="participate-result"><span>PREMIO CONFIRMADO</span><h2>{result.prize?.name}</h2>{result.prize?.description && <p>{result.prize.description}</p>}{result.redeemCode && <code>{result.redeemCode}</code>}{result.expiresAt && <small>Válido hasta {new Date(result.expiresAt).toLocaleString('es-AR')}</small>}</div>}
        {!result && <button className="button button-primary participate-submit" onClick={participate} disabled={loading || submitting || !payload?.campaign}>{submitting ? 'Confirmando con el servidor…' : loading ? 'Verificando…' : payload?.campaign ? 'Participar ↗' : 'Participación no disponible'}</button>}
        <Link className="participate-back" href={`/${shopping}`}>Volver a la campaña</Link>
      </section>
      <footer className="participate-footer">Una campaña para compartir la magia.</footer>
    </main>
  );
}
