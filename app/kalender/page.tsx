import { createClient } from '@/lib/supabase/server'
import { KalenderAnsicht } from '@/components/kalender/KalenderAnsicht'
import type { CalendarEntry, VisitRequest, Profile } from '@/types'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function KalenderPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, entriesResult, requestsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('calendar_entries').select('*').order('start_date'),
    supabase.from('visit_requests').select('*').order('start_date'),
  ])

  const profile = profileResult.data as Profile
  const entries = (entriesResult.data ?? []) as CalendarEntry[]
  const requests = (requestsResult.data ?? []) as VisitRequest[]

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-stone-800">Kalender</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500">{profile.name}</span>
            <Link href="/kalender/anfragen">
              <Button variant="outline" size="sm">Meine Anfragen</Button>
            </Link>
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit">Abmelden</Button>
            </form>
          </div>
        </div>
        <KalenderAnsicht
          entries={entries}
          requests={requests}
          currentUserId={user!.id}
          isAdmin={profile.role === 'admin'}
          prefillName={profile.name}
          prefillEmail={profile.email}
        />
      </div>
    </main>
  )
}
