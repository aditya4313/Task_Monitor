import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  createdAt: Date
  unlockedRewards: string[]
  currentStreak: number
  longestStreak: number
  totalDays: number
}

export interface Goal {
  _id?: ObjectId
  userId: ObjectId
  title: string
  description: string
  targetValue: number
  unit: string
  createdAt: Date
  isActive: boolean
}

export interface DailyLog {
  _id?: ObjectId
  userId: ObjectId
  goalId: ObjectId
  date: string // YYYY-MM-DD format
  achievedValue: number
  createdAt: Date
}

export interface Reward {
  id: string
  name: string
  description: string
  icon: string
  unlockCondition: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const REWARDS: Reward[] = [
  {
    id: 'first_streak_3',
    name: '🔥 First Flame',
    description: 'Complete 3 days in a row!',
    icon: '🔥',
    unlockCondition: 'streak_3',
    rarity: 'common',
  },
  {
    id: 'streak_7',
    name: '⚡ Week Warrior',
    description: 'Maintain a 7-day streak!',
    icon: '⚡',
    unlockCondition: 'streak_7',
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    name: '👑 Discipline God',
    description: '30 days of pure discipline!',
    icon: '👑',
    unlockCondition: 'streak_30',
    rarity: 'legendary',
  },
  {
    id: 'overachiever',
    name: '🌟 Overachiever',
    description: 'Exceed your goal by 150%!',
    icon: '🌟',
    unlockCondition: 'overachieve_150',
    rarity: 'epic',
  },
  {
    id: 'perfect_week',
    name: '💎 Perfect Week',
    description: 'Complete all goals for 7 days!',
    icon: '💎',
    unlockCondition: 'perfect_week',
    rarity: 'epic',
  },
  {
    id: 'early_bird',
    name: '🌅 Early Bird',
    description: 'Log progress before 8 AM!',
    icon: '🌅',
    unlockCondition: 'early_log',
    rarity: 'rare',
  },
  {
    id: 'night_owl',
    name: '🦉 Night Owl',
    description: 'Log progress after 10 PM!',
    icon: '🦉',
    unlockCondition: 'late_log',
    rarity: 'rare',
  },
  {
    id: 'surprise_day',
    name: '🎁 Surprise Gift',
    description: 'Random reward for your dedication!',
    icon: '🎁',
    unlockCondition: 'random',
    rarity: 'common',
  },
]
