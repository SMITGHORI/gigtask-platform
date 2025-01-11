'use client'

import { motion } from 'framer-motion'
import { Briefcase, Clock, DollarSign, Users, Zap, Shield, Target, Star } from 'lucide-react'

const gridItems = [
  { icon: Briefcase, label: 'Jobs' },
  { icon: Clock, label: 'Flexible' },
  { icon: DollarSign, label: 'Earnings' },
  { icon: Users, label: 'Network' },
  { icon: Zap, label: 'Fast' },
  { icon: Shield, label: 'Secure' },
  { icon: Target, label: 'Targeted' },
  { icon: Star, label: 'Quality' },
]

export default function CreativeGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12">
      {gridItems.map((item, index) => (
        <motion.div
          key={index}
          className="relative aspect-square bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <item.icon size={40} className="mb-2" />
            </motion.div>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

