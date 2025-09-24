import Link from 'next/link'
import { ArrowLeft, Shield, Lock, FileText, Users, Database, CheckCircle } from 'lucide-react'

export default function DataProcessingAgreementPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Database className="w-6 h-6 text-white" />
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
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Database className="w-4 h-4 mr-2" />
              DATA PROCESSING AGREEMENT
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Data Processing</span>
              <br />
              <span className="gradient-text-primary">Agreement</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              GDPR-compliant agreement for the processing of personal data through our AI automation platform.
            </p>
            <p className="text-white/60 mt-4">Last updated: December 15, 2024</p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-blue-300 font-semibold mb-2">GDPR Compliance</p>
                <p className="text-white/80">
                  This Data Processing Agreement (DPA) ensures compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws. It defines how we process personal data on your behalf.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Introduction */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">1. Introduction</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  This Data Processing Agreement ("DPA") is entered into between SalesPilot Technologies Pvt. Ltd. ("Data Processor," "we," "us," or "our") and the customer ("Data Controller," "you," or "your") who uses our AI automation platform and services.
                </p>
                <p className="text-white/80 leading-relaxed">
                  This DPA forms part of our Terms of Service and Privacy Policy, and governs the processing of personal data that you provide to us or that we collect on your behalf in connection with our services.
                </p>
                <p className="text-white/80 leading-relaxed">
                  This agreement ensures compliance with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable data protection laws.
                </p>
              </div>
            </section>

            {/* Definitions */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">2. Definitions</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">GDPR Terms</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li><strong>Personal Data:</strong> Any information relating to an identified or identifiable natural person</li>
                      <li><strong>Processing:</strong> Any operation performed on personal data</li>
                      <li><strong>Data Controller:</strong> The entity determining the purposes and means of processing</li>
                      <li><strong>Data Processor:</strong> The entity processing personal data on behalf of the controller</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Service-Specific Terms</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li><strong>Platform:</strong> SalesPilot's AI automation platform and services</li>
                      <li><strong>Customer Data:</strong> Personal data provided by you or your customers</li>
                      <li><strong>Service Data:</strong> Data generated through platform usage</li>
                      <li><strong>Third-Party Data:</strong> Data from Instagram, WhatsApp, and other integrations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Roles and Responsibilities */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">3. Roles and Responsibilities</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Controller (You)</h3>
                  <p className="text-white/80 leading-relaxed mb-3">As the Data Controller, you are responsible for:</p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Determining the lawful basis for processing personal data</li>
                    <li>Obtaining necessary consents from data subjects</li>
                    <li>Ensuring data accuracy and relevance</li>
                    <li>Responding to data subject rights requests</li>
                    <li>Notifying authorities of data breaches when required</li>
                    <li>Ensuring compliance with applicable data protection laws</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Processor (SalesPilot)</h3>
                  <p className="text-white/80 leading-relaxed mb-3">As the Data Processor, we are responsible for:</p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Processing personal data only as instructed by you</li>
                    <li>Implementing appropriate technical and organizational security measures</li>
                    <li>Assisting you in responding to data subject requests</li>
                    <li>Notifying you of data breaches without undue delay</li>
                    <li>Ensuring our staff are bound by confidentiality obligations</li>
                    <li>Assisting with data protection impact assessments when required</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Processing Details */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">4. Data Processing Details</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Nature and Purpose of Processing</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Providing AI-powered automation services for customer interactions</li>
                    <li>Processing customer messages and inquiries</li>
                    <li>Managing order processing and payment verification</li>
                    <li>Analyzing usage patterns to improve service quality</li>
                    <li>Providing customer support and technical assistance</li>
                    <li>Ensuring platform security and preventing fraud</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Categories of Data Subjects</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Your customers and potential customers</li>
                    <li>Your employees and authorized users</li>
                    <li>Third-party service providers and partners</li>
                    <li>Platform visitors and users</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Categories of Personal Data</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Contact information (name, email, phone number)</li>
                    <li>Account credentials and authentication data</li>
                    <li>Communication content and message history</li>
                    <li>Payment and billing information</li>
                    <li>Usage data and platform interactions</li>
                    <li>Device and technical information</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Retention Periods</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Account data: Retained while account is active + 30 days</li>
                    <li>Communication data: Retained for 3 years for service quality</li>
                    <li>Payment data: Retained for 7 years for legal compliance</li>
                    <li>Analytics data: Retained for 2 years for service improvement</li>
                    <li>Backup data: Retained for 90 days for disaster recovery</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Security Measures */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">5. Security Measures</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Technical Safeguards</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>End-to-end encryption for data transmission</li>
                      <li>Encryption at rest for stored data</li>
                      <li>Multi-factor authentication for access control</li>
                      <li>Regular security updates and patches</li>
                      <li>Intrusion detection and prevention systems</li>
                      <li>Secure API endpoints and rate limiting</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Organizational Measures</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Employee training on data protection</li>
                      <li>Access controls and role-based permissions</li>
                      <li>Regular security audits and assessments</li>
                      <li>Incident response and breach notification procedures</li>
                      <li>Vendor security assessments</li>
                      <li>Business continuity and disaster recovery plans</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <p className="text-green-300 font-semibold mb-2">Security Certifications:</p>
                  <p className="text-white/80">
                    Our platform is hosted on secure cloud infrastructure with SOC 2 Type II compliance, ISO 27001 certification, and regular penetration testing.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Subject Rights */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">6. Data Subject Rights</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We will assist you in fulfilling data subject rights requests in accordance with applicable data protection laws:
                </p>
                
                <div className="grid gap-4">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Right of Access</h3>
                    <p className="text-white/80">We will provide data subjects with a copy of their personal data within 30 days of receiving a request.</p>
                  </div>
                  
                  <div className="border-l-4 border-emerald-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Right of Rectification</h3>
                    <p className="text-white/80">We will correct inaccurate or incomplete personal data upon request.</p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Right of Erasure</h3>
                    <p className="text-white/80">We will delete personal data when requested, subject to legal and contractual obligations.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Right to Data Portability</h3>
                    <p className="text-white/80">We will provide personal data in a structured, commonly used format for transfer to another controller.</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Right to Restrict Processing</h3>
                    <p className="text-white/80">We will limit processing when requested, such as during investigation of accuracy disputes.</p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Right to Object</h3>
                    <p className="text-white/80">We will stop processing personal data when objected to, unless we have compelling legitimate grounds.</p>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <p className="text-blue-300 font-semibold mb-2">Request Processing:</p>
                  <p className="text-white/80">
                    Data subject requests should be submitted to you as the Data Controller. We will assist you in processing these requests within 30 days of receiving them from you.
                  </p>
                </div>
              </div>
            </section>

            {/* Subprocessors */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">7. Subprocessors</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We may engage subprocessors to assist in providing our services. All subprocessors are bound by data protection obligations at least as protective as those in this DPA.
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Current Subprocessors</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li><strong>Cloud Infrastructure:</strong> Vercel, Supabase, AWS (for hosting and data storage)</li>
                    <li><strong>Payment Processing:</strong> Stripe, Razorpay (for payment processing)</li>
                    <li><strong>Communication:</strong> SendGrid, Twilio (for email and SMS services)</li>
                    <li><strong>Analytics:</strong> Google Analytics, Mixpanel (for usage analytics)</li>
                    <li><strong>AI Services:</strong> OpenAI, Anthropic (for AI processing)</li>
                    <li><strong>Support:</strong> Intercom, Zendesk (for customer support)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Subprocessor Changes</h3>
                  <p className="text-white/80 leading-relaxed">
                    We will notify you of any intended changes concerning the addition or replacement of subprocessors, thereby giving you the opportunity to object to such changes. If you object to a new subprocessor, we will work with you to find an alternative solution.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Breach Notification */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">8. Data Breach Notification</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Breach Detection and Notification</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>We will notify you without undue delay after becoming aware of a personal data breach</li>
                    <li>Notification will include all information required by applicable data protection laws</li>
                    <li>We will assist you in meeting your breach notification obligations</li>
                    <li>We will document all data breaches and our response measures</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Breach Response</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Immediate containment and mitigation of the breach</li>
                    <li>Assessment of the scope and impact of the breach</li>
                    <li>Implementation of corrective measures to prevent recurrence</li>
                    <li>Cooperation with authorities and regulatory bodies</li>
                    <li>Communication with affected data subjects when required</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* International Transfers */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">9. International Data Transfers</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  Personal data may be transferred to and processed in countries outside the European Economic Area (EEA). We ensure that such transfers are conducted in accordance with applicable data protection laws.
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Transfer Safeguards</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Standard Contractual Clauses (SCCs) for EEA transfers</li>
                    <li>Adequacy decisions for transfers to approved countries</li>
                    <li>Binding corporate rules for intra-group transfers</li>
                    <li>Additional technical and organizational safeguards</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Transfer Locations</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Primary processing: India (our headquarters)</li>
                    <li>Cloud infrastructure: United States, European Union</li>
                    <li>AI processing: United States (OpenAI, Anthropic)</li>
                    <li>Analytics: United States (Google, Mixpanel)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Audit Rights */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">10. Audit Rights</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  You have the right to audit our compliance with this DPA, subject to reasonable notice and confidentiality obligations.
                </p>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Audit Process</h3>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Audits must be conducted during business hours with reasonable notice</li>
                    <li>Audits must not interfere with our normal business operations</li>
                    <li>We may require confidentiality agreements from auditors</li>
                    <li>We will provide reasonable assistance during audits</li>
                    <li>Audit results must be kept confidential</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Alternative to Audits</h3>
                  <p className="text-white/80 leading-relaxed">
                    Instead of conducting audits, you may accept our third-party security certifications and compliance reports, including SOC 2 Type II reports, ISO 27001 certificates, and GDPR compliance assessments.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">11. Termination and Data Return</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Return and Deletion</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    Upon termination of our services or this DPA, we will:
                  </p>
                  <ul className="text-white/80 space-y-2 list-disc list-inside">
                    <li>Return all personal data to you in a structured, commonly used format</li>
                    <li>Delete all personal data from our systems within 30 days</li>
                    <li>Provide written confirmation of data deletion</li>
                    <li>Retain only data required for legal compliance</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Survival</h3>
                  <p className="text-white/80 leading-relaxed">
                    The obligations in this DPA regarding confidentiality, data protection, and audit rights will survive termination of our services for as long as we retain any personal data.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">12. Contact Information</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                For questions about this Data Processing Agreement or data protection matters, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Data Protection Officer</h3>
                  <div className="space-y-2">
                    <p className="text-white/80">
                      <span className="font-semibold">Email:</span> dpo@salespilot.io
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
                    Data Protection Officer<br />
                    123 Tech Park, Electronic City<br />
                    Bangalore, Karnataka 560100<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-white/90 font-semibold mb-2">EU Representative</p>
                <p className="text-white/80">
                  For EU residents, you can also contact our EU representative at privacy-eu@salespilot.io for data protection matters.
                </p>
              </div>
            </section>
          </div>

          {/* Agreement Acknowledgment */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Agreement Acknowledgment</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              By using SalesPilot services, you acknowledge that you have read, understood, and agree to this Data Processing Agreement.
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
