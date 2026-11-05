'use client'

import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  CALL_REQUEST_LIMITS,
  parseCallRequest,
  type CallRequestField,
} from '../../../../lib/callRequest'
import styles from './CallBooking.module.css'

gsap.registerPlugin(useGSAP)

type Status = 'idle' | 'sending' | 'failed' | 'sent'

export default function CallBooking() {
  const t = useTranslations('contact.booking')
  const locale = useLocale()
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const sentTitle = useRef<HTMLParagraphElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [invalid, setInvalid] = useState<CallRequestField[]>([])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ delay: 0.75, defaults: { ease: 'power3.out' } })

        tl.from(root.current, { autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out' })
          .from(
            q('[data-title-line]'),
            { yPercent: 110, duration: 0.8, stagger: 0.08, ease: 'expo.out' },
            '-=.5',
          )
          .from(q('[data-panel-fade]'), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.07 }, '-=.5')
      })
    },
    { scope: root },
  )

  useEffect(() => {
    if (status === 'sent') sentTitle.current?.focus()
  }, [status])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return

    const form = e.currentTarget
    const fields = Object.fromEntries(new FormData(form))
    const { invalid: nextInvalid } = parseCallRequest(fields)

    setInvalid(nextInvalid)
    const firstInvalid = nextInvalid[0]
    if (firstInvalid) {
      setStatus('idle')
      const el = form.elements.namedItem(firstInvalid)
      if (el instanceof HTMLElement) el.focus()
      return
    }

    setStatus('sending')
    const res = await fetch('/api/call-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, lang: locale }),
    }).catch(() => null)

    setStatus(res?.ok ? 'sent' : 'failed')
  }

  const fieldProps = (name: CallRequestField) => {
    const isInvalid = invalid.includes(name)
    return {
      id: `${id}-${name}`,
      name,
      className: styles.input,
      required: true,
      'aria-invalid': isInvalid || undefined,
      'aria-describedby': isInvalid ? `${id}-${name}-err` : undefined,
    }
  }

  const fieldError = (name: CallRequestField) =>
    invalid.includes(name) ? (
      <p id={`${id}-${name}-err`} className={styles.error}>
        {t(`errors.${name}`)}
      </p>
    ) : null

  return (
    <div ref={root} className={styles.panel}>
      <div className={styles.panelHead}>
        <h2 className={styles.title}>

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

      {status === 'sent' ? (
        <div className={styles.sent} role="status">
          <p ref={sentTitle} className={styles.sentTitle} tabIndex={-1}>
            {t('sentTitle')}
          </p>
          <p className={styles.sentText}>{t('sentText')}</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.fields}>
            <div className={styles.field} data-panel-fade>
              <label className={styles.label} htmlFor={`${id}-firstName`}>
                {t('fields.firstName')}
              </label>
              <input
                {...fieldProps('firstName')}
                type="text"
                autoComplete="given-name"
                maxLength={CALL_REQUEST_LIMITS.name}
              />
              {fieldError('firstName')}
            </div>

            <div className={styles.field} data-panel-fade>
              <label className={styles.label} htmlFor={`${id}-lastName`}>
                {t('fields.lastName')}
              </label>
              <input
                {...fieldProps('lastName')}
                type="text"
                autoComplete="family-name"
                maxLength={CALL_REQUEST_LIMITS.name}
              />
              {fieldError('lastName')}
            </div>

            <div className={`${styles.field} ${styles.wide}`} data-panel-fade>
              <label className={styles.label} htmlFor={`${id}-email`}>
                {t('fields.email')}
              </label>
              <input
                {...fieldProps('email')}
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={CALL_REQUEST_LIMITS.email}
              />
              {fieldError('email')}
            </div>

            <div className={`${styles.field} ${styles.wide}`} data-panel-fade>
              <label className={styles.label} htmlFor={`${id}-note`}>
                {t('fields.note')}
              </label>
              <textarea
                id={`${id}-note`}
                name="note"
                className={`${styles.input} ${styles.textarea}`}
                rows={2}
                maxLength={CALL_REQUEST_LIMITS.note}
              />
            </div>
          </div>
          <div className={styles.honeypot} aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <p className={styles.privacy} data-panel-fade>
            {t.rich('privacy', {
              privacy: chunks => (
                <a className={styles.link} href={`/${locale}/privacy`}>
                  {chunks}
                </a>
              ),
            })}
          </p>

          {status === 'failed' && (
            <p className={styles.error} role="alert">
              {t('errors.send')}
            </p>
          )}

          <div className={styles.confirm} data-panel-fade>
            <ul className={styles.facts}>
              <li className={styles.fact}>{t('facts.duration')}</li>
              <li className={styles.fact}>{t('facts.price')}</li>
              <li className={styles.fact}>{t('facts.where')}</li>
            </ul>
            <button
              type="submit"
              className={styles.cta}
              aria-busy={status === 'sending' || undefined}
              data-busy={status === 'sending' || undefined}
            >
              {t('cta')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
