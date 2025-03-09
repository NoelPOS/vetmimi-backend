import { connectDB } from '@/lib/db'
import Post from '@/models/Post'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const user = await getAuthUser(request)

    if (!user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'You are not allowed to create a post' },
        { status: 403 }
      )
    }

    await connectDB()

    const body = await request.json()

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    const slug = body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '')

    const newPost = new Post({
      ...body,
      slug,
      userId: user.id,
    })

    const savedPost = await newPost.save()

    return NextResponse.json(
      { success: true, post: savedPost },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
