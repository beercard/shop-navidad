import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  devIndicators: false,
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  // Evita que el watcher de dev reaccione a escrituras de la base QA local y artefactos de prueba.
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = { ...config.watchOptions, ignored: ['**/node_modules/**', '**/.git/**', '**/.qa-postgres/**', '**/test-results/**', '**/.vercel/**'] };
    }
    return config;
  },
};
export default nextConfig;
