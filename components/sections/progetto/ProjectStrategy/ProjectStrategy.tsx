'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../../../lib/wp'
import EmText from '../../../ui/EmText'
import styles from './ProjectStrategy.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function ProjectStrategy({ project }: { project: Project }) {
  const t = useTranslations('progetto')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      let alive = true

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const materialsInner = document.getElementById('materialsInner')
        const dimmer = document.getElementById('matDimmer')
        const inner = q('[data-inner]')[0] as HTMLElement

        if (materialsInner && dimmer && inner) {
          const overlapST = () => ({
            trigger: root.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          })
          gsap.to(materialsInner, {
            scale: 0.94,
            ease: 'none',
            transformOrigin: '50% 100%',
            scrollTrigger: overlapST(),
          })
          gsap.to(dimmer, { opacity: 0.6, ease: 'none', scrollTrigger: overlapST() })
          gsap.fromTo(
            inner,
            { yPercent: 8 },
            { yPercent: 0, ease: 'none', scrollTrigger: overlapST() },
          )
        }

        const lead = q('[data-lead]')[0] as HTMLElement
        gsap.set(q('[data-leadline]'), { yPercent: 110 })
        gsap.to(q('[data-leadline]'), {
          yPercent: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: lead, start: 'top 82%', once: true },
        })

        q('[data-fade]').forEach(el => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 24,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          })
        })

        q('[data-figure]').forEach(fig => {
          const rule = fig.querySelector('[data-frule]')
          const count = fig.querySelector('[data-count]')

          gsap.from(rule, {
            scaleX: 0,
            transformOrigin: '0% 50%',
            duration: 1,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: fig, start: 'top 85%', once: true },
          })

          if (count) {
            gsap.from(count, {
              textContent: 0,
              duration: 1.6,
              ease: 'expo.out',
              snap: { textContent: 1 },
              scrollTrigger: { trigger: fig, start: 'top 85%', once: true },
            })
          }
        })

        const outline = q('[data-outline]')[0]
        if (outline) {
          gsap.fromTo(
            outline,
            { xPercent: 4 },
            {
              xPercent: -24,
              ease: 'none',
              scrollTrigger: {
                trigger: outline,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          )
        }

        if (document.fonts) {
          document.fonts.ready.then(() => {
            if (alive) ScrollTrigger.refresh()
          })
        }

        return () => {
          alive = false
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="strategia" className={styles.strategy}>
      <div id="strategyInner" className={styles.inner} data-inner>
        <div className={styles.grid}>
          <div className={styles.labelCol}>
            <span className={styles.label} data-fade>
              <span className={styles.labelNum}>05</span>
              {t('sections.strategia')}
            </span>
          </div>

          <div className={styles.content}>
            <p className={styles.lead} data-lead>
              {project.strategia_lead.map((line, i) => (
                <span key={i} className={styles.leadLine}>
                  <span className={styles.leadInner} data-leadline>
                    <EmText text={line} />
                  </span>
                </span>
              ))}
            </p>

            <p className={styles.paragraph} data-fade>
              {project.strategia_paragrafo}
            </p>

            {project.risultati.length > 0 && (
              <ul className={styles.figures}>
                {project.risultati.map(r => (
                  <li key={r.descrizione} className={styles.figure} data-figure>
                    <span className={styles.frule} data-frule aria-hidden="true" />
                    <span className={styles.value}>
                      {r.prefisso && <span className={styles.prefix}>{r.prefisso}</span>}
                      <span data-count>{r.valore}</span>
                      {r.unita && <span className={styles.unit}>{r.unita}</span>}
                    </span>
                    <p className={styles.fdesc}>{r.descrizione}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className={styles.outline} data-outline aria-hidden="true">
          <EmText text={project.outline} />
        </p>

        <div className={styles.grid}>
          <div />
          <p className={styles.demonstrates} data-fade>
            <span className={styles.marker}>{t('demonstrates')} —</span>{' '}
            {project.cosa_dimostra}
          </p>
        </div>
      </div>
    </section>
  )
}
