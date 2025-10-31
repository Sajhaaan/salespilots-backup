'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Copy, RefreshCw, ExternalLink } from 'lucide-react'

export default function SetupChatbot() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    checkDiagnostics()
  }, [])

  const checkDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/instagram-webhook')
      const data = await response.json()
      setDiagnostics(data)
    } catch (error) {
      console.error('Failed to load diagnostics:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = (status: string) => {
    if (status.includes('✅') || status === 'SET' || status === 'ENABLED' || status === 'ACCESSIBLE' || status === 'FOUND') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (status.includes('❌') || status === 'MISSING' || status === 'DISABLED') {
      return <XCircle className="w-5 h-5 text-red-500" />
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading diagnostics...</div>
      </div>
    )
  }

  const isReady = diagnostics?.ready
  const criticalIssues = diagnostics?.criticalIssues || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🤖 Instagram AI Chatbot Setup
          </h1>
          <p className="text-gray-300 text-lg">
            Complete configuration and diagnostics
          </p>
        </div>

        {/* Status Card */}
        <div className={`rounded-lg p-6 mb-6 ${isReady ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'}`}>
          <div className="flex items-center gap-4">
            {isReady ? (
              <CheckCircle className="w-12 h-12 text-green-400" />
            ) : (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
            <div>
              <h2 className={`text-2xl font-bold ${isReady ? 'text-green-400' : 'text-red-400'}`}>
                {isReady ? 'All Systems Ready! ✅' : `${criticalIssues} Critical Issue(s) Found ❌`}
              </h2>
              <p className="text-gray-300 mt-1">
                {diagnostics?.message}
              </p>
            </div>
            <button
              onClick={checkDiagnostics}
              className="ml-auto p-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Diagnostics */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Configuration Checks
          </h3>
          <div className="space-y-3">
            {diagnostics?.diagnostics?.checks?.map((check: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  check.status.includes('✅') || check.status === 'SET' || check.status === 'ENABLED'
                    ? 'bg-green-500/10'
                    : check.status.includes('❌') || check.status === 'MISSING'
                    ? 'bg-red-500/10'
                    : 'bg-yellow-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <div className="font-semibold text-white">{check.name}</div>
                    <div className="text-sm text-gray-400">{check.value}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  check.status.includes('✅') || check.status === 'SET' || check.status === 'ENABLED'
                    ? 'bg-green-500 text-white'
                    : check.status.includes('❌') || check.status === 'MISSING'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-500 text-black'
                }`}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        {diagnostics?.diagnostics?.issues?.length > 0 && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">
              ⚠️ Issues Found
            </h3>
            <ul className="space-y-2">
              {diagnostics.diagnostics.issues.map((issue: string, index: number) => (
                <li key={index} className="text-gray-300 flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Environment Variables Setup */}
        {!isReady && (
          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              🔧 Required Environment Variables
            </h3>
            <p className="text-gray-300 mb-4">
              Add these to your Vercel Environment Variables:
            </p>

            <div className="space-y-4">
              {/* Bytez API Key */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">BYTEZ_API_KEY</span>
                  <button
                    onClick={() => copyToClipboard('BYTEZ_API_KEY', 'bytez')}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === 'bytez' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-2">Get from: https://www.bytez.com</p>
                <input
                  type="text"
                  placeholder="your_bytez_api_key_here"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                  readOnly
                />
              </div>

              {/* Instagram Page Access Token */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">INSTAGRAM_PAGE_ACCESS_TOKEN</span>
                  <button
                    onClick={() => copyToClipboard('INSTAGRAM_PAGE_ACCESS_TOKEN', 'token')}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === 'token' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-2">Get from Meta Developer Console</p>
                <input
                  type="text"
                  placeholder="EAAGxxxxxxxxxxxxx..."
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                  readOnly
                />
              </div>

              {/* Instagram Business Account ID */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">INSTAGRAM_BUSINESS_ACCOUNT_ID</span>
                  <button
                    onClick={() => copyToClipboard('INSTAGRAM_BUSINESS_ACCOUNT_ID', 'business')}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === 'business' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-2">Get from Meta Developer Console</p>
                <input
                  type="text"
                  placeholder="17841400000000000"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                  readOnly
                />
              </div>

              {/* Webhook Token */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">INSTAGRAM_WEBHOOK_TOKEN</span>
                  <button
                    onClick={() => copyToClipboard('INSTAGRAM_WEBHOOK_TOKEN', 'webhook')}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === 'webhook' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-2">Create a random secure string</p>
                <input
                  type="text"
                  placeholder="your_random_secure_token"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                  readOnly
                />
              </div>

              {/* Auto Reply Enabled */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">INSTAGRAM_AUTO_REPLY_ENABLED</span>
                  <button
                    onClick={() => copyToClipboard('INSTAGRAM_AUTO_REPLY_ENABLED=true', 'autoreply')}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copied === 'autoreply' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-2">Enable auto-reply feature</p>
                <input
                  type="text"
                  value="true"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                  readOnly
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
              <h4 className="font-bold text-blue-400 mb-2">📋 How to Add These:</h4>
              <ol className="text-gray-300 space-y-2 text-sm">
                <li>1. Go to Vercel Dashboard → Your Project</li>
                <li>2. Settings → Environment Variables</li>
                <li>3. Click "Add New"</li>
                <li>4. Paste each variable name and add your value</li>
                <li>5. Click "Save"</li>
                <li>6. After adding all variables, click "Redeploy"</li>
                <li>7. Wait 2-3 minutes for deployment</li>
                <li>8. Refresh this page to verify</li>
              </ol>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📝 Next Steps
          </h3>
          <div className="space-y-3">
            {diagnostics?.nextSteps?.map((step: string, index: number) => (
              <div key={index} className="flex items-start gap-3 text-gray-300">
                <span className="text-blue-400 font-bold mt-1">{step.charAt(0)}</span>
                <span>{step.substring(3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.bytez.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition group"
          >
            <ExternalLink className="w-6 h-6 mx-auto mb-2 text-white group-hover:scale-110 transition" />
            <div className="font-semibold text-white">Get Bytez API Key</div>
            <div className="text-xs text-purple-200 mt-1">bytez.com</div>
          </a>

          <a
            href="https://developers.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition group"
          >
            <ExternalLink className="w-6 h-6 mx-auto mb-2 text-white group-hover:scale-110 transition" />
            <div className="font-semibold text-white">Meta Developer Console</div>
            <div className="text-xs text-blue-200 mt-1">Get Instagram credentials</div>
          </a>

          <a
            href="/api/test/instagram-chatbot"
            target="_blank"
            className="bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition group"
          >
            <ExternalLink className="w-6 h-6 mx-auto mb-2 text-white group-hover:scale-110 transition" />
            <div className="font-semibold text-white">Test Configuration</div>
            <div className="text-xs text-green-200 mt-1">Verify setup</div>
          </a>
        </div>

        {/* Success State */}
        {isReady && (
          <div className="mt-6 bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              🎉 Your Chatbot is Ready!
            </h3>
            <p className="text-gray-300 mb-4">
              Everything is configured correctly. Your AI chatbot is now operational!
            </p>
            <p className="text-sm text-gray-400">
              Send a test Instagram DM to your business account to see it in action!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

