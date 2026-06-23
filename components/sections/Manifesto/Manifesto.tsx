'use client'

import { useRef, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Manifesto.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const KEYS = ['vision', 'strategy', 'ideas', 'workflow'] as const

export default function Manifesto() {
  const t = useTranslations('manifesto')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const blocks = gsap.utils.toArray<HTMLElement>('[data-block]', root.current)

        blocks.forEach((block, i) => {
          const inner = block.querySelector('[data-word-inner]')
          const line = block.querySelector('[data-line]')

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: block,
              start: 'top 90%',
              once: true,
              invalidateOnRefresh: true,
            },
          })
          tl.from(inner, { yPercent: 110, duration: 0.9 }, 0).from(
            line,
            { autoAlpha: 0, y: 24, duration: 0.7 },
            0.25,
          )

          const odd = i % 2 === 0
          gsap.fromTo(
            block,
            { xPercent: odd ? -4 : 4 },
            {
              xPercent: odd ? 4 : -4,
              ease: 'none',
              scrollTrigger: {
                trigger: block,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          )
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.manifesto}>
      {KEYS.map((key, i) => (
        <div
          key={key}
          data-block
          className={`${styles.block} ${i % 2 === 0 ? styles.left : styles.right}`}
        >
          <h2 className={styles.word}>
            <span className={styles.wordMask}>
              <span className={styles.wordInner} data-word-inner>
                {t(`items.${key}.word`)}
              </span>
            </span>
          </h2>
          <p className={styles.line} data-line>
            {t.rich(`items.${key}.line`, {
              em: (chunks: ReactNode) => <em className={styles.accent}>{chunks}</em>,
            })}
          </p>
        </div>
      ))}
    </section>
  )
}
