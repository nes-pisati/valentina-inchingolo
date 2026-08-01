'use client'

import { useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function ScrollTop() {
  useIsomorphicLayoutEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])
  return null
}
