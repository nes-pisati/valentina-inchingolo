import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HomeMotion from '../../components/sections/home/HomeMotion/HomeMotion'
import HomeIntro from '../../components/sections/home/HomeIntro/HomeIntro'
import HomeHero from '../../components/sections/home/HomeHero/HomeHero'
import ExpandMedia from '../../components/sections/ExpandMedia/ExpandMedia'
import Percorsi from '../../components/sections/home/Percorsi/Percorsi'
import ProductMarquee, {
  type MarqueeItem,
} from '../../components/sections/soluzioni/ProductMarquee/ProductMarquee'
import Approccio from '../../components/sections/home/Approccio/Approccio'
import HomeMetodo from '../../components/sections/home/HomeMetodo/HomeMetodo'
import SoluzioniSintesi from '../../components/sections/home/SoluzioniSintesi/SoluzioniSintesi'
import ChecklistOptin from '../../components/sections/home/ChecklistOptin/ChecklistOptin'
// DISATTIVATO — i progetti escono dal sito in questa fase (route /[lang]/progetti in `_progetti`).
// import ProgettiList from '../../components/sections/ProgettiList/ProgettiList'
import ChiSonoHome from '../../components/sections/home/ChiSonoHome/ChiSonoHome'
import Parliamone from '../../components/sections/home/Parliamone/Parliamone'
import ScrollTop from '../../components/ui/ScrollTop'
import { getPrices } from '../../lib/prices'
import styles from '../../components/sections/soluzioni/soluzioni.module.css'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'home.meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${lang}`,
      languages: { it: '/it', en: '/en' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [t, prices] = await Promise.all([
    getTranslations({ locale: lang, namespace: 'home' }),
    getPrices(),
  ])

  return (
    <HomeMotion className={styles.page}>
      <ScrollTop />
      <HomeIntro lang={lang} />
      <HomeHero lang={lang} />
      <ExpandMedia />
      <Percorsi lang={lang} />
      <ProductMarquee lang={lang} items={t.raw('marquee') as MarqueeItem[]} />
      <Approccio lang={lang} />
      <HomeMetodo lang={lang} />
      <SoluzioniSintesi lang={lang} prices={prices} />
      <ChecklistOptin lang={lang} />
      {/* DISATTIVATO — sezione Progetti nascosta in questa fase */}
      {/* <ProgettiList /> */}
      <ChiSonoHome lang={lang} />
      <Parliamone lang={lang} />
    </HomeMotion>
  )
}
