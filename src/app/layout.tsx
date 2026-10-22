import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Navidad Mágica | Centenario + UniPlaza',
  description: 'Encontrá el tesoro, girá y ganá premios en tu shopping.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
