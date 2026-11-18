import type { ReactNode } from 'react'
import Link from 'next/link'
import styles from './LegalPage.module.css'

type Block =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'fields'; items: { label: string; text: string }[] }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }

export type LegalContent = {
  eyebrow: string
  title: string
  updated: string
  intro: string[]
  sections: { title: string; blocks: Block[] }[]
}

const TOKEN = /(<b>.*?<\/b>|<code>.*?<\/code>|<a href="[^"]+">.*?<\/a>|<br>)/g

function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part === '<br>') return <br key={i} />
    const bold = part.match(/^<b>(.*)<\/b>$/)
    if (bold) return <strong key={i}>{bold[1]}</strong>
    const code = part.match(/^<code>(.*)<\/code>$/)
    if (code)
      return (
        <code key={i} className={styles.code}>
          {code[1]}
        </code>
      )
    const [, href, label] = part.match(/^<a href="([^"]+)">(.*)<\/a>$/) ?? []
    if (href) {
      return (
        <Link key={i} href={href} className={styles.link}>
          {label}
        </Link>
      )
    }
    return part
  })
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'p':
      return (
        <p key={i} className={styles.p}>
          {inline(block.text)}
        </p>
      )
    case 'h3':
      return (
        <h3 key={i} className={styles.h3}>
          {block.text}
        </h3>
      )
    case 'fields':
      return (
        <dl key={i} className={styles.fields}>
          {block.items.map(item => (
            <div key={item.label} className={styles.field}>
              <dt className={styles.fieldLabel}>{item.label}</dt>
              <dd className={styles.fieldText}>{inline(item.text)}</dd>
            </div>
          ))}
        </dl>
      )
    case 'list':
      return (
        <ul key={i} className={styles.list}>
          {block.items.map(item => (
            <li key={item}>{inline(item)}</li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <table key={i} className={styles.table}>
          <thead>
            <tr>
              {block.head.map(h => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} data-label={block.head[c]}>
                    {inline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
  }
}

export default function LegalPage({ content }: { content: LegalContent }) {
  return (
    <article className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.updated}>{content.updated}</p>
        {content.intro.map(text => (
          <p key={text} className={styles.intro}>
            {inline(text)}
          </p>
        ))}
      </header>

      <div className={styles.body}>
        {content.sections.map(section => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.h2}>{section.title}</h2>
            <div className={styles.content}>{section.blocks.map(renderBlock)}</div>
          </section>
        ))}
      </div>
    </article>
  )
}
