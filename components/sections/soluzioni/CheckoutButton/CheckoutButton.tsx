'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import PillButton from '../../../ui/PillButton/PillButton'
import type { ProductKey } from '../../../../lib/prices'

type Props = {
  product: ProductKey
  label: string
  variant: 'coral' | 'light-coral'
}

export default function CheckoutButton({ product, label, variant }: Props) {
  const locale = useLocale()
  const [busy, setBusy] = useState(false)

  const onClick = async () => {
    if (busy) return
    setBusy(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, lang: locale }),
      })
      const data = (await res.json()) as { url?: string }
      if (res.ok && data.url) {
        window.location.assign(data.url)
        return
      }
    } catch {}
    setBusy(false)
  }

  return <PillButton label={label} variant={variant} onClick={onClick} busy={busy} />
}
