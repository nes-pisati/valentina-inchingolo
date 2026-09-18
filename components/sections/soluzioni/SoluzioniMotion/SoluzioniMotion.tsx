'use client'

import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  countUp,
  revealFades,
  revealLines,
  revealMedia,
  revealRows,
  REVEAL_STARTS,
  REVEAL_STARTS_MOBILE,
} from '../../../motion/reveals'
import {
  checkup,
  confronto,
  faq,
  heroIntro,
  livelliDesktop,
  livelliMobile,
  marquee,
  method,
} from './sections'
import { hovers, rowHover } from './hovers'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HEADER_OFFSET = -70

type Lenis = {
  scrollTo: (target: HTMLElement, options: { offset: number; duration: number }) => void
}

type Props = {
  className?: string
  children: ReactNode
}

export default function SoluzioniMotion({ className, children }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const mm = gsap.matchMedia()

      mm.add(
        { noReduce: '(prefers-reduced-motion: no-preference)', small: '(max-width: 760px)' },
        context => {
          const { noReduce, small } = context.conditions ?? {}
          if (!noReduce) return

          const starts = small ? REVEAL_STARTS_MOBILE : REVEAL_STARTS
          const offIntro = heroIntro(el)
          revealLines(el, starts.lines)
          revealFades(el, starts.fade)
          revealRows(el, starts.rows)
          revealMedia(el, starts.media)
          const restoreCounts = countUp(el, starts.fade)
          marquee(el)
          checkup(el)
          confronto(el)
          method(el)
          const offFaq = faq(el)

          if (document.fonts) {
            document.fonts.ready.then(() => ScrollTrigger.refresh())
          }

          return () => {
            offIntro()
            offFaq()
            restoreCounts()
          }
        },
      )

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        livelliDesktop(el)
      })

      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1023px)', () => {
        livelliMobile(el)
      })

      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () =>
        hovers(el),
      )

      mm.add('(min-width: 900px) and (hover: hover) and (pointer: fine)', () => rowHover(el))

      const onClick = (e: MouseEvent) => {
        const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
        const id = link?.getAttribute('href')?.slice(1)
        const target = id ? document.getElementById(id) : null
        if (!target) return

        e.preventDefault()
        const lenis = (window as Window & { lenis?: Lenis }).lenis
        if (lenis) {
          lenis.scrollTo(target, { offset: HEADER_OFFSET, duration: 1.4 })
        } else {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET,
            behavior: reduce ? 'auto' : 'smooth',
          })
        }
        history.replaceState(null, '', `#${id}`)
      }

      el.addEventListener('click', onClick)
      return () => el.removeEventListener('click', onClick)
    },
    { scope: root },
  )

  return (
    <main ref={root} className={className}>
      {children}
    </main>
  )
}
