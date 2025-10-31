"use client"

import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw, AlertCircle, ExternalLink, Sparkles, Instagram } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FixBotPage() {
  const [loading, setLoading] = useState(true)
  const [credentials, setCredentials] = useState<any>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/get-instagram-credentials', {
        credentials: 'include',
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setCredentials(data)
        if (data.credentials || data.envCredentials) {
          toast.success('Found your Instagram credentials!')
        } else {
          toast.error('No Instagram credentials found')
        }
      } else {
        toast.error(data.error || 'Failed to fetch credentials')
      }
    } catch (error) {
      toast.error('Error loading credentials')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast.success(`${label} copied!`)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAllAsEnvFile = () => {
    const creds = credentials.credentials || credentials.envCredentials
    
    if (!creds) return

    const envContent = `# Instagram Configuration
INSTAGRAM_PAGE_ACCESS_TOKEN=${creds.pageAccessToken || ''}
INSTAGRAM_BUSINESS_ACCOUNT_ID=${creds.businessAccountId || ''}
INSTAGRAM_AUTO_REPLY_ENABLED=true
`
    
    navigator.clipboard.writeText(envContent)
    toast.success('All variables copied! Paste in Vercel')
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading your credentials...</p>
        </div>
      </div>
    )
  }

  const creds = credentials?.credentials || credentials?.envCredentials

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-yellow-400 mr-3" />
            <Instagram className="w-16 h-16 text-pink-400" />
            <Sparkles className="w-12 h-12 text-yellow-400 ml-3" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">
            Fix Instagram Bot 🤖
          </h1>
          <p className="text-purple-200 text-lg">
            Copy these exact values to Vercel → Your bot will work!
          </p>
        </div>

        {/* Main Content */}
        {!creds ? (
          /* No Credentials Found */
          <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-12 h-12 text-red-300 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  No Instagram Credentials Found
                </h2>
                <p className="text-red-200 mb-4">
                  You need to connect Instagram first before we can extract the credentials.
                </p>
                
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <h3 className="text-white font-bold mb-2">Quick Fix:</h3>
                  <ol className="text-white space-y-2 list-decimal ml-5">
                    <li>Go to <strong>/dashboard/integrations</strong></li>
                    <li>Click <strong>"Connect Instagram Business"</strong></li>
                    <li>Log in with Facebook</li>
                    <li>Come back here and click "Refresh"</li>
                  </ol>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/dashboard/integrations'}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                  >
                    Go to Integrations →
                  </button>
                  <button
                    onClick={fetchCredentials}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl flex items-center space-x-2 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Credentials Found - Show Copy Interface */
          <div className="space-y-6">
            
            {/* Success Banner */}
            <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Check className="w-8 h-8 text-green-300" />
                <h2 className="text-2xl font-bold text-white">
                  Credentials Found! ✅
                </h2>
              </div>
              <p className="text-green-200">
                {creds.username && `Connected as: @${creds.username}`}
                {creds.pageName && ` (${creds.pageName})`}
              </p>
            </div>

            {/* Copy All Button */}
            <button
              onClick={copyAllAsEnvFile}
              className="w-full py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold rounded-2xl flex items-center justify-center space-x-3 text-xl shadow-2xl transition-all transform hover:scale-105"
            >
              {copied === 'all' ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>Copied All! Now paste in Vercel</span>
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  <span>📋 Copy All Variables (Recommended)</span>
                </>
              )}
            </button>

            {/* Individual Variables */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">
                Or copy individually:
              </h3>

              <div className="space-y-4">
                {/* Variable 1 */}
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-mono text-sm font-bold">
                      INSTAGRAM_PAGE_ACCESS_TOKEN
                    </span>
                    <button
                      onClick={() => copyToClipboard(creds.pageAccessToken, 'Token')}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      {copied === 'Token' ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-bold">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-purple-200 text-xs font-mono break-all bg-black/50 p-3 rounded overflow-x-auto">
                    {creds.pageAccessToken}
                  </div>
                </div>

                {/* Variable 2 */}
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-mono text-sm font-bold">
                      INSTAGRAM_BUSINESS_ACCOUNT_ID
                    </span>
                    <button
                      onClick={() => copyToClipboard(creds.businessAccountId, 'Business ID')}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      {copied === 'Business ID' ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-bold">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-purple-200 text-xs font-mono break-all bg-black/50 p-3 rounded">
                    {creds.businessAccountId}
                  </div>
                </div>

                {/* Variable 3 */}
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-mono text-sm font-bold">
                      INSTAGRAM_AUTO_REPLY_ENABLED
                    </span>
                    <button
                      onClick={() => copyToClipboard('true', 'Auto Reply')}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      {copied === 'Auto Reply' ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-bold">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-purple-200 text-xs font-mono break-all bg-black/50 p-3 rounded">
                    true
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400 rounded-2xl p-8">
              <h3 className="text-white font-bold text-2xl mb-4 flex items-center">
                <span className="text-3xl mr-3">👉</span>
                Next: Add to Vercel (2 minutes)
              </h3>
              
              <ol className="text-white space-y-4 text-lg">
                <li className="flex items-start">
                  <span className="text-yellow-400 font-bold mr-3 text-2xl">1.</span>
                  <div>
                    <strong>Open Vercel:</strong>
                    <div className="mt-2">
                      <a
                        href="https://vercel.com/sajhaaaan-gmailcoms-projects/salespilots-backup/settings/environment-variables"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <span>Open Vercel Settings →</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-yellow-400 font-bold mr-3 text-2xl">2.</span>
                  <div>
                    <strong>Click "Add New" button</strong>
                    <p className="text-purple-200 text-base mt-1">
                      You'll add 3 environment variables
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-yellow-400 font-bold mr-3 text-2xl">3.</span>
                  <div>
                    <strong>Paste each variable</strong>
                    <p className="text-purple-200 text-base mt-1">
                      Use the "Copy" buttons above to copy name + value
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-yellow-400 font-bold mr-3 text-2xl">4.</span>
                  <div>
                    <strong>Select ALL environments</strong>
                    <p className="text-purple-200 text-base mt-1">
                      ✅ Production, ✅ Preview, ✅ Development
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-yellow-400 font-bold mr-3 text-2xl">5.</span>
                  <div>
                    <strong>Save and wait 2-3 minutes</strong>
                    <p className="text-purple-200 text-base mt-1">
                      Vercel will automatically redeploy your app
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-green-400 font-bold mr-3 text-2xl">✅</span>
                  <div>
                    <strong>Test your bot!</strong>
                    <p className="text-purple-200 text-base mt-1">
                      Send a DM to your Instagram → Get AI reply! 🤖
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://vercel.com/sajhaaaan-gmailcoms-projects/salespilots-backup/settings/environment-variables', '_blank')}
                className="flex-1 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Open Vercel Settings</span>
                <ExternalLink className="w-5 h-5" />
              </button>
              
              <button
                onClick={fetchCredentials}
                className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

