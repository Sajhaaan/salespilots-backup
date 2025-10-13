'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  X,
  Zap, 
  Star,
  Clock,
  Shield,
  Headphones,
  Smartphone,
  BarChart3,
  MessageSquare,
  CreditCard,
  Globe,
  Users,
  Package,
  Sparkles,
  Crown,
  Rocket,
  HelpCircle
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const pricingPlans = [
  {
    name: "Starter",
    subtitle: "Perfect for new Instagram businesses",
    price: "₹999",
    originalPrice: "₹1,499",
    period: "/month",
    description: "Get started with essential automation features",
    features: [
      "100 automated DMs/month",
      "Basic payment verification",
      "2 Instagram accounts",
      "Standard AI responses",
      "Email support",
      "Basic analytics dashboard",
      "Hindi & English support",
      "Mobile app access"
    ],
    limitations: [
      "Limited to 100 DMs/month",
      "Basic templates only",
      "Community support"
    ],
    popular: false,
    color: "blue",
    icon: Package,
    cta: "Start Free Trial",
    savings: "Save 33%"
  },
  {
    name: "Professional",
    subtitle: "Best for growing businesses",
    price: "₹2,999",
    originalPrice: "₹4,499",
    period: "/month", 
    description: "Advanced automation with premium features",
    features: [
      "1,000 automated DMs/month",
      "Advanced payment verification",
      "5 Instagram accounts",
      "Smart AI conversations",
      "WhatsApp Business integration",
      "Advanced analytics & insights",
      "15+ Indian languages",
      "Priority email & chat support",
      "Custom automation workflows",
      "Product catalog management",
      "Customer segmentation",
      "Automated follow-ups"
    ],
    limitations: [],
    popular: true,
    color: "purple",
    icon: Crown,
    cta: "Get Professional",
    savings: "Save 33%"
  },
  {
    name: "Enterprise",
    subtitle: "For large scale operations",
    price: "₹9,999",
    originalPrice: "₹14,999", 
    period: "/month",
    description: "Complete business automation solution",
    features: [
      "Unlimited automated DMs",
      "Enterprise payment verification",
      "Unlimited Instagram accounts",
      "Custom AI model training",
      "Full WhatsApp Business API",
      "Real-time analytics dashboard",
      "All Indian languages + dialects",
      "24/7 dedicated phone support",
      "Custom integrations (Shopify, WooCommerce)",
      "White-label solution",
      "On-premise deployment option",
      "Advanced security features",
      "Team collaboration tools",
      "API access",
      "Custom reporting",
      "Dedicated account manager"
    ],
    limitations: [],
    popular: false,
    color: "orange",
    icon: Rocket,
    cta: "Contact Sales",
    savings: "Save 33%"
  }
]

const features = [
  {
    category: "Core Features",
    items: [
      { name: "Automated DM Responses", starter: "100/month", pro: "1,000/month", enterprise: "Unlimited" },
      { name: "Payment Verification", starter: "Basic", pro: "Advanced", enterprise: "Enterprise" },
      { name: "Instagram Accounts", starter: "2", pro: "5", enterprise: "Unlimited" },
      { name: "Language Support", starter: "2", pro: "15+", enterprise: "All + Dialects" },
      { name: "AI Response Quality", starter: "Standard", pro: "Smart", enterprise: "Custom Trained" },
      { name: "Analytics Dashboard", starter: "Basic", pro: "Advanced", enterprise: "Real-time" }
    ]
  },
  {
    category: "Integrations",
    items: [
      { name: "WhatsApp Business", starter: false, pro: true, enterprise: true },
      { name: "Shopify Integration", starter: false, pro: false, enterprise: true },
      { name: "WooCommerce Integration", starter: false, pro: false, enterprise: true },
      { name: "Custom Integrations", starter: false, pro: false, enterprise: true },
      { name: "API Access", starter: false, pro: false, enterprise: true },
      { name: "Webhook Support", starter: false, pro: true, enterprise: true }
    ]
  },
  {
    category: "Support & Security",
    items: [
      { name: "Customer Support", starter: "Email", pro: "Email + Chat", enterprise: "24/7 Dedicated" },
      { name: "Data Encryption", starter: true, pro: true, enterprise: true },
      { name: "GDPR Compliance", starter: true, pro: true, enterprise: true },
      { name: "Advanced Security", starter: false, pro: true, enterprise: true },
      { name: "SLA Guarantee", starter: false, pro: false, enterprise: "99.9%" },
      { name: "Dedicated Manager", starter: false, pro: false, enterprise: true }
    ]
  }
]

const faqs = [
  {
    question: "What is the free trial period?",
    answer: "We offer a 14-day free trial for all plans. No credit card required to start. You can explore all features and see how SalesPilots transforms your Instagram business."
  },
  {
    question: "Can I change my plan anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major Indian payment methods including UPI, Credit/Debit cards, Net Banking, and international cards. All payments are processed securely."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees! We believe in transparent pricing. What you see is what you pay - no hidden charges or additional setup costs."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with SalesPilots, we'll refund your payment with no questions asked."
  },
  {
    question: "Can I use SalesPilots for multiple businesses?",
    answer: "Each plan allows multiple Instagram accounts as specified. For multiple businesses, you may need separate subscriptions or consider our Enterprise plan for unlimited accounts."
  }
]

