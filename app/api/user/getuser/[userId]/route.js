import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const user = await User.findById(params.userId)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const { password, ...rest } = user._doc

    return NextResponse.json({ success: true, user: rest }, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
