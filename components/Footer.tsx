'use client'

import Link from "next/link"
import { Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

const footerLinks = [
  { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
  { title: 'Resources', links: ['Support Center', 'Guidelines', 'FAQs', 'Security'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'] },
  { title: 'Connect', links: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram'] },
]

export default function Footer() {
  return (
    <motion.footer 
      className="bg-black text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#a3b18a]" />
              <span className="text-base sm:text-lg font-bold animated-gradient-text">KaamKonnect</span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Your gateway to flexible work opportunities and talented professionals in India.
            </p>
          </div>
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">{section.title}</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href="#" className="text-xs sm:text-sm hover:text-[#a3b18a] transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} KaamKonnect. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}

