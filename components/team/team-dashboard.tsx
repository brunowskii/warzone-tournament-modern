'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, Target, Users, Image as ImageIcon, LogOut, Zap, Clock, CheckCircle, XCircle, AlertTriangle, Award, Menu, X, Upload, Flag } from 'lucide-react'
import GlassPanel from '@/components/ui/glass-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateScore, DEFAULT_MULTIPLIERS } from '@/lib/score-calculation'

interface TeamDashboardProps {
  teamCode: string
  tournamentId: string
  onLogout: () => void
}

interface Match {
  id: string
  position: number
  kills: number
  score: number
  photos: string[]
  status: 'approved' | 'pending' | 'rejected'
  submittedAt: number
}

interface PendingSubmission {
  id: string
  teamCode: string
  teamName: string
  position: number
  kills: number
  photos: string[]
  submittedAt: number
}

export default function TeamDashboard({ teamCode, tournamentId, onLogout }: TeamDashboardProps) {
  const [activeTab, setActiveTab] = useState<'matches' | 'crash' | 'report'>('matches')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  
  // Mock data - in real app this would come from your state management
  const [matches, setMatches] = useState<Match[]>([])
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([])
  const [scoreAdjustments, setScoreAdjustments] = useState<any[]>([])
  
  const [position, setPosition] = useState(1)
  const [kills, setKills] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clanName, setClanName] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false)

  // Tournament settings
  const maxMatches = 4
  const countedMatches = 3
  const tournamentName = "Warzone Championship 2024"
  const teamName = `Team ${teamCode.substring(0, 3)}`

  const totalSubmissions = matches.length + pendingSubmissions.length
  const canAddMatch = totalSubmissions < maxMatches

  const addMatch = async () => {
    if (!canAddMatch || kills < 0 || position < 1 || photos.length < 2) return

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const score = calculateScore({
        kills,
        position,
        multipliers: DEFAULT_MULTIPLIERS,
        isManual: false
      })

      const newSubmission: PendingSubmission = {
        id: `${teamCode}-${Date.now()}`,
        teamCode,
        teamName,
        position,
        kills,
        photos: [...photos],
        submittedAt: Date.now()
      }

      setPendingSubmissions(prev => [...prev, newSubmission])
      setKills(0)
      setPosition(1)
      setPhotos([])
    } catch (error) {
      console.error('Error submitting match:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBestScores = () => {
    return matches
      .map(match => match.score)
      .sort((a, b) => b - a)
      .slice(0, countedMatches)
  }

  const getTotalScore = () => {
    const bestScores = getBestScores()
    return bestScores.reduce((sum, score) => sum + score, 0)
  }

  const getAdjustmentTotal = () => {
    return scoreAdjustments.reduce((sum, adj) => sum + adj.points, 0)
  }

  const getFinalScore = () => {
    return getTotalScore() + getAdjustmentTotal()
  }

  const getSubmissionStatus = (index: number) => {
    if (index < matches.length) {
      return { status: 'approved', match: matches[index] }
    } else if (index < totalSubmissions) {
      const pendingIndex = index - matches.length
      return { status: 'pending', submission: pendingSubmissions[pendingIndex] }
    }
    return { status: 'empty' }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Mock photo upload component
  const PhotoUpload = ({ photos, onPhotosChange, maxPhotos, required }: any) => (
    <div className="space-y-2">
      <label className="block text-cyan-400 mb-2 font-orbitron text-sm">
        Screenshots Required ({photos.length}/{maxPhotos})
      </label>
      <div className="border-2 border-dashed border-cyan-400/30 rounded-lg p-4 text-center">
        <Upload className="w-8 h-8 mx-auto mb-2 text-cyan-400/60" />
        <p className="text-cyan-400/60 text-sm">
          {photos.length === 0 ? 'Click to upload match screenshots' : `${photos.length} files uploaded`}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 border-cyan-400/30 text-cyan-400"
          onClick={() => {
            // Mock file upload
            if (photos.length < maxPhotos) {
              onPhotosChange([...photos, `screenshot-${Date.now()}.png`])
            }
          }}
        >
          {photos.length === 0 ? 'Upload Screenshots' : 'Add More'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-2 sm:p-4 relative z-10 warzone-bg-pattern">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <GlassPanel className="p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-green-400/20 relative">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping" />
              </div>
              <div>
                <div className="text-cyan-400/80 font-orbitron text-xs sm:text-sm">
                  {tournamentName}
                </div>
                <h1 className="text-lg sm:text-3xl font-bold text-white font-orbitron tracking-wider warzone-text-glow">
                  {teamName.toUpperCase()}
                </h1>
                <p className="text-cyan-400/80 font-rajdhani text-xs sm:text-base">
                  Team ID: <span className="text-cyan-400 font-bold">{teamCode.substring(0, 3)}***</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">LOGOUT</span>
              </Button>
            </div>
          </div>
        </GlassPanel>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <GlassPanel className="sm:hidden p-4 mb-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => {
                  setActiveTab('matches')
                  setMobileMenuOpen(false)
                }}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                  activeTab === 'matches'
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                    : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/10'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="text-xs">MATCHES</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('crash')
                  setMobileMenuOpen(false)
                }}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                  activeTab === 'crash'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'text-orange-400/60 hover:text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">CRASH</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('report')
                  setMobileMenuOpen(false)
                }}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                  activeTab === 'report'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span className="text-xs">REPORT</span>
              </button>
            </div>
          </GlassPanel>
        )}

        {/* Desktop Tabs */}
        <GlassPanel className="hidden sm:block p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('matches')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                  activeTab === 'matches'
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                    : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/10'
                }`}
              >
                <Target className="w-5 h-5" />
                <span>MATCHES</span>
              </button>
              <button
                onClick={() => setActiveTab('crash')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                  activeTab === 'crash'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'text-orange-400/60 hover:text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                <span>CRASH REPORT</span>
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                  activeTab === 'report'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10'
                }`}
              >
                <Flag className="w-5 h-5" />
                <span>REPORTS</span>
              </button>
            </div>
          </div>
        </GlassPanel>

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Score Input */}
            <GlassPanel className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 font-orbitron flex items-center space-x-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span>SUBMIT SCORE</span>
              </h2>

              {canAddMatch ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-cyan-400 mb-2 font-orbitron text-sm">Position</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(Number(e.target.value))}
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/30 border border-cyan-400/40 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-rajdhani disabled:opacity-50 text-sm sm:text-base"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num}° place (x{(DEFAULT_MULTIPLIERS as any)[num] || 1})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-400 mb-2 font-orbitron text-sm">Kills</label>
                    <Input
                      type="number"
                      value={kills}
                      onChange={(e) => setKills(Number(e.target.value))}
                      min="0"
                      disabled={isSubmitting}
                      placeholder="Number of eliminations"
                      className="bg-black/30 border-cyan-400/40 text-white placeholder-cyan-400/60 focus:border-cyan-400"
                    />
                  </div>

                  <PhotoUpload
                    photos={photos}
                    onPhotosChange={setPhotos}
                    maxPhotos={2}
                    required={true}
                  />

                  <Button
                    onClick={addMatch}
                    disabled={kills < 0 || isSubmitting || photos.length < 2}
                    className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold py-4 text-lg warzone-glow disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>SUBMITTING...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>SUBMIT FOR APPROVAL</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center text-cyan-400/60 text-xs sm:text-sm font-rajdhani bg-black/20 rounded-lg p-3">
                    Matches remaining: <span className="text-cyan-400 font-bold">{maxMatches - totalSubmissions}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-4xl sm:text-6xl mb-4">🔒</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-orbitron">MISSION COMPLETE</h3>
                  <p className="text-cyan-400/80 font-rajdhani text-sm sm:text-base">You have completed all {maxMatches} available matches</p>
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <span className="text-green-400 font-orbitron text-xs sm:text-sm">STATUS: OPERATIONAL</span>
                  </div>
                </div>
              )}
            </GlassPanel>

            {/* Team Stats */}
            <GlassPanel className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white font-orbitron flex items-center space-x-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <span>STATISTICS</span>
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Score Breakdown */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="p-3 sm:p-4 bg-black/20 border border-cyan-400/20 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-400 font-rajdhani text-sm sm:text-base">Match Score:</span>
                      <span className="text-cyan-400 font-rajdhani text-base sm:text-lg font-bold">{getTotalScore().toFixed(1)}</span>
                    </div>
                  </div>
                  
                  {scoreAdjustments.length > 0 && (
                    <div className={`p-3 sm:p-4 border rounded-xl ${
                      getAdjustmentTotal() >= 0 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-400 font-rajdhani text-sm sm:text-base">Admin Adjustments:</span>
                        <span className={`font-rajdhani text-base sm:text-lg font-bold ${
                          getAdjustmentTotal() >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {getAdjustmentTotal() > 0 ? '+' : ''}{getAdjustmentTotal().toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 sm:p-6 bg-gradient-to-r from-cyan-400/20 to-green-400/20 border border-cyan-400/50 rounded-xl text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse" />
                    <div className="text-2xl sm:text-4xl font-bold text-cyan-400 font-orbitron mb-2 warzone-text-glow">{getFinalScore().toFixed(1)}</div>
                    <div className="text-cyan-400/80 font-rajdhani text-sm sm:text-base">FINAL SCORE</div>
                  </div>
                </div>

                {/* Match History */}
                <div className="space-y-2">
                  <h3 className="text-white font-bold font-orbitron flex items-center space-x-2 text-sm sm:text-base">
                    <span>MATCH HISTORY</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
                  </h3>
                  {Array.from({ length: maxMatches }, (_, i) => {
                    const submissionStatus = getSubmissionStatus(i)
                    return (
                      <Card
                        key={i}
                        className={`transition-all duration-300 ${
                          submissionStatus.status === 'approved'
                            ? 'warzone-border bg-green-500/10 border-green-500/30'
                            : submissionStatus.status === 'pending'
                            ? 'warzone-border bg-yellow-500/10 border-yellow-500/30'
                            : 'warzone-border bg-black/20 border-cyan-400/10 opacity-50'
                        }`}
                      >
                        <CardContent className="p-3">
                          {submissionStatus.status === 'approved' && submissionStatus.match ? (
                            <div className="flex justify-between items-center">
                              <div className="font-rajdhani text-white flex items-center space-x-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">Match {i + 1}:</span> 
                                <span>{submissionStatus.match.position}° place</span>
                              </div>
                              <div className="text-right font-rajdhani">
                                <div className="text-green-400 font-bold text-sm">{submissionStatus.match.score.toFixed(1)} pt</div>
                                <div className="text-green-400/60 text-xs">{submissionStatus.match.kills} kills</div>
                              </div>
                            </div>
                          ) : submissionStatus.status === 'pending' && submissionStatus.submission ? (
                            <div className="flex justify-between items-center">
                              <div className="font-rajdhani text-white flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
                                <span className="text-yellow-400">Match {i + 1}:</span> 
                                <span>Pending</span>
                              </div>
                              <div className="text-right font-rajdhani">
                                <div className="text-yellow-400 font-bold text-sm">{submissionStatus.submission.position}° place</div>
                                <div className="text-yellow-400/60 text-xs">{submissionStatus.submission.kills} kills</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-cyan-400/50 font-rajdhani text-center text-sm">
                              Match {i + 1} - Waiting
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Progress */}
                <div className="pt-3 sm:pt-4">
                  <div className="flex justify-between text-xs sm:text-sm font-rajdhani text-cyan-400/80 mb-2">
                    <span>Mission Progress</span>
                    <span>{totalSubmissions}/{maxMatches}</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2 sm:h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 sm:h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
                      style={{ width: `${(totalSubmissions / maxMatches) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* Crash Tab */}
        {activeTab === 'crash' && (
          <GlassPanel className="p-6">
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-orange-400" />
              <h2 className="text-2xl font-bold text-white mb-4 font-orbitron">CRASH REPORT</h2>
              <p className="text-gray-400 mb-6">Report game crashes and technical issues here</p>
              <Button className="bg-orange-500 hover:bg-orange-400 text-black font-bold">
                Submit Crash Report
              </Button>
            </div>
          </GlassPanel>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && (
          <GlassPanel className="p-6">
            <div className="text-center py-12">
              <Flag className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold text-white mb-4 font-orbitron">PLAYER REPORTS</h2>
              <p className="text-gray-400 mb-6">Report cheating, exploitation, or other violations</p>
              <Button className="bg-red-500 hover:bg-red-400 text-white font-bold">
                Submit Report
              </Button>
            </div>
          </GlassPanel>
        )}

        {/* Copyright */}
        <div className="mt-8 text-center">
          <div className="text-xs text-cyan-400/40 font-rajdhani">
            © 2025 Warzone Tournament System
          </div>
          <div className="text-xs text-cyan-400/30 font-rajdhani mt-1">
            Advanced Tournament Management v4.0
          </div>
        </div>
      </div>
    </div>
  )
}
