import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'
import { ProductionDB } from '@/lib/database-production'
import { BusinessDataManager, OnboardingManager, ActivityTracker } from '@/lib/database-persistence'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Store Setup: Starting store setup process')
    
    // Check authentication

    const authUser = await getAuthUserFromRequest(request)
    console.log('🔍 Store Setup: Auth user:', authUser ? { id: authUser.id, email: authUser.email } : 'null')
    
    if (!authUser) {
      console.log('❌ Store Setup: No authenticated user found')
      return NextResponse.json({ error: 'Unauthorized - Please sign in first' }, { status: 401 })
    }

    const storeData = await request.json()
    console.log('🔍 Store Setup: Store data received:', storeData)
    
    // Validate required fields
    const required = ['businessName', 'businessType', 'instagramHandle', 'description', 'targetAudience']
    for (const field of required) {
      if (!storeData[field]?.trim()) {
        console.log(`❌ Store Setup: Missing required field: ${field}`)
        return NextResponse.json({ 
          error: `${field} is required` 
        }, { status: 400 })
      }
    }

    console.log('🔍 Store Setup: All required fields validated')

    // Find and update user profile
    console.log('🔍 Store Setup: Looking for user profile...')
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    console.log('🔍 Store Setup: User profile found:', !!user)
    
    if (!user) {
      console.log('❌ Store Setup: User profile not found, creating new profile...')
      // Create a basic user profile if it doesn't exist
      const newUser = {
        id: authUser.id,
        authUserId: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      try {
        await ProductionDB.createUser(newUser)
        console.log('✅ Store Setup: New user profile created')
      } catch (createError) {
        console.error('❌ Store Setup: Failed to create user profile:', createError)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
    }

    // Update user with basic store details (only fields that exist in users table)
    const updatedUser = {
      business_name: storeData.businessName,
      instagram_handle: storeData.instagramHandle.replace('@', ''),
      updated_at: new Date().toISOString()
    }

    console.log('🔍 Store Setup: Updating user profile...')

    // Find the user profile first
    const userProfile = await ProductionDB.findUserByAuthId(authUser.id)
    if (!userProfile) {
      console.log('❌ Store Setup: User profile not found')
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }
    
    // Update user profile in database using the profile ID, not auth user ID
    try {
      await ProductionDB.updateUser(userProfile.id, updatedUser)
      console.log('✅ Store Setup: User profile updated successfully')
    } catch (updateError) {
      console.error('❌ Store Setup: Failed to update user profile:', updateError)
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
    }

    console.log('🔍 Store Setup: Creating business data...')

    // Save comprehensive business data
    try {
      await BusinessDataManager.createBusinessData(authUser.id, {
        businessName: storeData.businessName,
        businessType: storeData.businessType,
        description: storeData.description,
        targetAudience: storeData.targetAudience,
        instagramHandle: storeData.instagramHandle.replace('@', ''),
        location: storeData.location || '',
        businessHours: storeData.businessHours || '9:00 AM - 6:00 PM',
        currency: storeData.currency || 'INR',
        aiConfiguration: {
          responseStyle: storeData.responseStyle || 'friendly',
          toneOfVoice: 'professional',
          languagePreference: 'manglish'
        }
      })
      console.log('✅ Store Setup: Business data created successfully')
    } catch (businessError) {
      console.error('❌ Store Setup: Failed to create business data:', businessError)
      // Continue with setup even if business data fails
    }

    console.log('🔍 Store Setup: Updating onboarding progress...')

    // Update onboarding progress
    try {
      await OnboardingManager.updateOnboarding(authUser.id, {
        step: 2,
        completedSteps: [1, 2],
        currentStep: 'store_setup_completed',
        progress: 40,
        data: {
          store_setup: storeData
        }
      })
      console.log('✅ Store Setup: Onboarding progress updated')
    } catch (onboardingError) {
      console.error('❌ Store Setup: Failed to update onboarding:', onboardingError)
      // Continue with setup even if onboarding update fails
    }

    console.log('🔍 Store Setup: Logging activity...')

    // Log activity
    try {
      await ActivityTracker.logActivity(authUser.id, 'store_setup_completed', 'onboarding', {
        businessName: storeData.businessName,
        businessType: storeData.businessType
      })
      console.log('✅ Store Setup: Activity logged successfully')
    } catch (activityError) {
      console.error('❌ Store Setup: Failed to log activity:', activityError)
      // Continue with setup even if activity logging fails
    }

    console.log('🎉 Store Setup: All operations completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Store setup completed successfully',
      store: {
        businessName: storeData.businessName,
        businessType: storeData.businessType,
        instagramHandle: storeData.instagramHandle,
        storeSetupCompleted: true
      }
    })

  } catch (error) {
    console.error('❌ Store Setup: Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to setup store - Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user profile
    const user = await ProductionDB.findUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      store: {
        businessName: user.businessName || '',
        businessType: user.businessType || '',
        instagramHandle: user.instagramHandle || '',
        description: user.description || '',
        targetAudience: user.targetAudience || '',
        responseStyle: user.responseStyle || 'friendly',
        businessHours: user.businessHours || '9:00 AM - 6:00 PM',
        currency: user.currency || 'INR',
        location: user.location || '',
        storeSetupCompleted: user.storeSetupCompleted || false,
        aiTrainingData: user.aiTrainingData || null
      }
    })

  } catch (error) {
    console.error('Store fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store details' }, 
      { status: 500 }
    )
  }
}
