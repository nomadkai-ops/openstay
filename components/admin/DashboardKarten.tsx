'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  // Build modifiers for mini-calendar: all occupied dates
  const blockedDays = calendarEntries.flatMap(e => {
    const days: Date[] = []
    const start = parseISO(e.start_date)
    const end = parseISO(e.end_date)
    const cur = new Date(start)
    while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
    return days
  })

  const guestDays = approvedRequests.flatMap(r => {
    const days: Date[] = []
    const start = parseISO(r.start_date)
    const end = parseISO(r.end_date)
    const cur = new Date(start)
    while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
    return days
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/admin/anfragen">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">Offene Anfragen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-stone-800">{pendingRequests.length}</p>
              {pendingRequests.length > 0 && (
                <p className="text-xs text-amber-600 mt-1">Warten auf Prüfung</p>
              )}
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">Nächste Besuche</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingVisits.length === 0 ? (
              <p className="text-sm text-stone-400">Keine geplanten Besuche</p>
            ) : (
              <div className="space-y-2">
                {upcomingVisits.slice(0, 3).map(v => (
                  <div key={v.id} className="text-sm">
                    <p className="font-medium text-stone-700">{v.name}</p>
                    <p className="text-stone-400 text-xs">{formatDateRange(v.start_date, v.end_date)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Link href="/admin/nutzer">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">Neue Nutzer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-stone-800">{pendingUsers.length}</p>
              {pendingUsers.length > 0 && (
                <p className="text-xs text-indigo-600 mt-1">Warten auf Freischaltung</p>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Mini-calendar: read-only overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-stone-500">Kalenderübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <DayPicker
              locale={de}
              modifiers={{ blocked: blockedDays, guest: guestDays }}
              modifiersClassNames={{ blocked: 'rdp-day-blocked', guest: 'rdp-day-guest' }}
              showOutsideDays
            />
        </CardContent>
      </Card>
    </div>
  )
}
