import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, messages } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('Sending request to Z-AI SDK...')

    // Initialize Z-AI SDK
    const zai = await ZAI.create()

    // Generate completion using Z-AI SDK
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are AGRO-TWIN, an advanced agricultural AI assistant. Provide helpful, accurate, and concise information about crop diseases, treatments, and agricultural best practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    console.log('Z-AI SDK response received')

    // Extract the message content from the completion
    const messageContent = completion.choices[0]?.message?.content || 
                         'I apologize, but I encountered an error while generating a response.'

    console.log('Generated response:', messageContent)

    return NextResponse.json({
      response: messageContent,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Provide a more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { error: `Failed to generate response: ${errorMessage}` },
      { status: 500 }
    )
  }
}