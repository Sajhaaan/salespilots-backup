import Link from 'next/link'
import { ArrowLeft, RefreshCw, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text-primary">SalesPilots</h1>
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
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-green-400 text-sm font-medium mb-6">
              <RefreshCw className="w-4 h-4 mr-2" />
              REFUND POLICY
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Refund</span>
              <br />
              <span className="gradient-text-secondary">Policy</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              We want you to be completely satisfied with SalesPilots. Learn about our refund process and policies.
            </p>
            <p className="text-white/60 mt-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Quick Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">14-Day Trial</h3>
              <p className="text-white/70">Free trial period with full access to all features</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">30-Day Refund</h3>
              <p className="text-white/70">Full refund available within 30 days of first payment</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro-rata Refunds</h3>
              <p className="text-white/70">Partial refunds for annual subscriptions when applicable</p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Our Refund Guarantee */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 mr-4 text-green-400" />
                Our Refund Guarantee
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed text-lg">
                  At SalesPilots, we're confident in the value our AI automation platform provides. That's why we offer a comprehensive refund policy to ensure your satisfaction.
                </p>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-300 mb-3">100% Satisfaction Guarantee</h3>
                  <p className="text-white/80 leading-relaxed">
                    If you're not completely satisfied with SalesPilots within the first 30 days of your paid subscription, we'll provide a full refund, no questions asked. We believe in our product and want you to feel confident in your investment.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">What's Covered</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>All subscription plans (monthly and annual)</li>
                      <li>Full refund within 30 days of first payment</li>
                      <li>Partial refunds for valid technical issues</li>
                      <li>Pro-rata refunds for annual plans (case by case)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Processing Time</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Refund requests processed within 2 business days</li>
                      <li>Credit card refunds: 3-5 business days</li>
                      <li>Bank transfers: 5-7 business days</li>
                      <li>UPI/Digital wallets: 1-3 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Eligibility */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <AlertCircle className="w-8 h-8 mr-4 text-blue-400" />
                Refund Eligibility Criteria
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                    Eligible for Full Refund
                  </h3>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                    <ul className="text-white/80 space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">First-time subscribers</span> requesting refund within 30 days of initial payment
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">Technical issues</span> that prevent normal use of the service and cannot be resolved by our support team
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">Service unavailability</span> for more than 48 consecutive hours due to our system issues
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">Billing errors</span> or unauthorized charges processed by our payment system
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <XCircle className="w-6 h-6 mr-3 text-red-400" />
                    Not Eligible for Refund
                  </h3>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                    <ul className="text-white/80 space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">Account violations</span> that result in service termination due to breach of Terms of Service
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">Excessive usage</span> that violates fair use policies or subscription limits
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">Third-party integration issues</span> beyond our control (Instagram, WhatsApp API changes)
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold">Requests after 30 days</span> from the initial payment date (except for special circumstances)
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Process */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <RefreshCw className="w-8 h-8 mr-4 text-purple-400" />
                How to Request a Refund
              </h2>
              <div className="space-y-8">
                <p className="text-white/80 leading-relaxed text-lg">
                  Requesting a refund is simple and straightforward. Follow these steps to initiate your refund request:
                </p>
                
                <div className="grid gap-6">
                  {/* Step 1 */}
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Contact Our Support Team</h3>
                      <p className="text-white/80 leading-relaxed mb-3">
                        Send an email to <span className="text-blue-400 font-semibold">refunds@salespilot.io</span> or use the contact form in your dashboard.
                      </p>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-blue-300 font-semibold mb-2">Required Information:</p>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Account email address</li>
                          <li>• Subscription plan and billing date</li>
                          <li>• Reason for refund request</li>
                          <li>• Any relevant screenshots or documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Review and Verification</h3>
                      <p className="text-white/80 leading-relaxed mb-3">
                        Our team will review your request within 24 hours and may contact you for additional information or to offer alternative solutions.
                      </p>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <p className="text-purple-300 font-semibold mb-2">What We Check:</p>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Account status and subscription details</li>
                          <li>• Usage patterns and service utilization</li>
                          <li>• Technical issues reported and resolution attempts</li>
                          <li>• Compliance with refund policy terms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Refund Processing</h3>
                      <p className="text-white/80 leading-relaxed mb-3">
                        Once approved, we'll process your refund to the original payment method and send you a confirmation email with tracking details.
                      </p>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <p className="text-green-300 font-semibold mb-2">Processing Timeline:</p>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• Approval notification: Within 24-48 hours</li>
                          <li>• Refund initiation: Within 2 business days</li>
                          <li>• Funds availability: 3-7 business days (varies by payment method)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Special Circumstances */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Special Circumstances</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Annual Subscription Refunds</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    For annual subscriptions, we offer pro-rata refunds in specific circumstances:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside mb-4">
                    <li>Service discontinuation or major feature removal</li>
                    <li>Significant changes to Terms of Service that affect your usage</li>
                    <li>Extended service outages affecting business operations</li>
                    <li>Technical issues that cannot be resolved within 30 days</li>
                  </ul>
                  <p className="text-white/80 leading-relaxed">
                    Pro-rata refunds are calculated based on the unused portion of your subscription period.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Upgrade/Downgrade Adjustments</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    If you upgrade or downgrade your plan:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Upgrades are prorated and charged immediately</li>
                    <li>Downgrades take effect at the next billing cycle</li>
                    <li>No refunds for voluntary plan changes</li>
                    <li>Credits may be applied for billing errors</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Account Termination</h3>
                  <p className="text-white/80 leading-relaxed">
                    If we terminate your account due to Terms of Service violations, no refunds will be provided. However, if we discontinue the service entirely, all active subscribers will receive pro-rata refunds for the unused portion of their subscription.
                  </p>
                </div>
              </div>
            </section>

            {/* Chargebacks and Disputes */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CreditCard className="w-8 h-8 mr-4 text-orange-400" />
                Chargebacks and Payment Disputes
              </h2>
              <div className="space-y-6">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                  <h3 className="text-orange-300 font-semibold mb-3">Please Contact Us First</h3>
                  <p className="text-white/80 leading-relaxed">
                    Before initiating a chargeback with your bank or credit card company, please contact our support team. We can often resolve billing issues quickly and avoid the lengthy chargeback process.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Chargeback Policy</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside mb-4">
                    <li>We will contest illegitimate chargebacks with proper documentation</li>
                    <li>Accounts with chargebacks may be suspended pending resolution</li>
                    <li>Chargeback fees may be passed on to the customer if the dispute is found invalid</li>
                    <li>We prefer to work directly with customers to resolve billing concerns</li>
                  </ul>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-blue-300 font-semibold mb-2">Alternative Resolution:</p>
                    <p className="text-white/80">
                      Contact us at <span className="text-blue-400">billing@salespilot.io</span> for faster resolution of payment disputes. We're committed to finding fair solutions for all billing concerns.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact for Refunds */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Mail className="w-8 h-8 mr-4 text-green-400" />
                Contact Us for Refunds
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed text-lg">
                  Our refund team is here to help you with any questions or concerns about your subscription and billing.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Refund Requests</h3>
                    <div className="space-y-3">
                      <p className="text-white/80">
                        <span className="font-semibold">Email:</span> refunds@salespilot.io
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">Subject Line:</span> Refund Request - [Your Account Email]
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">Response Time:</span> Within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Billing Support</h3>
                    <div className="space-y-3">
                      <p className="text-white/80">
                        <span className="font-semibold">Email:</span> billing@salespilot.io
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">Phone:</span> +91 (800) 123-4567
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">Hours:</span> Mon-Fri, 9 AM - 6 PM IST
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3">Refund Request Template</h3>
                  <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-white/80">
                    <p>Subject: Refund Request - [your-email@example.com]</p>
                    <br />
                    <p>Dear SalesPilots Refund Team,</p>
                    <br />
                    <p>I would like to request a refund for my subscription.</p>
                    <br />
                    <p>Account Details:</p>
                    <p>- Email: [your account email]</p>
                    <p>- Subscription Plan: [plan name]</p>
                    <p>- Billing Date: [date]</p>
                    <p>- Reason: [brief explanation]</p>
                    <br />
                    <p>Thank you for your assistance.</p>
                    <br />
                    <p>Best regards,</p>
                    <p>[Your Name]</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Policy Updates</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We may update this Refund Policy from time to time to reflect changes in our business practices, legal requirements, or to improve clarity. When we make significant changes, we will:
              </p>
              <ul className="text-white/80 space-y-2 list-disc list-inside mb-6">
                <li>Notify existing customers via email</li>
                <li>Post announcements in the user dashboard</li>
                <li>Update the "Last Updated" date at the top of this policy</li>
                <li>Provide a 30-day notice period for material changes</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                Changes to this policy will not affect refund requests that are already in progress or completed before the policy update.
              </p>
            </section>
          </div>

          {/* Final CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Questions About Our Refund Policy?</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              We're here to help! Contact our support team if you need clarification about our refund process or have any concerns about your subscription.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="mailto:refunds@salespilot.io" className="btn-premium inline-flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>Contact Refund Team</span>
              </Link>
              <Link href="/" className="btn-secondary-premium inline-flex items-center space-x-3">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
