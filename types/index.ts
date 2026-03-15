export type UserRole = 'admin' | 'user'
export type EntryType = 'travel' | 'blocked' | 'guest' | 'custom'
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type RequestType = 'freunde' | 'familie' | 'arbeit' | 'event' | 'sonstiges'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  approved: boolean
  created_at: string
}

export interface CalendarEntry {
  id: string
  type: EntryType
  title: string
  start_date: string
  end_date: string
  notes: string | null
  linked_request_id: string | null
  created_at: string
}

export interface VisitRequest {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  guest_count: number
  message: string
  request_type: RequestType | null
  start_date: string
  end_date: string
  status: RequestStatus
  created_at: string
  reviewed_at: string | null
  admin_notes: string | null
}

export interface DateRange {
  from: Date
  to: Date
}
