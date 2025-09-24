import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Users, Globe, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
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
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              PRIVACY POLICY
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Your Privacy</span>
              <br />
              <span className="gradient-text-primary">Matters to Us</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p className="text-white/60 mt-4">Last updated: December 15, 2024</p>
          </div>

          {/* Quick Links */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-400" />
              Quick Navigation
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="#information-collection" className="nav-link block p-3 rounded-lg hover:bg-white/5 transition-colors">1. Information We Collect</a>
              <a href="#information-use" className="nav-link block p-3 rounded-lg hover:bg-white/5 transition-colors">2. How We Use Information</a>
              <a href="#information-sharing" className="nav-link block p-3 rounded-lg hover:bg-white/5 transition-colors">3. Information Sharing</a>
              <a href="#data-security" className="nav-link block p-3 rounded-lg hover:bg-white/5 transition-colors">4. Data Security</a>
              <a href="#your-rights" className="nav-link block p-3 rounded-lg hover:bg-white/5 transition-colors">5. Your Rights</a>
              <a href="#contact-us" className="nav-link block p-3 rounded-lg hover:bg-white/5 transition-colors">6. Contact Us</a>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Introduction */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Eye className="w-8 h-8 mr-4 text-purple-400" />
                Introduction
              </h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed mb-4">
                  SalesPilots ("we," "our," or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered sales automation platform and services.
                </p>
                <p className="text-white/80 leading-relaxed mb-4">
                  This policy applies to all users of our platform, including visitors to our website, registered users, and customers who integrate their Instagram, WhatsApp, and other social media accounts with our services.
                </p>
                <p className="text-white/80 leading-relaxed">
                  By using our services, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, you should not use our services.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section id="information-collection" className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Users className="w-8 h-8 mr-4 text-blue-400" />
                Information We Collect
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Name, email address, phone number, and business information</li>
                    <li>Account credentials and authentication information</li>
                    <li>Payment and billing information (processed securely through third-party providers)</li>
                    <li>Profile information and preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Social Media Data</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Instagram account information, posts, and direct messages (with your explicit consent)</li>
                    <li>WhatsApp Business account data and message content</li>
                    <li>Customer interaction data and conversation history</li>
                    <li>Product catalogs and business information from connected accounts</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Usage Information</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Platform usage patterns and feature interactions</li>
                    <li>AI automation settings and configurations</li>
                    <li>Performance metrics and analytics data</li>
                    <li>Log files, IP addresses, and device information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section id="information-use" className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Globe className="w-8 h-8 mr-4 text-emerald-400" />
                How We Use Your Information
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Service Provision</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Provide and maintain our AI automation services</li>
                    <li>Process customer interactions and automate responses</li>
                    <li>Verify payments and manage order processing</li>
                    <li>Deliver multi-language support and localization</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Platform Improvement</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Analyze usage patterns to improve our AI algorithms</li>
                    <li>Develop new features and enhance existing functionality</li>
                    <li>Conduct research and analytics for service optimization</li>
                    <li>Provide customer support and technical assistance</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Communication</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Send service updates, security alerts, and administrative messages</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Share product updates and new feature announcements (with consent)</li>
                    <li>Send marketing communications (with opt-in consent)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section id="information-sharing" className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Users className="w-8 h-8 mr-4 text-orange-400" />
                Information Sharing and Disclosure
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Service Providers</h3>
                  <p className="text-white/80 leading-relaxed mb-2">
                    We may share information with trusted third-party service providers who assist us in:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Payment processing and billing services</li>
                    <li>Cloud hosting and data storage</li>
                    <li>Analytics and performance monitoring</li>
                    <li>Customer support and communication tools</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Legal Requirements</h3>
                  <p className="text-white/80 leading-relaxed">
                    We may disclose your information if required by law or in response to valid legal requests from government authorities, courts, or law enforcement agencies.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Business Transfers</h3>
                  <p className="text-white/80 leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction, subject to confidentiality agreements.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security" className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-8 h-8 mr-4 text-red-400" />
                Data Security
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Technical Safeguards</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>End-to-end encryption for data transmission</li>
                      <li>Secure data storage with encryption at rest</li>
                      <li>Regular security audits and vulnerability assessments</li>
                      <li>Multi-factor authentication for account access</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Organizational Measures</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Limited access to personal data on a need-to-know basis</li>
                      <li>Employee training on data protection and privacy</li>
                      <li>Regular backup and disaster recovery procedures</li>
                      <li>Incident response and breach notification protocols</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                  <p className="text-yellow-300 font-semibold mb-2">Important Security Note:</p>
                  <p className="text-white/80">
                    While we implement robust security measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your information using industry best practices.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 mr-4 text-purple-400" />
                Your Privacy Rights
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                
                <div className="grid gap-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Access and Portability</h3>
                    <p className="text-white/80">Request a copy of the personal information we hold about you and receive it in a structured, commonly used format.</p>
                  </div>
                  
                  <div className="border-l-4 border-emerald-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Correction and Update</h3>
                    <p className="text-white/80">Request correction of inaccurate or incomplete personal information and update your account settings at any time.</p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Deletion</h3>
                    <p className="text-white/80">Request deletion of your personal information, subject to legal and contractual obligations.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Restriction and Objection</h3>
                    <p className="text-white/80">Restrict or object to certain processing activities, including marketing communications.</p>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <p className="text-blue-300 font-semibold mb-2">Exercise Your Rights:</p>
                  <p className="text-white/80 mb-4">
                    To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below. We will respond to your request within 30 days.
                  </p>
                  <p className="text-white/80">
                    For users in the European Union, you also have the right to lodge a complaint with your local data protection authority.
                  </p>
                </div>
              </div>
            </section>

            {/* International Transfers */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">International Data Transfers</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Our services are operated from India, and your information may be transferred to, stored, and processed in India and other countries where our service providers operate. We ensure that such transfers are conducted in accordance with applicable data protection laws and implement appropriate safeguards.
              </p>
              <p className="text-white/80 leading-relaxed">
                For users in the European Union, we ensure adequate protection for international transfers through approved transfer mechanisms such as Standard Contractual Clauses.
              </p>
            </section>

            {/* Data Retention */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Data Retention</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specific retention periods depend on the type of information and the purpose for processing:
              </p>
              <ul className="text-white/80 space-y-2 list-disc list-inside">
                <li>Account information: Retained while your account is active and for a reasonable period after account closure</li>
                <li>Transaction records: Retained for 7 years for tax and accounting purposes</li>
                <li>Communication records: Retained for 3 years for customer support and quality purposes</li>
                <li>Marketing data: Retained until you withdraw consent or opt out</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Children's Privacy</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
              <p className="text-white/80 leading-relaxed">
                If we become aware that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.
              </p>
            </section>

            {/* Updates to Policy */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Updates to This Policy</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className="text-white/80 space-y-2 list-disc list-inside mb-4">
                <li>Posting the updated policy on our website with a new "Last Updated" date</li>
                <li>Sending you an email notification if the changes are material</li>
                <li>Providing in-app notifications for significant policy changes</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact-us" className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <FileText className="w-8 h-8 mr-4 text-green-400" />
                Contact Us
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">General Inquiries</h3>
                  <div className="space-y-3">
                    <p className="text-white/80">
                      <span className="font-semibold">Email:</span> privacy@salespilot.io
                    </p>
                    <p className="text-white/80">
                      <span className="font-semibold">Phone:</span> +91 (800) 123-4567
                    </p>
                    <p className="text-white/80">
                      <span className="font-semibold">Address:</span><br />
                      SalesPilots Technologies Pvt. Ltd.<br />
                      123 Tech Park, Electronic City<br />
                      Bangalore, Karnataka 560100<br />
                      India
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Data Protection Officer</h3>
                  <div className="space-y-3">
                    <p className="text-white/80">
                      <span className="font-semibold">Email:</span> dpo@salespilot.io
                    </p>
                    <p className="text-white/80">
                      For EU residents, you can also contact our EU representative:
                    </p>
                    <p className="text-white/80">
                      <span className="font-semibold">EU Representative:</span><br />
                      SalesPilots EU Services<br />
                      privacy-eu@salespilot.io
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-white/90 font-semibold mb-2">Quick Response Guarantee</p>
                <p className="text-white/80">
                  We are committed to addressing your privacy concerns promptly. You can expect a response to your inquiry within 48 hours during business days.
                </p>
              </div>
            </section>
          </div>

          {/* Back to Top */}
          <div className="text-center mt-16">
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
