import { getTranslations } from 'next-intl/server'
import PillButton from '../../../ui/PillButton/PillButton'
import { formatPrice } from '../../../../lib/formatPrice'
import type { Prices } from '../../../../lib/prices'
import { cx, lineTags } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import c from '../../soluzioni/LivelliCards/LivelliCards.module.css'
import styles from './SoluzioniSintesi.module.css'

type Card = { k: string; t: string; p: string; go: string; price?: string }

type Props = {
  lang: string
  prices: Prices
}

const ANCHORS = ['checklist', 'minikit', 'consulenza'] as const

export default async function SoluzioniSintesi({ lang, prices }: Props) {
  const t = await getTranslations({ locale: lang, namespace: 'home.soluzioni' })
  const cards = t.raw('cards') as Card[]

  // Mini-Kit: solo il prezzo, mai il barrato (handoff 0.5 / addendum 1.4).
  const amounts = [formatPrice(0, lang), formatPrice(prices.minikit.amount, lang), cards[2]?.price]

  return (
    <section id="soluzioni" className={styles.section}>
      <div className={l.container}>
        <header className={cx(l.grid, styles.head)}>
          <div className={styles.headTitle}>
            <p className={l.occh}>{t('occh')}</p>
            <h2 className={cx(l.h2, styles.h2)} data-rv="lines">
              {t.rich('h2', lineTags())}
            </h2>
          </div>
          <p className={cx(l.body, styles.note)} data-rv="fade">
            {t('note')}
          </p>
        </header>

        <div className={styles.cols} data-ladder>
          {cards.map((card, i) => {
            const n = i + 1
            return (
              <a
                key={card.t}
                href={`/${lang}/soluzioni#${ANCHORS[i]}`}
                className={cx(c.card, styles.card, n === 2 && c.featured)}
                data-card
                data-hover="card"
              >
                <span className={c.wipe} data-wipe aria-hidden="true" />

                <div className={c.top} data-card-part>
                  <span className={c.num}>{`0${n}`}</span>
                  <span className={c.segs} aria-hidden="true">
                    {[1, 2, 3].map(s => (
                      <span
                        key={s}
                        className={c.seg}
                        data-seg
                        data-filled={s <= n ? '' : undefined}
                      />
                    ))}
                  </span>
                </div>

                <div className={c.body} data-card-part>
                  <p className={c.k}>{card.k}</p>
                  <h3 className={c.t}>{card.t}</h3>
                  <p className={c.p}>{card.p}</p>
                </div>

                <div className={c.foot} data-card-part>
                  <span className={c.amount}>{amounts[i]}</span>
                  <span className={c.go} aria-hidden="true">
                    <svg className={c.arrow} data-arrow viewBox="0 0 16 16">
                      <path d="M3 13 13 3M5 3h8v8" />
                    </svg>
                  </span>
                  <span className={l.srOnly}>{card.go}</span>
                </div>
              </a>
            )
          })}
        </div>

        <div className={styles.foot} data-rv="fade">
          <p className={styles.caption}>{t('caption')}</p>
          <PillButton href={`/${lang}/soluzioni`} label={t('cta')} />
        </div>
      </div>
    </section>
  )
}
