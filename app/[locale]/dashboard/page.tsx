'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GlassPanel from '@/components/ui/glass-panel'
import LoadingSpinner from '@/components/ui/loading-spinner'
import TournamentCreator from '@/components/admin/tournament-creator'
import { Trophy, Users, Calendar, Settings, Plus, Eye, TrendingUp, Clock, Target } from 'lucide-react'
import { calculateLeaderboard, DEFAULT_MULTIPLIERS } from '@/lib/score-calculation'

interface DashboardProps {
  params: { locale: string }
}

export default function LocalizedDashboardPage({ params }: DashboardProps) {
  const { locale } = params
  const [showTournamentCreator, setShowTournamentCreator] = useState(false)
  const [tournaments, setTournaments] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    }
    loadData()
  }, [])

  const activeTournaments = tournaments.filter(t => t.status === 'active')
  const completedTournaments = tournaments.filter(t => t.status === 'completed')
  const totalMatches = matches.length
  const approvedMatches = matches.filter(m => m.status === 'approved').length

  if (loading) {
    return (
      <div className="min-h-screen warzone-bg-pattern flex items-center justify-center">
        <GlassPanel className="p-8 text-center">
          <LoadingSpinner size="lg" variant="warzone" />
          <p className="text-cyan-400 mt-4 font-orbitron">Loading Dashboard...</p>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="min-h-screen warzone-bg-pattern">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <GlassPanel className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-green-400/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-cyan-400 animate-float" />
              </div>
              <div>
                <h1 className="text-4xl font-black font-orbitron text-white warzone-text-glow">
                  COMMAND CENTER
                </h1>
                <p className="text-cyan-400/80 font-rajdhani text-lg">
                  Tournament Management System
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowTournamentCreator(true)}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold px-6 py-3 warzone-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Tournament
            </Button>
          </div>
        </GlassPanel>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="warzone-border bg-black/40 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 text-sm font-medium uppercase tracking-wide">Active Tournaments</p>
                  <p className="text-3xl font-black text-white">{activeTournaments.length}</p>
                </div>
                <Trophy className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-green-400/30 hover:border-green-400/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium uppercase tracking-wide">Total Teams</p>
                  <p className="text-3xl font-black text-white">{teams.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium uppercase tracking-wide">Total Matches</p>
                  <p className="text-3xl font-black text-white">{totalMatches}</p>
                </div>
                <Target className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="warzone-border bg-black/40 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium uppercase tracking-wide">Approved Matches</p>
                  <p className="text-3xl font-black text-white">{approvedMatches}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Tournaments */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-orbitron flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-cyan-400" />
                <span>Active Tournaments</span>
              </h2>
              {activeTournaments.length > 0 && (
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 rounded-full text-xs font-mono">
                  {activeTournaments.length} LIVE
                </span>
              )}
            </div>

            <div className="space-y-4">
              {activeTournaments.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-cyan-400/30" />
                  <p className="text-gray-400 mb-4">No active tournaments</p>
                  <Button
                    onClick={() => setShowTournamentCreator(true)}
                    variant="outline"
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Tournament
                  </Button>
                </div>
              ) : (
                activeTournaments.map((tournament, index) => (
                  <Card key={tournament.id} className="warzone-border bg-black/20 hover:bg-black/40 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-white mb-1">{tournament.name}</h3>
                          <p className="text-cyan-400/60 text-sm">{tournament.type} • {tournament.startDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </GlassPanel>

          {/* Recent Activity */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-orbitron flex items-center space-x-2">
                <Clock className="w-6 h-6 text-green-400" />
                <span>Recent Activity</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">System initialized</p>
                    <p className="text-gray-400 text-xs">Ready for tournament management</p>
                  </div>
                  <span className="text-gray-500 text-xs">Just now</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Quick Actions */}
        <GlassPanel className="p-6 mt-8">
          <h2 className="text-2xl font-bold text-white font-orbitron mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setShowTournamentCreator(true)}
              className="h-20 bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-400/30 hover:border-cyan-400/60 text-white transition-all duration-300"
              variant="outline"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <span className="font-orbitron">Create Tournament</span>
              </div>
            </Button>

            <Button
              className="h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 hover:border-purple-400/60 text-white transition-all duration-300"
              variant="outline"
            >
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <span className="font-orbitron">Manage Teams</span>
              </div>
            </Button>

            <Button
              className="h-20 bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-400/30 hover:border-yellow-400/60 text-white transition-all duration-300"
              variant="outline"
            >
              <div className="text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <span className="font-orbitron">View Reports</span>
              </div>
            </Button>
          </div>
        </GlassPanel>
      </div>

      {/* Tournament Creator Modal */}
      <TournamentCreator
        isOpen={showTournamentCreator}
        onClose={() => setShowTournamentCreator(false)}
        onTournamentCreated={(tournament) => {
          setTournaments(prev => [...prev, tournament])
          // Show success message
          console.log('Tournament created:', tournament)
        }}
      />
    </div>
  )
}


