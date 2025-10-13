import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { InstagramAuth } from '@/lib/instagram-auth'

export async function POST(request: NextRequest) {
  try {
    console.log('📞 Facebook Login callback received')
    
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated'
      }, { status: 401 })
    }

    const body = await request.json()
    const { accessToken, userID, expiresIn, signedRequest } = body

    if (!accessToken || !userID) {
      return NextResponse.json({
        success: false,
        error: 'Missing required Facebook data'
      }, { status: 400 })
    }

    console.log('✅ Facebook access token received for user:', authUser.id)

    try {
      // Verify the access token with Facebook
      const verifyUrl = `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
      const verifyResponse = await fetch(verifyUrl)
      const userInfo = await verifyResponse.json()

      if (userInfo.error) {
        throw new Error(`Facebook token verification failed: ${userInfo.error.message}`)
      }

      console.log('✅ Facebook token verified for user:', userInfo.name)

      // Get user's Facebook pages
      const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      const pagesResponse = await fetch(pagesUrl)
      const pagesData = await pagesResponse.json()

      if (pagesData.error) {
        throw new Error(`Failed to get Facebook pages: ${pagesData.error.message}`)
      }

      console.log('✅ Facebook pages retrieved:', pagesData.data.length)

      // Find pages with Instagram Business Accounts
      const instagramPages = []
      for (const page of pagesData.data) {
        try {
          const instagramUrl = `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
          const instagramResponse = await fetch(instagramUrl)
          const instagramData = await instagramResponse.json()

          if (instagramData.instagram_business_account) {
            // Get Instagram account info
            const instagramInfoUrl = `https://graph.facebook.com/v18.0/${instagramData.instagram_business_account.id}?fields=id,username,name&access_token=${page.access_token}`
            const instagramInfoResponse = await fetch(instagramInfoUrl)
            const instagramInfo = await instagramInfoResponse.json()

            if (!instagramInfo.error) {
              instagramPages.push({
                pageId: page.id,
                pageName: page.name,
                pageAccessToken: page.access_token,
                instagramBusinessAccountId: instagramData.instagram_business_account.id,
                instagramUsername: instagramInfo.username,
                instagramName: instagramInfo.name
              })
            }
          }
        } catch (error) {
          console.log('⚠️ Error checking Instagram for page:', page.name, error)
        }
      }

      console.log('✅ Instagram Business Accounts found:', instagramPages.length)

      // Save the Facebook connection data
      const facebookCredentials = {
        accessToken,
        userID,
        expiresIn,
        signedRequest,
        userInfo,
        pages: pagesData.data,
        instagramPages,
        connectedAt: new Date().toISOString()
      }

      // Save to database using existing InstagramAuth class
      await InstagramAuth.saveFacebookCredentials(authUser.id, facebookCredentials)

      return NextResponse.json({
        success: true,
        message: 'Facebook account connected successfully',
        data: {
          userInfo,
          pagesCount: pagesData.data.length,
          instagramPagesCount: instagramPages.length,
          instagramPages: instagramPages.map(page => ({
            pageName: page.pageName,
            instagramUsername: page.instagramUsername,
            instagramName: page.instagramName
          }))
        }
      })

    } catch (error) {
      console.error('❌ Facebook callback processing error:', error)
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process Facebook callback'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Facebook callback error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Handle Facebook logout/disconnect
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated'
      }, { status: 401 })
    }

    // Remove Facebook credentials from database
    await InstagramAuth.removeFacebookCredentials(authUser.id)

    return NextResponse.json({
      success: true,
      message: 'Facebook account disconnected successfully'
    })

  } catch (error) {
    console.error('❌ Facebook disconnect error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to disconnect Facebook account'
    }, { status: 500 })
  }
}
