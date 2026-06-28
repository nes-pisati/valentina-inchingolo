'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './ContattiCta.module.css'
import LetterRoll from '../../motion/LetterRoll/LetterRoll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EMAIL = 'valentina.inchingolo@gmail.com'

export default function ContattiCta() {
  const t = useTranslations('contatti')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            once: true,
            invalidateOnRefresh: true,
          },
        })

        tl.from(q('[data-eyebrow]'), { autoAlpha: 0, y: 20, duration: 0.7 }, 0)
          .from(q('[data-question]'), { autoAlpha: 0, y: 30, duration: 0.9 }, 0.05)
          .from(q('[data-email]'), { autoAlpha: 0, y: 30, duration: 0.9 }, 0.25)
          .from(q('[data-location]'), { autoAlpha: 0, y: 30, duration: 0.9 }, 0.4)

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.contatti} aria-labelledby="contatti-head">
      <div className={styles.inner}>
        <header className={styles.head} data-eyebrow>
          <span className={styles.num}>{t('num')}</span>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
        </header>

        <h2 id="contatti-head" className={styles.question} data-question>
          {t('question')}
        </h2>

        <div className={styles.emailWrap} data-email>
          <LetterRoll
            href={`mailto:${EMAIL}`}
            text={EMAIL}
            rollColor="corallo"
            nowrap
            className={styles.email}
          />
        </div>

        <p className={styles.location} data-location>
          {t('location')}
        </p>
      </div>
    </section>
  )
}
