'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-white/70 mb-8 leading-relaxed">
            We encountered an unexpected error. Our team has been notified and is working to fix this issue.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-red-300 font-semibold mb-2">Error Details:</h3>
              <p className="text-red-200 text-sm font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-red-200 text-xs mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
            
            <div className="flex space-x-3">
              <Link
                href="/"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link
                href="/contact"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Support</span>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-white/50 text-sm mt-6">
            If this problem persists, please contact our support team at{' '}
            <a 
              href="mailto:support@salespilot.io" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              support@salespilot.io
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
