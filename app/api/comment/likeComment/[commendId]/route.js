import { connectDB } from '@/lib/db'
import Comment from '@/models/Comment'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request)

    await connectDB()

    const comment = await Comment.findById(params.commentId)

    if (!comment) {
      NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      )
    }

    const userIndex = comment.likes.indexOf(user.id)

    if (userIndex === -1) {
      comment.numberOfLikes += 1
      comment.likes.push(user.id)
    } else {
      comment.numberOfLikes -= 1
      comment.likes.splice(userIndex, 1)
    }

    await comment.save()

    return NextResponse.json({ success: true, comment }, { status: 200 })
  } catch (error) {
    console.error('Like comment error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
