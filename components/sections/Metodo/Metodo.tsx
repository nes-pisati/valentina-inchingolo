'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Metodo.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const KEYS = ['analisi', 'diagnosi', 'strategia', 'piano', 'affiancamento'] as const

const pad = (n: number) => String(n).padStart(2, '0')

export default function Metodo() {
  const t = useTranslations('metodo')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const head = q('[data-head]')
      const steps = q('[data-step]')
      const words = q('[data-word]')
      const descs = q('[data-desc]')
      const counter = q('[data-counter]')[0]
      const fill = q('[data-fill]')[0]
      if (!counter || !fill) return

      const mm = gsap.matchMedia()

      mm.add('(min-width: 641px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(head, {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        })

        gsap.set(words, { yPercent: 130 })
        gsap.set(descs, { autoAlpha: 0, y: 30 })
        gsap.set(counter, { yPercent: 0 })
        gsap.set(fill, { scaleX: 0, transformOrigin: '0% 50%' })

        const span = 5 * window.innerHeight * 0.85

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=' + span,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              ;(fill as HTMLElement).style.transform = `scaleX(${self.progress})`
            },
          },
        })

        steps.forEach((_, i) => {
          const word = words[i]
          const desc = descs[i]
          if (!word || !desc) return
          const at = i

          tl.to(word, { yPercent: 0, duration: 0.35 }, at)
          tl.to(desc, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.12)
          tl.to(counter, { yPercent: -(100 / KEYS.length) * i, duration: 0.25 }, at)

          if (i < KEYS.length - 1) {
            tl.to(word, { yPercent: -130, duration: 0.3 }, at + 0.72)
            tl.to(desc, { autoAlpha: 0, y: -30, duration: 0.3 }, at + 0.72)
          }
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.metodo} aria-label="Il metodo">
      <div className={styles.inner}>
        <header className={styles.head} data-head>
          <span className={styles.num}>{t('num')}</span>
          <span className={styles.occhiello}>{t('occhiello')}</span>
        </header>

        <div className={styles.scene}>
          <div className={styles.counter} aria-hidden="true">
            <div className={styles.counterTrack} data-counter>
              {KEYS.map((key, i) => (
                <span key={key} className={styles.counterNum}>
                  {pad(i + 1)}
                </span>
              ))}
            </div>
          </div>

          <ol className={styles.steps}>
            {KEYS.map((key, i) => (
              <li key={key} className={styles.step} data-step>
                <span className={styles.stepNum} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3 className={styles.word}>
                  <span className={styles.wordMask}>
                    <span className={styles.wordInner} data-word>
                      {t(`items.${key}.word`)}
                    </span>
                  </span>
                </h3>
                <p className={styles.desc} data-desc>
                  {t(`items.${key}.desc`)}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <div className={styles.track}>
            <span className={styles.fill} data-fill />
          </div>
        </div>
      </div>
    </section>
  )
}
