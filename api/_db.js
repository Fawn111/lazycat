import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let cached = global._mongoose
if (!cached) cached = global._mongoose = { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const chatSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  title: { type: String, default: 'New chat' },
  starred: { type: Boolean, default: false },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
