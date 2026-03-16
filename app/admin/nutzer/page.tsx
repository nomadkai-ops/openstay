import { createClient } from '@/lib/supabase/server'
import { NutzerTabelle } from '@/components/admin/NutzerTabelle'
import type { Profile } from '@/types'

export default async function AdminNutzerPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'user')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">Nutzer</h1>
      <NutzerTabelle users={(users ?? []) as Profile[]} />
    </div>
  )
}
