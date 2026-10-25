/**
 * Normalización y validación centralizada de números telefónicos.
 * Soporta formato canónico E.164 para Argentina y números internacionales válidos.
 */

export type PhoneNormalizationResult = {
  valid: boolean;
  e164?: string;
  formatted?: string;
  countryCode?: string;
  nationalNumber?: string;
  error?: string;
};

// Códigos de área principales de Argentina para desambiguación de prefijo 15
// 2 dígitos: 11 (AMBA)
// 3 dígitos: 220, 221, 223, 261, 264, 341, 342, 343, 351, 379 (Corrientes), 362 (Resistencia), etc.
// 4 dígitos: la mayoría del interior.
const KNOWN_ARG_AREA_CODES_3 = [
  '220', '221', '223', '230', '237', '249', '260', '261', '263', '264',
  '266', '280', '291', '294', '297', '299', '336', '341', '342', '343',
  '345', '348', '351', '353', '358', '362', '364', '370', '376', '379',
  '381', '383', '385', '387', '388',
];

/**
 * Normaliza un número telefónico a formato canónico E.164.
 * Para Argentina: +549[código_área][número_local] (10 dígitos nacionales significativos).
 */
export function normalizePhone(rawInput: string | null | undefined): PhoneNormalizationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return { valid: false, error: 'Ingresá tu número de celular.' };
  }

  const trimmed = rawInput.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Ingresá tu número de celular.' };
  }

  // Detectar si el usuario ingresó explícitamente un prefijo internacional con '+'
  const hasPlus = trimmed.startsWith('+');

  // Conservar solo dígitos
  let digits = trimmed.replace(/\D/g, '');

  if (digits.length === 0) {
    return { valid: false, error: 'El número no contiene dígitos válidos.' };
  }

  // Rechazar secuencias repetitivas absurdas (ej. 00000000, 11111111)
  if (/^(\d)\1{6,}$/.test(digits)) {
    return { valid: false, error: 'El número de celular ingresado no es válido.' };
  }

  // Si tiene prefijo internacional que NO es +54 (Argentina):
  if (hasPlus && !digits.startsWith('54')) {
    // Debe cumplir estándar ITU-T E.164: entre 8 y 15 dígitos
    if (digits.length < 8 || digits.length > 15) {
      return { valid: false, error: 'El número internacional debe tener entre 8 y 15 dígitos.' };
    }
    const e164 = `+${digits}`;
    return {
      valid: true,
      e164,
      formatted: e164,
      countryCode: `+${digits.slice(0, 3)}`,
      nationalNumber: digits.slice(3),
    };
  }

  // Caso Argentina (con o sin +54)
  // Remover prefijo internacional si vino incluido
  if (digits.startsWith('54')) {
    digits = digits.slice(2);
  }

  // Si después del 54 venía un 9 (indicador móvil internacional de Argentina):
  if (digits.startsWith('9')) {
    digits = digits.slice(1);
  }

  // Si empieza con 0 (prefijo interurbano nacional): remover
  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }

  // Ahora debemos tener los dígitos nacionales argentinos (área + suscriptor)
  // Puede incluir el prefijo '15' (móvil local) en varias posiciones:
  // Caso 1: 15 al inicio si el usuario ingresó solo el suscriptor sin código de área (inválido porque falta área)
  if (digits.startsWith('15')) {
    // Si la longitud total es 10 (ej: 15 4123 4567), falta el código de área!
    if (digits.length === 10) {
      return { valid: false, error: 'Incluí el código de área sin el 0 (ej. 11 para Buenos Aires, 379 para Corrientes).' };
    }
  }

  // Buscar y remover '15' después del código de área si la longitud total con 15 es 12 dígitos:
  // Ej: 11 15 4123 4567 (2 + 2 + 8 = 12 dígitos)
  // Ej: 379 15 412 3456 (3 + 2 + 7 = 12 dígitos)
  // Ej: 2944 15 12 3456 (4 + 2 + 6 = 12 dígitos)
  if (digits.length === 12) {
    if (digits.startsWith('11') && digits.slice(2, 4) === '15') {
      digits = digits.slice(0, 2) + digits.slice(4);
    } else if (KNOWN_ARG_AREA_CODES_3.some((code) => digits.startsWith(code)) && digits.slice(3, 5) === '15') {
      digits = digits.slice(0, 3) + digits.slice(5);
    } else {
      // Probar si a 4 dígitos hay un '15'
      const area4 = digits.slice(0, 4);
      if (digits.slice(4, 6) === '15') {
        digits = area4 + digits.slice(6);
      }
    }
  } else if (digits.length === 11 && digits.startsWith('15')) {
    // Caso 15 + 9 dígitos -> ambiguo / inválido
    return { valid: false, error: 'Incluí el código de área de tu ciudad (ej. 11, 379).' };
  }

  // En Argentina, un número nacional completo (área + abonado) tiene exactamente 10 dígitos:
  // Ej: 11 4123 4567 (10 dígitos)
  // Ej: 379 412 3456 (10 dígitos)
  // Ej: 351 123 4567 (10 dígitos)
  if (digits.length < 10) {
    return {
      valid: false,
      error: 'El número es demasiado corto. Ingresá el código de área y tu celular (ej. 11 2345 6789 o 379 412 3456).',
    };
  }

  if (digits.length > 10) {
    // Si aún tiene más de 10 dígitos y no pudimos extraer el 15:
    return {
      valid: false,
      error: 'El número tiene demasiados dígitos. Verificá que no sobre ningún número.',
    };
  }

  // Verificar que el código de área sea coherente (debe empezar con 1, 2, 3)
  if (!/^[1-3]\d{9}$/.test(digits)) {
    return {
      valid: false,
      error: 'El código de área ingresado no es válido para Argentina.',
    };
  }

  // Formato canónico E.164: +549 + 10 dígitos nacionales
  const e164 = `+549${digits}`;
  const formatted = formatArgPhone(digits);

  return {
    valid: true,
    e164,
    formatted,
    countryCode: '+54',
    nationalNumber: digits,
  };
}

function formatArgPhone(digits10: string): string {
  if (digits10.startsWith('11')) {
    return `+54 9 11 ${digits10.slice(2, 6)}-${digits10.slice(6)}`;
  }
  const area3 = digits10.slice(0, 3);
  if (KNOWN_ARG_AREA_CODES_3.includes(area3)) {
    return `+54 9 ${area3} ${digits10.slice(3, 6)}-${digits10.slice(6)}`;
  }
  const area4 = digits10.slice(0, 4);
  return `+54 9 ${area4} ${digits10.slice(4, 7)}-${digits10.slice(7)}`;
}

/**
 * Enmascara un número de teléfono para logs, vistas y paneles sin exponer datos sensibles.
 * Ej: +5491141234567 -> "+54 9 11 •••• 4567"
 * Ej: +5493794123456 -> "+54 9 379 ••• 3456"
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '—';
  const clean = phone.trim();
  if (clean.length < 8) return '••••';
  const last4 = clean.slice(-4);
  const prefix = clean.startsWith('+') ? clean.slice(0, 6) : clean.slice(0, 4);
  return `${prefix} •••• ${last4}`;
}
