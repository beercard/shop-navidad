/* Iconos del portal de comercios. Decorativos por defecto (aria-hidden); el texto visible los nombra. */
import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false };

export const ScanIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" /></svg>;
export const KeyboardIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></svg>;
export const CheckIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
export const AlertIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="M12 4 3 20h18L12 4Z" /><path d="M12 10v4M12 17.5h.01" /></svg>;
export const ClockIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const ListIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>;
export const ShieldIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
export const WifiOffIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="M3 3l18 18M8.5 8.8A11 11 0 0 0 3 12M12 6a15 15 0 0 1 9 3M5.5 15.5a9 9 0 0 1 5-2.3M16 14a7 7 0 0 1 3 2M12 19h.01" /></svg>;
export const SwitchCameraIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="M4 8h3l2-2h6l2 2h3v11H4V8Z" /><path d="M9.5 13a2.7 2.7 0 0 1 4.6-1.4M14.5 13a2.7 2.7 0 0 1-4.6 1.4M13.5 10.5v1.4h-1.4M10.5 15.5v-1.4h1.4" /></svg>;
export const LogoutIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props}><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 8l4 4-4 4M19 12H9" /></svg>;
export const SpinnerIcon = (props: SVGProps<SVGSVGElement>) => <svg {...base} {...props} data-spin="true"><path d="M12 3a9 9 0 1 0 9 9" /></svg>;
