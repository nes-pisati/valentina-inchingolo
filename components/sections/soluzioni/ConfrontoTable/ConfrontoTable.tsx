import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import PillButton from '../../../ui/PillButton/PillButton'
import CheckoutButton from '../CheckoutButton/CheckoutButton'
import ConfrontoSwitch from './ConfrontoSwitch'
import { CONTACTS } from '../../../../lib/contacts'
import { formatPrice } from '../../../../lib/formatPrice'
import type { Price } from '../../../../lib/prices'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import styles from './ConfrontoTable.module.css'

type Rows = [string, string, string, string[]]

type ColumnProps = {
  side: 'l' | 'r'
  tag: string
  title: string
  rows: Rows
  labels: string[]
  cta: ReactNode
}

function Column({ side, tag, title, rows, labels, cta }: ColumnProps) {
  const dark = side === 'r'
  return (
    <div className={cx(styles.col, dark && styles.colDark)} data-col={side} role="group" aria-label={title}>
      {dark && <span className={styles.bg} data-ct-bg aria-hidden="true" />}

      <div className={cx(styles.cell, styles.cellHead)} data-ct-cell data-row="0">
        <span className={styles.tag}>{tag}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.cell} data-ct-cell data-row="1">
        <span className={styles.cLab}>{labels[0]}</span>
        <p className={styles.r1}>{rows[0]}</p>
      </div>
      <div className={styles.cell} data-ct-cell data-row="2">
        <span className={styles.cLab}>{labels[1]}</span>
        <p className={styles.rText}>{rows[1]}</p>
      </div>
      <div className={styles.cell} data-ct-cell data-row="3">
        <span className={styles.cLab}>{labels[2]}</span>
        <p className={styles.rText}>{rows[2]}</p>
      </div>
      <div className={styles.cell} data-ct-cell data-row="4">
        <span className={styles.cLab}>{labels[3]}</span>
        <ul className={styles.rList}>
          {rows[3].map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={cx(styles.cell, styles.cellCta)} data-ct-cell data-row="5">
        {cta}
      </div>
    </div>
  )
}

type Props = {
  lang: string
  price: Price
}

export default async function ConfrontoTable({ lang, price }: Props) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni.confronto' })
  const labels = t.raw('labels') as string[]
  const amount = formatPrice(price.amount, lang)

  return (
    <section id="confronto" className={styles.section}>
      <div className={l.container}>
        <header className={cx(l.grid, styles.head)}>
          <div className={styles.headTitle}>
            <p className={cx(l.occh, l.occhOnCipria)}>{t('occh')}</p>
            <h2 className={l.h2} data-rv="lines">
              {t.rich('h2', lineTags())}
            </h2>
          </div>
          <p className={styles.note}>{t('note')}</p>
        </header>

        <ConfrontoSwitch left={t('switch.l')} right={t('switch.r')}>
          <div className={styles.table} data-ct-table>
            <div className={cx(styles.col, styles.colLabels)} aria-hidden="true">
              <div className={cx(styles.cell, styles.cellHead)} data-ct-cell data-row="0" />
              {labels.map((label, i) => (
                <div
                  key={label}
                  className={cx(styles.cell, styles.labelCell)}
                  data-ct-cell
                  data-row={i + 1}
                >
                  {label}
                </div>
              ))}
              <div className={cx(styles.cell, styles.cellCta)} data-ct-cell data-row="5" />
            </div>

            <Column
              side="l"
              tag={t('call.tag')}
              title={t('call.title')}
              rows={t.raw('call.rows') as Rows}
              labels={labels}
              cta={<PillButton variant="default" href={CONTACTS.calendlyUrl} label={t('call.cta')} />}
            />

            <Column
              side="r"
              tag={t('minikit.tag', { price: amount })}
              title={t('minikit.title')}
              rows={t.raw('minikit.rows') as Rows}
              labels={labels}
              cta={
                <CheckoutButton
                  product="minikit"
                  variant="light-coral"
                  label={t('minikit.cta', { price: amount })}
                />
              }
            />
          </div>
        </ConfrontoSwitch>
      </div>
    </section>
  )
}
