import { connectDB } from '@/lib/db'
import Comment from '@/models/Comment'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const user = await getAuthUser(request)

    if (!user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'You are not allowed to view comments' },
        { status: 403 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const startIndex = Number.parseInt(searchParams.get('startIndex')) || 0
    const limit = Number.parseInt(searchParams.get('limit')) || 9
    const sortDirection = searchParams.get('sort') === 'desc' ? -1 : 1

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalComments = await Comment.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    return NextResponse.json(
      {
        success: true,
        comments,
        totalComments,
        lastMonthComments,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
