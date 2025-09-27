'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  QrCode, 
  Smartphone, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Copy, 
  ExternalLink,
  Image,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  X,
  Check,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react'

export default function QRUPISetupPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Configuration state
  const [upiId, setUpiId] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [uploadedQrImage, setUploadedQrImage] = useState<string | null>(null)
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | ''>('')
  const [activeTab, setActiveTab] = useState<'setup' | 'preview' | 'test'>('setup')
  
  // Professional security state
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [unlockPassword, setUnlockPassword] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load saved configuration on mount
  useEffect(() => {
    // Simulate loading saved configuration
    const savedConfig = localStorage.getItem('payment-config')
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      setUpiId(config.upiId || '')
      setQrCodeUrl(config.qrCodeUrl || '')
      setUploadedQrImage(config.uploadedQrImage || null)
      setIsConfigured(true)
      setIsLocked(true)
      setLastSaved(new Date(config.lastSaved))
    } else {
      // If no saved config, allow editing by default
      setIsConfigured(false)
      setIsLocked(false)
      setEditMode(true)
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload triggered', event.target.files)
    
    const file = event.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      setMessage('No file selected')
      setMessageType('error')
      return
    }

    console.log('File selected:', { name: file.name, type: file.type, size: file.size })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file (PNG, JPG, WEBP)')
      setMessageType('error')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB')
      setMessageType('error')
      return
    }

    setIsUploading(true)
    setMessage('')

    // Convert to base64 for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log('File read successfully')
      setUploadedQrImage(e.target?.result as string)
      setMessage('QR code uploaded successfully! Remember to save your configuration.')
      setMessageType('success')
      setIsUploading(false)
    }
    reader.onerror = (error) => {
      console.error('File read error:', error)
      setMessage('Failed to read the file. Please try again.')
      setMessageType('error')
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!upiId.trim()) {
      setMessage('Please enter your UPI ID')
      setMessageType('error')
      return
    }

    // Show confirmation dialog for first-time save or major changes
    if (!isConfigured || (isConfigured && (upiId !== JSON.parse(localStorage.getItem('payment-config') || '{}').upiId))) {
      setPendingChanges({ upiId, qrCodeUrl, uploadedQrImage })
      setShowConfirmDialog(true)
      return
    }

    await performSave()
  }

  const performSave = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      // Save to localStorage (in real app, this would be API call)
      const config = {
        upiId,
        qrCodeUrl,
        uploadedQrImage,
        lastSaved: new Date().toISOString(),
        version: '1.0'
      }
      
      localStorage.setItem('payment-config', JSON.stringify(config))
      
      setIsConfigured(true)
      setIsLocked(true)
      setEditMode(false)
      setLastSaved(new Date())
      setMessage('🔒 Configuration saved and locked! Your payment details are now secure.')
      setMessageType('success')
      
      // Auto-hide message after 5 seconds
      setTimeout(() => setMessage(''), 5000)
      
    } catch (error) {
      setMessage('Failed to save configuration. Please try again.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
    }
  }

  const handleUnlock = async () => {
    if (!unlockPassword.trim()) {
      setMessage('Please enter your password.')
      setMessageType('error')
      return
    }

    console.log('Attempting to unlock with password:', unlockPassword)

    try {
      // Verify password with authentication system
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify({ password: unlockPassword }),
      })

      console.log('API response status:', response.status)

      const result = await response.json()
      console.log('API response data:', result)

      if (response.ok && result.valid) {
        // Check if this is a reset action
        if (pendingChanges?.action === 'reset') {
          performReset()
        } else {
          // Normal unlock action
          setIsLocked(false)
          setEditMode(true)
          setMessage('🔓 Configuration unlocked. You can now make changes.')
          setMessageType('success')
        }
        
        setShowUnlockDialog(false)
        setUnlockPassword('')
        setPendingChanges(null)
      } else {
        setMessage(result.error || 'Invalid password. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setMessage('Authentication failed. Please check your connection and try again.')
      setMessageType('error')
    }
  }

  const handleLock = () => {
    setIsLocked(true)
    setEditMode(false)
    setMessage('🔒 Configuration locked. Changes are now protected.')
    setMessageType('success')
  }

  const handleReset = () => {
    setShowUnlockDialog(true)
    setUnlockPassword('')
    // Store the reset action to perform after password verification
    setPendingChanges({ action: 'reset' })
  }

  const performReset = () => {
    localStorage.removeItem('payment-config')
    setUpiId('')
    setQrCodeUrl('')
    setUploadedQrImage(null)
    setIsConfigured(false)
    setIsLocked(false)
    setEditMode(false)
    setLastSaved(null)
    setMessage('Configuration reset successfully.')
    setMessageType('success')
    setShowUnlockDialog(false)
    setPendingChanges(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage('Copied to clipboard!')
    setMessageType('success')
    setTimeout(() => setMessage(''), 3000)
  }

  const removeUploadedImage = () => {
    setUploadedQrImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateTestMessage = () => {
    if (!upiId.trim()) return ''
    
    return `💳 Payment Details

💰 Amount: ₹1500
🆔 Order ID: ORD-1234567890

📱 Payment Options:
• UPI ID: ${upiId}
• QR Code: Check the QR code image below
• Amount: ₹1500

📸 Payment complete cheythal screenshot share cheyyamo!
✅ Order confirm aayittu delivery details kodukkum!

Any doubts? Just ask! 😊`
  }

  return (
    <div className="p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Payment Configuration</h1>
              <p className="text-white/60 text-sm">
                Set up automated payment details for Instagram customers
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isConfigured && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Configured</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Status Bar */}
        {isConfigured && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isLocked ? (
                  <>
                    <Lock className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Configuration Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-medium">Configuration Unlocked</span>
                  </>
                )}
                {lastSaved && (
                  <span className="text-white/50 text-sm">
                    Last saved: {lastSaved.toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {isLocked ? (
                  <button
                    onClick={() => setShowUnlockDialog(true)}
                    className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-md transition-colors text-sm flex items-center space-x-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Unlock</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLock}
                    className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-md transition-colors text-sm flex items-center space-x-1"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Lock</span>
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors text-sm flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-lg">
          {[
            { id: 'setup', label: 'Setup', icon: QrCode },
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'test', label: 'Test', icon: MessageCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors text-sm ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Payment Setup</h2>
                {isLocked && (
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <Lock className="w-3 h-3" />
                    <span>Protected</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* UPI ID */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    UPI ID *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="your-business@upi"
                      disabled={isLocked && !editMode}
                      className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-colors ${
                        isLocked && !editMode ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    {upiId && (
                      <button
                        onClick={() => copyToClipboard(upiId)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    Sent to customers when they ask for payment
                  </p>
                </div>

                {/* QR Code Upload */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    QR Code Image
                  </label>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-500 file:text-white hover:file:bg-green-600 file:cursor-pointer cursor-pointer text-sm"
                  />

                  {isUploading && (
                    <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
                      <div className="flex items-center">
                        <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mr-2" />
                        <span className="text-blue-400 text-xs">Uploading...</span>
                      </div>
                    </div>
                  )}

                  {uploadedQrImage && (
                    <div className="mt-3 p-3 border border-white/10 rounded-md bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Image className="w-3 h-3 text-green-400 mr-1" />
                          <span className="text-white text-xs">QR Code uploaded</span>
                        </div>
                        <button
                          onClick={removeUploadedImage}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="w-full h-24 bg-white/5 rounded flex items-center justify-center">
                        <img
                          src={uploadedQrImage}
                          alt="QR Code Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-white/50 text-xs mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>

                {/* QR Code URL */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    QR Code URL (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={qrCodeUrl}
                      onChange={(e) => setQrCodeUrl(e.target.value)}
                      placeholder="https://your-domain.com/qr-code.png"
                      disabled={isLocked && !editMode}
                      className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-colors ${
                        isLocked && !editMode ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    {qrCodeUrl && (
                      <button
                        onClick={() => copyToClipboard(qrCodeUrl)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    Direct link to your QR code image
                  </p>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={isLoading || !upiId.trim() || (isLocked && !editMode)}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span className="text-sm">{isConfigured ? 'Updating...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      <span className="text-sm">{isConfigured ? 'Update' : 'Save & Lock'}</span>
                    </>
                  )}
                </button>

                {/* Message */}
                {message && (
                  <div className={`p-3 rounded-md flex items-center text-sm ${
                    messageType === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                      : messageType === 'warning'
                      ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {messageType === 'success' ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : messageType === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* How It Works Panel */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
              
              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: "Customer Asks for Payment",
                    description: "Instagram customers ask 'how to pay?' or 'UPI ID tharo'"
                  },
                  {
                    step: 2,
                    title: "AI Automatically Responds",
                    description: "AI detects payment questions and sends UPI details + QR code"
                  },
                  {
                    step: 3,
                    title: "Customer Makes Payment",
                    description: "Customer uses UPI ID or scans QR code to pay"
                  },
                  {
                    step: 4,
                    title: "Payment Confirmation",
                    description: "Customer shares payment screenshot for confirmation"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-md bg-white/5">
                    <div className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{item.title}</h3>
                      <p className="text-white/60 text-xs mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-orange-400 mt-0.5" />
                  <div>
                    <h3 className="text-orange-400 font-medium text-sm">Security Notice</h3>
                    <p className="text-white/70 text-xs mt-1">
                      Configuration is locked after saving. Use unlock feature to make changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Configuration Preview</h2>
              {isLocked && (
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <Lock className="w-3 h-3" />
                  <span>Locked</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-3">Current Setup</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-md border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">UPI ID</span>
                      <span className="text-green-400 text-sm font-medium">
                        {upiId || 'Not set'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-md border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">QR Code</span>
                      <span className="text-green-400 text-sm font-medium">
                        {uploadedQrImage ? 'Uploaded' : qrCodeUrl ? 'URL Set' : 'Not set'}
                      </span>
                    </div>
                    {uploadedQrImage && (
                      <div className="w-full h-20 bg-white/5 rounded flex items-center justify-center">
                        <img
                          src={uploadedQrImage}
                          alt="QR Code Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-3">Message Preview</h3>
                <div className="p-3 bg-white/5 rounded-md border border-white/10">
                  <div className="text-white/70 text-xs mb-2">What customers will receive:</div>
                  <div className="bg-slate-800/50 rounded p-3 text-xs">
                    <pre className="text-white/90 whitespace-pre-wrap font-mono">
                      {generateTestMessage() || 'Enter UPI ID to see preview...'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Tab */}
        {activeTab === 'test' && (
          <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Test Message</h2>
              {isLocked && (
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <Lock className="w-3 h-3" />
                  <span>Active</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                <h3 className="text-white font-medium text-sm mb-1 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-400" />
                  Configuration Status
                </h3>
                <p className="text-white/70 text-xs">
                  {isConfigured 
                    ? 'Your payment configuration is active and will be sent to Instagram customers automatically.'
                    : 'Configure your payment details to enable automatic responses.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium text-sm mb-2">Customer Message</h4>
                  <div className="p-3 bg-white/5 rounded-md border border-white/10">
                    <div className="text-white/70 text-xs">Customer asks:</div>
                    <div className="text-white font-medium text-sm mt-1">"How to pay?"</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium text-sm mb-2">AI Response</h4>
                  <div className="p-3 bg-white/5 rounded-md border border-white/10">
                    <div className="text-white/70 text-xs mb-2">AI automatically responds:</div>
                    <div className="bg-slate-800/50 rounded p-2 text-xs">
                      <pre className="text-white/90 whitespace-pre-wrap font-mono">
                        {generateTestMessage() || 'Configure UPI ID to see response...'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {isConfigured && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="flex items-center text-green-400 mb-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">Configuration Active!</span>
                  </div>
                  <p className="text-white/70 text-xs">
                    Your payment details are now being sent automatically to Instagram customers when they ask for payment information.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Unlock Dialog */}
        {showUnlockDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">
                  {pendingChanges?.action === 'reset' ? 'Reset Configuration' : 'Unlock Configuration'}
                </h3>
                <button
                  onClick={() => {
                    setShowUnlockDialog(false)
                    setPendingChanges(null)
                  }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-white/70 text-sm mb-4">
                {pendingChanges?.action === 'reset' 
                  ? 'Enter your login password to reset all payment configuration. This action cannot be undone.'
                  : 'Enter your login password to unlock payment configuration'
                }
              </p>
              
              <input
                type="password"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                placeholder="Enter your login password"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                autoFocus
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowUnlockDialog(false)
                    setPendingChanges(null)
                  }}
                  className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlock}
                  className={`flex-1 px-3 py-2 rounded-md transition-colors text-sm ${
                    pendingChanges?.action === 'reset' 
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {pendingChanges?.action === 'reset' ? 'Reset' : 'Unlock'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Confirm Changes</h3>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/70 text-sm mb-4">
                {isConfigured 
                  ? 'Update your payment configuration? This will affect all future customer interactions.'
                  : 'Save your payment configuration? Once saved, it will be locked for security.'
                }
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={performSave}
                  className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm"
                >
                  {isConfigured ? 'Update' : 'Save & Lock'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}