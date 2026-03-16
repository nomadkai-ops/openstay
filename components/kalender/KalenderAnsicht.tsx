'use client'

import { useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { de } from 'date-fns/locale'
import { isBefore } from 'date-fns'
import type { CalendarEntry, VisitRequest } from '@/types'
import { AnfrageModal } from './AnfrageModal'
import { toDateStr } from '@/lib/utils/datum'

interface Props {
  entries: CalendarEntry[]
  requests: VisitRequest[]
  currentUserId: string
  isAdmin: boolean
  prefillName: string
  prefillEmail: string
}

function getDayStatus(date: Date, entries: CalendarEntry[], requests: VisitRequest[], userId: string) {
  const dateStr = toDateStr(date)

  // Own requests take highest priority
  const myRequest = requests.find(r =>
    r.user_id === userId &&
    dateStr >= r.start_date &&
    dateStr <= r.end_date
  )
  if (myRequest) return myRequest.status

  // Other users' approved visits → blue "Belegt"
  const hasApprovedOther = requests.some(r =>
    r.user_id !== userId &&
    r.status === 'approved' &&
    dateStr >= r.start_date &&
    dateStr <= r.end_date
  )
  if (hasApprovedOther) return 'other-approved'

  // Calendar entries: guest type entries (auto-created on approval) → blue
  // travel/blocked/custom entries → grey
  const entry = entries.find(e => dateStr >= e.start_date && dateStr <= e.end_date)
  if (entry) {
    return entry.type === 'guest' ? 'other-approved' : 'blocked'
  }

  return 'free'
}

export function KalenderAnsicht({ entries, requests, currentUserId, isAdmin, prefillName, prefillEmail }: Props) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [modalOpen, setModalOpen] = useState(false)

  function handleSelect(range: DateRange | undefined) {
    setSelectedRange(range)
    if (range?.from && range?.to && toDateStr(range.from) !== toDateStr(range.to)) {
      setModalOpen(true)
    }
  }

  const modifiers = {
    blocked: (day: Date) => {
      const status = getDayStatus(day, entries, requests, currentUserId)
      return status === 'blocked'
    },
    otherApproved: (day: Date) => {
      const status = getDayStatus(day, entries, requests, currentUserId)
      return status === 'other-approved'
    },
    myPending: (day: Date) => {
      const status = getDayStatus(day, entries, requests, currentUserId)
      return status === 'pending'
    },
    myApproved: (day: Date) => {
      const status = getDayStatus(day, entries, requests, currentUserId)
      return status === 'approved'
    },
    myRejected: (day: Date) => {
      const status = getDayStatus(day, entries, requests, currentUserId)
      return status === 'rejected'
    },
    pastDay: (day: Date) => isBefore(day, new Date(new Date().setHours(0,0,0,0))),
  }

  const modifiersClassNames = {
    blocked: 'rdp-day-blocked',
    otherApproved: 'rdp-day-other-approved',
    myPending: 'rdp-day-my-pending',
    myApproved: 'rdp-day-my-approved',
    myRejected: 'rdp-day-my-rejected',
    pastDay: 'rdp-day-past',
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 text-xs text-stone-600">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-stone-200 inline-block" /> Blockiert</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-200 inline-block" /> Belegt</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-200 inline-block" /> Meine Anfrage (ausstehend)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-200 inline-block" /> Meine Anfrage (bestätigt)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-200 inline-block" /> Meine Anfrage (abgelehnt)</span>
      </div>

      <div className="flex justify-center">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={handleSelect}
        locale={de}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        showOutsideDays
        className="rdp-custom"
        disabled={[
          { before: new Date() },
        ]}
      />
      </div>

      {selectedRange?.from && selectedRange?.to && (
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
