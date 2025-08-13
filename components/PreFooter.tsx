'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export default function PreFooter() {
  return (
    <motion.section 
      className="py-16 sm:py-20 bg-gradient-to-b from-[#a3b18a]/20 to-black px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto text-center max-w-4xl">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animated-gradient-text px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p 
          className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-300 px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join thousands of professionals and businesses already using KaamKonnect to find opportunities and talent across India.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button size="lg" className="w-full sm:w-auto bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80 px-6 sm:px-8">
            Sign Up Now <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black px-6 sm:px-8">
            Learn More
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
}

