'use client'

import { useState, useMemo } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { de } from 'date-fns/locale'
import { isBefore } from 'date-fns'
import type { CalendarEntry, VisitRequest } from '@/types'
import { AnfrageModal } from './AnfrageModal'
import { toDateStr, formatDateRange } from '@/lib/utils/datum'

interface Props {
  entries: CalendarEntry[]
  requests: VisitRequest[]
  currentUserId: string
  prefillName: string
  prefillEmail: string
}

function getDayStatus(date: Date, entries: CalendarEntry[], requests: VisitRequest[], userId: string) {
  const dateStr = toDateStr(date)

  const myRequest = requests.find(r =>
    r.user_id === userId &&
    dateStr >= r.start_date &&
    dateStr <= r.end_date
  )
  if (myRequest) return myRequest.status

  const hasApprovedOther = requests.some(r =>
    r.user_id !== userId &&
    r.status === 'approved' &&
    dateStr >= r.start_date &&
    dateStr <= r.end_date
  )
  if (hasApprovedOther) return 'other-approved'

  const entry = entries.find(e => dateStr >= e.start_date && dateStr <= e.end_date)
  if (entry) {
    return entry.type === 'guest' ? 'other-approved' : 'blocked'
  }

  return 'free'
}

export function KalenderAnsicht({ entries, requests, currentUserId, prefillName, prefillEmail }: Props) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [modalOpen, setModalOpen] = useState(false)

  function handleSelect(range: DateRange | undefined) {
    setSelectedRange(range)
    // Do NOT open modal here — user clicks the selection bar button instead
  }

  const hasValidRange = !!(
    selectedRange?.from &&
    selectedRange?.to &&
    toDateStr(selectedRange.from) !== toDateStr(selectedRange.to)
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const modifiers = useMemo(() => ({
    blocked: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'blocked',
    otherApproved: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'other-approved',
    myPending: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'pending',
    myApproved: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'approved',
    myRejected: (day: Date) => getDayStatus(day, entries, requests, currentUserId) === 'rejected',
    pastDay: (day: Date) => isBefore(day, today),
  }), [entries, requests, currentUserId])  // eslint-disable-line react-hooks/exhaustive-deps

  const modifiersClassNames = {
    blocked: 'rdp-day-blocked',
    otherApproved: 'rdp-day-other-approved',
    myPending: 'rdp-day-my-pending',
    myApproved: 'rdp-day-my-approved',
    myRejected: 'rdp-day-my-rejected',
    pastDay: 'rdp-day-past',
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white/25 inline-block" /> Blockiert
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-400/70 inline-block" /> Belegt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400/70 inline-block" /> Meine Anfrage (ausstehend)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400/60 inline-block" /> Meine Anfrage (bestätigt)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/60 inline-block" /> Meine Anfrage (abgelehnt)
        </span>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          locale={de}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          showOutsideDays
          disabled={[{ before: new Date() }]}
        />
      </div>

      {/* Selection bar — shown when a valid range is selected */}
      {hasValidRange && selectedRange?.from && selectedRange?.to && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wide font-semibold mb-0.5">Ausgewählter Zeitraum</p>
            <p className="text-white font-semibold">
              {formatDateRange(toDateStr(selectedRange.from), toDateStr(selectedRange.to))}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setSelectedRange(undefined)}
              className="text-white/50 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-white text-indigo-700 font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
            >
              Anfrage stellen →
            </button>
          </div>
        </div>
      )}

      {hasValidRange && selectedRange?.from && selectedRange?.to && (
        <AnfrageModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open)
            if (!open) setSelectedRange(undefined)
          }}
          startDate={toDateStr(selectedRange.from)}
          endDate={toDateStr(selectedRange.to)}
          entries={entries}
          requests={requests}
          prefillName={prefillName}
          prefillEmail={prefillEmail}
        />
      )}
    </div>
  )
}
