'use client'

import { useState } from 'react'
import { approveAnfrage, rejectAnfrage, cancelAnfrage } from '@/lib/actions/anfragen'
import { formatDateRange } from '@/lib/utils/datum'
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

const statusClasses: Record<RequestStatus, string> = {
  pending: 'bg-amber-400/20 text-amber-200 border border-amber-300/30',
  approved: 'bg-green-400/20 text-green-200 border border-green-300/30',
  rejected: 'bg-red-400/20 text-red-200 border border-red-300/30',
  cancelled: 'bg-white/10 text-white/50 border border-white/20',
}

export function AnfragenTabelle({ requests }: { requests: VisitRequest[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id + '-approve')
    setActionError(null)
    try {
      const result = await approveAnfrage(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Bestätigen. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  async function handleReject(id: string) {
    setLoading(id + '-reject')
    setActionError(null)
    try {
      const result = await rejectAnfrage(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Ablehnen. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  async function handleCancel(id: string) {
    setLoading(id + '-cancel')
    setActionError(null)
    try {
      const result = await cancelAnfrage(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Stornieren. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
      setConfirmCancel(null)
    }
  }

  if (requests.length === 0) {
    return <p className="text-white/40 text-sm py-8 text-center">Keine Anfragen vorhanden.</p>
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map(r => (
          <div key={r.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-white">{r.name}</p>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusClasses[r.status]}`}>
                    {statusLabels[r.status]}
                  </span>
                </div>
                <p className="text-sm text-white/60">{r.email}{r.phone ? ` · ${r.phone}` : ''}</p>
                <p className="text-sm font-medium text-white mt-1">{formatDateRange(r.start_date, r.end_date)}</p>
                <p className="text-sm text-white/60">{r.guest_count} Person{r.guest_count !== 1 ? 'en' : ''}{r.request_type ? ` · ${r.request_type}` : ''}</p>
                {r.message && <p className="text-sm text-white/70 mt-2 italic">"{r.message}"</p>}
                <p className="text-xs text-white/30 mt-1">
                  Eingegangen: {new Date(r.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {r.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={loading === r.id + '-approve'}
                      className="bg-green-400/20 border border-green-300/30 text-green-200 text-xs px-3 py-1.5 rounded-lg hover:bg-green-400/30 transition-colors disabled:opacity-50"
                    >
                      {loading === r.id + '-approve' ? '…' : 'Bestätigen'}
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      disabled={loading === r.id + '-reject'}
                      className="bg-red-400/20 border border-red-300/30 text-red-200 text-xs px-3 py-1.5 rounded-lg hover:bg-red-400/30 transition-colors disabled:opacity-50"
                    >
                      {loading === r.id + '-reject' ? '…' : 'Ablehnen'}
                    </button>
                  </>
                )}
                {r.status === 'approved' && (
                  <button
                    onClick={() => setConfirmCancel(r.id)}
                    className="bg-white/10 border border-white/20 text-white/60 text-xs px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Stornieren
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!confirmCancel} onOpenChange={() => setConfirmCancel(null)}>
        <DialogContent className="bg-indigo-900/90 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Besuch stornieren?</DialogTitle>
            <DialogDescription className="text-white/60">
              Der Besucher wird per E-Mail über die Stornierung informiert und der Kalendereintrag wird entfernt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setConfirmCancel(null)}
              className="bg-white/10 border border-white/20 text-white/70 text-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => confirmCancel && handleCancel(confirmCancel)}
              disabled={!!loading}
              className="bg-red-400/20 border border-red-300/30 text-red-200 text-sm px-4 py-2 rounded-lg hover:bg-red-400/30 transition-colors disabled:opacity-50"
            >
              Ja, stornieren
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {actionError && <p role="alert" className="text-sm text-red-300 mt-4">{actionError}</p>}
    </>
  )
}
