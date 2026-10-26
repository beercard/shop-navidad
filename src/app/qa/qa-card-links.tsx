'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCode from 'qrcode';

type CardLink = { id: string; publicId: string; status: string; location: string | null; shoppingId: string; shoppingSlug: 'centenario' | 'uniplaza'; shoppingName: string };
type QRResult = { dataUrl: string; svg: string };
type NdefRecord = { recordType: string; data?: string | BufferSource };
type NdefReaderLike = { write(message: { records: { recordType: 'url'; data: string }[] }): Promise<void>; scan(): Promise<void>; addEventListener(type: 'reading', listener: (event: { message: { records: NdefRecord[] } }) => void, options?: { once?: boolean }): void };

export default function QACardLinks({ cards, baseUrl, baseUrlError }: { cards: CardLink[]; baseUrl: string | null; baseUrlError: string | null }) {
  const [qrs, setQrs] = useState<Record<string, QRResult>>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const urls = useMemo(() => cards.map((card) => ({ card, url: baseUrl ? `${baseUrl}/${card.shoppingSlug}/participar/${encodeURIComponent(card.publicId)}` : '' })), [cards, baseUrl]);

  useEffect(() => {
    let active = true;
    async function createCodes() {
      if (!baseUrl) { setQrs({}); return; }
      try {
        const pairs = await Promise.all(urls.map(async ({ card, url }) => {
          const [dataUrl, svg] = await Promise.all([
            QRCode.toDataURL(url, { width: 240, margin: 2, errorCorrectionLevel: 'M' }),
            QRCode.toString(url, { type: 'svg', width: 240, margin: 2, errorCorrectionLevel: 'M' }),
          ]);
          return [card.id, { dataUrl, svg }] as const;
        }));
        if (active) setQrs(Object.fromEntries(pairs));
      } catch { if (active) setMessage('No pudimos generar los códigos. Revisá la URL base y volvé a cargar.'); }
    }
    void createCodes();
    return () => { active = false; };
  }, [baseUrl, urls]);

  function download(card: CardLink, type: 'png' | 'svg') {
    const qr = qrs[card.id];
    if (!qr) return;
    const blob = type === 'svg' ? new Blob([qr.svg], { type: 'image/svg+xml;charset=utf-8' }) : null;
    const href = blob ? URL.createObjectURL(blob) : qr.dataUrl;
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${card.publicId}.${type}`;
    anchor.click();
    if (blob) URL.revokeObjectURL(href);
  }

  async function copyUrl(card: CardLink, url: string) {
    try { await navigator.clipboard.writeText(url); setMessage(`Enlace NFC copiado para ${card.publicId}.`); }
    catch { setMessage('No se pudo copiar automáticamente. Seleccioná y copiá el enlace visible.'); }
  }

  async function writeNfc(card: CardLink, url: string) {
    const Reader = (window as Window & { NDEFReader?: new () => NdefReaderLike }).NDEFReader;
    if (!window.isSecureContext || !Reader) { setMessage('Este navegador no ofrece escritura Web NFC segura. Copiá la URL y escribila con una app NFC externa compatible.'); return; }
    setBusy(card.id); setMessage('Acercá una etiqueta NFC vacía al teléfono…');
    try {
      const writer = new Reader();
      await writer.write({ records: [{ recordType: 'url', data: url }] });
      setMessage(`URL grabada en ${card.publicId}. Volvé a acercar la etiqueta para comprobar que abra este enlace.`);
    } catch (error) {
      setMessage(error instanceof Error ? `No se pudo escribir la etiqueta: ${error.message}` : 'No se pudo escribir la etiqueta. Copiá la URL y usá una app NFC externa.');
    } finally { setBusy(''); }
  }

  async function verifyNfc(card: CardLink, expectedUrl: string) {
    const Reader = (window as Window & { NDEFReader?: new () => NdefReaderLike }).NDEFReader;
    if (!window.isSecureContext || !Reader) { setMessage('La lectura Web NFC requiere un navegador y teléfono compatibles, con HTTPS. Probá acercar la etiqueta para abrir su enlace.'); return; }
    setBusy(card.id); setMessage('Acercá al teléfono la etiqueta que querés verificar…');
    try {
      const reader = new Reader();
      reader.addEventListener('reading', (event) => {
        const urlRecord = event.message.records.find((record) => record.recordType === 'url');
        const value = typeof urlRecord?.data === 'string' ? urlRecord.data : '';
        setMessage(value === expectedUrl ? `Etiqueta verificada: coincide con ${card.publicId}.` : `La etiqueta no coincide con ${card.publicId}. Enlace leído: ${value || 'registro URL no encontrado'}.`);
        setBusy('');
      }, { once: true });
      await reader.scan();
    } catch (error) {
      setBusy('');
      setMessage(error instanceof Error ? `No pudimos leer la etiqueta: ${error.message}` : 'No se pudo leer. Usá HTTPS y un teléfono/navegador con Web NFC, o validá el enlace al acercar la etiqueta.');
    }
  }

  return <section className="qa-panel qa-card-links" id="qa-demo-data">
    <div className="qa-panel-head"><div><span className="qa-eyebrow">DATOS DEMO Y QR/NFC</span><h2>Tarjetas para probar</h2></div><div className="qa-link-actions"><button onClick={() => window.print()} disabled={!baseUrl || !cards.length}>Imprimir hoja</button><Link href="/admin" target="_blank">Panel autorizado ↗</Link></div></div>
    <p className="qa-hint">Los QR contienen solo una URL pública con el ID de la tarjeta. El servidor verifica shopping, campaña y estado en cada apertura; los premios y permisos nunca viajan dentro del código.</p>
    {baseUrl ? <p className="qa-base-url">URL base configurada: <code>{baseUrl}</code></p> : <div className="qa-notice error" role="alert">{baseUrlError ?? 'Configurá APP_BASE_URL antes de generar enlaces. No uses localhost para escanear desde otro dispositivo.'}</div>}
    <div className="qa-nfc-help"><b>Cómo usar NFC</b><ol><li>En teléfonos compatibles, habilitá NFC y usá “Grabar URL”; acercá una etiqueta NFC vacía.</li><li>“Verificar etiqueta” compara el registro URL leído con el enlace registrado de esta tarjeta.</li><li>Web NFC suele requerir Chrome para Android y HTTPS. Para otros teléfonos o este HTTP de red local, copiá la URL y usá una app NFC externa para escribir un registro NDEF tipo URL.</li><li>Después de escribirla, acercá la etiqueta: debe abrir la ruta de la misma tarjeta y shopping.</li></ol></div>
    {message && <p className="qa-notice success" role="status">{message}</p>}
    <div className="qa-qr-grid">{urls.map(({ card, url }) => <article className="qa-qr-card" key={card.id}>
      {qrs[card.id] ? <Image src={qrs[card.id].dataUrl} width={168} height={168} unoptimized alt={`Código QR para ${card.publicId}, ${card.shoppingName}`} /> : <div className="qa-qr-placeholder" aria-label="Generando código QR">QR</div>}
      <div className="qa-qr-info"><b>{card.shoppingName}</b><strong>{card.publicId}</strong><small>{card.location ?? 'Sin ubicación'} · {card.status} · {cardUrlCount(card)}</small>
        {url && <><code>{url}</code><div className="qa-qr-buttons"><Link href={url} target="_blank" rel="noreferrer">Probar enlace ↗</Link><button onClick={() => download(card, 'png')} disabled={!qrs[card.id]}>PNG</button><button onClick={() => download(card, 'svg')} disabled={!qrs[card.id]}>SVG</button><button onClick={() => void copyUrl(card, url)}>Copiar NFC</button><button onClick={() => void writeNfc(card, url)} disabled={busy !== ''}>{busy === card.id ? 'Acercá etiqueta…' : 'Grabar NFC'}</button><button onClick={() => void verifyNfc(card, url)} disabled={busy !== ''}>Verificar NFC</button></div></>}
      </div>
    </article>)}</div>
    <style>{`
      .qa-link-actions{display:flex;align-items:center;gap:12px}.qa-link-actions button{min-height:40px;padding:8px 12px;border:0;border-radius:6px;background:#244f5c;color:white;font-size:12px;font-weight:700;cursor:pointer}.qa-link-actions a{font-size:12px;color:#244f5c}.qa-base-url{font-size:12px;color:#344f59;overflow-wrap:anywhere}.qa-nfc-help{margin:18px 0;padding:14px 16px;border:1px solid #dce3e4;border-radius:9px;background:#f7f9f8;color:#40545b;font-size:12px;line-height:1.6}.qa-nfc-help ol{margin:8px 0 0;padding-left:20px}.qa-qr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));gap:10px;margin-top:16px}.qa-qr-card{display:grid;grid-template-columns:132px minmax(0,1fr);align-items:start;gap:14px;padding:12px;border:1px solid #dce3e4;border-radius:9px;min-width:0}.qa-qr-card img{width:132px;height:132px;object-fit:contain}.qa-qr-placeholder{width:132px;height:132px;display:grid;place-items:center;background:#edf2f2;color:#51656c}.qa-qr-info{display:grid;gap:5px;min-width:0;font-size:11px}.qa-qr-info>b{color:#40545b}.qa-qr-info>strong{font:600 14px ui-monospace,monospace;color:#203e4d}.qa-qr-info>small{color:#53646a}.qa-qr-info>code{overflow-wrap:anywhere;font-size:10px;color:#40545b}.qa-qr-buttons{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px}.qa-qr-buttons button,.qa-qr-buttons a{min-height:34px;display:inline-flex;align-items:center;padding:6px 8px;border:1px solid #d0dcde;border-radius:5px;background:#fff;color:#244f5c;font:600 10px Arial,sans-serif;text-decoration:none;cursor:pointer}.qa-qr-buttons button:disabled{opacity:.5;cursor:not-allowed}.qa-qr-buttons button:focus-visible,.qa-link-actions button:focus-visible,.qa-qr-buttons a:focus-visible{outline:3px solid #c29143;outline-offset:2px}
      @media(max-width:520px){.qa-link-actions{align-items:flex-start;flex-direction:column}.qa-qr-card{grid-template-columns:90px minmax(0,1fr);gap:10px}.qa-qr-card img,.qa-qr-placeholder{width:90px;height:90px}.qa-qr-info>code{font-size:9px}}
      @media print{body *{visibility:hidden!important}.qa-card-links,.qa-card-links *{visibility:visible!important}.qa-card-links{position:absolute;inset:0;width:100%;border:0;padding:0}.qa-card-links .qa-panel-head,.qa-card-links>.qa-hint,.qa-card-links>.qa-base-url,.qa-card-links>.qa-nfc-help,.qa-card-links>.qa-notice,.qa-qr-buttons{display:none!important}.qa-qr-grid{grid-template-columns:repeat(3,1fr)}.qa-qr-card{break-inside:avoid;grid-template-columns:96px minmax(0,1fr);padding:8px}.qa-qr-card img{width:96px;height:96px}.qa-qr-info>code{font-size:8px}}
    `}</style>
  </section>;
}

function cardUrlCount(card: CardLink) { return card.status === 'ACTIVE' ? 'activa' : 'no disponible'; }
