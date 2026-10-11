import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { cx } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './Approccio.module.css'

type Item = { word: string; line: string }

export default async function Approccio({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.approccio' })
  const items = t.raw('items') as Item[]

  return (
    <section className={styles.section} aria-labelledby="approccio-head">
      <div className={l.container}>
        <p id="approccio-head" className={l.occh}>
          {t('occh')}
        </p>

        <ol className={styles.list}>
          {items.map((item, i) => (
            <li key={item.word} className={cx(l.grid, styles.row)} data-fill-row>
              <span className={styles.num}>{`0${i + 1}`}</span>
              <h3 className={styles.word}>
                <span className={styles.outline}>{item.word}</span>
                <span className={styles.fill} data-fill aria-hidden="true">
                  {item.word}
                </span>
              </h3>
              <p className={styles.line} data-rv="fade">
                {t.rich(`items.${i}.line`, {
                  ink: (chunks: ReactNode) => <em className={l.accent}>{chunks}</em>,
                })}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
