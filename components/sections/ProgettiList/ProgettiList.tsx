'use client'

import { useRef, type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './ProgettiList.module.css'

import pollyImg from '../../../public/hp-polly.jpg'
import biodiversaImg from '../../../public/hp-biodiversa.jpg'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Project = { key: string; slug: string; img: StaticImageData }

const PROJECTS: Project[] = [
  { key: 'polly', slug: 'mypolly', img: pollyImg },
  { key: 'biodiversa', slug: 'app-biodiversa', img: biodiversaImg },
]

const pad = (n: number) => String(n).padStart(2, '0')

export default function ProgettiList() {
  const t = useTranslations('progetti')
  const locale = useLocale()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('[data-head]'), {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('[data-head]')[0], start: 'top 85%', once: true },
        })

        q('[data-row]').forEach((row) => {
          const meta = row.querySelector('[data-meta]')
          const title = row.querySelector('[data-title]')
          const result = row.querySelector('[data-result]')

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: row, start: 'top 82%', once: true, invalidateOnRefresh: true },
          })
          tl.from(meta, { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out' }, 0)
            .from(title, { yPercent: 110, duration: 0.9 }, 0.08)
            .from(result, { autoAlpha: 0, y: 20, duration: 0.7 }, 0.28)
        })

        if (document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      })

      mm.add('(min-width: 768px) and (pointer: fine)', () => {
        const panel = q('[data-panel]')[0]
        const pimgs = q('[data-pimg]')
        const list = q('[data-list]')[0]
        const rows = q('[data-row]')
        if (!panel || !list) return

        gsap.set(panel, { autoAlpha: 0 })
        gsap.set(pimgs, { autoAlpha: 0 })

        let revealed = false
        const enters = rows.map((row, i) => {
          const handler = () => {
            if (!revealed) {
              revealed = true
              gsap.fromTo(
                panel,
                { scale: 1.05 },
                { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
              )
            }
            pimgs.forEach((im, j) =>
              gsap.to(im, { autoAlpha: j === i ? 1 : 0, duration: 0.4, ease: 'power2.out' }),
            )
          }
          row.addEventListener('mouseenter', handler)
          return { row, handler }
        })

        const onLeave = () => {
          revealed = false
          gsap.to(panel, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
        }
        list.addEventListener('mouseleave', onLeave)

        return () => {
          enters.forEach(({ row, handler }) => row.removeEventListener('mouseenter', handler))
          list.removeEventListener('mouseleave', onLeave)
        }
      })

      mm.add('(max-width: 767px)', () => {
        const list = q('[data-list]')[0] as HTMLElement | undefined
        const dots = q('[data-dot]')
        const rows = q('[data-row]') as HTMLElement[]
        if (!list || !dots.length || !rows.length) return
        const activeCls = styles.dotActive ?? ''

        let raf = 0
        const update = () => {
          raf = 0
          const x = list.scrollLeft
          let active = 0
          let activeDist = Infinity
          rows.forEach((r, idx) => {
            const dist = Math.abs(r.offsetLeft - x)
            if (dist < activeDist) {
              activeDist = dist
              active = idx
            }
          })
          dots.forEach((d, j) => d.classList.toggle(activeCls, j === active))
        }
        const onScroll = () => {
          if (!raf) raf = requestAnimationFrame(update)
        }
        list.addEventListener('scroll', onScroll, { passive: true })
        update()

        return () => {
          list.removeEventListener('scroll', onScroll)
          if (raf) cancelAnimationFrame(raf)
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.progetti} aria-labelledby="progetti-head">
      <div className={styles.inner}>
        <header className={styles.head} data-head>
          <span className={styles.num}>{t('num')}</span>
          <h2 id="progetti-head" className={styles.occhiello}>
            {t('occhiello')}
          </h2>
        </header>

        <div className={styles.layout}>
          <div className={styles.list} data-list>
            {PROJECTS.map((p, i) => (
              <Link
                key={p.key}
                href={`/${locale}/progetti/${p.slug}`}
                className={styles.row}
                data-row
              >
                <span className={styles.meta} data-meta>
                  <span className={styles.rowNum}>{pad(i + 1)}</span>
                  <span className={styles.tag}>{t(`items.${p.key}.tag`)}</span>
                </span>

                <span className={styles.title}>
                  <span className={styles.titleMask}>
                    <span className={styles.titleInner} data-title>
                      {t(`items.${p.key}.title`)}
                    </span>
                  </span>
                </span>

                <span className={styles.result} data-result>
                  {t.rich(`items.${p.key}.result`, {
                    em: (chunks: ReactNode) => <em className={styles.accent}>{chunks}</em>,
                  })}
                </span>

                <span className={styles.media} aria-hidden="true">
                  <Image
                    src={p.img}
                    alt=""
                    className={styles.mediaImg}
                    sizes="100vw"
                    placeholder="blur"
                  />
                  <span className={styles.overlay} />
                </span>
              </Link>
            ))}
          </div>

          <div className={styles.previewCol} aria-hidden="true">
            <div className={styles.panel} data-panel>
              {PROJECTS.map((p) => (
                <figure key={p.key} className={styles.panelImg} data-pimg>
                  <Image
                    src={p.img}
                    alt=""
                    fill
                    className={styles.panelImgEl}
                    sizes="33vw"
                    placeholder="blur"
                  />
                  <span className={styles.overlay} />
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.dots} aria-hidden="true">
          {PROJECTS.map((p) => (
            <span key={p.key} className={styles.dot} data-dot />
          ))}
        </div>
      </div>
    </section>
  )
}
