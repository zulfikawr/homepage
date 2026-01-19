/** @type {import('next').NextConfig} */
const NextConfigs = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
  allowedDevOrigins: ['dev.zulfikar.site'],
};

module.exports = NextConfigs;
