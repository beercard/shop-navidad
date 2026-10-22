# Sistema de marca — Navidad Mágica

## Alcance y método

Se revisaron las páginas oficiales indicadas y los archivos de marca dentro de `src/`, `docs/` y los recursos públicos del proyecto. El repositorio contiene el prototipo de campaña y ahora incluye ilustraciones SVG genéricas para premios QA; no se encontraron logotipos oficiales, guía de marca ni fotografías originales identificadas como recursos de los shoppings.

La inspección textual de los sitios oficiales permitió confirmar sus mensajes, servicios y posicionamiento. En esta auditoría, la portada de Centenario agotó el tiempo de espera; su página Nosotros sí estuvo disponible. La extracción de las páginas no expuso de forma fiable los valores CSS ni los archivos originales de sus logotipos; por ello este documento no atribuye colores corporativos ni tipografías oficiales. La paleta del prototipo existente (ver `src/app/globals.css`) es una dirección visual de campaña, no evidencia de la marca institucional.

## Hallazgos verificables

### Centenario Shopping

- El sitio institucional describe a Centenario como el primer shopping de Corrientes, inaugurado en 2008, con más de 115 locales y una propuesta para disfrutar experiencias con familia y amigos.
- Su comunicación menciona cines, juegos, gastronomía, actividades especiales y servicios de comodidad, accesibilidad y seguridad. El tono editorial es cálido, directo y familiar.
- El material fotográfico del sitio está vinculado a locales, entretenimiento, servicios y novedades del centro comercial. Para la campaña conviene priorizar fotografías reales del shopping y de experiencias compartidas, si el equipo dispone de autorización para reutilizarlas.
- Las fuentes consultadas no permiten confirmar una paleta, tipografía, geometría de logotipo ni manual de marca oficial. No se deducen esos atributos del prototipo navideño.

### UniPlaza Shopping

- El sitio institucional presenta a UniPlaza como un centro comercial nuevo, a cielo abierto, urbano e innovador, conectado con La Unidad; destaca terrazas, paseos al aire libre, arquitectura, primeras marcas, entretenimiento y servicios.
- Su lema publicado es “El nuevo puente, entre vos y lo que amás.” La sección Nosotros reitera la conexión entre comodidad, servicios y marcas, y el diseño arquitectónico que invita a recorrer.
- Las páginas oficiales muestran fotografía de arquitectura, espacios, locales y propuestas de gastronomía/entretenimiento. La campaña puede conservar esta cualidad urbana y abierta mediante fotos reales de sus espacios, evitando encerrar visualmente la marca en una estética clásica de bosque navideño.
- La extracción textual no confirma colores institucionales, nombres de tipografías ni un manual público. La configuración de este proyecto es aproximada y reemplazable.

## Fuentes

- [Centenario Shopping — Inicio](https://centenarioshopping.com.ar/)
- [Centenario Shopping — Nosotros](https://www.centenarioshopping.com.ar/nosotros.htm)
- [UniPlaza Shopping — Inicio](https://uniplazashopping.com.ar/)
- [UniPlaza Shopping — Nosotros](https://uniplazashopping.com.ar/nosotros/)

Los contenidos institucionales citados se usan para caracterizar la voz y la propuesta, no para afirmar normas visuales que esas páginas no publican de forma verificable.

## Dirección del sistema compartido

La campaña navideña es una capa temporal que convive con dos identidades independientes. El árbol, los destellos, los regalos o las cintas pueden aparecer como recursos de campaña; no deben sustituir ni alterar los logotipos corporativos. El componente de interfaz debe recibir el tema del shopping activo y aplicar el conjunto de tokens completo (superficies, texto, acción, bordes, tipografía y radios), evitando duplicar la aplicación.

### Centenario: dirección de campaña

Una experiencia acogedora, clásica y familiar: composición editorial, serif expresiva en titulares, sans-serif legible en lectura, superficies cálidas y pequeños acentos festivos. La propuesta de color definida en `src/lib/brand.ts` es una aproximación de campaña para diferenciar este tema; no representa colores oficiales documentados.

### UniPlaza: dirección de campaña

Una experiencia contemporánea, urbana y abierta: jerarquías tipográficas limpias, más aire, fotografía arquitectónica y detalles de luz que evoquen recorridos exteriores. La propuesta cromática fría con acento cálido es una aproximación temporal y no representa colores oficiales documentados.

### Tipografía y jerarquías

Los tokens ofrecen familias con alternativas locales seguras. `DM Sans`, `DM Mono` y `Playfair Display` aparecían importadas por la hoja de estilos del prototipo, pero no se han verificado como tipografías oficiales de los shoppings. Se quitaron las descargas externas para evitar dependencia de red y cambios de diseño durante la carga; la jerarquía usa fallbacks del sistema hasta recibir fuentes licenciadas y aprobadas.

### Componentes y estados

Los componentes compartidos deben consumir `brandCssVariables()` y usar, como mínimo, `--brand-primary`, `--brand-accent`, `--brand-surface`, `--brand-text`, `--brand-border`, `--brand-focus`, radios y sombras. Para botones, enlaces, tarjetas, formularios y foco visible, usar estos roles y no colores pegados en cada componente. Estados de error/éxito están definidos aparte del acento para conservar contraste semántico.

## Configuración técnica

- `src/lib/brand.ts` declara los dos temas tipados, los fallbacks de marca, la dirección de campaña y una función para generar variables CSS.
- Los campos `logo.src`, `logo.lightSrc` y `campaign.heroImage` son `null` hasta recibir assets aprobados; se conserva texto alternativo/wordmark para que la interfaz tenga un fallback sin simular un logotipo.
- `seasonalMotif` permite distinguir el lenguaje estacional de cada shopping sin duplicar componentes.
- Las propuestas de color, radios y sombras son decisiones de campaña reemplazables. Entregar los valores oficiales en estos tokens cuando estén disponibles.

## Recursos pendientes

1. Logotipo vectorial oficial de cada shopping, versiones para fondo claro/oscuro y reglas de área de protección/tamaño mínimo.
2. Manual de marca o confirmación por escrito de paleta y tipografías institucionales.
3. Fotografías de campaña y de espacios/locales autorizadas para la experiencia digital; sujeto, orientación, recortes y derechos de uso.
4. Set de iconos institucionales o pautas para convivencia con iconografía de campaña.
5. Confirmación de si cada marca admite ajustes de contraste o versiones monocromáticas de sus logotipos.

Al incorporar cualquiera de estos elementos, sustituir los valores del tema y las rutas `null` sin cambiar los componentes consumidores. No redibujar, deformar ni colorear los logotipos recibidos.

