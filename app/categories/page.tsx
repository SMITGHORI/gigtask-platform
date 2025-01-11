import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PreFooter from '@/components/PreFooter'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect } from 'react'
import { useState } from 'react'

export default function CategoriesPage() {
  const categories = [
    "Technology", "Design", "Writing", "Customer Service",
    "Marketing", "Event Planning", "Education", "Photography",
    "Finance", "Legal", "Healthcare", "Hospitality"
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
                Categories
              </Badge>
              <h1 className="text-4xl font-bold mb-4 animated-gradient-text">Explore Opportunities</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover a wide range of gig opportunities across various industries in India. Find the perfect match for your skills and interests.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-full py-8 border-[#a3b18a]/10 hover:bg-[#a3b18a]/10 transition-colors text-white hover:text-[#a3b18a]"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PreFooter />
      <Footer />
    </div>
  )
}
