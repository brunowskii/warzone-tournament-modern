'use client'

import { useSupabase } from './supabase-provider'
import { LoginForm } from '../login-form'
import { LoadingSpinner } from './loading-spinner'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <>{children}</>
}
