'use client'

import { Fragment, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './CallBooking.module.css'

gsap.registerPlugin(useGSAP)

const TZ = 'Europe/Rome'

/**
 * Disponibilita' di esempio, in attesa del collegamento a Calendly.
 * Sostituire con le fasce reali quando arriva il link (punto 7.7 dell'addendum).
 */
const SLOTS_BY_WEEKDAY: Record<number, string[]> = {
  1: ['09:30', '11:00', '14:30', '16:00'],
  2: ['09:30', '11:00', '15:00'],
  3: ['10:00', '11:30', '14:30', '16:00', '17:30'],
  4: ['09:30', '11:00', '14:30'],
  5: ['10:00', '11:30'],
}

type Day = {
  date: Date
  key: string
  n: number
  selectable: boolean
}

/** Mezzanotte locale: confronta i giorni senza farsi sporcare dall'orario. */
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`
}

function buildMonth(cursor: Date, today: Date): (Day | null)[] {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const first = new Date(year, month, 1)
  const total = new Date(year, month + 1, 0).getDate()
  // getDay() parte da domenica: lo riporto a una settimana che inizia di lunedi'.
  const lead = (first.getDay() + 6) % 7

  const cells: (Day | null)[] = Array.from({ length: lead }, () => null)

  for (let n = 1; n <= total; n += 1) {
    const date = new Date(year, month, n)
    const weekday = date.getDay()
    cells.push({
      date,
      key: `${year}-${month}-${n}`,
      n,
      selectable: date >= today && (SLOTS_BY_WEEKDAY[weekday]?.length ?? 0) > 0,
    })
  }

  // sempre 6 righe da 7: un mese corto non deve far cambiare altezza al pannello
  while (cells.length < 42) cells.push(null)

  return cells
}

export default function CallBooking() {
  const t = useTranslations('contact.booking')
  const locale = useLocale()
  const root = useRef<HTMLDivElement>(null)

  const today = useMemo(() => startOfDay(new Date()), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<Day | null>(null)
  const [slot, setSlot] = useState<string | null>(null)

  const intlLocale = locale === 'en' ? 'en-GB' : 'it-IT'

  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale, { weekday: 'short', timeZone: TZ })
    // 2024-01-01 e' un lunedi': mi da' le sigle nell'ordine che uso in griglia.
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 1 + i)).replace('.', '').slice(0, 3),
    )
  }, [intlLocale])

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric' }).format(cursor),
    [cursor, intlLocale],
  )

  const days = useMemo(() => buildMonth(cursor, today), [cursor, today])

  const dayLabel = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { weekday: 'long', day: 'numeric', month: 'long' }),
    [intlLocale],
  )

  const slots = selected ? (SLOTS_BY_WEEKDAY[selected.date.getDay()] ?? []) : []

  const atFirstMonth = monthKey(cursor) === monthKey(today)

  const summary = selected
    ? `${dayLabel.format(selected.date)}${slot ? ` · ${slot}` : ''}`
    : null

  const shiftMonth = (delta: number) => {
    setCursor(c => new Date(c.getFullYear(), c.getMonth() + delta, 1))
    setSelected(null)
    setSlot(null)
  }

  const pickDay = (day: Day) => {
    setSelected(day)
    setSlot(null)
  }

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      // Nessuno ScrollTrigger: la pagina sta in una videata sola, il reveal
      // entra in coda a quello della colonna sinistra.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ delay: 0.75, defaults: { ease: 'power3.out' } })

        tl.from(root.current, { autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out' })
          .from(
            q('[data-title-line]'),
            { yPercent: 110, duration: 0.8, stagger: 0.08, ease: 'expo.out' },
            '-=.5',
          )
          .from(q('[data-panel-fade]'), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.07 }, '-=.5')
          .from(q('[data-cell]'), { autoAlpha: 0, duration: 0.4, stagger: 0.006 }, '-=.4')
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.panel}>
      <div className={styles.panelHead}>
        <h2 className={styles.title}>
          {/* spazi reali tra le parole: il testo mascherato deve restare leggibile
              a chi lo copia, agli screen reader e ai crawler (regola 0.7) */}
          {t('title')
            .split(' ')
            .map((word, i) => (
              <Fragment key={i}>
                {i > 0 ? ' ' : null}
                <span className={styles.titleMask}>
                  <span className={styles.titleLine} data-title-line>
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
        </h2>

        <p className={styles.text} data-panel-fade>
          {t('text')}
        </p>

      </div>

      <span className={styles.rule} aria-hidden="true" />

      <div className={styles.calendar}>
        <div className={styles.calendarHead} data-panel-fade>
          <span className={styles.panelLabel}>{t('calendarLabel')}</span>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => shiftMonth(-1)}
              disabled={atFirstMonth}
              aria-label={t('prevMonth')}
            >
              <span aria-hidden="true">←</span>
            </button>
            <span className={styles.month} aria-live="polite">
              {monthLabel}
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => shiftMonth(1)}
              aria-label={t('nextMonth')}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className={styles.weekdays} aria-hidden="true">
          {weekdays.map(w => (
            <span key={w} className={styles.weekday}>
              {w}
            </span>
          ))}
        </div>

        <div className={styles.grid} role="group" aria-label={t('calendarLabel')}>
          {days.map((day, i) =>
            day ? (
              <button
                key={day.key}
                type="button"
                data-cell
                className={`${styles.day} ${selected?.key === day.key ? styles.daySelected : ''}`}
                disabled={!day.selectable}
                aria-pressed={selected?.key === day.key}
                aria-label={dayLabel.format(day.date)}
                onClick={() => pickDay(day)}
              >
                {day.n}
              </button>
            ) : (
              <span key={`pad-${i}`} data-cell className={styles.pad} aria-hidden="true" />
            ),
          )}
        </div>
      </div>

      <div className={styles.slots} data-panel-fade>
        {!selected ? (
          <p className={styles.slotsNote}>{t('slotsEmpty')}</p>
        ) : slots.length === 0 ? (
          <p className={styles.slotsNote}>{t('noSlots')}</p>
        ) : (
          <ul className={styles.slotList}>
            {slots.map(s => (
              <li key={s}>
                <button
                  type="button"
                  className={`${styles.slot} ${slot === s ? styles.slotActive : ''}`}
                  aria-pressed={slot === s}
                  onClick={() => setSlot(s)}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.slotsFoot}>
          <span className={styles.tz}>{t('timezone')}</span>
          <p className={styles.summary} aria-live="polite">
            {summary ?? ' '}
          </p>
        </div>
      </div>

      {/* riga di chiusura: le parole chiave a sinistra, la CTA a destra */}
      <div className={styles.confirm} data-panel-fade>
        <ul className={styles.facts}>
          <li className={styles.fact}>{t('facts.duration')}</li>
          <li className={styles.fact}>{t('facts.price')}</li>
          <li className={styles.fact}>{t('facts.where')}</li>
        </ul>
        {/* TODO: collegare a Calendly quando arriva il link (addendum 1.4, punto 7.7). */}
        <button type="button" className={styles.cta} disabled={!selected || !slot}>
          {selected && slot ? t('cta') : t('ctaPending')}
        </button>
      </div>
    </div>
  )
}
