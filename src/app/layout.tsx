import type { Metadata, Viewport } from 'next';
import { DM_Mono, DM_Sans, Playfair_Display } from 'next/font/google';
import './design-tokens.css';
import './globals.css';
import { ServiceWorkerRegister } from './service-worker-register';

// Fuentes autoalojadas por next/font: brand.ts las nombraba pero nunca se cargaban (se veían Georgia/Arial).
const sans = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-dm-sans' });
const serif = Playfair_Display({ subsets: ['latin'], display: 'swap', weight: ['500', '600', '700'], variable: '--font-playfair' });
const mono = DM_Mono({ subsets: ['latin'], display: 'swap', weight: ['400', '500'], variable: '--font-dm-mono' });

export const metadata: Metadata = {
  title: 'Navidad Mágica | Centenario + UniPlaza',
  description: 'Encontrá el tesoro, girá y ganá premios en tu shopping.',
  appleWebApp: { capable: true, title: 'Navidad Mágica', statusBarStyle: 'default' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#203f34' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={`${sans.variable} ${serif.variable} ${mono.variable}`}><body>{children}<ServiceWorkerRegister /></body></html>;
}
