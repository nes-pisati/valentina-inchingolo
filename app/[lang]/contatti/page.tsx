import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CONTACTS } from '../../../lib/contacts'
import ContactsView, { type RowData } from '../../../components/contatti/ContactsView'
import ScrollTop from '../../../components/ui/ScrollTop'

export function generateStaticParams() {
  return [{ lang: 'it' }, { lang: 'en' }]
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
      languages: { it: '/it/contatti', en: '/en/contatti' },
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

  const phoneSet = CONTACTS.phone.trim().length > 0

  const rows: RowData[] = [
    {
      key: 'email',
      num: '01',
      label: t('rows.email.label'),
      value: CONTACTS.email,
      href: `mailto:${CONTACTS.email}`,
      kind: 'mail',
      copy: {
        label: t('rows.email.copy'),
        copied: t('rows.email.copied'),
        aria: t('rows.email.copyAria'),
      },
    },
    {
      key: 'phone',
      num: '02',
      label: t('rows.phone.label'),
      value: phoneSet ? CONTACTS.phone : '',
      href: phoneSet ? `tel:${CONTACTS.phone.replace(/\s/g, '')}` : null,
      kind: 'tel',
    },
    {
      key: 'linkedin',
      num: '03',
      label: t('rows.linkedin.label'),
      value: CONTACTS.linkedinHandle,
      href: CONTACTS.linkedinUrl,
      kind: 'ext',
      external: true,
      hint: t('rows.linkedin.hint'),
    },
  ]

  return (
    <main>
      <ScrollTop />
      <ContactsView
        index={t('index')}
        eyebrow={t('eyebrow')}
        headline={t('headline')}
        subhead={t('subhead')}
        rows={rows}
        baseline={{
          descriptor: t('baseline.descriptor'),
          clockPrefix: t('baseline.clockPrefix'),
        }}
      />
    </main>
  )
}
