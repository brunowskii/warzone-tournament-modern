'use client'

import React, { useState } from 'react'
import { Users, Trophy, Settings, Download, Image, RotateCcw, Sliders, Clock, Key, Bell, AlertTriangle, Menu, X, Archive, UserPlus, Eye, Shield, Plus, Play, Copy, Tv, Calculator } from 'lucide-react'
import GlassPanel from '@/components/ui/glass-panel'
import TournamentCreator from '@/components/admin/tournament-creator'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { generateUniqueTeamCode } from '@/lib/team-code-generator'
import { DEFAULT_MULTIPLIERS } from '@/lib/score-calculation'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'teams' | 'scores' | 'pending' | 'adjustments' | 'managers' | 'audit' | 'archive' | 'assign-scores'>('tournaments')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<string>('')
  const [showTournamentCreator, setShowTournamentCreator] = useState(false)
  const [showLoginCodes, setShowLoginCodes] = useState(false)
  const [showOBSPlugin, setShowOBSPlugin] = useState(false)
  const [showScoreTest, setShowScoreTest] = useState(false)

  // Mock data - in real app this would come from your state management
  const [tournaments, setTournaments] = useState<Record<string, any>>({
    'tournament-1': {
      id: 'tournament-1',
      name: 'Warzone Championship 2024',
      type: 'Battle Royale',
      status: 'active',
      startTime: '20:00',
      startDate: '2024-02-15',
      createdAt: Date.now(),
      createdBy: 'admin',
      assignedManagers: ['Overwatch2025'],
      settings: { lobbies: 1, slotsPerLobby: 20, totalMatches: 4, countedMatches: 3 },
      isDemo: false
    }
  })

  const [teams, setTeams] = useState<Record<string, any>>({
    'team-1': { id: 'team-1', name: 'Team Alpha', code: 'ABC123', tournamentId: 'tournament-1', active: true },
    'team-2': { id: 'team-2', name: 'Team Beta', code: 'DEF456', tournamentId: 'tournament-1', active: true },
    'team-3': { id: 'team-3', name: 'Team Gamma', code: 'GHI789', tournamentId: 'tournament-1', active: true }
  })

  const [managers, setManagers] = useState<Record<string, any>>({
    'Overwatch2025': {
      id: 'mgr-overwatch',
      name: 'Tournament Manager',
      code: 'Overwatch2025',
      permissions: ['scores', 'pending', 'adjustments', 'multipliers'],
      createdAt: Date.now(),
      createdBy: 'admin',
      isActive: true
    },
    'Manager2024': {
      id: 'mgr-assistant',
      name: 'Assistant Manager',
      code: 'Manager2024',
      permissions: ['pending'],
      createdAt: Date.now(),
      createdBy: 'admin',
      isActive: true
    }
  })

  const [matches, setMatches] = useState<any[]>([])
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([])
  const [scoreAdjustments, setScoreAdjustments] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  const activeTournaments = Object.values(tournaments).filter(t => t.status === 'active')
  const completedTournaments = Object.values(tournaments).filter(t => t.status === 'completed')
  const totalPendingCount = pendingSubmissions.length

  const createBlackCrowDemo = () => {
    const demoId = `blackcrow-${Date.now()}`
    const now = new Date()
    
    // Create the Black Crow Scrim tournament
    const blackCrowTournament = {
      id: demoId,
      name: 'Black Crow Scrim',
      type: 'Battle Royale',
      status: 'active',
      startTime: '20:00',
      startDate: now.toISOString().split('T')[0],
      createdAt: Date.now(),
      createdBy: 'admin',
      assignedManagers: ['Overwatch2025'],
      settings: { lobbies: 1, slotsPerLobby: 15, totalMatches: 4, countedMatches: 3 },
      isDemo: true
    }

    setTournaments(prev => ({ ...prev, [demoId]: blackCrowTournament }))

    // Black Crow team names
    const blackCrowTeams = [
      'BlackCrow Sayan', 'BlackCrow Slide', 'BlackCrow Omega', 'BlackCrow Eclipse',
      'BlackCrow Beta', 'BlackCrow Alpha', 'BlackCrow Hydra', 'BlackCrow Shadow',
      'BlackCrow Storm', 'BlackCrow Neo', 'BlackCrow Nova', 'BlackCrow Venom',
      'BlackCrow Ghost', 'BlackCrow Prime', 'BlackCrow Joker'
    ]

    // Create teams with codes
    blackCrowTeams.forEach((teamName, index) => {
      const code = `BC${String(index + 1).padStart(3, '0')}`
      const key = `${demoId}-team-${index + 1}`
      
      const team = {
        id: key,
        name: teamName,
        code,
        tournamentId: demoId,
        active: true,
        clanName: teamName,
        playerName: teamName.replace('BlackCrow ', '')
      }

      setTeams(prev => ({ ...prev, [key]: team }))
    })

    setSelectedTournament(demoId)
    setActiveTab('tournaments')
  }

  const stopDemo = () => {
    const demoTournaments = Object.values(tournaments).filter(t => t.isDemo)
    
    demoTournaments.forEach(demo => {
      // Remove demo tournament
      setTournaments(prev => {
        const newTournaments = { ...prev }
        delete newTournaments[demo.id]
        return newTournaments
      })

      // Remove demo teams
      const demoTeams = Object.values(teams).filter((team: any) => team.tournamentId === demo.id)
      demoTeams.forEach((team: any) => {
        setTeams(prev => {
          const newTeams = { ...prev }
          delete newTeams[team.id]
          return newTeams
        })
      })
    })

    setSelectedTournament('')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const tabItems = [
    { id: 'tournaments', label: 'TOURNAMENTS', icon: Trophy },
    { id: 'assign-scores', label: 'ASSIGN SCORES', icon: Calculator },
    { id: 'managers', label: 'MANAGERS', icon: UserPlus },
    { id: 'audit', label: 'AUDIT LOG', icon: Eye },
    { id: 'archive', label: 'ARCHIVE', icon: Archive }
  ]

  return (
    <div className="min-h-screen p-2 sm:p-4 relative z-10 warzone-bg-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <GlassPanel className="p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-green-400/20 relative">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-float" />
                <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping" />
              </div>
              <div>
                <h1 className="text-lg sm:text-3xl font-bold text-white font-orbitron tracking-wider warzone-text-glow">
                  ADMIN CONTROL
                </h1>
                <p className="text-cyan-400/80 font-rajdhani text-xs sm:text-base">
                  Tournament Management System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                onClick={() => setShowLoginCodes(true)}
                variant="outline"
                size="sm"
                className="hidden sm:flex border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                <Key className="w-4 h-4 mr-2" />
                CODES
              </Button>
              <Button
                onClick={() => setShowTournamentCreator(true)}
                variant="outline"
                size="sm"
                className="hidden sm:flex border-green-500/50 text-green-400 hover:bg-green-500/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                CREATE
              </Button>
              <Button
                onClick={createBlackCrowDemo}
                variant="outline"
                size="sm"
                className="hidden sm:flex border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              >
                <Play className="w-4 h-4 mr-2" />
                DEMO
              </Button>
              {Object.values(tournaments).some(t => t.isDemo) && (
                <Button
                  onClick={stopDemo}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  <X className="w-4 h-4 mr-2" />
                  STOP
                </Button>
              )}
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                LOGOUT
              </Button>
            </div>
          </div>
        </GlassPanel>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <GlassPanel className="sm:hidden p-4 mb-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                      : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Desktop Navigation Tabs */}
        <GlassPanel className="hidden sm:block p-6 mb-6">
          <div className="flex space-x-4 overflow-x-auto">
            {tabItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-orbitron transition-all duration-300 whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                    : 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </GlassPanel>

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <GlassPanel className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 font-orbitron">ACTIVE TOURNAMENTS</h2>
                <div className="space-y-3">
                  {activeTournaments.length === 0 ? (
                    <div className="text-center text-cyan-400/60 font-rajdhani py-8">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No active tournaments</p>
                    </div>
                  ) : (
                    activeTournaments.map(tournament => (
                      <Card key={tournament.id} className={`warzone-border transition-all duration-300 ${
                        tournament.isDemo 
                          ? 'bg-purple-500/10 border-purple-500/30' 
                          : 'bg-black/20 border-cyan-400/20'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-bold font-orbitron">{tournament.name}</div>
                              <div className="text-cyan-400/60 text-sm font-rajdhani">
                                {tournament.type} • {tournament.startDate} {tournament.startTime}
                              </div>
                              {tournament.isDemo && (
                                <Badge className="mt-1 bg-purple-500/20 border-purple-500/50 text-purple-400">
                                  DEMO
                                </Badge>
                              )}
                            </div>
                            <Button
                              onClick={() => setSelectedTournament(tournament.id)}
                              size="sm"
                              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                            >
                              MANAGE
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </GlassPanel>

              <GlassPanel className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 font-orbitron">QUICK ACTIONS</h2>
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowTournamentCreator(true)}
                    className="w-full bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 py-4"
                    variant="outline"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Create New Tournament
                  </Button>
                  <Button
                    onClick={createBlackCrowDemo}
                    className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 py-4"
                    variant="outline"
                  >
                    <Play className="w-5 h-5 mr-3" />
                    Start Black Crow Demo
                  </Button>
                  {Object.values(tournaments).some(t => t.isDemo) && (
                    <Button
                      onClick={stopDemo}
                      className="w-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 py-4"
                      variant="outline"
                    >
                      <X className="w-5 h-5 mr-3" />
                      Stop Demo
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowLoginCodes(true)}
                    className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 py-4"
                    variant="outline"
                  >
                    <Key className="w-5 h-5 mr-3" />
                    View Access Codes
                  </Button>
                </div>
              </GlassPanel>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented here */}
        {activeTab !== 'tournaments' && (
          <GlassPanel className="p-8 text-center">
            <div className="text-cyan-400/60">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold text-white mb-2 font-orbitron">{activeTab.toUpperCase()} SECTION</h3>
              <p className="text-gray-400 mb-6">This section is under development</p>
              <Button 
                onClick={() => setActiveTab('tournaments')}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
              >
                Back to Tournaments
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

      {/* Tournament Creator Modal */}
      <TournamentCreator
        isOpen={showTournamentCreator}
        onClose={() => setShowTournamentCreator(false)}
        onTournamentCreated={(tournament) => {
          setTournaments(prev => ({ ...prev, [tournament.id]: tournament }))
        }}
      />

      {/* Login Codes Modal */}
      {showLoginCodes && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassPanel className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-orbitron flex items-center space-x-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <span>ACCESS CODES</span>
              </h2>
              <button
                onClick={() => setShowLoginCodes(false)}
                className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Admin Codes */}
              <div className="p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
                <h3 className="text-cyan-400 font-orbitron font-bold mb-3">ADMINISTRATOR CODES</h3>
                <div className="space-y-2">
                  {['MISOKIETI', 'MISOKIETI8'].map((code) => (
                    <div key={code} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <span className="text-white font-rajdhani text-lg">{code}</span>
                      <Button
                        onClick={() => copyToClipboard(code)}
                        size="sm"
                        className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                        variant="outline"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        COPY
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manager Codes */}
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h3 className="text-purple-400 font-orbitron font-bold mb-3">MANAGER CODES</h3>
                <div className="space-y-2">
                  {Object.values(managers).filter(m => m.isActive).map((manager) => (
                    <div key={manager.code} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-white font-rajdhani text-lg">{manager.code}</span>
                        <div className="text-purple-400/60 text-sm font-rajdhani">{manager.name}</div>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(manager.code)}
                        size="sm"
                        className="bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
                        variant="outline"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        COPY
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Codes */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h3 className="text-green-400 font-orbitron font-bold mb-3">ACTIVE TEAM CODES</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.values(teams).filter((team: any) => {
                    const tournament = tournaments[team.tournamentId as keyof typeof tournaments]
                    return tournament && tournament.status === 'active'
                  }).map((team: any) => (
                    <div key={team.code} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div>
                        <span className="text-white font-rajdhani text-lg">{team.code}</span>
                        <div className="text-green-400/60 text-sm font-rajdhani">{team.name}</div>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(team.code)}
                        size="sm"
                        className="bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                        variant="outline"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        COPY
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowLoginCodes(false)}
                variant="outline"
                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20"
              >
                CLOSE
              </Button>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  )
}
