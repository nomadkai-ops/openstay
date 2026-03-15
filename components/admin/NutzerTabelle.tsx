'use client'

import { useState } from 'react'
import { approveNutzer, blockNutzer } from '@/lib/actions/nutzer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Profile } from '@/types'

export function NutzerTabelle({ users }: { users: Profile[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleApprove(id: string) {
    setLoading(id + '-approve')
    await approveNutzer(id)
    setLoading(null)
  }

  async function handleBlock(id: string) {
    setLoading(id + '-block')
    await blockNutzer(id)
    setLoading(null)
  }

  if (users.length === 0) {
    return <p className="text-stone-400 text-sm py-8 text-center">Keine Nutzer vorhanden.</p>
  }

  return (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u.id} className="rounded-xl border border-stone-200 bg-white px-5 py-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-medium text-stone-800">{u.name}</p>
            <p className="text-sm text-stone-500">{u.email}</p>
            <p className="text-xs text-stone-400 mt-1">
              Registriert: {new Date(u.created_at).toLocaleDateString('de-DE')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={u.approved ? 'default' : 'secondary'}>
              {u.approved ? 'Freigeschaltet' : 'Ausstehend'}
            </Badge>
            {!u.approved ? (
              <Button
                size="sm"
                onClick={() => handleApprove(u.id)}
                disabled={loading === u.id + '-approve'}
              >
                {loading === u.id + '-approve' ? '…' : 'Freischalten'}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBlock(u.id)}
                disabled={loading === u.id + '-block'}
              >
                {loading === u.id + '-block' ? '…' : 'Sperren'}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
