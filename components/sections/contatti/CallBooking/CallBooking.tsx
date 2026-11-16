'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  CALL_REQUEST_LIMITS,
  STAGE_OPTIONS,
  parseCallRequest,
  type CallRequestField,
} from '../../../../lib/callRequestForm'
import { track } from '../../../../lib/track'
import styles from './CallBooking.module.css'

gsap.registerPlugin(useGSAP)

type Sent = { name: string; email: string }

export default function CallBooking() {
  const t = useTranslations('contact.form')
  const locale = useLocale()
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const sentTitle = useRef<HTMLHeadingElement>(null)
  const started = useRef(false)
  const [invalid, setInvalid] = useState<CallRequestField[]>([])
  const [sent, setSent] = useState<Sent | null>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ delay: 0.75, defaults: { ease: 'power3.out' } })
        tl.from(root.current, { autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out' }).from(
          q('[data-panel-fade]'),
          { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.06 },
          '-=.5',
        )
      })
    },
    { scope: root },
  )

  useEffect(() => {
    if (sent) sentTitle.current?.focus()
  }, [sent])

  const onFirstInput = () => {
    if (started.current) return
    started.current = true
    track('form_start')
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fields = Object.fromEntries(new FormData(form))
    if (fields.website) return

    const { data, invalid: nextInvalid } = parseCallRequest(fields)
    setInvalid(nextInvalid)

    const firstInvalid = nextInvalid[0]
    if (firstInvalid || !data) {
      const el = form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
      el?.focus()
      return
    }

    track('form_submit')
    setSent({ name: data.name, email: data.email })
  }

  const isInvalid = (name: CallRequestField) => invalid.includes(name)
  const errId = (name: CallRequestField) => `${id}-${name}-err`
  const a11y = (name: CallRequestField) => ({
    'aria-invalid': isInvalid(name) || undefined,
    'aria-describedby': isInvalid(name) ? errId(name) : undefined,
  })

  const fieldError = (name: CallRequestField) =>
    isInvalid(name) ? (
      <p id={errId(name)} className={styles.error}>
        {t(`errors.${name}`)}
      </p>
    ) : null

  const choices = (name: 'stage', options: readonly string[]) => (
    <fieldset
      className={`${styles.field} ${styles.wide} ${styles.fieldset}`}
      data-panel-fade
      aria-describedby={isInvalid(name) ? errId(name) : undefined}
    >
      <legend className={styles.label}>{t(`fields.${name}.label`)}</legend>
      <div className={styles.chips}>
        {options.map(option => (
          <label key={option} className={styles.chip}>
            <input
              className={styles.chipInput}
              type="radio"
              name={name}
              value={option}
              data-invalid={isInvalid(name) || undefined}
            />
            <span className={styles.chipLabel}>{t(`fields.${name}.options.${option}`)}</span>
          </label>
        ))}
      </div>
      {fieldError(name)}
    </fieldset>
  )

  if (sent) {
    return (
      <div ref={root} className={styles.panel}>
        <div className={styles.sent} role="status">
          <h2 ref={sentTitle} className={styles.sentTitle} tabIndex={-1}>
            {t('sentTitle', { name: sent.name })}
          </h2>
          <p className={styles.sentText}>{t('sentText', { email: sent.email })}</p>
          <p className={styles.sentText}>{t('sentSpam')}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={root} className={styles.panel}>
      <form className={styles.form} onSubmit={onSubmit} onInput={onFirstInput} noValidate>
        <div className={styles.fields}>
          <div className={styles.field} data-panel-fade>
            <label className={styles.label} htmlFor={`${id}-name`}>
              {t('fields.name.label')}
              <span className={styles.req} aria-hidden="true">
                *
              </span>
            </label>
            <input
              id={`${id}-name`}
              name="name"
              className={styles.input}
              type="text"
              required
              autoComplete="name"
              maxLength={CALL_REQUEST_LIMITS.name}
              placeholder={t('fields.name.placeholder')}
              {...a11y('name')}
            />
            {fieldError('name')}
          </div>

          <div className={styles.field} data-panel-fade>
            <label className={styles.label} htmlFor={`${id}-email`}>
              {t('fields.email.label')}
              <span className={styles.req} aria-hidden="true">
                *
              </span>
            </label>
            <input
              id={`${id}-email`}
              name="email"
              className={styles.input}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              maxLength={CALL_REQUEST_LIMITS.email}
              placeholder={t('fields.email.placeholder')}
              {...a11y('email')}
            />
            {fieldError('email')}
          </div>

          <div className={`${styles.field} ${styles.wide}`} data-panel-fade>
            <label className={styles.label} htmlFor={`${id}-product`}>
              {t('fields.product.label')}
            </label>
            <input
              id={`${id}-product`}
              name="product"
              className={styles.input}
              type="text"
              maxLength={CALL_REQUEST_LIMITS.product}
              placeholder={t('fields.product.placeholder')}
              {...a11y('product')}
            />
            {fieldError('product')}
          </div>

          {choices('stage', STAGE_OPTIONS)}

          <div className={`${styles.field} ${styles.wide}`} data-panel-fade>
            <label className={styles.label} htmlFor={`${id}-goal`}>
              {t('fields.goal.label')}
            </label>
            <textarea
              id={`${id}-goal`}
              name="goal"
              className={`${styles.input} ${styles.textarea}`}
              rows={2}
              maxLength={CALL_REQUEST_LIMITS.goal}
              {...a11y('goal')}
            />
            {fieldError('goal')}
          </div>

          <div className={`${styles.field} ${styles.wide}`} data-panel-fade>
            <label className={styles.consent}>
              <input
                className={styles.check}
                type="checkbox"
                name="privacy"
                value="1"
                required
                {...a11y('privacy')}
              />
              <span>
                {t.rich('fields.privacy', {
                  privacy: (chunks: ReactNode) => (
                    <a className={styles.link} href={`/${locale}/privacy`}>
                      {chunks}
                    </a>
                  ),
                })}
              </span>
            </label>
            {fieldError('privacy')}
          </div>
        </div>

        <div className={styles.honeypot} aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <p className={styles.reqNote} data-panel-fade>
          {t('required')}
        </p>

        <div className={styles.confirm} data-panel-fade>
          <button type="submit" className={styles.cta}>
            {t('cta')}
          </button>
          <p className={styles.micro}>{t('micro')}</p>
        </div>
      </form>
    </div>
  )
}
