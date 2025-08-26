'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface LeaderboardEntry {
  rank: number
  teamName: string
  teamCode: string
  totalScore: number
  bestMatches: number
  adjustments: number
  finalScore: number
  matches: any[]
}

// Mock data for demonstration
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    teamName: 'Team Alpha',
    teamCode: 'ALPHA-001',
    totalScore: 330,
    bestMatches: 2,
    adjustments: 0,
    finalScore: 330,
    matches: []
  },
  {
    rank: 2,
    teamName: 'Team Beta',
    teamCode: 'BETA-002',
    totalScore: 260,
    bestMatches: 2,
    adjustments: 0,
    finalScore: 260,
    matches: []
  },
  {
    rank: 3,
    teamName: 'Team Gamma',
    teamCode: 'GAMMA-003',
    totalScore: 180,
    bestMatches: 2,
    adjustments: 0,
    finalScore: 180,
    matches: []
  },
  {
    rank: 4,
    teamName: 'Team Delta',
    teamCode: 'DELTA-004',
    totalScore: 150,
    bestMatches: 2,
    adjustments: -10,
    finalScore: 140,
    matches: []
  },
  {
    rank: 5,
    teamName: 'Team Echo',
    teamCode: 'ECHO-005',
    totalScore: 120,
    bestMatches: 2,
    adjustments: 0,
    finalScore: 120,
    matches: []
  }
]

export function Leaderboard() {
  const [isLive, setIsLive] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard)

  const getPositionClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'position-1'
      case 2:
        return 'position-2'
      case 3:
        return 'position-3'
      default:
        return 'position-other'
    }
  }

  const exportLeaderboard = () => {
    const csvContent = [
      'Rank,Team,Code,Total Score,Best Matches,Adjustments,Final Score',
      ...leaderboard.map(entry => 
        `${entry.rank},${entry.teamName},${entry.teamCode},${entry.totalScore},${entry.bestMatches},${entry.adjustments},${entry.finalScore}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leaderboard.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-leaderboard-bg border-leaderboard-border">
      <CardHeader className="bg-leaderboard-header border-b border-leaderboard-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-leaderboard-text">
            {isLive ? 'Live Leaderboard' : 'Final Leaderboard'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isLive ? 'default' : 'secondary'}>
              {isLive ? 'LIVE' : 'FINAL'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isLive ? 'Switch to Final' : 'Switch to Live'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportLeaderboard}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header */}
        <div className="leaderboard-grid bg-leaderboard-header text-leaderboard-text font-semibold">
          <div>Rank</div>
          <div>Team</div>
          <div>Kills</div>
          <div>Score</div>
          <div>Total</div>
        </div>

        {/* Entries */}
        {leaderboard.map((entry) => (
          <div
            key={entry.teamCode}
            className={`leaderboard-grid text-leaderboard-text ${getPositionClass(entry.rank)}`}
          >
            <div className="font-bold text-center">
              #{entry.rank}
            </div>
            <div>
              <div className="font-semibold">{entry.teamName}</div>
              <div className="text-sm opacity-75">{entry.teamCode}</div>
            </div>
            <div className="text-center">
              {entry.bestMatches}
            </div>
            <div className="text-center">
              {entry.totalScore}
            </div>
            <div className="text-center font-bold">
              {entry.finalScore}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
