/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  experimental: {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: '50mb',
    },
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
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  allowedDevOrigins: ['dev.zulfikar.site'],

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

export default nextConfig;
