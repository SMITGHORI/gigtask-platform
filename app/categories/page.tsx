import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PreFooter from '@/components/PreFooter'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function CategoriesPage() {
  {/* BUYER: Customize job categories to match your target industries and market */}
  const categories = [
    "Technology", "Design", "Writing", "Customer Service",
    "Marketing", "Event Planning", "Education", "Photography",
    "Finance", "Legal", "Healthcare", "Hospitality"
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
                Categories
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animated-gradient-text px-4 sm:px-0">Explore Opportunities</h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
                Discover a wide range of gig opportunities across various industries in India. Find the perfect match for your skills and interests.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-full py-6 sm:py-8 px-3 sm:px-4 border-[#a3b18a]/10 hover:bg-[#a3b18a]/10 transition-colors text-white hover:text-[#a3b18a] text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                >
                  <span className="text-center leading-tight">{category}</span>
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

