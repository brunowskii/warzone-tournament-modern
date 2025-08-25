<<<<<<< HEAD
import { OBSLeaderboard } from '@/components/obs/obs-leaderboard'

interface OBSLeaderboardPageProps {
  searchParams: { tournamentId?: string; theme?: string }
}

export default function OBSLeaderboardPage({ searchParams }: OBSLeaderboardPageProps) {
  const tournamentId = searchParams.tournamentId || 'demo'
  const theme = (searchParams.theme as 'dark' | 'light' | 'transparent') || 'dark'

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <OBSLeaderboard 
        tournamentId={tournamentId}
        theme={theme}
        maxEntries={10}
        refreshRate={5000}
      />
    </div>
  )
}
=======
import { OBSLeaderboard } from '@/components/obs/obs-leaderboard'

interface OBSLeaderboardPageProps {
  searchParams: { tournamentId?: string; theme?: string }
}

export default function OBSLeaderboardPage({ searchParams }: OBSLeaderboardPageProps) {
  const tournamentId = searchParams.tournamentId || 'demo'
  const theme = (searchParams.theme as 'dark' | 'light' | 'transparent') || 'dark'

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <OBSLeaderboard 
        tournamentId={tournamentId}
        theme={theme}
        maxEntries={10}
        refreshRate={5000}
      />
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
