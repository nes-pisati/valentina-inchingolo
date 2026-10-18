import { getTranslations } from 'next-intl/server'
import PillButton from '../../../ui/PillButton/PillButton'
import { CONTACTS } from '../../../../lib/contacts'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import styles from './ConsulenzaCta.module.css'

export default async function ConsulenzaCta({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni.consulenza' })
  const steps = t.raw('steps') as string[]

  return (
    <section id="consulenza" className={styles.section}>
      <div className={l.container}>
        <p className={cx(l.occh, l.occhOnCipria)}>{t('occh')}</p>
        <h2 className={styles.title} data-rv="lines">
          {t.rich('h2', lineTags())}
        </h2>

        <ol className={styles.method} data-method>
          {steps.map((step, i) => (
            <li key={step} className={styles.step} data-method-item>
              <span className={styles.stepNum}>{`0${i + 1}`}</span>
              <span className={styles.stepName}>{step}</span>
            </li>
          ))}
        </ol>

        <div className={cx(l.grid, styles.final)}>
          <p className={cx(l.lead, styles.lead)} data-rv="fade">
            {t('p')}
          </p>
          <div className={styles.actions} data-rv="fade">
            <PillButton variant="default" href={CONTACTS.calendlyUrl} label={t('cta')} />
          </div>
        </div>
      </div>
    </section>
  )
}
