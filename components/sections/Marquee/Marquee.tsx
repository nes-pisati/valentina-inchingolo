'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './Marquee.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Marquee() {
  const t = useTranslations('marquee')
  const words = t.raw('words') as string[]
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = track.current
        if (!el) return

        const loop = gsap.to(el, {
          xPercent: -50,
          ease: 'none',
          duration: 48,
          repeat: -1,
        })

        const skewTo = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' })
        let resetId = 0

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = self.getVelocity()
            skewTo(gsap.utils.clamp(-7, 7, v / 220))
            gsap.to(loop, {
              timeScale: 1 + gsap.utils.clamp(0, 4, Math.abs(v) / 600),
              duration: 0.3,
              overwrite: true,
            })
            clearTimeout(resetId)
            resetId = window.setTimeout(() => {
              skewTo(0)
              gsap.to(loop, { timeScale: 1, duration: 0.8, overwrite: true })
            }, 120)
          },
        })

        return () => {
          clearTimeout(resetId)
          st.kill()
          loop.kill()
        }
      })
    },
    { scope: root },
  )

  const group = (
    <div className={styles.group} aria-hidden="true">
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className={styles.item}>
          <span className={i % 2 ? styles.wordAccent : styles.word}>{w}</span>
          <span className={styles.sep} />
        </span>
      ))}
    </div>
  )

  return (
    <section ref={root} className={styles.marquee} aria-hidden="true">
      <div ref={track} className={styles.track}>
        {group}
        {group}
      </div>
    </section>
  )
}
