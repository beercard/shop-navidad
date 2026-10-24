# Portal de validación de comercios

El portal de operadores está disponible en `/merchant`. Cada cuenta validadora se asigna en el panel a un único comercio y a un único shopping; el backend deriva el alcance de la sesión y no confía en un comercio elegido por el navegador.

## Operación

1. El administrador general crea el comercio y asigna los premios habilitados para canje.
2. Crea un usuario con rol **Comercio validador**, un único shopping y un único comercio.
3. El operador ingresa en `/merchant`, escanea el QR o escribe el código.
4. La consulta muestra el premio, la campaña, el vencimiento y el código enmascarado. La consulta no consume el cupón.
5. El operador confirma la entrega. La API vuelve a validar comercio, shopping, campaña y vigencia dentro de una transacción. Un reintento de la misma cuenta sobre un canje que ya confirmó se responde idempotentemente.
6. En **Historial** ve canjes del comercio asignado, rango de fechas, operador y el total confirmado en el día. No se expone el código completo ni datos de contacto del cliente.

La cámara se solicita únicamente al tocar **Escanear QR**, requiere HTTPS en dispositivos externos (localhost es un contexto seguro) y se detiene al leer un código o cerrar el lector. Si el navegador no habilita cámara, se puede usar la entrada manual.

## Accesos y seguridad

- El administrador puede activar o suspender una cuenta. Suspenderla revoca sesiones existentes.
- Desde Usuarios, el superadministrador puede generar una contraseña temporal para un validador. Se muestra una sola vez en el panel; debe entregarse por un canal privado y el operador puede cambiarla desde **Seguridad**.
- El cambio de contraseña requiere la contraseña actual, registra auditoría, rota la versión de sesión y mantiene la sesión actual activa.
- Las respuestas privadas de sesión e historial usan `Cache-Control: private, no-store`; el service worker excluye API y portal de comercios de caché.
- La contraseña temporal no se escribe en logs ni en auditoría. El restablecimiento no envía correo: el proyecto no tiene proveedor de correo transaccional configurado.
- Las cuentas compartidas permiten acceso de todo el equipo del local, pero la auditoría identifica la cuenta compartida, no a cada empleado individual. No se solicita ni almacena información personal adicional del operador.

## Configuración local y migración

El portal usa las variables ya requeridas por la aplicación: `DATABASE_URL`, `AUTH_SECRET` y `CODE_ENCRYPTION_KEY`. No agregues secretos al repositorio. La cámara en teléfono requiere servir la aplicación por HTTPS.

Para aplicar la migración de sesión en una base ya configurada:

```powershell
npm run db:generate
npm run db:migrate:deploy
```

Para la base aislada de QA, con el PostgreSQL local QA ejecutándose y las variables de QA configuradas en el entorno:

```powershell
npm run qa:migrate
npm run test:qa
```

La migración agrega `sessionVersion` a usuarios administrativos; no modifica campañas, premios ni inventario.

## Pruebas de aceptación cubiertas

La prueba Playwright QA recorre el portal de punta a punta: login del validador, asignación de shopping, rechazo de otro comercio, alternativa manual cuando la cámara falla, consulta sin canje, confirmación, reintento idempotente, historial con código enmascarado, contraseña temporal generada por el admin y cambio de contraseña del operador. Para QR de cliente comprueba que la API entregue un QR generado con el código persistido por el servidor.

La prueba automatizada simula una cámara no disponible; el escaneo físico debe verificarse además en un teléfono con HTTPS y permisos de cámara habilitados.
