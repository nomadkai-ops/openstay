import { formatDateRange } from '@/lib/utils/datum'
import { Badge } from '@/components/ui/badge'
import type { VisitRequest, RequestStatus } from '@/types'

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Ausstehend',
  approved: 'Bestätigt',
  rejected: 'Abgelehnt',
  cancelled: 'Storniert',
}

const statusVariants: Record<RequestStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  cancelled: 'outline',
}

export function AnfragenListe({ requests }: { requests: VisitRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <p className="text-sm">Du hast noch keine Anfragen gestellt.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map(r => (
        <div key={r.id} className="rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-stone-800">{formatDateRange(r.start_date, r.end_date)}</p>
              <p className="text-sm text-stone-500 mt-0.5">{r.guest_count} Person{r.guest_count !== 1 ? 'en' : ''}</p>
              {r.message && <p className="text-sm text-stone-600 mt-2">{r.message}</p>}
            </div>
            <Badge variant={statusVariants[r.status]}>{statusLabels[r.status]}</Badge>
          </div>
          <p className="text-xs text-stone-400 mt-3">
            Angefragt am {new Date(r.created_at).toLocaleDateString('de-DE')}
          </p>
        </div>
      ))}
    </div>
  )
}
