import { NextResponse } from 'next/server'
import { PRODUCT_KEYS, stripePriceId, type ProductKey } from '../../../lib/prices'

type Body = { product?: string; lang?: string }

function isProduct(value: unknown): value is ProductKey {
  return typeof value === 'string' && (PRODUCT_KEYS as readonly string[]).includes(value)
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null
  const product = body?.product
  if (!isProduct(product)) {
    return NextResponse.json({ error: 'invalid_product' }, { status: 400 })
  }

  const lang = body?.lang === 'en' ? 'en' : 'it'
  const key = process.env.STRIPE_SECRET_KEY
  const price = stripePriceId(product)
  if (!key || !price) {
    return NextResponse.json({ error: 'checkout_unavailable' }, { status: 503 })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin
  const params = new URLSearchParams({
    mode: 'payment',
    'line_items[0][price]': price,
    'line_items[0][quantity]': '1',
    locale: lang,
    success_url: `${origin}/${lang}/soluzioni?checkout=success#${product}`,
    cancel_url: `${origin}/${lang}/soluzioni#${product}`,
    'metadata[product]': product,
  })

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 })
  }

  const session = (await res.json()) as { url?: string }
  if (!session.url) {
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 })
  }

  return NextResponse.json({ url: session.url })
}
