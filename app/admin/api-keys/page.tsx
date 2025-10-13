'use client'

import React from 'react'
import { useState, useEffect } from 'react'

export default function ApiKeysPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">Loading API Keys...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">API Keys Management</h1>
        <p className="text-gray-400">Configure your API keys for Instagram, WhatsApp, and other integrations.</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">API Configuration</h2>
        <p className="text-gray-400 mb-6">Manage your API keys and integration settings</p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="instagram-app-id" className="block text-white mb-2">Instagram App ID</label>
            <input
              id="instagram-app-id"
              type="text"
              placeholder="Enter your Instagram App ID"
              className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="instagram-app-secret" className="block text-white mb-2">Instagram App Secret</label>
            <input
              id="instagram-app-secret"
              type="password"
              placeholder="Enter your Instagram App Secret"
              className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-md"
            />
          </div>

          <div>
            <label htmlFor="openai-api-key" className="block text-white mb-2">OpenAI API Key</label>
            <input
              id="openai-api-key"
              type="password"
              placeholder="Enter your OpenAI API Key"
              className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-md"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
