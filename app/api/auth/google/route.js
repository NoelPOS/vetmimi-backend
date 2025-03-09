import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await connectDB()

    const { email, name, googlePhotoUrl } = await request.json()

    const user = await User.findOne({ email })

    if (user) {
      // User exists, sign them in
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      )

      const { password, ...rest } = user._doc

      const response = NextResponse.json(
        { success: true, ...rest },
        { status: 200 }
      )

      response.cookies.set('access_token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return response
    } else {
      // Create new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      })

      await newUser.save()

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      )

      const { password, ...rest } = newUser._doc

      const response = NextResponse.json(
        { success: true, ...rest },
        { status: 200 }
      )

      response.cookies.set('access_token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return response
    }
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
