'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Store, 
  Instagram, 
  Palette, 
  MessageSquare, 
  Globe, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

interface StoreDetails {
  businessName: string
  businessType: string
  instagramHandle: string
  description: string
  targetAudience: string
  responseStyle: string
  businessHours: string
  currency: string
  location: string
  logo?: string
}

export default function StoreSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [storeDetails, setStoreDetails] = useState<StoreDetails>({
    businessName: '',
    businessType: '',
    instagramHandle: '',
    description: '',
    targetAudience: '',
    responseStyle: 'friendly',
    businessHours: '9:00 AM - 6:00 PM',
    currency: 'INR',
    location: ''
  })

  const businessTypes = [
    'Fashion & Apparel',
    'Electronics',
    'Home & Decor',
    'Beauty & Cosmetics',
    'Food & Beverages',
    'Jewelry & Accessories',
    'Books & Education',
    'Sports & Fitness',
    'Handmade & Crafts',
    'Other'
  ]

  const responseStyles = [
    { value: 'friendly', label: 'Friendly & Casual', description: 'Warm, approachable tone' },
    { value: 'professional', label: 'Professional', description: 'Formal, business-like tone' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Excited, energetic tone' },
    { value: 'helpful', label: 'Helpful & Informative', description: 'Detailed, educational tone' }
  ]

  const handleInputChange = (field: keyof StoreDetails, value: string) => {
    setStoreDetails(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return storeDetails.businessName.trim() !== '' && storeDetails.businessType !== ''
      case 2:
        return storeDetails.instagramHandle.trim() !== ''
      case 3:
        return storeDetails.description.trim() !== '' && storeDetails.targetAudience.trim() !== ''
      case 4:
        return storeDetails.location.trim() !== ''
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error('Please complete all required fields')
      return
    }

    setIsLoading(true)
    try {
      // Create store profile
      const response = await fetch('/api/store/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(storeDetails)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup store')
      }

      toast.success('Store setup completed successfully!')
      router.push('/dashboard/products?welcome=true')
    } catch (error: any) {
      toast.error(error.message || 'Failed to setup store')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Store className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Basic Business Information</h2>
              <p className="text-white/70">Tell us about your business</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={storeDetails.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your business name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Business Type *
              </label>
              <select
                value={storeDetails.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800 text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Business Location
              </label>
              <input
                type="text"
                value={storeDetails.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mumbai, India"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Instagram className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Instagram Integration</h2>
              <p className="text-white/70">Connect your Instagram business account</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Instagram Handle *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">@</span>
                <input
                  type="text"
                  value={storeDetails.instagramHandle}
                  onChange={(e) => handleInputChange('instagramHandle', e.target.value.replace('@', ''))}
                  className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your_business_handle"
                  required
                />
              </div>
              <p className="text-white/60 text-sm mt-2">
                This should be your Instagram business account username
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-blue-300 font-medium mb-2">📱 Instagram Setup Instructions:</h3>
              <ol className="text-white/80 text-sm space-y-1 list-decimal list-inside">
                <li>Make sure you have an Instagram Business account</li>
                <li>Go to Settings → Privacy → Messages</li>
                <li>Enable "Allow access to messages"</li>
                <li>We'll help you connect the API in the next steps</li>
              </ol>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageSquare className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">AI Assistant Setup</h2>
              <p className="text-white/70">Train your AI to represent your business</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Business Description *
              </label>
              <textarea
                value={storeDetails.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Describe what you sell, your unique selling points, and key business information..."
                required
              />
              <p className="text-white/60 text-sm mt-1">
                This helps AI understand your business to provide accurate responses
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Target Audience *
              </label>
              <textarea
                value={storeDetails.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                placeholder="Who are your ideal customers? (age group, interests, location, etc.)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Response Style
              </label>
              <div className="grid grid-cols-1 gap-3">
                {responseStyles.map(style => (
                  <label key={style.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="responseStyle"
                      value={style.value}
                      checked={storeDetails.responseStyle === style.value}
                      onChange={(e) => handleInputChange('responseStyle', e.target.value)}
                      className="mt-1 text-blue-500 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-white font-medium">{style.label}</div>
                      <div className="text-white/60 text-sm">{style.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Palette className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Business Settings</h2>
              <p className="text-white/70">Configure your business preferences</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={storeDetails.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="9:00 AM - 6:00 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Currency
                </label>
                <select
                  value={storeDetails.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR" className="bg-gray-800">₹ Indian Rupee (INR)</option>
                  <option value="USD" className="bg-gray-800">$ US Dollar (USD)</option>
                  <option value="EUR" className="bg-gray-800">€ Euro (EUR)</option>
                </select>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-green-300 font-semibold mb-3">🎉 You're Almost Ready!</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <p>✅ Basic business information configured</p>
                <p>✅ Instagram handle added</p>
                <p>✅ AI assistant trained with your business details</p>
                <p>🔄 Next: Add products and connect Instagram API</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${currentStep >= step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/20 text-white/60'
                  }
                `}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`
                    w-20 h-1 mx-2
                    ${currentStep > step ? 'bg-blue-500' : 'bg-white/20'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-white/70">Step {currentStep} of 4</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-card p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < 4 ? (
                          <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
