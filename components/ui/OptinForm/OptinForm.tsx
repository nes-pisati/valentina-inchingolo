'use client'

import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import PillButton from '../PillButton/PillButton'
import { track } from '../../../lib/track'
import styles from './OptinForm.module.css'

type Props =
  | { kind: 'checklist'; source: 'home' | 'soluzioni'; tone?: 'light' | 'dark' }
  | { kind: 'minikit'; source?: never; tone?: 'light' | 'dark' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PRODUCT_MAX = 120

export default function OptinForm(props: Props) {
  const { kind, tone = 'light' } = props
  const t = useTranslations(`optin.${kind}`)
  const tf = useTranslations('forms')
  const locale = useLocale()
  const id = useId()
  const [emailError, setEmailError] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('website')) return

    const email = String(data.get('email') ?? '').trim()
    const invalid = !EMAIL_RE.test(email)
    setEmailError(invalid)
    if (invalid) {
      const el = form.elements.namedItem('email')
      if (el instanceof HTMLElement) el.focus()
      return
    }

    if (kind === 'checklist') track('checklist_optin', { source: props.source })
    else track('minikit_waitlist_join')
    setSent(true)
  }

  const toneClass = tone === 'dark' ? styles.dark : ''

  if (sent) {
    return (
      <div className={`${styles.sent} ${toneClass}`} role="status">
        <p className={styles.sentText}>{t('sent')}</p>
        <p className={styles.sentNote}>{tf('spam')}</p>
      </div>
    )
  }

  const privacy = tf.rich('privacyNote', {
    privacy: (chunks: ReactNode) => (
      <a className={styles.link} href={`/${locale}/privacy`}>
        {chunks}
      </a>
    ),
  })

  return (
    <form className={`${styles.form} ${toneClass}`} onSubmit={onSubmit} noValidate>
      <label className={styles.label} htmlFor={`${id}-email`}>
        {t('emailLabel')}
      </label>
      <input
        id={`${id}-email`}
        className={styles.input}
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder={t('emailPlaceholder')}
        aria-invalid={emailError || undefined}
        aria-describedby={emailError ? `${id}-email-err` : undefined}
      />
      {emailError && (
        <p id={`${id}-email-err`} className={styles.error}>
          {tf('errorEmail')}
        </p>
      )}

      {kind === 'minikit' && (
        <>
          <label className={`${styles.label} ${styles.labelSpaced}`} htmlFor={`${id}-product`}>
            {t('productLabel')}
          </label>
          <input
            id={`${id}-product`}
            className={styles.input}
            type="text"
            name="product"
            maxLength={PRODUCT_MAX}
            placeholder={t('productPlaceholder')}
          />
        </>
      )}

      <label className={styles.consent}>
        <input className={styles.check} type="checkbox" name="updates" value="1" />
        <span>{tf('updates')}</span>
      </label>

      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.submit}>
        <PillButton
          type="submit"
          label={t('cta')}
          variant={tone === 'dark' ? 'light-coral' : 'default'}
        />
      </div>

      <p className={styles.micro}>
        {t('note')}
        <br />
        {privacy}
      </p>
    </form>
  )
}
