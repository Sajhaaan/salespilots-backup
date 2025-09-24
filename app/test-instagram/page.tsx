'use client'

import { useState } from 'react'

export default function TestInstagramPage() {
  const [testMessage, setTestMessage] = useState('Hello, this is a test message!')
  const [customerId, setCustomerId] = useState('test-customer-123')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test/instagram-messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testMessage,
          customerId
        })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Instagram Messaging Test
          </h1>
          
          <div className="space-y-6">
            {/* Test Configuration */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Test Configuration
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Message
                  </label>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter test message..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="test-customer-123"
                  />
                </div>
              </div>
              
              <button
                onClick={runTest}
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running Test...' : 'Run Instagram Messaging Test'}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Test Results
                </h2>
                
                {result.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold mb-2">❌ Test Failed</h3>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && (
                      <p className="text-red-600 text-sm mt-2">{result.details}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Environment Check */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-green-800 font-semibold mb-2">✅ Environment Check</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${result.envCheck.instagramAccessToken ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          Instagram Token
                        </div>
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${result.envCheck.instagramWebhookToken ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          Webhook Token
                        </div>
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${result.envCheck.openaiApiKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          OpenAI Key
                        </div>
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${result.envCheck.hasOpenAI ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                          AI Ready
                        </div>
                      </div>
                    </div>

                    {/* Business User Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-blue-800 font-semibold mb-2">👤 Business User</h3>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {result.businessUser.businessName}</p>
                        <p><strong>Instagram Connected:</strong> {result.businessUser.instagramConnected ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>Automation Enabled:</strong> {result.businessUser.automationEnabled ? '✅ Yes' : '❌ No'}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="text-purple-800 font-semibold mb-2">👤 Customer</h3>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {result.customer.name}</p>
                        <p><strong>Instagram Username:</strong> {result.customer.instagramUsername}</p>
                      </div>
                    </div>

                    {/* Test Results */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="text-yellow-800 font-semibold mb-2">📨 Message Processing</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>Incoming Message ID:</strong> {result.testResult.incomingMessage}</p>
                        {result.testResult.responseMessage && (
                          <p><strong>Response Message ID:</strong> {result.testResult.responseMessage}</p>
                        )}
                        <p><strong>Response Type:</strong> {result.testResult.responseType}</p>
                        {result.testResult.response && (
                          <div>
                            <p><strong>Response:</strong></p>
                            <div className="bg-white p-3 rounded border text-gray-700 mt-1">
                              {result.testResult.response}
                            </div>
                          </div>
                        )}
                        {result.testResult.apiTest && (
                          <div className="mt-3">
                            <p><strong>Instagram API Test:</strong></p>
                            <div className={`p-3 rounded border mt-1 ${result.testResult.apiTest.success ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
                              <p className="text-sm">
                                {result.testResult.apiTest.success ? '✅ API Access Successful' : '❌ API Access Failed'}
                              </p>
                              {result.testResult.apiTest.error && (
                                <p className="text-sm text-red-600 mt-1">{result.testResult.apiTest.error}</p>
                              )}
                              {result.testResult.apiTest.wouldSend && (
                                <p className="text-sm text-green-600 mt-1">Message would be sent successfully!</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                📋 What This Test Does
              </h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Checks if all required environment variables are configured</li>
                <li>• Finds a business user with Instagram connected</li>
                <li>• Creates or finds a test customer</li>
                <li>• Processes a test message through the webhook handler</li>
                <li>• Generates an AI or testing mode response</li>
                <li>• Tests Instagram Graph API connectivity</li>
                <li>• Saves all messages to the database</li>
              </ul>
              
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This test simulates the webhook but doesn't actually send messages to Instagram. 
                  It only tests the API connectivity and message processing logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
