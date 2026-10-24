# Guía de preview y prueba en teléfono

Preparada el 24-10-2026. **No se publicó nada**: este documento es el procedimiento para hacerlo cuando lo autorices.

## 1. Requisito previo que hoy no se cumple

El preview necesita **una base PostgreSQL accesible desde internet**. La base de pruebas actual vive en esta computadora (`127.0.0.1:5433`) y un deploy en la nube no puede llegar a ella. Sin base, el preview carga pero no hay campañas, login ni canjes. Opciones habituales: Neon, Supabase, Vercel Postgres, Railway o un servidor propio. Usá una base **nueva y separada** de producción.

## 2. Variables de entorno (solo nombres; los valores no van al repositorio)

| Variable | Obligatoria | Para qué sirve |
|---|---|---|
| `DATABASE_URL` | Sí | Base del preview |
| `AUTH_SECRET` | Sí | Firma de sesiones. Mínimo 32 caracteres, aleatorio |
| `CODE_ENCRYPTION_KEY` | Sí | Cifrado de códigos de canje. Base64 de 32 bytes exactos |
| `APP_URL` | Sí | Origen canónico (verifica el origen de las participaciones) |
| `APP_BASE_URL` | Sí | Base pública para generar QR/NFC |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Solo el primer arranque | Crea el superadministrador (contraseña de 12+ caracteres) |
| `QA_MODE`, `QA_DATABASE_URL`, `QA_ADMIN_*` | **No configurar** | La app rechaza `QA_MODE` en producción |

Generar secretos: `AUTH_SECRET` con 32+ bytes aleatorios y `CODE_ENCRYPTION_KEY` con `[Convert]::ToBase64String((1..32 | % { Get-Random -Max 256 }))` en PowerShell o `openssl rand -base64 32`.

> `APP_URL` y `APP_BASE_URL` deben ser la URL real del preview. Conviene crear primero el deploy para conocerla y luego cargar las variables.

## 3. Pasos

1. Crear la base y cargar las variables en el proyecto de Vercel (entorno **Preview**).
2. Aplicar migraciones contra esa base: `npx prisma migrate deploy` con `DATABASE_URL` apuntando a ella.
3. Crear shoppings y superadministrador: `npm run db:seed` con `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
4. Desplegar la rama como **preview** (no producción).
5. En `/admin`: crear la campaña, los premios y sus tarjetas; crear un comercio, asignarle premios y crear su cuenta validadora.

No cargues los datos demo (`seed:demo`): son para QA y solo funcionan fuera de producción.

## 4. Prueba en teléfono (lo único que no se pudo verificar desde la computadora)

Hacerla con HTTPS (la cámara no funciona sin él). Marcá cada punto:

**Comercio** (teléfono 1, sesión del comercio)
- [ ] Iniciar sesión y ver nombre del local y del shopping
- [ ] "Escanear QR": el navegador pide permiso de cámara y se ve la imagen
- [ ] Leer un QR real de un cupón (otro teléfono) → aparece el ticket del premio
- [ ] Probar con poca luz y con el QR desde el costado
- [ ] Cambiar de cámara si el teléfono tiene varias
- [ ] "Confirmar canje" → resultado correcto; el teléfono vibra (Android)
- [ ] Escanear el mismo QR otra vez → "Cupón ya utilizado"
- [ ] Modo avión → aparece el aviso de sin conexión y no se puede canjear
- [ ] Usar todo con una sola mano (el botón principal debe alcanzarse con el pulgar)
- [ ] Instalar la PWA (Agregar a pantalla de inicio) y repetir un canje

**Participante** (teléfono 2)
- [ ] Abrir una URL de cartel `/nfc/<shopping>/<ubicación>` o una tarjeta
- [ ] Participar y ver el QR del premio
- [ ] Recargar la página y encontrar el cupón en "Mi progreso → Mis cupones"
- [ ] Probar en Centenario y en UniPlaza
- [ ] Modo oscuro del teléfono activado: el portal de comercios debe verse oscuro

**Anotá** modelo de teléfono, navegador y versión, y cualquier cosa rara. iPhone: la vibración no está disponible (esperado).

## 5. Después de probar

- Rotar cualquier credencial que se haya compartido por chat o correo durante las pruebas.
- Revisar que ninguna cuenta de prueba quede activa en la base del preview.
- Para pasar a producción hace falta una base de producción propia, un dominio y tu autorización expresa.
