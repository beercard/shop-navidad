import type { ReactNode } from 'react';

export const metadata = { manifest: '/manifest-centenario.webmanifest' };
export const viewport = { themeColor: '#203f34' };

export default function CentenarioLayout({ children }: { children: ReactNode }) {
  return children;
}
