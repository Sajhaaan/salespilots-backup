'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Instagram, 
  MessageCircle, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Users,
  Activity,
  Send,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'

interface InstagramConfig {
  appId: string
  appSecret: string
  accessToken: string
  pageId: string
  webhookToken: string
  webhookUrl: string
  isConfigured: boolean
  isTested: boolean
  lastTested?: string
}

interface Customer {
  id: string
  instagramId: string
  instagramUsername: string
  name: string
  totalOrders: number
  totalSpent: number
  lastInteraction: string
  status: string
}

interface Message {
  id: string
  customerId: string
  type: 'incoming' | 'outgoing'
  content: string
  timestamp: string
  status: string
  metadata?: any
}

export default function InstagramManagementPage() {
  const [config, setConfig] = useState<InstagramConfig>({
    appId: '',
    appSecret: '',
    accessToken: '',
    pageId: '',
    webhookToken: '',
    webhookUrl: '',
    isConfigured: false,
    isTested: false
  })
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testRecipient, setTestRecipient] = useState('')

  useEffect(() => {
    loadInstagramConfig()
    loadCustomers()
    loadRecentMessages()
  }, [])

  const loadInstagramConfig = async () => {
    try {
      const response = await fetch('/api/admin/instagram/config')
      const data = await response.json()
      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to load Instagram config:', error)
    }
  }

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/admin/instagram/customers')
      const data = await response.json()
      if (data.success) {
        setCustomers(data.customers)
      }
    } catch (error) {
      console.error('Failed to load customers:', error)
    }
  }

  const loadRecentMessages = async () => {
    try {
      const response = await fetch('/api/admin/instagram/messages')
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const saveConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/instagram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success('Instagram configuration saved successfully!')
        setConfig(prev => ({ ...prev, isConfigured: true }))
      } else {
        toast.error(data.error || 'Failed to save configuration')
      }
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  const testInstagramConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/instagram/test')
      const data = await response.json()
      
      if (data.success) {
        toast.success('Instagram connection test successful!')
        setConfig(prev => ({ ...prev, isTested: true, lastTested: new Date().toISOString() }))
      } else {
        toast.error(data.error || 'Instagram connection test failed')
      }
    } catch (error) {
      toast.error('Instagram connection test failed')
    } finally {
      setLoading(false)
    }
  }

  const sendTestMessage = async () => {
    if (!testMessage || !testRecipient) {
      toast.error('Please enter both message and recipient ID')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/instagram/send-test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: testRecipient,
          message: testMessage
        })
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success('Test message sent successfully!')
        setTestMessage('')
        setTestRecipient('')
      } else {
        toast.error(data.error || 'Failed to send test message')
      }
    } catch (error) {
      toast.error('Failed to send test message')
    } finally {
      setLoading(false)
    }
  }

  const setupWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/instagram/setup-webhook', {
        method: 'POST'
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success('Instagram webhook setup successful!')
      } else {
        toast.error(data.error || 'Failed to setup webhook')
      }
    } catch (error) {
      toast.error('Failed to setup webhook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Instagram Management</h1>
        <p className="text-gray-400">Manage Instagram integration, customers, and messages</p>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Instagram className="h-5 w-5" />
                Instagram Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure Instagram Business API settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="appId" className="text-white">Instagram App ID</Label>
                  <Input
                    id="appId"
                    type="text"
                    value={config.appId}
                    onChange={(e) => setConfig(prev => ({ ...prev, appId: e.target.value }))}
                    placeholder="Enter your Instagram App ID"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="appSecret" className="text-white">Instagram App Secret</Label>
                  <div className="relative">
                    <Input
                      id="appSecret"
                      type={showSecrets ? 'text' : 'password'}
                      value={config.appSecret}
                      onChange={(e) => setConfig(prev => ({ ...prev, appSecret: e.target.value }))}
                      placeholder="Enter your Instagram App Secret"
                      className="bg-gray-800 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="accessToken" className="text-white">Access Token</Label>
                  <div className="relative">
                    <Input
                      id="accessToken"
                      type={showSecrets ? 'text' : 'password'}
                      value={config.accessToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="Enter your Instagram Access Token"
                      className="bg-gray-800 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="pageId" className="text-white">Page ID</Label>
                  <Input
                    id="pageId"
                    type="text"
                    value={config.pageId}
                    onChange={(e) => setConfig(prev => ({ ...prev, pageId: e.target.value }))}
                    placeholder="Enter your Instagram Page ID"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="webhookToken" className="text-white">Webhook Token</Label>
                  <Input
                    id="webhookToken"
                    type="text"
                    value={config.webhookToken}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookToken: e.target.value }))}
                    placeholder="Enter your webhook verification token"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="webhookUrl" className="text-white">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="text"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://your-domain.com/api/instagram/webhook"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  onClick={saveConfig}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>

                <Button 
                  onClick={testInstagramConnection}
                  disabled={loading || !config.isConfigured}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TestTube className="h-4 w-4" />
                  Test Connection
                </Button>

                <Button 
                  onClick={setupWebhook}
                  disabled={loading || !config.isConfigured}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Setup Webhook
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {config.isConfigured && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Configured
                  </Badge>
                )}
                {config.isTested && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TestTube className="h-3 w-3" />
                    Tested
                  </Badge>
                )}
                {config.lastTested && (
                  <span className="text-sm text-gray-400">
                    Last tested: {new Date(config.lastTested).toLocaleString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Instagram Customers
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage customer interactions and profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map(customer => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">{customer.name}</h3>
                      <p className="text-gray-400 text-sm">@{customer.instagramUsername}</p>
                      <p className="text-gray-400 text-sm">Orders: {customer.totalOrders} | Spent: ₹{customer.totalSpent}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        Last: {new Date(customer.lastInteraction).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No customers found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Recent Messages
              </CardTitle>
              <CardDescription className="text-gray-400">
                View recent customer interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={message.type === 'incoming' ? 'default' : 'secondary'}>
                        {message.type}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {message.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No messages found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Testing Tools
              </CardTitle>
              <CardDescription className="text-gray-400">
                Test Instagram integration and send messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="testRecipient" className="text-white">Recipient Instagram ID</Label>
                <Input
                  id="testRecipient"
                  type="text"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="Enter Instagram user ID"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="testMessage" className="text-white">Test Message</Label>
                <Textarea
                  id="testMessage"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter test message content"
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <Button 
                onClick={sendTestMessage}
                disabled={loading || !testMessage || !testRecipient}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending...' : 'Send Test Message'}
              </Button>

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Testing Instructions</h4>
                <ul className="text-blue-300 text-sm space-y-1">
                  <li>• Use Instagram user ID (not username) for testing</li>
                  <li>• Test messages will be sent via Instagram API</li>
                  <li>• Check recipient's Instagram for test messages</li>
                  <li>• Monitor logs for delivery status</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
