import { getTranslations } from 'next-intl/server'
import styles from './ProductMarquee.module.css'

type Item = { name: string; sub: string }

const STAR_POINTS = Array.from({ length: 24 }, (_, i) => {
  const r = i % 2 === 0 ? 50 : 24
  const a = (Math.PI * i) / 12 - Math.PI / 2
  return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`
}).join(' ')

export default async function ProductMarquee({ lang }: { lang: string }) {
  const t = await getTranslations({ locale: lang, namespace: 'soluzioni' })
  const items = t.raw('marquee.items') as Item[]

  return (
    <div className={styles.band} aria-hidden="true">
      <div className={styles.track} data-marquee-track>
        {[0, 1, 2, 3].map(group => (
          <div key={group} className={styles.group}>
            {items.map(item => (
              <span key={item.name} className={styles.item}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.sub}>{item.sub}</span>
                <svg className={styles.star} viewBox="0 0 100 100">
                  <polygon points={STAR_POINTS} />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
