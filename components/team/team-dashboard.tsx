'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Trophy, Target, Upload, Clock, CheckCircle, XCircle } from 'lucide-react'
import { validateMatchSubmission } from '@/lib/scoring'
import { formatPoints } from '@/lib/utils'

interface TeamDashboardProps {
  user: any
}

interface TeamStats {
  teamName: string
  teamCode: string
  totalScore: number
  totalKills: number
  matchesCount: number
  rank: number
  finalScore: number
}

interface MatchSubmission {
  id: string
  position: number
  kills: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

export function TeamDashboard({ user }: TeamDashboardProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
  const [matches, setMatches] = useState<MatchSubmission[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)
  
  // Submission form state
  const [position, setPosition] = useState<number>(1)
  const [kills, setKills] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/team/dashboard')
      if (response.ok) {
        const data = await response.json()
        setTeamStats(data.teamStats)
        setMatches(data.matches)
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)
  }

  const handleSubmitMatch = async () => {
    const validation = validateMatchSubmission(position, kills, files)
    if (!validation.valid) {
      toast({
        title: t('errors.validation'),
        description: validation.errors.join(', '),
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    setUploading(true)

    try {
      // Upload files first
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          
          if (!uploadResponse.ok) {
            throw new Error('File upload failed')
          }
          
          return await uploadResponse.json()
        })
      )

      // Submit match with uploaded file URLs
      const submissionResponse = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          position,
          kills,
          fileUrls: uploadedFiles.map(f => f.url),
          fileNames: files.map(f => f.name),
          fileSizes: files.map(f => f.size),
          mimeTypes: files.map(f => f.type)
        })
      })

      if (submissionResponse.ok) {
        toast({
          title: t('success.submitted'),
          description: t('match.submittedSuccessfully')
        })
        setShowSubmissionDialog(false)
        setPosition(1)
        setKills(0)
        setFiles([])
        fetchTeamData() // Refresh data
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      toast({
        title: t('errors.general'),
        description: t('match.submissionError'),
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
      setUploading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    }
  }

  if (!teamStats) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            {t('team.stats')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-leaderboard-gold">#{teamStats.rank}</div>
              <div className="text-sm text-muted-foreground">{t('scoring.rank')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatPoints(teamStats.finalScore)}</div>
              <div className="text-sm text-muted-foreground">{t('scoring.finalScore')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{teamStats.totalKills}</div>
              <div className="text-sm text-muted-foreground">{t('scoring.kills')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{teamStats.matchesCount}</div>
              <div className="text-sm text-muted-foreground">{t('match.matches')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Match */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            {t('match.submit')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {t('match.submitNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('match.submit')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('match.position')}</Label>
                  <Select value={position.toString()} onValueChange={(value) => setPosition(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(pos => (
                        <SelectItem key={pos} value={pos.toString()}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t('match.kills')}</Label>
                  <Input
                    type="number"
                    value={kills}
                    onChange={(e) => setKills(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label>{t('match.evidence')}</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('match.evidenceHelp')}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmissionDialog(false)}
                    disabled={isSubmitting}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    onClick={handleSubmitMatch}
                    disabled={isSubmitting || files.length < 2}
                  >
                    {uploading ? t('common.uploading') : t('match.submit')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Match History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('match.history')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {matches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('match.noMatches')}
              </p>
            ) : (
              matches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(match.status)}
                    <div>
                      <div className="font-medium">
                        {t('match.position')}: {match.position} • {t('match.kills')}: {match.kills}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(match.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(match.status)}>
                    {t(`match.status.${match.status.toLowerCase()}`)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
