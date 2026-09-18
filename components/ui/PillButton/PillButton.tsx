import type { MouseEventHandler } from 'react'
import RollText from '../../motion/RollText/RollText'
import styles from './PillButton.module.css'

type Variant = 'default' | 'coral' | 'light' | 'light-coral'

type Props = {
  label: string
  variant?: Variant
  size?: 'md' | 'sm'
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  busy?: boolean
  className?: string
}

const VARIANT_CLASS: Record<Variant, string | undefined> = {
  default: styles.default,
  coral: styles.coral,
  light: styles.light,
  'light-coral': styles.lightCoral,
}

export default function PillButton({
  label,
  variant = 'default',
  size = 'md',
  href,
  onClick,
  busy = false,
  className,
}: Props) {
  const cls = [styles.btn, VARIANT_CLASS[variant], size === 'sm' && styles.sm, className]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      <span className={styles.fill} data-btn-fill aria-hidden="true" />
      <span className={styles.dot} aria-hidden="true" />
      <RollText text={label} />
    </>
  )

  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a
        className={cls}
        href={href}
        data-hover="pill"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={cls}
      data-hover="pill"
      onClick={onClick}
      aria-busy={busy || undefined}
      data-busy={busy || undefined}
    >
      {inner}
    </button>
  )
}
