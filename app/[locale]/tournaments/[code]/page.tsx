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
