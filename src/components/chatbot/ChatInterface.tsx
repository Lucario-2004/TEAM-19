'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Brain, Zap, Loader2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface Question {
  id: string
  text: string
  weight: number
  category: string
}

interface ScanData {
  position: { x: number; z: number }
  status: 'HEALTHY' | 'DEFECTIVE'
  cropType: string
  disease: string
  imageUrl?: string
}

interface ChatInterfaceProps {
  scanData: ScanData | null
}

export default function ChatInterface({ scanData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize questions with regression learning weights
  useEffect(() => {
    const defaultQuestions: Question[] = [
      { id: '1', text: 'What is the problem with this crop?', weight: 0.9, category: 'Core Questions' },
      { id: '2', text: 'Is this a serious problem?', weight: 0.8, category: 'Core Questions' },
      { id: '3', text: 'What pesticide should I use?', weight: 0.7, category: 'Pesticide Selection' },
      { id: '4', text: 'Is there an organic alternative?', weight: 0.6, category: 'Pesticide Selection' },
      { id: '5', text: 'What is the correct dosage per acre?', weight: 0.5, category: 'Dosage (Regression Model)' },
      { id: '6', text: 'Will using more damage the crop?', weight: 0.5, category: 'Dosage (Regression Model)' },
      { id: '7', text: 'When is the best time to spray?', weight: 0.5, category: 'Application Method' },
      { id: '8', text: 'Should I spray leaves or soil?', weight: 0.5, category: 'Application Method' },
    ]

    // Load questions from localStorage or use defaults
    const savedQuestions = localStorage.getItem('agrotwin-questions')
    if (savedQuestions) {
      try {
        setQuestions(JSON.parse(savedQuestions))
      } catch {
        setQuestions(defaultQuestions)
      }
    } else {
      setQuestions(defaultQuestions)
    }

    // Send welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: `Hello! I'm AGRO-TWIN, your AI agricultural expert. I'm here to help you with your ${scanData?.cropType || 'crop'} that has been diagnosed with ${scanData?.disease || 'a condition'}. How can I assist you today?`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [scanData])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle quick question buttons
  useEffect(() => {
    const handleQuickQuestion = (event: CustomEvent) => {
      setInputValue(event.detail)
      handleSend()
    }

    window.addEventListener('quick-question', handleQuickQuestion as EventListener)
    return () => window.removeEventListener('quick-question', handleQuickQuestion as EventListener)
  }, [])

  // Save questions to localStorage when they change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('agrotwin-questions', JSON.stringify(questions))
    }
  }, [questions])

  const regressionUpdate = (questionText: string) => {
    // Find and update the question weight using regression learning
    const learningRate = 0.1
    const updatedQuestions = questions.map(q => {
      if (q.text.toLowerCase() === questionText.toLowerCase()) {
        const oldWeight = q.weight
        const newWeight = oldWeight + (learningRate * (1.0 - oldWeight))
        console.log(`[AGENT LEARNING] Updated '${questionText}' weight: ${oldWeight.toFixed(2)} -> ${newWeight.toFixed(2)}`)
        return { ...q, weight: newWeight }
      }
      return q
    })

    // Sort by weight (highest first)
    updatedQuestions.sort((a, b) => b.weight - a.weight)
    setQuestions(updatedQuestions)
  }

  const nlpMatch = (userText: string) => {
    // Simple NLP matching using string similarity
    const bestMatch = questions.reduce((best, question) => {
      const similarity = calculateSimilarity(userText.toLowerCase(), question.text.toLowerCase())
      return similarity > best.similarity ? { question, similarity } : best
    }, { question: null as Question | null, similarity: 0 })

    if (bestMatch.similarity > 0.8 && bestMatch.question) {
      regressionUpdate(bestMatch.question.text)
    }
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  const generateResponse = async (userInput: string): Promise<string> => {
    try {
      // NLP matching for learning
      nlpMatch(userInput)

      // Build system prompt with CAG context
      const systemPrompt = `You are AGRO-TWIN, an advanced agricultural AI agent with CAG (Continuous Augmented Generation) capabilities.

CURRENT CONTEXT:
Crop: ${scanData?.cropType || 'Unknown'}
Condition: ${scanData?.disease || 'Unknown'}
Status: ${scanData?.status || 'Unknown'}

Instructions:
1. Answer specifically for the crop and disease mentioned above.
2. Be concise, empathetic, and scientific in your responses.
3. If the status is HEALTHY, advise on maintenance and prevention.
4. If DISEASED, provide detailed treatment recommendations.
5. Include specific actionable advice when possible.
6. Use markdown formatting for better readability.
7. Keep responses focused and practical.

Recent conversation context:
${messages.slice(-3).map(m => `${m.type === 'user' ? 'Farmer' : 'AGRO-TWIN'}: ${m.content}`).join('\n')}

Farmer: ${userInput}
AGRO-TWIN:`

      // Call the AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: systemPrompt,
          messages: messages.slice(-3) // Include recent context
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Error generating response:', error)
      
      // Fallback responses based on context
      const fallbackResponses = {
        'treatment': `Based on the ${scanData?.disease || 'condition'} affecting your ${scanData?.cropType || 'crop'}, I recommend:

1. **Immediate Action**: Apply appropriate fungicide or treatment as soon as possible
2. **Prevention**: Remove affected plant material to prevent spread
3. **Monitoring**: Check nearby crops regularly for early signs
4. **Cultural Practices**: Improve air circulation and avoid overhead watering

Would you like more specific recommendations for treatment products or application methods?`,
        
        'prevention': `To prevent ${scanData?.disease || 'disease issues'} in your ${scanData?.cropType || 'crops'}:

**Preventive Measures:**
- Crop rotation with non-host plants
- Use disease-resistant varieties when available
- Maintain proper spacing between plants
- Ensure good drainage and avoid waterlogged conditions
- Monitor regularly for early symptoms
- Remove and destroy infected plant material

**Cultural Practices:**
- Balanced fertilization
- Proper irrigation management
- Weed control to reduce disease pressure

Is there a specific aspect of prevention you'd like to explore further?`,
        
        'general': `I understand you're asking about your ${scanData?.cropType || 'crop'} with ${scanData?.disease || 'a condition'}. 

**Key Considerations:**
- Early detection and treatment are crucial
- Follow integrated pest management principles
- Consider both chemical and organic control options
- Document the issue for future reference

I apologize, but I'm experiencing technical difficulties. Please try your question again, or feel free to ask about specific aspects of crop management, treatment options, or preventive measures.`
      }

      // Determine which fallback to use based on user input
      const input = userInput.toLowerCase()
      if (input.includes('treat') || input.includes('cure') || input.includes('medicine') || input.includes('pesticide')) {
        return fallbackResponses.treatment
      } else if (input.includes('prevent') || input.includes('avoid') || input.includes('stop')) {
        return fallbackResponses.prevention
      } else {
        return fallbackResponses.general
      }
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await generateResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionClick = (question: Question) => {
    setInputValue(question.text)
    regressionUpdate(question.text)
    handleSend()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Group questions by category
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, Question[]>)

  return (
    <div className="flex h-full">
      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'ml-2 bg-blue-500' : 'mr-2 bg-green-500'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <Card className={`${
                    message.type === 'user' 
                      ? 'bg-blue-600 border-blue-500' 
                      : 'bg-gray-700 border-gray-600'
                  }`}>
                    <CardContent className="p-3">
                      <p className="text-sm text-white whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-green-500">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <p className="text-sm text-white">Thinking...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crop treatment, prevention, or management..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-green-500 hover:bg-green-600 self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Questions Sidebar */}
      <div className="w-80 border-l border-gray-700 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Recommended Questions
          </h3>
          <p className="text-xs text-gray-400">
            Questions adapt based on your interactions (Regression Learning)
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                {category}
              </h4>
              <div className="space-y-2">
                {categoryQuestions.map((question) => (
                  <Button
                    key={question.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2 border-gray-600 hover:border-green-500 hover:bg-green-500/10"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="text-xs text-white">{question.text}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-16 bg-gray-600 rounded-full h-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${question.weight * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.round(question.weight * 100)}%
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">Learning Status</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">CAG Context:</span>
              <Badge className="bg-green-500 text-xs">Active</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Regression Model:</span>
              <Badge className="bg-blue-500 text-xs">Learning</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">NLP Processing:</span>
              <Badge className="bg-purple-500 text-xs">Enabled</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}