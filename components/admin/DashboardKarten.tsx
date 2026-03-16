'use client'

import Link from 'next/link'
import { DayPicker } from 'react-day-picker'
import { de } from 'date-fns/locale'
import { parseISO } from 'date-fns'
import { formatDateRange } from '@/lib/utils/datum'
import type { VisitRequest, Profile, CalendarEntry } from '@/types'

interface Props {
  pendingRequests: VisitRequest[]
  upcomingVisits: VisitRequest[]
  pendingUsers: Profile[]
  calendarEntries: CalendarEntry[]
  approvedRequests: VisitRequest[]
}

export function DashboardKarten({ pendingRequests, upcomingVisits, pendingUsers, calendarEntries, approvedRequests }: Props) {
  const blockedDays = calendarEntries.flatMap(e => {
    const days: Date[] = []
    const cur = new Date(parseISO(e.start_date))
    const end = parseISO(e.end_date)
    while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
    return days
  })

  const guestDays = approvedRequests.flatMap(r => {
    const days: Date[] = []
    const cur = new Date(parseISO(r.start_date))
    const end = parseISO(r.end_date)
    while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
    return days
  })

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/anfragen">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center mb-4">
              <span className="text-lg" aria-hidden="true">📋</span>
            </div>
            <p className="text-4xl font-bold text-white">{pendingRequests.length}</p>
            <p className="text-white/60 text-sm mt-1">Offene Anfragen</p>
            {pendingRequests.length > 0 && (
              <p className="text-amber-300 text-xs mt-1">Warten auf Prüfung</p>
            )}
          </div>
        </Link>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-green-400/20 border border-green-300/30 flex items-center justify-center mb-4">
            <span className="text-lg" aria-hidden="true">🏡</span>
          </div>
          <p className="text-white/60 text-sm mb-3">Nächste Besuche</p>
          {upcomingVisits.length === 0 ? (
            <p className="text-white/40 text-sm">Keine geplanten Besuche</p>
          ) : (
            <div className="space-y-2">
              {upcomingVisits.slice(0, 3).map(v => (
                <div key={v.id}>
                  <p className="font-semibold text-white text-sm">{v.name}</p>
                  <p className="text-white/50 text-xs">{formatDateRange(v.start_date, v.end_date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link href="/admin/nutzer">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/20 border border-indigo-300/30 flex items-center justify-center mb-4">
              <span className="text-lg" aria-hidden="true">👥</span>
            </div>
            <p className="text-4xl font-bold text-white">{pendingUsers.length}</p>
            <p className="text-white/60 text-sm mt-1">Neue Nutzer</p>
            {pendingUsers.length > 0 && (
              <p className="text-indigo-300 text-xs mt-1">Warten auf Freischaltung</p>
            )}
          </div>
        </Link>
      </div>

      {/* Mini calendar */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <p className="text-white/60 text-sm font-semibold uppercase tracking-wide mb-4">Kalenderübersicht</p>
        <DayPicker
          locale={de}
          modifiers={{ blocked: blockedDays, guest: guestDays }}
          modifiersClassNames={{ blocked: 'rdp-day-blocked', guest: 'rdp-day-other-approved' }}
          showOutsideDays
        />
      </div>
    </div>
  )
}
