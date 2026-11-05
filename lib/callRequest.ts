export const CALL_REQUEST_LIMITS = {
  name: 80,
  email: 254,
  note: 2000,
} as const

export type CallRequest = {
  firstName: string
  lastName: string
  email: string
  note: string
}

export type CallRequestField = 'firstName' | 'lastName' | 'email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function parseCallRequest(input: Record<string, unknown>): {
  data: CallRequest
  invalid: CallRequestField[]
  noteTooLong: boolean
} {
  const firstName = clean(input.firstName).replace(/\s+/g, ' ')
  const lastName = clean(input.lastName).replace(/\s+/g, ' ')
  const email = clean(input.email)
  const note = clean(input.note)

  const invalid: CallRequestField[] = []
  if (!firstName || firstName.length > CALL_REQUEST_LIMITS.name) invalid.push('firstName')
  if (!lastName || lastName.length > CALL_REQUEST_LIMITS.name) invalid.push('lastName')
  if (email.length > CALL_REQUEST_LIMITS.email || !EMAIL_RE.test(email)) invalid.push('email')

  return {
    data: { firstName, lastName, email, note },
    invalid,
    noteTooLong: note.length > CALL_REQUEST_LIMITS.note,
  }
}
