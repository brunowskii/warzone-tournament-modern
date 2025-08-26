'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Clock, User, Activity } from 'lucide-react'

const mockAuditLogs = [
  {
    id: '1',
    action: 'TOURNAMENT_CREATED',
    details: 'Demo tournament created by admin',
    user: 'admin@warzone.com',
    timestamp: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    action: 'TEAM_REGISTERED',
    details: 'Team Alpha registered for tournament',
    user: 'admin@warzone.com',
    timestamp: '2024-01-15 10:35:00'
  },
  {
    id: '3',
    action: 'MATCH_SUBMITTED',
    details: 'Match results submitted by Team Alpha',
    user: 'team@alpha.com',
    timestamp: '2024-01-15 11:30:00'
  }
]

export function AuditLog() {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'TOURNAMENT_CREATED':
        return 'bg-blue-500'
      case 'TEAM_REGISTERED':
        return 'bg-green-500'
      case 'MATCH_SUBMITTED':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {mockAuditLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  <Badge className={getActionColor(log.action)}>
                    {log.action}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{log.details}</p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{log.user}</span>
                    <Clock className="h-3 w-3" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
