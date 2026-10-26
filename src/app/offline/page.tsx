import Link from 'next/link';

export const metadata = { title: 'Sin conexión · Navidad Mágica' };

export default function OfflinePage() {
  return <main className="offline-page">
    <svg className="offline-mark" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#203f34" /><path d="m24 12 2.6 6.4 6.9.5-5.3 4.4 1.7 6.7L24 26.6l-5.9 3.4 1.7-6.7-5.3-4.4 6.9-.5z" fill="#e4c17c" /></svg>
    <p>Navidad Mágica</p>
    <h1>Te quedaste sin conexión</h1>
    <p>Cuando vuelva internet podés volver a la campaña. Los giros y canjes necesitan respuesta del servidor, así que no se registran sin conexión.</p>
    <Link href="/">Volver a intentar</Link>
  </main>;
}
