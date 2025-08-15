// Client-side auth utilities (safe for client components)
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

// Client-side auth client
export const createClientAuth = () => {
  return createClientComponentClient<Database>()
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
