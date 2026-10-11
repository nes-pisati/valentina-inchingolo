import { gsap } from 'gsap'
import { onIntro } from '../../../../lib/intro'

const all = (scope: Element, selector: string) =>
  Array.from(scope.querySelectorAll<HTMLElement>(selector))

const DIM = 0.14

/**
 * "Una parola sola, due letture": si spegne THE GAP e resta VALEINK,
 * poi si spegne VALE e resta INK THE GAP. Solo opacity, in loop lento.
 */
function readings(vale: Element | null, gap: Element | null) {
  const fade = { duration: 0.7, ease: 'power2.inOut' }

  return gsap
    .timeline({ paused: true, repeat: -1, repeatDelay: 1.4, delay: 1.2 })
    .to(gap, { opacity: DIM, ...fade })
    .to(gap, { opacity: 1, ...fade }, '+=1.9')
    .to(vale, { opacity: DIM, ...fade }, '+=0.5')
    .to(vale, { opacity: 1, ...fade }, '+=1.9')
}

/**
 * Porta la riga di INK (blocco corallo compreso) a coprire tutto lo stage.
 * Misura a ogni chiamata e su geometria non trasformata (offset), cosi' resta
 * corretta anche se i font arrivano tardi o la finestra cambia misura.
 */
function applyCover(stage: HTMLElement, row: HTMLElement, p: number) {
  const stack = row.offsetParent as HTMLElement
  const s = stage.getBoundingClientRect()
  const k = stack.getBoundingClientRect()
  const cx = k.left - s.left + row.offsetLeft + row.offsetWidth / 2
  const cy = k.top - s.top + row.offsetTop + row.offsetHeight / 2
  const sx = (stage.clientWidth / row.offsetWidth) * 1.04
  const sy = (stage.clientHeight / row.offsetHeight) * 1.04

  gsap.set(row, {
    x: (stage.clientWidth / 2 - cx) * p,
    y: (stage.clientHeight / 2 - cy) * p,
    scaleX: 1 + (sx - 1) * p,
    scaleY: 1 + (sy - 1) * p,
  })
}

/**
 * Intro della home: il dispositivo entra per righe in maschera, poi resta vivo
 * col loop delle due letture. Allo scroll VALE esce a sinistra, THE GAP a
 * destra e la riga di INK si allarga fino a coprire lo schermo di corallo:
 * la hero sale sopra come un foglio (vedi --intro-overlap) e il suo titolo
 * entra in quel momento, legato alla transizione e non a un trigger a parte.
 */
