'use client'

import React, { useState } from 'react'
import { Users, Trophy, Settings, Download, Image, RotateCcw, Sliders, Clock, Key, Bell, AlertTriangle, Menu, X, Archive, UserPlus, Eye, Calculator, CheckCircle, XCircle, Upload } from 'lucide-react'
import GlassPanel from '@/components/ui/glass-panel'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface ManagerDashboardProps {
  managerCode: string
  onLogout: () => void
}

export default function ManagerDashboard({ managerCode, onLogout }: ManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'scores' | 'adjustments' | 'multipliers'>('pending')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<string>('tournament-1')

  // Mock data - in real app this would come from your state management
  const [pendingSubmissions, setPendingSubmissions] = useState([
    {
      id: 'sub-1',
      teamCode: 'ABC123',
      teamName: 'Team Alpha',
      position: 1,
      kills: 15,
      photos: ['evidence1.jpg'],
      submittedAt: Date.now() - 300000,
      tournamentId: 'tournament-1'
    },
    {
      id: 'sub-2',
      teamCode: 'DEF456',
      teamName: 'Team Beta',
      position: 3,
      kills: 8,
      photos: ['evidence2.jpg', 'evidence3.jpg'],
      submittedAt: Date.now() - 600000,
      tournamentId: 'tournament-1'
    }
  ])

  const [scoreAdjustments, setScoreAdjustments] = useState([
    {
      id: 'adj-1',
      teamCode: 'ABC123',
      amount: 50,
      reason: 'Bonus for exceptional play',
      createdAt: Date.now() - 1800000
    }
  ])

  const manager = {
    code: managerCode,
    name: managerCode === 'Overwatch2025' ? 'Tournament Manager' : 'Assistant Manager',
    permissions: managerCode === 'Overwatch2025' 
      ? ['scores', 'pending', 'adjustments', 'multipliers']
      : ['pending']
  }

  const tournaments = {
    'tournament-1': {
      id: 'tournament-1',
      name: 'Warzone Championship 2024',
      status: 'active'
    }
  }

  const teams = {
    'ABC123': { code: 'ABC123', name: 'Team Alpha' },
    'DEF456': { code: 'DEF456', name: 'Team Beta' },
    'GHI789': { code: 'GHI789', name: 'Team Gamma' }
  }

  const approveSubmission = (submissionId: string) => {
    setPendingSubmissions(prev => prev.filter(sub => sub.id !== submissionId))
    // In real app, make API call to approve
  }

  const rejectSubmission = (submissionId: string) => {
    setPendingSubmissions(prev => prev.filter(sub => sub.id !== submissionId))
    // In real app, make API call to reject
  }

  const addScoreAdjustment = () => {
    // In real app, show modal to add adjustment
    const teamCode = prompt('Team Code:')
    const amount = parseInt(prompt('Amount:') || '0')
    const reason = prompt('Reason:')
    
    if (teamCode && amount && reason) {
      const newAdjustment = {
        id: `adj-${Date.now()}`,
        teamCode,
        amount,
        reason,
        createdAt: Date.now()
      }
      setScoreAdjustments(prev => [newAdjustment, ...prev])
    }
  }

  const canAccess = (permission: string) => {
    return manager.permissions.includes(permission)
  }

  const tabItems = [
    { id: 'pending', label: 'PENDING', icon: Clock, permission: 'pending' },
    { id: 'scores', label: 'SCORES', icon: Calculator, permission: 'scores' },
    { id: 'adjustments', label: 'ADJUSTMENTS', icon: Sliders, permission: 'adjustments' },
    { id: 'multipliers', label: 'MULTIPLIERS', icon: Settings, permission: 'multipliers' }
  ].filter(item => canAccess(item.permission))

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
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 relative">
                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-float" />
                <div className="absolute inset-0 rounded-full bg-purple-400/10 animate-ping" />
              </div>
              <div>
                <h1 className="text-lg sm:text-3xl font-bold text-white font-orbitron tracking-wider warzone-text-glow">
                  MANAGER PANEL
                </h1>
                <p className="text-purple-400/80 font-rajdhani text-xs sm:text-base">
                  {manager.name} • {managerCode}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Badge className="hidden sm:inline-flex bg-purple-500/20 border-purple-500/50 text-purple-400">
                {pendingSubmissions.length} PENDING
              </Badge>
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
            <div className="grid grid-cols-2 gap-2">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-xl font-orbitron transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-purple-400/20 text-purple-400 border border-purple-400/50'
                      : 'text-purple-400/60 hover:text-purple-400 hover:bg-purple-400/10'
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
                    ? 'bg-purple-400/20 text-purple-400 border border-purple-400/50'
                    : 'text-purple-400/60 hover:text-purple-400 hover:bg-purple-400/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === 'pending' && pendingSubmissions.length > 0 && (
                  <Badge className="bg-red-500/20 border-red-500/50 text-red-400 text-xs">
                    {pendingSubmissions.length}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </GlassPanel>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Pending Submissions Tab */}
          {activeTab === 'pending' && (
            <GlassPanel className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 font-orbitron flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>PENDING SUBMISSIONS</span>
                <Badge className="bg-red-500/20 border-red-500/50 text-red-400">
                  {pendingSubmissions.length}
                </Badge>
              </h2>

              {pendingSubmissions.length === 0 ? (
                <div className="text-center text-purple-400/60 font-rajdhani py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending submissions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubmissions.map(submission => (
                    <Card key={submission.id} className="warzone-border bg-black/20 border-purple-400/20">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-400">
                                {submission.teamCode}
                              </Badge>
                              <span className="text-white font-bold font-orbitron">{submission.teamName}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-cyan-400/60 font-rajdhani">
                              <span>Position: #{submission.position}</span>
                              <span>Kills: {submission.kills}</span>
                              <span>Photos: {submission.photos.length}</span>
                            </div>
                            <div className="text-xs text-gray-400 font-rajdhani">
                              Submitted {Math.round((Date.now() - submission.submittedAt) / 60000)} minutes ago
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => approveSubmission(submission.id)}
                              size="sm"
                              className="bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                              variant="outline"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              APPROVE
                            </Button>
                            <Button
                              onClick={() => rejectSubmission(submission.id)}
                              size="sm"
                              className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                              variant="outline"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              REJECT
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </GlassPanel>
          )}

          {/* Score Adjustments Tab */}
          {activeTab === 'adjustments' && canAccess('adjustments') && (
            <GlassPanel className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white font-orbitron flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <span>SCORE ADJUSTMENTS</span>
                </h2>
                <Button
                  onClick={addScoreAdjustment}
                  size="sm"
                  className="bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
                  variant="outline"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  ADD
                </Button>
              </div>

              <div className="space-y-3">
                {scoreAdjustments.map(adjustment => (
                  <Card key={adjustment.id} className="warzone-border bg-black/20 border-purple-400/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-400">
                              {adjustment.teamCode}
                            </Badge>
                            <span className={`font-bold font-orbitron ${
                              adjustment.amount >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {adjustment.amount >= 0 ? '+' : ''}{adjustment.amount}
                            </span>
                          </div>
                          <div className="text-white font-rajdhani">{adjustment.reason}</div>
                          <div className="text-xs text-gray-400 font-rajdhani mt-1">
                            {new Date(adjustment.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </GlassPanel>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === 'scores' || activeTab === 'multipliers') && (
            <GlassPanel className="p-8 text-center">
              <div className="text-purple-400/60">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-bold text-white mb-2 font-orbitron">{activeTab.toUpperCase()} SECTION</h3>
                <p className="text-gray-400 mb-6">This section is under development</p>
                <Button 
                  onClick={() => setActiveTab('pending')}
                  className="bg-purple-500 hover:bg-purple-400 text-black font-bold"
                >
                  Back to Pending
                </Button>
              </div>
            </GlassPanel>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <div className="text-xs text-purple-400/40 font-rajdhani">
            © 2025 Warzone Tournament System
          </div>
          <div className="text-xs text-purple-400/30 font-rajdhani mt-1">
            Manager Panel v4.0 • {manager.name}
          </div>
        </div>
      </div>
    </div>
  )
}
