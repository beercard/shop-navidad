import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from './service-worker-register';
export const metadata: Metadata = {
  title: 'Navidad Mágica | Centenario + UniPlaza',
  description: 'Encontrá el tesoro, girá y ganá premios en tu shopping.',
  appleWebApp: { capable: true, title: 'Navidad Mágica', statusBarStyle: 'default' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#203f34' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}<ServiceWorkerRegister /></body></html>;
}