export default function PricingPage() {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handlePlanSelection = async (planName: string, period: string) => {
    if (planName === 'enterprise') {
      router.push('/contact')
      return
    }

    setIsLoading(planName)
    
    try {
      // Check if user is logged in
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        // User not logged in, redirect to sign up
        router.push(`/sign-up?plan=${planName}&billing=${period}`)
        return
      }

      // User is logged in, create subscription
      const subscriptionResponse = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          plan: planName,
          billingPeriod: period
        })
      })

      const data = await subscriptionResponse.json()

      if (data.success) {
        // Redirect to payment page
        window.location.href = data.paymentLink
      } else {
        toast.error(data.error || 'Failed to create subscription')
      }
    } catch (error) {
      console.error('Plan selection error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

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
              <Link href="/features" className="nav-link">Features</Link>
              <Link href="/pricing" className="nav-link text-blue-400">Pricing</Link>
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

      {/* Hero Section */}
      <section className="relative py-32 hero-gradient">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              Simple, Transparent Pricing
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="gradient-text-primary block">Choose Your</span>
              <span className="text-white/90 block">Growth Plan</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Start with our free trial and scale your Instagram business with AI automation. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-16">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 flex items-center space-x-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    billingPeriod === 'yearly'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Yearly
                  <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Save 33%</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon
              const yearlyPrice = billingPeriod === 'yearly' 
                ? `₹${Math.floor(parseInt(plan.price.replace('₹', '').replace(',', '')) * 0.67).toLocaleString()}`
                : plan.price
              
              return (
                <div key={plan.name} className={`premium-card hover-lift relative ${plan.popular ? 'ring-2 ring-purple-500/50 scale-105' : ''} animate-fade-in-up stagger-${index + 1}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                        <Crown className="w-4 h-4" />
                        <span>Most Popular</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-${plan.color}-500/20 to-${plan.color}-600/20 rounded-2xl flex items-center justify-center border border-${plan.color}-500/30`}>
                      <Icon className={`w-8 h-8 text-${plan.color}-400`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/60 mb-4">{plan.subtitle}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-4xl font-black gradient-text-primary">{yearlyPrice}</span>
                        <span className="text-white/60">{plan.period}</span>
                      </div>
                      {billingPeriod === 'yearly' && (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-white/40 line-through text-lg">{plan.originalPrice}</span>
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                            {plan.savings}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-white/70">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-white/60 text-sm font-medium mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-start space-x-3">
                            <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-white/60 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button 
                    onClick={() => handlePlanSelection(plan.name.toLowerCase(), billingPeriod)}
                    disabled={isLoading === plan.name.toLowerCase()}
                    className={`w-full text-center py-4 rounded-xl font-semibold transition-all ${
                      plan.popular 
                        ? 'btn-premium' 
                        : 'btn-secondary-premium'
                    } ${isLoading === plan.name.toLowerCase() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading === plan.name.toLowerCase() ? 'Processing...' : plan.cta}
                  </button>

                  <div className="mt-4 text-center">
                    <span className="text-white/60 text-sm">14-day free trial • No credit card required</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="relative py-32 cta-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Detailed</span>
              <span className="gradient-text-accent"> Comparison</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Compare features across all plans to find the perfect fit for your business
            </p>
          </div>

          <div className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              {features.map((category, categoryIndex) => (
                <div key={category.category} className="mb-12 last:mb-0">
                  <h3 className="text-xl font-bold text-white mb-6 px-6">{category.category}</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-6 text-white/70 font-medium">Feature</th>
                        <th className="text-center py-4 px-6 text-white/70 font-medium">Starter</th>
                        <th className="text-center py-4 px-6 text-white/70 font-medium">Professional</th>
                        <th className="text-center py-4 px-6 text-white/70 font-medium">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 text-white">{item.name}</td>
                          <td className="py-4 px-6 text-center">
                            {typeof item.starter === 'boolean' ? (
                              item.starter ? (
                                <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-white/80">{item.starter}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {typeof item.pro === 'boolean' ? (
                              item.pro ? (
                                <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-white/80">{item.pro}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {typeof item.enterprise === 'boolean' ? (
                              item.enterprise ? (
                                <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-white/80">{item.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Frequently Asked</span>
              <span className="gradient-text-primary"> Questions</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Get answers to common questions about our pricing and features
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className={`premium-card mb-6 animate-fade-in-up stagger-${index + 1}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  </div>
                  <div className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                    <ArrowRight className="w-5 h-5 text-white/60 rotate-90" />
                  </div>
                </button>
                
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <div className="pl-10">
                      <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-morph opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">Ready to</span>
              <br />
              <span className="gradient-text-primary">Get Started?</span>
            </h2>
            <p className="text-2xl text-white/70 mb-12 leading-relaxed">
              Start your 14-day free trial today. No credit card required, cancel anytime.
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
                  <span>Contact Sales</span>
                  <Headphones className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/60">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span>30-day money back guarantee</span>
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
