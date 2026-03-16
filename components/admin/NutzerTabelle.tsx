'use client'

import { useState } from 'react'
import { approveNutzer, blockNutzer } from '@/lib/actions/nutzer'
import type { Profile } from '@/types'

export function NutzerTabelle({ users }: { users: Profile[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id + '-approve')
    setActionError(null)
    try {
      const result = await approveNutzer(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Freischalten. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  async function handleBlock(id: string) {
    setLoading(id + '-block')
    setActionError(null)
    try {
      const result = await blockNutzer(id)
      if (result?.error) setActionError(result.error)
    } catch {
      setActionError('Fehler beim Sperren. Bitte versuche es erneut.')
    } finally {
      setLoading(null)
    }
  }

  if (users.length === 0) {
    return <p className="text-white/40 text-sm py-8 text-center">Keine Nutzer vorhanden.</p>
  }

  return (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-white">{u.name}</p>
            <p className="text-sm text-white/60">{u.email}</p>
            <p className="text-xs text-white/30 mt-1">
              Registriert: {new Date(u.created_at).toLocaleDateString('de-DE', { timeZone: 'UTC' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              u.approved
                ? 'bg-green-400/20 text-green-200 border border-green-300/30'
                : 'bg-amber-400/20 text-amber-200 border border-amber-300/30'
            }`}>
              {u.approved ? 'Freigeschaltet' : 'Ausstehend'}
            </span>
            {!u.approved ? (
              <button
                onClick={() => handleApprove(u.id)}
                disabled={loading === u.id + '-approve'}
                className="bg-white/15 border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/25 transition-colors disabled:opacity-50"
              >
                {loading === u.id + '-approve' ? '…' : 'Freischalten'}
              </button>
            ) : (
              <button
                onClick={() => handleBlock(u.id)}
                disabled={loading === u.id + '-block'}
                className="bg-red-400/15 border border-red-300/20 text-red-200 text-xs px-3 py-1.5 rounded-lg hover:bg-red-400/25 transition-colors disabled:opacity-50"
              >
                {loading === u.id + '-block' ? '…' : 'Sperren'}
              </button>
            )}
          </div>
        </div>
      ))}
      {actionError && <p role="alert" className="text-sm text-red-300 mt-4">{actionError}</p>}
    </div>
  )
}
