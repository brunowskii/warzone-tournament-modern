<<<<<<< HEAD
'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
=======
'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
