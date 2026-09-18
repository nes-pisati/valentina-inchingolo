'use client'

import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import PillButton from '../../../ui/PillButton/PillButton'
import styles from './ConversionDock.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const BLOCKING_SECTIONS = ['checkup', 'confronto', 'consulenza']

type Props = {
  children: ReactNode
  cta: string
}

export default function ConversionDock({ children, cta }: Props) {
  const dock = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = dock.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.set(el, { yPercent: 160, opacity: 0, visibility: 'visible' })
    el.inert = true

    const hero = document.querySelector('[data-hero]')
    const content = document.querySelector('[data-intro-content]')
    const burger = document.querySelector('[aria-controls="mobile-menu"]')
    const zones = BLOCKING_SECTIONS.map(id => document.getElementById(id)).filter(
      (z): z is HTMLElement => z !== null,
    )

    let on = false

    const update = () => {
      const vh = window.innerHeight
      const inBand = (r: DOMRect) => r.top < vh * 0.8 && r.bottom > vh * 0.2
      const heroGone = hero ? hero.getBoundingClientRect().bottom < 0 : true
      const blocked = zones.some(z => inBand(z.getBoundingClientRect()))
      const footerIn = content ? content.getBoundingClientRect().bottom < vh * 0.8 : false
      const menuOpen = burger?.getAttribute('aria-expanded') === 'true'
      const next = heroGone && !blocked && !footerIn && !menuOpen

      if (next === on) return
      on = next
      el.inert = !on
      gsap.to(el, {
        yPercent: on ? 0 : 160,
        opacity: on ? 1 : 0,
        duration: reduce ? 0 : 0.6,
        ease: 'expo.out',
        overwrite: true,
      })
    }

    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update })

    const observer = burger ? new MutationObserver(update) : null
    if (burger) observer?.observe(burger, { attributes: true, attributeFilter: ['aria-expanded'] })

    update()

    return () => observer?.disconnect()
  })

  return (
    <div ref={dock} className={styles.dock}>
      <p className={styles.text}>{children}</p>
      <PillButton size="sm" variant="light-coral" href="#checkup" label={cta} />
    </div>
  )
}
