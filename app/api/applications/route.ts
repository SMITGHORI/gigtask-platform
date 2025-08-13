import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'
import { ApplicationSchema, validateRequest, formatValidationErrors } from '@/lib/validations'

// GET /api/applications - Get applications (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const gigId = searchParams.get('gig_id')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('applications')
      .select(`
        *,
        gigs (
          id, title, budget_amount, client_id,
          profiles!gigs_client_id_fkey (id, full_name, avatar_url)
        ),
        profiles!applications_freelancer_id_fkey (id, full_name, avatar_url, rating)
      `)

    // Filter based on user role
    if (profile?.role === 'admin') {
      // Admin can see all applications
    } else if (profile?.role === 'client') {
      // Clients see applications to their gigs
      query = query.eq('gigs.client_id', user.id)
    } else {
      // Freelancers see their own applications
      query = query.eq('freelancer_id', user.id)
    }

    // Apply additional filters
    if (gigId) {
      query = query.eq('gig_id', gigId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: applications, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST /api/applications - Create new application (Freelancers only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is freelancer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['freelancer', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Freelancer access required' },
        { status: 403 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validation = validateRequest(ApplicationSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatValidationErrors(validation.errors) },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Check if gig exists and is published
    const { data: gig, error: gigError } = await supabase
      .from('gigs')
      .select('id, status, client_id')
      .eq('id', validatedData.gig_id)
      .single()

    if (gigError || !gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    if (gig.status !== 'published') {
      return NextResponse.json({ error: 'Gig is not available for applications' }, { status: 400 })
    }

    if (gig.client_id === user.id) {
      return NextResponse.json({ error: 'Cannot apply to your own gig' }, { status: 400 })
    }

    // Check if user already applied to this gig
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('gig_id', validatedData.gig_id)
      .eq('freelancer_id', user.id)
      .single()

    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied to this gig' }, { status: 400 })
    }

    // Create application
    const applicationData = {
      ...validatedData,
      freelancer_id: user.id,
      status: 'pending'
    }

    const { data: application, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select(`
        *,
        gigs (id, title, budget_amount),
        profiles!applications_freelancer_id_fkey (id, full_name, avatar_url)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update applications count on gig
    await supabase
      .from('gigs')
      .update({ applications_count: supabase.raw('applications_count + 1') })
      .eq('id', validatedData.gig_id)

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
