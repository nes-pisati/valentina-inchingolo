'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Percorso.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STEPS = ['treebee', 'lordgun', 'ideagency', 'italtech'] as const

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.char}>
          <span className={styles.charInner} data-char>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </>
  )
}

export default function Percorso() {
  const t = useTranslations('about.percorso')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(q('[data-char]'), { yPercent: 112 })
        gsap.from(q('[data-head]'), {
          autoAlpha: 0,
          y: 24,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-head]')[0], start: 'top 85%', once: true },
        })
        gsap.to(q('[data-char]'), {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.035,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('[data-title]')[0], start: 'top 85%', once: true },
        })

        gsap.from(q('[data-row]'), {
          autoAlpha: 0,
          y: 26,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-rows]')[0], start: 'top 80%', once: true },
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.percorso} aria-labelledby="about-percorso-head">
      <div className={styles.inner}>
        <div className={styles.secHead}>
          <header className={styles.head} data-head>
            <span className={styles.num}>{t('num')}</span>
            <p className={styles.occhiello}>{t('occhiello')}</p>
          </header>

          <h2
            id="about-percorso-head"
            className={styles.title}
            data-title
            aria-label={t('title')}
          >
            <span aria-hidden="true">
              <Chars text={t('title')} />
            </span>
          </h2>
        </div>

        <ul className={styles.rows} data-rows>
          {STEPS.map((key, i) => (
            <li key={key} className={styles.row} data-row>
              <div className={styles.rowTop}>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.t}>{t(`items.${key}.name`)}</span>
                <span className={styles.tag}>{t(`items.${key}.tag`)}</span>
              </div>
              <p className={styles.desc}>{t(`items.${key}.desc`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
