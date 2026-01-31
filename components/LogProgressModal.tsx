'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import Confetti from 'react-confetti'
import { REWARDS } from '@/lib/models'

interface Goal {
  _id: string
  title: string
  targetValue: number
  unit: string
}

interface LogProgressModalProps {
  goal: Goal
  onClose: () => void
  onSuccess: () => void
}

export default function LogProgressModal({ goal, onSuccess, onClose }: LogProgressModalProps) {
  const [achievedValue, setAchievedValue] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newlyUnlocked, setNewlyUnlocked] = useState<any[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    loadTodayLog()
  }, [goal._id, date])

  const loadTodayLog = async () => {
    try {
      const res = await fetch(`/api/logs?goalId=${goal._id}&startDate=${date}&endDate=${date}`)
      const data = await res.json()
      
      if (data.logs && data.logs.length > 0) {
        setAchievedValue(data.logs[0].achievedValue.toString())
      }
    } catch (error) {
      console.error('Error loading log:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: goal._id,
          date,
          achievedValue: Number(achievedValue),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to log progress')
        setLoading(false)
        return
      }

      // Check for newly unlocked rewards
      if (data.newlyUnlockedRewards && data.newlyUnlockedRewards.length > 0) {
        setNewlyUnlocked(data.newlyUnlockedRewards)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }

      // Check if goal was completed or overachieved
      const isOverachieved = Number(achievedValue) >= goal.targetValue * 1.5
      const isCompleted = Number(achievedValue) >= goal.targetValue

      if (isOverachieved || isCompleted) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      setTimeout(() => {
        onSuccess()
      }, newlyUnlocked.length > 0 ? 2000 : 500)
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const progress = achievedValue ? (Number(achievedValue) / goal.targetValue) * 100 : 0
  const isOverachieved = Number(achievedValue) >= goal.targetValue * 1.5
  const isCompleted = Number(achievedValue) >= goal.targetValue

  return (
    <>
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Log Progress</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{goal.title}</h3>
              <p className="text-gray-400 text-sm">
                Target: {goal.targetValue} {goal.unit}
              </p>
            </div>

            {newlyUnlocked.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">Reward Unlocked!</span>
                </div>
                {newlyUnlocked.map((reward) => (
                  <div key={reward.id} className="text-sm text-white">
                    {reward.icon} {reward.name} - {reward.description}
                  </div>
                ))}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Achieved ({goal.unit})
                </label>
                <input
                  type="number"
                  value={achievedValue}
                  onChange={(e) => setAchievedValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              {achievedValue && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className={`font-bold ${
                      isOverachieved ? 'text-green-400' : isCompleted ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {Math.min(progress, 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        isOverachieved
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : isCompleted
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    />
                  </div>
                  {isOverachieved && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-green-400 font-bold text-sm text-center"
                    >
                      🔥 OVERACHIEVER! 🔥
                    </motion.p>
                  )}
                  {isCompleted && !isOverachieved && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-blue-400 font-bold text-sm text-center"
                    >
                      ✨ Goal Completed! ✨
                    </motion.p>
                  )}
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold neon-glow-pink disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Save Progress'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
