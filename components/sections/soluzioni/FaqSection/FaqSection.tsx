import { getTranslations } from 'next-intl/server'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import styles from './FaqSection.module.css'

type Item = { q: string; a: string }

export default async function FaqSection({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni.faq' })
  const items = t.raw('items') as Item[]

  return (
    <section id="faq" className={styles.section}>
      <div className={cx(l.container, l.grid)}>
        <div className={styles.head}>
          <p className={l.occh}>{t('occh')}</p>
          <h2 className={l.h2} data-rv="lines">
            {t.rich('h2', lineTags())}
          </h2>
        </div>

        <div className={styles.list}>
          {items.map(item => (
            <details key={item.q} className={styles.item} data-faq>
              <summary className={styles.summary}>
                <span>{item.q}</span>
                <span className={styles.icon} aria-hidden="true">
                  <span className={styles.hbar} />
                  <span className={styles.vbar} data-faq-vbar />
                </span>
              </summary>
              <div className={styles.answer} data-faq-answer>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
