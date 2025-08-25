'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Trophy, Settings, Eye, Code } from 'lucide-react'
import { calculateTournamentConfig, GAME_MODE_CONFIGS, TEAM_FORMAT_CONFIGS } from '@/lib/tournament-utils'

export function TournamentCreationForm() {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    mode: '',
    format: '',
    numberOfMatches: 10,
    topFraggerEnabled: false,
    startDate: '',
    startTime: '',
    obsTheme: 'dark',
    customScoring: false
  })

  const [config, setConfig] = useState<any>(null)

  const handleModeChange = (mode: string) => {
    setFormData(prev => ({ ...prev, mode }))
    if (formData.format) {
      updateConfig(mode, formData.format)
    }
  }

  const handleFormatChange = (format: string) => {
    setFormData(prev => ({ ...prev, format }))
    if (formData.mode) {
      updateConfig(formData.mode, format)
    }
  }

  const updateConfig = (mode: string, format: string) => {
    try {
      const tournamentConfig = calculateTournamentConfig(mode, format)
      setConfig(tournamentConfig)
    } catch (error) {
      console.error('Error calculating tournament config:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.mode || !formData.format) {
      toast({
        title: t('errors.validation'),
        description: t('tournament.fillRequiredFields'),
        variant: 'destructive'
      })
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const tournament = await response.json()
        toast({
          title: t('success.tournamentCreated'),
          description: t('tournament.createdSuccessfully')
        })
        router.push(`/admin/tournaments/${tournament.id}/settings`)
      } else {
        throw new Error('Failed to create tournament')
      }
    } catch (error) {
      toast({
        title: t('errors.general'),
        description: t('tournament.creationError'),
        variant: 'destructive'
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          {t('tournament.createNew')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('tournament.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('tournament.namePlaceholder')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('tournament.gameMode')} *</Label>
                <Select value={formData.mode} onValueChange={handleModeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tournament.selectGameMode')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GAME_MODE_CONFIGS).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{key}</span>
                          <span className="text-sm text-muted-foreground">
                            ({config.playerCap} players)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('tournament.teamFormat')} *</Label>
                <Select value={formData.format} onValueChange={handleFormatChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tournament.selectTeamFormat')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEAM_FORMAT_CONFIGS).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{key}</span>
                          <span className="text-sm text-muted-foreground">
                            ({config.teamSize} players)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Configuration Preview */}
          {config && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                {t('tournament.configuration')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{config.totalTeams}</div>
                  <div className="text-sm text-muted-foreground">{t('tournament.maxTeams')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{config.playerCap}</div>
                  <div className="text-sm text-muted-foreground">{t('tournament.maxPlayers')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{config.teamSize}</div>
                  <div className="text-sm text-muted-foreground">{t('tournament.teamSize')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formData.numberOfMatches}</div>
                  <div className="text-sm text-muted-foreground">{t('tournament.matches')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tournament Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              {t('tournament.settings')}
            </h3>
            
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
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isCreating || !config}
          >
            {isCreating ? t('common.creating') : t('tournament.create')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
