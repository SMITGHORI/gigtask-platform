'use client'

import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundGrid from '@/components/BackgroundGrid'
import { useEffect } from 'react'
import { useState } from 'react'

export default function BlogPage() {
  const blogPosts = [
    {
      title: "5 Tips for Succeeding in the Gig Economy",
      date: "October 5, 2023",
      category: "Career Advice",
      excerpt: "Navigate the world of freelancing and gig work with these essential tips for success in India's growing gig economy."
    },
    {
      title: "The Future of Work: AI and the Gig Economy",
      date: "September 28, 2023",
      category: "Industry Trends",
      excerpt: "Explore how artificial intelligence is shaping the future of work and its impact on the gig economy in India."
    },
    {
      title: "Building a Strong Personal Brand as a Freelancer",
      date: "September 20, 2023",
      category: "Personal Development",
      excerpt: "Learn how to create and maintain a powerful personal brand to stand out in the competitive freelance market."
    },
    {
      title: "The Rise of Remote Work in India: Opportunities and Challenges",
      date: "September 12, 2023",
      category: "Workplace Trends",
      excerpt: "Discover the growing trend of remote work in India and how it's changing the landscape of employment."
    }
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
                Blog
              </Badge>
              <h1 className="text-4xl font-bold mb-4 animated-gradient-text">Insights and Inspiration</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Stay informed about the latest trends, tips, and stories from the world of gig work and freelancing in India.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {blogPosts.map((post, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10">
                  <Badge variant="secondary" className="mb-2">
                    {post.category}
                  </Badge>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-400 mb-4">{post.date}</p>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <Button variant="outline" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black">
                    Read More
                  </Button>
                </div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button className="bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80">
                View All Posts
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
