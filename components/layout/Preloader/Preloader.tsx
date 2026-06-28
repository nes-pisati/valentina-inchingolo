'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { signalIntro, signalIntroComplete } from '../../../lib/intro'
import styles from './Preloader.module.css'

gsap.registerPlugin(ScrollTrigger)

const SEEN_KEY = 'valeink-intro-seen'

export default function Preloader() {
  const overlay = useRef<HTMLDivElement>(null)
  const value = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const content = document.querySelector<HTMLElement>('[data-intro-content]')
      if (!content) return

      const unlock = () => {
        document.documentElement.style.removeProperty('overflow')
      }
      const finish = () => {
        gsap.set(overlay.current, { display: 'none' })
        unlock()
        ScrollTrigger.refresh()
        signalIntroComplete()
      }

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const seen = sessionStorage.getItem(SEEN_KEY)

      if (seen || prefersReduced) {
        finish()
        signalIntro() 
        return
      }

      sessionStorage.setItem(SEEN_KEY, '1')
      document.documentElement.style.overflow = 'hidden'

      gsap.set(content, { yPercent: 12, autoAlpha: 0 })
      const proxy = { n: 0 }

      const tl = gsap.timeline({ onComplete: finish })

      tl.to(proxy, {
        n: 100,
        duration: 1.5,
        ease: 'expo.out',
        snap: { n: 1 },
        onUpdate: () => {
          if (value.current) value.current.textContent = String(Math.round(proxy.n)).padStart(2, '0')
        },
      })
        .to(overlay.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '+=0.15')
        .to(
          content,
          { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', clearProps: 'transform' },
          '-=0.55',
        )
        .call(signalIntro, undefined, '<')
    },
    { scope: overlay },
  )

  return (
    <div ref={overlay} className={styles.overlay} data-preloader aria-hidden="true">
      <div className={styles.counter}>
        <span ref={value} className={styles.value}>
          00
        </span>
        <span className={styles.percent}>%</span>
      </div>
    </div>
  )
}
