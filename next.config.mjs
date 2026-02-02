/** @type {import('next').NextConfig} */
const nextConfig = {
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

if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } =
    await import('@cloudflare/next-on-pages/next-dev');
  setupDevPlatform();
}

export default nextConfig;
