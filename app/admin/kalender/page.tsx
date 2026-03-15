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
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Kalender verwalten</h1>

      <KalenderBlockForm />

      <div className="mt-8 space-y-3">
        <h2 className="font-semibold text-stone-700">Bestehende Einträge</h2>
        {(entries ?? []).length === 0 && (
          <p className="text-stone-400 text-sm">Keine Einträge vorhanden.</p>
        )}
        {((entries ?? []) as CalendarEntry[]).map(entry => (
          <div key={entry.id} className="rounded-xl border border-stone-200 bg-white px-5 py-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-medium text-stone-800">{entry.title}</p>
              <p className="text-sm text-stone-500">{typeLabels[entry.type]} · {formatDateRange(entry.start_date, entry.end_date)}</p>
              {entry.notes && <p className="text-xs text-stone-400 mt-1">{entry.notes}</p>}
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
