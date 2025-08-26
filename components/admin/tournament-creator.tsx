// Tournament creator component from Warzonedev-main
// Advanced tournament creation with validation

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import GlassPanel from '@/components/ui/glass-panel'
import { Calendar, Clock, Users, Trophy, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TournamentCreatorProps {
  isOpen: boolean
  onClose: () => void
  onTournamentCreated?: (tournament: any) => void
}

interface TournamentForm {
  name: string
  type: 'Battle Royale' | 'Resurgence' | 'Plunder' | 'Custom'
  startDate: string
  startTime: string
  lobbies: number
  slotsPerLobby: number
  totalMatches: number
  countedMatches: number
  description: string
}

export function TournamentCreator({ isOpen, onClose, onTournamentCreated }: TournamentCreatorProps) {
  const [form, setForm] = useState<TournamentForm>({
    name: '',
    type: 'Battle Royale',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '20:00',
    lobbies: 1,
    slotsPerLobby: 20,
    totalMatches: 5,
    countedMatches: 3,
    description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = 'Tournament name is required'
    }

    if (form.lobbies < 1 || form.lobbies > 10) {
      newErrors.lobbies = 'Lobbies must be between 1 and 10'
    }

    if (form.slotsPerLobby < 1 || form.slotsPerLobby > 20) {
      newErrors.slotsPerLobby = 'Slots per lobby must be between 1 and 20'
    }

    if (form.totalMatches < 1 || form.totalMatches > 10) {
      newErrors.totalMatches = 'Total matches must be between 1 and 10'
    }

    if (form.countedMatches < 1 || form.countedMatches > form.totalMatches) {
      newErrors.countedMatches = 'Counted matches must be between 1 and total matches'
    }

    const selectedDate = new Date(form.startDate + 'T' + form.startTime)
    if (selectedDate < new Date()) {
      newErrors.startDate = 'Tournament date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const tournament = {
        id: `tournament-${Date.now()}`,
        ...form,
        status: 'pending',
        createdAt: Date.now(),
        createdBy: 'admin',
        settings: {
          lobbies: form.lobbies,
          slotsPerLobby: form.slotsPerLobby,
          totalMatches: form.totalMatches,
          countedMatches: form.countedMatches
        }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onTournamentCreated?.(tournament)
      onClose()
      
      // Reset form
      setForm({
        name: '',
        type: 'Battle Royale',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '20:00',
        lobbies: 1,
        slotsPerLobby: 20,
        totalMatches: 5,
        countedMatches: 3,
        description: ''
      })
    } catch (error) {
      console.error('Error creating tournament:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassPanel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-green-400/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-orbitron">CREATE TOURNAMENT</h2>
                <p className="text-cyan-400/60 text-sm">Configure your Warzone tournament</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Basic Information */}
          <Card className="warzone-border bg-black/40 mb-6">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-orbitron flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Tournament Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tournament Name *
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Warzone Championship 2024"
                  className={cn(
                    'bg-black/50 border-cyan-400/30 text-white',
                    errors.name && 'border-red-400'
                  )}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game Mode
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="Battle Royale">Battle Royale</option>
                  <option value="Resurgence">Resurgence</option>
                  <option value="Plunder">Plunder</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className={cn(
                      'bg-black/50 border-cyan-400/30 text-white',
                      errors.startDate && 'border-red-400'
                    )}
                  />
                  {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time *
                  </label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="bg-black/50 border-cyan-400/30 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tournament description and rules..."
                  rows={3}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tournament Settings */}
          <Card className="warzone-border bg-black/40 mb-6">
            <CardHeader>
              <CardTitle className="text-green-400 font-orbitron flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Tournament Configuration</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure lobbies, teams, and match settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Lobbies *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={form.lobbies}
                    onChange={(e) => setForm(prev => ({ ...prev, lobbies: parseInt(e.target.value) || 1 }))}
                    className={cn(
                      'bg-black/50 border-cyan-400/30 text-white',
                      errors.lobbies && 'border-red-400'
                    )}
                  />
                  {errors.lobbies && <p className="text-red-400 text-xs mt-1">{errors.lobbies}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teams per Lobby *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={form.slotsPerLobby}
                    onChange={(e) => setForm(prev => ({ ...prev, slotsPerLobby: parseInt(e.target.value) || 20 }))}
                    className={cn(
                      'bg-black/50 border-cyan-400/30 text-white',
                      errors.slotsPerLobby && 'border-red-400'
                    )}
                  />
                  {errors.slotsPerLobby && <p className="text-red-400 text-xs mt-1">{errors.slotsPerLobby}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Matches *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={form.totalMatches}
                    onChange={(e) => setForm(prev => ({ ...prev, totalMatches: parseInt(e.target.value) || 5 }))}
                    className={cn(
                      'bg-black/50 border-cyan-400/30 text-white',
                      errors.totalMatches && 'border-red-400'
                    )}
                  />
                  {errors.totalMatches && <p className="text-red-400 text-xs mt-1">{errors.totalMatches}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Counted Matches *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={form.totalMatches}
                    value={form.countedMatches}
                    onChange={(e) => setForm(prev => ({ ...prev, countedMatches: parseInt(e.target.value) || 3 }))}
                    className={cn(
                      'bg-black/50 border-cyan-400/30 text-white',
                      errors.countedMatches && 'border-red-400'
                    )}
                  />
                  {errors.countedMatches && <p className="text-red-400 text-xs mt-1">{errors.countedMatches}</p>}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-lg">
                <h4 className="font-medium text-cyan-400 mb-2">Tournament Summary</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Total Teams: <span className="text-white font-medium">{form.lobbies * form.slotsPerLobby}</span></p>
                  <p>Best {form.countedMatches} of {form.totalMatches} matches</p>
                  <p>Format: <span className="text-cyan-400">{form.type}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-500 text-gray-400 hover:bg-gray-500/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-400 hover:to-green-400 text-black font-bold"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tournament
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}

export default TournamentCreator
