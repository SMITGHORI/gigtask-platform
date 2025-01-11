'use client'

import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundGrid from '@/components/BackgroundGrid'

export default function SupportCenterPage() {
  const supportCategories = [
    { title: "Getting Started", icon: "🚀" },
    { title: "Account Management", icon: "👤" },
    { title: "Payments", icon: "💰" },
    { title: "Job Postings", icon: "📝" },
    { title: "Freelancer Guide", icon: "🌟" },
    { title: "Client Guide", icon: "🏢" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <BackgroundGrid />
      <Header />
      
      <main className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
                Support Center
              </Badge>
              <h1 className="text-4xl font-bold mb-4 animated-gradient-text">How Can We Help You?</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Find answers to your questions and get the support you need to make the most of KaamKonnect.
              </p>
            </motion.div>

            <motion.div 
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <Input 
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-10 py-6 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-[#a3b18a]/50 focus:ring-[#a3b18a]/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {supportCategories.map((category, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
                  <Button variant="outline" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black">
                    View Articles
                  </Button>
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
              <Button className="bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80">
                Contact Support
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

