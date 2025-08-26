'use client'

import { useTranslations } from 'next-intl'
import { useSupabase } from './supabase-provider'
import { Navigation } from './navigation'
import { Leaderboard } from './leaderboard'
import { TournamentList } from './tournament-list'
import { AuditLog } from './audit-log'

export function Dashboard() {
  const t = useTranslations()
  const { user } = useSupabase()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">
                {t('nav.dashboard')}
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email}
              </p>
            </div>
            
            {/* Leaderboard */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {t('scoring.leaderboard')}
              </h2>
              <Leaderboard />
            </div>

            {/* Tournaments */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {t('nav.tournaments')}
              </h2>
              <TournamentList />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Audit Log */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {t('audit.log')}
              </h2>
              <AuditLog />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
