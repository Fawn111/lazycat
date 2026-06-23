const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

const MODEL = 'google/gemma-3-12b-it'

const SYSTEM_PROMPT = {
  role: 'system',
  content: `
You are Lazy Chat, a helpful AI assistant.

Rules:
- Give simple and direct answers.
- Keep responses concise.
- Avoid unnecessary explanations.
- Use short paragraphs.
- If asked for code, provide complete working code.
- If you don't know something, say so.
- Answer naturally like ChatGPT.
- When web search results are provided, use them to give accurate, up-to-date answers and cite sources.
`,
}

export async function sendMessage(messages, onChunk, signal, searchContext = null) {
  const recentMessages = messages.slice(-10)

  // If we have search results, inject them as a system message before the last user message
  let finalMessages = [...recentMessages]
  if (searchContext) {
    const lastUserIdx = [...finalMessages].reverse().findIndex(m => m.role === 'user')
    if (lastUserIdx >= 0) {
      const insertAt = finalMessages.length - 1 - lastUserIdx
      finalMessages.splice(insertAt, 0, {
        role: 'system',
        content: searchContext,
      })
    }
  }

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      signal,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Lazy Chat',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 600,
        stream: true,
        messages: [SYSTEM_PROMPT, ...finalMessages],
      }),
    }
  )

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
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()

        if (!trimmed) continue
        if (trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue

        try {
          const json = JSON.parse(trimmed.slice(6))
          const delta = json?.choices?.[0]?.delta?.content

          if (delta) {
            onChunk(delta)
          }
        } catch {
          // Ignore malformed chunks
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') return
    throw err
  } finally {
    reader.cancel()
  }
}

export async function generateTitle(messages) {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Lazy Chat',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.1,
        max_tokens: 12,
        stream: false,
        messages: [
          {
            role: 'system',
            content:
              'Generate a short chat title. Reply ONLY with the title.',
          },
          ...messages.slice(-5),
          {
            role: 'user',
            content:
              'Give this conversation a short title of 3-5 words. Reply ONLY with the title.',
          },
        ],
      }),
    }
  )

  if (!response.ok) {
    return 'New Chat'
  }

  const data = await response.json()

  return (
    data?.choices?.[0]?.message?.content?.trim() ||
    'New Chat'
  )
}