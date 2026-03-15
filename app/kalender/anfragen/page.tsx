import { createClient } from '@/lib/supabase/server'
import { AnfragenListe } from '@/components/kalender/AnfragenListe'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import type { VisitRequest } from '@/types'

export default async function MeineAnfragenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: requests } = await supabase
    .from('visit_requests')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Meine Anfragen</h1>
        <Link href="/kalender" className={buttonVariants({ variant: 'outline' })}>← Kalender</Link>
      </div>
      <AnfragenListe requests={(requests ?? []) as VisitRequest[]} />
    </main>
  )
}
