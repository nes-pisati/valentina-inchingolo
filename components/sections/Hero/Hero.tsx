'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { onIntro } from '../../../lib/intro'
import styles from './Hero.module.css'

const CORALLO = '#E8503A'

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.char}>
          <span className={styles.charInner}>{ch === ' ' ? ' ' : ch}</span>
        </span>
      ))}
    </>
  )
}

export default function Hero() {
  const t = useTranslations('hero')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const wordmark = q('[data-wordmark]')[0] as HTMLElement
      const vale = q('[data-vale]')[0] as HTMLElement
      const anchor = q('[data-anchor]')[0] as HTMLElement
      const ink = q('[data-ink]')[0] as HTMLElement
      const gap = q('[data-gap]')[0] as HTMLElement

      const computeDelta = () => {
        const currentX = gsap.getProperty(anchor, 'x') as number
        const stageR = wordmark.getBoundingClientRect()
        const inkR = ink.getBoundingClientRect()
        return stageR.left - inkR.left + currentX
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(gap, { autoAlpha: 0 })
        gsap.set(q('[data-gap] .' + styles.charInner), { yPercent: 110 })

        // paused: l'intro parte quando il preloader scopre la viewport (handshake),
        // non al mount — altrimenti finisce mentre la tendina è ancora abbassata.
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

        tl.from(q('[data-vale] .' + styles.charInner + ', [data-ink] .' + styles.charInner), {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.06,
        })
          .to(ink, { color: CORALLO, duration: 0.5, ease: 'power2.out' }, '+=0.25')
          .to(vale, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 'shift')
          .to(anchor, { x: () => computeDelta(), duration: 0.8, ease: 'power4.inOut' }, 'shift')
          .set(gap, { autoAlpha: 1 }, 'shift+=0.25')
          .to(
            q('[data-gap] .' + styles.charInner),
            { yPercent: 0, duration: 0.7, stagger: 0.05 },
            'shift+=0.25',
          )
          .from(q('[data-tagline]'), { autoAlpha: 0, y: 20, duration: 0.7 }, '-=0.3')
          .from(q('[data-cta]'), { autoAlpha: 0, y: 16, duration: 0.6 }, '-=0.4')

        // Avvio: aspetta il segnale del preloader. Se in pagina non c'è un
        // preloader, parti subito (fallback per uso standalone dell'hero).
        const start = () => tl.play()
        const off = document.querySelector('[data-preloader]')
          ? onIntro(start)
          : (start(), () => {})

        const onResize = () => {
          if (tl.progress() === 1) gsap.set(anchor, { x: computeDelta() })
        }
        window.addEventListener('resize', onResize)
        return () => {
          off()
          window.removeEventListener('resize', onResize)
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(ink, { color: CORALLO })
        gsap.set(vale, { autoAlpha: 0 })
        gsap.set(gap, { autoAlpha: 1 })
        gsap.set(anchor, { x: () => computeDelta() })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.hero}>
      <h1 className={styles.wordmark} data-wordmark aria-label="VALEINK">
        <span className={styles.vale} data-vale aria-hidden="true">
          <Chars text="VALE" />
        </span>
        <span className={styles.anchor} data-anchor aria-hidden="true">
          <span className={styles.ink} data-ink>
            <Chars text="INK" />
          </span>
          <span className={styles.gap} data-gap>
            <Chars text="THE GAP" />
          </span>
        </span>
      </h1>

      <div className={styles.bottom}>
        <p className={styles.tagline} data-tagline>
          {t('taglineLead')} <em className={styles.accent}>{t('taglineAccent')}</em>{' '}
          {t('taglineTail')}
        </p>
        <a className={styles.cta} data-cta href="#progetti">
          {t('cta')}
        </a>
      </div>
    </section>
  )
}
