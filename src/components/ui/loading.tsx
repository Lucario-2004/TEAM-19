'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wheat, Bot, Zap, Leaf, Loader2 } from 'lucide-react'

interface LoadingScreenProps {
  message: string
  onComplete?: () => void
}

export function LoadingScreen({ message, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-4"
          >
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <Wheat className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2">AGRO-TWIN</h2>
          <p className="text-gray-300">{message}</p>
        </div>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Loading Progress</span>
              <span className="text-sm text-green-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 text-gray-400">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Leaf className="w-6 h-6" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            <Bot className="w-6 h-6" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          >
            <Zap className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}