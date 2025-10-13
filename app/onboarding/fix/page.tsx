'use client'

import { useState } from 'react'

export default function FixedInputPage() {
  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState('')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1e293b',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '12px'
      }}>
        <h1 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>
          Fixed Input Test
        </h1>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            color: 'white', 
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}>
            Business Name:
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => {
              console.log('Business name changed:', e.target.value)
              setBusinessName(e.target.value)
            }}
            placeholder="Enter your business name"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#374151',
              color: 'white',
              border: '2px solid #6b7280',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'text',
              pointerEvents: 'auto',
              zIndex: 1000
            }}
            onFocus={(e) => {
              console.log('Input focused')
              e.target.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#6b7280'
            }}
          />
          <div style={{ color: 'white', marginTop: '8px', fontSize: '14px' }}>
            Current value: <strong>{businessName}</strong>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            color: 'white', 
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}>
            Business Category:
          </label>
          <select
            value={category}
            onChange={(e) => {
              console.log('Category changed:', e.target.value)
              setCategory(e.target.value)
            }}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#374151',
              color: 'white',
              border: '2px solid #6b7280',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 1000
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#6b7280'
            }}
          >
            <option value="" style={{ backgroundColor: '#374151', color: 'white' }}>
              Select a category
            </option>
            <option value="fashion" style={{ backgroundColor: '#374151', color: 'white' }}>
              Fashion & Clothing
            </option>
            <option value="electronics" style={{ backgroundColor: '#374151', color: 'white' }}>
              Electronics
            </option>
            <option value="food" style={{ backgroundColor: '#374151', color: 'white' }}>
              Food & Beverages
            </option>
            <option value="jewelry" style={{ backgroundColor: '#374151', color: 'white' }}>
              Jewelry
            </option>
            <option value="other" style={{ backgroundColor: '#374151', color: 'white' }}>
              Other
            </option>
          </select>
          <div style={{ color: 'white', marginTop: '8px', fontSize: '14px' }}>
            Selected: <strong>{category || 'None'}</strong>
          </div>
        </div>

        <button
          onClick={() => {
            console.log('Form data:', { businessName, category })
            alert(`Business: ${businessName}, Category: ${category}`)
          }}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '1rem',
            zIndex: 1000,
            pointerEvents: 'auto'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#2563eb'
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#3b82f6'
          }}
        >
          Test Submit
        </button>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Debug Info:</h3>
          <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
            <div>Business Name: "{businessName}"</div>
            <div>Category: "{category}"</div>
            <div>Input Count: {businessName.length} characters</div>
          </div>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          color: '#22c55e'
        }}>
          <strong>Instructions:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>Try clicking in the business name field</li>
            <li>Try typing your business name</li>
            <li>Try selecting a category from the dropdown</li>
            <li>Open browser console (F12) to see debug logs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
