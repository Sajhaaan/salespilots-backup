"use client"

import { useState, useEffect } from 'react'
import { Instagram, Copy, Check, AlertCircle, RefreshCw, ExternalLink, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GetInstagramTokenPage() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [accessToken, setAccessToken] = useState('')
  const [businessAccountId, setBusinessAccountId] = useState('')
  const [pageId, setPageId] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Check URL for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    
    if (code) {
      handleOAuthCallback(code)
    }
  }, [])

  const handleOAuthCallback = async (code: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/integrations/instagram/oauth-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAccessToken(data.pageAccessToken)
        setBusinessAccountId(data.instagramBusinessAccountId)
        setPageId(data.pageId)
        setStep(3)
        toast.success('Instagram credentials retrieved!')
      } else {
        toast.error(data.error || 'Failed to get credentials')
      }
    } catch (error) {
      toast.error('Error retrieving credentials')
    } finally {
      setLoading(false)
    }
  }

  const startOAuthFlow = () => {
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || prompt('Enter your Facebook App ID:')
    
    if (!clientId) {
      toast.error('Facebook App ID is required')
      return
    }

    const redirectUri = `${window.location.origin}/get-instagram-token`
    const scope = 'instagram_basic,instagram_manage_messages,pages_show_list,pages_read_engagement'
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`
    
    window.location.href = authUrl
  }

  const verifyCredentials = async () => {
    if (!accessToken || !businessAccountId) {
      toast.error('Please enter both credentials')
      return
    }

    setVerifying(true)
    try {
      // Test the credentials
      const response = await fetch(`https://graph.facebook.com/v18.0/${businessAccountId}?fields=id,username,name&access_token=${accessToken}`)
      const data = await response.json()
      
      if (data.id) {
        setVerified(true)
        toast.success(`✅ Verified! Account: @${data.username || data.name}`)
        setStep(4)
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Failed to verify credentials')
    } finally {
      setVerifying(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast.success(`${label} copied!`)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="w-16 h-16 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Instagram Token Generator
          </h1>
          <p className="text-purple-200">
            Get your Instagram credentials in 3 easy steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= num ? 'bg-green-500 text-white' : 'bg-white/20 text-white/50'
              }`}>
                {step > num ? <Check className="w-6 h-6" /> : num}
              </div>
              {num < 4 && <div className={`w-12 h-1 ${step > num ? 'bg-green-500' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          
          {/* Step 1: Choose Method */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Choose Setup Method</h2>
                  <p className="text-purple-200">Pick the easiest way for you</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1: Automated OAuth */}
                <button
                  onClick={() => setStep(2)}
                  className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-left hover:scale-105 transition-transform"
                >
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold text-white mb-2">Automatic (Recommended)</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Connect with Facebook and get credentials automatically
                  </p>
                  <div className="flex items-center text-white font-semibold">
                    Start Setup <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </button>

                {/* Method 2: Manual Entry */}
                <button
                  onClick={() => setStep(3)}
                  className="p-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-left hover:scale-105 transition-transform"
                >
                  <div className="text-4xl mb-3">✋</div>
                  <h3 className="text-xl font-bold text-white mb-2">Manual Entry</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Already have your tokens? Enter them directly
                  </p>
                  <div className="flex items-center text-white font-semibold">
                    Enter Manually <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Automatic OAuth Flow */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Connect Instagram</h2>
                  <p className="text-purple-200">Authorize access to your account</p>
                </div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1" />
                  <div className="text-white text-sm">
                    <p className="font-semibold mb-2">Before you start:</p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>You must have an <strong>Instagram Business Account</strong></li>
                      <li>Your Instagram must be connected to a <strong>Facebook Page</strong></li>
                      <li>You need access to Facebook Developer settings</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={startOAuthFlow}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-xl flex items-center justify-center space-x-3 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Instagram className="w-5 h-5" />
                    <span>Connect Instagram with Facebook</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step 3: Enter/Display Credentials */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Enter Credentials</h2>
                  <p className="text-purple-200">Input your Instagram tokens</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Instagram Page Access Token */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Instagram Page Access Token
                  </label>
                  <input
                    type="text"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="EAAG..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-purple-200 text-sm mt-2">
                    Long-lived token from Facebook Graph API Explorer
                  </p>
                </div>

                {/* Instagram Business Account ID */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Instagram Business Account ID
                  </label>
                  <input
                    type="text"
                    value={businessAccountId}
                    onChange={(e) => setBusinessAccountId(e.target.value)}
                    placeholder="1234567890..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-purple-200 text-sm mt-2">
                    Numeric ID of your Instagram Business Account
                  </p>
                </div>
              </div>

              <button
                onClick={verifyCredentials}
                disabled={verifying || !accessToken || !businessAccountId}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl flex items-center justify-center space-x-3 disabled:opacity-50 transition-all"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Verify Credentials</span>
                  </>
                )}
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => window.open('https://developers.facebook.com/docs/instagram-basic-display-api/getting-started', '_blank')}
                  className="flex-1 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Help Guide</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Copy to Vercel */}
          {step === 4 && verified && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Credentials Verified! ✅</h2>
                  <p className="text-purple-200">Add these to Vercel Environment Variables</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Variable 1 */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-mono text-sm">INSTAGRAM_PAGE_ACCESS_TOKEN</span>
                    <button
                      onClick={() => copyToClipboard(accessToken, 'Access Token')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {copied === 'Access Token' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="text-purple-200 text-sm font-mono break-all bg-black/30 p-3 rounded">
                    {accessToken}
                  </div>
                </div>

                {/* Variable 2 */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-mono text-sm">INSTAGRAM_BUSINESS_ACCOUNT_ID</span>
                    <button
                      onClick={() => copyToClipboard(businessAccountId, 'Business ID')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {copied === 'Business ID' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="text-purple-200 text-sm font-mono break-all bg-black/30 p-3 rounded">
                    {businessAccountId}
                  </div>
                </div>

                {/* Variable 3 */}
                <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-mono text-sm">INSTAGRAM_AUTO_REPLY_ENABLED</span>
                    <button
                      onClick={() => copyToClipboard('true', 'Auto Reply')}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {copied === 'Auto Reply' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="text-purple-200 text-sm font-mono break-all bg-black/30 p-3 rounded">
                    true
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6 mt-6">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-2xl mr-2">📝</span>
                  Next Steps - Add to Vercel:
                </h3>
                <ol className="text-white space-y-2 ml-6 list-decimal">
                  <li>Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">Vercel Dashboard</a></li>
                  <li>Select your project: <strong>salespilots-backup</strong></li>
                  <li>Go to <strong>Settings</strong> → <strong>Environment Variables</strong></li>
                  <li>Click <strong>"Add New"</strong></li>
                  <li>Copy each variable name and value (use copy buttons above)</li>
                  <li>Select all environments: Production, Preview, Development</li>
                  <li>Click <strong>"Save"</strong></li>
                  <li>Vercel will automatically redeploy (wait 2-3 min)</li>
                  <li>Visit <strong>/setup-chatbot</strong> to verify everything is green!</li>
                </ol>
              </div>

              <button
                onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl flex items-center justify-center space-x-3 transition-all"
              >
                <span>Open Vercel Dashboard</span>
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>

        {/* Help Footer */}
        <div className="mt-8 text-center text-purple-200 text-sm">
          <p>Need help? Check our <a href="/documentation/instagram-setup" className="text-blue-300 underline">documentation</a></p>
        </div>
      </div>
    </div>
  )
}

