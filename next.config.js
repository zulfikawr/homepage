/** @type {import('next').NextConfig} */
const NextConfigs = {
  output: 'export',
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
