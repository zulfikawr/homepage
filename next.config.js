/** @type {import('next').NextConfig} */
const NextConfigs = {
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
};

module.exports = NextConfigs;
