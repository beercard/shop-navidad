'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brandCssVariables, getShoppingBrand, type ShoppingBrandId } from '@/lib/brand';
import '../participate.css';

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
  redeemQr?: string;
  expiresAt?: string;
};

const shoppingIds: ShoppingBrandId[] = ['centenario', 'uniplaza'];

const iconProps = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const;
const GiftIcon = () => <svg {...iconProps}><path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" /></svg>;
const StarIcon = () => <svg {...iconProps}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" /></svg>;
const ClockIcon = () => <svg {...iconProps}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
const CopyIcon = () => <svg {...iconProps}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>;
const CheckIcon = () => <svg {...iconProps}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;

export default function ParticipateClient({ cardId, lockedShopping }: { cardId: string; lockedShopping?: ShoppingBrandId }) {
  const [shopping, setShopping] = useState<ShoppingBrandId>(lockedShopping ?? 'centenario');
  const [payload, setPayload] = useState<PublicPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<PlayResult | null>(null);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function findCard() {
      setLoading(true);
      setError('');
      setPayload(null);
      let temporarilyUnavailable = false;
      for (const shoppingSlug of lockedShopping ? [lockedShopping] : shoppingIds) {
        try {
          const query = new URLSearchParams({ cardId });
          const response = await fetch(`/api/campaigns/${shoppingSlug}/public?${query}`, { cache: 'no-store', signal: controller.signal });
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

  // Al aparecer el resultado, el foco pasa al título para que lectores de pantalla lo anuncien.
  useEffect(() => { if (result) headingRef.current?.focus(); }, [result]);

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

  async function copyCode() {
    if (!result?.redeemCode) return;
    try {
      await navigator.clipboard.writeText(result.redeemCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setError('No pudimos copiar el código. Podés mantenerlo presionado para seleccionarlo.');
    }
  }

  const brand = getShoppingBrand(shopping);
  const shoppingName = payload?.shopping?.name ?? brand.name;
  const rawLocation = payload?.cards?.find((card) => card.publicId === cardId)?.location;
  const cardLocation = rawLocation
    ? rawLocation.replace(/^Punto demo\s+(\d+)$/i, 'Posta $1 · Recorrido del Shopping')
    : undefined;
  const won = result?.status === 'won';
  const cleanPrizeTitle = result?.prize?.name
    ? result.prize.name
        .replace(/^DEMO\s*[—\-·:]+\s*SIN VALOR COMERCIAL\s*[—\-·:]+\s*/i, '')
        .replace(/^DEMO\s*[—\-·:]+\s*/i, '')
        .trim()
    : '';
  return (
    <main className="site-shell participate-shell" data-shopping={shopping} style={brandCssVariables(brand, payload?.shopping?.brandSettings) as CSSProperties}>
      <header className="participate-header"><Link className="brand" href={`/${shopping}`}><span className="brand-mark" aria-hidden="true">✳</span><span>NAVIDAD<span className="brand-light">MÁGICA</span><small className="brand-shopping-name">{brand.name}</small></span></Link><span>{shoppingName}</span></header>
      <section className="participate-card" aria-live="polite">
        <span className="participate-kicker">{shopping === 'centenario' ? 'Temporada Festiva' : 'Paseo Urbano · Club'} · {shoppingName}</span>
        <div className="participate-icon" aria-hidden="true">{won ? <GiftIcon /> : <StarIcon />}</div>
        <h1 ref={headingRef} tabIndex={-1}>{result ? won ? '¡Encontraste tu premio!' : 'Participación registrada' : 'Encontraste una tarjeta'}</h1>
        <p className="participate-description">{result ? won ? 'Tu beneficio instantáneo quedó validado y listo para canjear en los locales adheridos.' : 'Registramos esta posta en tu pasaporte. Esta tarjeta no tenía premio directo asignado.' : 'Activá esta posta oficial del shopping para sumar un sello a tu colección y participar por beneficios instantáneos.'}</p>
        <div className="participate-card-id"><span>POSTA OFICIAL ESCANEADA</span><strong>{cardId}</strong>{cardLocation && <small>{cardLocation}</small>}</div>
        {loading && <p className="participate-status" role="status">Verificando tarjeta y campaña…</p>}
        {error && <p className="participate-error" role="alert">{error}</p>}
        {error && !payload?.campaign && !loading && <button className="participate-retry" onClick={() => setReloadKey(key => key + 1)}>Reintentar verificación</button>}
        {won && <div className="pr-result pr-live">
          <p className="pr-eyebrow">Premio confirmado</p>
          <h2 className="pr-prize">{cleanPrizeTitle || result?.prize?.name}</h2>
          {result?.prize?.description && <p className="pr-desc">{result.prize.description}</p>}
          {result?.redeemCode && <div className="pr-voucher">
            <p className="pr-how">Mostrá este QR en el comercio. Si no se puede escanear, dictá el código.</p>
            {result.redeemQr && <Image unoptimized src={result.redeemQr} width={240} height={240} alt={`Código QR de canje para ${result.prize?.name ?? 'tu premio'}`} />}
            <code className="pr-code" aria-label={`Código de canje ${result.redeemCode}`}>{result.redeemCode}</code>
            <button type="button" className="pr-copy" onClick={copyCode}>{copied ? <CheckIcon /> : <CopyIcon />}{copied ? 'Código copiado' : 'Copiar código'}</button>
            <span className="sr-only" role="status">{copied ? 'Código copiado al portapapeles' : ''}</span>
          </div>}
          {result?.expiresAt && <p className="pr-expiry"><ClockIcon />Válido hasta {new Date(result.expiresAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</p>}
          <p className="pr-demo">Tu cupón también quedó guardado en Mis cupones. Podés jugar otros códigos sin haber canjeado este.</p>
        </div>}
        {result && !won && <p className="pr-noprize pr-live">Podés seguir buscando otras tarjetas del recorrido para completar tu colección.</p>}
        {!result && <button className="button button-primary participate-submit" onClick={participate} disabled={loading || submitting || !payload?.campaign}>{submitting ? 'Confirmando con el servidor…' : loading ? 'Verificando…' : payload?.campaign ? 'Participar' : 'Participación no disponible'}</button>}
        {result && <Link className="button button-primary participate-submit" href={`/${shopping}#jugar`}>Jugar otro código de tarjeta</Link>}
        {result && <Link className="participate-back" href={`/${shopping}#progreso`}>Ver todos mis cupones QR</Link>}
        <Link className="participate-back" href={`/${shopping}`}>Volver a la campaña</Link>
      </section>
      <footer className="participate-footer">Una campaña para compartir la magia.</footer>
    </main>
  );
}
