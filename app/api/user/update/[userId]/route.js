import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request)

    if (user.id !== params.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()

    // Validate password if provided
    if (body.password) {
      if (body.password.length < 6) {
        throw errorHandler(400, 'Password must be at least 6 characters')
      }
      body.password = bcryptjs.hashSync(body.password, 10)
    }

    // Validate username if provided
    if (body.username) {
      if (body.username.length < 7 || body.username.length > 20) {
        throw errorHandler(400, 'Username must be between 7 and 20 characters')
      }
      if (body.username.includes(' ')) {
        throw errorHandler(400, 'Username cannot contain spaces')
      }
      if (body.username !== body.username.toLowerCase()) {
        throw errorHandler(400, 'Username must be lowercase')
      }
      if (!body.username.match(/^[a-zA-Z0-9]+$/)) {
        throw errorHandler(400, 'Username can only contain letters and numbers')
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.userId,
      {
        $set: {
          username: body.username,
          email: body.email,
          profilePicture: body.profilePicture,
          password: body.password,
        },
      },
      { new: true }
    )

    const { password, ...rest } = updatedUser._doc

    return NextResponse.json({ success: true, user: rest }, { status: 200 })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
