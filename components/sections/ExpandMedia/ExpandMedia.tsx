'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './ExpandMedia.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CONTAINED = 'inset(8% 14% round 28px)'
const FULL = 'inset(0% 0% round 0px)'

export default function ExpandMedia() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const frame = q('[data-frame]')[0] as HTMLElement
      const media = q('[data-media]')[0] as HTMLElement

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(frame, { clipPath: CONTAINED })
        gsap.set(media, { yPercent: -8 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.to(frame, { clipPath: FULL, duration: 1 }, 0)
        tl.to(media, { yPercent: 8, duration: 1 }, 0)
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(frame, { clipPath: FULL })
        gsap.set(media, { yPercent: 0 })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.expand} aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.frame} data-frame>
          <div className={styles.media} data-media>
            <Image
              className={styles.img}
              src="/hero_placeholder.jpeg"
              alt=""
              fill
              sizes="100vw"
              quality={85}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
