import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase,
  ExternalLink
} from 'lucide-react'

const jobListings = [
  {
    id: 1,
    title: "Senior NLP Engineer (ESOP Only)",
    department: "AI Research & Development",
    location: "Remote (India) / Bangalore",
    type: "Full-time",
    experience: "3-5 years",
    salary: "2-5% ESOP",
    description: "Lead the development of advanced natural language processing models for multilingual customer interactions. Join as a founding team member with significant equity ownership."
  },
  {
    id: 2,
    title: "Senior Full-Stack Engineer (ESOP Only)",
    department: "Engineering",
    location: "Remote (India) / Mumbai",
    type: "Full-time",
    experience: "3-5 years",
    salary: "2-5% ESOP",
    description: "Build and scale our AI automation platform. Join as a founding team member with significant equity ownership and help shape the future of business automation."
  },
  {
    id: 3,
    title: "AI/ML Intern",
    department: "AI Research",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate",
    description: "Work on cutting-edge AI projects, learn from experienced engineers, and contribute to real-world NLP and automation solutions."
  },
  {
    id: 4,
    title: "Frontend Development Intern",
    department: "Engineering",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate",
    description: "Build beautiful, responsive user interfaces for our AI automation platform using modern web technologies."
  },
  {
    id: 5,
    title: "Backend Development Intern",
    department: "Engineering",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate",
    description: "Develop scalable backend systems and APIs that power our AI automation platform."
  },
  {
    id: 6,
    title: "Data Science Intern",
    department: "Data Science",
    location: "Remote (India)",
    type: "Internship",
    experience: "Final year students",
    salary: "Unpaid + Learning + Certificate",
    description: "Analyze business data, build predictive models, and create insights that drive product decisions."
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="gradient-orb orb-blue absolute -top-40 -left-40 float float-delay-1"></div>
        <div className="gradient-orb orb-purple absolute top-1/2 -right-20 float float-delay-2"></div>
        <div className="gradient-orb orb-pink absolute -bottom-20 left-1/3 float float-delay-3"></div>
      </div>

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative section-padding hero-gradient">
        <div className="max-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text-primary block mb-2">Join the AI Revolution</span>
              <span className="text-white/95 block mb-2">Build the Future</span>
              <span className="gradient-text-secondary block text-3xl md:text-5xl lg:text-6xl">Grow with Us</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our mission to democratize AI automation for Indian businesses. We're looking for 
              passionate interns seeking learning opportunities and experienced engineers who want to build the future with ESOP ownership.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#openings" className="btn-premium text-lg px-8 py-4 group">
                <span className="flex items-center space-x-2">
                  <span>View Open Positions</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="relative section-padding">
        <div className="max-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Open Positions</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Join our mission to revolutionize business automation with AI. We're looking for 
              passionate interns seeking learning opportunities and experienced engineers who want to grow with us and own a piece of the future through ESOP.
            </p>
          </div>

          <div className="space-y-6">
            {jobListings.map((job) => (
              <div key={job.id} className="p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group bg-gradient-to-br from-white/5 to-white/10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors mb-2">{job.title}</h3>
                    <p className="text-blue-400 font-medium mb-2">{job.department}</p>
                    <p className="text-white/70 text-sm mb-4">{job.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-sm text-white/70">
                    <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-white/70">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-sm text-white/70">
                    <Users className="w-4 h-4 mr-2 text-emerald-400" />
                    {job.experience}
                  </div>
                  <div className="flex items-center text-sm text-white/70">
                    <DollarSign className="w-4 h-4 mr-2 text-orange-400" />
                    {job.salary}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href={`/careers/apply/${job.id}`}
                    className="btn-premium flex-1 text-center group"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Apply Now</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding">
        <div className="max-container">
          <div className="max-w-4xl mx-auto text-center p-8 md:p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl backdrop-blur-sm border border-blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build the Future?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Don't see the perfect role? We're always looking for talented individuals who are 
              passionate about AI and automation. Send us your resume and let's talk!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="mailto:careers@salespilots.io?subject=General Application"
                className="btn-premium text-lg px-8 py-4 group"
              >
                <span className="flex items-center space-x-2">
                  <span>Send General Application</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="/contact"
                className="btn-secondary-premium text-lg px-8 py-4 group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Contact Our Team</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative section-padding border-t border-white/10">
        <div className="max-container">
          <div className="text-center">
            <p className="text-white/60 text-sm">
              © 2025 SalesPilots Technologies Pvt. Ltd. All rights reserved.
            </p>
            <p className="text-white/40 text-xs mt-2">
              Building the future of AI-powered business automation
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
