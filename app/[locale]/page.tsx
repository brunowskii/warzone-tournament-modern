import { AuthGuard } from '@/components/auth-guard'
import { Dashboard } from '@/components/dashboard'

export default function HomePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-background">
        <Dashboard />
      </main>
    </AuthGuard>
  )
}
