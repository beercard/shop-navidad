# Registro de skills — rediseño premium PWA

Auditoría iniciada: 22-10-2026. Aplicación: Next.js 15 App Router, React 19, TypeScript, Prisma/PostgreSQL; la implementación conservará rutas, API, aislamiento tenant y lógica de premios.

| Skill | Origen | Instrucciones verificadas | Estado | Responsable | Aplicación prevista |
|---|---|---|---|---|---|
| Frontend Design (`frontend-design`) | anthropics/skills — `skills/frontend-design` | `.agents/skills/frontend-design/SKILL.md` y licencia Apache-2.0 | Disponible; leída | Principal + revisión visual | Plan de dirección, composición, tipografía y crítica antes/después; evitar patrones genéricos. |
| UI UX Pro Max (`ui-ux-pro-max`) | nextlevelbuilder/ui-ux-pro-max-skill | `.agents/skills/ui-ux-pro-max/SKILL.md`; datos/scripts locales; MIT | Disponible; leída; búsqueda local ejecutada | Dirección visual principal | Búsqueda `--design-system` para campaña retail gamificada; consultas UX/Next y tokens compatibles con las dos marcas. |
| Taste Skill (`design-taste-frontend`) | Leonxlnx/taste-skill (URL de origen corregida con autorización del usuario) | `.agents/skills/design-taste-frontend/SKILL.md` y referencias; MIT | Disponible; leída; linter baseline ejecutado | Revisión de acabado y QA | Dibujar dirección de página/app, conservar identidad de marca, inspeccionar screenshots y reportar fallos sin ocultarlos. |
| Frontend App Builder (`frontend-app-builder`) | openai/plugins — `plugins/build-web-apps/skills/frontend-app-builder` | `.agents/skills/frontend-app-builder/SKILL.md`; Apache-2.0 según manifiesto del plugin | Disponible; leída | Principal | Concepto visual, design spec, implementación por superficies y verificación navegador + comparación de imágenes. |
| Mobile UI/UX (`mobile-ui-ux`) | numen111104/mobile-ux-skills | `.agents/skills/mobile-ui-ux/SKILL.md` y referencias por tema; MIT | Disponible; leída | Principal + mobile/QA | Auditoría mobile-first; navegación, estados, accesibilidad, safe areas, escala de texto, movimiento y rendimiento. |
| PWA from Reference UI (`pwa-from-reference-ui`) | numen111104/mobile-ux-skills | `.agents/skills/pwa-from-reference-ui/SKILL.md`; MIT | Disponible; leída; uso parcial | Principal + mobile | Se usa el análisis de capturas existentes como evidencia del estado actual. No hay capturas externas de estilo objetivo; no se copiará el diseño anterior como target. |
| PWA Mobile Redesign (`pwa-mobile-redesign`) | numen111104/mobile-ux-skills | `.agents/skills/pwa-mobile-redesign/SKILL.md`; MIT | Disponible; leída | Mobile/PWA + principal | Medir baseline, preservar contrato de funcionalidades y validar paridad después del rediseño. |

## Hallazgos iniciales

- Rutas públicas separadas `/centenario` y `/uniplaza`, participación NFC/QR, páginas de QA y panel `/admin` ya existen.
- La experiencia pública obtiene campaña, premios, pistas y progreso desde APIs. La ruleta solo presenta el resultado del servidor.
- La identidad de ambas marcas está configurada en `src/lib/brand.ts`; el propio código y `docs/brand-guidelines.md` aclaran que son aproximaciones de campaña porque faltan logotipos/manuales oficiales.
- El contrato de producción, API y aislamiento de campañas/stock no se debe cambiar. Los premios demo continúan marcados como “SIN VALOR COMERCIAL”.
- El baseline inicial reporta errores ESLint en scripts de skills (código de terceros incorporado) y falló `next build` con `EPERM` al crear `.next/types`; se verificará la causa y se volverán a ejecutar tras la implementación. `npm test -- --list` sí enumeró 7 pruebas, pero no las ejecutó.
- El linter de Taste marcó 67 FAIL y 19 WARN sobre convenciones de estilo detectables; se usará como diagnóstico, no como único criterio de diseño, porque varias reglas de autor (p. ej. no gradientes/no líneas) pueden entrar en conflicto con las identidades documentadas. La accesibilidad, contenido completo y marca tienen prioridad.
- Se generó y revisó el concepto de portada móvil Centenario (`concept-centenario-mobile.png`), se extrajo la dirección “The page is the object” con Taste y se documentaron decisiones/restricciones en `design-spec.md`.
- Búsqueda de Pro Max: se rechazó su paleta genérica porque conflige con la separación de marca existente; se retuvieron sus criterios de jerarquía, controles táctiles y estados.
- Delegación solicitada: `/root/responsive` y `/root/test_audit` no pudieron ejecutar por límite de uso de Codex. `/root/brand_audit` permanece en curso; no se atribuyen cambios ni hallazgos a agentes que no entregaron.

## PWA / pruebas

La implementación añade manifiestos genérico y por shopping, iconos de campaña 192/512/maskable, `viewport-fit=cover`, registro en producción, aviso de actualización manual, página offline y cacheo acotado a chunks estáticos. Nunca cachea participación, auth, canjes o APIs privadas. Falta validar en navegador limpio, instalación real Android/iOS y build de producción. Las operaciones de premios no funcionan offline.
