'use client'

import { useEffect, useRef, useState } from 'react'
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Briefcase, Clock, IndianRupee, Users, Zap, Shield, Target, Star, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PreFooter from '@/components/PreFooter'
import BackgroundGrid from '@/components/BackgroundGrid'
import WorkSmarter from '@/components/WorkSmarter'

const BlurryBlob = ({ className }: { className: string }) => (
  <motion.div
    className={`blurry-blob ${className}`}
    animate={{
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)

export default function Home() {
  const [isVisible, setIsVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const workSmarterRef = useRef(null)
  const testimonialsRef = useRef(null)

  const heroInView = useInView(heroRef, { once: false, amount: 0.5 })
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 })
  const howItWorksInView = useInView(howItWorksRef, { once: false, amount: 0.3 })
  const workSmarterInView = useInView(workSmarterRef, { once: false, amount: 0.5 })
  const testimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 })

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollPosition = window.scrollY
        const elementPosition = scrollRef.current.offsetTop
        setIsVisible(scrollPosition < elementPosition)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])
  const y = useTransform(scrollY, [0, 300], [0, 50])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scaleSpring = useSpring(scale, springConfig)
  const ySpring = useSpring(y, springConfig)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BackgroundGrid />
      <BlurryBlob className="top-1/4 left-1/4" />
      <BlurryBlob className="bottom-1/4 right-1/4" />

      <Header />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale: scaleSpring, y: ySpring }}
        className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto text-center max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* BUYER: Update tagline to match your business */}
            <Badge variant="outline" className="mb-6 sm:mb-8 text-xs sm:text-sm border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
              Connect. Work. Succeed.
            </Badge>
          </motion.div>
                      {/* BUYER: Update main headline to match your business value proposition */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animated-gradient-text px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your Gateway to Flexible Work Opportunities in India
            </motion.h1>
                      {/* BUYER: Update description to match your business model */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Connect with local businesses and event organizers. Find flexible work that fits your schedule.
            </motion.p>
          
          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto mb-8 sm:mb-12 relative px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="absolute inset-y-0 left-6 sm:left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            {/* BUYER: Customize search placeholder text */}
            <Input 
              type="text"
              placeholder="Search for opportunities..."
              className="w-full pl-10 sm:pl-12 pr-4 py-4 sm:py-6 text-sm sm:text-base bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-[#a3b18a]/50 focus:ring-[#a3b18a]/50"
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {/* BUYER: Update CTA button text to match your business actions */}
            <Button size="lg" className="w-full sm:w-auto bg-[#a3b18a] text-black hover:bg-[#a3b18a]/80 px-6 sm:px-8">
              Post a Task
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#a3b18a] text-[#a3b18a] hover:bg-[#a3b18a] hover:text-black px-6 sm:px-8">
              Find Work
            </Button>
          </motion.div>
        </div>

        <motion.div
          ref={scrollRef}
          className={`scroll-fade-out ${isVisible ? '' : 'hidden'} absolute bottom-10 left-1/2 transform -translate-x-1/2`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, repeat: Infinity, repeatType: 'reverse' }}
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        ref={featuresRef}
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
              Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animated-gradient-text px-4 sm:px-0">Everything You Need</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Powerful features to help you find work or hire talent with ease in India.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* BUYER: Customize feature grid icons and labels to match your business */}
            {[
              { icon: Briefcase, label: 'Jobs' },
              { icon: Clock, label: 'Flexible' },
              { icon: IndianRupee, label: 'Earnings' },
              { icon: Users, label: 'Network' },
              { icon: Zap, label: 'Fast' },
              { icon: Shield, label: 'Secure' },
              { icon: Target, label: 'Targeted' },
              { icon: Star, label: 'Quality' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/5 rounded-lg backdrop-blur-sm min-h-[100px] sm:min-h-[120px]"
              >
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 text-[#a3b18a]" />
                <span className="text-xs sm:text-sm font-medium text-center">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        ref={howItWorksRef}
        className="py-16 sm:py-20 bg-[#a3b18a]/10 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={howItWorksInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
              How It Works
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animated-gradient-text px-4 sm:px-0">Simple Steps to Success</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Getting started with KaamKonnect is easy. Follow these simple steps to find your next opportunity or hire talent in India.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* BUYER: Customize the process steps to match your business workflow */}
            {[
              { step: 1, title: "Create Your Profile", description: "Sign up and showcase your skills and experience." },
              { step: 2, title: "Browse Opportunities", description: "Explore a wide range of gigs that match your interests." },
              { step: 3, title: "Apply and Connect", description: "Apply for gigs and connect with potential clients or talent." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative bg-white/5 backdrop-blur-lg rounded-lg p-5 sm:p-6 border border-[#a3b18a]/10"
              >
                <div className="absolute -left-3 sm:-left-4 -top-3 sm:-top-4 w-10 h-10 sm:w-12 sm:h-12 bg-[#a3b18a] rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold text-black">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 pt-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Work Smarter Section */}
      <WorkSmarter ref={workSmarterRef} inView={workSmarterInView} />

      {/* Testimonials */}
      <motion.section
        ref={testimonialsRef}
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={testimonialsInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
              Testimonials
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animated-gradient-text px-4 sm:px-0">What Our Users Say</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Hear from professionals and businesses who have found success on our platform in India.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* BUYER: Replace with real customer testimonials from your business */}
            {[
              { name: "Priya S.", role: "Freelance Designer", quote: "KaamKonnect has transformed my freelance career. I've connected with amazing clients across India and my income has doubled!" },
              { name: "Rahul M.", role: "Small Business Owner", quote: "Finding reliable talent has never been easier. KaamKonnect has helped my business grow exponentially in the competitive Indian market." },
              { name: "Ananya R.", role: "Event Coordinator", quote: "The flexibility and variety of gigs available here are unmatched. It's perfect for my fluctuating schedule in the bustling event industry of India." }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-lg rounded-lg p-5 sm:p-6 border border-[#a3b18a]/10"
              >
                <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a3b18a] rounded-full mr-3 sm:mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <PreFooter />
      <Footer />
    </div>
  )
}

