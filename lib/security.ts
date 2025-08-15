import { createServerClient } from '@/lib/auth-server'
import { AuthenticationError, AuthorizationError, RateLimitError } from '@/lib/errors'
import { rateLimit } from '@/lib/errors'

// User roles and permissions
export const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  FREELANCER: 'freelancer'
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

// Permissions mapping
export const PERMISSIONS = {
  // Gig permissions
  CREATE_GIG: ['client', 'admin'],
  VIEW_ALL_GIGS: ['admin'],
  EDIT_OWN_GIG: ['client', 'admin'],
  EDIT_ANY_GIG: ['admin'],
  DELETE_GIG: ['admin'],
  
  // Application permissions
  CREATE_APPLICATION: ['freelancer', 'admin'],
  VIEW_ALL_APPLICATIONS: ['admin'],
  MANAGE_APPLICATIONS: ['client', 'admin'],
  
  // User management permissions
  VIEW_ALL_USERS: ['admin'],
  EDIT_USER_ROLE: ['admin'],
  DELETE_USER: ['admin'],
  
  // Category permissions
  MANAGE_CATEGORIES: ['admin'],
  
  // System permissions
  VIEW_ANALYTICS: ['admin'],
  SYSTEM_SETTINGS: ['admin']
} as const

// Check if user has permission
export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole)
}

// Authentication middleware
export async function requireAuth(request: Request): Promise<{
  user: any
  profile: any
}> {
  const supabase = createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new AuthenticationError('Authentication required')
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new AuthenticationError('User profile not found')
  }

  return { user, profile }
}

// Authorization middleware
export async function requireRole(
  request: Request, 
  allowedRoles: UserRole[]
): Promise<{
  user: any
  profile: any
}> {
  const { user, profile } = await requireAuth(request)
  
  if (!allowedRoles.includes(profile.role as UserRole)) {
    throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
  }

  return { user, profile }
}

// Permission-based authorization
export async function requirePermission(
  request: Request,
  permission: keyof typeof PERMISSIONS
): Promise<{
  user: any
  profile: any
}> {
  const { user, profile } = await requireAuth(request)
  
  if (!hasPermission(profile.role as UserRole, permission)) {
    throw new AuthorizationError(`Access denied. Missing permission: ${permission}`)
  }

  return { user, profile }
}

// Resource ownership check
export async function requireOwnership(
  request: Request,
  resourceId: string,
  resourceType: 'gig' | 'application' | 'profile',
  allowAdmin: boolean = true
): Promise<{
  user: any
  profile: any
}> {
  const { user, profile } = await requireAuth(request)
  
  // Admin bypass
  if (allowAdmin && profile.role === ROLES.ADMIN) {
    return { user, profile }
  }

  const supabase = createServerClient()
  
  // Check ownership based on resource type
  switch (resourceType) {
    case 'gig': {
      const { data: gig, error } = await supabase
        .from('gigs')
        .select('client_id')
        .eq('id', resourceId)
        .single()
      
      if (error || !gig) {
        throw new AuthorizationError('Resource not found')
      }
      
      if (gig.client_id !== user.id) {
        throw new AuthorizationError('Access denied. You do not own this resource')
      }
      break
    }
    
    case 'application': {
      const { data: application, error } = await supabase
        .from('applications')
        .select('freelancer_id, gigs!inner(client_id)')
        .eq('id', resourceId)
        .single()
      
      if (error || !application) {
        throw new AuthorizationError('Resource not found')
      }
      
      // Allow both applicant and gig owner
      const isApplicant = application.freelancer_id === user.id
      const isGigOwner = application.gigs.client_id === user.id
      
      if (!isApplicant && !isGigOwner) {
        throw new AuthorizationError('Access denied. You do not own this resource')
      }
      break
    }
    
    case 'profile': {
      if (resourceId !== user.id) {
        throw new AuthorizationError('Access denied. You can only access your own profile')
      }
      break
    }
    
    default:
      throw new AuthorizationError('Invalid resource type')
  }

  return { user, profile }
}

// Rate limiting middleware
export function requireRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 1000
): void {
  if (!rateLimit(identifier, maxRequests, windowMs)) {
    throw new RateLimitError('Rate limit exceeded. Please try again later.')
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

// SQL injection prevention (basic)
export function sanitizeForQuery(input: string): string {
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
}

// XSS prevention
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// File upload security
export function validateFileUpload(file: File, options: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  allowedExtensions?: string[]
}): { valid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf']
  } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit of ${Math.round(maxSize / (1024 * 1024))}MB`
    }
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    }
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension .${extension} is not allowed`
    }
  }

  return { valid: true }
}

// Generate secure tokens
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  valid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password should be at least 8 characters long')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password should contain at least one uppercase letter')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password should contain at least one lowercase letter')
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Password should contain at least one number')
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Password should contain at least one special character')
  }

  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein']
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score -= 2
    feedback.push('Password contains common patterns')
  }

  return {
    valid: score >= 4 && feedback.length === 0,
    score: Math.max(0, score),
    feedback
  }
}

// CORS headers
export function setCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

// Security headers
export function setSecurityHeaders(response: Response): Response {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
  )
  return response
}
