import { createClient } from '@/lib/supabase/server'
import { KalenderBlockForm } from '@/components/admin/KalenderBlockForm'
import { deleteKalenderBlock } from '@/lib/actions/kalender'
import { formatDateRange } from '@/lib/utils/datum'
import { Button } from '@/components/ui/button'
import type { CalendarEntry } from '@/types'

const typeLabels: Record<string, string> = {
  travel: 'Verreist',
  blocked: 'Blockiert',
  guest: 'Besuch',
  custom: 'Sonstiges',
}

export default async function AdminKalenderPage() {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from('calendar_entries')
    .select('*')
    .order('start_date', { ascending: false })

  async function handleDelete(formData: FormData) {
    'use server'
    await deleteKalenderBlock(formData.get('id') as string)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">Kalender verwalten</h1>

      <KalenderBlockForm />

      <div className="mt-8 space-y-3">
        <h2 className="font-semibold text-white/60">Bestehende Einträge</h2>
        {(entries ?? []).length === 0 && (
          <p className="text-white/40 text-sm">Keine Einträge vorhanden.</p>
        )}
        {((entries ?? []) as CalendarEntry[]).map(entry => (
          <div key={entry.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-white">{entry.title}</p>
              <p className="text-sm text-white/60">{typeLabels[entry.type]} · {formatDateRange(entry.start_date, entry.end_date)}</p>
              {entry.notes && <p className="text-xs text-white/40 mt-1">{entry.notes}</p>}
            </div>
            {!entry.linked_request_id && (
              <form action={handleDelete}>
                <input type="hidden" name="id" value={entry.id} />
                <Button size="sm" variant="ghost" type="submit" className="text-red-500 hover:text-red-700">
                  Löschen
                </Button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
