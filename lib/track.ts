type Params = Record<string, string>

type TrackWindow = Window & { dataLayer?: Array<Record<string, unknown>> }

/**
 * Eventi della tabella 5 dell'handoff. Spinge su `dataLayer` se un tag manager
 * e' presente; senza, non fa nulla (nessuno script di tracking caricato qui).
 */
export function track(event: string, params: Params = {}) {
  const w = window as TrackWindow
  w.dataLayer?.push({ event, ...params })
}
