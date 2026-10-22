# Arquitectura implementada

## Componentes

- Next.js App Router y TypeScript sirven la experiencia pública, el acceso administrativo y las rutas API.
- PostgreSQL es la única fuente de persistencia. Prisma define el esquema en `prisma/schema.prisma`; la migración inicial está en `prisma/migrations/20261022000000_init/`.
- Las sesiones administrativas son JWT HS256 en cookies HttpOnly, SameSite=Lax, Secure en producción y con vencimiento. Las contraseñas se verifican con bcrypt. Los roles son `SUPERADMIN`, `SHOPPING_OPERATOR` y `MERCHANT_VALIDATOR`; los operadores y comercios quedan limitados a los shoppings asignados.
- Los IDs de sesión de participantes se almacenan como hashes. La API pública no recibe ni muestra datos personales.

## Modelos

El esquema incluye shoppings, campañas con un único `shoppingId` obligatorio, usuarios y alcances, tarjetas, premios e inventario, participantes, participaciones, códigos de canje, pistas, progreso y tarjetas de colección, eventos analíticos, límites de solicitudes y auditoría. La restricción única sobre (participante, tarjeta, campaña) impide sumar una misma tarjeta más de una vez. La migración `20261022120000_campaign_tenant_scope` migra la relación anterior: se detiene sin modificar datos cuando detecta una campaña compartida o sin propietario, para que se resuelva explícitamente antes del despliegue.

## Asignación y canje

`POST /api/participations` valida entrada, campaña, tarjeta, sesión, límites y clave de idempotencia. La selección ponderada corre en el servidor. Prisma ejecuta la asignación en una transacción serializable y decrementa stock mediante una actualización condicional `remainingStock > 0`; la transacción revierte participación/código si no puede reservar stock. Los códigos tienen entropía aleatoria, se persisten como hash y como ciphertext AES-GCM para poder mostrarlos en el resultado original. Se requiere una `CODE_ENCRYPTION_KEY` base64 de 32 bytes.

El endpoint `/api/redeems/validate` exige rol y alcance de shopping; una actualización condicional de estado asegura que el código solo se canjee una vez. Los cambios administrativos en campañas, tarjetas, premios, usuarios, pistas y experiencia se validan en servidor y generan auditoría. Los ajustes de stock registran movimientos.

## APIs administrativas

- `/api/admin/summary`, `/campaigns`, `/prizes`, `/cards`, `/participants`, `/clues`, `/users`, `/settings`, `/inventory`, `/analytics`, `/reports` y `/audit` requieren sesión administrativa; los handlers aplican rol y ámbito de shopping.
- Los informes se generan desde agregados almacenados en PostgreSQL y se exportan como CSV.
- El bootstrap opcional de shoppings y superadministrador es `npm run db:seed`; no crea campañas, tarjetas ni premios ficticios.

## Configuración inicial

Copiar `.env.example` a `.env`, completar PostgreSQL, un secreto aleatorio `AUTH_SECRET` y una clave AES-GCM aleatoria de 32 bytes codificada en Base64. Después ejecutar `npm run db:generate`, `npm run db:migrate:deploy` y `npm run db:seed`. El entorno de esta auditoría no tiene PostgreSQL configurado: la migración fue generada y validada, pero no aplicada y no se hicieron pruebas integradas de base de datos.

## Límites y controles operativos

- El inventario y los resultados no tienen modo demo: sin base configurada, las APIs responden error y la UI no proclama premios ni canjes.
- El rate limiting persistente usa PostgreSQL. En una infraestructura serverless con alto volumen, revisar cuotas y partición/retención de `RateLimitBucket`.
- Los controles de datos personales son intencionalmente mínimos. Antes de solicitar contacto o marketing, implementar consentimiento, retención y política de privacidad aprobada.
- Configurar HTTPS, límites del proxy y protección de bot/WAF en producción. No registrar secretos ni códigos de canje en logs.
