'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/anfragen', label: 'Anfragen' },
  { href: '/admin/kalender', label: 'Kalender' },
  { href: '/admin/nutzer', label: 'Nutzer' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col bg-black/25 backdrop-blur-xl border-r border-white/10 min-h-screen">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="font-bold text-white tracking-tight">OpenStay</p>
        <p className="text-xs text-white/40 mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            Abmelden
          </button>
        </form>
      </div>
    </aside>
  )
}
