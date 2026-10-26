# Navidad Mágica — Centenario Shopping + UniPlaza Shopping

Plataforma de campaña compartida para experiencias NFC/QR, colección de tarjetas, premios y canjes. Centenario y UniPlaza comparten componentes y lógica, y conservan temas visuales independientes.

## Requisitos

- Node.js 20.9 o superior
- npm
- PostgreSQL 14 o superior

## Configuración local

```bash
npm install
Copy-Item .env.example .env.local
Copy-Item .env.example .env
```

Completá ambos archivos con una base PostgreSQL y secretos propios; Next.js lee `.env.local`, mientras Prisma CLI necesita `.env`. Los scripts QA leen la configuración de Next.js; el bootstrap normal `scripts/bootstrap.mjs` se ejecuta con las variables presentes en el entorno del proceso. Generá `AUTH_SECRET` y `CODE_ENCRYPTION_KEY` con 32 bytes aleatorios codificados en Base64; por ejemplo `openssl rand -base64 32`. Nunca uses los valores de ejemplo en un entorno compartido.

`DATABASE_URL` debe apuntar a una base PostgreSQL vacía o de desarrollo. Con PostgreSQL instalado localmente, creá las dos bases desde PowerShell:

```powershell
createdb -U postgres navidad_magica
createdb -U postgres navidad_magica_qa
```

Si `createdb` no está en `PATH`, ejecutalo desde la carpeta `bin` de PostgreSQL o usá `psql` (`CREATE DATABASE navidad_magica;` y `CREATE DATABASE navidad_magica_qa;`). Configurá las URLs de acuerdo con tu usuario, contraseña, host y puerto locales. La aplicación no instala ni inicia el servidor PostgreSQL.

```bash
npm run db:generate
npm run db:migrate:dev
npm run db:seed
npm run dev
```

