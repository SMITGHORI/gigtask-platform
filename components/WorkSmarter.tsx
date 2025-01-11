'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Briefcase, Clock, IndianRupee, Users } from 'lucide-react'

const WorkSmarter = forwardRef<HTMLElement, { inView: boolean }>(({ inView }, ref) => {
  const features = [
    { icon: Briefcase, title: 'Diverse Opportunities', description: 'Access a wide range of jobs across various industries.' },
    { icon: Clock, title: 'Flexible Scheduling', description: 'Work on your own terms and choose your own hours.' },
    { icon: IndianRupee, title: 'Competitive Pay', description: 'Earn fair compensation for your skills and time.' },
    { icon: Users, title: 'Growing Network', description: 'Connect with professionals and businesses across India.' },
  ]

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-gradient-to-b from-black to-[#a3b18a]/20"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
            Work Smarter
          </Badge>
          <h2 className="text-4xl font-bold mb-4 animated-gradient-text">Revolutionize Your Work Life</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience the future of work with KaamKonnect. Our platform brings together the best talent and opportunities across India, powered by cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-[#a3b18a]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <feature.icon className="w-12 h-12 text-[#a3b18a] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
})

WorkSmarter.displayName = 'WorkSmarter'

export default WorkSmarter

