import { getTranslations } from 'next-intl/server'
import PillButton from '../../../ui/PillButton/PillButton'
import { cx, lineTags } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './HomeHero.module.css'

type Item = { t: string; k: string }

export default async function HomeHero({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.hero' })
  const items = t.raw('items') as Item[]

  return (
    <section id="top" className={styles.hero}>
      <div className={cx(l.container, l.grid, styles.inner)}>
        <p className={cx(l.occh, styles.kick)} data-rv="fade">
          {t('kick')}
        </p>

        <h1 className={styles.title} data-hero-title>
          {t.rich('title', lineTags())}
        </h1>

        <div className={styles.intro}>
          <p className={cx(l.lead, styles.lead)} data-rv="fade">
            {t('lead')}
          </p>
          <div data-rv="fade">
            <PillButton href="#percorsi" label={t('cta')} />
          </div>
        </div>

        <div className={styles.index}>
          <p className={styles.idxLabel} data-rv="fade">
            {t('idx')}
          </p>
          <ol className={styles.idxList} data-rv="rows">
            {items.map((item, i) => (
              <li key={item.t} className={styles.idxItem}>
                <span className={styles.idxNum}>{`0${i + 1}`}</span>
                <span className={styles.idxTitle}>{item.t}</span>
                <span className={styles.idxSub}>{item.k}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
