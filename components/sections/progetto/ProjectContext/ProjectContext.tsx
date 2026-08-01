'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../../../lib/wp'
import EmText from '../../../ui/EmText'
import styles from './ProjectContext.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function ProjectContext({ project }: { project: Project }) {
  const t = useTranslations('progetto')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lead = q('[data-lead]')[0] as HTMLElement
        const imgBox = q('[data-img-box]')[0] as HTMLElement
        const imgInner = q('[data-img-inner]')[0] as HTMLElement

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

        gsap.set(imgBox, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.to(imgBox, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.05,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: imgBox, start: 'top 85%', once: true },
        })
        gsap.fromTo(
          imgInner,
          { yPercent: -14 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: imgBox,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        )

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.context}>
      <div className={styles.grid}>
        <div className={styles.labelCol}>
          <span className={styles.label} data-fade>
            <span className={styles.labelNum}>01</span>
            {t('sections.contesto')}
          </span>
        </div>

        <div className={styles.textCol}>
          <p className={styles.lead} data-lead>
            {project.contesto_lead.map((line, i) => (
              <span key={i} className={styles.leadLine}>
                <span className={styles.leadInner} data-leadline>
                  <EmText text={line} />
                </span>
              </span>
            ))}
          </p>

          <div className={styles.body}>
            {project.contesto_body.map((p, i) => (
              <p key={i} className={styles.bodyP} data-fade>
                {p}
              </p>
            ))}
          </div>
        </div>

        <figure className={styles.figure}>
          <div className={styles.imgBox} data-img-box>
            <div className={styles.imgInner} data-img-inner>
              <Image
                src={project.contesto_img}
                alt=""
                fill
                className={styles.img}
                sizes="(max-width: 899px) 100vw, 30vw"
              />
            </div>
            <span className={styles.overlay} aria-hidden="true" />
          </div>
          <figcaption className={styles.caption} data-fade>
            {project.contesto_caption}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
