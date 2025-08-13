import { z } from 'zod'

// User Profile Validation
export const ProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).max(20, 'Maximum 20 skills allowed').optional(),
  location: z.string().max(100, 'Location too long').optional(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone format').optional(),
  website: z.string().url('Invalid website URL').optional(),
  hourly_rate: z.number().min(0, 'Rate cannot be negative').max(10000, 'Rate too high').optional(),
})

// Category Validation
export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  icon: z.string().max(50, 'Icon name too long').optional(),
  is_active: z.boolean().optional()
})

// Gig Validation
export const GigSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description too long'),
  category_id: z.string().uuid('Valid category is required'),
  budget_type: z.enum(['fixed', 'hourly'], { required_error: 'Budget type is required' }),
  budget_amount: z.number().min(100, 'Minimum budget is ₹100').max(1000000, 'Maximum budget is ₹10,00,000'),
  budget_min: z.number().min(50, 'Minimum budget too low').optional(),
  budget_max: z.number().max(1000000, 'Maximum budget too high').optional(),
  deadline: z.string().datetime().optional(),
  skills_required: z.array(z.string().min(1).max(30))
    .min(1, 'At least one skill is required')
    .max(10, 'Maximum 10 skills allowed'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  location_type: z.enum(['remote', 'onsite', 'hybrid']).optional(),
  location: z.string().max(100, 'Location too long').optional(),
  status: z.enum(['draft', 'published']).optional()
}).refine((data) => {
  if (data.budget_type === 'hourly' && data.budget_min && data.budget_max) {
    return data.budget_min < data.budget_max
  }
  return true
}, {
  message: 'Minimum budget must be less than maximum budget',
  path: ['budget_min']
})

// Application Validation
export const ApplicationSchema = z.object({
  gig_id: z.string().uuid('Valid gig ID is required'),
  proposal: z.string().min(50, 'Proposal must be at least 50 characters').max(2000, 'Proposal too long'),
  proposed_rate: z.number().min(50, 'Minimum rate is ₹50').max(100000, 'Rate too high'),
  estimated_duration: z.string().max(50, 'Duration description too long').optional(),
  cover_letter: z.string().max(1000, 'Cover letter too long').optional(),
})

// Review Validation
export const ReviewSchema = z.object({
  gig_id: z.string().uuid('Valid gig ID is required'),
  reviewee_id: z.string().uuid('Valid user ID is required'),
  rating: z.number().int().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  comment: z.string().max(500, 'Comment too long').optional()
})

// Authentication Validation
export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  role: z.enum(['freelancer', 'client'], { required_error: 'Role is required' }),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone format').optional()
})

// Search and Filter Validation
export const GigFiltersSchema = z.object({
  category: z.string().uuid().optional(),
  location_type: z.enum(['remote', 'onsite', 'hybrid']).optional(),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().max(1000000).optional(),
  skills: z.string().optional(), // comma-separated skills
  difficulty_level: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(50).optional(),
  sort: z.enum(['created_at', 'budget_amount', 'deadline']).optional(),
  order: z.enum(['asc', 'desc']).optional()
})

// Admin Validation
export const AdminUserUpdateSchema = z.object({
  role: z.enum(['freelancer', 'client', 'admin']).optional(),
  is_active: z.boolean().optional(),
  full_name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional()
})

// Payment Validation
export const PaymentSchema = z.object({
  gig_id: z.string().uuid('Valid gig ID is required'),
  amount: z.number().min(100, 'Minimum payment is ₹100').max(1000000, 'Maximum payment is ₹10,00,000'),
  platform_fee: z.number().min(0).max(50000),
  stripe_payment_intent_id: z.string().optional()
})

// Utility functions for validation
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  errors.errors.forEach((error) => {
    const path = error.path.join('.')
    formatted[path] = error.message
  })
  return formatted
}
