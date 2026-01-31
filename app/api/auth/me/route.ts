import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDb()
    const userData = await db.collection('users').findOne({
      _id: new ObjectId(user.userId),
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        unlockedRewards: userData.unlockedRewards || [],
        currentStreak: userData.currentStreak || 0,
        longestStreak: userData.longestStreak || 0,
        totalDays: userData.totalDays || 0,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