Para crear el primer administrador, ejecutá `npm run db:seed` con `DATABASE_URL`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` (mínimo 12 caracteres) exportadas en el entorno de PowerShell. El script crea los dos shoppings y el administrador general con contraseña bcrypt; las credenciales permanecen fuera del repositorio. Luego limpiá del entorno esas variables. El seed no carga automáticamente `.env.local`.

Abrí http://localhost:3000. La portada `/` deriva a la experiencia correcta. `/centenario` y `/uniplaza` tienen contexto independiente; las tarjetas apuntan a `/centenario/participar/[cardId]` o `/uniplaza/participar/[cardId]`. También podés imprimir ubicaciones como `/nfc/[shopping]/[slug]`, que abren el shopping y la campaña asociada. El enlace anterior `/participar/[cardId]` sigue disponible por compatibilidad. El panel protegido está en `/admin`; el portal de cupones para usuarios con rol comercial está en `/merchant`.

## Migraciones y despliegue

- `npm run db:migrate:dev` crea/aplica migraciones en desarrollo y puede solicitar una base local.
- `npm run db:migrate:deploy` aplica las migraciones versionadas a la base configurada, sin crear migraciones.
- `npm run db:generate` regenera el cliente Prisma después de cambiar el esquema.
- `npm run db:seed` inicializa los dos shoppings y, si recibe las variables opcionales, el primer administrador.

Las migraciones versionadas instalan el esquema inicial, el ownership obligatorio por shopping, metadatos de premios demo, los modelos de ubicación/comercio/OTP (`20261023120000_locations_merchants_otp`), restricciones relacionales compuestas de tenant (`20261023143000_tenant_composite_constraints`) y revocación de sesiones administrativas (`20261023220000_merchant_account_sessions`). La migración de tenant inicial aborta si encuentra campañas enlazadas a más de un shopping o sin shopping; la migración compuesta falla de forma segura si hay referencias históricas cruzadas que violan la pertenencia. Aplicá desarrollo con `npm run db:migrate:dev`; para QA usá `npm run qa:setup` (primera vez) y `npm run qa:migrate` (posteriores).

## Centro de pruebas QA

`/qa` es una herramienta interna, no indexable y deshabilitada por defecto. Solo se habilita fuera de producción (`NODE_ENV` distinto de `production`) con `QA_MODE=true`, acceso de superadministrador y una `QA_DATABASE_URL` PostgreSQL cuyo nombre incluya un segmento `qa` o `test`, distinta de `DATABASE_URL`. Con QA activo, el cliente Prisma de la aplicación apunta íntegramente a esa base; fixtures y escenarios no se ejecutan en la base normal. Usá una instancia/usuario PostgreSQL de pruebas con permisos limitados.

1. Creá una base vacía separada, por ejemplo `navidad_magica_qa`, y configurá `QA_DATABASE_URL` y `DATABASE_URL` en `.env.local` (la base principal solo se usa para comprobar que el destino es distinto).
2. Configurá secretos locales, `QA_MODE=true`, `QA_ADMIN_EMAIL` y `QA_ADMIN_PASSWORD` (mínimo 12 caracteres).
3. Ejecutá `npm run qa:setup`; los scripts leen `.env.local`, vuelven a validar el destino y solo migran `QA_DATABASE_URL`, luego crean el superadministrador allí.
4. Iniciá la aplicación localmente y abrí `/qa`. Usá “Restablecer datos de prueba” para cargar fixtures aislados; los escenarios invocan los servicios reales y sus resultados quedan auditados en la base QA.

### Datos demo, QR y NFC

`npm run seed:demo` crea o actualiza, de manera idempotente, dos campañas aisladas (`Navidad Demo — Centenario` y `Navidad Demo — UniPlaza`), cinco premios de muestra y diez tarjetas por shopping, además de pistas. Los premios y sus ilustraciones se identifican como **DEMO — SIN VALOR COMERCIAL**. El seed exige `QA_MODE=true`, una `QA_DATABASE_URL` PostgreSQL distinta cuyo nombre incluya `qa` o `test`, y rechaza producción. No elimina filas ni modifica campañas que no tengan los slugs reservados `navidad-demo-centenario` y `navidad-demo-uniplaza`; conserva stock ya consumido. El botón protegido en `/qa` ejecuta el mismo seed con sesión de superadministrador.

Configurá `APP_BASE_URL` con el origen exacto que usarán el navegador y el celular. Para una computadora conectada a la misma Wi-Fi, usá su IP privada, por ejemplo `http://192.168.1.20:3000`; `localhost` no sirve para escanear desde otro dispositivo. Para Web NFC remoto hace falta HTTPS y un navegador/dispositivo compatible. La página QA genera QR como PNG y SVG, permite imprimir la hoja, copiar enlaces NDEF y, cuando el navegador lo admite, grabar/verificar la etiqueta. Como alternativa, copiá el enlace visible y escribilo como registro URL con una app NFC externa. La lectura de la etiqueta abre la misma ruta pública y validación de tarjeta que el QR.

Iniciá el servidor visible en la red local con `npm run dev -- --hostname 0.0.0.0`; permití el acceso a Node/puerto 3000 en el firewall de Windows si el celular no llega. En el teléfono, abrí `http://<IP-LAN-DE-LA-PC>:3000/qa`, iniciá sesión con la cuenta QA y descargá/imprimí los QR. Probá directamente, por ejemplo, `/centenario/participar/CEN-DEMO-001` y `/uniplaza/participar/UNI-DEMO-001`. La base PostgreSQL QA escucha localmente y no se expone a la red; solo la aplicación web atiende la LAN. No publiques la URL HTTP de desarrollo fuera de la red local.

No uses datos personales ni credenciales productivas en QA. No configures `QA_MODE=true` en producción: la aplicación lo rechaza. Si no hay una base QA configurada, `/qa` y sus APIs responden como no encontradas y no ofrecen simulaciones. El simulador incrustado usa la experiencia pública real de la aplicación en el mismo modo QA.

## Notificaciones push

Los avisos son opcionales: la persona los activa desde **Mi progreso → Avisos** después de jugar su primera posta. Se envían dos tipos: cupón que vence en las próximas 24 horas y pista nueva publicada en las últimas 24 horas (solo a quien todavía no encontró esa posta). Cada aviso se registra en `events` con un `dedupeKey`, así nunca se envía dos veces.

1. Generá claves propias con `npx web-push generate-vapid-keys` y configurá `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VAPID_SUBJECT` (un `mailto:` o `https:` de contacto del responsable). Sin claves, la función queda oculta.
2. Configurá `CRON_SECRET` con 32 caracteres aleatorios o más.
3. Programá una llamada cada hora a `GET /api/push/reminders` con la cabecera `Authorization: Bearer <CRON_SECRET>` (por ejemplo, desde el cron de la plataforma de despliegue).

