import type { ReactNode } from 'react'
import styles from './soluzioni.module.css'

export function lineTags() {
  return {
    line: (chunks: ReactNode) => (
      <span className={styles.line}>
        <span className={styles.li} data-li>
          {chunks}
        </span>
      </span>
    ),
    ink: (chunks: ReactNode) => <em className={styles.accent}>{chunks}</em>,
  }
}

export function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(' ')
}
