'use client';

import { useEffect, useRef, useState } from 'react';

export function ServiceWorkerRegister() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  const updateRequested = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    let active = true;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((value) => {
      if (!active) return;
      setRegistration(value);
      if (value.waiting) setUpdateReady(true);
      value.addEventListener('updatefound', () => {
        const worker = value.installing;
        worker?.addEventListener('statechange', () => {
          if (active && worker.state === 'installed' && navigator.serviceWorker.controller) setUpdateReady(true);
        });
      });
    }).catch(() => {
      // Offline support is progressive: the connected campaign remains available without registration.
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!registration) return;
    const onControllerChange = () => {
      if (updateRequested.current) window.location.reload();
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
