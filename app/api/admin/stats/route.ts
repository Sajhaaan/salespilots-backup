import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const authUser = await getAuthUserFromRequest(request)
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ success: true, message: 'API working' })
}

export async function POST(request: NextRequest) {
  const authUser = await getAuthUserFromRequest(request)
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ success: true, message: 'API working' })
}