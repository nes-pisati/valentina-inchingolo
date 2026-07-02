'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import styles from './Header.module.css'
import LetterRoll from '../../motion/LetterRoll/LetterRoll'

const WORDMARK = 'VALEINK'
const ON_DARK = /^\/(it|en)\/contatti\/?$/
const SCROLL_THRESHOLD = 24
const DELTA = 6
const EASE_PANEL = [0.76, 0, 0.24, 1] as const
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

export default function Header() {
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const onDark = ON_DARK.test(pathname)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)
  const lastY = useRef(0)
  const reduceMotion = useReducedMotion()

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMenuOpen(false)
  }

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

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const panelTransition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.55, ease: EASE_PANEL }
  const listVariants = {
    open: {
      transition: reduceMotion
        ? { duration: 0.01 }
        : { delayChildren: 0.15, staggerChildren: 0.07 },
    },
    closed: {},
  }
  const itemVariants = {
    open: { y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_REVEAL } },
    closed: { y: reduceMotion ? 0 : 20, opacity: 0 },
  }

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
                href={`/${locale}/about`}
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

          <button
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? tNav('closeMenu') : tNav('openMenu')}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBarOpen : ''}`} />
            <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBarOpen : ''}`} />
            <span className={`${styles.burgerBar} ${menuOpen ? styles.burgerBarOpen : ''}`} />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className={styles.backdrop}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={panelTransition}
            />
            <motion.div
              id="mobile-menu"
              className={styles.drawer}
              role="dialog"
              aria-modal="true"
              aria-label={tNav('openMenu')}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={panelTransition}
            >
              <motion.ul
                className={styles.drawerList}
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.li variants={itemVariants}>
                  <a
                    href="#progetti-head"
                    className={styles.drawerLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {tNav('projects')}
                  </a>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link
                    href={`/${locale}/about`}
                    className={styles.drawerLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {tNav('about')}
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link
                    href={`/${locale}/contatti`}
                    className={styles.drawerLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {tNav('contact')}
                  </Link>
                </motion.li>
              </motion.ul>

              <motion.ul
                className={styles.drawerLangs}
                aria-label="Lingua"
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <li>
                  <Link
                    href="/it"
                    className={`${styles.drawerLang} ${
                      locale === 'it' ? styles.drawerLangActive : ''
                    }`}
                    aria-current={locale === 'it' ? 'true' : undefined}
                  >
                    IT
                  </Link>
                </li>
                <li aria-hidden="true" className={styles.drawerLangSep}>
                  /
                </li>
                <li>
                  <Link
                    href="/en"
                    className={`${styles.drawerLang} ${
                      locale === 'en' ? styles.drawerLangActive : ''
                    }`}
                    aria-current={locale === 'en' ? 'true' : undefined}
                  >
                    EN
                  </Link>
                </li>
              </motion.ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
