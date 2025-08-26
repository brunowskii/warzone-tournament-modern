'use client'

import { useSupabase } from './supabase-provider'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { LogOut, Settings, Trophy, Users } from 'lucide-react'

export function Navigation() {
  const { user } = useSupabase()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Warzone Tournament</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Tournaments
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
