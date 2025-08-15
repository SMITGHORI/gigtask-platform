import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth-server'
import { z } from 'zod'

const CategoryUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  icon: z.string().optional(),
  is_active: z.boolean().optional()
})

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Validate request body
    const body = await request.json()
    const validatedData = CategoryUpdateSchema.parse(body)

    // Update category
    const { data: category, error } = await supabase
      .from('categories')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Soft delete by setting is_active to false
    const { data: category, error } = await supabase
      .from('categories')
      .update({ is_active: false })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
