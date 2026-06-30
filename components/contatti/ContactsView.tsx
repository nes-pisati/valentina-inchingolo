'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import LocalClock from './LocalClock'
import styles from './ContactsView.module.css'

gsap.registerPlugin(useGSAP)

export type RowData = {
  key: 'email' | 'phone' | 'linkedin' | 'cv'
  num: string
  label: string
  value: string
  href: string | null
  kind: 'mail' | 'tel' | 'ext' | 'download'
  external?: boolean
  download?: boolean
  copy?: { label: string; copied: string; aria: string }
  hint?: string
}

type Props = {
  index: string
  eyebrow: string
  headline: string
  rows: RowData[]
  baseline: { locations: string; availability: string; clockPrefix: string }
}

const ARROW: Record<RowData['kind'], string> = {
  mail: '→',
  tel: '→',
  ext: '↗',
  download: '↓',
}

export default function ContactsView({ index, eyebrow, headline, rows, baseline }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const node = root.current
      if (!node) return

      const q = gsap.utils.selector(node)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const eyebrowEl = q(`.${styles.eyebrow}`)
        const h1 = q('[data-h1]')
        const rowEls = gsap.utils.toArray<HTMLElement>(q(`.${styles.row}`))
        const lines = gsap.utils.toArray<HTMLElement>(q('[data-line]'))
        const fades = gsap.utils.toArray<HTMLElement>(q('[data-fade]'))
        const chrome = q('[data-chrome]')

        gsap.set(eyebrowEl, { autoAlpha: 0, y: 24 })
        gsap.set(h1, { yPercent: 110 })
        gsap.set(lines, { scaleX: 0, transformOrigin: '0% 50%' })
        gsap.set(fades, { autoAlpha: 0, y: 24 })
        gsap.set(chrome, { autoAlpha: 0, y: 24 })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(eyebrowEl, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.15)
        tl.to(h1, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, 0.3)

        rowEls.forEach((_, i) => {
          const line = lines[i]
          const fade = fades[i]
          if (!line || !fade) return
          const at = 0.55 + i * 0.09
          tl.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.inOut' }, at)
          tl.to(fade, { autoAlpha: 1, y: 0, duration: 0.7 }, at + 0.1)
        })

        tl.to(chrome, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.1)

        const canHover = window.matchMedia('(hover: hover)').matches
        if (!canHover) return

        const css = getComputedStyle(document.documentElement)
        const CORALLO = css.getPropertyValue('--color-corallo').trim()
        const OSSO = css.getPropertyValue('--color-osso').trim()

        type Roll = { cols: HTMLElement[]; bases: HTMLElement[]; stag: number }

        const rolls: (Roll | null)[] = rowEls.map(rowEl => {
          const valueEl = rowEl.querySelector<HTMLElement>('[data-roll]')
          if (!valueEl || valueEl.dataset.rollReady) return null

          const raw = valueEl.textContent ?? ''
          valueEl.textContent = ''
          valueEl.dataset.rollReady = '1'

          const bases: HTMLElement[] = []
          const cols: HTMLElement[] = []

          Array.from(raw).forEach(ch => {
            const char = document.createElement('span')
            char.className = styles.char ?? ''
            const col = document.createElement('span')
            col.className = styles.col ?? ''
            const base = document.createElement('span')
            base.className = styles.face ?? ''
            base.textContent = ch === ' ' ? ' ' : ch
            const alt = document.createElement('span')
            alt.className = `${styles.face ?? ''} ${styles.alt ?? ''}`
            alt.textContent = ch === ' ' ? ' ' : ch
            col.append(base, alt)
            char.append(col)
            valueEl.append(char)
            bases.push(base)
            cols.push(col)
          })

          return { cols, bases, stag: Math.min(0.018, 0.3 / Math.max(cols.length, 1)) }
        })

        const restInstant = (r: Roll) => {
          gsap.killTweensOf(r.cols)
          gsap.killTweensOf(r.bases)
          gsap.set(r.cols, { yPercent: 0 })
          gsap.set(r.bases, { clearProps: 'color' })
        }

        const flip = (r: Roll) => {
          gsap.killTweensOf(r.bases)
          gsap.set(r.bases, { clearProps: 'color' })
          gsap.to(r.cols, {
            yPercent: -100,
            duration: 0.4,
            ease: 'power2.inOut',
            stagger: r.stag,
            overwrite: true,
          })
        }

        const fadeOut = (r: Roll) => {
          gsap.killTweensOf(r.cols)
          gsap.set(r.cols, { yPercent: 0 })
          gsap.fromTo(
            r.bases,
            { color: CORALLO },
            {
              color: OSSO,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: true,
              onComplete: () => gsap.set(r.bases, { clearProps: 'color' }),
            },
          )
        }

        const cleanups: Array<() => void> = []

        rowEls.forEach((rowEl, i) => {
          const enter = () => {
            rolls.forEach((r, j) => {
              if (r && j !== i) restInstant(r)
            })
            const self = rolls[i]
            if (self) flip(self)
          }
          const leave = () => {
            const self = rolls[i]
            if (self) fadeOut(self)
          }

          rowEl.addEventListener('mouseenter', enter)
          rowEl.addEventListener('mouseleave', leave)
          rowEl.addEventListener('focusin', enter)
          rowEl.addEventListener('focusout', leave)
          cleanups.push(() => {
            rowEl.removeEventListener('mouseenter', enter)
            rowEl.removeEventListener('mouseleave', leave)
            rowEl.removeEventListener('focusin', enter)
            rowEl.removeEventListener('focusout', leave)
          })
        })

        return () => cleanups.forEach(fn => fn())
      })
    },
    { scope: root },
  )

  const onCopy = (e: React.MouseEvent<HTMLButtonElement>, row: RowData) => {
    e.preventDefault()
    e.stopPropagation()
    if (!row.copy) return
    const btn = e.currentTarget
    const copy = row.copy
    const copiedClass = styles.copied ?? ''
    navigator.clipboard?.writeText(row.value).then(() => {
      btn.textContent = copy.copied
      btn.classList.add(copiedClass)
      window.setTimeout(() => {
        btn.textContent = copy.label
        btn.classList.remove(copiedClass)
      }, 1600)
    })
  }

  const renderInner = (row: RowData) => (
    <>
      <span className={styles.numLabel}>
        <span className={styles.num}>{row.num}</span>
        <span className={styles.label}>{row.label}</span>
      </span>
      <span className={styles.value} data-roll>
        {row.value}
      </span>
      <span className={styles.action}>
        {row.copy && (
          <button
            type="button"
            className={styles.copy}
            aria-label={row.copy.aria}
            onClick={e => onCopy(e, row)}
          >
            {row.copy.label}
          </button>
        )}
        {row.hint && <span className={styles.hint}>{row.hint}</span>}
        <span className={styles.arrow} aria-hidden="true">
          {ARROW[row.kind]}
        </span>
      </span>
    </>
  )

  return (
    <div ref={root} className={styles.page}>
      <header className={styles.head}>
        <span className={styles.index} data-chrome aria-hidden="true">
          {index}
        </span>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.headline}>
          <span className={styles.mask}>
            <span className={styles.maskInner} data-h1>
              {headline}
            </span>
          </span>
        </h1>
      </header>

      <ul className={styles.rows}>
        {rows.map(row => (
          <li key={row.key} className={styles.row}>
            <span className={styles.line} data-line aria-hidden="true" />
            {row.href ? (
              <a
                className={styles.rowLink}
                data-fade
                href={row.href}
                {...(row.external ? { target: '_blank', rel: 'noopener' } : {})}
                {...(row.download ? { download: '' } : {})}
              >
                {renderInner(row)}
              </a>
            ) : (
              <span className={styles.rowLink} data-fade aria-disabled="true">
                {renderInner(row)}
              </span>
            )}
          </li>
        ))}
      </ul>

      <footer className={styles.baseline}>
        <span className={styles.loc} data-chrome>
          {baseline.locations}
        </span>
        <span className={styles.avail} data-chrome>
          {baseline.availability}
        </span>
        <span className={styles.clock} data-chrome>
          <LocalClock prefix={baseline.clockPrefix} />
        </span>
      </footer>
    </div>
  )
}
