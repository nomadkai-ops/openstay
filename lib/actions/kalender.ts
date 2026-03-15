'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function createKalenderBlock(formData: FormData) {
  const supabase = await createClient()

  const admin = await requireAdmin(supabase)
  if (!admin) return { error: 'Keine Berechtigung.' }

  const { error } = await supabase.from('calendar_entries').insert({
    type: formData.get('type') as string,
    title: formData.get('title') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return { error: 'Eintrag konnte nicht erstellt werden.' }

  revalidatePath('/admin/kalender')
  revalidatePath('/kalender')
  return { success: true }
}

export async function deleteKalenderBlock(id: string) {
  const supabase = await createClient()

  const admin = await requireAdmin(supabase)
  if (!admin) return { error: 'Keine Berechtigung.' }

  const { error } = await supabase
    .from('calendar_entries')
    .delete()
    .eq('id', id)
    .is('linked_request_id', null) // safety: don't delete auto-created guest entries here

  if (error) return { error: 'Eintrag konnte nicht gelöscht werden.' }

  revalidatePath('/admin/kalender')
  revalidatePath('/kalender')
  return { success: true }
}
