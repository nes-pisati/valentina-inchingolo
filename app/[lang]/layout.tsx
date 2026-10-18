import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '../../components/layout/Header/Header'
import Preloader from '../../components/layout/Preloader/Preloader'
import CustomCursor from '../../components/layout/CustomCursor/CustomCursor'
import ConditionalFooter from '../../components/layout/ConditionalFooter'
import { EN_PUBLISHED } from '../../lib/locales'

const locales = ['it', 'en']

export function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang === 'en' && !EN_PUBLISHED) return { robots: { index: false, follow: false } }
  return {}
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
      <Header />
      <div data-intro-content>{children}</div>
      <ConditionalFooter />
    </NextIntlClientProvider>
  )
}