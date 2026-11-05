import { NextResponse } from 'next/server'
import { parseCallRequest } from '../../../lib/callRequest'
import { CONTACTS } from '../../../lib/contacts'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const { data, invalid, noteTooLong } = parseCallRequest(body)
  if (invalid.length > 0 || noteTooLong) {
    return NextResponse.json({ error: 'invalid_request', fields: invalid }, { status: 400 })
  }

  const apiKey = process.env.BREVO_API_KEY
  const sender = process.env.BREVO_SENDER_EMAIL
  if (!apiKey || !sender) {
    return NextResponse.json({ error: 'email_unavailable' }, { status: 503 })
  }

  const name = `${data.firstName} ${data.lastName}`
  const language = body.lang === 'en' ? 'inglese' : 'italiano'

  const textContent = [
    'Nuova richiesta di call dal sito.',
    '',
    `Nome: ${data.firstName}`,
    `Cognome: ${data.lastName}`,
    `Email: ${data.email}`,
    `Lingua del sito: ${language}`,
    '',
    'Nota:',
    data.note || '(nessuna nota)',
    '',
    'Rispondi a questa email per confermare l’appuntamento.',
  ].join('\n')

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: sender, name: 'Ink the Gap' },
      to: [{ email: process.env.CALL_REQUEST_TO ?? CONTACTS.email }],
      replyTo: { email: data.email, name },
      subject: `Richiesta call: ${name}`,
      textContent,
    }),
  }).catch(() => null)

  if (!res?.ok) {
    return NextResponse.json({ error: 'email_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
