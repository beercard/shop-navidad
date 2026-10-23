# Iteración 3: sistema visual en todo el recorrido público

Fecha: 22-10-2026. Se mantiene la composición editorial de Centenario establecida en la iteración anterior y se extiende a Jugar, Descubrir, Premios, Mi progreso, detalles y rutas NFC/QR. UniPlaza recibe un lenguaje propio de paseo urbano nocturno, con geometría más arquitectónica, azules profundos y acentos cobre.

## Criterios de marca y material

- Centenario continúa con la escena de pino, papel de invitación, serif editorial, estampas y terracota de la referencia recibida.
- UniPlaza conserva su escena urbana abierta, tipografía sans, formas angulares, azul petróleo y cobre de la identidad de campaña ya configurada.
- Los valores cromáticos son decisiones de campaña aproximadas, no colores oficiales certificados. El repositorio no contiene logos aprobados ni manuales de marca.
- Los tonos de campaña están en `BrandTheme.campaign.palette` y se exponen como variables CSS; las diferencias de forma, composición y tipografía permanecen en estilos acotados a cada shopping.
- No se incorporó nueva fotografía ni se presentan los recursos de campaña generados como fotografía oficial, marcas registradas o premios reales.
- Los componentes se comparten y reciben el tenant desde su ruta. Los tokens y reglas visuales están acotados a `data-shopping`; la vista de una marca no modifica la otra.

## Pantallas cubiertas

| Pantalla | Centenario | UniPlaza |
| --- | --- | --- |
| Inicio | Invitación de papel, escena de pino, pasaporte estampado y regalo | Paseo urbano abierto, paneles angulares y wayfinding azul/cobre |
| Jugar | Marco de ruleta verde y dorado, tarjeta de código en papel | Recinto azul petróleo, rueda de contraste y campo de código geométrico |
| Descubrir | Tres sellos de colección, conteo editorial y pista en papel | Tres estaciones de recorrido, placas azules y bloque de pista angular |
| Premios | Catálogo enmarcado, premio destacado y filas de inventario | Catálogo de formas limpias y contrastes de destino urbano |
| Mi progreso | Anillo sobre pino, sellos y beneficio en bloque de papel | Medidor azul, hitos geométricos y panel de desbloqueo |
| Detalle / QR/NFC | Hoja/modal y página de participación en papel y pino | Hoja/modal y página en blanco, azul y cobre |

## Integridad del producto

La disponibilidad del catálogo continúa vinculada a la API pública de campañas. Sin campaña activa la pantalla explica la falta de disponibilidad; no se crean premios de presentación. La ruleta sigue siendo visual: el servidor valida la tarjeta, decide el resultado y actualiza stock. Se corrigió además un detalle de separación visual: los regalos vectoriales alternativos ahora reciben el shopping activo en catálogo y detalle, en lugar de fijar accidentalmente una marca.

## Verificación

Se agregó una prueba Playwright que recorre las cuatro secciones secundarias de ambos shoppings, verifica sus elementos principales y que el marco de ruleta y el recorrido NFC mantengan estilos y destinos por tenant. Las capturas de las cinco vistas de cada marca están en [`docs/ux-redesign/v3`](../v3/); se tomaron a 390 px y 1440 px, con comprobación adicional de overflow a 320 y 768 px. La prueba responsive existente continúa cubriendo Inicio en 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 y 1920 px.

Resultado local: `npm test` aprobó 8 pruebas y omitió 2 escenarios que requieren la base QA local o una corrida de PWA sobre Production. TypeScript no reportó errores. ESLint terminó sin errores; conserva dos avisos de `<img>` en utilidades de QA. El build optimizado de Next.js terminó correctamente en un directorio temporal aislado. La base PostgreSQL local en `127.0.0.1:5433` no estaba disponible: las vistas muestran el estado de campaña no disponible y las capturas no incluyen premios inventados. No se probó un canje productivo ni se alteraron datos de Production.

