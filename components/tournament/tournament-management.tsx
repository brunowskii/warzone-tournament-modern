'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Users, Calendar, Settings, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface Tournament {
  id: string
  name: string
  type: 'RITORNO' | 'BR'
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  startDate?: string
  startTime: string
  lobbies: number
  slotsPerLobby: number
  totalMatches: number
  countedMatches: number
  teams: any[]
  matches: any[]
  createdAt: string
  isDemo: boolean
}

export function TournamentManagement() {
  const t = useTranslations()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newTournament, setNewTournament] = useState({
    name: '',
    type: 'RITORNO' as const,
    startDate: '',
    startTime: '',
    lobbies: 1,
    slotsPerLobby: 20,
    totalMatches: 10,
    countedMatches: 5
  })

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments')
      if (response.ok) {
        const data = await response.json()
        setTournaments(data)
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  const handleCreateTournament = async () => {
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTournament),
      })

      if (response.ok) {
        toast({
          title: t('success.created'),
          description: t('tournament.create') + ' ' + t('success.created'),
        })
        setIsCreateDialogOpen(false)
        setNewTournament({
          name: '',
          type: 'RITORNO',
          startDate: '',
          startTime: '',
          lobbies: 1,
          slotsPerLobby: 20,
          totalMatches: 10,
          countedMatches: 5
        })
        fetchTournaments()
      } else {
        const error = await response.json()
        toast({
          title: t('errors.error'),
          description: error.message || t('errors.general'),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t('errors.error'),
        description: t('errors.general'),
        variant: 'destructive',
      })
    }
  }

  const handleStatusChange = async (tournamentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: t('success.updated'),
          description: t('tournament.status') + ' ' + t('success.updated'),
        })
        fetchTournaments()
      } else {
        toast({
          title: t('errors.error'),
          description: t('errors.general'),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t('errors.error'),
        description: t('errors.general'),
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTournament = async (tournamentId: string) => {
    if (!confirm(t('common.confirm') + ' ' + t('tournament.delete') + '?')) {
      return
    }

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: t('success.deleted'),
          description: t('tournament.delete') + ' ' + t('success.deleted'),
        })
        fetchTournaments()
      } else {
        toast({
          title: t('errors.error'),
          description: t('errors.general'),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t('errors.error'),
        description: t('errors.general'),
        variant: 'destructive',
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500'
      case 'PENDING':
        return 'bg-yellow-500'
      case 'COMPLETED':
        return 'bg-blue-500'
      case 'ARCHIVED':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return t('tournament.status.active')
      case 'PENDING':
        return t('tournament.status.pending')
      case 'COMPLETED':
        return t('tournament.status.completed')
      case 'ARCHIVED':
        return t('tournament.status.archived')
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'RITORNO':
        return t('tournament.type.ritorno')
      case 'BR':
        return t('tournament.type.br')
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('nav.tournaments')}
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('tournament.create')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('tournament.create')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('tournament.name')}</Label>
                  <Input
                    id="name"
                    value={newTournament.name}
                    onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                    placeholder={t('tournament.name')}
                  />
                </div>
                <div>
                  <Label htmlFor="type">{t('tournament.type')}</Label>
                  <Select
                    value={newTournament.type}
                    onValueChange={(value: 'RITORNO' | 'BR') => setNewTournament({ ...newTournament, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RITORNO">{t('tournament.type.ritorno')}</SelectItem>
                      <SelectItem value="BR">{t('tournament.type.br')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">{t('tournament.startDate')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newTournament.startDate}
                    onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">{t('tournament.startTime')}</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newTournament.startTime}
                    onChange={(e) => setNewTournament({ ...newTournament, startTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lobbies">{t('tournament.lobbies')}</Label>
                  <Input
                    id="lobbies"
                    type="number"
                    min="1"
                    max="10"
                    value={newTournament.lobbies}
                    onChange={(e) => setNewTournament({ ...newTournament, lobbies: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="slotsPerLobby">{t('tournament.slotsPerLobby')}</Label>
                  <Input
                    id="slotsPerLobby"
                    type="number"
                    min="1"
                    max="50"
                    value={newTournament.slotsPerLobby}
                    onChange={(e) => setNewTournament({ ...newTournament, slotsPerLobby: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalMatches">{t('tournament.totalMatches')}</Label>
                  <Input
                    id="totalMatches"
                    type="number"
                    min="1"
                    max="50"
                    value={newTournament.totalMatches}
                    onChange={(e) => setNewTournament({ ...newTournament, totalMatches: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="countedMatches">{t('tournament.countedMatches')}</Label>
                  <Input
                    id="countedMatches"
                    type="number"
                    min="1"
                    max={newTournament.totalMatches}
                    value={newTournament.countedMatches}
                    onChange={(e) => setNewTournament({ ...newTournament, countedMatches: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateTournament}>
                  {t('common.save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <Card key={tournament.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <Badge className={getStatusColor(tournament.status)}>
                    {getStatusText(tournament.status)}
                  </Badge>
                  <Badge variant="outline">
                    {getTypeText(tournament.type)}
                  </Badge>
                  {tournament.isDemo && (
                    <Badge variant="secondary">DEMO</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={tournament.status}
                    onValueChange={(value) => handleStatusChange(tournament.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">{t('tournament.status.pending')}</SelectItem>
                      <SelectItem value="ACTIVE">{t('tournament.status.active')}</SelectItem>
                      <SelectItem value="COMPLETED">{t('tournament.status.completed')}</SelectItem>
                      <SelectItem value="ARCHIVED">{t('tournament.status.archived')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTournament(tournament.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tournament.teams.length} {t('team.name')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tournament.matches.length} {t('match.status')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tournament.lobbies} {t('tournament.lobbies')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tournament.countedMatches}/{tournament.totalMatches} {t('tournament.countedMatches')}
                  </span>
                </div>
              </div>
              {tournament.startDate && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {t('tournament.startDate')}: {new Date(tournament.startDate).toLocaleDateString()} {tournament.startTime}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {tournaments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {t('common.noData')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('tournament.create')} {t('common.to')} {t('common.start')}.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
