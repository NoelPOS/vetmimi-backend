import { connectDB } from '@/lib/db'
import Post from '@/models/Post'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const startIndex = Number.parseInt(searchParams.get('startIndex')) || 0
    const limit = Number.parseInt(searchParams.get('limit')) || 9
    const sortDirection = searchParams.get('order') === 'asc' ? 1 : -1

    const query = {}

    if (searchParams.get('userId')) {
      query.userId = searchParams.get('userId')
    }

    if (searchParams.get('category')) {
      query.category = searchParams.get('category')
    }

    if (searchParams.get('slug')) {
      query.slug = searchParams.get('slug')
    }

    if (searchParams.get('postId')) {
      query._id = searchParams.get('postId')
    }

    if (searchParams.get('searchTerm')) {
      query.$or = [
        { title: { $regex: searchParams.get('searchTerm'), $options: 'i' } },
        { content: { $regex: searchParams.get('searchTerm'), $options: 'i' } },
      ]
    }

    // query.$or means

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalPosts = await Post.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    return NextResponse.json(
      {
        success: true,
        posts,
        totalPosts,
        lastMonthPosts,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
