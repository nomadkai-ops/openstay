import { formatDateRange } from '@/lib/utils/datum'
import type { VisitRequest, RequestStatus } from '@/types'

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Ausstehend',
  approved: 'Bestätigt',
  rejected: 'Abgelehnt',
  cancelled: 'Storniert',
}

const statusClasses: Record<RequestStatus, string> = {
  pending: 'bg-amber-400/20 text-amber-200 border border-amber-300/30',
  approved: 'bg-green-400/20 text-green-200 border border-green-300/30',
  rejected: 'bg-red-400/20 text-red-200 border border-red-300/30',
  cancelled: 'bg-white/10 text-white/50 border border-white/20',
}

export function AnfragenListe({ requests }: { requests: VisitRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <p className="text-sm">Du hast noch keine Anfragen gestellt.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map(r => (
        <div key={r.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-white">{formatDateRange(r.start_date, r.end_date)}</p>
              <p className="text-sm text-white/60 mt-0.5">{r.guest_count} Person{r.guest_count !== 1 ? 'en' : ''}</p>
              {r.message && <p className="text-sm text-white/70 mt-2">{r.message}</p>}
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusClasses[r.status]}`}>
              {statusLabels[r.status]}
            </span>
          </div>
          <p className="text-xs text-white/30 mt-3">
            Angefragt am {new Date(r.created_at).toLocaleDateString('de-DE')}
          </p>
        </div>
      ))}
    </div>
  )
}
