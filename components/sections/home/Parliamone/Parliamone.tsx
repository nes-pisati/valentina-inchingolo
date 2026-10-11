import { getTranslations } from 'next-intl/server'
import PillButton from '../../../ui/PillButton/PillButton'
import LetterRoll from '../../../motion/LetterRoll/LetterRoll'
import { CONTACTS } from '../../../../lib/contacts'
import { cx } from '../../soluzioni/richTags'
import l from '../../soluzioni/soluzioni.module.css'
import styles from './Parliamone.module.css'

export default async function Parliamone({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'home.parliamone' })
  const title = t('title')

  return (
    <section id="parliamone" className={styles.section} aria-labelledby="parliamone-head">
      <svg className={styles.badge} data-badge viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path
            id="parliamone-circle"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            fill="none"
          />
        </defs>
        <text className={styles.badgeText}>
          <textPath href="#parliamone-circle">{t('badge')}</textPath>
        </text>
      </svg>

      <div className={l.container}>
        <p className={l.occh}>{t('occh')}</p>

        <h2 id="parliamone-head" className={styles.title} data-big-title aria-label={title}>
          {/* Una sola maschera per tutta la riga: con il letter-spacing negativo una
              maschera per lettera taglierebbe il lato destro dei glifi. */}
          <span className={styles.mask} aria-hidden="true">
            {Array.from(title).map((ch, i) => (
              <span key={i} className={styles.char} data-big-char>
                {ch}
              </span>
            ))}
          </span>
        </h2>

        <div className={cx(l.grid, styles.final)}>
          <p className={cx(l.lead, styles.lead)} data-rv="fade">
            {t('p')}
          </p>
          <div className={styles.actions} data-rv="fade">
            {/* La call si prenota dal calendario della pagina Contatti. */}
            <PillButton variant="coral" href={`/${lang}/contatti`} label={t('cta')} />
            <p className={styles.alt}>
              <span>{t('or')}</span>
              <LetterRoll
                href={`mailto:${CONTACTS.email}`}
                text={CONTACTS.email}
                className={styles.mail}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
