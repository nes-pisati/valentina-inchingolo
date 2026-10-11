import { getTranslations } from 'next-intl/server'
import { cx, lineTags } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './Percorsi.module.css'

const PATHS = [
  { key: 'a', letter: 'A', anchor: 'checklist', event: 'home_percorso_prelancio' },
  { key: 'b', letter: 'B', anchor: 'minikit', event: 'home_percorso_postlancio' },
] as const

export default async function Percorsi({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.percorsi' })

  return (
    <section id="percorsi" className={styles.section}>
      <div className={l.container}>
        <header className={styles.head}>
          <p className={l.occh}>{t('occh')}</p>
          <h2 className={cx(l.h2, styles.h2)} data-rv="lines">
            {t.rich('h2', lineTags())}
          </h2>
        </header>

        <div className={styles.cols} data-ladder>
          {PATHS.map(path => (
            <a
              key={path.key}
              href={`/${lang}/soluzioni#${path.anchor}`}
              className={cx(styles.card, path.key === 'b' && styles.featured)}
              data-card
              data-hover="card"
              data-track={path.event}
            >
              <span className={styles.wipe} data-wipe aria-hidden="true" />
              <span className={styles.letter} aria-hidden="true">
                {path.letter}
              </span>

              <div className={styles.top} data-card-part>
                <span className={styles.num}>{path.letter}</span>
                <span className={styles.k}>{t(`${path.key}.k`)}</span>
              </div>

              <div className={styles.body} data-card-part>
                <h3 className={styles.t}>{t(`${path.key}.t`)}</h3>
                <p className={styles.p}>{t(`${path.key}.p`)}</p>
              </div>

              <div className={styles.foot} data-card-part>
                <span className={styles.go}>
                  <span className={styles.goLabel}>{t(`${path.key}.go`)}</span>
                  <span className={styles.dest}>{t(`${path.key}.dest`)}</span>
                </span>
                <span className={styles.circle} aria-hidden="true">
                  <svg className={styles.arrow} data-arrow viewBox="0 0 16 16">
                    <path d="M3 13 13 3M5 3h8v8" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
