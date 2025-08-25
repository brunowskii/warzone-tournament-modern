<<<<<<< HEAD
'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Trophy, Users, UserPlus, CheckCircle, XCircle } from 'lucide-react'

interface TournamentRegistrationProps {
  tournamentCode: string
}

interface Player {
  activisionId: string
  playerName: string
}

export function TournamentRegistration({ tournamentCode }: TournamentRegistrationProps) {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [tournament, setTournament] = useState<any>(null)
  const [availability, setAvailability] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    teamName: '',
    teamLeader: '',
    teamLeaderName: '',
    players: [] as Player[]
  })

  useEffect(() => {
    fetchTournamentAvailability()
  }, [tournamentCode])

  const fetchTournamentAvailability = async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentCode}/availability`)
      if (response.ok) {
        const data = await response.json()
        setTournament(data.tournament)
        setAvailability(data.availability)
      } else {
        throw new Error('Failed to fetch tournament')
      }
    } catch (error) {
      console.error('Error fetching tournament:', error)
      toast({
        title: t('errors.general'),
        description: 'Failed to load tournament information',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addPlayer = () => {
    if (formData.players.length < tournament.teamSize - 1) {
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, { activisionId: '', playerName: '' }]
      }))
    }
  }

  const removePlayer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }))
  }

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? { ...player, [field]: value } : player
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.teamName || !formData.teamLeader || !formData.teamLeaderName) {
      toast({
        title: t('errors.validation'),
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    // Validate team size
    const expectedPlayers = tournament.teamSize - 1 // -1 for team leader
    if (formData.players.length !== expectedPlayers) {
      toast({
        title: t('errors.validation'),
        description: `Team must have exactly ${tournament.teamSize} player(s)`,
        variant: 'destructive'
      })
      return
    }

    // Validate all players have required fields
    const invalidPlayers = formData.players.filter(p => !p.activisionId || !p.playerName)
    if (invalidPlayers.length > 0) {
      toast({
        title: t('errors.validation'),
        description: 'All players must have Activision ID and name',
        variant: 'destructive'
      })
      return
    }

    setIsRegistering(true)

    try {
      const response = await fetch(`/api/tournaments/${tournamentCode}/register-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Registration Successful',
          description: `Team "${data.team.name}" registered successfully!`
        })
        
        // Redirect to team dashboard or show success page
        router.push(`/team/${data.team.code}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }
    } catch (error: any) {
      toast({
        title: t('errors.general'),
        description: error.message || 'Failed to register team',
        variant: 'destructive'
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return <div>Loading tournament information...</div>
  }

  if (!tournament) {
    return <div>Tournament not found</div>
  }

  if (!availability.isAcceptingRegistrations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            Registration Closed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This tournament is not currently accepting registrations.</p>
        </CardContent>
      </Card>
    )
  }

  if (availability.isFull) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            Tournament Full
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This tournament is full and no longer accepting registrations.</p>
        </CardContent>
      </Card>
    )
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
              <div className="text-2xl font-bold text-primary">{tournament.mode}</div>
              <div className="text-sm text-muted-foreground">Game Mode</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.format}</div>
              <div className="text-sm text-muted-foreground">Format</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.teamSize}</div>
              <div className="text-sm text-muted-foreground">Team Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{availability.availableSlots}</div>
              <div className="text-sm text-muted-foreground">Available Slots</div>
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

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Team Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Team Information</h3>
              
              <div>
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  placeholder="Enter team name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamLeader">Team Leader Activision ID *</Label>
                  <Input
                    id="teamLeader"
                    value={formData.teamLeader}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamLeader: e.target.value }))}
                    placeholder="Activision ID"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="teamLeaderName">Team Leader Name *</Label>
                  <Input
                    id="teamLeaderName"
                    value={formData.teamLeaderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamLeaderName: e.target.value }))}
                    placeholder="Display name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team Members */}
            {tournament.teamSize > 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Team Members</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPlayer}
                    disabled={formData.players.length >= tournament.teamSize - 1}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {tournament.topFraggerEnabled 
                    ? `Add ${tournament.teamSize - 1} additional player(s) for Top Fragger tracking`
                    : `Add ${tournament.teamSize - 1} additional player(s)`
                  }
                </p>

                {formData.players.map((player, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <Label>Player {index + 1} Activision ID</Label>
                      <Input
                        value={player.activisionId}
                        onChange={(e) => updatePlayer(index, 'activisionId', e.target.value)}
                        placeholder="Activision ID"
                        required
                      />
                    </div>
                    <div>
                      <Label>Player {index + 1} Name</Label>
                      <Input
                        value={player.playerName}
                        onChange={(e) => updatePlayer(index, 'playerName', e.target.value)}
                        placeholder="Display name"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removePlayer(index)}
                      className="h-10"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Register Team'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
=======
'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Trophy, Users, UserPlus, CheckCircle, XCircle } from 'lucide-react'

interface TournamentRegistrationProps {
  tournamentCode: string
}

interface Player {
  activisionId: string
  playerName: string
}

export function TournamentRegistration({ tournamentCode }: TournamentRegistrationProps) {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [tournament, setTournament] = useState<any>(null)
  const [availability, setAvailability] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    teamName: '',
    teamLeader: '',
    teamLeaderName: '',
    players: [] as Player[]
  })

  useEffect(() => {
    fetchTournamentAvailability()
  }, [tournamentCode])

  const fetchTournamentAvailability = async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentCode}/availability`)
      if (response.ok) {
        const data = await response.json()
        setTournament(data.tournament)
        setAvailability(data.availability)
      } else {
        throw new Error('Failed to fetch tournament')
      }
    } catch (error) {
      console.error('Error fetching tournament:', error)
      toast({
        title: t('errors.general'),
        description: 'Failed to load tournament information',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addPlayer = () => {
    if (formData.players.length < tournament.teamSize - 1) {
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, { activisionId: '', playerName: '' }]
      }))
    }
  }

  const removePlayer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }))
  }

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? { ...player, [field]: value } : player
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.teamName || !formData.teamLeader || !formData.teamLeaderName) {
      toast({
        title: t('errors.validation'),
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    // Validate team size
    const expectedPlayers = tournament.teamSize - 1 // -1 for team leader
    if (formData.players.length !== expectedPlayers) {
      toast({
        title: t('errors.validation'),
        description: `Team must have exactly ${tournament.teamSize} player(s)`,
        variant: 'destructive'
      })
      return
    }

    // Validate all players have required fields
    const invalidPlayers = formData.players.filter(p => !p.activisionId || !p.playerName)
    if (invalidPlayers.length > 0) {
      toast({
        title: t('errors.validation'),
        description: 'All players must have Activision ID and name',
        variant: 'destructive'
      })
      return
    }

    setIsRegistering(true)

    try {
      const response = await fetch(`/api/tournaments/${tournamentCode}/register-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Registration Successful',
          description: `Team "${data.team.name}" registered successfully!`
        })
        
        // Redirect to team dashboard or show success page
        router.push(`/team/${data.team.code}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }
    } catch (error: any) {
      toast({
        title: t('errors.general'),
        description: error.message || 'Failed to register team',
        variant: 'destructive'
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return <div>Loading tournament information...</div>
  }

  if (!tournament) {
    return <div>Tournament not found</div>
  }

  if (!availability.isAcceptingRegistrations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            Registration Closed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This tournament is not currently accepting registrations.</p>
        </CardContent>
      </Card>
    )
  }

  if (availability.isFull) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            Tournament Full
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This tournament is full and no longer accepting registrations.</p>
        </CardContent>
      </Card>
    )
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
              <div className="text-2xl font-bold text-primary">{tournament.mode}</div>
              <div className="text-sm text-muted-foreground">Game Mode</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.format}</div>
              <div className="text-sm text-muted-foreground">Format</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tournament.teamSize}</div>
              <div className="text-sm text-muted-foreground">Team Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{availability.availableSlots}</div>
              <div className="text-sm text-muted-foreground">Available Slots</div>
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

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Team Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Team Information</h3>
              
              <div>
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  placeholder="Enter team name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamLeader">Team Leader Activision ID *</Label>
                  <Input
                    id="teamLeader"
                    value={formData.teamLeader}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamLeader: e.target.value }))}
                    placeholder="Activision ID"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="teamLeaderName">Team Leader Name *</Label>
                  <Input
                    id="teamLeaderName"
                    value={formData.teamLeaderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamLeaderName: e.target.value }))}
                    placeholder="Display name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team Members */}
            {tournament.teamSize > 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Team Members</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPlayer}
                    disabled={formData.players.length >= tournament.teamSize - 1}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {tournament.topFraggerEnabled 
                    ? `Add ${tournament.teamSize - 1} additional player(s) for Top Fragger tracking`
                    : `Add ${tournament.teamSize - 1} additional player(s)`
                  }
                </p>

                {formData.players.map((player, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-end">
                    <div>
                      <Label>Player {index + 1} Activision ID</Label>
                      <Input
                        value={player.activisionId}
                        onChange={(e) => updatePlayer(index, 'activisionId', e.target.value)}
                        placeholder="Activision ID"
                        required
                      />
                    </div>
                    <div>
                      <Label>Player {index + 1} Name</Label>
                      <Input
                        value={player.playerName}
                        onChange={(e) => updatePlayer(index, 'playerName', e.target.value)}
                        placeholder="Display name"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removePlayer(index)}
                      className="h-10"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Register Team'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
