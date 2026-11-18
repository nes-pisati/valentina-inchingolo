import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LegalPage, { type LegalContent } from '../../../components/legal/LegalPage'
import ScrollTop from '../../../components/ui/ScrollTop'

export function generateStaticParams() {
  return [{ lang: 'it' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'legal.privacy' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `/${lang}/privacy`,
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'legal' })
  const content = t.raw('privacy') as LegalContent

  return (
    <main>
      <ScrollTop />
      <LegalPage content={content} />
    </main>
  )
}
