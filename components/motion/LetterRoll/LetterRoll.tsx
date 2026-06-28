'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './LetterRoll.module.css'

gsap.registerPlugin(useGSAP)

type Props = {
  text: string
  href?: string
  rollColor?: 'corallo' | 'inchiostro'
  nowrap?: boolean
  className?: string
}

export default function LetterRoll({
  text,
  href,
  rollColor = 'corallo',
  nowrap = false,
  className,
}: Props) {
  const root = useRef<HTMLAnchorElement & HTMLSpanElement>(null)
  const chars = Array.from(text)

  useGSAP(
    () => {
      const node = root.current
      if (!node) return

      const canHover = window.matchMedia('(hover: hover)').matches
      const noReduce = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
      if (!canHover || !noReduce) return

      const cols = gsap.utils.toArray<HTMLElement>(node.querySelectorAll(`.${styles.col}`))
      const tl = gsap.timeline({ paused: true })
      tl.to(cols, { yPercent: -100, duration: 0.4, ease: 'power2.inOut', stagger: 0.015 })

      const play = () => tl.play()
      const reverse = () => tl.reverse()
      node.addEventListener('mouseenter', play)
      node.addEventListener('mouseleave', reverse)
      node.addEventListener('focus', play)
      node.addEventListener('blur', reverse)

      return () => {
        node.removeEventListener('mouseenter', play)
        node.removeEventListener('mouseleave', reverse)
        node.removeEventListener('focus', play)
        node.removeEventListener('blur', reverse)
      }
    },
    { scope: root, dependencies: [text] },
  )

  const rollClass = rollColor === 'corallo' ? styles.rollCorallo : styles.rollInchiostro
  const cls = [styles.root, rollClass, nowrap && styles.nowrap, className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <span className={styles.inner} aria-hidden="true">
      {chars.map((c, i) => (
        <span key={i} className={styles.char}>
          <span className={styles.col}>
            <span className={styles.face}>{c === ' ' ? ' ' : c}</span>
            <span className={styles.face} data-roll>
              {c === ' ' ? ' ' : c}
            </span>
          </span>
        </span>
      ))}
    </span>
  )

  if (href) {
    return (
      <a ref={root} className={cls} href={href} aria-label={text}>
        {content}
      </a>
    )
  }

  return (
    <span ref={root} className={cls} aria-label={text}>
      {content}
    </span>
  )
}
