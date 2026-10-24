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


## Ciclo 3 — Investigación, rediseño UX/UI y cupones del participante (23-10-2026)

Este ciclo corrige una nota de los anteriores: **PostgreSQL QA sí estuvo disponible** (puerto 5433), las migraciones se aplicaron en la base QA y las pruebas contra base real se ejecutaron (ver "Verificación").

### Matriz de pantallas (estado real tras este ciclo)

| Pantalla | Estado | Problemas encontrados | Mejora aplicada | Prioridad | Verificado |
|---|---|---|---|---|---|
| NFC/QR `/nfc/[shopping]/[ubicación]` | Completa (ciclo 2) | Sin cambios visuales | Sin cambios | P2 | Prueba e2e de redirección y desactivación |
| Inicio público Centenario / UniPlaza | Completa | Tarjeta de premio destacado: rejilla rota en UniPlaza (icono en fila propia), etiquetas de 10 px, `aria-label` que no contenía el texto visible | Rejilla corregida, etiquetas ≥ 12 px, nombre accesible desde el contenido | P1 | Capturas + axe `/centenario`, `/uniplaza` |
| Juego / participación por tarjeta | Completa | **Código de canje ilegible** (claro sobre claro), sin QR, etiquetas mono de 10 px, emojis como iconos | Bloque de resultado propio con QR escaneable, código legible, copiar, vencimiento; iconos SVG; foco al título | **P0** | Capturas + axe `/…/participar/…` |
| Colección y progreso | Completa | Solo mostraba un logro "premio en esta sesión" | Se conserva; se añade la billetera de cupones debajo | P1 | e2e |
| **Cupones del participante** | **Inexistente** (el cupón se veía una sola vez al girar) | Recargar la página lo perdía; no había estados | **`GET /api/coupons` + `CouponWallet`**: Disponibles / Historial, estados disponible-canjeado-vencido-anulado, QR solo mientras está disponible | **P0** | 2 pruebas de integración (aislamiento, estados, sin PII) |
| Registro y verificación de teléfono (OTP) | Inexistente | Sin proveedor SMS/WhatsApp | **No implementado** (necesita proveedor y política de privacidad) | P0 negocio | — |
| Portal de comercios | Completa | Escaneo sin protagonismo, encabezado cortado, confirmar tapado por la barra, sin foco al cambiar de pantalla | Rediseñado: escaneo dominante, ticket de confirmación, barra de acción fija, foco gestionado, estados con icono+texto | P0 | e2e + 11 pruebas API + axe + 8 anchos |
| Escaneo QR / entrada manual | Completa | Mensaje de cámara se salía del marco, error duplicado | Guía de esquinas, explicación previa del permiso, cámara se detiene al ocultar la pestaña | P0 | e2e (error de permiso) |
| Historial de comercio | Completa | Solo filtro por fecha | Chips "Confirmado" con icono, esqueletos de carga | P2 | e2e |
| Panel de marketing / admin | Completa en funciones | Bitácora con códigos internos en inglés, 13 secciones sin agrupar, glifos de texto como iconos, texto de 8–11 px, tipografías sin cargar | Navegación agrupada (Campaña/Operación/Sistema), iconos SVG, etiquetas en español, escala ≥ 12–13 px, tira de secciones en móvil | P1 | Capturas + axe `/admin` |
| Métricas y reportes | Parcial | Sin gráficos; tablas sin versión móvil de tarjetas | **No cambiado** | P2 | — |
| Directorio de locales / mapa | Inexistente | No hay modelo de datos | No implementado (ver investigación, Westfield) | P3 | — |

### Tareas

- [x] Auditoría de pantallas con capturas reales (`docs/ux-redesign/v5/before`).
- [x] Investigación de 9 productos documentada con límites de método (`docs/ux-redesign/research.md`).
- [x] Lectura de las 4 skills pedidas (ver abajo) y aplicación de sus criterios.
- [x] Sistema de diseño: `src/app/design-tokens.css`, tipografías reales con `next/font`, estados semánticos.
- [x] Prototipo: portal de comercios + pantalla de resultado de participación.
- [x] Cupones del participante (API + UI) con pruebas.
- [x] Aplicar el sistema al panel de administración (navegación, tipografía, bitácora).
- [x] Pruebas: integración de comercios y cupones, e2e de navegador, overflow en 8 anchos, axe en 6 rutas.
- [x] Panel: tabla de rendimiento con barra comparativa y apilado en móvil (resto de tablas: solo desplazamiento horizontal; ver pendientes).
- [x] Retroalimentación háptica (lectura, éxito y error con patrones distintos). Sonora: descartada (ruido en el mostrador). iOS no soporta vibración: nunca es la única señal.
- [ ] Modo oscuro (no pedido explícitamente; no implementado).
- [x] OTP/SMS: **descartado por decisión de producto (24-10-2026)**, era una fricción. Documentado en README y docs/architecture.md.
- [ ] Preview en Vercel (no se publicó nada; ver "Entrega").

### Skills consultadas (rutas verificadas, instrucciones leídas)

