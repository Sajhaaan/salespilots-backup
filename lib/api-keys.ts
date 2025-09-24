import { SimpleDB } from './database'

// Initialize API keys database
const apiKeysDB = new SimpleDB('api-keys.json')

export interface ApiKey {
  id: string
  key: string
  name: string
  category: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  isTested: boolean
  lastTested?: string
  testResult?: any
}

export class ApiKeyManager {
  private static instance: ApiKeyManager
  private apiKeys: ApiKey[] = []
  private loaded = false

  private constructor() {}

  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager()
    }
    return ApiKeyManager.instance
  }

  public async loadApiKeys(): Promise<void> {
    if (this.loaded) return

    try {
      const keys = await apiKeysDB.read()
      this.apiKeys = keys || []
      this.loaded = true
      console.log(`📦 Loaded ${this.apiKeys.length} API keys from database`)
    } catch (error) {
      console.error('Failed to load API keys:', error)
      this.apiKeys = []
      this.loaded = true
    }
  }

  public async getApiKey(id: string): Promise<string | null> {
    await this.loadApiKeys()
    const apiKey = this.apiKeys.find(key => key.id === id)
    return apiKey?.key || null
  }

  public async getAllApiKeys(): Promise<ApiKey[]> {
    await this.loadApiKeys()
    return this.apiKeys
  }

  public async setApiKey(id: string, key: string, name?: string, category?: string): Promise<void> {
    await this.loadApiKeys()
    
    const existingIndex = this.apiKeys.findIndex(k => k.id === id)
    
    if (existingIndex !== -1) {
      // Update existing key
      this.apiKeys[existingIndex] = {
        ...this.apiKeys[existingIndex],
        key,
        updatedAt: new Date().toISOString()
      }
    } else {
      // Create new key
      this.apiKeys.push({
        id,
        key,
        name: name || id,
        category: category || 'other',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
        isTested: false
      })
    }

    await apiKeysDB.write(this.apiKeys)
  }

  public async deleteApiKey(id: string): Promise<void> {
    await this.loadApiKeys()
    this.apiKeys = this.apiKeys.filter(key => key.id !== id)
    await apiKeysDB.write(this.apiKeys)
  }

  public async refreshApiKeys(): Promise<void> {
    this.loaded = false
    await this.loadApiKeys()
  }

  // Helper methods for specific API keys
  public async getInstagramAppId(): Promise<string | null> {
    return this.getApiKey('instagram_app_id')
  }

  public async getInstagramAppSecret(): Promise<string | null> {
    return this.getApiKey('instagram_app_secret')
  }

  public async getInstagramAccessToken(): Promise<string | null> {
    return this.getApiKey('instagram_access_token')
  }

  public async getInstagramWebhookToken(): Promise<string | null> {
    return this.getApiKey('instagram_webhook_token')
  }

  public async getOpenAIKey(): Promise<string | null> {
    return this.getApiKey('openai_api_key')
  }

  public async getWhatsAppAccessToken(): Promise<string | null> {
    return this.getApiKey('whatsapp_access_token')
  }

  public async getWhatsAppPhoneNumberId(): Promise<string | null> {
    return this.getApiKey('whatsapp_phone_number_id')
  }

  public async getFacebookAppId(): Promise<string | null> {
    return this.getApiKey('facebook_app_id')
  }

  public async getDatabaseUrl(): Promise<string | null> {
    return this.getApiKey('database_url')
  }

  // Get environment variables with fallback to database
  public async getEnvVar(key: string): Promise<string | undefined> {
    // First try environment variable
    const envValue = process.env[key]
    if (envValue) return envValue

    // Then try database
    const dbValue = await this.getApiKey(key.toLowerCase())
    if (dbValue) return dbValue

    return undefined
  }

  // Update environment variables from database
  public async updateEnvironmentVariables(): Promise<void> {
    await this.loadApiKeys()
    
    // Map API keys to environment variables
    const envMappings: Record<string, string> = {
      'instagram_app_id': 'INSTAGRAM_APP_ID',
      'instagram_app_secret': 'INSTAGRAM_APP_SECRET',
      'instagram_access_token': 'INSTAGRAM_ACCESS_TOKEN',
      'instagram_webhook_token': 'INSTAGRAM_WEBHOOK_TOKEN',
      'openai_api_key': 'OPENAI_API_KEY',
      'whatsapp_access_token': 'WHATSAPP_ACCESS_TOKEN',
      'whatsapp_phone_number_id': 'WHATSAPP_PHONE_NUMBER_ID',
      'facebook_app_id': 'FACEBOOK_APP_ID',
      'database_url': 'DATABASE_URL'
    }

    for (const [dbKey, envKey] of Object.entries(envMappings)) {
      const apiKey = this.apiKeys.find(key => key.id === dbKey)
      if (apiKey?.key) {
        process.env[envKey] = apiKey.key
        console.log(`🔧 Updated ${envKey} from database`)
      }
    }
  }
}

// Export singleton instance
export const apiKeyManager = ApiKeyManager.getInstance()

// Helper function to get API key with fallback
export async function getApiKey(id: string): Promise<string | null> {
  return apiKeyManager.getApiKey(id)
}

// Helper function to get environment variable with fallback
export async function getEnvVar(key: string): Promise<string | undefined> {
  return apiKeyManager.getEnvVar(key)
}

// Initialize environment variables on module load
apiKeyManager.updateEnvironmentVariables().catch(console.error)
