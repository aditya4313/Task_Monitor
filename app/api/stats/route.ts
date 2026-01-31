import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

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
    const userId = new ObjectId(user.userId)

    // Get all goals
    const goals = await db.collection('goals')
      .find({ userId, isActive: true })
      .toArray()

    // Get all logs
    const logs = await db.collection('daily_logs')
      .find({ userId })
      .toArray()

    // Calculate stats
    const today = format(new Date(), 'yyyy-MM-dd')
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      return format(subDays(new Date(), i), 'yyyy-MM-dd')
    })

    const dailyStats: Record<string, { total: number; completed: number }> = {}
    
    for (const date of last30Days) {
      dailyStats[date] = { total: 0, completed: 0 }
    }

    // Group logs by date
    const logsByDate: Record<string, any[]> = {}
    for (const log of logs) {
      if (!logsByDate[log.date]) {
        logsByDate[log.date] = []
      }
      logsByDate[log.date].push(log)
    }

    // Calculate completion for each day
    for (const date of last30Days) {
      const dayLogs = logsByDate[date] || []
      for (const log of dayLogs) {
        const goal = goals.find(g => g._id.toString() === log.goalId.toString())
        if (goal) {
          dailyStats[date].total++
          if (log.achievedValue >= goal.targetValue) {
            dailyStats[date].completed++
          }
        }
      }
    }

    // Find best and worst days
    let bestDay = { date: '', completion: 0 }
    let worstDay = { date: '', completion: 100 }

    for (const [date, stats] of Object.entries(dailyStats)) {
      const completion = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
      if (completion > bestDay.completion) {
        bestDay = { date, completion }
      }
      if (completion < worstDay.completion && stats.total > 0) {
        worstDay = { date, completion }
      }
    }

    // Weekly summary
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd')
    const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd')
    const weekLogs = logs.filter(log => log.date >= weekStart && log.date <= weekEnd)
    
    // Monthly summary
    const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
    const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')
    const monthLogs = logs.filter(log => log.date >= monthStart && log.date <= monthEnd)

    return NextResponse.json({
      dailyStats,
      bestDay,
      worstDay,
      weeklyTotal: weekLogs.length,
      monthlyTotal: monthLogs.length,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
