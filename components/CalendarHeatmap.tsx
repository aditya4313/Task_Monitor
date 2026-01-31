'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'

interface DailyStats {
  [date: string]: {
    total: number
    completed: number
  }
}

export default function CalendarHeatmap() {
  const [stats, setStats] = useState<DailyStats>({})
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    // Auto-refresh every 3 seconds for live updates
    const interval = setInterval(loadStats, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data.dailyStats || {})
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIntensity = (date: string): number => {
    const dayStats = stats[date]
    
    // No data at all
    if (!dayStats || dayStats.total === 0) return 0
    
    // Calculate completion percentage
    const completion = dayStats.completed / dayStats.total
    
    // All goals completed
    if (completion === 1 && dayStats.completed > 0) return 4 // Legendary
    // Some goals completed
    if (completion > 0.5) return 3 // Good
    // Few goals completed
    if (completion > 0) return 2 // Average
    // No goals completed but had activity
    return 1 // Poor
  }

  const getColor = (intensity: number): string => {
    switch (intensity) {
      case 0: return 'bg-gray-800' // No data
      case 1: return 'bg-red-500/30' // Poor
      case 2: return 'bg-yellow-500/50' // Average
      case 3: return 'bg-green-500/70' // Good
      case 4: return 'bg-purple-500 neon-glow' // Legendary
      default: return 'bg-gray-800'
    }
  }

  const getLabel = (intensity: number): string => {
    switch (intensity) {
      case 0: return 'No data'
      case 1: return '🔴 Poor day'
      case 2: return '🟡 Average day'
      case 3: return '🟢 Good day'
      case 4: return '🔥 Legendary day'
      default: return 'No data'
    }
  }

  // Generate last 30 days
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 29)
  const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today })

  // Group by weeks
  const weeks: Date[][] = []
  let currentWeek: Date[] = []
  
  days.forEach((day, index) => {
    if (index % 7 === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
  })
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="glass-3d rounded-3xl p-6 overflow-x-auto relative">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 gradient-mesh opacity-20 rounded-3xl"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      
      <div className="flex gap-1 min-w-max relative z-10">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const intensity = getIntensity(dateStr)
              const isHovered = hoveredDate === dateStr
              const dayStats = stats[dateStr]

              return (
                <motion.div
                  key={dateStr}
                  initial={{ scale: 0.8, opacity: 0, rotateX: -90 }}
                  animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                  transition={{ 
                    delay: weekIndex * 0.05 + (day.getDate() % 7) * 0.01,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  whileHover={{ 
                    scale: 1.3, 
                    z: 50,
                    rotateY: [0, 5, -5, 0],
                    rotateX: [0, 5, -5, 0],
                  }}
                  onHoverStart={() => setHoveredDate(dateStr)}
                  onHoverEnd={() => setHoveredDate(null)}
                  className={`w-10 h-10 rounded-lg ${getColor(intensity)} cursor-pointer relative group transition-all duration-300 ${
                    intensity === 4 ? 'shadow-lg' : ''
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Glow effect for legendary days */}
                  {intensity === 4 && (
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 10px rgba(168, 85, 247, 0.5)',
                          '0 0 20px rgba(168, 85, 247, 0.8)',
                          '0 0 10px rgba(168, 85, 247, 0.5)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-lg"
                    />
                  )}
                  
                  {isHovered && dayStats && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      style={{ transform: 'translateZ(100px)' }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 pointer-events-none"
                    >
                      {/* Tooltip container with proper background */}
                      <div className="glass-strong rounded-xl p-4 whitespace-nowrap shadow-2xl backdrop-blur-xl bg-black/80 border border-white/20 relative">
                        {/* Arrow pointer */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                          <div className="w-3 h-3 bg-black/80 border-r border-b border-white/20 transform rotate-45"></div>
                        </div>
                        
                        <div className="text-sm font-bold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {format(day, 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-gray-200 font-semibold">
                          {getLabel(intensity)}
                        </div>
                        {dayStats.total > 0 && (
                          <div className="text-xs text-gray-300 mt-2 pt-2 border-t border-white/20">
                            {dayStats.completed}/{dayStats.total} goals completed
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-800" />
          <span>No data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/30" />
          <span>Poor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/50" />
          <span>Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/70" />
          <span>Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500 neon-glow" />
          <span>Legendary</span>
        </div>
      </div>
    </div>
  )
}
