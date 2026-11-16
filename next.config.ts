import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts')

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https' as const, hostname: 'picsum.photos' }],
    qualities: [75, 85],
  },
  async redirects() {
    return [
      { source: '/en', destination: '/it', permanent: true },
      { source: '/en/:path*', destination: '/it/:path*', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
