'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
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
    <aside className="w-56 shrink-0 border-r border-stone-200 bg-white min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-stone-100">
        <p className="font-semibold text-stone-800">OpenStay</p>
        <p className="text-xs text-stone-400 mt-0.5">Admin</p>
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
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-stone-100">
        <form action={logout}>
          <Button variant="ghost" type="submit" className="w-full justify-start text-stone-500 text-sm">
            Abmelden
          </Button>
        </form>
      </div>
    </aside>
  )
}
