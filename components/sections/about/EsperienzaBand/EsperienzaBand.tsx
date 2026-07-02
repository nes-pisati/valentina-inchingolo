'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './EsperienzaBand.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function EsperienzaBand() {
  const t = useTranslations('about.percorso')
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          q('[data-wm]'),
          { xPercent: 6 },
          {
            xPercent: -34,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.band} aria-hidden="true">
      <span className={styles.watermark} data-wm>
        {t('watermark')}
      </span>
    </div>
  )
}
