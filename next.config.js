/** @type {import('next').NextConfig} */
const NextConfigs = {
  // assetPrefix: './',
  // output: 'export',
  images: {
    // unoptimized: true,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    path: '/_next/image',
  },
};

module.exports = NextConfigs;
