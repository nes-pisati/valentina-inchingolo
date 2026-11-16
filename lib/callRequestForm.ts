export const CALL_REQUEST_LIMITS = {
  name: 80,
  email: 254,
  product: 150,
  goal: 600,
} as const

export const STAGE_OPTIONS = ['pre', 'lt6', 'gt6'] as const

export type Stage = (typeof STAGE_OPTIONS)[number]

export type CallRequest = {
  name: string
  email: string
  product: string
  stage: Stage | ''
  goal: string
}

export const CALL_REQUEST_FIELDS = [
  'name',
  'email',
  'product',
  'stage',
  'goal',
  'privacy',
] as const

export type CallRequestField = (typeof CALL_REQUEST_FIELDS)[number]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function oneOf<T extends string>(options: readonly T[], value: string): value is T {
  return (options as readonly string[]).includes(value)
}

export function parseCallRequest(input: Record<string, unknown>): {
  data: CallRequest | null
  invalid: CallRequestField[]
} {
  const name = clean(input.name).replace(/\s+/g, ' ')
  const email = clean(input.email)
  const product = clean(input.product).replace(/\s+/g, ' ')
  const stage = clean(input.stage)
  const goal = clean(input.goal)
  const privacy = input.privacy === true || input.privacy === 'on' || input.privacy === '1'

  const invalid: CallRequestField[] = []
  if (!name || name.length > CALL_REQUEST_LIMITS.name) invalid.push('name')
  if (email.length > CALL_REQUEST_LIMITS.email || !EMAIL_RE.test(email)) invalid.push('email')
  if (product.length > CALL_REQUEST_LIMITS.product) invalid.push('product')
  if (stage && !oneOf(STAGE_OPTIONS, stage)) invalid.push('stage')
  if (goal.length > CALL_REQUEST_LIMITS.goal) invalid.push('goal')
  if (!privacy) invalid.push('privacy')

  if (invalid.length > 0) return { data: null, invalid }

  return {
    data: { name, email, product, stage: oneOf(STAGE_OPTIONS, stage) ? stage : '', goal },
    invalid,
  }
}
