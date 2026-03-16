'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@/components/ui/sheet'
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

const glassInput = 'bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40'
const glassLabel = 'text-white/80 text-sm'

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
      <div className="py-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-400/20 border border-green-400/30 flex items-center justify-center mx-auto">
          <span className="text-xl" aria-hidden="true">✓</span>
        </div>
        <p className="text-lg font-semibold text-white">Anfrage gesendet!</p>
        <p className="text-sm text-white/60">
          Deine Anfrage wurde erfolgreich gesendet. Ich prüfe sie und melde mich bald bei dir.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4 mt-2">
      <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white/80">
        <span className="font-medium text-white">Zeitraum:</span> {formatDateRange(startDate, endDate)}
      </div>

      {hasOverlap && (
        <div className="rounded-xl bg-amber-400/15 border border-amber-300/30 px-4 py-3 text-sm text-amber-200">
          Hinweis: Dieser Zeitraum überschneidet sich mit einem bestehenden Eintrag. Du kannst die Anfrage trotzdem absenden.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className={glassLabel}>Name *</Label>
          <Input id="name" name="name" defaultValue={prefillName} required className={glassInput} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guest_count" className={glassLabel}>Personen *</Label>
          <Input id="guest_count" name="guest_count" type="number" min="1" defaultValue="1" required className={glassInput} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className={glassLabel}>E-Mail *</Label>
        <Input id="email" name="email" type="email" defaultValue={prefillEmail} required className={glassInput} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className={glassLabel}>Telefon (optional)</Label>
        <Input id="phone" name="phone" type="tel" className={glassInput} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="request_type" className={glassLabel}>Art des Besuchs (optional)</Label>
        <Select name="request_type">
          <SelectTrigger className={glassInput}>
            <SelectValue placeholder="Bitte wählen…" />
          </SelectTrigger>
          <SelectContent className="bg-indigo-900 border-white/20 text-white">
            <SelectItem value="freunde" className="focus:bg-white/10 focus:text-white">Freunde</SelectItem>
            <SelectItem value="familie" className="focus:bg-white/10 focus:text-white">Familie</SelectItem>
            <SelectItem value="arbeit" className="focus:bg-white/10 focus:text-white">Arbeit</SelectItem>
            <SelectItem value="event" className="focus:bg-white/10 focus:text-white">Event</SelectItem>
            <SelectItem value="sonstiges" className="focus:bg-white/10 focus:text-white">Sonstiges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className={glassLabel}>Nachricht *</Label>
        <Textarea id="message" name="message" placeholder="Kurze Beschreibung deines Besuchs…" rows={3} required className={glassInput} />
      </div>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-indigo-700 font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Senden…' : 'Anfrage absenden'}
      </button>
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
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto rounded-t-2xl bg-indigo-900/95 backdrop-blur-xl border-t border-white/20 text-white"
        >
          <SheetHeader>
            <SheetTitle className="text-white">{title}</SheetTitle>
            <SheetDescription className="text-white/60">{description}</SheetDescription>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-indigo-900/90 backdrop-blur-xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-white/60">{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
