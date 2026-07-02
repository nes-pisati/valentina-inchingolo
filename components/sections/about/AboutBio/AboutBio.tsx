'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import LetterRoll from '../../../motion/LetterRoll/LetterRoll'
import { CONTACTS } from '../../../../lib/contacts'
import styles from './AboutBio.module.css'

import portraitImg from '../../../../public/hp-about.jpg'
import sideImg from '../../../../public/hp-biodiversa.jpg'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Words({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className={styles.word}>
          <span className={`${styles.wordInner} ${accent ? styles.accent : ''}`} data-word>
            {w}
          </span>
        </span>
      ))}
    </>
  )
}

export default function AboutBio() {
  const t = useTranslations('about.bio')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>(q('[data-reveal]')).forEach(el => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          })
        })

        gsap.from(q('[data-word]'), {
          yPercent: 112,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-claim]')[0], start: 'top 84%', once: true },
        })

        gsap.utils.toArray<HTMLElement>(q('[data-clip]')).forEach(el => {
          const img = el.querySelector('img')
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          })
          tl.fromTo(
            el,
            { clipPath: 'inset(14% 10% 14% 10%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'expo.out' },
            0,
          )
          if (img) tl.from(img, { scale: 1.18, duration: 1.15, ease: 'expo.out' }, 0)
        })

        const portrait = q('[data-portrait] img')[0] as HTMLElement | undefined
        if (portrait) {
          gsap.to(portrait, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })
        }

        gsap.to(q('[data-side]'), {
          y: -26,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.bio} aria-labelledby="about-bio-head">
      <div className={styles.inner}>
        <div className={styles.media}>
          <figure className={styles.portrait} data-clip data-portrait>
            <Image
              src={portraitImg}
              alt={t('alt')}
              fill
              className={styles.portraitImg}
              sizes="(max-width: 860px) 90vw, 38vw"
            />
          </figure>
          <figure className={styles.side} data-clip data-side>
            <Image src={sideImg} alt="" fill className={styles.sideImg} sizes="18vw" />
          </figure>
        </div>

        <div className={styles.text}>
          <header className={styles.head} data-reveal>
            <span className={styles.num}>{t('num')}</span>
            <h2 id="about-bio-head" className={styles.occhiello}>
              {t('occhiello')}
            </h2>
          </header>

          <p className={styles.para} data-reveal>
            {t('p1')}
          </p>
          <p className={styles.para} data-reveal>
            {t('p2')}
          </p>

          <p className={styles.claim} data-claim>
            <Words text={t('claimLead')} />
            <Words text={t('claimAccent')} accent />
            <Words text={t('claimTail')} />
          </p>

          <div className={styles.links} data-reveal>
            <LetterRoll
              href={CONTACTS.linkedinUrl}
              text={t('linkedin')}
              rollColor="corallo"
              className={styles.link}
            />
            <LetterRoll
              href={`mailto:${CONTACTS.email}`}
              text={t('email')}
              rollColor="corallo"
              className={styles.link}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
