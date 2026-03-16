import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  try {
    const { action, content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    let systemPrompt = 'You are a helpful AI writing assistant.'

    switch (action) {
      case 'summarize':
        systemPrompt = 'Summarize the following text concisely. Keep the core message intact.'
        break
      case 'expand':
        systemPrompt = 'Expand the following text with more details, examples, and depth. Maintain the original tone.'
        break
      case 'simplify':
        systemPrompt = 'Simplify the following text so it is easy to understand for a general audience. Avoid jargon.'
        break
      case 'fix_grammar':
        systemPrompt = 'Correct any grammar, spelling, and punctuation errors in the following text. Do not change the meaning or style unnecessarily.'
        break
      case 'convert_to_bullets':
        systemPrompt = 'Convert the following text into a clear, concise bulleted list.'
        break
      case 'generate_title':
        systemPrompt = 'Generate a short, catchy, and highly relevant title for the following text. Return ONLY the title line (no quotes, no prefix).'
        break
      case 'explain':
        systemPrompt = 'Explain the following text simply and clearly as if I am learning about it for the first time.'
        break
      case 'rewrite':
        systemPrompt = 'Rewrite the following text to sound more professional, clear, and engaging.'
        break
      case 'idea':
        systemPrompt = 'Generate 3 creative ideas or follow-up thoughts based on the following text.'
        break
      case 'todo':
        systemPrompt = 'Extract actionable to-do items from the following text and format them as a checklist.'
        break
      case 'enhance':
        systemPrompt = 'You are an expert editor. Enhance the following note to be more professional, structured, and clear. Maintain the original meaning but improve vocabulary and formatting (use markdown). If the note is short, expand it.'
        break
      default:
        systemPrompt = 'You are a helpful AI writing assistant.'
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content }
      ],
      model: 'llama-3.3-70b-versatile',
    })

    const result = completion.choices[0]?.message?.content || content

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error('Groq AI Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
