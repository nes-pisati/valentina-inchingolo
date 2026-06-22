let latched = false
const listeners = new Set<() => void>()

export function signalIntro() {
  latched = true
  listeners.forEach(cb => cb())
  listeners.clear()
}

export function onIntro(cb: () => void): () => void {
  if (latched) {
    cb()
    return () => {}
  }
  listeners.add(cb)
  return () => listeners.delete(cb)
}
