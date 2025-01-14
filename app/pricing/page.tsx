import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'
import { motion } from "framer-motion"

export default function PricingPage() {
  const plans = [
    { 
      name: "Basic", 
      price: "$0", 
      features: ["5 job applications per month", "Basic profile", "Email support"]
    },
    { 
      name: "Pro", 
      price: "$19", 
      features: ["Unlimited job applications", "Featured profile", "Priority support", "Advanced analytics"]
    },
    { 
      name: "Business", 
      price: "$49", 
      features: ["Everything in Pro", "Dedicated account manager", "Custom branding", "API access"]
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header isMenuOpen={false} setIsMenuOpen={() => {}} />
      
      <main className="pt-20">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                Pricing
              </Badge>
              <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Find the perfect plan for your needs. Whether you're just starting out or scaling up, we have you covered.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-4xl font-bold mb-4">{plan.price}<span className="text-sm font-normal">/month</span></p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

