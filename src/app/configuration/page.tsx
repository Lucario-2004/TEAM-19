'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wheat, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface GridCell {
  row: number
  col: number
  isInfected: boolean
}

const GRID_SIZE = 10
const MAX_SELECTIONS = 15

export default function ConfigurationPage() {
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [selectedCount, setSelectedCount] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Initialize grid
    const initialGrid: GridCell[][] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowCells: GridCell[] = []
      for (let col = 0; col < GRID_SIZE; col++) {
        rowCells.push({ row, col, isInfected: false })
      }
      initialGrid.push(rowCells)
    }
    setGrid(initialGrid)
  }, [])

  const toggleCell = (row: number, col: number) => {
    if (isSaved) return
    
    setGrid(prevGrid => {
      const newGrid = [...prevGrid]
      const cell = { ...newGrid[row][col] }
      
      if (cell.isInfected) {
        // Deselect if already infected
        cell.isInfected = false
        setSelectedCount(prev => prev - 1)
      } else if (selectedCount < MAX_SELECTIONS) {
        // Select if under limit
        cell.isInfected = true
        setSelectedCount(prev => prev + 1)
      }
      
      newGrid[row][col] = cell
      return newGrid
    })
  }

  const saveConfiguration = () => {
    if (selectedCount !== MAX_SELECTIONS) {
      alert(`Please select exactly ${MAX_SELECTIONS} spots to infect.`)
      return
    }

    // Save configuration to localStorage
    const infectedSpots = grid
      .flat()
      .filter(cell => cell.isInfected)
      .map(cell => ({ row: cell.row, col: cell.col }))

    const config = {
      gridSize: GRID_SIZE,
      defectiveSpots: infectedSpots,
      timestamp: new Date().toISOString()
    }

    localStorage.setItem('agrotwin-field-config', JSON.stringify(config))
    setIsSaved(true)
    
    // Auto-redirect to simulation after 2 seconds
    setTimeout(() => {
      window.location.href = '/simulation'
    }, 2000)
  }

  const resetConfiguration = () => {
    setGrid(prevGrid => 
      prevGrid.map(row => 
        row.map(cell => ({ ...cell, isInfected: false }))
      )
    )
    setSelectedCount(0)
    setIsSaved(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Field Configuration
            </h1>
            <p className="text-gray-300 mt-2">Set up infected spots for the simulation</p>
          </motion.div>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Selected Spots</CardTitle>
              <Wheat className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{selectedCount}</div>
              <p className="text-xs text-gray-400">out of {MAX_SELECTIONS} required</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Grid Size</CardTitle>
              <div className="h-4 w-4 text-blue-400">📐</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{GRID_SIZE}x{GRID_SIZE}</div>
              <p className="text-xs text-gray-400">total field area</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Status</CardTitle>
              {selectedCount === MAX_SELECTIONS ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${selectedCount === MAX_SELECTIONS ? 'text-green-400' : 'text-yellow-400'}`}>
                {selectedCount === MAX_SELECTIONS ? 'Ready' : 'In Progress'}
              </div>
              <p className="text-xs text-gray-400">
                {selectedCount === MAX_SELECTIONS ? 'Configuration complete' : `${MAX_SELECTIONS - selectedCount} more needed`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Alert className="mb-8 bg-blue-900/20 border-blue-500">
          <AlertTriangle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            Click on the grid cells to select {MAX_SELECTIONS} spots that will be infected in the simulation. 
            These spots will represent areas with crop diseases that need to be identified and treated.
          </AlertDescription>
        </Alert>

        {/* Interactive Grid */}
        <div className="flex justify-center mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 p-6">
            <CardHeader>
              <CardTitle className="text-center text-white">Field Grid Configuration</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Click cells to toggle infection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-1 w-fit mx-auto">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCell(rowIndex, colIndex)}
                      disabled={isSaved}
                      className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                        cell.isInfected
                          ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/50'
                          : 'bg-green-500 border-green-400 hover:bg-green-400'
                      } ${isSaved ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {cell.isInfected && (
                        <span className="text-white font-bold text-lg">🦠</span>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-400"></div>
            <span className="text-gray-300">Healthy Crop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded border-2 border-red-400"></div>
            <span className="text-gray-300">Infected Crop</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={resetConfiguration}
            variant="outline"
            className="border-gray-500 text-gray-300 hover:bg-gray-700"
            disabled={isSaved}
          >
            Reset Grid
          </Button>
          
          <Button
            onClick={saveConfiguration}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
            disabled={selectedCount !== MAX_SELECTIONS || isSaved}
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved! Redirecting...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{selectedCount}/{MAX_SELECTIONS}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(selectedCount / MAX_SELECTIONS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}