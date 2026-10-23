# Auditoría e implementación — plataforma de promociones

Auditoría inicial: 23-10-2026. Alcance: código, esquema/migraciones Prisma, rutas Next.js, APIs, documentación y pruebas del repositorio actual. Las integraciones que dependen de un proveedor o una base de datos se marcan como pendientes cuando no hay credenciales/servicio disponibles para verificarlas.

## Matriz inicial

| Funcionalidad | Estado actual | Evidencia | Problema / brecha | Solución propuesta | Prioridad | Criterio de aceptación |
|---|---|---|---|---|---|---|
| Experiencias públicas por shopping | Completa para el alcance actual | `/centenario`, `/uniplaza`; temas tipados en `src/lib/brand.ts`; API pública por shopping; capturas comparativas en `docs/ux-redesign/v3` y `v4` | Los datos de campaña requieren PostgreSQL; las identidades deben seguir diferenciadas al compartir estructura | Mantener el concepto editorial de Centenario y adaptar su jerarquía a la composición nocturna urbana azul/cobre de UniPlaza | P2 | Cada ruta conserva tema y datos tenant; las dos home muestran acción, progreso, instrucciones y disponibilidad real |
| Participación y asignación de premio | Completa con límite de identidad | `src/lib/game.ts`; transacción serializable, decremento condicional y código cifrado/hash; pruebas QA | La cookie anónima se puede reemplazar; no identifica una persona verificada | Mantener el control de stock; implementar OTP solo con proveedor contratado | P0 | Contención concurrente no supera stock; no declarar identidad verificada por cookie |
| GET de campaña pública | Corregido; verificación de DB pendiente | `src/app/api/campaigns/[shoppingSlug]/public/route.ts` ahora busca progreso solo si hay cookie de sesión; Playwright QA incluye regresión aislada | No se pudo ejecutar la afirmación de no escritura contra una BD porque PostgreSQL local no está disponible | Ejecutar la regresión al habilitar PostgreSQL QA aislado | P0 | GET anónimo no crea participante ni cookie; el progreso existente sigue apareciendo |
| Cupones y canje | Parcial | `src/lib/redeem.ts` actualiza estado atómicamente; `/api/redeems/validate` aplica alcance de shopping | No hay estado persistido `EXPIRED` actualizado y la autorización no conoce comercio/sucursal | Agregar entidad/alcance de comercio; validar código, vigencia y asignación en una operación | P0 | Un cupón se canjea una vez y solo por un comercio autorizado; vencido no canjea |
| Verificación de teléfono / OTP | Inexistente | No hay campos, tablas, rutas OTP ni proveedor configurado; `Participant` usa `sessionHash` | No existe límite por teléfono/persona ni consentimiento asociado a OTP | Diseñar almacenamiento OTP con hash, expiración y límites; integrar SMS/WhatsApp al contar con credenciales | P0 | OTP no se almacena en texto claro; límites/expiración probados; proveedor real configurado |
| Ubicaciones NFC/QR | Parcial | `Card.location` es texto; rutas actuales identifican una tarjeta (`/[shopping]/participar/[cardId]`) | No existe entidad administrable de cartel/sector ni ruta `/nfc/[shopping]/[ubicación]` | Crear ubicación asociada al shopping y landing resoluble por slug; activar/desactivar desde admin | P0 | Ubicación válida abre shopping correcto; inactiva/inexistente no inicia participación |
| Visitas y métricas de entrada | Parcial | `Event` registra `CARD_PLAYED`, `PRIZE_ASSIGNED`, `REDEEMED`; analítica agrega por evento | No registra visitas/escaneos y el GET actual altera el conteo de participantes | Añadir evento de entrada por ubicación con deduplicación documentada; separar visitas de participantes | P1 | Visitas, inicios, participaciones, premios y canjes son métricas distintas |
| Portal de comercios | Inexistente | No hay modelo `Merchant`; los validadores entran al panel `/admin` | Validador puede validar cualquier código de su shopping; falta identidad y alcance por local | Crear comercios, usuarios asociados, consulta previa, confirmación y listado propio de canjes | P0 | Llamadas directas fuera del comercio asignado reciben 403; historial acotado al comercio |
| Administración de marketing | Parcial | `/admin`, APIs de campañas, tarjetas, premios, usuarios, inventario, informes y auditoría | Faltan ubicaciones/comercios; búsqueda/orden/paginación son desiguales entre módulos | Completar módulos gradualmente respetando roles y auditoría | P1 | Operaciones reales persisten, se limitan en servidor y quedan auditadas |
| Persistencia y aislamiento por shopping | Reforzado en esquema; aplicación QA pendiente | `prisma/schema.prisma`, migración `20261023143000_tenant_composite_constraints` y validaciones servidor | No hay PostgreSQL QA local disponible para aplicar y probar esta migración con los datos presentes | Aplicar en QA aislado; si detecta relaciones antiguas inconsistentes, corregirlas antes de reintentar | P1 | La BD rechaza asociaciones cruzadas aunque una ruta interna cometa un error |
| Integridad relacional auxiliar | Pendiente de FK compuestas | Colecciones, pistas, ubicaciones y asignaciones de comercios tienen comprobaciones de servidor; aún no todas comparan tenant/campaña en una FK compuesta | Se requiere propagar `shoppingId`/`campaignId` a algunas tablas de relación | Diseñar la siguiente migración aditiva con actualización de las escrituras afectadas | P1 | La BD también rechaza cruces en colecciones, pistas y comercios |
| PWA, instalación y offline | Implementado con cobertura incompleta | Manifests por marca, iconos, `public/sw.js`, registro/actualización y prueba de fallback offline | Falta validar las rutas NFC tenant en cache tests; una pantalla offline común no conserva identidad del shopping | Ampliar pruebas de rutas y caché; mostrar contexto offline sin prometer estado actualizado | P1 | API, canjes, admin y rutas de participación nunca quedan cacheadas; offline no ejecuta operaciones |
| Responsive, accesibilidad y QA | Parcialmente validado | `tests/responsive.spec.ts`, axe para rutas públicas y acceso admin; QA aislado en `tests/qa-demo.spec.ts` | El admin autenticado no se recorre en viewports; QA depende de PostgreSQL aislado | Añadir escenarios por rol/módulo y mantener datos QA separados | P1 | Playwright cubre flujos autenticados y tamaños definidos; pruebas DB declaran dependencias reales |
| Operación, privacidad y recuperación | Parcial / pendiente de negocio | `.env.example`, README y `docs/architecture.md` describen secretos y límites | No hay proveedor OTP, política de privacidad/retención aprobada ni evidencia de backups restaurables | Documentar configuración y dejar decisiones externas explícitas; no afirmar cumplimiento legal | P1 | Secretos fuera del repositorio; retención/consentimiento y recuperación definidos antes de producción |

