export function qaDatabaseUrl() {
  if (process.env.NODE_ENV === 'production') throw new Error('QA tools are disabled in production.');
  if (process.env.QA_MODE !== 'true') throw new Error('QA_MODE must be explicitly enabled.');
  const primaryUrl = process.env.DATABASE_URL;
  const isolatedUrl = process.env.QA_DATABASE_URL;
  if (!primaryUrl || !isolatedUrl) throw new Error('DATABASE_URL and QA_DATABASE_URL are both required.');
  let primary: URL;
  let isolated: URL;
  try { primary = new URL(primaryUrl); isolated = new URL(isolatedUrl); }
  catch { throw new Error('QA database URLs must be valid PostgreSQL connection URLs.'); }
  const primaryDatabase = primary.pathname.replace(/^\//, '');
  const isolatedDatabase = isolated.pathname.replace(/^\//, '');
  if (primary.protocol !== 'postgresql:' && primary.protocol !== 'postgres:') throw new Error('DATABASE_URL must point to PostgreSQL.');
  if (isolated.protocol !== 'postgresql:' && isolated.protocol !== 'postgres:') throw new Error('QA_DATABASE_URL must point to PostgreSQL.');
  if (!/(^|[_-])(qa|test)([_-]|$)/i.test(isolatedDatabase)) throw new Error('QA_DATABASE_URL database name must include a distinct qa or test segment.');
  const normalizedHost = (host: string) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(host.toLowerCase()) ? 'loopback' : host.toLowerCase();
  if (normalizedHost(primary.host) === normalizedHost(isolated.host) && primaryDatabase.toLowerCase() === isolatedDatabase.toLowerCase()) throw new Error('QA_DATABASE_URL must identify a different database from DATABASE_URL.');
  return isolatedUrl;
}

export function isQaEnvironmentReady() {
  try { qaDatabaseUrl(); return true; }
  catch { return false; }
}
