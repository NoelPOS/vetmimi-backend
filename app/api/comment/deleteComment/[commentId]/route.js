import { connectDB } from '@/lib/db'
import Comment from '@/models/Comment'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
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
      throw errorHandler(403, 'You are not allowed to delete this comment')
    }

    await Comment.findByIdAndDelete(params.commentId)

    return NextResponse.json(
      { success: true, message: 'Comment has been deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
