'use client'

import { useState } from 'react'
import { approveAnfrage, rejectAnfrage, cancelAnfrage } from '@/lib/actions/anfragen'
import { formatDateRange } from '@/lib/utils/datum'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import type { VisitRequest, RequestStatus } from '@/types'

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Ausstehend',
  approved: 'Bestätigt',
  rejected: 'Abgelehnt',
  cancelled: 'Storniert',
}

export function AnfragenTabelle({ requests }: { requests: VisitRequest[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id + '-approve')
    await approveAnfrage(id)
    setLoading(null)
  }

  async function handleReject(id: string) {
    setLoading(id + '-reject')
    await rejectAnfrage(id)
    setLoading(null)
  }

  async function handleCancel(id: string) {
    setLoading(id + '-cancel')
    await cancelAnfrage(id)
    setLoading(null)
    setConfirmCancel(null)
  }

  if (requests.length === 0) {
    return <p className="text-stone-400 text-sm py-8 text-center">Keine Anfragen vorhanden.</p>
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map(r => (
          <div key={r.id} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-stone-800">{r.name}</p>
                  <Badge
                    variant={r.status === 'approved' ? 'default' : r.status === 'rejected' || r.status === 'cancelled' ? 'destructive' : 'secondary'}
                  >
                    {statusLabels[r.status]}
                  </Badge>
                </div>
                <p className="text-sm text-stone-500">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
                <p className="text-sm font-medium text-stone-700 mt-1">{formatDateRange(r.start_date, r.end_date)}</p>
                <p className="text-sm text-stone-500">{r.guest_count} Person{r.guest_count !== 1 ? 'en' : ''}{r.request_type ? ` · ${r.request_type}` : ''}</p>
                {r.message && <p className="text-sm text-stone-600 mt-2 italic">"{r.message}"</p>}
                <p className="text-xs text-stone-400 mt-1">
                  Eingegangen: {new Date(r.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {r.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(r.id)}
                      disabled={loading === r.id + '-approve'}
                    >
                      {loading === r.id + '-approve' ? '…' : 'Bestätigen'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(r.id)}
                      disabled={loading === r.id + '-reject'}
                    >
                      {loading === r.id + '-reject' ? '…' : 'Ablehnen'}
                    </Button>
                  </>
                )}
                {r.status === 'approved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmCancel(r.id)}
                  >
                    Stornieren
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!confirmCancel} onOpenChange={() => setConfirmCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Besuch stornieren?</DialogTitle>
            <DialogDescription>
              Der Besucher wird per E-Mail über die Stornierung informiert und der Kalendereintrag wird entfernt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(null)}>Abbrechen</Button>
            <Button
              variant="destructive"
              onClick={() => confirmCancel && handleCancel(confirmCancel)}
              disabled={!!loading}
            >
              Ja, stornieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
