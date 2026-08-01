'use client'

import { useRef, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../../../lib/wp'
import styles from './ProjectChallenge.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Words({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g)
  const out: ReactNode[] = []
  parts.forEach((seg, si) => {
    const isEm = si % 2 === 1
    seg
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w, wi) => {
        const word = (
          <span className={styles.w} data-w>
            {w}
          </span>
        )
        out.push(
          isEm ? (
            <em key={`${si}-${wi}`} className={styles.em}>
              {word}
            </em>
          ) : (
            <span key={`${si}-${wi}`} className={styles.wWrap}>
              {word}
            </span>
          ),
          ' ',
        )
      })
  })
  return <>{out}</>
}

export default function ProjectChallenge({ project }: { project: Project }) {
  const t = useTranslations('progetto')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const statement = q('[data-statement]')[0] as HTMLElement

        gsap.set(q('[data-w]'), { opacity: 0.14 })
        gsap.to(q('[data-w]'), {
          opacity: 1,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: {
            trigger: statement,
            start: 'top 78%',
            end: 'top 30%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        gsap.fromTo(
          q('[data-watermark]')[0] as HTMLElement,
          { yPercent: 20 },
          {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        )

        q('[data-fade]').forEach(el => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 24,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          })
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.challenge}>
      <span className={styles.watermark} data-watermark aria-hidden="true">
        02
      </span>

      <div className={styles.inner}>
        <span className={styles.label} data-fade>
          <span className={styles.labelNum}>02</span>
          {t('sections.sfida')}
        </span>

        <p className={styles.statement} data-statement>
          <Words text={project.sfida_statement} />
        </p>

        <div className={styles.body}>
          {project.sfida_body.map((p, i) => (
            <p key={i} className={styles.bodyP} data-fade>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
