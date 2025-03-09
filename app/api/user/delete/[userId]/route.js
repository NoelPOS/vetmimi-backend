import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request)

    if (!user.isAdmin && user.id !== params.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    await connectDB()

    await User.findByIdAndDelete(params.userId)

    return NextResponse.json(
      { success: true, message: 'User has been deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
