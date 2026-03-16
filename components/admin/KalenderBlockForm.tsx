'use client'

import { useState } from 'react'
import { createKalenderBlock } from '@/lib/actions/kalender'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const gi = 'bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40'
const gl = 'text-white/80 text-sm'

export function KalenderBlockForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      const result = await createKalenderBlock(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <h2 className="font-semibold text-white text-lg">Neuer Eintrag</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start_date" className={gl}>Von *</Label>
          <Input id="start_date" name="start_date" type="date" required className={gi} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date" className={gl}>Bis *</Label>
          <Input id="end_date" name="end_date" type="date" required className={gi} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="type" className={gl}>Typ *</Label>
          <Select name="type" required>
            <SelectTrigger className={gi}>
              <SelectValue placeholder="Typ wählen…" />
            </SelectTrigger>
            <SelectContent className="bg-indigo-900 border-white/20 text-white">
              <SelectItem value="travel" className="focus:bg-white/10 focus:text-white">Verreist</SelectItem>
              <SelectItem value="blocked" className="focus:bg-white/10 focus:text-white">Blockiert</SelectItem>
              <SelectItem value="custom" className="focus:bg-white/10 focus:text-white">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title" className={gl}>Titel *</Label>
          <Input id="title" name="title" placeholder="z.B. Urlaub" required className={gi} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes" className={gl}>Notizen (intern)</Label>
        <Textarea id="notes" name="notes" rows={2} className={gi} />
      </div>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {success && <p className="text-sm text-green-300">Eintrag erstellt!</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Speichern…' : 'Eintrag anlegen'}
      </button>
    </form>
  )
}
