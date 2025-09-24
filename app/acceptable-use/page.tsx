import Link from 'next/link'
import { ArrowLeft, Shield, AlertTriangle, Users, Globe, FileText, CheckCircle, XCircle } from 'lucide-react'

export default function AcceptableUsePage() {
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
              <Shield className="w-4 h-4 mr-2" />
              ACCEPTABLE USE POLICY
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Acceptable</span>
              <br />
              <span className="gradient-text-accent">Use Policy</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Guidelines for responsible and ethical use of our AI automation platform.
            </p>
            <p className="text-white/60 mt-4">Last updated: December 15, 2024</p>
          </div>

          {/* Important Notice */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-semibold mb-2">Zero Tolerance for Misuse</p>
                <p className="text-white/80">
                  Violation of this Acceptable Use Policy may result in immediate account suspension or termination. We are committed to maintaining a safe and ethical platform for all users.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Introduction */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">1. Introduction</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                This Acceptable Use Policy ("AUP") outlines the rules and guidelines for using SalesPilot's AI automation platform and services. By using our services, you agree to comply with this policy and all applicable laws and regulations.
              </p>
              <p className="text-white/80 leading-relaxed">
                This policy is designed to ensure that our platform is used responsibly, ethically, and in compliance with Meta's Developer Policies, Instagram's Community Guidelines, and WhatsApp's Business Policy.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <XCircle className="w-8 h-8 mr-4 text-red-400" />
                2. Prohibited Activities
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  The following activities are strictly prohibited and may result in immediate account termination:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Illegal Activities</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Any activity that violates applicable laws or regulations</li>
                      <li>Fraud, scams, or deceptive business practices</li>
                      <li>Sale of illegal goods or services</li>
                      <li>Money laundering or financial crimes</li>
                      <li>Intellectual property infringement</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Platform Abuse</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Spam, phishing, or unsolicited messages</li>
                      <li>Automated messaging that violates rate limits</li>
                      <li>Circumventing platform restrictions or policies</li>
                      <li>Creating fake accounts or impersonation</li>
                      <li>Harassment, bullying, or hate speech</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Content Violations</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Explicit, violent, or inappropriate content</li>
                    <li>Misleading or false advertising</li>
                    <li>Content that promotes self-harm or dangerous activities</li>
                    <li>Personal information of others without consent</li>
                    <li>Content that violates Meta's Community Standards</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Meta Platform Compliance */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Globe className="w-8 h-8 mr-4 text-blue-400" />
                3. Meta Platform Compliance
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  As a Meta Developer Partner, we require strict compliance with Meta's platform policies:
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Instagram Compliance</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Respect Instagram's Community Guidelines</li>
                    <li>No automated messaging that violates Instagram's policies</li>
                    <li>Proper disclosure of automated responses</li>
                    <li>Respect user privacy and data protection</li>
                    <li>No manipulation of engagement metrics</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">WhatsApp Business Compliance</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Comply with WhatsApp Business Policy</li>
                    <li>Respect messaging windows and opt-out requests</li>
                    <li>No spam or unsolicited commercial messages</li>
                    <li>Proper message templates and approval process</li>
                    <li>Respect user consent and privacy preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Developer Policy Compliance</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Follow Meta's Developer Policies and Platform Terms</li>
                    <li>Respect API rate limits and usage guidelines</li>
                    <li>Proper data handling and security practices</li>
                    <li>Transparent privacy practices and user consent</li>
                    <li>No circumvention of platform security measures</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI and Automation Guidelines */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 mr-4 text-green-400" />
                4. AI and Automation Guidelines
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Responsible AI Use</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Ensure AI responses are accurate and helpful</li>
                    <li>Monitor and review automated interactions regularly</li>
                    <li>Provide human oversight for sensitive conversations</li>
                    <li>Respect user preferences for human vs. AI interaction</li>
                    <li>Maintain transparency about AI usage</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Automation Best Practices</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Respect rate limits and platform guidelines</li>
                    <li>Implement proper error handling and fallbacks</li>
                    <li>Provide clear opt-out mechanisms</li>
                    <li>Maintain conversation context and continuity</li>
                    <li>Escalate complex issues to human agents</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Content Guidelines</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Ensure all automated content is appropriate and professional</li>
                    <li>Respect cultural sensitivities and local regulations</li>
                    <li>Provide accurate product information and pricing</li>
                    <li>Handle customer complaints and issues appropriately</li>
                    <li>Maintain brand voice and consistency</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Protection and Privacy */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">5. Data Protection and Privacy</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">User Data Protection</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Collect only necessary personal information</li>
                    <li>Obtain explicit consent for data collection and processing</li>
                    <li>Implement appropriate security measures</li>
                    <li>Respect user rights to access, correct, and delete data</li>
                    <li>Comply with applicable data protection laws (GDPR, etc.)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Third-Party Data</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Respect customer privacy and consent</li>
                    <li>No unauthorized collection of customer data</li>
                    <li>Secure handling of payment information</li>
                    <li>Proper disposal of sensitive data</li>
                    <li>Regular security audits and updates</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Business Conduct */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">6. Business Conduct</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Ethical Business Practices</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Provide accurate product descriptions and pricing</li>
                    <li>Honor commitments and delivery promises</li>
                    <li>Handle customer complaints promptly and fairly</li>
                    <li>Maintain transparent business practices</li>
                    <li>Respect competition and intellectual property rights</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Customer Service Standards</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Respond to customer inquiries promptly</li>
                    <li>Provide accurate and helpful information</li>
                    <li>Resolve issues fairly and efficiently</li>
                    <li>Maintain professional communication standards</li>
                    <li>Respect customer preferences and boundaries</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Monitoring and Enforcement */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">7. Monitoring and Enforcement</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Our Monitoring</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>We actively monitor platform usage for policy compliance</li>
                    <li>Automated systems detect potential violations</li>
                    <li>Regular audits of user activities and content</li>
                    <li>Investigation of reported violations</li>
                    <li>Cooperation with platform partners and authorities</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Enforcement Actions</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Warning notifications for minor violations</li>
                    <li>Temporary suspension for repeated violations</li>
                    <li>Permanent account termination for serious violations</li>
                    <li>Reporting to relevant authorities when required</li>
                    <li>Cooperation with platform enforcement actions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Appeal Process</h3>
                  <p className="text-white/80 leading-relaxed">
                    If you believe your account has been suspended or terminated in error, you may appeal the decision by contacting our support team with detailed information about your case.
                  </p>
                </div>
              </div>
            </section>

            {/* Reporting Violations */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">8. Reporting Violations</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We encourage users to report violations of this Acceptable Use Policy. You can report violations through:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Reporting Methods</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>In-app reporting feature</li>
                      <li>Email: abuse@salespilot.io</li>
                      <li>Support ticket system</li>
                      <li>Direct contact with our team</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Information to Include</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Detailed description of the violation</li>
                      <li>Screenshots or evidence</li>
                      <li>Account information (if applicable)</li>
                      <li>Date and time of the incident</li>
                      <li>Your contact information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates to Policy */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">9. Updates to This Policy</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We may update this Acceptable Use Policy from time to time to reflect changes in our services, legal requirements, or platform policies. We will notify users of material changes through:
              </p>
              <ul className="text-white/80 space-y-2 list-disc list-inside mb-4">
                <li>Email notifications to registered users</li>
                <li>In-app notifications and announcements</li>
                <li>Updates posted on our website</li>
                <li>Direct communication for significant changes</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                Continued use of our services after policy updates constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">10. Contact Information</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                If you have questions about this Acceptable Use Policy or need to report violations, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Policy Enforcement</h3>
                  <div className="space-y-2">
                    <p className="text-white/80">
                      <span className="font-semibold">Email:</span> abuse@salespilot.io
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
                    Compliance Department<br />
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
            <h3 className="text-2xl font-bold text-white mb-4">Policy Acknowledgment</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              By using SalesPilot services, you acknowledge that you have read, understood, and agree to comply with this Acceptable Use Policy.
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
