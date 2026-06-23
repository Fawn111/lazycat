import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null })

async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

const Chat = mongoose.models.Chat || mongoose.model('Chat', new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  title: { type: String, default: 'New chat' },
  starred: { type: Boolean, default: false },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}))

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
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ error: 'MONGODB_URI not set' })
    }

    await connectDB()

    const { chatId, email } = req.query
    if (!email) return res.status(400).json({ error: 'email required' })

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
    console.error('[/api/chats/[chatId]]', err.message)
    res.status(500).json({ error: err.message })
  }
}
