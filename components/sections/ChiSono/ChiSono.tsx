'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './ChiSono.module.css'

import aboutImg from '../../../public/hp-about.jpg'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EXPERIENCES = ['treebee', 'lordgun', 'ideagency', 'italtech'] as const

export default function ChiSono() {
  const t = useTranslations('chisono')
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

        tl.from(q('[data-figure]'), { autoAlpha: 0, yPercent: 6, duration: 0.9 }, 0)
          .from(q('[data-portrait]'), { scale: 1.25, duration: 1.4, ease: 'expo.out' }, 0)
          .from(q('[data-eyebrow]'), { autoAlpha: 0, y: 20, duration: 0.7 }, 0.1)
          .from(q('[data-para]'), { autoAlpha: 0, y: 28, duration: 0.8, stagger: 0.12 }, 0.15)
          .from(q('[data-exp]'), { autoAlpha: 0, y: 28, duration: 0.8 }, 0.45)

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.chisono} aria-labelledby="chisono-head">
      <div className={styles.inner}>
        <figure className={styles.portrait} data-figure>
          <span className={styles.portraitInner} data-portrait>
            <Image
              src={aboutImg}
              alt={t('alt')}
              fill
              className={styles.portraitImg}
              sizes="(max-width: 768px) 90vw, 42vw"
              placeholder="blur"
            />
          </span>
        </figure>

        <div className={styles.text}>
          <header className={styles.head} data-eyebrow>
            <span className={styles.num}>{t('num')}</span>
            <h2 id="chisono-head" className={styles.occhiello}>
              {t('occhiello')}
            </h2>
          </header>

          <p className={styles.para} data-para>
            {t.rich('p1', {
              em: (chunks: ReactNode) => <em className={styles.accent}>{chunks}</em>,
            })}
          </p>
          <p className={styles.para} data-para>
            {t.rich('p2', {
              em: (chunks: ReactNode) => <em className={styles.accent}>{chunks}</em>,
            })}
          </p>

          <div className={styles.experiences} data-exp>
            <span className={styles.expLabel}>{t('experiencesLabel')}</span>
            <ul className={styles.expList}>
              {EXPERIENCES.map((key) => (
                <li key={key} className={styles.expItem}>
                  <span className={styles.expName}>{t(`experiences.${key}.name`)}</span>
                  <span className={styles.expRole}>{t(`experiences.${key}.role`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
