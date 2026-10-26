// Manifiesto de la portada (/): identidad de instalación propia del selector de shopping.
// Cada shopping tiene su manifiesto estático (public/manifest-*.webmanifest) con scope y start_url propios.
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Navidad Mágica',
    short_name: 'Navidad Mágica',
    description: 'El recorrido de tarjetas y premios de Centenario Shopping y UniPlaza Shopping.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fffdf8',
    theme_color: '#203f34',
    icons: [
      { src: '/pwa/navidad-magica-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa/navidad-magica-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/pwa/navidad-magica-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
