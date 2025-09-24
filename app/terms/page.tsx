import Link from 'next/link'
import { ArrowLeft, Scale, AlertTriangle, Shield, Users, CreditCard, Gavel } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-6 h-6 text-white" />
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
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-orange-400 text-sm font-medium mb-6">
              <Scale className="w-4 h-4 mr-2" />
              TERMS OF SERVICE
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Terms of</span>
              <br />
              <span className="gradient-text-accent">Service</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our AI automation platform and services.
            </p>
            <p className="text-white/60 mt-4">Last updated: December 15, 2024</p>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-amber-300 font-semibold mb-2">Important Legal Agreement</p>
                <p className="text-white/80">
                  By accessing or using SalesPilots services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Gavel className="w-8 h-8 mr-4 text-blue-400" />
                1. Acceptance of Terms
              </h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and SalesPilots Technologies Pvt. Ltd. ("SalesPilots," "we," "us," or "our") regarding your use of our AI-powered sales automation platform and related services.
                </p>
                <p className="text-white/80 leading-relaxed">
                  By creating an account, accessing our website, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
                <p className="text-white/80 leading-relaxed">
                  If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 mr-4 text-emerald-400" />
                2. Service Description
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  SalesPilots provides AI-powered automation tools specifically designed for Instagram businesses, including but not limited to:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Core Features</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Instagram DM automation with AI responses</li>
                      <li>Multi-language support (Hindi, Tamil, Manglish, etc.)</li>
                      <li>Payment verification through UPI screenshots</li>
                      <li>Product recognition from images</li>
                      <li>WhatsApp Business integration</li>
                      <li>Order management and tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Service Limitations</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Services are provided "as is" without warranties</li>
                      <li>AI accuracy rates may vary based on usage</li>
                      <li>Integration dependent on third-party platforms</li>
                      <li>Subject to usage limits based on subscription plan</li>
                      <li>Requires stable internet connection</li>
                      <li>May experience planned maintenance downtime</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* User Accounts and Responsibilities */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Users className="w-8 h-8 mr-4 text-purple-400" />
                3. User Accounts and Responsibilities
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Account Registration</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>You must provide accurate, current, and complete information during registration</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You must be at least 18 years old to create an account</li>
                    <li>One person or entity may not maintain more than one account without our permission</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">User Conduct</h3>
                  <p className="text-white/80 leading-relaxed mb-3">You agree not to:</p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Use the service for any illegal or unauthorized purpose</li>
                    <li>Violate any laws in your jurisdiction (including copyright laws)</li>
                    <li>Transmit spam, viruses, or any other malicious code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the service or servers</li>
                    <li>Create accounts through automated means or under false pretenses</li>
                    <li>Use the service to harass, abuse, or harm others</li>
                    <li>Reverse engineer, decompile, or disassemble our software</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Content Responsibility</h3>
                  <p className="text-white/80 leading-relaxed">
                    You are solely responsible for all content you upload, transmit, or share through our service. This includes ensuring you have the necessary rights and permissions for any content used with our AI automation tools.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CreditCard className="w-8 h-8 mr-4 text-green-400" />
                4. Payment Terms and Billing
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Subscription Plans</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>We offer various subscription plans with different features and usage limits</li>
                    <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                    <li>All fees are non-refundable except as expressly stated in our Refund Policy</li>
                    <li>Prices are subject to change with 30 days' advance notice</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Payment Processing</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Payments are processed through secure third-party payment processors</li>
                    <li>You must provide valid payment information and authorize charges</li>
                    <li>Failed payments may result in service suspension or termination</li>
                    <li>You are responsible for any bank fees or currency conversion charges</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Taxes</h3>
                  <p className="text-white/80 leading-relaxed">
                    You are responsible for paying all applicable taxes related to your use of our services. We will add applicable taxes (such as GST) to your invoice where required by law.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">5. Intellectual Property Rights</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Our Rights</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    SalesPilots and its licensors own all rights, title, and interest in and to the service, including:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Software, algorithms, and AI models</li>
                    <li>Trademarks, logos, and branding materials</li>
                    <li>Documentation, tutorials, and support materials</li>
                    <li>Data analytics and insights derived from service usage</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Your Rights</h3>
                  <p className="text-white/80 leading-relaxed">
                    You retain ownership of all content you upload or create using our service. By using our service, you grant us a limited, non-exclusive license to process your content for the purpose of providing our services.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">DMCA Compliance</h3>
                  <p className="text-white/80 leading-relaxed">
                    We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been infringed, please contact us with a detailed notice.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">6. Service Availability and Modifications</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Uptime and Availability</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>We strive to maintain 99.9% uptime but do not guarantee uninterrupted service</li>
                    <li>Planned maintenance will be announced in advance when possible</li>
                    <li>We are not liable for service interruptions beyond our reasonable control</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Service Modifications</h3>
                  <p className="text-white/80 leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue any part of our service at any time. We will provide reasonable notice for significant changes that materially affect your use of the service.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy and Data Protection */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">7. Privacy and Data Protection</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated by reference into these Terms.
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                By using our service, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 font-medium">
                  → Read our complete Privacy Policy
                </Link>
              </div>
            </section>

            {/* Disclaimers and Limitations */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 mr-4 text-amber-400" />
                8. Disclaimers and Limitations of Liability
              </h2>
              <div className="space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
                  <p className="text-amber-300 font-semibold mb-2">Important Legal Notice:</p>
                  <p className="text-white/80 text-sm">
                    The following disclaimers and limitations are essential parts of our agreement. Please read them carefully.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Service Disclaimers</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Our service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
                    <li>We do not guarantee the accuracy, completeness, or reliability of AI-generated responses</li>
                    <li>We are not responsible for the actions or content of third-party platforms (Instagram, WhatsApp, etc.)</li>
                    <li>Results and performance may vary based on individual usage and external factors</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    To the maximum extent permitted by law, SalesPilots shall not be liable for:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Any indirect, incidental, special, or consequential damages</li>
                    <li>Loss of profits, revenue, data, or business opportunities</li>
                    <li>Damages resulting from third-party actions or platform changes</li>
                    <li>Any damages exceeding the amount paid by you in the 12 months preceding the claim</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Indemnification</h3>
                  <p className="text-white/80 leading-relaxed">
                    You agree to indemnify and hold harmless SalesPilots from any claims, damages, or expenses arising from your use of our service, violation of these Terms, or infringement of any third-party rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">9. Termination</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Termination by You</h3>
                  <p className="text-white/80 leading-relaxed">
                    You may terminate your account at any time by contacting our support team or using the account deletion feature in your dashboard. Upon termination, your access to the service will cease, but these Terms will continue to apply to any prior use.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Termination by Us</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    We may suspend or terminate your account immediately, without prior notice, if you:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Violate these Terms of Service</li>
                    <li>Engage in fraudulent or illegal activities</li>
                    <li>Fail to pay required fees</li>
                    <li>Pose a security risk to our service or other users</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Effect of Termination</h3>
                  <p className="text-white/80 leading-relaxed">
                    Upon termination, all licenses granted to you will cease, and we may delete your account data after a reasonable period. Sections of these Terms that by their nature should survive termination will remain in effect.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">10. Governing Law and Dispute Resolution</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Governing Law</h3>
                  <p className="text-white/80 leading-relaxed">
                    These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Jurisdiction</h3>
                  <p className="text-white/80 leading-relaxed">
                    Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Bangalore, Karnataka, India.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Dispute Resolution</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    Before filing any legal action, we encourage you to contact us to resolve disputes informally. For formal disputes, we prefer:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Good faith negotiations between the parties</li>
                    <li>Mediation through a mutually agreed mediator</li>
                    <li>Arbitration under the Arbitration and Conciliation Act, 2015 (India)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* General Provisions */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">11. General Provisions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Entire Agreement</h3>
                  <p className="text-white/80 leading-relaxed">
                    These Terms, together with our Privacy Policy and any additional terms for specific features, constitute the entire agreement between you and SalesPilots regarding the use of our service.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Modifications</h3>
                  <p className="text-white/80 leading-relaxed">
                    We may modify these Terms at any time by posting the updated version on our website. Material changes will be notified via email or in-app notification. Continued use of our service after changes constitutes acceptance of the new Terms.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Severability</h3>
                  <p className="text-white/80 leading-relaxed">
                    If any provision of these Terms is found to be unenforceable, the remaining provisions will continue to be valid and enforceable.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Assignment</h3>
                  <p className="text-white/80 leading-relaxed">
                    You may not assign or transfer your rights under these Terms without our written consent. We may assign our rights and obligations under these Terms to any third party.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Waiver</h3>
                  <p className="text-white/80 leading-relaxed">
                    No waiver of any term or condition shall be deemed a further or continuing waiver of such term or any other term.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">12. Contact Information</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Legal Department</h3>
                  <div className="space-y-2">
                    <p className="text-white/80">
                      <span className="font-semibold">Email:</span> legal@salespilot.io
                    </p>
                    <p className="text-white/80">
                      <span className="font-semibold">Phone:</span> +91 (800) 123-4567
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Mailing Address</h3>
                  <p className="text-white/80">
                    SalesPilots Technologies Pvt. Ltd.<br />
                    Legal Department<br />
                    123 Tech Park, Electronic City<br />
                    Bangalore, Karnataka 560100<br />
                    India
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Agreement Acknowledgment */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Agreement Acknowledgment</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              By using SalesPilots services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <Link href="/" className="btn-premium inline-flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
