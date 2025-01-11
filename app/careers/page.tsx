'use client'

import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundGrid from '@/components/BackgroundGrid'
import { useEffect } from 'react'
import { useState } from 'react'

export default function CareersPage() {
  const openPositions = [
    { title: "Senior Full Stack Developer", department: "Engineering", location: "Mumbai (Remote)" },
    { title: "UX/UI Designer", department: "Design", location: "Bangalore (Hybrid)" },
    { title: "Marketing Manager", department: "Marketing", location: "Delhi (On-site)" },
    { title: "Customer Support Specialist", department: "Support", location: "Pune (Remote)" },
    { title: "Data Scientist", department: "Analytics", location: "Hyderabad (Hybrid)" },
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
                Careers
              </Badge>
              <h1 className="text-4xl font-bold mb-4 animated-gradient-text">Join Our Team</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Be part of the revolution in India's gig economy. At KaamKonnect, we're always looking for talented individuals to help us shape the future of work.
              </p>
            </motion.div>

            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">Why Work With Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Innovation", description: "Work on cutting-edge technologies and shape the future of the gig economy in India." },
                  { title: "Growth", description: "Continuous learning opportunities and a clear path for career advancement." },
                  { title: "Impact", description: "Make a real difference in the lives of millions of professionals and businesses across India." },
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">Open Positions</h2>
              <div className="space-y-4">
                {openPositions.map((position, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{position.title}</h3>
                      <p className="text-gray-300">{position.department} | {position.location}</p>
                    </div>
                    <Button className="bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80">
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
