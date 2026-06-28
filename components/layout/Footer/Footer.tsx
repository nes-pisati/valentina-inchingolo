'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { onIntroComplete } from '../../../lib/intro'
import styles from './Footer.module.css'
import LetterRoll from '../../motion/LetterRoll/LetterRoll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EMAIL = 'valentina.inchingolo@gmail.com'
const WORDMARK = 'VALEINK'

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const sentinel = useRef<HTMLDivElement>(null)
  const footer = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => onIntroComplete(() => setRevealed(true)), [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const inner = footer.current!.querySelector(`.${styles.inner}`)

        gsap.fromTo(
          inner,
          { yPercent: -14 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sentinel.current,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          },
        )

        const cols = gsap.utils.toArray<HTMLElement>(
          footer.current!.querySelectorAll(`.${styles.letterCol}`),
        )
        gsap.from(cols, {
          yPercent: 115,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.055,
          delay: 0.3,
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: footer },
  )

  const scrollTop = () => {
    const noReduce = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    window.scrollTo({ top: 0, behavior: noReduce ? 'smooth' : 'auto' })
  }

  return (
    <>
      <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />
      <footer
        ref={footer}
        className={`${styles.footer} ${revealed ? '' : styles.hidden}`}
        aria-labelledby="footer-wordmark"
      >
        <div className={styles.inner}>
          <div className={styles.cols}>
            <div className={styles.col}>
              <span className={styles.label}>{t('contactsLabel')}</span>
              <LetterRoll
                href={`mailto:${EMAIL}`}
                text={EMAIL}
                rollColor="corallo"
                className={styles.email}
              />
              <span className={styles.location}>{t('location')}</span>
            </div>

            <nav className={styles.col} aria-label={t('navLabel')}>
              <span className={styles.label}>{t('navLabel')}</span>
              <ul className={styles.list}>
                <li>
                  <LetterRoll href="#progetti-head" text={tNav('projects')} className={styles.link} />
                </li>
                <li>
                  <LetterRoll href="#chisono-head" text={tNav('about')} className={styles.link} />
                </li>
                <li>
                  <LetterRoll href="#contatti-head" text={tNav('contact')} className={styles.link} />
                </li>
              </ul>
            </nav>

            <div className={styles.col}>
              <span className={styles.label}>{t('langLabel')}</span>
              <ul className={styles.list}>
                <li>
                  <Link
                    href="/it"
                    className={`${styles.lang} ${locale === 'it' ? styles.langActive : ''}`}
                    aria-current={locale === 'it' ? 'true' : undefined}
                  >
                    IT
                  </Link>
                </li>
                <li>
                  <Link
                    href="/en"
                    className={`${styles.lang} ${locale === 'en' ? styles.langActive : ''}`}
                    aria-current={locale === 'en' ? 'true' : undefined}
                  >
                    EN
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.wordmarkWrap}>
            <span id="footer-wordmark" className={styles.wordmark} aria-label={WORDMARK}>
              {Array.from(WORDMARK).map((c, i) => (
                <span key={i} className={styles.letter} aria-hidden="true">
                  <span className={styles.letterCol}>{c}</span>
                </span>
              ))}
            </span>
          </div>

          <div className={styles.meta}>
            <span>{t('rights')}</span>
            <button type="button" className={styles.backToTop} onClick={scrollTop}>
              {t('backToTop')} ↑
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
