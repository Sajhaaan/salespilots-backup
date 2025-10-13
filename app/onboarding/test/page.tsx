'use client'

import { useState } from 'react'

export default function TestPage() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-md mx-auto bg-white/10 p-8 rounded-lg">
        <h1 className="text-white text-2xl mb-6">Input Test Page</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Simple Input Test:</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                console.log('Input changed:', e.target.value)
                setInputValue(e.target.value)
              }}
              placeholder="Type here to test..."
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="text-white">
            <p>Current value: <span className="font-mono bg-slate-700 px-2 py-1 rounded">{inputValue}</span></p>
          </div>
          
          <div>
            <label className="block text-white mb-2">Business Name:</label>
            <input
              type="text"
              placeholder="Enter your business name"
              className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Category:</label>
            <select className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500">
              <option value="">Select category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="food">Food</option>
            </select>
          </div>
          
          <button 
            onClick={() => alert('Button works!')}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  )
}
