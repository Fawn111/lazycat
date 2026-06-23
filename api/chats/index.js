import { connectDB, Chat } from '../_db.js'

function cors(res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

// GET  /api/chats?email=xxx   — list chats
// POST /api/chats?email=xxx   — create chat
export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { email } = req.query
  if (!email) return res.status(400).json({ error: 'email required' })

  await connectDB()

  if (req.method === 'GET') {
    const chats = await Chat.find({ userEmail: email })
      .select('-messages')
      .sort({ updatedAt: -1 })
    return res.json(chats)
  }

  if (req.method === 'POST') {
    const chat = await Chat.create({
      userEmail: email,
      title: req.body?.title || 'New chat',
    })
    return res.status(201).json(chat)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
