'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Leaf, Sprout, Tractor, Bot, Zap, Shield } from 'lucide-react'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Digital Twin Technology",
      description: "Create virtual replicas of agricultural fields for precise monitoring and analysis."
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced CAG (Continuous Augmented Generation) with regression learning for intelligent insights."
    },
    {
      icon: <Tractor className="w-8 h-8" />,
      title: "3D Field Simulation",
      description: "Interactive 3D environment with real-time crop scanning and disease detection."
    },
    {
      icon: <Sprout className="w-8 h-8" />,
      title: "Smart Configuration",
      description: "Intuitive grid-based setup for customizing field conditions and scenarios."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Instant analysis and recommendations for optimal crop management."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Expert Consultation",
      description: "AI-powered agricultural expert chatbot with adaptive learning capabilities."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <Sprout className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            AGRO-TWIN
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto"
          >
            Revolutionary Agricultural Digital Twin Platform with AI-Powered Analysis and Real-time Field Monitoring
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              onClick={() => window.location.href = '/configuration'}
            >
              Start Simulation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-200"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-green-500 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="text-green-400 mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Powered by Advanced Technology</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['CAG Architecture', 'Regression Learning', '3D Simulation', 'NLP Processing', 'Real-time Analytics', 'AI Expert System'].map((tech, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-green-500 text-green-400 px-4 py-2 text-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="relative z-10 text-center py-8 border-t border-gray-800"
      >
        <p className="text-gray-400">
          © 2024 AGRO-TWIN. Revolutionizing Agriculture with Digital Twin Technology.
        </p>
      </motion.footer>
    </div>
  )
}