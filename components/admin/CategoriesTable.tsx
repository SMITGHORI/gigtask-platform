'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClientAuth } from '@/lib/auth'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  description: string | null
  slug: string
  icon: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface CategoriesTableProps {
  categories: Category[]
}

export default function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientAuth()

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update category')
      }

      // Update local state
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, is_active: !currentStatus }
          : cat
      ))

      toast.success('Category status updated successfully')
    } catch (error) {
      toast.error('Failed to update category status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      // Update local state (soft delete - mark as inactive)
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, is_active: false }
          : cat
      ))

      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error('Failed to delete category')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Slug</TableHead>
            <TableHead className="text-gray-300">Description</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Created</TableHead>
            <TableHead className="w-[50px] text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium text-white">
                <div className="flex items-center space-x-2">
                  {category.icon && (
                    <span className="text-lg">{category.icon}</span>
                  )}
                  <span>{category.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-sm bg-white/10 text-gray-300 px-2 py-1 rounded">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell className="text-gray-300">
                <div className="max-w-xs truncate">
                  {category.description || 'No description'}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={category.is_active ? 'default' : 'secondary'}
                  className={category.is_active ? 'bg-[#a3b18a]/20 text-[#a3b18a]' : 'bg-gray-500/20 text-gray-400'}
                >
                  {category.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">
                {new Date(category.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleToggleStatus(category.id, category.is_active)}
                      disabled={isLoading}
                    >
                      {category.is_active ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(category.id)}
                      disabled={isLoading}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No categories found. Create your first category to get started.
        </div>
      )}
    </div>
  )
}
