import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let cached = global._mg ?? (global._mg = { conn: null, promise: null })

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
  userEmail: { type: String, required: true },
  title: { type: String, default: 'New chat' },
  starred: { type: Boolean, default: false },
  messages: [{ role: String, content: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}))

function cors(res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  try {
    if (!MONGODB_URI) return res.status(500).json({ error: 'MONGODB_URI env var missing' })
    await connectDB()
    const { email } = req.query
    if (!email) return res.status(400).json({ error: 'email required' })
    if (req.method === 'GET') {
      const chats = await Chat.find({ userEmail: email }).select('-messages').sort({ updatedAt: -1 })
      return res.json(chats)
    }
    if (req.method === 'POST') {
      const chat = await Chat.create({ userEmail: email, title: req.body?.title || 'New chat' })
      return res.status(201).json(chat)
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[chats/index]', err.message)
    res.status(500).json({ error: err.message })
  }
}
