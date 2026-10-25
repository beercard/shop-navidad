/**
 * Etiquetas legibles para la bitácora. Los códigos (`REDEEMED`, `MERCHANT_PRIZES_ASSIGNED`) son contratos
 * internos y no se modifican; esto solo cambia lo que ve la persona que administra.
 */
const actions: Record<string, string> = {
  ACCOUNT_PASSWORD_CHANGED: 'Cambio de contraseña',
  ADMIN_USER_ACTIVATED: 'Usuario activado',
  ADMIN_USER_CREATED: 'Usuario creado',
  ADMIN_USER_DEACTIVATED: 'Usuario suspendido',
  CAMPAIGN_CREATED: 'Campaña creada',
  CAMPAIGN_UPDATED: 'Campaña actualizada',
  CAMPAIGN_COMPLETION_RULES_UPDATED: 'Reglas de recompensa de recorrido actualizadas',
  CARD_CREATED: 'Tarjeta creada',
  CARD_UPDATED: 'Tarjeta actualizada',
  CLUE_CREATED: 'Pista creada',
  CLUE_UPDATED: 'Pista actualizada',
  DEMO_SEED_TRIGGERED: 'Datos demo cargados',
  LOCATION_ACTIVATED: 'Ubicación activada',
  LOCATION_CREATED: 'Ubicación creada',
  LOCATION_DEACTIVATED: 'Ubicación desactivada',
  LOCATION_UPDATED: 'Ubicación actualizada',
  MERCHANT_ACTIVATED: 'Comercio activado',
  MERCHANT_CREATED: 'Comercio creado',
  MERCHANT_DEACTIVATED: 'Comercio desactivado',
  MERCHANT_PASSWORD_RESET: 'Acceso de comercio restablecido',
  MERCHANT_PRIZES_ASSIGNED: 'Premios asignados a un comercio',
  MERCHANT_UPDATED: 'Comercio actualizado',
  MERCHANT_USERS_ASSIGNED: 'Cuentas asignadas a un comercio',
  PRIZE_CREATED: 'Premio creado',
  PRIZE_UPDATED: 'Premio actualizado',
  PRIZE_UPDATED_STOCK: 'Stock de premio modificado',
  PUBLIC_EXPERIENCE_SETTINGS_UPDATED: 'Experiencia pública actualizada',
  QA_DATA_RESET: 'Datos de prueba reiniciados',
  QA_SCENARIO: 'Escenario de prueba ejecutado',
  QA_SERVER_ERROR_PROBE: 'Prueba de error del servidor',
  REDEEMED: 'Cupón canjeado',
};

const entities: Record<string, string> = {
  AdminUser: 'Usuario',
  Campaign: 'Campaña',
  Card: 'Tarjeta',
  Clue: 'Pista',
  DemoSeed: 'Datos demo',
  Location: 'Ubicación',
  Merchant: 'Comercio',
  Prize: 'Premio',
  QaRun: 'Prueba',
  RedeemCode: 'Cupón',
  Shopping: 'Shopping',
};

/** Etiqueta en español; si aparece una acción nueva, se muestra en minúsculas legibles en lugar del código crudo. */
export function auditActionLabel(action: string) {
  return actions[action] ?? (action.charAt(0) + action.slice(1).toLowerCase()).replaceAll('_', ' ');
}

export function auditEntityLabel(entityType: string) {
  return entities[entityType] ?? entityType;
}

/** Estado de campaña en español para el panel. */
export function campaignStatusLabel(status: string) {
  return ({ DRAFT: 'Borrador', SCHEDULED: 'Programada', ACTIVE: 'Activa', PAUSED: 'Pausada', ENDED: 'Finalizada' } as Record<string, string>)[status] ?? status;
}
