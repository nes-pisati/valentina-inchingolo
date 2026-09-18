export type ProductKey = 'minikit' | 'checkup'

export type Price = {
  amount: number
  compareAt: number | null
}

export type Prices = Record<ProductKey, Price>

export const PRODUCT_KEYS: readonly ProductKey[] = ['minikit', 'checkup']

export function stripePriceId(product: ProductKey): string | undefined {
  return product === 'minikit'
    ? process.env.STRIPE_PRICE_MINIKIT
    : process.env.STRIPE_PRICE_CHECKUP
}

const PLACEHOLDER_PRICES: Prices = {
  minikit: { amount: 49, compareAt: 97 },
  checkup: { amount: 390, compareAt: 590 },
}

type StripePrice = {
  unit_amount: number | null
  metadata?: Record<string, string>
}

async function fetchStripePrice(product: ProductKey): Promise<Price | null> {
  const key = process.env.STRIPE_SECRET_KEY
  const id = stripePriceId(product)
  if (!key || !id) return null

  try {
    const res = await fetch(`https://api.stripe.com/v1/prices/${id}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600, tags: ['prices'] },
    })
    if (!res.ok) return null

    const data = (await res.json()) as StripePrice
    if (data.unit_amount == null) return null

    const compareAt = Number(data.metadata?.compare_at)
    return {
      amount: data.unit_amount / 100,
      compareAt: Number.isFinite(compareAt) && compareAt > 0 ? compareAt : null,
    }
  } catch {
    return null
  }
}

export async function getPrices(): Promise<Prices> {
  const [minikit, checkup] = await Promise.all([
    fetchStripePrice('minikit'),
    fetchStripePrice('checkup'),
  ])
  return {
    minikit: minikit ?? PLACEHOLDER_PRICES.minikit,
    checkup: checkup ?? PLACEHOLDER_PRICES.checkup,
  }
}
