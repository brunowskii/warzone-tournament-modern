'use client'

import { useSupabase } from '@/components/supabase-provider'
import { LoginForm } from '@/components/login-form'
import { LoadingSpinner } from '@/components/loading-spinner'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()

  console.log('AuthGuard Debug:', { user, loading })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('No user found, showing login form')
    return <LoginForm />
  }

  console.log('User authenticated, showing children')
  return <>{children}</>
}
