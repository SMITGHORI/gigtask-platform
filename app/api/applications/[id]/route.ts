import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'

// GET /api/applications/[id] - Get single application
export async function GET(
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
      return NextResponse.json({ error: 'Invalid application ID format' }, { status: 400 })
    }

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        gigs (
          id, title, description, budget_amount, client_id,
          profiles!gigs_client_id_fkey (id, full_name, avatar_url)
        ),
        profiles!applications_freelancer_id_fkey (id, full_name, avatar_url, rating, bio, skills)
      `)
      .eq('id', params.id)
      .single()

    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Check permission (freelancer who applied, client who owns the gig, or admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isApplicant = application.freelancer_id === user.id
    const isGigOwner = application.gigs?.client_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isApplicant && !isGigOwner && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

// PUT /api/applications/[id] - Update application status (Client or Admin only)
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
      return NextResponse.json({ error: 'Invalid application ID format' }, { status: 400 })
    }

    // Get application and check permissions
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select(`
        *,
        gigs!inner (client_id, status)
      `)
      .eq('id', params.id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Check permission (gig owner or admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isGigOwner = application.gigs.client_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isGigOwner && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Validate request body
    const body = await request.json()
    const { status, feedback } = body

    if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid status is required' }, { status: 400 })
    }

    // Don't allow status change if gig is not published
    if (application.gigs.status !== 'published') {
      return NextResponse.json({ error: 'Cannot update applications for unpublished gigs' }, { status: 400 })
    }

    // If accepting, reject all other applications for this gig
    if (status === 'accepted') {
      await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('gig_id', application.gig_id)
        .neq('id', params.id)
        .eq('status', 'pending')
      
      // Update gig status to in_progress
      await supabase
        .from('gigs')
        .update({ status: 'in_progress' })
        .eq('id', application.gig_id)
    }

    // Update application
    const updateData: any = { status }
    if (feedback && feedback.trim()) {
      updateData.feedback = feedback.trim()
    }

    const { data: updatedApplication, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        gigs (id, title, budget_amount),
        profiles!applications_freelancer_id_fkey (id, full_name, avatar_url)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ application: updatedApplication })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE /api/applications/[id] - Withdraw application (Applicant only)
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
      return NextResponse.json({ error: 'Invalid application ID format' }, { status: 400 })
    }

    // Get application and check permissions
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('freelancer_id, status, gig_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Check permission (applicant only)
    if (application.freelancer_id !== user.id) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    // Don't allow withdrawal of accepted applications
    if (application.status === 'accepted') {
      return NextResponse.json({ error: 'Cannot withdraw accepted application' }, { status: 400 })
    }

    // Update status to withdrawn
    const { error } = await supabase
      .from('applications')
      .update({ status: 'withdrawn' })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update applications count on gig
    await supabase
      .from('gigs')
      .update({ applications_count: supabase.raw('applications_count - 1') })
      .eq('id', application.gig_id)

    return NextResponse.json({ message: 'Application withdrawn successfully' })
  } catch (error) {
    console.error('Error withdrawing application:', error)
    return NextResponse.json(
      { error: 'Failed to withdraw application' },
      { status: 500 }
    )
  }
}
