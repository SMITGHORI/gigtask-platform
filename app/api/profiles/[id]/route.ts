import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'
import { ProfileSchema, AdminUserUpdateSchema, validateRequest, formatValidationErrors } from '@/lib/validations'

// GET /api/profiles/[id] - Get single profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid profile ID format' }, { status: 400 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Remove sensitive information for public view
    const publicProfile = {
      id: profile.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      bio: profile.bio,
      skills: profile.skills,
      location: profile.location,
      website: profile.website,
      hourly_rate: profile.hourly_rate,
      rating: profile.rating,
      created_at: profile.created_at
    }

    return NextResponse.json({ profile: publicProfile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profiles/[id] - Update user profile (Admin only for other users)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid profile ID format' }, { status: 400 })
    }

    // Check if profile exists
    const { data: targetProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', params.id)
      .single()

    if (fetchError || !targetProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get current user profile
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isOwnProfile = params.id === user.id
    const isAdmin = currentProfile?.role === 'admin'

    // Users can update their own profile, admins can update any profile
    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Validate request body
    const body = await request.json()
    
    let validation
    if (isAdmin && !isOwnProfile) {
      // Admin updating another user - allow role changes
      validation = validateRequest(AdminUserUpdateSchema, body)
    } else {
      // User updating own profile - no role changes
      validation = validateRequest(ProfileSchema.partial(), body)
    }
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatValidationErrors(validation.errors) },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Prevent non-admins from changing roles
    if (!isAdmin && validatedData.role && validatedData.role !== targetProfile.role) {
      return NextResponse.json({ error: 'Cannot change user role' }, { status: 403 })
    }

    // Update profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(validatedData)
      .eq('id', params.id)
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

// DELETE /api/profiles/[id] - Deactivate user account (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid profile ID format' }, { status: 400 })
    }

    // Only admins can deactivate accounts
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Prevent admin from deactivating themselves
    if (params.id === user.id) {
      return NextResponse.json({ error: 'Cannot deactivate your own account' }, { status: 400 })
    }

    // Check if target profile exists
    const { data: targetProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', params.id)
      .single()

    if (fetchError || !targetProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Soft delete by marking as inactive (you might want to add an is_active field)
    // For now, we'll update the bio to indicate deactivation
    const { error } = await supabase
      .from('profiles')
      .update({ 
        bio: '[ACCOUNT DEACTIVATED]',
        full_name: '[DEACTIVATED USER]' 
      })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Account deactivated successfully' })
  } catch (error) {
    console.error('Error deactivating account:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate account' },
      { status: 500 }
    )
  }
}
