<<<<<<< HEAD
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return <DashboardContent user={user} />
}
=======
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return <DashboardContent user={user} />
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
