/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.ytimg.com', 'via.placeholder.com', 'yt3.ggpht.com'],
  },
}

module.exports = nextConfig
