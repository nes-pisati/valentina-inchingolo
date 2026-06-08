import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts')

const nextConfig = {
  // opzionale: se vuoi usare image optimization per le immagini WP
  images: {
    domains: ['your-wp-domain.com'],
  },
}

export default withNextIntl(nextConfig)