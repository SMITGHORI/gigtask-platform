'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FolderOpen, 
  MessageSquare, 
  CreditCard, 
  Settings,
  BarChart3,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Gigs', href: '/admin/gigs', icon: Briefcase },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black border-r border-white/10 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#a3b18a] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            <span className="text-white text-xl font-bold animated-gradient-text">KaamKonnect</span>
          </Link>
        </div>
        
        {/* Back to Main Site */}
        <div className="border-b border-white/10 pb-4">
          <Link 
            href="/" 
            className="flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Main Site
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                                          <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? 'bg-[#a3b18a]/10 text-[#a3b18a] border-r-2 border-[#a3b18a]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )}
                      >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
