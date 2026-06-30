'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Footer from './Footer/Footer'

const HIDE_FOOTER = /^\/(it|en)\/contatti\/?$/

export default function ConditionalFooter() {
  const pathname = usePathname()
  const hide = HIDE_FOOTER.test(pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('no-footer', hide)
    return () => document.documentElement.classList.remove('no-footer')
  }, [hide])

  if (hide) return null
  return <Footer />
}
