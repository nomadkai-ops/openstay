'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80 text-sm">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="deine@email.de"
          required
          autoComplete="email"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/80 text-sm">Passwort</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-white/40 focus-visible:border-white/40"
        />
      </div>
      {error && (
        <p className="text-sm text-red-300">{error}</p>
      )}
      <Button
        type="submit"
        className="w-full bg-white text-indigo-700 font-semibold hover:bg-white/90"
        disabled={loading}
      >
        {loading ? 'Anmelden…' : 'Anmelden'}
      </Button>
      <p className="text-center text-sm text-white/60">
        Noch kein Account?{' '}
        <Link href="/registrieren" className="text-white hover:underline font-medium">
          Registrieren
        </Link>
      </p>
    </form>
  )
}
