'use client'

import { useState } from 'react'
import { createKalenderBlock } from '@/lib/actions/kalender'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function KalenderBlockForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createKalenderBlock(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-stone-700">Neuer Eintrag</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Von *</Label>
          <Input id="start_date" name="start_date" type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">Bis *</Label>
          <Input id="end_date" name="end_date" type="date" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="type">Typ *</Label>
          <Select name="type" required>
            <SelectTrigger>
              <SelectValue placeholder="Typ wählen…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="travel">Verreist</SelectItem>
              <SelectItem value="blocked">Blockiert</SelectItem>
              <SelectItem value="custom">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Titel *</Label>
          <Input id="title" name="title" placeholder="z.B. Urlaub" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notizen (intern)</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Eintrag erstellt!</p>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Speichern…' : 'Eintrag anlegen'}
      </Button>
    </form>
  )
}
