import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

interface GenerateRequest {
  fieldName: string
  currentValue?: string
  context: Record<string, unknown>
  instruction?: string
  hint?: string
}

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })

  // Verify the request comes from an authenticated admin user
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' }) as any

  const apiKey = settings.openrouterApiKey
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenRouter API key not configured. Go to Site Settings → APIs.' },
      { status: 400 },
    )
  }

  const model = settings.openrouterModel || 'anthropic/claude-3.5-haiku'
  const temperature = settings.openrouterTemperature ?? 0.7
  const maxTokens = settings.openrouterMaxTokens ?? 500

  const body: GenerateRequest = await request.json()
  const { fieldName, currentValue, context, instruction, hint } = body

  const contextSummary = Object.entries(context)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join('\n')

  const systemPrompt = settings.openrouterSystemPrompt
    || 'You write text for a portfolio website. English only. Write like a human: plain, direct, no filler. Return ONLY the text, no quotes or labels. The context fields below are for reference only. Do not repeat or rephrase them.'


  const fieldDesc = hint || fieldName

  let userPrompt: string
  if (instruction) {
    userPrompt = `Write the "${fieldName}" field: ${fieldDesc}\n\nOther fields for context (do NOT repeat these):\n${contextSummary}\n\nAdditional instruction: ${instruction}`
  } else if (currentValue) {
    userPrompt = `Rewrite the "${fieldName}" field: ${fieldDesc}\n\nCurrent text to improve:\n${currentValue}\n\nOther fields for context (do NOT repeat these):\n${contextSummary}`
  } else {
    userPrompt = `Write the "${fieldName}" field: ${fieldDesc}\n\nOther fields for context (do NOT repeat these):\n${contextSummary}`
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': settings.siteName || 'MFRH Portfolio',
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json(
      { error: `OpenRouter error: ${res.status} — ${err}` },
      { status: 502 },
    )
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim() || ''

  return NextResponse.json({ text })
}
