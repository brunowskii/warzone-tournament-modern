'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'

export function LoginForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const trimmedPassword = password.trim()

    try {
      // Admin codes
      if (['MISOKIETI', 'MISOKIETI8'].includes(trimmedPassword.toUpperCase())) {
        console.log('✅ Admin login successful')
        localStorage.setItem('userType', 'admin')
        localStorage.setItem('userCode', trimmedPassword.toUpperCase())
        window.location.href = '/en/dashboard'
        return
      }

      // Manager codes
      if (['Overwatch2025', 'Manager2024'].includes(trimmedPassword)) {
        console.log('✅ Manager login successful')
        localStorage.setItem('userType', 'manager')
        localStorage.setItem('userCode', trimmedPassword)
        window.location.href = '/en/dashboard'
        return
      }

      // Team codes (6 alphanumeric characters)
      if (/^[A-Z0-9]{6}$/.test(trimmedPassword.toUpperCase())) {
        console.log('✅ Team login successful')
        localStorage.setItem('userType', 'team')
        localStorage.setItem('userCode', trimmedPassword.toUpperCase())
        window.location.href = '/en/dashboard'
        return
      }

      toast.error('CODICE NON VALIDO')
    } catch (err) {
      console.error('❌ Login error:', err)
      toast.error('ERRORE DI SISTEMA')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            ACCESSO
          </CardTitle>
          <CardDescription className="text-center">
            Sistema Globale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Codice di Accesso</Label>
              <Input
                id="password"
                type="password"
                placeholder="Inserisci codice"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-center font-mono"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold"
              disabled={loading || !password.trim()}
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? <LoadingSpinner /> : <span>⚡</span>}
                <span>{loading ? 'ACCESSO...' : 'ACCEDI'}</span>
              </div>
            </Button>
          </form>

          <div className="mt-6 text-xs text-cyan-400/60 font-mono space-y-1">
            <div>• Admin: Codici amministratore</div>
            <div>• Gestore: Codice fornito dall'admin</div>
            <div>• Squadra: Codice fornito dall'organizzatore</div>
            <div className="mt-2 text-yellow-400 text-xs">
              ⚠️ Non condividere i tuoi codici di accesso
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
