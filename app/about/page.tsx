'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  Zap, 
  Target,
  Eye,
  Heart,
  Users,
  Globe,
  TrendingUp,
  Award,
  Shield,
  Rocket,
  Star,
  CheckCircle,
  Lightbulb,
  Coffee,
  Code,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  Linkedin
} from 'lucide-react'

const stats = [
  { label: "Active Users", value: "Loading...", icon: Users },
  { label: "Messages Automated", value: "Loading...", icon: Zap },
  { label: "Revenue Generated", value: "Loading...", icon: TrendingUp },
  { label: "Languages Supported", value: "Loading...", icon: Globe }
]

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We constantly push the boundaries of what's possible with AI automation to give our users a competitive edge.",
    color: "blue"
  },
  {
    icon: Heart,
    title: "Customer Obsessed",
    description: "Every feature we build is driven by our users' success. Your growth is our primary motivation.",
    color: "red"
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We maintain the highest standards of data security and privacy protection for our users' businesses.",
    color: "green"
  },
  {
    icon: Rocket,
    title: "Scale & Performance",
    description: "Built to handle millions of conversations while maintaining speed, reliability, and accuracy.",
    color: "purple"
  }
]

const team = [
  {
    name: "Sajhan",
    role: "Founder & CEO",
    bio: "AI Research and Development expert. Leading the vision for democratizing business automation through cutting-edge AI technology.",
    image: "SA",
    education: "AI Research & Development",
    experience: "AI Research, Product Development",
    linkedin: "#"
  },
  {
    name: "Rafan Razak",
    role: "Co-Founder & Brand Lead", 
    bio: "Marketing strategist and brand expert. Driving growth and market expansion through innovative marketing campaigns and brand positioning.",
    image: "RR",
    education: "Marketing & Brand Strategy",
    experience: "Brand Marketing, Growth Strategy",
    linkedin: "#"
  },
  {
    name: "Mishab",
    role: "AI Engineer",
    bio: "AI Research and Fine-tuning specialist. Expert in machine learning model optimization and AI system fine-tuning for optimal performance.",
    image: "MI",
    education: "AI Engineering & Research",
    experience: "AI Fine-tuning, ML Research",
    linkedin: "#"
  }
]

const milestones = [
  {
    year: "2023",
    quarter: "Q1",
    title: "Company Founded",
    description: "Started with a vision to democratize business automation for Indian SMEs"
  },
  {
    year: "2023", 
    quarter: "Q2",
    title: "MVP Launch",
    description: "Launched beta version with 50 early adopters from Mumbai and Delhi"
  },
  {
    year: "2023",
    quarter: "Q3", 
    title: "Series A Funding",
    description: "Raised ₹15 Cr from leading VCs to accelerate product development"
  },
  {
    year: "2023",
    quarter: "Q4",
    title: "1,000 Users",
    description: "Reached first 1,000 active users across 8 Indian cities"
  },
  {
    year: "2024",
    quarter: "Q1",
    title: "AI Breakthrough",
    description: "Achieved 99% accuracy in Hindi-English mixed language processing"
  },
  {
    year: "2024",
    quarter: "Q2",
    title: "10,000 Users",
    description: "Crossed 10,000 active users processing 1M+ messages monthly"
  }
]

const investors = [
  { name: "Sequoia Capital", logo: "SC" },
  { name: "Accel Partners", logo: "AP" },
  { name: "Matrix Partners", logo: "MP" },
  { name: "Lightspeed Ventures", logo: "LV" }
]

