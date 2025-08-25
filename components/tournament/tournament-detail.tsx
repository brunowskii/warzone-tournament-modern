'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Calendar, Users, Eye, ArrowRight, UserPlus, Target } from 'lucide-react'

interface TournamentDetailProps {
  tournamentCode: string
}

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
  teamSize: number
  topFraggerEnabled: boolean
  _count: {
    teams: number
  }
}

export function TournamentDetail({ tournamentCode }: TournamentDetailProps) {
  const t = useTranslations()
  const router = useRouter()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTournament()
  }, [tournamentCode])

  const fetchTournament = async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentCode}/availability`)
      if (response.ok) {
        const data = await response.json()
        setTournament(data.tournament)
      } else {
        throw new Error('Failed to fetch tournament')
      }
    } catch (error) {
      console.error('Error fetching tournament:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return <div>Loading tournament...</div>
  }

  if (!tournament) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Tournament not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{tournament.name}</CardTitle>
              <p className="text-muted-foreground">Tournament Code: {tournament.code}</p>
            </div>
            <Badge className={getStatusColor(tournament.status)}>
              {tournament.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.mode}</div>
              <div className="text-sm text-muted-foreground">Game Mode</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.format}</div>
              <div className="text-sm text-muted-foreground">Format</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.teamSize}</div>
              <div className="text-sm text-muted-foreground">Team Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament._count.teams}/{tournament.totalTeams}</div>
              <div className="text-sm text-muted-foreground">Teams</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{tournament.mode}</Badge>
            <Badge variant="secondary">{tournament.format}</Badge>
            <Badge variant={tournament.topFraggerEnabled ? 'default' : 'outline'}>
              {tournament.topFraggerEnabled ? 'Top Fragger Enabled' : 'Top Fragger Disabled'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Details */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Tournament Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{formatDate(tournament.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Time:</span>
                  <span className="font-medium">{tournament.startTime || 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Tournament Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Game Mode:</span>
                  <span className="font-medium">{tournament.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{tournament.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Size:</span>
                  <span className="font-medium">{tournament.teamSize} player(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Teams:</span>
                  <span className="font-medium">{tournament.totalTeams}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {tournament.status === 'PENDING' && (
                  <Button
                    onClick={() => router.push(`/tournaments/${tournament.code}/register`)}
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Team
                  </Button>
                )}
                
                {(tournament.status === 'ACTIVE' || tournament.status === 'COMPLETED') && (
                  <Button
                    onClick={() => router.push(`/tournaments/${tournament.code}/leaderboard`)}
                    className="flex-1"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    View Leaderboard
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => router.push(`/obs/leaderboard?tid=${tournament.id}`)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  OBS Overlay
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {tournament.status === 'PENDING' 
                    ? 'Leaderboard will be available once the tournament starts'
                    : 'View the full leaderboard'
                  }
                </p>
                {(tournament.status === 'ACTIVE' || tournament.status === 'COMPLETED') && (
                  <Button
                    onClick={() => router.push(`/tournaments/${tournament.code}/leaderboard`)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View Leaderboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {tournament.status === 'PENDING' 
                    ? 'Teams will be visible once registration closes'
                    : 'View all registered teams'
                  }
                </p>
                {(tournament.status === 'ACTIVE' || tournament.status === 'COMPLETED') && (
                  <Button
                    onClick={() => router.push(`/tournaments/${tournament.code}/teams`)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View Teams
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
