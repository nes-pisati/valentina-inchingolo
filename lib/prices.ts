export type ProductKey = 'minikit'

export type Price = {
  amount: number
  compareAt: number | null
}

export type Prices = Record<ProductKey, Price>

const PRICES: Prices = {
  minikit: { amount: 49, compareAt: null },
}

export async function getPrices(): Promise<Prices> {
  return PRICES
}
