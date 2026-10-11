'use client'

import { Fragment, useRef } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './AboutCta.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.char}>
          <span className={styles.charInner} data-char>
            {ch}
          </span>
        </span>
      ))}
    </>
  )
}

/**
 * Il reveal lettera per lettera rende ogni carattere un inline-block, quindi il
 * browser puo' andare a capo in mezzo a una parola. Qui ogni parola e' un gruppo
 * `nowrap`, separato da spazi reali: si va a capo solo tra le parole.
 * La freccia viaggia dentro l'ultimo gruppo, cosi' non resta mai sola su una riga.
 */
function Lockup({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span aria-hidden="true">
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 ? ' ' : null}
          <span className={styles.word}>
            <Chars text={w} />
            {i === words.length - 1 ? (
              <span className={`${styles.char} ${styles.arrowChar}`}>
                <span className={styles.charInner} data-char>
                  {'\u2192'}
                </span>
              </span>
            ) : null}
          </span>
        </Fragment>
      ))}
    </span>
  )
}

export default function AboutCta() {
  const t = useTranslations('about.cta')
  const locale = useLocale()
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

        const link = q('[data-link]')[0] as HTMLElement
        const speedUp = () => gsap.to(spin, { timeScale: 3, duration: 0.4, overwrite: true })
        const slowDown = () => gsap.to(spin, { timeScale: 1, duration: 0.6, overwrite: true })
        link?.addEventListener('mouseenter', speedUp)
        link?.addEventListener('mouseleave', slowDown)

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }

        return () => {
          link?.removeEventListener('mouseenter', speedUp)
          link?.removeEventListener('mouseleave', slowDown)
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
          <Link
            className={styles.action}
            data-link
            href={`/${locale}/soluzioni`}
            aria-label={t('title')}
          >
            <Lockup text={t('title')} />
          </Link>
        </div>
      </div>
    </section>
  )
}
