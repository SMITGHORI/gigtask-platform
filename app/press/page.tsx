'use client'

import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundGrid from '@/components/BackgroundGrid'
import { useEffect } from 'react'
import { useState } from 'react'

export default function PressPage() {
  const pressReleases = [
    {
      title: "KaamKonnect Raises $10M in Series A Funding",
      date: "June 15, 2023",
      excerpt: "KaamKonnect, the leading gig economy platform in India, has secured $10 million in Series A funding to expand its operations and enhance its technology infrastructure."
    },
    {
      title: "KaamKonnect Launches AI-Powered Job Matching Feature",
      date: "August 3, 2023",
      excerpt: "KaamKonnect introduces a state-of-the-art AI-powered job matching feature, revolutionizing how professionals find gig work opportunities across India."
    },
    {
      title: "KaamKonnect Partners with Top 100 Indian Startups",
      date: "September 20, 2023",
      excerpt: "In a move to boost the Indian startup ecosystem, KaamKonnect announces partnerships with 100 of India's most promising startups to provide them with top-tier talent."
    },
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
                Press
              </Badge>
              <h1 className="text-4xl font-bold mb-4 animated-gradient-text">KaamKonnect in the News</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Stay updated with the latest news and announcements from KaamKonnect as we revolutionize the gig economy in India.
              </p>
            </motion.div>

            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10">
                    <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{release.date}</p>
                    <p className="text-gray-300">{release.excerpt}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Media Contact</h2>
              <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10">
                <p className="text-gray-300 mb-2">For press inquiries, please contact:</p>
                <p className="font-semibold">Priya Sharma</p>
                <p>Head of Communications</p>
                <p>Email: priya.sharma@kaamkonnect.com</p>
                <p>Phone: +91 98765 43210</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
