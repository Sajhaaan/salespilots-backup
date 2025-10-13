'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, CreditCard, Calendar, Star } from 'lucide-react'
import toast from 'react-hot-toast'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Check if user is authenticated
        const authResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        })

        if (!authResponse.ok) {
          router.push('/sign-in')
          return
        }

        // Get subscription status
        const subscriptionResponse = await fetch('/api/subscriptions', {
          credentials: 'include'
        })

        if (subscriptionResponse.ok) {
          const data = await subscriptionResponse.json()
          setSubscription(data.subscription)
          toast.success('Payment successful! Your subscription is now active.')
        } else {
          toast.error('Failed to verify subscription status')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        toast.error('Something went wrong. Please contact support.')
      } finally {
        setIsLoading(false)
      }
    }

    checkPaymentStatus()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="gradient-orb orb-blue absolute -top-40 -left-40 float float-delay-1"></div>
        <div className="gradient-orb orb-purple absolute top-1/2 -right-20 float float-delay-2"></div>
        <div className="gradient-orb orb-pink absolute -bottom-20 left-1/3 float float-delay-3"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="premium-card text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Payment Successful!
              </h1>
              
              <p className="text-xl text-white/70 mb-8">
                Welcome to SalesPilots Premium! Your subscription is now active.
              </p>
            </div>

            {subscription && (
              <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-400" />
                  Your Premium Plan
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white capitalize">
                      {subscription.plan}
                    </p>
                    <p className="text-white/60 text-sm">Plan</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Calendar className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white capitalize">
                      {subscription.status}
                    </p>
                    <p className="text-white/60 text-sm">Status</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {subscription.features?.maxDMs === -1 ? '∞' : subscription.features?.maxDMs || 'N/A'}
                    </p>
                    <p className="text-white/60 text-sm">Monthly DMs</p>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Highlights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Connect Instagram</p>
                    <p className="text-white/60 text-sm">Link your Instagram business account</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Set Up Automation</p>
                    <p className="text-white/60 text-sm">Configure your AI responses</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Track Performance</p>
                    <p className="text-white/60 text-sm">Monitor your automation metrics</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Scale Your Business</p>
                    <p className="text-white/60 text-sm">Grow with unlimited automation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="btn-premium group"
              >
                <span className="flex items-center space-x-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link 
                href="/dashboard/settings" 
                className="btn-secondary-premium"
              >
                Manage Subscription
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm">
                Need help getting started? Check out our{' '}
                <Link href="/documentation" className="text-blue-400 hover:text-blue-300">
                  documentation
                </Link>{' '}
                or{' '}
                <Link href="/contact" className="text-blue-400 hover:text-blue-300">
                  contact support
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
