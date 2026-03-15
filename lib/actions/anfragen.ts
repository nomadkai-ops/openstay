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

export async function createAnfrage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht eingeloggt.' }

  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || null
  const guest_count = parseInt(formData.get('guest_count') as string, 10)
  const message = (formData.get('message') as string)?.trim()
  const request_type = (formData.get('request_type') as string) || null

  if (!start_date || !end_date || !name || !email || !message) {
    return { error: 'Pflichtfelder fehlen.' }
  }
  if (start_date > end_date) {
    return { error: 'Startdatum muss vor dem Enddatum liegen.' }
  }
  if (isNaN(guest_count) || guest_count < 1) {
    return { error: 'Ungültige Personenzahl.' }
  }

  const { data, error } = await supabase
    .from('visit_requests')
    .insert({
      user_id: user.id,
      start_date,
      end_date,
      name,
      email,
      phone,
      guest_count,
      message,
      request_type: request_type || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return { error: 'Anfrage konnte nicht gespeichert werden.' }

  try {
    const { sendNeueAnfrage } = await import('@/lib/email/send')
    await sendNeueAnfrage({ name, email, start_date, end_date, guest_count, message })
  } catch {
    // email module not yet configured
  }

  revalidatePath('/kalender')
  return { success: true }
}

export async function approveAnfrage(id: string) {
  const supabase = await createClient()

  const admin = await requireAdmin(supabase)
  if (!admin) return { error: 'Keine Berechtigung.' }

  const { data: request } = await supabase
    .from('visit_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (!request) return { error: 'Anfrage nicht gefunden.' }

  const { error: updateError } = await supabase
    .from('visit_requests')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (updateError) return { error: 'Fehler beim Bestätigen.' }

  // Create calendar entry
  await supabase.from('calendar_entries').insert({
    type: 'guest',
    title: `Besuch: ${request.name}`,
    start_date: request.start_date,
    end_date: request.end_date,
    linked_request_id: id,
  })

  try {
    const { sendAnfrageBestaetigt } = await import('@/lib/email/send')
    await sendAnfrageBestaetigt({
      name: request.name,
      email: request.email,
      start_date: request.start_date,
      end_date: request.end_date,
    })
  } catch {
    // email module not yet configured
  }

  revalidatePath('/admin/anfragen')
  revalidatePath('/kalender')
  return { success: true }
}

export async function rejectAnfrage(id: string) {
  const supabase = await createClient()

  const admin = await requireAdmin(supabase)
  if (!admin) return { error: 'Keine Berechtigung.' }

  const { data: request } = await supabase
    .from('visit_requests')
    .select('name, email, start_date, end_date')
    .eq('id', id)
    .single()

  if (!request) return { error: 'Anfrage nicht gefunden.' }

  const { error } = await supabase
    .from('visit_requests')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: 'Fehler beim Ablehnen.' }

  try {
    const { sendAnfrageAbgelehnt } = await import('@/lib/email/send')
    await sendAnfrageAbgelehnt({
      name: request.name,
      email: request.email,
      start_date: request.start_date,
      end_date: request.end_date,
    })
  } catch {
    // email module not yet configured
  }

  revalidatePath('/admin/anfragen')
  revalidatePath('/kalender')
  return { success: true }
}

export async function cancelAnfrage(id: string) {
  const supabase = await createClient()

  const admin = await requireAdmin(supabase)
  if (!admin) return { error: 'Keine Berechtigung.' }

  const { data: request } = await supabase
    .from('visit_requests')
    .select('name, email, start_date, end_date')
    .eq('id', id)
    .single()

  if (!request) return { error: 'Anfrage nicht gefunden.' }

  const { error } = await supabase
    .from('visit_requests')
    .update({ status: 'cancelled', reviewed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: 'Fehler beim Stornieren.' }

  // Delete the linked calendar entry
  await supabase
    .from('calendar_entries')
    .delete()
    .eq('linked_request_id', id)

  try {
    const { sendAnfrageStorniert } = await import('@/lib/email/send')
    await sendAnfrageStorniert({
      name: request.name,
      email: request.email,
      start_date: request.start_date,
      end_date: request.end_date,
    })
  } catch {
    // email module not yet configured
  }

  revalidatePath('/admin/anfragen')
  revalidatePath('/kalender')
  return { success: true }
}
