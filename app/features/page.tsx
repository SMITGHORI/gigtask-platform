import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PreFooter from '@/components/PreFooter'
import { Badge } from "@/components/ui/badge"
import { Target, Calendar, IndianRupee, Shield, Users, Briefcase } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
                Features
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animated-gradient-text px-4 sm:px-0">Powerful Features for Your Success</h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
                Discover the tools and capabilities that make KaamKonnect the perfect platform for your flexible work needs in India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                          {/* BUYER: Customize features, descriptions, and icons to match your business offerings */}
            {[
              { icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Smart Matching", description: "AI-powered job matching that connects you with relevant opportunities across India." },
              { icon: <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Flexible Scheduling", description: "Set your own hours and work when it suits you best, perfect for the Indian gig economy." },
              { icon: <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Competitive Pay", description: "Fair compensation for your skills and time, with transparent pricing in Indian Rupees." },
              { icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Secure Platform", description: "Your data and payments are always protected, adhering to Indian cybersecurity standards." },
              { icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Community", description: "Join a network of professionals and businesses from all over India." },
              { icon: <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Diverse Opportunities", description: "Find work across multiple industries and sectors throughout India." }
            ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg rounded-lg p-5 sm:p-6 border border-[#a3b18a]/10"
                >
                  <div className="mb-4 p-2 sm:p-3 rounded-lg bg-[#a3b18a]/10 w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PreFooter />
      <Footer />
    </div>
  )
}

