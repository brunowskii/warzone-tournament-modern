'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import GlassPanel from '@/components/ui/glass-panel'
import LoadingSpinner from '@/components/ui/loading-spinner'
import AdminDashboard from '@/components/admin/admin-dashboard'
import ManagerDashboard from '@/components/admin/manager-dashboard'

interface DashboardProps {
  params: { locale: string }
}

export default function LocalizedDashboardPage({ params }: DashboardProps) {
  const { locale } = params
  const [userType, setUserType] = useState<'admin' | 'manager' | 'team' | null>(null)
  const [userCode, setUserCode] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (in real app, check auth state)
    const mockUserType = 'admin' // This would come from auth
    const mockUserCode = 'MISOKIETI' // This would come from auth
    
    setUserType(mockUserType)
    setUserCode(mockUserCode)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    setUserType(null)
    setUserCode('')
    window.location.href = '/auth/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center warzone-bg-pattern">
        <LoadingSpinner size="lg" variant="warzone" />
      </div>
    )
  }

  if (!userType) {
    // Redirect to login if not authenticated
    window.location.href = '/auth/login'
    return null
  }

  // Render appropriate dashboard based on user type
  if (userType === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />
  }

  if (userType === 'manager') {
    return <ManagerDashboard managerCode={userCode} onLogout={handleLogout} />
  }

  if (userType === 'team') {
    // Team dashboard would go here
    return (
      <div className="min-h-screen p-4 relative z-10 warzone-bg-pattern">
        <GlassPanel className="p-8 text-center">
          <div className="text-cyan-400/60">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2 font-orbitron">TEAM DASHBOARD</h3>
            <p className="text-gray-400 mb-6">Team dashboard is under development</p>
            <Button 
              onClick={handleLogout}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
            >
              LOGOUT
            </Button>
          </div>
        </GlassPanel>
      </div>
    )
  }

  return null
}