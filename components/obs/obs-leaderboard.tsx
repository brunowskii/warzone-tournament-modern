'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Target, Users } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  teamName: string
  score: number
  kills: number
  position: number
  matches: number
}

interface OBSLeaderboardProps {
  tournamentId: string
  theme?: 'dark' | 'light' | 'transparent'
  maxEntries?: number
  refreshRate?: number
}

export function OBSLeaderboard({ 
  tournamentId, 
  theme = 'dark', 
  maxEntries = 10,
  refreshRate = 5000 
}: OBSLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard/${tournamentId}`)
        if (response.ok) {
          const data = await response.json()
          setLeaderboard(data.slice(0, maxEntries))
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchLeaderboard()

    // Set up interval for real-time updates
    const interval = setInterval(fetchLeaderboard, refreshRate)

    return () => clearInterval(interval)
  }, [tournamentId, maxEntries, refreshRate])

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white/90 text-black border-gray-300'
      case 'transparent':
        return 'bg-transparent text-white'
      default:
        return 'bg-black/80 text-white border-cyan-500/30'
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400 border-yellow-400'
      case 2:
        return 'text-gray-300 border-gray-300'
      case 3:
        return 'text-amber-600 border-amber-600'
      default:
        return 'text-cyan-400 border-cyan-400'
    }
  }

  if (isLoading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${getThemeClasses()}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-2"></div>
          <p className="text-sm font-orbitron uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 p-4 ${getThemeClasses()} backdrop-blur-sm`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 p-4 metallic-surface rounded-lg border-cyan-glow">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-cyan-500" />
            <h1 className="text-2xl font-black text-cyan-500 text-cyan-glow font-orbitron uppercase tracking-wider">
              WARZONE LEADERBOARD
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-cyan-300 font-orbitron uppercase tracking-wider">
              Last Update
            </p>
            <p className="text-xs text-cyan-400">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2">
          <AnimatePresence>
            {leaderboard.map((entry, index) => (
              <motion.div
                key={`${entry.teamName}-${entry.score}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  metallic-surface rounded-lg p-4 border-l-4 transition-all duration-300
                  ${getRankColor(entry.rank)}
                  ${entry.rank <= 3 ? 'glow-pulse' : ''}
                  hover:scale-105
                `}
              >
                <div className="flex items-center justify-between">
                  {/* Rank and Team */}
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                      ${entry.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' : ''}
                      ${entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-black' : ''}
                      ${entry.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : ''}
                      ${entry.rank > 3 ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-black' : ''}
                    `}>
                      {entry.rank}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-orbitron uppercase tracking-wider">
                        {entry.teamName}
                      </h3>
                      <p className="text-sm opacity-80">
                        {entry.matches} matches played
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span className="font-bold text-lg">{entry.kills}</span>
                      </div>
                      <p className="text-xs opacity-80">Kills</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span className="font-bold text-lg">{entry.position}</span>
                      </div>
                      <p className="text-xs opacity-80">Best Pos</p>
                    </div>

                    {/* Total Score */}
                    <div className="text-center min-w-[80px]">
                      <div className="font-black text-2xl xp-counter">
                        {entry.score.toLocaleString()}
                      </div>
                      <p className="text-xs opacity-80">Total Score</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-cyan-400 font-orbitron uppercase tracking-wider">
            Real-time updates • Warzone Tournament Portal
          </p>
        </div>
      </div>
    </div>
  )
}
