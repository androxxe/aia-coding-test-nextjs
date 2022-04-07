/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: true,
  images: {
    domains: ['live.staticflickr.com'],
  },
}

module.exports = nextConfig
