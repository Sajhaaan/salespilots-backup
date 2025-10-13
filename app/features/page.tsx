'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  MessageSquare, 
  CreditCard, 
  ShoppingCart, 
  Globe, 
  Zap, 
  Bot, 
  Brain, 
  Shield, 
  Clock, 
  BarChart3,
  Users,
  Smartphone,
  Camera,
  FileText,
  Headphones,
  Star,
  Plus,
  X
} from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    category: "AI Automation",
    icon: Bot,
    color: "blue",
    items: [
      {
        icon: MessageSquare,
        title: "Intelligent DM Automation",
        description: "AI automatically responds to Instagram DMs in natural language, understanding context and intent",
        benefits: ["24/7 automated responses", "Natural conversation flow", "Context-aware replies", "Multi-language support"]
      },
      {
        icon: Brain,
        title: "Smart Product Recognition",
        description: "AI recognizes products from customer screenshots and Instagram posts with 99% accuracy",
        benefits: ["Image-to-product matching", "Real-time catalog lookup", "Visual search capabilities", "Instant product recommendations"]
      },
      {
        icon: Globe,
        title: "Multi-Language Processing",
        description: "Support for Hindi, Tamil, Telugu, Marathi, Bengali, and Manglish (Mix of English-local languages)",
        benefits: ["15+ Indian languages", "Cultural context understanding", "Regional dialect support", "Automatic language detection"]
      }
    ]
  },
  {
    category: "Payment & Orders",
    icon: CreditCard,
    color: "green",
    items: [
      {
        icon: CreditCard,
        title: "UPI Payment Verification",
        description: "Automatically verify UPI payment screenshots with bank-grade security and accuracy",
        benefits: ["Screenshot verification", "Real-time validation", "Fraud detection", "Multiple UPI apps support"]
      },
      {
        icon: ShoppingCart,
        title: "Order Management System",
        description: "Streamlined order processing from inquiry to delivery with automated tracking",
        benefits: ["Order lifecycle management", "Inventory tracking", "Shipping integration", "Customer notifications"]
      },
      {
        icon: BarChart3,
        title: "Sales Analytics & Reporting",
        description: "Comprehensive analytics dashboard with real-time insights and performance metrics",
        benefits: ["Revenue tracking", "Customer behavior analysis", "Product performance", "Automated reports"]
      }
    ]
  },
  {
    category: "Communication",
    icon: Smartphone,
    color: "purple",
    items: [
      {
        icon: MessageSquare,
        title: "WhatsApp Business Integration",
        description: "Seamless integration with WhatsApp Business API for supplier communication and updates",
        benefits: ["Automated supplier notifications", "Order status updates", "Broadcast messages", "Template messaging"]
      },
      {
        icon: Users,
        title: "Customer Relationship Management",
        description: "Build and maintain customer relationships with automated follow-ups and personalized interactions",
        benefits: ["Customer profiling", "Purchase history tracking", "Automated follow-ups", "Loyalty programs"]
      },
      {
        icon: Headphones,
        title: "24/7 Customer Support",
        description: "Round-the-clock AI-powered customer support in multiple Indian languages",
        benefits: ["Instant query resolution", "Escalation management", "Support ticket tracking", "Multi-channel support"]
      }
    ]
  },
  {
    category: "Business Intelligence",
    icon: BarChart3,
    color: "orange",
    items: [
      {
        icon: Camera,
        title: "Visual Content Analysis",
        description: "AI analyzes your Instagram content performance and suggests optimization strategies",
        benefits: ["Content performance tracking", "Engagement optimization", "Hashtag suggestions", "Best posting times"]
      },
      {
        icon: FileText,
        title: "Automated Documentation",
        description: "Generate invoices, receipts, and business documents automatically for every transaction",
        benefits: ["Invoice generation", "Tax compliance", "Receipt automation", "Financial reporting"]
      },
      {
        icon: Shield,
        title: "Security & Compliance",
        description: "Enterprise-grade security with data encryption and compliance with Indian regulations",
        benefits: ["Data encryption", "GDPR compliance", "Regular security audits", "Secure payment processing"]
      }
    ]
  }
]

