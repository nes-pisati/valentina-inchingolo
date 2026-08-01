'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Project, Duotone } from '../../../../lib/wp'
import styles from './ProjectMaterials.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const VARIANTS = [styles.ta, styles.tb, styles.tc, styles.td]

const DUOTONE: Record<Duotone, string> = {
  cipria: styles.ovCipria ?? '',
  ink: styles.ovInk ?? '',
  corallo: styles.ovCorallo ?? '',
  grigio: styles.ovGrigio ?? '',
}

export default function ProjectMaterials({ project }: { project: Project }) {
  const t = useTranslations('progetto')
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let alive = true

        ScrollTrigger.getById('materiali-pin')?.kill()
        const pin = ScrollTrigger.create({
          id: 'materiali-pin',
          trigger: root.current,
          start: 'bottom bottom',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })

        gsap.from(q('[data-head]'), {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-head]')[0], start: 'top 86%', once: true },
        })

        q('[data-tile]').forEach(tile => {
          const clip = tile.querySelector('[data-clip]')
          const img = tile.querySelector('[data-timg]')
          const speed = Number((tile as HTMLElement).dataset.speed ?? 0)

          gsap.set(clip, { clipPath: 'inset(100% 0% 0% 0%)' })
          gsap.to(clip, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.05,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: tile, start: 'top 85%', once: true },
          })

          if (speed) {
            gsap.fromTo(
              tile,
              { y: speed },
              {
                y: -speed,
                ease: 'none',
                scrollTrigger: {
                  trigger: tile,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          gsap.fromTo(
            img,
            { yPercent: -10 },
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: tile,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          )
        })

        if (document.fonts) {
          document.fonts.ready.then(() => {
            if (alive) ScrollTrigger.refresh()
          })
        }

        return () => {
          alive = false
          pin.kill()
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="materiali" className={styles.materials}>
      <div id="materialsInner" className={styles.inner}>
        <header className={styles.head} data-head>
          <span className={styles.labelNum}>04</span>
          <span className={styles.occhiello}>{t('sections.materiali')}</span>
        </header>

        <div className={styles.grid}>
          {project.materiali.map((tile, i) => (
            <figure
              key={tile.img}
              className={`${styles.tile} ${VARIANTS[i % VARIANTS.length]}`}
              data-tile
              data-speed={tile.speed}
            >
              <div className={styles.clip} data-clip>
                <div className={styles.tileImg} data-timg>
                  <Image
                    src={tile.img}
                    alt=""
                    fill
                    className={styles.img}
                    sizes="(max-width: 899px) 100vw, 50vw"
                  />
                </div>
                <span
                  className={`${styles.overlay} ${DUOTONE[tile.duotone]}`}
                  aria-hidden="true"
                />
              </div>
              <figcaption className={styles.cap}>{tile.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <span id="matDimmer" className={styles.dimmer} aria-hidden="true" />
    </section>
  )
}
