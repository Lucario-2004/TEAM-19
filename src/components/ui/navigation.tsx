'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Home, Settings, Play, MessageSquare, ArrowLeft, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  className?: string
}

export default function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      description: 'Project Overview'
    },
    {
      href: '/configuration',
      label: 'Configuration',
      icon: Settings,
      description: 'Field Setup'
    },
    {
      href: '/simulation',
      label: 'Simulation',
      icon: Play,
      description: '3D Field Simulation'
    },
    {
      href: '/chatbot',
      label: 'AI Expert',
      icon: MessageSquare,
      description: 'Consult AI'
    }
  ]

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className={`fixed top-4 left-4 z-50 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMenu}
          className="bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-50 shadow-2xl"
            >
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">AGRO-TWIN</h2>
                  <p className="text-gray-400 text-sm">Agricultural Digital Twin Platform</p>
                </div>

                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link key={item.href} href={item.href} onClick={toggleMenu}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className={`mb-2 cursor-pointer transition-all duration-200 ${
                            isActive 
                              ? 'bg-green-600/20 border-green-500' 
                              : 'bg-gray-800/50 border-gray-700 hover:border-green-500 hover:bg-green-500/10'
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  isActive ? 'bg-green-500' : 'bg-gray-700'
                                }`}>
                                  <Icon className={`w-5 h-5 ${
                                    isActive ? 'text-white' : 'text-gray-300'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white">{item.label}</h3>
                                  <p className="text-xs text-gray-400">{item.description}</p>
                                </div>
                                {isActive && (
                                  <Badge className="bg-green-500 text-white">Active</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-semibold text-white mb-2">System Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">AI Engine</span>
                      <Badge className="bg-green-500 text-xs">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">3D Simulation</span>
                      <Badge className="bg-blue-500 text-xs">Ready</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Learning System</span>
                      <Badge className="bg-purple-500 text-xs">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Breadcrumb component for sub-navigation
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link href="/" className="hover:text-white transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Back button component
export function BackButton({ href, label = 'Back' }: { href?: string; label?: string }) {
  const defaultHref = href || typeof window !== 'undefined' ? document.referrer || '/' : '/'
  
  return (
    <Link href={defaultHref}>
      <Button variant="outline" className="border-gray-500 text-gray-300 hover:bg-gray-700">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  )
}