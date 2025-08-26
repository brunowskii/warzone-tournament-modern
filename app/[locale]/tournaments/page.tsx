'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import GlassPanel from '@/components/ui/glass-panel'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Trophy, Users, Calendar, Clock, MapPin, Target, Zap, Crown, Star, Eye, Play, X } from 'lucide-react'
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

interface TournamentsProps {
  params: { locale: string }
}

export default function TournamentsListPage({ params }: TournamentsProps) {
  const { locale } = params
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all')

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const response = await fetch('/api/tournaments/public')
        if (response.ok) {
          const data = await response.json()
          setTournaments(data)
        } else {
          // Fallback to mock data if API is not ready
          setTournaments([
            {
              id: 'wc2024',
              name: 'Warzone Championship 2024',
              code: 'WC2024',
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
            },
            {
              id: 'rs2024',
              name: 'Resurgence Showdown',
              code: 'RS2024',
              mode: 'Resurgence',
              format: 'Best 2 of 3',
              status: 'RECRUITING',
              startDate: '2024-02-20',
              startTime: '19:00',
              maxTeams: 40,
              currentTeams: 28,
              totalMatches: 3,
              countedMatches: 2,
              topFraggerEnabled: true,
              overlayTheme: 'neon',
              description: 'Fast-paced Resurgence action with quick respawns and intense battles.',
              prizePool: '$25,000'
            },
            {
              id: 'ww2024',
              name: 'Weekend Warriors',
              code: 'WW2024',
              mode: 'Battle Royale',
              format: 'Single Elimination',
              status: 'RECRUITING',
              startDate: '2024-02-25',
              startTime: '18:00',
              maxTeams: 30,
              currentTeams: 15,
              totalMatches: 1,
              countedMatches: 1,
              topFraggerEnabled: false,
              overlayTheme: 'dark',
              description: 'Casual tournament for weekend players looking for competitive fun.',
              prizePool: '$10,000'
            }
          ])
        }
      } catch (error) {
        console.error('Error loading tournaments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTournaments()
  }, [])

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return tournament.status === 'RECRUITING'
    if (filter === 'live') return tournament.status === 'ACTIVE'
    if (filter === 'completed') return tournament.status === 'COMPLETED'
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 border-green-500/50 text-green-400'
      case 'RECRUITING': return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
      case 'COMPLETED': return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
      case 'CANCELLED': return 'bg-red-500/20 border-red-500/50 text-red-400'
      default: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Zap className="w-4 h-4" />
      case 'RECRUITING': return <Users className="w-4 h-4" />
      case 'COMPLETED': return <Trophy className="w-4 h-4" />
      case 'CANCELLED': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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

  if (loading) {
    return (
      <div className="min-h-screen warzone-bg-pattern flex items-center justify-center">
        <GlassPanel className="p-8 text-center">
          <LoadingSpinner size="lg" variant="warzone" />
          <p className="text-cyan-400 mt-4 font-orbitron">Loading Tournaments...</p>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="min-h-screen warzone-bg-pattern">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassPanel className="p-6 mb-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-green-400/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-cyan-400 animate-float" />
                </div>
                <h1 className="text-5xl font-black font-orbitron text-white warzone-text-glow">
                  TOURNAMENTS
                </h1>
              </div>
              <p className="text-cyan-400/80 text-lg max-w-2xl mx-auto">
                Join the ultimate Warzone competitions. Compete against the best teams and win amazing prizes.
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto animate-pulse-glow"></div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassPanel className="p-4 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { key: 'all', label: 'All Tournaments', count: tournaments.length },
                { key: 'upcoming', label: 'Recruiting', count: tournaments.filter(t => t.status === 'RECRUITING').length },
                { key: 'live', label: 'Live Now', count: tournaments.filter(t => t.status === 'ACTIVE').length },
                { key: 'completed', label: 'Completed', count: tournaments.filter(t => t.status === 'COMPLETED').length }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  variant={filter === tab.key ? "default" : "outline"}
                  className={`font-orbitron ${
                    filter === tab.key 
                      ? 'bg-cyan-500 text-black hover:bg-cyan-400' 
                      : 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      filter === tab.key ? 'bg-black/20' : 'bg-cyan-400/20'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Tournaments Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card 
                className={`warzone-border bg-black/40 hover:bg-black/60 transition-all duration-300 group overflow-hidden ${
                  tournament.status === 'ACTIVE' 
                    ? 'border-green-400/50 ring-2 ring-green-400/20 animate-live-pulse' 
                    : tournament.status === 'RECRUITING'
                    ? 'border-blue-400/50 ring-2 ring-blue-400/20'
                    : 'border-cyan-400/30 hover:border-cyan-400/60'
                }`}
              >
                {tournament.status === 'ACTIVE' && (
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-black px-4 py-2 text-center font-bold text-sm">
                    <Zap className="w-4 h-4 inline mr-2" />
                    LIVE NOW
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white font-orbitron text-xl mb-2 group-hover:text-cyan-400 transition-colors">
                        {tournament.name}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-sm leading-relaxed">
                        {tournament.description}
                      </CardDescription>
                    </div>
                    {tournament.topFraggerEnabled && (
                      <Crown className="w-6 h-6 text-yellow-400 ml-4" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status and Type */}
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(tournament.status)} font-mono`}>
                      {getStatusIcon(tournament.status)}
                      <span className="ml-1 uppercase">{getStatusText(tournament.status)}</span>
                    </Badge>
                    <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                      {tournament.mode}
                    </Badge>
                  </div>

                  {/* Tournament Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{tournament.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span>{tournament.startTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>{tournament.currentTeams}/{tournament.maxTeams} Teams</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Target className="w-4 h-4 text-yellow-400" />
                      <span>{tournament.format}</span>
                    </div>
                  </div>

                  {/* Prize Pool */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-400/20 rounded-lg">
                    <span className="text-green-400 font-medium">Prize Pool</span>
                    <span className="text-2xl font-black text-white">{tournament.prizePool}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Registration Progress</span>
                      <span>{Math.round((tournament.currentTeams / tournament.maxTeams) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(tournament.currentTeams / tournament.maxTeams) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-2">
                    <Link 
                      href={`/${locale}/tournaments/${tournament.code}`}
                      className="flex-1"
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold"
                        disabled={tournament.status === 'COMPLETED'}
                      >
                        {tournament.status === 'ACTIVE' ? (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            View Live
                          </>
                        ) : tournament.status === 'RECRUITING' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Join Tournament
                          </>
                        ) : (
                          <>
                            <Trophy className="w-4 h-4 mr-2" />
                            View Results
                          </>
                        )}
                      </Button>
                    </Link>
                    {tournament.status === 'ACTIVE' && (
                      <Link href={`/${locale}/obs/leaderboard?tournamentId=${tournament.code}&theme=${tournament.overlayTheme}`}>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                        >
                          <Trophy className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredTournaments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlassPanel className="p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-cyan-400/30" />
              <h3 className="text-xl font-bold text-white mb-2">No tournaments found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' ? 'No tournaments available at the moment.' : `No ${filter} tournaments found.`}
              </p>
              <Button 
                onClick={() => setFilter('all')}
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
              >
                View All Tournaments
              </Button>
            </GlassPanel>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <GlassPanel className="p-8 mt-8 text-center">
            <h2 className="text-3xl font-bold text-white font-orbitron mb-4">Ready to Compete?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of players in the most competitive Warzone tournaments. 
              Showcase your skills and compete for amazing prizes.
            </p>
            <Link href={`/${locale}/auth/login`}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold px-8 py-4 text-lg warzone-glow"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  )
}