## Plan priorizado

### Ciclo actual — estabilidad de datos públicos

- [x] Quitar la escritura lateral del GET de campaña y no emitir cookie de participante al consultar la landing.
- [x] Añadir regresión de integración en el conjunto QA aislado para comprobar que un GET anónimo no crea participantes.
- [x] Rediseñar la home pública de UniPlaza con jerarquía clara, su paleta propia, progreso e información no ficticia de premios; conservar la dirección de Centenario.
- [x] Ejecutar lint, typecheck, Playwright disponible y build; registrar fallas causadas por infraestructura externa.
- [ ] Ejecutar la regresión DB QA cuando PostgreSQL aislado vuelva a estar disponible; esta ejecución tuvo 2 pruebas omitidas por configuración/entorno.

### Próximos ciclos

1. Modelo de ubicaciones NFC/QR por shopping y resolución de landing; migración y administración.
2. Eventos de visita/acceso deduplicados y reportes que separen vistas, inicios, participaciones, premios y canjes.
3. Modelo de comercio/alcance de usuario, portal privado, prevalidación y canje confirmado con permisos por local.
4. Reforzar integridad multi-tenant con restricciones compuestas y pruebas negativas directas a APIs/BD.
5. Verificación OTP solo después de configurar un proveedor real, límites, consentimiento y política de retención.
6. Cobertura de PWA, módulos administrativos autenticados, responsive y accesibilidad; documentar requisitos operativos de producción.

## Límites de verificación inicial

- El juego, las transacciones y el canje cuentan con implementación backend; la auditoría de código no sustituye una prueba de carrera contra PostgreSQL.
- Las pruebas QA requieren `QA_MODE=true`, un PostgreSQL aislado y credenciales QA; no deben apuntar a producción.
- No se encontró integración de proveedor OTP ni modelo de comercio.
- Esta auditoría y sus cambios no aplican migraciones a Production, no crean campañas/premios y no despliegan el sitio.

## Ciclo 2 — ubicaciones y validación por comercio (23-10-2026)

- [x] Agregar modelos `Location`, `Merchant`, `MerchantUser`, `PrizeMerchant`, `OtpChallenge`, vínculo tarjeta/ubicación, eventos de visita y responsable del canje.
- [x] Generar migración `20261023120000_locations_merchants_otp`; Prisma validate y generate pasaron. Aplicación a PostgreSQL permanece pendiente porque no hay servidor en `127.0.0.1:5433`.
- [x] Crear y activar/desactivar ubicaciones por shopping, con campaña validada en servidor y auditoría.
- [x] Resolver `/nfc/[shopping]/[location]`, deduplicar `LANDING_VISIT` con cookie opaca/ventana de 30 minutos, y sumar visitas por ubicación a analytics.
- [x] Asociar tarjetas NFC/QR a ubicaciones activas del mismo shopping sin romper el campo histórico `Card.location`.
- [x] Crear y activar/desactivar comercios, asignar premios y validadores respetando shopping, y registrar modificaciones críticas.
- [x] Implementar portal `/merchant` con inicio de sesión, consulta no-mutante, confirmación separada, consumo único atómico, límites de intentos e historial propio.
- [x] Reservar asignación de cuentas validadoras a superadmin; operadores gestionan recursos de su shopping, pero no modifican permisos de usuarios.
- [x] Excluir del portal merchant y NFC de cache privado; TypeScript, lint, Playwright disponible y build final ejecutados.
- [ ] Ejecutar las nuevas pruebas de visita deduplicada, QR tenant, validación de comercio y replay de canje en PostgreSQL QA. La prueba Playwright se omitió automáticamente porque requiere `QA_MODE`, usuario QA y base aislada.
- [ ] Integrar OTP únicamente tras seleccionar un proveedor SMS/WhatsApp real, definir credenciales fuera del repo, límites, consentimiento y retención.
- [x] Añadir constraints compuestas multi-tenant a nivel SQL.
- [ ] Aplicar la migración sobre una base QA aislada y verificar restricciones negativas antes de cualquier entorno compartido.
