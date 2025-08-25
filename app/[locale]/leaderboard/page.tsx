import { LeaderboardList } from '@/components/leaderboard/leaderboard-list'

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-500 font-orbitron">Leaderboard</h1>
        <LeaderboardList />
      </div>
    </div>
  )
}
