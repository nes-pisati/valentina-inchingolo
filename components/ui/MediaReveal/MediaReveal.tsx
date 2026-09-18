import Image, { type StaticImageData } from 'next/image'
import styles from './MediaReveal.module.css'

type Props = {
  src: StaticImageData
  caption?: string
  sizes: string
  square?: boolean
  tone?: 'cipria' | 'corallo' | 'fango'
  className?: string
  captionClassName?: string
}

export default function MediaReveal({
  src,
  caption,
  sizes,
  square = false,
  tone = 'cipria',
  className,
  captionClassName,
}: Props) {
  return (
    <figure className={[styles.figure, className].filter(Boolean).join(' ')}>
      <div className={`${styles.media} ${square ? styles.square : ''} ${styles[tone]}`} data-media>
        <div className={styles.in} data-media-in>
          <div className={styles.img} data-media-img>
            <Image src={src} alt="" fill sizes={sizes} className={styles.el} />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className={[styles.caption, captionClassName].filter(Boolean).join(' ')}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
