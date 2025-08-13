import { Suspense } from 'react'
import { createServerClient } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CategoriesTable from '@/components/admin/CategoriesTable'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function getCategories() {
  const supabase = createServerClient()

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white animated-gradient-text">Categories</h1>
          <p className="text-gray-300">Manage job categories for your platform</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Categories</p>
                <p className="text-2xl font-bold text-white">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Categories</p>
                <p className="text-2xl font-bold text-white">
                  {categories.filter(cat => cat.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Inactive Categories</p>
                <p className="text-2xl font-bold text-white">
                  {categories.filter(cat => !cat.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-gray-400">Loading categories...</div>}>
            <CategoriesTable categories={categories} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
