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
```

Completá `.env.local` con una base PostgreSQL y secretos propios. Generá `AUTH_SECRET` y `CODE_ENCRYPTION_KEY` con 32 bytes aleatorios cada uno, codificados en Base64; por ejemplo `openssl rand -base64 32`. Nunca uses los valores de ejemplo en un entorno compartido.

```bash
npm run db:generate
npm run db:migrate:dev
npm run db:seed
npm run dev
```

Para el primer administrador, agregá temporalmente `ADMIN_EMAIL` y `ADMIN_PASSWORD` (mínimo 12 caracteres) en `.env.local` antes de ejecutar `npm run db:seed`. El script crea los dos shoppings y el administrador general con contraseña bcrypt; las credenciales permanecen fuera del repositorio. Después de crear la cuenta, quitá esas variables.

Abrí http://localhost:3000. La portada `/` solo deriva a la experiencia correcta. `/centenario` y `/uniplaza` tienen contexto independiente; las tarjetas apuntan a `/centenario/participar/[cardId]` o `/uniplaza/participar/[cardId]`. El enlace anterior `/participar/[cardId]` sigue disponible por compatibilidad. El panel protegido está en `/admin`.

## Migraciones y despliegue

- `npm run db:migrate:dev` crea/aplica migraciones en desarrollo y puede solicitar una base local.
- `npm run db:migrate:deploy` aplica las migraciones versionadas a la base configurada, sin crear migraciones.
- `npm run db:generate` regenera el cliente Prisma después de cambiar el esquema.
- `npm run db:seed` inicializa los dos shoppings y, si recibe las variables opcionales, el primer administrador.

Las migraciones versionadas instalan el esquema inicial, el ownership obligatorio por shopping y los metadatos de premios demo (`prisma/migrations/20261022130000_prize_demo_details/migration.sql`). La migración de tenant aborta con un mensaje explícito si encuentra campañas enlazadas a más de un shopping o sin shopping. Aplicá el entorno de desarrollo con `npm run db:migrate:dev`; para QA usá `npm run qa:setup` (primera vez) y `npm run qa:migrate` (cambios posteriores).

## Centro de pruebas QA

`/qa` es una herramienta interna, no indexable y deshabilitada por defecto. Solo se habilita fuera de producción (`NODE_ENV` distinto de `production`) con `QA_MODE=true`, acceso de superadministrador y una `QA_DATABASE_URL` PostgreSQL cuyo nombre incluya un segmento `qa` o `test`, distinta de `DATABASE_URL`. Con QA activo, el cliente Prisma de la aplicación apunta íntegramente a esa base; fixtures y escenarios no se ejecutan en la base normal. Usá una instancia/usuario PostgreSQL de pruebas con permisos limitados.

1. Creá una base vacía separada, por ejemplo `navidad_magica_qa`, y configurá `QA_DATABASE_URL` y `DATABASE_URL` en `.env.local` (la base principal solo se usa para comprobar que el destino es distinto).
2. Configurá secretos locales, `QA_MODE=true`, `QA_ADMIN_EMAIL` y `QA_ADMIN_PASSWORD` (mínimo 12 caracteres).
3. Ejecutá `npm run qa:setup`; los scripts leen `.env.local`, vuelven a validar el destino y solo migran `QA_DATABASE_URL`, luego crean el superadministrador allí.
5. Iniciá la aplicación localmente y abrí `/qa`. Usá “Restablecer datos de prueba” para cargar fixtures aislados; los escenarios invocan los servicios reales y sus resultados quedan auditados en la base QA.

### Datos demo, QR y NFC

`npm run seed:demo` crea o actualiza, de manera idempotente, dos campañas aisladas (`Navidad Demo — Centenario` y `Navidad Demo — UniPlaza`), cinco premios de muestra y diez tarjetas por shopping, además de pistas. Los premios y sus ilustraciones se identifican como **DEMO — SIN VALOR COMERCIAL**. El seed exige `QA_MODE=true`, una `QA_DATABASE_URL` PostgreSQL distinta cuyo nombre incluya `qa` o `test`, y rechaza producción. No elimina filas ni modifica campañas que no tengan los slugs reservados `navidad-demo-centenario` y `navidad-demo-uniplaza`; conserva stock ya consumido. El botón protegido en `/qa` ejecuta el mismo seed con sesión de superadministrador.

Configurá `APP_BASE_URL` con el origen exacto que usarán el navegador y el celular. Para una computadora conectada a la misma Wi-Fi, usá su IP privada, por ejemplo `http://192.168.1.20:3000`; `localhost` no sirve para escanear desde otro dispositivo. Para Web NFC remoto hace falta HTTPS y un navegador/dispositivo compatible. La página QA genera QR como PNG y SVG, permite imprimir la hoja, copiar enlaces NDEF y, cuando el navegador lo admite, grabar/verificar la etiqueta. Como alternativa, copiá el enlace visible y escribilo como registro URL con una app NFC externa. La lectura de la etiqueta abre la misma ruta pública y validación de tarjeta que el QR.

Iniciá el servidor visible en la red local con `npm run dev -- --hostname 0.0.0.0`; permití el acceso a Node/puerto 3000 en el firewall de Windows si el celular no llega. En el teléfono, abrí `http://<IP-LAN-DE-LA-PC>:3000/qa`, iniciá sesión con la cuenta QA y descargá/imprimí los QR. Probá directamente, por ejemplo, `/centenario/participar/CEN-DEMO-001` y `/uniplaza/participar/UNI-DEMO-001`. La base PostgreSQL QA escucha localmente y no se expone a la red; solo la aplicación web atiende la LAN. No publiques la URL HTTP de desarrollo fuera de la red local.

No uses datos personales ni credenciales productivas en QA. No configures `QA_MODE=true` en producción: la aplicación lo rechaza. Si no hay una base QA configurada, `/qa` y sus APIs responden como no encontradas y no ofrecen simulaciones. El simulador incrustado usa la experiencia pública real de la aplicación en el mismo modo QA.

## Seguridad y operación

- Las contraseñas se guardan con bcrypt. Las sesiones administrativas usan JWT HS256 firmado en una cookie `HttpOnly`, `SameSite=Lax`, con vencimiento de ocho horas y `Secure` en producción.
- El servidor verifica rol y alcance por shopping en cada endpoint administrativo.
- La asignación de premio, reserva de stock, registro de participación, progreso y emisión del código ocurren en una transacción PostgreSQL serializable.
- Los códigos se generan con aleatoriedad criptográfica, se almacenan con hash SHA-256 y copia cifrada AES-256-GCM para reintentos idempotentes. Configurá `CODE_ENCRYPTION_KEY` y guardá una copia segura: perderla impide recuperar códigos emitidos aún no canjeados.
- `x-real-ip` o el primer `x-forwarded-for` alimenta un límite de intentos respaldado por PostgreSQL. En producción, el proxy debe sobrescribir esos encabezados; agregá rate limiting en el borde/CDN para cubrir tráfico automatizado.
- No se solicita información personal para jugar. El avance anónimo se vincula a una cookie opaca y aleatoria; su hash se guarda en la base y la cookie es HttpOnly.
- Los canjes se marcan una sola vez de forma atómica, validando expiración y shopping. Cada movimiento administrativo relevante se registra en auditoría.

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
