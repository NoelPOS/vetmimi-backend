import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcryptjs from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await connectDB()

    const { username, email, password } = await request.json()

    if (
      !username ||
      !email ||
      !password ||
      username === '' ||
      email === '' ||
      password === ''
    ) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return NextResponse.json(
      { success: true, message: 'Signup successful' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
