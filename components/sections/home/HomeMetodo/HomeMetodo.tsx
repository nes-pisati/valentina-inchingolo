import { getTranslations } from 'next-intl/server'
import { cx, lineTags } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './HomeMetodo.module.css'

type Step = { t: string; p: string }

export default async function HomeMetodo({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.metodo' })
  const steps = t.raw('steps') as Step[]
  const drift = t('drift')

  return (
    <section id="metodo" className={styles.section} data-drift-section>
      <div className={styles.drift} aria-hidden="true">
        <div className={styles.driftTrack} data-drift-track>
          <span>{drift}</span>
          <span>{drift}</span>
        </div>
      </div>

      <div className={l.container}>
        <header className={styles.head}>
          <p className={cx(l.occh, l.occhOnInk)}>{t('occh')}</p>
          <h2 className={cx(l.h2, styles.h2)} data-rv="lines">
            {t.rich('h2', lineTags())}
          </h2>
        </header>

        <ol className={styles.phaseList}>
          {steps.map((step, i) => (
            <li key={step.t} className={cx(l.grid, styles.phase)} data-phase>
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.draw} data-ph-draw aria-hidden="true" />
              <span className={styles.phNum} data-ph-el>{`0${i + 1}`}</span>
              <h3 className={styles.phTitle} data-ph-el>
                {step.t}
              </h3>
              <p className={styles.phText} data-ph-el>
                {step.p}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
