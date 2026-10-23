# Iteración 2: implementación de la referencia PWA de Centenario

Fecha: 22-10-2026. Referencia: imagen adjunta por el usuario, 853 × 1844 px. El tamaño CSS equivalente se estima en torno a 390 × 844 px; la densidad de píxeles de origen no está disponible, así que esa equivalencia no es una medición.

## Lectura visual

- La marca aparece como logotipo tipográfico centrado sobre una escena navideña fotográfica.
- Una invitación color papel reúne título serif, párrafo corto y una sola acción primaria.
- El progreso se presenta como tres espacios estampillables, seguido por instrucciones con pictogramas.
- Un bloque fotográfico destaca los premios y una barra inferior mantiene cinco destinos accesibles.
- La paleta visible se interpreta como verde pino, papel marfil, terracota y acentos dorados. Son aproximaciones visuales a la referencia, no colores oficiales de Centenario.

## Decisiones y límites

- La composición de portada, el CTA principal, el pasaporte de tres tarjetas, los pasos ilustrados y el bloque destacado se implementaron en la ruta existente de Centenario. UniPlaza conserva su portada y tema propios.
- Las fotos de fondo y regalo son recursos generados para esta aproximación visual; no son fotografía oficial, logotipos ni una afirmación de premios reales. El bloque de premios solo muestra nombre y disponibilidad si la API entrega una campaña activa; cuando no la hay, lo declara expresamente.
- No se modificaron reglas de participación, stock, colección, QR/NFC ni canjes.
- La referencia no incluye manuales, logos aprobados, paleta codificada ni activos de campaña oficiales. Esos recursos siguen siendo necesarios para sustituir la marca tipográfica y la fotografía provisional.

## Comparación y QA

- Antes: [Centenario, captura 390 px](../before-centenario-390.png).
- Después: [Centenario, móvil](../after-centenario-mobile.png) y [Centenario, escritorio](../after-centenario-desktop.png).
- Los screenshots posteriores se generaron con Playwright. En la corrida local la API reportó que PostgreSQL no estaba disponible en `127.0.0.1:5433`; por eso el estado visible de campaña es de indisponibilidad y no contiene premios ficticios.
- Suite Playwright: 8 aprobadas, 1 omitida. Incluyó viewports 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 y 1920 px, eje horizontal, tipografía ampliada, movimiento reducido, Axe, rutas NFC y checks PWA. La prueba omitida crea/limpia datos QA y requiere PostgreSQL local.
- Build: `next build` completó correctamente en `.next-verification` (el `distDir` temporal evitó colisión de archivos con el `.next` existente). ESLint: 0 errores, 2 advertencias previas de `<img>` en utilidades QA.

## Production

La versión visual quedó publicada en [Production](https://shop-navidad.vercel.app/centenario), deployment [READY](https://shop-navidad-f68tdyfqb-beercard-7600s-projects.vercel.app/centenario) (ID `dpl_FWXJw4VLZ8QsLjzqigp37UbwCJsa`), correspondiente al commit `3427c5e` de `main`. Centenario y UniPlaza responden HTTP 200; la verificación del HTML confirmó que Centenario carga el nuevo asset y UniPlaza no hereda esa portada. El asset WebP devuelve HTTP 200.

La variable secreta `DATABASE_URL` de Production ahora apunta a la base Prisma principal. Se aplicaron las tres migraciones de `prisma/migrations` y se crearon únicamente los registros raíz de Centenario Shopping y UniPlaza Shopping. No se crearon campañas, premios, tarjetas, usuarios ni canjes. El deployment nuevo responde `CAMPAIGN_UNAVAILABLE` (404) para ambas APIs, el estado esperado al no existir una campaña activa; no se observaron logs 500 en este deployment.

El proyecto Prisma `navidad-magica-vercel-preview` se mantiene como base separada para Preview. Para habilitar participación en Production todavía falta cargar y activar una campaña real con sus premios, stock, tarjetas, fechas y condiciones aprobadas.
