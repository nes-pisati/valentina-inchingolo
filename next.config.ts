import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts')

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https' as const, hostname: 'picsum.photos' }],
    qualities: [75, 85],
  },
}

export default withNextIntl(nextConfig)
