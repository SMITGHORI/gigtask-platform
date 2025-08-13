// Simple in-memory cache for development
// In production, use Redis or similar distributed cache

interface CacheEntry<T> {
  data: T
  expiry: number
  tags?: string[]
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(
    key: string, 
    data: T, 
    ttl: number = this.defaultTTL,
    tags?: string[]
  ): void {
    const expiry = Date.now() + ttl
    this.cache.set(key, { data, expiry, tags })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Invalidate by tags
  invalidateByTag(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags && entry.tags.includes(tag)) {
        this.cache.delete(key)
      }
    }
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Auto cleanup every 10 minutes
setInterval(() => {
  cache.cleanup()
}, 10 * 60 * 1000)

// Cache key generators
export const cacheKeys = {
  gig: (id: string) => `gig:${id}`,
  gigs: (filters: Record<string, any>) => {
    const sortedFilters = Object.keys(filters)
      .sort()
      .map(key => `${key}:${filters[key]}`)
      .join('|')
    return `gigs:${sortedFilters}`
  },
  profile: (id: string) => `profile:${id}`,
  categories: () => 'categories:all',
  category: (id: string) => `category:${id}`,
  applications: (userId: string, role: string) => `applications:${userId}:${role}`,
  stats: (type: string) => `stats:${type}`,
}

// Cache tags for invalidation
export const cacheTags = {
  gigs: 'gigs',
  categories: 'categories',
  profiles: 'profiles',
  applications: 'applications',
  stats: 'stats'
}

// Cached function wrapper
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttl?: number,
  tags?: string[]
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args)
    
    // Try to get from cache first
    const cached = cache.get<R>(key)
    if (cached !== null) {
      return cached
    }
    
    // Execute function and cache result
    const result = await fn(...args)
    cache.set(key, result, ttl, tags)
    
    return result
  }
}

// Database query optimization helpers
export function buildOptimizedQuery(
  baseQuery: any,
  options: {
    select?: string[]
    filters?: Record<string, any>
    sort?: { field: string; ascending?: boolean }
    limit?: number
    offset?: number
  }
) {
  let query = baseQuery

  // Select specific fields
  if (options.select) {
    query = query.select(options.select.join(', '))
  }

  // Apply filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else if (typeof value === 'string' && value.includes('%')) {
          query = query.like(key, value)
        } else {
          query = query.eq(key, value)
        }
      }
    })
  }

  // Apply sorting
  if (options.sort) {
    query = query.order(options.sort.field, { 
      ascending: options.sort.ascending ?? false 
    })
  }

  // Apply pagination
  if (options.limit) {
    const from = options.offset || 0
    const to = from + options.limit - 1
    query = query.range(from, to)
  }

  return query
}

// Performance monitoring
class PerformanceMonitor {
  private metrics = new Map<string, number[]>()

  track(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    
    const durations = this.metrics.get(operation)!
    durations.push(duration)
    
    // Keep only last 100 measurements
    if (durations.length > 100) {
      durations.shift()
    }
  }

  getStats(operation: string): {
    count: number
    average: number
    min: number
    max: number
  } | null {
    const durations = this.metrics.get(operation)
    if (!durations || durations.length === 0) {
      return null
    }

    return {
      count: durations.length,
      average: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations)
    }
  }

  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    for (const operation of this.metrics.keys()) {
      stats[operation] = this.getStats(operation)
    }
    return stats
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Performance tracking wrapper
export function withPerformanceTracking<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operationName: string
) {
  return async (...args: T): Promise<R> => {
    const start = Date.now()
    try {
      const result = await fn(...args)
      const duration = Date.now() - start
      performanceMonitor.track(operationName, duration)
      return result
    } catch (error) {
      const duration = Date.now() - start
      performanceMonitor.track(`${operationName}:error`, duration)
      throw error
    }
  }
}
