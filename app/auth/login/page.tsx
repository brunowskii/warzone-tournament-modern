'use client'

import React, { useState } from 'react'
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
        window.location.href = '/dashboard'
        return
      }

      // Manager codes
      if (['Overwatch2025', 'Manager2024'].includes(trimmedPassword)) {
        console.log('✅ Manager login successful')
        window.location.href = '/dashboard'
        return
      }

      // Team codes (6 alphanumeric characters)
      if (/^[A-Z0-9]{6}$/.test(trimmedPassword.toUpperCase())) {
        console.log('✅ Team login successful')
        window.location.href = '/dashboard'
        return
      }

      setError('Invalid access code. Please check your code and try again.')
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 relative z-10 warzone-bg-pattern">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-green-500/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-md mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-green-400/20 mb-6 relative">
            <Shield className="w-10 h-10 text-cyan-400 animate-float" />
            <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-orbitron tracking-wider warzone-text-glow">
            ACCESS PORTAL
          </h1>
          <p className="text-cyan-400/80 font-rajdhani">
            Enter your access code to continue
          </p>
        </div>

        {/* Global Status */}
        <div className="mb-6">
          <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${
            globalStatus 
              ? 'bg-green-500/10 border border-green-500/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              globalStatus ? 'bg-green-400' : 'bg-red-400'
            } animate-pulse`} />
            <span className={`text-sm font-rajdhani ${
              globalStatus ? 'text-green-400' : 'text-red-400'
            }`}>
              System Status: {globalStatus ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Login Form */}
        <GlassPanel className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-400 font-rajdhani">
                ACCESS CODE
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your access code..."
                  className="w-full bg-black/30 border-cyan-400/30 text-white placeholder-gray-500 font-orbitron tracking-wider text-center text-lg focus:border-cyan-400/60 focus:ring-cyan-400/60"
                  disabled={isLoading || !globalStatus}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400/60 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm font-rajdhani">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password.trim() || !globalStatus}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 font-orbitron tracking-wider text-lg warzone-glow transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  ACCESS SYSTEM
                </>
              )}
            </Button>
          </form>

          {/* Code Types Info */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-rajdhani mb-3">ACCESS CODE TYPES</p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-cyan-400/10 border border-cyan-400/20 rounded">
                <span className="text-cyan-400 font-rajdhani">ADMIN</span>
                <span className="text-gray-400 font-orbitron">MISOKIETI, MISOKIETI8</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-400/10 border border-purple-400/20 rounded">
                <span className="text-purple-400 font-rajdhani">MANAGER</span>
                <span className="text-gray-400 font-orbitron">Overwatch2025, Manager2024</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-400/10 border border-green-400/20 rounded">
                <span className="text-green-400 font-rajdhani">TEAM</span>
                <span className="text-gray-400 font-orbitron">6-digit code</span>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-cyan-400/60 hover:text-cyan-400 transition-colors font-rajdhani"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-cyan-400/40 font-rajdhani">
            © 2025 Warzone Tournament System
          </div>
          <div className="text-xs text-cyan-400/30 font-rajdhani mt-1">
            Secure Access Portal v4.0
          </div>
        </div>
      </div>
    </div>
  )
}