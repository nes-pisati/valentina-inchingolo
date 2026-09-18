export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)
}

export function formatPrice(value: number, locale: string): string {
  return `€${formatNumber(value, locale)}`
}
