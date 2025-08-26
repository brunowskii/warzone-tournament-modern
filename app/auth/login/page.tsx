'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Zap, AlertTriangle, Eye, EyeOff, ArrowLeft, Globe } from 'lucide-react'
import GlassPanel from '@/components/ui/glass-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [globalStatus, setGlobalStatus] = useState(true)

  useEffect(() => {
    // Check global system status
    setGlobalStatus(true) // In real app, check actual system status
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setIsLoading(true)
    setError('')

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000))

    const trimmedPassword = password.trim()

    try {
      // Admin codes
      if (['MISOKIETI', 'MISOKIETI8'].includes(trimmedPassword.toUpperCase())) {
        console.log('✅ Admin login successful')
        window.location.href = '/en/dashboard'
        return
      }

      // Manager codes
      if (['Overwatch2025', 'Manager2024'].includes(trimmedPassword)) {
        console.log('✅ Manager login successful')
        window.location.href = '/en/dashboard'
        return
      }

      // Team codes (6 alphanumeric characters)
      if (/^[A-Z0-9]{6}$/.test(trimmedPassword.toUpperCase())) {
        console.log('✅ Team login successful')
        window.location.href = '/en/dashboard'
        return
      }

      setError('CODICE NON VALIDO')
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('ERRORE DI SISTEMA')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md">
        <Link 
          href="/"
          className="mb-4 flex items-center space-x-2 text-ice-blue/60 hover:text-ice-blue transition-colors font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna ai Tornei</span>
        </Link>
        <GlassPanel className="p-6 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ice-blue/20 to-ice-blue-dark/20 mb-4 relative">
              <Shield className="w-8 h-8 text-ice-blue" />
              <div className="absolute inset-0 rounded-full bg-ice-blue/10 animate-ping" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 font-mono">
              ACCESSO
            </h1>
            <p className="text-ice-blue/80 text-sm font-mono">
              Sistema Globale
            </p>
            
            {/* Status sistema globale */}
            <div className={`mt-3 flex items-center justify-center space-x-2 text-xs font-mono ${
              globalStatus ? 'text-green-400' : 'text-red-400'
            }`}>
              <Globe className="w-4 h-4" />
              <span>{globalStatus ? 'SISTEMA GLOBALE ATTIVO' : 'SISTEMA GLOBALE OFFLINE'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci codice"
                className="w-full px-4 py-3 bg-black/40 border border-ice-blue/40 rounded-xl text-white placeholder-ice-blue/60 focus:outline-none focus:border-ice-blue font-mono text-center"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ice-blue/60 hover:text-ice-blue transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3 font-mono">
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3 bg-gradient-to-r from-ice-blue to-ice-blue-dark text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(161,224,255,0.5)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'ACCESSO...' : 'ACCEDI'}</span>
              </div>
            </button>
          </form>

          <div className="mt-6 text-xs text-ice-blue/50 font-mono">
            <div>• Admin: Codici amministratore</div>
            <div>• Gestore: Codice fornito dall'admin</div>
            <div>• Squadra: Codice fornito dall'organizzatore</div>
            <div className="mt-2 text-yellow-400 text-xs">
              ⚠️ Non condividere i tuoi codici di accesso
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}