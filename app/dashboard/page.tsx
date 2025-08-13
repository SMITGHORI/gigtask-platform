import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createServerClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Clock, DollarSign, Star, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

async function getUserDashboardData(userId: string, userRole: string) {
  const supabase = createServerClient()

  try {
    if (userRole === 'client') {
      // Get client's gigs and applications
      const [
        { data: gigs, count: totalGigs },
        { data: applications, count: totalApplications }
      ] = await Promise.all([
        supabase.from('gigs').select('*', { count: 'exact' })
          .eq('client_id', userId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('applications').select(`
          *, gigs!inner(client_id)
        `, { count: 'exact' })
          .eq('gigs.client_id', userId)
      ])

      return {
        userType: 'client',
        stats: {
          totalGigs: totalGigs || 0,
          totalApplications: totalApplications || 0,
          activeGigs: gigs?.filter(g => g.status === 'published').length || 0,
          completedGigs: gigs?.filter(g => g.status === 'completed').length || 0
        },
        recentGigs: gigs || [],
        recentApplications: applications?.slice(0, 5) || []
      }
    } else {
      // Get freelancer's applications and completed work
      const [
        { data: applications, count: totalApplications },
        { data: completedWork }
      ] = await Promise.all([
        supabase.from('applications').select(`
          *, gigs(*)
        `, { count: 'exact' })
          .eq('freelancer_id', userId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('gigs').select('*')
          .eq('status', 'completed')
          // This would need a junction table in real implementation
      ])

      return {
        userType: 'freelancer',
        stats: {
          totalApplications: totalApplications || 0,
          acceptedApplications: applications?.filter(a => a.status === 'accepted').length || 0,
          pendingApplications: applications?.filter(a => a.status === 'pending').length || 0,
          completedJobs: 0 // Would come from completed gigs
        },
        recentApplications: applications || [],
        availableGigs: [] // Would fetch available gigs
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      userType: userRole,
      stats: {},
      recentGigs: [],
      recentApplications: []
    }
  }
}

export default async function DashboardPage() {
  const userData = await getCurrentUser()
  
  if (!userData) {
    redirect('/auth/login?redirect=/dashboard')
  }

  const dashboardData = await getUserDashboardData(userData.user.id, userData.profile.role)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white animated-gradient-text">
              Welcome back, {userData.profile.full_name || 'User'}!
            </h1>
            <p className="text-gray-300">
              {userData.profile.role === 'client' 
                ? 'Manage your posted gigs and find the best talent'
                : 'Discover new opportunities and track your applications'
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {userData.profile.role === 'client' ? (
              <>
                <Link href="/gigs/new">
                  <Button className="w-full h-16 bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80">
                    <Plus className="mr-2 h-5 w-5" />
                    Post New Gig
                  </Button>
                </Link>
                <Link href="/dashboard/gigs">
                  <Button variant="outline" className="w-full h-16 border-white/20 text-white hover:bg-white/5">
                    <Briefcase className="mr-2 h-5 w-5" />
                    My Gigs
                  </Button>
                </Link>
                <Link href="/dashboard/applications">
                  <Button variant="outline" className="w-full h-16 border-white/20 text-white hover:bg-white/5">
                    <Clock className="mr-2 h-5 w-5" />
                    Applications
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full h-16 border-white/20 text-white hover:bg-white/5">
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/gigs">
                  <Button className="w-full h-16 bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Browse Gigs
                  </Button>
                </Link>
                <Link href="/dashboard/applications">
                  <Button variant="outline" className="w-full h-16 border-white/20 text-white hover:bg-white/5">
                    <Clock className="mr-2 h-5 w-5" />
                    My Applications
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full h-16 border-white/20 text-white hover:bg-white/5">
                    <Star className="mr-2 h-5 w-5" />
                    My Profile
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full h-16 border-white/20 text-white hover:bg-white/5">
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {userData.profile.role === 'client' ? (
              <>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total Gigs</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.totalGigs}</p>
                      </div>
                      <Briefcase className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Active Gigs</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.activeGigs}</p>
                      </div>
                      <Clock className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Applications</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.totalApplications}</p>
                      </div>
                      <Star className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.completedGigs}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Applications</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.totalApplications}</p>
                      </div>
                      <Briefcase className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Accepted</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.acceptedApplications}</p>
                      </div>
                      <Star className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.pendingApplications}</p>
                      </div>
                      <Clock className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-white">{dashboardData.stats.completedJobs}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-[#a3b18a]" />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userData.profile.role === 'client' ? (
              <>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Gigs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentGigs.length > 0 ? (
                        dashboardData.recentGigs.map((gig: any) => (
                          <div key={gig.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                            <div>
                              <h4 className="font-medium text-white">{gig.title}</h4>
                              <p className="text-sm text-gray-400">₹{gig.budget_amount}</p>
                            </div>
                            <Badge className={
                              gig.status === 'published' 
                                ? 'bg-[#a3b18a]/20 text-[#a3b18a]'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }>
                              {gig.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No gigs posted yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentApplications.length > 0 ? (
                        dashboardData.recentApplications.map((app: any) => (
                          <div key={app.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                            <div>
                              <h4 className="font-medium text-white">Application received</h4>
                              <p className="text-sm text-gray-400">₹{app.proposed_rate}</p>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400">
                              {app.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No applications yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white">My Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentApplications.length > 0 ? (
                        dashboardData.recentApplications.map((app: any) => (
                          <div key={app.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                            <div>
                              <h4 className="font-medium text-white">{app.gigs?.title}</h4>
                              <p className="text-sm text-gray-400">Applied for ₹{app.proposed_rate}</p>
                            </div>
                            <Badge className={
                              app.status === 'accepted' 
                                ? 'bg-[#a3b18a]/20 text-[#a3b18a]'
                                : app.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }>
                              {app.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No applications yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Available Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">Ready to find your next opportunity?</p>
                      <Link href="/gigs">
                        <Button className="bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80">
                          Browse Available Gigs
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
