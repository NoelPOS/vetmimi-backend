import { NextResponse } from 'next/server'

export async function GET() {
  const apiDocs = {
    title: 'Blog API Documentation',
    version: '1.0.0',
    baseUrl: '/api',
    endpoints: {
      auth: {
        signup: {
          method: 'POST',
          url: '/auth/signup',
          description: 'Register a new user',
          body: {
            username: 'string',
            email: 'string',
            password: 'string',
          },
        },
        signin: {
          method: 'POST',
          url: '/auth/signin',
          description: 'Login a user',
          body: {
            email: 'string',
            password: 'string',
          },
        },
        google: {
          method: 'POST',
          url: '/auth/google',
          description: 'Login or register with Google',
          body: {
            email: 'string',
            name: 'string',
            googlePhotoUrl: 'string',
          },
        },
        signout: {
          method: 'POST',
          url: '/auth/signout',
          description: 'Logout a user',
        },
      },
      user: {
        test: {
          method: 'GET',
          url: '/user/test',
          description: 'Test API endpoint',
        },
        update: {
          method: 'PUT',
          url: '/user/update/:userId',
          description: 'Update user information',
          auth: true,
        },
        delete: {
          method: 'DELETE',
          url: '/user/delete/:userId',
          description: 'Delete a user',
          auth: true,
        },
        getUsers: {
          method: 'GET',
          url: '/user/getusers',
          description: 'Get all users (admin only)',
          auth: true,
        },
        getUser: {
          method: 'GET',
          url: '/user/:userId',
          description: 'Get a specific user',
        },
      },
      post: {
        create: {
          method: 'POST',
          url: '/post/create',
          description: 'Create a new post (admin only)',
          auth: true,
        },
        getPosts: {
          method: 'GET',
          url: '/post/getposts',
          description: 'Get posts with various filters',
        },
        deletePost: {
          method: 'DELETE',
          url: '/post/deletepost/:postId/:userId',
          description: 'Delete a post',
          auth: true,
        },
        updatePost: {
          method: 'PUT',
          url: '/post/updatepost/:postId/:userId',
          description: 'Update a post',
          auth: true,
        },
      },
      comment: {
        create: {
          method: 'POST',
          url: '/comment/create',
          description: 'Create a new comment',
          auth: true,
        },
        getPostComments: {
          method: 'GET',
          url: '/comment/getPostComments/:postId',
          description: 'Get comments for a specific post',
        },
        likeComment: {
          method: 'PUT',
          url: '/comment/likeComment/:commentId',
          description: 'Like or unlike a comment',
          auth: true,
        },
        editComment: {
          method: 'PUT',
          url: '/comment/editComment/:commentId',
          description: 'Edit a comment',
          auth: true,
        },
        deleteComment: {
          method: 'DELETE',
          url: '/comment/deleteComment/:commentId',
          description: 'Delete a comment',
          auth: true,
        },
        getComments: {
          method: 'GET',
          url: '/comment/getcomments',
          description: 'Get all comments (admin only)',
          auth: true,
        },
      },
    },
  }

  return NextResponse.json(apiDocs, { status: 200 })
}
