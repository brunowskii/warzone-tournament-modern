'use client'

import React from 'react'
import { LoginForm } from '@/components/login-form'
import { LoadingSpinner } from '@/components/loading-spinner'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = React.useState<'admin' | 'manager' | 'team' | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Check authentication from localStorage
    const storedUserType = localStorage.getItem('userType') as 'admin' | 'manager' | 'team' | null
    const storedUserCode = localStorage.getItem('userCode')

    console.log('AuthGuard Debug:', { storedUserType, storedUserCode })

    if (storedUserType && storedUserCode) {
      setUserType(storedUserType)
    }

    setLoading(false)
  }, [])

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

  if (!userType) {
    console.log('No user found, showing login form')
    return <LoginForm />
  }

  console.log('User authenticated, showing children')
  return <>{children}</>
}
