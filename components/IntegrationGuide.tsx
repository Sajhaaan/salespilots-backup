'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  Circle, 
  Instagram, 
  MessageCircle, 
  Zap,
  ExternalLink,
  Copy,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Step {
  id: string
  title: string
  description: string
  completed: boolean
  action?: string
  link?: string
  code?: string
}

interface IntegrationGuideProps {
  integration: 'instagram' | 'whatsapp' | 'openai'
  onComplete?: () => void
}

export default function IntegrationGuide({ integration, onComplete }: IntegrationGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const getSteps = (): Step[] => {
    switch (integration) {
      case 'instagram':
        return [
          {
            id: 'create-app',
            title: 'Create Instagram App',
            description: 'Go to Facebook for Developers and create a new app with Instagram Basic Display',
            completed: false,
            action: 'Open Facebook Developers',
            link: 'https://developers.facebook.com/apps/'
          },
          {
            id: 'configure-app',
            title: 'Configure App Settings',
            description: 'Add Instagram Basic Display and Instagram Graph API products to your app',
            completed: false,
            code: `Valid OAuth Redirect URIs:
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrations/instagram/callback

Webhook URL:
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhook/instagram`
          },
          {
            id: 'add-credentials',
            title: 'Add App Credentials',
            description: 'Copy your App ID and App Secret to your environment variables',
            completed: false,
            code: `INSTAGRAM_APP_ID=your-app-id-here
INSTAGRAM_APP_SECRET=your-app-secret-here
INSTAGRAM_WEBHOOK_TOKEN=your-secure-token-here`
          },
          {
            id: 'connect-account',
            title: 'Connect Instagram Account',
            description: 'Use the Connect button to authorize your Instagram Business account',
            completed: false,
            action: 'Connect Instagram'
          }
        ]

      case 'whatsapp':
        return [
          {
            id: 'get-number',
            title: 'Get WhatsApp Business Number',
            description: 'Ensure you have a WhatsApp Business account with a valid phone number',
            completed: false
          },
          {
            id: 'api-setup',
            title: 'Setup WhatsApp Business API (Optional)',
            description: 'For advanced features, configure WhatsApp Business API',
            completed: false,
            code: `WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_API_TOKEN=your-whatsapp-api-token`
          },
          {
            id: 'connect-number',
            title: 'Connect Phone Number',
            description: 'Add your WhatsApp Business number to receive notifications',
            completed: false,
            action: 'Connect WhatsApp'
          },
          {
            id: 'test-connection',
            title: 'Test Connection',
            description: 'Send a test message to verify the integration is working',
            completed: false,
            action: 'Test WhatsApp'
          }
        ]

      case 'openai':
        return [
          {
            id: 'create-account',
            title: 'Create OpenAI Account',
            description: 'Sign up for an OpenAI account and add billing information',
            completed: false,
            action: 'Open OpenAI',
            link: 'https://platform.openai.com/signup'
          },
          {
            id: 'get-api-key',
            title: 'Generate API Key',
            description: 'Create a new API key in your OpenAI dashboard',
            completed: false,
            action: 'Get API Key',
            link: 'https://platform.openai.com/api-keys'
          },
          {
            id: 'add-key',
            title: 'Add API Key',
            description: 'Add your OpenAI API key to environment variables',
            completed: false,
            code: 'OPENAI_API_KEY=sk-your-openai-api-key-here'
          },
          {
            id: 'test-ai',
            title: 'Test AI Features',
            description: 'Verify AI responses and payment verification are working',
            completed: false,
            action: 'Test AI'
          }
        ]

      default:
        return []
    }
  }

  const steps = getSteps()

  const getIcon = () => {
    switch (integration) {
      case 'instagram':
        return <Instagram className="w-6 h-6" />
      case 'whatsapp':
        return <MessageCircle className="w-6 h-6" />
      case 'openai':
        return <Zap className="w-6 h-6" />
    }
  }

  const getTitle = () => {
    switch (integration) {
      case 'instagram':
        return 'Instagram Integration Setup'
      case 'whatsapp':
        return 'WhatsApp Integration Setup'
      case 'openai':
        return 'OpenAI Integration Setup'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleStepComplete = (stepIndex: number) => {
    const newSteps = [...steps]
    newSteps[stepIndex].completed = !newSteps[stepIndex].completed
    
    if (stepIndex === steps.length - 1 && newSteps[stepIndex].completed) {
      onComplete?.()
      toast.success('Integration setup completed!')
    }
  }

  return (
    <div className="glass-card p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
          {getIcon()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
          <p className="text-white/60">Follow these steps to complete the integration</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Progress</span>
          <span>{steps.filter(s => s.completed).length} of {steps.length} completed</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`border rounded-lg p-6 transition-all ${
              step.completed 
                ? 'border-green-500/30 bg-green-500/10' 
                : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => handleStepComplete(index)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-white/30 hover:border-white/50'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/70 mb-4">{step.description}</p>
                
                {/* Code Block */}
                {step.code && (
                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Configuration</span>
                      <button
                        onClick={() => copyToClipboard(step.code!)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                      {step.code}
                    </pre>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex space-x-3">
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary-premium text-sm inline-flex items-center space-x-2"
                    >
                      <span>{step.action}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  
                  {step.action && !step.link && (
                    <button className="btn-premium text-sm">
                      {step.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-400 mb-1">Important Notes</h4>
            <ul className="text-sm text-yellow-300 space-y-1">
              <li>• Keep your API keys secure and never share them publicly</li>
              <li>• Test the integration thoroughly before going live</li>
              <li>• Monitor usage to avoid unexpected charges</li>
              <li>• Review the terms of service for each platform</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Completion */}
      {steps.every(s => s.completed) && (
        <div className="mt-8 p-6 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-400 mb-2">Integration Complete!</h3>
          <p className="text-green-300">
            Your {integration} integration is now ready to use. You can start automating your business processes.
          </p>
        </div>
      )}
    </div>
  )
}
