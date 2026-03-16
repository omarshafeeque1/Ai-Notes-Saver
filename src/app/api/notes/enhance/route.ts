import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert editor. Enhance the following note to be more professional, structured, and clear. Maintain the original meaning but improve vocabulary and formatting (use markdown). If the note is short, expand it intelligently. If it is long, structure it with bullet points.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      model: 'llama-3.3-70b-versatile',
    })

    const enhancedContent = completion.choices[0]?.message?.content || content

    return NextResponse.json({ enhancedContent })
  } catch (error: any) {
    console.error('Groq AI Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
