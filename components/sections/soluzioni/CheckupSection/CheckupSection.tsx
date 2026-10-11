import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import MediaReveal from '../../../ui/MediaReveal/MediaReveal'
import PillButton from '../../../ui/PillButton/PillButton'
import CheckoutButton from '../CheckoutButton/CheckoutButton'
import { formatPrice } from '../../../../lib/formatPrice'
import type { Price } from '../../../../lib/prices'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import styles from './CheckupSection.module.css'
import img from '../../../../public/images/traccia-rossa.jpg'

type Phase = { t: string; p: string }
type Fact = { value?: string; unit: string; label: string }

type Props = {
  lang: string
  price: Price
}

export default async function CheckupSection({ lang, price }: Props) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni.checkup' })
  const phases = t.raw('phases') as Phase[]
  const facts = t.raw('facts') as Fact[]
  const drift = t('drift')

  return (
    <section id="checkup" className={styles.section} data-drift-section>
      <div className={styles.drift} aria-hidden="true">
        <div className={styles.driftTrack} data-drift-track>
          <span>{drift}</span>
          <span>{drift}</span>
        </div>
      </div>

      <div className={l.container}>
        <div className={cx(l.grid, styles.intro)}>
          <div className={styles.text}>
            <p className={cx(l.occh, l.occhOnInk)}>{t('occh')}</p>
            <h2 className={cx(l.h2, styles.h2)} data-rv="lines">
              {t.rich('h2', lineTags())}
            </h2>
            <p className={cx(l.lead, styles.lead)} data-rv="fade">
              {t('lead')}
            </p>
            <div data-rv="fade">
              <CheckoutButton product="checkup" variant="light-coral" label={t('cta')} />
            </div>
          </div>

          <MediaReveal
            className={styles.media}
            captionClassName={styles.caption}
            src={img}
            caption={t('cap')}
            sizes="(max-width: 1024px) 100vw, 36vw"
            tone="fango"
          />
        </div>

        <div className={styles.phases}>
          <p className={styles.phasesTitle}>{t('phasesTitle')}</p>
          <ol className={styles.phaseList}>
            {phases.map((phase, i) => (
              <li key={phase.t} className={cx(l.grid, styles.phase)} data-phase>
                <span className={styles.rule} aria-hidden="true" />
                <span className={styles.draw} data-ph-draw aria-hidden="true" />
                <span className={styles.phNum} data-ph-el>{`0${i + 1}`}</span>
                <h3 className={styles.phTitle} data-ph-el>
                  {phase.t}
                </h3>
                <p className={styles.phText} data-ph-el>
                  {phase.p}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <ul className={cx(l.grid, styles.facts)} data-facts>
          {facts.map((fact, i) => {
            const isPrice = fact.value === undefined
            const numeric = isPrice ? price.amount : Number(fact.value)
            const countable = isPrice || /^\d+$/.test(fact.value ?? '')
            const display = isPrice ? formatPrice(price.amount, lang) : fact.value
            return (
              <li key={i} className={styles.fact} data-fact>
                <span
                  className={styles.factNum}
                  data-count={countable ? numeric : undefined}
                  data-prefix={isPrice ? '€' : undefined}
                >
                  {display}
                </span>
                <span className={styles.factUnit}>{fact.unit}</span>
                <span className={styles.factLabel}>{fact.label}</span>
              </li>
            )
          })}
        </ul>

        <div className={styles.ponte}>
          <span className={styles.ponteDot} aria-hidden="true" />
          <p className={styles.ponteText}>
            {t.rich('ponte', { strong: (chunks: ReactNode) => <strong>{chunks}</strong> })}
          </p>
          <div className={styles.ponteCta}>
            <PillButton variant="light" href="#consulenza" label={t('ponteCta')} />
          </div>
        </div>
      </div>
    </section>
  )
}
