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

    if (comment.userId !== user.id && !user.isAdmin) {
      throw errorHandler(403, 'You are not allowed to edit this comment')
    }

    const { content } = await request.json()

    const editedComment = await Comment.findByIdAndUpdate(
      params.commentId,
      {
        content,
      },
      { new: true }
    )

    return NextResponse.json(
      { success: true, comment: editedComment },
      { status: 200 }
    )
  } catch (error) {
    console.error('Edit comment error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
