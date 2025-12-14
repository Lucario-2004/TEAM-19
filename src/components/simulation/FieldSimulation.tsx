'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface FieldSimulationProps {
  isPlaying: boolean
  onScan: (result: any) => void
  onPositionUpdate: (position: { x: number; z: number }) => void
}

interface CropData {
  position: [number, number, number]
  isDefective: boolean
  cropType: string
  disease: string
  isScanned: boolean
}

// Bot component with neon blue glow
function Bot({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Neon blue bot */}
      <Box ref={meshRef} args={[1, 1, 1]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {/* Glow light */}
      <pointLight
        ref={lightRef}
        color="#00d4ff"
        intensity={1}
        distance={10}
        decay={2}
      />
      
      {/* Antenna */}
      <Box position={[0, 1, 0]} args={[0.1, 0.5, 0.1]}>
        <meshStandardMaterial color="#00d4ff" />
      </Box>
      
      {/* Antenna tip */}
      <Sphere position={[0, 1.3, 0]} args={[0.15]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </group>
  )
}

// Crop component with neon green glow
function Crop({ 
  data, 
  isNearBot, 
  onScan 
}: { 
  data: CropData
  isNearBot: boolean
  onScan: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isScanning, setIsScanning] = useState(false)

  useFrame((state) => {
    if (meshRef.current && !data.isScanned) {
      // Gentle swaying animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + data.position[0]) * 0.05
    }
  })

  const handleClick = () => {
    console.log('Crop clicked, isNearBot:', isNearBot, 'isScanned:', data.isScanned)
    if (isNearBot && !data.isScanned) {
      console.log('Starting scan...')
      setIsScanning(true)
      setTimeout(() => {
        onScan()
        setIsScanning(false)
      }, 500)
    }
  }

  const color = data.isScanned 
    ? (data.isDefective ? '#ff4444' : '#44ff44')
    : (isNearBot ? '#44ff44' : '#00ff00')

  return (
    <group position={data.position}>
      {/* Crop stem */}
      <Box 
        ref={meshRef} 
        args={[0.2, 2, 0.2]} 
        onClick={handleClick}
        onPointerOver={() => {
          if (isNearBot && !data.isScanned) {
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isNearBot ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </Box>
      
      {/* Crop foliage */}
      <Sphere 
        position={[0, 1.2, 0]} 
        args={[0.6]} 
        onClick={handleClick}
        onPointerOver={() => {
          if (isNearBot && !data.isScanned) {
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isNearBot ? 0.5 : 0.2}
          metalness={0.2}
          roughness={0.8}
        />
      </Sphere>
      
      {/* Scanning effect */}
      {isScanning && (
        <Sphere args={[2]} scale={[1, 1, 1]}>
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
        </Sphere>
      )}
      
      {/* Interaction prompt */}
      {isNearBot && !data.isScanned && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.3}
          color="#00d4ff"
          anchorX="center"
          anchorY="middle"
        >
          [SPACE] to scan
        </Text>
      )}
    </group>
  )
}

// Ground plane with grid
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.1}
        roughness={0.9}
      />
    </mesh>
  )
}

// Main simulation scene
function SimulationScene({ 
  botPosition, 
  crops, 
  onCropScan 
}: { 
  botPosition: [number, number, number]
  crops: CropData[]
  onCropScan: (crop: CropData) => void
}) {
  const { camera } = useThree()

  // Update camera to follow bot
  useFrame(() => {
    camera.position.set(botPosition[0], 15, botPosition[2] + 20)
    camera.lookAt(botPosition[0], 0, botPosition[2])
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      
      {/* Ground */}
      <Ground />
      
      {/* Grid lines */}
      {Array.from({ length: 21 }, (_, i) => (
        <group key={i}>
          {/* Horizontal lines */}
          <Box
            position={[0, 0, (i - 10) * 5]}
            args={[100, 0.05, 0.05]}
          >
            <meshBasicMaterial color="#333333" />
          </Box>
          {/* Vertical lines */}
          <Box
            position={[(i - 10) * 5, 0, 0]}
            args={[0.05, 0.05, 100]}
          >
            <meshBasicMaterial color="#333333" />
          </Box>
        </group>
      ))}
      
      {/* Bot */}
      <Bot position={botPosition} />
      
      {/* Crops */}
      {crops.map((crop, index) => {
        const distance = Math.sqrt(
          Math.pow(botPosition[0] - crop.position[0], 2) +
          Math.pow(botPosition[2] - crop.position[2], 2)
        )
        const isNearBot = distance < 3
        
        return (
          <Crop
            key={index}
            data={crop}
            isNearBot={isNearBot}
            onScan={() => onCropScan(crop)}
          />
        )
      })}
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a0a', 30, 100]} />
    </>
  )
}

export default function FieldSimulation({ isPlaying, onScan, onPositionUpdate }: FieldSimulationProps) {
  const [botPosition, setBotPosition] = useState<[number, number, number]>([0, 1, 0])
  const [crops, setCrops] = useState<CropData[]>([])
  const keysPressed = useRef<Set<string>>(new Set())

  // Initialize field configuration
  useEffect(() => {
    const loadConfiguration = () => {
      const config = localStorage.getItem('agrotwin-field-config')
      if (!config) return

      const { defectiveSpots } = JSON.parse(config)
      const newCrops: CropData[] = []

      // Generate crops in a 10x10 grid
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const x = (col - 4.5) * 10
          const z = (row - 4.5) * 10
          const isDefective = defectiveSpots.some(spot => spot.row === row && spot.col === col)
          
          // Generate crop type and disease based on configuration
          const cropTypes = ['Wheat', 'Corn', 'Rice', 'Soybean']
          const diseases = isDefective 
            ? ['Rust', 'Blight', 'Mildew', 'Wilt', 'Rot']
            : ['None (Healthy)']
          
          newCrops.push({
            position: [x, 0, z],
            isDefective,
            cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
            disease: diseases[Math.floor(Math.random() * diseases.length)],
            isScanned: false
          })
        }
      }

      setCrops(newCrops)
    }

    loadConfiguration()
  }, [])

  // Handle keyboard input
  useEffect(() => {
    if (!isPlaying) return

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key.toLowerCase())
      
      // Handle space bar for scanning
      if (event.key === ' ') {
        event.preventDefault()
        console.log('Space key pressed, attempting to scan...')
        scanNearbyCrop()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase())
    }

    // Add event listeners with higher priority
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    window.addEventListener('keyup', handleKeyUp, { capture: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('keyup', handleKeyUp, { capture: true })
    }
  }, [isPlaying, crops, botPosition]) // Add dependencies to ensure latest state

  // Update bot position based on keys pressed
  useEffect(() => {
    if (!isPlaying) return

    const moveSpeed = 0.3
    const interval = setInterval(() => {
      const keys = keysPressed.current
      let [x, y, z] = botPosition

      if (keys.has('w') || keys.has('arrowup')) z -= moveSpeed
      if (keys.has('s') || keys.has('arrowdown')) z += moveSpeed
      if (keys.has('a') || keys.has('arrowleft')) x -= moveSpeed
      if (keys.has('d') || keys.has('arrowright')) x += moveSpeed

      // Keep bot within bounds
      x = Math.max(-45, Math.min(45, x))
      z = Math.max(-45, Math.min(45, z))

      if (x !== botPosition[0] || z !== botPosition[2]) {
        setBotPosition([x, y, z])
        onPositionUpdate({ x, z })
      }
    }, 16) // ~60 FPS

    return () => clearInterval(interval)
  }, [isPlaying, botPosition, onPositionUpdate])

  const scanNearbyCrop = () => {
    console.log('Scanning for nearby crops...')
    console.log('Bot position:', botPosition)
    console.log('Available crops:', crops.length)
    
    const nearbyCrop = crops.find(crop => {
      if (crop.isScanned) {
        console.log(`Crop at ${crop.position} already scanned`)
        return false
      }
      
      const distance = Math.sqrt(
        Math.pow(botPosition[0] - crop.position[0], 2) +
        Math.pow(botPosition[2] - crop.position[2], 2)
      )
      
      console.log(`Distance to crop at ${crop.position}: ${distance}`)
      
      return distance < 5 // Increased detection range
    })

    if (nearbyCrop) {
      console.log('Found nearby crop:', nearbyCrop)
      
      // Update crop as scanned
      setCrops(prev => prev.map(crop => 
        crop === nearbyCrop ? { ...crop, isScanned: true } : crop
      ))

      // Generate scan result
      const scanResult = {
        position: { x: nearbyCrop.position[0], z: nearbyCrop.position[2] },
        status: nearbyCrop.isDefective ? 'DEFECTIVE' as const : 'HEALTHY' as const,
        cropType: nearbyCrop.cropType,
        disease: nearbyCrop.disease,
        imageUrl: nearbyCrop.isDefective 
          ? `/images/unhealthy-crops/${nearbyCrop.cropType.toLowerCase()}-${nearbyCrop.disease.toLowerCase().replace(' ', '_')}.jpg`
          : `/images/healthy-crops/${nearbyCrop.cropType.toLowerCase()}-healthy.jpg`
      }

      console.log('Generated scan result:', scanResult)
      onScan(scanResult)
    } else {
      console.log('No nearby crops found for scanning')
    }
  }

  const handleCropScan = (crop: CropData) => {
    setCrops(prev => prev.map(c => 
      c === crop ? { ...c, isScanned: true } : c
    ))

    const scanResult = {
      position: { x: crop.position[0], z: crop.position[2] },
      status: crop.isDefective ? 'DEFECTIVE' as const : 'HEALTHY' as const,
      cropType: crop.cropType,
      disease: crop.disease,
      imageUrl: crop.isDefective 
        ? `/images/unhealthy-crops/${crop.cropType.toLowerCase()}-${crop.disease.toLowerCase()}.jpg`
        : `/images/healthy-crops/${crop.cropType.toLowerCase()}-healthy.jpg`
    }

    onScan(scanResult)
  }

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 15, 20], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)' }}
      >
        <SimulationScene
          botPosition={botPosition}
          crops={crops}
          onCropScan={handleCropScan}
        />
      </Canvas>
    </div>
  )
}