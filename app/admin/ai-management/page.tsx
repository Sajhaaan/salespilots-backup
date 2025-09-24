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
  Brain, 
  MessageSquare, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Zap,
  Languages,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface AIConfig {
  openaiApiKey: string
  model: string
  temperature: number
  maxTokens: number
  language: string
  responseStyle: string
  isConfigured: boolean
  isTested: boolean
  lastTested?: string
}

interface TestResponse {
  input: string
  output: string
  intent: string
  action: string
  timestamp: string
  success: boolean
}

interface AIStats {
  totalResponses: number
  successRate: number
  averageResponseTime: number
  topIntents: string[]
  commonActions: string[]
}

export default function AIManagementPage() {
  const [config, setConfig] = useState<AIConfig>({
    openaiApiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 150,
    language: 'manglish',
    responseStyle: 'friendly',
    isConfigured: false,
    isTested: false
  })
  
  const [testInput, setTestInput] = useState('')
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null)
  const [aiStats, setAiStats] = useState<AIStats>({
    totalResponses: 0,
    successRate: 0,
    averageResponseTime: 0,
    topIntents: [],
    commonActions: []
  })
  const [loading, setLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    loadAIConfig()
    loadAIStats()
  }, [])

  const loadAIConfig = async () => {
    try {
      const response = await fetch('/api/admin/ai/config')
      const data = await response.json()
      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to load AI config:', error)
    }
  }

  const loadAIStats = async () => {
    try {
      const response = await fetch('/api/admin/ai/stats')
      const data = await response.json()
      if (data.success) {
        setAiStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load AI stats:', error)
    }
  }

  const saveConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success('AI configuration saved successfully!')
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

  const testAIResponse = async () => {
    if (!testInput.trim()) {
      toast.error('Please enter a test message')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/ai/test-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testInput,
          config: config
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setTestResponse({
          input: testInput,
          output: data.response,
          intent: data.intent,
          action: data.action,
          timestamp: new Date().toISOString(),
          success: true
        })
        toast.success('AI response test successful!')
      } else {
        setTestResponse({
          input: testInput,
          output: data.error || 'Failed to generate response',
          intent: 'error',
          action: 'none',
          timestamp: new Date().toISOString(),
          success: false
        })
        toast.error(data.error || 'AI response test failed')
      }
    } catch (error) {
      toast.error('AI response test failed')
    } finally {
      setLoading(false)
    }
  }

  const trainAI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/ai/train', {
        method: 'POST'
      })
      
      const data = await response.json()
      if (data.success) {
        toast.success('AI training completed successfully!')
      } else {
        toast.error(data.error || 'AI training failed')
      }
    } catch (error) {
      toast.error('AI training failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Management</h1>
        <p className="text-gray-400">Configure and manage AI responses for customer interactions</p>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure AI model settings and response behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="openaiApiKey" className="text-white">OpenAI API Key</Label>
                  <div className="relative">
                    <Input
                      id="openaiApiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={config.openaiApiKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                      placeholder="Enter your OpenAI API key"
                      className="bg-gray-800 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="model" className="text-white">AI Model</Label>
                  <select
                    id="model"
                    value={config.model}
                    onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-md"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="temperature" className="text-white">Temperature: {config.temperature}</Label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-400">Lower = more focused, Higher = more creative</p>
                </div>

                <div>
                  <Label htmlFor="maxTokens" className="text-white">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    placeholder="150"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="language" className="text-white">Response Language</Label>
                  <select
                    id="language"
                    value={config.language}
                    onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-md"
                  >
                    <option value="manglish">Manglish (Malayalam + English)</option>
                    <option value="english">English</option>
                    <option value="malayalam">Malayalam</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="responseStyle" className="text-white">Response Style</Label>
                  <select
                    id="responseStyle"
                    value={config.responseStyle}
                    onChange={(e) => setConfig(prev => ({ ...prev, responseStyle: e.target.value }))}
                    className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-md"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                  </select>
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
                  onClick={testAIResponse}
                  disabled={loading || !config.isConfigured}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TestTube className="h-4 w-4" />
                  Test AI
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

        <TabsContent value="testing">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                AI Response Testing
              </CardTitle>
              <CardDescription className="text-gray-400">
                Test AI responses with sample customer messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="testInput" className="text-white">Test Message</Label>
                <Textarea
                  id="testInput"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter a test customer message..."
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <Button 
                onClick={testAIResponse}
                disabled={loading || !testInput.trim()}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Testing...' : 'Test AI Response'}
              </Button>

              {testResponse && (
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Test Results</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h5 className="text-gray-400 text-sm mb-2">Input Message</h5>
                      <p className="text-white">{testResponse.input}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h5 className="text-gray-400 text-sm mb-2">AI Response</h5>
                      <p className="text-white">{testResponse.output}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant={testResponse.success ? 'default' : 'destructive'}>
                      {testResponse.success ? 'Success' : 'Failed'}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      Intent: {testResponse.intent}
                    </span>
                    <span className="text-sm text-gray-400">
                      Action: {testResponse.action}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(testResponse.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Sample Test Messages</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestInput('Hi, I want to buy your product')}
                    className="text-left justify-start h-auto p-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Product inquiry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestInput('What is the price of this item?')}
                    className="text-left justify-start h-auto p-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Price inquiry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestInput('I have sent the payment')}
                    className="text-left justify-start h-auto p-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Payment confirmation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTestInput('Can you send me the QR code?')}
                    className="text-left justify-start h-auto p-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    QR code request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Analytics
              </CardTitle>
              <CardDescription className="text-gray-400">
                View AI performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-gray-800 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-white">{aiStats.totalResponses}</h3>
                  <p className="text-gray-400">Total Responses</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-white">{aiStats.successRate}%</h3>
                  <p className="text-gray-400">Success Rate</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-white">{aiStats.averageResponseTime}ms</h3>
                  <p className="text-gray-400">Avg Response Time</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Top Intents</h4>
                  <div className="space-y-2">
                    {aiStats.topIntents.map((intent, index) => (
                      <div key={intent} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                        <span className="text-white">{intent}</span>
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Common Actions</h4>
                  <div className="space-y-2">
                    {aiStats.commonActions.map((action, index) => (
                      <div key={action} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                        <span className="text-white">{action}</span>
                        <Badge variant="outline">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Training
              </CardTitle>
              <CardDescription className="text-gray-400">
                Train and improve AI responses based on customer interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-medium mb-2">Training Information</h4>
                <ul className="text-yellow-300 text-sm space-y-1">
                  <li>• AI model learns from customer interactions</li>
                  <li>• Training improves response accuracy</li>
                  <li>• Process may take several minutes</li>
                  <li>• Training data includes message history</li>
                </ul>
              </div>

              <Button 
                onClick={trainAI}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                {loading ? 'Training...' : 'Start AI Training'}
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Training Data Sources</h4>
                  <ul className="text-gray-400 space-y-2">
                    <li>• Customer message history</li>
                    <li>• AI response patterns</li>
                    <li>• Intent recognition data</li>
                    <li>• Success/failure metrics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Training Benefits</h4>
                  <ul className="text-gray-400 space-y-2">
                    <li>• Improved response accuracy</li>
                    <li>• Better intent recognition</li>
                    <li>• Faster response times</li>
                    <li>• Enhanced customer satisfaction</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
