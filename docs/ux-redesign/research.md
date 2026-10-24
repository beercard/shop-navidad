# Investigación de productos reales — decisiones de diseño

Fecha: 23-10-2026. Alcance: 9 productos de la lista (el pedido pide entre 8 y 12).

## Método y límites (leer primero)

- Se consultó cada producto con **búsquedas web que devuelven resúmenes con fuentes** (artículos de análisis UX, documentación de la propia empresa y foros). **No se instalaron ni usaron las aplicaciones**, no se vieron sus pantallas reales y no se verificó que cada detalle siga vigente hoy.
- Por eso las afirmaciones se tratan como **patrones plausibles de la literatura**, no como especificación exacta de esos productos. Lo que sí se verifica es el resultado en **nuestra** interfaz (capturas reales en `docs/ux-redesign/v5/`).
- Cuando una fuente era un foro o una página de terceros, el dato se usa solo como inspiración de patrón.
- No se copió ningún diseño, logotipo, texto ni ilustración propietaria.
- No investigados: Burger King, Sephora, Nike, McDonald's, Snapchat, Habitica, Sweatcoin, RetailMeNot, Honey, TheFork, Ticketmaster, Clover, Lightspeed, Mall of America, Dubai Mall, Simon, Aventura, Pinterest, Airbnb, Uber Eats, Spotify.

## Matriz de patrones

| # | Producto | Patrón observado | Problema que resuelve | Dónde lo aplicamos | Estado | No conviene replicar |
|---|---|---|---|---|---|---|
| 1 | Starbucks Rewards | Barra de progreso segmentada con "te faltan N" y recompensas bloqueadas/atenuadas según lo que ya se alcanzó | Hace tangible el objetivo y muestra qué falta | Progreso de colección: el anillo ya dice "Te faltan N tarjetas diferentes" | Ya existía; se conserva | Estrellas/niveles: no hay moneda de puntos; mezclar promociones con la barra satura la portada |
| 2 | Duolingo | Feedback inmediato, celebración proporcional al logro, objetivos pequeños, tono que perdona fallos | Motivar sin culpa; evitar abandono tras un error | Resultado de participación (check animado, mensaje claro, reintento ante error), reducción de movimiento respetada | Aplicado | Rachas diarias, notificaciones culpabilizantes y urgencia artificial: no hay base en el backend y serían patrones oscuros |
| 3 | Pokémon GO | Colección con tres estados: registrada, entrevista/silueta, vacía | Distinguir lo que está disponible de lo obtenido | Colección: tarjetas encontradas vs pendientes (ya existe "Tarjeta 1/2/3") | Parcial: se mantiene la distinción | Mapas en tiempo real y mecánicas de captura; "progreso oculto" que parezca ficticio |
| 4 | Groupon | "Mis cupones" por estado (Disponibles / Historial); QR visible solo cuando es válido; estados distintos para usado y vencido; confirmar antes de marcar usado | Evitar escaneos de cupones muertos y dudas sobre "¿ya lo usé?" | **Nuevo `CouponWallet`** (pestañas, chip con icono+texto, vencimiento "en N días", QR expandible solo si disponible) | **Implementado** | Valor pagado vs promocional y reembolsos (no aplica); la mayor parte del análisis proviene de terceros |
| 5 | Google Wallet | Pases con estado; al vencer, el pase se atenúa y se oculta el código; vigencia explícita | Que nadie escanee un pase vencido | Cupones vencidos/anulados/canjeados no devuelven código ni QR (lo impone **el servidor**, no solo el estilo) | **Implementado y probado** | Ser una billetera genérica: guardar en Wallet exige API/credenciales de Google y no se hizo |
| 6 | Too Good To Go | Ficha con ventana de retiro y disponibilidad; confirmación **física** delante del comercio ("deslizar para confirmar") | Evitar que el cliente marque el canje por su cuenta | Decisión: el canje solo lo confirma el **comercio autenticado en el servidor**; el cliente no tiene botón de canje | Ya existía; se refuerza el copy ("Entregá el premio solo después de ver la confirmación") | Pago en la app, mapa y reserva: no aplican |
| 7 | Eventbrite (organizador) | Escaneo con estados muy distintos: éxito (verde + check), "ya escaneado" (rojo + icono), inválido; accesible sin leer demasiado | Velocidad en la fila y menos errores humanos | Portal de comercios: icono + texto + color en cada estado, ticket de confirmación, mensajes específicos (vencido, anulado, ya utilizado, no habilitado) | **Implementado** | Retroalimentación sonora/háptica: no se implementó (ver pendientes) |
| 8 | Square (POS) | Un solo botón dominante, acciones secundarias atenuadas, estado "listo" inequívoco tras la operación, permisos que no rompen el flujo | Caja rápida con poca capacitación | Portal: "Escanear QR" a pantalla completa de ancho y 96 px, manual como secundario, barra fija con "Confirmar canje" y "Cancelar", resultado con check | **Implementado** | Cobro, recibos por SMS/correo e inventario |
| 9 | Westfield (app) | Directorio por categorías, "Qué hay", ofertas, detección del centro más cercano, filtros de servicios | Encontrar locales y promociones en un centro grande | **No aplicado todavía**: nuestra PWA no tiene directorio de locales ni mapa. "Premios" muestra solo los de la campaña | Pendiente (ver plan) | Mapa interior, estacionamiento y reservas: fuera de alcance |

## Decisiones derivadas (con trazabilidad)

1. **Cupones: una billetera con dos pestañas** (Groupon, Wallet). Justificación real: antes el participante veía su cupón **una sola vez**, justo después de girar; al recargar se perdía. Es la mayor brecha funcional detectada.
2. **El QR solo existe mientras el cupón está disponible** (Wallet). Se implementó en el servidor (`GET /api/coupons`), no solo en la UI, y se cubre con pruebas.
3. **Una acción dominante por pantalla** (Square): escaneo en el portal; "Participar" en la tarjeta; "Confirmar canje" en la confirmación.
4. **Estados con icono + texto + color** (Eventbrite, Groupon): nunca solo color.
5. **Confirmación solo por el servidor y por el comercio** (Too Good To Go): coincide con la regla de negocio existente.
6. **Celebración moderada** (Duolingo): el check del resultado entra en 240 ms y se desactiva con `prefers-reduced-motion`. Se descartaron rachas, urgencia y puntos.
7. **Directorio de locales** (Westfield): se registra como mejora futura, porque requiere datos (ubicación, categoría, horarios) que no existen en el modelo actual.
