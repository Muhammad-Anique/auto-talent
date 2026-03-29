// app/api/email-hr/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, jobDescription } = body

    const prompt = `Write a polite and professional follow-up email to HR after applying for a job titled "${title}".
The job description is: "${jobDescription}".
Make the email show genuine interest and ask for a response.
Write the email in the same language as the job description.`

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional email writer who crafts formal, polite, and enthusiastic follow-up emails to HR.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || 'OpenAI API request failed' },
        { status: openaiRes.status }
      )
    }

    const openaiData = await openaiRes.json()
    const content = openaiData.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No content from OpenAI.' }, { status: 500 })
    }

    const subject = `Follow-up on "${title}" Application`

    return NextResponse.json({ content, subject })
  } catch (error) {
    console.error('Email HR API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    )
  }
}
