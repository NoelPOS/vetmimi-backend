import { connectDB } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    await connectDB()

    return NextResponse.json(
      {
        success: true,
        status: 'healthy',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
