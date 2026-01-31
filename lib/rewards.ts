import { REWARDS, Reward } from './models'
import { getDb } from './mongodb'
import { ObjectId } from 'mongodb'

export async function checkAndUnlockRewards(
  userId: string,
  currentStreak: number,
  achievedValue: number,
  targetValue: number,
  isEarlyLog: boolean = false,
  isLateLog: boolean = false
): Promise<Reward[]> {
  const db = await getDb()
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
  
  if (!user) {
    return []
  }

  const unlockedRewards = user.unlockedRewards || []
  const newlyUnlocked: Reward[] = []

  // Check streak-based rewards
  if (currentStreak >= 3 && !unlockedRewards.includes('first_streak_3')) {
    newlyUnlocked.push(REWARDS.find(r => r.id === 'first_streak_3')!)
  }
  if (currentStreak >= 7 && !unlockedRewards.includes('streak_7')) {
    newlyUnlocked.push(REWARDS.find(r => r.id === 'streak_7')!)
  }
  if (currentStreak >= 30 && !unlockedRewards.includes('streak_30')) {
    newlyUnlocked.push(REWARDS.find(r => r.id === 'streak_30')!)
  }

  // Check overachiever
  if (achievedValue >= targetValue * 1.5 && !unlockedRewards.includes('overachiever')) {
    newlyUnlocked.push(REWARDS.find(r => r.id === 'overachiever')!)
  }

  // Check time-based rewards
  if (isEarlyLog && !unlockedRewards.includes('early_bird')) {
    newlyUnlocked.push(REWARDS.find(r => r.id === 'early_bird')!)
  }
  if (isLateLog && !unlockedRewards.includes('night_owl')) {
    newlyUnlocked.push(REWARDS.find(r => r.id === 'night_owl')!)
  }

  // Random surprise (5% chance)
  if (Math.random() < 0.05 && !unlockedRewards.includes('surprise_day')) {
    newlyUnlocked.push(REWARDS.find(r => r.id === 'surprise_day')!)
  }

  // Update user with newly unlocked rewards
  if (newlyUnlocked.length > 0) {
    const rewardIds = newlyUnlocked.map(r => r.id)
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $push: { unlockedRewards: { $each: rewardIds } } } as any
    )
  }

  return newlyUnlocked
}

export async function checkPerfectWeek(userId: string): Promise<boolean> {
  const db = await getDb()
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - 7)
  
  const goals = await db.collection('goals').find({
    userId: new ObjectId(userId),
    isActive: true,
  }).toArray()

  if (goals.length === 0) return false

  // Check if all goals were completed every day for the past week
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date.toISOString().split('T')[0]
  })

  for (const date of dates) {
    for (const goal of goals) {
      const log = await db.collection('daily_logs').findOne({
        userId: new ObjectId(userId),
        goalId: goal._id,
        date,
      })
      
      if (!log || log.achievedValue < goal.targetValue) {
        return false
      }
    }
  }

  // Unlock perfect week reward if not already unlocked
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
  if (user && !user.unlockedRewards?.includes('perfect_week')) {
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $push: { unlockedRewards: 'perfect_week' } } as any
    )
    return true
  }

  return false
}
