import './globals.css'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Warzone Tournament Portal',
  description: 'Modern Warzone tournament system'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Redirect to default locale
  redirect('/en')
}

