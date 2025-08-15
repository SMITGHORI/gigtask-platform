import { Suspense } from 'react'
import { createServerClient } from '@/lib/auth-server'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'

async function getDashboardData() {
  const supabase = createServerClient()

  try {
    // Get total counts
    const [
      { count: totalUsers },
      { count: totalGigs },
      { count: activeGigs },
      { count: totalApplications },
      { data: recentGigs },
      { data: recentUsers }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('gigs').select('*', { count: 'exact', head: true }),
      supabase.from('gigs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('gigs').select(`
        id, title, status, created_at,
        profiles!gigs_client_id_fkey (full_name),
        categories (name)
      `).order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false }).limit(5)
    ])

    // Calculate total revenue (mock data for now)
    const totalRevenue = 125430 // This would come from payments table

    return {
      stats: {
        totalUsers: totalUsers || 0,
        totalGigs: totalGigs || 0,
        activeGigs: activeGigs || 0,
        totalApplications: totalApplications || 0,
        totalRevenue
      },
      recentGigs: recentGigs || [],
      recentUsers: recentUsers || []
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      stats: {
        totalUsers: 0,
        totalGigs: 0,
        activeGigs: 0,
        totalApplications: 0,
        totalRevenue: 0
      },
      recentGigs: [],
      recentUsers: []
    }
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const statsCards = [
    {
      title: 'Total Users',
      value: data.stats.totalUsers,
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Gigs',
      value: data.stats.totalGigs,
      icon: Briefcase,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Gigs',
      value: data.stats.activeGigs,
      icon: TrendingUp,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Revenue',
      value: `₹${data.stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+15%',
      changeType: 'positive' as const
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white animated-gradient-text">Dashboard</h1>
        <p className="text-gray-300">Overview of your platform performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-[#a3b18a]' : 'text-red-400'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-[#a3b18a]/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-[#a3b18a]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Gigs */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Recent Gigs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentGigs.map((gig: any) => (
                <div key={gig.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                  <div>
                    <h4 className="font-medium text-white">{gig.title}</h4>
                    <p className="text-sm text-gray-400">
                      by {gig.profiles?.full_name} • {gig.categories?.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    gig.status === 'published' 
                      ? 'bg-[#a3b18a]/20 text-[#a3b18a]'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {gig.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                  <div>
                    <h4 className="font-medium text-white">{user.full_name || 'Unnamed User'}</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400'
                      : user.role === 'client'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
