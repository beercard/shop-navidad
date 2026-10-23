# Arquitectura e implementación actual

Auditoría e implementación incremental: 23-10-2026. La base de datos PostgreSQL local no estuvo disponible durante esta iteración; migraciones validadas contra Prisma, pero no aplicadas. No se crearon campañas/premios reales ni se alteró producción.

## Aplicación

- Next.js App Router, TypeScript y Prisma 6.19; PostgreSQL es la fuente persistente. Las experiencias `/centenario` y `/uniplaza` comparten componentes con temas separados.
- APIs públicas, admin y comercio se ejecutan en servidor. El Service Worker solo conserva recursos estáticos y fallback offline; excluye APIs, admin, QA y rutas de participación.
- Los JWT de sesión admin viven en cookie HttpOnly, SameSite=Lax y Secure en producción; contraseñas con bcrypt. `SUPERADMIN` puede administrar ambos shoppings; `SHOPPING_OPERATOR` debe estar asociado al shopping solicitado; las rutas de gestión de usuarios y asociación de validadores están restringidas a superadmin.

## Datos y aislamiento

- `Shopping` es tenant padre para `Campaign`, `Prize`, `Card`, `Participant`, `Participation`, `RedeemCode`, `Event`, `Location`, `Merchant`, inventario y auditoría.
- `Location` identifica carteles NFC/QR mediante `/nfc/[shoppingSlug]/[locationSlug]`. La ruta resuelve únicamente ubicaciones activas del shopping activo, registra `LANDING_VISIT` deduplicado por cookie opaca/ventana de 30 minutos y redirige a la experiencia pública con el contexto de campaña/ubicación. El enlace no autentica ni autoriza.
- `Merchant`, `MerchantUser` y `PrizeMerchant` asignan validadores y premios a comercios propios de un shopping. El portal `/merchant` consulta el código antes de permitir una confirmación explícita. Historial y canje están acotados al comercio autorizado.
- `OtpChallenge` prepara almacenamiento de desafíos y consentimiento, pero no hay proveedor SMS/WhatsApp, flujo OTP ni verificación telefónica implementados. No se simula ni se marca un número como verificado.
- La migración `20261023120000_locations_merchants_otp` agrega ubicaciones, comercios, asignación de premios/validadores, relación opcional de tarjeta a ubicación, evento de visita y comercio que consumió el canje. Aún requiere aplicación contra una base aislada y prueba de migración real.

## Juego, stock y canjes

`POST /api/participations` valida campaña, tarjeta y shopping en servidor. La asignación aleatoria ocurre en backend en transacción serializable; el decremento condicional `remainingStock > 0`, la participación, la colección, el código y los eventos se confirman o revierten juntos. Las claves idempotentes y restricciones únicas impiden duplicar el mismo avance.

Los códigos se generan con aleatoriedad criptográfica; se almacenan con hash y ciphertext AES-GCM para recuperar la respuesta idempotente. `CODE_ENCRYPTION_KEY` debe contener 32 bytes Base64. La ruta comercial `/api/merchant/coupons/lookup` es de solo lectura. `/api/merchant/coupons/redeem` revalida vigencia, campaña, shopping, asociación del premio y estado dentro de una transacción serializable; el estado condicional solo permite un canje. La API administrativa de validación está reservada a superadmin/operadores de shopping y no habilita a validadores comerciales.

Las visitas se cuentan como `LANDING_VISIT`, distintas de participantes y participaciones. Informes administrativos incluyen el total de visitas y desglose por ubicación, además de eventos, tarjetas, premios y canjes por el shopping consultado.

## Roles y administración

- `/admin`: campañas, premios/stock, tarjetas, ubicaciones, comercios, participantes, informes, auditoría y usuarios.
- La administración de usuarios/roles y la asignación de validadores pertenece al superadmin. Operadores de shopping pueden gestionar sus ubicaciones, comercios, premios y demás recursos dentro del shopping autorizado.
- Cada API comprueba el rol y el shopping en servidor. Las operaciones críticas generan auditoría; creación/edición de ubicaciones, comercios, premios y stock se valida contra el tenant.
- La pestaña de ubicaciones crea enlaces `/nfc/[shopping]/[location]`; al registrar tarjetas se puede asociar una ubicación administrable y las referencias históricas `Card.location` se mantienen por compatibilidad.

## Configuración y operación

Las variables y ejemplos no secretos están en `.env.example`. Para local se necesita `DATABASE_URL`, `AUTH_SECRET` (32+ caracteres), `CODE_ENCRYPTION_KEY` (32 bytes Base64) y `APP_BASE_URL` para imprimir enlaces absolutos. Las pruebas QA requieren `QA_MODE=true`, una base separada `QA_DATABASE_URL` con nombre que contenga `qa` o `test`, y credenciales QA. No usar valores de ejemplo fuera de local.

Migraciones:

```powershell
npm run db:generate
npm run db:migrate:dev
npm run db:seed
```

En QA aislado, configurar variables en `.env.local` y ejecutar `npm run qa:setup`; cada migración posterior se aplica con `npm run qa:migrate`. Producción se mantiene fuera de esta tarea.

## Pendiente antes de producción

- Elegir e integrar proveedor real de OTP/SMS/WhatsApp, límites por teléfono, consentimiento legal y política de retención.
- Aplicar y probar las migraciones en PostgreSQL QA; las APIs de base y pruebas de integración no se pudieron ejecutar en la instancia local actual.
- La migración `20261023143000_tenant_composite_constraints` agrega claves foráneas compuestas para que participaciones, tarjetas, premios, canjes y movimientos de stock no puedan asociarse a campañas/shoppings distintos ni siquiera mediante una escritura SQL directa. Las relaciones auxiliares de colección, pistas, ubicaciones y comercios todavía dependen también de sus validaciones de servidor y quedan para una migración posterior. Esta migración no elimina ni modifica filas; una inconsistencia previa hará que falle al añadir una FK y deberá corregirse explícitamente antes de reintentar.
- Definir retención/limpieza de `Event`, `OtpChallenge` y `RateLimitBucket`, backups y restauración.
- Los roles de operador de shopping y de comercio requieren usuarios bootstrap creados por superadmin; no crear credenciales/campañas reales automáticamente.
