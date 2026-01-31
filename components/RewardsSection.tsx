'use client'

import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { REWARDS } from '@/lib/models'
import { Lock, Sparkles } from 'lucide-react'

interface RewardsSectionProps {
  unlockedRewards: string[]
}

export default function RewardsSection({ unlockedRewards }: RewardsSectionProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-orange-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return ''
      case 'rare': return 'neon-glow-blue'
      case 'epic': return 'neon-glow'
      case 'legendary': return 'neon-glow-pink pulse-glow'
      default: return ''
    }
  }

  return (
    <div className="glass-3d rounded-3xl p-6 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 gradient-mesh opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {REWARDS.map((reward, index) => {
          const isUnlocked = unlockedRewards.includes(reward.id)
          
          return (
            <RewardCard
              key={reward.id}
              reward={reward}
              isUnlocked={isUnlocked}
              index={index}
              rarityColor={getRarityColor(reward.rarity)}
              rarityGlow={getRarityGlow(reward.rarity)}
            />
          )
        })}
      </div>
    </div>
  )
}

function RewardCard({ 
  reward, 
  isUnlocked, 
  index, 
  rarityColor, 
  rarityGlow 
}: {
  reward: any
  isUnlocked: boolean
  index: number
  rarityColor: string
  rarityGlow: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.1, z: 50 }}
      className={`relative rounded-2xl p-4 text-center cursor-pointer ${
        isUnlocked
          ? `bg-gradient-to-br ${rarityColor} ${rarityGlow}`
          : 'bg-gray-800/50 glass'
      }`}
    >
      {!isUnlocked && (
        <motion.div
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center backdrop-blur-md"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Lock className="w-8 h-8 text-gray-500" />
          </motion.div>
        </motion.div>
      )}
      
      <motion.div
        style={{ transform: 'translateZ(20px)' }}
        className="text-5xl mb-3"
        animate={isUnlocked ? {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isUnlocked ? reward.icon : '❓'}
      </motion.div>
      
      <motion.div
        style={{ transform: 'translateZ(30px)' }}
        className={`text-sm font-bold mb-1 ${
          isUnlocked ? 'text-white' : 'text-gray-500'
        }`}
      >
        {isUnlocked ? reward.name : '???'}
      </motion.div>
      
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ transform: 'translateZ(30px)' }}
          className="text-xs text-white/90"
        >
          {reward.description}
        </motion.div>
      )}
      
      {isUnlocked && (
        <>
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </motion.div>
          
          {/* Particle effects for legendary */}
          {reward.rarity === 'legendary' && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 0,
                  }}
                  animate={{
                    x: ['50%', `${50 + (i - 1) * 30}%`],
                    y: ['50%', `${50 + (i - 1) * 30}%`],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </>
          )}
        </>
      )}
    </motion.div>
  )
}
