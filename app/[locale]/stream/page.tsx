<<<<<<< HEAD
'use client'

import { useEffect, useState } from 'react'
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
}

interface StreamPageProps {
  searchParams: {
    tournament?: string
    overlay?: string
    theme?: string
    logos?: string
    stats?: string
    refresh?: string
  }
}

export default function StreamPage({ searchParams }: StreamPageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  
  const {
    tournament,
    overlay = 'leaderboard',
    theme = 'dark',
    logos = 'true',
    stats = 'true',
    refresh = '5000'
  } = searchParams

  const showLogos = logos === 'true'
  const showStats = stats === 'true'
  const refreshRate = parseInt(refresh) || 5000

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
    const interval = setInterval(fetchLeaderboard, refreshRate)
    return () => clearInterval(interval)
  }, [refreshRate])

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-black'
      case 'transparent':
        return 'bg-transparent text-white'
      default:
        return 'bg-leaderboard-bg text-leaderboard-text'
    }
  }

  const getOverlaySize = () => {
    switch (overlay) {
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
        {leaderboard.slice(0, 3).map((entry) => (
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
              {showStats && (
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
        {showStats && (
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
              {showStats && (
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
        {showStats && (
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
    switch (overlay) {
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
    <div className="min-h-screen flex items-center justify-center p-4">
      {renderOverlay()}
    </div>
  )
}
=======
'use client'

import { useEffect, useState } from 'react'
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
}

interface StreamPageProps {
  searchParams: {
    tournament?: string
    overlay?: string
    theme?: string
    logos?: string
    stats?: string
    refresh?: string
  }
}

export default function StreamPage({ searchParams }: StreamPageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  
  const {
    tournament,
    overlay = 'leaderboard',
    theme = 'dark',
    logos = 'true',
    stats = 'true',
    refresh = '5000'
  } = searchParams

  const showLogos = logos === 'true'
  const showStats = stats === 'true'
  const refreshRate = parseInt(refresh) || 5000

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
    const interval = setInterval(fetchLeaderboard, refreshRate)
    return () => clearInterval(interval)
  }, [refreshRate])

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-black'
      case 'transparent':
        return 'bg-transparent text-white'
      default:
        return 'bg-leaderboard-bg text-leaderboard-text'
    }
  }

  const getOverlaySize = () => {
    switch (overlay) {
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
        {leaderboard.slice(0, 3).map((entry) => (
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
              {showStats && (
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
        {showStats && (
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
              {showStats && (
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
        {showStats && (
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
    switch (overlay) {
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
    <div className="min-h-screen flex items-center justify-center p-4">
      {renderOverlay()}
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
