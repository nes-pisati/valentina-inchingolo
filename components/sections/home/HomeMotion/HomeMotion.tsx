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
  checkup as phases,
  livelliDesktop,
  livelliMobile,
  marquee,
} from '../../soluzioni/SoluzioniMotion/sections'
import { hovers } from '../../soluzioni/SoluzioniMotion/hovers'
import { bigTitle, fillRows, introMotion } from './sections'
import { track } from '../../../../lib/track'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HEADER_OFFSET = -70

type Lenis = {
  scrollTo: (target: HTMLElement, options: { offset: number; duration: number }) => void
}

type Props = {
  className?: string
  children: ReactNode
}

/**
 * Orchestratore della home: stesso sistema di SoluzioniMotion (reveal, card a
 * scala, fasi, hover), piu' i momenti propri della home (intro VALE/INK/THE GAP,
 * parole che si riempiono, titolo finale per lettera).
 * ExpandMedia resta autonoma: ha il suo useGSAP.
 */
export default function HomeMotion({ className, children }: Props) {
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
          const offIntro = introMotion(el)
          revealLines(el, starts.lines)
          revealFades(el, starts.fade)
          revealRows(el, starts.rows)
          revealMedia(el, starts.media)
          const restoreCounts = countUp(el, starts.fade)
          marquee(el)
          phases(el)
          fillRows(el)
          bigTitle(el)

          if (document.fonts) {
            document.fonts.ready.then(() => ScrollTrigger.refresh())
          }

          return () => {
            offIntro()
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

      const onClick = (e: MouseEvent) => {
        const target = e.target as Element | null

        const tracked = target?.closest<HTMLElement>('[data-track]')
        if (tracked?.dataset.track) track(tracked.dataset.track)

        const link = target?.closest<HTMLAnchorElement>('a[href^="#"]')
        const id = link?.getAttribute('href')?.slice(1)
        const anchor = id ? document.getElementById(id) : null
        if (!anchor) return

        e.preventDefault()
        const lenis = (window as Window & { lenis?: Lenis }).lenis
        if (lenis) {
          lenis.scrollTo(anchor, { offset: HEADER_OFFSET, duration: 1.4 })
        } else {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          window.scrollTo({
            top: anchor.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET,
            behavior: reduce ? 'auto' : 'smooth',
          })
        }
        history.replaceState(null, '', `#${id}`)
      }

      el.addEventListener('click', onClick)

      // I trigger vanno ricalcolati ogni volta che l'altezza della pagina cambia
      // dopo il montaggio (font che arrivano tardi, preloader, errori del form):
      // altrimenti i reveal partono nel punto sbagliato o non partono affatto.
      let refreshId = 0
      let lastHeight = el.offsetHeight
      const ro = new ResizeObserver(() => {
        if (el.offsetHeight === lastHeight) return
        lastHeight = el.offsetHeight
        clearTimeout(refreshId)
        refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 150)
      })
      ro.observe(el)

      return () => {
        el.removeEventListener('click', onClick)
        ro.disconnect()
        clearTimeout(refreshId)
      }
    },
    { scope: root },
  )

  return (
    <main ref={root} className={className}>
      {children}
    </main>
  )
}
