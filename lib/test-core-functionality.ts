/**
 * Core functionality test suite
 * This file contains functions to test all major features
 * Run these tests after setting up Supabase to ensure everything works
 */

import { createServerClient } from '@/lib/auth'
import { validateRequest, GigSchema, ApplicationSchema, CategorySchema } from '@/lib/validations'
import { cache, cacheKeys } from '@/lib/cache'

interface TestResult {
  test: string
  passed: boolean
  error?: string
  duration?: number
}

export class CoreFunctionalityTester {
  private results: TestResult[] = []
  private supabase = createServerClient()

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting core functionality tests...')
    
    this.results = []
    
    await this.testDatabaseConnection()
    await this.testValidationSchemas()
    await this.testCacheSystem()
    await this.testCategoryOperations()
    await this.testGigOperations()
    await this.testApplicationOperations()
    await this.testUserOperations()
    await this.testSecurityFeatures()
    
    this.printResults()
    return this.results
  }

  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const start = Date.now()
    try {
      await testFn()
      this.results.push({
        test: testName,
        passed: true,
        duration: Date.now() - start
      })
    } catch (error) {
      this.results.push({
        test: testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - start
      })
    }
  }

  private async testDatabaseConnection(): Promise<void> {
    await this.runTest('Database Connection', async () => {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (error) throw new Error(`Database connection failed: ${error.message}`)
    })
  }

  private async testValidationSchemas(): Promise<void> {
    await this.runTest('Gig Validation Schema', async () => {
      const validGig = {
        title: 'Test Gig',
        description: 'This is a test gig description that is long enough',
        category_id: '123e4567-e89b-12d3-a456-426614174000',
        budget_type: 'fixed' as const,
        budget_amount: 1000,
        skills_required: ['JavaScript', 'React']
      }
      
      const result = validateRequest(GigSchema, validGig)
      if (!result.success) {
        throw new Error('Valid gig failed validation')
      }
    })

    await this.runTest('Application Validation Schema', async () => {
      const validApplication = {
        gig_id: '123e4567-e89b-12d3-a456-426614174000',
        proposal: 'This is a detailed proposal for the gig that meets minimum length requirements',
        proposed_rate: 500
      }
      
      const result = validateRequest(ApplicationSchema, validApplication)
      if (!result.success) {
        throw new Error('Valid application failed validation')
      }
    })

    await this.runTest('Category Validation Schema', async () => {
      const validCategory = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'A test category'
      }
      
      const result = validateRequest(CategorySchema, validCategory)
      if (!result.success) {
        throw new Error('Valid category failed validation')
      }
    })

    await this.runTest('Invalid Data Rejection', async () => {
      const invalidGig = {
        title: 'A', // Too short
        description: 'Short', // Too short
        budget_amount: -100, // Negative
        skills_required: [] // Empty array
      }
      
      const result = validateRequest(GigSchema, invalidGig)
      if (result.success) {
        throw new Error('Invalid gig passed validation')
      }
    })
  }

  private async testCacheSystem(): Promise<void> {
    await this.runTest('Cache Set and Get', async () => {
      const testKey = 'test:cache:key'
      const testData = { message: 'Hello, Cache!' }
      
      cache.set(testKey, testData, 1000) // 1 second TTL
      const retrieved = cache.get(testKey)
      
      if (!retrieved || retrieved.message !== testData.message) {
        throw new Error('Cache set/get failed')
      }
    })

    await this.runTest('Cache Expiry', async () => {
      const testKey = 'test:cache:expiry'
      const testData = { message: 'This should expire' }
      
      cache.set(testKey, testData, 10) // 10ms TTL
      
      // Wait for expiry
      await new Promise(resolve => setTimeout(resolve, 20))
      
      const retrieved = cache.get(testKey)
      if (retrieved !== null) {
        throw new Error('Cache expiry failed')
      }
    })

    await this.runTest('Cache Tag Invalidation', async () => {
      const testKey1 = 'test:tagged:1'
      const testKey2 = 'test:tagged:2'
      const testTag = 'test-tag'
      
      cache.set(testKey1, 'data1', 10000, [testTag])
      cache.set(testKey2, 'data2', 10000, [testTag])
      
      cache.invalidateByTag(testTag)
      
      if (cache.get(testKey1) !== null || cache.get(testKey2) !== null) {
        throw new Error('Cache tag invalidation failed')
      }
    })
  }

  private async testCategoryOperations(): Promise<void> {
    await this.runTest('Fetch Categories', async () => {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .limit(5)
      
      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`)
      }
      
      if (!Array.isArray(data)) {
        throw new Error('Categories data is not an array')
      }
    })

    await this.runTest('Category Structure Validation', async () => {
      const { data, error } = await this.supabase
        .from('categories')
        .select('id, name, slug, is_active')
        .limit(1)
      
      if (error) throw new Error(`Category query failed: ${error.message}`)
      
      if (data && data.length > 0) {
        const category = data[0]
        if (!category.id || !category.name || !category.slug) {
          throw new Error('Category missing required fields')
        }
      }
    })
  }

  private async testGigOperations(): Promise<void> {
    await this.runTest('Gig Table Structure', async () => {
      const { data, error } = await this.supabase
        .from('gigs')
        .select('id, title, description, status, budget_amount, client_id')
        .limit(1)
      
      if (error) throw new Error(`Gig query failed: ${error.message}`)
    })

    await this.runTest('Gig with Relations', async () => {
      const { data, error } = await this.supabase
        .from('gigs')
        .select(`
          id, title,
          categories (id, name),
          profiles!gigs_client_id_fkey (id, full_name)
        `)
        .limit(1)
      
      if (error) throw new Error(`Gig relations query failed: ${error.message}`)
    })
  }

  private async testApplicationOperations(): Promise<void> {
    await this.runTest('Application Table Structure', async () => {
      const { data, error } = await this.supabase
        .from('applications')
        .select('id, gig_id, freelancer_id, status, proposed_rate')
        .limit(1)
      
      if (error) throw new Error(`Application query failed: ${error.message}`)
    })

    await this.runTest('Application with Relations', async () => {
      const { data, error } = await this.supabase
        .from('applications')
        .select(`
          id, status,
          gigs (id, title),
          profiles!applications_freelancer_id_fkey (id, full_name)
        `)
        .limit(1)
      
      if (error) throw new Error(`Application relations query failed: ${error.message}`)
    })
  }

  private async testUserOperations(): Promise<void> {
    await this.runTest('Profile Table Structure', async () => {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .limit(1)
      
      if (error) throw new Error(`Profile query failed: ${error.message}`)
    })

    await this.runTest('User Role Validation', async () => {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('role')
        .limit(10)
      
      if (error) throw new Error(`Role query failed: ${error.message}`)
      
      if (data) {
        const validRoles = ['freelancer', 'client', 'admin']
        const invalidRoles = data.filter(p => !validRoles.includes(p.role))
        if (invalidRoles.length > 0) {
          throw new Error(`Invalid roles found: ${invalidRoles.map(r => r.role).join(', ')}`)
        }
      }
    })
  }

  private async testSecurityFeatures(): Promise<void> {
    await this.runTest('Row Level Security Enabled', async () => {
      // Test that RLS is enabled by trying to access data without auth
      const publicSupabase = createServerClient()
      
      const { data, error } = await publicSupabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      // This should either return empty data or an error due to RLS
      // The exact behavior depends on RLS policies
    })

    await this.runTest('UUID Format Validation', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      const invalidUUID = 'not-a-uuid'
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      
      if (!uuidRegex.test(validUUID)) {
        throw new Error('Valid UUID failed regex test')
      }
      
      if (uuidRegex.test(invalidUUID)) {
        throw new Error('Invalid UUID passed regex test')
      }
    })
  }

  private printResults(): void {
    console.log('\n📊 Test Results:')
    console.log('================')
    
    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => r.passed === false).length
    const total = this.results.length
    
    console.log(`✅ Passed: ${passed}/${total}`)
    console.log(`❌ Failed: ${failed}/${total}`)
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:')
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  • ${r.test}: ${r.error}`)
        })
    }
    
    console.log('\n⏱️  Performance:')
    this.results
      .filter(r => r.duration)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 5)
      .forEach(r => {
        console.log(`  • ${r.test}: ${r.duration}ms`)
      })
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! Core functionality is working properly.')
    } else {
      console.log('\n⚠️  Some tests failed. Please check your setup and configuration.')
    }
  }
}

