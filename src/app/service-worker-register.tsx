'use client';

import { useEffect, useRef, useState } from 'react';

export function ServiceWorkerRegister() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  const updateRequested = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    let active = true;
    const hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then((value) => {
      if (!active) return;
      setRegistration(value);
      value.update().catch(() => {});
      if (value.waiting) {
        setUpdateReady(true);
        updateRequested.current = true;
        value.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      value.addEventListener('updatefound', () => {
        const worker = value.installing;
        worker?.addEventListener('statechange', () => {
          if (active && worker.state === 'installed' && hadController) {
            setUpdateReady(true);
            updateRequested.current = true;
            worker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(() => {
      // Offline support is progressive: the connected campaign remains available without registration.
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!registration) return;
    let reloaded = false;
    const onControllerChange = () => {
      if (!reloaded && updateRequested.current) {
        reloaded = true;
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, [registration]);

  function applyUpdate() {
    updateRequested.current = true;
    registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  }

  if (!updateReady) return null;
  return <aside className="pwa-update" role="status" aria-live="polite">
    <span>Hay una versión nueva de la campaña.</span>
    <button onClick={applyUpdate}>Actualizar</button>
  </aside>;
}
