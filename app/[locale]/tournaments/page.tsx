'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import GlassPanel from '@/components/ui/glass-panel'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Trophy, Users, Calendar, Clock, MapPin, Target, Zap, Crown, Star } from 'lucide-react'
import Link from 'next/link'

interface TournamentsProps {
  params: { locale: string }
}

// Mock tournament data with Warzone theme
const mockTournaments = [
  {
    id: 'warzone-championship-2024',
    name: 'Warzone Championship 2024',
    type: 'Battle Royale',
    status: 'active',
    startDate: '2024-02-15',
    startTime: '20:00',
    description: 'The ultimate Warzone competition featuring the best teams from around the world.',
    maxTeams: 60,
    currentTeams: 42,
    prizePool: '$50,000',
    format: 'Best 3 of 5 matches',
    featured: true
  },
  {
    id: 'resurgence-showdown',
    name: 'Resurgence Showdown',
    type: 'Resurgence',
    status: 'active',
    startDate: '2024-02-20',
    startTime: '19:00',
    description: 'Fast-paced Resurgence action with quick respawns and intense battles.',
    maxTeams: 40,
    currentTeams: 28,
    prizePool: '$25,000',
    format: 'Best 2 of 3 matches',
    featured: false
  },
  {
    id: 'weekend-warriors',
    name: 'Weekend Warriors',
    type: 'Battle Royale',
    status: 'recruiting',
    startDate: '2024-02-25',
    startTime: '18:00',
    description: 'Casual tournament for weekend players looking for competitive fun.',
    maxTeams: 30,
    currentTeams: 15,
    prizePool: '$10,000',
    format: 'Single elimination',
    featured: false
  },
  {
    id: 'pro-league-finals',
    name: 'Pro League Finals',
    type: 'Battle Royale',
    status: 'completed',
    startDate: '2024-02-01',
    startTime: '20:00',
    description: 'The grand finale of the professional Warzone league season.',
    maxTeams: 20,
    currentTeams: 20,
    prizePool: '$100,000',
    format: 'Best 4 of 6 matches',
    featured: true
  }
]

export default function TournamentsListPage({ params }: TournamentsProps) {
  const { locale } = params
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'recruiting' | 'completed'>('all')

  useEffect(() => {
    const loadTournaments = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      setTournaments(mockTournaments)
      setLoading(false)
    }
    loadTournaments()
  }, [])

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'all') return true
    return tournament.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 border-green-500/50 text-green-400'
      case 'recruiting': return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
      case 'completed': return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
      default: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="w-4 h-4" />
      case 'recruiting': return <Users className="w-4 h-4" />
      case 'completed': return <Trophy className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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

        {/* Filter Tabs */}
        <GlassPanel className="p-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: 'all', label: 'All Tournaments', count: tournaments.length },
              { key: 'active', label: 'Live Now', count: tournaments.filter(t => t.status === 'active').length },
              { key: 'recruiting', label: 'Recruiting', count: tournaments.filter(t => t.status === 'recruiting').length },
              { key: 'completed', label: 'Completed', count: tournaments.filter(t => t.status === 'completed').length }
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

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTournaments.map((tournament) => (
            <Card 
              key={tournament.id} 
              className={`warzone-border bg-black/40 hover:bg-black/60 transition-all duration-300 group overflow-hidden ${
                tournament.featured ? 'border-yellow-400/50 ring-2 ring-yellow-400/20' : 'border-cyan-400/30 hover:border-cyan-400/60'
              }`}
            >
              {tournament.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 text-center font-bold text-sm">
                  <Star className="w-4 h-4 inline mr-2" />
                  FEATURED TOURNAMENT
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
                  {tournament.featured && (
                    <Crown className="w-6 h-6 text-yellow-400 ml-4" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Status and Type */}
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(tournament.status)} font-mono`}>
                    {getStatusIcon(tournament.status)}
                    <span className="ml-1 uppercase">{tournament.status}</span>
                  </Badge>
                  <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                    {tournament.type}
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
                    href={`/${locale}/tournaments/${tournament.id}`}
                    className="flex-1"
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold"
                      disabled={tournament.status === 'completed'}
                    >
                      {tournament.status === 'active' ? 'View Live' : 
                       tournament.status === 'recruiting' ? 'Join Tournament' : 
                       'View Results'}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                  >
                    <Trophy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
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
        )}

        {/* Call to Action */}
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
      </div>
    </div>
  )
}

