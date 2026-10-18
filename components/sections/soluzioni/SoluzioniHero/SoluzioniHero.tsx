import { getTranslations } from 'next-intl/server'
import RollText from '../../../motion/RollText/RollText'
import { formatPrice } from '../../../../lib/formatPrice'
import type { Prices } from '../../../../lib/prices'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import styles from './SoluzioniHero.module.css'

type Props = {
  lang: string
  prices: Prices
}

export default async function SoluzioniHero({ lang, prices }: Props) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni' })

  const items = [
    { n: 1, anchor: 'checklist', price: formatPrice(0, lang) },
    { n: 2, anchor: 'minikit', price: formatPrice(prices.minikit.amount, lang) },
    { n: 3, anchor: 'consulenza', price: t('idx.3.p') },
  ]

  return (
    <section id="top" className={styles.hero} data-hero>
      <div className={cx(l.container, l.grid, styles.inner)}>
        <p className={cx(l.occh, styles.kick)} data-hero-kick>
          {t('hero.kick')}
        </p>

        <h1 className={styles.title} data-hero-title>
          {t.rich('hero.title', lineTags())}
        </h1>

        <p className={cx(l.lead, styles.lead)} data-hero-fade>
          {t('hero.lead')}
        </p>

        <nav className={styles.index} aria-labelledby="soluzioni-idx">
          <p id="soluzioni-idx" className={styles.idxLabel} data-hero-fade>
            {t('hero.idx')}
          </p>
          <ol className={styles.idxList}>
            {items.map(item => (
              <li key={item.n} className={styles.idxItem} data-idx-item>
                <a href={`#${item.anchor}`} className={styles.idxLink} data-hover="idx">
                  <span className={styles.idxNum}>{`0${item.n}`}</span>
                  <span className={styles.idxTitle}>
                    <RollText text={t(`idx.${item.n}.t`)} />
                  </span>
                  <span className={styles.idxSub}>{t(`idx.${item.n}.k`)}</span>
                  <span className={styles.idxPrice}>{item.price}</span>
                  <span className={styles.idxBar} data-idx-bar aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  )
}
