'use client'

import { useId, useState, type FormEvent, type ReactNode } from 'react'
import PillButton from '../../../ui/PillButton/PillButton'
import { CHECKLIST_OPTIN_EVENT } from '../../soluzioni/ChecklistSection/ChecklistButton'
import { track } from '../../../../lib/track'
import styles from './ChecklistOptin.module.css'

type Copy = {
  label: string
  placeholder: string
  cta: string
  micro: string
  errorEmail: string
  errorConsent: string
  sentTitle: string
  sentText: string
}

type Props = {
  copy: Copy
  consent: ReactNode
}

type Errors = { email?: string; consent?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function ChecklistForm({ copy, consent }: Props) {
  const id = useId()
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const next: Errors = {
      email: EMAIL_RE.test(email) ? undefined : copy.errorEmail,
      consent: data.get('consent') ? undefined : copy.errorConsent,
    }
    setErrors(next)
    if (next.email || next.consent) return

    // Il provider del doppio opt-in non e' ancora collegato (handoff 1.8,
    // [DA CONFERMARE: mail provider]): stesso evento della CTA su Soluzioni.
    window.dispatchEvent(
      new CustomEvent(CHECKLIST_OPTIN_EVENT, { detail: { email, source: 'home' } }),
    )
    track('checklist_optin', { source: 'home' })
    setSent(true)
  }

  if (sent) {
    return (
      <div className={styles.sent} role="status">
        <p className={styles.sentTitle}>{copy.sentTitle}</p>
        <p className={styles.sentText}>{copy.sentText}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.label} htmlFor={`${id}-email`}>
        {copy.label}
      </label>
      <div className={styles.field}>
        <input
          id={`${id}-email`}
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder={copy.placeholder}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${id}-email-err` : undefined}
        />
        <PillButton type="submit" label={copy.cta} />
      </div>
      {errors.email && (
        <p id={`${id}-email-err`} className={styles.error}>
          {errors.email}
        </p>
      )}

      <label className={styles.consent}>
        <input
          className={styles.check}
          type="checkbox"
          name="consent"
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
        />
        <span>{consent}</span>
      </label>
      {errors.consent && (
        <p id={`${id}-consent-err`} className={styles.error}>
          {errors.consent}
        </p>
      )}

      <p className={styles.micro}>{copy.micro}</p>
    </form>
  )
}
