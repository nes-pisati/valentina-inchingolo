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

let completed = false
const completeListeners = new Set<() => void>()

export function signalIntroComplete() {
  completed = true
  completeListeners.forEach(cb => cb())
  completeListeners.clear()
}

export function onIntroComplete(cb: () => void): () => void {
  if (completed) {
    cb()
    return () => {}
  }
  completeListeners.add(cb)
  return () => completeListeners.delete(cb)
}
