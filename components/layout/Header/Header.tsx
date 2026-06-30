'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import styles from './Header.module.css'
import LetterRoll from '../../motion/LetterRoll/LetterRoll'

const WORDMARK = 'VALEINK'
const ON_DARK = /^\/(it|en)\/contatti\/?$/
const SCROLL_THRESHOLD = 24
const DELTA = 6

export default function Header() {
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const onDark = ON_DARK.test(pathname)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > SCROLL_THRESHOLD)

      const diff = y - lastY.current
      if (Math.abs(diff) > DELTA) {
        setHidden(diff > 0 && y > SCROLL_THRESHOLD)
        lastY.current = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${
        hidden ? styles.hidden : ''
      } ${onDark ? styles.onDark : ''}`}
    >
      <div className={styles.inner}>
        <Link href={`/${locale}`} className={styles.wordmark} aria-label={WORDMARK}>
          {WORDMARK}
        </Link>

        <nav className={styles.nav} aria-label="Naviga">
          <ul className={styles.list}>
            <li>
              <LetterRoll
                href="#progetti-head"
                text={tNav('projects')}
                rollColor="corallo"
                className={styles.link}
              />
            </li>
            <li>
              <LetterRoll
                href="#chisono-head"
                text={tNav('about')}
                rollColor="corallo"
                className={styles.link}
              />
            </li>
            <li>
              <LetterRoll
                href={`/${locale}/contatti`}
                text={tNav('contact')}
                rollColor="corallo"
                className={styles.link}
              />
            </li>
          </ul>

          <ul className={styles.langs} aria-label="Lingua">
            <li>
              <Link
                href="/it"
                className={`${styles.lang} ${locale === 'it' ? styles.langActive : ''}`}
                aria-current={locale === 'it' ? 'true' : undefined}
              >
                IT
              </Link>
            </li>
            <li aria-hidden="true" className={styles.langSep}>
              /
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
        </nav>
      </div>
    </header>
  )
}
