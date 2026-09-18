import { gsap } from 'gsap'
import { rollIn, rollOut } from '../../../motion/roll'

type Off = () => void

function bind(el: Element, enter: () => void, leave: () => void): Off {
  el.addEventListener('mouseenter', enter)
  el.addEventListener('mouseleave', leave)
  return () => {
    el.removeEventListener('mouseenter', enter)
    el.removeEventListener('mouseleave', leave)
  }
}

function pill(el: HTMLElement): Off {
  const fill = el.querySelector('[data-btn-fill]')
  return bind(
    el,
    () => {
      el.dataset.on = ''
      gsap.killTweensOf(fill)
      gsap.set(fill, { opacity: 1 })
      gsap.fromTo(
        fill,
        { clipPath: 'inset(0% 100% 0% 0% round 999px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 999px)', duration: 0.55, ease: 'expo.out' },
      )
      rollIn(el)
    },
    () => {
      gsap.killTweensOf(fill)
      gsap.set(fill, { opacity: 0 })
      delete el.dataset.on
      rollOut(el)
    },
  )
}

function idx(el: HTMLElement): Off {
  const bar = el.querySelector('[data-idx-bar]')
  return bind(
    el,
    () => {
      rollIn(el)
      gsap.killTweensOf(bar)
      gsap.set(bar, { opacity: 1 })
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out' })
    },
    () => {
      rollOut(el)
      gsap.killTweensOf(bar)
      gsap.set(bar, { opacity: 0, scaleX: 0 })
    },
  )
}

function card(el: HTMLElement): Off {
  const wipe = el.querySelector('[data-wipe]')
  const arrow = el.querySelector('[data-arrow]')
  const segs = el.querySelectorAll('[data-seg][data-filled]')
  const targets = [wipe, arrow, ...Array.from(segs)]

  return bind(
    el,
    () => {
      el.dataset.on = ''
      gsap.killTweensOf(targets)
      gsap.set(wipe, { opacity: 1 })
      gsap.fromTo(
        wipe,
        { clipPath: 'circle(0% at 100% 100%)' },
        { clipPath: 'circle(150% at 100% 100%)', duration: 0.8, ease: 'expo.out' },
      )
      gsap.fromTo(
        arrow,
        { xPercent: -160, yPercent: 160 },
        { xPercent: 0, yPercent: 0, duration: 0.55, ease: 'expo.out' },
      )
      gsap.fromTo(segs, { scaleX: 0.2 }, { scaleX: 1, duration: 0.5, stagger: 0.06, ease: 'expo.out' })
    },
    () => {
      gsap.killTweensOf(targets)
      gsap.set(wipe, { opacity: 0 })
      gsap.set(arrow, { xPercent: 0, yPercent: 0 })
      gsap.set(segs, { scaleX: 1 })
      delete el.dataset.on
    },
  )
}

const HOVERS: Record<string, (el: HTMLElement) => Off> = { pill, idx, card }

export function hovers(root: Element): Off {
  const offs = Array.from(root.querySelectorAll<HTMLElement>('[data-hover]')).map(el => {
    const setup = HOVERS[el.dataset.hover ?? '']
    return setup ? setup(el) : () => {}
  })
  return () => offs.forEach(off => off())
}

export function rowHover(root: Element): Off {
  const table = root.querySelector<HTMLElement>('[data-ct-table]')
  if (!table) return () => {}

  const cells = Array.from(table.querySelectorAll<HTMLElement>('[data-col] [data-ct-cell]'))
  const allCells = Array.from(table.querySelectorAll<HTMLElement>('[data-ct-cell]'))

  const offs = cells
    .filter(cell => {
      const row = Number(cell.dataset.row)
      return row >= 1 && row <= 4
    })
    .map(cell => {
      const enter = () => {
        allCells.forEach(c => {
          if (c.dataset.row === cell.dataset.row) c.dataset.hl = ''
          else delete c.dataset.hl
        })
        table.dataset.dim = ''
      }
      cell.addEventListener('mouseenter', enter)
      return () => cell.removeEventListener('mouseenter', enter)
    })

  const leave = () => {
    allCells.forEach(c => {
      c.style.transition = 'none'
      delete c.dataset.hl
    })
    delete table.dataset.dim
    requestAnimationFrame(() => allCells.forEach(c => (c.style.transition = '')))
  }
  table.addEventListener('mouseleave', leave)

  return () => {
    offs.forEach(off => off())
    table.removeEventListener('mouseleave', leave)
    leave()
  }
}
