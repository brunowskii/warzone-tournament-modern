<<<<<<< HEAD
import { TournamentSettingsForm } from '@/components/admin/tournament-settings-form'

interface TournamentSettingsPageProps {
  params: {
    id: string
  }
}

export default function TournamentSettingsPage({ params }: TournamentSettingsPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tournament Settings</h1>
        <TournamentSettingsForm tournamentId={params.id} />
      </div>
    </div>
  )
}
=======
import { TournamentSettingsForm } from '@/components/admin/tournament-settings-form'

interface TournamentSettingsPageProps {
  params: {
    id: string
  }
}

export default function TournamentSettingsPage({ params }: TournamentSettingsPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tournament Settings</h1>
        <TournamentSettingsForm tournamentId={params.id} />
      </div>
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
