import { getTranslations } from 'next-intl/server'
import MediaReveal from '../../../ui/MediaReveal/MediaReveal'
import CheckoutButton from '../CheckoutButton/CheckoutButton'
import { formatPrice } from '../../../../lib/formatPrice'
import type { Price } from '../../../../lib/prices'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import p from '../product.module.css'
import styles from './MiniKitSection.module.css'
import img from '../../../../public/images/fogli-stratificati.jpg'

type Row = { title: string; text: string }

type Props = {
  lang: string
  price: Price
}

export default async function MiniKitSection({ lang, price }: Props) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni.minikit' })
  const receive = t.raw('receive') as Row[]
  const rows = t.raw('rows') as Row[]
  const amount = formatPrice(price.amount, lang)

  return (
    <section id="minikit" className={cx(p.section, styles.section)}>
      <div className={cx(l.container, l.grid, p.inner)}>
        <div className={cx(p.text, styles.text)}>
          <p className={l.occh}>{t('occh', { price: amount })}</p>
          <h2 className={cx(l.h2, p.h2)} data-rv="lines">
            {t.rich('h2', lineTags())}
          </h2>
          <p className={cx(l.lead, p.lead)} data-rv="fade">
            {t('lead')}
          </p>

          <div className={styles.priceBlock} data-rv="fade">
            <span className={styles.amount}>{amount}</span>
            {price.compareAt && (
              <s className={styles.was}>{formatPrice(price.compareAt, lang)}</s>
            )}
            <span className={styles.priceNote}>{t('priceNote')}</span>
          </div>

          <div className={p.ctaRow} data-rv="fade">
            <CheckoutButton product="minikit" variant="coral" label={t('cta', { price: amount })} />
            <p className={p.micro}>{t('ctaMicro')}</p>
          </div>

          <div className={p.list}>
            <p className={p.listTitle}>{t('receiveTitle')}</p>
            <ul className={p.rows} data-rv="rows">
              {receive.map(row => (
                <li key={row.title} className={p.row}>
                  <span className={p.dot} aria-hidden="true" />
                  <div>
                    <p className={p.rowTitle}>{row.title}</p>
                    <p className={p.rowText}>{row.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={p.list}>
            <p className={p.listTitle}>{t('rowsTitle')}</p>
            <ol className={p.rows} data-rv="rows">
              {rows.map((row, i) => (
                <li key={row.title} className={p.row}>
                  <span className={p.rowNum}>{`0${i + 1}`}</span>
                  <div>
                    <p className={p.rowTitle}>{row.title}</p>
                    <p className={p.rowText}>{row.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <MediaReveal
          className={cx(p.media, styles.media)}
          src={img}
          caption={t('cap')}
          sizes="(max-width: 1024px) 100vw, 36vw"
          tone="corallo"
        />
      </div>
    </section>
  )
}
