'use client'

import Link from 'next/link'
import { Search, Home, ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
          {/* 404 Illustration */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-blue-400" />
          </div>

          {/* Error Code */}
          <div className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            404
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          
          <p className="text-white/70 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track!
          </p>

          {/* Suggested Actions */}
          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-lg p-4 text-left">
              <h3 className="text-white font-semibold mb-3">Try these instead:</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Check the URL for typos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span>Go back to the previous page</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                  <span>Visit our homepage</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go to Homepage</span>
            </Link>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
              
              <Link
                href="/features"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore</span>
              </Link>
            </div>
          </div>

          {/* Popular Pages */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4">Popular Pages</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                href="/features"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/documentation"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/contact"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-white/50 text-xs mt-6">
            Need help? Contact us at{' '}
            <a 
                              href="mailto:support@salespilots.io" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
                              support@salespilots.io
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
