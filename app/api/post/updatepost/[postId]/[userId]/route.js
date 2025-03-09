import { connectDB } from '@/lib/db'
import Post from '@/models/Post'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request)

    if (!user.isAdmin && user.id !== params.userId) {
      return NextResponse.json(
        { success: false, message: 'You are not allowed to update this post' },
        { status: 403 }
      )
    }

    await connectDB()

    const body = await request.json()

    const updatedPost = await Post.findByIdAndUpdate(
      params.postId,
      {
        $set: {
          title: body.title,
          content: body.content,
          category: body.category,
          image: body.image,
        },
      },
      { new: true }
    )

    return NextResponse.json(
      { success: true, post: updatedPost },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
