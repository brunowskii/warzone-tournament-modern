import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AuthGuard } from '@/components/auth-guard'
import { Dashboard } from '@/components/dashboard'

export default async function HomePage() {
  const t = await getTranslations()

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background">
        <Dashboard />
      </main>
    </AuthGuard>
  )
}
