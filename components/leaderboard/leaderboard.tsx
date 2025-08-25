<<<<<<< HEAD
'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPositionColor, getPositionBackground } from '@/lib/scoring'
import { formatPoints } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  teamName: string
  teamCode: string
  totalScore: number
  totalKills: number
  matchesCount: number
  adjustmentTotal: number
  finalScore: number
  matches: any[]
}

export function Leaderboard() {
  const t = useTranslations()
  const [isLive, setIsLive] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(fetchLeaderboard, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isLive])

  const exportLeaderboard = async (format: 'csv' | 'png' = 'csv') => {
    try {
      const response = await fetch(`/api/leaderboard/export?format=${format}`)
      if (response.ok) {
        if (format === 'csv') {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `leaderboard-${new Date().toISOString().split('T')[0]}.csv`
          a.click()
          window.URL.revokeObjectURL(url)
        } else {
          // For PNG, we'll use a simple text representation
          const text = await response.text()
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (ctx) {
            canvas.width = 800
            canvas.height = 600
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#ffffff'
            ctx.font = '16px Arial'
            const lines = text.split('\n')
            lines.forEach((line, index) => {
              ctx.fillText(line, 20, 30 + index * 20)
            })
            const url = canvas.toDataURL()
            const a = document.createElement('a')
            a.href = url
            a.download = `leaderboard-${new Date().toISOString().split('T')[0]}.png`
            a.click()
          }
        }
      }
    } catch (error) {
      console.error('Error exporting leaderboard:', error)
    }
  }

  if (loading) {
    return (
      <Card className="bg-leaderboard-bg border-leaderboard-border">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-leaderboard-text"></div>
            <span className="ml-2 text-leaderboard-text">{t('common.loading')}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-leaderboard-bg border-leaderboard-border">
      <CardHeader className="bg-leaderboard-header border-b border-leaderboard-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-leaderboard-text">
            {isLive ? t('scoring.leaderboard') + ' (LIVE)' : t('scoring.leaderboard') + ' (FINAL)'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isLive ? 'default' : 'secondary'} className="animate-pulse">
              {isLive ? 'LIVE' : 'FINAL'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isLive ? t('common.switch') : t('common.refresh')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDetails ? t('common.hide') : t('common.view')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLeaderboard('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLeaderboard('png')}
            >
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header */}
        <div className="leaderboard-grid bg-leaderboard-header text-leaderboard-text font-semibold">
          <div>{t('scoring.rank')}</div>
          <div>{t('team.name')}</div>
          <div>{t('scoring.kills')}</div>
          <div>{t('scoring.total')}</div>
          <div>{t('scoring.finalScore')}</div>
          {showDetails && (
            <>
              <div>{t('scoring.adjustments')}</div>
              <div>{t('match.status')}</div>
            </>
          )}
        </div>

        {/* Entries */}
        {leaderboard.map((entry) => (
          <div
            key={entry.teamCode}
            className={`leaderboard-grid text-leaderboard-text ${getPositionBackground(entry.rank)} hover:bg-opacity-80 transition-all duration-200`}
          >
            <div className={`font-bold text-center ${getPositionColor(entry.rank)}`}>
              #{entry.rank}
            </div>
            <div>
              <div className="font-semibold">{entry.teamName}</div>
              <div className="text-sm opacity-75">{entry.teamCode}</div>
            </div>
            <div className="text-center">
              {entry.totalKills}
            </div>
            <div className="text-center">
              {formatPoints(entry.totalScore)}
            </div>
            <div className="text-center font-bold">
              {formatPoints(entry.finalScore)}
            </div>
            {showDetails && (
              <>
                <div className="text-center">
                  <span className={entry.adjustmentTotal >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {entry.adjustmentTotal >= 0 ? '+' : ''}{formatPoints(entry.adjustmentTotal)}
                  </span>
                </div>
                <div className="text-center text-sm">
                  {entry.matchesCount} {t('match.status')}
                </div>
              </>
            )}
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="p-8 text-center text-leaderboard-text opacity-75">
            {t('common.noData')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
=======
'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPositionColor, getPositionBackground } from '@/lib/scoring'
import { formatPoints } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  teamName: string
  teamCode: string
  totalScore: number
  totalKills: number
  matchesCount: number
  adjustmentTotal: number
  finalScore: number
  matches: any[]
}

export function Leaderboard() {
  const t = useTranslations()
  const [isLive, setIsLive] = useState(true)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(fetchLeaderboard, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isLive])

  const exportLeaderboard = async (format: 'csv' | 'png' = 'csv') => {
    try {
      const response = await fetch(`/api/leaderboard/export?format=${format}`)
      if (response.ok) {
        if (format === 'csv') {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `leaderboard-${new Date().toISOString().split('T')[0]}.csv`
          a.click()
          window.URL.revokeObjectURL(url)
        } else {
          // For PNG, we'll use a simple text representation
          const text = await response.text()
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (ctx) {
            canvas.width = 800
            canvas.height = 600
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#ffffff'
            ctx.font = '16px Arial'
            const lines = text.split('\n')
            lines.forEach((line, index) => {
              ctx.fillText(line, 20, 30 + index * 20)
            })
            const url = canvas.toDataURL()
            const a = document.createElement('a')
            a.href = url
            a.download = `leaderboard-${new Date().toISOString().split('T')[0]}.png`
            a.click()
          }
        }
      }
    } catch (error) {
      console.error('Error exporting leaderboard:', error)
    }
  }

  if (loading) {
    return (
      <Card className="bg-leaderboard-bg border-leaderboard-border">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-leaderboard-text"></div>
            <span className="ml-2 text-leaderboard-text">{t('common.loading')}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-leaderboard-bg border-leaderboard-border">
      <CardHeader className="bg-leaderboard-header border-b border-leaderboard-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-leaderboard-text">
            {isLive ? t('scoring.leaderboard') + ' (LIVE)' : t('scoring.leaderboard') + ' (FINAL)'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isLive ? 'default' : 'secondary'} className="animate-pulse">
              {isLive ? 'LIVE' : 'FINAL'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isLive ? t('common.switch') : t('common.refresh')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDetails ? t('common.hide') : t('common.view')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLeaderboard('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLeaderboard('png')}
            >
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header */}
        <div className="leaderboard-grid bg-leaderboard-header text-leaderboard-text font-semibold">
          <div>{t('scoring.rank')}</div>
          <div>{t('team.name')}</div>
          <div>{t('scoring.kills')}</div>
          <div>{t('scoring.total')}</div>
          <div>{t('scoring.finalScore')}</div>
          {showDetails && (
            <>
              <div>{t('scoring.adjustments')}</div>
              <div>{t('match.status')}</div>
            </>
          )}
        </div>

        {/* Entries */}
        {leaderboard.map((entry) => (
          <div
            key={entry.teamCode}
            className={`leaderboard-grid text-leaderboard-text ${getPositionBackground(entry.rank)} hover:bg-opacity-80 transition-all duration-200`}
          >
            <div className={`font-bold text-center ${getPositionColor(entry.rank)}`}>
              #{entry.rank}
            </div>
            <div>
              <div className="font-semibold">{entry.teamName}</div>
              <div className="text-sm opacity-75">{entry.teamCode}</div>
            </div>
            <div className="text-center">
              {entry.totalKills}
            </div>
            <div className="text-center">
              {formatPoints(entry.totalScore)}
            </div>
            <div className="text-center font-bold">
              {formatPoints(entry.finalScore)}
            </div>
            {showDetails && (
              <>
                <div className="text-center">
                  <span className={entry.adjustmentTotal >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {entry.adjustmentTotal >= 0 ? '+' : ''}{formatPoints(entry.adjustmentTotal)}
                  </span>
                </div>
                <div className="text-center text-sm">
                  {entry.matchesCount} {t('match.status')}
                </div>
              </>
            )}
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="p-8 text-center text-leaderboard-text opacity-75">
            {t('common.noData')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
