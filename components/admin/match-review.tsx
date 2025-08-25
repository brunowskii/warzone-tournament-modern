'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { calculateMatchScore } from '@/lib/scoring'

interface MatchReviewProps {
  user: any
}

interface MatchSubmission {
  id: string
  position: number
  kills: number
  score: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
  team: {
    name: string
    code: string
  }
  submissions: Array<{
    id: string
    fileUrl: string
    fileName: string
    mimeType: string
  }>
  reviewer?: {
    name: string
  }
}

export function MatchReview({ user }: MatchReviewProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [matches, setMatches] = useState<MatchSubmission[]>([])
  const [selectedMatch, setSelectedMatch] = useState<MatchSubmission | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches?status=PENDING')
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  const handleReview = async (matchId: string, status: 'APPROVED' | 'REJECTED') => {
    setIsReviewing(true)
    
    try {
      const response = await fetch(`/api/matches/${matchId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : undefined
        })
      })

      if (response.ok) {
        toast({
          title: t('success.updated'),
          description: t(`match.${status.toLowerCase()}Success`)
        })
        setSelectedMatch(null)
        setRejectionReason('')
        fetchMatches()
      } else {
        throw new Error('Review failed')
      }
    } catch (error) {
      toast({
        title: t('errors.general'),
        description: t('match.reviewError'),
        variant: 'destructive'
      })
    } finally {
      setIsReviewing(false)
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

  const calculateScore = (kills: number, position: number) => {
    const calculation = calculateMatchScore(kills, position)
    return calculation.finalScore
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('match.pendingReviews')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {matches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('match.noPendingReviews')}
              </p>
            ) : (
              matches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(match.status)}
                    <div>
                      <div className="font-medium">
                        {match.team.name} ({match.team.code})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('match.position')}: {match.position} • {t('match.kills')}: {match.kills} • {t('match.score')}: {calculateScore(match.kills, match.position)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(match.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(match.status)}>
                      {t(`match.status.${match.status.toLowerCase()}`)}
                    </Badge>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t('common.view')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{t('match.reviewSubmission')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>{t('team.name')}</Label>
                              <div className="font-medium">{match.team.name}</div>
                            </div>
                            <div>
                              <Label>{t('team.code')}</Label>
                              <div className="font-medium">{match.team.code}</div>
                            </div>
                            <div>
                              <Label>{t('match.position')}</Label>
                              <div className="font-medium">{match.position}</div>
                            </div>
                            <div>
                              <Label>{t('match.kills')}</Label>
                              <div className="font-medium">{match.kills}</div>
                            </div>
                            <div>
                              <Label>{t('match.score')}</Label>
                              <div className="font-medium">{calculateScore(match.kills, match.position)}</div>
                            </div>
                            <div>
                              <Label>{t('match.submittedAt')}</Label>
                              <div className="font-medium">
                                {new Date(match.submittedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label>{t('match.evidence')}</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {match.submissions.map((submission) => (
                                <div key={submission.id} className="border rounded p-2">
                                  {submission.mimeType.startsWith('image/') ? (
                                    <img
                                      src={submission.fileUrl}
                                      alt={submission.fileName}
                                      className="w-full h-32 object-cover rounded"
                                    />
                                  ) : (
                                    <video
                                      src={submission.fileUrl}
                                      controls
                                      className="w-full h-32 object-cover rounded"
                                    />
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {submission.fileName}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {match.status === 'PENDING' && (
                            <div className="space-y-4">
                              <div>
                                <Label>{t('match.rejectionReason')}</Label>
                                <Textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder={t('match.rejectionReasonPlaceholder')}
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedMatch(null)}
                                  disabled={isReviewing}
                                >
                                  {t('common.cancel')}
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReview(match.id, 'REJECTED')}
                                  disabled={isReviewing}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  {t('match.reject')}
                                </Button>
                                <Button
                                  onClick={() => handleReview(match.id, 'APPROVED')}
                                  disabled={isReviewing}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {t('match.approve')}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
