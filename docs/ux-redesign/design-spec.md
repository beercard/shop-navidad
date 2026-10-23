# Diseño premium: Navidad Mágica

Fecha: 22-10-2026. Alcance: rutas públicas de Centenario Shopping y UniPlaza Shopping, experiencia instalable y estados de conexión. La lógica de campañas, participaciones, stock, colecciones y canjes conserva sus endpoints existentes.

## Dirección creativa

**La tarjeta de la búsqueda se vuelve el pasaporte de la experiencia.** En Centenario, el pasaporte acompaña una búsqueda compartida y familiar; en UniPlaza, el mismo recorrido se lee como una exploración de espacios abiertos y arquitectura urbana. El elemento que cambia en cada visita es el dato real de campaña —pista, disponibilidad, progreso y respuesta de la participación— que sigue llegando del servidor.

La portada móvil se compone como una escena navideña con una tarjeta impresa recortada que contiene la propuesta, una tira de tres espacios de colección, instrucciones breves, una acción principal y el premio destacado cuando la API informa una campaña. El usuario puede pasar a cinco destinos persistentes: Inicio, Jugar, Descubrir, Premios y Mi progreso.

## Concepto visual

`concept-centenario-mobile.png` es un concepto generado para una pantalla móvil completa; el archivo entregado mide 853 × 1844 px (proporción 0,463, equivalente al viewport de referencia 390 × 844). Se usa para jerarquía y motivos, no como captura ni como recurso visual de producción. Sus textos permanecen en HTML y la imagen no se usa como fondo.

Dirección elegida en Taste Skill: **The page is the object**. Aplicación: el pasaporte de colección y el panel de bienvenida se construyen con HTML/CSS y datos de campaña. Los planos “Drag row”, “Output slips”, “Tabbed index cards” y “Curtain footer” se adaptan o descartan porque la interfaz es una aplicación con destinos y controles persistentes, no una página editorial; no se agregan carruseles, pestañas duplicadas ni secciones ficticias.

La búsqueda de UI UX Pro Max propuso una plantilla genérica azul/naranja y tipografía Rubik/Nunito. Se rechazó ese cambio global para no borrar las dos identidades actuales. Sus recomendaciones de controles táctiles, jerarquía y estados se mantienen como criterios, mientras las paletas y tipografías reemplazables siguen en `src/lib/brand.ts`.

## Temas y assets

- **Centenario:** conserva el tono familiar y sus tokens de campaña actuales (verde bosque, terracota, papel claro y serif expresiva); composición de papel recortado y sellos de colección.
- **UniPlaza:** conserva el tono urbano y sus tokens actuales (azul profundo, bronce cálido, superficies frías y sans); cortes rectos/angulares y una lectura de recorrido al aire libre.
- Ninguno de esos valores está documentado como color oficial. Son aproximaciones ya registradas en `docs/brand-guidelines.md` y fácilmente reemplazables.
- Las portadas SVG existentes son ilustraciones de campaña, no logotipos oficiales ni fotografías del shopping. Se conservan y la marca se muestra como texto, sin el sello inventado que podía parecer un logotipo.
- El icono PWA es una marca gráfica de la campaña (estrella y pasaporte); no representa ni suplanta el logo de los centros comerciales.

### Recursos faltantes

1. Logos oficiales aprobados de ambos shoppings, preferentemente SVG/PNG con versiones para fondo claro y oscuro y zona de seguridad indicada.
2. Manuales oficiales con códigos de color, tipografías/licencias y variantes de marca.
3. Fotografías autorizadas de las instalaciones, comercios y actividades para sustituir o complementar las ilustraciones.
4. Si existe, arte final oficial de Navidad Mágica y autorización para usarlo.

## Sistema de interfaz

- Paleta y radios por shopping: variables tipadas en `src/lib/brand.ts`, inyectadas con `brandCssVariables`; no se modifica el tema mediante selector global.
- Superficies: fondo oscuro exterior de la experiencia, papel claro para lectura, una tira de colección y un bloque sólido de premio. UniPlaza cambia el corte y el carácter del panel, no solo el color.
- Tipografía: jerarquía serif/sans definida por tema; código de tarjeta siempre legible y alfanumérico. Texto corriente mínimo 13 px en la portada; controles táctiles entre 48 y 56 px cuando son acciones primarias.
- Estados: carga y fallo de consulta sin inventar datos; premio destacado muestra stock del servidor o “Agotado”; resultado de participación solo aparece después de confirmación del backend; reintento disponible ante error.
- Movimiento: se mantiene breve y se desactiva con `prefers-reduced-motion`.
- Offline: se muestra la limitación con claridad. Un giro o canje no se almacena ni se promete sin conexión.

## Flujo móvil por destino

| Destino | Prioridad | Acción principal | Datos/estado |
|---|---|---|---|
| Inicio | Shopping/campaña, explicación, pasaporte y premio disponible | Tengo una tarjeta | Campaña, premio y stock desde API; slots desde colección persistida |
| Jugar | Ruleta, código de tarjeta, elegibilidad | Girar y descubrir | POST real, espera, resultado y código de canje del servidor |
| Descubrir | Pista vigente, ubicaciones y colección distinta | Consultar pista / ir a Jugar | Pista y tarjetas de campaña |
| Premios | Premios, descripciones y disponibilidad | Abrir detalle | Stock y disponibilidad actuales, incluidos agotados |
| Mi progreso | Colección, beneficios definidos y condiciones | Ir a Jugar | Progreso persistido; no se incrementa con tarjeta repetida |

## Validación y límites de evidencia

- Playwright recorrió ambas rutas públicas, panel y rutas NFC en los viewports enumerados en `tests/responsive.spec.ts`; la suite principal pasó (7 passed, 2 skipped). El test PWA de producción pasó por separado (1 passed).
- `npm run build`, `npm run lint`, `npx tsc --noEmit` y `git diff --check` se ejecutaron. El lint mantiene dos advertencias previas de `<img>` en utilidades del panel QA.
- Se compararon capturas reales de browser con el concepto; el análisis y sus diferencias están en `docs/ux-redesign/fidelity-review.md`.
- Hay datos QA de demostración claramente rotulados; no son premios de producción. La prueba automatizada del giro con usuario QA se omitió porque no se configuraron credenciales QA de administrador.
- La prueba PWA demostró cacheo acotado a chunks estáticos y fallback offline. No se verificó instalación en dispositivo físico Android/iOS ni la disponibilidad desde una red externa.
- Los assets corporativos oficiales siguen pendientes; los temas tipográficos y paletas actuales son aproximaciones documentadas en `docs/brand-guidelines.md`.
- El entorno de desarrollo que comparte el puerto 3000 ya estaba atendiendo la app, aunque este turno no pudo inspeccionar su proceso desde PowerShell por las restricciones de socket. Las rutas locales se abrieron en el navegador; la vista respondió y mostró datos demo. Acceso desde otra IP o dispositivo no se declara probado.
- El acceso QA a la base configurada en `.env.local` falló por autenticación de PostgreSQL durante la prueba PWA inicial. No se exponen ni se cambian esas credenciales. Para compartir un Preview hace falta configurar una URL de base de datos de QA válida y el proyecto/auth de Vercel.
