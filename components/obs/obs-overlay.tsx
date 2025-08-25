'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Copy, QrCode, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPositionColor, getPositionBackground } from '@/lib/scoring'
import { formatPoints } from '@/lib/utils'

interface OBSOverlayProps {
  tournamentId: string
  type?: 'minimal' | 'compact' | 'leaderboard' | 'full'
  theme?: 'dark' | 'light' | 'transparent'
  refreshRate?: number
  showLogos?: boolean
  showStats?: boolean
}

interface LeaderboardEntry {
  rank: number
  teamName: string
  teamCode: string
  totalScore: number
  totalKills: number
  matchesCount: number
  adjustmentTotal: number
  finalScore: number
}

export function OBSOverlay({
  tournamentId,
  type = 'leaderboard',
  theme = 'dark',
  refreshRate = 5000,
  showLogos = true,
  showStats = true
}: OBSOverlayProps) {
  const t = useTranslations()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [overlayType, setOverlayType] = useState(type)
  const [overlayTheme, setOverlayTheme] = useState(theme)
  const [refreshRateValue, setRefreshRateValue] = useState(refreshRate)
  const [showLogosValue, setShowLogosValue] = useState(showLogos)
  const [showStatsValue, setShowStatsValue] = useState(showStats)
  const [overlayUrl, setOverlayUrl] = useState('')

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, refreshRateValue)
    return () => clearInterval(interval)
  }, [refreshRateValue])

  useEffect(() => {
    const baseUrl = window.location.origin
    const url = `${baseUrl}/stream?tournament=${tournamentId}&overlay=${overlayType}&theme=${overlayTheme}&logos=${showLogosValue}&stats=${showStatsValue}&refresh=${refreshRateValue}`
    setOverlayUrl(url)
  }, [tournamentId, overlayType, overlayTheme, showLogosValue, showStatsValue, refreshRateValue])

  const copyUrl = () => {
    navigator.clipboard.writeText(overlayUrl)
  }

  const getThemeClasses = () => {
    switch (overlayTheme) {
      case 'light':
        return 'bg-white text-black border-gray-200'
      case 'transparent':
        return 'bg-transparent text-white'
      default:
        return 'bg-leaderboard-bg text-leaderboard-text border-leaderboard-border'
    }
  }

  const getOverlaySize = () => {
    switch (overlayType) {
      case 'minimal':
        return 'w-[200px] h-[100px]'
      case 'compact':
        return 'w-[350px] h-[400px]'
      case 'full':
        return 'w-[600px] h-[500px]'
      default:
        return 'w-[500px] h-[600px]'
    }
  }

  const renderMinimalOverlay = () => (
    <div className={`${getThemeClasses()} ${getOverlaySize()} p-2 rounded`}>
      <div className="text-center">
        <div className="text-xs font-bold mb-1">TOP 3</div>
        {leaderboard.slice(0, 3).map((entry, index) => (
          <div key={entry.teamCode} className="text-xs flex justify-between">
            <span className={getPositionColor(entry.rank)}>#{entry.rank}</span>
            <span>{entry.teamName}</span>
            <span>{formatPoints(entry.finalScore)}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCompactOverlay = () => (
    <div className={`${getThemeClasses()} ${getOverlaySize()} p-4 rounded`}>
      <div className="text-center mb-3">
        <h3 className="font-bold text-lg">LEADERBOARD</h3>
      </div>
      <div className="space-y-2">
        {leaderboard.slice(0, 8).map((entry) => (
          <div key={entry.teamCode} className={`flex justify-between items-center p-2 rounded ${getPositionBackground(entry.rank)}`}>
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${getPositionColor(entry.rank)}`}>#{entry.rank}</span>
              <span className="font-medium">{entry.teamName}</span>
            </div>
            <div className="text-right">
              <div className="font-bold">{formatPoints(entry.finalScore)}</div>
              {showStatsValue && (
                <div className="text-xs opacity-75">{entry.totalKills} kills</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLeaderboardOverlay = () => (
    <div className={`${getThemeClasses()} ${getOverlaySize()} p-4 rounded`}>
      <div className="text-center mb-4">
        <h3 className="font-bold text-xl">TOURNAMENT LEADERBOARD</h3>
        {showStatsValue && (
          <div className="text-sm opacity-75">Live Updates</div>
        )}
      </div>
      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div key={entry.teamCode} className={`flex justify-between items-center p-3 rounded ${getPositionBackground(entry.rank)}`}>
            <div className="flex items-center space-x-3">
              <span className={`font-bold text-lg ${getPositionColor(entry.rank)}`}>#{entry.rank}</span>
              <div>
                <div className="font-semibold">{entry.teamName}</div>
                <div className="text-sm opacity-75">{entry.teamCode}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatPoints(entry.finalScore)}</div>
              {showStatsValue && (
                <div className="text-sm opacity-75">
                  {entry.totalKills} kills • {entry.matchesCount} matches
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderFullOverlay = () => (
    <div className={`${getThemeClasses()} ${getOverlaySize()} p-6 rounded`}>
      <div className="text-center mb-6">
        <h2 className="font-bold text-2xl">WARZONE TOURNAMENT</h2>
        <h3 className="text-lg opacity-75">Live Leaderboard</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold mb-3">TOP 10</h4>
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((entry) => (
              <div key={entry.teamCode} className={`flex justify-between items-center p-2 rounded ${getPositionBackground(entry.rank)}`}>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${getPositionColor(entry.rank)}`}>#{entry.rank}</span>
                  <span className="font-medium">{entry.teamName}</span>
                </div>
                <span className="font-bold">{formatPoints(entry.finalScore)}</span>
              </div>
            ))}
          </div>
        </div>
        {showStatsValue && (
          <div>
            <h4 className="font-bold mb-3">STATISTICS</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Teams:</span>
                <span>{leaderboard.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Kills:</span>
                <span>{leaderboard.reduce((sum, entry) => sum + entry.totalKills, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Matches:</span>
                <span>{leaderboard.reduce((sum, entry) => sum + entry.matchesCount, 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderOverlay = () => {
    switch (overlayType) {
      case 'minimal':
        return renderMinimalOverlay()
      case 'compact':
        return renderCompactOverlay()
      case 'full':
        return renderFullOverlay()
      default:
        return renderLeaderboardOverlay()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="h-5 w-5 mr-2" />
            {t('obs.overlay')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('obs.overlay')}</Label>
              <Select value={overlayType} onValueChange={setOverlayType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">{t('obs.minimal')}</SelectItem>
                  <SelectItem value="compact">{t('obs.compact')}</SelectItem>
                  <SelectItem value="leaderboard">{t('obs.leaderboard')}</SelectItem>
                  <SelectItem value="full">{t('obs.full')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('obs.theme')}</Label>
              <Select value={overlayTheme} onValueChange={setOverlayTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{t('obs.dark')}</SelectItem>
                  <SelectItem value="light">{t('obs.light')}</SelectItem>
                  <SelectItem value="transparent">{t('obs.transparent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>{t('obs.refreshRate')} (ms)</Label>
              <Input
                type="number"
                value={refreshRateValue}
                onChange={(e) => setRefreshRateValue(Number(e.target.value))}
                min="1000"
                max="30000"
                step="1000"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showLogos"
                checked={showLogosValue}
                onCheckedChange={setShowLogosValue}
              />
              <Label htmlFor="showLogos">{t('obs.showLogos')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showStats"
                checked={showStatsValue}
                onCheckedChange={setShowStatsValue}
              />
              <Label htmlFor="showStats">{t('obs.showStats')}</Label>
            </div>
          </div>

          <div>
            <Label>{t('obs.url')}</Label>
            <div className="flex space-x-2">
              <Input value={overlayUrl} readOnly />
              <Button variant="outline" size="sm" onClick={copyUrl}>
                <Copy className="h-4 w-4 mr-2" />
                {t('obs.copyUrl')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {renderOverlay()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
