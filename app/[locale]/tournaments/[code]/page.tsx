<<<<<<< HEAD
import { TournamentDetail } from '@/components/tournament/tournament-detail'

interface TournamentDetailPageProps {
  params: {
    code: string
  }
}

export default function TournamentDetailPage({ params }: TournamentDetailPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <TournamentDetail tournamentCode={params.code} />
      </div>
    </div>
  )
}
=======
import { TournamentDetail } from '@/components/tournament/tournament-detail'

interface TournamentDetailPageProps {
  params: {
    code: string
  }
}

export default function TournamentDetailPage({ params }: TournamentDetailPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <TournamentDetail tournamentCode={params.code} />
      </div>
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
