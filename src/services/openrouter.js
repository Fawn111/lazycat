const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const MODEL = 'meta-llama/llama-3.1-8b-instruct'

export async function sendMessage(messages, onChunk, signal) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Lazy Chat',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue
        try {
          const json = JSON.parse(trimmed.slice(6))
          const delta = json.choices?.[0]?.delta?.content
          if (delta) onChunk(delta)
        } catch { /* skip malformed */ }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') return // stopped by user — not an error
    throw err
  } finally {
    reader.cancel()
  }
}

// Generate a smart short title from conversation
export async function generateTitle(messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Lazy Chat',
    },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      max_tokens: 12,
      messages: [
        ...messages,
        {
          role: 'user',
          content: 'Give this conversation a short title of 3-5 words. Reply with ONLY the title, no punctuation, no quotes.',
        },
      ],
    }),
  })
  if (!response.ok) return null
  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() ?? null
}
