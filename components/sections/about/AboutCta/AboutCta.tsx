'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CONTACTS } from '../../../../lib/contacts'
import styles from './AboutCta.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.char}>
          <span className={styles.charInner} data-char>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </>
  )
}

export default function AboutCta() {
  const t = useTranslations('about.cta')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const badge = q('[data-badge]')[0] as HTMLElement

        gsap.set(q('[data-char]'), { yPercent: 112 })

        gsap.utils.toArray<HTMLElement>(q('[data-reveal]')).forEach(el => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 24,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          })
        })

        gsap.to(q('[data-char]'), {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
        })

        const spin = gsap.to(badge, { rotation: 360, duration: 18, ease: 'none', repeat: -1 })

        const mailto = q('[data-mailto]')[0] as HTMLElement
        const speedUp = () => gsap.to(spin, { timeScale: 3, duration: 0.4, overwrite: true })
        const slowDown = () => gsap.to(spin, { timeScale: 1, duration: 0.6, overwrite: true })
        mailto?.addEventListener('mouseenter', speedUp)
        mailto?.addEventListener('mouseleave', slowDown)

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }

        return () => {
          mailto?.removeEventListener('mouseenter', speedUp)
          mailto?.removeEventListener('mouseleave', slowDown)
          spin.kill()
        }
      })

      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const wrap = q('[data-magnetic]')[0] as HTMLElement
        if (!wrap) return

        const xTo = gsap.quickTo(wrap, 'x', { duration: 0.5, ease: 'power3' })
        const yTo = gsap.quickTo(wrap, 'y', { duration: 0.5, ease: 'power3' })

        const onMove = (e: MouseEvent) => {
          const r = wrap.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * 0.18)
          yTo((e.clientY - (r.top + r.height / 2)) * 0.22)
        }
        const onLeave = () => {
          gsap.to(wrap, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, .45)' })
        }

        wrap.addEventListener('mousemove', onMove)
        wrap.addEventListener('mouseleave', onLeave)
        return () => {
          wrap.removeEventListener('mousemove', onMove)
          wrap.removeEventListener('mouseleave', onLeave)
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.cta} aria-labelledby="about-cta-head">
      <svg className={styles.badge} data-badge viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path
            id="about-cta-circle"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
            fill="none"
          />
        </defs>
        <text className={styles.badgeText}>
          <textPath href="#about-cta-circle">{t('badge')}</textPath>
        </text>
      </svg>

      <div className={styles.inner}>
        <p id="about-cta-head" className={styles.eyebrow} data-reveal>
          {t('eyebrow')}
        </p>

        <div className={styles.magnetic} data-magnetic>
          <a
            className={styles.mailto}
            data-mailto
            href={`mailto:${CONTACTS.email}`}
            aria-label={t('title')}
          >
            <span aria-hidden="true">
              <Chars text={t('title')} />
            </span>
          </a>
        </div>

        <div className={styles.sub} data-reveal>
          <span className={styles.email}>{CONTACTS.email}</span>
          <span className={styles.zones}>{t('zones')}</span>
        </div>
      </div>
    </section>
  )
}
