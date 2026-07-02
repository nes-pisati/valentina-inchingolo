import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AboutHero from '../../../components/sections/about/AboutHero/AboutHero'
import AboutBio from '../../../components/sections/about/AboutBio/AboutBio'
import Lenti from '../../../components/sections/about/Lenti/Lenti'
import EsperienzaBand from '../../../components/sections/about/EsperienzaBand/EsperienzaBand'
import Percorso from '../../../components/sections/about/Percorso/Percorso'
import AboutCta from '../../../components/sections/about/AboutCta/AboutCta'
import Marquee from '../../../components/sections/Marquee/Marquee'

export function generateStaticParams() {
  return [{ lang: 'it' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'about' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `/${lang}/about`,
      languages: { it: '/it/about', en: '/en/about' },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'about' })

  return (
    <main>
      <AboutHero />
      <AboutBio />
      <Lenti />
      <EsperienzaBand />
      <Percorso />
      <Marquee
        variant="cipria"
        words={t.raw('tools.words') as string[]}
        label={t('tools.label')}
      />
      <AboutCta />
    </main>
  )
}
