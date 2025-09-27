'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

// Extend the Window interface to include FB
declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

interface FacebookLoginProps {
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
  className?: string
  children?: React.ReactNode
}

export default function FacebookLogin({ 
  onSuccess, 
  onError, 
  className = '',
  children 
}: FacebookLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSDKReady, setIsSDKReady] = useState(false)

  useEffect(() => {
    // Check if Facebook SDK is loaded
    const checkSDK = () => {
      if (window.FB) {
        setIsSDKReady(true)
      } else {
        setTimeout(checkSDK, 100)
      }
    }
    
    checkSDK()
  }, [])

  const handleFacebookLogin = async () => {
    if (!isSDKReady) {
      toast.error('Facebook SDK is not ready yet. Please try again.')
      return
    }

    if (!window.FB) {
      toast.error('Facebook SDK is not available.')
      return
    }

    setIsLoading(true)

    try {
      window.FB.login(async (response: any) => {
        setIsLoading(false)
        
        if (response.authResponse) {
          console.log('Facebook login successful:', response)
          
          // Send the access token to your backend
          try {
            const backendResponse = await fetch('/api/auth/facebook/callback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                accessToken: response.authResponse.accessToken,
                userID: response.authResponse.userID,
                expiresIn: response.authResponse.expiresIn,
                signedRequest: response.authResponse.signedRequest,
              }),
            })

            const result = await backendResponse.json()

            if (result.success) {
              toast.success('Facebook account connected successfully!')
              onSuccess?.(response)
            } else {
              throw new Error(result.error || 'Failed to connect Facebook account')
            }
          } catch (error) {
            console.error('Backend error:', error)
            toast.error('Failed to connect Facebook account. Please try again.')
            onError?.(error)
          }
        } else {
          console.log('Facebook login cancelled or failed')
          toast.error('Facebook login was cancelled or failed.')
          onError?.(response)
        }
      }, {
        scope: 'email,public_profile,instagram_basic,pages_show_list',
        return_scopes: true
      })
    } catch (error) {
      setIsLoading(false)
      console.error('Facebook login error:', error)
      toast.error('An error occurred during Facebook login.')
      onError?.(error)
    }
  }

  const handleFacebookLogout = async () => {
    if (!window.FB) return

    try {
      window.FB.logout(() => {
        toast.success('Logged out from Facebook')
      })
    } catch (error) {
      console.error('Facebook logout error:', error)
    }
  }

  const getFacebookUserInfo = async () => {
    if (!window.FB) return

    try {
      window.FB.api('/me', { fields: 'id,name,email,picture' }, (response: any) => {
        if (response && !response.error) {
          console.log('Facebook user info:', response)
          return response
        } else {
          console.error('Error getting Facebook user info:', response.error)
        }
      })
    } catch (error) {
      console.error('Error calling Facebook API:', error)
    }
  }

  if (!isSDKReady) {
    return (
      <button 
        disabled 
        className={`px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed ${className}`}
      >
        Loading Facebook SDK...
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleFacebookLogin}
        disabled={isLoading}
        className={`flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors ${className}`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Connect with Facebook</span>
          </>
        )}
      </button>
      
      {children}
    </div>
  )
}

// Utility functions for Facebook API
export const FacebookUtils = {
  // Check if user is logged in to Facebook
  getLoginStatus: (): Promise<any> => {
    return new Promise((resolve) => {
      if (!window.FB) {
        resolve({ status: 'unknown' })
        return
      }
      
      window.FB.getLoginStatus((response: any) => {
        resolve(response)
      })
    })
  },

  // Get user's Facebook pages
  getUserPages: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK not available'))
        return
      }
      
      window.FB.api('/me/accounts', (response: any) => {
        if (response && !response.error) {
          resolve(response)
        } else {
          reject(response.error || new Error('Failed to get pages'))
        }
      })
    })
  },

  // Get Instagram Business Account for a page
  getInstagramBusinessAccount: (pageId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK not available'))
        return
      }
      
      window.FB.api(`/${pageId}`, { fields: 'instagram_business_account' }, (response: any) => {
        if (response && !response.error) {
          resolve(response)
        } else {
          reject(response.error || new Error('Failed to get Instagram Business Account'))
        }
      })
    })
  }
}
