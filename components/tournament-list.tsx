'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Plus, Users, Calendar } from 'lucide-react'

const mockTournaments = [
  {
    id: '1',
    name: 'Demo Tournament 2024',
    status: 'ACTIVE',
    teams: 3,
    matches: 2,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Winter Championship',
    status: 'PENDING',
    teams: 0,
    matches: 0,
    createdAt: '2024-01-20'
  }
]

export function TournamentList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500'
      case 'PENDING':
        return 'bg-yellow-500'
      case 'COMPLETED':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Tournaments</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      <div className="grid gap-4">
        {mockTournaments.map((tournament) => (
          <Card key={tournament.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tournament.name}</CardTitle>
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {tournament.teams} teams
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {tournament.matches} matches
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
