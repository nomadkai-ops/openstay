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

export async function approveNutzer(userId: string) {
  const supabase = await createClient()

  const admin = await requireAdmin(supabase)
  if (!admin) return { error: 'Keine Berechtigung.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', userId)
    .single()

  if (!profile) return { error: 'Nutzer nicht gefunden.' }

  const { error } = await supabase
    .from('profiles')
    .update({ approved: true })
    .eq('id', userId)

  if (error) return { error: 'Fehler beim Freischalten.' }

  try {
    const { sendAccountFreigeschaltet } = await import('@/lib/email/send')
    await sendAccountFreigeschaltet({ name: profile.name, email: profile.email })
  } catch {
    // email module not yet configured
  }

  revalidatePath('/admin/nutzer')
  return { success: true }
}

export async function blockNutzer(userId: string) {
  const supabase = await createClient()

  const admin = await requireAdmin(supabase)
  if (!admin) return { error: 'Keine Berechtigung.' }

  const { error } = await supabase
    .from('profiles')
    .update({ approved: false })
    .eq('id', userId)

  if (error) return { error: 'Fehler beim Sperren.' }

  revalidatePath('/admin/nutzer')
  return { success: true }
}
