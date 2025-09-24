import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Server, Key, AlertTriangle, CheckCircle, Zap, Globe } from 'lucide-react'

export default function DataSecurityPage() {
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
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-red-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              DATA SECURITY
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Enterprise-Grade</span>
              <br />
              <span className="gradient-text-accent">Security</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Your data security is our top priority. Learn about the comprehensive measures we take to protect your business information.
            </p>
            <p className="text-white/60 mt-4">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Security Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="glass-card p-6 text-center group hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">256-bit Encryption</h3>
              <p className="text-white/70">Bank-grade encryption for all data in transit and at rest</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Server className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">SOC 2 Compliant</h3>
              <p className="text-white/70">Independently audited security controls and processes</p>
            </div>
            
            <div className="glass-card p-6 text-center group hover-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">24/7 Monitoring</h3>
              <p className="text-white/70">Continuous security monitoring and threat detection</p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Security Commitment */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 mr-4 text-blue-400" />
                Our Security Commitment
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed text-lg">
                  At SalesPilots, we understand that your business data is your most valuable asset. We've built our platform with security-first principles, implementing multiple layers of protection to ensure your information remains safe and secure.
                </p>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-300 mb-3">Zero Trust Architecture</h3>
                  <p className="text-white/80 leading-relaxed">
                    We operate on a zero-trust security model, meaning every request is verified, every user is authenticated, and every device is validated before accessing any system or data. This approach ensures maximum security even in the event of a breach.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Security Principles</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>Defense in depth with multiple security layers</li>
                      <li>Principle of least privilege access</li>
                      <li>Continuous security monitoring and improvement</li>
                      <li>Transparency in security practices and incidents</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Compliance Standards</h3>
                    <ul className="text-white/80 space-y-2 list-disc list-inside">
                      <li>SOC 2 Type II certification</li>
                      <li>GDPR compliance for EU users</li>
                      <li>ISO 27001 security management</li>
                      <li>PCI DSS for payment processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Encryption */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-8 h-8 mr-4 text-green-400" />
                Data Encryption & Protection
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                    Encryption in Transit
                  </h3>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                    <p className="text-white/80 leading-relaxed mb-4">
                      All data transmitted between your devices and our servers is protected using industry-standard TLS 1.3 encryption with perfect forward secrecy.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Web Traffic</h4>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• TLS 1.3 with 256-bit encryption</li>
                          <li>• HSTS (HTTP Strict Transport Security)</li>
                          <li>• Certificate pinning for mobile apps</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">API Communications</h4>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• End-to-end encryption for sensitive data</li>
                          <li>• Mutual TLS authentication</li>
                          <li>• Request signing and validation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Server className="w-6 h-6 mr-3 text-blue-400" />
                    Encryption at Rest
                  </h3>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                    <p className="text-white/80 leading-relaxed mb-4">
                      All stored data is encrypted using AES-256 encryption with keys managed through a secure key management system.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Database Encryption</h4>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• AES-256 encryption for all databases</li>
                          <li>• Encrypted database backups</li>
                          <li>• Field-level encryption for sensitive data</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">File Storage</h4>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• Encrypted file systems</li>
                          <li>• Secure cloud storage with encryption</li>
                          <li>• Encrypted log files and audit trails</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Access Controls */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Key className="w-8 h-8 mr-4 text-purple-400" />
                Access Controls & Authentication
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We implement strict access controls to ensure that only authorized users can access your data, and only the minimum necessary permissions are granted.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">User Authentication</h3>
                    <div className="space-y-4">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="text-purple-300 font-semibold mb-2">Multi-Factor Authentication (MFA)</h4>
                        <p className="text-white/80 text-sm">Required for all accounts with support for TOTP, SMS, and hardware tokens</p>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="text-purple-300 font-semibold mb-2">Single Sign-On (SSO)</h4>
                        <p className="text-white/80 text-sm">Enterprise SSO integration with SAML 2.0 and OpenID Connect</p>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="text-purple-300 font-semibold mb-2">Password Security</h4>
                        <p className="text-white/80 text-sm">Strong password requirements with bcrypt hashing and salt</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Authorization & Permissions</h3>
                    <div className="space-y-4">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-300 font-semibold mb-2">Role-Based Access Control</h4>
                        <p className="text-white/80 text-sm">Granular permissions based on user roles and responsibilities</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-300 font-semibold mb-2">Principle of Least Privilege</h4>
                        <p className="text-white/80 text-sm">Users receive only the minimum permissions necessary for their role</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-300 font-semibold mb-2">Regular Access Reviews</h4>
                        <p className="text-white/80 text-sm">Quarterly reviews of user permissions and access rights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Infrastructure Security */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Server className="w-8 h-8 mr-4 text-orange-400" />
                Infrastructure Security
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Cloud Infrastructure</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Our infrastructure is built on secure, enterprise-grade cloud platforms with multiple layers of protection and redundancy.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <h4 className="text-orange-300 font-semibold mb-2">Network Security</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• VPC with private subnets</li>
                        <li>• Web Application Firewall (WAF)</li>
                        <li>• DDoS protection</li>
                        <li>• Network segmentation</li>
                      </ul>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <h4 className="text-orange-300 font-semibold mb-2">Server Security</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Hardened operating systems</li>
                        <li>• Regular security patches</li>
                        <li>• Intrusion detection systems</li>
                        <li>• Container security scanning</li>
                      </ul>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <h4 className="text-orange-300 font-semibold mb-2">Data Centers</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• SOC 2 certified facilities</li>
                        <li>• 24/7 physical security</li>
                        <li>• Biometric access controls</li>
                        <li>• Environmental monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Backup & Disaster Recovery</h3>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-3">Backup Strategy</h4>
                        <ul className="text-white/80 space-y-2 text-sm">
                          <li>• Automated daily backups</li>
                          <li>• Multiple geographic locations</li>
                          <li>• Encrypted backup storage</li>
                          <li>• Point-in-time recovery</li>
                          <li>• Regular backup integrity testing</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-300 font-semibold mb-3">Disaster Recovery</h4>
                        <ul className="text-white/80 space-y-2 text-sm">
                          <li>• RTO (Recovery Time Objective): 4 hours</li>
                          <li>• RPO (Recovery Point Objective): 1 hour</li>
                          <li>• Multi-region failover capability</li>
                          <li>• Regular disaster recovery testing</li>
                          <li>• Incident response procedures</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Monitoring & Incident Response */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Eye className="w-8 h-8 mr-4 text-red-400" />
                Security Monitoring & Incident Response
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">24/7 Security Operations Center</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Our Security Operations Center (SOC) provides round-the-clock monitoring and threat detection to protect your data.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="text-red-300 font-semibold mb-3">Threat Detection</h4>
                      <ul className="text-white/80 space-y-1 text-sm">
                        <li>• Real-time security event monitoring</li>
                        <li>• AI-powered anomaly detection</li>
                        <li>• Behavioral analysis and profiling</li>
                        <li>• Threat intelligence integration</li>
                      </ul>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="text-red-300 font-semibold mb-3">Response Capabilities</h4>
                      <ul className="text-white/80 space-y-1 text-sm">
                        <li>• Automated threat response</li>
                        <li>• Incident escalation procedures</li>
                        <li>• Forensic investigation tools</li>
                        <li>• Coordinated response team</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Incident Response Process</h3>
                  <div className="grid gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Detection & Analysis</h4>
                        <p className="text-white/70 text-sm">Automated systems and SOC analysts identify and analyze potential security incidents</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Containment & Eradication</h4>
                        <p className="text-white/70 text-sm">Immediate containment of threats and removal of malicious elements from systems</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Recovery & Communication</h4>
                        <p className="text-white/70 text-sm">System restoration and transparent communication with affected customers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Post-Incident Review</h4>
                        <p className="text-white/70 text-sm">Comprehensive analysis and implementation of improvements to prevent future incidents</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Compliance & Certifications */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 mr-4 text-green-400" />
                Compliance & Certifications
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We maintain industry-leading security certifications and comply with international data protection regulations.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Security Certifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold">SOC 2 Type II</h4>
                          <p className="text-white/70 text-sm">Annual independent security audit</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold">ISO 27001</h4>
                          <p className="text-white/70 text-sm">Information security management certification</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold">PCI DSS Level 1</h4>
                          <p className="text-white/70 text-sm">Payment card industry data security standard</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Regulatory Compliance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <Globe className="w-6 h-6 text-orange-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold">GDPR (EU)</h4>
                          <p className="text-white/70 text-sm">General Data Protection Regulation compliance</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <Globe className="w-6 h-6 text-red-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold">CCPA (California)</h4>
                          <p className="text-white/70 text-sm">California Consumer Privacy Act compliance</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <Globe className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold">PDPA (India)</h4>
                          <p className="text-white/70 text-sm">Personal Data Protection Act compliance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Best Practices for Users */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 mr-4 text-amber-400" />
                Security Best Practices for Users
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  While we implement comprehensive security measures, your participation is crucial for maintaining the security of your account and data.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Account Security</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Enable Multi-Factor Authentication</h4>
                          <p className="text-white/70 text-sm">Use TOTP apps like Google Authenticator or Authy</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Use Strong, Unique Passwords</h4>
                          <p className="text-white/70 text-sm">Minimum 12 characters with mixed case, numbers, and symbols</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Regular Password Updates</h4>
                          <p className="text-white/70 text-sm">Change passwords every 90 days or immediately if compromised</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Monitor Account Activity</h4>
                          <p className="text-white/70 text-sm">Review login logs and report suspicious activity</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Data Protection</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Secure Your Devices</h4>
                          <p className="text-white/70 text-sm">Use device locks and keep software updated</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Be Cautious with Public Wi-Fi</h4>
                          <p className="text-white/70 text-sm">Avoid accessing sensitive data on unsecured networks</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Regular Data Reviews</h4>
                          <p className="text-white/70 text-sm">Periodically review and clean up stored data</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white font-semibold text-sm">Report Security Concerns</h4>
                          <p className="text-white/70 text-sm">Immediately report any suspicious activity or security issues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Contact */}
            <section className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Security Contact & Reporting</h2>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed">
                  We take security reports seriously and encourage responsible disclosure of any security vulnerabilities you may discover.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Security Team Contact</h3>
                    <div className="space-y-3">
                      <p className="text-white/80">
                        <span className="font-semibold">Email:</span> security@salespilot.io
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">PGP Key:</span> Available on our security page
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">Response Time:</span> Within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Vulnerability Disclosure</h3>
                    <div className="space-y-3">
                      <p className="text-white/80">
                        <span className="font-semibold">Bug Bounty:</span> Rewards for valid security findings
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">Responsible Disclosure:</span> 90-day disclosure timeline
                      </p>
                      <p className="text-white/80">
                        <span className="font-semibold">Hall of Fame:</span> Recognition for security researchers
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
                  <h3 className="text-amber-300 font-semibold mb-3">Responsible Disclosure Guidelines</h3>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li>• Do not access or modify data belonging to other users</li>
                    <li>• Do not perform any attacks that could harm our service or users</li>
                    <li>• Do not publicly disclose vulnerabilities before we've had time to fix them</li>
                    <li>• Provide detailed information about the vulnerability and steps to reproduce</li>
                    <li>• Allow reasonable time for us to investigate and address the issue</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Final CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Questions About Our Security?</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Our security team is available to answer any questions about our security practices, certifications, or compliance standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="mailto:security@salespilot.io" className="btn-premium inline-flex items-center space-x-3">
                <Shield className="w-5 h-5" />
                <span>Contact Security Team</span>
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
