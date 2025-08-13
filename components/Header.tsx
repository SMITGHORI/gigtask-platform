'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'floating-header' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            {/* BUYER: Replace Leaf icon with your logo and update company name */}
            <Leaf className="w-8 h-8 text-[#a3b18a]" />
            <span className="text-xl font-bold animated-gradient-text">KaamKonnect</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {/* BUYER: Customize navigation menu items for your business */}
            {['Features', 'Categories', 'How It Works'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-[#a3b18a] transition-colors">
                  {item}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button variant="outline" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black">
                Get Started
              </Button>
            </motion.div>
          </nav>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg"
          >
            <nav className="flex flex-col space-y-4 p-4">
              {/* BUYER: Mobile navigation menu - same items as desktop */}
              {['Features', 'Categories', 'How It Works'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-[#a3b18a] transition-colors">
                    {item}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button variant="outline" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black w-full">
                  Get Started
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

