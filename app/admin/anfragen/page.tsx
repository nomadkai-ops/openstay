import { createClient } from '@/lib/supabase/server'
import { AnfragenTabelle } from '@/components/admin/AnfragenTabelle'
import type { VisitRequest } from '@/types'

export default async function AdminAnfragenPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from('visit_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Anfragen</h1>
      <AnfragenTabelle requests={(requests ?? []) as VisitRequest[]} />
    </div>
  )
}
