import { connectDB } from '@/lib/db'
import Post from '@/models/Post'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request)

    if (!user.isAdmin && user.id !== params.userId) {
      return NextResponse.json(
        { success: false, message: 'You are not allowed to delete this post' },
        { status: 403 }
      )
    }

    await connectDB()

    await Post.findByIdAndDelete(params.postId)

    return NextResponse.json(
      { success: true, message: 'The post has been deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
