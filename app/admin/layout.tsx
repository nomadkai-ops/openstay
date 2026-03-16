import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <AdminMobileNav />
      <main className="flex-1 pt-16 pb-20 px-4 md:pt-8 md:pb-8 md:px-8">
        {children}
      </main>
    </div>
  )
}
