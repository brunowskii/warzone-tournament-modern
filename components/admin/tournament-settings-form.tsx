'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Trophy, Settings, Eye, Code, Copy, ExternalLink } from 'lucide-react'

interface TournamentSettingsFormProps {
  tournamentId: string
}

export function TournamentSettingsForm({ tournamentId }: TournamentSettingsFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tournament, setTournament] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    numberOfMatches: 10,
    topFraggerEnabled: false,
    startDate: '',
    startTime: '',
    obsTheme: 'dark',
    status: 'PENDING'
  })

  useEffect(() => {
    fetchTournament()
  }, [tournamentId])

  const fetchTournament = async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`)
      if (response.ok) {
        const data = await response.json()
        setTournament(data)
        setFormData({
          name: data.name,
          numberOfMatches: data.numberOfMatches,
          topFraggerEnabled: data.topFraggerEnabled,
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          startTime: data.startTime,
          obsTheme: data.obsTheme,
          status: data.status
        })
      }
    } catch (error) {
      console.error('Error fetching tournament:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: t('success.tournamentUpdated'),
          description: t('tournament.updatedSuccessfully')
        })
        fetchTournament()
      } else {
        throw new Error('Failed to update tournament')
      }
    } catch (error) {
      toast({
        title: t('errors.general'),
        description: t('tournament.updateError'),
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const copyTournamentCode = () => {
    if (tournament?.code) {
      navigator.clipboard.writeText(tournament.code)
      toast({
        title: t('success.copied'),
        description: t('tournament.codeCopied')
      })
    }
  }

  const copyOBSUrl = (type: 'leaderboard' | 'top-fragger') => {
    const url = `/obs/${type}?tid=${tournamentId}`
    navigator.clipboard.writeText(`${window.location.origin}${url}`)
    toast({
      title: t('success.copied'),
      description: t('tournament.obsUrlCopied')
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!tournament) {
    return <div>Tournament not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Tournament Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            {tournament.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.code}</div>
              <div className="text-sm text-muted-foreground">{t('tournament.code')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.totalTeams}</div>
              <div className="text-sm text-muted-foreground">{t('tournament.maxTeams')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.playerCap}</div>
              <div className="text-sm text-muted-foreground">{t('tournament.maxPlayers')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.teamSize}</div>
              <div className="text-sm text-muted-foreground">{t('tournament.teamSize')}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{tournament.mode}</Badge>
            <Badge variant="secondary">{tournament.format}</Badge>
            <Badge variant={tournament.topFraggerEnabled ? 'default' : 'outline'}>
              {tournament.topFraggerEnabled ? 'Top Fragger Enabled' : 'Top Fragger Disabled'}
            </Badge>
            <Badge variant="outline">{tournament.status}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* OBS Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            OBS Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Team Leaderboard URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={`${window.location.origin}/obs/leaderboard?tid=${tournamentId}`}
                  readOnly
                />
                <Button variant="outline" onClick={() => copyOBSUrl('leaderboard')}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => window.open(`/obs/leaderboard?tid=${tournamentId}`, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {tournament.topFraggerEnabled && (
              <div>
                <Label>Top Fragger URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={`${window.location.origin}/obs/top-fragger?tid=${tournamentId}`}
                    readOnly
                  />
                  <Button variant="outline" onClick={() => copyOBSUrl('top-fragger')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => window.open(`/obs/top-fragger?tid=${tournamentId}`, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            {t('tournament.settings')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('tournament.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>{t('tournament.status')}</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
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
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="startTime">{t('tournament.startTime')}</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfMatches">{t('tournament.numberOfMatches')}</Label>
                <Input
                  id="numberOfMatches"
                  type="number"
                  value={formData.numberOfMatches}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfMatches: parseInt(e.target.value) || 10 }))}
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <Label>{t('tournament.obsTheme')}</Label>
                <Select value={formData.obsTheme} onValueChange={(value) => setFormData(prev => ({ ...prev, obsTheme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="topFragger"
                checked={formData.topFraggerEnabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, topFraggerEnabled: checked }))}
              />
              <Label htmlFor="topFragger">{t('tournament.topFraggerEnabled')}</Label>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('common.saving') : t('common.save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
