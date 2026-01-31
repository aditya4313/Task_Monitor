import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { checkAndUnlockRewards } from '@/lib/rewards'
import { format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { goalId, date, achievedValue } = await request.json()

    if (!goalId || !date || achievedValue === undefined) {
      return NextResponse.json(
        { error: 'Goal ID, date, and achieved value are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const userId = new ObjectId(user.userId)
    const goalObjectId = new ObjectId(goalId)

    // Get goal to check target
    const goal = await db.collection('goals').findOne({
      _id: goalObjectId,
      userId,
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Upsert daily log
    await db.collection('daily_logs').updateOne(
      {
        userId,
        goalId: goalObjectId,
        date,
      },
      {
        $set: {
          achievedValue: Number(achievedValue),
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    // Update streak
    const today = format(new Date(), 'yyyy-MM-dd')
    const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    
    const yesterdayLog = await db.collection('daily_logs').findOne({
      userId,
      goalId: goalObjectId,
      date: yesterday,
    })

    const userData = await db.collection('users').findOne({ _id: userId })
    let currentStreak = userData?.currentStreak || 0

    if (date === today) {
      // Check if goal was completed today
      const isCompleted = Number(achievedValue) >= goal.targetValue
      
      if (isCompleted) {
        if (yesterdayLog && yesterdayLog.achievedValue >= goal.targetValue) {
          // Continue streak
          currentStreak = (userData?.currentStreak || 0) + 1
        } else {
          // Start new streak
          currentStreak = 1
        }
      } else {
        // Reset streak if not completed
        currentStreak = 0
      }

      await db.collection('users').updateOne(
        { _id: userId },
        {
          $set: {
            currentStreak: Math.max(currentStreak, userData?.currentStreak || 0),
            longestStreak: Math.max(
              currentStreak,
              userData?.longestStreak || 0
            ),
          },
          $inc: { totalDays: 1 },
        }
      )
    }

    // Check for rewards
    const hour = new Date().getHours()
    const isEarlyLog = hour < 8
    const isLateLog = hour >= 22

    const newlyUnlocked = await checkAndUnlockRewards(
      user.userId,
      currentStreak,
      Number(achievedValue),
      goal.targetValue,
      isEarlyLog,
      isLateLog
    )

    return NextResponse.json({
      success: true,
      newlyUnlockedRewards: newlyUnlocked,
    })
  } catch (error) {
    console.error('Log progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('goalId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const db = await getDb()
    const userId = new ObjectId(user.userId)

    const query: any = { userId }
    
    if (goalId) {
      query.goalId = new ObjectId(goalId)
    }
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate }
    }

    const logs = await db.collection('daily_logs')
      .find(query)
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Get logs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
