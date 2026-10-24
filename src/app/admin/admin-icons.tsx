/* Iconos SVG del panel (reemplazan glifos de texto). Decorativos: el nombre visible va al lado. */
import type { ReactElement } from "react";

const paths: Record<string, ReactElement> = {
  overview: <path d="M3 11.5 12 4l9 7.5M5.5 10V20h13V10" />,
  campaigns: <path d="M5 21V4M5 5h11l-1.5 3.5L16 12H5" />,
  prizes: <path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" />,
  cards: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  locations: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  merchants: <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5a2.700 2.700 0 0 0 5.300 0 2.700 2.700 0 0 0 5.400 0 2.700 2.700 0 0 0 5.300 0M5 12.500V20h14v-7.500M10 20v-4h4v4" />,
  redeems: <><circle cx="12" cy="12" r="9" /><path d="m8 12.500 3 3 5-6" /></>,
  audit: <path d="M9 4h6l1 2h3v14H5V6h3l1-2ZM9 12h6M9 16h4" />,
  users: <><circle cx="9" cy="8.500" r="3.500" /><path d="M2.500 20a6.500 6.500 0 0 1 13 0M16 5.300a3.500 3.500 0 0 1 0 6.400M18 14.200A6.500 6.500 0 0 1 21.500 20" /></>,
  experience: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.600 5.600l2.100 2.100M16.300 16.300l2.100 2.100M5.600 18.400l2.100-2.100M16.300 7.700l2.100-2.100" /><circle cx="12" cy="12" r="2.500" /></>,
  clues: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.6.5 1 1.200 1 2V16h5v-.1c0-.8.4-1.500 1-2A6 6 0 0 0 12 3Z" />,
  participants: <><circle cx="10" cy="8" r="3.500" /><path d="M3 20a7 7 0 0 1 14 0M16 12.500l2 2 3.500-4" /></>,
  reports: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

export function AdminIcon({ name }: { name: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] ?? paths.overview}</svg>;
}
