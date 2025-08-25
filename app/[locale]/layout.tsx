import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Navigation />
        <main>
          {children}
        </main>
      </Providers>
    </NextIntlClientProvider>
  )
}
