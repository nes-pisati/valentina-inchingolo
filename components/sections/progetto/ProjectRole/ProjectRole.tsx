'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../../../lib/wp'
import EmText from '../../../ui/EmText'
import styles from './ProjectRole.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const pad = (n: number) => String(n).padStart(2, '0')

export default function ProjectRole({ project }: { project: Project }) {
  const t = useTranslations('progetto')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lead = q('[data-lead]')[0] as HTMLElement

        gsap.set(q('[data-leadline]'), { yPercent: 110 })
        gsap.to(q('[data-leadline]'), {
          yPercent: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: lead, start: 'top 82%', once: true },
        })

        gsap.from(q('[data-label]'), {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        })

        q('[data-row]').forEach(row => {
          const rule = row.querySelector('[data-rule]')
          const items = row.querySelectorAll('[data-rf]')

          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: 'top 85%', once: true },
          })
          tl.from(rule, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.9, ease: 'power4.inOut' }, 0)
            .from(
              items,
              { autoAlpha: 0, y: 20, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
              0.1,
            )
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.role}>
      <div className={styles.grid}>
        <div className={styles.labelCol}>
          <span className={styles.label} data-label>
            <span className={styles.labelNum}>03</span>
            {t('sections.ruolo')}
          </span>
        </div>

        <div className={styles.content}>
          <p className={styles.lead} data-lead>
            {project.ruolo_lead.map((line, i) => (
              <span key={i} className={styles.leadLine}>
                <span className={styles.leadInner} data-leadline>
                  <EmText text={line} />
                </span>
              </span>
            ))}
          </p>

          <ol className={styles.rows}>
            {project.ruolo_attivita.map((item, i) => (
              <li key={item.titolo} className={styles.row} data-row>
                <span className={styles.rule} data-rule aria-hidden="true" />
                <div className={styles.rowGrid}>
                  <span className={styles.n} data-rf>
                    {pad(i + 1)}
                  </span>
                  <h3 className={styles.rt} data-rf>
                    {item.titolo}
                  </h3>
                  <p className={styles.rd} data-rf>
                    {item.descrizione}
                  </p>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
