import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CONTACTS } from '../../../lib/contacts'
import ContactsView from '../../../components/contatti/ContactsView'
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
  const t = await getTranslations({ locale: lang, namespace: 'contact' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `/${lang}/contatti`,
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function ContattiPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'contact' })

  return (
    <main>
      <ScrollTop />
      <ContactsView
        eyebrow={t('eyebrow')}
        headline={t('headline')}
        lead={t('lead')}
        other={{ label: t('other'), email: CONTACTS.email }}
        clockPrefix={t('clockPrefix')}
      />
    </main>
  )
}
