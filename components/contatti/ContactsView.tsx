'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import CallBooking from '../sections/contatti/CallBooking/CallBooking'
import LocalClock from './LocalClock'
import styles from './ContactsView.module.css'

gsap.registerPlugin(useGSAP)

type Props = {
  eyebrow: string
  headline: string
  lead: string
  other: { label: string; email: string }
  clockPrefix: string
}

export default function ContactsView({ eyebrow, headline, lead, other, clockPrefix }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const eyebrowEl = q(`.${styles.eyebrow}`)
        const h1 = q('[data-h1]')
        const chrome = q('[data-chrome]')

        gsap.set(eyebrowEl, { autoAlpha: 0, y: 24 })
        gsap.set(h1, { yPercent: 110 })
        gsap.set(chrome, { autoAlpha: 0, y: 24 })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(eyebrowEl, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.15)
        tl.to(h1, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.3)
        tl.to(chrome, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.6)
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.left}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.headline}>
            <span className={styles.mask}>
              <span className={styles.maskInner} data-h1>
                {headline}
              </span>
            </span>
          </h1>
          <p className={styles.subhead} data-chrome>
            {lead}
          </p>
        </header>

        <div className={styles.right}>
          <CallBooking />
          <p className={styles.other} data-chrome>
            {other.label} {other.email}
          </p>
        </div>
      </div>

      <footer className={styles.baseline}>
        <span className={styles.clock} data-chrome>
          <LocalClock prefix={clockPrefix} />
        </span>
      </footer>
    </div>
  )
}
