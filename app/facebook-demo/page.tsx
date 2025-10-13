'use client'

import { useState } from 'react'
import FacebookLogin from '@/components/FacebookLogin'
import { FacebookUtils } from '@/components/FacebookLogin'
import toast from 'react-hot-toast'

export default function FacebookDemoPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleFacebookSuccess = (response: any) => {
    console.log('Facebook login successful:', response)
    toast.success('Facebook account connected successfully!')
    
    // Get user info
    getFacebookUserInfo()
    getUserPages()
  }

  const handleFacebookError = (error: any) => {
    console.error('Facebook login error:', error)
    toast.error('Facebook login failed')
  }

  const getFacebookUserInfo = async () => {
    try {
      setLoading(true)
      const response = await FacebookUtils.getLoginStatus()
      console.log('Facebook login status:', response)
      
      if (response.status === 'connected') {
        // Get user info using the Facebook API
        window.FB.api('/me', { fields: 'id,name,email,picture' }, (response: any) => {
          if (response && !response.error) {
            setUserInfo(response)
            console.log('Facebook user info:', response)
          } else {
            console.error('Error getting Facebook user info:', response.error)
          }
        })
      }
    } catch (error) {
      console.error('Error getting Facebook user info:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserPages = async () => {
    try {
      setLoading(true)
      const pagesData = await FacebookUtils.getUserPages()
      console.log('Facebook pages:', pagesData)
      setPages(pagesData.data || [])
    } catch (error) {
      console.error('Error getting Facebook pages:', error)
      toast.error('Failed to get Facebook pages')
    } finally {
      setLoading(false)
    }
  }

  const getInstagramBusinessAccounts = async () => {
    try {
      setLoading(true)
      const instagramAccounts = []
      
      for (const page of pages) {
        try {
          const instagramData = await FacebookUtils.getInstagramBusinessAccount(page.id)
          if (instagramData.instagram_business_account) {
            instagramAccounts.push({
              pageName: page.name,
              instagramAccount: instagramData.instagram_business_account
            })
          }
        } catch (error) {
          console.log(`No Instagram Business Account for page: ${page.name}`)
        }
      }
      
      console.log('Instagram Business Accounts:', instagramAccounts)
      toast.success(`Found ${instagramAccounts.length} Instagram Business Accounts`)
    } catch (error) {
      console.error('Error getting Instagram Business Accounts:', error)
      toast.error('Failed to get Instagram Business Accounts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Facebook SDK Integration Demo
          </h1>
          <p className="text-white/70 text-lg">
            Test the Facebook Login integration and explore Facebook/Instagram API features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Facebook Login Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Facebook Login</h2>
            <p className="text-white/60 text-sm mb-6">
              Connect your Facebook account to access your pages and Instagram Business accounts.
            </p>
            
            <FacebookLogin
              onSuccess={handleFacebookSuccess}
              onError={handleFacebookError}
              className="mb-4"
            />

            <div className="space-y-3">
              <button
                onClick={getFacebookUserInfo}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {loading ? 'Loading...' : 'Get User Info'}
              </button>
              
              <button
                onClick={getUserPages}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {loading ? 'Loading...' : 'Get Facebook Pages'}
              </button>
              
              <button
                onClick={getInstagramBusinessAccounts}
                disabled={loading || pages.length === 0}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {loading ? 'Loading...' : 'Get Instagram Business Accounts'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
            
            {/* User Info */}
            {userInfo && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">User Information</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-3">
                    {userInfo.picture && (
                      <img 
                        src={userInfo.picture.data.url} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{userInfo.name}</p>
                      <p className="text-white/60 text-sm">{userInfo.email}</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">ID: {userInfo.id}</p>
                </div>
              </div>
            )}

            {/* Facebook Pages */}
            {pages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">Facebook Pages ({pages.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pages.map((page) => (
                    <div key={page.id} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white font-medium">{page.name}</p>
                      <p className="text-white/60 text-sm">ID: {page.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {!userInfo && pages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60 mb-4">
                  Click "Connect with Facebook" to get started
                </p>
                <div className="text-white/40 text-sm space-y-2">
                  <p>• Connect your Facebook account</p>
                  <p>• View your Facebook pages</p>
                  <p>• Access Instagram Business accounts</p>
                  <p>• Test the Facebook SDK integration</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`// Facebook SDK is automatically loaded in layout.tsx
// Use the FacebookLogin component:

import FacebookLogin from '@/components/FacebookLogin'

<FacebookLogin
  onSuccess={(response) => {
    console.log('Facebook login successful:', response)
  }}
  onError={(error) => {
    console.error('Facebook login error:', error)
  }}
/>

// Access Facebook API utilities:
import { FacebookUtils } from '@/components/FacebookLogin'

// Get login status
const status = await FacebookUtils.getLoginStatus()

// Get user's pages
const pages = await FacebookUtils.getUserPages()

// Get Instagram Business Account for a page
const instagram = await FacebookUtils.getInstagramBusinessAccount(pageId)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