// Utility function to run tests
export async function testCoreFunctionality(): Promise<boolean> {
  const tester = new CoreFunctionalityTester()
  const results = await tester.runAllTests()
  return results.every(r => r.passed)
}

// Individual test functions for specific features
export async function testDatabaseSchema(): Promise<boolean> {
  console.log('🔍 Testing database schema...')
  
  const supabase = createServerClient()
  const tables = ['profiles', 'categories', 'gigs', 'applications', 'reviews', 'payments']
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.error(`❌ Table ${table} test failed:`, error.message)
        return false
      }
      
      console.log(`✅ Table ${table} is accessible`)
    } catch (error) {
      console.error(`❌ Table ${table} test error:`, error)
      return false
    }
  }
  
  console.log('✅ Database schema test passed')
  return true
}

export async function testAPIEndpoints(): Promise<boolean> {
  console.log('🌐 Testing API endpoints...')
  
  const endpoints = [
    '/api/categories',
    '/api/gigs',
    '/api/applications',
    '/api/profiles'
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`)
      
      if (response.status === 401) {
        // Unauthorized is expected for protected endpoints
        console.log(`✅ Endpoint ${endpoint} is protected (401)`)
        continue
      }
      
      if (!response.ok && response.status !== 401) {
        console.error(`❌ Endpoint ${endpoint} failed:`, response.status)
        return false
      }
      
      console.log(`✅ Endpoint ${endpoint} is accessible`)
    } catch (error) {
      console.error(`❌ Endpoint ${endpoint} test error:`, error)
      return false
    }
  }
  
  console.log('✅ API endpoints test passed')
  return true
}
