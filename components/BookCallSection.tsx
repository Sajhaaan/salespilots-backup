'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Video, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Star,
  TrendingUp,
  X
} from 'lucide-react'

interface BookCallSectionProps {
  calLink?: string // Cal.com booking link
  userName?: string
  userEmail?: string
}

export default function BookCallSection({ 
  calLink = 'https://cal.com/sajhaaan',
  userName = '',
  userEmail = ''
}: BookCallSectionProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'demo' | 'consultation' | 'onboarding'>('demo')

  // Prevent scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const callTypes = [
    {
      id: 'demo',
      title: '15-Min Meeting',
      duration: '15 minutes',
      description: 'Quick platform walkthrough and Q&A',
      icon: Video,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Platform overview',
        'Feature demonstration',
        'Quick Q&A session',
        'No commitment required'
      ],
      calLink: calLink // Use your Cal.com 15-min meeting
    },
    {
      id: 'consultation',
      title: '30-Min Meeting',
      duration: '30 minutes',
      description: 'Deep dive into your business needs',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        'Business analysis',
        'Custom strategy planning',
        'ROI calculations',
        'Pricing discussion'
      ],
      calLink: calLink // Use your Cal.com 30-min meeting
    },
    {
      id: 'onboarding',
      title: 'Extended Meeting',
      duration: '60 minutes',
      description: 'Complete setup and training session',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      features: [
        'Complete platform setup',
        'Instagram integration',
        'AI configuration',
        'Team training'
      ],
      calLink: calLink // Use your Cal.com default link
    }
  ]

  const selectedCall = callTypes.find(c => c.id === selectedPlan)

  return (
    <>
      {/* Main CTA Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1">
        <div className="relative rounded-3xl bg-gray-900/95 backdrop-blur-xl p-8 md:p-12">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x rounded-3xl"></div>
          
          {/* Floating elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Limited Slots Available
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Ready to
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  10x Your Sales?
                </span>
              </h2>

              <p className="text-xl text-white/80 leading-relaxed">
                Book a free call with our growth experts and discover how AI-powered Instagram automation can transform your business.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-1">500+</div>
                  <div className="text-sm text-white/60">Businesses</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-1">3.2x</div>
                  <div className="text-sm text-white/60">Avg Growth</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-white/60">AI Support</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowModal(true)}
                className="group relative w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center justify-center space-x-3">
                  <Calendar className="w-6 h-6" />
                  <span>Schedule Your Free Call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </button>

              {/* Trust indicators */}
              <div className="flex items-center space-x-4 text-sm text-white/60">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Calendar mockup */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-500">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-bold text-xl">Pick Your Time</h3>
                      <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    
                    {/* Time slots */}
                    {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map((time, index) => (
                      <div 
                        key={time}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all cursor-pointer group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">{time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-400 font-medium">Available</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-2xl animate-bounce">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">4.9/5</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-2xl shadow-2xl">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">98% Success</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-3xl shadow-2xl border border-white/10 animate-scale-in">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="grid lg:grid-cols-2 gap-8 p-8">
              {/* Left - Call Type Selection */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Choose Your Call Type</h3>
                  <p className="text-white/60">Select the best option for your needs</p>
                </div>

                <div className="space-y-4">
                  {callTypes.map((call) => {
                    const Icon = call.icon
                    return (
                      <button
                        key={call.id}
                        onClick={() => setSelectedPlan(call.id as any)}
                        className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                          selectedPlan === call.id
                            ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {call.popular && (
                          <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-white">
                            Most Popular
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 bg-gradient-to-r ${call.color} rounded-xl`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">{call.title}</h4>
                              <p className="text-sm text-white/60">{call.duration}</p>
                            </div>
                          </div>
                          {selectedPlan === call.id && (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          )}
                        </div>

                        <p className="text-white/70 mb-4">{call.description}</p>

                        <ul className="space-y-2">
                          {call.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-white/80">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right - Cal.com Embed */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {selectedCall?.title}
                      </h4>
                      <p className="text-sm text-white/60">{selectedCall?.duration}</p>
                    </div>
                  </div>

                  {/* Cal.com iframe */}
                  <div className="relative w-full h-[500px] bg-white rounded-xl overflow-hidden">
                    <iframe
                      src={selectedCall?.calLink}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      className="rounded-xl"
                    ></iframe>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Calendar sync</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Reminder emails</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Easy rescheduling</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

