'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Play, Pause, RotateCcw, Bot, Zap, Eye, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import the 3D simulation component to avoid SSR issues
const FieldSimulation = dynamic(() => import('@/components/simulation/FieldSimulation'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading 3D Simulation...</p>
      </div>
    </div>
  )
})

interface ScanResult {
  position: { x: number; z: number }
  status: 'HEALTHY' | 'DEFECTIVE'
  cropType: string
  disease: string
  imageUrl?: string
}

export default function SimulationPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [botPosition, setBotPosition] = useState({ x: 0, z: 0 })

  const handleScan = (result: ScanResult) => {
    setCurrentScan(result)
    setScanResults(prev => [...prev, result])
  }

  const handlePositionUpdate = (position: { x: number; z: number }) => {
    setBotPosition(position)
  }

  const resetSimulation = () => {
    setScanResults([])
    setCurrentScan(null)
    setIsPlaying(true)
  }

  const proceedToChat = () => {
    if (currentScan) {
      // Save scan data to localStorage for the chatbot
      localStorage.setItem('agrotwin-current-scan', JSON.stringify(currentScan))
      window.location.href = '/chatbot'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/configuration">
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Configuration
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              3D Field Simulation
            </h1>
            <p className="text-gray-300 mt-2">Navigate the field and scan crops for analysis</p>
          </motion.div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstructions(true)}
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Bot Position</CardTitle>
              <Bot className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-400">
                X: {Math.round(botPosition.x)}, Z: {Math.round(botPosition.z)}
              </div>
              <p className="text-xs text-gray-400">current coordinates</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Crops Scanned</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{scanResults.length}</div>
              <p className="text-xs text-gray-400">total scans performed</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Healthy Crops</CardTitle>
              <div className="h-4 w-4 text-green-400">🌱</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {scanResults.filter(r => r.status === 'HEALTHY').length}
              </div>
              <p className="text-xs text-gray-400">identified as healthy</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Defective Crops</CardTitle>
              <div className="h-4 w-4 text-red-400">🦠</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {scanResults.filter(r => r.status === 'DEFECTIVE').length}
              </div>
              <p className="text-xs text-gray-400">require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Simulation */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Field Simulation</CardTitle>
                <CardDescription className="text-gray-300">
                  Use WASD or Arrow Keys to move • Press SPACE to scan nearby crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <FieldSimulation
                    isPlaying={isPlaying}
                    onScan={handleScan}
                    onPositionUpdate={handlePositionUpdate}
                  />
                  
                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-gray-300 space-y-1">
                      <div><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">W</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">↑</kbd> Move Forward</div>
                      <div><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">S</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">↓</kbd> Move Backward</div>
                      <div><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">A</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">←</kbd> Move Left</div>
                      <div><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">D</kbd> / <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">→</kbd> Move Right</div>
                      <div><kbd className="px-2 py-1 bg-gray-700 rounded text-xs">SPACE</kbd> Scan Crop</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Current Scan Result */}
            {currentScan && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Latest Scan Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status:</span>
                    <Badge variant={currentScan.status === 'HEALTHY' ? 'default' : 'destructive'}>
                      {currentScan.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Crop Type:</span>
                      <span className="text-white">{currentScan.cropType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Disease:</span>
                      <span className="text-white">{currentScan.disease}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Position:</span>
                      <span className="text-white">
                        X: {Math.round(currentScan.position.x)}, Z: {Math.round(currentScan.position.z)}
                      </span>
                    </div>
                  </div>

                  {currentScan.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={currentScan.imageUrl}
                        alt="Scanned crop"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <Button
                    onClick={proceedToChat}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Consult AI Expert
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Scan History */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Scan History</CardTitle>
                <CardDescription className="text-gray-300">
                  Recent crop analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {scanResults.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No scans yet</p>
                  ) : (
                    [...scanResults].reverse().map((result, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge
                            variant={result.status === 'HEALTHY' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {result.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            X: {Math.round(result.position.x)}, Z: {Math.round(result.position.z)}
                          </span>
                        </div>
                        <div className="text-sm text-white">{result.cropType}</div>
                        <div className="text-xs text-gray-400">{result.disease}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">How to Use the Simulation</DialogTitle>
            <DialogDescription className="text-gray-300">
              Learn how to navigate the field and scan crops
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Navigation:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Use <kbd className="px-2 py-1 bg-gray-700 rounded">WASD</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded">Arrow Keys</kbd> to move the bot</li>
                <li>• The bot will glow when near a scannable crop</li>
                <li>• Press <kbd className="px-2 py-1 bg-gray-700 rounded">SPACE</kbd> to scan the crop</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Scanning:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Healthy crops appear as green plants</li>
                <li>• Defective crops appear as red plants when scanned</li>
                <li>• Each scan provides detailed analysis</li>
                <li>• Consult the AI expert for treatment recommendations</li>
              </ul>
            </div>
            
            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}