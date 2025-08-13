import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

// Server-side auth client
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Client-side auth client
export const createClientAuth = () => {
  return createClientComponentClient<Database>()
}

// Get current user profile
export async function getCurrentUser() {
  const supabase = createServerClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return null
    }

    return { user, profile }
  } catch (error) {
    return null
  }
}

// Check if user is admin
export async function isAdmin() {
  const userData = await getCurrentUser()
  return userData?.profile?.role === 'admin'
}

// Check if user is authenticated
export async function isAuthenticated() {
  const userData = await getCurrentUser()
  return !!userData
}

// Redirect URLs
export const redirectUrls = {
  login: '/auth/login',
  dashboard: '/dashboard',
  admin: '/admin',
  home: '/'
}

// Role-based access control
export function hasAccess(userRole: string | null, requiredRoles: string[]) {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}
