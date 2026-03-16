import { createClient } from '@/lib/supabase/server'
import { DashboardKarten } from '@/components/admin/DashboardKarten'
import type { VisitRequest, Profile, CalendarEntry } from '@/types'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const [pendingReqResult, upcomingResult, pendingUsersResult, entriesResult, approvedReqResult] = await Promise.all([
    supabase.from('visit_requests').select('*').eq('status', 'pending').order('created_at'),
    supabase.from('visit_requests').select('*').eq('status', 'approved').gte('end_date', today).order('start_date').limit(3),
    supabase.from('profiles').select('*').eq('approved', false).eq('role', 'user').order('created_at'),
    supabase.from('calendar_entries').select('*').order('start_date'),
    supabase.from('visit_requests').select('*').eq('status', 'approved').gte('end_date', today).order('start_date'),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
      <DashboardKarten
        pendingRequests={(pendingReqResult.data ?? []) as VisitRequest[]}
        upcomingVisits={(upcomingResult.data ?? []) as VisitRequest[]}
        pendingUsers={(pendingUsersResult.data ?? []) as Profile[]}
        calendarEntries={(entriesResult.data ?? []) as CalendarEntry[]}
        approvedRequests={(approvedReqResult.data ?? []) as VisitRequest[]}
      />
    </div>
  )
}
