import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'User has been signed out' },
      { status: 200 }
    )

    response.cookies.set('access_token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    })

    return response
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: error.statusCode || 500 }
    )
  }
}
