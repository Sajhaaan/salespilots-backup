import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { 
  DataInitializer, 
  FormDataManager, 
  UserProfileManager, 
  UserSettingsManager, 
  BusinessDataManager,
  OnboardingManager,
  ActivityTracker,
  AutoSaveManager
} from '@/lib/database-persistence'

// Save any user input data
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      dataType, 
      formType, 
      formId, 
      data, 
      autoSave = false,
      delay = 2000 
    } = await request.json()

    if (!dataType || !data) {
      return NextResponse.json({ error: 'Data type and data are required' }, { status: 400 })
    }

    let result: any = {}

    switch (dataType) {
      case 'form_data':
        if (autoSave) {
          await AutoSaveManager.autoSave(authUser.id, formType, formId, data, delay)
          result = { success: true, message: 'Auto-save scheduled' }
        } else {
          const savedForm = await FormDataManager.saveFormData(authUser.id, formType, formId, data)
          result = { success: true, formData: savedForm }
        }
        break

      case 'profile_update':
        const updatedProfile = await UserProfileManager.updateProfile(authUser.id, data)
        result = { success: true, profile: updatedProfile }
        break

      case 'settings_update':
        const updatedSettings = await UserSettingsManager.updateSettings(authUser.id, data)
        result = { success: true, settings: updatedSettings }
        break

      case 'business_update':
        const updatedBusiness = await BusinessDataManager.updateBusinessData(authUser.id, data)
        result = { success: true, business: updatedBusiness }
        break

      case 'onboarding_step':
        await OnboardingManager.saveOnboardingStep(authUser.id, formId, data)
        result = { success: true, message: 'Onboarding step saved' }
        break

      case 'user_input':
        await DataInitializer.saveAllUserInputs(authUser.id, data)
        result = { success: true, message: 'User input saved' }
        break

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    // Log activity
    await ActivityTracker.logActivity(authUser.id, 'data_saved', dataType, {
      formType,
      formId,
      dataType,
      autoSave
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Data save error:', error)
    return NextResponse.json(
      { error: 'Failed to save data' }, 
      { status: 500 }
    )
  }
}

// Get user data
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get('type')
    const formType = searchParams.get('formType')

    let result: any = {}

    switch (dataType) {
      case 'profile':
        const profile = await UserProfileManager.getProfile(authUser.id)
        result = { success: true, profile }
        break

      case 'settings':
        const settings = await UserSettingsManager.getSettings(authUser.id)
        result = { success: true, settings }
        break

      case 'business':
        const business = await BusinessDataManager.getBusinessData(authUser.id)
        result = { success: true, business }
        break

      case 'onboarding':
        const onboarding = await OnboardingManager.getOnboarding(authUser.id)
        result = { success: true, onboarding }
        break

      case 'form_data':
        const formData = await FormDataManager.getFormData(authUser.id, formType || undefined)
        result = { success: true, formData }
        break

      case 'all':
        const [userProfile, userSettings, userBusiness, userOnboarding] = await Promise.all([
          UserProfileManager.getProfile(authUser.id),
          UserSettingsManager.getSettings(authUser.id),
          BusinessDataManager.getBusinessData(authUser.id),
          OnboardingManager.getOnboarding(authUser.id)
        ])
        result = { 
          success: true, 
          data: { profile: userProfile, settings: userSettings, business: userBusiness, onboarding: userOnboarding } 
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    )
  }
}

// Update user data
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { dataType, data } = await request.json()

    if (!dataType || !data) {
      return NextResponse.json({ error: 'Data type and data are required' }, { status: 400 })
    }

    let result: any = {}

    switch (dataType) {
      case 'profile':
        const updatedProfile = await UserProfileManager.updateProfile(authUser.id, data)
        result = { success: true, profile: updatedProfile }
        break

      case 'settings':
        const updatedSettings = await UserSettingsManager.updateSettings(authUser.id, data)
        result = { success: true, settings: updatedSettings }
        break

      case 'business':
        const updatedBusiness = await BusinessDataManager.updateBusinessData(authUser.id, data)
        result = { success: true, business: updatedBusiness }
        break

      case 'onboarding':
        const updatedOnboarding = await OnboardingManager.updateOnboarding(authUser.id, data)
        result = { success: true, onboarding: updatedOnboarding }
        break

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }

    // Log activity
    await ActivityTracker.logActivity(authUser.id, 'data_updated', dataType, {
      dataType,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Data update error:', error)
    return NextResponse.json(
      { error: 'Failed to update data' }, 
      { status: 500 }
    )
  }
}
