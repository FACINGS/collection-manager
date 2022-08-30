/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: '.next',
  images: {
      domains: [
        'wax.bloks.io',
        'bloks.io',
        'facings.mypinata.cloud',
        'robohash.org'
      ],
  },
}

module.exports = nextConfig