export default function AboutPage() {
  const [realStats, setRealStats] = useState(stats)

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        
        if (response.ok && data.success) {
          setRealStats([
            { label: "Active Users", value: data.activeUsers || "0", icon: Users },
            { label: "Messages Automated", value: data.messagesAutomated || "0", icon: Zap },
            { label: "Revenue Generated", value: data.revenueGenerated || "₹0", icon: TrendingUp },
            { label: "Languages Supported", value: data.languagesSupported || "1", icon: Globe }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="gradient-orb orb-blue absolute -top-40 -left-40 float float-delay-1"></div>
        <div className="gradient-orb orb-purple absolute top-1/2 -right-20 float float-delay-2"></div>
        <div className="gradient-orb orb-pink absolute -bottom-20 left-1/3 float float-delay-3"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 glass-card border-0 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text-primary">SalesPilot</h1>
                <p className="text-xs font-medium text-blue-400/80 tracking-wider">AI AUTOMATION</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/features" className="nav-link">Features</Link>
              <Link href="/pricing" className="nav-link">Pricing</Link>
              <Link href="/about" className="nav-link text-blue-400">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="hidden md:block text-white/70 hover:text-white transition-colors font-medium">
                Sign in
              </Link>
              <Link href="/sign-up" className="btn-premium">
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 hero-gradient">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white/90 text-sm font-medium mb-8">
              <Heart className="w-4 h-4 mr-2 text-red-400" />
              Our Story & Mission
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="gradient-text-primary block">Empowering</span>
              <span className="text-white/90 block">Indian Entrepreneurs</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              We believe every Indian business deserves access to cutting-edge AI automation. Our mission is to democratize business growth through intelligent technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="premium-card hover-lift animate-fade-in-left">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                  To empower every Indian entrepreneur with AI-powered automation tools that were previously accessible only to large corporations. We're building the future where small businesses can compete at scale.
                </p>
              </div>

              <div className="premium-card hover-lift animate-fade-in-left stagger-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                    <Eye className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                  A world where language barriers don't limit business growth, where AI understands cultural nuances, and where every Indian entrepreneur can scale their business infinitely through intelligent automation.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-8 animate-fade-in-right">Why We Started SalesPilot</h3>
              <div className="space-y-6 animate-fade-in-right stagger-2">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Language Barrier Problem</h4>
                    <p className="text-white/70">Existing automation tools couldn't understand Hinglish, Tamil, or other Indian languages properly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Cost Accessibility</h4>
                    <p className="text-white/70">International automation platforms were too expensive for Indian small businesses.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Cultural Context</h4>
                    <p className="text-white/70">Generic AI didn't understand Indian business culture, festivals, and customer behavior patterns.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Payment Integration</h4>
                    <p className="text-white/70">No seamless integration with UPI and other Indian payment methods for verification.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 cta-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Impact by</span>
              <span className="gradient-text-accent"> Numbers</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Real metrics from real businesses transforming with SalesPilot
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {realStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className={`glass-card text-center p-8 hover-glow group animate-fade-in-up stagger-${index + 1}`}>
                  <Icon className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div className="stat-number mb-2 text-4xl font-black">{stat.value}</div>
                  <p className="text-white/70 font-medium">{stat.label}</p>
                  <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Our</span>
              <span className="gradient-text-primary"> Values</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              The principles that guide everything we do at SalesPilot
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={value.title} className={`premium-card hover-lift group animate-fade-in-up stagger-${index + 1}`}>
                  <div className={`feature-icon bg-gradient-to-br from-${value.color}-500/20 to-${value.color}-600/20 border-${value.color}-500/30`}>
                    <Icon className={`w-10 h-10 text-${value.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text-primary transition-all duration-300">
                    {value.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-32 cta-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Meet Our</span>
              <span className="gradient-text-accent"> Team</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Passionate technologists from top companies building the future of business automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className={`premium-card hover-lift group text-center animate-fade-in-up stagger-${index + 1}`}>
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {member.image}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                <p className="text-white/70 text-sm leading-relaxed mb-6">{member.bio}</p>
                
                <div className="space-y-2 text-xs text-white/60 mb-6">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-3 h-3" />
                    <span>{member.education}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-3 h-3" />
                    <span>{member.experience}</span>
                  </div>
                </div>

                <Link href={member.linkedin} className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">Connect</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Our</span>
              <span className="gradient-text-primary"> Journey</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From idea to impact - the SalesPilot story
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-start space-x-8 mb-12 last:mb-0 animate-fade-in-up stagger-${index + 1}`}>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
                      {milestone.quarter}
                    </div>
                    <div className="absolute -top-2 -left-2 w-20 h-20 border-2 border-blue-500/30 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="premium-card flex-1 hover-lift">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                        {milestone.year}
                      </div>
                      <Calendar className="w-4 h-4 text-white/60" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                    <p className="text-white/70 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="relative py-24 cta-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Backed by</span>
              <span className="gradient-text-accent"> Top Investors</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Trusted by leading venture capital firms who believe in our vision
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {investors.map((investor, index) => (
              <div key={investor.name} className={`glass-card text-center p-8 hover-glow group animate-fade-in-up stagger-${index + 1}`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {investor.logo}
                </div>
                <p className="text-white/70 font-medium">{investor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 leading-tight">
              <span className="text-white">Join Our</span>
              <br />
              <span className="gradient-text-primary">Mission</span>
            </h2>
            <p className="text-2xl text-white/70 mb-12 leading-relaxed">
              Ready to transform your Instagram business with AI? Let's build the future together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/sign-up" className="btn-premium text-2xl px-16 py-6 group shimmer">
                <span className="flex items-center space-x-4">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              <Link href="/contact" className="btn-secondary-premium text-2xl px-16 py-6 group">
                <span className="flex items-center space-x-4">
                  <span>Get in Touch</span>
                  <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/60">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Join 10,000+ businesses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text-primary">SalesPilot</h3>
                  <p className="text-sm font-medium text-blue-400/80 tracking-wider">AI AUTOMATION</p>
                </div>
              </div>
              <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-md">
                Transform your Instagram business with AI-powered automation that scales infinitely.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/features" className="footer-link">Features</Link></li>
                <li><Link href="/pricing" className="footer-link">Pricing</Link></li>
                <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
                <li><Link href="/automation" className="footer-link">Automation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="footer-link">About Us</Link></li>
                <li><Link href="/contact" className="footer-link">Contact</Link></li>
                <li><Link href="/blog" className="footer-link">Blog</Link></li>
                <li><Link href="/careers" className="footer-link">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-white/60">© 2024 SalesPilot. All rights reserved.</p>
              <div className="flex items-center space-x-6">
                <Link href="/privacy" className="footer-link text-sm">Privacy Policy</Link>
                <Link href="/terms" className="footer-link text-sm">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
