'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { onIntroComplete } from '../../../lib/intro'
import { CONTACTS } from '../../../lib/contacts'
import { EN_PUBLISHED } from '../../../lib/locales'
import styles from './Footer.module.css'
import LetterRoll from '../../motion/LetterRoll/LetterRoll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WORDMARK = 'Valentina Inchingolo · Ink the Gap'
const WORDMARK_ACCENT_FROM = WORDMARK.indexOf('·') - 1

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const sentinel = useRef<HTMLDivElement>(null)
  const footer = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => onIntroComplete(() => setRevealed(true)), [])

  useEffect(() => {
    const el = footer.current?.querySelector<HTMLElement>(`.${styles.wordmark}`)
    if (!el) return

    const fit = () => {
      const avail = el.clientWidth
      if (!avail) return
      el.style.fontSize = '100px'
      el.style.justifyContent = 'flex-start'
      const natural = el.scrollWidth
      el.style.justifyContent = ''
      el.style.fontSize = `${((100 * avail) / natural) * 0.99}px`
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    if (document.fonts) document.fonts.ready.then(fit)

    return () => ro.disconnect()
  }, [])

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
          yPercent: 140,
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
                href={`mailto:${CONTACTS.email}`}
                text={CONTACTS.email}
                rollColor="corallo"
                className={styles.email}
              />
              <a
                href={CONTACTS.linkedinUrl}
                className={styles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
              <p className={styles.tagline}>{t('tagline')}</p>
            </div>

            <nav className={styles.col} aria-label={t('navLabel')}>
              <span className={styles.label}>{t('navLabel')}</span>
              <ul className={styles.list}>
                <li>
                  <LetterRoll
                    href={`/${locale}/soluzioni`}
                    text={tNav('solutions')}
                    className={styles.link}
                  />
                </li>
                {/* DISATTIVATO: voce Progetti nascosta in questa fase */}
                {/* <li>
                  <LetterRoll href={`/${locale}/progetti`} text={tNav('projects')} className={styles.link} />
                </li> */}
                <li>
                  <LetterRoll
                    href={`/${locale}/about`}
                    text={tNav('about')}
                    className={styles.link}
                  />
                </li>
                <li>
                  <LetterRoll
                    href={`/${locale}/contatti`}
                    text={tNav('contact')}
                    className={styles.link}
                  />
                </li>
              </ul>
            </nav>

            {EN_PUBLISHED && (
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
            )}
          </div>

          <div className={styles.wordmarkWrap}>
            <span id="footer-wordmark" className={styles.wordmark} aria-label={WORDMARK}>
              {Array.from(WORDMARK).map((c, i) => (
                <span
                  key={i}
                  className={`${styles.letter} ${i >= WORDMARK_ACCENT_FROM ? styles.letterAccent : ''}`}
                  aria-hidden="true"
                >
                  <span className={styles.letterCol}>{c === ' ' ? '\u00a0' : c}</span>
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
