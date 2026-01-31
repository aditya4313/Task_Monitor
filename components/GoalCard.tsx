'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Target, TrendingUp, Flame, Zap, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface Goal {
  _id: string
  title: string
  description: string
  targetValue: number
  unit: string
}

interface GoalCardProps {
  goal: Goal
  onLogProgress: () => void
  onDelete: () => void
  index: number
}

export default function GoalCard({ goal, onLogProgress, onDelete, index }: GoalCardProps) {
  const [todayLog, setTodayLog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  })

  useEffect(() => {
    loadTodayLog()
    // Refresh every 2 seconds to get live updates
    const interval = setInterval(loadTodayLog, 2000)
    return () => clearInterval(interval)
  }, [goal._id])

  const loadTodayLog = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const res = await fetch(`/api/logs?goalId=${goal._id}&startDate=${today}&endDate=${today}`)
      const data = await res.json()
      
      if (data.logs && data.logs.length > 0) {
        setTodayLog(data.logs[0])
      }
    } catch (error) {
      console.error('Error loading today log:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = (e.clientX - centerX) / (rect.width / 2)
    const mouseY = (e.clientY - centerY) / (rect.height / 2)
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const achievedValue = todayLog?.achievedValue || 0
  const progress = Math.min((achievedValue / goal.targetValue) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const isCompleted = achievedValue >= goal.targetValue
  const isOverachieved = achievedValue >= goal.targetValue * 1.5

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.03, z: 50 }}
      className={`glass-3d rounded-3xl p-6 relative overflow-hidden group ${
        isOverachieved ? 'neon-glow-green pulse-glow' : isCompleted ? 'neon-glow-blue' : ''
      }`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 gradient-mesh opacity-50"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />

      {/* Floating particles for overachievers */}
      {isOverachieved && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0,
              }}
              animate={{
                y: [null, '-100%'],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* 3D Icon */}
      <motion.div
        style={{ transform: 'translateZ(20px)' }}
        className="absolute top-4 right-4 flex items-center gap-2"
      >
        {isOverachieved && (
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            className="text-3xl"
          >
            🔥
          </motion.div>
        )}
        {isCompleted && !isOverachieved && (
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
            }}
            className="text-2xl"
          >
            ✨
          </motion.div>
        )}
        {/* Delete Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('Are you sure you want to delete this goal?')) {
              onDelete()
            }
          }}
          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all backdrop-blur-sm"
          title="Delete Goal"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </motion.div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <motion.h3 
              style={{ transform: 'translateZ(30px)' }}
              className="text-xl font-bold mb-2 flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Target className="w-5 h-5 text-purple-400" />
              </motion.div>
              {goal.title}
            </motion.h3>
            {goal.description && (
              <p className="text-gray-400 text-sm mb-4">{goal.description}</p>
            )}
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 progress-ring">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="45"
                stroke={isOverachieved ? '#10ff88' : isCompleted ? '#10b3ff' : '#a855f7'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="progress-ring-circle"
                style={{
                  filter: isOverachieved 
                    ? 'drop-shadow(0 0 10px #10ff88)' 
                    : isCompleted 
                    ? 'drop-shadow(0 0 10px #10b3ff)' 
                    : 'drop-shadow(0 0 10px #a855f7)',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className={`text-2xl font-bold ${
                  isOverachieved ? 'text-green-400' : isCompleted ? 'text-blue-400' : 'text-purple-400'
                }`}
              >
                {progress.toFixed(0)}%
              </motion.span>
            </div>
          </div>
        </div>

        {/* Progress Bar (backup) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              {achievedValue.toFixed(1)} / {goal.targetValue} {goal.unit}
            </span>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className={`text-sm font-bold ${
                isOverachieved ? 'text-green-400' : isCompleted ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {progress.toFixed(0)}%
            </motion.span>
          </div>
          <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full relative ${
                isOverachieved
                  ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
                  : isCompleted
                  ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600'
              }`}
            >
              <motion.div
                className="absolute inset-0 shimmer"
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </div>

        {isOverachieved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            className="mb-4 text-center"
          >
            <motion.span
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(255, 215, 0, 0.5)',
                  '0 0 20px rgba(255, 215, 0, 0.8)',
                  '0 0 10px rgba(255, 215, 0, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-yellow-400 font-bold flex items-center justify-center gap-2 text-lg"
            >
              <Flame className="w-5 h-5" />
              OVERACHIEVER! 🔥
            </motion.span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)',
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogProgress}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold relative overflow-hidden group/btn"
          style={{ backgroundSize: '200% 200%' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ backgroundSize: '200% 200%' }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isCompleted ? (
              <>
                <Zap className="w-4 h-4" />
                Update Progress
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Log Progress
              </>
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}
