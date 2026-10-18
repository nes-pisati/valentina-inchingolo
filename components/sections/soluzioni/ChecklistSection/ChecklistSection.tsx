import { getTranslations } from 'next-intl/server'
import MediaReveal from '../../../ui/MediaReveal/MediaReveal'
import ChecklistButton from './ChecklistButton'
import { cx, lineTags } from '../richTags'
import l from '../soluzioni.module.css'
import p from '../product.module.css'
import img from '../../../../public/images/griglia-inchiostro.jpg'

type Row = { title: string; text: string }

export default async function ChecklistSection({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni.checklist' })
  const rows = t.raw('rows') as Row[]

  return (
    <section id="checklist" className={p.section}>
      <div className={cx(l.container, l.grid, p.inner)}>
        <div className={p.text}>
          <p className={l.occh}>{t('occh')}</p>
          <h2 className={cx(l.h2, p.h2)} data-rv="lines">
            {t.rich('h2', lineTags())}
          </h2>
          <p className={cx(l.lead, p.lead)} data-rv="fade">
            {t('lead')}
          </p>
          <div className={p.ctaRow} data-rv="fade">
            <ChecklistButton label={t('cta')} />
            <p className={p.micro}>{t('micro')}</p>
          </div>

          <div className={p.list}>
            <p className={p.listTitle}>{t('rowsTitle')}</p>
            <ul className={p.rows} data-rv="rows">
              {rows.map(row => (
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
        </div>

        <MediaReveal
          className={p.media}
          src={img}
          sizes="(max-width: 1024px) 100vw, 40vw"
          tone="cipria"
        />
      </div>
    </section>
  )
}
