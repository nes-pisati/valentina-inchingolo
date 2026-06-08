import { Bricolage_Grotesque, Bodoni_Moda, Hanken_Grotesk } from 'next/font/google'
import '../styles/globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '800'],
  variable: '--font-display',
})

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500'],
  variable: '--font-accent',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${bricolage.variable} ${bodoni.variable} ${hanken.variable}`}>
        {children}
      </body>
    </html>
  )
}