'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { ShoppingBrandId } from '@/lib/brand';
import { expiryLabel } from '@/lib/countdown';
import { formatMerchants } from '@/lib/merchant-list';
import './coupon-wallet.css';

type CouponState = 'available' | 'redeemed' | 'expired' | 'void';
type Coupon = {
  id: string; state: CouponState; prize: { name: string; description: string | null }; campaign: string; merchants: string[];
  expiresAt: string; redeemedAt: string | null; code?: string; qr?: string;
};

const icon = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const;
const stateMeta: Record<CouponState, { label: string; path: string }> = {
  available: { label: 'Disponible', path: 'M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5' },
  redeemed: { label: 'Canjeado', path: 'm5 12.5 4.5 4.5L19 7.5' },
  expired: { label: 'Vencido', path: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z' },
  void: { label: 'Anulado', path: 'M6 6l12 12M18 6 6 18' },
};

function fmt(value: string) { return new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }); }

function formatCouponTitle(rawName: string): { title: string; isDemo: boolean } {
  const isDemo = /DEMO|SIN VALOR COMERCIAL/i.test(rawName);
  let clean = rawName
    .replace(/^DEMO\s*[—\-·:]+\s*SIN VALOR COMERCIAL\s*[—\-·:]+\s*/i, '')
    .replace(/^DEMO\s*[—\-·:]+\s*/i, '')
    .trim();
  if (/Cupón demo del 10%/i.test(clean)) clean = 'Beneficio 10% OFF en locales';
  else if (/Cupón demo del 20%/i.test(clean)) clean = 'Beneficio 20% OFF en locales';
  else if (/Gift card demo/i.test(clean)) clean = 'Gift Card Especial de Temporada';
  else if (/Beneficio sorpresa demo/i.test(clean)) clean = 'Obsequio Sorpresa Instantáneo';
  else if (/Premio especial demo/i.test(clean)) clean = 'Experiencia VIP del Shopping';
  return { title: clean || rawName, isDemo };
}

export function CouponWallet({ shopping, refreshKey }: { shopping: ShoppingBrandId; refreshKey?: string }) {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'available' | 'history'>('available');
  const [open, setOpen] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyCouponCode(id: string, code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2200);
    } catch { /* fallback selection */ }
  }

  const load = useCallback(async (signal?: AbortSignal) => {
    setError('');
    try {
      const response = await fetch(`/api/coupons?shoppingSlug=${shopping}`, { cache: 'no-store', signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos cargar tus cupones.');
      setCoupons(data.coupons);
    } catch (reason) {
      if (reason instanceof Error && reason.name === 'AbortError') return;
      setCoupons(null);
      setError(reason instanceof Error ? reason.message : 'No pudimos cargar tus cupones. Revisá tu conexión.');
    }
  }, [shopping]);

  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load, refreshKey]);

  const available = coupons?.filter((coupon) => coupon.state === 'available') ?? [];
  const history = coupons?.filter((coupon) => coupon.state !== 'available') ?? [];
  const shown = tab === 'available' ? available : history;

  return (
    <section className="cw" aria-labelledby="cw-title">
      <h3 id="cw-title" className="cw-title">Mis cupones</h3>
      <div className="cw-tabs" role="group" aria-label="Filtrar cupones">
        <button type="button" aria-pressed={tab === 'available'} onClick={() => setTab('available')}>Disponibles{coupons ? ` (${available.length})` : ''}</button>
        <button type="button" aria-pressed={tab === 'history'} onClick={() => setTab('history')}>Historial{coupons ? ` (${history.length})` : ''}</button>
      </div>
      {error && <p className="cw-error" role="alert">{error} <button type="button" onClick={() => void load()}>Reintentar</button></p>}
      {!coupons && !error && <div className="cw-skeleton" role="status" aria-label="Cargando cupones"><span /><span /></div>}
      {coupons && !shown.length && (
        <p className="cw-empty">{tab === 'available' ? 'Todavía no tenés cupones disponibles. Si ganás un premio, aparece acá con su QR.' : 'Los cupones canjeados, vencidos o anulados van a aparecer acá.'}</p>
      )}
      <ul className="cw-list">
        {shown.map((coupon) => {
          const meta = stateMeta[coupon.state];
          const expiry = expiryLabel(coupon.expiresAt);
          const where = formatMerchants(coupon.merchants, 3);
          const expanded = open === coupon.id && coupon.state === 'available';
          const titleMeta = formatCouponTitle(coupon.prize.name);
          return (
            <li key={coupon.id} className="cw-card" data-state={coupon.state}>
              <div className="cw-top">
                <div className="cw-heading-group">
                  <span className="cw-pass-kicker">PASE DIGITAL{titleMeta.isDemo ? ' · DEMO' : ''}</span>
                  <h4>{titleMeta.title}</h4>
                </div>
                <span className="cw-chip" data-state={coupon.state}><svg {...icon}><path d={meta.path} /></svg>{meta.label}</span>
              </div>
              <p className="cw-where">{where ? `Canjeable en: ${where}` : 'Consultá en el shopping dónde canjearlo.'}</p>
              {coupon.state === 'available' && <p className="cw-expiry" data-soon={expiry.soon}>{expiry.text}</p>}
              {coupon.state === 'redeemed' && coupon.redeemedAt && <p className="cw-expiry">Canjeado el {fmt(coupon.redeemedAt)}</p>}
              {coupon.state === 'expired' && <p className="cw-expiry">{expiry.text}. Ya no se puede canjear.</p>}
              {coupon.state === 'void' && <p className="cw-expiry">Este cupón fue anulado. Consultá con el equipo del shopping.</p>}
              {coupon.state === 'available' && (
                <>
                  <button type="button" className="cw-show" aria-expanded={expanded} aria-controls={`cw-${coupon.id}`} onClick={() => setOpen(expanded ? null : coupon.id)}>{expanded ? 'Ocultar QR' : 'Mostrar QR'}</button>
                  {expanded && coupon.qr && coupon.code && (
                    <div id={`cw-${coupon.id}`} className="cw-voucher">
                      <p>Mostrá este QR en el comercio. Si no se puede escanear, dictá el código.</p>
                      <Image unoptimized src={coupon.qr} width={240} height={240} alt={`Código QR de canje para ${coupon.prize.name}`} />
                      <code aria-label={`Código de canje ${coupon.code}`}>{coupon.code}</code>
                      <button type="button" className="cw-copy" onClick={() => void copyCouponCode(coupon.id, coupon.code!)}>{copiedId === coupon.id ? '✓ Código copiado' : 'Copiar código'}</button>
                      {coupon.prize.description && <small>{coupon.prize.description}</small>}
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
