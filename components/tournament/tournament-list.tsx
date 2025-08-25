<<<<<<< HEAD
'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Calendar, Users, Eye, ArrowRight, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface Tournament {
  id: string
  name: string
  code: string
  mode: string
  format: string
  status: string
  startDate: string
  startTime: string
  totalTeams: number
  _count: {
    teams: number
  }
}

export function TournamentList() {
  const t = useTranslations()
  const router = useRouter()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments/public')
      if (response.ok) {
        const data = await response.json()
        setTournaments(data)
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold'
      case 'ACTIVE':
        return 'bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold animate-pulse'
      case 'COMPLETED':
        return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold'
      case 'ARCHIVED':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Calendar className="h-4 w-4" />
      case 'ACTIVE':
        return <Zap className="h-4 w-4" />
      case 'COMPLETED':
        return <Trophy className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString()
  }

  const upcomingTournaments = tournaments.filter(t => t.status === 'PENDING')
  const liveTournaments = tournaments.filter(t => t.status === 'ACTIVE')
  const completedTournaments = tournaments.filter(t => t.status === 'COMPLETED')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-400 font-orbitron uppercase tracking-wider">Loading tournaments...</p>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 metallic-surface border-cyan-glow">
        <TabsTrigger 
          value="upcoming"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-green-500 data-[state=active]:text-black font-orbitron uppercase tracking-wider"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Upcoming ({upcomingTournaments.length})
        </TabsTrigger>
        <TabsTrigger 
          value="live"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-500 data-[state=active]:text-black font-orbitron uppercase tracking-wider"
        >
          <Zap className="h-4 w-4 mr-2" />
          Live ({liveTournaments.length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-orbitron uppercase tracking-wider"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Completed ({completedTournaments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingTournaments.length === 0 ? (
          <Card className="metallic-surface border-cyan-glow">
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-cyan-500 mb-4" />
              <p className="text-cyan-300 font-orbitron uppercase tracking-wider">No upcoming tournaments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="tilt-3d"
              >
                <Card className="card-warzone h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-cyan-400 font-orbitron uppercase tracking-wider">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(tournament.status)} flex items-center gap-1`}>
                        {getStatusIcon(tournament.status)}
                        {tournament.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 metallic-surface rounded-lg border-cyan-glow">
                        <div className="font-bold text-cyan-400 font-orbitron uppercase">{tournament.mode}</div>
                        <div className="text-cyan-300 text-xs">Game Mode</div>
                      </div>
                      <div className="text-center p-3 metallic-surface rounded-lg border-green-glow">
                        <div className="font-bold text-green-400 font-orbitron uppercase">{tournament.format}</div>
                        <div className="text-green-300 text-xs">Format</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-cyan-300 p-2 metallic-surface rounded-lg">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      {formatDate(tournament.startDate)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-cyan-300 p-2 metallic-surface rounded-lg">
                      <Users className="h-4 w-4 text-cyan-400" />
                      {tournament._count.teams}/{tournament.totalTeams} teams
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}`)}
                        className="flex-1 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-orbitron uppercase tracking-wider"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}/register`)}
                        className="flex-1 btn-warzone"
                      >
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="live" className="space-y-4">
        {liveTournaments.length === 0 ? (
          <Card className="metallic-surface border-cyan-glow">
            <CardContent className="text-center py-12">
              <Zap className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <p className="text-green-300 font-orbitron uppercase tracking-wider">No live tournaments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="tilt-3d"
              >
                <Card className="card-warzone h-full border-green-glow glow-pulse">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-green-400 font-orbitron uppercase tracking-wider">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(tournament.status)} flex items-center gap-1`}>
                        {getStatusIcon(tournament.status)}
                        {tournament.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 metallic-surface rounded-lg border-cyan-glow">
                        <div className="font-bold text-cyan-400 font-orbitron uppercase">{tournament.mode}</div>
                        <div className="text-cyan-300 text-xs">Game Mode</div>
                      </div>
                      <div className="text-center p-3 metallic-surface rounded-lg border-green-glow">
                        <div className="font-bold text-green-400 font-orbitron uppercase">{tournament.format}</div>
                        <div className="text-green-300 text-xs">Format</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-green-300 p-2 metallic-surface rounded-lg">
                      <Users className="h-4 w-4 text-green-400" />
                      {tournament._count.teams}/{tournament.totalTeams} teams
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}`)}
                        className="flex-1 border-green-500 text-green-400 hover:bg-green-500/10 font-orbitron uppercase tracking-wider"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}/leaderboard`)}
                        className="flex-1 btn-warzone"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Leaderboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {completedTournaments.length === 0 ? (
          <Card className="metallic-surface border-cyan-glow">
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-blue-500 mb-4" />
              <p className="text-blue-300 font-orbitron uppercase tracking-wider">No completed tournaments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="tilt-3d"
              >
                <Card className="card-warzone h-full border-blue-glow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-blue-400 font-orbitron uppercase tracking-wider">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(tournament.status)} flex items-center gap-1`}>
                        {getStatusIcon(tournament.status)}
                        {tournament.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 metallic-surface rounded-lg border-cyan-glow">
                        <div className="font-bold text-cyan-400 font-orbitron uppercase">{tournament.mode}</div>
                        <div className="text-cyan-300 text-xs">Game Mode</div>
                      </div>
                      <div className="text-center p-3 metallic-surface rounded-lg border-green-glow">
                        <div className="font-bold text-green-400 font-orbitron uppercase">{tournament.format}</div>
                        <div className="text-green-300 text-xs">Format</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-blue-300 p-2 metallic-surface rounded-lg">
                      <Users className="h-4 w-4 text-blue-400" />
                      {tournament._count.teams}/{tournament.totalTeams} teams
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/tournaments/${tournament.code}/results`)}
                      className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 font-orbitron uppercase tracking-wider"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
