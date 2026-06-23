const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

// Keywords that indicate the user wants current/real-time info
const SEARCH_TRIGGERS = [
  'today', 'now', 'current', 'latest', 'recent', 'news',
  'price', 'weather', 'score', 'live', 'right now',
  'this week', 'this month', 'this year', '2024', '2025', '2026',
  'who won', 'what happened', 'trending', 'stock', 'crypto',
  'bitcoin', 'ethereum', 'breaking', 'update', 'release',
]

export function needsWebSearch(query) {
  const lower = query.toLowerCase()
  return SEARCH_TRIGGERS.some(trigger => lower.includes(trigger))
}

export async function webSearch(query) {
  const res = await fetch(`${BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export function formatSearchContext(searchData) {
  const lines = ['[Web Search Results]']

  if (searchData.answer) {
    lines.push(`Quick answer: ${searchData.answer}`)
    lines.push('')
  }

  searchData.results?.forEach((r, i) => {
    lines.push(`[${i + 1}] ${r.title}`)
    lines.push(`URL: ${r.url}`)
    lines.push(r.content)
    lines.push('')
  })

  lines.push('[End of search results]')
  lines.push('Use the above search results to answer the user\'s question. Cite sources where relevant.')

  return lines.join('\n')
}
