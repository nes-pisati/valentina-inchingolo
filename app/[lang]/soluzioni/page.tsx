import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import SoluzioniMotion from '../../../components/sections/soluzioni/SoluzioniMotion/SoluzioniMotion'
import SoluzioniHero from '../../../components/sections/soluzioni/SoluzioniHero/SoluzioniHero'
import ProductMarquee from '../../../components/sections/soluzioni/ProductMarquee/ProductMarquee'
import LivelliCards from '../../../components/sections/soluzioni/LivelliCards/LivelliCards'
import ChecklistSection from '../../../components/sections/soluzioni/ChecklistSection/ChecklistSection'
import MiniKitSection from '../../../components/sections/soluzioni/MiniKitSection/MiniKitSection'
import ConfrontoTable from '../../../components/sections/soluzioni/ConfrontoTable/ConfrontoTable'
import ConsulenzaCta from '../../../components/sections/soluzioni/ConsulenzaCta/ConsulenzaCta'
import FaqSection from '../../../components/sections/soluzioni/FaqSection/FaqSection'
import ScrollTop from '../../../components/ui/ScrollTop'
import { getPrices } from '../../../lib/prices'
import styles from '../../../components/sections/soluzioni/soluzioni.module.css'

export const revalidate = 3600

export function generateStaticParams() {
  return [{ lang: 'it' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `/${lang}/soluzioni`,
      languages: { it: '/it/soluzioni', en: '/en/soluzioni' },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function SoluzioniPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const prices = await getPrices()

  return (
    <SoluzioniMotion className={styles.page}>
      <ScrollTop />
      <SoluzioniHero lang={lang} prices={prices} />
      <ProductMarquee lang={lang} />
      <LivelliCards lang={lang} prices={prices} />
      <ChecklistSection lang={lang} />
      <MiniKitSection lang={lang} price={prices.minikit} />
      <ConfrontoTable lang={lang} price={prices.minikit} />
      <ConsulenzaCta lang={lang} />
      <FaqSection lang={lang} />
    </SoluzioniMotion>
  )
}
