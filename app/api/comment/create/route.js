import { connectDB } from '@/lib/db'
import Comment from '@/models/Comment'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const user = await getAuthUser(request)

    await connectDB()

    const { content, postId, userId } = await request.json()

    if (userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'You are not allowed to create a comment' },
        { status: 403 }
      )
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    })

    await newComment.save()

    return NextResponse.json(
      { success: true, comment: newComment },
      { status: 200 }
    )
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
