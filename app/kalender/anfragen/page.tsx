import { createClient } from '@/lib/supabase/server'
import { AnfragenListe } from '@/components/kalender/AnfragenListe'
import Link from 'next/link'
import type { VisitRequest } from '@/types'
import { redirect } from 'next/navigation'

export default async function MeineAnfragenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: requests } = await supabase
    .from('visit_requests')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Meine Anfragen</h1>
        <Link href="/kalender" className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50">← Kalender</Link>
      </div>
      <AnfragenListe requests={(requests ?? []) as VisitRequest[]} />
    </main>
  )
}
