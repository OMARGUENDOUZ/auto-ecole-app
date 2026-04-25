import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

// ─── En-têtes de sécurité HTTP ────────────────────────────────────────────────

const securityHeaders = [
  // Empêche l'intégration dans une iframe (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Désactive le MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Contrôle les informations du referrer envoyées
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restreint l'accès aux APIs de périphériques
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Active le préchargement DNS
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Force HTTPS pour toutes les connexions (1 an)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  /**
   * Content Security Policy
   * - default-src 'self'         → tout depuis l'origine uniquement par défaut
   * - script-src unsafe-eval/inline → requis par Next.js (hydratation)
   * - style-src unsafe-inline    → requis par Tailwind CSS / styled-jsx
   * - img-src data: blob:        → images base64 + blobs (photos candidats)
   * - font-src 'self'            → polices locales uniquement
   * - connect-src localhost:8080 → requêtes API vers le backend en dev
   *
   * NOTE: En production, remplacer localhost:8080 par l'URL du backend réel
   * et envisager de supprimer 'unsafe-eval' / 'unsafe-inline' si possible.
   */
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://tariqi-1.onrender.com",
    ].join('; '),
  },
];

// ─── Configuration Next.js ────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  // Compression gzip/brotli des réponses
  compress: true,
  // Supprime l'en-tête "X-Powered-By: Next.js" (fingerprinting)
  poweredByHeader: false,
  // Active le mode strict React (double render en dev pour détecter les effets de bord)
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // ─── Optimisations de compilation ────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-label',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  'lucide-react',
  'date-fns',
  'recharts',
],
  },
  // ─── Proxy API pour éviter les erreurs CORS en développement ────────────────
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/v1/:path*',
          destination: 'http://localhost:8080/api/v1/:path*',
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Applique les headers à toutes les routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
