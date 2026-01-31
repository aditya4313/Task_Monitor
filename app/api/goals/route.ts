import { NextRequest, NextResponse } from 'next/server'
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
    const goals = await db.collection('goals')
      .find({ userId: new ObjectId(user.userId), isActive: true })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ goals })
  } catch (error) {
    console.error('Get goals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, targetValue, unit } = await request.json()

    if (!title || !targetValue || !unit) {
      return NextResponse.json(
        { error: 'Title, target value, and unit are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const result = await db.collection('goals').insertOne({
      userId: new ObjectId(user.userId),
      title,
      description: description || '',
      targetValue: Number(targetValue),
      unit,
      createdAt: new Date(),
      isActive: true,
    })

    return NextResponse.json(
      { success: true, goalId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create goal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
