function isLanIpv4(hostname: string) {
  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return octets[0] === 10 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168);
}

export function getPublicBaseUrl() {
  const previewHost = process.env.VERCEL_ENV === 'preview' ? (process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL) : undefined;
  const value = (previewHost ? `https://${previewHost}` : process.env.APP_BASE_URL)?.trim();
  if (!value) throw new Error('APP_BASE_URL es necesaria para crear enlaces QR y NFC.');
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('APP_BASE_URL debe ser una URL absoluta válida.'); }
  const hostname = url.hostname.toLowerCase();
  if (url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) throw new Error('APP_BASE_URL no debe incluir credenciales, query, fragmento ni una ruta.');
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') throw new Error('No uses localhost: un QR escaneado desde el teléfono debe apuntar a la IP LAN o al dominio.');
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && (isLanIpv4(hostname) || hostname.endsWith('.local')))) {
    throw new Error('APP_BASE_URL debe usar HTTPS; solo se permite HTTP dentro de una IP o dominio privado de la red local.');
  }
  return url.origin;
}
