import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PreFooter from '@/components/PreFooter'
import { Badge } from "@/components/ui/badge"

export default function HowItWorksPage() {
  const steps = [
    { step: 1, title: "Create Your Profile", description: "Sign up and showcase your skills and experience." },
    { step: 2, title: "Browse Opportunities", description: "Explore a wide range of gigs that match your interests across India." },
    { step: 3, title: "Apply and Connect", description: "Apply for gigs and connect with potential clients or talent." },
    { step: 4, title: "Complete the Work", description: "Deliver high-quality work and build your reputation in the Indian market." },
    { step: 5, title: "Get Paid", description: "Receive secure and timely payments in Indian Rupees for your completed tasks." },
    { step: 6, title: "Grow Your Network", description: "Build relationships and expand your professional network throughout India." }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm border-[#a3b18a] bg-[#a3b18a]/10 text-[#a3b18a]">
                How It Works
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animated-gradient-text px-4 sm:px-0">Your Path to Success</h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
                Follow these simple steps to start your journey with KaamKonnect and unlock a world of opportunities in India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white/5 backdrop-blur-lg rounded-lg p-5 sm:p-6 border border-[#a3b18a]/10"
                >
                  <div className="absolute -left-3 sm:-left-4 -top-3 sm:-top-4 w-10 h-10 sm:w-12 sm:h-12 bg-[#a3b18a] rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold text-black">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 pt-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{item.description}</p>
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

