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
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-2">
        <p className="text-stone-700 font-medium">Registrierung erfolgreich!</p>
        <p className="text-sm text-stone-500">
          Bitte bestätige deine E-Mail-Adresse. Danach wird dein Account vom Admin freigeschaltet.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Dein Name" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input id="email" name="email" type="email" placeholder="deine@email.de" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Passwort</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Registrieren…' : 'Account erstellen'}
      </Button>
      <p className="text-center text-sm text-stone-500">
        Bereits registriert?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Anmelden
        </Link>
      </p>
    </form>
  )
}
