import { gsap } from 'gsap'

export function rollIn(host: Element) {
  const ci = host.querySelectorAll('[data-ci]')
  gsap.killTweensOf(ci)
  gsap.to(ci, { yPercent: -50, duration: 0.5, stagger: 0.016, ease: 'power3.out' })
}

export function rollOut(host: Element) {
  const ci = host.querySelectorAll('[data-ci]')
  gsap.killTweensOf(ci)
  gsap.set(ci, { yPercent: 0 })
}
