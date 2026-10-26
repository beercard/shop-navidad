'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getShoppingBrand, type ShoppingBrandId } from '@/lib/brand';

type ParticipantRegistrationProps = {
  shopping: ShoppingBrandId;
  campaignName?: string;
  rulesUrl?: string | null;
  onSuccess: (data: { participantId: string; phone: string; recoveryCode?: string }) => void;
  onDismiss?: () => void;
};

export function ParticipantRegistration({
  shopping,
  campaignName,
  rulesUrl,
  onSuccess,
  onDismiss,
}: ParticipantRegistrationProps) {
  const brand = getShoppingBrand(shopping);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresRecovery, setRequiresRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newRecoveryCode, setNewRecoveryCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Por favor ingresá tu número de celular.');
      return;
    }

    if (!consent) {
      setError('Debés aceptar las Bases y Condiciones y el Aviso de Privacidad para participar.');
      return;
    }

    if (requiresRecovery && !recoveryCode.trim()) {
      setError('Por favor ingresá el código de recuperación de tu cuenta.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/participants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shoppingSlug: shopping,
          phone: phone.trim(),
          consent,
          consentVersion: '2026-v1',
          recoveryCode: requiresRecovery ? recoveryCode.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresRecoveryCode || res.status === 409) {
          setRequiresRecovery(true);
          setError(
            data.error ||
              'Este número ya está participando. Ingresá tu código de recuperación para acceder desde este dispositivo.',
          );
        } else {
          setError(data.error || 'Ocurrió un error al procesar el registro.');
        }
        return;
      }

      if (data.recoveryCode) {
        // Mostrar código de recuperación generado para que el usuario pueda guardarlo
        setNewRecoveryCode(data.recoveryCode);
      } else {
        // Ya registrado o recuperado
        onSuccess({
          participantId: data.participantId,
          phone: data.phone,
          recoveryCode: data.recoveryCode,
        });
      }
    } catch {
      setError('No pudimos conectar con el servidor. Comprobá tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const copyRecoveryCode = async () => {
    if (!newRecoveryCode) return;
    try {
      await navigator.clipboard.writeText(newRecoveryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback silencioso si no hay permisos de portapapeles
    }
  };

  // Genera en el propio celular una imagen con el código para guardarla en la galería; no se envía a ningún servidor.
  const saveRecoveryImage = () => {
    if (!newRecoveryCode) return;
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 480;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#fffdf8';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#203a31';
    context.font = 'bold 40px Georgia, serif';
    context.fillText(`Navidad Mágica · ${brand.name}`, 60, 100);
    context.font = '28px Arial, sans-serif';
    context.fillText('Código de recuperación', 60, 170);
    context.font = 'bold 72px monospace';
    context.fillText(newRecoveryCode, 60, 270);
    context.font = '24px Arial, sans-serif';
    context.fillText('Te permite recuperar tus cupones si cambiás de celular.', 60, 360);
    context.fillText('No lo compartas con nadie.', 60, 400);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `codigo-recuperacion-${brand.shortName.toLowerCase()}.png`;
    link.click();
  };

  const handleFinishNewRegistration = () => {
    if (!newRecoveryCode) return;
    onSuccess({
      participantId: 'registered',
      phone,
      recoveryCode: newRecoveryCode,
    });
  };

  return (
    <div className="registration-overlay" data-testid="registration-modal">
      <div className="registration-card">
        {onDismiss && (
          <button
            type="button"
            className="close-modal-btn"
            onClick={onDismiss}
            aria-label="Cerrar modal"
            data-testid="close-registration-btn"
          >
            ✕
          </button>
        )}
        {/* Encabezado con marca */}
        <div className="registration-header">
          {brand.logo.src ? (
            <Image
              src={brand.logo.src}
              alt={brand.logo.alt}
              width={160}
              height={44}
              className="registration-logo"
              priority
            />
          ) : (
            <div className="registration-wordmark">{brand.name}</div>
          )}
          <h2 className="registration-title">
            {newRecoveryCode
              ? '¡Tu Pasaporte está Listo!'
              : requiresRecovery
                ? 'Recuperar mi Pasaporte'
                : 'Activá tu Pasaporte Navideño'}
          </h2>
          <p className="registration-subtitle">
            {newRecoveryCode
              ? 'Guardá tu código de recuperación para acceder a tus cupones desde cualquier dispositivo.'
              : requiresRecovery
                ? 'Ingresá el código de recuperación que recibiste al registrarte en tu primer dispositivo.'
                : 'Ingresá tu celular para descubrir postas, girar la ruleta navideña y guardar tus cupones.'}
          </p>
        </div>

        {/* Modal de nuevo código de recuperación generado */}
        {newRecoveryCode ? (
          <div className="registration-success-box" data-testid="recovery-code-card">
            <div className="recovery-badge">Código de recuperación exclusivo</div>
            <div className="recovery-code-display" data-testid="recovery-code-display">
              {newRecoveryCode}
            </div>
            <p className="recovery-hint">
              Este código es tu llave de acceso para volver a abrir tu billetera si cambiás de celular o borrás el
              navegador.
            </p>
            <div className="recovery-actions">
              <button
                type="button"
                className="registration-secondary-btn"
                onClick={copyRecoveryCode}
                data-testid="copy-recovery-code-btn"
              >
                {copied ? '✓ Código copiado' : 'Copiar código'}
              </button>
              <button
                type="button"
                className="registration-secondary-btn"
                onClick={saveRecoveryImage}
                data-testid="save-recovery-image-btn"
              >
                Guardar como imagen
              </button>
              <button
                type="button"
                className="registration-submit-btn"
                onClick={handleFinishNewRegistration}
                data-testid="continue-after-registration-btn"
              >
                Comenzar a jugar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registration-form" data-testid="registration-form">
            {/* Campo Celular */}
            <div className="form-group">
              <label htmlFor="reg-phone" className="form-label">
                Número de celular
              </label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">+54</span>
                <input
                  id="reg-phone"
                  data-testid="registration-phone-input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="ej. 11 2345 6789 o 379 412 3456"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <small className="form-help">
                Sin el 0 y sin el 15. Usamos tu número para identificar tus jugadas y canjear premios.
              </small>
            </div>

            {/* Campo Código de Recuperación (si fue solicitado) */}
            {requiresRecovery && (
              <div className="form-group recovery-group" data-testid="recovery-input-group">
                <label htmlFor="reg-recovery" className="form-label">
                  Código de recuperación
                </label>
                <input
                  id="reg-recovery"
                  data-testid="registration-recovery-input"
                  type="text"
                  placeholder="REC-XXXX-XXXX"
                  value={recoveryCode}
                  onChange={(e) => {
                    setRecoveryCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  className="form-input recovery-input"
                  disabled={loading}
                  maxLength={15}
                />
                <button
                  type="button"
                  className="text-toggle-btn"
                  onClick={() => {
                    setRequiresRecovery(false);
                    setError('');
                  }}
                >
                  Registrar con otro celular
                </button>
              </div>
            )}

            {!requiresRecovery && (
              <div className="have-code-link-wrap">
                <button
                  type="button"
                  className="text-toggle-btn"
                  onClick={() => setRequiresRecovery(true)}
                  data-testid="have-recovery-code-btn"
                >
                  ¿Ya te registraste en otro celular? Ingresá con tu código
                </button>
              </div>
            )}

            {/* Checkbox Términos y Privacidad */}
            <div className="form-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  data-testid="registration-consent-checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setError('');
                  }}
                  disabled={loading}
                  className="checkbox-input"
                />
                <span>
                  Acepto las{' '}
                  <button
                    type="button"
                    className="link-inline"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                  >
                    Bases y Condiciones
                  </button>{' '}
                  de {campaignName || 'la campaña'} y el{' '}
                  <button
                    type="button"
                    className="link-inline"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyModal(true);
                    }}
                  >
                    Aviso de Privacidad
                  </button>
                  .
                </span>
              </label>
            </div>

            {/* Mensajes de error */}
            {error && (
              <div className="registration-error" data-testid="registration-error-msg" role="alert">
                {error}
              </div>
            )}

            {/* Botón Principal CTA */}
            <button
              type="submit"
              className="registration-submit-btn"
              data-testid="registration-submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Conectando...'
                : requiresRecovery
                  ? 'Recuperar mi cuenta'
                  : 'Comenzar a jugar'}
            </button>
          </form>
        )}

        {/* Modal Bases y Condiciones */}
        {showTermsModal && (
          <div className="legal-modal-backdrop" onClick={() => setShowTermsModal(false)}>
            <div className="legal-modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>Bases y Condiciones de la Campaña</h3>
              <div className="legal-content">
                <p>
                  <strong>1. Organizador:</strong> Campaña oficial de fidelización de {brand.name}.
                </p>
                <p>
                  <strong>2. Mecánica:</strong> Cada participante podrá registrar su número de celular para descubrir
                  las postas navideñas habilitadas. Cada posta válida habilita una única oportunidad de juego en la
                  ruleta y suma una participación para el sorteo final.
                </p>
                <p>
                  <strong>3. Límite de premios:</strong> Se entregará como máximo 1 premio instantáneo por participante
                  durante la vigencia de la campaña.
                </p>
                <p>
                  <strong>4. Canje en comercios:</strong> Los cupones emitidos tienen vigencia de 48 horas y deben
                  presentarse físicamente en los locales adheridos.
                </p>
                {rulesUrl && (
                  <p>
                    <a href={rulesUrl} target="_blank" rel="noopener noreferrer" className="link-inline">
                      Ver reglamento completo extendido
                    </a>
                  </p>
                )}
              </div>
              <button
                type="button"
                className="registration-secondary-btn full-w"
                onClick={() => setShowTermsModal(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Modal Política de Privacidad */}
        {showPrivacyModal && (
          <div className="legal-modal-backdrop" onClick={() => setShowPrivacyModal(false)}>
            <div className="legal-modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>Aviso de Privacidad</h3>
              <div className="legal-content">
                <p>
                  <strong>Tratamiento de Datos:</strong> Tu número de teléfono celular se recopila exclusivamente para
                  identificar de forma única tu pasaporte digital, registrar tus participaciones en el sorteo final y
                  permitir la acreditación de beneficios comerciales en los locales adheridos.
                </p>
                <p>
                  <strong>No requerimos contraseñas ni enviamos publicidad no deseada (SPAM).</strong> Los números de
                  teléfono se almacenan de forma segura y encriptada, no son cedidos a terceros ni expuestos al público.
                </p>
              </div>
              <button
                type="button"
                className="registration-secondary-btn full-w"
                onClick={() => setShowPrivacyModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Piel ligada a los tokens de marca de cada shopping (--brand-*). Hoja inferior en móvil, diálogo en pantallas anchas. */
        .registration-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgb(16 24 20 / 0.55);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow-y: auto;
        }
        .registration-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          max-height: 92svh;
          overflow-y: auto;
          background: var(--brand-surface-raised, #fffdf8);
          color: var(--brand-text, #203a31);
          border-radius: 24px 24px 0 0;
          padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
          box-shadow: 0 -12px 40px rgb(0 0 0 / 0.18);
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: sheetIn 0.26s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .registration-card::before {
          content: "";
          align-self: center;
          width: 40px;
          height: 4px;
          border-radius: 4px;
          background: var(--brand-border, #dfe2d8);
        }
        @keyframes sheetIn {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: none; opacity: 1; }
        }
        @media (min-width: 600px) {
          .registration-overlay { align-items: center; padding: 24px; }
          .registration-card { border-radius: 24px; padding: 24px 28px 28px; box-shadow: 0 24px 60px rgb(0 0 0 / 0.22); }
          .registration-card::before { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .registration-card { animation: none; }
        }
        .close-modal-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          background: var(--brand-surface, #f8f5ed);
          color: var(--brand-text, #203a31);
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .registration-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          padding-top: 6px;
        }
        .registration-logo { max-height: 40px; width: auto; object-fit: contain; }
        .registration-wordmark { font: 700 20px var(--brand-font-display, Georgia, serif); }
        .registration-title {
          margin: 6px 0 0;
          font: 700 24px/1.2 var(--brand-font-display, Georgia, serif);
          letter-spacing: -0.01em;
          color: var(--brand-text, #203a31);
        }
        .registration-subtitle {
          margin: 0;
          max-width: 36ch;
          font-size: 15px;
          line-height: 1.5;
          color: var(--brand-text-muted, #5f6d66);
        }
        .registration-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { font-size: 14px; font-weight: 700; color: var(--brand-text, #203a31); }
        .phone-input-wrap {
          display: flex;
          align-items: stretch;
          min-height: 52px;
          border: 2px solid var(--brand-border, #dfe2d8);
          border-radius: 14px;
          background: var(--brand-surface-raised, #fffdf8);
          overflow: hidden;
        }
        .phone-input-wrap:focus-within { border-color: var(--brand-primary, #315d4b); }
        .phone-prefix {
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-weight: 700;
          color: var(--brand-text-muted, #5f6d66);
          background: var(--brand-surface, #f8f5ed);
          border-right: 1px solid var(--brand-border, #dfe2d8);
        }
        .form-input {
          flex: 1;
          min-width: 0;
          min-height: 48px;
          padding: 0 14px;
          border: none;
          background: transparent;
          color: var(--brand-text, #203a31);
          font-size: 17px;
          outline: none;
        }
        .form-input::placeholder { color: var(--brand-text-muted, #5f6d66); opacity: 0.7; font-size: 15px; }
        .form-help { font-size: 13px; line-height: 1.4; color: var(--brand-text-muted, #5f6d66); }
        .recovery-group .form-input {
          border: 2px solid var(--brand-border, #dfe2d8);
          border-radius: 14px;
          font-family: var(--brand-font-utility, monospace);
          letter-spacing: 0.05em;
        }
        .recovery-group .form-input:focus { border-color: var(--brand-primary, #315d4b); }
        .have-code-link-wrap { text-align: left; }
        .text-toggle-btn, .link-inline {
          padding: 0;
          border: none;
          background: none;
          color: var(--brand-primary, #315d4b);
          font-size: inherit;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }
        .text-toggle-btn { min-height: 44px; font-size: 14px; }
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          line-height: 1.45;
          color: var(--brand-text, #203a31);
          cursor: pointer;
        }
        .checkbox-input {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          margin-top: 1px;
          accent-color: var(--brand-primary, #315d4b);
          cursor: pointer;
        }
        .registration-error {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid var(--brand-danger, #a63f37);
          background: color-mix(in srgb, var(--brand-danger, #a63f37) 8%, white);
          color: var(--brand-danger, #a63f37);
          font-size: 14px;
          line-height: 1.45;
        }
        .registration-submit-btn {
          min-height: 54px;
          border: none;
          border-radius: 14px;
          background: var(--brand-accent, #b94f43);
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.12s, opacity 0.15s;
        }
        .registration-submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .registration-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .registration-secondary-btn {
          min-height: 48px;
          padding: 0 16px;
          border: 2px solid var(--brand-primary, #315d4b);
          border-radius: 14px;
          background: transparent;
          color: var(--brand-primary, #315d4b);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .full-w { width: 100%; }
        .registration-success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
        }
        .recovery-badge {
          padding: 4px 12px;
          border-radius: 999px;
          background: var(--brand-accent-soft, #f3e6d1);
          color: var(--brand-text, #203a31);
          font-size: 12px;
          font-weight: 700;
        }
        .recovery-code-display {
          padding: 14px 20px;
          border: 2px dashed var(--brand-primary, #315d4b);
          border-radius: 14px;
          background: var(--brand-surface, #f8f5ed);
          color: var(--brand-text, #203a31);
          font: 700 26px var(--brand-font-utility, monospace);
          letter-spacing: 0.1em;
          user-select: all;
        }
        .recovery-hint { margin: 0; font-size: 14px; line-height: 1.5; color: var(--brand-text-muted, #5f6d66); }
        .recovery-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .legal-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgb(16 24 20 / 0.6);
        }
        .legal-modal-card {
          width: 100%;
          max-width: 480px;
          max-height: 80svh;
          overflow-y: auto;
          padding: 24px;
          border-radius: 20px;
          background: var(--brand-surface-raised, #fffdf8);
          color: var(--brand-text, #203a31);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .legal-modal-card h3 { margin: 0; font: 700 19px var(--brand-font-display, Georgia, serif); }
        .legal-content { display: flex; flex-direction: column; gap: 10px; font-size: 14px; line-height: 1.55; color: var(--brand-text-muted, #5f6d66); }
        .legal-content p { margin: 0; }
      `}</style>
    </div>
  );
}
