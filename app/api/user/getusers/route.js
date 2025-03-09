import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { getAuthUser } from '@/middleware/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const user = await getAuthUser(request)

    if (!user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const startIndex = Number.parseInt(searchParams.get('startIndex')) || 0
    const limit = Number.parseInt(searchParams.get('limit')) || 9
    const sortDirection = searchParams.get('sort') === 'asc' ? 1 : -1

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc
      return rest
    })

    const totalUsers = await User.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    return NextResponse.json(
      {
        success: true,
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
