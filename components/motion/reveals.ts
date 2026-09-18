import { gsap } from 'gsap'

const all = (scope: Element, selector: string) =>
  Array.from(scope.querySelectorAll<HTMLElement>(selector))

export type RevealStarts = {
  lines: string
  fade: string
  rows: string
  media: string
}

export const REVEAL_STARTS: RevealStarts = {
  lines: 'top 84%',
  fade: 'top 88%',
  rows: 'top 86%',
  media: 'top 82%',
}

export const REVEAL_STARTS_MOBILE: RevealStarts = {
  lines: 'top 95%',
  fade: 'top 95%',
  rows: 'top 92%',
  media: 'top 90%',
}

export function revealLines(scope: Element, start = REVEAL_STARTS.lines) {
  all(scope, '[data-rv="lines"]').forEach(el => {
    const li = el.querySelectorAll('[data-li]')
    gsap.set(li, { yPercent: 112 })

    gsap.to(li, {
      yPercent: 0,
      duration: 1.15,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start, once: true },
    })
  })
}

export function revealFades(scope: Element, start = REVEAL_STARTS.fade) {
  all(scope, '[data-rv="fade"]').forEach(el => {
    gsap.set(el, { opacity: 0, y: 26 })
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start, once: true },
    })
  })
}

export function revealRows(scope: Element, start = REVEAL_STARTS.rows) {
  all(scope, '[data-rv="rows"]').forEach(el => {
    const children = el.children
    gsap.set(children, { opacity: 0, y: 24 })
    gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start, once: true },
    })
  })
}

export function revealMedia(scope: Element, start = REVEAL_STARTS.media) {
  all(scope, '[data-media]').forEach(media => {
    const inner = media.querySelector('[data-media-in]')
    const img = media.querySelector('[data-media-img]')

    gsap.set(media, { clipPath: 'inset(16% 8% 16% 8%)' })
    gsap.set(img, { scale: 1.2 })

    gsap
      .timeline({ scrollTrigger: { trigger: media, start, once: true } })
      .to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, 0)
      .to(img, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0)

    gsap.fromTo(
      inner,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}

export function countUp(scope: Element, start = REVEAL_STARTS.fade): () => void {
  const restores: Array<() => void> = []

  all(scope, '[data-count]').forEach(el => {
    const target = Number(el.dataset.count)
    if (!Number.isFinite(target)) return

    const prefix = el.dataset.prefix ?? ''
    const final = el.textContent ?? ''
    const proxy = { v: 0 }
    el.textContent = `${prefix}0`
    restores.push(() => {
      el.textContent = final
    })

    gsap.to(proxy, {
      v: target,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start, once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(proxy.v)}`
      },
      onComplete: () => {
        el.textContent = final
      },
    })
  })

  return () => restores.forEach(restore => restore())
}
