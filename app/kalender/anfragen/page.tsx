import { createClient } from '@/lib/supabase/server'
import { AnfragenListe } from '@/components/kalender/AnfragenListe'
import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
import type { VisitRequest } from '@/types'
import { redirect } from 'next/navigation'

export default async function MeineAnfragenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: requests } = await supabase
    .from('visit_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen">
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/kalender" className="font-bold text-white tracking-tight text-lg hover:text-white/80">
            ← OpenStay
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-white/60 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors">
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Meine Anfragen</h1>
        <AnfragenListe requests={(requests ?? []) as VisitRequest[]} />
      </main>
    </div>
  )
}
