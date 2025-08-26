'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import GlassPanel from '@/components/ui/glass-panel'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Trophy, Users, Calendar, Clock, Target, Zap, Crown, Eye, Play, Copy, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Tournament {
  id: string
  name: string
  code: string
  mode: string
  format: string
  status: 'PENDING' | 'RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  startDate: string
  startTime: string
  maxTeams: number
  currentTeams: number
  totalMatches: number
  countedMatches: number
  topFraggerEnabled: boolean
  overlayTheme: string
  description: string
  prizePool: string
}

interface Team {
  id: string
  name: string
  code: string
  totalScore: number
  rank: number
  matchesPlayed: number
}

interface PlayerStat {
  id: string
  playerName: string
  totalKills: number
  averageKills: number
  matchesPlayed: number
}

interface TournamentDetailProps {
  params: { locale: string; code: string }
}

export default function TournamentDetailPage({ params }: TournamentDetailProps) {
  const { locale, code } = params
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [topFraggers, setTopFraggers] = useState<PlayerStat[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'fraggers' | 'obs'>('overview')

  useEffect(() => {
    const loadTournamentData = async () => {
      try {
        // Load tournament details
        const tournamentResponse = await fetch(`/api/tournaments/${code}`)
        if (tournamentResponse.ok) {
          const tournamentData = await tournamentResponse.json()
          setTournament(tournamentData)
        } else {
          // Fallback to mock data
          setTournament({
            id: code,
            name: 'Warzone Championship 2024',
            code: code,
            mode: 'Battle Royale',
            format: 'Best 3 of 5',
            status: 'ACTIVE',
            startDate: '2024-02-15',
            startTime: '20:00',
            maxTeams: 60,
            currentTeams: 42,
            totalMatches: 5,
            countedMatches: 3,
            topFraggerEnabled: true,
            overlayTheme: 'ice',
            description: 'The ultimate Warzone competition featuring the best teams from around the world.',
            prizePool: '$50,000'
          })
        }

        // Load leaderboard data
        const leaderboardResponse = await fetch(`/api/leaderboard/${code}/public`)
        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json()
          setTeams(leaderboardData.leaderboard || [])
          setTopFraggers(leaderboardData.topFraggerStats || [])
        } else {
          // Fallback to mock data
          setTeams([
            { id: '1', name: 'BlackCrow Alpha', code: 'BC001', totalScore: 245.5, rank: 1, matchesPlayed: 3 },
            { id: '2', name: 'Shadow Wolves', code: 'BC002', totalScore: 238.2, rank: 2, matchesPlayed: 3 },
            { id: '3', name: 'Phoenix Rising', code: 'BC003', totalScore: 231.8, rank: 3, matchesPlayed: 3 },
            { id: '4', name: 'Thunder Strike', code: 'BC004', totalScore: 225.1, rank: 4, matchesPlayed: 3 },
            { id: '5', name: 'Ice Breakers', code: 'BC005', totalScore: 218.7, rank: 5, matchesPlayed: 3 },
          ])
          setTopFraggers([
            { id: '1', playerName: 'Alpha_Player1', totalKills: 45, averageKills: 15.0, matchesPlayed: 3 },
            { id: '2', playerName: 'Shadow_Leader', totalKills: 42, averageKills: 14.0, matchesPlayed: 3 },
            { id: '3', playerName: 'Phoenix_Elite', totalKills: 39, averageKills: 13.0, matchesPlayed: 3 },
            { id: '4', playerName: 'Thunder_Striker', totalKills: 36, averageKills: 12.0, matchesPlayed: 3 },
            { id: '5', playerName: 'Ice_Crusher', totalKills: 33, averageKills: 11.0, matchesPlayed: 3 },
          ])
        }
      } catch (error) {
        console.error('Error loading tournament data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTournamentData()
  }, [code])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 border-green-500/50 text-green-400'
      case 'RECRUITING': return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
      case 'COMPLETED': return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
      case 'CANCELLED': return 'bg-red-500/20 border-red-500/50 text-red-400'
      default: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'LIVE NOW'
      case 'RECRUITING': return 'RECRUITING'
      case 'COMPLETED': return 'COMPLETED'
      case 'CANCELLED': return 'CANCELLED'
      default: return 'PENDING'
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen warzone-bg-pattern flex items-center justify-center">
        <GlassPanel className="p-8 text-center">
          <LoadingSpinner size="lg" variant="warzone" />
          <p className="text-cyan-400 mt-4 font-orbitron">Loading Tournament...</p>
        </GlassPanel>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen warzone-bg-pattern flex items-center justify-center">
        <GlassPanel className="p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-cyan-400/30" />
          <h3 className="text-xl font-bold text-white mb-2">Tournament Not Found</h3>
          <p className="text-gray-400 mb-6">The tournament you're looking for doesn't exist.</p>
          <Link href={`/${locale}/tournaments`}>
            <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tournaments
            </Button>
          </Link>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="min-h-screen warzone-bg-pattern">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href={`/${locale}/tournaments`}>
            <Button variant="outline" className="mb-6 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tournaments
            </Button>
          </Link>
        </motion.div>

        {/* Tournament Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassPanel className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(tournament.status)} font-mono`}>
                    {tournament.status === 'ACTIVE' && <Zap className="w-4 h-4 mr-1" />}
                    {getStatusText(tournament.status)}
                  </Badge>
                  <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                    {tournament.mode}
                  </Badge>
                  {tournament.topFraggerEnabled && (
                    <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                      <Crown className="w-4 h-4 mr-1" />
                      Top Fragger
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl lg:text-6xl font-black font-orbitron text-white warzone-text-glow">
                  {tournament.name}
                </h1>
                <p className="text-cyan-400/80 text-lg max-w-3xl">
                  {tournament.description}
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="text-3xl font-black text-white">{tournament.prizePool}</div>
                <div className="text-cyan-400 font-mono">PRIZE POOL</div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassPanel className="p-4 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { key: 'overview', label: 'Overview', icon: Eye },
                { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { key: 'fraggers', label: 'Top Fraggers', icon: Crown },
                { key: 'obs', label: 'OBS Overlay', icon: ExternalLink }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  variant={activeTab === tab.key ? "default" : "outline"}
                  className={`font-orbitron ${
                    activeTab === tab.key 
                      ? 'bg-cyan-500 text-black hover:bg-cyan-400' 
                      : 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tournament Details */}
              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white font-orbitron mb-6">Tournament Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <span>{tournament.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span>{tournament.startTime}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span>{tournament.currentTeams}/{tournament.maxTeams} Teams</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Target className="w-5 h-5 text-yellow-400" />
                      <span>{tournament.format}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Registration Progress</span>
                      <span>{Math.round((tournament.currentTeams / tournament.maxTeams) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-green-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(tournament.currentTeams / tournament.maxTeams) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4">
                    {tournament.status === 'RECRUITING' ? (
                      <Link href={`/${locale}/auth/login`}>
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold">
                          <Play className="w-4 h-4 mr-2" />
                          Join Tournament
                        </Button>
                      </Link>
                    ) : tournament.status === 'ACTIVE' ? (
                      <div className="space-y-3">
                        <Link href={`/${locale}/obs/leaderboard?tournamentId=${tournament.code}&theme=${tournament.overlayTheme}`}>
                          <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold">
                            <Eye className="w-4 h-4 mr-2" />
                            View Live Leaderboard
                          </Button>
                        </Link>
                        <Link href={`/${locale}/auth/login`}>
                          <Button variant="outline" className="w-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
                            <Trophy className="w-4 h-4 mr-2" />
                            Team Dashboard
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button disabled className="w-full bg-gray-500 text-gray-300">
                        Tournament {tournament.status.toLowerCase()}
                      </Button>
                    )}
                  </div>
                </div>
              </GlassPanel>

              {/* Quick Stats */}
              <GlassPanel className="p-6">
                <h2 className="text-2xl font-bold text-white font-orbitron mb-6">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <div className="text-3xl font-black text-cyan-400">{tournament.currentTeams}</div>
                    <div className="text-gray-400 text-sm">Teams Registered</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <div className="text-3xl font-black text-green-400">{tournament.totalMatches}</div>
                    <div className="text-gray-400 text-sm">Total Matches</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <div className="text-3xl font-black text-purple-400">{tournament.countedMatches}</div>
                    <div className="text-gray-400 text-sm">Best Matches</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg">
                    <div className="text-3xl font-black text-yellow-400">{tournament.maxTeams}</div>
                    <div className="text-gray-400 text-sm">Max Teams</div>
                  </div>
                </div>
              </GlassPanel>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <GlassPanel className="p-6">
              <h2 className="text-2xl font-bold text-white font-orbitron mb-6">Live Leaderboard</h2>
              <div className="space-y-3">
                {teams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={`warzone-border transition-all duration-300 ${
                      team.rank === 1 ? 'bg-yellow-500/10 border-yellow-500/30' :
                      team.rank === 2 ? 'bg-gray-500/10 border-gray-500/30' :
                      team.rank === 3 ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-black/20 border-cyan-400/20'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              team.rank === 1 ? 'bg-yellow-500 text-black' :
                              team.rank === 2 ? 'bg-gray-400 text-black' :
                              team.rank === 3 ? 'bg-orange-500 text-black' :
                              'bg-cyan-500/20 text-cyan-400'
                            }`}>
                              {team.rank}
                            </div>
                            <div>
                              <div className="font-bold text-white">{team.name}</div>
                              <div className="text-gray-400 text-sm">{team.code}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-white">{team.totalScore.toFixed(1)}</div>
                            <div className="text-gray-400 text-sm">{team.matchesPlayed} matches</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          )}

          {activeTab === 'fraggers' && tournament.topFraggerEnabled && (
            <GlassPanel className="p-6">
              <h2 className="text-2xl font-bold text-white font-orbitron mb-6">Top Fraggers</h2>
              <div className="space-y-3">
                {topFraggers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={`warzone-border transition-all duration-300 ${
                      index === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
                      index === 1 ? 'bg-gray-500/10 border-gray-500/30' :
                      index === 2 ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-black/20 border-cyan-400/20'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500 text-black' :
                              index === 1 ? 'bg-gray-400 text-black' :
                              index === 2 ? 'bg-orange-500 text-black' :
                              'bg-cyan-500/20 text-cyan-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-bold text-white">{player.playerName}</div>
                              <div className="text-gray-400 text-sm">{player.matchesPlayed} matches</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-white">{player.totalKills}</div>
                            <div className="text-gray-400 text-sm">{(player.averageKills).toFixed(1)} avg</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          )}

          {activeTab === 'obs' && (
            <GlassPanel className="p-6">
              <h2 className="text-2xl font-bold text-white font-orbitron mb-6">OBS Overlay Integration</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">Leaderboard Overlay</h3>
                    <div className="space-y-2">
                      {['ice', 'neon', 'dark'].map((theme) => (
                        <div key={theme} className="flex items-center space-x-2">
                          <Button
                            onClick={() => copyToClipboard(`${window.location.origin}/${locale}/obs/leaderboard?tournamentId=${tournament.code}&theme=${theme}`)}
                            variant="outline"
                            size="sm"
                            className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </Button>
                          <Link href={`/${locale}/obs/leaderboard?tournamentId=${tournament.code}&theme=${theme}`} target="_blank">
                            <Button variant="outline" size="sm" className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {tournament.topFraggerEnabled && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-white">Top Fragger Overlay</h3>
                      <div className="space-y-2">
                        {['ice', 'neon', 'dark'].map((theme) => (
                          <div key={theme} className="flex items-center space-x-2">
                            <Button
                              onClick={() => copyToClipboard(`${window.location.origin}/${locale}/obs/leaderboard?tournamentId=${tournament.code}&view=fragger&theme=${theme}`)}
                              variant="outline"
                              size="sm"
                              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </Button>
                            <Link href={`/${locale}/obs/leaderboard?tournamentId=${tournament.code}&view=fragger&theme=${theme}`} target="_blank">
                              <Button variant="outline" size="sm" className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-black/20 rounded-lg">
                  <h4 className="font-bold text-white mb-2">OBS Setup Instructions:</h4>
                  <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                    <li>Add a new Browser Source in OBS</li>
                    <li>Copy one of the URLs above</li>
                    <li>Set width to 1920 and height to 1080 (or your canvas size)</li>
                    <li>Enable "Refresh browser when scene becomes active"</li>
                    <li>Position the overlay on your stream</li>
                  </ol>
                </div>
              </div>
            </GlassPanel>
          )}
        </motion.div>
      </div>
    </div>
  )
}

