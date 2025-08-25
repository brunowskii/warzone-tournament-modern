<<<<<<< HEAD
'use client'

import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LogOut, User, Shield, Users, Target, Eye } from 'lucide-react'
import { signOut } from '@/lib/auth'
import { Leaderboard } from '@/components/leaderboard/leaderboard'
import { TournamentManagement } from '@/components/tournament/tournament-management'
import { AuditLogs } from '@/components/audit/audit-logs'
import { TeamDashboard } from '@/components/team/team-dashboard'
import { MatchReview } from '@/components/admin/match-review'
import { OBSOverlay } from '@/components/obs/obs-overlay'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'TEAM'
}

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const t = useTranslations()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      case 'MANAGER':
        return <Users className="h-4 w-4" />
      case 'TEAM':
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'TEAM':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return t('auth.role.admin')
      case 'MANAGER':
        return t('auth.role.manager')
      case 'TEAM':
        return t('auth.role.team')
      default:
        return role
    }
  }

  const getTabs = () => {
    const tabs = [
      {
        value: 'leaderboard',
        label: t('nav.leaderboard'),
        icon: <Target className="h-4 w-4" />,
        roles: ['ADMIN', 'MANAGER', 'TEAM']
      },
      {
        value: 'tournaments',
        label: t('nav.tournaments'),
        icon: <Users className="h-4 w-4" />,
        roles: ['ADMIN', 'MANAGER']
      }
    ]

    // Add team-specific tabs
    if (user.role === 'TEAM') {
      tabs.push({
        value: 'team',
        label: t('nav.team'),
        icon: <User className="h-4 w-4" />,
        roles: ['TEAM']
      })
    }

    // Add admin/manager tabs
    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      tabs.push(
        {
          value: 'review',
          label: t('nav.review'),
          icon: <Eye className="h-4 w-4" />,
          roles: ['ADMIN', 'MANAGER']
        },
        {
          value: 'audit',
          label: t('nav.audit'),
          icon: <Shield className="h-4 w-4" />,
          roles: ['ADMIN', 'MANAGER']
        },
        {
          value: 'obs',
          label: t('nav.obs'),
          icon: <Target className="h-4 w-4" />,
          roles: ['ADMIN', 'MANAGER']
        }
      )
    }

    return tabs.filter(tab => tab.roles.includes(user.role))
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Warzone Tournament</h1>
              <Badge className={getRoleColor(user.role)}>
                {getRoleIcon(user.role)}
                <span className="ml-1">{getRoleText(user.role)}</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('auth.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-auto">
            {getTabs().map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2">
                {tab.icon}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentManagement />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamDashboard user={user} />
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <MatchReview user={user} />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogs />
          </TabsContent>

          <TabsContent value="obs" className="space-y-6">
            <OBSOverlay tournamentId="demo" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
=======
'use client'

import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LogOut, User, Shield, Users, Target, Eye } from 'lucide-react'
import { signOut } from '@/lib/auth'
import { Leaderboard } from '@/components/leaderboard/leaderboard'
import { TournamentManagement } from '@/components/tournament/tournament-management'
import { AuditLogs } from '@/components/audit/audit-logs'
import { TeamDashboard } from '@/components/team/team-dashboard'
import { MatchReview } from '@/components/admin/match-review'
import { OBSOverlay } from '@/components/obs/obs-overlay'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'TEAM'
}

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const t = useTranslations()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      case 'MANAGER':
        return <Users className="h-4 w-4" />
      case 'TEAM':
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'TEAM':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return t('auth.role.admin')
      case 'MANAGER':
        return t('auth.role.manager')
      case 'TEAM':
        return t('auth.role.team')
      default:
        return role
    }
  }

  const getTabs = () => {
    const tabs = [
      {
        value: 'leaderboard',
        label: t('nav.leaderboard'),
        icon: <Target className="h-4 w-4" />,
        roles: ['ADMIN', 'MANAGER', 'TEAM']
      },
      {
        value: 'tournaments',
        label: t('nav.tournaments'),
        icon: <Users className="h-4 w-4" />,
        roles: ['ADMIN', 'MANAGER']
      }
    ]

    // Add team-specific tabs
    if (user.role === 'TEAM') {
      tabs.push({
        value: 'team',
        label: t('nav.team'),
        icon: <User className="h-4 w-4" />,
        roles: ['TEAM']
      })
    }

    // Add admin/manager tabs
    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      tabs.push(
        {
          value: 'review',
          label: t('nav.review'),
          icon: <Eye className="h-4 w-4" />,
          roles: ['ADMIN', 'MANAGER']
        },
        {
          value: 'audit',
          label: t('nav.audit'),
          icon: <Shield className="h-4 w-4" />,
          roles: ['ADMIN', 'MANAGER']
        },
        {
          value: 'obs',
          label: t('nav.obs'),
          icon: <Target className="h-4 w-4" />,
          roles: ['ADMIN', 'MANAGER']
        }
      )
    }

    return tabs.filter(tab => tab.roles.includes(user.role))
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Warzone Tournament</h1>
              <Badge className={getRoleColor(user.role)}>
                {getRoleIcon(user.role)}
                <span className="ml-1">{getRoleText(user.role)}</span>
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('auth.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-auto">
            {getTabs().map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2">
                {tab.icon}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentManagement />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamDashboard user={user} />
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <MatchReview user={user} />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogs />
          </TabsContent>

          <TabsContent value="obs" className="space-y-6">
            <OBSOverlay tournamentId="demo" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
