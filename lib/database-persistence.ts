// Comprehensive Database Persistence System
// Handles ALL user inputs and data like a real production app

import { SimpleDB } from './database'

// Database instances for different data types
export const userProfilesDB = new SimpleDB('user_profiles.json')
export const userSettingsDB = new SimpleDB('user_settings.json')
export const userPreferencesDB = new SimpleDB('user_preferences.json')
export const businessDataDB = new SimpleDB('business_data.json')
export const onboardingDataDB = new SimpleDB('onboarding_data.json')
export const formDataDB = new SimpleDB('form_data.json')
export const userActivityDB = new SimpleDB('user_activity.json')
export const userSessionsDB = new SimpleDB('user_sessions.json')

// Types for comprehensive data storage
export interface UserProfile {
  id: string
  authUserId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  timezone?: string
  language?: string
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    orders: boolean
    payments: boolean
    marketing: boolean
    updates: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends'
    dataSharing: boolean
    analytics: boolean
  }
  preferences: {
    currency: string
    language: string
    timezone: string
    dateFormat: string
    timeFormat: '12h' | '24h'
  }
  createdAt: string
  updatedAt: string
}

export interface BusinessData {
  id: string
  userId: string
  businessName: string
  businessType: string
  description: string
  targetAudience: string
  instagramHandle: string
  whatsappNumber?: string
  website?: string
  location: string
  businessHours: string
  currency: string
  upiId?: string
  logo?: string
  banner?: string
  socialLinks: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
  }
  contactInfo: {
    email: string
    phone?: string
    address?: string
  }
  aiConfiguration: {
    responseStyle: string
    toneOfVoice: string
    languagePreference: string
    customInstructions?: string
    aiPersonality?: string
  }
  createdAt: string
  updatedAt: string
}

export interface OnboardingData {
  id: string
  userId: string
  step: number
  completedSteps: number[]
  currentStep: string
  progress: number
  data: {
    [key: string]: any
  }
  startedAt: string
  completedAt?: string
  updatedAt: string
}

