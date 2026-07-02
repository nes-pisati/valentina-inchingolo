'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { introDone, onIntro } from '../../../../lib/intro'
import styles from './AboutHero.module.css'

import imgA from '../../../../public/hero_placeholder.jpeg'
import imgB from '../../../../public/hp-polly.jpg'

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

export default function AboutHero() {
  const t = useTranslations('about')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const wipe = q('[data-wipe]')[0] as HTMLElement
        const lines = gsap.utils.toArray<HTMLElement>(q('[data-line]'))
        const imgs = gsap.utils.toArray<HTMLElement>(q('[data-img]'))

        gsap.set(q('[data-eyebrow]'), { autoAlpha: 0, y: 24 })
        gsap.set(q('[data-char]'), { yPercent: 112 })
        gsap.set(imgs, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(q('[data-meta]'), { autoAlpha: 0, y: 18 })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

        const withWipe = introDone()
        if (withWipe) {
          tl.to(wipe, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, 0.15).set(wipe, {
            display: 'none',
          })
        } else {
          gsap.set(wipe, { display: 'none' })
        }

        tl.to(q('[data-eyebrow]'), { autoAlpha: 1, y: 0, duration: 0.7 }, withWipe ? '-=.25' : 0.1)
          .to(
            q('[data-l1] [data-char]'),
            { yPercent: 0, duration: 0.9, stagger: 0.035, ease: 'expo.out' },
            '-=.45',
          )
          .to(
            q('[data-l2] [data-char]'),
            { yPercent: 0, duration: 0.9, stagger: 0.035, ease: 'expo.out' },
            '-=.75',
          )
          .to(
            imgs,
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, stagger: 0.12, ease: 'expo.out' },
            '-=.7',
          )
          .to(q('[data-meta]'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=.6')

        if (withWipe) tl.play()
        else onIntro(() => tl.play())

        lines.forEach(line => {
          gsap.to(line, {
            xPercent: Number(line.dataset.drift ?? 0),
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          })
        })

        imgs.forEach(img => {
          gsap.to(img, {
            y: Number(img.dataset.speed ?? 0),
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          })
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-wipe]'), { display: 'none' })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.hero}>
      <div className={styles.wipe} data-wipe aria-hidden="true">
        <span className={styles.wipeLabel}>{t('wipe')}</span>
      </div>

      <header className={styles.head} data-eyebrow>
        <span className={styles.num}>{t('hero.num')}</span>
        <p className={styles.occhiello}>{t('hero.occhiello')}</p>
      </header>

      <h1 className={styles.title} aria-label={t('hero.titleAria')}>
        <span className={styles.l1} data-line data-l1 data-drift="-6" aria-hidden="true">
          <Chars text={t('hero.l1')} />
        </span>
        <span className={styles.l2} data-line data-l2 data-drift="4" aria-hidden="true">
          <Chars text={t('hero.l2')} />
        </span>
      </h1>

      <ul className={styles.meta}>
        <li className={styles.metaItem} data-meta>
          {t('hero.meta1')}
        </li>
        <li className={styles.metaItem} data-meta>
          {t('hero.meta2')}
        </li>
        <li className={styles.metaItem} data-meta>
          {t('hero.meta3')}
        </li>
      </ul>

      <figure className={`${styles.img} ${styles.imgA}`} data-img data-speed="-70">
        <Image
          src={imgA}
          alt=""
          fill
          priority
          className={styles.imgEl}
          sizes="(max-width: 860px) 40vw, 24vw"
        />
      </figure>
      <figure className={`${styles.img} ${styles.imgB}`} data-img data-speed="50">
        <Image src={imgB} alt="" fill className={styles.imgEl} sizes="18vw" />
      </figure>
    </section>
  )
}
