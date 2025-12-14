'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Send, Bot, User, Brain, Zap, Leaf } from 'lucide-react'
import Link from 'next/link'
import ChatInterface from '@/components/chatbot/ChatInterface'

interface ScanData {
  position: { x: number; z: number }
  status: 'HEALTHY' | 'DEFECTIVE'
  cropType: string
  disease: string
  imageUrl?: string
}

export default function ChatbotPage() {
  const [scanData, setScanData] = useState<ScanData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load scan data from localStorage
    const savedScanData = localStorage.getItem('agrotwin-current-scan')
    if (savedScanData) {
      setScanData(JSON.parse(savedScanData))
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading AI Expert...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/simulation">
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Simulation
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AI Agricultural Expert
            </h1>
            <p className="text-gray-300 mt-2">CAG-Powered Crop Analysis & Recommendations</p>
          </motion.div>
          
          <div className="w-32"></div> {/* Spacer for alignment */}
        </div>

        {/* Context Information */}
        {scanData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Crop Status</CardTitle>
                <Leaf className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={scanData.status === 'HEALTHY' ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {scanData.status}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Crop Type</CardTitle>
                <Brain className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-400">{scanData.cropType}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Condition</CardTitle>
                <Zap className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-yellow-400">{scanData.disease}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">AI System</CardTitle>
                <Bot className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-purple-400">CAG Active</div>
                <p className="text-xs text-gray-400">Learning Enabled</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 h-[600px]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-400" />
                  AGRO-TWIN AI Expert
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Ask questions about crop management, treatment options, and agricultural best practices
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[520px] p-0">
                <ChatInterface scanData={scanData} />
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* AI Capabilities */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white text-sm">CAG Architecture</div>
                    <div className="text-xs text-gray-400">Continuous context awareness</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white text-sm">Regression Learning</div>
                    <div className="text-xs text-gray-400">Adapts to your queries</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white text-sm">Expert Knowledge</div>
                    <div className="text-xs text-gray-400">Agricultural best practices</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  onClick={() => {
                    const event = new CustomEvent('quick-question', { 
                      detail: 'What is the recommended treatment for this condition?' 
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  Get Treatment Advice
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                  onClick={() => {
                    const event = new CustomEvent('quick-question', { 
                      detail: 'What preventive measures should I take?' 
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  Prevention Tips
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                  onClick={() => {
                    const event = new CustomEvent('quick-question', { 
                      detail: 'What are the best practices for crop management?' 
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  Best Practices
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                  onClick={() => {
                    const event = new CustomEvent('quick-question', { 
                      detail: 'Can you explain the disease lifecycle and spread patterns?' 
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  Disease Analysis
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">AI Model</span>
                  <Badge className="bg-green-500">Gemini 2.5 Pro</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Learning</span>
                  <Badge className="bg-blue-500">Active</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Context</span>
                  <Badge className="bg-purple-500">Loaded</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">NLP Engine</span>
                  <Badge className="bg-yellow-500">Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}