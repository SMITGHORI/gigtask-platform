'use client'

import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundGrid from '@/components/BackgroundGrid'

export default function AboutUsPage() {
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
                About Us
              </Badge>
              <h1 className="text-4xl font-bold mb-4 animated-gradient-text">Our Mission and Vision</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                KaamKonnect is dedicated to revolutionizing the gig economy in India, connecting talented professionals with exciting opportunities.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-gray-300">
                  Founded in 2023, KaamKonnect emerged from a vision to address the growing needs of India's dynamic workforce. We recognized the potential of flexible work arrangements and set out to create a platform that seamlessly connects skilled professionals with businesses seeking talent.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10">
                <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Empowerment through opportunity</li>
                  <li>Transparency and trust</li>
                  <li>Continuous innovation</li>
                  <li>Diversity and inclusion</li>
                  <li>Commitment to quality</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold mb-4 animated-gradient-text">Join Us in Shaping the Future of Work</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Whether you're a professional looking for flexible opportunities or a business seeking top talent, KaamKonnect is here to support your journey. Together, we're building a more dynamic and inclusive workforce for India.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

