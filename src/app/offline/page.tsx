import Link from 'next/link';

export const metadata = { title: 'Sin conexión · Navidad Mágica' };

export default function OfflinePage() {
  return <main className="offline-page">
    <p>Navidad Mágica</p>
    <h1>Te quedaste sin conexión</h1>
    <p>Cuando vuelva internet vas a poder consultar la campaña. Los giros y canjes necesitan una respuesta del servidor y no se registran sin conexión.</p>
    <Link href="/">Volver a intentar</Link>
  </main>;
}
