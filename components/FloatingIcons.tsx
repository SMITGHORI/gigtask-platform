'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Clock, DollarSign, Users } from 'lucide-react'

const icons = [Briefcase, Clock, DollarSign, Users]

export default function FloatingIcons() {
  const [particles, setParticles] = useState<JSX.Element[]>([])

  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < 20; i++) {
      const Icon = icons[Math.floor(Math.random() * icons.length)]
      newParticles.push(
        <motion.div
          key={i}
          className="absolute text-white/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Icon size={Math.random() * 20 + 10} />
        </motion.div>
      )
    }
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles}
    </div>
  )
}

