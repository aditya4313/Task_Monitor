'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Plus, Trophy, Flame } from 'lucide-react'
import GoalCard from '@/components/GoalCard'
import CalendarHeatmap from '@/components/CalendarHeatmap'
import RewardsSection from '@/components/RewardsSection'
import CreateGoalModal from '@/components/CreateGoalModal'
import LogProgressModal from '@/components/LogProgressModal'

interface User {
  id: string
  name: string
  email: string
  currentStreak: number
  longestStreak: number
  unlockedRewards: string[]
}

interface Goal {
  _id: string
  title: string
  description: string
  targetValue: number
  unit: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadData()
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const loadData = async () => {
    try {
      const [userRes, goalsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/goals'),
      ])

      if (!userRes.ok) {
        router.push('/')
        return
      }

      const userData = await userRes.json()
      setUser(userData.user)

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json()
        setGoals(goalsData.goals)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const handleLogProgress = (goal: Goal) => {
    setSelectedGoal(goal)
    setShowLogModal(true)
  }

  const handleGoalCreated = () => {
    setShowCreateModal(false)
    // Live update - reload data immediately and refresh calendar
    loadData()
    setRefreshKey(prev => prev + 1)
  }

  const handleProgressLogged = () => {
    setShowLogModal(false)
    setSelectedGoal(null)
    // Live update - reload data immediately and refresh calendar
    loadData()
    setRefreshKey(prev => prev + 1)
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        // Live update - remove from state immediately and refresh calendar
        setGoals(goals.filter(g => g._id !== goalId))
        setRefreshKey(prev => prev + 1)
      } else {
        alert('Failed to delete goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      alert('Error deleting goal')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            animate={{
              y: [null, Math.random() * windowSize.height],
              x: [null, Math.random() * windowSize.width],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Gradient mesh overlay */}
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none z-0" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong border-b border-white/10 p-4 relative z-10 backdrop-blur-xl"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
            >
              Welcome back, {user.name}! 👋
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mt-2"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 text-yellow-400 glass rounded-lg px-3 py-1.5"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Flame className="w-5 h-5" />
                </motion.div>
                <span className="font-bold">{user.currentStreak} day streak</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-gray-400 glass rounded-lg px-3 py-1.5"
              >
                Best: <span className="text-purple-400 font-bold">{user.longestStreak}</span> days
              </motion.div>
            </motion.div>
          </div>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 5px 20px rgba(239, 68, 68, 0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-all flex items-center gap-2 glass backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Goals Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
            >
              Your Goals
            </motion.h2>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 40px rgba(255, 16, 240, 0.4)',
                rotate: [0, 5, -5, 0],
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold flex items-center gap-2 neon-glow-pink relative overflow-hidden group"
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
              <motion.span
                className="relative z-10 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Plus className="w-5 h-5" />
                New Goal
              </motion.span>
            </motion.button>
          </div>

          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No goals yet. Create your first goal to get started!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all"
              >
                Create Goal
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onLogProgress={() => handleLogProgress(goal)}
                  onDelete={() => handleDeleteGoal(goal._id)}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Calendar Heatmap */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
          >
            Progress Calendar
          </motion.h2>
          <CalendarHeatmap key={refreshKey} />
        </motion.section>

        {/* Rewards Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
          >
            Your Rewards
          </motion.h2>
          <RewardsSection unlockedRewards={user.unlockedRewards} />
        </motion.section>
      </div>

      {showCreateModal && (
        <CreateGoalModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGoalCreated}
        />
      )}

      {showLogModal && selectedGoal && (
        <LogProgressModal
          goal={selectedGoal}
          onClose={() => {
            setShowLogModal(false)
            setSelectedGoal(null)
          }}
          onSuccess={handleProgressLogged}
        />
      )}
    </div>
  )
}
