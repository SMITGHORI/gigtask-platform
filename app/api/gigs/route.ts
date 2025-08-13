import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'
import { GigSchema, GigFiltersSchema, validateRequest, formatValidationErrors } from '@/lib/validations'

// GET /api/gigs - Get all published gigs with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    // Validate query parameters
    const filters = {
      category: searchParams.get('category') || undefined,
      location_type: searchParams.get('location_type') || undefined,
      budget_min: searchParams.get('budget_min') ? parseFloat(searchParams.get('budget_min')!) : undefined,
      budget_max: searchParams.get('budget_max') ? parseFloat(searchParams.get('budget_max')!) : undefined,
      skills: searchParams.get('skills') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '10'), 50), // Max 50 items per page
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || undefined,
      order: searchParams.get('order') || undefined
    }

    const validation = validateRequest(GigFiltersSchema, filters)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid filters', details: formatValidationErrors(validation.errors) },
        { status: 400 }
      )
    }

    const { category, location_type, budget_min, budget_max, skills, page, limit, search, sort, order } = validation.data

    let query = supabase
      .from('gigs')
      .select(`
        *,
        categories (id, name, slug),
        profiles!gigs_client_id_fkey (id, full_name, avatar_url, rating)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Apply filters
    if (category) {
      query = query.eq('category_id', category)
    }

    if (location_type) {
      query = query.eq('location_type', location_type)
    }

    if (budget_min) {
      query = query.gte('budget_amount', parseFloat(budget_min))
    }

    if (budget_max) {
      query = query.lte('budget_amount', parseFloat(budget_max))
    }

    if (skills) {
      const skillsArray = skills.split(',')
      query = query.overlaps('skills_required', skillsArray)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%, description.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: gigs, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      gigs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gigs' },
      { status: 500 }
    )
  }
}

// POST /api/gigs - Create new gig
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is client or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['client', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Client access required' },
        { status: 403 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validation = validateRequest(GigSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatValidationErrors(validation.errors) },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Add client_id and default values
    const gigData = {
      ...validatedData,
      client_id: user.id,
      status: validatedData.status || 'draft'
    }

    // Create gig
    const { data: gig, error } = await supabase
      .from('gigs')
      .insert([gigData])
      .select(`
        *,
        categories (id, name, slug),
        profiles!gigs_client_id_fkey (id, full_name, avatar_url)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ gig }, { status: 201 })
  } catch (error) {
    console.error('Error creating gig:', error)
    return NextResponse.json(
      { error: 'Failed to create gig' },
      { status: 500 }
    )
  }
}
