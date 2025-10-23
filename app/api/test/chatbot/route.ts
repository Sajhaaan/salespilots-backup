import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Test the chatbot with a simple message
    const testResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://salespilots-backup-ezf0jbnj4-sajhaaaan-gmailcoms-projects.vercel.app'}/api/chat/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message || 'Hello, test message' })
    })
    
    const chatbotResponse = await testResponse.json()
    
    return NextResponse.json({
      success: true,
      chatbot: chatbotResponse,
      message: 'Chatbot test completed'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Chatbot test failed',
      details: error 
    }, { status: 500 })
  }
}
