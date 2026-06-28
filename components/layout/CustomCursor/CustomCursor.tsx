'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './CustomCursor.module.css'

const HOVER_SELECTOR = 'a, button, [role="button"], [data-cursor], label, summary'

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = dot.current
    if (!el) return

    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const docEl = document.documentElement
    docEl.classList.add('has-custom-cursor')

    const REST = 0.38 // 68px * 0.38 ≈ 26px a riposo; hover = scala a 1 (nitido)
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: REST })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      if (!el.dataset.on) {
        el.dataset.on = '1'
        gsap.to(el, { autoAlpha: 1, duration: 0.3 })
      }
    }

    const onOver = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(HOVER_SELECTOR)) {
        gsap.to(el, { scale: 1, duration: 0.4, ease: 'power3.out' })
      }
    }
    const onOut = (e: PointerEvent) => {
      const from = (e.target as Element)?.closest?.(HOVER_SELECTOR)
      const to = (e.relatedTarget as Element)?.closest?.(HOVER_SELECTOR)
      if (from && from !== to) {
        gsap.to(el, { scale: REST, duration: 0.4, ease: 'power3.out' })
      }
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      docEl.classList.remove('has-custom-cursor')
    }
  }, { scope: dot })

  return <div ref={dot} className={styles.dot} aria-hidden="true" />
}
