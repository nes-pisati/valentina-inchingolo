import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onIntro } from '../../../../lib/intro'

const all = (scope: Element, selector: string) =>
  Array.from(scope.querySelectorAll<HTMLElement>(selector))

export function heroIntro(root: Element): () => void {
  const hero = root.querySelector('[data-hero]')
  if (!hero) return () => {}

  const li = hero.querySelectorAll('[data-hero-title] [data-li]')
  const kick = hero.querySelector('[data-hero-kick]')
  const fades = hero.querySelectorAll('[data-hero-fade]')
  const items = hero.querySelectorAll('[data-idx-item]')

  gsap.set(li, { yPercent: 112 })
  gsap.set(kick, { opacity: 0, y: 22 })
  gsap.set(fades, { opacity: 0, y: 22 })
  gsap.set(items, { clipPath: 'inset(0% 100% 0% 0%)' })

  const tl = gsap
    .timeline({ paused: true, delay: 0.15 })
    .to(li, { yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'expo.out' }, 0)
    .to(kick, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.1)
    .to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, 0.9)
    .to(
      items,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.9,
        stagger: 0.09,
        ease: 'expo.out',
        onComplete: () => gsap.set(items, { clearProps: 'clipPath' }),
      },
      1.05,
    )

  return onIntro(() => tl.restart(true))
}

export function marquee(root: Element) {
  const track = root.querySelector('[data-marquee-track]')
  if (!track) return

  const tween = gsap.to(track, { xPercent: -25, duration: 22, ease: 'none', repeat: -1 })
  tween.totalTime(tween.duration() * 1000)

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: self => {
      gsap.to(tween, { timeScale: self.direction === 1 ? 1 : -1, duration: 0.6, overwrite: true })
    },
  })
}

function cardTimeline(card: HTMLElement, i: number, tl: gsap.core.Timeline) {
  tl.to(
    card.querySelectorAll('[data-card-part]'),
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' },
    0.35 + i * 0.13,
  ).to(
    card.querySelectorAll('[data-seg]'),
    { scaleX: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
    0.8 + i * 0.13,
  )
}

function prepareCards(cards: HTMLElement[], desktop: boolean) {
  cards.forEach((card, i) => {
    gsap.set(card, {
      clipPath: 'inset(100% 0% 0% 0% round 22px)',
      yPercent: desktop ? 18 + i * 10 : 12,
    })
    gsap.set(card.querySelectorAll('[data-card-part]'), { opacity: 0, y: 28 })
    gsap.set(card.querySelectorAll('[data-seg]'), { scaleX: 0 })
  })
}

function buildCardsTimeline(cards: HTMLElement[]) {
  const tl = gsap.timeline({ paused: true })
  tl.to(
    cards,
    {
      clipPath: 'inset(0% 0% 0% 0% round 22px)',
      yPercent: 0,
      duration: 1.25,
      stagger: 0.13,
      ease: 'expo.out',
    },
    0,
  )
  cards.forEach((card, i) => cardTimeline(card, i, tl))
  return tl
}

export function livelliDesktop(root: Element) {
  const ladder = root.querySelector('[data-ladder]')
  if (!ladder) return
  const cards = all(ladder, '[data-card]')

  prepareCards(cards, true)
  const tl = buildCardsTimeline(cards)
  ScrollTrigger.create({ trigger: ladder, start: 'top 80%', once: true, onEnter: () => tl.play() })
}

export function livelliMobile(root: Element) {
  const ladder = root.querySelector('[data-ladder]')
  if (!ladder) return
  const cards = all(ladder, '[data-card]')

  prepareCards(cards, false)
  const timelines = new Map(cards.map(card => [card, buildCardsTimeline([card])]))

  ScrollTrigger.batch(cards, {
    start: 'top 88%',
    once: true,
    onEnter: batch => {
      batch.forEach((card, i) => {
        timelines.get(card as HTMLElement)?.delay(i * 0.13).play()
      })
    },
  })
}

export function checkup(root: Element) {
  const section = root.querySelector('[data-drift-section]')
  const track = root.querySelector('[data-drift-track]')
  if (section && track) {
    gsap.fromTo(
      track,
      { xPercent: 0 },
      {
        xPercent: -38,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }

  all(root, '[data-phase]').forEach(phase => {
    const draw = phase.querySelector('[data-ph-draw]')
    const els = phase.querySelectorAll('[data-ph-el]')
    gsap.set(draw, { scaleX: 0 })
    gsap.set(els, { opacity: 0, y: 30 })

    gsap
      .timeline({ scrollTrigger: { trigger: phase, start: 'top 82%', once: true } })
      .to(draw, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' })
      .to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, '-=.8')
  })

  const facts = root.querySelector('[data-facts]')
  if (facts) {
    const items = all(facts, '[data-fact]')
    gsap.set(items, { opacity: 0, y: 30 })
    items.forEach((fact, i) => {
      gsap.to(fact, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: i * 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: facts, start: 'top 85%', once: true },
      })
    })
  }
}

export function confronto(root: Element) {
  const table = root.querySelector<HTMLElement>('[data-ct-table]')
  if (!table) return

  const bg = table.querySelector('[data-ct-bg]')
  const cells = table.querySelectorAll('[data-ct-cell]')

  gsap.set(table, { opacity: 0, y: 60 })
  gsap.set(bg, { clipPath: 'inset(100% 0% 0% 0% round 24px)' })
  gsap.set(cells, { opacity: 0, y: 22 })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: table, start: 'top 85%', once: true },
    onComplete: () => {
      gsap.set(cells, { clearProps: 'opacity' })
      table.dataset.ready = ''
    },
  })

  tl.to(table, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, 0).to(
    bg,
    { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.1, ease: 'expo.inOut' },
    0.45,
  )

  for (let r = 0; r <= 5; r++) {
    tl.to(
      table.querySelectorAll(`[data-ct-cell][data-row="${r}"]`),
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' },
      0.8 + r * 0.1,
    )
  }
}

export function method(root: Element) {
  const list = root.querySelector('[data-method]')
  if (!list) return

  gsap.fromTo(
    list.querySelectorAll('[data-method-item]'),
    { opacity: 0.22 },
    {
      opacity: 1,
      stagger: 0.3,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 85%', end: 'bottom 50%', scrub: true },
    },
  )
}

export function faq(root: Element): () => void {
  const items = all(root, '[data-faq]') as HTMLDetailsElement[]

  const handlers = items.map(item => {
    const answer = item.querySelector('[data-faq-answer]')
    const vbar = item.querySelector('[data-faq-vbar]')
    const onToggle = () => {
      if (item.open) {
        gsap.fromTo(answer, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' })
        gsap.to(vbar, { rotation: 90, duration: 0.4, ease: 'expo.out' })
      } else {
        gsap.killTweensOf(vbar)
        gsap.set(vbar, { rotation: 0 })
      }
    }
    item.addEventListener('toggle', onToggle)
    return () => item.removeEventListener('toggle', onToggle)
  })

  return () => handlers.forEach(off => off())
}
