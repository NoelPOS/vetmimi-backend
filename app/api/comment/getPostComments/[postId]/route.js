import { connectDB } from '@/lib/db'
import Comment from '@/models/Comment'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const comments = await Comment.find({ postId: params.postId }).sort({
      createdAt: -1,
    })

    return NextResponse.json({ success: true, comments }, { status: 200 })
  } catch (error) {
    console.error('Get post comments error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
