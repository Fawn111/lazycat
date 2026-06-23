const mongoose = require('mongoose')

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

chatSchema.index({ userEmail: 1, updatedAt: -1 })

module.exports = mongoose.model('Chat', chatSchema)
