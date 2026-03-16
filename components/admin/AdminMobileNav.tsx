'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/admin', label: 'Dashboard', exact: true, icon: '⊞' },
  { href: '/admin/anfragen', label: 'Anfragen', icon: '📋' },
  { href: '/admin/kalender', label: 'Kalender', icon: '📅' },
  { href: '/admin/nutzer', label: 'Nutzer', icon: '👥' },
]

export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Fixed top header bar — mobile only */}
      <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-black/30 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <span className="font-bold text-white tracking-tight">OpenStay Admin</span>
      </header>

      {/* Fixed bottom tab bar — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/35 backdrop-blur-xl border-t border-white/15">
        <div className="flex items-center justify-around px-2 py-1">
          {tabs.map(tab => {
            const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-0',
                  active ? 'text-white' : 'text-white/45'
                )}
              >
                <span className="text-lg leading-none" aria-hidden="true">{tab.icon}</span>
                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
