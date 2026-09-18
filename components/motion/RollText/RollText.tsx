import styles from './RollText.module.css'

type Props = {
  text: string
  className?: string
}

export default function RollText({ text, className }: Props) {
  return (
    <span className={[styles.roll, className].filter(Boolean).join(' ')}>
      <span className={styles.srOnly}>{text}</span>
      <span className={styles.chars} aria-hidden="true">
        {Array.from(text).map((c, i) => {
          const ch = c === ' ' ? ' ' : c
          return (
            <span key={`${i}-${c}`} className={styles.ch}>
              <span className={styles.ci} data-ci>
                {ch}
                <br />
                {ch}
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
