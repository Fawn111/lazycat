export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { query } = req.body || {}
    if (!query) return res.status(400).json({ error: 'query required' })

    const TAVILY_KEY = process.env.TAVILY_API_KEY
    if (!TAVILY_KEY) return res.status(500).json({ error: 'TAVILY_API_KEY not set' })

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_KEY,
        query,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(500).json({ error: err?.message || 'Search failed' })
    }

    const data = await response.json()

    // Return clean results
    const results = (data.results || []).map(r => ({
      title: r.title,
      url: r.url,
      content: r.content?.slice(0, 400),
    }))

    res.json({
      answer: data.answer || null,
      results,
    })
  } catch (err) {
    console.error('[/api/search]', err.message)
    res.status(500).json({ error: err.message })
  }
}