| Skill | Ruta verificada | Qué se leyó | Cómo se aplicó |
|---|---|---|---|
| Frontend Design | `anthropics/skills` → `skills/frontend-design/SKILL.md` | Completo (71 líneas) | Evitar etiquetas en mayúsculas con tracking, copy orientado a la acción, una sola cosa memorable por pantalla, revisión contra "defectos de plantilla" |
| UI UX Pro Max | `nextlevelbuilder/ui-ux-pro-max-skill` → `.claude/skills/ui-ux-pro-max/SKILL.md` + `references/pro-rules.md` | `SKILL.md` (214 líneas) y checklist; **se ejecutó** `search.py --design-system` | La paleta sugerida (verde/ámbar "food e-commerce", Rubik) se **rechazó** por chocar con las dos marcas; se usó su checklist (contraste, 44 px, safe areas, reduced-motion) |
| Taste Skill | URL del pedido (`Leonxnx`) **no existe**; el repo real es `Leonxlnx/taste-skill` | `SKILL.md` leído hasta la línea 230 de 529 | Idea "el contenido del sujeto es el diseño" y copy completo. **No** se ejecutaron sus scripts (`draw.mjs`, `inspect.mjs`) |
| Mobile UX Skills | `numen111104/mobile-ux-skills` → `mobile-ui-ux/SKILL.md` | `SKILL.md` completo (169 líneas); referencias solo por su índice | Reglas de jerarquía, estados, targets ≥ 44, foco, movimiento 100–400 ms |
| Frontend App Builder (`openai/plugins`) | No consultada en este ciclo | — | No se afirma uso. Un registro previo en `docs/ux-redesign/skill-registry.md` indica que otra sesión sí la leyó; no se pudo verificar desde aquí |
| `pwa-from-reference-ui`, `pwa-mobile-redesign` | No leídas en este ciclo | — | Sin uso afirmado |

### Verificación (ejecutada, 23-10-2026, base QA real en `127.0.0.1:5433`)

| Prueba | Resultado |
|---|---|
| `npx tsc --noEmit` | Sin errores |
| `npm run test:merchant` (11 pruebas: sesión, QR/manual, canje, repetición idempotente, vencido/anulado, no autorizado, concurrencia, historial, suspensión, autorización admin, **cupones del participante**) | 11 pasan |
| `npm run test:qa` (e2e de navegador: portal, escáner sin cámara, canje, historial, contraseña, participación pública, QR por shopping) | 1 pasa (≈ 31 s) |
| `tests/ux-layout.spec.ts` (sin desbordes a 8 anchos en 4 rutas; objetivos táctiles; **axe WCAG A/AA** en 6 rutas) | 11 de 11 pasan (8 anchos × 4 rutas sin desborde; objetivos táctiles; axe WCAG A/AA en 6 rutas). La primera ejecución encontró 4 fallas reales de axe (label-content-name-mismatch) que se corrigieron |
| `tests/responsive.spec.ts` (10 anchos de las rutas de campaña) | 7 de 7 pasan (tras actualizar un selector que dependía de un ria-label que incumplía WCAG 2.5.3) |

### Límites conocidos

- La investigación usó resúmenes de búsqueda; no hubo uso directo de las apps de referencia.
- No se probó en un dispositivo físico (ni la cámara real, ni la instalación de la PWA).
- No se ejecutó la herramienta `draw.mjs`/`inspect.mjs` de Taste Skill.
- No se probó dark mode ni escala de texto 200 %.


### Cierre del ciclo 3

- 
pm run lint: 0 errores, 2 advertencias previas (<img> en utilidades QA).
- 
ext build de producción (en .next-build, para no pisar el servidor de desarrollo): compilación correcta.
- Capturas finales en docs/ux-redesign/v5/final2. Tras ellas solo se añadió ont-variant-numeric: lining-nums (CSS); **no se volvieron a capturar**.
- Defectos propios corregidos durante la verificación: ruta de import de CSS errónea (500 en rutas), billetera sin margen, rejilla del premio destacado de UniPlaza, ria-label que incumplían WCAG 2.5.3, prueba e2e que asumía la barra inferior tras un canje.

### Estado de los pendientes (24-10-2026, segunda ronda)

Cerrado y verificado:
- [x] Tablas del panel: las 5 tablas (rendimiento de tarjetas, tarjetas, usuarios, participantes y la genérica de informes) se apilan en móvil con etiquetas por celda; la de rendimiento incluye barra comparativa. Estados de tarjeta traducidos. Prueba: ninguna sección del panel desborda a 390 y 320 px (esta prueba confirma ausencia de desborde, no por sí sola que cada tabla esté apilada; eso se comprobó con captura para la de rendimiento).
- [x] Modo oscuro del portal de comercios (sigue `prefers-color-scheme`, paleta propia por shopping). **Hallazgo:** la primera versión no se aplicaba porque `brandCssVariables` inyecta `--brand-*` como estilo en línea; las pruebas axe de esa versión evaluaron en realidad el modo claro. Se corrigió con `!important` y se verificó con capturas reales y axe.
- [x] Cobertura axe de las pantallas autenticadas del portal (inicio, entrada manual, escáner con error, confirmación, resultado, cupón inválido, historial, seguridad) en modo claro y oscuro. Antes solo se revisaba el login.

Descartado por decisión de producto:
- OTP/SMS (ver README y `docs/architecture.md`).

Sigue abierto (no se puede cerrar sin datos, autorización o dispositivo):
- Modo oscuro de la experiencia pública, la pantalla de participación y el panel: sin implementar (diseños artísticos propios de cada campaña; requieren decisión de arte).
- Texto escalable: los tamaños están en px, así que **la preferencia de tamaño de fuente del navegador no se respeta**; el zoom de página sí (reflujo probado a 320 px). Migrar a rem es un cambio transversal no hecho.
- Directorio de locales y mapa: requiere datos nuevos en el modelo.
- Preview en Vercel: no se publicó nada; requiere autorización.
- Cámara real, instalación de la PWA y vibración en dispositivo físico: sin probar.
- Tabla `OtpChallenge`: reservada y sin uso; puede eliminarse en una migración futura.