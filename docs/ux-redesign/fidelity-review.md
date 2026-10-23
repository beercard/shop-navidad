# ROUND 1 — Revisión visual del rediseño

Fecha: 22-10-2026. Evidencia revisada: concepto móvil de Centenario (`concept-centenario-mobile.png`), capturas de navegador de Centenario y UniPlaza (`after-centenario-mobile.png`, `after-uniplaza-mobile.png`) y carga de ambas rutas en el navegador local a 390 × 844 aprox. Las capturas de campaña muestran datos QA con la leyenda “DEMO — SIN VALOR COMERCIAL”.

## Resultado

**Puntaje visual estimado: 7.2/10.** La arquitectura móvil es legible y las marcas se distinguen por tema y forma. La ejecución todavía está por debajo del concepto, sobre todo por la falta de fotografía y arte oficial. No se usa una imagen generada como logo ni como sustituto de la campaña real. Por debajo de 7.5, los bloqueos son concretos y están anotados abajo; no se atribuye el resultado a las skills o a las limitaciones del navegador.

## Comparación concepto / implementación

| Observación | Concepto Centenario | Captura implementada | Acción o motivo |
|---|---|---|---|
| Portada y jerarquía | Una tarjeta de papel domina la escena y concentra título y CTA. | Hero más corto: se conserva la tarjeta de bienvenida, pero el control principal queda debajo con progreso e instrucciones entre medio. | Se priorizó la secuencia funcional que ya usa la app y el CTA no queda dentro de una imagen. Revisar una composición más continua cuando haya arte oficial. |
| Contexto de marca | Fotografía cálida de regalos y luces; no puede leerse como foto real del shopping. | Ilustración SVG de campaña y recursos tipográficos; la identidad es más sobria y menos inmersiva. | Faltan fotografías autorizadas y logo/manual oficial. No inventar activos corporativos. |
| Pasaporte coleccionable | Tres marcos ornamentados, numeración y estrellas. | Tres espacios ligeros, etiquetas y progreso persistente en datos; poca profundidad decorativa. | Se priorizó que estados pendientes/descubiertos se mantengan legibles y respondan al servidor. Se puede aumentar el detalle sin reemplazar los estados funcionales. |
| Instrucciones | Tres pasos con iconos circulares e ilustración generosa. | Tres columnas compactas de texto con separadores, sin iconos ilustrativos. | Mejora futura: añadir pictogramas del sistema existente sin convertirlos en imágenes inaccesibles. |
| Premio destacado | Bloque editorial amplio con fotografía de regalo y título de campaña. | Tarjeta compacta con nombre, estado de disponibilidad y stock comunicado por API. | Se mantiene compacta para móvil y vinculada al inventario real. Cuando falta foto, se muestra arte SVG de regalo; se corrigió su render inline para asegurar que sea visible. |
| Navegación | Barra inferior amplia con cinco destinos y estados activos. | Barra fija compacta, con cinco destinos y etiquetas siempre visibles. | Mantenerla por navegación directa y pulgar; revisar alto y legibilidad en dispositivo real tras recibir branding aprobado. |
| UniPlaza | No hay un concepto equivalente de referencia en la imagen generada. | Se usa tema azul profundo/bronce, panel geométrico y el mismo pasaporte de campaña. | El mismo flujo y los mismos componentes se adaptan al tono urbano configurado; valores aproximados y reemplazables, no colores oficiales verificados. |

## Verificación de navegador y límites

- Se abrieron `/centenario` y `/uniplaza` en el navegador local. Se vieron títulos, variantes temáticas, navegación, colección, CTA y premios de QA.
- La captura móvil de ambas rutas se generó con Playwright en la corrida responsive documentada. El estado y la disponibilidad de los premios provienen del endpoint de campaña en modo QA.
- La vista inicial del navegador puede mostrar “Cargando campaña” durante la petición; esa etiqueta no representa un premio ni stock adicional. Los errores de red se muestran en la interfaz y no se sustituyen por resultados ficticios.
- No se verificó instalación real en Android/iPhone ni acceso desde otro dispositivo por IP LAN. La prueba PWA cubre el servidor de producción local y el fallback offline, no un dispositivo físico.
- Los logos oficiales, manuales de marca, tipografías aprobadas y fotografías autorizadas siguen pendientes; ver `docs/brand-guidelines.md`.

## Siguiente mejora recomendada

Conseguir assets aprobados para ambos shoppings y una pieza promocional navideña de campaña. Luego ajustar la portada y el premio destacado a esos assets, conservar el texto como HTML accesible y volver a comparar capturas en móvil y escritorio.
