import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'

const inter = Inter({ subsets: ['latin'] })

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation />
            <main>
              {children}
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
