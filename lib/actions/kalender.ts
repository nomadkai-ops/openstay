'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from './helpers'

export async function createKalenderBlock(formData: FormData) {
  const supabase = await createClient()

  const admin = await requireAdmin()
  if (!admin) return { error: 'Keine Berechtigung.' }

  const type = formData.get('type') as string
  const title = (formData.get('title') as string)?.trim()
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const notes = (formData.get('notes') as string)?.trim() || null

  const allowedTypes = ['travel', 'blocked', 'custom']
  if (!allowedTypes.includes(type)) return { error: 'Ungültiger Eintragstyp.' }
  if (!title) return { error: 'Titel ist erforderlich.' }
  if (!start_date || !end_date) return { error: 'Datum ist erforderlich.' }
  if (start_date > end_date) return { error: 'Startdatum muss vor dem Enddatum liegen.' }

  const { error } = await supabase.from('calendar_entries').insert({
    type,
    title,
    start_date,
    end_date,
    notes,
  })

  if (error) return { error: 'Eintrag konnte nicht erstellt werden.' }

  revalidatePath('/admin/kalender')
  revalidatePath('/kalender')
  return { success: true }
}

export async function deleteKalenderBlock(id: string) {
  const supabase = await createClient()

  const admin = await requireAdmin()
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
