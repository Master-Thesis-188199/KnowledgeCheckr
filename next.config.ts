import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/*',
      },
    ],
  },
  devIndicators: false,
  reactStrictMode: false,
  output: 'standalone',
}

export default nextConfig