const pricingPlans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for small Instagram businesses",
    features: [
      "100 automated DMs/month",
      "Basic payment verification",
      "2 social media accounts",
      "Email support",
      "Basic analytics"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "₹2,999",
    period: "/month", 
    description: "Ideal for growing businesses",
    features: [
      "1,000 automated DMs/month",
      "Advanced payment verification",
      "5 social media accounts",
      "WhatsApp integration",
      "Advanced analytics",
      "Priority support",
      "Custom automations"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹9,999",
    period: "/month",
    description: "For large scale operations",
    features: [
      "Unlimited automated DMs",
      "Enterprise payment verification",
      "Unlimited accounts",
      "Custom integrations",
      "White-label solution",
      "24/7 dedicated support",
      "Custom AI training",
      "On-premise deployment"
    ],
    popular: false
  }
]

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

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
                <h1 className="text-2xl font-bold gradient-text-primary">SalesPilots</h1>
                <p className="text-xs font-medium text-blue-400/80 tracking-wider">AI AUTOMATION</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/features" className="nav-link text-blue-400">Features</Link>
              <Link href="/pricing" className="nav-link">Pricing</Link>
              <Link href="/about" className="nav-link">About</Link>
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



      {/* Feature Categories */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Complete</span>
              <span className="gradient-text-primary"> Feature Set</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Everything you need to automate and scale your Instagram business
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {features.map((category, index) => {
              const Icon = category.icon
              return (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(index)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                    selectedCategory === index
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.category}</span>
                </button>
              )
            })}
          </div>

          {/* Feature Details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features[selectedCategory].items.map((feature, index) => {
              const Icon = feature.icon
              const isExpanded = expandedFeature === `${selectedCategory}-${index}`
              
              return (
                <div key={index} className={`premium-card hover-lift group animate-fade-in-up stagger-${index + 1}`}>
                  <div className={`feature-icon bg-gradient-to-br from-${features[selectedCategory].color}-500/20 to-${features[selectedCategory].color}-600/20 border-${features[selectedCategory].color}-500/30`}>
                    <Icon className={`w-10 h-10 text-${features[selectedCategory].color}-400 group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text-primary transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="border-t border-white/10 pt-4 mb-4">
                      <h4 className="text-white font-semibold mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-3">
                            <CheckCircle className={`w-4 h-4 text-${features[selectedCategory].color}-400 flex-shrink-0`} />
                            <span className="text-white/70 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedFeature(isExpanded ? null : `${selectedCategory}-${index}`)}
                    className={`flex items-center text-${features[selectedCategory].color}-400 text-sm font-medium group-hover:text-${features[selectedCategory].color}-300 transition-colors`}
                  >
                    {isExpanded ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Learn More
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative py-32 cta-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Choose Your</span>
              <span className="gradient-text-accent"> Plan</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Select the perfect plan that matches your business needs and scale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={plan.name} className={`premium-card hover-lift relative ${plan.popular ? 'ring-2 ring-blue-500/50 scale-105' : ''} animate-fade-in-up stagger-${index + 1}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black gradient-text-primary">{plan.price}</span>
                    <span className="text-white/60">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/sign-up" 
                  className={`w-full text-center py-4 rounded-xl font-semibold transition-all ${
                    plan.popular 
                      ? 'btn-premium' 
                      : 'btn-secondary-premium'
                  }`}
                >
                  Get Started
                </Link>
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
              <span className="text-white">Ready to</span>
              <br />
              <span className="gradient-text-primary">Supercharge Your Business?</span>
            </h2>
            <p className="text-2xl text-white/70 mb-12 leading-relaxed">
              Join thousands of successful Instagram businesses using our AI-powered automation platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/sign-up" className="btn-premium text-2xl px-16 py-6 group shimmer">
                <span className="flex items-center space-x-4">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              <Link href="/contact" className="btn-secondary-premium text-2xl px-16 py-6 group">
                <span className="flex items-center space-x-4">
                  <span>Schedule Demo</span>
                  <Clock className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/60">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Cancel anytime</span>
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
                  <h3 className="text-2xl font-bold gradient-text-primary">SalesPilots</h3>
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
                              <p className="text-white/60">© 2024 SalesPilots. All rights reserved.</p>
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
