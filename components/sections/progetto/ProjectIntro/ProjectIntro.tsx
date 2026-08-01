'use client'

import { useRef, useId } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { introDone, onIntro } from '../../../../lib/intro'
import type { Project } from '../../../../lib/wp'
import styles from './ProjectIntro.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={styles.char}>
          <span className={styles.charInner} data-char>
            {ch === ' ' ? ' ' : ch}
          </span>
        </span>
      ))}
    </>
  )
}

export default function ProjectIntro({ project }: { project: Project }) {
  const t = useTranslations('progetto')
  const locale = useLocale()
  const root = useRef<HTMLElement>(null)
  const pathId = useId()

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const wipe = q('[data-wipe]')[0] as HTMLElement
        const media = q('[data-media]')[0] as HTMLElement
        const mediaInner = q('[data-media-inner]')[0] as HTMLElement
        const mediaWrap = q('[data-media-wrap]')[0] as HTMLElement

        gsap.set(q('[data-top] > *'), { autoAlpha: 0, y: 24 })
        gsap.set(q('[data-char]'), { yPercent: 110 })
        gsap.set(q('[data-subline]'), { yPercent: 110 })
        gsap.set(q('[data-rule]'), { scaleX: 0, transformOrigin: '0% 50%' })
        gsap.set(q('[data-mfade]'), { autoAlpha: 0 })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

        const withWipe = introDone()
        if (withWipe) {
          tl.to(wipe, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, 0).set(wipe, {
            display: 'none',
          })
        } else {
          gsap.set(wipe, { display: 'none' })
        }

        const base = withWipe ? 0.55 : 0
        tl.to(q('[data-top] > *'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 }, base + 0.1)
          .to(
            q('[data-char]'),
            { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 },
            base + 0.25,
          )
          .to(q('[data-subline]'), { yPercent: 0, duration: 0.8, stagger: 0.1 }, base + 0.7)
          .to(
            q('[data-rule]'),
            { scaleX: 1, duration: 0.9, ease: 'power4.inOut', stagger: 0.08 },
            base + 0.9,
          )
          .to(q('[data-mfade]'), { autoAlpha: 1, duration: 0.6, stagger: 0.08 }, base + 0.9)

        if (withWipe) tl.play()
        else onIntro(() => tl.play())

        gsap.to(q('[data-title]')[0] as HTMLElement, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        const narrow = window.matchMedia('(max-width: 899px)')
        gsap.fromTo(
          media,
          { scale: () => (narrow.matches ? 0.8 : 0.62) },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: mediaWrap,
              start: 'top 95%',
              end: 'top 20%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        )
        gsap.fromTo(
          mediaInner,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: mediaWrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        )

        gsap.to(q('[data-badge-svg]'), {
          rotation: 360,
          duration: 40,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
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
    <section ref={root} className={styles.intro}>
      <div className={styles.wipe} data-wipe aria-hidden="true">
        <span className={styles.wipeLabel}>{t('wipe')}</span>
      </div>

      <div className={styles.top} data-top>
        <Link href={`/${locale}#progetti-head`} className={styles.back}>
          <span className={styles.backArrow} aria-hidden="true">
            ←
          </span>
          {t('back')}
        </Link>
        <span className={styles.eyebrow}>
          {t('caseStudy')} · {project.numero}
        </span>
      </div>

      <h1 className={styles.title} data-title aria-label={project.titolo}>
        <span aria-hidden="true">
          <Chars text={project.titolo} />
        </span>
      </h1>

      <div className={styles.subRow}>
        <p className={styles.subtitle}>
          <span className={styles.subLine}>
            <span className={styles.subInner} data-subline>
              {project.sottotitolo_riga1}
            </span>
          </span>
          <span className={styles.subLine}>
            <span className={`${styles.subInner} ${styles.subAccent}`} data-subline>
              {project.sottotitolo_accento}
            </span>
          </span>
        </p>

        <div className={styles.badge} aria-hidden="true">
          <svg className={styles.badgeSvg} data-badge-svg viewBox="0 0 120 120">
            <defs>
              <path
                id={pathId}
                d="M 60,60 m -48,0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0"
                fill="none"
              />
            </defs>
            <text className={styles.badgeText}>
              <textPath href={`#${pathId}`}>{project.badge_testo}</textPath>
            </text>
          </svg>
          <span className={styles.badgeStar}>✳</span>
        </div>
      </div>

      <ul className={styles.meta}>
        {project.meta.map(m => (
          <li key={m.label} className={styles.metaItem}>
            <span className={styles.rule} data-rule aria-hidden="true" />
            <span className={styles.metaLabel} data-mfade>
              {m.label}
            </span>
            <span
              className={`${styles.metaValue} ${m.highlight ? styles.metaHighlight : ''}`}
              data-mfade
            >
              {m.valore}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.mediaWrap} data-media-wrap>
        <figure className={styles.media} data-media>
          <div className={styles.mediaInner} data-media-inner>
            <Image
              src={project.hero_media}
              alt={project.hero_alt}
              fill
              priority
              className={styles.img}
              sizes="100vw"
            />
            <span className={styles.overlay} aria-hidden="true" />
          </div>
        </figure>
      </div>
    </section>
  )
}
