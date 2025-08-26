import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider'
import { SupabaseProvider } from '@/components/supabase-provider'
import { QueryProvider } from '@/components/query-provider'

import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Warzone Tournament System',
  description: 'Modern tournament management system for Warzone competitions',
  keywords: ['tournament', 'warzone', 'gaming', 'leaderboard'],
  authors: [{ name: 'Warzone Tournament Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default async function RootLayout({
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
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SupabaseProvider>
              <QueryProvider>
                {children}
                <Toaster 
                  position="top-right"
                  richColors
                  closeButton
                />
              </QueryProvider>
            </SupabaseProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
