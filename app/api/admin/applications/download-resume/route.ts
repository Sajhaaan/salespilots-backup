import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    // For now, return an error since we're not saving files to local filesystem
    // In production, you should fetch from Supabase storage or cloud storage
    console.log('Resume download requested for:', filename)

    // TODO: Fetch from Supabase storage or cloud storage
    // const { data, error } = await supabase.storage
    //   .from('resumes')
    //   .download(filename)

    return NextResponse.json(
      { error: 'Resume download not available in current setup' },
      { status: 501 }
    )

  } catch (error) {
    console.error('Error downloading resume:', error)
    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    )
  }
}
