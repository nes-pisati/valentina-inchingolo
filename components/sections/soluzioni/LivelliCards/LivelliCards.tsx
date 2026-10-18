import { getTranslations } from 'next-intl/server'
import { formatPrice } from '../../../../lib/formatPrice'
import type { Price, Prices } from '../../../../lib/prices'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import styles from './LivelliCards.module.css'

type Props = {
  lang: string
  prices: Prices
}

type Level = {
  n: 1 | 2 | 3
  anchor: string
  price: Price | null
}

export default async function LivelliCards({ lang, prices }: Props) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni' })

  const levels: Level[] = [
    { n: 1, anchor: 'checklist', price: { amount: 0, compareAt: null } },
    { n: 2, anchor: 'minikit', price: prices.minikit },
    { n: 3, anchor: 'consulenza', price: null },
  ]

  return (
    <section id="scala" className={styles.section}>
      <div className={l.container}>
        <header className={cx(l.grid, styles.head)}>
          <div className={styles.headTitle}>
            <p className={l.occh}>{t('livelli.occh')}</p>
            <h2 className={cx(l.h2, styles.h2)} data-rv="lines">
              {t.rich('livelli.h2', lineTags())}
            </h2>
          </div>
          <p className={styles.note}>{t('livelli.note')}</p>
        </header>

        <div className={styles.cols} data-ladder>
          {levels.map(level => {
            const featured = level.n === 2
            return (
              <a
                key={level.n}
                href={`#${level.anchor}`}
                className={cx(styles.card, featured && styles.featured)}
                data-card
                data-hover="card"
              >
                <span className={styles.wipe} data-wipe aria-hidden="true" />

                <div className={styles.top} data-card-part>
                  <span className={styles.num}>{`0${level.n}`}</span>
                  <span className={styles.segs} aria-hidden="true">
                    {levels.map(({ n: i }) => (
                      <span
                        key={i}
                        className={styles.seg}
                        data-seg
                        data-filled={i <= level.n ? '' : undefined}
                      />
                    ))}
                  </span>
                </div>

                <div className={styles.body} data-card-part>
                  <p className={styles.k}>{t(`livelli.${level.n}.k`)}</p>
                  <h3 className={styles.t}>{t(`livelli.${level.n}.t`)}</h3>
                  <p className={styles.p}>{t(`livelli.${level.n}.p`)}</p>
                </div>

                <div className={styles.foot} data-card-part>
                  <div className={styles.price}>
                    <span className={styles.amountRow}>
                      <span className={styles.amount}>
                        {level.price ? formatPrice(level.price.amount, lang) : t('idx.3.p')}
                      </span>
                      {level.price?.compareAt && (
                        <s className={styles.was}>{formatPrice(level.price.compareAt, lang)}</s>
                      )}
                    </span>
                    <span className={styles.priceLabel}>{t(`livelli.${level.n}.priceLabel`)}</span>
                  </div>
                  <span className={styles.go} aria-hidden="true">
                    <svg className={styles.arrow} data-arrow viewBox="0 0 16 16">
                      <path d="M3 13 13 3M5 3h8v8" />
                    </svg>
                  </span>
                  <span className={l.srOnly}>{t(`livelli.${level.n}.go`)}</span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