export function introMotion(root: Element): () => void {
  const intro = root.querySelector<HTMLElement>('[data-intro]')
  const stage = root.querySelector<HTMLElement>('[data-intro-stage]')
  const hero = root.querySelector<HTMLElement>('#top')
  if (!intro || !stage || !hero) return () => {}

  const row = (key: string) => stage.querySelector<HTMLElement>(`[data-dv-row="${key}"]`)
  const word = (key: string) => row(key)?.querySelector('[data-dv-word]') ?? null
  const vale = row('vale')
  const inkRow = row('ink')
  const gap = row('gap')
  const block = stage.querySelector('[data-dv-block]')
  const rule = stage.querySelector('[data-dv-rule]')
  const fades = stage.querySelectorAll('[data-dv-fade]')
  const cue = stage.querySelector('[data-dv-cue]')
  const heroLines = hero.querySelectorAll('[data-hero-title] [data-li]')
  if (!vale || !inkRow || !gap) return () => {}

  gsap.set(stage.querySelectorAll('[data-dv-word]'), { yPercent: 112 })
  gsap.set(block, { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set(rule, { scaleY: 0, transformOrigin: '50% 0%' })
  gsap.set(fades, { opacity: 0, y: 16 })
  gsap.set(inkRow, { transformOrigin: '50% 50%' })
  gsap.set(heroLines, { yPercent: 112 })

  const loop = readings(vale, gap)
  const drip = gsap.fromTo(
    cue,
    { yPercent: -100 },
    { yPercent: 300, duration: 1.6, ease: 'power2.inOut', repeat: -1, paused: true },
  )
  let ready = false
  let moving = false
  let heroShown = false

  const enter = gsap
    .timeline({
      paused: true,
      delay: 0.25,
      onComplete: () => {
        ready = true
        if (!moving) loop.play()
        drip.play()
      },
    })
    .to(rule, { scaleY: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
    .to(word('vale'), { yPercent: 0, duration: 1.3, ease: 'expo.out' }, 0.15)
    .to(block, { scaleX: 1, duration: 0.9, ease: 'power4.inOut' }, 0.35)
    .to(word('ink'), { yPercent: 0, duration: 1.3, ease: 'expo.out' }, 0.62)
    .to(word('gap'), { yPercent: 0, duration: 1.3, ease: 'expo.out' }, 0.78)
    .to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, 1.25)

  const showHero = () => {
    if (heroShown) return
    heroShown = true
    gsap.to(heroLines, { yPercent: 0, duration: 1.15, stagger: 0.1, ease: 'expo.out' })
  }

  // Se si scrolla mentre l'ingresso e' ancora in corso, lo si chiude subito:
  // ingresso e transizione non devono mai animare gli stessi valori insieme.
  const setMoving = (now: boolean) => {
    if (now === moving) return
    moving = now
    if (moving) {
      enter.progress(1)
      loop.pause()
      gsap.to([vale, gap], { opacity: 1, duration: 0.3, overwrite: 'auto' })
    } else if (ready) {
      loop.restart(true)
    }
  }

  // La durata e' quella in cui lo stage resta fermo prima che la hero lo copra.
  const length = () =>
    intro.offsetHeight - stage.offsetHeight + parseFloat(getComputedStyle(hero).marginTop)

  const cover = { p: 0 }
  const onCover = () => applyCover(stage, inkRow, cover.p)

  const out = gsap.timeline({
    defaults: { ease: 'none', immediateRender: false },
    scrollTrigger: {
      trigger: intro,
      start: 'top top',
      end: () => `+=${length()}`,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: self => {
        setMoving(self.progress > 0.01)
        if (self.progress > 0.85) showHero()
      },
      onLeave: showHero,
      onRefresh: self => {
        onCover()
        if (self.progress > 0.85) showHero()
      },
    },
  })

  out
    .fromTo(fades, { opacity: 1, y: 0 }, { opacity: 0, duration: 0.15 }, 0)
    .fromTo(rule, { scaleY: 1 }, { scaleY: 0, duration: 0.3, ease: 'power2.in' }, 0)
    .fromTo(vale, { x: 0 }, { x: () => -stage.clientWidth, duration: 0.55, ease: 'power2.in' }, 0)
    .fromTo(gap, { x: 0 }, { x: () => stage.clientWidth, duration: 0.55, ease: 'power2.in' }, 0.04)
    .fromTo(word('ink'), { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.3)
    .fromTo(
      cover,
      { p: 0 },
      { p: 1, duration: 0.75, ease: 'power3.inOut', onUpdate: onCover },
      0.25,
    )

  const off = onIntro(() => enter.restart(true))
  return () => {
    off()
    loop.kill()
    drip.kill()
  }
}

export function fillRows(root: Element) {
  all(root, '[data-fill-row]').forEach(row => {
    gsap.fromTo(
      row.querySelector('[data-fill]'),
      { clipPath: 'inset(0% 100% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: row, start: 'top 82%', end: 'top 38%', scrub: 0.6 },
      },
    )
  })
}

export function bigTitle(root: Element) {
  const title = root.querySelector('[data-big-title]')
  if (title) {
    const chars = title.querySelectorAll('[data-big-char]')
    gsap.set(chars, { yPercent: 112 })
    gsap.to(chars, {
      yPercent: 0,
      duration: 1.1,
      stagger: 0.045,
      ease: 'expo.out',
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
    })
  }

  const badge = root.querySelector('[data-badge]')
  if (badge) {
    gsap.to(badge, {
      rotation: 360,
      duration: 18,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    })
  }
}