export interface FormData {
  id: string
  userId: string
  formType: string
  formId: string
  data: {
    [key: string]: any
  }
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'failed'
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  category: string
  details: {
    [key: string]: any
  }
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

// Comprehensive User Profile Management
export class UserProfileManager {
  static async createProfile(authUserId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const profile: UserProfile = {
      id: `profile_${Date.now()}`,
      authUserId,
      email: profileData.email || '',
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      phone: profileData.phone,
      avatar: profileData.avatar,
      bio: profileData.bio,
      location: profileData.location,
      timezone: profileData.timezone || 'Asia/Kolkata',
      language: profileData.language || 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await userProfilesDB.create(profile)
    return profile
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const profiles = await userProfilesDB.findBy('authUserId', userId)
    if (profiles.length === 0) return null

    const profile = profiles[0]
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await userProfilesDB.update(profile.id, updatedProfile)
    return updatedProfile
  }

  static async getProfile(userId: string): Promise<UserProfile | null> {
    const profiles = await userProfilesDB.findBy('authUserId', userId)
    return profiles.length > 0 ? profiles[0] : null
  }
}

// User Settings Management
export class UserSettingsManager {
  static async createSettings(userId: string): Promise<UserSettings> {
    const settings: UserSettings = {
      id: `settings_${Date.now()}`,
      userId,
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        sms: false,
        orders: true,
        payments: true,
        marketing: false,
        updates: true
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false,
        analytics: true
      },
      preferences: {
        currency: 'INR',
        language: 'en',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await userSettingsDB.create(settings)
    return settings
  }

  static async updateSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | null> {
    const settings = await userSettingsDB.findBy('userId', userId)
    if (settings.length === 0) return null

    const setting = settings[0]
    const updatedSettings = {
      ...setting,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await userSettingsDB.update(setting.id, updatedSettings)
    return updatedSettings
  }

  static async getSettings(userId: string): Promise<UserSettings | null> {
    const settings = await userSettingsDB.findBy('userId', userId)
    return settings.length > 0 ? settings[0] : null
  }
}

// Business Data Management
export class BusinessDataManager {
  static async createBusinessData(userId: string, businessData: Partial<BusinessData>): Promise<BusinessData> {
    const business: BusinessData = {
      id: `business_${Date.now()}`,
      userId,
      businessName: businessData.businessName || '',
      businessType: businessData.businessType || '',
      description: businessData.description || '',
      targetAudience: businessData.targetAudience || '',
      instagramHandle: businessData.instagramHandle || '',
      whatsappNumber: businessData.whatsappNumber,
      website: businessData.website,
      location: businessData.location || '',
      businessHours: businessData.businessHours || '9:00 AM - 6:00 PM',
      currency: businessData.currency || 'INR',
      upiId: businessData.upiId,
      logo: businessData.logo,
      banner: businessData.banner,
      socialLinks: businessData.socialLinks || {},
      contactInfo: businessData.contactInfo || { email: '' },
      aiConfiguration: businessData.aiConfiguration || {
        responseStyle: 'friendly',
        toneOfVoice: 'professional',
        languagePreference: 'manglish'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await businessDataDB.create(business)
    return business
  }

  static async updateBusinessData(userId: string, updates: Partial<BusinessData>): Promise<BusinessData | null> {
    const businesses = await businessDataDB.findBy('userId', userId)
    if (businesses.length === 0) return null

    const business = businesses[0]
    const updatedBusiness = {
      ...business,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await businessDataDB.update(business.id, updatedBusiness)
    return updatedBusiness
  }

  static async getBusinessData(userId: string): Promise<BusinessData | null> {
    const businesses = await businessDataDB.findBy('userId', userId)
    return businesses.length > 0 ? businesses[0] : null
  }
}

// Onboarding Data Management
export class OnboardingManager {
  static async createOnboarding(userId: string): Promise<OnboardingData> {
    const onboarding: OnboardingData = {
      id: `onboarding_${Date.now()}`,
      userId,
      step: 1,
      completedSteps: [],
      currentStep: 'welcome',
      progress: 0,
      data: {},
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await onboardingDataDB.create(onboarding)
    return onboarding
  }

  static async updateOnboarding(userId: string, updates: Partial<OnboardingData>): Promise<OnboardingData | null> {
    const onboardings = await onboardingDataDB.findBy('userId', userId)
    if (onboardings.length === 0) return null

    const onboarding = onboardings[0]
    const updatedOnboarding = {
      ...onboarding,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await onboardingDataDB.update(onboarding.id, updatedOnboarding)
    return updatedOnboarding
  }

  static async getOnboarding(userId: string): Promise<OnboardingData | null> {
    const onboardings = await onboardingDataDB.findBy('userId', userId)
    return onboardings.length > 0 ? onboardings[0] : null
  }

  static async saveOnboardingStep(userId: string, step: string, data: any): Promise<void> {
    const onboarding = await this.getOnboarding(userId)
    if (!onboarding) return

    const updatedData = {
      ...onboarding.data,
      [step]: data
    }

    await this.updateOnboarding(userId, {
      data: updatedData,
      currentStep: step,
      updatedAt: new Date().toISOString()
    })
  }
}

// Form Data Management
export class FormDataManager {
  static async saveFormData(userId: string, formType: string, formId: string, data: any): Promise<FormData> {
    const formData: FormData = {
      id: `form_${Date.now()}`,
      userId,
      formType,
      formId,
      data,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await formDataDB.create(formData)
    return formData
  }

  static async updateFormData(formId: string, updates: Partial<FormData>): Promise<FormData | null> {
    const forms = await formDataDB.findBy('formId', formId)
    if (forms.length === 0) return null

    const form = forms[0]
    const updatedForm = {
      ...form,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await formDataDB.update(form.id, updatedForm)
    return updatedForm
  }

  static async getFormData(userId: string, formType?: string): Promise<FormData[]> {
    const forms = await formDataDB.findBy('userId', userId)
    if (formType) {
      return forms.filter(form => form.formType === formType)
    }
    return forms
  }
}

// User Activity Tracking
export class ActivityTracker {
  static async logActivity(userId: string, action: string, category: string, details: any = {}): Promise<void> {
    const activity: UserActivity = {
      id: `activity_${Date.now()}`,
      userId,
      action,
      category,
      details,
      timestamp: new Date().toISOString()
    }

    await userActivityDB.create(activity)
  }

  static async getUserActivity(userId: string, limit: number = 50): Promise<UserActivity[]> {
    const activities = await userActivityDB.findBy('userId', userId)
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }
}

// Comprehensive Data Initialization
export class DataInitializer {
  static async initializeUserData(authUserId: string, email: string, firstName: string, lastName: string): Promise<void> {
    try {
      // Create user profile
      await UserProfileManager.createProfile(authUserId, {
        email,
        firstName,
        lastName
      })

      // Create user settings
      await UserSettingsManager.createSettings(authUserId)

      // Create onboarding data
      await OnboardingManager.createOnboarding(authUserId)

      // Log activity
      await ActivityTracker.logActivity(authUserId, 'account_created', 'authentication', {
        email,
        firstName,
        lastName
      })

      console.log(`✅ Initialized complete user data for: ${email}`)
    } catch (error) {
      console.error('❌ Failed to initialize user data:', error)
      throw error
    }
  }

  static async saveAllUserInputs(userId: string, inputData: any): Promise<void> {
    try {
      // Save to form data
      await FormDataManager.saveFormData(userId, 'user_input', `input_${Date.now()}`, inputData)

      // Log activity
      await ActivityTracker.logActivity(userId, 'data_saved', 'user_input', {
        dataType: 'user_input',
        timestamp: new Date().toISOString()
      })

      console.log(`✅ Saved user inputs for: ${userId}`)
    } catch (error) {
      console.error('❌ Failed to save user inputs:', error)
      throw error
    }
  }
}

// Auto-save functionality for forms
export class AutoSaveManager {
  private static saveTimeouts: Map<string, NodeJS.Timeout> = new Map()

  static async autoSave(userId: string, formType: string, formId: string, data: any, delay: number = 2000): Promise<void> {
    const key = `${userId}_${formType}_${formId}`

    // Clear existing timeout
    if (this.saveTimeouts.has(key)) {
      clearTimeout(this.saveTimeouts.get(key)!)
    }

    // Set new timeout
    const timeout = setTimeout(async () => {
      try {
        await FormDataManager.saveFormData(userId, formType, formId, data)
        console.log(`✅ Auto-saved ${formType} data for user: ${userId}`)
      } catch (error) {
        console.error(`❌ Auto-save failed for ${formType}:`, error)
      } finally {
        this.saveTimeouts.delete(key)
      }
    }, delay)

    this.saveTimeouts.set(key, timeout)
  }

  static clearAutoSave(userId: string, formType: string, formId: string): void {
    const key = `${userId}_${formType}_${formId}`
    if (this.saveTimeouts.has(key)) {
      clearTimeout(this.saveTimeouts.get(key)!)
      this.saveTimeouts.delete(key)
    }
  }
}
