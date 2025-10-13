'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Cookie, Settings, Eye, AlertTriangle, X, Check, XCircle } from 'lucide-react'
import { useState } from 'react'

export default function CookiePolicyPage() {
  const [showCookieManager, setShowCookieManager] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: true,
    analytics: true,
    marketing: false
  })

  const handleCookieToggle = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const saveCookiePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    
    // In a real app, you would also send this to your backend
    console.log('Cookie preferences saved:', cookiePreferences)
    
    setShowCookieManager(false)
    
    // Show success message (you can use a toast library here)
    alert('Cookie preferences saved successfully!')
  }

  const acceptAllCookies = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    }
    setCookiePreferences(allAccepted)
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted))
    setShowCookieManager(false)
    alert('All cookies accepted!')
  }

  const rejectAllCookies = () => {
    const minimalCookies = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    }
    setCookiePreferences(minimalCookies)
    localStorage.setItem('cookiePreferences', JSON.stringify(minimalCookies))
    setShowCookieManager(false)
    alert('Only essential cookies enabled!')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text-primary">SalesPilot</h1>
                <p className="text-xs font-medium text-blue-400/80 tracking-wider">AI AUTOMATION</p>
              </div>
            </Link>
            
            <Link href="/" className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-orange-400 text-sm font-medium mb-6">
              <Cookie className="w-4 h-4 mr-2" />
              COOKIE POLICY
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Cookie</span>
              <br />
              <span className="gradient-text-accent">Policy</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Learn how we use cookies and similar technologies to enhance your experience on our platform.
            </p>
            <p className="text-white/60 mt-4">Last updated: December 15, 2024</p>
          </div>

          {/* Important Notice */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-orange-300 font-semibold mb-2">Cookie Consent</p>
                <p className="text-white/80">
                  By using our website, you consent to the use of cookies in accordance with this policy. You can manage your cookie preferences at any time through your browser settings or our cookie consent manager.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Introduction */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">1. What Are Cookies?</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content.
                </p>
                <p className="text-white/80 leading-relaxed">
                  We also use similar technologies such as web beacons, pixel tags, and local storage to enhance your experience and provide our services effectively.
                </p>
                <p className="text-white/80 leading-relaxed">
                  This policy explains what cookies we use, why we use them, and how you can control them.
                </p>
              </div>
            </section>

            {/* Types of Cookies */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">2. Types of Cookies We Use</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Essential Cookies</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    These cookies are necessary for the website to function properly and cannot be disabled. They include:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Authentication cookies that keep you logged in</li>
                    <li>Security cookies that protect against fraud and abuse</li>
                    <li>Session cookies that maintain your session state</li>
                    <li>Load balancing cookies that distribute traffic</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Functional Cookies</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    These cookies enhance your experience by remembering your preferences and settings:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Language and region preferences</li>
                    <li>Theme and display settings</li>
                    <li>Form data and user inputs</li>
                    <li>Chatbot conversation history</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Analytics Cookies</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our website:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Page views and navigation patterns</li>
                    <li>Time spent on pages and features</li>
                    <li>Error tracking and performance monitoring</li>
                    <li>User journey analysis</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Marketing Cookies</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    These cookies are used to deliver relevant advertisements and track marketing campaign performance:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Retargeting and remarketing cookies</li>
                    <li>Social media integration cookies</li>
                    <li>Advertising network cookies</li>
                    <li>Conversion tracking cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">3. Third-Party Cookies</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We work with trusted third-party services that may also place cookies on your device. These services help us provide better functionality and analytics:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Analytics Services</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li><strong>Google Analytics:</strong> Website usage analytics</li>
                      <li><strong>Mixpanel:</strong> User behavior tracking</li>
                      <li><strong>Hotjar:</strong> Heatmaps and session recordings</li>
                      <li><strong>Vercel Analytics:</strong> Performance monitoring</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Marketing Services</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li><strong>Facebook Pixel:</strong> Social media advertising</li>
                      <li><strong>Google Ads:</strong> Search advertising</li>
                      <li><strong>LinkedIn Insight:</strong> Professional network ads</li>
                      <li><strong>Twitter Pixel:</strong> Social media tracking</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Functional Services</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li><strong>Intercom:</strong> Customer support chat</li>
                    <li><strong>Stripe:</strong> Payment processing</li>
                    <li><strong>SendGrid:</strong> Email delivery</li>
                    <li><strong>Cloudflare:</strong> Content delivery and security</li>
                  </ul>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <p className="text-blue-300 font-semibold mb-2">Third-Party Privacy Policies:</p>
                  <p className="text-white/80">
                    Each third-party service has its own privacy policy and cookie practices. We recommend reviewing their policies to understand how they use your data.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">4. Managing Your Cookie Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Browser Settings</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    You can control cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Block all cookies or specific types of cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Set preferences for future cookies</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Our Cookie Consent Manager</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    We provide a cookie consent manager that allows you to:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Accept or reject different categories of cookies</li>
                    <li>Update your preferences at any time</li>
                    <li>View detailed information about each cookie</li>
                    <li>Withdraw consent for previously accepted cookies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Opt-Out Links</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    You can opt out of specific third-party cookies:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-400 hover:text-blue-300">Google Analytics Opt-out</a></li>
                    <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-400 hover:text-blue-300">Facebook Ad Preferences</a></li>
                    <li><strong>Google Ads:</strong> <a href="https://adssettings.google.com/" className="text-blue-400 hover:text-blue-300">Google Ad Settings</a></li>
                    <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/psettings/guest-controls" className="text-blue-400 hover:text-blue-300">LinkedIn Ad Preferences</a></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Specific Cookies Used */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">5. Specific Cookies We Use</h2>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 font-semibold text-white">Cookie Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Purpose</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Duration</th>
                        <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/80">
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">auth_token</td>
                        <td className="py-3 px-4">Authentication and session management</td>
                        <td className="py-3 px-4">30 days</td>
                        <td className="py-3 px-4">Essential</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">user_preferences</td>
                        <td className="py-3 px-4">Store user preferences and settings</td>
                        <td className="py-3 px-4">1 year</td>
                        <td className="py-3 px-4">Functional</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">_ga</td>
                        <td className="py-3 px-4">Google Analytics tracking</td>
                        <td className="py-3 px-4">2 years</td>
                        <td className="py-3 px-4">Analytics</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">_fbp</td>
                        <td className="py-3 px-4">Facebook advertising tracking</td>
                        <td className="py-3 px-4">3 months</td>
                        <td className="py-3 px-4">Marketing</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">cookie_consent</td>
                        <td className="py-3 px-4">Remember cookie consent preferences</td>
                        <td className="py-3 px-4">1 year</td>
                        <td className="py-3 px-4">Functional</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4">csrf_token</td>
                        <td className="py-3 px-4">Cross-site request forgery protection</td>
                        <td className="py-3 px-4">Session</td>
                        <td className="py-3 px-4">Essential</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Mobile Apps */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">6. Mobile Applications</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Our mobile applications may use similar technologies to cookies, such as:
                </p>
                <ul className="text-white/80 space-y-2 list-disc list-inside">
                  <li>Device identifiers and advertising IDs</li>
                  <li>Local storage and app data</li>
                  <li>Push notification tokens</li>
                  <li>Analytics and crash reporting data</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  You can manage these settings through your device's privacy settings or within the app itself.
                </p>
              </div>
            </section>

            {/* Updates to Policy */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">7. Updates to This Policy</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by:
                </p>
                <ul className="text-white/80 space-y-2 list-disc list-inside">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending you an email notification</li>
                  <li>Displaying a banner on our website</li>
                  <li>Updating the "Last updated" date</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  Your continued use of our website after any changes indicates your acceptance of the updated policy.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">8. Contact Us</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">General Inquiries</h3>
                  <div className="space-y-2">
                    <p className="text-white/80">
                      <span className="font-semibold">Email:</span> privacy@salespilot.io
                    </p>
                    <p className="text-white/80">
                      <span className="font-semibold">Phone:</span> +91 (800) 123-4567
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Mailing Address</h3>
                  <p className="text-white/80">
                    SalesPilot Technologies Pvt. Ltd.<br />
                    Privacy Team<br />
                    123 Tech Park, Electronic City<br />
                    Bangalore, Karnataka 560100<br />
                    India
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Cookie Consent Manager */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Manage Your Cookie Preferences</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Take control of your privacy by managing your cookie preferences. You can update your settings at any time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setShowCookieManager(true)}
                className="btn-premium inline-flex items-center space-x-3"
              >
                <Settings className="w-5 h-5" />
                <span>Cookie Settings</span>
              </button>
              <Link href="/" className="btn-secondary-premium inline-flex items-center space-x-3">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Cookie Manager Modal */}
      {showCookieManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
              <button 
                onClick={() => setShowCookieManager(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-white/80">
                Manage your cookie preferences to control how we use cookies and similar technologies on our website.
              </p>

              {/* Essential Cookies */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Essential Cookies</h3>
                    <p className="text-white/60 text-sm">Required for the website to function properly</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-sm font-medium">Always Active</span>
                  <Check className="w-5 h-5 text-green-400" />
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Functional Cookies</h3>
                    <p className="text-white/60 text-sm">Enhance your experience with personalized features</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCookieToggle('functional')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    cookiePreferences.functional ? 'bg-blue-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.functional ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Analytics Cookies</h3>
                    <p className="text-white/60 text-sm">Help us understand how visitors use our website</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCookieToggle('analytics')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    cookiePreferences.analytics ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.analytics ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Marketing Cookies</h3>
                    <p className="text-white/60 text-sm">Used to deliver relevant advertisements</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCookieToggle('marketing')}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    cookiePreferences.marketing ? 'bg-orange-500' : 'bg-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    cookiePreferences.marketing ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={acceptAllCookies}
                className="btn-premium flex-1"
              >
                Accept All Cookies
              </button>
              <button
                onClick={rejectAllCookies}
                className="btn-secondary-premium flex-1"
              >
                Reject All
              </button>
              <button
                onClick={saveCookiePreferences}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex-1"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
