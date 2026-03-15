'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAnfrage } from '@/lib/actions/anfragen'
import { dateRangesOverlap, formatDateRange } from '@/lib/utils/datum'
import type { CalendarEntry, VisitRequest } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  startDate: string
  endDate: string
  entries: CalendarEntry[]
  requests: VisitRequest[]
  prefillName?: string
  prefillEmail?: string
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function AnfrageFormContent({
  startDate,
  endDate,
  entries,
  requests,
  onSuccess,
  prefillName = '',
  prefillEmail = '',
}: {
  startDate: string
  endDate: string
  entries: CalendarEntry[]
  requests: VisitRequest[]
  onSuccess: () => void
  prefillName?: string
  prefillEmail?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const hasOverlap =
    entries.some(e => dateRangesOverlap(startDate, endDate, e.start_date, e.end_date)) ||
    requests.some(r => r.status === 'approved' && dateRangesOverlap(startDate, endDate, r.start_date, r.end_date))

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.set('start_date', startDate)
    formData.set('end_date', endDate)
    const result = await createAnfrage(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(onSuccess, 2000)
    }
  }

  if (success) {
    return (
      <div className="py-6 text-center space-y-2">
        <p className="text-lg font-medium text-stone-800">Anfrage gesendet!</p>
        <p className="text-sm text-stone-500">
          Deine Anfrage wurde erfolgreich gesendet. Ich prüfe sie und melde mich bald bei dir.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4 mt-2">
      <div className="rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-700">
        <span className="font-medium">Zeitraum:</span> {formatDateRange(startDate, endDate)}
      </div>

      {hasOverlap && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Hinweis: Dieser Zeitraum überschneidet sich mit einem bestehenden Eintrag. Du kannst die Anfrage trotzdem absenden.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={prefillName} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guest_count">Personen *</Label>
          <Input id="guest_count" name="guest_count" type="number" min="1" defaultValue="1" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">E-Mail *</Label>
        <Input id="email" name="email" type="email" defaultValue={prefillEmail} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Telefon (optional)</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="request_type">Art des Besuchs (optional)</Label>
        <Select name="request_type">
          <SelectTrigger>
            <SelectValue placeholder="Bitte wählen…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freunde">Freunde</SelectItem>
            <SelectItem value="familie">Familie</SelectItem>
            <SelectItem value="arbeit">Arbeit</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="sonstiges">Sonstiges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Nachricht *</Label>
        <Textarea id="message" name="message" placeholder="Kurze Beschreibung deines Besuchs…" rows={3} required />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Senden…' : 'Anfrage absenden'}
      </Button>
    </form>
  )
}

export function AnfrageModal({ open, onOpenChange, startDate, endDate, entries, requests, prefillName, prefillEmail }: Props) {
  const isMobile = useIsMobile()
  const title = 'Besuch anfragen'
  const description = 'Fülle das Formular aus und sende deine Anfrage ab.'

  const content = (
    <AnfrageFormContent
      startDate={startDate}
      endDate={endDate}
      entries={entries}
      requests={requests}
      onSuccess={() => onOpenChange(false)}
      prefillName={prefillName}
      prefillEmail={prefillEmail}
    />
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
