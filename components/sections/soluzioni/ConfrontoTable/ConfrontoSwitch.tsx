'use client'

import { useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './ConfrontoSwitch.module.css'

gsap.registerPlugin(useGSAP)

type Side = 'l' | 'r'

type Props = {
  left: string
  right: string
  children: ReactNode
}

export default function ConfrontoSwitch({ left, right, children }: Props) {
  const [show, setShow] = useState<Side>('l')
  const wrap = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLSpanElement>(null)
  const mounted = useRef(false)

  useGSAP(
    () => {
      if (!mounted.current) {
        mounted.current = true
        return
      }
      const root = wrap.current
      if (!root) return

      const x = show === 'l' ? 0 : 100
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(knob.current, { xPercent: x })
        return
      }

      gsap.to(knob.current, { xPercent: x, duration: 0.55, ease: 'expo.out' })

      const cells = root.querySelectorAll(`[data-col="${show}"] [data-ct-cell]`)
      gsap.fromTo(
        cells,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'expo.out',
          onComplete: () => gsap.set(cells, { clearProps: 'opacity' }),
        },
      )

      if (show === 'r') {
        gsap.fromTo(
          root.querySelector('[data-ct-bg]'),
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' },
        )
      }
    },
    { scope: wrap, dependencies: [show] },
  )

  return (
    <div ref={wrap} className={styles.wrap} data-show={show}>
      <div className={styles.switch}>
        <span ref={knob} className={styles.knob} aria-hidden="true" />
        <button
          type="button"
          className={styles.option}
          aria-pressed={show === 'l'}
          onClick={() => setShow('l')}
        >
          {left}
        </button>
        <button
          type="button"
          className={styles.option}
          aria-pressed={show === 'r'}
          onClick={() => setShow('r')}
        >
          {right}
        </button>
      </div>
      {children}
    </div>
  )
}
