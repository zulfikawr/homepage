/** @type {import('next').NextConfig} */
const NextConfigs = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 14400,
    qualities: [75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
  allowedDevOrigins: ['dev.zulfikar.site'],
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    return config;
  },
};

module.exports = NextConfigs;
