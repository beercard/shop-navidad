import type { ReactNode } from 'react';

export const metadata = { manifest: '/manifest-uniplaza.webmanifest' };
export const viewport = { themeColor: '#203e4d' };

export default function UniPlazaLayout({ children }: { children: ReactNode }) {
  return children;
}
