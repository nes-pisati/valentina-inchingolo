import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Preloader from '../../components/layout/Preloader/Preloader'
import CustomCursor from '../../components/layout/CustomCursor/CustomCursor'

const locales = ['it', 'en']

export function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!locales.includes(lang)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={lang} messages={messages}>
      <Preloader />
      <CustomCursor />
      <div data-intro-content>{children}</div>
    </NextIntlClientProvider>
  )
}