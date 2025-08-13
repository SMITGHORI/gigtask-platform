'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Get user profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (profile?.role === 'admin') {
          setIsAdmin(true)
        }
      }
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'floating-header' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center space-x-2">
            {/* BUYER: Replace Leaf icon with your logo and update company name */}
            <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-[#a3b18a]" />
            <span className="text-lg sm:text-xl font-bold animated-gradient-text">KaamKonnect</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* BUYER: Customize navigation menu items for your business */}
            {['Features', 'Categories', 'How It Works'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm lg:text-base hover:text-[#a3b18a] transition-colors">
                  {item}
                </Link>
              </motion.div>
            ))}
            {/* Admin Access Button */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-[#a3b18a]/50 text-[#a3b18a] hover:bg-[#a3b18a]/10 text-sm mr-2">
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {user ? (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black text-sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black text-sm">
                    Get Started
                  </Button>
                </Link>
              )}
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
              {/* Admin Access Button - Mobile */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Link href="/admin">
                    <Button variant="outline" className="border-[#a3b18a]/50 text-[#a3b18a] hover:bg-[#a3b18a]/10 w-full mb-2">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black w-full">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black w-full">
                      Get Started
                    </Button>
                  </Link>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

