import { connectDB, Chat } from '../_db.js'

function cors(res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const { chatId, email } = req.query
    if (!email) return res.status(400).json({ error: 'email required' })

    await connectDB()

    if (req.method === 'GET') {
      const chat = await Chat.findOne({ _id: chatId, userEmail: email })
      if (!chat) return res.status(404).json({ error: 'Not found' })
      return res.json(chat)
    }

    if (req.method === 'PATCH') {
      const update = {}
      if (req.body?.title !== undefined) update.title = req.body.title
      if (req.body?.starred !== undefined) update.starred = req.body.starred
      update.updatedAt = new Date()
      const chat = await Chat.findOneAndUpdate(
        { _id: chatId, userEmail: email },
        { $set: update },
        { new: true }
      ).select('-messages')
      if (!chat) return res.status(404).json({ error: 'Not found' })
      return res.json(chat)
    }

    if (req.method === 'DELETE') {
      await Chat.findOneAndDelete({ _id: chatId, userEmail: email })
      return res.json({ success: true })
    }

    // POST — append messages
    if (req.method === 'POST') {
      const { messages } = req.body || {}
      if (!messages?.length) return res.status(400).json({ error: 'messages required' })
      const chat = await Chat.findOneAndUpdate(
        { _id: chatId, userEmail: email },
        {
          $push: { messages: { $each: messages } },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      ).select('-messages')
      if (!chat) return res.status(404).json({ error: 'Not found' })
      return res.json(chat)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[/api/chats/[chatId]]', err)
    res.status(500).json({ error: err.message })
  }
}
