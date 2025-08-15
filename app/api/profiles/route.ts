import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth-server'
import { ProfileSchema, AdminUserUpdateSchema, validateRequest, formatValidationErrors } from '@/lib/validations'

// GET /api/profiles - Get user profiles (Admin only, or own profile)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const search = searchParams.get('search')

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Only admins can view all profiles
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })

    // Apply filters
    if (role && ['freelancer', 'client', 'admin'].includes(role)) {
      query = query.eq('role', role)
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: profiles, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      profiles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}

// PUT /api/profiles - Update own profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body = await request.json()
    const validation = validateRequest(ProfileSchema.partial(), body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatValidationErrors(validation.errors) },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Update profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(validatedData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
