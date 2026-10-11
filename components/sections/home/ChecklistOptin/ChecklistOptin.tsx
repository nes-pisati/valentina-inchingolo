import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import ChecklistForm from './ChecklistForm'
import { cx, lineTags } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './ChecklistOptin.module.css'

type Fact = { value: string; unit: string; label: string }

export default async function ChecklistOptin({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.checklist' })
  const facts = t.raw('facts') as Fact[]

  const copy = {
    label: t('label'),
    placeholder: t('placeholder'),
    cta: t('cta'),
    micro: t('micro'),
    errorEmail: t('errorEmail'),
    errorConsent: t('errorConsent'),
    sentTitle: t('sentTitle'),
    sentText: t('sentText'),
  }

  const consent = t.rich('consent', {
    privacy: (chunks: ReactNode) => (
      <a className={styles.link} href={`/${lang}/privacy`}>
        {chunks}
      </a>
    ),
  })

  return (
    <section id="checklist" className={styles.section}>
      <div className={cx(l.container, l.grid, styles.inner)}>
        <div className={styles.text}>
          <p className={cx(l.occh, l.occhOnCipria)}>{t('occh')}</p>
          <h2 className={cx(l.h2, styles.h2)} data-rv="lines">
            {t.rich('h2', lineTags())}
          </h2>
          <p className={cx(l.lead, styles.lead)} data-rv="fade">
            {t('lead')}
          </p>
          <div data-rv="fade">
            <ChecklistForm copy={copy} consent={consent} />
          </div>
        </div>

        <ul className={styles.facts} data-rv="rows">
          {facts.map(fact => (
            <li key={fact.unit} className={styles.fact}>
              <span className={styles.factNum} data-count={fact.value}>
                {fact.value}
              </span>
              <span className={styles.factUnit}>{fact.unit}</span>
              <span className={styles.factLabel}>{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
