import { TournamentList } from '@/components/tournament/tournament-list'

export default function TournamentsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tournaments</h1>
        <TournamentList />
      </div>
    </div>
  )
}