=======
'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Calendar, Users, Eye, ArrowRight, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface Tournament {
  id: string
  name: string
  code: string
  mode: string
  format: string
  status: string
  startDate: string
  startTime: string
  totalTeams: number
  _count: {
    teams: number
  }
}

export function TournamentList() {
  const t = useTranslations()
  const router = useRouter()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments/public')
      if (response.ok) {
        const data = await response.json()
        setTournaments(data)
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold'
      case 'ACTIVE':
        return 'bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold animate-pulse'
      case 'COMPLETED':
        return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold'
      case 'ARCHIVED':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Calendar className="h-4 w-4" />
      case 'ACTIVE':
        return <Zap className="h-4 w-4" />
      case 'COMPLETED':
        return <Trophy className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString()
  }

  const upcomingTournaments = tournaments.filter(t => t.status === 'PENDING')
  const liveTournaments = tournaments.filter(t => t.status === 'ACTIVE')
  const completedTournaments = tournaments.filter(t => t.status === 'COMPLETED')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-400 font-orbitron uppercase tracking-wider">Loading tournaments...</p>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 metallic-surface border-cyan-glow">
        <TabsTrigger 
          value="upcoming"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-green-500 data-[state=active]:text-black font-orbitron uppercase tracking-wider"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Upcoming ({upcomingTournaments.length})
        </TabsTrigger>
        <TabsTrigger 
          value="live"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-cyan-500 data-[state=active]:text-black font-orbitron uppercase tracking-wider"
        >
          <Zap className="h-4 w-4 mr-2" />
          Live ({liveTournaments.length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-orbitron uppercase tracking-wider"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Completed ({completedTournaments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingTournaments.length === 0 ? (
          <Card className="metallic-surface border-cyan-glow">
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-cyan-500 mb-4" />
              <p className="text-cyan-300 font-orbitron uppercase tracking-wider">No upcoming tournaments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="tilt-3d"
              >
                <Card className="card-warzone h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-cyan-400 font-orbitron uppercase tracking-wider">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(tournament.status)} flex items-center gap-1`}>
                        {getStatusIcon(tournament.status)}
                        {tournament.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 metallic-surface rounded-lg border-cyan-glow">
                        <div className="font-bold text-cyan-400 font-orbitron uppercase">{tournament.mode}</div>
                        <div className="text-cyan-300 text-xs">Game Mode</div>
                      </div>
                      <div className="text-center p-3 metallic-surface rounded-lg border-green-glow">
                        <div className="font-bold text-green-400 font-orbitron uppercase">{tournament.format}</div>
                        <div className="text-green-300 text-xs">Format</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-cyan-300 p-2 metallic-surface rounded-lg">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      {formatDate(tournament.startDate)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-cyan-300 p-2 metallic-surface rounded-lg">
                      <Users className="h-4 w-4 text-cyan-400" />
                      {tournament._count.teams}/{tournament.totalTeams} teams
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}`)}
                        className="flex-1 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-orbitron uppercase tracking-wider"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}/register`)}
                        className="flex-1 btn-warzone"
                      >
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="live" className="space-y-4">
        {liveTournaments.length === 0 ? (
          <Card className="metallic-surface border-cyan-glow">
            <CardContent className="text-center py-12">
              <Zap className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <p className="text-green-300 font-orbitron uppercase tracking-wider">No live tournaments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="tilt-3d"
              >
                <Card className="card-warzone h-full border-green-glow glow-pulse">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-green-400 font-orbitron uppercase tracking-wider">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(tournament.status)} flex items-center gap-1`}>
                        {getStatusIcon(tournament.status)}
                        {tournament.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 metallic-surface rounded-lg border-cyan-glow">
                        <div className="font-bold text-cyan-400 font-orbitron uppercase">{tournament.mode}</div>
                        <div className="text-cyan-300 text-xs">Game Mode</div>
                      </div>
                      <div className="text-center p-3 metallic-surface rounded-lg border-green-glow">
                        <div className="font-bold text-green-400 font-orbitron uppercase">{tournament.format}</div>
                        <div className="text-green-300 text-xs">Format</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-green-300 p-2 metallic-surface rounded-lg">
                      <Users className="h-4 w-4 text-green-400" />
                      {tournament._count.teams}/{tournament.totalTeams} teams
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}`)}
                        className="flex-1 border-green-500 text-green-400 hover:bg-green-500/10 font-orbitron uppercase tracking-wider"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/tournaments/${tournament.code}/leaderboard`)}
                        className="flex-1 btn-warzone"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Leaderboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {completedTournaments.length === 0 ? (
          <Card className="metallic-surface border-cyan-glow">
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-blue-500 mb-4" />
              <p className="text-blue-300 font-orbitron uppercase tracking-wider">No completed tournaments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="tilt-3d"
              >
                <Card className="card-warzone h-full border-blue-glow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-blue-400 font-orbitron uppercase tracking-wider">
                        {tournament.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(tournament.status)} flex items-center gap-1`}>
                        {getStatusIcon(tournament.status)}
                        {tournament.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 metallic-surface rounded-lg border-cyan-glow">
                        <div className="font-bold text-cyan-400 font-orbitron uppercase">{tournament.mode}</div>
                        <div className="text-cyan-300 text-xs">Game Mode</div>
                      </div>
                      <div className="text-center p-3 metallic-surface rounded-lg border-green-glow">
                        <div className="font-bold text-green-400 font-orbitron uppercase">{tournament.format}</div>
                        <div className="text-green-300 text-xs">Format</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-blue-300 p-2 metallic-surface rounded-lg">
                      <Users className="h-4 w-4 text-blue-400" />
                      {tournament._count.teams}/{tournament.totalTeams} teams
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/tournaments/${tournament.code}/results`)}
                      className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 font-orbitron uppercase tracking-wider"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
