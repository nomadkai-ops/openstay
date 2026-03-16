import { createClient } from '@/lib/supabase/server'
import { KalenderAnsicht } from '@/components/kalender/KalenderAnsicht'
import type { CalendarEntry, VisitRequest, Profile } from '@/types'
import { logout } from '@/lib/actions/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'

export default async function KalenderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, entriesResult, requestsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('calendar_entries').select('*').order('start_date'),
    supabase.from('visit_requests').select('*').order('start_date'),
  ])

  const profile = profileResult.data as Profile
  const entries = (entriesResult.data ?? []) as CalendarEntry[]
  const requests = (requestsResult.data ?? []) as VisitRequest[]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-bold text-white tracking-tight text-lg">OpenStay</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-sm text-white/60">{profile.name}</span>
            <Link
              href="/kalender/anfragen"
              className={buttonVariants({ variant: 'outline', size: 'sm' }) + ' border-white/20 text-white bg-white/10 hover:bg-white/20 hover:text-white'}
            >
              Meine Anfragen
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-white/60 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <KalenderAnsicht
          entries={entries}
          requests={requests}
          currentUserId={user.id}
          isAdmin={profile.role === 'admin'}
          prefillName={profile.name}
          prefillEmail={profile.email}
        />
      </main>
    </div>
  )
}
