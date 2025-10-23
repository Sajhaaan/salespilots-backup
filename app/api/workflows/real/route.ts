// Real Workflows API - Actually works with real data
import { NextRequest, NextResponse } from 'next/server'
import { BusinessDB } from '@/lib/database-extensions'
import { getAuthUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { workflowEngine } from '@/lib/core/workflow-engine'

// GET /api/workflows/real - Get all workflows for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const workflows = await BusinessDB.findWorkflowsByUserId(authUser.id)

    // Get stats for each workflow
    const workflowsWithStats = await Promise.all(
      workflows.map(async (workflow) => {
        const stats = await workflowEngine.getWorkflowStats(workflow.id)
        return {
          ...workflow,
          stats: stats?.stats
        }
      })
    )

    return successResponse({
      workflows: workflowsWithStats
    }, 'Workflows retrieved successfully')

  } catch (error) {
    console.error('Get workflows error:', error)
    return errorResponse('Failed to get workflows', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// POST /api/workflows/real - Create a new workflow
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    const { name, description, steps, isActive = true } = body

    if (!name || !steps || !Array.isArray(steps)) {
      return errorResponse('Missing required fields', 'VALIDATION_ERROR', 400)
    }

    const workflowData = {
      userId: authUser.id,
      name,
      description: description || '',
      isActive,
      steps,
      executionCount: 0,
      successCount: 0,
      errorCount: 0
    }

    const workflow = await workflowEngine.createWorkflow(workflowData)

    return successResponse({
      workflow
    }, 'Workflow created successfully', 201)

  } catch (error) {
    console.error('Create workflow error:', error)
    return errorResponse('Failed to create workflow', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// PUT /api/workflows/real - Update a workflow
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const body = await request.json()
    const { id, name, description, steps, isActive } = body

    if (!id) {
      return errorResponse('Workflow ID is required', 'VALIDATION_ERROR', 400)
    }

    // Check if workflow exists and belongs to user
    const existingWorkflow = await BusinessDB.findWorkflowById(id)
    if (!existingWorkflow || existingWorkflow.userId !== authUser.id) {
      return errorResponse('Workflow not found', 'NOT_FOUND_ERROR', 404)
    }

    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (steps !== undefined) updates.steps = steps
    if (isActive !== undefined) updates.isActive = isActive

    const updatedWorkflow = await BusinessDB.updateWorkflow(id, updates)

    if (!updatedWorkflow) {
      return errorResponse('Failed to update workflow', 'INTERNAL_SERVER_ERROR', 500)
    }

    return successResponse({
      workflow: updatedWorkflow
    }, 'Workflow updated successfully')

  } catch (error) {
    console.error('Update workflow error:', error)
    return errorResponse('Failed to update workflow', 'INTERNAL_SERVER_ERROR', 500)
  }
}

// DELETE /api/workflows/real - Delete a workflow
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request)
    if (!authUser) {
      return errorResponse('Unauthorized', 'AUTHENTICATION_ERROR', 401)
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('Workflow ID is required', 'VALIDATION_ERROR', 400)
    }

    // Check if workflow exists and belongs to user
    const workflow = await BusinessDB.findWorkflowById(id)
    if (!workflow || workflow.userId !== authUser.id) {
      return errorResponse('Workflow not found', 'NOT_FOUND_ERROR', 404)
    }

    // Deactivate instead of deleting to preserve history
    await BusinessDB.updateWorkflow(id, { isActive: false })

    return successResponse({
      message: 'Workflow deactivated successfully'
    }, 'Workflow deactivated successfully')

  } catch (error) {
    console.error('Delete workflow error:', error)
    return errorResponse('Failed to delete workflow', 'INTERNAL_SERVER_ERROR', 500)
  }
}
