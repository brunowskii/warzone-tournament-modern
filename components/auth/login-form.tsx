<<<<<<< HEAD
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true)
    setEmail(demoEmail)
    setPassword('demo123')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: 'demo123',
      })

      if (error) {
        throw error
      }

      toast({
        title: 'Success',
        description: 'Logged in with demo account!',
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login with demo account',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or try demo accounts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          onClick={() => handleDemoLogin('admin@warzone.com')}
          disabled={loading}
        >
          Demo Admin
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDemoLogin('manager@warzone.com')}
          disabled={loading}
        >
          Demo Manager
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDemoLogin('team1@warzone.com')}
          disabled={loading}
        >
          Demo Team
        </Button>
      </div>
    </div>
  )
}
=======
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true)
    setEmail(demoEmail)
    setPassword('demo123')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: 'demo123',
      })

      if (error) {
        throw error
      }

      toast({
        title: 'Success',
        description: 'Logged in with demo account!',
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login with demo account',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or try demo accounts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="outline"
          onClick={() => handleDemoLogin('admin@warzone.com')}
          disabled={loading}
        >
          Demo Admin
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDemoLogin('manager@warzone.com')}
          disabled={loading}
        >
          Demo Manager
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDemoLogin('team1@warzone.com')}
          disabled={loading}
        >
          Demo Team
        </Button>
      </div>
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
