/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  distDir: '.next',
  images: {
    domains: [
      'robohash.org',
      'ipfs-gateway.soon.market',
      'media.soon.market',
      'soon.market',
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;
