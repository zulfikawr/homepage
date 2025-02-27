/** @type {import('next').NextConfig} */
const NextConfigs = {
  assetPrefix: './',
  // assetPrefix: '/assets',
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  output: 'export',
  compress: true,
  images: {
    // unoptimized: true,
    minimumCacheTTL: 3600,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    path: '/assets/_next/image',
  },
  compiler: {
    styledComponents: true,
    removeConsole: {
      exclude: ['log', 'error'],
    },
  },
};

module.exports = NextConfigs;
