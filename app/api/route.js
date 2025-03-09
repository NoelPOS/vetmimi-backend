import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Blog API is running',
      version: '1.0.0',
      documentation: '/api/docs',
    },
    { status: 200 }
  )
}
