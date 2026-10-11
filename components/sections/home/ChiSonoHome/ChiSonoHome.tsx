import { getTranslations } from 'next-intl/server'
import MediaReveal from '../../../ui/MediaReveal/MediaReveal'
import PillButton from '../../../ui/PillButton/PillButton'
import { cx, lineTags } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './ChiSonoHome.module.css'
import portrait from '../../../../public/hp-about.jpg'

export default async function ChiSonoHome({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.chisono' })

  return (
    <section id="chisono" className={styles.section}>
      <div className={cx(l.container, l.grid, styles.inner)}>
        <MediaReveal
          className={styles.media}
          src={portrait}
          sizes="(max-width: 1024px) 100vw, 38vw"
          tone="fango"
        />

        <div className={styles.text}>
          <p className={cx(l.occh, l.occhOnInk)}>{t('occh')}</p>
          <h2 className={cx(l.h2, styles.h2)} data-rv="lines">
            {t.rich('h2', lineTags())}
          </h2>
          <p className={styles.lead} data-rv="fade">
            {t('lead')}
          </p>
          <p className={cx(l.body, styles.body)} data-rv="fade">
            {t('p')}
          </p>
          <blockquote className={styles.quote} data-rv="fade">
            <p>{t('quote')}</p>
          </blockquote>
          <div data-rv="fade">
            <PillButton variant="light" href={`/${lang}/about`} label={t('cta')} />
          </div>
        </div>
      </div>
    </section>
  )
}
