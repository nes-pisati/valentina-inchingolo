import { getTranslations } from 'next-intl/server'
import { cx } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './HomeIntro.module.css'

const ROWS = [
  { key: 'vale', text: 'VALE' },
  { key: 'ink', text: 'INK' },
  { key: 'gap', text: 'THE GAP' },
] as const

/**
 * Dispositivo tipografico VALE / INK / THE GAP (handoff 0.1b), unico punto del
 * sito in cui compare. Grafica decorativa: non e' un heading, l'H1 e' nella hero.
 */
export default async function HomeIntro({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.intro' })

  return (
    <section className={styles.intro} data-intro>
      <div className={styles.stage} data-intro-stage>
        <div className={cx(l.container, styles.frame)}>
          <span className={l.srOnly}>{t('sr')}</span>

          <div className={styles.stack} aria-hidden="true">
            <span className={styles.rule} data-dv-rule />
            {ROWS.map(row => (
              <span
                key={row.key}
                className={cx(styles.row, row.key === 'ink' && styles.inkRow)}
                data-dv-row={row.key}
              >
                {row.key === 'ink' && <span className={styles.inkBlock} data-dv-block />}
                <span className={styles.word} data-dv-word>
                  {row.text}
                </span>
              </span>
            ))}
          </div>

          <div className={styles.bottom} aria-hidden="true">
            <p className={styles.caption} data-dv-fade>
              {t('caption')}
            </p>
            <span className={styles.cue} data-dv-fade>
              {t('cue')}
              <span className={styles.cueLine}>
                <span className={styles.cueDot} data-dv-cue />
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
