import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    if (!email || !password || email === '' || password === '') {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    const validUser = await User.findOne({ email })

    if (!validUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 400 }
      )
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    )

    const { password: pass, ...rest } = validUser._doc

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
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
