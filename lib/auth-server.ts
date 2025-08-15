// Server-side auth utilities (safe for server components only)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

// Server-side auth client
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
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