En iPhone, los avisos solo funcionan con la app instalada en la pantalla de inicio (iOS 16.4 o posterior). El service worker solo se registra en producción, así que en `npm run dev` la tarjeta de avisos aparece pero no puede completar la suscripción.

## Seguridad y operación

- Las contraseñas se guardan con bcrypt. Las sesiones administrativas usan JWT HS256 firmado en una cookie `HttpOnly`, `SameSite=Lax`, con vencimiento de ocho horas y `Secure` en producción.
- El servidor verifica rol y alcance por shopping en cada endpoint administrativo.
- La asignación de premio, reserva de stock, registro de participación, progreso y emisión del código ocurren en una transacción PostgreSQL serializable.
- Los códigos se generan con aleatoriedad criptográfica, se almacenan con hash SHA-256 y copia cifrada AES-256-GCM para reintentos idempotentes. Configurá `CODE_ENCRYPTION_KEY` y guardá una copia segura: perderla impide recuperar códigos emitidos aún no canjeados.
- `x-real-ip` o el primer `x-forwarded-for` alimenta un límite de intentos respaldado por PostgreSQL. En producción, el proxy debe sobrescribir esos encabezados; agregá rate limiting en el borde/CDN para cubrir tráfico automatizado.
- No se solicita información personal para jugar. El avance anónimo se vincula a una cookie opaca y aleatoria; su hash se guarda en la base y la cookie es HttpOnly.
- Los canjes se marcan una sola vez de forma atómica, validando expiración y shopping. Cada movimiento administrativo relevante se registra en auditoría.

### Alcance funcional pendiente

- La ruta NFC/QR registra `LANDING_VISIT` con deduplicación por cookie opaca en ventanas de 30 minutos; no equivale a visitantes únicos verificados y una persona puede borrar su cookie.
- Comercios, relación usuario-comercio, asignación de premios y portal de consulta/canje están implementados. Las cuentas validadoras tienen un único comercio y shopping; la cuenta compartida identifica el turno/equipo, no a cada empleado individual. El superadministrador puede suspender acceso y generar una contraseña temporal; el operador puede cambiar su contraseña. No hay proveedor de correo configurado para recuperación automática. Ver [operación del portal de comercios](docs/merchant-portal.md).
- **Decisión de producto (24-10-2026): no se verifica el teléfono por SMS/WhatsApp**, porque era una fricción para participar. La participación es anónima por cookie de dispositivo (180 días): una persona puede participar de nuevo si borra cookies o usa otro dispositivo. Los límites reales son el stock, un cupón por tarjeta y participante, y el límite de intentos por IP.
- Las rutas y operaciones validan tenant en servidor. Aún falta añadir restricciones compuestas en base de datos para impedir relaciones con shopping discordante aunque una futura ruta interna omita validación.
- El lector QR necesita una prueba física adicional en teléfono por HTTPS; la prueba QA automatizada cubre la alternativa cuando no hay cámara disponible.

## Datos iniciales de campaña

El bootstrap no crea campañas, tarjetas ni premios inventados. Con una sesión de administrador, registrá la campaña y luego cargá tarjetas, premios, ventanas horarias, stock y pesos reales. Una campaña solo aparece en el sitio cuando está activa, vigente y asociada al shopping. Si la base o la campaña no están disponibles, la página informa que no pudo confirmarse la participación; no calcula premios en el navegador.

## Marca y diseño

Las decisiones, fuentes oficiales consultadas, limitaciones de assets y recursos pendientes están en [`docs/brand-guidelines.md`](docs/brand-guidelines.md). Los tokens reemplazables de campaña por shopping están en `src/lib/brand.ts`. No se encontraron logotipos oficiales en el repositorio ni se pudo confirmar un manual público; las aproximaciones están identificadas como tales.

## Comandos

- `npm run dev` — servidor local.
- `npm run lint` — ESLint.
- `npm test` — pruebas Playwright para los 10 anchos requeridos.
- `npm run build` — build de producción.
- `npm run start` — servidor de producción.
