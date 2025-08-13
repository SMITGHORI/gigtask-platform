import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is admin
  const userData = await getCurrentUser()
  
  if (!userData) {
    redirect('/auth/login?redirect=/admin')
  }

  if (userData.profile.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminHeader user={userData} />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
