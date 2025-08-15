import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth-server'
import { GigSchema, validateRequest, formatValidationErrors } from '@/lib/validations'

// GET /api/gigs/[id] - Get single gig with details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: 'Invalid gig ID format' }, { status: 400 })
    }

    const { data: gig, error } = await supabase
      .from('gigs')
      .select(`
        *,
        categories (id, name, slug, icon),
        profiles!gigs_client_id_fkey (id, full_name, avatar_url, rating, location),
        applications (
          id,
          status,
          created_at,
          profiles!applications_freelancer_id_fkey (id, full_name, avatar_url, rating)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    // Check if gig is published or user owns it
    const { data: { user } } = await supabase.auth.getUser()
    if (gig.status !== 'published' && (!user || gig.client_id !== user.id)) {
      // Check if user is admin
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (profile?.role !== 'admin') {
          return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
        }
      } else {
        return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
      }
    }

    // Increment view count if it's a published gig and user is not the owner
    if (gig.status === 'published' && (!user || gig.client_id !== user.id)) {
      await supabase
        .from('gigs')
        .update({ views: (gig.views || 0) + 1 })
        .eq('id', params.id)
      
      gig.views = (gig.views || 0) + 1
    }

    return NextResponse.json({ gig })
  } catch (error) {
    console.error('Error fetching gig:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gig' },
      { status: 500 }
    )
  }
}

// PUT /api/gigs/[id] - Update gig (Owner or Admin only)
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
      return NextResponse.json({ error: 'Invalid gig ID format' }, { status: 400 })
    }

    // Check if gig exists and user has permission
    const { data: existingGig, error: fetchError } = await supabase
      .from('gigs')
      .select('client_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingGig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    // Check permission (owner or admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isOwner = existingGig.client_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Validate request body
    const body = await request.json()
    const validation = validateRequest(GigSchema.partial(), body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatValidationErrors(validation.errors) },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Update gig
    const { data: gig, error } = await supabase
      .from('gigs')
      .update(validatedData)
      .eq('id', params.id)
      .select(`
        *,
        categories (id, name, slug),
        profiles!gigs_client_id_fkey (id, full_name, avatar_url)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ gig })
  } catch (error) {
    console.error('Error updating gig:', error)
    return NextResponse.json(
      { error: 'Failed to update gig' },
      { status: 500 }
    )
  }
}

// DELETE /api/gigs/[id] - Delete gig (Owner or Admin only)
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
      return NextResponse.json({ error: 'Invalid gig ID format' }, { status: 400 })
    }

    // Check if gig exists and user has permission
    const { data: existingGig, error: fetchError } = await supabase
      .from('gigs')
      .select('client_id, status')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingGig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    // Check permission (owner or admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isOwner = existingGig.client_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Don't allow deletion of gigs with active applications unless admin
    if (existingGig.status === 'in_progress' && !isAdmin) {
      return NextResponse.json(
        { error: 'Cannot delete gig with active work in progress' },
        { status: 400 }
      )
    }

    // Soft delete by updating status to cancelled
    const { error } = await supabase
      .from('gigs')
      .update({ status: 'cancelled' })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Gig deleted successfully' })
  } catch (error) {
    console.error('Error deleting gig:', error)
    return NextResponse.json(
      { error: 'Failed to delete gig' },
      { status: 500 }
    )
  }
}
