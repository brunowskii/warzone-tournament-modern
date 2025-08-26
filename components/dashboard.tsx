'use client'

import React, { useState, useEffect } from 'react'
import { Navigation } from './navigation'
import { Leaderboard } from './leaderboard'
import { TournamentList } from './tournament-list'
import { AuditLog } from './audit-log'

export function Dashboard() {
  // Get user type from localStorage (set by login)
  const [userType, setUserType] = useState<'admin' | 'manager' | 'team' | null>(null)
  const [userCode, setUserCode] = useState<string>('')

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') as 'admin' | 'manager' | 'team' | null
    const storedUserCode = localStorage.getItem('userCode') || ''

    setUserType(storedUserType)
    setUserCode(storedUserCode)

    console.log('Dashboard Debug:', { userType: storedUserType, userCode: storedUserCode })
  }, [])

  const getWelcomeMessage = () => {
    switch (userType) {
      case 'admin':
        return 'Welcome back, Administrator'
      case 'manager':
        return 'Welcome back, Tournament Manager'
      case 'team':
        return `Welcome back, Team ${userCode}`
      default:
        return 'Welcome to Warzone Tournament System'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">
                DASHBOARD
              </h1>
              <p className="text-muted-foreground">
                {getWelcomeMessage()}
              </p>
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400">
                  🚀 Warzone Tournament System is running successfully!
                </p>
                {userType && (
                  <p className="text-cyan-400 text-sm mt-2">
                    Access Level: <span className="font-bold">{userType.toUpperCase()}</span>
                    {userCode && <span className="ml-2">Code: {userCode}</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                LEADERBOARD
              </h2>
              <Leaderboard />
            </div>

            {/* Tournaments */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                TOURNAMENTS
              </h2>
              <TournamentList />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Audit Log */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                AUDIT LOG
              </h2>
              <AuditLog />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
