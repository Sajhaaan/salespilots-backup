import { ProductionDB } from './database-production'

export interface InstagramAuthConfig {
  facebookAppId: string
  instagramAppId: string
  redirectUri: string
  scope: string[]
}

export class InstagramAuth {
  private static config: InstagramAuthConfig = {
    // Support both Facebook_* and Instagram_* env var names for flexibility
    facebookAppId: process.env.FACEBOOK_APP_ID || process.env.INSTAGRAM_APP_ID || '',
    instagramAppId: process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_APP_ID || '',
    // Use validated production redirect URL
    redirectUri: 'https://salespilots-io.vercel.app/api/integrations/instagram/callback',
    scope: [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata'
    ]
  }

  static getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.facebookAppId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(','),
      response_type: 'code',
      state: state || 'instagram_auth'
    })

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
  }

  static async exchangeCodeForToken(code: string): Promise<any> {
    try {
      const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token'
      const params = new URLSearchParams({
        client_id: this.config.facebookAppId,
        client_secret: process.env.FACEBOOK_APP_SECRET || process.env.INSTAGRAM_APP_SECRET || '',
        redirect_uri: this.config.redirectUri,
        code: code
      })

      const response = await fetch(`${tokenUrl}?${params.toString()}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(`Token exchange failed: ${data.error.message}`)
      }

      return data
    } catch (error) {
      console.error('Instagram token exchange error:', error)
      throw error
    }
  }

  static async getLongLivedToken(shortLivedToken: string): Promise<any> {
    try {
      const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token'
      const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: this.config.facebookAppId,
        client_secret: process.env.FACEBOOK_APP_SECRET || process.env.INSTAGRAM_APP_SECRET || '',
        fb_exchange_token: shortLivedToken
      })

      const response = await fetch(`${tokenUrl}?${params.toString()}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(`Long-lived token exchange failed: ${data.error.message}`)
      }

      return data
    } catch (error) {
      console.error('Instagram long-lived token error:', error)
      throw error
    }
  }

  static async getInstagramBusinessAccount(accessToken: string): Promise<any> {
    try {
      const url = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        throw new Error(`Failed to get pages: ${data.error.message}`)
      }

      // Find page with Instagram Business Account
      for (const page of data.data) {
        const instagramUrl = `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
        const instagramResponse = await fetch(instagramUrl)
        const instagramData = await instagramResponse.json()

        if (instagramData.instagram_business_account) {
          return {
            pageId: page.id,
            pageAccessToken: page.access_token,
            instagramBusinessAccountId: instagramData.instagram_business_account.id
          }
        }
      }

      throw new Error('No Instagram Business Account found')
    } catch (error) {
      console.error('Instagram business account error:', error)
      throw error
    }
  }

  static async saveInstagramCredentials(userId: string, credentials: any): Promise<void> {
    try {
      // Save to database
      const instagramConfig = {
        userId,
        accessToken: credentials.access_token,
        pageId: credentials.pageId,
        instagramBusinessAccountId: credentials.instagramBusinessAccountId,
        pageAccessToken: credentials.pageAccessToken,
        username: credentials.username,
        name: credentials.name,
        expiresAt: new Date(Date.now() + (credentials.expires_in * 1000)).toISOString(),
        createdAt: new Date().toISOString()
      }

      // Update user profile
      const user = await ProductionDB.findUserByAuthId(userId)
      if (user) {
        await ProductionDB.updateUser(user.id, {
          instagramConnected: true,
          instagramHandle: credentials.username,
          instagramConfig: instagramConfig
        })
        
        console.log('✅ Instagram credentials saved for user:', userId, 'with handle:', credentials.username)
      } else {
        // Bootstrap a minimal user profile if none exists
        console.log('ℹ️ User profile missing; creating minimal profile for auth user:', userId)
        await ProductionDB.createUser({
          authUserId: userId,
          email: credentials.email || `${userId}@example.com`,
          firstName: credentials.name || 'Instagram',
          lastName: 'User',
          instagramConnected: true,
          instagramHandle: credentials.username,
          instagramConfig: instagramConfig,
          subscriptionPlan: 'free',
          instagramConnectedAt: new Date().toISOString()
        })
        console.log('✅ Created minimal user profile and saved Instagram credentials for:', userId)
      }
    } catch (error) {
      console.error('❌ Error saving Instagram credentials:', error)
      throw error
    }
  }

  static async validateCredentials(userId: string): Promise<boolean> {
    try {
      const user = await ProductionDB.findUserByAuthId(userId)
      if (!user || !user.instagramConfig) {
        return false
      }

      const config = user.instagramConfig
      const now = new Date()
      const expiresAt = new Date(config.expiresAt)

      if (now > expiresAt) {
        console.log('❌ Instagram token expired for user:', userId)
        return false
      }

      // Test API call
      const testUrl = `https://graph.facebook.com/v18.0/${config.instagramBusinessAccountId}?fields=id,username&access_token=${config.pageAccessToken}`
      const response = await fetch(testUrl)
      const data = await response.json()

      if (data.error) {
        console.log('❌ Instagram token invalid for user:', userId)
        return false
      }

      return true
    } catch (error) {
      console.error('❌ Error validating Instagram credentials:', error)
      return false
    }
  }

  static getConfig(): InstagramAuthConfig {
    return this.config
  }
}
