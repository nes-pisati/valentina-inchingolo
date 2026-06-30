'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'

export default function LocalClock({ prefix }: { prefix: string }) {
  const locale = useLocale()
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [locale])

  return (
    <span suppressHydrationWarning>
      {prefix} {time}
    </span>
  )
}
