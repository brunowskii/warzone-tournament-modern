import { TournamentCreationForm } from '@/components/admin/tournament-creation-form'

export default function NewTournamentPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Tournament</h1>
        <TournamentCreationForm />
      </div>
    </div>
  )
}
