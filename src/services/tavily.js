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
  const lines = ['CURRENT WEB SEARCH RESULTS (use these to give a detailed, up-to-date answer):']
  lines.push('')

  if (searchData.answer) {
    lines.push(`Summary: ${searchData.answer}`)
    lines.push('')
  }

  searchData.results?.forEach((r, i) => {
    lines.push(`Source ${i + 1}: ${r.title}`)
    lines.push(`Link: ${r.url}`)
    lines.push(`Content: ${r.content}`)
    lines.push('')
  })

  lines.push('INSTRUCTIONS: Write a detailed, comprehensive answer using the above search results. At the very end, add a "## Sources" section listing the source titles and links. Do not use [1] [2] number citations inline.')

  return lines.join('\n')
}
