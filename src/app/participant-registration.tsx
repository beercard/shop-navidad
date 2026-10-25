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
          <span className="registration-pill">Temporada Navideña</span>
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
        .registration-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 16, 26, 0.88);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          overflow-y: auto;
        }

        .close-modal-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #9ca3af;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .close-modal-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.2);
        }
        .registration-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 28px 24px;
          color: #f9fafb;
          box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: popIn 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .registration-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }

        .registration-logo {
          max-height: 48px;
          width: auto;
          object-fit: contain;
        }

        .registration-wordmark {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f3f4f6;
        }

        .registration-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: 9999px;
          background: rgba(220, 38, 38, 0.15);
          color: #f87171;
          border: 1px solid rgba(220, 38, 38, 0.3);
        }

        .registration-title {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.25;
          margin: 0;
          color: #ffffff;
        }

        .registration-subtitle {
          font-size: 13.5px;
          line-height: 1.45;
          color: #9ca3af;
          margin: 0;
          max-width: 360px;
        }

        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #d1d5db;
        }

        .phone-input-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          background: rgba(17, 24, 39, 0.8);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .phone-input-wrap:focus-within {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
        }

        .phone-prefix {
          padding: 0 12px;
          font-size: 14px;
          font-weight: 700;
          color: #9ca3af;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          height: 48px;
          display: flex;
          align-items: center;
        }

        .form-input {
          flex: 1;
          height: 48px;
          padding: 0 14px;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          outline: none;
        }

        .form-input::placeholder {
          color: #6b7280;
          font-size: 13.5px;
        }

        .form-help {
          font-size: 11.5px;
          color: #9ca3af;
          line-height: 1.35;
        }

        .recovery-group .form-input {
          border: 1.5px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          background: rgba(17, 24, 39, 0.8);
          letter-spacing: 0.05em;
          font-family: monospace;
          font-size: 16px;
        }

        .have-code-link-wrap {
          text-align: right;
          margin-top: -6px;
        }

        .text-toggle-btn {
          background: none;
          border: none;
          color: #38bdf8;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .form-checkbox-group {
          margin-top: 4px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 12.5px;
          line-height: 1.45;
          color: #d1d5db;
          cursor: pointer;
        }

        .checkbox-input {
          margin-top: 2px;
          width: 17px;
          height: 17px;
          accent-color: #ef4444;
          cursor: pointer;
          flex-shrink: 0;
        }

        .link-inline {
          background: none;
          border: none;
          color: #38bdf8;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
        }

        .registration-error {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          font-size: 12.5px;
          line-height: 1.4;
        }

        .registration-submit-btn {
          height: 50px;
          border-radius: 14px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
          transition: transform 0.15s, opacity 0.15s;
        }

        .registration-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .registration-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .registration-secondary-btn {
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          padding: 0 16px;
        }

        .full-w {
          width: 100%;
        }

        /* Success / Recovery Card */
        .registration-success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          padding: 12px 0;
        }

        .recovery-badge {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .recovery-code-display {
          font-family: monospace;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #34d399;
          background: rgba(0, 0, 0, 0.35);
          padding: 12px 20px;
          border-radius: 14px;
          border: 1.5px dashed rgba(52, 211, 153, 0.4);
          user-select: all;
        }

        .recovery-hint {
          font-size: 12.5px;
          line-height: 1.45;
          color: #9ca3af;
          margin: 0;
        }

        .recovery-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          margin-top: 8px;
        }

        /* Legal Modals */
        .legal-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .legal-modal-card {
          background: #1f2937;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 24px;
          max-width: 480px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .legal-modal-card h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
        }

        .legal-content {
          font-size: 13px;
          line-height: 1.5;
          color: #d1d5db;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .legal-content p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
