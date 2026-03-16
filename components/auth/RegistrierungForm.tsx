'use client'

import { useState } from 'react'
import { register } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function RegistrierungForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setLoading(false)
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-2">
        <p className="text-white font-medium">Registrierung erfolgreich!</p>
        <p className="text-sm text-white/60">
          Bitte bestätige deine E-Mail-Adresse. Danach wird dein Account vom Admin freigeschaltet.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/80 text-sm">Name</Label>
        <Input id="name" name="name" placeholder="Dein Name" required autoComplete="name"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80 text-sm">E-Mail</Label>
        <Input id="email" name="email" type="email" placeholder="deine@email.de" required autoComplete="email"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/80 text-sm">Passwort</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40" />
      </div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <Button type="submit" className="w-full bg-white text-indigo-700 font-semibold hover:bg-white/90" disabled={loading}>
        {loading ? 'Registrieren…' : 'Account erstellen'}
      </Button>
      <p className="text-center text-sm text-white/60">
        Bereits registriert?{' '}
        <Link href="/login" className="text-white font-medium hover:underline">
          Anmelden
        </Link>
      </p>
    </form>
  )
}
